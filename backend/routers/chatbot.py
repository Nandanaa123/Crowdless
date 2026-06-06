from fastapi import APIRouter
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

SYSTEM_PROMPT = """You are CrowdLess AI, a friendly assistant for the CrowdLess app — a crowd-aware place discovery app in Dubai.

You help users find quiet places like cafes, parks, gyms, and malls with low crowd levels.

You know about these places in Dubai:
- Brew & Bean Coffee (Downtown Dubai) — cafe
- The Quiet Cup (Business Bay) — cafe  
- Sip & Work (DIFC) — cafe
- Central Park (Jumeirah) — park
- Green Escape Park (Al Barsha) — park
- FitZone Gym (Marina) — gym
- PowerHouse Gym (JLT) — gym
- Mall of the Stars (Sheikh Zayed Road) — mall

You also know Dubai Metro lines (Red Line, Green Line) and bus routes.

Keep responses short, friendly, and helpful. Use emojis occasionally. 
Always recommend quiet places with low crowd scores.
If asked about crowd levels, suggest morning or late afternoon visits.
Never make up places that don't exist in the app."""

@router.post("/message")
async def chat(body: dict):
    try:
        user_message = body.get("message", "")
        history = body.get("history", [])

        chat_history = []
        for msg in history[-6:]:
            if msg["from"] == "user":
                chat_history.append({"role": "user", "parts": [msg["text"]]})
            else:
                chat_history.append({"role": "model", "parts": [msg["text"]]})

        conversation = model.start_chat(history=chat_history)
        full_message = f"{SYSTEM_PROMPT}\n\nUser: {user_message}"
        response = conversation.send_message(full_message)

        return {"reply": response.text}

    except Exception as e:
        return {"reply": "Sorry, I'm having trouble right now. Please try again! 🌿"}