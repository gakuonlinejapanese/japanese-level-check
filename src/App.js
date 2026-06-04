import { useState } from 'react';
import Vocabulary from './vocabulary';
import Grammar from './grammar';
import Reading from './reading';
import BusinessSpeech from './business-speech';
import CasualSpeech from './casual-speech';

const sections = [
  { id:'vocabulary',  icon:'📖', label:'Vocabulary',      sub:'語彙・単語',       color:'#06b6d4' },
  { id:'grammar',     icon:'✏️',  label:'Grammar',         sub:'文法',             color:'#8b5cf6' },
  { id:'reading',     icon:'📄', label:'Reading',         sub:'読解',             color:'#10b981' },
  { id:'business',    icon:'💼', label:'Business Speech', sub:'ビジネス日本語',   color:'#0ea5e9' },
  { id:'casual',      icon:'😊', label:'Casual Speech',   sub:'カジュアル日本語', color:'#f97316' },
];

function Home({ onSelect }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Noto Sans JP',sans-serif", padding:'24px 16px' }}>
      <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:3, marginBottom:8 }}>CEFR A1 → C2</p>
      <h1 style={{ color:'#f1f5f9', fontSize:42, fontWeight:900, margin:'0 0 10px', textAlign:'center' }}>Japanese Level Check</h1>
      <p style={{ color:'#64748b', fontSize:14, marginBottom:32 }}>Select a section to start</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, width:'100%', maxWidth:520 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)} style={{ background:'rgba(255,255,255,0.03)', border:`1.5px solid ${s.color}55`, borderRadius:18, padding:'22px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer' }}>
            <span style={{ fontSize:32 }}>{s.icon}</span>
            <span style={{ color:s.color, fontWeight:800, fontSize:14, textAlign:'center' }}>{s.label}</span>
            <span style={{ color:'#64748b', fontSize:12 }}>{s.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState(null);
  if (!current) return <Home onSelect={setCurrent} />;
  return (
    <div>
      <button onClick={() => setCurrent(null)} style={{ position:'fixed', top:16, left:16, zIndex:999, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#94a3b8', fontSize:13, fontWeight:700, padding:'8px 16px', cursor:'pointer' }}>
        ← Home
      </button>
      {current === 'vocabulary'  && <Vocabulary />}
      {current === 'grammar'     && <Grammar />}
      {current === 'reading'     && <Reading />}
      {current === 'business'    && <BusinessSpeech />}
      {current === 'casual'      && <CasualSpeech />}
    </div>
  );
}
