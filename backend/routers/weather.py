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

        return {
            "temperature": temp,
            "condition": condition,
            "emoji": emoji,
            "tip": tip,
            "indoor_recommended": indoor,
            "wind_speed": wind,
            "humidity": humidity,
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
        }