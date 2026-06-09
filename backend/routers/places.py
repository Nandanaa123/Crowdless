from fastapi import APIRouter
from typing import List
import random

VIBE_PROFILES = {
    "bookworm": {
        "title": "The Quiet Bookworm 📚",
        "description": "You love silent, cozy spots perfect for reading or deep work",
        "preferred_types": ["cafe"],
        "preferred_vibe": "quiet",
        "max_crowd_score": 4,
        "color": "#6366f1",
        "emoji": "📚"
    },
    "music_lover": {
        "title": "The Music Lover 🎵",
        "description": "You enjoy places with great ambiance and a good playlist",
        "preferred_types": ["cafe", "mall"],
        "preferred_vibe": "moderate",
        "max_crowd_score": 7,
        "color": "#ec4899",
        "emoji": "🎵"
    },
    "nature_soul": {
        "title": "The Nature Soul 🌿",
        "description": "You recharge outdoors — fresh air and open spaces are your thing",
        "preferred_types": ["park"],
        "preferred_vibe": "quiet",
        "max_crowd_score": 5,
        "color": "#22c55e",
        "emoji": "🌿"
    },
    "fitness_freak": {
        "title": "The Fitness Freak 💪",
        "description": "You're always on the move — gyms and active spots are your home",
        "preferred_types": ["gym"],
        "preferred_vibe": "moderate",
        "max_crowd_score": 6,
        "color": "#f59e0b",
        "emoji": "💪"
    },
    "social_butterfly": {
        "title": "The Social Butterfly 🦋",
        "description": "You love being around people and discovering buzzing new spots",
        "preferred_types": ["mall", "cafe"],
        "preferred_vibe": "moderate",
        "max_crowd_score": 8,
        "color": "#ff9a3c",
        "emoji": "🦋"
    }
}

router = APIRouter()

