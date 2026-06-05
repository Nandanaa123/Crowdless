import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  primary: "#f9a86c",
  primaryDark: "#e8924a",
  secondary: "#c8e6a0",
  secondaryDark: "#98c670",
  accent: "#a8d4f0",
  bg: "#fdf6ee",
  bgCard: "#fffaf5",
  textDark: "#c47a3a",
  textMid: "#d4956a",
  textLight: "#e8b898",
  border: "#f5e6d8",
  green: "#88c060",
  yellow: "#f0c040",
  red: "#e87060",
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
      style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)` }}>
      <div className="flex flex-col items-center gap-4 pop-in">
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: COLORS.bgCard, border: `3px solid ${COLORS.border}` }}>
          <span className="text-6xl">🌿</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-wide" style={{ color: COLORS.bgCard, fontFamily: "monospace" }}>CrowdLess</h1>
          <p className="mt-2 text-base" style={{ color: COLORS.bg }}>[ find your calm place ]</p>
        </div>
        <div className="flex gap-3 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-3 h-3 rounded-full"
              style={{ background: COLORS.bgCard, animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }}></div>
          ))}
        </div>
      </div>
      <p className="absolute bottom-10 text-sm" style={{ color: COLORS.bg, fontFamily: "monospace" }}>made for peaceful minds ✨</p>
    </div>
  );
}

// ── Quiz Screen ────────────────────────────────────────────
function QuizScreen({ onDone }) {
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
      bookworm: { title: "The Quiet Bookworm", description: "You love silent cozy spots perfect for reading!", emoji: "📚", color: "#9b8ec4" },
      music_lover: { title: "The Music Lover", description: "You enjoy places with great ambiance!", emoji: "🎵", color: "#e8829a" },
      nature_soul: { title: "The Nature Soul", description: "Fresh air and open spaces are your thing!", emoji: "🌿", color: COLORS.secondaryDark },
      fitness_freak: { title: "The Fitness Freak", description: "Always on the move — gyms are your home!", emoji: "💪", color: COLORS.primary },
      social_butterfly: { title: "The Social Butterfly", description: "You love discovering buzzing new spots!", emoji: "🦋", color: COLORS.accent },
    };
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/places/recommendations/${vibe}`);
      const data = await res.json();
      setProfile(data.profile || profiles[vibe]);
    } catch {
      setProfile(profiles[vibe] || profiles.bookworm);
    }
    setShowResult(true);
    setLoading(false);
  };

  const q = QUIZ_QUESTIONS[current];
  const progress = (current / QUIZ_QUESTIONS.length) * 100;

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: COLORS.bg }}>
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
        style={{ borderColor: COLORS.primary, borderTopColor: "transparent" }}></div>
      <p style={{ color: COLORS.textDark, fontFamily: "monospace" }}>finding your vibe...</p>
    </div>
  );

  if (showResult && profile) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-6 slide-up"
      style={{ background: COLORS.bg }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-8xl mb-6 pop-in">{profile.emoji}</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>{profile.title}</h2>
        <p className="mb-8" style={{ color: COLORS.textMid }}>{profile.description}</p>
        <div className="rounded-2xl p-4 mb-6" style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.textMid }}>We'll show you places that match your vibe — sorted by crowd level just for you! 🌿</p>
        </div>
        <button onClick={() => onDone(profile)}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, fontFamily: "monospace" }}>
          find my places →
        </button>
        <button onClick={() => { setCurrent(0); setAnswers([]); setShowResult(false); setProfile(null); }}
          className="mt-3 text-sm underline" style={{ color: COLORS.textLight }}>
          retake quiz
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col z-50 p-6"
      style={{ background: COLORS.bg }}>
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2" style={{ color: COLORS.textMid, fontFamily: "monospace" }}>
          <span>question {current + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: COLORS.border }}>
          <div className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}` }}>
          <span className="text-3xl">🌿</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>{q.question}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt.value)}
              className="w-full py-4 px-5 rounded-2xl text-left flex items-center gap-4 transition-all duration-200"
              style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}`, color: COLORS.textDark }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.background = "#fff5ee"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bgCard; }}>
              <span className="text-2xl">{opt.emoji}</span>
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: COLORS.textLight, fontFamily: "monospace" }}>crowdless — find your calm place ✨</p>
    </div>
  );
}

