import { useState } from "react";

const CP = { A1:"#22c55e", A2:"#3b82f6", B1:"#f59e0b", B2:"#ef4444", C1:"#a855f7", C2:"#ec4899" };
const COLOR = "#0ea5e9";

const QUESTIONS = [
  {
    cefr:"A1", jlpt:"N5",
    text: "あなたは会社で初めて同僚に会いました。\n（　　　）、さかもとです。",
    textEn: "You are meeting a coworker for the first time at your company.",
    options: ["おつかれさまです", "はじめまして", "おじゃまします", "ただいま", "No Answer"],
    answer: 1,
    explanation: "「はじめまして」is the standard greeting when meeting someone for the first time. 「おつかれさまです」is used to acknowledge someone's hard work, not as a first-time greeting."
  },
  {
    cefr:"A2", jlpt:"N4",
    text: "取引先との会議に少し遅れそうです。\n最も適切なのは？",
    textEn: "You are going to be slightly late for a meeting with a client. Which response is the most appropriate?",
    options: ["会議に行きません。", "会議が嫌です。", "少々遅れる見込みです。", "会議を忘れました。", "No Answer"],
    answer: 2,
    explanation: "「少々遅れる見込みです」is the professional way to inform someone you will be slightly late. The other options are either rude or inappropriate in a business context."
  },
  {
    cefr:"B1", jlpt:"N3",
    text: "メールで使われる表現です。\n「ご都合はいかがでしょうか。」\n最も近い意味は？",
    textEn: "This expression is commonly used in business emails. What is the closest meaning?",
    options: ["気分はどうですか", "お元気ですか", "ご予定はいかがですか", "お仕事はどうですか", "No Answer"],
    answer: 2,
    explanation: "「ご都合はいかがでしょうか」literally asks about someone's convenience or availability. It is equivalent to 'How is your schedule?' or 'Are you available?'"
  },
  {
    cefr:"B2", jlpt:"N2",
    text: "会議で上司が言いました。\n「現状の案にもメリットはありますが、代替案についても検討する必要があります。」\n代替案とは？",
    textEn: "Your manager says during a meeting: 'The current proposal has its advantages, but we should also consider alternative proposals.' What does 'alternative proposal' mean?",
    options: ["同じ案", "別の案", "完成した案", "古い案", "No Answer"],
    answer: 1,
    explanation: "「代替案（だいたいあん）」means 'alternative proposal' — a different option to consider instead of the current one. 「代替」means substitution or replacement."
  },
  {
    cefr:"C1", jlpt:"N1",
    text: "次の文の意味として最も適切なものを選んでください。\n「本件につきましては再考の余地があると考えております。」",
    textEn: "Choose the most appropriate meaning: 'There may be room for reconsideration regarding this matter.'",
    options: ["完全に決定している", "もう変更できない", "もう一度考える可能性がある", "すぐに実施する", "No Answer"],
    answer: 2,
    explanation: "「再考の余地がある」means 'there is room for reconsideration.' This is a formal business expression indicating the matter is not yet finalized and may be revisited."
  },
  {
    cefr:"C2", jlpt:"N1+",
    text: "商談中、相手企業が言いました。\n「非常に興味深いご提案ですね。社内でも前向きに検討させていただきます。」\nこの発言の真意として最も適切なのは？",
    textEn: "During a business negotiation, the other company says: 'That is a very interesting proposal. We will give it positive consideration internally.' What is the most likely intended meaning?",
    options: ["契約が確定した", "必ず採用される", "丁寧に断っている可能性もある", "今日中に契約する", "No Answer"],
    answer: 2,
    explanation: "「前向きに検討します」sounds positive but is often used as a polite way to defer or even decline in Japanese business culture. It does not guarantee acceptance."
  },
];

