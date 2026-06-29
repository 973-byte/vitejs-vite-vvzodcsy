import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  blue:    "#1560E8", blueHi: "#4D8EFF", blueDim: "#0D3A8A",
  yellow:  "#F5C518", yellowDim: "#3A3100",
  bg:      "#0B0D1A", card: "#12152B", cardHi: "#181D35",
  border:  "#1E2340", text: "#F0F2FF", muted: "#6B7299",
  danger:  "#E84545", green: "#22C97A", purple: "#9B4DFF",
  orange:  "#FF6B35",
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", style = {} }) => {
  const p = {
    log:       <><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/><polyline points="17 11 9 11"/><polyline points="17 15 9 15"/><line x1="9" y1="7" x2="11" y2="7"/><path d="M18 2l2 2-9 9-3 1 1-3 9-9z"/></>,
    progress:  <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    history:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    admin:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    trend:     <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    crown:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    dumbbell:  <><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><circle cx="4" cy="8" r="2"/><circle cx="4" cy="16" r="2"/><circle cx="20" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><line x1="4" y1="8" x2="4" y2="16"/><line x1="20" y1="8" x2="20" y2="16"/><line x1="6" y1="12" x2="18" y2="12"/></>,
    save:      <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    back:      <><polyline points="15 18 9 12 15 6"/></>,
    timer:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    trophy:    <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></>,
    star:      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    weight:    <><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.9-2.54L19.4 9.46A2 2 0 0 0 17.48 8Z"/></>,
    clone:     <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    notes:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    fire:      <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    export:    <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    sun:       <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:      <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    target:    <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    plate:     <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></>,
    bed:       <><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></>,
    wellness:  <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    play:      <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause:     <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    moon2:     <><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></>,
    protein:   <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    drop:      <><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {p[name]}
    </svg>
  );
};

// ─── Schedule & Exercise Bank ─────────────────────────────────────────────────
const SCHEDULE = {
  Monday:    { label: "Push Day",     sub: "Chest · Triceps",       color: T.blue   },
  Tuesday:   { label: "Pull Day",     sub: "Back · Biceps",         color: T.purple },
  Wednesday: { label: "Shoulders",    sub: "Shoulders · Forearms",  color: T.orange },
  Thursday:  { label: "Push Day",     sub: "Chest · Triceps",       color: T.blue   },
  Friday:    { label: "Pull Day",     sub: "Back · Biceps",         color: T.purple },
  Saturday:  { label: "Leg Day",      sub: "Quads · Hams · Glutes", color: T.green  },
  Sunday:    { label: "Abs + Cardio", sub: "Core · Conditioning",   color: T.yellow },
};

const EXERCISE_BANK = {
  Monday:    ["Flat Bench Press","Incline Bench Press","Decline Bench Press","Dumbbell Flyes","Cable Crossover","Push-ups","Chest Dips","Pec Deck","Tricep Pushdown","Skull Crushers","Overhead Tricep Extension","Dips","Close-Grip Bench Press","Tricep Kickbacks"],
  Tuesday:   ["Deadlift","Barbell Row","T-Bar Row","Seated Cable Row","Lat Pulldown","Pull-ups","Chin-ups","Single-Arm DB Row","Face Pulls","Straight-Arm Pulldown","Barbell Curl","Dumbbell Curl","Hammer Curl","Preacher Curl","Cable Curl","Concentration Curl"],
  Wednesday: ["Overhead Press (Barbell)","Overhead Press (DB)","Arnold Press","Lateral Raises","Front Raises","Rear Delt Flyes","Upright Row","Shrugs","Cable Lateral Raise","Machine Shoulder Press","Wrist Curls","Reverse Wrist Curls","Farmer's Walk","Behind-Back Wrist Curl"],
  Thursday:  ["Flat Bench Press","Incline Bench Press","Decline Bench Press","Dumbbell Flyes","Cable Crossover","Push-ups","Chest Dips","Pec Deck","Tricep Pushdown","Skull Crushers","Overhead Tricep Extension","Dips","Close-Grip Bench Press","Tricep Kickbacks"],
  Friday:    ["Deadlift","Barbell Row","T-Bar Row","Seated Cable Row","Lat Pulldown","Pull-ups","Chin-ups","Single-Arm DB Row","Face Pulls","Straight-Arm Pulldown","Barbell Curl","Dumbbell Curl","Hammer Curl","Preacher Curl","Cable Curl","Concentration Curl"],
  Saturday:  ["Squat (Barbell)","Front Squat","Hack Squat","Leg Press","Romanian Deadlift","Leg Curl (Lying)","Leg Curl (Seated)","Leg Extension","Walking Lunges","Bulgarian Split Squat","Hip Thrust","Glute Bridge","Calf Raises (Standing)","Calf Raises (Seated)","Sumo Deadlift"],
  Sunday:    ["Crunches","Hanging Leg Raises","Plank","Russian Twist","Cable Crunches","Ab Wheel Rollout","Bicycle Crunches","Toe Touches","Mountain Climbers","Treadmill","Cycling","Jump Rope","Rowing Machine","Stair Climber","Battle Ropes","Burpees"],
};

const ALL_EXERCISES = [...new Set(Object.values(EXERCISE_BANK).flat())].sort();
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_FILTERS = ["Daily","Weekly","Monthly","Yearly"];
const PLATES = [20, 15, 10, 5, 2.5, 1.25]; // kg per side (standard)
const BAR_WEIGHT = 20; // kg

// ─── Storage ──────────────────────────────────────────────────────────────────
const S = {
  get: (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } },
  set: (k, v)  => localStorage.setItem(k, JSON.stringify(v)),
};

function initStorage() {
  if (!S.get("wt_users", []).length)
    S.set("wt_users", [{ id: "admin", username: "mukesh", password: "admin123", role: "admin", createdAt: new Date().toISOString() }]);
}

// ─── Utilities ────────────────────────────────────────────────────────────────
const todayName = () => DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
const todayISO  = () => new Date().toISOString().split("T")[0];
const maxWeight = sets => sets.reduce((m, s) => Math.max(m, parseFloat(s.weight) || 0), 0);
const totalVol  = sets => sets.reduce((t, s) => t + (parseFloat(s.weight)||0)*(parseInt(s.reps)||0), 0);
const fmtDate   = d => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
const fmtShort  = d => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short" });

function weekStart(dateStr) {
  const d = new Date(dateStr), m = new Date(d);
  m.setDate(d.getDate() - ((d.getDay()+6)%7));
  return m.toISOString().split("T")[0];
}

function filterSessions(sessions, filter) {
  const now = new Date();
  return sessions.filter(s => {
    const d = new Date(s.date);
    if (filter==="Daily")   return s.date === todayISO();
    if (filter==="Weekly")  { const m=new Date(now); m.setDate(now.getDate()-((now.getDay()+6)%7)); m.setHours(0,0,0,0); return d>=m; }
    if (filter==="Monthly") return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
    if (filter==="Yearly")  return d.getFullYear()===now.getFullYear();
    return true;
  });
}

function calcStreak(sessions) {
  if (!sessions.length) return 0;
  const dates = [...new Set(sessions.map(s=>s.date))].sort().reverse();
  let streak = 0, cur = new Date(todayISO());
  for (const d of dates) {
    const dd = new Date(d);
    const diff = Math.round((cur - dd)/(1000*60*60*24));
    if (diff > 1) break;
    streak++;
    cur = dd;
  }
  return streak;
}

function calcPlates(targetKg) {
  const perSide = Math.max(0, (targetKg - BAR_WEIGHT) / 2);
  let rem = perSide, result = [];
  for (const p of PLATES) {
    const n = Math.floor(rem / p);
    if (n > 0) { result.push({ plate: p, count: n }); rem = Math.round((rem - n*p)*100)/100; }
  }
  return result;
}

function updatePRs(userId, exerciseName, sets) {
  const key = `wt_prs_${userId}`;
  const prs  = S.get(key, {});
  const mw   = maxWeight(sets);
  const vol  = Math.round(totalVol(sets));
  const existing = prs[exerciseName] || { maxWeight:0, maxVolume:0 };
  const newPR = { ...existing };
  let hit = false;
  if (mw > existing.maxWeight)   { newPR.maxWeight = mw;  newPR.maxWeightDate = todayISO(); hit = true; }
  if (vol > existing.maxVolume)  { newPR.maxVolume = vol; newPR.maxVolumeDate = todayISO(); hit = true; }
  if (hit) { S.set(key, { ...prs, [exerciseName]: newPR }); }
  return hit;
}

function getSuggestion(lastSets) {
  if (!lastSets || !lastSets.length) return null;
  const mw   = maxWeight(lastSets);
  const reps = lastSets.find(s => parseFloat(s.weight)===mw)?.reps || lastSets[0]?.reps;
  const r    = parseInt(reps)||0;
  if (!mw) return null;
  const nextWeight = Math.round((mw + 2.5)*2)/2; // +2.5kg
  const nextReps   = Math.min(r+2, 12);
  return `Target: ${nextWeight}kg  or  ${mw}kg × ${nextReps} reps`;
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const mkCSS = (light) => `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:${light?"#F4F6FB":T.bg};color:${light?"#111827":T.text};font-family:-apple-system,'Inter',BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
  input,button,textarea{font-family:inherit}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${light?"#CBD5E1":T.border};border-radius:4px}
  ::placeholder{color:${light?"#9CA3AF":T.muted}}
`;

// ─── Reusable UI ─────────────────────────────────────────────────────────────
function Pill({ label, active, color=T.blue, onClick }) {
  return (
    <motion.button onClick={onClick} whileTap={{scale:0.94}} style={{
      background: active ? color : T.card,
      color: active ? (color===T.yellow?"#0B0D1A":"#fff") : T.muted,
      border: active ? "none" : `1px solid ${T.border}`,
      borderRadius:20, padding:"6px 16px", fontSize:12, fontWeight:600,
      cursor:"pointer", letterSpacing:"0.03em", whiteSpace:"nowrap",
      boxShadow: active ? `0 0 12px ${color}44` : "none"
    }}>{label}</motion.button>
  );
}

function GlowBtn({ children, onClick, color=T.blue, full, small, disabled, style={} }) {
  return (
    <motion.button onClick={onClick} whileTap={{scale:0.97}} disabled={disabled} style={{
      width: full?"100%":"auto",
      background: disabled ? T.border : color,
      color: color===T.yellow ? "#0B0D1A" : "#fff",
      border:"none", borderRadius: small?8:12,
      padding: small?"8px 16px":"13px 24px",
      fontSize: small?13:14, fontWeight:700,
      cursor: disabled?"not-allowed":"pointer",
      boxShadow: disabled?"none":`0 0 20px ${color}44`,
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      transition:"box-shadow 0.2s", ...style
    }}>{children}</motion.button>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16, ...style }}>{children}</div>;
}

