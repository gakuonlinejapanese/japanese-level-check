const fs = require('fs');
const files = ['vocabulary','grammar','reading','business-speech','casual-speech'];
const cta = `
function CTABlock() {
  const [step, setStep] = useState(0);
  return (
    <div style={{marginTop:24,padding:'20px',background:'rgba(255,255,255,0.04)',borderRadius:16,border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
      {step===0&&(<><p style={{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}>Want to improve your Japanese?</p><div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}><button onClick={()=>setStep(1)} style={{padding:'12px 24px',background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Yes</button><button onClick={()=>setStep(3)} style={{padding:'12px 20px',background:'rgba(255,255,255,0.08)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,fontSize:13,cursor:'pointer'}}>No, I'm satisfied with my result</button></div></>)}
      {step===1&&(<><p style={{color:'#f1f5f9',fontSize:16,fontWeight:700,marginBottom:16}}>Need a FREE Japanese Q&A session?</p><button onClick={()=>setStep(2)} style={{padding:'12px 32px',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer'}}>Yes</button></>)}
      {step===2&&(<><p style={{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}>🎉 Apply for your FREE Trial Lesson!</p><a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'14px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',borderRadius:12,fontSize:14,fontWeight:800,textDecoration:'none'}}>Apply for FIRST Q&A SESSION (FREE TRIAL LESSON) !!!</a></>)}
      {step===3&&(<p style={{color:'#64748b',fontSize:14,margin:0}}>Great! Keep up the good work! 🎌</p>)}
    </div>
  );
}
`;
files.forEach(name=>{
  let c=fs.readFileSync('src/'+name+'.jsx','utf8');
  if(c.includes('CTABlock')) { console.log(name+' already has CTA, skipping'); return; }
  c=c.replace('export default function',cta+'\nexport default function');
  c=c.replace(
    '<button onClick={restart} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},${COLOR}99)`, color:"#fff", cursor:"pointer" }}>Try Again 🔄</button>',
    '<CTABlock />\n          <button onClick={restart} style={{ ...S.btn, background:`linear-gradient(135deg,${COLOR},${COLOR}99)`, color:"#fff", cursor:"pointer", marginTop:16 }}>Try Again 🔄</button>'
  );
  fs.writeFileSync('src/'+name+'.jsx',c);
  console.log(name+' done');
});
