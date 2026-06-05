import React, { useState } from "react";

const CP = { A1:"#22c55e", A2:"#3b82f6", B1:"#f59e0b", B2:"#ef4444", C1:"#a855f7", C2:"#ec4899" };
const COLOR = "#0ea5e9";

const QUESTIONS = [
  {
    cefr:"A1", jlpt:"N5",
    text:"あなたは会社で初めて同僚に会いました。\n（　　　）、さかもとです。",
    textEn:"You are meeting a coworker for the first time at your company.\n(      ), I'm Sakamoto.",
    options:["おつかれさまです","はじめまして","おじゃまします","ただいま","Not Able to Answer"],
    answer:1,
    explanation:"はじめまして (Hajimemashite) is the standard greeting when meeting someone for the first time. It means 'Nice to meet you.'"
  },
  {
    cefr:"A2", jlpt:"N4",
    text:"取引先との会議に少し遅れそうです。\n最も適切な言い方はどれですか？",
    textEn:"You are going to be slightly late for a meeting with a client.\nWhich response is the most appropriate?",
    options:["会議に行きません。","会議が嫌です。","少々遅れる見込みです。","会議を忘れました。","Not Able to Answer"],
    answer:2,
    explanation:"少々遅れる見込みです is the professional way to say you will be slightly late. The other options are rude or inappropriate."
  },
  {
    cefr:"B1", jlpt:"N3",
    text:"メールで使われる表現です。\n「ご都合はいかがでしょうか。」\n最も近い意味はどれですか？",
    textEn:"This expression is commonly used in business emails.\n\"ご都合はいかがでしょうか。\"\nWhat is the closest meaning?",
    options:["気分はどうですか","お元気ですか","ご予定はいかがですか","お仕事はどうですか","Not Able to Answer"],
    answer:2,
    explanation:"ご都合はいかがでしょうか asks about availability or schedule — equivalent to 'How is your schedule?' or 'Are you available?'"
  },
  {
    cefr:"B2", jlpt:"N2",
    text:"会議で上司が言いました。\n「現状の案にもメリットはありますが、代替案についても検討する必要があります。」\n代替案とはどういう意味ですか？",
    textEn:"Your manager says during a meeting:\n\"The current proposal has its advantages, but we should also consider alternative proposals.\"\nWhat does 代替案 (alternative proposal) mean?",
    options:["同じ案","別の案","完成した案","古い案","Not Able to Answer"],
    answer:1,
    explanation:"代替案 (daitaian) means 'alternative proposal' or 'substitute plan' — a different option from the current one."
  },
  {
    cefr:"C1", jlpt:"N1",
    text:"次の文の意味として最も適切なものを選んでください。\n「本件につきましては再考の余地があると考えております。」",
    textEn:"Choose the most appropriate meaning of the following statement.\n\"There may be room for reconsideration regarding this matter.\"",
    options:["完全に決定している","もう変更できない","もう一度考える可能性がある","すぐに実施する","Not Able to Answer"],
    answer:2,
    explanation:"再考の余地がある means 'there is room for reconsideration' — indicating the matter is not final and may be reconsidered."
  },
  {
    cefr:"C2", jlpt:"N1",
    text:"商談中、相手企業が言いました。\n「非常に興味深いご提案ですね。社内でも前向きに検討させていただきます。」\nこの発言の真意として最も適切なのはどれですか？",
    textEn:"During a business negotiation, the other company says:\n\"That is a very interesting proposal. We will give it positive consideration internally.\"\nWhat is the most likely intended meaning?",
    options:["契約が確定した","必ず採用される","丁寧に断っている可能性もある","今日中に契約する","Not Able to Answer"],
    answer:2,
    explanation:"前向きに検討します can mean genuine interest OR a polite decline. In Japanese business culture, never assume it means confirmed acceptance."
  },
];

function getResult(score, total) {
  const p = score / total;
  if (p === 1)   return { level:"C2", msg:"Outstanding! Near-native business Japanese." };
  if (p >= 0.83) return { level:"C1", msg:"Advanced business communication skills!" };
  if (p >= 0.67) return { level:"B2", msg:"Upper-intermediate business Japanese." };
  if (p >= 0.5)  return { level:"B1", msg:"Good grasp of business expressions." };
  if (p >= 0.33) return { level:"A2", msg:"Keep practicing business Japanese." };
  return               { level:"A1", msg:"Start with everyday business phrases." };
}

async function submitToFormspree(nameVal, emailVal) {
  try {
    await fetch("https://formspree.io/f/mykvallk", {
      method: "POST",
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      body: JSON.stringify({name: nameVal, email: emailVal, section: "Business Speech"})
    });
  } catch(e) {}
}