const cefrData = {
  'Pre-A1': { jlpt:'Below N5', canDo:['Recognize basic hiragana and katakana','Understand a few common words'], problems:['Cannot hold any conversation in Japanese','Unable to read basic texts'], timeToN4:'Approximately 18–24 months', timeToN2:'Approximately 4–6 years' },
  'A1': { jlpt:'N5', canDo:['Introduce yourself in simple Japanese','Understand basic workplace greetings like おつかれさまです','Read hiragana and katakana'], problems:['Cannot handle real business conversations','Struggles with keigo (polite speech)'], timeToN4:'Approximately 12–18 months', timeToN2:'Approximately 3–5 years' },
  'A2': { jlpt:'N4', canDo:['Handle simple business interactions','Send basic business emails in Japanese','Apply to some Japanese university programs'], problems:['Business Japanese still very limited','Cannot participate in formal meetings'], timeToN4:'You are at N4! 🎉 Keep consolidating.', timeToN2:'Approximately 1–2 years' },
  'A2–B1': { jlpt:'N4–N3', canDo:['Communicate in everyday business situations','Understand most basic business emails','Express simple opinions in meetings'], problems:['Formal business writing still needs work','Nuanced business expressions are challenging'], timeToN4:'You are near N4! Keep going.', timeToN2:'Approximately 1–2 years' },
  'B1': { jlpt:'N3', canDo:['Handle most everyday business situations','Write clear business emails','Understand business meetings on familiar topics'], problems:['Advanced keigo and formal writing challenging','Cannot fully participate in complex negotiations'], timeToN4:'You have surpassed N4! 🎉', timeToN2:'Approximately 6–12 months' },
  'B1–B2': { jlpt:'N3–N2', canDo:['Communicate fluently in most business situations','Write professional business documents','Participate actively in meetings'], problems:['Highly specialized vocabulary still limited','Native-level nuance in negotiation takes more practice'], timeToN4:'You have surpassed N4! 🎉', timeToN2:'You are near N2! A few more months.' },
  'B2': { jlpt:'N2', canDo:['Apply to Japanese companies as bilingual candidate','Conduct business meetings in Japanese','Write formal reports and proposals'], problems:['C1-level nuance still requires work','Very formal or legal Japanese can be challenging'], timeToN4:'You have surpassed N4! 🎉', timeToN2:'You are at N2! 🎉 Aim for N1 next.' },
  'B2–C1': { jlpt:'N2–N1', canDo:['Work professionally in Japanese in most industries','Lead meetings and negotiations in Japanese','Write sophisticated business documents'], problems:['Native-level precision in formal writing needs refinement','Highly specialized fields may still be challenging'], timeToN4:'You have far surpassed N4! 🎉', timeToN2:'You are at or near N2! 🎉 Target N1.' },
  'C1': { jlpt:'N1', canDo:['Work at the highest level in any Japanese industry','Lead complex negotiations in Japanese','Read and write academic and legal documents'], problems:['Native-like precision takes continuous effort','Staying current with evolving business language'], timeToN4:'You have far surpassed N4! 🎉', timeToN2:'You have surpassed N2! 🎉 You are at N1.' },
  'C2': { jlpt:'N1+', canDo:['Operate at native-like level in all business contexts','Catch subtle implications in negotiations','Write flawless formal Japanese documents'], problems:['Maintaining and expanding specialized vocabulary','Regional business dialects may occasionally appear'], timeToN4:'You have far surpassed N4! 🎉', timeToN2:'You have surpassed N2! 🎉 Near-native level.' },
};

function getResult(score, total) {
  const p = score / total;
  if (p === 1)   return { level:"C2",    msg:"Near-native business Japanese! Outstanding." };
  if (p >= 0.83) return { level:"C1",    msg:"Advanced business Japanese. Highly professional!" };
  if (p >= 0.67) return { level:"B2",    msg:"Upper-intermediate. You can work in Japanese!" };
  if (p >= 0.5)  return { level:"B1",    msg:"Intermediate. Building solid business foundations." };
  if (p >= 0.33) return { level:"A2",    msg:"Elementary. Keep studying business expressions." };
  if (p > 0)     return { level:"A1",    msg:"Beginner. Start with basic business greetings." };
  return               { level:"Pre-A1", msg:"Just starting — every step counts!" };
}




