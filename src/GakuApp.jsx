import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)",
  purple: "#7c3aed", purpleLight: "#a855f7",
  teal: "#06b6d4", green: "#22c55e",
  amber: "#f59e0b", red: "#ef4444",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

const S = {
  page: { minHeight:"100vh", background:C.bg, fontFamily:"'Noto Sans JP',sans-serif", color:"#f1f5f9" },
  card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px" },
  input: { width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)", border:`1.5px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  select: { width:"100%", padding:"12px 14px", background:"#0f172a", border:`1.5px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: { padding:"13px 20px", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" },
  label: { display:"block", color:"#64748b", fontSize:11, fontWeight:700, marginBottom:5, letterSpacing:1 },
};

const LANGUAGES = [
  "English","Japanese","Spanish","French","Portuguese","German","Italian",
  "Chinese (Simplified)","Chinese (Traditional)","Korean","Arabic","Hindi",
  "Thai","Vietnamese","Indonesian","Malay","Turkish","Russian","Polish",
  "Dutch","Swedish","Norwegian","Danish","Finnish",
];

// ─── AI TRANSLATION CACHE ──────────────────────────────────────────────────────
const translationCache = {};

async function translateUI(lang, strings) {
  if (lang === "English" || lang === "Japanese" || lang === "Spanish") return null;
  if (translationCache[lang]) return translationCache[lang];
  try {
    const keys = Object.keys(strings.English);
    const valuesToTranslate = keys.map(k => strings.English[k]);
    const res = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:3000,
        messages:[{ role:"user", content:`Translate these UI strings into ${lang}. Keep emoji as-is. Keep punctuation style. Keep * symbols. Respond ONLY with a JSON object mapping each English string to its ${lang} translation. No markdown, no extra text.

${JSON.stringify(Object.fromEntries(keys.map((k,i)=>[k, valuesToTranslate[i]])), null, 2)}` }]
      })
    });
    const d = await res.json();
    const text = d.content?.map(c=>c.text||"").join("") || "{}";
    const translated = JSON.parse(text.replace(/```json|```/g,"").trim());
    const result = {};
    keys.forEach(k => { result[k] = translated[k] || strings.English[k]; });
    translationCache[lang] = result;
    return result;
  } catch { return null; }
}

// ─── STATIC UI STRINGS ─────────────────────────────────────────────────────────
const UI_STRINGS = {
  English: {
    weeklyProgress:"Weekly Progress", schedule:"📅 Schedule", vocabulary:"📚 Vocabulary",
    resources:"🔗 Resources", milestones:"🏆 Milestones", funActivity:"🎮 Fun Activity",
    help:"🆘 Help", editProfile:"✏️ Edit Profile", studyPlan:"'s Study Plan",
    goal:"🎯", timeline:"📅", level:"📊", lang:"🌐",
    findWords:"Find Words", findWordsPlaceholder:"e.g. food, travel, emotions...",
    vocabBuilderTitle:"📚 VOCABULARY BUILDER",
    vocabBuilderDesc:"Enter any Japanese word or topic to look it up",
    saved:"✓ Saved", save:"+ Save", mySavedWords:"✅ MY SAVED WORDS",
    hint1Btn:"Hint 1: Romaji", hint2Btn:"Hint 2: Translation",
    flashcardsTab:"🃏 Flashcards", practiceTab:"📝 Practice", savedTab:"📖 Saved Words",
    categoryLabel:"Vocabulary Category", newCategory:"New category name...", addCategory:"Add",
    deleteCategory:"Delete", confirmDelete:"Delete this category?",
    writingTitle:"✍️ WRITING PRACTICE (CLT)", nextPrompt:"Next prompt →", getAIFeedback:"Get AI feedback ✨",
    helpMenu:"What do you need?", customLesson:"✨ Customized lesson for today",
    howToUse:"❓ How to use this app", moodLabel:"MOOD", timeLabel:"AVAILABLE TIME",
    energyLabel:"ENERGY LEVEL", differentToday:"🎲 Today I want to do something different",
    whatToday:"WHAT DO YOU WANT TO DO TODAY?", getPlane:"Get today's plan ✨",
    backToMenu:"Back to menu", howFeeling:"How are you feeling today?",
    backBtn:"← Back", searchingWeb:"🔍 Searching...",
    webResultsTitle:"📡 RESOURCES FOUND",
    yourName:"YOUR NAME *", email:"EMAIL *", country:"COUNTRY *",
    nativeLang:"YOUR NATIVE LANGUAGE? (What language do you prefer to communicate in?)",
    finalGoal:"FINAL GOAL *", whenGoal:"WHEN DO YOU WANT TO ACHIEVE IT? *",
    jlptLevel:"CURRENT JLPT LEVEL *", studyTime:"STUDY TIME PER DAY *",
    daysPerWeek:"DAYS PER WEEK *", whatStudy:"WHAT DO YOU WANT TO STUDY? * (select all that apply)",
    buildPlan:"Build My Study Plan →", saveChanges:"Save Changes →",
    editProfile2:"Edit Your Profile", learningProfile:"Your Learning Profile",
    scheduleTitle:"📅 YOUR WEEKLY STUDY SCHEDULE", restDay:"Rest day 🌸",
    resourcesTitle:"🔗 YOUR RESOURCES", noResources:"No resources. Please reset and select study skills.",
    roadmapTitle:"🏆 YOUR GOAL ROADMAP",
    funActivityTitle:"🎮 FUN ACTIVITY", funActivityDesc:"AI-generated activity based on your level and interests",
    generateActivity:"Generate my activity! ✨", generating:"Generating...",
    correct:"✅ Correct!", wrong:"❌ Wrong! Answer:", nextCard:"Next →",
    score:"Score", correct2:"correct", of:"of",
    sortPracticeTitle:"🔀 WORD ORDER PRACTICE",
    sortPracticeDesc:"Rearrange the words to form a correct Japanese sentence.",
    checkAnswer:"Check Answer", resetSentence:"Reset",
    monday:"MONDAY", tuesday:"TUESDAY", wednesday:"WEDNESDAY", thursday:"THURSDAY",
    friday:"FRIDAY", saturday:"SATURDAY", sunday:"SUNDAY",
  },
  Japanese: {
    weeklyProgress:"週間の進捗", schedule:"📅 スケジュール", vocabulary:"📚 単語",
    resources:"🔗 リソース", milestones:"🏆 マイルストーン", funActivity:"🎮 楽しいアクティビティ",
    help:"🆘 ヘルプ", editProfile:"✏️ プロフィール編集", studyPlan:"さんの学習プラン",
    goal:"🎯", timeline:"📅", level:"📊", lang:"🌐",
    findWords:"単語を探す", findWordsPlaceholder:"例: 食べ物, 旅行, 感情...",
    vocabBuilderTitle:"📚 単語ビルダー",
    vocabBuilderDesc:"日本語の単語やトピックを入力して調べましょう",
    saved:"✓ 保存済み", save:"+ 保存", mySavedWords:"✅ 保存した単語",
    hint1Btn:"ヒント1: ローマ字", hint2Btn:"ヒント2: 翻訳",
    flashcardsTab:"🃏 フラッシュカード", practiceTab:"📝 練習", savedTab:"📖 保存した単語",
    categoryLabel:"単語カテゴリー", newCategory:"カテゴリー名を入力...", addCategory:"追加",
    deleteCategory:"削除", confirmDelete:"このカテゴリーを削除しますか？",
    writingTitle:"✍️ ライティング練習 (CLT)", nextPrompt:"次のお題 →", getAIFeedback:"AIフィードバックを取得 ✨",
    helpMenu:"何が必要ですか？", customLesson:"✨ 今日のカスタムレッスン",
    howToUse:"❓ アプリの使い方", moodLabel:"気分", timeLabel:"利用可能な時間",
    energyLabel:"エネルギーレベル", differentToday:"🎲 今日は違うことをしたい",
    whatToday:"今日何をしたいですか？", getPlane:"今日のプランを取得 ✨",
    backToMenu:"メニューに戻る", howFeeling:"今日の調子はどうですか？",
    backBtn:"← 戻る", searchingWeb:"🔍 検索中...",
    webResultsTitle:"📡 見つかったリソース",
    yourName:"お名前 *", email:"メール *", country:"国 *",
    nativeLang:"母国語は何ですか？（どの言語でコミュニケーションをとりたいですか？）",
    finalGoal:"最終目標 *", whenGoal:"いつまでに達成したいですか？ *",
    jlptLevel:"現在のJLPTレベル *", studyTime:"1日の勉強時間 *",
    daysPerWeek:"週に何日？ *", whatStudy:"何を勉強したいですか？ * (すべて選択)",
    buildPlan:"学習プランを作成 →", saveChanges:"変更を保存 →",
    editProfile2:"プロフィールを編集", learningProfile:"学習プロフィール",
    scheduleTitle:"📅 週間学習スケジュール", restDay:"休息日 🌸",
    resourcesTitle:"🔗 あなたのリソース", noResources:"リソースがありません。スキルを選択してください。",
    roadmapTitle:"🏆 目標ロードマップ",
    funActivityTitle:"🎮 楽しいアクティビティ", funActivityDesc:"あなたのレベルと興味に基づいたAI生成アクティビティ",
    generateActivity:"アクティビティを生成！ ✨", generating:"生成中...",
    correct:"✅ 正解！", wrong:"❌ 不正解！ 正解:", nextCard:"次へ →",
    score:"スコア", correct2:"正解", of:"のうち",
    sortPracticeTitle:"🔀 語順練習",
    sortPracticeDesc:"単語を並べ替えて正しい日本語の文章を作りましょう。",
    checkAnswer:"答え合わせ", resetSentence:"リセット",
    monday:"月曜日", tuesday:"火曜日", wednesday:"水曜日", thursday:"木曜日",
    friday:"金曜日", saturday:"土曜日", sunday:"日曜日",
  },
  Spanish: {
    weeklyProgress:"Progreso semanal", schedule:"📅 Horario", vocabulary:"📚 Vocabulario",
    resources:"🔗 Recursos", milestones:"🏆 Hitos", funActivity:"🎮 Actividad Divertida",
    help:"🆘 Ayuda", editProfile:"✏️ Editar perfil", studyPlan:"'s Plan de estudio",
    goal:"🎯", timeline:"📅", level:"📊", lang:"🌐",
    findWords:"Buscar palabras", findWordsPlaceholder:"ej. comida, viaje, emociones...",
    vocabBuilderTitle:"📚 BUSCADOR DE VOCABULARIO",
    vocabBuilderDesc:"Ingresa cualquier palabra o tema japonés para buscarlo",
    saved:"✓ Guardado", save:"+ Guardar", mySavedWords:"✅ MIS PALABRAS GUARDADAS",
    hint1Btn:"Pista 1: Romaji", hint2Btn:"Pista 2: Traducción",
    flashcardsTab:"🃏 Tarjetas", practiceTab:"📝 Práctica", savedTab:"📖 Palabras guardadas",
    categoryLabel:"Categoría de vocabulario", newCategory:"Nombre de categoría...", addCategory:"Agregar",
    deleteCategory:"Eliminar", confirmDelete:"¿Eliminar esta categoría?",
    writingTitle:"✍️ PRÁCTICA DE ESCRITURA (CLT)", nextPrompt:"Siguiente tema →", getAIFeedback:"Obtener feedback ✨",
    helpMenu:"¿Qué necesitas?", customLesson:"✨ Lección personalizada de hoy",
    howToUse:"❓ Cómo usar esta app", moodLabel:"ESTADO DE ÁNIMO", timeLabel:"TIEMPO DISPONIBLE",
    energyLabel:"NIVEL DE ENERGÍA", differentToday:"🎲 Hoy quiero hacer algo diferente",
    whatToday:"¿QUÉ QUIERES HACER HOY?", getPlane:"Obtener plan de hoy ✨",
    backToMenu:"Volver al menú", howFeeling:"¿Cómo te sientes hoy?",
    backBtn:"← Atrás", searchingWeb:"🔍 Buscando...",
    webResultsTitle:"📡 RECURSOS ENCONTRADOS",
    yourName:"TU NOMBRE *", email:"CORREO *", country:"PAÍS *",
    nativeLang:"¿CUÁL ES TU IDIOMA NATIVO? (¿En qué idioma prefieres comunicarte?)",
    finalGoal:"OBJETIVO FINAL *", whenGoal:"¿CUÁNDO QUIERES LOGRARLO? *",
    jlptLevel:"NIVEL JLPT ACTUAL *", studyTime:"TIEMPO DE ESTUDIO POR DÍA *",
    daysPerWeek:"DÍAS POR SEMANA *", whatStudy:"¿QUÉ QUIERES ESTUDIAR? * (selecciona todo)",
    buildPlan:"Crear mi plan →", saveChanges:"Guardar cambios →",
    editProfile2:"Editar tu perfil", learningProfile:"Tu perfil de aprendizaje",
    scheduleTitle:"📅 TU HORARIO SEMANAL", restDay:"Día de descanso 🌸",
    resourcesTitle:"🔗 TUS RECURSOS", noResources:"Sin recursos. Selecciona habilidades.",
    roadmapTitle:"🏆 TU HOJA DE RUTA",
    funActivityTitle:"🎮 ACTIVIDAD DIVERTIDA", funActivityDesc:"Actividad generada por IA según tu nivel e intereses",
    generateActivity:"¡Generar mi actividad! ✨", generating:"Generando...",
    correct:"✅ ¡Correcto!", wrong:"❌ ¡Incorrecto! Respuesta:", nextCard:"Siguiente →",
    score:"Puntuación", correct2:"correctas", of:"de",
    sortPracticeTitle:"🔀 PRÁCTICA DE ORDEN",
    sortPracticeDesc:"Reorganiza las palabras para formar una oración correcta.",
    checkAnswer:"Verificar", resetSentence:"Reiniciar",
    monday:"LUNES", tuesday:"MARTES", wednesday:"MIÉRCOLES", thursday:"JUEVES",
    friday:"VIERNES", saturday:"SÁBADO", sunday:"DOMINGO",
  },
};

