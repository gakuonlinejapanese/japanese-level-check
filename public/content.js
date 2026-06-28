let popup=null,L="English";
function rm(){if(popup){popup.remove();popup=null;}}
document.addEventListener("keydown",e=>{if(e.key==="Escape")rm();});
document.addEventListener("mousedown",e=>{if(popup&&!popup.contains(e.target))rm();});
chrome.storage.sync.get(["popupLang","groqApiKey","annotationEnabled"],r=>{L=r.popupLang||"English";if(r.annotationEnabled!==false)addFurigana();});
function lbl(k){const lc=L==="Japanese"?"ja":L==="Korean"?"ko":(L.includes("Chinese"))?"zh":"en";const M={translate:{ja:"翻訳",ko:"번역",zh:"翻译",en:"Translate"},pronounce:{ja:"発音",ko:"발음",zh:"发音",en:"Pronounce"},image:{ja:"画像",ko:"이미지",zh:"图片",en:"Image"},save:{ja:"単語帳＋",ko:"단어장＋",zh:"生词本＋",en:"Save＋"},looking:{ja:"検索中...",ko:"검색 중...",zh:"查询中...",en:"Looking up..."},spoken:{ja:"読み上げ完了",ko:"발음 완료",zh:"已朗读",en:"Spoken"},saved:{ja:"保存しました！",ko:"저장됨！",zh:"已保存！",en:"Saved!"},noKey:{ja:"APIキーを設定してください",ko:"API 키를 설정해주세요",zh:"请设置API密钥",en:"Please set your Groq API key"},failed:{ja:"取得失敗",ko:"조회 실패",zh:"查询失败",en:"Lookup failed. Try Weblio:"},imgLoading:{ja:"画像を検索中...",ko:"이미지 검색 중...",zh:"搜索图片中...",en:"Searching images..."},imgNext:{ja:"次の画像 →",ko:"다음 이미지 →",zh:"下一张 →",en:"Next image →"},imgSave:{ja:"💾 保存",ko:"💾 저장",zh:"💾 保存",en:"💾 Save"},imgNone:{ja:"画像が見つかりませんでした",ko:"이미지를 찾을 수 없습니다",zh:"未找到图片",en:"No images found"},chooseFolder:{ja:"フォルダを選択",ko:"폴더 선택",zh:"选择文件夹",en:"Choose folder"},addToVocab:{ja:"単語帳に追加",ko:"단어장에 추가",zh:"添加到词汇表",en:"Add to Vocabulary"},newFolder:{ja:"新フォルダ名",ko:"새 폴더 이름",zh:"新文件夹名称",en:"New folder name"},cancel:{ja:"キャンセル",ko:"취소",zh:"取消",en:"Cancel"}};return M[k]?.[lc]||M[k]?.en||k;}

async function groq(word){
  const r=await new Promise(res=>chrome.storage.sync.get(["groqApiKey","popupLang"],res));
  const key=r.groqApiKey||"";const lang=r.popupLang||"English";
  if(!key)return null;
  try{
    const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:400,messages:[{role:"system",content:`You are a Japanese dictionary. Respond ONLY with raw JSON, no markdown, no backticks.`},{role:"user",content:`Look up the Japanese word: "${word}"\nReturn JSON with: word, reading (hiragana), jlpt (N5-N1 or ""), partOfSpeech, meaning (in ${lang}), meaningNative (Japanese definition), example (Japanese sentence), reading_example (romaji of example), example_translated (translation of example in ${lang}), tip (usage tip in ${lang}), imageQuery (2-3 English words for image search)`}]})});
    const d=await res.json();
    const t=d.choices?.[0]?.message?.content||"";
    return JSON.parse(t.replace(/```json|```/g,"").trim());
  }catch{return null;}
}

let imgIndex=0,imgWord="",imgCache=[];

async function searchImage(word,offset){
  const query=word;
  const url=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
  try{
    const res=await fetch(url);
    const data=await res.json();
    const pages=Object.values(data?.query?.pages||{});
    const thumbs=pages.filter(p=>p?.imageinfo?.[0]?.thumburl&&!/svg/i.test(p.imageinfo[0].thumburl)).map(p=>p.imageinfo[0].thumburl);
    return thumbs;
  }catch{return[];}
}

