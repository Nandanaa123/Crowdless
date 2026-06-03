import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ── Splash Screen ──────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "linear-gradient(135deg, #0f4c81 0%, #1a6bb5 50%, #2d8fd4 100%)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #ff9a3c, #ffb347)" }}>
          <span className="text-5xl">🌿</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">CrowdLess</h1>
          <p className="text-blue-200 mt-2 text-base">Find your calm place</p>
        </div>
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange-300"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }}></div>
          ))}
        </div>
      </div>
      <p className="absolute bottom-10 text-blue-300 text-sm">Made for peaceful minds ✨</p>
    </div>
  );
}

function WeatherBar({ weather }) {
  if (!weather) return null;
  return (
    <div className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between shadow-sm"
      style={{
        background: weather.indoor_recommended
          ? "linear-gradient(135deg, #1e3a5f, #1a6bb5)"
          : "linear-gradient(135deg, #ff9a3c, #ffb347)",
        border: "1.5px solid #e0f0ff"
      }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{weather.emoji}</span>
        <div>
          <p className="font-semibold text-white text-sm">{weather.condition} · {weather.temperature}°C</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>{weather.tip}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-white opacity-75">💨 {weather.wind_speed} km/h</span>
        <span className="text-xs text-white opacity-75">💧 {weather.humidity}%</span>
      </div>
    </div>
  );
}

// ── Heatmap ────────────────────────────────────────────────
function HeatMap({ places, small = false }) {
  const center = [25.2048, 55.2708];
  const zoom = small ? 13 : 12;
  const height = small ? "160px" : "220px";

  const colorMap = {
    green: "#22c55e",
    yellow: "#f59e0b",
    red: "#ef4444",
  };

  return (
    <div style={{ height, borderRadius: "16px", overflow: "hidden", border: "1.5px solid #e0f0ff" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={!small}
        scrollWheelZoom={false}
        dragging={!small}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {places.map((place) => (
          <CircleMarker
            key={place.id}
            center={[place.lat, place.lng]}
            radius={small ? 10 : place.crowd_score * 2 + 6}
            fillColor={colorMap[place.crowd_color] || "#94a3b8"}
            color={colorMap[place.crowd_color] || "#94a3b8"}
            weight={2}
            opacity={0.9}
            fillOpacity={0.45}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "600", color: "#0f4c81" }}>{place.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{place.crowd_label} · {place.wait_time}</div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

// ── Crowd Badge ────────────────────────────────────────────
function CrowdBadge({ color, label }) {
  const styles = {
    green: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
    yellow: { bg: "#fef9c3", text: "#a16207", dot: "#eab308" },
    red: { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
  };
  const s = styles[color] || styles.green;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border"
      style={{ background: s.bg, color: s.text, borderColor: s.dot + "44" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.dot, display: "inline-block" }}></span>
      {label}
    </span>
  );
}

// ── Place Card ─────────────────────────────────────────────
function PlaceCard({ place, onClick }) {
  return (
    <div onClick={() => onClick(place)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ background: "white", border: "1.5px solid #e0f0ff", boxShadow: "0 2px 12px #0f4c8110" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px #0f4c8122"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px #0f4c8110"}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: "#0f4c81" }}>{place.name}</h3>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>📍 {place.address}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#fff7ed" }}>
          <span>⭐</span>
          <span className="text-sm font-medium" style={{ color: "#ea580c" }}>{place.rating}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <CrowdBadge color={place.crowd_color} label={place.crowd_label} />
        <span className="text-sm" style={{ color: "#94a3b8" }}>⏱ {place.wait_time}</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs" style={{ color: "#94a3b8" }}>Best time:</span>
        <span className="text-xs font-medium" style={{ color: "#1a6bb5" }}>{place.best_time}</span>
      </div>
      {place.top_items?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {place.top_items.map((item, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full"
              style={{ background: "#f0f9ff", color: "#0369a1" }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Place Detail Modal ─────────────────────────────────────
function PlaceDetail({ place, onClose }) {
  const styles = {
    green: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    yellow: { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
    red: { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
  };
  const s = styles[place.crowd_color] || styles.green;
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
      style={{ background: "#00000066" }}>
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto"
        style={{ background: "white", maxHeight: "90vh" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#0f4c81" }}>{place.name}</h2>
            <p className="mt-1" style={{ color: "#64748b" }}>📍 {place.address}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-light"
            style={{ background: "#f1f5f9", color: "#64748b" }}>×</button>
        </div>

        {/* Crowd status */}
        <div className="rounded-2xl p-4 mb-4 border" style={{ background: s.bg, borderColor: s.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{ color: s.text }}>{place.crowd_label}</p>
              <p className="text-sm opacity-75" style={{ color: s.text }}>Right now</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: "#0f4c81" }}>
                {place.crowd_score}<span className="text-lg" style={{ color: "#94a3b8" }}>/10</span>
              </p>
              <p className="text-sm" style={{ color: "#64748b" }}>Crowd score</p>
            </div>
          </div>
        </div>

        {/* Mini heatmap */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2" style={{ color: "#0f4c81" }}>🗺 Area crowd map</p>
          <HeatMap places={[place]} small={true} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Wait time", value: place.wait_time },
            { label: "Best time today", value: place.best_time },
            { label: "Rating", value: `⭐ ${place.rating}` },
            { label: "Type", value: place.type },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "#f8fafc" }}>
              <p className="text-xs mb-1" style={{ color: "#94a3b8" }}>{stat.label}</p>
              <p className="font-semibold capitalize" style={{ color: "#0f4c81" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* What to order */}
        {place.top_items?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2" style={{ color: "#0f4c81" }}>🍽 What to order</p>
            <div className="flex gap-2 flex-wrap">
              {place.top_items.map((item, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ background: "#eff6ff", color: "#1d4ed8" }}>{item}</span>
              ))}
            </div>
          </div>
        )}

        <button className="w-full py-3 rounded-xl font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #1a6bb5, #2d8fd4)" }}>
          🧭 Get Directions
        </button>
      </div>
    </div>
  );
}

// ── Chatbot ────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm your CrowdLess assistant. Ask me anything like 'Where's quiet right now?' or 'Best cafe with no wait?'" }
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: "Great question! Based on current crowd data, I'd suggest checking the Quiet places in the list — they have the lowest crowd score right now. 🌿" };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 rounded-3xl shadow-2xl overflow-hidden z-50"
          style={{ background: "white", border: "1.5px solid #e0f0ff" }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0f4c81, #1a6bb5)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-white font-semibold text-sm">CrowdLess AI</p>
                <p className="text-blue-200 text-xs">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-light">×</button>
          </div>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto" style={{ height: "220px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="px-3 py-2 rounded-2xl text-sm max-w-xs"
                  style={{
                    background: msg.from === "user" ? "#1a6bb5" : "#f0f9ff",
                    color: msg.from === "user" ? "white" : "#0f4c81"
                  }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2" style={{ borderColor: "#e0f0ff" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask me anything..."
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ background: "#f0f9ff", color: "#0f4c81" }}
            />
            <button onClick={send}
              className="px-3 py-2 rounded-xl text-white font-medium text-sm"
              style={{ background: "#1a6bb5" }}>
              Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 text-2xl"
        style={{ background: "linear-gradient(135deg, #ff9a3c, #ffb347)" }}>
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [weather, setWeather] = useState(null);

  const filters = ["all", "cafe", "park", "gym", "mall"];

  const fetchPlaces = async (searchQuery, type) => {
    setLoading(true);
    try {
      const typeParam = type === "all" ? "" : type;
      const res = await fetch(`http://127.0.0.1:8000/api/places/search?query=${searchQuery}&type=${typeParam}`);
      const data = await res.json();
      setPlaces(data.places);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaces("", "all");
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/weather/current");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen" style={{ background: "#f0f7ff" }}>

      {/* Header */}
      <div className="sticky top-0 z-40 shadow-sm"
        style={{ background: "white", borderBottom: "1px solid #e0f0ff" }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #ff9a3c, #ffb347)" }}>
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#0f4c81" }}>CrowdLess</h1>
              <p className="text-xs" style={{ color: "#94a3b8" }}>Find your calm place ✨</p>
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); fetchPlaces(query, activeFilter); }}
            className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search cafes, parks, gyms..."
              className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all"
              style={{ background: "#f0f7ff", color: "#0f4c81", border: "1.5px solid #bfdbfe" }}
            />
            <button type="submit"
              className="px-5 py-3 rounded-xl font-medium text-white"
              style={{ background: "linear-gradient(135deg, #1a6bb5, #2d8fd4)" }}>
              Search
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {filters.map(filter => (
              <button key={filter} onClick={() => { setActiveFilter(filter); fetchPlaces(query, filter); }}
                className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeFilter === filter ? "#1a6bb5" : "#e0f0ff",
                  color: activeFilter === filter ? "white" : "#1a6bb5"
                }}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-6">

        <WeatherBar weather={weather} />

        {/* Heatmap section */}
        <div className="rounded-2xl p-4 mb-6 shadow-sm"
          style={{ background: "white", border: "1.5px solid #e0f0ff" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold" style={{ color: "#0f4c81" }}>📍 Area Crowd Map</h2>
            <div className="flex items-center gap-3 text-xs" style={{ color: "#94a3b8" }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#22c55e" }}></span>Quiet</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#f59e0b" }}></span>Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ef4444" }}></span>Busy</span>
            </div>
          </div>
          <HeatMap places={places} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4"
              style={{ borderColor: "#1a6bb5", borderTopColor: "transparent" }}></div>
            <p style={{ color: "#64748b" }}>Finding quiet places...</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              {places.length} places found — sorted by quietest first 🌿
            </p>
            <div className="flex flex-col gap-4">
              {places.map(place => (
                <PlaceCard key={place.id} place={place} onClick={setSelectedPlace} />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedPlace && <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
      <Chatbot />
    </div>
  );
}