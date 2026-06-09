import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ── Theme ──────────────────────────────────────────────────
const LIGHT = {
  primary: "#0ea5e9",
  primaryDark: "#0284c7",
  primaryGrad: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
  bg: "#f0fbff",
  bgCard: "#ffffff",
  bgHeader: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
  bgDeep: "#e0f7ff",
  text: "#0369a1",
  textMid: "#0ea5e9",
  textLight: "#7dd3fc",
  border: "#bae6fd",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  shadow: "0 2px 16px rgba(14,165,233,0.12)",
};

const DARK = {
  primary: "#38bdf8",
  primaryDark: "#0ea5e9",
  primaryGrad: "linear-gradient(135deg, #0c4a6e, #164e63)",
  bg: "#0c1a2e",
  bgCard: "#0f2744",
  bgHeader: "linear-gradient(135deg, #0c4a6e, #164e63)",
  bgDeep: "#0a1628",
  text: "#38bdf8",
  textMid: "#7dd3fc",
  textLight: "#0ea5e9",
  border: "#164e63",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  shadow: "0 2px 16px rgba(0,0,0,0.3)",
};

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's your ideal Sunday? ☀️",
    options: [
      { label: "Reading in a cozy corner", emoji: "📚", value: "bookworm" },
      { label: "Listening to music and chilling", emoji: "🎵", value: "music_lover" },
      { label: "Hiking or park walks", emoji: "🌿", value: "nature_soul" },
      { label: "Working out or staying active", emoji: "💪", value: "fitness_freak" },
    ]
  },
  {
    id: 2,
    question: "Your perfect drink? ☕",
    options: [
      { label: "A quiet cup of coffee", emoji: "☕", value: "bookworm" },
      { label: "Something fancy and aesthetic", emoji: "🧋", value: "music_lover" },
      { label: "Fresh juice or smoothie", emoji: "🥤", value: "nature_soul" },
      { label: "Energy drink or protein shake", emoji: "⚡", value: "fitness_freak" },
    ]
  },
  {
    id: 3,
    question: "What vibe are you looking for? ✨",
    options: [
      { label: "Silent and focused", emoji: "🤫", value: "bookworm" },
      { label: "Lively with good music", emoji: "🎶", value: "music_lover" },
      { label: "Fresh air and open space", emoji: "🌳", value: "nature_soul" },
      { label: "Energetic and motivating", emoji: "🔥", value: "fitness_freak" },
    ]
  },
  {
    id: 4,
    question: "You usually go out? 👥",
    options: [
      { label: "Alone — me time", emoji: "🧘", value: "bookworm" },
      { label: "With friends", emoji: "👯", value: "social_butterfly" },
      { label: "With family", emoji: "👨‍👩‍👧", value: "nature_soul" },
      { label: "With a workout buddy", emoji: "🤝", value: "fitness_freak" },
    ]
  }
];

// ── Splash Screen ──────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #06b6d4 100%)" }}>
      <div className="flex flex-col items-center gap-4 pop-in">
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)" }}>
          <span className="text-6xl">🌿</span>
        </div>
        <div className="text-center">
          <h1 style={{ fontFamily: "Pacifico, cursive", fontSize: "52px", color: "white", margin: 0 }}>CrowdLess</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", marginTop: "8px" }}>[ find your calm place ]</p>
        </div>
        <div className="flex gap-3 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-3 h-3 rounded-full"
              style={{ background: "rgba(255,255,255,0.8)", animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }}></div>
          ))}
        </div>
      </div>
      <p className="absolute bottom-10 text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Nunito" }}>made for peaceful minds ✨</p>
    </div>
  );
}

// ── Auth Screen ────────────────────────────────────────────
function AuthScreen({ onDone, C }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Something went wrong"); }
      else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onDone(data.user);
      }
    } catch { setError("Cannot connect to server"); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-6"
      style={{ background: C.bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: C.primaryGrad }}>
            <span className="text-3xl">🌿</span>
          </div>
          <h1 style={{ fontFamily: "Pacifico, cursive", fontSize: "36px", background: C.primaryGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>CrowdLess</h1>
          <p style={{ color: C.textLight, fontFamily: "Nunito", marginTop: "4px", fontSize: "13px" }}>find your calm place ✨</p>
        </div>
        <div className="rounded-2xl p-6 shadow-lg" style={{ background: C.bgCard, border: `2px solid ${C.border}` }}>
          <div className="flex gap-2 mb-5">
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: mode === m ? C.primaryGrad : "transparent",
                  color: mode === m ? "white" : C.textMid,
                  border: `2px solid ${mode === m ? C.primaryDark : C.border}`,
                  fontFamily: "Nunito"
                }}>
                {m}
              </button>
            ))}
          </div>
          {mode === "signup" && (
            <div className="mb-3">
              <label style={{ fontSize: "11px", fontWeight: "800", color: C.text, fontFamily: "Nunito", display: "block", marginBottom: "4px" }}>your name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: C.bg, color: C.text, border: `2px solid ${C.border}`, fontFamily: "Nunito" }}
                onFocus={e => e.target.style.borderColor = C.primary}
                onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          )}
          <div className="mb-3">
            <label style={{ fontSize: "11px", fontWeight: "800", color: C.text, fontFamily: "Nunito", display: "block", marginBottom: "4px" }}>email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: C.bg, color: C.text, border: `2px solid ${C.border}`, fontFamily: "Nunito" }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border} />
          </div>
          <div className="mb-4">
            <label style={{ fontSize: "11px", fontWeight: "800", color: C.text, fontFamily: "Nunito", display: "block", marginBottom: "4px" }}>password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="min 6 characters" type="password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: C.bg, color: C.text, border: `2px solid ${C.border}`, fontFamily: "Nunito" }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
              onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
          {error && (
            <div className="rounded-xl px-3 py-2 mb-3 text-sm" style={{ background: "#fee2e2", color: "#991b1b", border: "1.5px solid #fca5a5", fontFamily: "Nunito" }}>
              ⚠️ {error}
            </div>
          )}
          <button onClick={handle} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all"
            style={{ background: C.primaryGrad, fontFamily: "Nunito", fontSize: "15px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "please wait..." : mode === "login" ? "login →" : "create account →"}
          </button>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: C.textLight, fontFamily: "Nunito" }}>your data is safe with us 🔒</p>
      </div>
    </div>
  );
}