function Input({ value, onChange, placeholder, type="text", style={}, onKeyDown }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} style={{
      background:T.cardHi, border:`1px solid ${T.border}`, borderRadius:10,
      color:T.text, padding:"10px 14px", fontSize:14, width:"100%", outline:"none", ...style
    }} />
  );
}

function Tag({ label, color }) {
  return <span style={{ background:color+"22", color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"0.05em" }}>{label}</span>;
}

// ─── Rest Timer ───────────────────────────────────────────────────────────────
function RestTimer({ onClose }) {
  const PRESETS = [60, 90, 120, 180];
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start(d) { setDuration(d); setRemaining(d); setRunning(true); }
  function reset()  { clearInterval(intervalRef.current); setRunning(false); setRemaining(null); }

  const pct    = remaining !== null ? remaining / duration : 1;
  const r      = 44, circ = 2 * Math.PI * r;
  const disp   = remaining ?? duration;
  const mins   = Math.floor(disp/60), secs = disp%60;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
      style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 32px)", maxWidth:448,
        background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:20, zIndex:50,
        boxShadow:`0 0 40px #000a` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="timer" size={16} color={T.blue} />
          <span style={{ fontWeight:700, fontSize:14 }}>Rest Timer</span>
        </div>
        <motion.button whileTap={{scale:0.9}} onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
          <Icon name="close" size={16} color={T.muted} />
        </motion.button>
      </div>

      {/* SVG ring */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
        <svg width={100} height={100} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={50} cy={50} r={r} fill="none" stroke={T.border} strokeWidth={6}/>
          <circle cx={50} cy={50} r={r} fill="none" stroke={running ? T.blue : T.muted} strokeWidth={6}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1s linear" }}/>
        </svg>
        <div style={{ position:"absolute", marginTop:28, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:800, color: remaining===0 ? T.green : T.text }}>
            {remaining===0 ? "Done!" : `${mins}:${String(secs).padStart(2,"0")}`}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:12 }}>
        {PRESETS.map(p => (
          <motion.button key={p} onClick={() => start(p)} whileTap={{scale:0.93}} style={{
            background: duration===p && running ? T.blue : T.cardHi,
            color: duration===p && running ? "#fff" : T.muted,
            border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer"
          }}>{p<60?`${p}s`:`${p/60}m`}</motion.button>
        ))}
      </div>

      <div style={{ display:"flex", gap:8 }}>
        {!running && <GlowBtn full color={T.blue} small onClick={() => start(duration)}>
          <Icon name="timer" size={14} color="#fff"/> {remaining===0?"Restart":"Start"}
        </GlowBtn>}
        {running && <GlowBtn full color={T.danger} small onClick={reset}>
          <Icon name="close" size={14} color="#fff"/> Stop
        </GlowBtn>}
      </div>
    </motion.div>
  );
}

