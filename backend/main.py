from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import places, ai_summary, weather, transport
from routers import auth
from database import create_tables

app = FastAPI(title="CrowdLess API")

create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://crowdless-puk.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(places.router, prefix="/api/places", tags=["places"])
app.include_router(ai_summary.router, prefix="/api/summary", tags=["summary"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(transport.router, prefix="/api/transport", tags=["transport"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.post("/api/chatbot/message")
async def chat(body: dict):
    user_message = body.get("message", "")
    try:
        import google.generativeai as genai
        from dotenv import load_dotenv
        import os
        load_dotenv()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash-lite")
        if not user_message:
            return {"reply": "Hi! Ask me anything about quiet places in Dubai! 🌿"}
        response = model.generate_content(f"You are CrowdLess AI, a helpful assistant for finding quiet places in Dubai. Answer helpfully and briefly in 2-3 sentences max. User says: {user_message}")
        return {"reply": response.text}
    except Exception:
        msg = user_message.lower()
        if any(w in msg for w in ["quiet", "empty", "less crowd", "peaceful"]):
            return {"reply": "🌿 Sip & Work (DIFC) and The Quiet Cup (Business Bay) are the quietest right now! Both have low crowd scores."}
        elif any(w in msg for w in ["cafe", "coffee", "drink"]):
            return {"reply": "☕ Top cafes: Sip & Work (DIFC) ⭐4.7 and Brew & Bean (Downtown) ⭐4.5. Sip & Work is quieter in afternoons!"}
        elif any(w in msg for w in ["park", "outdoor", "outside", "nature"]):
            return {"reply": "🌳 Central Park (Jumeirah) and Green Escape Park (Al Barsha) are great! Best time is early morning or after 4pm."}
        elif any(w in msg for w in ["gym", "workout", "exercise", "fitness"]):
            return {"reply": "💪 FitZone Gym (Marina) and PowerHouse Gym (JLT) are your best bets! Tuesday mornings are the quietest."}
        elif any(w in msg for w in ["mall", "shop", "shopping"]):
            return {"reply": "🛍️ Mall of the Stars (Sheikh Zayed Road)! Weekday mornings are least crowded. Third floor is always quieter!"}
        elif any(w in msg for w in ["metro", "bus", "transport"]):
            return {"reply": "🚇 Metro peak hours: 7-9am and 5-8pm. Off-peak (10am-4pm) is much more comfortable!"}
        elif any(w in msg for w in ["hello", "hi", "hey"]):
            return {"reply": "Hi! 👋 I'm CrowdLess AI! Ask me 'Where's quiet right now?' or 'Best cafe today?' 🌊"}
        elif any(w in msg for w in ["best", "recommend", "suggest", "where"]):
            return {"reply": "🌊 Top picks: 1️⃣ Sip & Work (quietest cafe) 2️⃣ Central Park (best outdoor) 3️⃣ FitZone Gym (best workout spot)!"}
        elif any(w in msg for w in ["thank", "thanks", "great"]):
            return {"reply": "You're welcome! 🌊 Stay CrowdLess! ✨"}
        else:
            return {"reply": "🤔 Ask me about quiet places, cafes, parks, gyms or metro times! Try 'Where's quiet right now?' 🌿"}

@app.get("/")
def root():
    return {"message": "CrowdLess API is running 🚀"}