// ── Quiz Screen ────────────────────────────────────────────
function QuizScreen({ onDone, C }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const counts = newAnswers.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
      const vibe = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      fetchProfile(vibe);
    }
  };

  const fetchProfile = async (vibe) => {
    setLoading(true);
    const profiles = {
      bookworm: { title: "The Quiet Bookworm", description: "You love silent cozy spots perfect for reading!", emoji: "📚", color: "#0ea5e9" },
      music_lover: { title: "The Music Lover", description: "You enjoy places with great ambiance!", emoji: "🎵", color: "#06b6d4" },
      nature_soul: { title: "The Nature Soul", description: "Fresh air and open spaces are your thing!", emoji: "🌿", color: "#22c55e" },
      fitness_freak: { title: "The Fitness Freak", description: "Always on the move!", emoji: "💪", color: "#f59e0b" },
      social_butterfly: { title: "The Social Butterfly", description: "You love buzzing new spots!", emoji: "🦋", color: "#8b5cf6" },
    };
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/places/recommendations/${vibe}`);
      const data = await res.json();
      setProfile(data.profile || profiles[vibe]);
    } catch { setProfile(profiles[vibe] || profiles.bookworm); }
    setShowResult(true);
    setLoading(false);
  };

  const q = QUIZ_QUESTIONS[current];
  const progress = (current / QUIZ_QUESTIONS.length) * 100;

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: C.bg }}>
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
        style={{ borderColor: C.primary, borderTopColor: "transparent" }}></div>
      <p style={{ color: C.text, fontFamily: "Nunito", fontWeight: "700" }}>finding your vibe...</p>
    </div>
  );

  if (showResult && profile) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-6 slide-up" style={{ background: C.bg }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-8xl mb-6 pop-in">{profile.emoji}</div>
        <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "28px", color: C.text, margin: "0 0 8px 0" }}>{profile.title}</h2>
        <p style={{ color: C.textMid, fontFamily: "Nunito", marginBottom: "24px" }}>{profile.description}</p>
        <div className="rounded-2xl p-4 mb-6" style={{ background: C.bgCard, border: `2px solid ${C.border}` }}>
          <p style={{ color: C.textMid, fontFamily: "Nunito" }}>We'll show you places that match your vibe — sorted by crowd level just for you! 🌊</p>
        </div>
        <button onClick={() => onDone(profile)}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white"
          style={{ background: C.primaryGrad, fontFamily: "Nunito", fontSize: "16px" }}>
          find my places →
        </button>
        <button onClick={() => { setCurrent(0); setAnswers([]); setShowResult(false); setProfile(null); }}
          className="mt-3 text-sm underline" style={{ color: C.textLight, fontFamily: "Nunito" }}>
          retake quiz
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col z-50 p-6" style={{ background: C.bg }}>
      <div className="mb-8">
        <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, fontFamily: "Nunito", fontWeight: "700", fontSize: "13px", marginBottom: "8px" }}>
          <span>question {current + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: C.border }}>
          <div className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: C.primaryGrad }}></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: C.primaryGrad }}>
          <span className="text-3xl">🌿</span>
        </div>
        <h2 className="text-center mb-8" style={{ fontFamily: "Nunito", fontWeight: "900", fontSize: "22px", color: C.text }}>{q.question}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt.value)}
              className="w-full py-4 px-5 rounded-2xl text-left flex items-center gap-4 transition-all duration-200"
              style={{ background: C.bgCard, border: `2px solid ${C.border}`, color: C.text, fontFamily: "Nunito", fontWeight: "700" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.bgDeep; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; }}>
              <span className="text-2xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: C.textLight, fontFamily: "Nunito" }}>crowdless — find your calm place ✨</p>
    </div>
  );
}

// ── Weather Bar ────────────────────────────────────────────
function WeatherBar({ weather, C }) {
  if (!weather) return null;
  return (
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-center justify-between"
      style={{ background: C.bgCard, border: `2px solid ${C.border}`, boxShadow: C.shadow }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{weather.emoji}</span>
        <div>
          <p style={{ fontWeight: "800", fontSize: "13px", color: C.text, fontFamily: "Nunito", margin: 0 }}>{weather.condition} · {weather.temperature}°C</p>
          <p style={{ fontSize: "11px", color: C.textMid, fontFamily: "Nunito", margin: 0 }}>{weather.tip}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
        <span style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito" }}>💨 {weather.wind_speed} km/h</span>
        <span style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito" }}>💧 {weather.humidity}%</span>
      </div>
    </div>
  );
}

// ── Activity Suggestion ────────────────────────────────────
function ActivitySuggestion({ weather, onExplore, C }) {
  if (!weather?.activity) return null;
  return (
    <div className="rounded-2xl p-4 mb-3 cursor-pointer transition-all duration-200"
      style={{ background: C.primaryGrad, border: `2px solid ${C.primaryDark}` }}
      onClick={() => onExplore(weather.activity.place_type)}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p style={{ fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", margin: "0 0 4px 0" }}>✨ suggested for you right now</p>
          <p style={{ fontWeight: "800", color: "white", fontSize: "14px", fontFamily: "Nunito", margin: "0 0 4px 0" }}>{weather.activity.suggestion}</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", margin: 0 }}>{weather.activity.reason}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}>
          <span className="text-xl">{weather.emoji}</span>
        </div>
      </div>
      <div className="mt-3">
        <span style={{ fontSize: "11px", fontWeight: "800", padding: "4px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.25)", color: "white", fontFamily: "Nunito" }}>
          find quiet {weather.activity.place_type}s nearby →
        </span>
      </div>
    </div>
  );
}

// ── Heatmap ────────────────────────────────────────────────
function HeatMap({ places, small = false, transport = { metro: [], buses: [] }, C }) {
  const center = [25.2048, 55.2708];
  const zoom = small ? 13 : 12;
  const height = small ? "160px" : "240px";
  const colorMap = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };

  return (
    <div style={{ height, borderRadius: "16px", overflow: "hidden", border: `2px solid ${C.border}` }}>
      <MapContainer center={center} zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={!small} scrollWheelZoom={false} dragging={!small}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors' />
        {places.map((place) => (
          <CircleMarker key={place.id} center={[place.lat, place.lng]}
            radius={small ? 10 : place.crowd_score * 2 + 6}
            fillColor={colorMap[place.crowd_color] || "#94a3b8"}
            color={colorMap[place.crowd_color] || "#94a3b8"}
            weight={2} opacity={0.9} fillOpacity={0.45}>
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "800", color: "#0369a1", fontFamily: "Nunito" }}>{place.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "Nunito" }}>{place.crowd_label} · {place.wait_time}</div>
            </LeafletTooltip>
          </CircleMarker>
        ))}
        {!small && transport.metro.map((station) => (
          <CircleMarker key={station.id} center={[station.lat, station.lng]}
            radius={10} fillColor={colorMap[station.crowd_color] || "#94a3b8"}
            color="white" weight={2} opacity={1} fillOpacity={0.85}>
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "800", color: "#0369a1", fontFamily: "Nunito" }}>🚇 {station.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "Nunito" }}>{station.line} · {station.crowd_label}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "Nunito" }}>⏱ {station.frequency}</div>
              <div style={{ fontSize: "12px", color: "#ef4444", fontFamily: "Nunito" }}>Next peak: {station.next_peak}</div>
            </LeafletTooltip>
          </CircleMarker>
        ))}
        {!small && transport.buses.map((stop) => (
          <CircleMarker key={stop.id} center={[stop.lat, stop.lng]}
            radius={8} fillColor={colorMap[stop.crowd_color] || "#94a3b8"}
            color="white" weight={2} opacity={1} fillOpacity={0.85} dashArray="4">
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "800", color: "#0369a1", fontFamily: "Nunito" }}>🚌 {stop.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "Nunito" }}>{stop.route} · {stop.crowd_label}</div>
              <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "Nunito" }}>⏱ {stop.frequency}</div>
              <div style={{ fontSize: "12px", color: "#ef4444", fontFamily: "Nunito" }}>Next peak: {stop.next_peak}</div>
            </LeafletTooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

// ── Crowd Badge ────────────────────────────────────────────
function CrowdBadge({ color, label }) {
  const styles = {
    green: { bg: "#dcfce7", text: "#166534", dot: "#22c55e", border: "#86efac" },
    yellow: { bg: "#fef9c3", text: "#854d0e", dot: "#eab308", border: "#fde047" },
    red: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", border: "#fca5a5" },
  };
  const s = styles[color] || styles.green;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", background: s.bg, color: s.text, border: `1.5px solid ${s.border}`, fontFamily: "Nunito" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.dot, display: "inline-block" }}></span>
      {label}
    </span>
  );
}

// ── Place Card ─────────────────────────────────────────────
function PlaceCard({ place, onClick, C }) {
  return (
    <div onClick={() => onClick(place)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200 fade-in"
      style={{ background: C.bgCard, border: `2px solid ${C.border}`, boxShadow: C.shadow }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 4px 24px rgba(14,165,233,0.2)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = C.shadow; }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 style={{ fontWeight: "900", fontSize: "16px", color: C.text, fontFamily: "Nunito", margin: 0 }}>{place.name}</h3>
          <p style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito", margin: "2px 0 0 0" }}>📍 {place.address}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "10px", background: C.bgDeep, border: `1.5px solid ${C.border}`, marginLeft: "8px" }}>
          <span>⭐</span>
          <span style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: "Nunito" }}>{place.rating}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
        <CrowdBadge color={place.crowd_color} label={place.crowd_label} />
        <span style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito" }}>⏱ {place.wait_time}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
        <span style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito" }}>best time:</span>
        <span style={{ fontSize: "11px", fontWeight: "800", color: C.text, fontFamily: "Nunito" }}>{place.best_time}</span>
      </div>
      {place.cost_label && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", fontFamily: "Nunito", color: C.text }}>
            {place.cost_label}
          </span>
          <span style={{ fontSize: "11px", fontFamily: "Nunito", color: C.textLight }}>
            {place.cost_range}
          </span>
        </div>
      )}
      {place.top_items?.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
          {place.top_items.map((item, i) => (
            <span key={i} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: C.bgDeep, color: C.textMid, border: `1px solid ${C.border}`, fontFamily: "Nunito", fontWeight: "700" }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Crowd Chart ────────────────────────────────────────────
function CrowdChart({ hourly, quietWindow, C }) {
  const hours = hourly.map((value, i) => ({
    time: i === 0 ? "12am" : i === 6 ? "6am" : i === 12 ? "12pm" : i === 18 ? "6pm" : i === 23 ? "11pm" : `${i}`,
    crowd: value,
  }));
  const getColor = (v) => v <= 3 ? "#22c55e" : v <= 6 ? "#eab308" : "#ef4444";
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: C.bgDeep, border: `2px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: 0 }}>📊 today's crowd forecast</p>
        <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "800", background: "#dcfce7", color: "#166534", fontFamily: "Nunito" }}>
          🕐 quietest: {quietWindow}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={hours} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
          <defs>
            <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.primary} stopOpacity={0.4} />
              <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.textLight, fontFamily: "Nunito" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.textLight, fontFamily: "Nunito" }} tickLine={false} axisLine={false} domain={[0, 10]} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: `1px solid ${C.border}`, fontSize: "12px", background: C.bgCard, fontFamily: "Nunito" }}
            formatter={(v) => [<span style={{ color: getColor(v), fontWeight: "800" }}>{v}/10</span>, "crowd"]} />
          <Area type="monotone" dataKey="crowd" stroke={C.primary} strokeWidth={2.5} fill="url(#cGrad)" />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: C.textLight, fontFamily: "Nunito", fontWeight: "700" }}>
        <span>🟢 quiet 1-3</span>
        <span>🟡 moderate 4-6</span>
        <span>🔴 busy 7-10</span>
      </div>
    </div>
  );
}