function show(word,cx,cy){
  rm();
  popup=document.createElement("div");
  popup.id="gaku-sv";
  const vw=window.innerWidth;
  Object.assign(popup.style,{position:"fixed",zIndex:"2147483647",left:Math.min(cx+8,vw-344)+"px",top:Math.max(cy+8,10)+"px",width:"328px",background:"linear-gradient(135deg,#0f172a,#1e1b4b)",border:"1.5px solid rgba(139,92,246,0.5)",borderRadius:"14px",boxShadow:"0 12px 40px rgba(0,0,0,0.7)",fontFamily:"'Segoe UI',system-ui,sans-serif",fontSize:"13px",color:"#e2e8f0",overflow:"visible",cursor:"default"});
  const css=document.createElement("style");
  css.textContent="#gaku-sv .gb{padding:6px 10px;border-radius:8px;border:1px solid rgba(139,92,246,0.35);background:rgba(139,92,246,0.12);color:#a78bfa;cursor:pointer;font-size:11px;font-weight:700;}#gaku-sv .gb:hover{background:rgba(139,92,246,0.28);}";
  popup.prepend(css);
  popup.innerHTML+=`<div id="gaku-header" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(139,92,246,0.18);border-bottom:1px solid rgba(139,92,246,0.25);"><span style="font-weight:800;font-size:13px;color:#a78bfa;">🌸 GAKU Reader</span><button id="gc" style="background:none;border:none;color:#64748b;font-size:17px;cursor:pointer;">&times;</button></div><div style="padding:10px 14px 6px;font-size:18px;font-weight:700;color:#f1f5f9;border-bottom:1px solid rgba(255,255,255,0.07);">${word}</div><div style="display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.07);flex-wrap:wrap;"><button class="gb" id="gt">🌐 ${lbl("translate")}</button><button class="gb" id="gp">🔊 ${lbl("pronounce")}</button><button class="gb" id="gi">🖼 ${lbl("image")}</button><button class="gb" id="gs">＋ ${lbl("save")}</button></div><div id="gr" style="padding:10px 14px;min-height:44px;max-height:300px;overflow-y:auto;line-height:1.65;font-size:13px;"><span style="color:#64748b;font-size:12px;">⬆ Select an action above</span></div>`;
  document.body.appendChild(popup);
  // ── Drag to move ──
  const header=popup.querySelector("#gaku-header");
  if(header){
    header.style.cursor="grab";
    let dx=0,dy=0,dragging=false;
    header.addEventListener("mousedown",e=>{
      if(e.target.id==="gc")return;
      dragging=true;dx=e.clientX-popup.offsetLeft;dy=e.clientY-popup.offsetTop;
      header.style.cursor="grabbing";e.preventDefault();
    });
    document.addEventListener("mousemove",e=>{if(!dragging)return;popup.style.left=(e.clientX-dx)+"px";popup.style.top=(e.clientY-dy)+"px";});
    document.addEventListener("mouseup",()=>{dragging=false;header.style.cursor="grab";});
  }
  const R=document.getElementById("gr");
  document.getElementById("gc").onclick=rm;
  let cache=null;

  async function doT(){
    R.innerHTML=`<span style="color:#a78bfa;font-size:12px;">⏳ ${lbl("looking")}</span>`;
    const c=await groq(word);cache=c;
    if(!c){R.innerHTML=`<div style="color:#fbbf24;font-size:12px;">⚠ ${lbl("failed")}</div><a href="https://www.weblio.jp/content/${encodeURIComponent(word)}" target="_blank" style="display:block;padding:8px;background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);border-radius:8px;color:#67e8f9;text-decoration:none;font-size:12px;text-align:center;font-weight:700;">📖 Weblio: ${word} →</a>`;return;}
    R.innerHTML=`<div style="margin-bottom:8px;"><span style="color:#a78bfa;font-weight:700;font-size:16px;">${c.word||word}</span>${c.reading?`<span style="color:#67e8f9;font-size:13px;margin-left:8px;">${c.reading}</span>`:""}${c.jlpt?`<span style="background:rgba(139,92,246,0.2);color:#a78bfa;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;margin-left:6px;">${c.jlpt}</span>`:""}</div>${c.partOfSpeech?`<div style="color:#64748b;font-size:11px;margin-bottom:4px;">${c.partOfSpeech}</div>`:""}<div style="color:#f1f5f9;font-size:14px;font-weight:600;margin-bottom:8px;">${c.meaning||""}</div>${c.example?`<div style="background:rgba(255,255,255,0.04);border-left:2.5px solid rgba(139,92,246,0.5);padding:7px 10px;border-radius:0 8px 8px 0;margin-bottom:6px;"><div style="color:#cbd5e1;font-size:12px;margin-bottom:3px;">${c.example}</div>${c.reading_example?`<div style="color:#67e8f9;font-size:11px;font-style:italic;margin-bottom:2px;">${c.reading_example}</div>`:""} ${c.example_translated?`<div style="color:#94a3b8;font-size:11px;">${c.example_translated}</div>`:""}</div>`:""} ${c.tip?`<div style="color:#94a3b8;font-size:11px;margin-top:4px;font-style:italic;">💡 ${c.tip}</div>`:""}<div style="margin-top:10px;"><a href="https://www.weblio.jp/content/${encodeURIComponent(word)}" target="_blank" style="color:#67e8f9;font-size:11px;text-decoration:none;">📖 Weblio →</a></div>`;
  }

  document.getElementById("gt").onclick=doT;
  document.getElementById("gp").onclick=()=>{if(!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(word);u.lang="ja-JP";u.rate=0.85;u.onend=()=>{R.innerHTML=`<span style="color:#22c55e;font-size:12px;">✓ ${lbl("spoken")}: ${word}</span>`;};window.speechSynthesis.cancel();window.speechSynthesis.speak(u);};

  // IMAGE: Wikimedia 1枚ずつ表示
  document.getElementById("gi").onclick=async()=>{
    imgWord=word;imgIndex=0;imgCache=[];
    R.innerHTML=`<span style="color:#a78bfa;font-size:12px;">⏳ ${lbl("imgLoading")}</span>`;
    const thumbs=await searchImage(word,0);
    imgCache=thumbs;
    if(!thumbs.length){R.innerHTML=`<span style="color:#fbbf24;font-size:12px;">⚠ ${lbl("imgNone")}</span>`;return;}
    showImgAt(R,0,word);
  };

  async function showImgAt(R,idx,word){
    if(idx>=imgCache.length){
      // load more
      R.innerHTML=`<span style="color:#a78bfa;font-size:12px;">⏳ ${lbl("imgLoading")}</span>`;
      const more=await searchImage(word,imgCache.length);
      if(!more.length){R.innerHTML=`<span style="color:#fbbf24;font-size:12px;">⚠ ${lbl("imgNone")}</span>`;return;}
      imgCache=[...imgCache,...more];
    }
    const src=imgCache[idx];
    R.innerHTML=`<div><img id="gaku-img" src="${src}" style="width:100%;border-radius:10px;object-fit:cover;max-height:200px;display:block;" /><p style="color:#475569;font-size:10px;margin:4px 0 6px;text-align:center;">${idx+1}枚目</p><div style="display:flex;gap:6px;"><button id="gaku-img-save" style="flex:1;padding:6px;border-radius:8px;border:1px solid rgba(34,197,94,0.4);background:rgba(34,197,94,0.1);color:#22c55e;cursor:pointer;font-size:11px;font-weight:700;">${lbl("imgSave")}</button><button id="gaku-img-next" style="flex:1;padding:6px;border-radius:8px;border:1px solid rgba(245,158,11,0.4);background:rgba(245,158,11,0.1);color:#fbbf24;cursor:pointer;font-size:11px;font-weight:700;">${lbl("imgNext")}</button></div></div>`;
    document.getElementById("gaku-img-next").onclick=()=>{imgIndex++;showImgAt(R,imgIndex,word);};
    document.getElementById("gaku-img-save").onclick=()=>{
      // Save imageUrl to GAKU vocab
      try{
        const gv=localStorage.getItem("gaku_vocab");
        if(gv){
          const d=JSON.parse(gv);
          const idx2=d.cards.findIndex(c=>c.word===word);
          if(idx2!==-1){d.cards[idx2].imageUrl=src;localStorage.setItem("gaku_vocab",JSON.stringify(d));}
        }
      }catch(e){}
      window.postMessage({type:"GAKU_SAVE_IMAGE",payload:{word,imageUrl:src}},"*");
      try{chrome.runtime.sendMessage({type:"GAKU_SAVE_IMAGE",payload:{word,imageUrl:src}});}catch(e){}
      R.innerHTML=`<div style="text-align:center;padding:8px 0;"><img src="${src}" style="width:100%;border-radius:8px;max-height:160px;object-fit:cover;display:block;margin-bottom:6px;"/><div style="color:#22c55e;font-size:12px;font-weight:700;">✓ ${lbl("saved")}</div></div>`;
    };
  }

  // SAVE + folder
  document.getElementById("gs").onclick=async()=>{
    let c=cache;
    let folders=[];
    try{const gv=localStorage.getItem("gaku_vocab");if(gv){const d=JSON.parse(gv);folders=(d.folders||[]).map(f=>typeof f==="string"?f:f.name).filter(Boolean);}}catch(e){}
    // Build folder UI immediately (don't wait for groq)
    R.innerHTML="";
    const titleEl=document.createElement("div");
    titleEl.style.cssText="font-size:12px;color:#a78bfa;font-weight:700;margin-bottom:8px;";
    titleEl.textContent="📂 "+lbl("chooseFolder");
    R.appendChild(titleEl);
    async function doSave(folder){
      if(!c)c=cache=await groq(word);
      const p=c?{...c}:{word,reading:"",jlpt:"",partOfSpeech:"",meaning:"",example:"",reading_example:"",example_translated:"",tip:""};
      const payload={...p,folder};
      try{chrome.runtime.sendMessage({type:"GAKU_INJECT_WORD",payload});}catch(e){}
      window.postMessage({type:"GAKU_ADD_WORD",payload},"*");
      R.innerHTML=`<div style="text-align:center;padding:8px 0;"><div style="color:#22c55e;font-size:18px;">✓</div><div style="color:#22c55e;font-size:13px;font-weight:700;">${lbl("saved")}</div><div style="color:#f1f5f9;font-size:13px;margin-top:4px;">${word}</div><div style="color:#64748b;font-size:11px;margin-top:2px;">→ ${folder}</div></div>`;
    }
    folders.forEach(f=>{
      const btn=document.createElement("button");
      btn.style.cssText="display:block;width:100%;margin-bottom:6px;padding:8px 12px;border-radius:8px;border:1px solid rgba(139,92,246,0.4);background:rgba(139,92,246,0.1);color:#e2e8f0;cursor:pointer;font-size:12px;text-align:left;";
      btn.textContent="📁 "+f;
      btn.addEventListener("click",()=>doSave(f));
      R.appendChild(btn);
    });
    const defaultBtn=document.createElement("button");
    defaultBtn.style.cssText="display:block;width:100%;margin-bottom:8px;padding:8px 12px;border-radius:8px;border:1px solid rgba(6,182,212,0.4);background:rgba(6,182,212,0.1);color:#67e8f9;cursor:pointer;font-size:12px;text-align:left;";
    defaultBtn.textContent="📚 "+lbl("addToVocab");
    defaultBtn.addEventListener("click",()=>doSave("Your Vocabulary"));
    R.appendChild(defaultBtn);
    const newFolderRow=document.createElement("div");
    newFolderRow.style.cssText="display:flex;gap:6px;margin-bottom:6px;";
    const input=document.createElement("input");
    input.placeholder=lbl("newFolder");
    input.style.cssText="flex:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(139,92,246,0.3);background:#1e293b;color:#f1f5f9;font-size:12px;outline:none;";
    const addBtn=document.createElement("button");
    addBtn.style.cssText="padding:6px 10px;border-radius:8px;border:none;background:#a78bfa;color:#fff;cursor:pointer;font-size:12px;font-weight:700;";
    addBtn.textContent="+";
    addBtn.addEventListener("click",()=>{const v=input.value.trim();if(v)doSave(v);});
    input.addEventListener("keydown",(e)=>{if(e.key==="Enter"){const v=e.target.value.trim();if(v)doSave(v);}});
    newFolderRow.appendChild(input);newFolderRow.appendChild(addBtn);
    R.appendChild(newFolderRow);
    const cancelBtn=document.createElement("button");
    cancelBtn.style.cssText="width:100%;padding:5px;border:none;border-radius:8px;background:rgba(255,255,255,0.05);color:#64748b;cursor:pointer;font-size:11px;";
    cancelBtn.textContent=lbl("cancel");
    cancelBtn.addEventListener("click",()=>{R.innerHTML='<span style="color:#64748b;font-size:12px;">⬆ Select an action above</span>';});
    R.appendChild(cancelBtn);
  };
}

document.addEventListener("mouseup",e=>{
  if(popup&&popup.contains(e.target))return;
  const sel=window.getSelection();
  const text=sel?.toString().trim();
  if(!text||text.length>20)return;
  if(!/[\u3040-\u9FFF]/.test(text))return;
  const r=sel.getRangeAt(0).getBoundingClientRect();
  show(text,r.right,r.bottom);
});

function addFurigana(){}
