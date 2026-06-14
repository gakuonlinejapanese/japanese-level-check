import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

const ANTHROPIC_URL = "/api/claude";
const COLOR = "#a855f7";

const S = {
  wrap: { minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", fontFamily:"'Noto Sans JP',sans-serif", padding:"0 16px 60px" },
  card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"24px" },
  input: { width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10 },
  btn: { padding:"12px 24px", borderRadius:10, border:"none", fontSize:14, fontWeight:700, cursor:"pointer" },
  label: { color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:4, display:"block" },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Auth Screen ──────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setMsg("※ All fields required."); return; }
    if (password.length < 6) { setMsg("※ Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin }
    });
    if (error) { setMsg(error.message); }
    else { setMsg("✅ Check your email to confirm your account!"); }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setMsg("※ Email and password required."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMsg(error.message); }
    else { onLogin(data.user); }
    setLoading(false);
  };

  return (
    <div style={{ ...S.wrap, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <div style={{ ...S.card, width:"100%", maxWidth:420 }}>
        <p style={{ color:COLOR, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:6 }}>GAKU STUDY PORTAL</p>
        <h2 style={{ color:"#f1f5f9", fontSize:22, fontWeight:800, margin:"0 0 24px" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        {mode === "signup" && (
          <>
            <label style={S.label}>YOUR NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tanaka Yuki" style={S.input} />
          </>
        )}
        <label style={S.label}>EMAIL</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={S.input} />
        <label style={S.label}>PASSWORD</label>
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" style={S.input} />

        {msg && <p style={{ color: msg.startsWith("✅") ? "#22c55e" : "#ef4444", fontSize:13, marginBottom:10 }}>{msg}</p>}

        <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}
          style={{ ...S.btn, width:"100%", background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff", marginBottom:12 }}>
          {loading ? "..." : mode === "login" ? "Log in" : "Create account"}
        </button>
        <p style={{ color:"#64748b", fontSize:13, textAlign:"center" }}>
          {mode === "login" ? "No account? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }}
            style={{ color:COLOR, cursor:"pointer", fontWeight:700 }}>
            {mode === "login" ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Help Modal ───────────────────────────────────────────────
function HelpModal({ onClose, cefrLevel, planContent }) {
  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [energy, setEnergy] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const getHelp = async () => {
    if (!mood || !time || !energy) return;
    setLoading(true);
    try {
      const res = await fetch(ANTHROPIC_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:600,
          messages:[{ role:"user", content:
            `You are a friendly Japanese learning coach. A student at CEFR ${cefrLevel} level wants to study today.
Today's mood: ${mood}
Available time: ${time} minutes
Energy level: ${energy}
Their study plan: ${planContent?.slice(0,500)}

Give them a fun, specific, encouraging 3-5 minute read study suggestion for TODAY only.
Make it feel personal and achievable. Use emojis. Keep it under 150 words. Write in English.` }]
        })
      });
      const data = await res.json();
      setResult(data.content?.map(c => c.text||"").join("") || "Let's study a little today! Even 5 minutes counts! 🌸");
    } catch { setResult("Take it easy today! Review 5 flashcards and watch one Japanese YouTube clip. You've got this! 🎌"); }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ ...S.card, width:"100%", maxWidth:440, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>×</button>
        <p style={{ color:"#f59e0b", fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:6 }}>🆘 TODAY'S HELP</p>
        <h3 style={{ color:"#f1f5f9", fontSize:18, fontWeight:800, margin:"0 0 20px" }}>How are you feeling today?</h3>

        {!result ? (
          <>
            <label style={S.label}>TODAY'S MOOD</label>
            <select value={mood} onChange={e => setMood(e.target.value)} style={{ ...S.input, background:"#0f172a" }}>
              <option value="">Select...</option>
              <option value="motivated and energetic">😤 Motivated & energetic</option>
              <option value="okay but a bit tired">😐 Okay but a bit tired</option>
              <option value="tired and low energy">😴 Tired & low energy</option>
              <option value="stressed or anxious">😰 Stressed or anxious</option>
              <option value="happy and relaxed">😊 Happy & relaxed</option>
            </select>

            <label style={S.label}>AVAILABLE TIME</label>
            <select value={time} onChange={e => setTime(e.target.value)} style={{ ...S.input, background:"#0f172a" }}>
              <option value="">Select...</option>
              <option value="10">10 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours+</option>
            </select>

            <label style={S.label}>ENERGY LEVEL</label>
            <select value={energy} onChange={e => setEnergy(e.target.value)} style={{ ...S.input, background:"#0f172a" }}>
              <option value="">Select...</option>
              <option value="high - ready to challenge myself">🔥 High — ready to challenge</option>
              <option value="medium - normal study mode">⚡ Medium — normal study</option>
              <option value="low - just light review">🌙 Low — light review only</option>
            </select>

            <button onClick={getHelp} disabled={!mood||!time||!energy||loading}
              style={{ ...S.btn, width:"100%", background: mood&&time&&energy ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#1e293b", color: mood&&time&&energy ? "#fff" : "#475569" }}>
              {loading ? "Generating..." : "Get today's plan ✨"}
            </button>
          </>
        ) : (
          <>
            <div style={{ background:"rgba(245,158,11,0.08)", borderRadius:12, padding:"16px", borderLeft:"3px solid #f59e0b", marginBottom:16 }}>
              <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{result}</p>
            </div>
            <button onClick={() => setResult("")} style={{ ...S.btn, background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.1)" }}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function StudyDashboard({ planData }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState({});
  const [showHelp, setShowHelp] = useState(false);


  // planData = { name, email, cefrLevel, plan, resources }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && planData) savePlanAndTodos();
  }, [user]);

  const parseTodos = (planContent) => {
    const initial = {};
    DAYS.forEach(day => { initial[day] = []; });
    if (!planContent) return initial;
    const lines = planContent.split("\n");
    let currentDay = null;
    lines.forEach(line => {
      const dayMatch = DAYS.find(d => line.includes(d));
      if (dayMatch) { currentDay = dayMatch; return; }
      if (currentDay && line.trim().length > 10 && !line.startsWith("#")) {
        initial[currentDay].push({ text: line.replace(/^[-•*]\s*/, "").trim(), done: false });
      }
    });
    return initial;
  };

  const savePlanAndTodos = async () => {
    if (!planData || !user) return;
    const { data: plan } = await supabase.from("study_plans").insert({
      user_id: user.id,
      name: planData.name || user.user_metadata?.full_name || "Student",
      email: planData.email || user.email,
      cefr_level: planData.cefrLevel,
      section: planData.section,
      plan_content: planData.plan,
      form_data: planData.formData,
    }).select().single();
    if (plan) {
      const parsed = parseTodos(planData.plan);
      const items = [];
      DAYS.forEach(day => {
        (parsed[day] || []).forEach(task => {
          items.push({ user_id: user.id, plan_id: plan.id, day, task: task.text, completed: false });
        });
      });
      if (items.length) await supabase.from("todo_items").insert(items);
      loadTodos(plan.id);
    }
    setTodos(parseTodos(planData.plan));
  };

  const loadTodos = async (planId) => {
    const { data } = await supabase.from("todo_items").select("*").eq("plan_id", planId);
    if (!data) return;
    const grouped = {};
    DAYS.forEach(d => { grouped[d] = []; });
    data.forEach(item => {
      if (!grouped[item.day]) grouped[item.day] = [];
      grouped[item.day].push({ id: item.id, text: item.task, done: item.completed });
    });
    setTodos(grouped);
  };

  const toggleTodo = async (day, idx) => {
    const updated = { ...todos };
    updated[day] = [...(updated[day] || [])];
    updated[day][idx] = { ...updated[day][idx], done: !updated[day][idx].done };
    setTodos(updated);
    const item = updated[day][idx];
    if (item.id) {
      await supabase.from("todo_items").update({ completed: item.done }).eq("id", item.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div style={{ ...S.wrap, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#64748b" }}>Loading...</p></div>;
  if (!user) return <AuthScreen onLogin={setUser} />;

  const displayName = planData?.name || user.user_metadata?.full_name || "Student";
  const plan = planData?.plan || "";
  const cefrLevel = planData?.cefrLevel || "A2";
  const resources = planData?.resources || [];
  const todosByDay = Object.keys(todos).length ? todos : parseTodos(plan);

  // Parse plan sections
  const planLines = plan.split("\n").filter(Boolean);
  const nonScheduleLines = planLines.filter(l =>
    !DAYS.some(d => l.includes(d)) && !l.match(/^\s*[-•]/)
  );

  const totalTasks = DAYS.reduce((acc, d) => acc + (todosByDay[d]?.length || 0), 0);
  const doneTasks = DAYS.reduce((acc, d) => acc + (todosByDay[d]?.filter(t => t.done).length || 0), 0);
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={S.wrap}>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} cefrLevel={cefrLevel} planContent={plan} />}

      {/* Header */}
      <div style={{ background:"rgba(10,15,30,0.95)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div>
          <p style={{ color:COLOR, fontSize:11, fontWeight:700, letterSpacing:2, margin:0 }}>GAKU STUDY PORTAL</p>
          <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{displayName}'s Study Plan</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setShowHelp(true)} style={{ ...S.btn, background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#fff", padding:"8px 16px", fontSize:13 }}>
            🆘 Help
          </button>
          <button onClick={handleLogout} style={{ ...S.btn, background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.1)", padding:"8px 16px", fontSize:13 }}>
            Log out
          </button>
        </div>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", paddingTop:24, display:"flex", flexDirection:"column", gap:16 }}>

        {/* Progress */}
        <div style={{ ...S.card }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>Weekly Progress</p>
            <p style={{ color:COLOR, fontSize:14, fontWeight:800, margin:0 }}>{doneTasks}/{totalTasks} tasks</p>
          </div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:8, overflow:"hidden" }}>
            <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${COLOR},#7c3aed)`, borderRadius:99, transition:"width 0.4s" }} />
          </div>
          <p style={{ color:"#64748b", fontSize:12, margin:"8px 0 0", textAlign:"right" }}>{progress}% complete this week</p>
        </div>

        {/* Weekly Todo List */}
        <div style={{ ...S.card }}>
          <p style={{ color:COLOR, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>📅 WEEKLY STUDY SCHEDULE</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {DAYS.map(day => (
              <div key={day}>
                <p style={{ color:"#94a3b8", fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:4 }}>{day.toUpperCase()}</p>
                {(todosByDay[day] || []).length === 0 ? (
                  <p style={{ color:"#334155", fontSize:13, fontStyle:"italic" }}>Rest day 🌸</p>
                ) : (
                  (todosByDay[day] || []).map((task, idx) => (
                    <div key={idx} onClick={() => toggleTodo(day, idx)}
                      style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", borderRadius:10, background: task.done ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)", border:`1px solid ${task.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`, marginBottom:6, cursor:"pointer" }}>
                      <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${task.done ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: task.done ? "#22c55e" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        {task.done && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                      </div>
                      <p style={{ color: task.done ? "#64748b" : "#cbd5e1", fontSize:13, lineHeight:1.6, margin:0, textDecoration: task.done ? "line-through" : "none" }}>{task.text}</p>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Plan Content */}
        {nonScheduleLines.length > 0 && (
          <div style={{ ...S.card }}>
            <p style={{ color:COLOR, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12 }}>📋 YOUR STUDY PLAN</p>
            <div style={{ color:"#cbd5e1", fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap" }}>
              {nonScheduleLines.join("\n")}
            </div>
          </div>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <div style={{ ...S.card }}>
            <p style={{ color:"#f59e0b", fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:14 }}>📚 YOUR RESOURCES</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {resources.map((r, i) => (
                <div key={i} style={{ padding:"12px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 2px" }}>{r.icon} {r.name}</p>
                  <p style={{ color:"#64748b", fontSize:12, margin:"0 0 8px" }}>{r.type}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-block", padding:"7px 14px", background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff", borderRadius:7, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                    → Open {r.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