function CTABlock() {
  const [ctaStep, setCtaStep] = useState(0);
  return (
    <div style={{marginTop:24,padding:'20px',background:'rgba(255,255,255,0.04)',borderRadius:16,border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
      {ctaStep===0&&(<><p style={{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}>Want to improve your Japanese?</p><div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}><button onClick={()=>setCtaStep(1)} style={{padding:'12px 24px',background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Yes</button><button onClick={()=>setCtaStep(3)} style={{padding:'12px 20px',background:'rgba(255,255,255,0.08)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,fontSize:13,cursor:'pointer'}}>No, I'm satisfied with my result</button></div></>)}
      {ctaStep===1&&(<><p style={{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}>Need a FREE Japanese Q&A session?</p><button onClick={()=>setCtaStep(2)} style={{padding:'12px 32px',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Yes</button></>)}
      {ctaStep===2&&(<><p style={{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}>Apply for your FREE Trial Lesson!</p><a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'14px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none'}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a></>)}
      {ctaStep===3&&(<p style={{color:'#64748b',fontSize:14,margin:0}}>Great! Keep up the good work! 🎌</p>)}
    </div>
  );
}

export default function BusinessSpeech() {
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

  function restart() {
    setPhase("quiz"); setQIndex(0); setSelected(null); setUserAnswers([]); setName(""); setEmail("");
  }

  if (phase === "quiz" && q) {
    const cc = CP[q.cefr] ?? COLOR;
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <span style={{ color:COLOR, fontWeight:800, fontSize:13 }}>💼 Practical Japanese — Business Speech</span>
            <span style={{ color:"#64748b", fontSize:13 }}>{qIndex+1} / {QUESTIONS.length}</span>
          </div>
          <div style={{ height:5, background:"#1e293b", borderRadius:4, marginBottom:22 }}>
            <div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${cc},${cc}99)`, width:`${((qIndex+1)/QUESTIONS.length)*100}%`, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
            <span style={{ ...S.badge, background:cc+"22", color:cc }}>CEFR {q.cefr}</span>
            <span style={{ ...S.badge, background:"#1e293b", color:"#64748b" }}>JLPT {q.jlpt}</span>
          </div>
          <p style={S.qText}>{q.text}</p>
          {q.textEn && <p style={S.qTextEn}>{q.textEn}</p>}
          <p style={S.hint}>💡 If you don't know the answer, click "No Answer".</p>
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
                  <span style={{ ...S.optLabel, background: sel?cc:"#1e293b", color: sel?"#fff":"#475569" }}>{["A","B","C","D","E"][i]}</span>
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
          <div style={{ fontSize:44, marginBottom:10 }}>🔒</div>
          <h2 style={{ color:"#f1f5f9", fontSize:21, fontWeight:900, margin:"0 0 8px" }}>Want to know your results?</h2>
          <p style={{ color:"#64748b", fontSize:13, margin:0, lineHeight:1.7 }}>Enter your name and email to unlock your score,<br/>correct answers, and CEFR level.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>
          <div><label style={S.label}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={S.input}/></div>
          <div><label style={S.label}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={S.input}/></div>
        </div>
        <button onClick={() => {
          if(name.trim()&&email.trim()){
            const r=getResult(score,QUESTIONS.length);
            fetch('https://formspree.io/f/mykvallk',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,section:'Business Speech',score:score+'/'+QUESTIONS.length,cefr:r.level})}).then(()=>setPhase('result'));
          }
        }} style={{
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
    const rc = CP[res.level] ?? COLOR;
    const info = cefrData[res.level] ?? cefrData['Pre-A1'];
    return (
      <div style={S.page}>
        <div style={{ ...S.card, maxWidth:580 }}>
          <div style={{ textAlign:"center", marginBottom:26 }}>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:4 }}>{name}'s Results — Business Speech</p>
            <div style={{ fontSize:48, fontWeight:900, background:`linear-gradient(135deg,${COLOR},${rc})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{res.level}</div>
            <p style={{ color:"#94a3b8", fontSize:14, marginTop:6, marginBottom:14 }}>{res.msg}</p>
            <div style={{ fontSize:30, fontWeight:900, color:"#f1f5f9" }}>{score} <span style={{ color:"#475569", fontSize:16 }}>/ {QUESTIONS.length} correct</span></div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"16px 18px", borderLeft:"3px solid #3b82f6" }}>
              <p style={{ color:"#3b82f6", fontSize:12, fontWeight:700, margin:"0 0 6px", letterSpacing:1 }}>📊 JLPT EQUIVALENT</p>
              <p style={{ color:"#f1f5f9", fontSize:18, fontWeight:800, margin:0 }}>{info.jlpt}</p>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"16px 18px", borderLeft:"3px solid #22c55e" }}>
              <p style={{ color:"#22c55e", fontSize:12, fontWeight:700, margin:"0 0 10px", letterSpacing:1 }}>✅ WHAT YOU CAN DO AT THIS LEVEL</p>
              {info.canDo.map((item,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"flex-start" }}>
                  <span style={{ color:"#22c55e", fontSize:12, marginTop:2 }}>•</span>
                  <span style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"16px 18px", borderLeft:"3px solid #ef4444" }}>
              <p style={{ color:"#ef4444", fontSize:12, fontWeight:700, margin:"0 0 10px", letterSpacing:1 }}>⚠️ CHALLENGES AT THIS LEVEL</p>
              {info.problems.map((item,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"flex-start" }}>
                  <span style={{ color:"#ef4444", fontSize:12, marginTop:2 }}>•</span>
                  <span style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"16px 18px", borderLeft:"3px solid #f59e0b" }}>
              <p style={{ color:"#f59e0b", fontSize:12, fontWeight:700, margin:"0 0 10px", letterSpacing:1 }}>⏱️ YOUR STUDY ROADMAP</p>
              <div style={{ marginBottom:8 }}>
                <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 2px" }}>To reach N4 / A2 (Japanese University entry):</p>
                <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:600, margin:0 }}>{info.timeToN4}</p>
              </div>
              <div>
                <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 2px" }}>To reach N2 / B2 (Japanese Company entry):</p>
                <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:600, margin:0 }}>{info.timeToN2}</p>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
            {QUESTIONS.map((qq, i) => {
              const ua = userAnswers[i]; const ok = ua === qq.answer;
              const cc = CP[qq.cefr] ?? COLOR;
              return (
                <div key={i} style={{ background:ok?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1.5px solid ${ok?"#22c55e33":"#ef444433"}`, borderRadius:14, padding:"16px 18px" }}>
                  <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                    <span style={{ ...S.badge, background:cc+"22", color:cc }}>CEFR {qq.cefr}</span>
                    <span style={{ ...S.badge, background:"#1e293b", color:"#64748b" }}>JLPT {qq.jlpt}</span>
                    <span style={{ ...S.badge, background:ok?"#22c55e22":"#ef444422", color:ok?"#22c55e":"#ef4444" }}>{ok?"✓ Correct":"✗ Incorrect"}</span>
                  </div>
                  <p style={{ color:"#e2e8f0", fontSize:14, margin:"0 0 4px", whiteSpace:"pre-line" }}>{qq.text}</p>
                  {qq.textEn && <p style={{ color:"#64748b", fontSize:12, margin:"0 0 10px", fontStyle:"italic" }}>{qq.textEn}</p>}
                  <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                    {qq.options.map((opt,oi) => {
                      const isA=oi===qq.answer, isU=oi===ua;
                      const c=isA?"#22c55e":(isU&&!isA)?"#ef4444":"#475569";
                      return <div key={oi} style={{ display:"flex", gap:8, alignItems:"center" }}><span style={{ fontSize:12, color:c, minWidth:14 }}>{isA?"✓":isU?"✗":"·"}</span><span style={{ fontSize:13, color:c }}>{opt}</span>{isA&&<span style={{ fontSize:11, color:"#22c55e55" }}>← correct</span>}</div>;
                    })}
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"10px 12px", borderLeft:`3px solid ${cc}` }}>
                    <span style={{ color:"#94a3b8", fontSize:12 }}>💡 {qq.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* CTA Section */}
          {(() => {
            const [ctaStep, setCtaStep] = useState(0);
            return (
              <div style={{marginTop:24, padding:'20px', background:'rgba(255,255,255,0.04)', borderRadius:16, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center'}}>
                {ctaStep === 0 && (
                  <>
                    <p style={{color:'#f1f5f9', fontSize:16, fontWeight:700, marginBottom:16}}>Want to improve your Japanese?</p>
                    <div style={{display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap'}}>
                      <button onClick={()=>setCtaStep(1)} style={{padding:'12px 24px', background:'linear-gradient(135deg,#22c55e,#16a34a)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer'}}>Yes</button>
                      <button onClick={()=>setCtaStep(3)} style={{padding:'12px 24px', background:'rgba(255,255,255,0.08)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:14, cursor:'pointer'}}>No, I'm satisfied with my result</button>
                    </div>
                  </>
                )}
                {ctaStep === 1 && (
                  <>
                    <p style={{color:'#f1f5f9', fontSize:16, fontWeight:700, marginBottom:16}}>Need a FREE Japanese Q&A session?</p>
                    <button onClick={()=>setCtaStep(2)} style={{padding:'12px 32px', background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer'}}>Yes</button>
                  </>
                )}
                {ctaStep === 2 && (
                  <>
                    <p style={{color:'#f1f5f9', fontSize:15, fontWeight:700, marginBottom:16}}>🎉 Apply for your FREE Trial Lesson!</p>
                    <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:'inline-block', padding:'14px 28px', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', borderRadius:12, fontSize:14, fontWeight:800, textDecoration:'none', letterSpacing:0.5}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a>
                  </>
                )}
                {ctaStep === 3 && (
                  <p style={{color:'#64748b', fontSize:14, margin:0}}>Great! Keep up the good work! 🎌</p>
                )}
              </div>
            );
          })()}
          <button onClick={restart} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},${COLOR}99)`, color:"#fff", cursor:"pointer", marginTop:16 }}>
          <CTABlock />
          <button onClick={restart} 🔄</button>
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
  qTextEn:{ color:"#64748b", fontSize:13, lineHeight:1.7, marginBottom:8, fontStyle:"italic" },
  hint:{ color:"#475569", fontSize:12, marginBottom:16, fontStyle:"italic" },
  optBtn:{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:12, textAlign:"left", cursor:"pointer", fontSize:14, transition:"all 0.18s" },
  optLabel:{ minWidth:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 },
  btn:{ width:"100%", padding:"14px", border:"none", borderRadius:13, fontSize:15, fontWeight:800, transition:"all 0.2s" },
  label:{ display:"block", color:"#64748b", fontSize:12, fontWeight:700, marginBottom:6, letterSpacing:1 },
  input:{ width:"100%", padding:"13px 16px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#f1f5f9", fontSize:15, outline:"none", boxSizing:"border-box" },
};
