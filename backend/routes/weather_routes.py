from flask import Blueprint, request, jsonify
import requests

weather_bp = Blueprint("weather", __name__)

# --------------------------------------------------------
# 1. GET LAT/LON using Open-Meteo Geocoding API
# --------------------------------------------------------
def get_lat_lon(location: str):
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json"
        response = requests.get(url, timeout=5).json()

        if "results" not in response or len(response["results"]) == 0:
            return None, None

        result = response["results"][0]
        return result["latitude"], result["longitude"]
    except:
        return None, None


# --------------------------------------------------------
# 2. CLIMATE ALERT ENGINE
# --------------------------------------------------------
def generate_climate_alerts(forecast):
    alerts = []

    for day in forecast:
        temp = day["max_temp"]
        rain = day["rain_prob"]

        # HEATWAVE
        if temp >= 40:
            alerts.append({
                "type": "heat",
                "severity": "high",
                "title": "Severe Heatwave Warning",
                "description": f"Temperature rising above {temp}°C. Provide shade and water."
            })
        elif temp >= 35:
            alerts.append({
                "type": "heat",
                "severity": "medium",
                "title": "Heatwave Alert",
                "description": f"Hot conditions expected ({temp}°C). Irrigate crops early morning."
            })

        # FLOOD / HEAVY RAIN
        if rain >= 70:
            alerts.append({
                "type": "flood",
                "severity": "high",
                "title": "Heavy Rainfall Warning",
                "description": f"Rain probability {rain}%. Flooding likely."
            })
        elif rain >= 40:
            alerts.append({
                "type": "flood",
                "severity": "medium",
                "title": "Moderate Rainfall Alert",
                "description": f"Rain probability {rain}%. Ensure drainage."
            })

        # DROUGHT
        if rain <= 10:
            alerts.append({
                "type": "drought",
                "severity": "low",
                "title": "Dry Spell Warning",
                "description": "Very low rainfall expected. Mulching recommended."
            })

    return alerts


# --------------------------------------------------------
# 3. WEEKLY FARMING RECOMMENDATIONS
# --------------------------------------------------------
def generate_recommendations(alerts):
    tips = []

    for a in alerts:
        if a["type"] == "heat":
            tips.append("Irrigate during early morning or late evening to reduce evaporation.")
            tips.append("Use shade nets for vegetables during peak sunlight.")

        if a["type"] == "flood":
            tips.append("Ensure proper field drainage to prevent root rot.")
            tips.append("Harvest ripe crops early to avoid flood losses.")

        if a["type"] == "drought":
            tips.append("Use drip irrigation to reduce water loss.")
            tips.append("Mulching helps retain soil moisture.")

    return list(set(tips))  # remove duplicates


# --------------------------------------------------------
# 4. MAIN WEATHER ROUTE
# --------------------------------------------------------
@weather_bp.route("/weather", methods=["GET"])
def get_weather():
    location = request.args.get("location")

    if not location:
        return jsonify({"error": "Location is required"}), 400

    # Step 1 — Convert location ➜ latitude/longitude
    lat, lon = get_lat_lon(location)
    if lat is None:
        return jsonify({"error": "Location not found"}), 404

    # Step 2 — Fetch weekly weather from Open Meteo
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean"
        f"&timezone=auto"
    )

    try:
        api_data = requests.get(url, timeout=5).json()
    except:
        return jsonify({"error": "Weather API unreachable"}), 500

    # Protect against missing keys
    daily = api_data.get("daily", {})
    dates = daily.get("time", [])
    max_temps = daily.get("temperature_2m_max", [])
    min_temps = daily.get("temperature_2m_min", [])
    rain_probs = daily.get("precipitation_probability_mean", [])

    forecast = []

    # Build weekly forecast safely
    for i in range(min(len(dates), 7)):
        forecast.append({
            "date": dates[i],
            "max_temp": max_temps[i],
            "min_temp": min_temps[i],
            "rain_prob": rain_probs[i]
        })

    # Force at least some data
    if len(forecast) == 0:
        return jsonify({
            "location": location,
            "forecast": [],
            "alerts": [],
            "recommendations": [],
            "note": "Weather API did not return data"
        })

    # Step 3 — Create alerts
    alerts = generate_climate_alerts(forecast)

    # Step 4 — Generate actionable tips
    recommendations = generate_recommendations(alerts)

    return jsonify({
        "location": location,
        "latitude": lat,
        "longitude": lon,
        "forecast": forecast,
        "alerts": alerts,
        "recommendations": recommendations
    })