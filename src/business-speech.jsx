import React, { useState } from 'react';
const CP = { A1:'#22c55e', A2:'#3b82f6', B1:'#f59e0b', B2:'#ef4444', C1:'#a855f7' };
const COLOR = '#0ea5e9';
const QUESTIONS = [
  { cefr:'A2', jlpt:'N4', text:'取引先との会議に少し遅れそうです。最も適切なのは？', options:['会議に行きません。','会議が嫌です。','少々遅れる見込みです。','会議を忘れました。', "Not Able To Answer"], answer:2, explanation:'少々遅れる見込みです is the professional way to say you will be slightly late.' },
  { cefr:'B1', jlpt:'N3', text:'メールで「ご都合はいかがでしょうか」の意味は？', options:['気分はどうですか','お元気ですか','ご予定はいかがですか','お仕事はどうですか', "Not Able To Answer"], answer:2, explanation:'ご都合はいかがでしょうか asks about availability or schedule.' },
  { cefr:'B1', jlpt:'N3', text:'上司に報告する時、最も丁寧な表現は？', options:['やっておきました','しました','対応いたしました','やりました', "Not Able To Answer"], answer:2, explanation:'対応いたしました uses humble form いたす making it most formal.' },
  { cefr:'B2', jlpt:'N2', text:'「お手数ですが」の意味は？', options:['Sorry to trouble you, but...','Thank you very much','Please wait','I understand', "Not Able To Answer"], answer:0, explanation:'お手数ですが means Sorry to trouble you or I know this is inconvenient, but.' },
  { cefr:'C1', jlpt:'N1', text:'「ご査収ください」の意味は？', options:['Please check and keep this','Please hurry','Please reply','Please delete', "Not Able To Answer"], answer:0, explanation:'ご査収ください is formal business Japanese meaning Please receive and check this.' },
];
function getResult(score, total) {
  const p = score / total;
  if (p === 1) return { level:'C1', msg:'Outstanding! Near-native business Japanese.' };
  if (p >= 0.8) return { level:'B2', msg:'Advanced business communication!' };
  if (p >= 0.6) return { level:'B1', msg:'Good grasp of business expressions.' };
  return { level:'A2', msg:'Keep practicing business Japanese.' };
}
function CTABlock() {
  const [ctaStep, setCtaStep] = useState(0);
  return (
    React.createElement('div', {style:{marginTop:24,padding:'20px',background:'rgba(255,255,255,0.04)',borderRadius:16,border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}},
      ctaStep===0 && React.createElement(React.Fragment, null,
        React.createElement('p', {style:{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}, 'Want to improve your Japanese?'),
        React.createElement('div', {style:{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}},
          React.createElement('button', {onClick:()=>setCtaStep(1),style:{padding:'12px 24px',background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}, 'Yes'),
          React.createElement('button', {onClick:()=>setCtaStep(3),style:{padding:'12px 20px',background:'rgba(255,255,255,0.08)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,fontSize:13,cursor:'pointer'}}, 'No, I am satisfied with my result')
        )
      ),
      ctaStep===1 && React.createElement(React.Fragment, null,
        React.createElement('p', {style:{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}, 'Need a FREE Japanese Q&A session?'),
        React.createElement('button', {onClick:()=>setCtaStep(2),style:{padding:'12px 32px',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}, 'Yes')
      ),
      ctaStep===2 && React.createElement(React.Fragment, null,
        React.createElement('p', {style:{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}, 'Apply for your FREE Trial Lesson!'),
        React.createElement('a', {href:'https://www.seitojapanese.online/',target:'_blank',rel:'noopener noreferrer',style:{display:'inline-block',padding:'14px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none'}}, 'Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) cp /tmp/new_business.jsx ~/Desktop/japanese-level-check/src/business-speech.jsx && echo OK && cd ~/Desktop/japanese-level-check && npm run build 2>&1 | tail -10!')
      ),
      ctaStep===3 && React.createElement('p', {style:{color:'#64748b',fontSize:14,margin:0}}, 'Great! Keep up the good work!')
    )
  );
}
export default function BusinessSpeech() {
  const [phase, setPhase] = useState('quiz');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const q = QUESTIONS[qIndex];
  const score = userAnswers.filter((a,i) => a === QUESTIONS[i]?.answer).length;
  function handleNext() {
    if (selected === null) return;
    const updated = [...userAnswers, selected];
    setUserAnswers(updated);
    if (qIndex + 1 < QUESTIONS.length) { setQIndex(qIndex+1); setSelected(null); }
    else setPhase('gate');
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
  function restart() { setPhase('quiz'); setQIndex(0); setSelected(null); setUserAnswers([]); setName(''); setEmail(''); }
  if (phase === 'quiz' && q) {
    const cc = CP[q.cefr] ?? COLOR;
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px',fontFamily:"'Noto Sans JP',sans-serif"}}>
        <div style={{width:'100%',maxWidth:520,background:'rgba(255,255,255,0.03)',backdropFilter:'blur(16px)',borderRadius:22,border:'1px solid rgba(255,255,255,0.07)',padding:'28px 24px',boxShadow:'0 24px 64px rgba(0,0,0,0.5)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <span style={{color:COLOR,fontWeight:800,fontSize:14}}>Business Speech</span>
            <span style={{color:'#64748b',fontSize:13}}>{qIndex+1} / {QUESTIONS.length}</span>
          </div>
          <p style={{color:'#e2e8f0',fontSize:17,lineHeight:1.85,marginBottom:6,whiteSpace:'pre-line'}}>{q.text}</p>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:22}}>
            {q.options.map((opt,i) => {
              const sel = selected===i;
              return <button key={i} onClick={()=>setSelected(i)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:12,textAlign:'left',cursor:'pointer',fontSize:14,transition:'all 0.18s',background:sel?cc+'22':'rgba(255,255,255,0.04)',border:'1.5px solid '+(sel?cc:'rgba(255,255,255,0.08)'),color:sel?'#f1f5f9':'#94a3b8'}}>
                <span style={{minWidth:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,background:sel?cc:'#1e293b',color:sel?'#fff':'#475569'}}>{['A','B','C','D'][i]}</span>{opt}
              </button>;
            })}
          </div>
          <button onClick={handleNext} disabled={selected===null} style={{width:'100%',padding:'14px',border:'none',borderRadius:13,fontSize:15,fontWeight:800,transition:'all 0.2s',background:selected!==null?'linear-gradient(135deg,'+cc+','+cc+'99)':'#1e293b',color:selected!==null?'#fff':'#475569',cursor:selected!==null?'pointer':'default'}}>
            {qIndex+1===QUESTIONS.length?'See Results →':'Next →'}
          </button>
        </div>
      </div>
    );
  }
  if (phase === 'gate') return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px',fontFamily:"'Noto Sans JP',sans-serif"}}>
      <div style={{width:'100%',maxWidth:520,background:'rgba(255,255,255,0.03)',backdropFilter:'blur(16px)',borderRadius:22,border:'1px solid rgba(255,255,255,0.07)',padding:'28px 24px',boxShadow:'0 24px 64px rgba(0,0,0,0.5)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <h2 style={{color:'#f1f5f9',fontSize:21,fontWeight:900,margin:'0 0 8px'}}>Want to know your results?</h2>
          <p style={{color:'#64748b',fontSize:13,margin:0}}>Enter your name and email to unlock your score.</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:22}}>
          <div><label style={{display:'block',color:'#64748b',fontSize:12,fontWeight:700,marginBottom:6}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder='Your name' style={{width:'100%',padding:'13px 16px',background:'rgba(255,255,255,0.05)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#f1f5f9',fontSize:15,outline:'none',boxSizing:'border-box'}}/></div>
          <div><label style={{display:'block',color:'#64748b',fontSize:12,fontWeight:700,marginBottom:6}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='your@email.com' type='email' style={{width:'100%',padding:'13px 16px',background:'rgba(255,255,255,0.05)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#f1f5f9',fontSize:15,outline:'none',boxSizing:'border-box'}}/></div>
        </div>
        <button onClick={()=>{if(name.trim()&&email.trim())setPhase('result');}} style={{width:'100%',padding:'14px',border:'none',borderRadius:13,fontSize:15,fontWeight:800,background:name.trim()&&email.trim()?'linear-gradient(135deg,'+COLOR+','+COLOR+'99)':'#1e293b',color:name.trim()&&email.trim()?'#fff':'#475569',cursor:name.trim()&&email.trim()?'pointer':'default'}}>Unlock My Results</button>
      </div>
    </div>
  );
  if (phase === 'result') {
    const res = getResult(score, QUESTIONS.length);
    const rc = CP[res.level] ?? COLOR;
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 16px',fontFamily:"'Noto Sans JP',sans-serif"}}>
        <div style={{width:'100%',maxWidth:580,background:'rgba(255,255,255,0.03)',backdropFilter:'blur(16px)',borderRadius:22,border:'1px solid rgba(255,255,255,0.07)',padding:'28px 24px',boxShadow:'0 24px 64px rgba(0,0,0,0.5)'}}>
          <div style={{textAlign:'center',marginBottom:26}}>
            <p style={{color:'#64748b',fontSize:13,marginBottom:4}}>{name}s Results - Business Speech</p>
            <div style={{fontSize:48,fontWeight:900,background:'linear-gradient(135deg,'+COLOR+','+rc+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{res.level}</div>
            <p style={{color:'#94a3b8',fontSize:14,marginTop:6,marginBottom:14}}>{res.msg}</p>
            <div style={{fontSize:30,fontWeight:900,color:'#f1f5f9'}}>{score} <span style={{color:'#475569',fontSize:16}}>/ {QUESTIONS.length} correct</span></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
            {QUESTIONS.map((qq,i) => {
              const ua=userAnswers[i]; const ok=ua===qq.answer; const cc=CP[qq.cefr]??COLOR;
              return <div key={i} style={{background:ok?'rgba(34,197,94,0.06)':'rgba(239,68,68,0.06)',border:'1.5px solid '+(ok?'#22c55e33':'#ef444433'),borderRadius:14,padding:'16px 18px'}}>
                <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                  <span style={{padding:'3px 10px',borderRadius:10,fontSize:11,fontWeight:700,background:cc+'22',color:cc}}>CEFR {qq.cefr}</span>
                  <span style={{padding:'3px 10px',borderRadius:10,fontSize:11,fontWeight:700,background:ok?'#22c55e22':'#ef444422',color:ok?'#22c55e':'#ef4444'}}>{ok?'Correct':'Incorrect'}</span>
                </div>
                <p style={{color:'#e2e8f0',fontSize:14,margin:'0 0 4px',whiteSpace:'pre-line'}}>{qq.text}</p>
                <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'10px 12px',borderLeft:'3px solid '+cc}}>
                  <span style={{color:'#94a3b8',fontSize:12}}>{qq.explanation}</span>
                </div>
              </div>;
            })}
          </div>
          <CTABlock />
          <button onClick={restart} style={{width:'100%',padding:'14px',border:'none',borderRadius:13,fontSize:15,fontWeight:800,background:'linear-gradient(135deg,'+COLOR+','+COLOR+'99)',color:'#fff',cursor:'pointer',marginTop:16}}>Try Again</button>
        </div>
      </div>
    );
  }
  return null;
}