// ── Place Detail ───────────────────────────────────────────
function PlaceDetail({ place, onClose, C }) {
  const crowdStyles = {
    green: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    yellow: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
    red: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  };
  const s = crowdStyles[place.crowd_color] || crowdStyles.green;
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
      style={{ background: "rgba(12,26,46,0.7)" }}>
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto slide-up"
        style={{ background: C.bgCard, maxHeight: "90vh", border: `2px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "24px", color: C.text, margin: 0 }}>{place.name}</h2>
            <p style={{ color: C.textLight, fontFamily: "Nunito", margin: "4px 0 0 0" }}>📍 {place.address}</p>
          </div>
          <button onClick={onClose}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: C.bgDeep, color: C.text, border: `2px solid ${C.border}`, fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div className="rounded-2xl p-4 mb-4" style={{ background: s.bg, border: `2px solid ${s.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "22px", fontWeight: "900", color: s.text, fontFamily: "Nunito", margin: 0 }}>{place.crowd_label}</p>
              <p style={{ fontSize: "12px", color: s.text, opacity: 0.75, fontFamily: "Nunito", margin: 0 }}>right now</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "30px", fontWeight: "900", color: C.text, fontFamily: "Nunito", margin: 0 }}>
                {place.crowd_score}<span style={{ fontSize: "16px", color: C.textLight }}>/10</span>
              </p>
              <p style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>crowd score</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: "Nunito", marginBottom: "8px" }}>🗺 area crowd map</p>
          <HeatMap places={[place]} small={true} C={C} />
        </div>
        {place.hourly_crowd && <CrowdChart hourly={place.hourly_crowd} quietWindow={place.quiet_window} C={C} />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "wait time", value: place.wait_time },
            { label: "best time today", value: place.best_time },
            { label: "rating", value: `⭐ ${place.rating}` },
            { label: "type", value: place.type },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: C.bgDeep, border: `1.5px solid ${C.border}` }}>
              <p style={{ fontSize: "10px", color: C.textLight, fontFamily: "Nunito", fontWeight: "700", margin: "0 0 4px 0" }}>{stat.label}</p>
              <p style={{ fontWeight: "800", textTransform: "capitalize", color: C.text, fontFamily: "Nunito", margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>
        {place.top_items?.length > 0 && (
          <div className="mb-4">
            <p style={{ fontSize: "13px", fontWeight: "800", color: C.text, fontFamily: "Nunito", marginBottom: "8px" }}>🍽 what to order</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {place.top_items.map((item, i) => (
                <span key={i} style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", background: C.bgDeep, color: C.text, border: `1.5px solid ${C.border}`, fontFamily: "Nunito" }}>{item}</span>
              ))}
            </div>
          </div>
        )}
        <button className="w-full py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: C.primaryGrad, fontFamily: "Nunito", fontSize: "15px" }}>
          🧭 get directions
        </button>
      </div>
    </div>
  );
}

