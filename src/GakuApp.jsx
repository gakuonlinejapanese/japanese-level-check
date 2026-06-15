import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)",
  purple: "#7c3aed", purpleLight: "#a855f7",
  teal: "#06b6d4", green: "#22c55e",
  amber: "#f59e0b", red: "#ef4444",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

const S = {
  page: { minHeight:"100vh", background:C.bg, fontFamily:"'Noto Sans JP',sans-serif", color:"#f1f5f9" },
  card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px" },
  select: { width:"100%", padding:"12px 14px", background:"#0f172a", border:`1.5px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: { padding:"13px 20px", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" },
  label: { display:"block", color:"#64748b", fontSize:11, fontWeight:700, marginBottom:5, letterSpacing:1 },
};

// ─── CLT RESOURCES ─────────────────────────────────────────────────────────────
const RESOURCES = {
  pronunciation: [
    { name:"Anki (Japanese Decks)", desc:"Build phonetic recognition with audio flashcards. CLT: hear and repeat.", url:"https://ankiweb.net/shared/decks?search=japanese", free:true },
  ],
  listening: [
    { name:"NHK World Lesson", desc:"Authentic NHK audio lessons. CLT input at natural pace.", url:"https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/", free:true },
    { name:"Erin ga Chosen", desc:"Drama-based listening. Real conversational Japanese in context.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Structured listening practice. Watch and shadow for CLT output.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
  ],
  conversation: [
    { name:"NHK Japan — Learn Japanese", desc:"CLT-based conversational Japanese. Real-life scenario practice.", url:"https://www3.nhk.or.jp/nhkworld/en/learnjapanese/", free:true },
    { name:"Erin ga Chosen", desc:"Interactive drama-based conversation. Respond to real situations.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"Marugoto Online", desc:"Japan Foundation's task-based communicative course. A1–B1.", url:"https://a1.marugotoweb.jp/en/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Conversational drills and cultural context. Shadow and repeat.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
  ],
  jlpt: [
    { name:"Japanese Test 4 You", desc:"Full JLPT mock tests N5–N1. Track weak areas with analytics.", url:"https://japanesetest4you.com/", free:true },
  ],
  reading: [
    { name:"Tadoku (Free Readers)", desc:"Graded reading from Level 0–4. CLT: read then discuss.", url:"https://tadoku.org/japanese/book-search/?level=&series=&kw=&order=register_desc", free:true },
    { name:"NHK Web Easy", desc:"Real Japanese news simplified. Perfect A2–B1 reading input.", url:"https://news.web.nhk/news/easy/", free:true },
    { name:"FluencyDrop Stories", desc:"Authentic short stories with audio. Build reading fluency.", url:"https://fluencydrop.com/stories/japanese", free:true },
  ],
  kanji: [
    { name:"Nihonten AI (Bilingual Kanji)", desc:"AI-powered personalized kanji with bilingual translation context.", url:"https://nihonten.ai/", free:false },
  ],
  grammar: [
    { name:"Imabi", desc:"The most comprehensive free Japanese grammar reference online.", url:"https://imabi.org/", free:true },
  ],
};

const SKILL_LABELS = {
  pronunciation:"🔊 Pronunciation", listening:"👂 Listening", conversation:"💬 Conversation",
  jlpt:"🎯 JLPT Prep", reading:"📖 Reading", kanji:"🈳 Kanji", grammar:"📝 Grammar",
};

const WRITING_TOPICS = {
  culture: ["日本のお祭りについて書いてください。", "あなたの国の文化と日本の文化の違いを書いてください。", "日本の食文化について、好きなものを紹介してください。", "日本の伝統工芸について書いてください。"],
  work: ["あなたの仕事や勉強について紹介してください。", "将来の仕事の夢について書いてください。", "日本で働くことについてどう思いますか？", "仕事でのコミュニケーションの重要性について書いてください。"],
  education: ["あなたが日本語を勉強している理由を書いてください。", "効果的な外国語学習方法について書いてください。", "学校での一番の思い出を書いてください。", "オンライン学習と対面学習の違いについて書いてください。"],
};

// ─── AI Vocabulary Builder ──────────────────────────────────────────────────────
function VocabBuilder({ form }) {
  const [search, setSearch] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);

  const findWords = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{ role:"user", content:`You are a Japanese vocabulary teacher using CLT. The student is level ${form.jlpt}, goal: ${form.displayGoal||form.goal}.
They want to learn words related to: "${search}"

Generate 5 vocabulary words perfect for their level. For each word, provide:
- The Japanese word (kanji/kana)
- Reading (hiragana)
- English meaning
- A natural example sentence in Japanese (with English translation)
- A vivid image description they can visualize (1 sentence, start with "Imagine:")
- CLT usage tip (how to use this word in real conversation)

Respond ONLY in this JSON format (no markdown, no backticks):
[{"word":"","reading":"","meaning":"","example":"","example_en":"","image":"","tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setWords(parsed);
    } catch { setWords([]); }
    setLoading(false);
  };

  const saveWord = (w) => setSaved(prev => prev.find(x=>x.word===w.word) ? prev : [...prev, w]);

  return (
    <div>
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>📚 VOCABULARY BUILDER</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>Enter a topic and AI will find vocabulary matched to your level ({form.jlpt}) with visual associations</p>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findWords()} placeholder="e.g. food, travel, business, emotions..." style={{ ...S.input, flex:1 }} />
          <button onClick={findWords} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#475569", whiteSpace:"nowrap", padding:"12px 18px" }}>
            {loading?"...":"Find Words"}
          </button>
        </div>
      </div>

      {words.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {words.map((w,i) => (
            <div key={i} style={{ ...S.card, borderLeft:`3px solid ${C.teal}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <p style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, margin:"0 0 2px" }}>{w.word}</p>
                  <p style={{ color:C.teal, fontSize:13, margin:"0 0 2px" }}>{w.reading}</p>
                  <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>{w.meaning}</p>
                </div>
                <button onClick={()=>saveWord(w)} style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${saved.find(x=>x.word===w.word)?C.green:C.border}`, background:saved.find(x=>x.word===w.word)?"rgba(34,197,94,0.1)":C.card, color:saved.find(x=>x.word===w.word)?C.green:"#64748b", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  {saved.find(x=>x.word===w.word)?"✓ Saved":"+ Save"}
                </button>
              </div>
              <div style={{ background:"rgba(6,182,212,0.06)", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 2px" }}>{w.example}</p>
                <p style={{ color:"#64748b", fontSize:12, margin:0, fontStyle:"italic" }}>{w.example_en}</p>
              </div>
              <div style={{ background:"rgba(168,85,247,0.06)", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>🖼 VISUAL ASSOCIATION</p>
                <p style={{ color:"#cbd5e1", fontSize:12, margin:0, lineHeight:1.6 }}>{w.image}</p>
              </div>
              <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
                <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>💬 CLT TIP</p>
                <p style={{ color:"#cbd5e1", fontSize:12, margin:0 }}>{w.tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <div style={{ ...S.card }}>
          <p style={{ color:C.green, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12 }}>✅ MY SAVED WORDS ({saved.length})</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {saved.map((w,i) => (
              <div key={i} style={{ background:"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,0.2)`, borderRadius:10, padding:"8px 12px" }}>
                <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 2px" }}>{w.word}</p>
                <p style={{ color:"#64748b", fontSize:11, margin:0 }}>{w.reading} · {w.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE SET (built from selected skills only) ─────────────────────────────
function PracticeSet({ form }) {
  const [items, setItems] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const skills = form.skills || [];
  const skillLabels = skills.map(s => SKILL_LABELS[s] || s).join(", ");

  const generate = async () => {
    setLoading(true); setError(""); setItems([]); setRevealed({});
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`You are a Japanese teacher using CLT (Communicative Language Teaching). The student is level ${form.jlpt}, goal: ${form.displayGoal||form.goal}.
The student selected ONLY these study skills: ${skillLabels || "general practice"}.
Create a "Practice Set" of 6 short exercises focused ONLY on these selected skills (do NOT include writing/composition exercises unless "Writing" is one of the selected skills).
For each exercise, include:
- skill: which skill it targets (must be one of: ${skills.join(", ")})
- type: a short label, e.g. "Listening cloze", "Conversation role-play", "Kanji recall", "Grammar pattern", "Reading comprehension", "JLPT-style question", "Pronunciation drill"
- prompt: the exercise text in Japanese (with English hint in parentheses if helpful)
- answer: the model answer or correct response
- tip: a one-sentence CLT tip for using this in real communication

Respond ONLY in this JSON format (no markdown, no backticks):
[{"skill":"","type":"","prompt":"","answer":"","tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setItems(parsed);
    } catch { setError("Could not generate a practice set right now. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🎯 PRACTICE SET</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:14, lineHeight:1.7 }}>
          Generated from what you selected in <strong style={{ color:"#94a3b8" }}>"WHAT DO YOU WANT TO STUDY?"</strong>:{" "}
          {skills.length ? skills.map(s => SKILL_LABELS[s] || s).join(" · ") : "No skills selected — edit your profile to choose skills."}
        </p>
        <button onClick={generate} disabled={loading || skills.length===0} style={{ ...S.btn, width:"100%", background:skills.length?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:skills.length?"#fff":"#475569" }}>
          {loading ? "Building your practice set...":"Generate Practice Set ✨"}
        </button>
        {error && <p style={{ color:C.red, fontSize:12, marginTop:10 }}>{error}</p>}
      </div>

      {items.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.map((it,i) => (
            <div key={i} style={{ ...S.card, borderLeft:`3px solid ${C.purpleLight}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:C.purpleLight, fontSize:11, fontWeight:700 }}>{SKILL_LABELS[it.skill] || it.skill}</span>
                <span style={{ color:"#64748b", fontSize:11 }}>{it.type}</span>
              </div>
              <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:"0 0 10px" }}>{it.prompt}</p>
              {revealed[i] ? (
                <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
                  <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>✅ ANSWER</p>
                  <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 6px" }}>{it.answer}</p>
                  {it.tip && <p style={{ color:"#94a3b8", fontSize:12, margin:0, fontStyle:"italic" }}>💬 {it.tip}</p>}
                </div>
              ) : (
                <button onClick={()=>setRevealed(r=>({...r,[i]:true}))} style={{ padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
                  Show answer
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Schedule builder ────────────────────────────────────────────────────────────
function buildSchedule(form) {
  const hoursMap = { "Less than 1 hour":45, "1–2 hours":90, "2–3 hours":150, "3+ hours":180 };
  const daysMap = { "1–2 days":2, "3–4 days":4, "5–6 days":5, "Every day":7 };
  const mins = hoursMap[form.hoursPerDay] || 60;
  const days = daysMap[form.daysPerWeek] || 5;
  const skills = form.skills || [];

  // Build blocks from selected skills only
  const allBlocks = [
    { skill:"conversation", mins:Math.round(mins*0.3), note:"Role-play or shadowing — CLT core" },
    { skill:"listening",    mins:Math.round(mins*0.2), note:"NHK World or JapanesePod101" },
    { skill:"reading",      mins:Math.round(mins*0.15), note:"Tadoku graded reader or NHK Web Easy" },
    { skill:"grammar",      mins:Math.round(mins*0.15), note:"Imabi + write 3 example sentences" },
    { skill:"kanji",        mins:Math.round(mins*0.1), note:"Nihonten AI — 5 new kanji with context" },
    { skill:"jlpt",         mins:Math.round(mins*0.2), note:"Japanese Test 4 You — one practice section" },
    { skill:"pronunciation",mins:Math.round(mins*0.1), note:"Anki audio cards — shadow 20 words" },
  ].filter(b => skills.includes(b.skill));

  if (allBlocks.length === 0) {
    allBlocks.push({ skill:"conversation", mins:30, note:"Role-play or shadowing" });
  }

  const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const schedule = {};
  const activeDays = WEEKDAYS.slice(0, days);
  activeDays.forEach((day, i) => {
    const focus = allBlocks[i % allBlocks.length];
    schedule[day] = [
      { task:`${SKILL_LABELS[focus.skill] || focus.skill}: ${focus.note} (${focus.mins} min)`, done:false },
      { task:`Vocabulary review — Anki or saved words (10 min)`, done:false },
      i % 2 === 0 ? { task:`Speak aloud: summarize today's content in Japanese (5 min)`, done:false } : null,
    ].filter(Boolean);
  });
  WEEKDAYS.slice(days).forEach(day => { schedule[day] = [{ task:"Rest day 🌸", done:false, rest:true }]; });
  return schedule;
}

function buildMilestones(form) {
  const goalMap = {
    "Beginner": ["Learn hiragana + katakana (Week 1–2)", "Master 300 vocabulary words (Month 1)", "Hold a 2-minute self-introduction in Japanese (Month 2)", "Pass JLPT N5 practice test at 70% (Month 3)"],
    "N5": ["Complete N4 grammar on Imabi (Month 1–2)", "Reach 800 vocabulary words (Month 2)", "Hold a 5-minute conversation on daily topics (Month 3)", "Pass JLPT N4 practice test at 70% (Month 4–5)"],
    "N4": ["Complete N3 grammar (Month 1–3)", "Reach 1,500 vocabulary words (Month 2)", "Read NHK Web Easy daily without dictionary (Month 3)", "Pass JLPT N3 practice test at 70% (Month 4–6)"],
    "N3": ["Complete N2 grammar (Month 1–3)", "Reach 3,000 vocabulary words (Month 3)", "Read regular NHK News (Month 4)", "Pass JLPT N2 practice test at 70% (Month 5–8)"],
    "N2": ["Complete N1 grammar (Month 1–3)", "Reach 6,000 vocabulary words (Month 4)", "Read academic/business Japanese texts (Month 5)", "Pass JLPT N1 practice test at 60% (Month 6–10)"],
    "N1": ["Master business keigo patterns (Month 1–2)", "Write formal Japanese essays 800+ characters (Month 2)", "Participate in native-speed discussions (Month 3)", "Achieve professional fluency certification (Month 6+)"],
  };
  const key = (form.jlpt||"").replace("Beginner (no JLPT)","Beginner").replace(" (no JLPT)","");
  return goalMap[key] || goalMap["Beginner"];
}

// ─── HELP MODAL ────────────────────────────────────────────────────────────────
function HelpModal({ onClose, form }) {
  const [view, setView] = useState("menu"); // menu | lesson | howto
  const [mood, setMood] = useState(""); const [time, setTime] = useState(""); const [energy, setEnergy] = useState("");
  const [wantsDifferent, setWantsDifferent] = useState(false);
  const [differentText, setDifferentText] = useState("");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false);

  const getHelp = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500,
          messages:[{ role:"user", content:`You are a warm Japanese language coach using CLT.
Student: ${form.name}, Level: ${form.jlpt}, Goal: ${form.displayGoal||form.goal}, Skills: ${(form.skills||[]).join(", ")}
Today: Mood: ${mood}, Time: ${time} min, Energy: ${energy}
${wantsDifferent && differentText.trim() ? `IMPORTANT: Today the student specifically wants to do something different from their usual routine. What they want to do today: "${differentText.trim()}". Build today's suggestion AROUND this request, while still keeping it CLT-based and appropriate for their level.` : `Focus on skills the student selected: ${(form.skills||[]).join(", ")}.`}
Give a specific, encouraging suggestion for TODAY ONLY using CLT principles.
One concrete activity with a specific resource. Emojis. Under 120 words. English.` }]
        })
      });
      const d = await res.json();
      setResult(d.content?.map(c=>c.text||"").join("") || "Take it easy today! Review 5 words and watch one Japanese video. 🌸");
    } catch { setResult("Even 10 minutes counts! Review your saved vocabulary and practice one sentence aloud. 頑張って！🎌"); }
    setLoading(false);
  };

  const reset = () => { setView("menu"); setResult(""); setMood(""); setTime(""); setEnergy(""); setWantsDifferent(false); setDifferentText(""); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ ...S.card, width:"100%", maxWidth:420, position:"relative", maxHeight:"85vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>×</button>
        <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🆘 HELP</p>

        {view==="menu" && (
          <>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 18px" }}>What would you like?</h3>
            <button onClick={()=>setView("lesson")} style={{ ...S.btn, width:"100%", textAlign:"left", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", marginBottom:10 }}>
              📋 Customized lesson for today
              <div style={{ fontWeight:400, fontSize:11, marginTop:4, opacity:0.9 }}>今日のカスタマイズレッスン</div>
            </button>
            <button onClick={()=>setView("howto")} style={{ ...S.btn, width:"100%", textAlign:"left", background:C.card, color:"#f1f5f9", border:`1px solid ${C.border}` }}>
              ❓ How to use this app
              <div style={{ fontWeight:400, fontSize:11, marginTop:4, color:"#64748b" }}>使い方</div>
            </button>
          </>
        )}

        {view==="lesson" && (
          <>
            <button onClick={reset} style={{ background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer", padding:0, marginBottom:10 }}>← Back</button>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 18px" }}>How are you feeling today?</h3>
            {!result ? (
              <>
                <label style={S.label}>MOOD</label>
                <select value={mood} onChange={e=>setMood(e.target.value)} style={{ ...S.select, marginBottom:10 }}>
                  <option value="">Select...</option>
                  <option value="motivated and energetic">😤 Motivated & energetic</option>
                  <option value="okay, normal day">😐 Okay, normal day</option>
                  <option value="tired and low energy">😴 Tired & low energy</option>
                  <option value="stressed or anxious">😰 Stressed or anxious</option>
                  <option value="happy and relaxed">😊 Happy & relaxed</option>
                </select>
                <label style={S.label}>AVAILABLE TIME</label>
                <select value={time} onChange={e=>setTime(e.target.value)} style={{ ...S.select, marginBottom:10 }}>
                  <option value="">Select...</option>
                  <option value="10">10 minutes</option><option value="20">20 minutes</option>
                  <option value="30">30 minutes</option><option value="60">1 hour</option><option value="90">1.5 hours+</option>
                </select>
                <label style={S.label}>ENERGY LEVEL</label>
                <select value={energy} onChange={e=>setEnergy(e.target.value)} style={{ ...S.select, marginBottom:14 }}>
                  <option value="">Select...</option>
                  <option value="high - ready to challenge">🔥 High — ready to challenge</option>
                  <option value="medium - normal study">⚡ Medium — normal study</option>
                  <option value="low - light review only">🌙 Low — light review only</option>
                </select>

                <div style={{ background:"rgba(168,85,247,0.06)", border:`1px solid rgba(168,85,247,0.2)`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom: wantsDifferent ? 8 : 0 }}>
                    <input type="checkbox" checked={wantsDifferent} onChange={e=>setWantsDifferent(e.target.checked)} />
                    <span style={{ color:"#f1f5f9", fontSize:13, fontWeight:600 }}>今日は何か違うことをしたい (I want to do something different today)</span>
                  </label>
                  {wantsDifferent && (
                    <textarea value={differentText} onChange={e=>setDifferentText(e.target.value)} placeholder="今日実際にやりたいことを書いてください... (Tell us what you'd like to do today...)" rows={3} style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.7 }} />
                  )}
                </div>

                <button onClick={getHelp} disabled={!mood||!time||!energy||loading} style={{ ...S.btn, width:"100%", background:mood&&time&&energy?`linear-gradient(135deg,${C.amber},#d97706)`:"#1e293b", color:mood&&time&&energy?"#fff":"#475569" }}>
                  {loading?"Generating...":"Get today's plan ✨"}
                </button>
              </>
            ) : (
              <>
                <div style={{ background:"rgba(245,158,11,0.08)", borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"14px 16px", marginBottom:14 }}>
                  <p style={{ color:"#f1f5f9", fontSize:13, lineHeight:1.8, margin:0 }}>{result}</p>
                </div>
                <button onClick={()=>setResult("")} style={{ ...S.btn, width:"100%", background:C.card, color:"#94a3b8", border:`1px solid ${C.border}` }}>Try again</button>
              </>
            )}
          </>
        )}

        {view==="howto" && (
          <>
            <button onClick={reset} style={{ background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer", padding:0, marginBottom:10 }}>← Back</button>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 14px" }}>How to use this app</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["📅 Schedule", "Your weekly study plan, broken into daily tasks. Tap a task to mark it done and track your weekly progress."],
                ["🎯 Practice Set", "AI-generated exercises based only on the skills you chose in your profile (e.g. listening, grammar, kanji). Tap 'Show answer' to check yourself."],
                ["📚 Vocabulary", "Search any topic to get level-appropriate words with example sentences, a visual association, and a CLT usage tip. Save words you want to remember."],
                ["🔗 Resources", "Free (and some paid) tools matched to your selected skills — open them directly from here."],
                ["✍️ Writing", "Pick a topic, write 300–800 characters in Japanese, and get AI feedback on what you did well and how to improve."],
                ["🏆 Milestones", "Your roadmap toward your goal. Tap each milestone as you complete it."],
                ["✏️ Edit Profile", "Update your goals, level, schedule, or skills any time — your existing answers are kept so you only change what's needed."],
                ["🆘 Help", "Get a personalized plan for today based on your mood, time and energy — or come back here anytime for this guide."],
              ].map(([title, desc], i) => (
                <div key={i} style={{ ...S.card }}>
                  <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 4px" }}>{title}</p>
                  <p style={{ color:"#94a3b8", fontSize:12, margin:0, lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WRITING PROMPT ────────────────────────────────────────────────────────────
function WritingPrompt({ jlpt }) {
  const [topic, setTopic] = useState("culture");
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = WRITING_TOPICS[topic][promptIdx];
  const charCount = text.length;

  const getFeedback = async () => {
    if (text.length < 50) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400,
          messages:[{ role:"user", content:`You are a Japanese language teacher using CLT. Student level: ${jlpt}.
Prompt: "${prompt}"
Student's response: "${text}"
Give feedback:
1. 👍 What they did well
2. 💡 One concrete improvement
3. 🌟 One new expression to use next time
Warm, under 100 words, English.` }]
        })
      });
      const d = await res.json();
      setFeedback(d.content?.map(c=>c.text||"").join("") || "Great effort! Keep writing every day. 🌸");
    } catch { setFeedback("Great effort! Your writing practice builds real communicative ability. 頑張って！🌸"); }
    setLoading(false);
  };

  return (
    <div style={{ ...S.card, marginBottom:16 }}>
      <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12 }}>✍️ WRITING PRACTICE (CLT)</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {Object.keys(WRITING_TOPICS).map(t => (
          <button key={t} onClick={()=>{setTopic(t);setPromptIdx(0);setText("");setFeedback("");}} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${topic===t?C.amber:C.border}`, background:topic===t?"rgba(245,158,11,0.12)":C.card, color:topic===t?C.amber:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {t==="culture"?"🌸 文化":t==="work"?"💼 仕事":"📚 教育"}
          </button>
        ))}
      </div>
      <div style={{ background:"rgba(245,158,11,0.06)", borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"12px 14px", marginBottom:12 }}>
        <p style={{ color:"#f1f5f9", fontSize:14, margin:"0 0 4px", fontWeight:600 }}>{prompt}</p>
        <p style={{ color:"#64748b", fontSize:11, margin:0 }}>300〜800文字 · Communicative writing practice</p>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="ここに書いてください..." rows={5} style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.8, marginBottom:8 }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <p style={{ color:charCount<300?"#64748b":charCount>800?C.red:C.green, fontSize:12, margin:0 }}>{charCount}/300〜800文字</p>
        <button onClick={()=>{setPromptIdx(p=>(p+1)%WRITING_TOPICS[topic].length);setText("");setFeedback("");}} style={{ padding:"5px 12px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
          Next prompt →
        </button>
      </div>
      {!feedback ? (
        <button onClick={getFeedback} disabled={text.length<50||loading} style={{ ...S.btn, width:"100%", background:text.length>=50?`linear-gradient(135deg,${C.amber},#d97706)`:"#1e293b", color:text.length>=50?"#fff":"#475569" }}>
          {loading?"Getting feedback...":"Get AI feedback ✨"}
        </button>
      ) : (
        <div style={{ background:"rgba(34,197,94,0.06)", borderLeft:`3px solid ${C.green}`, borderRadius:8, padding:"12px 14px" }}>
          <p style={{ color:"#f1f5f9", fontSize:13, lineHeight:1.8, margin:0 }}>{feedback}</p>
          <button onClick={()=>setFeedback("")} style={{ marginTop:10, padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#64748b", fontSize:11, cursor:"pointer" }}>Try again</button>
        </div>
      )}
    </div>
  );
}

// ─── LANGUAGES for translation ─────────────────────────────────────────────────
const LANGUAGES = [
  "English","Spanish","French","Portuguese","German","Italian","Chinese (Simplified)",
  "Chinese (Traditional)","Korean","Arabic","Hindi","Thai","Vietnamese","Indonesian","Malay",
  "Turkish","Russian","Polish","Dutch","Swedish","Norwegian","Danish","Finnish",
];

// ─── FORM ───────────────────────────────────────────────────────────────────────
function FormScreen({ onSubmit, onBack, onCancel, initialJlpt, initialForm }) {
  const [form, setForm] = useState(() => initialForm || {
    name:"", email:"", country:"", preferredLang:"English",
    goal:"", customGoal:"", timeline:"",
    jlpt: initialJlpt || "",
    hoursPerDay:"", daysPerWeek:"", skills:[]
  });
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleSkill = (s) => setForm(f=>({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x=>x!==s) : [...f.skills, s] }));
  const isOther = form.goal === "Other";
  const valid = form.name && form.email && form.country && form.goal && (isOther ? form.customGoal.trim() : true) && form.timeline && form.jlpt && form.hoursPerDay && form.daysPerWeek && form.skills.length > 0;

  return (
    <div style={{ ...S.page, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 16px 60px" }}>
      <div style={{ width:"100%", maxWidth:520 }}>
        {initialForm && onCancel ? (
          <button onClick={onCancel} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>← Back to my plan</button>
        ) : (
          onBack && <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>← Back</button>
        )}
        <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:4 }}>GAKU SELF-STUDY APP</p>
        <h1 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px" }}>{initialForm ? "Edit Your Learning Profile" : "Your Learning Profile"}</h1>
        <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>{initialForm ? "Update any details below — your existing answers are kept until you change them." : "Tell us about yourself to build your personalized CLT study plan"}</p>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={S.label}>YOUR NAME *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Tanaka Yuki" style={S.input}/></div>
          <div><label style={S.label}>EMAIL *</label><input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="your@email.com" type="email" style={S.input}/></div>
          <div><label style={S.label}>COUNTRY *</label><input value={form.country} onChange={e=>set("country",e.target.value)} placeholder="e.g. USA, Brazil, France..." style={S.input}/></div>

          {/* ① Preferred Language */}
          <div>
            <label style={S.label}>PREFERRED LANGUAGE</label>
            <select value={form.preferredLang} onChange={e=>set("preferredLang",e.target.value)} style={S.select}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* ② Final Goal with Other option */}
          <div>
            <label style={S.label}>FINAL GOAL *</label>
            <select value={form.goal} onChange={e=>set("goal",e.target.value)} style={S.select}>
              <option value="">Select your goal</option>
              <option>Pass JLPT N5</option><option>Pass JLPT N4</option><option>Pass JLPT N3</option>
              <option>Pass JLPT N2</option><option>Pass JLPT N1</option>
              <option>Get a job in Japan</option><option>Travel to Japan</option>
              <option>Study abroad in Japan</option><option>Daily conversation</option>
              <option>Other</option>
            </select>
            {isOther && (
              <div style={{ marginTop:8 }}>
                <label style={{ ...S.label, marginBottom:4 }}>WHAT DO YOU WANT TO STUDY?</label>
                <input value={form.customGoal} onChange={e=>set("customGoal",e.target.value)} placeholder="Tell us what you'd like to study or achieve..." style={S.input}/>
              </div>
            )}
          </div>

          <div>
            <label style={S.label}>WHEN DO YOU WANT TO ACHIEVE IT? *</label>
            <select value={form.timeline} onChange={e=>set("timeline",e.target.value)} style={S.select}>
              <option value="">Select timeline</option>
              <option>Less than 6 months</option><option>Within 1 year</option>
              <option>2–3 years</option><option>Over 3 years</option>
            </select>
          </div>

          {/* ③ JLPT with auto-fill note */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <label style={{ ...S.label, marginBottom:0 }}>CURRENT JLPT LEVEL *</label>
              {initialJlpt && <span style={{ color:"#64748b", fontSize:10 }}>Auto-filled from your test</span>}
            </div>
            {initialJlpt && <p style={{ color:"#64748b", fontSize:11, marginBottom:6 }}>If you want to change your level, please select below.</p>}
            <select value={form.jlpt} onChange={e=>set("jlpt",e.target.value)} style={S.select}>
              <option value="">Select level</option>
              <option>Beginner</option><option>N5</option><option>N4</option>
              <option>N3</option><option>N2</option><option>N1</option>
            </select>
          </div>

          <div>
            <label style={S.label}>STUDY TIME PER DAY *</label>
            <select value={form.hoursPerDay} onChange={e=>set("hoursPerDay",e.target.value)} style={S.select}>
              <option value="">Select hours</option>
              <option>Less than 1 hour</option><option>1–2 hours</option>
              <option>2–3 hours</option><option>3+ hours</option>
            </select>
          </div>
          <div>
            <label style={S.label}>DAYS PER WEEK *</label>
            <select value={form.daysPerWeek} onChange={e=>set("daysPerWeek",e.target.value)} style={S.select}>
              <option value="">Select days</option>
              <option>1–2 days</option><option>3–4 days</option>
              <option>5–6 days</option><option>Every day</option>
            </select>
          </div>

          {/* ⑤ Skills without Writing (Writing is in its own tab) */}
          <div>
            <label style={S.label}>WHAT DO YOU WANT TO STUDY? * (select all that apply)</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {Object.entries(SKILL_LABELS).map(([k,v]) => (
                <button key={k} onClick={()=>toggleSkill(k)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${form.skills.includes(k)?C.purpleLight:C.border}`, background:form.skills.includes(k)?"rgba(168,85,247,0.15)":C.card, color:form.skills.includes(k)?C.purpleLight:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {v}
                </button>
              ))}
            </div>
            <p style={{ color:"#475569", fontSize:11, marginTop:6 }}>✍️ Writing practice is available in the Writing tab for all users</p>
          </div>
        </div>

        {err && <p style={{ color:C.red, fontSize:12, margin:"12px 0 0", textAlign:"center" }}>{err}</p>}
        <button onClick={()=>{ if(!valid){setErr("Please fill in all required fields (*) and select at least one skill.");return;} onSubmit({ ...form, displayGoal: isOther ? form.customGoal : form.goal }); }} style={{ ...S.btn, width:"100%", marginTop:20, background:valid?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:valid?"#fff":"#475569" }}>
          {initialForm ? "Save Changes →" : "Build My Study Plan →"}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ form, onEdit }) {
  const [schedule, setSchedule] = useState(() => buildSchedule(form));
  const [milestones] = useState(() => buildMilestones(form));
  const [msDone, setMsDone] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [tab, setTab] = useState("schedule");

  const toggleTask = useCallback((day, idx) => {
    setSchedule(prev => ({ ...prev, [day]: prev[day].map((t,i) => i===idx ? {...t,done:!t.done} : t) }));
  }, []);

  const totalTasks = Object.values(schedule).flat().filter(t=>!t.rest).length;
  const doneTasks = Object.values(schedule).flat().filter(t=>t.done&&!t.rest).length;
  const progress = totalTasks ? Math.round(doneTasks/totalTasks*100) : 0;
  const selectedResources = (form.skills||[]).flatMap(s => (RESOURCES[s]||[]).map(r=>({...r,skill:s})));

  const TABS = [
    { id:"schedule", label:"📅 Schedule" },
    { id:"practice", label:"🎯 Practice Set" },
    { id:"vocabulary", label:"📚 Vocabulary" },
    { id:"resources", label:"🔗 Resources" },
    { id:"writing", label:"✍️ Writing" },
    { id:"milestones", label:"🏆 Milestones" },
  ];

  return (
    <div style={{ ...S.page, paddingBottom:60 }}>
      {showHelp && <HelpModal onClose={()=>setShowHelp(false)} form={form} />}

      <div style={{ background:"rgba(10,15,30,0.95)", borderBottom:`1px solid ${C.border}`, padding:"14px 20px", position:"sticky", top:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ color:C.purpleLight, fontSize:10, fontWeight:700, letterSpacing:2, margin:0 }}>GAKU SELF-STUDY</p>
          <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:800, margin:0 }}>{form.name}'s Study Plan</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowHelp(true)} style={{ ...S.btn, padding:"8px 14px", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", fontSize:12 }}>🆘 Help</button>
          <button onClick={onEdit} style={{ ...S.btn, padding:"8px 14px", background:C.card, color:"#94a3b8", border:`1px solid ${C.border}`, fontSize:12 }}>✏️ Edit Profile</button>
        </div>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ ...S.card, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:0 }}>Weekly Progress</p>
            <p style={{ color:C.purpleLight, fontSize:13, fontWeight:800, margin:0 }}>{doneTasks}/{totalTasks} · {progress}%</p>
          </div>
          <div style={{ background:C.border, borderRadius:99, height:8 }}>
            <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${C.purple},${C.purpleLight})`, borderRadius:99, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>🎯 {form.displayGoal||form.goal}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>📅 {form.timeline}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>📊 {form.jlpt}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>🌐 {form.preferredLang}</p>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${tab===t.id?C.purpleLight:C.border}`, background:tab===t.id?"rgba(168,85,247,0.15)":C.card, color:tab===t.id?C.purpleLight:"#64748b", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="schedule" && (
          <div style={{ ...S.card }}>
            <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>📅 YOUR WEEKLY STUDY SCHEDULE</p>
            {Object.entries(schedule).map(([day, tasks]) => (
              <div key={day} style={{ marginBottom:16 }}>
                <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, letterSpacing:1, borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:8 }}>{day.toUpperCase()}</p>
                {tasks.map((task, idx) => task.rest ? (
                  <p key={idx} style={{ color:"#334155", fontSize:13, fontStyle:"italic" }}>Rest day 🌸</p>
                ) : (
                  <div key={idx} onClick={()=>toggleTask(day,idx)} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:10, background:task.done?"rgba(34,197,94,0.06)":C.card, border:`1px solid ${task.done?"rgba(34,197,94,0.2)":C.border}`, marginBottom:6, cursor:"pointer", alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${task.done?C.green:C.border}`, background:task.done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      {task.done && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                    </div>
                    <p style={{ color:task.done?"#64748b":"#cbd5e1", fontSize:13, margin:0, lineHeight:1.6, textDecoration:task.done?"line-through":"none" }}>{task.task}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 🎯 Practice Set tab — built around selected skills only */}
        {tab==="practice" && <PracticeSet form={form} />}

        {/* ④ Vocabulary Builder tab */}
        {tab==="vocabulary" && <VocabBuilder form={form} />}

        {tab==="resources" && (
          <div style={{ ...S.card }}>
            <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🔗 YOUR RESOURCES</p>
            <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>Curated for level {form.jlpt}, skills: {(form.skills||[]).join(", ")}</p>
            {selectedResources.length === 0 && <p style={{ color:"#64748b", fontSize:13 }}>No resources. Please reset and select study skills.</p>}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {selectedResources.map((r,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, border:`1px solid ${C.border}`, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{r.name}</p>
                    <span style={{ color:r.free?C.green:C.amber, fontSize:10, fontWeight:700, background:r.free?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)", padding:"2px 8px", borderRadius:99 }}>{r.free?"FREE":"PAID"}</span>
                  </div>
                  <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>{SKILL_LABELS[r.skill]}</p>
                  <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{r.desc}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"9px", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                    → Open {r.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="writing" && <WritingPrompt jlpt={form.jlpt} />}

        {tab==="milestones" && (
          <div style={{ ...S.card }}>
            <p style={{ color:C.red, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>🏆 YOUR GOAL ROADMAP</p>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:16 }}>Level: {form.jlpt} → Goal: {form.displayGoal||form.goal}</p>
            {milestones.map((m,i) => (
              <div key={i} onClick={()=>setMsDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} style={{ display:"flex", gap:12, padding:"12px 14px", borderRadius:12, background:msDone.includes(i)?"rgba(34,197,94,0.06)":C.card, border:`1px solid ${msDone.includes(i)?"rgba(34,197,94,0.2)":C.border}`, marginBottom:8, cursor:"pointer", alignItems:"flex-start" }}>
                <div style={{ width:24, height:24, borderRadius:8, border:`2px solid ${msDone.includes(i)?C.green:C.border}`, background:msDone.includes(i)?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {msDone.includes(i)?<span style={{ color:"#fff", fontWeight:900, fontSize:12 }}>✓</span>:<span style={{ color:"#475569", fontWeight:700, fontSize:11 }}>{i+1}</span>}
                </div>
                <p style={{ color:msDone.includes(i)?"#64748b":"#cbd5e1", fontSize:13, margin:0, lineHeight:1.6, textDecoration:msDone.includes(i)?"line-through":"none" }}>{m}</p>
              </div>
            ))}
            <div style={{ marginTop:20, padding:"16px", background:"rgba(168,85,247,0.06)", borderRadius:12, textAlign:"center", border:`1px solid rgba(168,85,247,0.2)` }}>
              <p style={{ fontSize:20, margin:"0 0 8px" }}>🌸</p>
              <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 6px" }}>You've got this!</p>
              <p style={{ color:"#64748b", fontSize:12, lineHeight:1.7, margin:0 }}>Every conversation, every sentence, every word brings you closer. CLT is about real communication — and you're already doing it. 頑張ってください！</p>
            </div>
            <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"13px", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", marginTop:16 }}>
              Book a FREE Trial Lesson with GAKU →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────────
export default function GakuApp({ onBack, initialJlpt }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem("gaku_form"); if(saved) setForm(JSON.parse(saved)); } catch {}
  }, []);
  const handleSubmit = (f) => { setForm(f); setEditing(false); try { localStorage.setItem("gaku_form", JSON.stringify(f)); } catch {} };
  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);
  if (!form || editing) return <FormScreen onSubmit={handleSubmit} onBack={onBack} onCancel={form ? handleCancelEdit : undefined} initialJlpt={initialJlpt} initialForm={form || undefined} />;
  return <Dashboard form={form} onEdit={handleEdit} />;
}
