from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import places, ai_summary, weather, transport
from routers import auth
from database import create_tables

app = FastAPI(title="CrowdLess API")

create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    try:
        import google.generativeai as genai
        from dotenv import load_dotenv
        import os
        load_dotenv()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash")
        user_message = body.get("message", "")
        if not user_message:
            return {"reply": "Hi! Ask me anything about quiet places in Dubai! 🌿"}
        response = model.generate_content(f"You are CrowdLess AI, a helpful assistant for finding quiet places in Dubai. Answer helpfully and briefly. User says: {user_message}")
        return {"reply": response.text}
    except Exception as e:
        error = str(e)
        if "429" in error:
            return {"reply": "I'm a bit busy right now — try again in a minute! 🌿"}
        return {"reply": "Something went wrong. Please try again! 🌿"}

@app.get("/")
def root():
    return {"message": "CrowdLess API is running 🚀"}