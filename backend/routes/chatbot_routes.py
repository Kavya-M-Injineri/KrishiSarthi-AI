from flask import Blueprint, request, jsonify
import requests
import os
import json
from datetime import datetime
from openai import OpenAI

client = OpenAI(api_key="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")

chatbot_bp = Blueprint("chatbot", __name__)

# In-memory conversation storage
USER_SESSIONS = {}

def add_message(session_id, role, content):
    if session_id not in USER_SESSIONS:
        USER_SESSIONS[session_id] = []
    USER_SESSIONS[session_id].append({"role": role, "content": content})
    USER_SESSIONS[session_id] = USER_SESSIONS[session_id][-20:]
    
# Intent detection prompt
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
        r = requests.get(f"http://localhost:5000/weather?location={location}")
        return r.json()
    except:
        return None


# -------------------------
# MARKET FETCHER
# -------------------------
def fetch_market(commodity, farmer_id):
    try:
        r = requests.get(f"http://localhost:5000/market?commodity={commodity}&farmer_id={farmer_id}")
        return r.json()
    except:
        return None


# -------------------------
# MAIN CHATBOT ROUTE
# -------------------------
@chatbot_bp.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "")
    farmer_id = data.get("farmer_id", None)
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "Message missing"}), 400

    # Detect user intent
    intent_info = detect_intent(user_message)
    intent = intent_info.get("intent", "general")

    tool_result = ""

    # WEATHER
    if intent == "weather":
        loc = intent_info.get("location", "")
        if loc:
            w = fetch_weather(loc)
            tool_result = f"Weather data for {loc}: {w}"

    # MARKET
    elif intent == "market":
        commodity = intent_info.get("commodity", "")
        if commodity:
            m = fetch_market(commodity, farmer_id or "")
            tool_result = f"Market data for {commodity}: {m}"

    # Build messages for OpenAI
    messages = [
        {
            "role": "system",
            "content": """
You are KrishiSarthi AI, a friendly agricultural support assistant.
Use tool results to give correct answers.
Do NOT show raw JSON. Convert info to simple farmer-friendly text.
"""
        }
    ]

    # Add memory
    if session_id in USER_SESSIONS:
        messages.extend(USER_SESSIONS[session_id])

    # Add current user message
    messages.append({"role": "user", "content": user_message})

    # Add tool result if exists
    if tool_result:
        messages.append({"role": "system", "content": f"TOOL_RESULT:\n{tool_result}"})


    # Call OpenAI
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    ai_reply = completion.choices[0].message.content

    # Save conversation memory
    add_message(session_id, "user", user_message)
    add_message(session_id, "assistant", ai_reply)

    return jsonify({
        "reply": ai_reply,
        "session_id": session_id
    })