function TripPlanner({ C, onClose, weather }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const questions = [
    {
      id: "duration",
      question: "How long is your trip? ⏰",
      options: [
        { label: "Few hours", emoji: "⚡", value: "few_hours" },
        { label: "Half day", emoji: "🌅", value: "half_day" },
        { label: "Full day", emoji: "☀️", value: "full_day" },
        { label: "Weekend", emoji: "🗓️", value: "weekend" },
      ]
    },
    {
      id: "vibe",
      question: "What's your trip vibe? ✨",
      options: [
        { label: "Relaxed & quiet", emoji: "🌿", value: "relaxed" },
        { label: "Cultural & historic", emoji: "🏛️", value: "cultural" },
        { label: "Active & outdoorsy", emoji: "🏃", value: "active" },
        { label: "Foodie adventure", emoji: "🍽️", value: "foodie" },
      ]
    },
    {
      id: "budget",
      question: "What's your budget? 💰",
      options: [
        { label: "Free only", emoji: "💚", value: "free" },
        { label: "Budget friendly", emoji: "💛", value: "budget" },
        { label: "Moderate", emoji: "🟠", value: "moderate" },
        { label: "Premium", emoji: "🔴", value: "premium" },
      ]
    }
  ];

  const TRIP_PLANS = {
    relaxed_free: [
      { time: "7:00 AM", place: "Kite Beach", type: "beach", tip: "Early morning — barely anyone here!", crowd: "green" },
      { time: "10:00 AM", place: "Coffee Museum", type: "museum", tip: "Free entry, cozy and quiet", crowd: "green" },
      { time: "12:00 PM", place: "Al Fahidi Historic District", type: "museum", tip: "Peaceful old Dubai vibes", crowd: "green" },
      { time: "3:00 PM", place: "Creek Park", type: "park", tip: "Beautiful waterfront, less crowded on weekdays", crowd: "yellow" },
      { time: "6:00 PM", place: "Sunset Beach", type: "beach", tip: "Best sunset view in Dubai — Burj Al Arab backdrop!", crowd: "yellow" },
    ],
    cultural_budget: [
      { time: "8:00 AM", place: "Dubai Museum", type: "museum", tip: "Only AED 3! Mornings are quietest", crowd: "green" },
      { time: "10:00 AM", place: "Al Fahidi Historic District", type: "museum", tip: "Free walking tour of old Dubai", crowd: "green" },
      { time: "12:00 PM", place: "Ravi Restaurant", type: "restaurant", tip: "Legendary budget food — AED 15-40", crowd: "yellow" },
      { time: "2:00 PM", place: "Etihad Museum", type: "museum", tip: "AED 25 — UAE history beautifully told", crowd: "green" },
      { time: "5:00 PM", place: "Arabian Tea House", type: "restaurant", tip: "Perfect evening tea spot", crowd: "yellow" },
    ],
    active_free: [
      { time: "6:00 AM", place: "Kite Beach", type: "beach", tip: "Morning jog on the beach — perfect!", crowd: "green" },
      { time: "8:00 AM", place: "Al Safa Park", type: "park", tip: "Great outdoor gym equipment", crowd: "green" },
      { time: "11:00 AM", place: "Mushrif Park", type: "park", tip: "Huge park — cycling and walking trails", crowd: "green" },
      { time: "3:00 PM", place: "JBR Beach", type: "beach", tip: "Beach volleyball and swimming", crowd: "yellow" },
      { time: "6:00 PM", place: "Zabeel Park", type: "park", tip: "Evening walk — beautiful lights", crowd: "yellow" },
    ],
    foodie_budget: [
      { time: "8:00 AM", place: "Arabian Tea House", type: "restaurant", tip: "Best Arabic breakfast in Dubai!", crowd: "green" },
      { time: "11:00 AM", place: "Nightjar Coffee", type: "cafe", tip: "Trendy Al Quoz cafe — very chill", crowd: "green" },
      { time: "1:00 PM", place: "Operation Falafel", type: "restaurant", tip: "Best falafel wrap — AED 20!", crowd: "yellow" },
      { time: "4:00 PM", place: "% Arabica", type: "cafe", tip: "Instagram-worthy coffee — must try!", crowd: "yellow" },
      { time: "7:00 PM", place: "Ravi Restaurant", type: "restaurant", tip: "Legendary dinner spot — always packed but worth it!", crowd: "red" },
    ],
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generatePlan(newAnswers);
    }
  };

  const generatePlan = (ans) => {
    setLoading(true);
    setTimeout(() => {
      const key = `${ans.vibe}_${ans.budget}`;
      const selectedPlan = TRIP_PLANS[key] || TRIP_PLANS.relaxed_free;
      setPlan(selectedPlan);
      setLoading(false);
    }, 1500);
  };

  const crowdColors = {
    green: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
    yellow: { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
    red: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  };

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: C.bg }}>
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
        style={{ borderColor: C.primary, borderTopColor: "transparent" }}></div>
      <p style={{ color: C.text, fontFamily: "Nunito", fontWeight: "700" }}>building your perfect day... 🗺️</p>
    </div>
  );

  const TRANSPORT = {
    beach: "🚌 Bus Route 8 or 🚕 Taxi (~15 mins)",
    museum: "🚇 Metro Red Line or 🚌 Bus (~20 mins)",
    cafe: "🚕 Taxi or 🚶 Walk (~10 mins)",
    park: "🚌 Bus or 🚕 Taxi (~15 mins)",
    restaurant: "🚶 Walk or 🚕 Taxi (~10 mins)",
    gym: "🚇 Metro or 🚕 Taxi (~20 mins)",
    mall: "🚇 Metro Red Line (~25 mins)",
    wellness: "🚕 Taxi (~20 mins)",
  };

  if (showMap && plan) return (
    <div className="fixed inset-0 z-50 slide-up" style={{ background: C.bg, overflowY: "auto" }}>
      <div style={{ background: C.primaryGrad, padding: "20px 16px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <button onClick={() => setShowMap(false)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            ← back
          </button>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            done ✓
          </button>
        </div>
        <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "24px", color: "white", margin: "0 0 4px" }}>your route 🗺️</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", fontSize: "12px", margin: 0 }}>optimized crowd-free path ✨</p>
      </div>

      <div style={{ padding: "16px" }}>

        {/* Weather card */}
        {weather && (
          <div style={{ background: C.bgCard, borderRadius: "16px", padding: "14px", marginBottom: "16px", border: `2px solid ${C.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px" }}>{weather.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: "0 0 2px", fontSize: "14px" }}>today's weather</p>
              <p style={{ fontWeight: "700", color: C.textMid, fontFamily: "Nunito", margin: "0 0 2px", fontSize: "13px" }}>{weather.condition} · {weather.temperature}°C</p>
              <p style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>💨 {weather.wind_speed} km/h · 💧 {weather.humidity}%</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ padding: "4px 10px", borderRadius: "10px", background: weather.indoor_recommended ? "#fee2e2" : "#dcfce7", fontSize: "11px", fontWeight: "800", fontFamily: "Nunito", color: weather.indoor_recommended ? "#991b1b" : "#166534" }}>
                {weather.indoor_recommended ? "🏠 stay indoor" : "🌿 great outdoor"}
              </div>
            </div>
          </div>
        )}

        {/* Real Map */}
        <div style={{ borderRadius: "16px", overflow: "hidden", border: `2px solid ${C.border}`, marginBottom: "16px", height: "250px" }}>
          <MapContainer
            center={[plan[0].lat || 25.2048, plan[0].lng || 55.2708]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors' />
            {plan.map((stop, i) => {
              const coords = {
                "Kite Beach": [25.1551, 55.1936],
                "JBR Beach": [25.0777, 55.1298],
                "La Mer Beach": [25.2197, 55.2627],
                "Sunset Beach": [25.1234, 55.1456],
                "Dubai Museum": [25.2632, 55.2976],
                "Dubai Frame": [25.2351, 55.3005],
                "Etihad Museum": [25.2285, 55.2734],
                "Coffee Museum": [25.2634, 55.2978],
                "Al Fahidi Historic District": [25.2634, 55.2978],
                "Creek Park": [25.2285, 55.3275],
                "Al Safa Park": [25.1890, 55.2364],
                "Zabeel Park": [25.2307, 55.3024],
                "Mushrif Park": [25.2614, 55.4197],
                "Ravi Restaurant": [25.2334, 55.2785],
                "Arabian Tea House": [25.2634, 55.2978],
                "Operation Falafel": [25.2048, 55.2708],
                "Nightjar Coffee": [25.2112, 55.2698],
                "% Arabica": [25.1985, 55.2765],
                "Sip & Work": [25.2035, 55.2695],
              };
              const pos = coords[stop.place] || [25.2048 + i * 0.01, 55.2708 + i * 0.01];
              const crowdColorMap = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };
              return (
                <CircleMarker key={i} center={pos}
                  radius={14}
                  fillColor={crowdColorMap[stop.crowd]}
                  color="white"
                  weight={3}
                  fillOpacity={0.9}>
                  <LeafletTooltip direction="top" permanent={false} opacity={1}>
                    <div style={{ fontWeight: "800", color: "#0369a1", fontFamily: "Nunito" }}>
                      {i + 1}. {stop.place}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "Nunito" }}>
                      {stop.time} · {stop.crowd === "green" ? "🟢 quiet" : stop.crowd === "yellow" ? "🟡 moderate" : "🔴 busy"}
                    </div>
                  </LeafletTooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Route stops with transport */}
        <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", fontSize: "15px", marginBottom: "12px" }}>🚏 route details</p>
        {plan.map((stop, i) => {
          const crowdColors = {
            green: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
            yellow: { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
            red: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
          };
          const cc = crowdColors[stop.crowd];
          return (
            <div key={i}>
              {/* Stop card */}
              <div style={{ background: C.bgCard, borderRadius: "16px", padding: "14px", border: `2px solid ${C.border}`, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.primaryGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Nunito", fontWeight: "900", fontSize: "16px", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontWeight: "900", color: C.text, fontFamily: "Nunito", margin: "0 0 2px", fontSize: "14px" }}>{stop.place}</p>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: "800", background: cc.bg, color: cc.text, fontFamily: "Nunito", flexShrink: 0, marginLeft: "8px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cc.dot, display: "inline-block", marginRight: "4px" }}></span>
                      {stop.crowd === "green" ? "quiet" : stop.crowd === "yellow" ? "moderate" : "busy"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: C.textMid, fontFamily: "Nunito", margin: "0 0 4px", fontWeight: "700" }}>⏰ {stop.time}</p>
                  <p style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>💡 {stop.tip}</p>
                </div>
              </div>

              {/* Transport between stops */}
              {i < plan.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", margin: "4px 0" }}>
                  <div style={{ width: "2px", height: "30px", background: C.border, marginLeft: "17px" }}></div>
                  <div style={{ background: C.bgDeep, borderRadius: "10px", padding: "6px 12px", border: `1px solid ${C.border}`, flex: 1 }}>
                    <p style={{ fontSize: "11px", color: C.textMid, fontFamily: "Nunito", fontWeight: "700", margin: 0 }}>
                      {TRANSPORT[stop.type] || "🚕 Taxi or 🚶 Walk (~10 mins)"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Public transport tips */}
        <div style={{ background: C.bgCard, borderRadius: "16px", padding: "14px", border: `2px solid ${C.border}`, marginTop: "12px", marginBottom: "12px" }}>
          <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", fontSize: "14px", margin: "0 0 10px" }}>🚇 public transport tips</p>
          {[
            { emoji: "🚇", tip: "Metro runs 5:30am - midnight (Fri: 10am start)" },
            { emoji: "🚌", tip: "Buses cover most areas — check RTA app for routes" },
            { emoji: "💳", tip: "Get a Nol card — works on metro, bus and tram" },
            { emoji: "⏰", tip: "Avoid metro 7-9am and 5-8pm peak hours" },
            { emoji: "🌡️", tip: weather?.temperature > 35 ? "Very hot today — use air-conditioned transport!" : "Good weather for short walks between stops!" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "6px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: "16px" }}>{item.emoji}</span>
              <p style={{ fontSize: "12px", color: C.textMid, fontFamily: "Nunito", fontWeight: "600", margin: 0 }}>{item.tip}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: C.primaryGrad, fontFamily: "Nunito", fontSize: "15px", border: "none", cursor: "pointer" }}>
          start my trip! 🚀
        </button>
      </div>
    </div>
  );

  if (plan) return (
    <div className="fixed inset-0 z-50 slide-up" style={{ background: C.bg, overflowY: "auto" }}>
      <div style={{ background: C.primaryGrad, padding: "20px 16px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            ← back
          </button>
          <button onClick={() => { setStep(0); setAnswers({}); setPlan(null); }}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            replan 🔄
          </button>
        </div>
        <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "26px", color: "white", margin: "0 0 6px" }}>your day plan 🗺️</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", fontSize: "13px", margin: 0 }}>optimized for minimum crowds ✨</p>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Weather tip */}
        {weather && (
          <div style={{ background: C.bgCard, borderRadius: "16px", padding: "12px", marginBottom: "16px", border: `2px solid ${C.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>{weather.emoji}</span>
            <div>
              <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: 0, fontSize: "13px" }}>today: {weather.condition} · {weather.temperature}°C</p>
              <p style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>{weather.tip}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {plan.map((stop, i) => {
          const cc = crowdColors[stop.crowd];
          return (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: C.primaryGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Nunito", fontWeight: "900", fontSize: "11px", flexShrink: 0 }}>
                  {stop.time.replace(":00", "")}
                </div>
                {i < plan.length - 1 && (
                  <div style={{ width: "2px", flex: 1, background: C.border, margin: "4px 0" }}></div>
                )}
              </div>
              <div style={{ flex: 1, background: C.bgCard, borderRadius: "16px", padding: "12px", border: `2px solid ${C.border}`, marginBottom: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <p style={{ fontWeight: "900", color: C.text, fontFamily: "Nunito", margin: 0, fontSize: "14px" }}>{stop.place}</p>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "800", background: cc.bg, color: cc.text, fontFamily: "Nunito", flexShrink: 0, marginLeft: "8px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cc.dot, display: "inline-block", marginRight: "4px" }}></span>
                    {stop.crowd === "green" ? "quiet" : stop.crowd === "yellow" ? "moderate" : "busy"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>💡 {stop.tip}</p>
              </div>
            </div>
          );
        })}

        <button onClick={() => setShowMap(true)}
          className="w-full py-3 rounded-xl font-bold text-white mt-2"
          style={{ background: C.primaryGrad, fontFamily: "Nunito", fontSize: "15px", border: "none", cursor: "pointer" }}>
          let's go! 🗺️
        </button>
      </div>
    </div>
  );

  const q = questions[step];
  const progress = (step / questions.length) * 100;

  return (
    <div className="fixed inset-0 flex flex-col z-50 p-6" style={{ background: C.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "22px", color: C.text, margin: 0 }}>trip planner</h2>
        <button onClick={onClose}
          style={{ background: C.bgCard, border: `2px solid ${C.border}`, borderRadius: "10px", padding: "6px 12px", color: C.text, cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
          ✕
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.textMid, fontFamily: "Nunito", fontWeight: "700", fontSize: "12px", marginBottom: "6px" }}>
          <span>step {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: "6px", borderRadius: "10px", background: C.border }}>
          <div style={{ height: "100%", borderRadius: "10px", background: C.primaryGrad, width: `${progress}%`, transition: "width 0.4s ease" }}></div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: C.primaryGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 20px" }}>
          🗺️
        </div>
        <h3 style={{ textAlign: "center", fontFamily: "Nunito", fontWeight: "900", fontSize: "20px", color: C.text, marginBottom: "24px" }}>{q.question}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(q.id, opt.value)}
              style={{ padding: "14px 20px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px", background: C.bgCard, border: `2px solid ${C.border}`, cursor: "pointer", color: C.text, fontFamily: "Nunito", fontWeight: "700", fontSize: "14px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.bgDeep; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; }}>
              <span style={{ fontSize: "22px" }}>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ C, currentUser, userProfile, onRetakeQuiz, onTripPlanner, onClose, onLogout }) {

  return (
    <div className="fixed inset-0 z-50 slide-up" style={{ background: C.bg, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ background: C.primaryGrad, padding: "20px 16px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            ← back
          </button>
          <button onClick={onLogout}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 14px", color: "white", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
            logout
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "0 auto 12px" }}>
            {userProfile?.emoji || "👤"}
          </div>
          <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: "26px", color: "white", margin: "0 0 4px" }}>{currentUser?.name}</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", fontSize: "13px", margin: 0 }}>{currentUser?.email}</p>
          {userProfile && (
            <div style={{ display: "inline-block", marginTop: "10px", padding: "6px 16px", borderRadius: "20px", background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
              {userProfile.emoji} {userProfile.title}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "16px", marginTop: "-40px" }}>
      </div>

      {/* Vibe section */}
      <div style={{ background: C.bgCard, borderRadius: "20px", padding: "16px", border: `2px solid ${C.border}`, marginBottom: "12px" }}>
        <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: "0 0 12px", fontSize: "15px" }}>✨ your vibe</p>
        {userProfile ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "32px" }}>{userProfile.emoji}</span>
              <div>
                <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: 0 }}>{userProfile.title}</p>
                <p style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>{userProfile.description}</p>
              </div>
            </div>
            <button onClick={onRetakeQuiz}
              style={{ padding: "6px 14px", borderRadius: "12px", background: C.primaryGrad, color: "white", border: "none", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "12px" }}>
              retake
            </button>
          </div>
        ) : (
          <button onClick={onRetakeQuiz}
            style={{ width: "100%", padding: "12px", borderRadius: "14px", background: C.primaryGrad, color: "white", border: "none", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "14px" }}>
            take the quiz →
          </button>
        )}
      </div>

      {/* Settings */}
      <div style={{ background: C.bgCard, borderRadius: "20px", padding: "16px", border: `2px solid ${C.border}`, marginBottom: "12px" }}>
        <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: "0 0 12px", fontSize: "15px" }}>⚙️ settings</p>
        {[
          { label: "Notifications", emoji: "🔔", value: "Coming soon" },
          { label: "Location sharing", emoji: "📍", value: "Coming soon" },
          { label: "Vibe matching", emoji: "🤝", value: "Coming soon" },
          { label: "Language", emoji: "🌍", value: "English" },
        ].map((setting, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>{setting.emoji}</span>
              <span style={{ fontWeight: "700", color: C.text, fontFamily: "Nunito", fontSize: "13px" }}>{setting.label}</span>
            </div>
            <span style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito" }}>{setting.value}</span>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{ background: C.bgCard, borderRadius: "20px", padding: "16px", border: `2px solid ${C.border}`, marginBottom: "12px" }}>
        <p style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: "0 0 12px", fontSize: "15px" }}>ℹ️ about</p>
        {[
          { label: "Version", value: "v1.0 beta" },
          { label: "Made for", value: "Dubai 🇦🇪" },
          { label: "Data", value: "Pattern-based + Live weather" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontWeight: "700", color: C.text, fontFamily: "Nunito", fontSize: "13px" }}>{item.label}</span>
            <span style={{ fontSize: "12px", color: C.textLight, fontFamily: "Nunito" }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Trip Planner teaser */}
      <div style={{ background: C.primaryGrad, borderRadius: "20px", padding: "16px", marginBottom: "12px" }}>
        <p style={{ fontWeight: "800", color: "white", fontFamily: "Nunito", margin: "0 0 6px", fontSize: "15px" }}>🗺️ AI Trip Planner</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", margin: "0 0 12px" }}>Plan your perfect Dubai day — crowd-free!</p>
        <button onClick={onTripPlanner}
          style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.25)", color: "white", border: "2px solid rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "Nunito", fontWeight: "800", fontSize: "13px" }}>
          plan my day →
        </button>
      </div>

      <button onClick={onLogout}
        className="w-full py-3 rounded-xl font-bold text-white"
        style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", fontFamily: "Nunito", fontSize: "15px", border: "none", cursor: "pointer" }}>
        logout 👋
      </button>
    </div>

  );
}

