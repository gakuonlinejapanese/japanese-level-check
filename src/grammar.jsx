import React, { useState } from "react";

const CP = { A1:"#22c55e", A2:"#3b82f6", B1:"#f59e0b", B2:"#ef4444", C1:"#a855f7" };
const COLOR = "#8b5cf6";

const QUESTIONS = [
  {
    hiragana: true,
    text: "わたし は がくせい （　）。",
    textEn: "I am a student. Which word completes the sentence?",
    options: ["する", "ます", "です", "ました", "Not Able To Answer"],
    answer: 2,
    explanation: "「です」is the polite copula used to end a sentence, equivalent to 'am/is/are'. 「する」means 'to do', 「ます」needs a verb stem before it, and 「ました」is past tense.",
  },
  {
    cefr:"A1", jlpt:"N5",
    text: "私は毎日日本語を（　）。",
    textEn: "I study Japanese every day. Choose the correct verb form.",
    options: ["勉強", "勉強する", "勉強して", "勉強した", "Not Able To Answer"],
    answer: 1,
    explanation: "「勉強する」is the plain present form used to state a current habit. 「した」is past tense; 「して」is the te-form and cannot end a sentence alone.",
  },
  {
    cefr:"A2", jlpt:"N4",
    text: "雨が（　）、家にいます。",
    textEn: "If it rains, I'll stay home. Choose the correct conditional form.",
    options: ["降るなら", "降るしか", "降るだけ", "降るばかり", "Not Able To Answer"],
    answer: 0,
    explanation: "「〜なら」expresses a conditional 'if'. The other options — しか, だけ, ばかり — all indicate restriction or continuity, not a conditional.",
  },
  {
    cefr:"B1", jlpt:"N3",
    text: "日本に来てから、日本語が話せる（　）なりました。",
    textEn: "Since coming to Japan, I have become able to speak Japanese.",
    options: ["よう", "ように", "みたい", "らしい", "Not Able To Answer"],
    answer: 1,
    explanation: "「〜ようになる」expresses a change in ability or habit over time. Note that 「ように」(not 「よう」alone) is required before 「なりました」. The other options express appearance or hearsay.",
  },
  {
    cefr:"B2", jlpt:"N2",
    text: "彼は暇な（　）、連絡をくれなかった。",
    textEn: "Even though he was free, he didn't contact me.",
    options: ["ため", "ので", "から", "くせに", "Not Able To Answer"],
    answer: 3,
    explanation: "「〜くせに」is a contrastive conjunction implying blame or complaint. The other three options are neutral causal connectors with no critical tone.",
  },
  {
    cefr:"C1", jlpt:"N1",
    text: "彼の態度は、反省している（　）言い難い。",
    textEn: "It is hard to say that his attitude shows remorse.",
    options: ["ほど", "ばかり", "とは", "ものの", "Not Able To Answer"],
    answer: 2,
    explanation: "「〜とは言い難い」is an N1 formal written structure meaning 'it is difficult to say that ~'. The blank requires 「とは」to complete this set expression.",
  },
];

function getResult(score, total) {
  const p = score / total;
  if (p === 1)   return { level:"C1",     msg:"Excellent grammar command — near native level!" };
  if (p >= 0.83) return { level:"B2–C1",  msg:"Advanced. Fine-tune nuanced structures." };
  if (p >= 0.67) return { level:"B1–B2",  msg:"Upper-intermediate grammar. Keep it up!" };
  if (p >= 0.5)  return { level:"A2–B1",  msg:"Intermediate. Focus on N3–N2 patterns." };
  if (p >= 0.33) return { level:"A2",     msg:"Elementary. Master basic sentence endings first." };
  if (p > 0)     return { level:"A1",     msg:"Beginner. Study N5 verb conjugations." };
  return               { level:"Pre-A1", msg:"Just starting — keep going!" };
}



