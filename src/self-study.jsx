import React, { useState, useEffect } from "react";

const COLOR = "#a855f7";
const FORMSPREE_URL = "https://formspree.io/f/mykvallk";
const STRIPE_KEY = "pk_test_51TewE3IkVvRh9IDDI5tJX0117g2c7sFpHo2JpfREEHIUNvwrFhbQfT4LljhHxozPFdYbC9yNsRDsBIpmhKVnUPSa00KeRK2Eet";
const PRICE_ID = "price_1Tf74iIkVvRh9IDDoFeg2RoB";

const RESOURCES_BY_LEVEL = {
  "Pre-A1": [
    { icon:"🎭", name:"italki — Beginner Tutors", type:"Live lessons · From $10/hr", desc:"CLT core: Real conversation from day 1. Find a community tutor and practice basic greetings, introductions, and daily phrases in real time.", url:"https://www.italki.com/en/teachers/japanese" },
    { icon:"📺", name:"JapanesePod101 (YouTube)", type:"YouTube · Free", desc:"Authentic listening content for absolute beginners. Focus on their 'survival phrases' and daily conversation playlists — not grammar drills.", url:"https://www.youtube.com/@JapanesePod101" },
    { icon:"🌐", name:"JF Japanese e-Learning Minato", type:"Website · Free", desc:"Japan Foundation's official CLT-based course. Task-based activities designed around real communication situations from A1 level.", url:"https://minato-jf.jp/en/" },
    { icon:"📱", name:"HelloTalk", type:"App · Free", desc:"CLT in practice: Chat with native Japanese speakers. Use voice messages to practice speaking. Real interaction, zero textbook.", url:"https://www.hellotalk.com/" },
  ],
  "A1": [
    { icon:"🎭", name:"italki — Community Tutors", type:"Live lessons · From $10/hr", desc:"30-minute conversation sessions on daily topics: food, family, hobbies. Communicative approach demands real speaking practice, not just study.", url:"https://www.italki.com/en/teachers/japanese" },
    { icon:"📺", name:"Comprehensible Japanese Beginner (YouTube)", type:"YouTube · Free", desc:"Authentic Japanese input at your level. Immersive storytelling with no English — exactly what CLT recommends for natural acquisition.", url:"https://www.youtube.com/@cijapanese" },
    { icon:"📱", name:"HelloTalk", type:"App · Free", desc:"Find a language exchange partner. Practice real daily conversations — describe your day, ask questions, react naturally. Pure CLT.", url:"https://www.hellotalk.com/" },
    { icon:"🌐", name:"JF Japanese e-Learning Minato", type:"Website · Free", desc:"Task-based learning platform. Complete real-world tasks: ordering food, making appointments, asking directions — all in Japanese.", url:"https://minato-jf.jp/en/" },
  ],
  "A1–A2": [
    { icon:"🎭", name:"italki — Conversation Practice", type:"Live lessons · From $10/hr", desc:"Role-play scenarios with a tutor: at a convenience store, on the phone, at a restaurant. This is CLT's core activity — simulating real life.", url:"https://www.italki.com/en/teachers/japanese" },
    { icon:"📺", name:"Comprehensible Japanese Elementary (YouTube)", type:"YouTube · Free", desc:"Stories and real-life scenarios in simple Japanese. Watch without subtitles to build listening fluency — a key CLT principle.", url:"https://www.youtube.com/@cijapanese" },
    { icon:"📱", name:"Tandem", type:"App · Free", desc:"Language exchange with native speakers. Practice real conversations through text, voice, and video. CLT at its most authentic.", url:"https://www.tandem.net/" },
    { icon:"🌐", name:"NHK Web Easy", type:"Website · Free", desc:"Read real Japanese news simplified for learners. Use it as a springboard: read, then discuss the topic with your italki tutor.", url:"https://www3.nhk.or.jp/news/easy/" },
  ],
  "A2": [
    { icon:"🎭", name:"italki — Role-play Lessons", type:"Live lessons · From $10/hr", desc:"Ask your tutor for role-play scenarios: job interview prep, traveling in Japan, business introductions. CLT works best with real tasks.", url:"https://www.italki.com/en/teachers/japanese" },
    { icon:"📺", name:"Comprehensible Japanese Intermediate (YouTube)", type:"YouTube · Free", desc:"Native-speed storytelling at N4 level. Watch 15 minutes daily to build fluency and train your ear for natural Japanese rhythm.", url:"https://www.youtube.com/@cijapanese" },
    { icon:"🌐", name:"NHK Web Easy", type:"Website · Free", desc:"Read 2-3 articles per week. CLT tip: summarize each article aloud in Japanese, then discuss your opinion with a language partner.", url:"https://www3.nhk.or.jp/news/easy/" },
    { icon:"📱", name:"Tandem", type:"App · Free", desc:"Find a native Japanese partner. Set a weekly topic (food, travel, work) and have 20-minute voice conversations. Fluency over accuracy.", url:"https://www.tandem.net/" },
  ],
  "A2–B1": [
    { icon:"🎭", name:"italki — Task-Based Lessons", type:"Live lessons · From $10/hr", desc:"Give your tutor a task: 'Let's plan a trip to Kyoto together' or 'Interview me for a job.' Task-based learning is central to CLT.", url:"https://www.italki.com/en/teachers/japanese" },
    { icon:"📺", name:"Comprehensible Japanese Upper-Intermediate (YouTube)", type:"YouTube · Free", desc:"Longer authentic stories and explanations. Ideal for building reading and listening fluency simultaneously.", url:"https://www.youtube.com/@cijapanese" },
    { icon:"🌐", name:"NHK Web Easy → NHK News", type:"Website · Free", desc:"Transition from simplified to real news. CLT approach: read, react, discuss — don't just translate.", url:"https://www3.nhk.or.jp/news/" },
    { icon:"📱", name:"Todai Easy Japanese News", type:"App · Free", desc:"News app for Japanese learners. Read with pop-up dictionary support. Use each article as a discussion topic with your language partner.", url:"https://todaysjapanese.com/" },
  ],
  "B1": [
    { icon:"🎭", name:"GAKU Online Japanese Lessons", type:"Live lessons", desc:"Native teacher-led CLT sessions: debates, presentations, role-plays in Japanese. Ideal for pushing from N3 toward N2 fluency.", url:"https://www.seitojapanese.online/" },
    { icon:"📺", name:"Japanese dramas (Netflix/Amazon)", type:"Streaming · Paid", desc:"Watch with Japanese subtitles only. Pause and repeat authentic dialogue. This is CLT immersion — real language in real contexts.", url:"https://www.netflix.com/browse/genre/10702" },
    { icon:"🌐", name:"NHK News Web (full)", type:"Website · Free", desc:"Read regular news daily. CLT tip: record yourself summarizing an article in Japanese, listen back, and note natural errors.", url:"https://www3.nhk.or.jp/news/" },
    { icon:"📱", name:"Tandem — Advanced exchange", type:"App · Free", desc:"Debate current events with native speakers. CLT at advanced level: express opinions, disagree politely, negotiate meaning.", url:"https://www.tandem.net/" },
  ],
  "B1–B2": [
    { icon:"🎭", name:"GAKU Business Japanese Lessons", type:"Live lessons", desc:"CLT-based business Japanese: keigo role-plays, meeting simulations, presentation practice. Directly applicable to real work situations in Japan.", url:"https://www.seitojapanese.online/" },
    { icon:"📺", name:"Japanese variety shows & podcasts", type:"YouTube/Podcast · Free", desc:"Watch native content: news programs, talk shows, podcasts. No subtitles. CLT principle: acquire language through real, authentic input.", url:"https://www.youtube.com/results?search_query=japanese+podcast+intermediate" },
    { icon:"🌐", name:"Asahi Shimbun", type:"Website · Free articles", desc:"Read real newspaper opinion columns. CLT task: write a 3-sentence Japanese response to the editorial. Practice authentic written communication.", url:"https://www.asahi.com/" },
    { icon:"📱", name:"Tandem — Debate partner", type:"App · Free", desc:"Find a partner to debate weekly topics in Japanese. CLT hallmark: using language to accomplish real communicative goals.", url:"https://www.tandem.net/" },
  ],
  "B2": [
    { icon:"🎭", name:"GAKU Advanced Japanese Lessons", type:"Live lessons", desc:"Native teacher for nuanced CLT practice: discuss abstract topics, refine keigo, practice formal presentations and negotiations.", url:"https://www.seitojapanese.online/" },
    { icon:"📺", name:"TED Talks in Japanese (YouTube)", type:"YouTube · Free", desc:"Watch Japanese TED talks, then give your own 3-minute talk on the same topic in Japanese. CLT at its best: meaningful, real output.", url:"https://www.youtube.com/results?search_query=ted+talks+japanese" },
    { icon:"🌐", name:"Nikkei Business Online", type:"Website · Free articles", desc:"Business and economics journalism in native Japanese. CLT task: summarize the article to a tutor and discuss your opinion.", url:"https://business.nikkei.com/" },
    { icon:"📱", name:"Tandem — Advanced conversation", type:"App · Free", desc:"Discuss complex topics: economics, culture, current events. CLT principle: fluency in authentic, meaningful interaction.", url:"https://www.tandem.net/" },
  ],
  "B2–C1": [
    { icon:"🎭", name:"GAKU Fluency Coaching", type:"Live lessons", desc:"Advanced CLT coaching: debate, negotiate, present in Japanese at professional level. Focus on naturalness and cultural nuance.", url:"https://www.seitojapanese.online/" },
    { icon:"📺", name:"Japanese documentaries & films", type:"Streaming · Paid", desc:"Watch films and documentaries in Japanese. CLT task: discuss the film with a native partner — themes, opinions, cultural context.", url:"https://www.netflix.com/browse/genre/10702" },
    { icon:"🌐", name:"青空文庫 (Aozora Bunko)", type:"Website · Free", desc:"Read modern Japanese literature. CLT approach: discuss what you read with a native tutor — themes, characters, language choices.", url:"https://www.aozora.gr.jp/" },
    { icon:"📱", name:"italki — Professional tutors", type:"Live lessons · From $20/hr", desc:"Work with a certified Japanese teacher on advanced CLT tasks: mock job interviews, academic presentations, business negotiations.", url:"https://www.italki.com/en/teachers/japanese" },
  ],
  "C1": [
    { icon:"🎭", name:"GAKU Professional Japanese", type:"Live lessons", desc:"High-level CLT coaching for professional contexts: board-level presentations, contract negotiations, academic seminars in Japanese.", url:"https://www.seitojapanese.online/" },
    { icon:"📺", name:"Japanese TV news & debate shows", type:"TV/YouTube · Free", desc:"Watch political debates, news analysis shows. CLT immersion at native level: real language, real speed, real cultural context.", url:"https://www.nhk.or.jp/nhkworld/en/ondemand/" },
    { icon:"🌐", name:"Japanese academic papers (CiNii)", type:"Website · Free", desc:"Read Japanese academic literature in your field. CLT task: write a short Japanese response paper and have it reviewed by your tutor.", url:"https://cir.nii.ac.jp/" },
    { icon:"📱", name:"italki — Expert tutors", type:"Live lessons · From $30/hr", desc:"Work with senior Japanese teachers on the most nuanced aspects: regional dialects, classical references, ultra-formal speech styles.", url:"https://www.italki.com/en/teachers/japanese" },
  ],
};