// Dynamic T() function: uses AI-translated cache for other languages
function T(lang, key, dynamicStrings) {
  if (dynamicStrings && dynamicStrings[key]) return dynamicStrings[key];
  if (UI_STRINGS[lang] && UI_STRINGS[lang][key]) return UI_STRINGS[lang][key];
  return UI_STRINGS["English"][key] || key;
}

// ─── CLT RESOURCES ──────────────────────────────────────────────────────────────
const RESOURCES = {
  pronunciation: [
    { name:"Anki (Japanese Decks)", desc:"Build phonetic recognition with audio flashcards.", url:"https://ankiweb.net/shared/decks?search=japanese", free:true },
  ],
  listening: [
    { name:"NHK World Lesson", desc:"Authentic NHK audio lessons at natural pace.", url:"https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/", free:true },
    { name:"Erin ga Chosen", desc:"Drama-based listening. Real conversational Japanese.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Structured listening practice with shadowing.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
  ],
  conversation: [
    { name:"NHK Japan — Learn Japanese", desc:"CLT-based conversational Japanese. Real-life scenarios.", url:"https://www3.nhk.or.jp/nhkworld/en/learnjapanese/", free:true },
    { name:"Marugoto Online", desc:"Japan Foundation's task-based communicative course.", url:"https://a1.marugotoweb.jp/en/", free:true },
  ],
  jlpt: [
    { name:"Japanese Test 4 You", desc:"Full JLPT mock tests N5–N1.", url:"https://japanesetest4you.com/", free:true },
  ],
  reading: [
    { name:"Tadoku (Free Readers)", desc:"Graded reading from Level 0–4.", url:"https://tadoku.org/japanese/book-search/?level=&series=&kw=&order=register_desc", free:true },
    { name:"NHK Web Easy", desc:"Real Japanese news simplified for learners.", url:"https://news.web.nhk/news/easy/", free:true },
  ],
  kanji: [
    { name:"Nihonten AI (Bilingual Kanji)", desc:"AI-powered personalized kanji learning.", url:"https://nihonten.ai/", free:false },
  ],
  grammar: [
    { name:"Imabi", desc:"The most comprehensive free Japanese grammar reference.", url:"https://imabi.org/", free:true },
  ],
};

const SKILL_LABELS = {
  pronunciation:"🔊 Pronunciation", listening:"👂 Listening", conversation:"💬 Conversation",
  jlpt:"🎯 JLPT Prep", reading:"📖 Reading", kanji:"🈳 Kanji", grammar:"📝 Grammar",
};

const DAY_KEYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

// ─── SCHEDULE BUILDER ───────────────────────────────────────────────────────────
function buildSchedule(form) {
  const hoursMap = { "Less than 1 hour":45, "1–2 hours":90, "2–3 hours":150, "3+ hours":180 };
  const daysMap = { "1–2 days":2, "3–4 days":4, "5–6 days":5, "Every day":7 };
  const mins = hoursMap[form.hoursPerDay] || 60;
  const days = daysMap[form.daysPerWeek] || 5;
  const skills = form.skills || [];
  const allBlocks = [
    { skill:"conversation", mins:Math.round(mins*0.3), note:"Role-play or shadowing — CLT core" },
    { skill:"listening",    mins:Math.round(mins*0.2), note:"NHK World or JapanesePod101" },
    { skill:"reading",      mins:Math.round(mins*0.15), note:"Tadoku graded reader or NHK Web Easy" },
    { skill:"grammar",      mins:Math.round(mins*0.15), note:"Imabi + write 3 example sentences" },
    { skill:"kanji",        mins:Math.round(mins*0.1), note:"Nihonten AI — 5 new kanji with context" },
    { skill:"jlpt",         mins:Math.round(mins*0.2), note:"Japanese Test 4 You — one practice section" },
    { skill:"pronunciation",mins:Math.round(mins*0.1), note:"Anki audio cards — shadow 20 words" },
  ].filter(b => skills.includes(b.skill));
  if (allBlocks.length === 0) allBlocks.push({ skill:"conversation", mins:30, note:"Role-play or shadowing" });
  const WEEKDAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  const schedule = {};
  const activeDays = WEEKDAYS.slice(0, days);
  activeDays.forEach((day, i) => {
    const focus = allBlocks[i % allBlocks.length];
    schedule[day] = [
      { task:`${SKILL_LABELS[focus.skill] || focus.skill}: ${focus.note} (${focus.mins} min)`, done:false },
      { task:`Vocabulary review — Anki or saved words (10 min)`, done:false },
      i % 2 === 0 ? { task:`Speak aloud: summarize today's content in Japanese (5 min)`, done:false } : null,
    ].filter(Boolean);
  });
  WEEKDAYS.slice(days).forEach(day => { schedule[day] = [{ task:"rest", done:false, rest:true }]; });
  return schedule;
}

function buildMilestones(form) {
  const goalMap = {
    "Beginner": ["Learn hiragana + katakana (Week 1–2)", "Master 300 vocabulary words (Month 1)", "Hold a 2-minute self-introduction in Japanese (Month 2)", "Pass JLPT N5 practice test at 70% (Month 3)"],
    "N5": ["Complete N4 grammar on Imabi (Month 1–2)", "Reach 800 vocabulary words (Month 2)", "Hold a 5-minute conversation on daily topics (Month 3)", "Pass JLPT N4 practice test at 70% (Month 4–5)"],
    "N4": ["Complete N3 grammar (Month 1–3)", "Reach 1,500 vocabulary words (Month 2)", "Read NHK Web Easy daily without dictionary (Month 3)", "Pass JLPT N3 practice test at 70% (Month 4–6)"],
    "N3": ["Complete N2 grammar (Month 1–3)", "Reach 3,000 vocabulary words (Month 3)", "Read regular NHK News (Month 4)", "Pass JLPT N2 practice test at 70% (Month 5–8)"],
    "N2": ["Complete N1 grammar (Month 1–3)", "Reach 6,000 vocabulary words (Month 4)", "Read academic/business Japanese texts (Month 5)", "Pass JLPT N1 practice test at 60% (Month 6–10)"],
    "N1": ["Master business keigo patterns (Month 1–2)", "Write formal Japanese essays 800+ characters (Month 2)", "Participate in native-speed discussions (Month 3)", "Achieve professional fluency certification (Month 6+)"],
  };
  const key = (form.jlpt||"").replace("Beginner (no JLPT)","Beginner").replace(" (no JLPT)","");
  return goalMap[key] || goalMap["Beginner"];
}

// ─── FUN ACTIVITY TAB ───────────────────────────────────────────────────────────
function FunActivity({ form, ui }) {
  const lang = form.preferredLang || "English";
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:800,
          messages:[{ role:"user", content:`You are a creative Japanese learning activity designer.

Student profile:
- Name: ${form.name}
- Level: ${form.jlpt}
- Goal: ${form.goal}
- Skills they're studying: ${(form.skills||[]).join(", ")}
- Study time per day: ${form.hoursPerDay}
- Communication language: ${lang}

Create ONE fun, engaging Japanese learning activity perfectly matched to this student.
Make it creative, interactive, and enjoyable — NOT a standard exercise.

Ideas by skill:
- pronunciation: shadowing challenge with tongue twisters, record yourself and compare
- listening: watch a specific YouTube clip and transcribe 3 sentences
- conversation: write a short roleplay script and practice out loud
- jlpt: create a story using 5 JLPT vocabulary words
- reading: read a specific manga page and retell the story
- kanji: draw 5 kanji from memory and create silly visual mnemonics
- grammar: write a funny diary entry using today's grammar point

Structure your response in ${lang} as:
🎯 **Activity Title** (catchy name)
⏱ **Time**: X minutes
📝 **What to do**: Step-by-step instructions (2-4 steps)
🌟 **Why it works**: Short explanation of the learning benefit
🔗 **Resource**: One specific URL to use (real link)
💡 **Bonus challenge**: An optional harder version

Make it feel fun and achievable!` }]
        })
      });
      const d = await res.json();
      setActivity(d.content?.map(c=>c.text||"").join("") || "");
    } catch { setActivity("Try this: Watch your favorite Japanese anime clip (5 min) and write down every word you understand. Then look up 3 new words you heard! 🎌"); }
    setLoading(false);
  };

  return (
    <div style={{ ...S.card }}>
      <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T(lang,"funActivityTitle",ui)}</p>
      <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>{T(lang,"funActivityDesc",ui)}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        {(form.skills||[]).map(s => (
          <span key={s} style={{ padding:"4px 12px", borderRadius:20, background:"rgba(168,85,247,0.1)", border:`1px solid rgba(168,85,247,0.3)`, color:C.purpleLight, fontSize:11, fontWeight:700 }}>
            {SKILL_LABELS[s]}
          </span>
        ))}
        <span style={{ padding:"4px 12px", borderRadius:20, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal, fontSize:11, fontWeight:700 }}>
          {form.jlpt}
        </span>
      </div>
      {!activity && (
        <button onClick={generate} disabled={loading} style={{ ...S.btn, width:"100%", background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff" }}>
          {loading ? T(lang,"generating",ui) : T(lang,"generateActivity",ui)}
        </button>
      )}
      {loading && (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <p style={{ color:C.teal, fontSize:13 }}>✨ Creating your personalized activity...</p>
        </div>
      )}
      {activity && (
        <div>
          <div style={{ background:"rgba(6,182,212,0.06)", border:`1px solid rgba(6,182,212,0.15)`, borderRadius:12, padding:"16px", marginBottom:14, whiteSpace:"pre-wrap", lineHeight:1.8, fontSize:14, color:"#f1f5f9" }}>
            {activity}
          </div>
          <button onClick={() => { setActivity(null); generate(); }} style={{ ...S.btn, width:"100%", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:13 }}>
            🔄 Generate another activity
          </button>
        </div>
      )}
      <div style={{ marginTop:16, padding:"12px", background:"rgba(245,158,11,0.06)", borderRadius:10, border:`1px solid rgba(245,158,11,0.15)` }}>
        <p style={{ color:C.amber, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>💡 TIP</p>
        <p style={{ color:"#94a3b8", fontSize:12, margin:0, lineHeight:1.6 }}>Activities refresh each time. Generate new ones whenever you want a fresh challenge!</p>
      </div>
    </div>
  );
}

// ─── FLASHCARD GAME ─────────────────────────────────────────────────────────────
function FlashcardGame({ words, lang, ui }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("question");
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameWords, setGameWords] = useState(() => words.slice(0, Math.min(words.length, 8)));
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    const gw = words.slice(0, Math.min(words.length, 8));
    setGameWords(gw); setIdx(0); setScore(0); setPhase("question"); setSelected(null);
  }, [words]);

  useEffect(() => {
    if (gameWords.length >= 2 && gameWords[idx]) {
      const others = gameWords.filter((_,i)=>i!==idx).sort(()=>Math.random()-0.5).slice(0,3);
      setChoices([gameWords[idx], ...others].sort(()=>Math.random()-0.5));
    }
  }, [idx, gameWords]);

  if (!gameWords || gameWords.length < 2) return (
    <div style={{ ...S.card, textAlign:"center", padding:24 }}>
      <p style={{ color:"#64748b" }}>Search vocabulary to start the game!</p>
    </div>
  );

  const current = gameWords[idx];
  if (!current) return null;

  const handleAnswer = (choice) => {
    setSelected(choice);
    if (choice.word === current.word) setScore(s=>s+1);
    setPhase("result");
  };
  const next = () => {
    if (idx+1 >= gameWords.length) { setPhase("done"); return; }
    setIdx(i=>i+1); setPhase("question"); setSelected(null);
  };
  if (phase === "done") return (
    <div style={{ ...S.card, textAlign:"center" }}>
      <p style={{ fontSize:40, marginBottom:12 }}>🎉</p>
      <p style={{ color:"#f1f5f9", fontSize:16, fontWeight:700 }}>{T(lang,"score",ui)}: {score}/{gameWords.length}</p>
      <button onClick={()=>{setIdx(0);setScore(0);setPhase("question");setSelected(null);}} style={{ ...S.btn, background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff", marginTop:12 }}>🔄 Try Again</button>
    </div>
  );
  return (
    <div style={{ ...S.card }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, margin:0 }}>🖼 IMAGE WORD GAME</p>
        <p style={{ color:"#64748b", fontSize:12, margin:0 }}>{idx+1}/{gameWords.length} · {T(lang,"score",ui)}: {score}</p>
      </div>
      <div style={{ background:"rgba(6,182,212,0.06)", borderRadius:12, padding:16, marginBottom:14, textAlign:"center" }}>
        <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, marginBottom:8 }}>🖼 VISUAL CLUE</p>
        <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.7 }}>{current.image}</p>
        <p style={{ color:"#64748b", fontSize:12, marginTop:8, fontStyle:"italic" }}>{current.meaning}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {choices.map((ch,i)=>{
          const isCorrect = ch.word===current.word;
          const isSelected = selected&&ch.word===selected.word;
          let bg=C.card, border=C.border, color="#cbd5e1";
          if (phase==="result") {
            if(isCorrect){bg="rgba(34,197,94,0.1)";border=C.green;color=C.green;}
            else if(isSelected){bg="rgba(239,68,68,0.1)";border=C.red;color=C.red;}
          }
          return (
            <button key={i} onClick={()=>phase==="question"&&handleAnswer(ch)}
              style={{padding:12,borderRadius:10,border:`1.5px solid ${border}`,background:bg,color,fontSize:15,fontWeight:700,cursor:"pointer"}}>
              {ch.word}<br/><span style={{fontSize:11,fontWeight:400}}>{ch.reading}</span>
            </button>
          );
        })}
      </div>
      {phase==="result"&&(
        <div style={{marginTop:12}}>
          <p style={{color:selected?.word===current.word?C.green:C.red,fontSize:13,fontWeight:700,textAlign:"center",marginBottom:8}}>
            {selected?.word===current.word?T(lang,"correct",ui):`${T(lang,"wrong",ui)} ${current.word}`}
          </p>
          <button onClick={next} style={{...S.btn,width:"100%",background:`linear-gradient(135deg,${C.teal},#0891b2)`,color:"#fff"}}>{T(lang,"nextCard",ui)}</button>
        </div>
      )}
    </div>
  );
}