MOCK_PLACES = [
    # ── Cafes ─────────────────────────────────────────────
    {"id": "1", "name": "Brew & Bean Coffee", "type": "cafe", "lat": 25.2048, "lng": 55.2708, "rating": 4.5, "address": "Downtown Dubai", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 20-50", "top_items": ["Iced Latte", "Avocado Toast", "Cold Brew"]},
    {"id": "2", "name": "The Quiet Cup", "type": "cafe", "lat": 25.2060, "lng": 55.2720, "rating": 4.2, "address": "Business Bay", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 15-40", "top_items": ["Cappuccino", "Croissant", "Matcha Latte"]},
    {"id": "3", "name": "Sip & Work", "type": "cafe", "lat": 25.2035, "lng": 55.2695, "rating": 4.7, "address": "DIFC", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 40-80", "top_items": ["Iced Latte", "Avocado Toast", "Cold Brew"]},
    {"id": "4", "name": "% Arabica", "type": "cafe", "lat": 25.1985, "lng": 55.2765, "rating": 4.8, "address": "Dubai Mall", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 35-70", "top_items": ["Kyoto Latte", "Pour Over", "Matcha"]},
    {"id": "5", "name": "Nightjar Coffee", "type": "cafe", "lat": 25.2112, "lng": 55.2698, "rating": 4.6, "address": "Al Quoz", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 20-45", "top_items": ["Filter Coffee", "Banana Bread", "Cold Brew"]},

    # ── Parks ─────────────────────────────────────────────
    {"id": "6", "name": "Zabeel Park", "type": "park", "lat": 25.2307, "lng": 55.3024, "rating": 4.7, "address": "Zabeel", "cost": "free", "cost_label": "💚 Free", "cost_range": "AED 5 entry", "top_items": []},
    {"id": "7", "name": "Al Safa Park", "type": "park", "lat": 25.1890, "lng": 55.2364, "rating": 4.5, "address": "Al Safa", "cost": "free", "cost_label": "💚 Free", "cost_range": "AED 5 entry", "top_items": []},
    {"id": "8", "name": "Creek Park", "type": "park", "lat": 25.2285, "lng": 55.3275, "rating": 4.6, "address": "Al Garhoud", "cost": "free", "cost_label": "💚 Free", "cost_range": "AED 5 entry", "top_items": []},
    {"id": "9", "name": "Mushrif Park", "type": "park", "lat": 25.2614, "lng": 55.4197, "rating": 4.4, "address": "Mirdif", "cost": "free", "cost_label": "💚 Free", "cost_range": "AED 3 entry", "top_items": []},

    # ── Beaches ───────────────────────────────────────────
    {"id": "10", "name": "Kite Beach", "type": "beach", "lat": 25.1551, "lng": 55.1936, "rating": 4.8, "address": "Umm Suqeim", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Kite surfing", "Beach volleyball", "Food trucks"]},
    {"id": "11", "name": "JBR Beach", "type": "beach", "lat": 25.0777, "lng": 55.1298, "rating": 4.6, "address": "JBR Walk", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Swimming", "Beach cafes", "Water sports"]},
    {"id": "12", "name": "La Mer Beach", "type": "beach", "lat": 25.2197, "lng": 55.2627, "rating": 4.5, "address": "Jumeirah 1", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Swimming", "Restaurants", "Shops"]},
    {"id": "13", "name": "Sunset Beach", "type": "beach", "lat": 25.1234, "lng": 55.1456, "rating": 4.7, "address": "Umm Suqeim 3", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Burj Al Arab view", "Sunset watching", "Jogging track"]},

    # ── Museums ───────────────────────────────────────────
    {"id": "14", "name": "Dubai Museum", "type": "museum", "lat": 25.2632, "lng": 55.2976, "rating": 4.4, "address": "Al Fahidi", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 3 entry", "top_items": ["Historical exhibits", "Old Dubai", "Pearl diving"]},
    {"id": "15", "name": "Dubai Frame", "type": "museum", "lat": 25.2351, "lng": 55.3005, "rating": 4.5, "address": "Zabeel Park", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 50 entry", "top_items": ["Sky bridge", "City views", "History gallery"]},
    {"id": "16", "name": "Etihad Museum", "type": "museum", "lat": 25.2285, "lng": 55.2734, "rating": 4.6, "address": "Jumeirah 1", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 25 entry", "top_items": ["UAE history", "Independence story", "Architecture"]},
    {"id": "17", "name": "Coffee Museum", "type": "museum", "lat": 25.2634, "lng": 55.2978, "rating": 4.3, "address": "Al Fahidi", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Coffee history", "Tastings", "Vintage collection"]},

    # ── Gyms ──────────────────────────────────────────────
    {"id": "18", "name": "FitZone Gym", "type": "gym", "lat": 25.2055, "lng": 55.2710, "rating": 4.1, "address": "Marina", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 50-80/day", "top_items": []},
    {"id": "19", "name": "PowerHouse Gym", "type": "gym", "lat": 25.2070, "lng": 55.2730, "rating": 4.4, "address": "JLT", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 40-70/day", "top_items": []},
    {"id": "20", "name": "Warehouse Gym", "type": "gym", "lat": 25.1876, "lng": 55.2614, "rating": 4.7, "address": "Motor City", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 60-100/day", "top_items": []},

    # ── Malls ─────────────────────────────────────────────
    {"id": "21", "name": "Mall of the Stars", "type": "mall", "lat": 25.2080, "lng": 55.2760, "rating": 4.6, "address": "Sheikh Zayed Road", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Shopping", "Food court", "Cinema"]},
    {"id": "22", "name": "Dubai Mall", "type": "mall", "lat": 25.1972, "lng": 55.2797, "rating": 4.8, "address": "Downtown Dubai", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Aquarium", "Ice rink", "Fountain show"]},
    {"id": "23", "name": "Ibn Battuta Mall", "type": "mall", "lat": 25.0436, "lng": 55.1139, "rating": 4.4, "address": "Jebel Ali", "cost": "free", "cost_label": "💚 Free", "cost_range": "Free entry", "top_items": ["Theme courts", "Shopping", "Dining"]},

    # ── Restaurants ───────────────────────────────────────
    {"id": "24", "name": "Operation Falafel", "type": "restaurant", "lat": 25.2048, "lng": 55.2708, "rating": 4.5, "address": "Various Locations", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 20-50", "top_items": ["Falafel wrap", "Hummus", "Shawarma"]},
    {"id": "25", "name": "Ravi Restaurant", "type": "restaurant", "lat": 25.2334, "lng": 55.2785, "rating": 4.7, "address": "Satwa", "cost": "budget", "cost_label": "💛 Budget", "cost_range": "AED 15-40", "top_items": ["Karahi", "Biryani", "Naan"]},
    {"id": "26", "name": "Arabian Tea House", "type": "restaurant", "lat": 25.2634, "lng": 55.2978, "rating": 4.6, "address": "Al Fahidi", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 50-120", "top_items": ["Arabic breakfast", "Mint tea", "Luqaimat"]},

    # ── Wellness ──────────────────────────────────────────
    {"id": "27", "name": "Talise Spa", "type": "wellness", "lat": 25.1412, "lng": 55.1853, "rating": 4.9, "address": "Madinat Jumeirah", "cost": "premium", "cost_label": "🔴 Premium", "cost_range": "AED 300-800", "top_items": ["Massage", "Facial", "Hammam"]},
    {"id": "28", "name": "Zen Yoga Dubai", "type": "wellness", "lat": 25.2048, "lng": 55.2708, "rating": 4.5, "address": "DIFC", "cost": "moderate", "cost_label": "🟠 Moderate", "cost_range": "AED 80-150/class", "top_items": ["Yoga", "Meditation", "Pilates"]},
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