const INVITE_CODES = ["GAKU2024", "SEITO2024", "JAPANESE01"];
const usedCodes = {};

const S = {
  wrap: { minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans JP',sans-serif", padding:"80px 16px 40px" },
  card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"32px 28px", width:"100%", maxWidth:520 },
  label: { color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:6, display:"block", letterSpacing:1 },
  input: { width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  select: { width:"100%", padding:"12px 14px", background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: { width:"100%", padding:"14px", borderRadius:12, border:"none", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 },
};

function LoadingScreen() {
  const [step, setStep] = useState(0);
  const messages = [
    "GAKU is generating your questions...",
    "Generating your CEFR level...",
    "Almost there...",
    "DONE!!",
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, 3)), 1200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ ...S.wrap }}>
      <div style={{ ...S.card, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:24 }}>📚</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity: i <= step ? 1 : 0.2, transition:"opacity 0.5s" }}>
              <span style={{ fontSize:16 }}>{i < step ? "✅" : i === step ? "⏳" : "⬜"}</span>
              <span style={{ color: i <= step ? "#f1f5f9" : "#475569", fontSize:14, fontWeight: i === step ? 700 : 400 }}>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlurredPlan({ plan, onUnlock }) {
  const lines = plan.split("\n").filter(Boolean);
  const preview = lines.slice(0, 4).join("\n");
  const blurred = lines.slice(4).join("\n");

  return (
    <div style={{ ...S.wrap }}>
      <div style={{ ...S.card }}>
        <p style={{ color:COLOR, fontSize:12, fontWeight:700, letterSpacing:2, marginBottom:8 }}>YOUR PERSONALIZED STUDY PLAN</p>
        <div style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap", marginBottom:16 }}>{preview}</div>
        <div style={{ position:"relative" }}>
          <div style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap", filter:"blur(5px)", userSelect:"none", pointerEvents:"none" }}>{blurred}</div>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"rgba(10,15,30,0.7)", borderRadius:12, padding:24 }}>
            <p style={{ color:"#f1f5f9", fontSize:16, fontWeight:700, textAlign:"center", margin:0 }}>Would you like to unlock your full study plan?</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onUnlock} style={{ ...S.btn, width:"auto", padding:"12px 28px", background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff", marginTop:0 }}>Yes</button>
              <button onClick={() => window.location.href="/"} style={{ ...S.btn, width:"auto", padding:"12px 20px", background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.1)", marginTop:0 }}>No thank you</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnlockScreen({ email, plan, cefrLevel }) {
  const [mode, setMode] = useState(null); // null | "free" | "pay" | "invite"
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isStudent, setIsStudent] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const handleInvite = () => {
    const code = inviteCode.trim().toUpperCase();
    if (!INVITE_CODES.includes(code)) { setInviteError("Invalid code. Please try again."); return; }
    if (usedCodes[code] && usedCodes[code] !== email) { setInviteError("This code has already been used."); return; }
    usedCodes[code] = email;
    setUnlocked(true);
  };

  const handlePay = async () => {
    try {
      if (!window.Stripe) { alert("Stripe failed to load. Please refresh."); return; }
      const stripe = window.Stripe(STRIPE_KEY);
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: PRICE_ID, quantity: 1 }],
        mode: "subscription",
        successUrl: window.location.origin + "?success=true",
        cancelUrl: window.location.href,
        customerEmail: email,
      });
      if (error) alert(error.message);
    } catch(e) { alert("Payment error: " + e.message); }
  };

  if (unlocked) {
    const resources = RESOURCES_BY_LEVEL[cefrLevel] || RESOURCES_BY_LEVEL["A2"];
    return (
      <div style={{ ...S.wrap }}>
        <div style={{ ...S.card, marginBottom:16 }}>
          <p style={{ color:"#22c55e", fontSize:12, fontWeight:700, letterSpacing:2, marginBottom:8 }}>✅ UNLOCKED — YOUR FULL STUDY PLAN</p>
          <div style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap" }}>{plan}</div>
        </div>
        <div style={{ ...S.card }}>
          <p style={{ color:"#f59e0b", fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>📚 RECOMMENDED RESOURCES FOR YOUR LEVEL ({cefrLevel})</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {resources.map((r, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", gap:10, padding:"14px 16px", background:"rgba(255,255,255,0.04)", borderRadius:12, border:"1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{r.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 2px" }}>{r.name}</p>
                    <p style={{ color:"#a855f7", fontSize:11, fontWeight:700, margin:"0 0 4px" }}>{r.type}</p>
                    <p style={{ color:"#94a3b8", fontSize:12, margin:0, lineHeight:1.6 }}>{r.desc}</p>
                  </div>
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"10px", background:"linear-gradient(135deg,#a855f7,#7c3aed)", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>
                  → Open {r.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...S.wrap }}>
      <div style={{ ...S.card }}>
        {!mode && (
          <>
            <p style={{ color:COLOR, fontSize:16, fontWeight:700, marginBottom:20, textAlign:"center" }}>Want to use it for FREE?</p>
            <button onClick={() => setMode("free")} style={{ ...S.btn, background:`linear-gradient(135deg,#22c55e,#16a34a)`, color:"#fff" }}>Yes, use for FREE</button>
            <div style={{ textAlign:"center", margin:"16px 0", color:"#475569", fontSize:12 }}>or</div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"20px", textAlign:"center", border:"1px solid rgba(168,85,247,0.3)" }}>
              <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 4px" }}>$10 / month</p>
              <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 14px" }}>Full access · Cancel anytime</p>
              <button onClick={handlePay} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff", marginTop:0 }}>Pay now</button>
            </div>
          </>
        )}

        {mode === "free" && isStudent === null && (
          <>
            <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, marginBottom:20, textAlign:"center" }}>Are you a student at GAKU?</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setIsStudent(true)} style={{ ...S.btn, background:`linear-gradient(135deg,#3b82f6,#1d4ed8)`, color:"#fff" }}>Yes</button>
              <button onClick={() => setIsStudent(false)} style={{ ...S.btn, background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.1)" }}>No</button>
            </div>
          </>
        )}

        {mode === "free" && isStudent === true && (
          <>
            <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, marginBottom:6 }}>Enter your invitation code</p>
            <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>Your personal code from GAKU</p>
            <input value={inviteCode} onChange={e => { setInviteCode(e.target.value); setInviteError(""); }} placeholder="e.g. GAKU2024" style={{ ...S.input, marginBottom:8 }} />
            {inviteError && <p style={{ color:"#ef4444", fontSize:12, marginBottom:8 }}>{inviteError}</p>}
            <button onClick={handleInvite} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff" }}>Unlock</button>
          </>
        )}

        {mode === "free" && isStudent === false && (
          <>
            <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, marginBottom:16, textAlign:"center" }}>Choose an option</p>
            <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{ display:"block", ...S.btn, background:`linear-gradient(135deg,#f59e0b,#d97706)`, color:"#fff", textDecoration:"none", textAlign:"center", marginBottom:10 }}>
              Take a free trial lesson
            </a>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"20px", textAlign:"center", border:"1px solid rgba(168,85,247,0.3)" }}>
              <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 4px" }}>$10 / month</p>
              <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 14px" }}>Full access · Cancel anytime</p>
              <button onClick={handlePay} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},#7c3aed)`, color:"#fff", marginTop:0 }}>Pay now</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SelfStudy({ cefrLevel, section }) {
  const [phase, setPhase] = useState("form");
  const [form, setForm] = useState({ name:"", email:"", country:"", goal:"", timeline:"", jlpt:"", hoursPerDay:"", daysPerWeek:"" });
  const [plan, setPlan] = useState("");
  const [showUnlock, setShowUnlock] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isValid = form.name.trim() && form.email.trim() && form.country.trim() && form.goal && form.timeline && form.jlpt && form.hoursPerDay && form.daysPerWeek;

  const handleSubmit = async () => {
    if (!isValid) return;
    setPhase("loading");
    await fetch(FORMSPREE_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json", Accept:"application/json"},
      body: JSON.stringify({ ...form, cefrLevel, section }),
    });
    const prompt = `You are a Japanese language learning expert. Create a personalized Japanese study plan for this student.

Student info:
- Name: ${form.name}
- Country: ${form.country}
- Current CEFR Level (from test): ${cefrLevel || "Unknown"}
- Current JLPT: ${form.jlpt}
- Goal: ${form.goal}
- Timeline: ${form.timeline}
- Study hours per day: ${form.hoursPerDay}
- Study days per week: ${form.daysPerWeek}
- Test section: ${section || "General"}

Write a personalized study plan with:
1. Current level analysis (2-3 sentences)
2. Weekly study schedule (specific and realistic)
3. Top 3 recommended resources (apps, books, or websites)
4. Key milestones to track progress
5. Motivational closing message

Keep it practical, specific, and encouraging. Use clear headings with emoji. Write in English.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "Your personalized study plan is being prepared. Please check your email!";
      setPlan(text);
    } catch {
      setPlan(`📚 Your Personalized Study Plan\n\nBased on your ${cefrLevel} level, here is your recommended plan:\n\n📅 Weekly Schedule\nStudy ${form.hoursPerDay} hours/day, ${form.daysPerWeek} days/week consistently.\n\n🎯 Goal\n${form.goal} within ${form.timeline}.\n\n📖 Recommended Resources\n1. Anki flashcards for vocabulary\n2. JLPT Sensei for grammar\n3. NHK Web Easy for reading\n\n🏆 Milestones\nTrack your progress monthly and celebrate small wins!\n\nYou've got this! 頑張って！`);
    }
    setPhase("result");
  };

  if (phase === "loading") return <LoadingScreen />;
  if (phase === "result" && !showUnlock) return <BlurredPlan plan={plan} onUnlock={() => setShowUnlock(true)} />;
  if (phase === "result" && showUnlock) return <UnlockScreen email={form.email} plan={plan} cefrLevel={cefrLevel} />;

  return (
    <div style={{ ...S.wrap }}>
      <div style={{ ...S.card }}>
        <p style={{ color:COLOR, fontSize:12, fontWeight:700, letterSpacing:2, marginBottom:4 }}>PERSONALIZED SELF-STUDY SET</p>
        <h2 style={{ color:"#f1f5f9", fontSize:22, fontWeight:800, margin:"0 0 24px" }}>Tell us about yourself</h2>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={S.label}>YOUR NAME *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Tanaka Yuki" style={S.input} />
          </div>
          <div>
            <label style={S.label}>EMAIL ADDRESS *</label>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" type="email" style={S.input} />
          </div>
          <div>
            <label style={S.label}>COUNTRY *</label>
            <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="e.g. USA, Brazil, France..." style={S.input} />
          </div>
          <div>
            <label style={S.label}>FINAL GOAL *</label>
            <select value={form.goal} onChange={e => set("goal", e.target.value)} style={S.select}>
              <option value="">Select your goal</option>
              <option value="Pass JLPT">Pass JLPT</option>
              <option value="Get a job in Japan">Get a job in Japan</option>
              <option value="Travel to Japan">Travel to Japan</option>
              <option value="Study abroad in Japan">Study abroad in Japan</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={S.label}>WHEN DO YOU WANT TO ACHIEVE YOUR GOAL? *</label>
            <select value={form.timeline} onChange={e => set("timeline", e.target.value)} style={S.select}>
              <option value="">Select timeline</option>
              <option value="Less than 6 months">Less than 6 months</option>
              <option value="Within 1 year">Within 1 year</option>
              <option value="2-3 years">2–3 years</option>
              <option value="Over 3 years">Over 3 years</option>
            </select>
          </div>
          <div>
            <label style={S.label}>CURRENT JLPT LEVEL *</label>
            <select value={form.jlpt} onChange={e => set("jlpt", e.target.value)} style={S.select}>
              <option value="">Select level</option>
              <option value="No JLPT">No JLPT</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </div>
          <div>
            <label style={S.label}>HOW LONG DO YOU STUDY PER DAY? *</label>
            <select value={form.hoursPerDay} onChange={e => set("hoursPerDay", e.target.value)} style={S.select}>
              <option value="">Select hours</option>
              <option value="Less than 1 hour">Less than 1 hour</option>
              <option value="1-2 hours">1–2 hours</option>
              <option value="2-3 hours">2–3 hours</option>
              <option value="More than 3 hours">More than 3 hours</option>
            </select>
          </div>
          <div>
            <label style={S.label}>HOW MANY DAYS PER WEEK? *</label>
            <select value={form.daysPerWeek} onChange={e => set("daysPerWeek", e.target.value)} style={S.select}>
              <option value="">Select days</option>
              <option value="Once a week or less">Once a week or less</option>
              <option value="Twice a week">Twice a week</option>
              <option value="Three times a week">Three times a week</option>
              <option value="More than three times a week">More than three times a week</option>
            </select>
          </div>

          {!isValid && <p style={{ color:"#ef4444", fontSize:12, textAlign:"center", margin:0 }}>※ Please fill in all fields</p>}
          <button onClick={handleSubmit} disabled={!isValid} style={{ ...S.btn, background: isValid ? `linear-gradient(135deg,${COLOR},#7c3aed)` : "#1e293b", color: isValid ? "#fff" : "#475569", cursor: isValid ? "pointer" : "not-allowed" }}>
            Generate My Study Plan →
          </button>
        </div>
      </div>
    </div>
  );
}
