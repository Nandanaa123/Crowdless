from fastapi import APIRouter
import random
from datetime import datetime

router = APIRouter()

METRO_STATIONS = [
    {"id": "m1", "name": "Dubai Mall Metro", "line": "Red Line", "lat": 25.1972, "lng": 55.2797},
    {"id": "m2", "name": "Union Metro", "line": "Red/Green Line", "lat": 25.2653, "lng": 55.3100},
    {"id": "m3", "name": "BurJuman Metro", "line": "Red/Green Line", "lat": 25.2523, "lng": 55.3075},
    {"id": "m4", "name": "DIFC Metro", "line": "Red Line", "lat": 25.2120, "lng": 55.2827},
    {"id": "m5", "name": "Mall of Emirates Metro", "line": "Red Line", "lat": 25.1180, "lng": 55.2003},
    {"id": "m6", "name": "Deira City Centre Metro", "line": "Red Line", "lat": 25.2532, "lng": 55.3317},
]

BUS_STOPS = [
    {"id": "b1", "name": "Gold Souk Bus Stop", "route": "Route 8", "lat": 25.2697, "lng": 55.3050},
    {"id": "b2", "name": "Al Ghubaiba Bus Station", "route": "Multiple", "lat": 25.2630, "lng": 55.2990},
    {"id": "b3", "name": "Ibn Battuta Bus Stop", "route": "Route 84", "lat": 25.0436, "lng": 55.1139},
    {"id": "b4", "name": "Dragon Mart Bus Stop", "route": "Route 65", "lat": 25.1763, "lng": 55.4138},
]

def get_transport_crowd():
    hour = datetime.now().hour
    # Peak hours: 7-9am and 5-8pm
    if 7 <= hour <= 9 or 17 <= hour <= 20:
        score = random.randint(7, 10)
    elif 10 <= hour <= 16:
        score = random.randint(3, 6)
    else:
        score = random.randint(1, 3)
    return score

def get_crowd_label(score):
    if score <= 3: return "Quiet"
    if score <= 6: return "Moderate"
    return "Busy"

def get_crowd_color(score):
    if score <= 3: return "green"
    if score <= 6: return "yellow"
    return "red"

def get_next_peak():
    hour = datetime.now().hour
    if hour < 7: return "7:00 AM"
    if hour < 17: return "5:00 PM"
    return "7:00 AM tomorrow"

@router.get("/all")
def get_transport():
    metro = []
    for station in METRO_STATIONS:
        score = get_transport_crowd()
        metro.append({
            **station,
            "type": "metro",
            "crowd_score": score,
            "crowd_label": get_crowd_label(score),
            "crowd_color": get_crowd_color(score),
            "next_peak": get_next_peak(),
            "frequency": "Every 3-5 mins",
        })

    buses = []
    for stop in BUS_STOPS:
        score = get_transport_crowd()
        buses.append({
            **stop,
            "type": "bus",
            "crowd_score": score,
            "crowd_label": get_crowd_label(score),
            "crowd_color": get_crowd_color(score),
            "next_peak": get_next_peak(),
            "frequency": "Every 15-20 mins",
        })

    return {"metro": metro, "buses": buses}