// ─── WORD ORDER PRACTICE ────────────────────────────────────────────────────────
function WordOrderPractice({ words, lang, ui }) {
  const [exercises, setExercises] = useState([]);
  const [idx, setIdx] = useState(0);
  const [arranged, setArranged] = useState([]);
  const [available, setAvailable] = useState([]);
  const [phase, setPhase] = useState("question");
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (words.length>=1) generateExercises(); }, [words]);

  const generateExercises = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:800,
          messages:[{ role:"user", content:`Create 4 word-order exercises using these Japanese words: ${words.map(w=>w.word).join(", ")}.
Respond ONLY in JSON (no markdown):
[{"answer":"完全な文","parts":["単語","を","並べて"],"translation":"English meaning"}]
The "parts" array must be shuffled.` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("")||"[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      const exs = parsed.map(e=>({...e,shuffled:[...e.parts].sort(()=>Math.random()-0.5)}));
      setExercises(exs);
      if(exs[0]) setAvailable([...exs[0].shuffled]);
    } catch { setExercises([]); }
    setLoading(false);
  };

  useEffect(()=>{ if(exercises[idx]){setAvailable([...exercises[idx].shuffled]);setArranged([]);setPhase("question");}}, [idx,exercises]);

  if(loading) return <div style={{...S.card,textAlign:"center",padding:32}}><p style={{color:C.teal}}>Generating... ⏳</p></div>;
  if(!exercises.length) return null;
  const current=exercises[idx]; if(!current) return null;

  const addWord=(word,i)=>{setArranged(a=>[...a,word]);setAvailable(av=>av.filter((_,j)=>j!==i));};
  const removeWord=(i)=>{const word=arranged[i];setArranged(a=>a.filter((_,j)=>j!==i));setAvailable(av=>[...av,word]);};
  const checkAnswer=()=>{setIsCorrect(arranged.join("")===current.answer||arranged.join(" ")===current.answer);setPhase("result");};
  const reset=()=>{setAvailable([...current.shuffled]);setArranged([]);setPhase("question");};
  const next=()=>{if(idx+1<exercises.length){setIdx(i=>i+1);}else{setIdx(0);}setPhase("question");};

  return (
    <div style={{...S.card,marginTop:12}}>
      <p style={{color:C.amber,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:4}}>{T(lang,"sortPracticeTitle",ui)}</p>
      <p style={{color:"#64748b",fontSize:12,marginBottom:10}}>{T(lang,"sortPracticeDesc",ui)}</p>
      <p style={{color:"#64748b",fontSize:11,fontStyle:"italic",marginBottom:10}}>Translation: {current.translation}</p>
      <div style={{minHeight:52,background:"rgba(255,255,255,0.03)",border:`1.5px dashed ${phase==="result"?(isCorrect?C.green:C.red):C.border}`,borderRadius:10,padding:10,marginBottom:12,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        {arranged.length===0&&<p style={{color:"#334155",fontSize:12}}>Tap words below...</p>}
        {arranged.map((word,i)=>(
          <button key={i} onClick={()=>phase==="question"&&removeWord(i)} style={{padding:"6px 12px",borderRadius:8,background:"rgba(168,85,247,0.15)",border:`1px solid ${C.purpleLight}`,color:C.purpleLight,fontSize:14,cursor:"pointer"}}>{word}</button>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
        {available.map((word,i)=>(
          <button key={i} onClick={()=>phase==="question"&&addWord(word,i)} style={{padding:"6px 12px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`,color:"#cbd5e1",fontSize:14,cursor:"pointer"}}>{word}</button>
        ))}
      </div>
      {phase==="result"&&(
        <div style={{background:isCorrect?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",borderRadius:10,padding:12,marginBottom:12}}>
          <p style={{color:isCorrect?C.green:C.red,fontSize:13,fontWeight:700,margin:"0 0 4px"}}>{isCorrect?T(lang,"correct",ui):T(lang,"wrong",ui)}</p>
          {!isCorrect&&<p style={{color:"#cbd5e1",fontSize:13,margin:0}}>✅ {current.answer}</p>}
        </div>
      )}
      <div style={{display:"flex",gap:8}}>
        {phase==="question"?(
          <>
            <button onClick={checkAnswer} disabled={!arranged.length} style={{...S.btn,flex:1,background:arranged.length?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b",color:arranged.length?"#fff":"#475569"}}>{T(lang,"checkAnswer",ui)}</button>
            <button onClick={reset} style={{...S.btn,background:C.card,color:"#94a3b8",border:`1px solid ${C.border}`}}>{T(lang,"resetSentence",ui)}</button>
          </>
        ):(
          <button onClick={next} style={{...S.btn,width:"100%",background:`linear-gradient(135deg,${C.teal},#0891b2)`,color:"#fff"}}>{T(lang,"nextCard",ui)}</button>
        )}
      </div>
    </div>
  );
}

// ─── SKILL PRACTICE ─────────────────────────────────────────────────────────────
function SkillPractice({ jlpt, skills, lang, ui }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const SKILL_PRACTICE = {
    conversation:{label:"💬 Conversation",color:"#06b6d4",desc:"Role-play & speaking practice"},
    grammar:{label:"📝 Grammar",color:"#a855f7",desc:"Grammar exercises & pattern drills"},
    reading:{label:"📖 Reading",color:"#22c55e",desc:"Reading comprehension tasks"},
    jlpt:{label:"🎯 JLPT Prep",color:"#ef4444",desc:"JLPT-style practice questions"},
    listening:{label:"👂 Listening",color:"#f59e0b",desc:"Listening & shadowing tasks"},
  };
  const practiceSkills = (skills||[]).filter(s=>SKILL_PRACTICE[s]);
  const current = activeSkill ? SKILL_PRACTICE[activeSkill] : null;

  const generatePrompt = async (skill) => {
    setActiveSkill(skill); setPrompt(""); setText(""); setFeedback(""); setLoadingPrompt(true);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:300,
          messages:[{ role:"user", content:`Create ONE practice task. Level: ${jlpt}, Skill: ${skill}, Language: ${lang}.
- conversation: role-play scenario
- grammar: fill-in-the-blank with grammar pattern  
- reading: short Japanese text + 2 questions
- jlpt: 2-3 JLPT-style questions
- listening: shadowing script (4-5 sentences to read aloud)
Write in ${lang}, include Japanese text. Under 120 words.` }]
        })
      });
      const d = await res.json();
      setPrompt(d.content?.map(c=>c.text||"").join("")||"Practice task!");
    } catch { setPrompt("Write 3 sentences in Japanese about your daily routine."); }
    setLoadingPrompt(false);
  };

  const getFeedback = async () => {
    if(!text.trim()) return; setLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:300,
          messages:[{ role:"user", content:`Japanese teacher. Level: ${jlpt}, Skill: ${activeSkill}.
Task: "${prompt}"
Student: "${text}"
Feedback in ${lang}: 1. ✅ Correct 2. 💡 Improve 3. 🌟 New expression. Warm, under 80 words.` }]
        })
      });
      const d = await res.json();
      setFeedback(d.content?.map(c=>c.text||"").join("")||"Great! 頑張って！🌸");
    } catch { setFeedback("Great effort! 頑張って！🌸"); }
    setLoading(false);
  };

  if(!practiceSkills.length) return null;
  return (
    <div style={{marginTop:16}}>
      <div style={{...S.card,marginBottom:12}}>
        <p style={{color:"#94a3b8",fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:12}}>✍️ SKILL PRACTICE</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {practiceSkills.map(s=>{
            const info=SKILL_PRACTICE[s];
            return <button key={s} onClick={()=>generatePrompt(s)} style={{padding:"8px 16px",borderRadius:20,border:`1.5px solid ${activeSkill===s?info.color:C.border}`,background:activeSkill===s?`rgba(0,0,0,0.2)`:C.card,color:activeSkill===s?info.color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer"}}>{info.label}</button>;
          })}
        </div>
      </div>
      {loadingPrompt&&<div style={{...S.card,textAlign:"center",padding:24}}><p style={{color:C.teal}}>Generating task... ⏳</p></div>}
      {!loadingPrompt&&prompt&&current&&(
        <div style={{...S.card}}>
          <p style={{color:current.color,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:4}}>{current.label} PRACTICE</p>
          <div style={{background:"rgba(255,255,255,0.03)",borderLeft:`3px solid ${current.color}`,borderRadius:8,padding:"12px 14px",marginBottom:12}}>
            <p style={{color:"#f1f5f9",fontSize:14,lineHeight:1.8,margin:0,whiteSpace:"pre-wrap"}}>{prompt}</p>
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write your answer here..." rows={4} style={{...S.input,resize:"vertical",fontFamily:"inherit",lineHeight:1.8,marginBottom:8}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <button onClick={()=>generatePrompt(activeSkill)} style={{padding:"5px 12px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`,color:"#94a3b8",fontSize:11,cursor:"pointer"}}>🔄 New task</button>
            <p style={{color:"#64748b",fontSize:11,margin:0,alignSelf:"center"}}>{text.length} chars</p>
          </div>
          {!feedback?(
            <button onClick={getFeedback} disabled={!text.trim()||loading} style={{...S.btn,width:"100%",background:text.trim()?`linear-gradient(135deg,${current.color},${current.color}99)`:"#1e293b",color:text.trim()?"#fff":"#475569"}}>
              {loading?"Getting feedback...":"Get AI Feedback ✨"}
            </button>
          ):(
            <div style={{background:"rgba(34,197,94,0.06)",borderLeft:`3px solid ${C.green}`,borderRadius:8,padding:"12px 14px"}}>
              <p style={{color:"#f1f5f9",fontSize:13,lineHeight:1.8,margin:0,whiteSpace:"pre-wrap"}}>{feedback}</p>
              <button onClick={()=>{setFeedback("");setText("");}} style={{marginTop:10,padding:"6px 14px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`,color:"#64748b",fontSize:11,cursor:"pointer"}}>Try again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── VOCABULARY BUILDER ─────────────────────────────────────────────────────────
function VocabBuilder({ form, ui }) {
  const lang = form.preferredLang || "English";
  const [search, setSearch] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [hints, setHints] = useState({});
  const [categories, setCategories] = useState(() => {
    try { const s = localStorage.getItem("gaku_vocab_categories"); return s ? JSON.parse(s) : { "General": [] }; } catch { return { "General": [] }; }
  });
  const [activeCategory, setActiveCategory] = useState("General");
  const [newCatName, setNewCatName] = useState("");
  const [deletingCat, setDeletingCat] = useState(null);

  const saveCategories = (cats) => { setCategories(cats); try { localStorage.setItem("gaku_vocab_categories", JSON.stringify(cats)); } catch {} };

  const addCategory = () => {
    const name = newCatName.trim(); if(!name||categories[name]) return;
    saveCategories({...categories,[name]:[]}); setActiveCategory(name); setNewCatName("");
  };

  const deleteCategory = (cat) => {
    if(cat === "General") return;
    const newCats = {...categories}; delete newCats[cat];
    saveCategories(newCats); setActiveCategory("General"); setDeletingCat(null);
  };

  const saveWordToCategory = (w) => {
    const cat = categories[activeCategory]||[];
    if(cat.find(x=>x.word===w.word)) return;
    saveCategories({...categories,[activeCategory]:[...cat,w]});
  };

  const removeFromCategory = (cat, word) => saveCategories({...categories,[cat]:(categories[cat]||[]).filter(w=>w.word!==word)});
  const isWordSaved = (w) => Object.values(categories).some(arr=>arr.find(x=>x.word===w.word));

  const findWords = async () => {
    if(!search.trim()) return;
    setLoading(true); setHints({});
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{ role:"user", content:`You are a comprehensive Japanese dictionary (like kokugo.jitenon.jp).
The user searched for: "${search}"
Language for explanations: ${lang}

ALWAYS return exactly 6 Japanese words related to this search.
Include ALL types: nouns, verbs, adjectives, expressions, compound words.
NO level restriction - include any word that appears in a Japanese dictionary.
If the search is a Japanese word itself, include it plus 5 related words.

For each word provide:
- word: Japanese (kanji+kana as naturally written)
- reading: hiragana reading
- romaji: romanization  
- meaning: clear translation in ${lang}
- example: natural Japanese sentence
- example_translation: translation in ${lang}
- image: vivid memory scene (start with "Imagine:" in ${lang})
- tip: real conversation usage tip in ${lang}

Respond ONLY with JSON array, no markdown:
[{"word":"","reading":"","romaji":"","meaning":"","example":"","example_translation":"","image":"","tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("")||"[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setWords(Array.isArray(parsed)?parsed:[]);
    } catch(e) { setWords([]); }
    setLoading(false);
  };

  const toggleHint = (idx, level) => setHints(h=>({...h,[idx]:h[idx]===level?0:level}));
  const allSavedWords = Object.values(categories).flat();

  return (
    <div>
      {/* Search box */}
      <div style={{...S.card,marginBottom:16}}>
        <p style={{color:C.teal,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:4}}>{T(lang,"vocabBuilderTitle",ui)}</p>
        <p style={{color:"#64748b",fontSize:12,marginBottom:14}}>{T(lang,"vocabBuilderDesc",ui)}</p>
        <div style={{display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findWords()}
            placeholder={T(lang,"findWordsPlaceholder",ui)} style={{...S.input,flex:1}}/>
          <button onClick={findWords} disabled={!search.trim()||loading}
            style={{...S.btn,background:search.trim()&&!loading?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b",color:search.trim()&&!loading?"#fff":"#475569",whiteSpace:"nowrap",padding:"12px 18px"}}>
            {loading?"...":T(lang,"findWords",ui)}
          </button>
        </div>
        {loading && <p style={{color:C.teal,fontSize:12,marginTop:8,textAlign:"center"}}>🔍 Looking up words...</p>}
      </div>

      {/* Category selector */}
      <div style={{...S.card,marginBottom:16}}>
        <p style={{color:C.green,fontSize:12,fontWeight:700,marginBottom:10}}>{T(lang,"categoryLabel",ui)}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
          {Object.keys(categories).map(cat=>(
            <div key={cat} style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={()=>setActiveCategory(cat)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${activeCategory===cat?C.green:C.border}`,background:activeCategory===cat?"rgba(34,197,94,0.12)":C.card,color:activeCategory===cat?C.green:"#64748b",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {cat} ({(categories[cat]||[]).length})
              </button>
              {cat!=="General" && (
                <button onClick={()=>setDeletingCat(cat)} style={{width:20,height:20,borderRadius:"50%",background:"rgba(239,68,68,0.15)",border:`1px solid ${C.red}`,color:C.red,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
              )}
            </div>
          ))}
        </div>
        {/* Delete confirmation */}
        {deletingCat && (
          <div style={{background:"rgba(239,68,68,0.08)",border:`1px solid rgba(239,68,68,0.3)`,borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{color:C.red,fontSize:12,margin:0}}>Delete "{deletingCat}"?</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>deleteCategory(deletingCat)} style={{padding:"4px 12px",borderRadius:8,background:C.red,border:"none",color:"#fff",fontSize:12,cursor:"pointer"}}>Delete</button>
              <button onClick={()=>setDeletingCat(null)} style={{padding:"4px 12px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`,color:"#94a3b8",fontSize:12,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()}
            placeholder={T(lang,"newCategory",ui)} style={{...S.input,flex:1,fontSize:12,padding:"8px 12px"}}/>
          <button onClick={addCategory} disabled={!newCatName.trim()} style={{...S.btn,padding:"8px 14px",background:newCatName.trim()?`linear-gradient(135deg,${C.green},#16a34a)`:"#1e293b",color:newCatName.trim()?"#fff":"#475569",fontSize:12}}>
            {T(lang,"addCategory",ui)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["practice",T(lang,"practiceTab",ui)],["flashcards",T(lang,"flashcardsTab",ui)],["saved",T(lang,"savedTab",ui)]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${activeTab===id?C.teal:C.border}`,background:activeTab===id?"rgba(6,182,212,0.12)":C.card,color:activeTab===id?C.teal:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            {label}
          </button>
        ))}
      </div>

      {/* Practice tab */}
      {activeTab==="practice" && (
        <div>
          {words.length>0 && (
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
              {words.map((w,i)=>(
                <div key={i} style={{...S.card,borderLeft:`3px solid ${C.teal}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <p style={{color:"#f1f5f9",fontSize:22,fontWeight:900,margin:"0 0 2px"}}>{w.word}</p>
                      <p style={{color:C.teal,fontSize:13,margin:"0 0 2px"}}>{w.reading}</p>
                      {hints[i]>=1&&<p style={{color:"#94a3b8",fontSize:12,margin:"0 0 2px"}}>Romaji: {w.romaji}</p>}
                      {hints[i]>=2&&<p style={{color:C.purpleLight,fontSize:13,fontWeight:600,margin:"0 0 2px"}}>{w.meaning}</p>}
                    </div>
                    <button onClick={()=>saveWordToCategory(w)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${isWordSaved(w)?C.green:C.border}`,background:isWordSaved(w)?"rgba(34,197,94,0.1)":C.card,color:isWordSaved(w)?C.green:"#64748b",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                      {isWordSaved(w)?T(lang,"saved",ui):T(lang,"save",ui)}
                    </button>
                  </div>
                  <div style={{background:"rgba(6,182,212,0.06)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                    <p style={{color:"#f1f5f9",fontSize:13,margin:"0 0 2px"}}>{w.example}</p>
                    {hints[i]>=2&&<p style={{color:"#64748b",fontSize:12,margin:0,fontStyle:"italic"}}>{w.example_translation}</p>}
                  </div>
                  <div style={{background:"rgba(168,85,247,0.06)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                    <p style={{color:C.purpleLight,fontSize:11,fontWeight:700,margin:"0 0 4px"}}>🖼 VISUAL</p>
                    <p style={{color:"#cbd5e1",fontSize:12,margin:0,lineHeight:1.6}}>{w.image}</p>
                  </div>
                  <div style={{background:"rgba(34,197,94,0.06)",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                    <p style={{color:C.green,fontSize:11,fontWeight:700,margin:"0 0 4px"}}>💬 CLT TIP</p>
                    <p style={{color:"#cbd5e1",fontSize:12,margin:0}}>{w.tip}</p>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>toggleHint(i,1)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${hints[i]>=1?C.amber:C.border}`,background:hints[i]>=1?"rgba(245,158,11,0.1)":C.card,color:hints[i]>=1?C.amber:"#64748b",fontSize:11,cursor:"pointer"}}>{T(lang,"hint1Btn",ui)}</button>
                    <button onClick={()=>toggleHint(i,2)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${hints[i]>=2?C.purpleLight:C.border}`,background:hints[i]>=2?"rgba(168,85,247,0.1)":C.card,color:hints[i]>=2?C.purpleLight:"#64748b",fontSize:11,cursor:"pointer"}}>{T(lang,"hint2Btn",ui)}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {words.length>0&&<WordOrderPractice words={words} lang={lang} ui={ui}/>}
          <SkillPractice jlpt={form.jlpt} skills={form.skills} lang={lang} ui={ui}/>
        </div>
      )}

      {/* Flashcards tab */}
      {activeTab==="flashcards" && (
        <div>
          <FlashcardGame words={words.length>0?words:allSavedWords} lang={lang} ui={ui}/>
        </div>
      )}

      {/* Saved tab */}
      {activeTab==="saved" && (
        <div>
          {Object.entries(categories).map(([cat,catWords])=>(
            catWords.length>0&&(
              <div key={cat} style={{...S.card,marginBottom:12}}>
                <p style={{color:C.green,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:12}}>📂 {cat.toUpperCase()} ({catWords.length})</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {catWords.map((w,i)=>(
                    <div key={i} style={{background:"rgba(34,197,94,0.08)",border:`1px solid rgba(34,197,94,0.2)`,borderRadius:10,padding:"8px 12px",position:"relative"}}>
                      <p style={{color:"#f1f5f9",fontSize:14,fontWeight:700,margin:"0 0 2px"}}>{w.word}</p>
                      <p style={{color:"#64748b",fontSize:11,margin:0}}>{w.reading} · {w.meaning}</p>
                      <button onClick={()=>removeFromCategory(cat,w.word)} style={{position:"absolute",top:4,right:4,background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12}}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {allSavedWords.length===0&&<p style={{color:"#64748b",textAlign:"center",padding:24}}>No saved words yet!</p>}
        </div>
      )}
    </div>
  );
}

// ─── HELP MODAL ─────────────────────────────────────────────────────────────────
function HelpModal({ onClose, form, ui }) {
  const lang = form.preferredLang || "English";
  const [view, setView] = useState("menu");
  const [mood, setMood] = useState(""); const [time, setTime] = useState(""); const [energy, setEnergy] = useState("");
  const [wantDiff, setWantDiff] = useState(false);
  const [diffRequest, setDiffRequest] = useState("");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false);
  const [webResults, setWebResults] = useState([]);

  const getHelp = async () => {
    setLoading(true); setWebResults([]);
    try {
      const isCustom = wantDiff && diffRequest.trim();
      const prompt = isCustom
        ? `You are a Japanese learning expert with knowledge of the best learning resources.
Student: Level ${form.jlpt}, Goal: ${form.goal}, Language: ${lang}
The student wants to do something specific today: "${diffRequest}"

1. Give a SHORT encouraging message (2 sentences) in ${lang} about why this is great for learning Japanese.
2. Provide EXACTLY 3 real, specific online resources that match their request:
   - For ANIME: Crunchyroll, Netflix Japanese section, or specific YouTube anime channels
   - For NEWS: NHK Web Easy (https://www3.nhk.or.jp/news/easy/), TBS NEWS DIG, NHK World
   - For MUSIC: Uta-Net lyrics site, specific Japanese artists on YouTube/Spotify
   - For MANGA: BookWalker, specific manga series, ComicWalker
   - For DRAMA: Netflix Japanese dramas, Viki, specific drama titles
   - For GAMES: specific Japanese learning games, or game titles with Japanese settings
   - For PODCASTS: specific Japanese podcasts on Spotify or Apple Podcasts
   - Always use REAL URLs that actually exist

Write message first, then:
RESOURCES_JSON:[{"name":"Real Name","url":"https://real-url.com","desc":"Why it matches in ${lang}"}]`
        : `Japanese learning coach. Student: Level ${form.jlpt}, Skills: ${(form.skills||[]).join(", ")}, Language: ${lang}
Mood: ${mood}, Time: ${time}min, Energy: ${energy}
Give ONE specific, actionable study suggestion in ${lang}. Match energy level. 2-3 sentences. 1-2 emojis. Be specific with resource name.`;

      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:600, messages:[{role:"user",content:prompt}] })
      });
      const d = await res.json();
      const fullText = d.content?.map(c=>c.text||"").join("")||"";
      const jsonMatch = fullText.match(/RESOURCES_JSON:(\[[\s\S]*?\])/);
      if(jsonMatch){try{setWebResults(JSON.parse(jsonMatch[1]));}catch{}}
      setResult(fullText.replace(/RESOURCES_JSON:[\s\S]*$/,"").trim()||"頑張って！🌸");
    } catch { setResult("頑張って！Review your saved vocabulary! 🌸"); }
    setLoading(false);
  };

  const resetAll = ()=>{setView("menu");setResult("");setMood("");setTime("");setEnergy("");setWantDiff(false);setDiffRequest("");setWebResults([]);};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{...S.card,width:"100%",maxWidth:420,position:"relative",maxHeight:"85vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>×</button>
        <p style={{color:C.amber,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:4}}>🆘 HELP</p>

        {view==="menu"&&(
          <>
            <h3 style={{color:"#f1f5f9",fontSize:17,fontWeight:800,margin:"0 0 18px"}}>{T(lang,"helpMenu",ui)}</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>setView("lesson")} style={{...S.btn,width:"100%",textAlign:"left",background:`linear-gradient(135deg,${C.amber},#d97706)`,color:"#fff"}}>{T(lang,"customLesson",ui)}</button>
              <button onClick={()=>setView("howto")} style={{...S.btn,width:"100%",textAlign:"left",background:C.card,color:"#94a3b8",border:`1px solid ${C.border}`}}>{T(lang,"howToUse",ui)}</button>
            </div>
          </>
        )}

        {view==="howto"&&(
          <>
            <button onClick={()=>setView("menu")} style={{background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",marginBottom:10,padding:0}}>{T(lang,"backBtn",ui)}</button>
            <h3 style={{color:"#f1f5f9",fontSize:17,fontWeight:800,margin:"0 0 14px"}}>How to use GAKU</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:13,color:"#cbd5e1",lineHeight:1.7}}>
              <div><strong style={{color:C.purpleLight}}>📅 Schedule</strong> — Weekly tasks. Tap to check off.</div>
              <div><strong style={{color:C.teal}}>📚 Vocabulary</strong> — Search any Japanese word/topic. Get vocab, hints, flashcards, games, skill practice.</div>
              <div><strong style={{color:C.amber}}>🔗 Resources</strong> — Curated links for your skills.</div>
              <div><strong style={{color:C.red}}>🏆 Milestones</strong> — Your goal roadmap.</div>
              <div><strong style={{color:C.teal}}>🎮 Fun Activity</strong> — AI activity based on your level and interests.</div>
              <div><strong style={{color:C.amber}}>🆘 Help</strong> — Today's plan or find resources for anything you want to do.</div>
            </div>
          </>
        )}

        {view==="lesson"&&!result&&(
          <>
            <button onClick={()=>setView("menu")} style={{background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",marginBottom:10,padding:0}}>{T(lang,"backBtn",ui)}</button>
            <h3 style={{color:"#f1f5f9",fontSize:17,fontWeight:800,margin:"0 0 18px"}}>{T(lang,"howFeeling",ui)}</h3>
            <label style={S.label}>{T(lang,"moodLabel",ui)}</label>
            <select value={mood} onChange={e=>setMood(e.target.value)} style={{...S.select,marginBottom:10}}>
              <option value="">Select...</option>
              <option value="motivated and energetic">😤 Motivated & energetic</option>
              <option value="okay, normal day">😐 Okay, normal day</option>
              <option value="tired and low energy">😴 Tired & low energy</option>
              <option value="stressed or anxious">😰 Stressed or anxious</option>
              <option value="happy and relaxed">😊 Happy & relaxed</option>
            </select>
            <label style={S.label}>{T(lang,"timeLabel",ui)}</label>
            <select value={time} onChange={e=>setTime(e.target.value)} style={{...S.select,marginBottom:10}}>
              <option value="">Select...</option>
              <option value="10">10 min</option><option value="20">20 min</option>
              <option value="30">30 min</option><option value="60">1 hour</option><option value="90">1.5 hours+</option>
            </select>
            <label style={S.label}>{T(lang,"energyLabel",ui)}</label>
            <select value={energy} onChange={e=>setEnergy(e.target.value)} style={{...S.select,marginBottom:14}}>
              <option value="">Select...</option>
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌙 Low</option>
            </select>
            <div onClick={()=>setWantDiff(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:wantDiff?"rgba(168,85,247,0.08)":C.card,border:`1px solid ${wantDiff?C.purpleLight:C.border}`,marginBottom:wantDiff?10:14,cursor:"pointer"}}>
              <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${wantDiff?C.purpleLight:C.border}`,background:wantDiff?C.purpleLight:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {wantDiff&&<span style={{color:"#fff",fontSize:10,fontWeight:900}}>✓</span>}
              </div>
              <p style={{color:"#cbd5e1",fontSize:13,margin:0}}>{T(lang,"differentToday",ui)}</p>
            </div>
            {wantDiff&&(
              <div style={{marginBottom:14}}>
                <label style={S.label}>{T(lang,"whatToday",ui)}</label>
                <input value={diffRequest} onChange={e=>setDiffRequest(e.target.value)} placeholder="e.g. watch anime and learn new words, read Japanese news..." style={S.input}/>
              </div>
            )}
            <button onClick={getHelp} disabled={!mood||!time||!energy||loading||(wantDiff&&!diffRequest.trim())}
              style={{...S.btn,width:"100%",background:(mood&&time&&energy&&(!wantDiff||diffRequest.trim()))?`linear-gradient(135deg,${C.amber},#d97706)`:"#1e293b",color:(mood&&time&&energy&&(!wantDiff||diffRequest.trim()))?"#fff":"#475569"}}>
              {loading?T(lang,"searchingWeb",ui):T(lang,"getPlane",ui)}
            </button>
          </>
        )}

        {view==="lesson"&&result&&(
          <>
            <div style={{background:"rgba(245,158,11,0.08)",borderLeft:`3px solid ${C.amber}`,borderRadius:8,padding:"14px 16px",marginBottom:14}}>
              <p style={{color:"#f1f5f9",fontSize:13,lineHeight:1.8,margin:0}}>{result}</p>
            </div>
            {webResults.length>0&&(
              <div style={{marginBottom:14}}>
                <p style={{color:C.teal,fontSize:12,fontWeight:700,marginBottom:10}}>{T(lang,"webResultsTitle",ui)}</p>
                {webResults.map((r,i)=>(
                  <div key={i} style={{...S.card,marginBottom:8}}>
                    <p style={{color:"#f1f5f9",fontSize:13,fontWeight:700,margin:"0 0 4px"}}>{r.name}</p>
                    <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 8px"}}>{r.desc}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",padding:8,background:`linear-gradient(135deg,${C.teal},#0891b2)`,color:"#fff",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none"}}>→ Open {r.name}</a>
                  </div>
                ))}
              </div>
            )}
            <button onClick={resetAll} style={{...S.btn,width:"100%",background:C.card,color:"#94a3b8",border:`1px solid ${C.border}`}}>{T(lang,"backToMenu",ui)}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FORM ────────────────────────────────────────────────────────────────────────
function FormScreen({ onSubmit, onBack, initialJlpt, initialForm }) {
  const STANDARD_GOALS = ["Pass JLPT N5","Pass JLPT N4","Pass JLPT N3","Pass JLPT N2","Pass JLPT N1","Get a job in Japan","Travel to Japan","Study abroad in Japan","Daily conversation"];
  const [form, setForm] = useState(() => {
    if(initialForm){
      const isStd = STANDARD_GOALS.includes(initialForm.goal);
      return {...initialForm,goal:isStd?initialForm.goal:"Other",customGoal:isStd?"":(initialForm.goal||"")};
    }
    return {name:"",email:"",country:"",preferredLang:"English",goal:"",customGoal:"",timeline:"",jlpt:initialJlpt||"",hoursPerDay:"",daysPerWeek:"",skills:[]};
  });
  const [err, setErr] = useState("");
  const lang = form.preferredLang || "English";
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleSkill = (s) => setForm(f=>({...f,skills:f.skills.includes(s)?f.skills.filter(x=>x!==s):[...f.skills,s]}));
  const isOther = form.goal==="Other";
  const valid = form.name&&form.email&&form.country&&form.goal&&(isOther?form.customGoal.trim():true)&&form.timeline&&form.jlpt&&form.hoursPerDay&&form.daysPerWeek&&form.skills.length>0;

  return (
    <div style={{...S.page,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        {onBack&&<button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",fontSize:13,cursor:"pointer",marginBottom:16,padding:0}}>← Back</button>}
        <p style={{color:C.purpleLight,fontSize:11,fontWeight:700,letterSpacing:2,marginBottom:4}}>GAKU SELF-STUDY APP</p>
        <h1 style={{fontSize:24,fontWeight:900,margin:"0 0 4px"}}>{initialForm?"Edit Your Profile":"Your Learning Profile"}</h1>
        <p style={{color:"#64748b",fontSize:13,marginBottom:24}}>{initialForm?"Update only what you'd like to change.":"Tell us about yourself to build your personalized CLT study plan"}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={S.label}>YOUR NAME *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Tanaka Yuki" style={S.input}/></div>
          <div><label style={S.label}>EMAIL *</label><input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="your@email.com" type="email" style={S.input}/></div>
          <div><label style={S.label}>COUNTRY *</label><input value={form.country} onChange={e=>set("country",e.target.value)} placeholder="e.g. USA, Brazil, Japan..." style={S.input}/></div>
          <div>
            <label style={S.label}>YOUR NATIVE LANGUAGE? (What language do you prefer to communicate in?)</label>
            <select value={form.preferredLang} onChange={e=>set("preferredLang",e.target.value)} style={S.select}>
              {LANGUAGES.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>FINAL GOAL *</label>
            <select value={form.goal} onChange={e=>set("goal",e.target.value)} style={S.select}>
              <option value="">Select your goal</option>
              <option>Pass JLPT N5</option><option>Pass JLPT N4</option><option>Pass JLPT N3</option>
              <option>Pass JLPT N2</option><option>Pass JLPT N1</option>
              <option>Get a job in Japan</option><option>Travel to Japan</option>
              <option>Study abroad in Japan</option><option>Daily conversation</option><option>Other</option>
            </select>
            {isOther&&<input value={form.customGoal} onChange={e=>set("customGoal",e.target.value)} placeholder="Describe your goal..." style={{...S.input,marginTop:8}}/>}
          </div>
          <div>
            <label style={S.label}>WHEN DO YOU WANT TO ACHIEVE IT? *</label>
            <select value={form.timeline} onChange={e=>set("timeline",e.target.value)} style={S.select}>
              <option value="">Select timeline</option>
              <option>Less than 6 months</option><option>Within 1 year</option><option>2–3 years</option><option>Over 3 years</option>
            </select>
          </div>
          <div>
            <label style={S.label}>CURRENT JLPT LEVEL *</label>
            <select value={form.jlpt} onChange={e=>set("jlpt",e.target.value)} style={S.select}>
              <option value="">Select level</option>
              <option>Beginner</option><option>N5</option><option>N4</option><option>N3</option><option>N2</option><option>N1</option>
            </select>
          </div>
          <div>
            <label style={S.label}>STUDY TIME PER DAY *</label>
            <select value={form.hoursPerDay} onChange={e=>set("hoursPerDay",e.target.value)} style={S.select}>
              <option value="">Select hours</option>
              <option>Less than 1 hour</option><option>1–2 hours</option><option>2–3 hours</option><option>3+ hours</option>
            </select>
          </div>
          <div>
            <label style={S.label}>DAYS PER WEEK *</label>
            <select value={form.daysPerWeek} onChange={e=>set("daysPerWeek",e.target.value)} style={S.select}>
              <option value="">Select days</option>
              <option>1–2 days</option><option>3–4 days</option><option>5–6 days</option><option>Every day</option>
            </select>
          </div>
          <div>
            <label style={S.label}>WHAT DO YOU WANT TO STUDY? * (select all that apply)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {Object.entries(SKILL_LABELS).map(([k,v])=>(
                <button key={k} onClick={()=>toggleSkill(k)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${form.skills.includes(k)?C.purpleLight:C.border}`,background:form.skills.includes(k)?"rgba(168,85,247,0.15)":C.card,color:form.skills.includes(k)?C.purpleLight:"#94a3b8",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
        {err&&<p style={{color:C.red,fontSize:12,margin:"12px 0 0",textAlign:"center"}}>{err}</p>}
        <button onClick={()=>{if(!valid){setErr("Please fill in all required fields and select at least one skill.");return;}onSubmit({...form,goal:isOther?form.customGoal:form.goal});}}
          style={{...S.btn,width:"100%",marginTop:20,background:valid?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b",color:valid?"#fff":"#475569"}}>
          {initialForm?"Save Changes →":"Build My Study Plan →"}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────────
function Dashboard({ form, onEdit }) {
  const lang = form.preferredLang || "English";
  const [ui, setUi] = useState(null); // dynamic translations for non-hardcoded langs
  const [schedule, setSchedule] = useState(() => buildSchedule(form));
  const [milestones] = useState(() => buildMilestones(form));
  const [msDone, setMsDone] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [tab, setTab] = useState("schedule");

  // Load translations for unsupported languages
  useEffect(() => {
    if (!UI_STRINGS[lang]) {
      translateUI(lang, UI_STRINGS).then(translated => { if(translated) setUi(translated); });
    }
  }, [lang]);

  const toggleTask = useCallback((day, idx) => {
    setSchedule(prev => ({...prev,[day]:prev[day].map((t,i)=>i===idx?{...t,done:!t.done}:t)}));
  }, []);

  const totalTasks = Object.values(schedule).flat().filter(t=>!t.rest).length;
  const doneTasks = Object.values(schedule).flat().filter(t=>t.done&&!t.rest).length;
  const progress = totalTasks ? Math.round(doneTasks/totalTasks*100) : 0;
  const selectedResources = (form.skills||[]).flatMap(s=>(RESOURCES[s]||[]).map(r=>({...r,skill:s})));
  const skills = form.skills || [];

  const TABS = [
    {id:"schedule",label:T(lang,"schedule",ui)},
    {id:"vocabulary",label:T(lang,"vocabulary",ui)},
    {id:"resources",label:T(lang,"resources",ui)},
    {id:"milestones",label:T(lang,"milestones",ui)},
    {id:"fun",label:T(lang,"funActivity",ui)},
  ];

  const getDayLabel = (dayKey) => T(lang, dayKey, ui);

  return (
    <div style={{...S.page,paddingBottom:60}}>
      {showHelp&&<HelpModal onClose={()=>setShowHelp(false)} form={form} ui={ui}/>}
      <div style={{background:"rgba(10,15,30,0.95)",borderBottom:`1px solid ${C.border}`,padding:"14px 20px",position:"sticky",top:0,zIndex:100,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{color:C.purpleLight,fontSize:10,fontWeight:700,letterSpacing:2,margin:0}}>GAKU SELF-STUDY</p>
          <p style={{color:"#f1f5f9",fontSize:14,fontWeight:800,margin:0}}>{form.name}{T(lang,"studyPlan",ui)}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowHelp(true)} style={{...S.btn,padding:"8px 14px",background:`linear-gradient(135deg,${C.amber},#d97706)`,color:"#fff",fontSize:12}}>{T(lang,"help",ui)}</button>
          <button onClick={onEdit} style={{...S.btn,padding:"8px 14px",background:C.card,color:"#94a3b8",border:`1px solid ${C.border}`,fontSize:12}}>{T(lang,"editProfile",ui)}</button>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <p style={{color:"#f1f5f9",fontSize:13,fontWeight:700,margin:0}}>{T(lang,"weeklyProgress",ui)}</p>
            <p style={{color:C.purpleLight,fontSize:13,fontWeight:800,margin:0}}>{doneTasks}/{totalTasks} · {progress}%</p>
          </div>
          <div style={{background:C.border,borderRadius:99,height:8}}>
            <div style={{width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${C.purple},${C.purpleLight})`,borderRadius:99,transition:"width 0.4s"}}/>
          </div>
          <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
            <p style={{color:"#64748b",fontSize:11,margin:0}}>{T(lang,"goal",ui)} {form.goal}</p>
            <p style={{color:"#64748b",fontSize:11,margin:0}}>{T(lang,"timeline",ui)} {form.timeline}</p>
            <p style={{color:"#64748b",fontSize:11,margin:0}}>{T(lang,"level",ui)} {form.jlpt}</p>
            <p style={{color:"#64748b",fontSize:11,margin:0}}>{T(lang,"lang",ui)} {form.preferredLang}</p>
          </div>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${tab===t.id?C.purpleLight:C.border}`,background:tab===t.id?"rgba(168,85,247,0.15)":C.card,color:tab===t.id?C.purpleLight:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="schedule"&&(
          <div style={{...S.card}}>
            <p style={{color:C.purpleLight,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:16}}>{T(lang,"scheduleTitle",ui)}</p>
            {DAY_KEYS.map(dayKey=>{
              const tasks = schedule[dayKey]||[];
              return (
                <div key={dayKey} style={{marginBottom:16}}>
                  <p style={{color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:1,borderBottom:`1px solid ${C.border}`,paddingBottom:6,marginBottom:8}}>
                    {getDayLabel(dayKey)}
                  </p>
                  {tasks.map((task,idx)=>task.rest?(
                    <p key={idx} style={{color:"#334155",fontSize:13,fontStyle:"italic"}}>{T(lang,"restDay",ui)}</p>
                  ):(
                    <div key={idx} onClick={()=>toggleTask(dayKey,idx)} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:10,background:task.done?"rgba(34,197,94,0.06)":C.card,border:`1px solid ${task.done?"rgba(34,197,94,0.2)":C.border}`,marginBottom:6,cursor:"pointer",alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${task.done?C.green:C.border}`,background:task.done?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        {task.done&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>✓</span>}
                      </div>
                      <p style={{color:task.done?"#64748b":"#cbd5e1",fontSize:13,margin:0,lineHeight:1.6,textDecoration:task.done?"line-through":"none"}}>{task.task}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {tab==="vocabulary"&&<VocabBuilder form={form} ui={ui}/>}

        {tab==="resources"&&(
          <div style={{...S.card}}>
            <p style={{color:C.amber,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:4}}>{T(lang,"resourcesTitle",ui)}</p>
            <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Level {form.jlpt} · {(form.skills||[]).join(", ")}</p>
            {selectedResources.length===0&&<p style={{color:"#64748b",fontSize:13}}>{T(lang,"noResources",ui)}</p>}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {selectedResources.map((r,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,border:`1px solid ${C.border}`,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <p style={{color:"#f1f5f9",fontSize:14,fontWeight:700,margin:0}}>{r.name}</p>
                    <span style={{color:r.free?C.green:C.amber,fontSize:10,fontWeight:700,background:r.free?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)",padding:"2px 8px",borderRadius:99}}>{r.free?"FREE":"PAID"}</span>
                  </div>
                  <p style={{color:C.purpleLight,fontSize:11,fontWeight:700,margin:"0 0 4px"}}>{SKILL_LABELS[r.skill]}</p>
                  <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 10px",lineHeight:1.6}}>{r.desc}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",padding:9,background:`linear-gradient(135deg,${C.purple},#9333ea)`,color:"#fff",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none"}}>→ Open {r.name}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="milestones"&&(
          <div style={{...S.card}}>
            <p style={{color:C.red,fontSize:12,fontWeight:700,letterSpacing:1,marginBottom:16}}>{T(lang,"roadmapTitle",ui)}</p>
            {milestones.map((m,i)=>(
              <div key={i} onClick={()=>setMsDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:12,background:msDone.includes(i)?"rgba(34,197,94,0.06)":C.card,border:`1px solid ${msDone.includes(i)?"rgba(34,197,94,0.2)":C.border}`,marginBottom:8,cursor:"pointer",alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:8,border:`2px solid ${msDone.includes(i)?C.green:C.border}`,background:msDone.includes(i)?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {msDone.includes(i)?<span style={{color:"#fff",fontWeight:900,fontSize:12}}>✓</span>:<span style={{color:"#475569",fontWeight:700,fontSize:11}}>{i+1}</span>}
                </div>
                <p style={{color:msDone.includes(i)?"#64748b":"#cbd5e1",fontSize:13,margin:0,lineHeight:1.6,textDecoration:msDone.includes(i)?"line-through":"none"}}>{m}</p>
              </div>
            ))}
            <div style={{marginTop:20,padding:16,background:"rgba(168,85,247,0.06)",borderRadius:12,textAlign:"center",border:`1px solid rgba(168,85,247,0.2)`}}>
              <p style={{fontSize:20,margin:"0 0 8px"}}>🌸</p>
              <p style={{color:"#f1f5f9",fontSize:13,fontWeight:700,margin:"0 0 6px"}}>You've got this!</p>
              <p style={{color:"#64748b",fontSize:12,lineHeight:1.7,margin:0}}>Every conversation, every sentence brings you closer. 頑張ってください！</p>
            </div>
            <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",padding:13,background:`linear-gradient(135deg,${C.amber},#d97706)`,color:"#fff",borderRadius:10,fontSize:14,fontWeight:700,textDecoration:"none",marginTop:16}}>
              Book a FREE Trial Lesson with GAKU →
            </a>
          </div>
        )}

        {tab==="fun"&&<FunActivity form={form} ui={ui}/>}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────────
export default function GakuApp({ onBack, initialJlpt }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("gaku_form"); if(saved) setForm(JSON.parse(saved)); } catch {} }, []);
  const handleSubmit = (f) => { setForm(f); setEditing(false); try { localStorage.setItem("gaku_form", JSON.stringify(f)); } catch {} };
  if(!form) return <FormScreen onSubmit={handleSubmit} onBack={onBack} initialJlpt={initialJlpt}/>;
  if(editing) return <FormScreen onSubmit={handleSubmit} onBack={()=>setEditing(false)} initialForm={form}/>;
  return <Dashboard form={form} onEdit={()=>setEditing(true)}/>;
}
