from flask import Blueprint, request, jsonify
import requests
from difflib import get_close_matches
from datetime import datetime
from collections import defaultdict
from db.config import get_db   # fetch farmer location

market_bp = Blueprint("market", __name__)

API_KEY = "579b464db66ec23bdd00000133b7171dbff644fc56fcaf9edfb59f18"
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"


# ----------------------------------------------------
# Fetch raw mandi records
# ----------------------------------------------------
def fetch_raw_records(limit=1200):
    url = f"{BASE_URL}?api-key={API_KEY}&format=json&limit={limit}"
    r = requests.get(url)
    data = r.json()
    return data.get("records", [])


# ----------------------------------------------------
# Auto-fetch farmer state & district
# ----------------------------------------------------
def get_farmer_location(farmer_id):
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT state, district FROM farmers WHERE id=%s", (farmer_id,))
        row = cur.fetchone()
        return row
    except:
        return None


# ----------------------------------------------------
# FIXED: META ENDPOINT (UI-COMPATIBLE)
# ----------------------------------------------------
@market_bp.route("/market/meta", methods=["GET"])
def get_market_metadata():
    records = fetch_raw_records()

    # All states + commodities
    states = sorted({r["state"] for r in records})
    commodities = sorted({r["commodity"] for r in records})

    # Mapping state → districts and state → district → markets
    districts_by_state = defaultdict(set)
    markets_by_state = defaultdict(lambda: defaultdict(set))

    for r in records:
        state = r["state"].strip()
        district = r["district"].strip()
        market = r["market"].strip()

        districts_by_state[state].add(district)
        markets_by_state[state][district].add(market)

    # UI NEEDS:
    # meta.districts[state_lowercase]
    # meta.markets[state_lowercase][district]
    districts = {}
    markets = {}

    for state, dist_set in districts_by_state.items():
        key = state.lower()               # normalize key for UI
        districts[key] = sorted(list(dist_set))

        markets[key] = {}
        for dist, mkts in markets_by_state[state].items():
            markets[key][dist] = sorted(list(mkts))

    return jsonify({
        "states": states,         # UI uses proper-case names for dropdown
        "commodities": commodities,
        "districts": districts,   # UI reads meta.districts[state]
        "markets": markets        # UI reads meta.markets[state][district]
    })


# ----------------------------------------------------
# Trend calculation
# ----------------------------------------------------
def compute_trend(prices):
    if len(prices) < 2:
        return "stable", 0

    old = prices[-2]
    new = prices[-1]

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
# MAIN MARKET SEARCH ENDPOINT
# ----------------------------------------------------
@market_bp.route("/market", methods=["GET"])
def get_market_data():
    commodity = request.args.get("commodity", "").strip()

    passed_state = request.args.get("state", "").strip()
    passed_district = request.args.get("district", "").strip()
    farmer_id = request.args.get("farmer_id")

    if not commodity:
        return jsonify({"error": "commodity is required"}), 400

    # Auto-location logic
    auto_state = auto_district = ""
    if farmer_id:
        loc = get_farmer_location(farmer_id)
        if loc:
            auto_state = loc["state"]
            auto_district = loc["district"]

    state = passed_state or auto_state
    district = passed_district or auto_district

    if not state:
        return jsonify({"error": "State not provided and no farmer location"}), 400

    records = fetch_raw_records()
    if not records:
        return jsonify({"error": "API returned no data"}), 502

    # Filter by state
    state_records = [r for r in records if r["state"].lower() == state.lower()]
    if not state_records:
        return jsonify({"message": f"No mandi data found for state {state}"}), 404

    # Fuzzy commodity match
    all_commodities = sorted({r["commodity"] for r in state_records})
    best_match = get_close_matches(commodity, all_commodities, n=1, cutoff=0.28)
    if not best_match:
        return jsonify({"message": f"No commodity similar to '{commodity}'"}), 404

    commodity_used = best_match[0]
    filtered = [r for r in state_records if r["commodity"] == commodity_used]

    # Fuzzy district match
    district_used = None
    if district:
        all_dist = sorted({r["district"] for r in filtered})
        match = get_close_matches(district, all_dist, n=1, cutoff=0.3)
        if match:
            district_used = match[0]
            filtered = [r for r in filtered if r["district"] == district_used]

    # Format output
    markets = []
    for r in filtered:
        markets.append({
            "market": r["market"],
            "district": r["district"],
            "variety": r["variety"],
            "arrival_date": r["arrival_date"],
            "min_price": int(r["min_price"] or 0),
            "max_price": int(r["max_price"] or 0),
            "modal_price": int(r["modal_price"] or 0)
        })

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
# MARKET HISTORY (Time-series for charts)
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
        if r["state"].lower() == state.lower()
        and r["commodity"].lower() == commodity.lower()
    ]

    if not rows:
        return jsonify({"error": "No history available"}), 404

    series = []
    for r in rows:
        try:
            dt = datetime.strptime(r["arrival_date"], "%d/%m/%Y")
        except:
            continue

        series.append({
            "date": dt.strftime("%d %b"),
            "price": int(r["modal_price"] or 0)
        })

    # Sort chronologically
    series.sort(key=lambda x: datetime.strptime(x["date"], "%d %b"))

    return jsonify({
        "commodity": commodity,
        "history": series
    })