// ─── Plate Calculator Modal ───────────────────────────────────────────────────
function PlateCalc({ onClose }) {
  const [target, setTarget] = useState("");
  const plates = target ? calcPlates(parseFloat(target)||0) : [];
  const possible = plates.reduce((t,p)=>t+p.plate*p.count*2, 0) + BAR_WEIGHT;

  const COLORS = { 20:"#E84545", 15:"#1560E8", 10:"#F5C518", 5:"#22C97A", 2.5:"#9B4DFF", 1.25:"#FF6B35" };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, background:"#000a", zIndex:60, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={onClose}>
      <motion.div initial={{y:300}} animate={{y:0}} exit={{y:300}}
        onClick={e=>e.stopPropagation()}
        style={{ width:"100%", maxWidth:480, background:T.card, borderRadius:"20px 20px 0 0", padding:24, paddingBottom:40 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="plate" size={18} color={T.yellow} />
            <span style={{ fontWeight:800, fontSize:16 }}>Plate Calculator</span>
          </div>
          <motion.button whileTap={{scale:0.9}} onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <Icon name="close" size={16} color={T.muted} />
          </motion.button>
        </div>

        <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>Target weight (kg)</div>
        <Input type="number" value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. 100" />
        <div style={{ fontSize:11, color:T.muted, marginTop:6 }}>Bar: {BAR_WEIGHT}kg · Load per side shown</div>

        {target && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{ marginTop:20 }}>
            {plates.length === 0 ? (
              <div style={{ color:T.muted, fontSize:13, textAlign:"center" }}>Just the bar or below bar weight</div>
            ) : (
              <>
                <div style={{ fontSize:12, color:T.muted, marginBottom:10, letterSpacing:"0.06em" }}>LOAD EACH SIDE</div>
                {plates.map(({plate, count}) => (
                  <div key={plate} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <div style={{ width:48, height:48, borderRadius:10,
                      background: COLORS[plate]+"22", border:`2px solid ${COLORS[plate]}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontWeight:800, fontSize:13, color: COLORS[plate] }}>{plate}kg</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:4 }}>
                        {Array(count).fill(0).map((_,i)=>(
                          <div key={i} style={{ width:14, height:36, borderRadius:4, background: COLORS[plate] }}/>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize:13, color:T.muted }}>×{count}</div>
                  </div>
                ))}
                <div style={{ marginTop:16, padding:"12px 16px", background:T.cardHi, borderRadius:10,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:T.muted }}>Actual load</span>
                  <span style={{ fontSize:18, fontWeight:800, color: possible===parseFloat(target)?T.green:T.yellow }}>
                    {possible}kg {possible!==parseFloat(target) && <span style={{fontSize:11,color:T.muted}}>(closest)</span>}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── PR Flash Banner ──────────────────────────────────────────────────────────
function PRBanner({ exercises, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}}
      style={{ position:"fixed", top:80, left:"50%", transform:"translateX(-50%)", zIndex:70,
        background:`linear-gradient(135deg, ${T.yellow}, #FF9500)`,
        borderRadius:16, padding:"14px 20px", maxWidth:"90vw",
        boxShadow:"0 8px 32px #F5C51866", display:"flex", alignItems:"center", gap:12 }}>
      <Icon name="trophy" size={24} color="#0B0D1A" />
      <div>
        <div style={{ fontWeight:800, fontSize:13, color:"#0B0D1A" }}>🏆 New PR{exercises.length>1?"s":""}!</div>
        <div style={{ fontSize:11, color:"#0B0D1A88" }}>{exercises.join(", ")}</div>
      </div>
    </motion.div>
  );
}

// ─── Set Row ──────────────────────────────────────────────────────────────────
function SetRow({ set, idx, onChange, onRemove }) {
  return (
    <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}}
      style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
      <span style={{ fontSize:11, color:T.muted, minWidth:18, textAlign:"right" }}>{idx+1}</span>
      <input type="number" placeholder="kg" value={set.weight}
        onChange={e=>onChange(idx,"weight",e.target.value)} style={{
          width:64, padding:"7px 8px", borderRadius:8, border:`1px solid ${T.border}`,
          background:T.cardHi, color:T.text, fontSize:14, textAlign:"center", outline:"none"}} />
      <span style={{ color:T.muted, fontSize:13 }}>×</span>
      <input type="number" placeholder="reps" value={set.reps}
        onChange={e=>onChange(idx,"reps",e.target.value)} style={{
          width:64, padding:"7px 8px", borderRadius:8, border:`1px solid ${T.border}`,
          background:T.cardHi, color:T.text, fontSize:14, textAlign:"center", outline:"none"}} />
      <motion.button whileTap={{scale:0.85}} onClick={()=>onRemove(idx)} style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
        <Icon name="close" size={13} color={T.muted} />
      </motion.button>
    </motion.div>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, sets, onChange, onAddSet, onRemoveSet, onDelete, lastSession, accentColor, isPR }) {
  const vol    = totalVol(sets), mw = maxWeight(sets);
  const lastV  = lastSession ? totalVol(lastSession.sets) : null;
  const lastMw = lastSession ? maxWeight(lastSession.sets) : null;
  const mwDiff = lastMw!==null ? mw-lastMw : null;
  const volDiff= lastV!==null  ? vol-lastV : null;
  const suggestion = getSuggestion(lastSession?.sets);

  return (
    <motion.div layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
      style={{ background:T.card, border:`1px solid ${isPR?T.yellow:T.border}`, borderRadius:14, marginBottom:12, overflow:"hidden",
        boxShadow: isPR?`0 0 20px ${T.yellow}44`:"none" }}>
      <div style={{ height:3, background:`linear-gradient(90deg,${accentColor},${T.yellow})` }}/>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontWeight:700, fontSize:14 }}>{exercise}</span>
              {isPR && <Tag label="PR 🏆" color={T.yellow}/>}
            </div>
            {suggestion && <div style={{ fontSize:11, color:T.blue, marginTop:3, fontWeight:600 }}>{suggestion}</div>}
            {lastSession && <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
              Last: {maxWeight(lastSession.sets)}kg — {lastSession.sets.map(s=>s.reps).join("/")} reps
            </div>}
          </div>
          <motion.button whileTap={{scale:0.9}} onClick={onDelete} style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
            <Icon name="trash" size={14} color={T.muted}/>
          </motion.button>
        </div>

        <AnimatePresence>
          {sets.map((s,i)=>(
            <SetRow key={i} set={s} idx={i} onChange={onChange} onRemove={onRemoveSet}/>
          ))}
        </AnimatePresence>

        <motion.button whileTap={{scale:0.97}} onClick={onAddSet} style={{
          background:"none", border:`1px dashed ${T.border}`, color:T.muted,
          borderRadius:8, padding:"6px 0", fontSize:12, cursor:"pointer",
          width:"100%", marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
          <Icon name="plus" size={13} color={T.muted}/> Add set
        </motion.button>

        {vol>0 && (
          <div style={{ display:"flex", gap:20, marginTop:12, paddingTop:10, borderTop:`1px solid ${T.border}` }}>
            {[
              { label:"Top weight", value:`${mw}kg`, diff:mwDiff!==null?`${mwDiff>=0?"+":""}${mwDiff}kg`:null, up:mwDiff>=0 },
              { label:"Volume",     value:`${Math.round(vol)}kg`, diff:volDiff!==null?`${volDiff>=0?"+":""}${Math.round(volDiff)}kg`:null, up:volDiff>=0 },
            ].map(stat=>(
              <div key={stat.label}>
                <div style={{ fontSize:10, color:T.muted, letterSpacing:"0.06em" }}>{stat.label.toUpperCase()}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:6, marginTop:2 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:T.yellow }}>{stat.value}</span>
                  {stat.diff && <span style={{ fontSize:11, fontWeight:600, color:stat.up?T.green:T.danger }}>{stat.diff}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function handle() {
    const u = S.get("wt_users",[]).find(u=>u.username===username.trim()&&u.password===password);
    if (!u) { setError("Invalid credentials"); return; }
    onLogin(u);
  }

  return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, padding:24 }}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:18,
            background:`linear-gradient(135deg,${T.blue},${T.yellow})`,
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px",
            boxShadow:`0 0 30px ${T.blue}55` }}>
            <Icon name="dumbbell" size={28} color="#fff"/>
          </div>
          <div style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.5px" }}>Over<span style={{color:T.yellow}}>load</span></div>
          <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>Progressive training tracker</div>
        </div>
        <Card style={{ padding:24 }}>
          <div style={{ fontSize:13, color:T.muted, marginBottom:6 }}>Username</div>
          <Input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username"/>
          <div style={{ fontSize:13, color:T.muted, margin:"14px 0 6px" }}>Password</div>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {error && <div style={{ color:T.danger, fontSize:12, marginTop:10 }}>{error}</div>}
          <div style={{ marginTop:20 }}><GlowBtn full onClick={handle}><Icon name="user" size={16} color="#fff"/> Sign in</GlowBtn></div>
        </Card>
        <div style={{ textAlign:"center", color:T.muted, fontSize:11, marginTop:20 }}>
          Default: <span style={{color:T.yellow}}>mukesh</span> / <span style={{color:T.yellow}}>admin123</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ currentUser }) {
  const [users, setUsers]   = useState(()=>S.get("wt_users",[]));
  const [newUser, setNewUser]= useState({username:"",password:"",role:"user"});
  const [msg, setMsg]       = useState("");

  function refresh() { setUsers(S.get("wt_users",[])); }

  function addUser() {
    if (!newUser.username||!newUser.password) { setMsg("Fill both fields"); return; }
    const ex = S.get("wt_users",[]);
    if (ex.find(u=>u.username===newUser.username)) { setMsg("Username taken"); return; }
    S.set("wt_users",[...ex,{id:Date.now().toString(),...newUser,createdAt:new Date().toISOString()}]);
    setNewUser({username:"",password:"",role:"user"}); setMsg("User added!"); refresh();
    setTimeout(()=>setMsg(""),2000);
  }

  function deleteUser(id) {
    if (id===currentUser.id) return;
    S.set("wt_users", S.get("wt_users",[]).filter(u=>u.id!==id));
    S.set("wt_sessions", S.get("wt_sessions",[]).filter(s=>s.userId!==id));
    refresh();
  }

  const allSessions = S.get("wt_sessions",[]);
  const statsPerUser = users.map(u=>({...u, sessions:allSessions.filter(s=>s.userId===u.id).length}));

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <Icon name="shield" size={20} color={T.yellow}/><span style={{fontSize:18,fontWeight:800}}>Admin Panel</span><Tag label="ADMIN ONLY" color={T.yellow}/>
      </div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:10, letterSpacing:"0.08em" }}>USERS ({users.length})</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
        {statsPerUser.map(u=>(
          <Card key={u.id} style={{ padding:"12px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10,
                  background:u.role==="admin"?`${T.yellow}22`:`${T.blue}22`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={u.role==="admin"?"crown":"user"} size={16} color={u.role==="admin"?T.yellow:T.blue}/>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{u.username}</div>
                  <div style={{fontSize:11,color:T.muted}}>{u.sessions} sessions · {u.role}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Tag label={u.role.toUpperCase()} color={u.role==="admin"?T.yellow:T.blue}/>
                {u.id!==currentUser.id && (
                  <motion.button whileTap={{scale:0.9}} onClick={()=>deleteUser(u.id)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                    <Icon name="trash" size={15} color={T.danger}/>
                  </motion.button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{padding:20}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
          <Icon name="plus" size={16} color={T.blue}/> Add new user
        </div>
        <Input value={newUser.username} onChange={e=>setNewUser(p=>({...p,username:e.target.value}))} placeholder="Username"/>
        <div style={{marginTop:10}}><Input type="password" value={newUser.password} onChange={e=>setNewUser(p=>({...p,password:e.target.value}))} placeholder="Password"/></div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <Pill label="User"  active={newUser.role==="user"}  onClick={()=>setNewUser(p=>({...p,role:"user"}))}/>
          <Pill label="Admin" active={newUser.role==="admin"} color={T.yellow} onClick={()=>setNewUser(p=>({...p,role:"admin"}))}/>
        </div>
        {msg && <div style={{color:msg.includes("!")?T.green:T.danger,fontSize:12,marginTop:8}}>{msg}</div>}
        <div style={{marginTop:14}}><GlowBtn full onClick={addUser}><Icon name="plus" size={15} color="#fff"/> Create user</GlowBtn></div>
      </Card>
      <div style={{marginTop:24}}>
        <div style={{fontSize:12,color:T.muted,marginBottom:10,letterSpacing:"0.08em"}}>ALL SESSIONS ({allSessions.length})</div>
        {allSessions.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,20).map(s=>{
          const owner=users.find(u=>u.id===s.userId); const m=SCHEDULE[s.day];
          return (
            <Card key={s.id} style={{padding:"10px 14px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontWeight:600,fontSize:13,color:m?.color}}>{m?.label}</span><span style={{color:T.muted,fontSize:12}}> · {fmtDate(s.date)}</span></div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}><Icon name="user" size={12} color={T.muted}/><span style={{fontSize:11,color:T.muted}}>{owner?.username||"?"}</span></div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Log View ─────────────────────────────────────────────────────────────────
function LogView({ currentUser, editingSession, onEditDone }) {
  const isEditing = !!editingSession;
  const [day, setDay]       = useState(()=>editingSession?editingSession.day:todayName());
  const [selected, setSelected]= useState(()=>editingSession?editingSession.exercises.map(e=>e.name):[]);
  const [logData, setLogData]  = useState(()=>editingSession
    ? Object.fromEntries(editingSession.exercises.map(e=>[e.name,e.sets.map(s=>({...s}))]))
    : {});
  const [notes, setNotes]     = useState(()=>editingSession?.notes||"");
  const [showPicker, setShowPicker]= useState(false);
  const [showNotes, setShowNotes]  = useState(false);
  const [saved, setSaved]     = useState(false);
  const [prHit, setPrHit]     = useState([]);
  const [showTimer, setShowTimer]= useState(false);
  const [showPlate, setShowPlate]= useState(false);
  const [prExercises, setPrExercises] = useState([]);

  useEffect(()=>{
    if (editingSession) {
      setDay(editingSession.day);
      setSelected(editingSession.exercises.map(e=>e.name));
      setLogData(Object.fromEntries(editingSession.exercises.map(e=>[e.name,e.sets.map(s=>({...s}))])));
      setNotes(editingSession.notes||"");
      setShowPicker(false); setSaved(false);
    }
  },[editingSession?.id]);

  const meta     = SCHEDULE[day];
  const sessions = S.get("wt_sessions",[]);
  const lastSame = useMemo(()=>{
    const refDate = isEditing?editingSession.date:todayISO();
    return sessions.filter(s=>s.day===day&&s.date!==refDate&&s.userId===currentUser.id)
      .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  },[day,sessions.length,editingSession?.id]);

  function cloneLastSession() {
    if (!lastSame) return;
    setSelected(lastSame.exercises.map(e=>e.name));
    setLogData(Object.fromEntries(lastSame.exercises.map(e=>[e.name,e.sets.map(s=>({...s}))])));
    setShowPicker(false);
  }

  function toggleEx(ex) {
    setSelected(p=>p.includes(ex)?p.filter(e=>e!==ex):[...p,ex]);
    if (!logData[ex]) setLogData(d=>({...d,[ex]:[{weight:"",reps:""}]}));
  }
  function handleSet(ex,i,f,v) { setLogData(d=>{ const s=[...(d[ex]||[])]; s[i]={...s[i],[f]:v}; return {...d,[ex]:s}; }); }
  function addSet(ex)      { setLogData(d=>({...d,[ex]:[...(d[ex]||[]),{weight:"",reps:""}]})); }
  function removeSet(ex,i) { setLogData(d=>{ const s=d[ex].filter((_,j)=>j!==i); return {...d,[ex]:s.length?s:[{weight:"",reps:""}]}; }); }
  function removeEx(ex)    { setSelected(p=>p.filter(e=>e!==ex)); }

  function saveSession() {
    const date = isEditing?editingSession.date:todayISO();
    const id   = isEditing?editingSession.id:Date.now();
    const exercisesData = selected
      .filter(ex=>logData[ex]?.some(s=>s.weight||s.reps))
      .map(ex=>({name:ex,sets:logData[ex]}));
    if (!exercisesData.length) return;

    // Check PRs
    const newPRs = [];
    exercisesData.forEach(ex=>{
      if (updatePRs(currentUser.id, ex.name, ex.sets)) newPRs.push(ex.name);
    });

    const payload = { id, date, day, userId:currentUser.id, exercises:exercisesData, notes };
    const existing = S.get("wt_sessions",[]);
    S.set("wt_sessions",[...existing.filter(s=>s.id!==id&&!(s.date===date&&s.day===day&&s.userId===currentUser.id&&!isEditing)),payload]);

    if (newPRs.length) { setPrExercises(newPRs); }
    setSaved(true);
    setTimeout(()=>{ setSaved(false); if(isEditing) onEditDone(); },1800);
  }

  return (
    <div>
      <AnimatePresence>
        {prExercises.length>0 && <PRBanner exercises={prExercises} onDone={()=>setPrExercises([])}/>}
      </AnimatePresence>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <motion.button whileTap={{scale:0.93}} onClick={()=>setShowTimer(p=>!p)} style={{
          background:showTimer?`${T.blue}22`:T.card, border:`1px solid ${showTimer?T.blue:T.border}`,
          borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:T.blue }}>
          <Icon name="timer" size={14} color={T.blue}/><span style={{fontSize:12,fontWeight:600}}>Timer</span>
        </motion.button>
        <motion.button whileTap={{scale:0.93}} onClick={()=>setShowPlate(true)} style={{
          background:T.card, border:`1px solid ${T.border}`,
          borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:T.yellow }}>
          <Icon name="plate" size={14} color={T.yellow}/><span style={{fontSize:12,fontWeight:600}}>Plates</span>
        </motion.button>
        {lastSame && (
          <motion.button whileTap={{scale:0.93}} onClick={cloneLastSession} style={{
            background:T.card, border:`1px solid ${T.border}`,
            borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:T.green }}>
            <Icon name="clone" size={14} color={T.green}/><span style={{fontSize:12,fontWeight:600}}>Clone last</span>
          </motion.button>
        )}
        <motion.button whileTap={{scale:0.93}} onClick={()=>setShowNotes(p=>!p)} style={{
          background:showNotes?`${T.purple}22`:T.card, border:`1px solid ${showNotes?T.purple:T.border}`,
          borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:T.purple, marginLeft:"auto" }}>
          <Icon name="notes" size={14} color={T.purple}/>
        </motion.button>
      </div>

      <AnimatePresence>
        {showTimer && <RestTimer onClose={()=>setShowTimer(false)}/>}
        {showPlate && <PlateCalc onClose={()=>setShowPlate(false)}/>}
      </AnimatePresence>

      {/* Notes */}
      <AnimatePresence>
        {showNotes && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden",marginBottom:12}}>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Session notes... (sleep, energy, injuries, cues)"
              style={{ width:"100%", background:T.cardHi, border:`1px solid ${T.purple}55`, borderRadius:10,
                color:T.text, padding:"10px 14px", fontSize:13, outline:"none", resize:"none", minHeight:72 }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit banner */}
      {isEditing && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} style={{
          background:`${T.yellow}18`, border:`1px solid ${T.yellow}44`,
          borderRadius:12, padding:"10px 14px", marginBottom:16,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Icon name="edit" size={14} color={T.yellow}/>
            <div><div style={{fontSize:12,fontWeight:700,color:T.yellow}}>Editing session</div>
            <div style={{fontSize:11,color:T.muted}}>{fmtDate(editingSession.date)} · {editingSession.day}</div></div>
          </div>
          <motion.button whileTap={{scale:0.9}} onClick={onEditDone} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:4,display:"flex",alignItems:"center",gap:4,fontSize:12}}>
            <Icon name="back" size={14} color={T.muted}/> Cancel
          </motion.button>
        </motion.div>
      )}

      {/* Day strip */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:20, scrollbarWidth:"none" }}>
        {DAYS.map(d=>{
          const m=SCHEDULE[d], act=d===day;
          return (
            <motion.button key={d} onClick={()=>{ if(isEditing)return; setDay(d);setSelected([]);setLogData({});setShowPicker(false); }}
              whileTap={{scale:isEditing?1:0.94}} style={{
                flexShrink:0, background:act?m.color:T.card, border:act?"none":`1px solid ${T.border}`,
                borderRadius:10, padding:"7px 14px", cursor:isEditing?"default":"pointer",
                color:act?(m.color===T.yellow?T.bg:"#fff"):T.muted,
                fontWeight:act?700:400, fontSize:12, boxShadow:act?`0 0 16px ${m.color}55`:"none",
                opacity:isEditing&&!act?0.3:1 }}>
              {d.slice(0,3)}
            </motion.button>
          );
        })}
      </div>

      {/* Day header */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:800,color:meta.color,letterSpacing:"-0.5px"}}>{meta.label}</div>
        <div style={{fontSize:13,color:T.muted,marginTop:2}}>{meta.sub}</div>
        {lastSame && <div style={{fontSize:11,color:T.muted,marginTop:4}}>Last {day}: {fmtDate(lastSame.date)}</div>}
      </div>

      {/* Exercise cards */}
      {selected.map(ex=>{
        const prs = S.get(`wt_prs_${currentUser.id}`,{});
        const curMw = maxWeight(logData[ex]||[]);
        const isPR = curMw>0 && curMw>(prs[ex]?.maxWeight||0);
        return (
          <ExerciseCard key={ex} exercise={ex}
            sets={logData[ex]||[{weight:"",reps:""}]}
            onChange={(i,f,v)=>handleSet(ex,i,f,v)}
            onAddSet={()=>addSet(ex)} onRemoveSet={i=>removeSet(ex,i)}
            onDelete={()=>removeEx(ex)}
            lastSession={lastSame?.exercises.find(e=>e.name===ex)}
            accentColor={meta.color} isPR={isPR}
          />
        );
      })}

      {/* Add exercise picker */}
      <motion.button onClick={()=>setShowPicker(p=>!p)} whileTap={{scale:0.97}} style={{
        width:"100%", background:"none", border:`1.5px dashed ${meta.color}55`, color:meta.color,
        borderRadius:12, padding:"12px 0", fontSize:13, cursor:"pointer",
        fontWeight:600, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
        <Icon name={showPicker?"close":"plus"} size={15} color={meta.color}/>
        {showPicker?"Close":"Add exercise"}
      </motion.button>

      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden",marginBottom:16}}>
            <Card style={{padding:14}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:"0.06em"}}>TAP TO SELECT</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {EXERCISE_BANK[day].map(ex=>{
                  const sel=selected.includes(ex);
                  return (
                    <motion.button key={ex} onClick={()=>toggleEx(ex)} whileTap={{scale:0.93}} style={{
                      background:sel?meta.color:T.cardHi, border:sel?"none":`1px solid ${T.border}`,
                      color:sel?(meta.color===T.yellow?T.bg:"#fff"):T.muted,
                      borderRadius:20, padding:"5px 13px", fontSize:12, cursor:"pointer",
                      fontWeight:sel?700:400, boxShadow:sel?`0 0 10px ${meta.color}44`:"none" }}>{ex}</motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selected.length>0 && (
        <GlowBtn full color={saved?T.green:isEditing?T.yellow:T.blue} onClick={saveSession}>
          <Icon name={saved?"check":isEditing?"edit":"save"} size={16} color={isEditing&&!saved?T.bg:"#fff"}/>
          {saved?"Saved!":isEditing?"Update session":"Save session"}
        </GlowBtn>
      )}
    </div>
  );
}

// ─── Progress View ────────────────────────────────────────────────────────────
function ProgressView({ currentUser }) {
  const [timeFilter, setTimeFilter]= useState("Weekly");
  const [selEx, setSelEx]          = useState(null);
  const [bwInput, setBwInput]      = useState("");
  const [bwSaved, setBwSaved]      = useState(false);

  const allSessions = S.get("wt_sessions",[]).filter(s=>s.userId===currentUser.id);
  const filtered    = filterSessions(allSessions, timeFilter);
  const bwLog       = S.get(`wt_bw_${currentUser.id}`,[]);

  const allExercises = useMemo(()=>{
    const set=new Set(); allSessions.forEach(s=>s.exercises.forEach(e=>set.add(e.name)));
    return [...set].sort();
  },[allSessions.length]);

  useEffect(()=>{ if(!selEx&&allExercises.length) setSelEx(allExercises[0]); },[allExercises]);

  function saveBW() {
    if (!bwInput) return;
    const entry = { date:todayISO(), weight:parseFloat(bwInput) };
    const updated = [...bwLog.filter(e=>e.date!==todayISO()), entry];
    S.set(`wt_bw_${currentUser.id}`, updated);
    setBwSaved(true); setBwInput("");
    setTimeout(()=>setBwSaved(false),2000);
  }

  const weeklyVol = useMemo(()=>{
    const map={};
    filtered.forEach(s=>{
      const wk=weekStart(s.date);
      if(!map[wk]) map[wk]={week:fmtShort(wk),volume:0,sessions:0};
      map[wk].sessions++;
      s.exercises.forEach(e=>{map[wk].volume+=totalVol(e.sets);});
    });
    return Object.values(map).sort((a,b)=>a.week.localeCompare(b.week));
  },[filtered]);

  // Per-exercise chart
  const exData = useMemo(()=>{
    if (!selEx) return [];
    return allSessions
      .filter(s=>s.exercises.some(e=>e.name===selEx))
      .sort((a,b)=>new Date(a.date)-new Date(b.date))
      .map(s=>{
        const ex=s.exercises.find(e=>e.name===selEx);
        return { date:fmtShort(s.date), "Max weight":maxWeight(ex.sets), "Volume":Math.round(totalVol(ex.sets)) };
      });
  },[allSessions,selEx]);

  // Bodyweight overlay
  const bwChartData = useMemo(()=>{
    return bwLog.slice(-12).map(e=>({ date:fmtShort(e.date), Bodyweight:e.weight }));
  },[bwLog]);

  const totalSess   = filtered.length;
  const totalVolAll = filtered.reduce((t,s)=>t+s.exercises.reduce((tt,e)=>tt+totalVol(e.sets),0),0);
  const totalEx     = filtered.reduce((t,s)=>t+s.exercises.length,0);
  const ttStyle     = { background:T.card, border:`1px solid ${T.border}`, borderRadius:8, fontSize:12 };

  if (!allSessions.length) return (
    <div style={{textAlign:"center",paddingTop:60}}>
      <Icon name="trend" size={40} color={T.border} style={{display:"block",margin:"0 auto 12px"}}/>
      <div style={{color:T.muted,fontSize:14}}>Log your first session to see progress</div>
    </div>
  );

  return (
    <div>
      {/* Time filter */}
      <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",scrollbarWidth:"none"}}>
        <Icon name="filter" size={16} color={T.muted} style={{flexShrink:0,marginTop:5}}/>
        {TIME_FILTERS.map(f=><Pill key={f} label={f} active={timeFilter===f} color={T.blue} onClick={()=>setTimeFilter(f)}/>)}
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
        {[{label:"Sessions",value:totalSess},{label:"Exercises",value:totalEx},{label:"Volume",value:`${(totalVolAll/1000).toFixed(1)}t`}].map(k=>(
          <Card key={k.label} style={{padding:"12px 10px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:T.yellow}}>{k.value}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2,letterSpacing:"0.06em"}}>{k.label.toUpperCase()}</div>
          </Card>
        ))}
      </div>

      {/* Weekly volume bar */}
      {weeklyVol.length>0 && (
        <Card style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:12,letterSpacing:"0.06em"}}>WEEKLY VOLUME (KG)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyVol} margin={{top:4,right:8,left:-18,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="week" tick={{fontSize:9,fill:T.muted}}/>
              <YAxis tick={{fontSize:9,fill:T.muted}}/>
              <Tooltip contentStyle={ttStyle} cursor={{fill:T.border+"55"}}/>
              <Bar dataKey="volume" fill={T.blue} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Bodyweight log */}
      <Card style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:12,letterSpacing:"0.06em",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>BODYWEIGHT (KG)</span>
          <Tag label={bwLog.length?`${bwLog[bwLog.length-1]?.weight}kg today`:"Log today"} color={T.green}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input type="number" value={bwInput} onChange={e=>setBwInput(e.target.value)}
            placeholder="e.g. 75.5" style={{
              flex:1, background:T.cardHi, border:`1px solid ${T.border}`, borderRadius:8,
              color:T.text, padding:"8px 12px", fontSize:14, outline:"none"}}/>
          <GlowBtn small color={bwSaved?T.green:T.green} onClick={saveBW}>
            <Icon name={bwSaved?"check":"plus"} size={14} color="#fff"/>
          </GlowBtn>
        </div>
        {bwChartData.length>=2 && (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={bwChartData} margin={{top:4,right:8,left:-18,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="date" tick={{fontSize:9,fill:T.muted}}/>
              <YAxis tick={{fontSize:9,fill:T.muted}} domain={["auto","auto"]}/>
              <Tooltip contentStyle={ttStyle}/>
              <Line type="monotone" dataKey="Bodyweight" stroke={T.green} strokeWidth={2} dot={{r:3,fill:T.green}}/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Per-exercise trend */}
      <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:10,letterSpacing:"0.06em"}}>PER EXERCISE TREND</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {allExercises.map(ex=>(
          <Pill key={ex} label={ex} active={selEx===ex} color={T.yellow} onClick={()=>setSelEx(ex)}/>
        ))}
      </div>
      {selEx && (
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:T.yellow}}>{selEx}</div>
          {exData.length<2
            ? <div style={{textAlign:"center",color:T.muted,padding:"20px 0",fontSize:13}}>Log 2+ sessions to see trend</div>
            : <ResponsiveContainer width="100%" height={200}>
                <LineChart data={exData} margin={{top:4,right:8,left:-18,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                  <XAxis dataKey="date" tick={{fontSize:9,fill:T.muted}}/>
                  <YAxis tick={{fontSize:9,fill:T.muted}}/>
                  <Tooltip contentStyle={ttStyle}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Line type="monotone" dataKey="Max weight" stroke={T.yellow} strokeWidth={2.5} dot={{r:3,fill:T.yellow}}/>
                  <Line type="monotone" dataKey="Volume" stroke={T.blue} strokeWidth={2} dot={{r:3,fill:T.blue}} strokeDasharray="4 2"/>
                </LineChart>
              </ResponsiveContainer>
          }
        </Card>
      )}
    </div>
  );
}

// ─── History View ─────────────────────────────────────────────────────────────
function HistoryView({ currentUser, onEditSession }) {
  const [timeFilter, setTimeFilter]= useState("Weekly");
  const [sessions, setSessions]    = useState(()=>S.get("wt_sessions",[]));

  useEffect(()=>{ setSessions(S.get("wt_sessions",[])); },[]);

  const allSessions = sessions.filter(s=>s.userId===currentUser.id);
  const filtered    = filterSessions(allSessions, timeFilter).sort((a,b)=>new Date(b.date)-new Date(a.date));

  // Heatmap — last 12 weeks
  const heatmapData = useMemo(()=>{
    const map={};
    allSessions.forEach(s=>{ map[s.date]=(map[s.date]||0)+1; });
    const weeks=[];
    for (let w=11;w>=0;w--) {
      const days=[];
      for (let d=0;d<7;d++) {
        const dt=new Date(); dt.setDate(dt.getDate()-w*7-d);
        const iso=dt.toISOString().split("T")[0];
        days.push({ date:iso, count:map[iso]||0, day:DAYS[dt.getDay()===0?6:dt.getDay()-1].slice(0,1) });
      }
      weeks.push(days);
    }
    return weeks;
  },[allSessions.length]);

  function deleteSession(id) {
    const updated=S.get("wt_sessions",[]).filter(s=>s.id!==id);
    S.set("wt_sessions",updated); setSessions(updated);
  }

  function exportCSV() {
    const rows=[["Date","Day","Exercise","Set","Weight(kg)","Reps","Volume"]];
    allSessions.forEach(s=>s.exercises.forEach(e=>e.sets.forEach((st,i)=>
      rows.push([s.date,s.day,e.name,i+1,st.weight,st.reps,(parseFloat(st.weight)||0)*(parseInt(st.reps)||0)])
    )));
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
    a.download="overload_sessions.csv"; a.click();
  }

  const heatColors = n => n===0?T.border:n===1?T.blueDim:n===2?T.blue:T.yellow;

  return (
    <div>
      {/* Heatmap */}
      <Card style={{marginBottom:20,padding:"14px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,letterSpacing:"0.06em"}}>TRAINING HEATMAP</div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            {[0,1,2,3].map(n=>(
              <div key={n} style={{width:10,height:10,borderRadius:2,background:heatColors(n)}}/>
            ))}
            <span style={{fontSize:9,color:T.muted,marginLeft:2}}>less → more</span>
          </div>
        </div>
        <div style={{display:"flex",gap:3,overflowX:"auto",scrollbarWidth:"none"}}>
          {heatmapData.map((week,wi)=>(
            <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
              {week.map((d,di)=>(
                <div key={di} title={`${d.date}: ${d.count} session${d.count!==1?"s":""}`}
                  style={{ width:14,height:14,borderRadius:3, background:heatColors(Math.min(d.count,3)),
                    opacity:new Date(d.date)>new Date()?0.2:1 }}/>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Filter + Export */}
      <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",scrollbarWidth:"none",alignItems:"center"}}>
        <Icon name="calendar" size={16} color={T.muted} style={{flexShrink:0,marginTop:1}}/>
        {TIME_FILTERS.map(f=><Pill key={f} label={f} active={timeFilter===f} color={T.blue} onClick={()=>setTimeFilter(f)}/>)}
        <motion.button whileTap={{scale:0.93}} onClick={exportCSV} style={{
          background:T.card, border:`1px solid ${T.border}`, borderRadius:10,
          padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:4,
          color:T.muted, marginLeft:"auto", flexShrink:0 }}>
          <Icon name="export" size={13} color={T.muted}/><span style={{fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>Export CSV</span>
        </motion.button>
      </div>

      {filtered.length===0 && (
        <div style={{textAlign:"center",paddingTop:40}}>
          <Icon name="history" size={36} color={T.border} style={{display:"block",margin:"0 auto 10px"}}/>
          <div style={{color:T.muted,fontSize:13}}>No sessions in this period</div>
        </div>
      )}

      {filtered.map(s=>{
        const m=SCHEDULE[s.day];
        return (
          <motion.div key={s.id} initial={{opacity:0}} animate={{opacity:1}}
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
            <div style={{height:3,background:`linear-gradient(90deg,${m.color},${T.yellow})`}}/>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <span style={{fontWeight:700,fontSize:14,color:m.color}}>{m.label}</span>
                  <span style={{fontSize:12,color:T.muted}}> · {s.day}</span>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{fmtDate(s.date)}</div>
                  {s.notes && <div style={{fontSize:11,color:T.purple,marginTop:3,fontStyle:"italic"}}>"{s.notes}"</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <div style={{fontSize:11,color:T.yellow,fontWeight:700}}>
                    {Math.round(s.exercises.reduce((t,e)=>t+totalVol(e.sets),0))}kg vol
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <motion.button whileTap={{scale:0.88}} onClick={()=>onEditSession(s)} style={{
                      background:`${T.blue}22`, border:`1px solid ${T.blue}44`,
                      borderRadius:8, padding:"4px 10px", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:4, color:T.blue }}>
                      <Icon name="edit" size={12} color={T.blue}/><span style={{fontSize:11,fontWeight:700}}>Edit</span>
                    </motion.button>
                    <motion.button whileTap={{scale:0.88}} onClick={()=>deleteSession(s.id)} style={{
                      background:`${T.danger}18`, border:`1px solid ${T.danger}33`,
                      borderRadius:8, padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                      <Icon name="trash" size={12} color={T.danger}/>
                    </motion.button>
                  </div>
                </div>
              </div>
              {s.exercises.map(ex=>(
                <div key={ex.name} style={{borderTop:`1px solid ${T.border}`,paddingTop:8,marginTop:8}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{ex.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{ex.sets.map(st=>`${st.weight}kg×${st.reps}`).join("  ·  ")}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── PRs View ─────────────────────────────────────────────────────────────────
function PRsView({ currentUser }) {
  const prs     = S.get(`wt_prs_${currentUser.id}`,{});
  const entries = Object.entries(prs).sort((a,b)=>b[1].maxWeight-a[1].maxWeight);

  if (!entries.length) return (
    <div style={{textAlign:"center",paddingTop:60}}>
      <Icon name="trophy" size={48} color={T.border} style={{display:"block",margin:"0 auto 16px"}}/>
      <div style={{fontSize:16,fontWeight:700,color:T.muted}}>No PRs yet</div>
      <div style={{fontSize:13,color:T.muted,marginTop:6}}>Save sessions to start tracking records</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <Icon name="trophy" size={20} color={T.yellow}/>
        <span style={{fontSize:18,fontWeight:800}}>Personal Records</span>
        <Tag label={`${entries.length} exercises`} color={T.yellow}/>
      </div>

      {entries.map(([name,pr],i)=>(
        <motion.div key={name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
          style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
          <div style={{height:3,background:`linear-gradient(90deg,${T.yellow},#FF9500)`}}/>
          <div style={{padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>{name}</div>
              <div style={{width:28,height:28,borderRadius:8,background:`${T.yellow}22`,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="star" size={14} color={T.yellow}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:10,color:T.muted,letterSpacing:"0.06em"}}>MAX WEIGHT</div>
                <div style={{fontSize:22,fontWeight:800,color:T.yellow,marginTop:2}}>{pr.maxWeight}kg</div>
                {pr.maxWeightDate && <div style={{fontSize:10,color:T.muted,marginTop:2}}>{fmtDate(pr.maxWeightDate)}</div>}
              </div>
              <div>
                <div style={{fontSize:10,color:T.muted,letterSpacing:"0.06em"}}>MAX VOLUME</div>
                <div style={{fontSize:22,fontWeight:800,color:T.blue,marginTop:2}}>{pr.maxVolume}kg</div>
                {pr.maxVolumeDate && <div style={{fontSize:10,color:T.muted,marginTop:2}}>{fmtDate(pr.maxVolumeDate)}</div>}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Wellness View ────────────────────────────────────────────────────────────
function WellnessView({ currentUser }) {
  const uid = currentUser.id;

  // ── Shared helpers ──
  const qualityLabels = ["","Poor","Fair","Good","Great","Perfect"];
  const qualityColors = ["",T.danger,"#FF9500",T.yellow,T.green,"#00E5FF"];
  const WFILTERS = ["Daily","Weekly","Monthly"];

  function fmtDuration(mins) {
    const h = Math.floor(mins/60), m = mins%60;
    return `${h}h ${m.toString().padStart(2,"0")}m`;
  }
  function fmtElapsed(secs) {
    const h=Math.floor(secs/3600), m=Math.floor((secs%3600)/60), s=secs%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function filterByPeriod(items, filter, dateKey="date") {
    const now = new Date();
    return items.filter(e => {
      const d = new Date(e[dateKey]);
      if (filter==="Daily")   return e[dateKey]===todayISO();
      if (filter==="Weekly")  { const mon=new Date(now); mon.setDate(now.getDate()-((now.getDay()+6)%7)); mon.setHours(0,0,0,0); return d>=mon; }
      if (filter==="Monthly") return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
      return true;
    });
  }

  // ══════════════════════════════════════════════
  // SLEEP STATE
  // ══════════════════════════════════════════════
  const [sleepLog,    setSleepLog]    = useState(()=>S.get(`wt_sleep_${uid}`,[]))
  const [timerActive, setTimerActive] = useState(()=>!!S.get(`wt_sleep_timer_${uid}`,null));
  const [timerStart,  setTimerStart]  = useState(()=>S.get(`wt_sleep_timer_${uid}`,null));
  const [elapsed,     setElapsed]     = useState(0);
  const [manualH,     setManualH]     = useState("");
  const [manualM,     setManualM]     = useState("");
  const [quality,     setQuality]     = useState(3);
  const [sleepNote,   setSleepNote]   = useState("");
  const [sleepSaved,  setSleepSaved]  = useState(false);
  const [sleepFilter, setSleepFilter] = useState("Weekly");
  const timerRef = useRef(null);

  useEffect(()=>{
    if (timerActive && timerStart) {
      timerRef.current = setInterval(()=>setElapsed(Math.floor((Date.now()-timerStart)/1000)),1000);
    }
    return ()=>clearInterval(timerRef.current);
  },[timerActive,timerStart]);

  function startSleepTimer() {
    const now=Date.now(); S.set(`wt_sleep_timer_${uid}`,now);
    setTimerStart(now); setTimerActive(true); setElapsed(0);
  }
  function stopSleepTimer() {
    clearInterval(timerRef.current);
    saveSleepEntry(Math.round(elapsed/60));
    S.set(`wt_sleep_timer_${uid}`,null);
    setTimerActive(false); setTimerStart(null); setElapsed(0);
  }
  function saveSleepManual() {
    const mins=(parseInt(manualH)||0)*60+(parseInt(manualM)||0);
    if (!mins) return;
    saveSleepEntry(mins); setManualH(""); setManualM("");
  }
  function saveSleepEntry(durationMins) {
    const entry={ id:Date.now(), date:todayISO(), durationMins, quality, note:sleepNote,
      savedAt:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) };
    const updated=[entry,...sleepLog.filter(e=>e.date!==todayISO())];
    S.set(`wt_sleep_${uid}`,updated); setSleepLog(updated);
    setSleepSaved(true); setSleepNote(""); setQuality(3);
    setTimeout(()=>setSleepSaved(false),2000);
  }
  function deleteSleep(id) {
    const u=sleepLog.filter(e=>e.id!==id); S.set(`wt_sleep_${uid}`,u); setSleepLog(u);
  }

  // filtered sleep records
  const filteredSleep = filterByPeriod(sleepLog, sleepFilter);
  const avgSleep = filteredSleep.length
    ? Math.round(filteredSleep.reduce((t,e)=>t+e.durationMins,0)/filteredSleep.length) : 0;
  const avgQuality = filteredSleep.length
    ? (filteredSleep.reduce((t,e)=>t+e.quality,0)/filteredSleep.length).toFixed(1) : 0;
  const bestSleep = filteredSleep.length
    ? Math.max(...filteredSleep.map(e=>e.durationMins)) : 0;

  // ══════════════════════════════════════════════
  // PROTEIN STATE
  // ══════════════════════════════════════════════
  const [proteinTarget, setProteinTarget] = useState(()=>S.get(`wt_ptarget_${uid}`,160));
  const [proteinLog,    setProteinLog]    = useState(()=>S.get(`wt_protein_${uid}`,[]));
  const [mealDesc,      setMealDesc]      = useState("");
  const [mealGrams,     setMealGrams]     = useState("");
  const [editTarget,    setEditTarget]    = useState(false);
  const [targetInput,   setTargetInput]   = useState(String(proteinTarget));
  const [mealSaved,     setMealSaved]     = useState(false);
  const [proteinFilter, setProteinFilter] = useState("Weekly");

  const todayProtein = proteinLog.filter(m=>m.date===todayISO());
  const todayTotal   = todayProtein.reduce((t,m)=>t+(parseFloat(m.grams)||0),0);
  const pct          = Math.min(todayTotal/proteinTarget,1);
  const circ         = 2*Math.PI*36;

  function saveTarget() {
    const t=parseInt(targetInput)||160; setProteinTarget(t);
    S.set(`wt_ptarget_${uid}`,t); setEditTarget(false);
  }
  function addMeal() {
    if (!mealGrams) return;
    const entry={ id:Date.now(), date:todayISO(), desc:mealDesc||"Meal",
      grams:parseFloat(mealGrams), time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) };
    const updated=[entry,...proteinLog];
    S.set(`wt_protein_${uid}`,updated); setProteinLog(updated);
    setMealDesc(""); setMealGrams("");
    setMealSaved(true); setTimeout(()=>setMealSaved(false),1500);
  }
  function deleteMeal(id) {
    const u=proteinLog.filter(m=>m.id!==id); S.set(`wt_protein_${uid}`,u); setProteinLog(u);
  }

  // filtered protein records — group by date
  const filteredProtein = filterByPeriod(proteinLog, proteinFilter);
  const filteredDates   = [...new Set(filteredProtein.map(m=>m.date))].sort().reverse();
  const totalProteinPeriod = filteredProtein.reduce((t,m)=>t+(parseFloat(m.grams)||0),0);
  const daysHitTarget = filteredDates.filter(date=>{
    const tot=filteredProtein.filter(m=>m.date===date).reduce((t,m)=>t+(parseFloat(m.grams)||0),0);
    return tot>=proteinTarget;
  }).length;
  const avgProtein = filteredDates.length
    ? Math.round(filteredProtein.reduce((t,m)=>t+(parseFloat(m.grams)||0),0)/filteredDates.length) : 0;

  // section header component
  function SectionHeader({ icon, color, title, sub }) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ width:38, height:38, borderRadius:12, background:`${color}22`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon name={icon} size={18} color={color}/>
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:800 }}>{title}</div>
          <div style={{ fontSize:11, color:T.muted }}>{sub}</div>
        </div>
      </div>
    );
  }

  function FilterRow({ value, onChange, color }) {
    return (
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {WFILTERS.map(f=>(
          <Pill key={f} label={f} active={value===f} color={color} onClick={()=>onChange(f)}/>
        ))}
      </div>
    );
  }

  return (
    <div>

      {/* ══════════════════════════════════════
          SLEEP SECTION — LOGGER
      ══════════════════════════════════════ */}
      <SectionHeader icon="moon2" color={T.blue} title="Sleep Tracker" sub="Timer or manual · quality rating"/>

      <Card style={{ marginBottom:14 }}>
        {timerActive ? (
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontSize:11, color:T.blue, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>SLEEPING…</div>
            <div style={{ fontSize:42, fontWeight:800, color:T.text, letterSpacing:"-2px", fontVariantNumeric:"tabular-nums" }}>
              {fmtElapsed(elapsed)}
            </div>
            <div style={{ fontSize:12, color:T.muted, margin:"8px 0 20px" }}>
              Started · {new Date(timerStart).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
            </div>
            <GlowBtn full color={T.danger} onClick={stopSleepTimer}>
              <Icon name="pause" size={15} color="#fff"/> Wake up — Stop & Save
            </GlowBtn>
          </div>
        ) : (
          <>
            <GlowBtn full color={T.blue} onClick={startSleepTimer} style={{marginBottom:16}}>
              <Icon name="play" size={15} color="#fff"/> Start Sleep Timer
            </GlowBtn>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:T.border }}/><span style={{ fontSize:11, color:T.muted, whiteSpace:"nowrap" }}>or log manually</span>
              <div style={{ flex:1, height:1, background:T.border }}/>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:5 }}>Hours</div>
                <Input type="number" value={manualH} onChange={e=>setManualH(e.target.value)} placeholder="7"/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:5 }}>Minutes</div>
                <Input type="number" value={manualM} onChange={e=>setManualM(e.target.value)} placeholder="30"/>
              </div>
            </div>

            <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:"0.06em", marginBottom:8 }}>QUALITY</div>
            <div style={{ display:"flex", gap:5, marginBottom:14 }}>
              {[1,2,3,4,5].map(q=>(
                <motion.button key={q} whileTap={{scale:0.88}} onClick={()=>setQuality(q)} style={{
                  flex:1, background:quality===q?qualityColors[q]+"33":T.cardHi,
                  border:`1.5px solid ${quality===q?qualityColors[q]:T.border}`,
                  borderRadius:8, padding:"7px 0", cursor:"pointer",
                  color:quality===q?qualityColors[q]:T.muted, fontSize:10, fontWeight:700 }}>
                  {qualityLabels[q]}
                </motion.button>
              ))}
            </div>

            <textarea value={sleepNote} onChange={e=>setSleepNote(e.target.value)}
              placeholder="Notes — e.g. woke up twice, felt rested..."
              style={{ width:"100%", background:T.cardHi, border:`1px solid ${T.border}`, borderRadius:10,
                color:T.text, padding:"10px 14px", fontSize:13, outline:"none", resize:"none", minHeight:52, marginBottom:12 }}/>

            <GlowBtn full color={sleepSaved?T.green:T.blue} onClick={saveSleepManual}>
              <Icon name={sleepSaved?"check":"bed"} size={15} color="#fff"/>
              {sleepSaved?"Saved!":"Save Sleep Entry"}
            </GlowBtn>
          </>
        )}
      </Card>

      {/* ── SLEEP REPORT ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.muted, letterSpacing:"0.08em" }}>SLEEP REPORT</div>
      </div>
      <FilterRow value={sleepFilter} onChange={setSleepFilter} color={T.blue}/>

      {filteredSleep.length===0 ? (
        <Card style={{ marginBottom:28, textAlign:"center", padding:"24px 16px" }}>
          <Icon name="moon2" size={28} color={T.border} style={{ display:"block", margin:"0 auto 8px" }}/>
          <div style={{ color:T.muted, fontSize:13 }}>No sleep records in this period</div>
        </Card>
      ) : (
        <>
          {/* Summary KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[
              { label:"AVG SLEEP",    value:fmtDuration(avgSleep),    color:T.blue   },
              { label:"BEST NIGHT",   value:fmtDuration(bestSleep),   color:T.yellow },
              { label:"AVG QUALITY",  value:`${avgQuality}/5`,        color:qualityColors[Math.round(Number(avgQuality))]||T.green },
            ].map(k=>(
              <Card key={k.label} style={{ padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:13, fontWeight:800, color:k.color }}>{k.value}</div>
                <div style={{ fontSize:9, color:T.muted, marginTop:3, letterSpacing:"0.06em" }}>{k.label}</div>
              </Card>
            ))}
          </div>

          {/* Records list */}
          <Card style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:"0.08em", marginBottom:12 }}>
              RECORDS · {filteredSleep.length} {sleepFilter==="Daily"?"today":sleepFilter==="Weekly"?"this week":"this month"}
            </div>
            {filteredSleep.map((entry,i)=>(
              <motion.div key={entry.id} initial={{opacity:0}} animate={{opacity:1}}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  paddingTop:i>0?12:0, marginTop:i>0?12:0, borderTop:i>0?`1px solid ${T.border}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${qualityColors[entry.quality]}22`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="moon2" size={18} color={qualityColors[entry.quality]}/>
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <span style={{ fontSize:16, fontWeight:800 }}>{fmtDuration(entry.durationMins)}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:qualityColors[entry.quality],
                        background:qualityColors[entry.quality]+"22", padding:"2px 8px", borderRadius:20 }}>
                        {qualityLabels[entry.quality]}
                      </span>
                    </div>
                    <div style={{ fontSize:11, color:T.muted }}>{fmtDate(entry.date)} · {entry.savedAt}</div>
                    {entry.note && <div style={{ fontSize:11, color:T.purple, marginTop:3, fontStyle:"italic" }}>"{entry.note}"</div>}
                  </div>
                </div>
                <motion.button whileTap={{scale:0.88}} onClick={()=>deleteSleep(entry.id)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                  <Icon name="trash" size={13} color={T.muted}/>
                </motion.button>
              </motion.div>
            ))}
          </Card>
        </>
      )}

      {/* ══════════ SECTION DIVIDER ══════════ */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <div style={{ flex:1, height:1, background:T.border }}/>
        <div style={{ width:32, height:32, borderRadius:10,
          background:`linear-gradient(135deg,${T.blue}44,${T.green}44)`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="wellness" size={14} color={T.text}/>
        </div>
        <div style={{ flex:1, height:1, background:T.border }}/>
      </div>

      {/* ══════════════════════════════════════
          PROTEIN SECTION — LOGGER
      ══════════════════════════════════════ */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <SectionHeader icon="protein" color={T.green} title="Protein Tracker" sub={`Daily target: ${proteinTarget}g protein`}/>
        <motion.button whileTap={{scale:0.9}} onClick={()=>setEditTarget(p=>!p)} style={{
          background:`${T.blue}18`, border:`1px solid ${T.blue}33`, borderRadius:8,
          padding:"5px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, color:T.blue, flexShrink:0 }}>
          <Icon name="edit" size={12} color={T.blue}/>
          <span style={{fontSize:11,fontWeight:700}}>Target</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {editTarget && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{overflow:"hidden",marginBottom:12}}>
            <Card style={{padding:14}}>
              <div style={{fontSize:12,color:T.muted,marginBottom:8}}>Daily protein target (g)</div>
              <div style={{display:"flex",gap:8}}>
                <Input type="number" value={targetInput} onChange={e=>setTargetInput(e.target.value)} placeholder="160"/>
                <GlowBtn color={T.green} small onClick={saveTarget}><Icon name="check" size={14} color="#fff"/></GlowBtn>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's progress ring + add meal */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <svg width={92} height={92} style={{transform:"rotate(-90deg)"}}>
              <circle cx={46} cy={46} r={36} fill="none" stroke={T.border} strokeWidth={7}/>
              <circle cx={46} cy={46} r={36} fill="none" stroke={pct>=1?T.yellow:T.green} strokeWidth={7}
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
                style={{transition:"stroke-dashoffset 0.5s ease"}}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:19, fontWeight:800, color:pct>=1?T.yellow:T.green }}>{Math.round(todayTotal)}</span>
              <span style={{ fontSize:9, color:T.muted }}>/ {proteinTarget}g</span>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:2 }}>TODAY</div>
            <div style={{ fontSize:26, fontWeight:800, color:pct>=1?T.yellow:T.green }}>{Math.round(todayTotal)}g</div>
            <div style={{ fontSize:12, color:T.muted, marginBottom:8 }}>
              {pct>=1 ? "Target hit!" : `${Math.round(proteinTarget-todayTotal)}g to go`}
            </div>
            <div style={{ height:6, borderRadius:4, background:T.border, overflow:"hidden" }}>
              <motion.div animate={{width:`${pct*100}%`}} style={{ height:"100%", borderRadius:4,
                background:pct>=1?`linear-gradient(90deg,${T.green},${T.yellow})`:`linear-gradient(90deg,${T.green},${T.blueHi})` }}/>
            </div>
          </div>
        </div>

        <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:"0.06em", marginBottom:8 }}>ADD MEAL</div>
        <Input value={mealDesc} onChange={e=>setMealDesc(e.target.value)}
          placeholder="Meal description (e.g. Chicken rice bowl)" style={{marginBottom:8}}/>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ flex:1 }}>
            <Input type="number" value={mealGrams} onChange={e=>setMealGrams(e.target.value)}
              placeholder="Protein grams" onKeyDown={e=>e.key==="Enter"&&addMeal()}/>
          </div>
          <GlowBtn color={T.green} small onClick={addMeal}>
            <Icon name={mealSaved?"check":"plus"} size={15} color="#fff"/>
          </GlowBtn>
        </div>

        {todayProtein.length>0 && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:"0.06em", marginBottom:10 }}>TODAY'S MEALS</div>
            {todayProtein.map((meal,i)=>(
              <motion.div key={meal.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  paddingTop:i>0?10:0, marginTop:i>0?10:0, borderTop:i>0?`1px solid ${T.border}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:`${T.green}22`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="drop" size={14} color={T.green}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{meal.desc}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{meal.time}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:T.green }}>{meal.grams}g</span>
                  <motion.button whileTap={{scale:0.88}} onClick={()=>deleteMeal(meal.id)}
                    style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                    <Icon name="trash" size={13} color={T.muted}/>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* ── PROTEIN REPORT ── */}
      <div style={{ fontSize:12, fontWeight:700, color:T.muted, letterSpacing:"0.08em", marginBottom:10 }}>PROTEIN REPORT</div>
      <FilterRow value={proteinFilter} onChange={setProteinFilter} color={T.green}/>

      {filteredDates.length===0 ? (
        <Card style={{ marginBottom:24, textAlign:"center", padding:"24px 16px" }}>
          <Icon name="protein" size={28} color={T.border} style={{ display:"block", margin:"0 auto 8px" }}/>
          <div style={{ color:T.muted, fontSize:13 }}>No protein records in this period</div>
        </Card>
      ) : (
        <>
          {/* Summary KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[
              { label:"AVG / DAY",    value:`${avgProtein}g`,          color:T.green  },
              { label:"TOTAL",        value:`${Math.round(totalProteinPeriod)}g`, color:T.blue },
              { label:"DAYS ON TARGET", value:`${daysHitTarget}/${filteredDates.length}`, color:T.yellow },
            ].map(k=>(
              <Card key={k.label} style={{ padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:13, fontWeight:800, color:k.color }}>{k.value}</div>
                <div style={{ fontSize:9, color:T.muted, marginTop:3, letterSpacing:"0.06em" }}>{k.label}</div>
              </Card>
            ))}
          </div>

          {/* Per-day breakdown */}
          <Card style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:"0.08em", marginBottom:14 }}>
              DAILY BREAKDOWN · {filteredDates.length} {proteinFilter==="Daily"?"day":proteinFilter==="Weekly"?"days this week":"days this month"}
            </div>
            {filteredDates.map((date,i)=>{
              const dayMeals = filteredProtein.filter(m=>m.date===date);
              const dayTotal = dayMeals.reduce((t,m)=>t+(parseFloat(m.grams)||0),0);
              const dayPct   = Math.min(dayTotal/proteinTarget,1);
              const hit      = dayTotal>=proteinTarget;
              return (
                <div key={date} style={{ paddingTop:i>0?14:0, marginTop:i>0?14:0, borderTop:i>0?`1px solid ${T.border}`:"none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:hit?T.green:T.muted }}/>
                      <span style={{ fontSize:12, fontWeight:600 }}>{fmtDate(date)}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, fontWeight:800, color:hit?T.yellow:T.green }}>{Math.round(dayTotal)}g</span>
                      {hit && <span style={{ fontSize:10, color:T.green, fontWeight:700 }}>✓</span>}
                    </div>
                  </div>
                  <div style={{ height:5, borderRadius:4, background:T.border, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ height:"100%", width:`${dayPct*100}%`, borderRadius:4,
                      background:hit?`linear-gradient(90deg,${T.green},${T.yellow})`:`linear-gradient(90deg,${T.green},${T.blueHi})` }}/>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {dayMeals.map(m=>(
                      <span key={m.id} style={{ fontSize:10, color:T.muted, background:T.cardHi,
                        border:`1px solid ${T.border}`, borderRadius:20, padding:"2px 8px" }}>
                        {m.desc} · {m.grams}g
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        </>
      )}

    </div>
  );
}

// ─── Log + Progress (merged tab) ─────────────────────────────────────────────
function LogProgressView({ currentUser, editingSession, onEditDone }) {
  const [inner, setInner] = useState("log");

  return (
    <div>
      {/* Inner segment toggle */}
      <div style={{
        display:"flex", background:T.cardHi, borderRadius:12, padding:4,
        marginBottom:20, border:`1px solid ${T.border}`
      }}>
        {[
          { id:"log",      label:"Log Today",  icon:"log"      },
          { id:"progress", label:"Progress",   icon:"progress" },
        ].map(s => {
          const active = inner === s.id;
          return (
            <motion.button key={s.id} onClick={()=>setInner(s.id)} whileTap={{scale:0.97}} style={{
              flex:1, background:active?T.blue:"none",
              border:"none", borderRadius:9, padding:"9px 0",
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:7,
              color:active?"#fff":T.muted, fontWeight:active?700:500, fontSize:13,
              boxShadow:active?`0 0 16px ${T.blue}44`:"none",
              transition:"all 0.18s"
            }}>
              <Icon name={s.icon} size={14} color={active?"#fff":T.muted}/>
              {s.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={inner}
          initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-6}} transition={{duration:0.13}}>
          {inner==="log"
            ? <LogView currentUser={currentUser} editingSession={editingSession} onEditDone={onEditDone}/>
            : <ProgressView currentUser={currentUser}/>
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(()=>{ initStorage(); },[]);

  const [currentUser,  setCurrentUser]      = useState(()=>S.get("wt_session",null));
  const [tab,          setTab]              = useState("train");
  const [editingSession, setEditingSession] = useState(null);

  function handleLogin(user)  { setCurrentUser(user); S.set("wt_session",user); }
  function handleLogout()     { setCurrentUser(null);  S.set("wt_session",null); setEditingSession(null); }
  function handleEditSession(session) { setEditingSession(session); setTab("train"); }
  function handleEditDone()   { setEditingSession(null); }

  if (!currentUser) return (<><style>{mkCSS(false)}</style><LoginScreen onLogin={handleLogin}/></>);

  const today     = todayName();
  const todayMeta = SCHEDULE[today];
  const userSessions = S.get("wt_sessions",[]).filter(s=>s.userId===currentUser.id);
  const streak    = calcStreak(userSessions);

  const tabs = [
    { id:"train",    label:"Train",    icon:"log"      },
    { id:"history",  label:"History",  icon:"history"  },
    { id:"prs",      label:"PRs",      icon:"trophy"   },
    { id:"wellness", label:"Wellness", icon:"wellness" },
    ...(currentUser.role==="admin"?[{ id:"admin", label:"Admin", icon:"admin" }]:[]),
  ];

  return (
    <>
      <style>{mkCSS(false)}</style>
      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100dvh",background:T.bg}}>

        {/* Header */}
        <div style={{background:T.card,borderBottom:`1px solid ${T.border}`,
          padding:"14px 20px 12px",position:"sticky",top:0,zIndex:20,backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:T.muted,letterSpacing:"0.1em",fontWeight:600}}>
                {today.toUpperCase()} · {todayMeta.label.toUpperCase()}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:1}}>
                <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.5px"}}>Over<span style={{color:T.yellow}}>load</span></div>
                {streak>0 && (
                  <div style={{display:"flex",alignItems:"center",gap:4,background:`${T.orange}22`,
                    border:`1px solid ${T.orange}44`,borderRadius:20,padding:"2px 8px"}}>
                    <Icon name="fire" size={12} color={T.orange}/>
                    <span style={{fontSize:11,fontWeight:700,color:T.orange}}>{streak}d</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:28,height:28,borderRadius:8,
                  background:currentUser.role==="admin"?`${T.yellow}22`:`${T.blue}22`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name={currentUser.role==="admin"?"crown":"user"} size={14}
                    color={currentUser.role==="admin"?T.yellow:T.blue}/>
                </div>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>{currentUser.username}</span>
              </div>
              <motion.button whileTap={{scale:0.9}} onClick={handleLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                <Icon name="logout" size={16} color={T.muted}/>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{padding:"20px 16px 110px"}}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}}>
              {tab==="train"    && <LogProgressView currentUser={currentUser} editingSession={editingSession} onEditDone={handleEditDone}/>}
              {tab==="history"  && <HistoryView     currentUser={currentUser} onEditSession={handleEditSession}/>}
              {tab==="prs"      && <PRsView         currentUser={currentUser}/>}
              {tab==="wellness" && <WellnessView    currentUser={currentUser}/>}
              {tab==="admin"&&currentUser.role==="admin" && <AdminPanel currentUser={currentUser}/>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom nav — creative all-blue animated ── */}
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480, zIndex:20,
          padding:"10px 14px 14px",
          background:`linear-gradient(to top, ${T.bg} 55%, transparent)`,
          pointerEvents:"none",
        }}>
          <div style={{
            display:"flex", alignItems:"center",
            background:`${T.card}ee`,
            backdropFilter:"blur(20px)",
            WebkitBackdropFilter:"blur(20px)",
            border:`1px solid ${T.border}`,
            borderRadius:26,
            padding:"5px",
            boxShadow:`0 4px 40px #00000088, inset 0 1px 0 #ffffff08`,
            position:"relative",
            pointerEvents:"all",
            overflow:"hidden",
          }}>

            {/* Sliding active pill — morphs between tabs */}
            <motion.div
              layoutId="nav-active-pill"
              transition={{ type:"spring", stiffness:380, damping:32, mass:0.8 }}
              style={{
                position:"absolute",
                top:5, bottom:5,
                width:`calc(${100/tabs.length}% - 10px)`,
                left:`calc(${tabs.findIndex(t=>t.id===tab) * (100/tabs.length)}% + 5px)`,
                background:`linear-gradient(135deg, ${T.blue}, ${T.blueHi})`,
                borderRadius:20,
                boxShadow:`0 0 24px ${T.blue}66, 0 2px 8px ${T.blue}44, inset 0 1px 0 #ffffff22`,
                zIndex:0,
              }}
            />

            {/* Ripple layer — rendered via CSS animation on click */}
            <style>{`
              @keyframes navRipple {
                0%   { transform:scale(0); opacity:0.5; }
                100% { transform:scale(3); opacity:0; }
              }
              @keyframes navPop {
                0%   { transform:scale(1); }
                35%  { transform:scale(0.82); }
                65%  { transform:scale(1.14); }
                100% { transform:scale(1); }
              }
              @keyframes navGlow {
                0%,100% { opacity:0.6; }
                50%      { opacity:1; }
              }
              @keyframes navDot {
                0%   { transform:translateY(0) scale(1); opacity:1; }
                100% { transform:translateY(-8px) scale(0); opacity:0; }
              }
              .nav-btn:hover .nav-icon { filter: drop-shadow(0 0 6px ${T.blueHi}99); }
            `}</style>

            {tabs.map((t, idx) => {
              const active = tab === t.id;
              return (
                <motion.button
                  key={t.id}
                  className="nav-btn"
                  onClick={() => setTab(t.id)}
                  whileTap={{ scale: 0.84 }}
                  style={{
                    flex:1, background:"none", border:"none",
                    cursor:"pointer", position:"relative", zIndex:1,
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    padding:"8px 4px 6px", borderRadius:20,
                    minWidth:0, overflow:"hidden",
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    className="nav-icon"
                    animate={{
                      scale:  active ? 1.15 : 1,
                      y:      active ? -2 : 0,
                      rotate: active ? [0, -8, 8, 0] : 0,
                    }}
                    transition={active
                      ? { type:"spring", stiffness:600, damping:20, rotate:{ duration:0.35, ease:"easeOut" } }
                      : { type:"spring", stiffness:400, damping:28 }
                    }
                    style={{ position:"relative", zIndex:1, display:"flex" }}
                  >
                    {/* Pulsing halo on active */}
                    {active && (
                      <motion.div
                        initial={{ scale:0.5, opacity:0 }}
                        animate={{ scale:[1,1.5,1], opacity:[0.6,0,0.6] }}
                        transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
                        style={{
                          position:"absolute", inset:-8, borderRadius:"50%",
                          background:`radial-gradient(circle, ${T.blue}55 0%, transparent 70%)`,
                          pointerEvents:"none", zIndex:0,
                        }}
                      />
                    )}
                    <Icon
                      name={t.icon}
                      size={tabs.length > 4 ? 17 : 19}
                      color={active ? "#fff" : T.muted}
                      style={{ position:"relative", zIndex:1 }}
                    />
                  </motion.div>

                  {/* Floating particles on active */}
                  {active && [0,1,2].map(i => (
                    <motion.div
                      key={i}
                      initial={{ y:0, x:0, opacity:0, scale:0 }}
                      animate={{
                        y:  [-2, -14-i*5],
                        x:  [(i-1)*7, (i-1)*14],
                        opacity: [0, 0.9, 0],
                        scale:   [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.1 + i*0.2,
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease:"easeOut",
                      }}
                      style={{
                        position:"absolute", top:4,
                        width: 3+i, height: 3+i,
                        borderRadius:"50%",
                        background: T.blueHi,
                        pointerEvents:"none", zIndex:0,
                      }}
                    />
                  ))}

                  {/* Label */}
                  <motion.span
                    animate={{
                      opacity:    active ? 1 : 0.4,
                      y:          active ? 0 : 2,
                      color:      active ? "#ffffff" : T.muted,
                      fontWeight: active ? 700 : 400,
                    }}
                    transition={{ duration:0.18, ease:"easeOut" }}
                    style={{
                      display:"block", fontSize: tabs.length>4 ? 8 : 9,
                      letterSpacing:"0.05em", marginTop:4,
                      position:"relative", zIndex:1, whiteSpace:"nowrap",
                    }}
                  >
                    {t.label.toUpperCase()}
                  </motion.span>

                  {/* Tap ripple */}
                  <motion.div
                    key={tab === t.id ? "active" : "inactive"}
                    initial={{ scale:0, opacity:0.4 }}
                    animate={ tab === t.id ? { scale:2.5, opacity:0 } : {} }
                    transition={{ duration:0.5, ease:"easeOut" }}
                    style={{
                      position:"absolute", width:40, height:40,
                      borderRadius:"50%", background:`${T.blue}44`,
                      pointerEvents:"none", zIndex:0,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
