import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Vocabulary from './vocabulary';
import Grammar from './grammar';
import Reading from './reading';
import BusinessSpeech from './business-speech';
import CasualSpeech from './casual-speech';

function Home() {
  const sections = [
    { to:'/vocabulary', icon:'📖', label:'Vocabulary', sub:'語彙・単語', color:'#06b6d4' },
    { to:'/grammar', icon:'✏️', label:'Grammar', sub:'文法', color:'#8b5cf6' },
    { to:'/reading', icon:'📄', label:'Reading', sub:'読解', color:'#10b981' },
    { to:'/business', icon:'💼', label:'Business Speech', sub:'ビジネス日本語', color:'#0ea5e9' },
    { to:'/casual', icon:'😊', label:'Casual Speech', sub:'カジュアル日本語', color:'#f97316' },
  ];
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Noto Sans JP',sans-serif", padding:'24px 16px' }}>
      <p style={{ color:'#3b82f6', fontSize:12, fontWeight:700, letterSpacing:3, marginBottom:8 }}>CEFR A1 → C2</p>
      <h1 style={{ color:'#f1f5f9', fontSize:42, fontWeight:900, margin:'0 0 10px', textAlign:'center' }}>Japanese Level Check</h1>
      <p style={{ color:'#64748b', fontSize:14, marginBottom:32 }}>Select a section to start</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, width:'100%', maxWidth:520 }}>
        {sections.map(s => (
          <Link key={s.to} to={s.to} style={{ background:'rgba(255,255,255,0.03)', border:`1.5px solid ${s.color}55`, borderRadius:18, padding:'22px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, textDecoration:'none' }}>
            <span style={{ fontSize:32 }}>{s.icon}</span>
            <span style={{ color:s.color, fontWeight:800, fontSize:14, textAlign:'center' }}>{s.label}</span>
            <span style={{ color:'#64748b', fontSize:12 }}>{s.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/business" element={<BusinessSpeech />} />
        <Route path="/casual" element={<CasualSpeech />} />
      </Routes>
    </Router>
  );
}