function CTABlock() {
  const [ctaStep, setCtaStep] = useState(0);
  return (
    <div style={{marginTop:24,padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:16,border:"1px solid rgba(255,255,255,0.08)",textAlign:"center"}}>
      {ctaStep===0&&(<><p style={{color:"#f1f5f9",fontSize:16,fontWeight:700,marginBottom:16}}>Want to improve your Japanese?</p><div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button onClick={()=>setCtaStep(1)} style={{padding:"12px 24px",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>Yes</button><button onClick={()=>setCtaStep(3)} style={{padding:"12px 20px",background:"rgba(255,255,255,0.08)",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,fontSize:13,cursor:"pointer"}}>No, I am satisfied with my results</button></div></>)}
      {ctaStep===1&&(<><p style={{color:"#f1f5f9",fontSize:16,fontWeight:700,marginBottom:16}}>Need a FREE Japanese Q&A session?</p><button onClick={()=>setCtaStep(2)} style={{padding:"12px 32px",background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>Yes</button></>)}
      {ctaStep===2&&(<><p style={{color:"#f1f5f9",fontSize:15,fontWeight:700,marginBottom:16}}>Apply for your FREE Trial Lesson!</p><a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"14px 24px",background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",borderRadius:12,fontSize:14,fontWeight:800,textDecoration:"none"}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a></>)}
      {ctaStep===3&&(<p style={{color:"#64748b",fontSize:14,margin:0}}>Great! Keep up the good work!</p>)}
    </div>
  );
}

export default function BusinessSpeech() {
  const [phase, setPhase] = useState("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const q = QUESTIONS[qIndex];
  const score = userAnswers.filter((a,i) => a === QUESTIONS[i]?.answer).length;

  function handleNext() {
    if (selected === null) return;
    const updated = [...userAnswers, selected];
    setUserAnswers(updated);
    if (qIndex + 1 < QUESTIONS.length) { setQIndex(qIndex+1); setSelected(null); }
    else setPhase("gate");
  }
  function restart() { setPhase("quiz"); setQIndex(0); setSelected(null); setUserAnswers([]); setName(""); setEmail(""); }

  if (phase === "quiz" && q) {
    const cc = CP[q.cefr] ?? COLOR;
    return (
      <div style={S.page}><div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span style={{color:COLOR,fontWeight:800,fontSize:14}}>ビジネス日本語 CEFR診断</span>
          <span style={{color:"#64748b",fontSize:13}}>{qIndex+1} / {QUESTIONS.length}</span>
        </div>
        <div style={{height:5,background:"#1e293b",borderRadius:4,marginBottom:22}}>
          <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${cc},${cc}99)`,width:`${((qIndex+1)/QUESTIONS.length)*100}%`,transition:"width 0.4s"}} />
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <span style={{...S.badge,background:cc+"22",color:cc}}>CEFR {q.cefr}</span>
          <span style={{...S.badge,background:"#1e293b",color:"#64748b"}}>JLPT {q.jlpt}</span>
        </div>
        <p style={{color:"#94a3b8",fontSize:13,marginBottom:4}}>If you cannot answer, click "Not Able to Answer"</p>
        <p style={S.qText}>{q.text}</p>
        {q.textEn && <p style={S.qTextEn}>{q.textEn}</p>}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {q.options.map((opt,i) => {
            const sel = selected===i;
            const isNo = opt === "Not Able to Answer";
            return <button key={i} onClick={()=>setSelected(i)} style={{...S.optBtn,background:sel?(isNo?"#47556922":cc+"22"):"rgba(255,255,255,0.04)",border:`1.5px solid ${sel?(isNo?"#475569":cc):"rgba(255,255,255,0.08)"}`,color:sel?"#f1f5f9":"#94a3b8"}}>
              <span style={{...S.optLabel,background:sel?(isNo?"#475569":cc):"#1e293b",color:sel?"#fff":"#475569"}}>{["A","B","C","D","E"][i]}</span>
              <span style={{fontStyle:isNo?"italic":"normal"}}>{opt}</span>
            </button>;
          })}
        </div>
        <button onClick={handleNext} disabled={selected===null} style={{...S.btn,background:selected!==null?`linear-gradient(135deg,${cc},${cc}99)`:"#1e293b",color:selected!==null?"#fff":"#475569",cursor:selected!==null?"pointer":"default"}}>
          {qIndex+1===QUESTIONS.length?"See Results →":"Next →"}
        </button>
      </div></div>
    );
  }

  if (phase === "gate") return (
    <div style={S.page}><div style={S.card}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:44,marginBottom:10}}>🔒</div>
        <h2 style={{color:"#f1f5f9",fontSize:21,fontWeight:900,margin:"0 0 8px"}}>Want to know your results?</h2>
        <p style={{color:"#64748b",fontSize:13,margin:0,lineHeight:1.7}}>Enter your name and email to unlock your score,<br/>correct answers, and CEFR level.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:22}}>
        <div>
          <label style={S.label}>Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={S.input}/>
        </div>
        <div>
          <label style={S.label}>Email *</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={S.input}/>
        </div>
      </div>
      {(!name.trim()||!email.trim())&&<p style={{color:"#ef4444",fontSize:12,textAlign:"center",marginBottom:10}}>※ Name and Email are required.</p>}
      <button
        onClick={()=>{if(name.trim()&&email.trim()){submitToFormspree(name,email);setPhase("result");}}}
        disabled={!name.trim()||!email.trim()}
        style={{...S.btn,background:name.trim()&&email.trim()?`linear-gradient(135deg,${COLOR},${COLOR}99)`:"#1e293b",color:name.trim()&&email.trim()?"#fff":"#475569",cursor:name.trim()&&email.trim()?"pointer":"not-allowed"}}
      >
        Unlock My Results
      </button>
    </div></div>
  );

  if (phase === "result") {
    const res = getResult(score, QUESTIONS.length);
    const rc = CP[res.level] ?? COLOR;
    return (
      <div style={S.page}><div style={{...S.card,maxWidth:580}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <p style={{color:"#64748b",fontSize:13,marginBottom:4}}>{name}'s Results — ビジネス日本語 CEFR診断</p>
          <div style={{fontSize:48,fontWeight:900,background:`linear-gradient(135deg,${COLOR},${rc})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{res.level}</div>
          <p style={{color:"#94a3b8",fontSize:14,marginTop:6,marginBottom:14}}>{res.msg}</p>
          <div style={{fontSize:30,fontWeight:900,color:"#f1f5f9"}}>{score} <span style={{color:"#475569",fontSize:16}}>/ {QUESTIONS.length} correct</span></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
          {QUESTIONS.map((qq,i) => {
            const ua=userAnswers[i]; const ok=ua===qq.answer; const cc=CP[qq.cefr]??COLOR;
            return <div key={i} style={{background:ok?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1.5px solid ${ok?"#22c55e33":"#ef444433"}`,borderRadius:14,padding:"16px 18px"}}>
              <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{...S.badge,background:cc+"22",color:cc}}>CEFR {qq.cefr}</span>
                <span style={{...S.badge,background:ok?"#22c55e22":"#ef444422",color:ok?"#22c55e":"#ef4444"}}>{ok?"Correct":"Incorrect"}</span>
              </div>
              <p style={{color:"#e2e8f0",fontSize:14,margin:"0 0 4px",whiteSpace:"pre-line"}}>{qq.text}</p>
              {qq.textEn && <p style={{color:"#64748b",fontSize:12,margin:"0 0 10px",fontStyle:"italic",whiteSpace:"pre-line"}}>{qq.textEn}</p>}
              <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
                {qq.options.map((opt,oi) => {
                  const isA=oi===qq.answer, isU=oi===ua;
                  const c=isA?"#22c55e":(isU&&!isA)?"#ef4444":"#475569";
                  return <div key={oi} style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:c,minWidth:14}}>{isA?"✓":isU?"✗":"·"}</span><span style={{fontSize:13,color:c}}>{["A","B","C","D","E"][oi]}. {opt}</span>{isA&&<span style={{fontSize:11,color:"#22c55e55"}}>← correct</span>}</div>;
                })}
              </div>
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${cc}`}}>
                <span style={{color:"#94a3b8",fontSize:12}}>{qq.explanation}</span>
              </div>
            </div>;
          })}
        </div>
        <CTABlock />
        <button onClick={restart} style={{...S.btn,background:`linear-gradient(135deg,${COLOR},${COLOR}99)`,color:"#fff",cursor:"pointer",marginTop:16}}>Try Again</button>
      </div></div>
    );
  }
  return null;
}

const S = {
  page:{minHeight:"100vh",background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)",fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"},
  card:{width:"100%",maxWidth:520,background:"rgba(255,255,255,0.03)",backdropFilter:"blur(16px)",borderRadius:22,border:"1px solid rgba(255,255,255,0.07)",padding:"28px 24px",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"},
  badge:{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700},
  qText:{color:"#e2e8f0",fontSize:16,lineHeight:1.9,marginBottom:6,whiteSpace:"pre-line"},
  qTextEn:{color:"#64748b",fontSize:13,lineHeight:1.7,marginBottom:16,fontStyle:"italic",whiteSpace:"pre-line"},
  optBtn:{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:12,textAlign:"left",cursor:"pointer",fontSize:14,transition:"all 0.18s"},
  optLabel:{minWidth:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800},
  btn:{width:"100%",padding:"14px",border:"none",borderRadius:13,fontSize:15,fontWeight:800,transition:"all 0.2s"},
  label:{display:"block",color:"#64748b",fontSize:12,fontWeight:700,marginBottom:6,letterSpacing:1},
  input:{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#f1f5f9",fontSize:15,outline:"none",boxSizing:"border-box"},
};
