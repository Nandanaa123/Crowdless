from fastapi import APIRouter

router = APIRouter()

MOCK_SUMMARIES = {
    "cafe": {
        "summary": "A cozy spot loved for its specialty coffee and relaxed atmosphere. Regulars recommend arriving before noon for the best experience.",
        "vibe": "Chill & Productive",
        "best_for": ["Remote work", "Catching up with friends", "Morning coffee"],
        "avoid_when": "Weekend mornings — gets packed fast",
        "pro_tip": "Ask for the off-menu brown sugar latte 🤫"
    },
    "park": {
        "summary": "A well-maintained green space perfect for walks, picnics, and unwinding. Families and joggers love it during cooler hours.",
        "vibe": "Relaxed & Outdoorsy",
        "best_for": ["Morning jogs", "Picnics", "Evening walks"],
        "avoid_when": "Friday afternoons — very crowded with families",
        "pro_tip": "The east entrance has more shade and fewer people 🌳"
    },
    "gym": {
        "summary": "A well-equipped gym with modern machines and friendly staff. Peak hours get intense but off-peak times are very comfortable.",
        "vibe": "Energetic & Focused",
        "best_for": ["Early morning workouts", "Weightlifting", "Cardio"],
        "avoid_when": "6pm-8pm weekdays — maximum crowd",
        "pro_tip": "Tuesday mornings are the quietest time all week 💪"
    },
    "mall": {
        "summary": "A large shopping destination with great variety. Food court gets busy during lunch but most shops remain walkable throughout the day.",
        "vibe": "Lively & Buzzing",
        "best_for": ["Weekday shopping", "Window browsing", "Food court lunch"],
        "avoid_when": "Saturday evenings — extremely packed",
        "pro_tip": "Third floor is always less crowded than ground level 🛍️"
    }
}

@router.get("/{place_type}")
def get_summary(place_type: str):
    summary = MOCK_SUMMARIES.get(place_type, MOCK_SUMMARIES["cafe"])
    return summary