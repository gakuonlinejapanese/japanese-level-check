import { useState } from 'react';
import Vocabulary from './vocabulary';
import Grammar from './grammar';
import Reading from './reading';
import BusinessSpeech from './business-speech';
import CasualSpeech from './casual-speech';
import SelfStudy from './self-study';
import GakuApp from './GakuApp';

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

function BrandFooter() {
  return (
    <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{ position:'fixed', bottom:10, left:10, zIndex:999, display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4, opacity:0.85, textDecoration:'none' }}>
      <img src="/gaku-logo.png" alt="GAKU logo" style={{ width:32, height:32, borderRadius:'50%' }} />
      <span style={{ color:'#94a3b8', fontSize:9, lineHeight:1.3, fontFamily:"'Noto Sans JP',sans-serif", maxWidth:280 }}>
        Presented by Seito Sakamoto, an Online Japanese Tutor GAKU, a master's degree in teaching international languages.
      </span>
    </a>
  );
}

export default function App() {
  const [current, setCurrent] = useState(window.location.pathname === '/app' ? 'gaku-app' : null);
  const goSelfStudy = (section, level) => setCurrent(`self-study|${section}|${level}`);
  window.__ss = (level) => goSelfStudy(current || 'general', level);

  if (current === 'gaku-app') return <div><GakuApp onBack={() => setCurrent(null)} /><BrandFooter /></div>;

  if (!current) return <><Home onSelect={setCurrent} /><BrandFooter /></>;

  const isSelfStudy = current.startsWith('self-study|');

  return (
    <div>
      <button onClick={() => setCurrent(null)} style={{ position:'fixed', top:16, left:16, zIndex:999, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, color:'#94a3b8', fontSize:13, fontWeight:700, padding:'8px 16px', cursor:'pointer' }}>
        ← Home
      </button>
      {current === 'vocabulary'  && <Vocabulary onSelfStudy={(level) => goSelfStudy('vocabulary', level)} />}
      {current === 'grammar'     && <Grammar onSelfStudy={(level) => goSelfStudy('grammar', level)} />}
      {current === 'reading'     && <Reading onSelfStudy={(level) => goSelfStudy('reading', level)} />}
      {current === 'business'    && <BusinessSpeech onSelfStudy={(level) => goSelfStudy('business', level)} />}
      {current === 'casual'      && <CasualSpeech onSelfStudy={(level) => goSelfStudy('casual', level)} />}
      {isSelfStudy && <SelfStudy cefrLevel={current.split('|')[2]} section={current.split('|')[1]} />}
      <BrandFooter />
    </div>
  );
}
