from flask import Blueprint, request, jsonify
import requests
from difflib import get_close_matches
from datetime import datetime
from collections import defaultdict
from functools import lru_cache
import os

from db.config import get_db   # fetch farmer location

market_bp = Blueprint("market", __name__)

# ----------------------------------------------------
# CONFIG
# ----------------------------------------------------
API_KEY = os.getenv("DATA_GOV_API_KEY")
if not API_KEY:
    raise RuntimeError("DATA_GOV_API_KEY not found in enviroment variables")
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"


# ----------------------------------------------------
# FETCH + CACHE RAW RECORDS
# ----------------------------------------------------
@lru_cache(maxsize=1)
def fetch_raw_records(limit=1200):
    url = f"{BASE_URL}?api-key={API_KEY}&format=json&limit={limit}"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        return data.get("records", [])
    except Exception:
        return []


# ----------------------------------------------------
# FETCH FARMER LOCATION FROM DB
# ----------------------------------------------------
def get_farmer_location(farmer_id):
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)
        cur.execute(
            "SELECT state, district FROM farmers WHERE id=%s",
            (farmer_id,)
        )
        return cur.fetchone()
    except Exception:
        return None


# ----------------------------------------------------
# META ENDPOINT (FOR UI DROPDOWNS)
# ----------------------------------------------------
@market_bp.route("/market/meta", methods=["GET"])
def get_market_metadata():
    records = fetch_raw_records()

    states = sorted({r.get("state", "").strip() for r in records if r.get("state")})
    commodities = sorted({r.get("commodity", "").strip() for r in records if r.get("commodity")})

    districts_by_state = defaultdict(set)
    markets_by_state = defaultdict(lambda: defaultdict(set))

    for r in records:
        state = r.get("state", "").strip()
        district = r.get("district", "").strip()
        market = r.get("market", "").strip()

        if state and district and market:
            districts_by_state[state].add(district)
            markets_by_state[state][district].add(market)

    districts = {}
    markets = {}

    for state, dist_set in districts_by_state.items():
        key = state.lower()
        districts[key] = sorted(dist_set)
        markets[key] = {
            dist: sorted(mkts)
            for dist, mkts in markets_by_state[state].items()
        }

    return jsonify({
        "states": states,
        "commodities": commodities,
        "districts": districts,
        "markets": markets
    })


# ----------------------------------------------------
# TREND CALCULATION
# ----------------------------------------------------
def compute_trend(prices):
    if len(prices) < 2:
        return "stable", 0

    old, new = prices[-2], prices[-1]
    if old == 0:
        return "stable", 0

    change = ((new - old) / old) * 100

    if change > 2:
        return "up", round(change, 2)
    elif change < -2:
        return "down", round(change, 2)
    else:
        return "stable", round(change, 2)


# ----------------------------------------------------
# MAIN MARKET SEARCH
# ----------------------------------------------------
@market_bp.route("/market", methods=["GET"])
def get_market_data():
    commodity = request.args.get("commodity", "").strip()
    passed_state = request.args.get("state", "").strip()
    passed_district = request.args.get("district", "").strip()
    farmer_id = request.args.get("farmer_id")

    if not commodity:
        return jsonify({"error": "commodity is required"}), 400

    # Auto-location
    auto_state = auto_district = ""
    if farmer_id:
        loc = get_farmer_location(farmer_id)
        if loc:
            auto_state = loc.get("state", "")
            auto_district = loc.get("district", "")

    state = passed_state or auto_state
    district = passed_district or auto_district

    if not state:
        return jsonify({"error": "State not provided"}), 400

    records = fetch_raw_records()
    if not records:
        return jsonify({"error": "No mandi data available"}), 502

    # Filter by state
    state_records = [
        r for r in records
        if r.get("state", "").lower() == state.lower()
    ]

    if not state_records:
        return jsonify({"message": f"No data for state {state}"}), 404

    # Fuzzy commodity match
    all_commodities = sorted({r.get("commodity", "") for r in state_records})
    best_match = get_close_matches(commodity, all_commodities, n=1, cutoff=0.3)

    if not best_match:
        return jsonify({"message": "Commodity not found"}), 404

    commodity_used = best_match[0]

    filtered = [
        r for r in state_records
        if r.get("commodity") == commodity_used
    ]

    # Fuzzy district match
    district_used = None
    if district:
        all_districts = sorted({r.get("district", "") for r in filtered})
        match = get_close_matches(district, all_districts, n=1, cutoff=0.3)
        if match:
            district_used = match[0]
            filtered = [
                r for r in filtered
                if r.get("district") == district_used
            ]

    # Format markets
    markets = []
    for r in filtered:
        try:
            markets.append({
                "market": r.get("market", ""),
                "district": r.get("district", ""),
                "variety": r.get("variety", ""),
                "arrival_date": r.get("arrival_date", ""),
                "min_price": int(r.get("min_price") or 0),
                "max_price": int(r.get("max_price") or 0),
                "modal_price": int(r.get("modal_price") or 0)
            })
        except ValueError:
            continue

    # Sort by date
    markets.sort(
        key=lambda x: datetime.strptime(x["arrival_date"], "%d/%m/%Y")
        if x["arrival_date"] else datetime.min
    )

    modal_prices = [m["modal_price"] for m in markets if m["modal_price"] > 0]
    trend, change_percent = compute_trend(modal_prices)

    return jsonify({
        "commodity": commodity_used,
        "state": state,
        "district": district_used or district,
        "count": len(markets),
        "trend": trend,
        "change_percent": change_percent,
        "markets": markets
    })


# ----------------------------------------------------
# MARKET HISTORY (FOR CHARTS)
# ----------------------------------------------------
@market_bp.route("/market/history", methods=["GET"])
def get_market_history():
    commodity = request.args.get("commodity", "").strip()
    state = request.args.get("state", "").strip()

    if not commodity or not state:
        return jsonify({"error": "commodity and state required"}), 400

    records = fetch_raw_records()

    rows = [
        r for r in records
        if r.get("state", "").lower() == state.lower()
        and r.get("commodity", "").lower() == commodity.lower()
    ]

    if not rows:
        return jsonify({"error": "No history available"}), 404

    series = []
    for r in rows:
        try:
            dt = datetime.strptime(r["arrival_date"], "%d/%m/%Y")
            series.append({
                "date": dt,
                "price": int(r.get("modal_price") or 0)
            })
        except Exception:
            continue

    series.sort(key=lambda x: x["date"])

    formatted = [
        {"date": x["date"].strftime("%d %b"), "price": x["price"]}
        for x in series
    ]

    return jsonify({
        "commodity": commodity,
        "state": state,
        "history": formatted
    })
