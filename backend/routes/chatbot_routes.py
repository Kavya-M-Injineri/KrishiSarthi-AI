from flask import Blueprint, request, jsonify
import os
import json
import requests
from openai import OpenAI

# -------------------------
# Blueprint
# -------------------------
chatbot_bp = Blueprint("chatbot", __name__)

# -------------------------
# OpenAI Client (SECURE)
# -------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=OPENAI_API_KEY)

# -------------------------
# In-memory conversation storage
# -------------------------
USER_SESSIONS = {}

def add_message(session_id, role, content):
    if session_id not in USER_SESSIONS:
        USER_SESSIONS[session_id] = []
    USER_SESSIONS[session_id].append({"role": role, "content": content})
    USER_SESSIONS[session_id] = USER_SESSIONS[session_id][-20:]

# -------------------------
# Intent Detection Prompt
# -------------------------
INTENT_SYSTEM = """
You are KrishiSarthi AI — an agricultural expert assistant.

Your job:
1. Detect the user's intent.
2. If they ask about WEATHER → return intent="weather"
3. If they ask about MARKET PRICES or MANDI → intent="market"
4. Otherwise → intent="general"

Return ONLY JSON:
{
  "intent": "...",
  "commodity": "...",
  "location": "..."
}
"""

# -------------------------
# Intent Detection
# -------------------------
def detect_intent(message):
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": INTENT_SYSTEM},
                {"role": "user", "content": message}
            ]
        )

        content = completion.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        print("Intent detection error:", e)
        return {"intent": "general"}

# -------------------------
# WEATHER FETCHER
# -------------------------
def fetch_weather(location):
    try:
        r = requests.get(
            "http://localhost:5000/weather",
            params={"location": location},
            timeout=5
        )
        return r.json()
    except Exception as e:
        print("Weather fetch error:", e)
        return None

# -------------------------
# MARKET FETCHER
# -------------------------
def fetch_market(commodity, farmer_id):
    try:
        r = requests.get(
            "http://localhost:5000/market",
            params={
                "commodity": commodity,
                "farmer_id": farmer_id
            },
            timeout=5
        )
        return r.json()
    except Exception as e:
        print("Market fetch error:", e)
        return None

# -------------------------
# MAIN CHATBOT ROUTE
# -------------------------
@chatbot_bp.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json or {}

    user_message = data.get("message", "")
    farmer_id = data.get("farmer_id", "")
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "Message missing"}), 400

    # Detect intent
    intent_info = detect_intent(user_message)
    intent = intent_info.get("intent", "general")

    tool_result = ""

    # WEATHER
    if intent == "weather":
        location = intent_info.get("location", "")
        if location:
            weather = fetch_weather(location)
            tool_result = f"Weather data for {location}: {weather}"

    # MARKET
    elif intent == "market":
        commodity = intent_info.get("commodity", "")
        if commodity:
            market = fetch_market(commodity, farmer_id)
            tool_result = f"Market data for {commodity}: {market}"

    # Build OpenAI messages
    messages = [
        {
            "role": "system",
            "content": (
                "You are KrishiSarthi AI, a friendly agricultural support assistant. "
                "Use tool results to give correct answers. "
                "Do NOT show raw JSON. Explain in simple farmer-friendly language."
            )
        }
    ]

    # Add memory
    if session_id in USER_SESSIONS:
        messages.extend(USER_SESSIONS[session_id])

    # Add user message
    messages.append({"role": "user", "content": user_message})

    # Add tool result
    if tool_result:
        messages.append({
            "role": "system",
            "content": f"TOOL_RESULT:\n{tool_result}"
        })

    # OpenAI response
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    ai_reply = completion.choices[0].message.content

    # Save memory
    add_message(session_id, "user", user_message)
    add_message(session_id, "assistant", ai_reply)

    return jsonify({
        "reply": ai_reply,
        "session_id": session_id
    })