function CTABlock() {
  const [ctaStep, setCtaStep] = useState(0);
  return (
    <div style={{marginTop:24,padding:'20px',background:'rgba(255,255,255,0.04)',borderRadius:16,border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
      {ctaStep===0&&(<><p style={{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}>Want to improve your Japanese?</p><div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}><button onClick={()=>setCtaStep(1)} style={{padding:'12px 24px',background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Yes</button><button onClick={()=>setCtaStep(4)} style={{padding:'12px 20px',background:'rgba(255,255,255,0.08)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,fontSize:13,cursor:'pointer'}}>No, I'm satisfied with my result</button></div></>)}
      {ctaStep===1&&(<><p style={{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}>Apply for your FREE Trial Lesson!</p><a href='https://www.seitojapanese.online/' target='_blank' rel='noopener noreferrer' style={{display:'inline-block',padding:'14px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none'}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a></>)}
      {ctaStep===2&&(<><p style={{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}>Apply for your FREE Trial Lesson!</p><a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'14px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none'}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a></>)}
      {ctaStep===4&&(<><p style={{color:'#64748b',fontSize:14,marginBottom:12}}>Great! Keep up the good work!</p>{window.__ss&&<button onClick={()=>window.__ss('')} style={{padding:'12px 20px',background:'linear-gradient(135deg,#a855f7,#7c3aed)',color:'#fff',border:'none',borderRadius:12,fontSize:13,fontWeight:700,cursor:'pointer'}}>Get a personalized self-study set</button>}</>)}
    </div>
  );
}

export default function Grammar({ onSelfStudy }) {
  const [phase, setPhase]             = useState("quiz");
  const [qIndex, setQIndex]           = useState(0);
  const [selected, setSelected]       = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");

  const q = QUESTIONS[qIndex];
  const score = userAnswers.filter((a, i) => a === QUESTIONS[i]?.answer).length;

  function handleNext() {
    if (selected === null) return;
    const updated = [...userAnswers, selected];
    setUserAnswers(updated);
    if (qIndex + 1 < QUESTIONS.length) { setQIndex(qIndex + 1); setSelected(null); }
    else setPhase("gate");
  }

  async function submitToFormspree(nameVal, emailVal, sectionName) {
    try {
      await fetch('https://formspree.io/f/mykvallk', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({name: nameVal, email: emailVal, section: sectionName})
      });
    } catch(e) {}
  }
  function restart() {
    setPhase("quiz"); setQIndex(0); setSelected(null); setUserAnswers([]); setName(""); setEmail("");
  }

  if (phase === "quiz" && q) {
    const cc = q.hiragana ? "#f472b6" : (CP[q.cefr] ?? COLOR);
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <span style={{ color:COLOR, fontWeight:800, fontSize:14 }}>️ Grammar</span>
            <span style={{ color:"#64748b", fontSize:13 }}>{qIndex+1} / {QUESTIONS.length}</span>
          </div>
          <div style={{ height:5, background:"#1e293b", borderRadius:4, marginBottom:22 }}>
            <div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${cc},${cc}99)`, width:`${((qIndex+1)/QUESTIONS.length)*100}%`, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
            {q.hiragana
              ? <span style={{ ...S.badge, background:"#f472b622", color:"#f472b6" }}> ひらがな問題</span>
              : <><span style={{ ...S.badge, background:cc+"22", color:cc }}>CEFR {q.cefr}</span>
                 <span style={{ ...S.badge, background:"#1e293b", color:"#64748b" }}>JLPT {q.jlpt}</span></>
            }
          </div>
          <p style={{...S.qText, fontSize:13, color:"#94a3b8", marginBottom:4}}>If you cannot answer, click "Not Able To Answer"</p><p style={S.qText}>{q.text}</p>
          {q.textEn && <p style={S.qTextEn}>{q.textEn}</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
            {q.options.map((opt, i) => {
              const sel = selected === i;
              return (
                <button key={i} onClick={() => setSelected(i)} style={{
                  ...S.optBtn,
                  background: sel ? cc+"22" : "rgba(255,255,255,0.04)",
                  border:`1.5px solid ${sel ? cc : "rgba(255,255,255,0.08)"}`,
                  color: sel ? "#f1f5f9" : "#94a3b8",
                  transform: sel ? "translateX(4px)" : "none",
                }}>
                  <span style={{ ...S.optLabel, background: sel?cc:"#1e293b", color: sel?"#fff":"#475569" }}>{["A","B","C","D"][i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          <button onClick={handleNext} disabled={selected===null} style={{
            ...S.btn,
            background: selected!==null ? `linear-gradient(135deg,${cc},${cc}99)` : "#1e293b",
            color: selected!==null ? "#fff" : "#475569",
            cursor: selected!==null ? "pointer" : "default",
          }}>
            {qIndex+1===QUESTIONS.length ? "See Results →" : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "gate") return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:10 }}></div>
          <h2 style={{ color:"#f1f5f9", fontSize:21, fontWeight:900, margin:"0 0 8px" }}>Want to know your results?</h2>
          <p style={{ color:"#64748b", fontSize:13, margin:0, lineHeight:1.7 }}>
            Enter your name and email to unlock your score,<br/>correct answers, and CEFR level.
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>
          <div><label style={S.label}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={S.input}/></div>
          <div><label style={S.label}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={S.input}/></div>
        </div>
        {(!name.trim()||!email.trim())&&<p style={{color:"#ef4444",fontSize:12,textAlign:"center",marginBottom:10}}>※ Name and Email are required.</p>}
        <button onClick={() => { if(name.trim()&&email.trim()) { submitToFormspree(name, email, ''); setPhase('result'); } }} style={{
          ...S.btn,
          background: name.trim()&&email.trim() ? `linear-gradient(135deg,${COLOR},${COLOR}99)` : "#1e293b",
          color: name.trim()&&email.trim() ? "#fff" : "#475569",
          cursor: name.trim()&&email.trim() ? "pointer" : "default",
        }}>Unlock My Results →</button>
        <p style={{ color:"#334155", fontSize:11, textAlign:"center", marginTop:14 }}>Demo only — no data is transmitted externally.</p>
      </div>
    </div>
  );

  if (phase === "result") {
    const res = getResult(score, QUESTIONS.length);
    const rc = CP[res.level.split("–")[0]] ?? COLOR;
    return (
      <div style={S.page}>
        <div style={{ ...S.card, maxWidth:580 }}>
          <div style={{ textAlign:"center", marginBottom:26 }}>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:4 }}>{name}'s Results — Grammar</p>
            <div style={{ fontSize:48, fontWeight:900, background:`linear-gradient(135deg,${COLOR},${rc})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{res.level}</div>
            <p style={{ color:"#94a3b8", fontSize:14, marginTop:6, marginBottom:14 }}>{res.msg}</p>
            <div style={{ fontSize:30, fontWeight:900, color:"#f1f5f9" }}>{score} <span style={{ color:"#475569", fontSize:16 }}>/ {QUESTIONS.length} correct</span></div>
          </div>

          {/* CEFR Info Section */}
          {(() => {
            const info = {"Pre-A1":{"jlpt":"Below N5","canDo":["Recognize basic hiragana and katakana characters","Understand a few common words like 'arigatou' or 'sumimasen'","Follow very simple instructions with visual support"],"problems":["Cannot hold even the simplest conversation in Japanese","Unable to read menus, signs, or basic texts","Very limited ability to function independently in Japan"],"timeToN4":"Approximately 18–24 months of consistent daily study","timeToN2":"Approximately 4–6 years of dedicated study"},"A1":{"jlpt":"N5","canDo":["Introduce yourself with name, nationality, and basic personal info","Understand simple anime phrases and children's shows","Read hiragana, katakana, and about 100 kanji","Order food from a picture menu in Japan"],"problems":["Cannot sustain a real conversation beyond greetings","Struggles to understand natural speech speed","Limited vocabulary makes daily tasks in Japan difficult"],"timeToN4":"Approximately 12–18 months of consistent daily study","timeToN2":"Approximately 3–5 years of dedicated study"},"A1–A2":{"jlpt":"N5–N4","canDo":["Handle basic daily interactions like shopping and asking directions","Understand simple conversations on familiar topics","Read short texts with furigana support","Enjoy simple manga and children's anime"],"problems":["Still struggles with fast or natural Japanese speech","Grammar knowledge is limited to basic sentence patterns","Cannot handle unexpected topics in conversation"],"timeToN4":"Approximately 6–12 months of consistent daily study","timeToN2":"Approximately 2–4 years of dedicated study"},"A2":{"jlpt":"N4","canDo":["Have simple conversations about daily life, hobbies, and travel","Apply to some Japanese language university programs","Understand the general meaning of short news articles with a dictionary","Communicate in basic work situations in Japan"],"problems":["Cannot yet work professionally in Japanese","Struggles with keigo (polite business Japanese)","Limited reading ability for authentic Japanese content"],"timeToN4":"You are at N4 level! Focus on consolidating your skills.","timeToN2":"Approximately 1–2 years of focused study"},"A2–B1":{"jlpt":"N4–N3","canDo":["Manage most everyday situations while traveling in Japan","Understand the main points of clear standard speech","Read simple Japanese articles and short stories","Hold conversations on familiar topics with some confidence"],"problems":["Nuanced or abstract topics remain challenging","Business Japanese and formal writing still need development","Listening to fast native speech is still difficult"],"timeToN4":"You are near or at N4 level! Keep going.","timeToN2":"Approximately 1–2 years of focused study"},"B1":{"jlpt":"N3","canDo":["Handle most situations encountered while living in Japan","Understand the main points of standard TV news","Read newspaper articles with occasional dictionary use","Express opinions on familiar topics clearly"],"problems":["Professional and academic Japanese still challenging","Subtle cultural nuances may be missed in conversation","Writing formal documents requires more practice"],"timeToN4":"You have surpassed N4!","timeToN2":"Approximately 6–12 months of focused study"},"B1–B2":{"jlpt":"N3–N2","canDo":["Communicate fluently on a wide range of topics","Understand most Japanese TV shows and movies","Read most news articles and general books","Begin working in Japanese-speaking environments"],"problems":["Highly technical or specialized vocabulary still limited","Academic writing and formal presentations need polish","Some idiomatic expressions may still be unfamiliar"],"timeToN4":"You have surpassed N4!","timeToN2":"You are near N2! A few more months of study."},"B2":{"jlpt":"N2","canDo":["Apply to most Japanese companies as a bilingual candidate","Understand complex texts on a wide range of subjects","Participate in meetings and discussions in Japanese","Watch Japanese news and dramas without subtitles"],"problems":["C1-level nuance and native-like fluency still requires work","Highly specialized fields (law, medicine) may be challenging","Very fast or dialect-heavy speech can be difficult"],"timeToN4":"You have surpassed N4!","timeToN2":"You are at N2 level! Aim for N1 next."},"B2–C1":{"jlpt":"N2–N1","canDo":["Work professionally in Japanese in most industries","Understand almost all spoken and written Japanese","Express yourself fluently and spontaneously","Appreciate cultural nuances and humor in Japanese"],"problems":["Native-level precision in writing still needs refinement","Highly specialized or archaic vocabulary may be unfamiliar","Regional dialects can still cause occasional confusion"],"timeToN4":"You have far surpassed N4!","timeToN2":"You are at or near N2! Target N1."},"C1":{"jlpt":"N1","canDo":["Work at the highest level in Japanese in any industry","Understand dialects, humor, and cultural references","Read academic papers, legal documents, and literature","Pass the Japanese Language Proficiency Test N1"],"problems":["Native-like precision in very formal writing takes continuous effort","Staying updated with new slang and evolving language","Rare dialect or highly archaic expressions may still appear"],"timeToN4":"You have far surpassed N4!","timeToN2":"You have surpassed N2! You are at N1 level."}}[res.level] || {"jlpt":"N/A","canDo":["Keep studying!"],"problems":["Keep going!"],"timeToN4":"Keep studying!","timeToN2":"Keep studying!"};
            return (
              <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:24}}>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,padding:'16px 18px',borderLeft:'3px solid #3b82f6'}}>
                  <p style={{color:'#3b82f6',fontSize:12,fontWeight:700,margin:'0 0 6px',letterSpacing:1}}>📊 JLPT EQUIVALENT</p>
                  <p style={{color:'#f1f5f9',fontSize:18,fontWeight:800,margin:0}}>{info.jlpt}</p>
                </div>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,padding:'16px 18px',borderLeft:'3px solid #22c55e'}}>
                  <p style={{color:'#22c55e',fontSize:12,fontWeight:700,margin:'0 0 10px',letterSpacing:1}}>✅ WHAT YOU CAN DO AT THIS LEVEL</p>
                  {info.canDo.map((item,i) => (
                    <div key={i} style={{display:'flex',gap:8,marginBottom:6,alignItems:'flex-start'}}>
                      <span style={{color:'#22c55e',fontSize:12,marginTop:2}}>•</span>
                      <span style={{color:'#cbd5e1',fontSize:13,lineHeight:1.6}}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,padding:'16px 18px',borderLeft:'3px solid #ef4444'}}>
                  <p style={{color:'#ef4444',fontSize:12,fontWeight:700,margin:'0 0 10px',letterSpacing:1}}>⚠️ CHALLENGES AT THIS LEVEL</p>
                  {info.problems.map((item,i) => (
                    <div key={i} style={{display:'flex',gap:8,marginBottom:6,alignItems:'flex-start'}}>
                      <span style={{color:'#ef4444',fontSize:12,marginTop:2}}>•</span>
                      <span style={{color:'#cbd5e1',fontSize:13,lineHeight:1.6}}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,padding:'16px 18px',borderLeft:'3px solid #f59e0b'}}>
                  <p style={{color:'#f59e0b',fontSize:12,fontWeight:700,margin:'0 0 10px',letterSpacing:1}}>⏱️ YOUR STUDY ROADMAP</p>
                  <div style={{marginBottom:8}}>
                    <p style={{color:'#94a3b8',fontSize:11,margin:'0 0 2px'}}>To reach N4 / A2 (Japanese University entry):</p>
                    <p style={{color:'#f1f5f9',fontSize:13,fontWeight:600,margin:0}}>{info.timeToN4}</p>
                  </div>
                  <div>
                    <p style={{color:'#94a3b8',fontSize:11,margin:'0 0 2px'}}>To reach N2 / B2 (Japanese Company entry):</p>
                    <p style={{color:'#f1f5f9',fontSize:13,fontWeight:600,margin:0}}>{info.timeToN2}</p>
                  </div>
                </div>
              </div>
            );
          })()}
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
            {QUESTIONS.map((qq, i) => {
              const ua = userAnswers[i]; const ok = ua === qq.answer;
              const cc = qq.hiragana ? "#f472b6" : (CP[qq.cefr] ?? COLOR);
              return (
                <div key={i} style={{ background:ok?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1.5px solid ${ok?"#22c55e33":"#ef444433"}`, borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                    {qq.hiragana ? <span style={{ ...S.badge, background:"#f472b622", color:"#f472b6" }}> Hiragana</span>
                      : <><span style={{ ...S.badge, background:cc+"22", color:cc }}>CEFR {qq.cefr}</span><span style={{ ...S.badge, background:"#1e293b", color:"#64748b" }}>JLPT {qq.jlpt}</span></>}
                    <span style={{ ...S.badge, background:ok?"#22c55e22":"#ef444422", color:ok?"#22c55e":"#ef4444" }}>{ok?" Correct":" Incorrect"}</span>
                  </div>
                  <p style={{ color:"#e2e8f0", fontSize:14, margin:"0 0 4px" }}>{qq.text}</p>
                  {qq.textEn && <p style={{ color:"#64748b", fontSize:12, margin:"0 0 10px", fontStyle:"italic" }}>{qq.textEn}</p>}
                  <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                    {qq.options.map((opt,oi) => {
                      const isA=oi===qq.answer, isU=oi===ua;
                      const c=isA?"#22c55e":(isU&&!isA)?"#ef4444":"#475569";
                      return <div key={oi} style={{ display:"flex", gap:8, alignItems:"center" }}><span style={{ fontSize:12, color:c, minWidth:14 }}>{isA?"":isU?"":"·"}</span><span style={{ fontSize:13, color:c }}>{opt}</span>{isA&&<span style={{ fontSize:11, color:"#22c55e55" }}>← correct</span>}</div>;
                    })}
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"10px 12px", borderLeft:`3px solid ${cc}` }}>
                    <span style={{ color:"#94a3b8", fontSize:12 }}> {qq.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <CTABlock />
          <button onClick={restart} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},${COLOR}99)`, color:"#fff", cursor:"pointer", marginTop:16 }}>Try Again</button>
        </div>
      </div>
    );
  }
  return null;
}

const S = {
  page:{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px" },
  card:{ width:"100%", maxWidth:520, background:"rgba(255,255,255,0.03)", backdropFilter:"blur(16px)", borderRadius:22, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 24px", boxShadow:"0 24px 64px rgba(0,0,0,0.5)" },
  badge:{ padding:"3px 10px", borderRadius:10, fontSize:11, fontWeight:700 },
  qText:{ color:"#e2e8f0", fontSize:17, lineHeight:1.85, marginBottom:6, whiteSpace:"pre-line" },
  qTextEn:{ color:"#64748b", fontSize:13, lineHeight:1.7, marginBottom:18, fontStyle:"italic" },
  optBtn:{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:12, textAlign:"left", cursor:"pointer", fontSize:14, transition:"all 0.18s" },
  optLabel:{ minWidth:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 },
  btn:{ width:"100%", padding:"14px", border:"none", borderRadius:13, fontSize:15, fontWeight:800, transition:"all 0.2s" },
  label:{ display:"block", color:"#64748b", fontSize:12, fontWeight:700, marginBottom:6, letterSpacing:1 },
  input:{ width:"100%", padding:"13px 16px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#f1f5f9", fontSize:15, outline:"none", boxSizing:"border-box" },
};
