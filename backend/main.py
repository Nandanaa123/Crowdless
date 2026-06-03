from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import places, ai_summary

app = FastAPI(title="CrowdLess API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(places.router, prefix="/api/places", tags=["places"])
app.include_router(ai_summary.router, prefix="/api/summary", tags=["summary"])

@app.get("/")
def root():
    return {"message": "CrowdLess API is running "}