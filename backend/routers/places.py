from fastapi import APIRouter
from typing import List
import random

router = APIRouter()

MOCK_PLACES = [
    {"id": "1", "name": "Brew & Bean Coffee", "type": "cafe", "lat": 25.2048, "lng": 55.2708, "rating": 4.5, "address": "Downtown Dubai"},
    {"id": "2", "name": "The Quiet Cup", "type": "cafe", "lat": 25.2060, "lng": 55.2720, "rating": 4.2, "address": "Business Bay"},
    {"id": "3", "name": "Sip & Work", "type": "cafe", "lat": 25.2035, "lng": 55.2695, "rating": 4.7, "address": "DIFC"},
    {"id": "4", "name": "Central Park", "type": "park", "lat": 25.2090, "lng": 55.2750, "rating": 4.8, "address": "Jumeirah"},
    {"id": "5", "name": "Green Escape Park", "type": "park", "lat": 25.2010, "lng": 55.2680, "rating": 4.3, "address": "Al Barsha"},
    {"id": "6", "name": "FitZone Gym", "type": "gym", "lat": 25.2055, "lng": 55.2710, "rating": 4.1, "address": "Marina"},
    {"id": "7", "name": "PowerHouse Gym", "type": "gym", "lat": 25.2070, "lng": 55.2730, "rating": 4.4, "address": "JLT"},
    {"id": "8", "name": "Mall of the Stars", "type": "mall", "lat": 25.2080, "lng": 55.2760, "rating": 4.6, "address": "Sheikh Zayed Road"},
]

def get_crowd_score():
    return random.randint(1, 10)

def get_crowd_label(score):
    if score <= 3:
        return "Quiet"
    elif score <= 6:
        return "Moderate"
    else:
        return "Busy"

def get_crowd_color(score):
    if score <= 3:
        return "green"
    elif score <= 6:
        return "yellow"
    else:
        return "red"

def get_wait_time(score):
    if score <= 3:
        return "No wait"
    elif score <= 6:
        return "5-10 min wait"
    else:
        return "20+ min wait"
    
def get_hourly_crowd(place_type):
    patterns = {
        "cafe": [2,2,1,1,1,3,6,8,9,7,6,7,8,6,5,5,6,7,6,5,4,3,2,2],
        "park": [1,1,1,1,1,1,2,4,6,7,6,5,6,7,8,9,8,7,5,4,3,2,1,1],
        "gym":  [3,2,1,1,1,2,7,9,8,6,4,3,3,4,5,6,9,10,8,6,4,3,2,2],
        "mall": [1,1,1,1,1,1,1,1,2,4,6,8,9,9,8,8,9,9,8,7,5,3,2,1],
    }
    return patterns.get(place_type, patterns["cafe"])

def get_quiet_window(hourly):
    min_val = min(hourly[8:22])
    hour = hourly.index(min_val, 8, 22)
    end = min(hour + 2, 22)
    return f"{hour}:00 - {end}:00"

@router.get("/search")
def search_places(query: str = "", type: str = ""):
    results = []
    for place in MOCK_PLACES:
        if query.lower() in place["name"].lower() or query.lower() in place["type"].lower() or query == "":
            if type == "" or type == place["type"]:
                score = get_crowd_score()
                results.append({
                    **place,
                    "crowd_score": score,
                    "crowd_label": get_crowd_label(score),
                    "crowd_color": get_crowd_color(score),
                    "wait_time": get_wait_time(score),
                    "best_time": "2pm - 4pm today",
                    "hourly_crowd": get_hourly_crowd(place["type"]),
                    "quiet_window": get_quiet_window(get_hourly_crowd(place["type"])),
                    "top_items": ["Iced Latte", "Avocado Toast", "Cold Brew"] if place["type"] == "cafe" else [],
                })
    results.sort(key=lambda x: x["crowd_score"])
    return {"places": results}

@router.get("/{place_id}")
def get_place(place_id: str):
    for place in MOCK_PLACES:
        if place["id"] == place_id:
            score = get_crowd_score()
            return {
                **place,
                "crowd_score": score,
                "crowd_label": get_crowd_label(score),
                "crowd_color": get_crowd_color(score),
                "wait_time": get_wait_time(score),
                "best_time": "2pm - 4pm today",
            }
    return {"error": "Place not found"}