// ── Weather Bar ────────────────────────────────────────────
function WeatherBar({ weather }) {
  if (!weather) return null;
  return (
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-center justify-between"
      style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}` }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{weather.emoji}</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: COLORS.textDark }}>{weather.condition} · {weather.temperature}°C</p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.textMid }}>{weather.tip}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs" style={{ color: COLORS.textLight }}>💨 {weather.wind_speed} km/h</span>
        <span className="text-xs" style={{ color: COLORS.textLight }}>💧 {weather.humidity}%</span>
      </div>
    </div>
  );
}

// ── Activity Suggestion ────────────────────────────────────
function ActivitySuggestion({ weather, onExplore }) {
  if (!weather?.activity) return null;
  return (
    <div className="rounded-2xl p-4 mb-3 cursor-pointer transition-all duration-200"
      style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, border: `2px solid ${COLORS.primaryDark}` }}
      onClick={() => onExplore(weather.activity.place_type)}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: COLORS.bg, fontFamily: "monospace" }}>✨ suggested for you right now</p>
          <p className="font-bold text-white text-base mb-1">{weather.activity.suggestion}</p>
          <p className="text-sm" style={{ color: COLORS.bg }}>{weather.activity.reason}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.25)" }}>
          <span className="text-xl">{weather.emoji}</span>
        </div>
      </div>
      <div className="mt-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: COLORS.bgCard, color: COLORS.textDark }}>
          find quiet {weather.activity.place_type}s nearby →
        </span>
      </div>
    </div>
  );
}

// ── Heatmap ────────────────────────────────────────────────
function HeatMap({ places, small = false, transport = { metro: [], buses: [] } }) {
  const center = [25.2048, 55.2708];
  const zoom = small ? 13 : 12;
  const height = small ? "160px" : "240px";

  const colorMap = {
    green: COLORS.green,
    yellow: COLORS.yellow,
    red: COLORS.red,
  };

  return (
    <div style={{ height, borderRadius: "16px", overflow: "hidden", border: `2px solid ${COLORS.border}` }}>
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
              <div style={{ fontWeight: "600", color: COLORS.textDark }}>{place.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{place.crowd_label} · {place.wait_time}</div>
            </LeafletTooltip>
          </CircleMarker>
        ))}
        {!small && transport.metro.map((station) => (
          <CircleMarker key={station.id} center={[station.lat, station.lng]}
            radius={10} fillColor={colorMap[station.crowd_color] || "#94a3b8"}
            color="white" weight={2} opacity={1} fillOpacity={0.85}>
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "600", color: COLORS.textDark }}>🚇 {station.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{station.line} · {station.crowd_label}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>⏱ {station.frequency}</div>
              <div style={{ fontSize: "12px", color: COLORS.red }}>Next peak: {station.next_peak}</div>
            </LeafletTooltip>
          </CircleMarker>
        ))}
        {!small && transport.buses.map((stop) => (
          <CircleMarker key={stop.id} center={[stop.lat, stop.lng]}
            radius={8} fillColor={colorMap[stop.crowd_color] || "#94a3b8"}
            color="white" weight={2} opacity={1} fillOpacity={0.85} dashArray="4">
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
              <div style={{ fontWeight: "600", color: COLORS.textDark }}>🚌 {stop.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{stop.route} · {stop.crowd_label}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>⏱ {stop.frequency}</div>
              <div style={{ fontSize: "12px", color: COLORS.red }}>Next peak: {stop.next_peak}</div>
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
    green: { bg: "#e8f8d8", text: "#4a8030", dot: COLORS.green },
    yellow: { bg: "#fef8d8", text: "#806020", dot: COLORS.yellow },
    red: { bg: "#fce8e0", text: "#803828", dot: COLORS.red },
  };
  const s = styles[color] || styles.green;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
      style={{ background: s.bg, color: s.text, border: `1.5px solid ${s.dot}44` }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.dot, display: "inline-block" }}></span>
      {label}
    </span>
  );
}

// ── Place Card ─────────────────────────────────────────────
function PlaceCard({ place, onClick }) {
  return (
    <div onClick={() => onClick(place)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200 fade-in"
      style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}`, boxShadow: `0 2px 12px ${COLORS.primary}18` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.boxShadow = `0 4px 20px ${COLORS.primary}30`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = `0 2px 12px ${COLORS.primary}18`; }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg" style={{ color: COLORS.textDark }}>{place.name}</h3>
          <p className="text-sm mt-0.5" style={{ color: COLORS.textLight }}>📍 {place.address}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl ml-2"
          style={{ background: COLORS.bg, border: `1.5px solid ${COLORS.border}` }}>
          <span>⭐</span>
          <span className="text-sm font-bold" style={{ color: COLORS.textDark }}>{place.rating}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <CrowdBadge color={place.crowd_color} label={place.crowd_label} />
        <span className="text-sm" style={{ color: COLORS.textLight }}>⏱ {place.wait_time}</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs" style={{ color: COLORS.textLight }}>best time:</span>
        <span className="text-xs font-semibold" style={{ color: COLORS.textDark }}>{place.best_time}</span>
      </div>
      {place.top_items?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {place.top_items.map((item, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full"
              style={{ background: COLORS.bg, color: COLORS.textMid, border: `1px solid ${COLORS.border}` }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Crowd Chart ────────────────────────────────────────────
function CrowdChart({ hourly, quietWindow }) {
  const hours = hourly.map((value, i) => ({
    time: i === 0 ? "12am" : i === 6 ? "6am" : i === 12 ? "12pm" : i === 18 ? "6pm" : i === 23 ? "11pm" : `${i}`,
    crowd: value,
  }));
  const getColor = (v) => v <= 3 ? COLORS.green : v <= 6 ? COLORS.yellow : COLORS.red;
  return (
    <div className="rounded-2xl p-4 mb-4"
      style={{ background: COLORS.bg, border: `2px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold" style={{ color: COLORS.textDark }}>📊 today's crowd forecast</p>
        <span className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "#e8f8d8", color: "#4a8030" }}>
          🕐 quietest: {quietWindow}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={hours} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
          <defs>
            <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: COLORS.textLight }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: COLORS.textLight }} tickLine={false} axisLine={false} domain={[0, 10]} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: `1px solid ${COLORS.border}`, fontSize: "12px", background: COLORS.bgCard }}
            formatter={(v) => [<span style={{ color: getColor(v), fontWeight: "bold" }}>{v}/10</span>, "crowd"]} />
          <Area type="monotone" dataKey="crowd" stroke={COLORS.primary} strokeWidth={2} fill="url(#crowdGrad)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 text-xs" style={{ color: COLORS.textLight }}>
        <span>🟢 quiet 1-3</span>
        <span>🟡 moderate 4-6</span>
        <span>🔴 busy 7-10</span>
      </div>
    </div>
  );
}

// ── Place Detail ───────────────────────────────────────────
function PlaceDetail({ place, onClose }) {
  const crowdStyles = {
    green: { bg: "#e8f8d8", text: "#4a8030", border: "#b8e090" },
    yellow: { bg: "#fef8d8", text: "#806020", border: "#e8d080" },
    red: { bg: "#fce8e0", text: "#803828", border: "#e8a090" },
  };
  const s = crowdStyles[place.crowd_color] || crowdStyles.green;
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
      style={{ background: "rgba(196, 122, 58, 0.3)" }}>
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl overflow-y-auto slide-up"
        style={{ background: COLORS.bgCard, maxHeight: "90vh", border: `2px solid ${COLORS.border}` }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>{place.name}</h2>
            <p className="mt-1" style={{ color: COLORS.textLight }}>📍 {place.address}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-light"
            style={{ background: COLORS.bg, color: COLORS.textDark, border: `2px solid ${COLORS.border}` }}>×</button>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ background: s.bg, border: `2px solid ${s.border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{ color: s.text }}>{place.crowd_label}</p>
              <p className="text-sm" style={{ color: s.text, opacity: 0.75 }}>right now</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: COLORS.textDark }}>
                {place.crowd_score}<span className="text-lg" style={{ color: COLORS.textLight }}>/10</span>
              </p>
              <p className="text-sm" style={{ color: COLORS.textLight }}>crowd score</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold mb-2" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>🗺 area crowd map</p>
          <HeatMap places={[place]} small={true} />
        </div>

        {place.hourly_crowd && <CrowdChart hourly={place.hourly_crowd} quietWindow={place.quiet_window} />}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "wait time", value: place.wait_time },
            { label: "best time today", value: place.best_time },
            { label: "rating", value: `⭐ ${place.rating}` },
            { label: "type", value: place.type },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: COLORS.bg, border: `1.5px solid ${COLORS.border}` }}>
              <p className="text-xs mb-1" style={{ color: COLORS.textLight, fontFamily: "monospace" }}>{stat.label}</p>
              <p className="font-bold capitalize" style={{ color: COLORS.textDark }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {place.top_items?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-bold mb-2" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>🍽 what to order</p>
            <div className="flex gap-2 flex-wrap">
              {place.top_items.map((item, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ background: COLORS.bg, color: COLORS.textDark, border: `1.5px solid ${COLORS.border}` }}>{item}</span>
              ))}
            </div>
          </div>
        )}

        <button className="w-full py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, fontFamily: "monospace" }}>
          🧭 get directions
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
    const botMsg = { from: "bot", text: "Based on current crowd data, I'd suggest checking the Quiet places in the list — they have the lowest crowd score right now. 🌿" };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 rounded-3xl shadow-2xl overflow-hidden z-50 slide-up"
          style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}` }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "monospace" }}>CrowdLess AI</p>
                <p className="text-xs" style={{ color: COLORS.bg }}>always here to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-light">×</button>
          </div>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto" style={{ height: "220px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="px-3 py-2 rounded-2xl text-sm max-w-xs"
                  style={{
                    background: msg.from === "user" ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` : COLORS.bg,
                    color: msg.from === "user" ? "white" : COLORS.textDark,
                    border: msg.from === "bot" ? `1.5px solid ${COLORS.border}` : "none"
                  }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 flex gap-2" style={{ borderTop: `2px solid ${COLORS.border}` }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="ask me anything..."
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ background: COLORS.bg, color: COLORS.textDark, border: `1.5px solid ${COLORS.border}`, fontFamily: "monospace" }} />
            <button onClick={send} className="px-3 py-2 rounded-xl text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}>
              →
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 text-2xl transition-all"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, border: `3px solid ${COLORS.bgCard}` }}>
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [weather, setWeather] = useState(null);
  const [transport, setTransport] = useState({ metro: [], buses: [] });

  const filters = ["all", "cafe", "park", "gym", "mall"];

  const fetchPlaces = async (searchQuery, type) => {
    setLoading(true);
    try {
      const typeParam = type === "all" ? "" : type;
      const res = await fetch(`http://127.0.0.1:8000/api/places/search?query=${searchQuery}&type=${typeParam}`);
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

  if (showSplash) return <SplashScreen onDone={() => { setShowSplash(false); setShowQuiz(true); }} />;
  if (showQuiz) return <QuizScreen onDone={(profile) => { setUserProfile(profile); setShowQuiz(false); }} />;

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>

      {/* Header */}
      <div className="sticky top-0 z-40"
        style={{ background: COLORS.bgCard, borderBottom: `2px solid ${COLORS.border}`, boxShadow: `0 2px 12px ${COLORS.primary}18` }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}>
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>CrowdLess</h1>
              <p className="text-xs" style={{ color: COLORS.textLight, fontFamily: "monospace" }}>find your calm place ✨</p>
            </div>
            {userProfile && (
              <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: COLORS.bg, border: `1.5px solid ${COLORS.border}` }}>
                <span>{userProfile.emoji}</span>
                <span className="text-xs font-medium" style={{ color: COLORS.textDark }}>{userProfile.title}</span>
              </div>
            )}
          </div>
          <form onSubmit={e => { e.preventDefault(); fetchPlaces(query, activeFilter); }}
            className="flex gap-2">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="search cafes, parks, gyms..."
              className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all"
              style={{ background: COLORS.bg, color: COLORS.textDark, border: `2px solid ${COLORS.border}`, fontFamily: "monospace" }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border} />
            <button type="submit" className="px-5 py-3 rounded-xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, fontFamily: "monospace" }}>
              search
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {filters.map(filter => (
              <button key={filter}
                onClick={() => { setActiveFilter(filter); fetchPlaces(query, filter); }}
                className="px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all"
                style={{
                  background: activeFilter === filter ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` : COLORS.bg,
                  color: activeFilter === filter ? "white" : COLORS.textDark,
                  border: `2px solid ${activeFilter === filter ? COLORS.primaryDark : COLORS.border}`,
                  fontFamily: "monospace"
                }}>
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <WeatherBar weather={weather} />
        <ActivitySuggestion weather={weather} onExplore={handleActivityExplore} />

        {/* Map section */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}`, boxShadow: `0 2px 12px ${COLORS.primary}18` }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>📍 area crowd map</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: COLORS.textLight }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS.green }}></span>quiet</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS.yellow }}></span>moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS.red }}></span>busy</span>
              <span>🚇 metro</span>
              <span>🚌 bus</span>
            </div>
          </div>
          <HeatMap places={places} transport={transport} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4"
              style={{ borderColor: COLORS.primary, borderTopColor: "transparent" }}></div>
            <p style={{ color: COLORS.textMid, fontFamily: "monospace" }}>finding quiet places...</p>
          </div>
        ) : (
          <>
            {userProfile && (
              <div className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3"
                style={{ background: COLORS.bgCard, border: `2px solid ${COLORS.border}` }}>
                <span className="text-2xl">{userProfile.emoji}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: COLORS.textDark, fontFamily: "monospace" }}>{userProfile.title}</p>
                  <p className="text-xs" style={{ color: COLORS.textLight }}>showing places matched to your vibe</p>
                </div>
              </div>
            )}
            <p className="text-sm mb-4" style={{ color: COLORS.textLight, fontFamily: "monospace" }}>
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