from fastapi import APIRouter
import requests

router = APIRouter()

@router.get("/current")
def get_weather():
    try:
        # Open-Meteo free API — no key needed
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": 25.2048,
            "longitude": 55.2708,
            "current": ["temperature_2m", "weathercode", "windspeed_10m", "relativehumidity_2m"],
            "timezone": "Asia/Dubai"
        }
        res = requests.get(url, params=params)
        data = res.json()
        current = data["current"]

        code = current["weathercode"]
        temp = current["temperature_2m"]
        wind = current["windspeed_10m"]
        humidity = current["relativehumidity_2m"]

        # Weather code to description
        if code == 0:
            condition = "Clear Sky"
            emoji = "☀️"
            tip = "Perfect day to visit parks and outdoor spots!"
            indoor = False
        elif code in [1, 2, 3]:
            condition = "Partly Cloudy"
            emoji = "⛅"
            tip = "Nice weather — great for parks and cafes!"
            indoor = False
        elif code in [45, 48]:
            condition = "Foggy"
            emoji = "🌫️"
            tip = "Low visibility — indoor cafes recommended!"
            indoor = True
        elif code in [51, 53, 55, 61, 63, 65, 80, 81, 82]:
            condition = "Rainy"
            emoji = "🌧️"
            tip = "Rainy day — perfect for cozy indoor cafes!"
            indoor = True
        elif code in [71, 73, 75]:
            condition = "Snowy"
            emoji = "❄️"
            tip = "Stay warm indoors today!"
            indoor = True
        elif code in [95, 96, 99]:
            condition = "Thunderstorm"
            emoji = "⛈️"
            tip = "Stay safe indoors — avoid outdoor places!"
            indoor = True
        else:
            condition = "Cloudy"
            emoji = "☁️"
            tip = "Decent weather — most places are good to visit!"
            indoor = False

        # Activity suggestions
        hour = __import__('datetime').datetime.now().hour
        if 6 <= hour <= 11:
            time_of_day = "morning"
        elif 12 <= hour <= 17:
            time_of_day = "afternoon"
        elif 18 <= hour <= 21:
            time_of_day = "evening"
        else:
            time_of_day = "night"

        activities = {
            ("clear", "morning"): {"suggestion": "Perfect morning for a park jog! 🏃", "place_type": "park", "reason": "Cool fresh air and quiet paths"},
            ("clear", "afternoon"): {"suggestion": "Grab a cold slush at a quiet café! 🥤", "place_type": "cafe", "reason": "Beat the heat indoors with a cool drink"},
            ("clear", "evening"): {"suggestion": "Golden hour park walk awaits! 🌅", "place_type": "park", "reason": "Best time for an evening stroll"},
            ("clear", "night"): {"suggestion": "Late night coffee run? ☕", "place_type": "cafe", "reason": "Cozy cafes are quieter at night"},
            ("cloudy", "morning"): {"suggestion": "Great gym morning — no excuses! 💪", "place_type": "gym", "reason": "Cloudy days are perfect for workouts"},
            ("cloudy", "afternoon"): {"suggestion": "Mall walk sounds perfect right now 🛍️", "place_type": "mall", "reason": "Cool indoors on a grey day"},
            ("cloudy", "evening"): {"suggestion": "Cozy café evening? Yes please! ☕", "place_type": "cafe", "reason": "Perfect cloudy evening vibe"},
            ("cloudy", "night"): {"suggestion": "Night gym session — own it! 🔥", "place_type": "gym", "reason": "Late night workouts hit different"},
            ("rainy", "morning"): {"suggestion": "Rainy morning café vibes ☔", "place_type": "cafe", "reason": "Nothing beats coffee on a rainy day"},
            ("rainy", "afternoon"): {"suggestion": "Mall day! Stay dry and explore 🛍️", "place_type": "mall", "reason": "Perfect rainy afternoon activity"},
            ("rainy", "evening"): {"suggestion": "Cozy indoor café evening 🌧️", "place_type": "cafe", "reason": "Stay warm and dry"},
            ("rainy", "night"): {"suggestion": "Late night café run in the rain 🌧️", "place_type": "cafe", "reason": "Romantic rainy night vibes"},
        }

        weather_key = "rainy" if indoor else ("clear" if code == 0 else "cloudy")
        activity = activities.get((weather_key, time_of_day), {
            "suggestion": "Find your perfect quiet spot! 🌿",
            "place_type": "cafe",
            "reason": "CrowdLess always finds you the quietest place"
        })

        return {
            "temperature": temp,
            "condition": condition,
            "emoji": emoji,
            "tip": tip,
            "indoor_recommended": indoor,
            "wind_speed": wind,
            "humidity": humidity,
            "activity": activity,
            "time_of_day": time_of_day,
        }

    except Exception as e:
        return {
            "temperature": 32,
            "condition": "Clear Sky",
            "emoji": "☀️",
            "tip": "Perfect day to explore Dubai!",
            "indoor_recommended": False,
            "wind_speed": 10,
            "humidity": 45,
            "activity": {
                "suggestion": "Grab a cold slush at a quiet café! 🥤",
                "place_type": "cafe",
                "reason": "Beat the heat indoors with a cool drink"
            },
            "time_of_day": "afternoon",
        }