// ── Chatbot ────────────────────────────────────────────────
function Chatbot({ C }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm your CrowdLess AI. Ask me anything like 'Where's quiet right now?' or 'Best cafe with no wait?'" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim() || typing) return;
    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: "bot", text: "Sorry, having trouble connecting! 🌊" }]);
    }
    setTyping(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 rounded-3xl shadow-2xl overflow-hidden z-50 slide-up"
          style={{ background: C.bgCard, border: `2px solid ${C.border}` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.primaryGrad }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p style={{ color: "white", fontWeight: "800", fontSize: "14px", fontFamily: "Nunito", margin: 0 }}>CrowdLess AI</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontFamily: "Nunito", margin: 0 }}>powered by Gemini ✨</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: "white", fontSize: "22px", background: "none", border: "none", cursor: "pointer" }}>×</button>
          </div>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto" style={{ height: "260px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  padding: "8px 12px", borderRadius: "16px", fontSize: "13px", maxWidth: "220px",
                  background: msg.from === "user" ? C.primaryGrad : C.bgDeep,
                  color: msg.from === "user" ? "white" : C.text,
                  border: msg.from === "bot" ? `1.5px solid ${C.border}` : "none",
                  fontFamily: "Nunito", fontWeight: "600"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "8px 12px", borderRadius: "16px", fontSize: "13px", background: C.bgDeep, color: C.textLight, border: `1.5px solid ${C.border}`, fontFamily: "Nunito" }}>
                  typing...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 flex gap-2" style={{ borderTop: `2px solid ${C.border}` }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="ask me anything..."
              style={{ flex: 1, fontSize: "13px", padding: "8px 12px", borderRadius: "12px", outline: "none", background: C.bgDeep, color: C.text, border: `1.5px solid ${C.border}`, fontFamily: "Nunito" }} />
            <button onClick={send}
              style={{ padding: "8px 14px", borderRadius: "12px", color: "white", fontWeight: "800", fontSize: "14px", background: C.primaryGrad, border: "none", cursor: "pointer", fontFamily: "Nunito" }}>
              →
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 text-2xl transition-all"
        style={{ background: C.primaryGrad, border: `3px solid ${C.bgCard}` }}>
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCost, setActiveCost] = useState("");
  const [weather, setWeather] = useState(null);
  const [transport, setTransport] = useState({ metro: [], buses: [] });

  const C = darkMode ? DARK : LIGHT;
  const filters = ["all", "cafe", "park", "beach", "museum", "restaurant", "gym", "mall", "wellness"];

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const fetchPlaces = async (searchQuery, type, cost = "") => {
    setLoading(true);
    try {
      const typeParam = type === "all" ? "" : type;
      const res = await fetch(`http://127.0.0.1:8000/api/places/search?query=${searchQuery}&type=${typeParam}&cost=${cost}`);
      const data = await res.json();
      setPlaces(data.places);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/weather/current");
      const data = await res.json();
      setWeather(data);
    } catch (err) { console.error(err); }
  };

  const fetchTransport = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/transport/all");
      const data = await res.json();
      setTransport(data);
    } catch (err) { console.error(err); }
  };

  const handleActivityExplore = (placeType) => {
    setActiveFilter(placeType);
    fetchPlaces("", placeType);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  useEffect(() => {
    fetchPlaces("", "all");
    fetchWeather();
    fetchTransport();
  }, []);

  if (showSplash) return <SplashScreen onDone={() => {
    setShowSplash(false);
    if (!currentUser) { setShowAuth(true); }
    else if (!userProfile) { setShowQuiz(true); }
  }} />;
  if (showAuth) return <AuthScreen C={C} onDone={(user) => {
    setCurrentUser(user);
    setShowAuth(false);
    setShowQuiz(true);
  }} />;
  if (showQuiz) return <QuizScreen C={C} onDone={(profile) => {
    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    // Save vibe to backend
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/api/auth/update-vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          vibe: profile.vibe || "bookworm",
          vibe_emoji: profile.emoji,
          vibe_title: profile.title
        })
      });
    }
    setShowQuiz(false);
  }} />;
  if (showProfile) return <ProfilePage C={C} currentUser={currentUser} userProfile={userProfile}
    onRetakeQuiz={() => { setShowProfile(false); setShowQuiz(true); }}
    onTripPlanner={() => { setShowProfile(false); setShowTripPlanner(true); }}
    onClose={() => setShowProfile(false)}
    onLogout={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      setCurrentUser(null);
      setUserProfile(null);
      setShowProfile(false);
      setShowAuth(true);
    }}
  />;
  if (showTripPlanner) return <TripPlanner C={C} weather={weather} onClose={() => setShowTripPlanner(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div className="sticky top-0 z-40" style={{ background: C.bgHeader, boxShadow: "0 2px 20px rgba(14,165,233,0.3)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🌿
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "Pacifico, cursive", fontSize: "22px", color: "white", margin: 0 }}>CrowdLess</h1>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", margin: 0 }}>find your calm place ✨</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {currentUser && (
                <button onClick={() => setShowProfile(true)}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer" }}>
                  <span style={{ fontSize: "18px" }}>{userProfile?.emoji || "👤"}</span>
                  <span style={{ fontSize: "12px", color: "white", fontFamily: "Nunito", fontWeight: "700" }}>{currentUser.name}</span>
                </button>
              )}
              <button onClick={() => setDarkMode(!darkMode)}
                style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); fetchPlaces(query, activeFilter); }} style={{ display: "flex", gap: "8px" }}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="search cafes, parks, gyms..."
              style={{ flex: 1, padding: "10px 16px", fontSize: "13px", borderRadius: "12px", outline: "none", background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.3)", fontFamily: "Nunito", fontWeight: "600" }}
              onFocus={e => e.target.style.background = "rgba(255,255,255,0.3)"}
              onBlur={e => e.target.style.background = "rgba(255,255,255,0.2)"} />
            <button type="submit"
              style={{ padding: "10px 20px", borderRadius: "12px", fontWeight: "800", color: C.primary, background: "white", border: "none", cursor: "pointer", fontFamily: "Nunito", fontSize: "13px" }}>
              search
            </button>
          </form>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            {filters.map(filter => (
              <button key={filter}
                onClick={() => { setActiveFilter(filter); fetchPlaces(query, filter); }}
                style={{
                  padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", whiteSpace: "nowrap", cursor: "pointer", fontFamily: "Nunito", transition: "all 0.2s",
                  background: activeFilter === filter ? "white" : "rgba(255,255,255,0.2)",
                  color: activeFilter === filter ? C.primary : "white",
                  border: `2px solid ${activeFilter === filter ? "white" : "rgba(255,255,255,0.3)"}`,
                }}>
                {filter}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px", overflowX: "auto", paddingBottom: "4px" }}>
            {["all costs", "free", "budget", "moderate", "premium"].map(cost => (
              <button key={cost}
                onClick={() => { setActiveCost(cost === "all costs" ? "" : cost); fetchPlaces(query, activeFilter, cost === "all costs" ? "" : cost); }}
                style={{
                  padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap", cursor: "pointer", fontFamily: "Nunito",
                  background: activeCost === (cost === "all costs" ? "" : cost) ? "white" : "rgba(255,255,255,0.2)",
                  color: activeCost === (cost === "all costs" ? "" : cost) ? C.primary : "white",
                  border: `2px solid ${activeCost === (cost === "all costs" ? "" : cost) ? "white" : "rgba(255,255,255,0.3)"}`,
                }}>
                {cost}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <WeatherBar weather={weather} C={C} />
        <ActivitySuggestion weather={weather} onExplore={handleActivityExplore} C={C} />

        {/* Map */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: C.bgCard, border: `2px solid ${C.border}`, boxShadow: C.shadow }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "800", color: C.text, fontFamily: "Nunito", margin: 0, fontSize: "15px" }}>📍 area crowd map</h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "11px", color: C.textLight, fontFamily: "Nunito", fontWeight: "700" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>quiet</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308", display: "inline-block" }}></span>moderate</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }}></span>busy</span>
              <span>🚇 metro</span>
              <span>🚌 bus</span>
            </div>
          </div>
          <HeatMap places={places} transport={transport} C={C} />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4"
              style={{ borderColor: C.primary, borderTopColor: "transparent" }}></div>
            <p style={{ color: C.textMid, fontFamily: "Nunito", fontWeight: "700" }}>finding quiet places...</p>
          </div>
        ) : (
          <>
            {userProfile && (
              <div className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3"
                style={{ background: C.bgCard, border: `2px solid ${C.border}` }}>
                <span className="text-2xl">{userProfile.emoji}</span>
                <div>
                  <p style={{ fontWeight: "800", fontSize: "13px", color: C.text, fontFamily: "Nunito", margin: 0 }}>{userProfile.title}</p>
                  <p style={{ fontSize: "11px", color: C.textLight, fontFamily: "Nunito", margin: 0 }}>showing places matched to your vibe</p>
                </div>
              </div>
            )}
            <p style={{ fontSize: "13px", marginBottom: "16px", color: C.textLight, fontFamily: "Nunito", fontWeight: "700" }}>
              {places.length} places found — sorted by quietest first 🌊
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {places.map(place => (
                <PlaceCard key={place.id} place={place} onClick={setSelectedPlace} C={C} />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedPlace && <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} C={C} />}
      <Chatbot C={C} />
    </div>
  );
}