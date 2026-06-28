import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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
  select: { width:"100%", padding:"12px 14px", background:"#0f172a", border:`1.5px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: { padding:"13px 20px", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" },
  label: { display:"block", color:"#64748b", fontSize:11, fontWeight:700, marginBottom:5, letterSpacing:1 },
  input: { width:"100%", padding:"12px 14px", background:"#0f172a", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
};

// ─── CLT RESOURCES ─────────────────────────────────────────────────────────────
const RESOURCES = {
  pronunciation: [
    { name:"Anki (Japanese Decks)", desc:"Build phonetic recognition with audio flashcards. CLT: hear and repeat.", url:"https://ankiweb.net/shared/decks?search=japanese", free:true },
    { name:"Japanese Ammo with Misa", desc:"Practical example sentences and pronunciation drills. CLT-focused.", url:"https://www.youtube.com/@JapaneseAmmowithMisa", free:true },
    { name:"Onomappu", desc:"Japanese-only explanations. Comprehensible Input — CLT compatibility very high.", url:"https://www.youtube.com/@Onomappu", free:true },
  ],
  listening: [
    { name:"NHK World Lesson", desc:"Authentic NHK audio lessons. CLT input at natural pace.", url:"https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/", free:true },
    { name:"Erin's Challenge", desc:"Drama-based listening with real-life scenarios and role-play. CLT compatibility extremely high.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Structured listening practice. Watch and shadow for CLT output.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
    { name:"Nihongo con Teppei", desc:"Daily natural conversation podcast. Recommended by Japanese teachers worldwide.", url:"https://nihongoconteppei.com", free:true },
    { name:"YUYU Japanese Podcast", desc:"Natural speed, authentic materials. CLT-compatible listening at N3-N2.", url:"https://www.youtube.com/@yuyunihongopodcast", free:true },
    { name:"Japanese with Shun", desc:"Super clear Japanese. Comprehensible Input — N5-N4 level.", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true },
    { name:"Onomappu", desc:"Japanese-only podcast. Comprehensible Input, CLT compatibility very high. N4-N3.", url:"https://www.youtube.com/@Onomappu", free:true },
    { name:"Sambon Juku", desc:"Natural Japanese, real conversation expressions. N2-N1 level.", url:"https://www.youtube.com/@SambonJuku", free:true },
    { name:"Miku Real Japanese", desc:"Native-level conversation, real-life Japanese. High CLT compatibility.", url:"https://www.youtube.com/@mikunihongo", free:true },
    { name:"Akane Japanese Class", desc:"Natural conversation, Japanese culture, practical expressions. N4-N3.", url:"https://www.youtube.com/@Akane-JapaneseClass", free:true },
    { name:"Easy Japanese NHK", desc:"Real-world scenario setting, role-play. Very close to CLT research.", url:"https://www.nhk.or.jp/lesson/en/", free:true },
    { name:"Hilokal", desc:"Audio rooms and group conversation for real practice. CLT compatibility very high.", url:"https://hilokal.com", free:true },
  ],
  conversation: [
    { name:"NHK Japan — Learn Japanese", desc:"CLT-based conversational Japanese. Real-life scenario practice.", url:"https://www3.nhk.or.jp/nhkworld/en/learnjapanese/", free:true },
    { name:"Erin's Challenge", desc:"Interactive drama with real situations and role-play. CLT compatibility extremely high.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"MARUGOTO Plus", desc:"Japan Foundation's CEFR-based task-centered course. A1-B1. Represents CLT itself.", url:"https://a1.marugotoweb.jp/en/", free:true },
    { name:"IRODORI Japanese Online Course", desc:"One of the most CLT-aligned materials in current Japanese education. Life scenarios, role-play, task-based.", url:"https://www.irodori.jpf.go.jp/", free:true },
    { name:"HelloTalk", desc:"Real interaction with Japanese speakers. CLT level ★★★★★", url:"https://www.hellotalk.com/", free:true },
    { name:"Tandem", desc:"Language exchange. Real communication practice. CLT level ★★★★★", url:"https://www.tandem.net/", free:true },
    { name:"Hilokal", desc:"Audio rooms, group conversation, real practice. CLT compatibility very high.", url:"https://hilokal.com", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Conversational drills and cultural context. Shadow and repeat.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
    { name:"Japanese Ammo with Misa", desc:"Practical example sentences, conversation-focused. CLT-aligned.", url:"https://www.youtube.com/@JapaneseAmmowithMisa", free:true },
    { name:"Miku Real Japanese", desc:"Native-to-native conversation, real daily Japanese. High CLT compatibility.", url:"https://www.youtube.com/@mikunihongo", free:true },
    { name:"Let's Learn Japanese from Small Talk", desc:"Native-to-native conversation, authentic communication.", url:"https://www.youtube.com/@LetsLearnJapanese", free:true },
  ],
  jlpt: [
    { name:"Japanese Test 4 You — Vocabulary", desc:"JLPT vocabulary practice N5-N1. Test your word knowledge.", url:"https://japanesetest4you.com/jlpt-n5-vocabulary/", free:true },
    { name:"Japanese Test 4 You — Reading", desc:"JLPT reading comprehension N5-N1. Graded passages with questions.", url:"https://japanesetest4you.com/jlpt-n5-reading/", free:true },
    { name:"Japanese Test 4 You — Listening", desc:"JLPT listening practice N5-N1. Audio-based questions.", url:"https://japanesetest4you.com/jlpt-n5-listening/", free:true },
    { name:"Nihongo no Mori", desc:"Grammar-rich JLPT prep with natural conversation examples. N2-N1.", url:"https://www.youtube.com/@nihongonomori", free:true },
    { name:"Sambon Juku", desc:"JLPT N2-N1 grammar and vocabulary in natural context.", url:"https://www.youtube.com/@SambonJuku", free:true },
  ],
  reading: [
    { name:"Tadoku (Free Readers)", desc:"Graded reading from Level 0–4. CLT: read then discuss.", url:"https://tadoku.org/japanese/book-search/?level=&series=&kw=&order=register_desc", free:true },
    { name:"NHK Web Easy", desc:"Real Japanese news simplified. Perfect A2-B1 reading input. Authentic materials.", url:"https://news.web.nhk/news/easy/", free:true },
    { name:"FluencyDrop Stories", desc:"Authentic short stories with audio. Build reading fluency.", url:"https://fluencydrop.com/stories/japanese", free:true },
    { name:"IRODORI Japanese Online Course", desc:"Reading tasks based on daily life in Japan. CLT task-based.", url:"https://www.irodori.jpf.go.jp/", free:true },
    { name:"Japonin Teacher's Blog", desc:"Conversation-centered teaching materials with free audio. Reading + comprehension.", url:"https://japonin.com/", free:true },
    { name:"LingQ", desc:"Authentic materials — read and listen simultaneously. Build reading fluency.", url:"https://www.lingq.com/en/learn/ja/", free:false },
    { name:"NHK News Web (advanced)", desc:"Full-speed NHK news for N2-N1 readers. Authentic materials.", url:"https://www3.nhk.or.jp/news/", free:true },
  ],
  kanji: [
    { name:"Nihonten AI (Bilingual Kanji)", desc:"AI-powered personalized kanji with bilingual translation context.", url:"https://nihonten.ai/", free:false },
    { name:"IRODORI Japanese Online Course", desc:"Kanji introduced in real-life context. Task-based CLT approach.", url:"https://www.irodori.jpf.go.jp/", free:true },
    { name:"Nihongo no Mori", desc:"Systematic kanji instruction with vocabulary and usage examples. N2-N1.", url:"https://www.youtube.com/@nihongonomori", free:true },
  ],
  grammar: [
    { name:"Imabi", desc:"The most comprehensive free Japanese grammar reference online.", url:"https://imabi.org/", free:true },
    { name:"MARUGOTO Plus", desc:"Grammar taught through real communicative tasks. CEFR-based CLT.", url:"https://a1.marugotoweb.jp/en/", free:true },
    { name:"IRODORI Japanese Online Course", desc:"Grammar in daily-life task contexts. Closest to CLT in current Japanese education.", url:"https://www.irodori.jpf.go.jp/", free:true },
    { name:"Sambon Juku", desc:"Grammar in natural Japanese conversation. N2-N1 level.", url:"https://www.youtube.com/@SambonJuku", free:true },
    { name:"Nihongo no Mori", desc:"Structured grammar lessons with example sentences and JLPT focus.", url:"https://www.youtube.com/@nihongonomori", free:true },
    { name:"Japonin Teacher's Blog", desc:"Conversation-centered grammar materials with audio.", url:"https://japonin.com/", free:true },
  ],
};

// Level-based recommended resources
const LEVEL_RESOURCES = {
  "Beginner": [
    { name:"Japanese with Shun", descKey:"resShunDesc", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, levelKey:"resLevelN5N4", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
  ],
  "N5": [
    { name:"Japanese with Shun", descKey:"resShunDesc", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, levelKey:"resLevelN5N4", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", descKey:"resOnomappuDesc", url:"https://www.youtube.com/@Onomappu", free:true, levelKey:"resLevelN4N3", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
  ],
  "N4": [
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", descKey:"resOnomappuDesc", url:"https://www.youtube.com/@Onomappu", free:true, levelKey:"resLevelN4N3", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
    { name:"Nihongo con Teppei", descKey:"resTeppeiDesc", url:"https://nihongoconteppei.com", free:true, levelKey:"resLevelN3N2", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
  ],
  "N3": [
    { name:"Nihongo con Teppei", descKey:"resTeppeiDesc", url:"https://nihongoconteppei.com", free:true, levelKey:"resLevelN3N2", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"YUYU Japanese Podcast", descKey:"resYuyuDesc", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, levelKey:"resLevelN3N2", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
  ],
  "N2": [
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
    { name:"YUYU Japanese Podcast", descKey:"resYuyuDesc", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, levelKey:"resLevelN3N2", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
  ],
  "N1": [
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
  ],
};

const SKILL_LABELS = {
  pronunciation:"🔊 Pronunciation", listening:"👂 Listening", conversation:"💬 Conversation",
  jlpt:"🎯 JLPT Prep", reading:"📖 Reading", kanji:"🈳 Kanji", grammar:"📝 Grammar",
};

// ─── UI TRANSLATIONS ────────────────────────────────────────────────────────────
// Static translations for all major UI strings across all 6 tabs + form
const UI_TRANSLATIONS = {
  "English": {
    // Header / common
    gakuSelfStudy: "GAKU SELF-STUDY",
    studyPlan: "Study Plan",
    help: "🆘 Help",
    editProfile: "✏️ Edit Profile",
    weeklyProgress: "Weekly Progress",
    // Tab labels
    tabSchedule: "📅 Schedule",
    tabPractice: "🎯 Practice Set",
    tabVocabulary: "📚 Vocabulary",
    tabResources: "🔗 Resources",
    tabMilestones: "🏆 Milestones",
    // Schedule tab
    yourWeeklySchedule: "📅 YOUR WEEKLY STUDY SCHEDULE",
    restDay: "Rest day 🌸",
    monday: "MONDAY", tuesday: "TUESDAY", wednesday: "WEDNESDAY",
    thursday: "THURSDAY", friday: "FRIDAY", saturday: "SATURDAY", sunday: "SUNDAY",
    // Schedule task snippets
    vocabReview: "Vocabulary review — Anki or saved words (10 min)",
    speakAloud: "Speak aloud: summarize today's content in Japanese (5 min)",
    taskConversation: "Role-play or shadowing — CLT core",
    taskListening: "NHK World or JapanesePod101",
    taskReading: "Tadoku graded reader or NHK Web Easy",
    taskGrammar: "Imabi + write 3 example sentences",
    taskKanji: "Nihonten AI — 5 new kanji with context",
    taskJlpt: "Japanese Test 4 You — one practice section",
    taskPronunciation: "Anki audio cards — shadow 20 words",
    // Resources tab
    recommendedForLevel: "⭐ Recommended for Your Level",
    curatedFor: "Curated for level",
    yourResources: "🔗 YOUR RESOURCES",
    curatedForLevel: "Curated for level",
    skills: "skills:",
    openResource: "Open",
    noResources: "No resources. Please edit your profile and select study skills.",
    free: "FREE", paid: "PAID",
    // Resource skill star labels
    vocab: "Vocab", grammar: "Grammar", reading: "Reading", speaking: "Speaking", listening: "Listening",
    // Milestones tab
    yourGoalRoadmap: "🏆 YOUR GOAL ROADMAP",
    levelToGoal: "Level",
    goal: "Goal",
    youveGotThis: "You've got this!",
    motivationText: "Every conversation, every sentence, every word brings you closer. CLT is about real communication — and you're already doing it. 頑張ってください！",
    bookLesson: "Book a FREE Trial Lesson with GAKU →",
    weeksRemaining: "weeks remaining",
    percentComplete: "% complete",
    refresh: "🔄 Refresh",
    aiBuilding: "✨ AI is building your schedule...",
    personalizing: "Personalizing your plan based on your goal and progress...",
    // Help modal
    helpTitle: "🆘 HELP",
    whatWouldYouLike: "What would you like?",
    customizedLesson: "📋 Customized lesson for today",
    howToUse: "❓ How to use this app",
    back: "← Back",
    howAreYouFeeling: "How are you feeling today?",
    mood: "MOOD", moodPlaceholder: "Select...",
    moodMotivated: "😤 Motivated & energetic",
    moodOkay: "😐 Okay, normal day",
    moodTired: "😴 Tired & low energy",
    moodStressed: "😰 Stressed or anxious",
    moodHappy: "😊 Happy & relaxed",
    availableTime: "AVAILABLE TIME",
    energyLevel: "ENERGY LEVEL",
    energyHigh: "🔥 High — ready to challenge",
    energyMedium: "⚡ Medium — normal study",
    energyLow: "🌙 Low — light review only",
    wantsDifferent: "I want to do something different today",
    differentPlaceholder: "Tell us what you'd like to do today...",
    getTodaysPlan: "Get today's plan ✨",
    generating: "Generating...",
    tryAgain: "Try again",
    select: "Select...",
    tenMin: "10 minutes", twentyMin: "20 minutes", thirtyMin: "30 minutes",
    oneHour: "1 hour", oneHalfHour: "1.5 hours+",
    // Form labels
    formTitle: "Your Learning Profile",
    formEditTitle: "Edit Your Learning Profile",
    formSubtitle: "Tell us about yourself to build your personalized CLT study plan",
    formEditSubtitle: "Update any details below — your existing answers are kept until you change them.",
    backToMyPlan: "← Back to my plan",
    yourName: "YOUR NAME *",
    namePlaceholder: "e.g. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "your@email.com",
    country: "COUNTRY *",
    countryPlaceholder: "e.g. USA, Brazil, France...",
    yourNativeLanguage: "YOUR NATIVE LANGUAGE",
    finalGoal: "FINAL GOAL *",
    selectGoal: "Select your goal",
    goalN5: "Pass JLPT N5", goalN4: "Pass JLPT N4", goalN3: "Pass JLPT N3",
    goalN2: "Pass JLPT N2", goalN1: "Pass JLPT N1",
    goalJob: "Get a job in Japan", goalTravel: "Travel to Japan",
    goalStudyAbroad: "Study abroad in Japan", goalConversation: "Daily conversation",
    goalOther: "Other",
    whatDoYouWantToStudy: "WHAT DO YOU WANT TO STUDY?",
    customGoalPlaceholder: "Tell us what you'd like to study or achieve...",
    whenAchieve: "WHEN DO YOU WANT TO ACHIEVE IT? *",
    selectTimeline: "Select timeline",
    lessThan6: "Less than 6 months", within1: "Within 1 year",
    twoThreeYears: "2–3 years", over3: "Over 3 years",
    currentJlpt: "CURRENT JLPT LEVEL *",
    autoFilled: "Auto-filled from your test",
    changeLevel: "If you want to change your level, please select below.",
    selectLevel: "Select level",
    beginner: "Beginner",
    studyTimePerDay: "STUDY TIME PER DAY *",
    selectHours: "Select hours",
    lessThan1h: "Less than 1 hour", oneTwo: "1–2 hours",
    twoThree: "2–3 hours", threePlus: "3+ hours",
    daysPerWeek: "HOW MANY DAYS A WEEK DO YOU WANT TO STUDY? *",
    selectDays: "Select days",
    oneTwoDays: "1–2 days", threeFourDays: "3–4 days",
    fiveSixDays: "5–6 days", everyDay: "Every day",
    whatStudySkills: "WHAT DO YOU WANT TO STUDY? * (select all that apply)",
    writingNote: "✍️ Writing practice is available in the Writing tab for all users",
    saveChanges: "Save Changes →",
    buildPlan: "Build My Study Plan →",
    fillRequired: "Please fill in all required fields (*) and select at least one skill.",
    // Skill labels
    skillPronunciation: "🔊 Pronunciation", skillListening: "👂 Listening",
    skillConversation: "💬 Conversation", skillJlpt: "🎯 JLPT Prep",
    skillReading: "📖 Reading", skillKanji: "🈳 Kanji", skillGrammar: "📝 Grammar",
    // How to use
    howToTitle: "How to use this app",
    howToSchedule: "Your weekly study plan, broken into daily tasks. Tap a task to mark it done and track your weekly progress.",
    howToPractice: "AI-generated exercises based only on the skills you chose in your profile (e.g. listening, grammar, kanji). Tap 'Show answer' to check yourself.",
    howToVocab: "Search any topic to get level-appropriate words with example sentences, a visual association, and a CLT usage tip. Save words you want to remember.",
    howToResources: "Free (and some paid) tools matched to your selected skills — open them directly from here.",
    howToMilestones: "Your roadmap toward your goal. Tap each milestone as you complete it.",
    howToEditProfile: "Update your goals, level, schedule, or skills any time — your existing answers are kept so you only change what's needed.",
    howToHelp: "Get a personalized plan for today based on your mood, time and energy — or come back here anytime for this guide.",
      vocabBuilderTitle: "📚 VOCABULARY BUILDER",
    vocabBuilderDesc: "Enter a topic to see related words from the Japanese dictionary (English or 日本語 OK)",
    vocabSearchPlaceholder: "e.g. food, travel, emotions...",
    findWordsBtn: "Find Words",
    libraryLabel: "📚 Library",
    yourVocabSaved: "Your Vocabulary",
    savedSuffix: "saved",
    wordCardsLabel: "🃏 Word Cards",
    searchCreateCards: "Search & create cards",
    flashcardsLabel: "🎴 Flashcards",
    reviewSavedWords: "Review saved words",
    searchingDictionary: "Searching Japanese dictionary...",
    speakWord: "Pronounce word",
    speakExample: "Pronounce example",
    weblioDict: "📖 Weblio Dictionary",
    googleImages: "🖼 Google Images",
    detailCard: "🃏 Detail Card",
    retryBtn: "Retry",
    resShunDesc: "Beginner-friendly YouTube channel. Great for listening practice.",
    resMarugotoDesc: "Japan Foundation's beginner-intermediate course. Communicative learning method.",
    resOnomappuDesc: "YouTube channel for everyday conversation, slang, and culture, made fun.",
    resTeppeiDesc: "Intermediate-level podcast. Listen to natural-paced Japanese.",
    resYuyuDesc: "Intermediate-level YouTube podcast. Learn natural Japanese expressions.",
    resSambonDesc: "Upper-intermediate channel for grammar, vocabulary, and JLPT prep.",
    resLevelN5N4: "Beginner (N5–N4)",
    resLevelN4N3: "Beginner-Int. (N4–N3)",
    resLevelN3N2: "Intermediate (N3–N2)",
    resLevelN2N1: "Upper-Int. (N2–N1)",
    // Save Word modal
    saveWord: "Save Word",
    saveTitle: "Save",
    saveToYourVocab: "Add to Your Vocabulary",
    saveToYourVocabSub: "Your default vocabulary list",
    saveAddToFolder: "Add to Folder",
    saveAddToFolderSub: "Choose an existing folder",
    saveCreateFolder: "Create New Folder",
    saveCreateFolderSub: "Make a new folder for this word",
    saveCancel: "Cancel",
    saveChooseFolder: "Choose a folder",
    saveNoFolders: "No custom folders yet — create one first!",
    saveTo: "Save to",
    saveCreateAndSave: "Create & Save",
    saveFolderPlaceholder: "Folder name (e.g. かおりさん 授業)",
    saveBack: "← Back",
},

  "French": {
    gakuSelfStudy: "GAKU AUTO-APPRENTISSAGE",
    studyPlan: "Plan d'étude",
    help: "🆘 Aide",
    editProfile: "✏️ Modifier le profil",
    weeklyProgress: "Progression hebdomadaire",
    tabSchedule: "📅 Planning",
    tabPractice: "🎯 Exercices",
    tabVocabulary: "📚 Vocabulaire",
    tabResources: "🔗 Ressources",
    tabMilestones: "🏆 Objectifs",
    yourWeeklySchedule: "📅 VOTRE PLANNING D'ÉTUDE HEBDOMADAIRE",
    restDay: "Jour de repos 🌸",
    monday: "LUNDI", tuesday: "MARDI", wednesday: "MERCREDI",
    thursday: "JEUDI", friday: "VENDREDI", saturday: "SAMEDI", sunday: "DIMANCHE",
    vocabReview: "Révision de vocabulaire — Anki ou mots sauvegardés (10 min)",
    speakAloud: "À voix haute : résumer le contenu du jour en japonais (5 min)",
    taskConversation: "Jeu de rôle ou shadowing — base CLT",
    taskListening: "NHK World ou JapanesePod101",
    taskReading: "Lecteur gradué Tadoku ou NHK Web Easy",
    taskGrammar: "Imabi + écrire 3 phrases d'exemple",
    taskKanji: "Nihonten AI — 5 nouveaux kanji en contexte",
    taskJlpt: "Japanese Test 4 You — une section de pratique",
    taskPronunciation: "Cartes audio Anki — shadow 20 mots",
    recommendedForLevel: "⭐ Recommandé pour votre niveau",
    curatedFor: "Sélectionné pour le niveau",
    yourResources: "🔗 VOS RESSOURCES",
    curatedForLevel: "Sélectionné pour le niveau",
    skills: "compétences :",
    openResource: "Ouvrir",
    noResources: "Aucune ressource. Veuillez modifier votre profil et sélectionner des compétences.",
    free: "GRATUIT", paid: "PAYANT",
    vocab: "Vocab", grammar: "Grammaire", reading: "Lecture", speaking: "Expression orale", listening: "Écoute",
    yourGoalRoadmap: "🏆 VOTRE FEUILLE DE ROUTE",
    levelToGoal: "Niveau",
    goal: "Objectif",
    youveGotThis: "Vous pouvez le faire !",
    motivationText: "Chaque conversation, chaque phrase, chaque mot vous rapproche du but. La méthode CLT, c'est la vraie communication — et vous le faites déjà. 頑張ってください！",
    bookLesson: "Réservez une leçon d'essai GRATUITE avec GAKU →",
    weeksRemaining: "semaines restantes",
    percentComplete: "% terminé",
    refresh: "🔄 Actualiser",
    aiBuilding: "✨ L'IA prépare votre planning...",
    personalizing: "Personnalisation de votre plan selon vos objectifs et progrès...",
    helpTitle: "🆘 AIDE",
    whatWouldYouLike: "Que souhaitez-vous ?",
    customizedLesson: "📋 Leçon personnalisée pour aujourd'hui",
    howToUse: "❓ Comment utiliser cette application",
    back: "← Retour",
    howAreYouFeeling: "Comment vous sentez-vous aujourd'hui ?",
    mood: "HUMEUR", moodPlaceholder: "Sélectionner...",
    moodMotivated: "😤 Motivé(e) et énergique",
    moodOkay: "😐 Bien, journée normale",
    moodTired: "😴 Fatigué(e) et peu d'énergie",
    moodStressed: "😰 Stressé(e) ou anxieux(se)",
    moodHappy: "😊 Heureux(se) et détendu(e)",
    availableTime: "TEMPS DISPONIBLE",
    energyLevel: "NIVEAU D'ÉNERGIE",
    energyHigh: "🔥 Élevé — prêt(e) à se dépasser",
    energyMedium: "⚡ Moyen — étude normale",
    energyLow: "🌙 Faible — révision légère seulement",
    wantsDifferent: "Je veux faire quelque chose de différent aujourd'hui",
    differentPlaceholder: "Dites-nous ce que vous souhaitez faire aujourd'hui...",
    getTodaysPlan: "Obtenir le plan du jour ✨",
    generating: "Génération en cours...",
    tryAgain: "Réessayer",
    select: "Sélectionner...",
    tenMin: "10 minutes", twentyMin: "20 minutes", thirtyMin: "30 minutes",
    oneHour: "1 heure", oneHalfHour: "1h30+",
    formTitle: "Votre profil d'apprentissage",
    formEditTitle: "Modifier votre profil d'apprentissage",
    formSubtitle: "Parlez-nous de vous pour créer votre plan d'étude CLT personnalisé",
    formEditSubtitle: "Mettez à jour les informations ci-dessous — vos réponses existantes sont conservées jusqu'à ce que vous les modifiiez.",
    backToMyPlan: "← Retour à mon plan",
    yourName: "VOTRE NOM *",
    namePlaceholder: "ex. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "votre@email.com",
    country: "PAYS *",
    countryPlaceholder: "ex. France, Belgique, Canada...",
    yourNativeLanguage: "VOTRE LANGUE MATERNELLE",
    finalGoal: "OBJECTIF FINAL *",
    selectGoal: "Sélectionnez votre objectif",
    goalN5: "Réussir le JLPT N5", goalN4: "Réussir le JLPT N4", goalN3: "Réussir le JLPT N3",
    goalN2: "Réussir le JLPT N2", goalN1: "Réussir le JLPT N1",
    goalJob: "Trouver un emploi au Japon", goalTravel: "Voyager au Japon",
    goalStudyAbroad: "Étudier au Japon", goalConversation: "Conversation quotidienne",
    goalOther: "Autre",
    whatDoYouWantToStudy: "QUE SOUHAITEZ-VOUS ÉTUDIER ?",
    customGoalPlaceholder: "Dites-nous ce que vous souhaitez étudier ou accomplir...",
    whenAchieve: "QUAND SOUHAITEZ-VOUS Y PARVENIR ? *",
    selectTimeline: "Sélectionner une période",
    lessThan6: "Moins de 6 mois", within1: "Dans 1 an",
    twoThreeYears: "2–3 ans", over3: "Plus de 3 ans",
    currentJlpt: "NIVEAU JLPT ACTUEL *",
    autoFilled: "Rempli automatiquement depuis votre test",
    changeLevel: "Si vous souhaitez changer votre niveau, veuillez sélectionner ci-dessous.",
    selectLevel: "Sélectionner le niveau",
    beginner: "Débutant",
    studyTimePerDay: "TEMPS D'ÉTUDE PAR JOUR *",
    selectHours: "Sélectionner les heures",
    lessThan1h: "Moins d'1 heure", oneTwo: "1–2 heures",
    twoThree: "2–3 heures", threePlus: "3+ heures",
    daysPerWeek: "COMBIEN DE JOURS PAR SEMAINE VOULEZ-VOUS ÉTUDIER ? *",
    selectDays: "Sélectionner les jours",
    oneTwoDays: "1–2 jours", threeFourDays: "3–4 jours",
    fiveSixDays: "5–6 jours", everyDay: "Tous les jours",
    whatStudySkills: "QUE SOUHAITEZ-VOUS ÉTUDIER ? * (sélectionnez tout ce qui s'applique)",
    writingNote: "✍️ La pratique de l'écriture est disponible dans l'onglet Écriture pour tous les utilisateurs",
    saveChanges: "Enregistrer les modifications →",
    buildPlan: "Construire mon plan d'étude →",
    fillRequired: "Veuillez remplir tous les champs obligatoires (*) et sélectionner au moins une compétence.",
    skillPronunciation: "🔊 Prononciation", skillListening: "👂 Écoute",
    skillConversation: "💬 Conversation", skillJlpt: "🎯 Préparation JLPT",
    skillReading: "📖 Lecture", skillKanji: "🈳 Kanji", skillGrammar: "📝 Grammaire",
    howToTitle: "Comment utiliser cette application",
    howToSchedule: "Votre plan d'étude hebdomadaire, divisé en tâches quotidiennes. Appuyez sur une tâche pour la marquer comme faite.",
    howToPractice: "Exercices générés par l'IA basés sur les compétences choisies dans votre profil. Appuyez sur 'Voir la réponse' pour vous corriger.",
    howToVocab: "Recherchez n'importe quel sujet pour obtenir des mots adaptés à votre niveau avec des phrases d'exemple. Sauvegardez les mots à retenir.",
    howToResources: "Outils gratuits (et certains payants) correspondant à vos compétences sélectionnées.",
    howToMilestones: "Votre feuille de route vers votre objectif. Cochez chaque étape franchie.",
    howToEditProfile: "Mettez à jour vos objectifs, niveau, planning ou compétences à tout moment.",
    howToHelp: "Obtenez un plan personnalisé pour aujourd'hui selon votre humeur, votre temps et votre énergie.",
      vocabBuilderTitle: "📚 CRÉATEUR DE VOCABULAIRE",
    vocabBuilderDesc: "Entrez un sujet pour voir les mots associés du dictionnaire japonais (English ou 日本語 OK)",
    vocabSearchPlaceholder: "ex. nourriture, voyage, émotions...",
    findWordsBtn: "Trouver des mots",
    libraryLabel: "📚 Bibliothèque",
    yourVocabSaved: "Votre vocabulaire",
    savedSuffix: "enregistrés",
    wordCardsLabel: "🃏 Cartes de mots",
    searchCreateCards: "Rechercher et créer des cartes",
    flashcardsLabel: "🎴 Cartes mémo",
    reviewSavedWords: "Réviser les mots enregistrés",
    searchingDictionary: "Recherche dans le dictionnaire japonais...",
    speakWord: "Prononcer le mot",
    speakExample: "Prononcer l'exemple",
    weblioDict: "📖 Dictionnaire Weblio",
    googleImages: "🖼 Images Google",
    detailCard: "🃏 Carte détaillée",
    retryBtn: "Réessayer",
    resShunDesc: "Chaîne YouTube pour débutants. Idéale pour la pratique de l'écoute.",
    resMarugotoDesc: "Cours débutant-intermédiaire de la Japan Foundation. Méthode communicative.",
    resOnomappuDesc: "Chaîne YouTube ludique sur la conversation quotidienne, l'argot et la culture.",
    resTeppeiDesc: "Podcast de niveau intermédiaire. Écoutez un japonais au rythme naturel.",
    resYuyuDesc: "Podcast YouTube de niveau intermédiaire. Apprenez des expressions naturelles.",
    resSambonDesc: "Chaîne de niveau intermédiaire avancé pour la grammaire, le vocabulaire et le JLPT.",
    resLevelN5N4: "Débutant (N5–N4)",
    resLevelN4N3: "Déb.-Inter. (N4–N3)",
    resLevelN3N2: "Intermédiaire (N3–N2)",
    resLevelN2N1: "Inter. avancé (N2–N1)",
},

  "Spanish": {
    gakuSelfStudy: "GAKU AUTOAPRENDIZAJE",
    studyPlan: "Plan de estudio",
    help: "🆘 Ayuda",
    editProfile: "✏️ Editar perfil",
    weeklyProgress: "Progreso semanal",
    tabSchedule: "📅 Horario",
    tabPractice: "🎯 Ejercicios",
    tabVocabulary: "📚 Vocabulario",
    tabResources: "🔗 Recursos",
    tabMilestones: "🏆 Metas",
    yourWeeklySchedule: "📅 TU HORARIO DE ESTUDIO SEMANAL",
    restDay: "Día de descanso 🌸",
    monday: "LUNES", tuesday: "MARTES", wednesday: "MIÉRCOLES",
    thursday: "JUEVES", friday: "VIERNES", saturday: "SÁBADO", sunday: "DOMINGO",
    vocabReview: "Repaso de vocabulario — Anki o palabras guardadas (10 min)",
    speakAloud: "En voz alta: resume el contenido de hoy en japonés (5 min)",
    taskConversation: "Juego de rol o shadowing — base CLT",
    taskListening: "NHK World o JapanesePod101",
    taskReading: "Lector graduado Tadoku o NHK Web Easy",
    taskGrammar: "Imabi + escribir 3 frases de ejemplo",
    taskKanji: "Nihonten AI — 5 nuevos kanji en contexto",
    taskJlpt: "Japanese Test 4 You — una sección de práctica",
    taskPronunciation: "Tarjetas de audio Anki — shadowing 20 palabras",
    recommendedForLevel: "⭐ Recomendado para tu nivel",
    curatedFor: "Seleccionado para el nivel",
    yourResources: "🔗 TUS RECURSOS",
    curatedForLevel: "Seleccionado para el nivel",
    skills: "habilidades:",
    openResource: "Abrir",
    noResources: "No hay recursos. Edita tu perfil y selecciona habilidades de estudio.",
    free: "GRATIS", paid: "PAGO",
    vocab: "Vocab", grammar: "Gramática", reading: "Lectura", speaking: "Expresión oral", listening: "Escucha",
    yourGoalRoadmap: "🏆 TU HOJA DE RUTA",
    levelToGoal: "Nivel",
    goal: "Meta",
    youveGotThis: "¡Tú puedes!",
    motivationText: "Cada conversación, cada frase, cada palabra te acerca más. CLT es sobre comunicación real — y ya lo estás haciendo. 頑張ってください！",
    bookLesson: "Reserva una lección de prueba GRATIS con GAKU →",
    weeksRemaining: "semanas restantes",
    percentComplete: "% completado",
    refresh: "🔄 Actualizar",
    aiBuilding: "✨ La IA está construyendo tu horario...",
    personalizing: "Personalizando tu plan según tu objetivo y progreso...",
    helpTitle: "🆘 AYUDA",
    whatWouldYouLike: "¿Qué te gustaría?",
    customizedLesson: "📋 Lección personalizada para hoy",
    howToUse: "❓ Cómo usar esta aplicación",
    back: "← Atrás",
    howAreYouFeeling: "¿Cómo te sientes hoy?",
    mood: "ESTADO DE ÁNIMO", moodPlaceholder: "Seleccionar...",
    moodMotivated: "😤 Motivado/a y con energía",
    moodOkay: "😐 Bien, día normal",
    moodTired: "😴 Cansado/a y con poca energía",
    moodStressed: "😰 Estresado/a o ansioso/a",
    moodHappy: "😊 Feliz y relajado/a",
    availableTime: "TIEMPO DISPONIBLE",
    energyLevel: "NIVEL DE ENERGÍA",
    energyHigh: "🔥 Alto — listo/a para desafiarse",
    energyMedium: "⚡ Medio — estudio normal",
    energyLow: "🌙 Bajo — solo repaso ligero",
    wantsDifferent: "Quiero hacer algo diferente hoy",
    differentPlaceholder: "Cuéntanos qué te gustaría hacer hoy...",
    getTodaysPlan: "Obtener el plan de hoy ✨",
    generating: "Generando...",
    tryAgain: "Intentar de nuevo",
    select: "Seleccionar...",
    tenMin: "10 minutos", twentyMin: "20 minutos", thirtyMin: "30 minutos",
    oneHour: "1 hora", oneHalfHour: "1,5 horas+",
    formTitle: "Tu perfil de aprendizaje",
    formEditTitle: "Editar tu perfil de aprendizaje",
    formSubtitle: "Cuéntanos sobre ti para crear tu plan de estudio CLT personalizado",
    formEditSubtitle: "Actualiza los detalles a continuación — tus respuestas existentes se conservan hasta que las cambies.",
    backToMyPlan: "← Volver a mi plan",
    yourName: "TU NOMBRE *",
    namePlaceholder: "ej. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "tu@email.com",
    country: "PAÍS *",
    countryPlaceholder: "ej. España, México, Argentina...",
    yourNativeLanguage: "TU IDIOMA NATIVO",
    finalGoal: "OBJETIVO FINAL *",
    selectGoal: "Selecciona tu objetivo",
    goalN5: "Aprobar el JLPT N5", goalN4: "Aprobar el JLPT N4", goalN3: "Aprobar el JLPT N3",
    goalN2: "Aprobar el JLPT N2", goalN1: "Aprobar el JLPT N1",
    goalJob: "Conseguir trabajo en Japón", goalTravel: "Viajar a Japón",
    goalStudyAbroad: "Estudiar en Japón", goalConversation: "Conversación diaria",
    goalOther: "Otro",
    whatDoYouWantToStudy: "¿QUÉ QUIERES ESTUDIAR?",
    customGoalPlaceholder: "Cuéntanos qué te gustaría estudiar o lograr...",
    whenAchieve: "¿CUÁNDO QUIERES LOGRARLO? *",
    selectTimeline: "Seleccionar período",
    lessThan6: "Menos de 6 meses", within1: "En 1 año",
    twoThreeYears: "2–3 años", over3: "Más de 3 años",
    currentJlpt: "NIVEL JLPT ACTUAL *",
    autoFilled: "Completado automáticamente desde tu prueba",
    changeLevel: "Si deseas cambiar tu nivel, selecciona a continuación.",
    selectLevel: "Seleccionar nivel",
    beginner: "Principiante",
    studyTimePerDay: "TIEMPO DE ESTUDIO POR DÍA *",
    selectHours: "Seleccionar horas",
    lessThan1h: "Menos de 1 hora", oneTwo: "1–2 horas",
    twoThree: "2–3 horas", threePlus: "3+ horas",
    daysPerWeek: "¿CUÁNTOS DÍAS A LA SEMANA QUIERES ESTUDIAR? *",
    selectDays: "Seleccionar días",
    oneTwoDays: "1–2 días", threeFourDays: "3–4 días",
    fiveSixDays: "5–6 días", everyDay: "Todos los días",
    whatStudySkills: "¿QUÉ QUIERES ESTUDIAR? * (selecciona todo lo que aplique)",
    writingNote: "✍️ La práctica de escritura está disponible en la pestaña Escritura para todos los usuarios",
    saveChanges: "Guardar cambios →",
    buildPlan: "Construir mi plan de estudio →",
    fillRequired: "Por favor completa todos los campos obligatorios (*) y selecciona al menos una habilidad.",
    skillPronunciation: "🔊 Pronunciación", skillListening: "👂 Escucha",
    skillConversation: "💬 Conversación", skillJlpt: "🎯 Preparación JLPT",
    skillReading: "📖 Lectura", skillKanji: "🈳 Kanji", skillGrammar: "📝 Gramática",
    howToTitle: "Cómo usar esta aplicación",
    howToSchedule: "Tu plan de estudio semanal, dividido en tareas diarias. Toca una tarea para marcarla como completada.",
    howToPractice: "Ejercicios generados por IA basados en las habilidades que elegiste. Toca 'Ver respuesta' para comprobar.",
    howToVocab: "Busca cualquier tema para obtener palabras apropiadas para tu nivel con frases de ejemplo. Guarda las palabras que quieras recordar.",
    howToResources: "Herramientas gratuitas (y algunas de pago) que coinciden con tus habilidades seleccionadas.",
    howToMilestones: "Tu hoja de ruta hacia tu objetivo. Toca cada hito cuando lo completes.",
    howToEditProfile: "Actualiza tus objetivos, nivel, horario o habilidades en cualquier momento.",
    howToHelp: "Obtén un plan personalizado para hoy según tu estado de ánimo, tiempo y energía.",
      vocabBuilderTitle: "📚 CONSTRUCTOR DE VOCABULARIO",
    vocabBuilderDesc: "Introduce un tema para ver palabras relacionadas del diccionario japonés (English o 日本語 OK)",
    vocabSearchPlaceholder: "ej. comida, viajes, emociones...",
    findWordsBtn: "Buscar palabras",
    libraryLabel: "📚 Biblioteca",
    yourVocabSaved: "Tu vocabulario",
    savedSuffix: "guardadas",
    wordCardsLabel: "🃏 Tarjetas de palabras",
    searchCreateCards: "Buscar y crear tarjetas",
    flashcardsLabel: "🎴 Tarjetas didácticas",
    reviewSavedWords: "Repasar palabras guardadas",
    searchingDictionary: "Buscando en el diccionario japonés...",
    speakWord: "Pronunciar palabra",
    speakExample: "Pronunciar ejemplo",
    weblioDict: "📖 Diccionario Weblio",
    googleImages: "🖼 Imágenes de Google",
    detailCard: "🃏 Tarjeta detallada",
    retryBtn: "Reintentar",
    resShunDesc: "Canal de YouTube para principiantes. Ideal para practicar la escucha.",
    resMarugotoDesc: "Curso básico-intermedio de la Japan Foundation. Método comunicativo.",
    resOnomappuDesc: "Canal de YouTube divertido sobre conversación diaria, jerga y cultura.",
    resTeppeiDesc: "Podcast de nivel intermedio. Escucha japonés a ritmo natural.",
    resYuyuDesc: "Podcast de YouTube de nivel intermedio. Aprende expresiones naturales.",
    resSambonDesc: "Canal intermedio-avanzado de gramática, vocabulario y preparación JLPT.",
    resLevelN5N4: "Principiante (N5–N4)",
    resLevelN4N3: "Princ.-Inter. (N4–N3)",
    resLevelN3N2: "Intermedio (N3–N2)",
    resLevelN2N1: "Inter. avanzado (N2–N1)",
},

  "Portuguese": {
    gakuSelfStudy: "GAKU AUTO-ESTUDO",
    studyPlan: "Plano de estudo",
    help: "🆘 Ajuda",
    editProfile: "✏️ Editar perfil",
    weeklyProgress: "Progresso semanal",
    tabSchedule: "📅 Agenda",
    tabPractice: "🎯 Exercícios",
    tabVocabulary: "📚 Vocabulário",
    tabResources: "🔗 Recursos",
    tabMilestones: "🏆 Metas",
    yourWeeklySchedule: "📅 SUA AGENDA DE ESTUDOS SEMANAL",
    restDay: "Dia de descanso 🌸",
    monday: "SEGUNDA", tuesday: "TERÇA", wednesday: "QUARTA",
    thursday: "QUINTA", friday: "SEXTA", saturday: "SÁBADO", sunday: "DOMINGO",
    vocabReview: "Revisão de vocabulário — Anki ou palavras salvas (10 min)",
    speakAloud: "Em voz alta: resume o conteúdo de hoje em japonês (5 min)",
    taskConversation: "Role-play ou shadowing — base CLT",
    taskListening: "NHK World ou JapanesePod101",
    taskReading: "Leitor graduado Tadoku ou NHK Web Easy",
    taskGrammar: "Imabi + escrever 3 frases de exemplo",
    taskKanji: "Nihonten AI — 5 novos kanji em contexto",
    taskJlpt: "Japanese Test 4 You — uma seção de prática",
    taskPronunciation: "Cartões de áudio Anki — shadowing 20 palavras",
    recommendedForLevel: "⭐ Recomendado para o seu nível",
    curatedFor: "Selecionado para o nível",
    yourResources: "🔗 SEUS RECURSOS",
    curatedForLevel: "Selecionado para o nível",
    skills: "habilidades:",
    openResource: "Abrir",
    noResources: "Sem recursos. Edite seu perfil e selecione habilidades de estudo.",
    free: "GRÁTIS", paid: "PAGO",
    vocab: "Vocab", grammar: "Gramática", reading: "Leitura", speaking: "Expressão oral", listening: "Escuta",
    yourGoalRoadmap: "🏆 SEU ROTEIRO DE METAS",
    levelToGoal: "Nível",
    goal: "Meta",
    youveGotThis: "Você consegue!",
    motivationText: "Cada conversa, cada frase, cada palavra te aproxima mais. CLT é sobre comunicação real — e você já está fazendo isso. 頑張ってください！",
    bookLesson: "Reserve uma aula experimental GRÁTIS com GAKU →",
    weeksRemaining: "semanas restantes",
    percentComplete: "% concluído",
    refresh: "🔄 Atualizar",
    aiBuilding: "✨ A IA está construindo sua programação...",
    personalizing: "Personalizando seu plano com base no seu objetivo e progresso...",
    helpTitle: "🆘 AJUDA",
    whatWouldYouLike: "O que você gostaria?",
    customizedLesson: "📋 Aula personalizada para hoje",
    howToUse: "❓ Como usar este aplicativo",
    back: "← Voltar",
    howAreYouFeeling: "Como você está se sentindo hoje?",
    mood: "HUMOR", moodPlaceholder: "Selecionar...",
    moodMotivated: "😤 Motivado/a e com energia",
    moodOkay: "😐 Bem, dia normal",
    moodTired: "😴 Cansado/a e com pouca energia",
    moodStressed: "😰 Estressado/a ou ansioso/a",
    moodHappy: "😊 Feliz e relaxado/a",
    availableTime: "TEMPO DISPONÍVEL",
    energyLevel: "NÍVEL DE ENERGIA",
    energyHigh: "🔥 Alto — pronto/a para se desafiar",
    energyMedium: "⚡ Médio — estudo normal",
    energyLow: "🌙 Baixo — apenas revisão leve",
    wantsDifferent: "Quero fazer algo diferente hoje",
    differentPlaceholder: "Conta-nos o que você gostaria de fazer hoje...",
    getTodaysPlan: "Obter o plano de hoje ✨",
    generating: "Gerando...",
    tryAgain: "Tentar novamente",
    select: "Selecionar...",
    tenMin: "10 minutos", twentyMin: "20 minutos", thirtyMin: "30 minutos",
    oneHour: "1 hora", oneHalfHour: "1,5 horas+",
    formTitle: "Seu perfil de aprendizagem",
    formEditTitle: "Editar seu perfil de aprendizagem",
    formSubtitle: "Conte-nos sobre você para criar seu plano de estudo CLT personalizado",
    formEditSubtitle: "Atualize os detalhes abaixo — suas respostas existentes são mantidas até que você as altere.",
    backToMyPlan: "← Voltar ao meu plano",
    yourName: "SEU NOME *",
    namePlaceholder: "ex. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "seu@email.com",
    country: "PAÍS *",
    countryPlaceholder: "ex. Brasil, Portugal...",
    yourNativeLanguage: "SUA LÍNGUA NATIVA",
    finalGoal: "OBJETIVO FINAL *",
    selectGoal: "Selecione seu objetivo",
    goalN5: "Passar no JLPT N5", goalN4: "Passar no JLPT N4", goalN3: "Passar no JLPT N3",
    goalN2: "Passar no JLPT N2", goalN1: "Passar no JLPT N1",
    goalJob: "Conseguir emprego no Japão", goalTravel: "Viajar ao Japão",
    goalStudyAbroad: "Estudar no Japão", goalConversation: "Conversação diária",
    goalOther: "Outro",
    whatDoYouWantToStudy: "O QUE VOCÊ QUER ESTUDAR?",
    customGoalPlaceholder: "Conta-nos o que você gostaria de estudar ou alcançar...",
    whenAchieve: "QUANDO VOCÊ QUER ALCANÇAR ISSO? *",
    selectTimeline: "Selecionar período",
    lessThan6: "Menos de 6 meses", within1: "Em 1 ano",
    twoThreeYears: "2–3 anos", over3: "Mais de 3 anos",
    currentJlpt: "NÍVEL JLPT ATUAL *",
    autoFilled: "Preenchido automaticamente do seu teste",
    changeLevel: "Se quiser mudar seu nível, selecione abaixo.",
    selectLevel: "Selecionar nível",
    beginner: "Iniciante",
    studyTimePerDay: "TEMPO DE ESTUDO POR DIA *",
    selectHours: "Selecionar horas",
    lessThan1h: "Menos de 1 hora", oneTwo: "1–2 horas",
    twoThree: "2–3 horas", threePlus: "3+ horas",
    daysPerWeek: "QUANTOS DIAS POR SEMANA VOCÊ QUER ESTUDAR? *",
    selectDays: "Selecionar dias",
    oneTwoDays: "1–2 dias", threeFourDays: "3–4 dias",
    fiveSixDays: "5–6 dias", everyDay: "Todos os dias",
    whatStudySkills: "O QUE VOCÊ QUER ESTUDAR? * (selecione tudo que se aplica)",
    writingNote: "✍️ A prática de escrita está disponível na aba Escrita para todos os usuários",
    saveChanges: "Salvar alterações →",
    buildPlan: "Construir meu plano de estudo →",
    fillRequired: "Preencha todos os campos obrigatórios (*) e selecione pelo menos uma habilidade.",
    skillPronunciation: "🔊 Pronúncia", skillListening: "👂 Escuta",
    skillConversation: "💬 Conversação", skillJlpt: "🎯 Preparação JLPT",
    skillReading: "📖 Leitura", skillKanji: "🈳 Kanji", skillGrammar: "📝 Gramática",
    howToTitle: "Como usar este aplicativo",
    howToSchedule: "Seu plano de estudo semanal, dividido em tarefas diárias.",
    howToPractice: "Exercícios gerados por IA baseados nas habilidades escolhidas. Toque em 'Ver resposta' para conferir.",
    howToVocab: "Pesquise qualquer tema para obter palavras adequadas ao seu nível com frases de exemplo.",
    howToResources: "Ferramentas gratuitas (e algumas pagas) que correspondem às suas habilidades selecionadas.",
    howToMilestones: "Seu roteiro para seu objetivo. Toque em cada marco quando o completar.",
    howToEditProfile: "Atualize seus objetivos, nível, agenda ou habilidades a qualquer momento.",
    howToHelp: "Obtenha um plano personalizado para hoje com base no seu humor, tempo e energia.",
      vocabBuilderTitle: "📚 CONSTRUTOR DE VOCABULÁRIO",
    vocabBuilderDesc: "Digite um tópico para ver palavras relacionadas do dicionário japonês (English ou 日本語 OK)",
    vocabSearchPlaceholder: "ex. comida, viagem, emoções...",
    findWordsBtn: "Buscar palavras",
    libraryLabel: "📚 Biblioteca",
    yourVocabSaved: "Seu vocabulário",
    savedSuffix: "salvas",
    wordCardsLabel: "🃏 Cartões de palavras",
    searchCreateCards: "Buscar e criar cartões",
    flashcardsLabel: "🎴 Flashcards",
    reviewSavedWords: "Revisar palavras salvas",
    searchingDictionary: "Pesquisando no dicionário japonês...",
    speakWord: "Pronunciar palavra",
    speakExample: "Pronunciar exemplo",
    weblioDict: "📖 Dicionário Weblio",
    googleImages: "🖼 Imagens do Google",
    detailCard: "🃏 Cartão detalhado",
    retryBtn: "Tentar novamente",
    resShunDesc: "Canal do YouTube para iniciantes. Ótimo para praticar audição.",
    resMarugotoDesc: "Curso básico-intermediário da Japan Foundation. Método comunicativo.",
    resOnomappuDesc: "Canal divertido sobre conversação cotidiana, gírias e cultura.",
    resTeppeiDesc: "Podcast de nível intermediário. Ouça japonês em ritmo natural.",
    resYuyuDesc: "Podcast do YouTube de nível intermediário. Aprenda expressões naturais.",
    resSambonDesc: "Canal intermediário-avançado de gramática, vocabulário e preparação JLPT.",
    resLevelN5N4: "Iniciante (N5–N4)",
    resLevelN4N3: "Inic.-Inter. (N4–N3)",
    resLevelN3N2: "Intermediário (N3–N2)",
    resLevelN2N1: "Inter. avançado (N2–N1)",
},

  "German": {
    gakuSelfStudy: "GAKU SELBSTSTUDIUM",
    studyPlan: "Lernplan",
    help: "🆘 Hilfe",
    editProfile: "✏️ Profil bearbeiten",
    weeklyProgress: "Wöchentlicher Fortschritt",
    tabSchedule: "📅 Zeitplan",
    tabPractice: "🎯 Übungen",
    tabVocabulary: "📚 Vokabular",
    tabResources: "🔗 Ressourcen",
    tabMilestones: "🏆 Meilensteine",
    yourWeeklySchedule: "📅 IHR WÖCHENTLICHER LERNPLAN",
    restDay: "Ruhetag 🌸",
    monday: "MONTAG", tuesday: "DIENSTAG", wednesday: "MITTWOCH",
    thursday: "DONNERSTAG", friday: "FREITAG", saturday: "SAMSTAG", sunday: "SONNTAG",
    vocabReview: "Vokabelwiederholung — Anki oder gespeicherte Wörter (10 Min.)",
    speakAloud: "Laut sprechen: heutigen Inhalt auf Japanisch zusammenfassen (5 Min.)",
    taskConversation: "Rollenspiel oder Shadowing — CLT-Kern",
    taskListening: "NHK World oder JapanesePod101",
    taskReading: "Tadoku Stufenlese oder NHK Web Easy",
    taskGrammar: "Imabi + 3 Beispielsätze schreiben",
    taskKanji: "Nihonten AI — 5 neue Kanji im Kontext",
    taskJlpt: "Japanese Test 4 You — ein Übungsabschnitt",
    taskPronunciation: "Anki-Audiokarten — 20 Wörter shadowen",
    recommendedForLevel: "⭐ Empfohlen für Ihr Niveau",
    curatedFor: "Ausgewählt für Niveau",
    yourResources: "🔗 IHRE RESSOURCEN",
    curatedForLevel: "Ausgewählt für Niveau",
    skills: "Fähigkeiten:",
    openResource: "Öffnen",
    noResources: "Keine Ressourcen. Bitte bearbeiten Sie Ihr Profil und wählen Sie Lernfähigkeiten.",
    free: "KOSTENLOS", paid: "KOSTENPFLICHTIG",
    vocab: "Vokabel", grammar: "Grammatik", reading: "Lesen", speaking: "Sprechen", listening: "Hören",
    yourGoalRoadmap: "🏆 IHR ZIEL-FAHRPLAN",
    levelToGoal: "Niveau",
    goal: "Ziel",
    youveGotThis: "Sie schaffen das!",
    motivationText: "Jedes Gespräch, jeder Satz, jedes Wort bringt Sie näher. CLT geht um echte Kommunikation — und Sie machen es bereits. 頑張ってください！",
    bookLesson: "Kostenlosen Probeunterricht mit GAKU buchen →",
    weeksRemaining: "Wochen verbleibend",
    percentComplete: "% abgeschlossen",
    refresh: "🔄 Aktualisieren",
    aiBuilding: "✨ KI erstellt Ihren Zeitplan...",
    personalizing: "Plan wird basierend auf Ihrem Ziel und Fortschritt personalisiert...",
    helpTitle: "🆘 HILFE",
    whatWouldYouLike: "Was möchten Sie?",
    customizedLesson: "📋 Personalisierte Lektion für heute",
    howToUse: "❓ Wie man diese App benutzt",
    back: "← Zurück",
    howAreYouFeeling: "Wie fühlen Sie sich heute?",
    mood: "STIMMUNG", moodPlaceholder: "Auswählen...",
    moodMotivated: "😤 Motiviert & energiegeladen",
    moodOkay: "😐 Gut, normaler Tag",
    moodTired: "😴 Müde & wenig Energie",
    moodStressed: "😰 Gestresst oder ängstlich",
    moodHappy: "😊 Glücklich & entspannt",
    availableTime: "VERFÜGBARE ZEIT",
    energyLevel: "ENERGIENIVEAU",
    energyHigh: "🔥 Hoch — bereit für Herausforderungen",
    energyMedium: "⚡ Mittel — normales Lernen",
    energyLow: "🌙 Niedrig — nur leichte Wiederholung",
    wantsDifferent: "Ich möchte heute etwas anderes machen",
    differentPlaceholder: "Erzählen Sie uns, was Sie heute tun möchten...",
    getTodaysPlan: "Heutigen Plan erhalten ✨",
    generating: "Generiere...",
    tryAgain: "Erneut versuchen",
    select: "Auswählen...",
    tenMin: "10 Minuten", twentyMin: "20 Minuten", thirtyMin: "30 Minuten",
    oneHour: "1 Stunde", oneHalfHour: "1,5 Stunden+",
    formTitle: "Ihr Lernprofil",
    formEditTitle: "Ihr Lernprofil bearbeiten",
    formSubtitle: "Erzählen Sie uns von sich, um Ihren personalisierten CLT-Lernplan zu erstellen",
    formEditSubtitle: "Aktualisieren Sie die Angaben unten — Ihre vorhandenen Antworten bleiben erhalten, bis Sie sie ändern.",
    backToMyPlan: "← Zurück zu meinem Plan",
    yourName: "IHR NAME *",
    namePlaceholder: "z.B. Tanaka Yuki",
    email: "E-MAIL *",
    emailPlaceholder: "ihre@email.com",
    country: "LAND *",
    countryPlaceholder: "z.B. Deutschland, Österreich, Schweiz...",
    yourNativeLanguage: "IHRE MUTTERSPRACHE",
    finalGoal: "ENDZIEL *",
    selectGoal: "Wählen Sie Ihr Ziel",
    goalN5: "JLPT N5 bestehen", goalN4: "JLPT N4 bestehen", goalN3: "JLPT N3 bestehen",
    goalN2: "JLPT N2 bestehen", goalN1: "JLPT N1 bestehen",
    goalJob: "Arbeit in Japan finden", goalTravel: "Japan bereisen",
    goalStudyAbroad: "In Japan studieren", goalConversation: "Alltagsgespräch",
    goalOther: "Sonstiges",
    whatDoYouWantToStudy: "WAS MÖCHTEN SIE LERNEN?",
    customGoalPlaceholder: "Erzählen Sie uns, was Sie lernen oder erreichen möchten...",
    whenAchieve: "WANN MÖCHTEN SIE ES ERREICHEN? *",
    selectTimeline: "Zeitraum wählen",
    lessThan6: "Weniger als 6 Monate", within1: "Innerhalb 1 Jahr",
    twoThreeYears: "2–3 Jahre", over3: "Über 3 Jahre",
    currentJlpt: "AKTUELLES JLPT-NIVEAU *",
    autoFilled: "Automatisch aus Ihrem Test ausgefüllt",
    changeLevel: "Wenn Sie Ihr Niveau ändern möchten, wählen Sie bitte unten aus.",
    selectLevel: "Niveau wählen",
    beginner: "Anfänger",
    studyTimePerDay: "LERNZEIT PRO TAG *",
    selectHours: "Stunden wählen",
    lessThan1h: "Weniger als 1 Stunde", oneTwo: "1–2 Stunden",
    twoThree: "2–3 Stunden", threePlus: "3+ Stunden",
    daysPerWeek: "WIE VIELE TAGE PRO WOCHE MÖCHTEST DU LERNEN? *",
    selectDays: "Tage wählen",
    oneTwoDays: "1–2 Tage", threeFourDays: "3–4 Tage",
    fiveSixDays: "5–6 Tage", everyDay: "Jeden Tag",
    whatStudySkills: "WAS MÖCHTEN SIE LERNEN? * (alles Zutreffende auswählen)",
    writingNote: "✍️ Schreibübungen sind im Schreib-Tab für alle Nutzer verfügbar",
    saveChanges: "Änderungen speichern →",
    buildPlan: "Meinen Lernplan erstellen →",
    fillRequired: "Bitte füllen Sie alle Pflichtfelder (*) aus und wählen Sie mindestens eine Fähigkeit.",
    skillPronunciation: "🔊 Aussprache", skillListening: "👂 Hören",
    skillConversation: "💬 Konversation", skillJlpt: "🎯 JLPT-Vorbereitung",
    skillReading: "📖 Lesen", skillKanji: "🈳 Kanji", skillGrammar: "📝 Grammatik",
    howToTitle: "Wie man diese App benutzt",
    howToSchedule: "Ihr wöchentlicher Lernplan, aufgeteilt in tägliche Aufgaben.",
    howToPractice: "KI-generierte Übungen basierend auf den in Ihrem Profil gewählten Fähigkeiten.",
    howToVocab: "Suchen Sie nach beliebigen Themen, um niveaugerechte Wörter mit Beispielsätzen zu erhalten.",
    howToResources: "Kostenlose (und einige kostenpflichtige) Tools, die Ihren ausgewählten Fähigkeiten entsprechen.",
    howToMilestones: "Ihr Fahrplan zu Ihrem Ziel. Markieren Sie jeden Meilenstein, wenn Sie ihn erreichen.",
    howToEditProfile: "Aktualisieren Sie Ihre Ziele, Ihr Niveau, Ihren Zeitplan oder Ihre Fähigkeiten jederzeit.",
    howToHelp: "Erhalten Sie einen personalisierten Plan für heute basierend auf Ihrer Stimmung, Zeit und Energie.",
      vocabBuilderTitle: "📚 VOKABELTRAINER",
    vocabBuilderDesc: "Geben Sie ein Thema ein, um verwandte Wörter aus dem japanischen Wörterbuch zu sehen (English oder 日本語 OK)",
    vocabSearchPlaceholder: "z. B. Essen, Reisen, Emotionen...",
    findWordsBtn: "Wörter finden",
    libraryLabel: "📚 Bibliothek",
    yourVocabSaved: "Dein Vokabular",
    savedSuffix: "gespeichert",
    wordCardsLabel: "🃏 Wortkarten",
    searchCreateCards: "Karten suchen & erstellen",
    flashcardsLabel: "🎴 Karteikarten",
    reviewSavedWords: "Gespeicherte Wörter wiederholen",
    searchingDictionary: "Japanisches Wörterbuch wird durchsucht...",
    speakWord: "Wort aussprechen",
    speakExample: "Beispiel aussprechen",
    weblioDict: "📖 Weblio-Wörterbuch",
    googleImages: "🖼 Google-Bilder",
    detailCard: "🃏 Detailkarte",
    retryBtn: "Erneut versuchen",
    resShunDesc: "YouTube-Kanal für Anfänger. Ideal zum Hörverständnis üben.",
    resMarugotoDesc: "Anfänger-Mittelstufe-Kurs der Japan Foundation. Kommunikative Methode.",
    resOnomappuDesc: "Unterhaltsamer YouTube-Kanal über Alltagsgespräche, Slang und Kultur.",
    resTeppeiDesc: "Podcast für Mittelstufe. Höre Japanisch im natürlichen Tempo.",
    resYuyuDesc: "YouTube-Podcast für Mittelstufe. Lerne natürliche Ausdrücke.",
    resSambonDesc: "Kanal für obere Mittelstufe zu Grammatik, Wortschatz und JLPT-Vorbereitung.",
    resLevelN5N4: "Anfänger (N5–N4)",
    resLevelN4N3: "Anf.-Mittel (N4–N3)",
    resLevelN3N2: "Mittelstufe (N3–N2)",
    resLevelN2N1: "Obere Mittelst. (N2–N1)",
},

  "Italian": {
    gakuSelfStudy: "GAKU AUTO-APPRENDIMENTO",
    studyPlan: "Piano di studio",
    help: "🆘 Aiuto",
    editProfile: "✏️ Modifica profilo",
    weeklyProgress: "Progressi settimanali",
    tabSchedule: "📅 Programma",
    tabPractice: "🎯 Esercizi",
    tabVocabulary: "📚 Vocabolario",
    tabResources: "🔗 Risorse",
    tabMilestones: "🏆 Obiettivi",
    yourWeeklySchedule: "📅 IL TUO PROGRAMMA DI STUDIO SETTIMANALE",
    restDay: "Giorno di riposo 🌸",
    monday: "LUNEDÌ", tuesday: "MARTEDÌ", wednesday: "MERCOLEDÌ",
    thursday: "GIOVEDÌ", friday: "VENERDÌ", saturday: "SABATO", sunday: "DOMENICA",
    vocabReview: "Ripasso vocaboli — Anki o parole salvate (10 min)",
    speakAloud: "Ad alta voce: riassumi i contenuti di oggi in giapponese (5 min)",
    taskConversation: "Role-play o shadowing — base CLT",
    taskListening: "NHK World o JapanesePod101",
    taskReading: "Lettore graduato Tadoku o NHK Web Easy",
    taskGrammar: "Imabi + scrivi 3 frasi di esempio",
    taskKanji: "Nihonten AI — 5 nuovi kanji in contesto",
    taskJlpt: "Japanese Test 4 You — una sezione di pratica",
    taskPronunciation: "Schede audio Anki — shadow 20 parole",
    recommendedForLevel: "⭐ Consigliato per il tuo livello",
    curatedFor: "Selezionato per il livello",
    yourResources: "🔗 LE TUE RISORSE",
    curatedForLevel: "Selezionato per il livello",
    skills: "abilità:",
    openResource: "Apri",
    noResources: "Nessuna risorsa. Modifica il tuo profilo e seleziona le abilità di studio.",
    free: "GRATIS", paid: "A PAGAMENTO",
    vocab: "Vocab", grammar: "Grammatica", reading: "Lettura", speaking: "Espressione orale", listening: "Ascolto",
    yourGoalRoadmap: "🏆 LA TUA ROADMAP DEGLI OBIETTIVI",
    levelToGoal: "Livello",
    goal: "Obiettivo",
    youveGotThis: "Ce la fai!",
    motivationText: "Ogni conversazione, ogni frase, ogni parola ti avvicina. CLT riguarda la comunicazione reale — e lo stai già facendo. 頑張ってください！",
    bookLesson: "Prenota una lezione di prova GRATUITA con GAKU →",
    weeksRemaining: "settimane rimanenti",
    percentComplete: "% completato",
    refresh: "🔄 Aggiorna",
    aiBuilding: "✨ L'IA sta costruendo il tuo programma...",
    personalizing: "Personalizzando il tuo piano in base al tuo obiettivo e ai progressi...",
    helpTitle: "🆘 AIUTO",
    whatWouldYouLike: "Cosa vorresti?",
    customizedLesson: "📋 Lezione personalizzata per oggi",
    howToUse: "❓ Come usare questa app",
    back: "← Indietro",
    howAreYouFeeling: "Come ti senti oggi?",
    mood: "UMORE", moodPlaceholder: "Seleziona...",
    moodMotivated: "😤 Motivato/a ed energico/a",
    moodOkay: "😐 Bene, giornata normale",
    moodTired: "😴 Stanco/a e con poca energia",
    moodStressed: "😰 Stressato/a o ansioso/a",
    moodHappy: "😊 Felice e rilassato/a",
    availableTime: "TEMPO DISPONIBILE",
    energyLevel: "LIVELLO DI ENERGIA",
    energyHigh: "🔥 Alto — pronto/a per le sfide",
    energyMedium: "⚡ Medio — studio normale",
    energyLow: "🌙 Basso — solo ripasso leggero",
    wantsDifferent: "Voglio fare qualcosa di diverso oggi",
    differentPlaceholder: "Dicci cosa vorresti fare oggi...",
    getTodaysPlan: "Ottieni il piano di oggi ✨",
    generating: "Generazione in corso...",
    tryAgain: "Riprova",
    select: "Seleziona...",
    tenMin: "10 minuti", twentyMin: "20 minuti", thirtyMin: "30 minuti",
    oneHour: "1 ora", oneHalfHour: "1,5 ore+",
    formTitle: "Il tuo profilo di apprendimento",
    formEditTitle: "Modifica il tuo profilo di apprendimento",
    formSubtitle: "Parlaci di te per creare il tuo piano di studio CLT personalizzato",
    formEditSubtitle: "Aggiorna i dettagli qui sotto — le tue risposte esistenti vengono mantenute finché non le modifichi.",
    backToMyPlan: "← Torna al mio piano",
    yourName: "IL TUO NOME *",
    namePlaceholder: "es. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "tuo@email.com",
    country: "PAESE *",
    countryPlaceholder: "es. Italia, Svizzera...",
    yourNativeLanguage: "LA TUA LINGUA MADRE",
    finalGoal: "OBIETTIVO FINALE *",
    selectGoal: "Seleziona il tuo obiettivo",
    goalN5: "Superare il JLPT N5", goalN4: "Superare il JLPT N4", goalN3: "Superare il JLPT N3",
    goalN2: "Superare il JLPT N2", goalN1: "Superare il JLPT N1",
    goalJob: "Trovare lavoro in Giappone", goalTravel: "Viaggiare in Giappone",
    goalStudyAbroad: "Studiare in Giappone", goalConversation: "Conversazione quotidiana",
    goalOther: "Altro",
    whatDoYouWantToStudy: "COSA VUOI STUDIARE?",
    customGoalPlaceholder: "Dicci cosa vorresti studiare o raggiungere...",
    whenAchieve: "QUANDO VUOI RAGGIUNGERE IL TUO OBIETTIVO? *",
    selectTimeline: "Seleziona periodo",
    lessThan6: "Meno di 6 mesi", within1: "Entro 1 anno",
    twoThreeYears: "2–3 anni", over3: "Oltre 3 anni",
    currentJlpt: "LIVELLO JLPT ATTUALE *",
    autoFilled: "Compilato automaticamente dal tuo test",
    changeLevel: "Se vuoi cambiare il tuo livello, seleziona qui sotto.",
    selectLevel: "Seleziona livello",
    beginner: "Principiante",
    studyTimePerDay: "TEMPO DI STUDIO AL GIORNO *",
    selectHours: "Seleziona ore",
    lessThan1h: "Meno di 1 ora", oneTwo: "1–2 ore",
    twoThree: "2–3 ore", threePlus: "3+ ore",
    daysPerWeek: "QUANTI GIORNI A SETTIMANA VUOI STUDIARE? *",
    selectDays: "Seleziona giorni",
    oneTwoDays: "1–2 giorni", threeFourDays: "3–4 giorni",
    fiveSixDays: "5–6 giorni", everyDay: "Ogni giorno",
    whatStudySkills: "COSA VUOI STUDIARE? * (seleziona tutto ciò che si applica)",
    writingNote: "✍️ La pratica della scrittura è disponibile nella scheda Scrittura per tutti gli utenti",
    saveChanges: "Salva modifiche →",
    buildPlan: "Costruisci il mio piano di studio →",
    fillRequired: "Per favore compila tutti i campi obbligatori (*) e seleziona almeno un'abilità.",
    skillPronunciation: "🔊 Pronuncia", skillListening: "👂 Ascolto",
    skillConversation: "💬 Conversazione", skillJlpt: "🎯 Preparazione JLPT",
    skillReading: "📖 Lettura", skillKanji: "🈳 Kanji", skillGrammar: "📝 Grammatica",
    howToTitle: "Come usare questa app",
    howToSchedule: "Il tuo piano di studio settimanale, suddiviso in attività giornaliere. Tocca un'attività per contrassegnarla come completata.",
    howToPractice: "Esercizi generati dall'IA basati sulle abilità scelte nel tuo profilo. Tocca 'Mostra risposta' per verificare.",
    howToVocab: "Cerca qualsiasi argomento per ottenere parole appropriate al tuo livello con frasi di esempio. Salva le parole da ricordare.",
    howToResources: "Strumenti gratuiti (e alcuni a pagamento) corrispondenti alle tue abilità selezionate.",
    howToMilestones: "La tua roadmap verso il tuo obiettivo. Tocca ogni pietra miliare quando la completi.",
    howToEditProfile: "Aggiorna i tuoi obiettivi, livello, programma o abilità in qualsiasi momento.",
    howToHelp: "Ottieni un piano personalizzato per oggi basato sul tuo umore, tempo ed energia.",
      vocabBuilderTitle: "📚 COSTRUTTORE DI VOCABOLARIO",
    vocabBuilderDesc: "Inserisci un argomento per vedere le parole correlate dal dizionario giapponese (English o 日本語 OK)",
    vocabSearchPlaceholder: "es. cibo, viaggi, emozioni...",
    findWordsBtn: "Trova parole",
    libraryLabel: "📚 Libreria",
    yourVocabSaved: "Il tuo vocabolario",
    savedSuffix: "salvate",
    wordCardsLabel: "🃏 Schede di parole",
    searchCreateCards: "Cerca e crea schede",
    flashcardsLabel: "🎴 Flashcard",
    reviewSavedWords: "Rivedi le parole salvate",
    searchingDictionary: "Ricerca nel dizionario giapponese...",
    speakWord: "Pronuncia la parola",
    speakExample: "Pronuncia l'esempio",
    weblioDict: "📖 Dizionario Weblio",
    googleImages: "🖼 Immagini Google",
    detailCard: "🃏 Scheda dettagliata",
    retryBtn: "Riprova",
    resShunDesc: "Canale YouTube per principianti. Ottimo per la pratica di ascolto.",
    resMarugotoDesc: "Corso base-intermedio della Japan Foundation. Metodo comunicativo.",
    resOnomappuDesc: "Canale YouTube divertente su conversazione quotidiana, slang e cultura.",
    resTeppeiDesc: "Podcast di livello intermedio. Ascolta giapponese a ritmo naturale.",
    resYuyuDesc: "Podcast YouTube di livello intermedio. Impara espressioni naturali.",
    resSambonDesc: "Canale intermedio-avanzato per grammatica, vocabolario e preparazione JLPT.",
    resLevelN5N4: "Principiante (N5–N4)",
    resLevelN4N3: "Prin.-Interm. (N4–N3)",
    resLevelN3N2: "Intermedio (N3–N2)",
    resLevelN2N1: "Interm. avanzato (N2–N1)",
},

  "Chinese (Simplified)": {
    gakuSelfStudy: "GAKU 自学",
    studyPlan: "学习计划",
    help: "🆘 帮助",
    editProfile: "✏️ 编辑资料",
    weeklyProgress: "每周进度",
    tabSchedule: "📅 日程",
    tabPractice: "🎯 练习",
    tabVocabulary: "📚 词汇",
    tabResources: "🔗 资源",
    tabMilestones: "🏆 里程碑",
    yourWeeklySchedule: "📅 你的每周学习日程",
    restDay: "休息日 🌸",
    monday: "周一", tuesday: "周二", wednesday: "周三",
    thursday: "周四", friday: "周五", saturday: "周六", sunday: "周日",
    vocabReview: "词汇复习 — Anki 或已保存单词（10分钟）",
    speakAloud: "大声朗读：用日语总结今天的内容（5分钟）",
    taskConversation: "角色扮演或影子跟读 — CLT 核心",
    taskListening: "NHK World 或 JapanesePod101",
    taskReading: "Tadoku 分级读物或 NHK Web Easy",
    taskGrammar: "Imabi + 写3个例句",
    taskKanji: "Nihonten AI — 在语境中学5个新汉字",
    taskJlpt: "Japanese Test 4 You — 一节练习",
    taskPronunciation: "Anki 音频卡片 — 跟读20个单词",
    recommendedForLevel: "⭐ 根据你的级别推荐",
    curatedFor: "为级别精选",
    yourResources: "🔗 你的资源",
    curatedForLevel: "为级别精选",
    skills: "技能：",
    openResource: "打开",
    noResources: "没有资源。请编辑你的资料并选择学习技能。",
    free: "免费", paid: "付费",
    vocab: "词汇", grammar: "语法", reading: "阅读", speaking: "口语", listening: "听力",
    yourGoalRoadmap: "🏆 你的目标路线图",
    levelToGoal: "级别",
    goal: "目标",
    youveGotThis: "你可以的！",
    motivationText: "每一次对话、每一个句子、每一个词都让你离目标更近。CLT 关注真实交流 — 你已经在做了。頑張ってください！",
    bookLesson: "与GAKU预约免费试课 →",
    weeksRemaining: "周剩余",
    percentComplete: "% 完成",
    refresh: "🔄 刷新",
    aiBuilding: "✨ AI正在生成你的日程...",
    personalizing: "根据你的目标和进度个性化你的计划...",
    helpTitle: "🆘 帮助",
    whatWouldYouLike: "你想要什么？",
    customizedLesson: "📋 今天的个性化课程",
    howToUse: "❓ 如何使用此应用",
    back: "← 返回",
    howAreYouFeeling: "你今天感觉如何？",
    mood: "心情", moodPlaceholder: "选择...",
    moodMotivated: "😤 积极有活力",
    moodOkay: "😐 还好，普通的一天",
    moodTired: "😴 疲惫，精力不足",
    moodStressed: "😰 压力大或焦虑",
    moodHappy: "😊 开心放松",
    availableTime: "可用时间",
    energyLevel: "精力水平",
    energyHigh: "🔥 高 — 准备迎接挑战",
    energyMedium: "⚡ 中等 — 正常学习",
    energyLow: "🌙 低 — 仅轻松复习",
    wantsDifferent: "我今天想做些不同的事",
    differentPlaceholder: "告诉我们你今天想做什么...",
    getTodaysPlan: "获取今天的计划 ✨",
    generating: "生成中...",
    tryAgain: "再试一次",
    select: "选择...",
    tenMin: "10分钟", twentyMin: "20分钟", thirtyMin: "30分钟",
    oneHour: "1小时", oneHalfHour: "1.5小时+",
    formTitle: "你的学习档案",
    formEditTitle: "编辑你的学习档案",
    formSubtitle: "告诉我们你的情况，以制定个性化的CLT学习计划",
    formEditSubtitle: "在下方更新详细信息 — 你的现有答案将保留，直到你更改。",
    backToMyPlan: "← 返回我的计划",
    yourName: "你的姓名 *",
    namePlaceholder: "例如 田中雪",
    email: "电子邮件 *",
    emailPlaceholder: "你的@邮箱.com",
    country: "国家 *",
    countryPlaceholder: "例如 中国、台湾...",
    yourNativeLanguage: "你的母语",
    finalGoal: "最终目标 *",
    selectGoal: "选择你的目标",
    goalN5: "通过JLPT N5", goalN4: "通过JLPT N4", goalN3: "通过JLPT N3",
    goalN2: "通过JLPT N2", goalN1: "通过JLPT N1",
    goalJob: "在日本找工作", goalTravel: "去日本旅行",
    goalStudyAbroad: "去日本留学", goalConversation: "日常对话",
    goalOther: "其他",
    whatDoYouWantToStudy: "你想学什么？",
    customGoalPlaceholder: "告诉我们你想学习或实现什么...",
    whenAchieve: "你想何时实现目标？*",
    selectTimeline: "选择时间段",
    lessThan6: "不到6个月", within1: "1年内",
    twoThreeYears: "2-3年", over3: "3年以上",
    currentJlpt: "当前JLPT级别 *",
    autoFilled: "已从测试自动填写",
    changeLevel: "如果你想更改级别，请在下方选择。",
    selectLevel: "选择级别",
    beginner: "初学者",
    studyTimePerDay: "每天学习时间 *",
    selectHours: "选择小时数",
    lessThan1h: "不到1小时", oneTwo: "1-2小时",
    twoThree: "2-3小时", threePlus: "3小时以上",
    daysPerWeek: "你想每周学习几天？ *",
    selectDays: "选择天数",
    oneTwoDays: "1-2天", threeFourDays: "3-4天",
    fiveSixDays: "5-6天", everyDay: "每天",
    whatStudySkills: "你想学什么？*（选择所有适用项）",
    writingNote: "✍️ 写作练习对所有用户在写作标签中可用",
    saveChanges: "保存更改 →",
    buildPlan: "制定我的学习计划 →",
    fillRequired: "请填写所有必填字段（*）并至少选择一项技能。",
    skillPronunciation: "🔊 发音", skillListening: "👂 听力",
    skillConversation: "💬 会话", skillJlpt: "🎯 JLPT备考",
    skillReading: "📖 阅读", skillKanji: "🈳 汉字", skillGrammar: "📝 语法",
    howToTitle: "如何使用此应用",
    howToSchedule: "你的每周学习计划，分为每日任务。点击任务以标记完成并跟踪每周进度。",
    howToPractice: "基于你在资料中选择技能的AI生成练习。点击「显示答案」自我检查。",
    howToVocab: "搜索任何话题，获取适合你级别的单词、例句和CLT使用技巧。保存你想记住的单词。",
    howToResources: "与你选择技能匹配的免费（和部分付费）工具，可直接从这里打开。",
    howToMilestones: "你实现目标的路线图。完成每个里程碑时点击它。",
    howToEditProfile: "随时更新你的目标、级别、日程或技能。",
    howToHelp: "根据你今天的心情、时间和精力获取个性化计划。",
      vocabBuilderTitle: "📚 词汇构建器",
    vocabBuilderDesc: "输入一个主题，查看日语词典中的相关单词（English 或 日本語 均可）",
    vocabSearchPlaceholder: "例如：食物、旅行、情感...",
    findWordsBtn: "查找单词",
    libraryLabel: "📚 词库",
    yourVocabSaved: "你的词汇",
    savedSuffix: "已保存",
    wordCardsLabel: "🃏 单词卡",
    searchCreateCards: "搜索并创建卡片",
    flashcardsLabel: "🎴 闪卡",
    reviewSavedWords: "复习已保存的单词",
    searchingDictionary: "正在搜索日语词典...",
    speakWord: "发音单词",
    speakExample: "发音例句",
    weblioDict: "📖 Weblio词典",
    googleImages: "🖼 谷歌图片",
    detailCard: "🃏 详情卡",
    retryBtn: "重试",
    resShunDesc: "适合初学者的YouTube频道，非常适合练习听力。",
    resMarugotoDesc: "国际交流基金会的初中级课程，采用交际式学习法。",
    resOnomappuDesc: "轻松有趣的YouTube频道，学习日常会话、俚语和文化。",
    resTeppeiDesc: "中级水平播客，可以听到自然语速的日语。",
    resYuyuDesc: "中级水平YouTube播客，学习自然的日语表达。",
    resSambonDesc: "中高级频道，专注语法、词汇和JLPT备考。",
    resLevelN5N4: "初级 (N5–N4)",
    resLevelN4N3: "初中级 (N4–N3)",
    resLevelN3N2: "中级 (N3–N2)",
    resLevelN2N1: "中高级 (N2–N1)",
},

  "Chinese (Traditional)": {
    gakuSelfStudy: "GAKU 自學",
    studyPlan: "學習計劃",
    help: "🆘 幫助",
    editProfile: "✏️ 編輯資料",
    weeklyProgress: "每週進度",
    tabSchedule: "📅 日程",
    tabPractice: "🎯 練習",
    tabVocabulary: "📚 詞彙",
    tabResources: "🔗 資源",
    tabMilestones: "🏆 里程碑",
    yourWeeklySchedule: "📅 你的每週學習日程",
    restDay: "休息日 🌸",
    monday: "週一", tuesday: "週二", wednesday: "週三",
    thursday: "週四", friday: "週五", saturday: "週六", sunday: "週日",
    vocabReview: "詞彙複習 — Anki 或已儲存單字（10分鐘）",
    speakAloud: "大聲朗讀：用日語總結今天的內容（5分鐘）",
    taskConversation: "角色扮演或影子跟讀 — CLT 核心",
    taskListening: "NHK World 或 JapanesePod101",
    taskReading: "Tadoku 分級讀物或 NHK Web Easy",
    taskGrammar: "Imabi + 寫3個例句",
    taskKanji: "Nihonten AI — 在語境中學5個新漢字",
    taskJlpt: "Japanese Test 4 You — 一節練習",
    taskPronunciation: "Anki 音頻卡片 — 跟讀20個單字",
    recommendedForLevel: "⭐ 根據你的級別推薦",
    curatedFor: "為級別精選",
    yourResources: "🔗 你的資源",
    curatedForLevel: "為級別精選",
    skills: "技能：",
    openResource: "開啟",
    noResources: "沒有資源。請編輯你的資料並選擇學習技能。",
    free: "免費", paid: "付費",
    vocab: "詞彙", grammar: "語法", reading: "閱讀", speaking: "口語", listening: "聽力",
    yourGoalRoadmap: "🏆 你的目標路線圖",
    levelToGoal: "級別",
    goal: "目標",
    youveGotThis: "你可以的！",
    motivationText: "每一次對話、每一個句子、每一個詞都讓你離目標更近。CLT 關注真實交流 — 你已經在做了。頑張ってください！",
    bookLesson: "與GAKU預約免費試課 →",
    weeksRemaining: "週剩餘",
    percentComplete: "% 完成",
    refresh: "🔄 重新整理",
    aiBuilding: "✨ AI正在生成你的日程...",
    personalizing: "根據你的目標和進度個性化你的計劃...",
    helpTitle: "🆘 幫助",
    whatWouldYouLike: "你想要什麼？",
    customizedLesson: "📋 今天的個性化課程",
    howToUse: "❓ 如何使用此應用",
    back: "← 返回",
    howAreYouFeeling: "你今天感覺如何？",
    mood: "心情", moodPlaceholder: "選擇...",
    moodMotivated: "😤 積極有活力",
    moodOkay: "😐 還好，普通的一天",
    moodTired: "😴 疲憊，精力不足",
    moodStressed: "😰 壓力大或焦慮",
    moodHappy: "😊 開心放鬆",
    availableTime: "可用時間",
    energyLevel: "精力水平",
    energyHigh: "🔥 高 — 準備迎接挑戰",
    energyMedium: "⚡ 中等 — 正常學習",
    energyLow: "🌙 低 — 僅輕鬆複習",
    wantsDifferent: "我今天想做些不同的事",
    differentPlaceholder: "告訴我們你今天想做什麼...",
    getTodaysPlan: "獲取今天的計劃 ✨",
    generating: "生成中...",
    tryAgain: "再試一次",
    select: "選擇...",
    tenMin: "10分鐘", twentyMin: "20分鐘", thirtyMin: "30分鐘",
    oneHour: "1小時", oneHalfHour: "1.5小時+",
    formTitle: "你的學習檔案",
    formEditTitle: "編輯你的學習檔案",
    formSubtitle: "告訴我們你的情況，以制定個性化的CLT學習計劃",
    formEditSubtitle: "在下方更新詳細信息 — 你的現有答案將保留，直到你更改。",
    backToMyPlan: "← 返回我的計劃",
    yourName: "你的姓名 *",
    namePlaceholder: "例如 田中雪",
    email: "電子郵件 *",
    emailPlaceholder: "你的@郵箱.com",
    country: "國家 *",
    countryPlaceholder: "例如 台灣、香港...",
    yourNativeLanguage: "你的母語",
    finalGoal: "最終目標 *",
    selectGoal: "選擇你的目標",
    goalN5: "通過JLPT N5", goalN4: "通過JLPT N4", goalN3: "通過JLPT N3",
    goalN2: "通過JLPT N2", goalN1: "通過JLPT N1",
    goalJob: "在日本找工作", goalTravel: "去日本旅行",
    goalStudyAbroad: "去日本留學", goalConversation: "日常對話",
    goalOther: "其他",
    whatDoYouWantToStudy: "你想學什麼？",
    customGoalPlaceholder: "告訴我們你想學習或實現什麼...",
    whenAchieve: "你想何時實現目標？*",
    selectTimeline: "選擇時間段",
    lessThan6: "不到6個月", within1: "1年內",
    twoThreeYears: "2-3年", over3: "3年以上",
    currentJlpt: "當前JLPT級別 *",
    autoFilled: "已從測試自動填寫",
    changeLevel: "如果你想更改級別，請在下方選擇。",
    selectLevel: "選擇級別",
    beginner: "初學者",
    studyTimePerDay: "每天學習時間 *",
    selectHours: "選擇小時數",
    lessThan1h: "不到1小時", oneTwo: "1-2小時",
    twoThree: "2-3小時", threePlus: "3小時以上",
    daysPerWeek: "你想每週學習幾天？ *",
    selectDays: "選擇天數",
    oneTwoDays: "1-2天", threeFourDays: "3-4天",
    fiveSixDays: "5-6天", everyDay: "每天",
    whatStudySkills: "你想學什麼？*（選擇所有適用項）",
    writingNote: "✍️ 寫作練習對所有用戶在寫作標籤中可用",
    saveChanges: "儲存更改 →",
    buildPlan: "制定我的學習計劃 →",
    fillRequired: "請填寫所有必填字段（*）並至少選擇一項技能。",
    skillPronunciation: "🔊 發音", skillListening: "👂 聽力",
    skillConversation: "💬 會話", skillJlpt: "🎯 JLPT備考",
    skillReading: "📖 閱讀", skillKanji: "🈳 漢字", skillGrammar: "📝 語法",
    howToTitle: "如何使用此應用",
    howToSchedule: "你的每週學習計劃，分為每日任務。點擊任務以標記完成並跟踪每週進度。",
    howToPractice: "基於你在資料中選擇技能的AI生成練習。點擊「顯示答案」自我檢查。",
    howToVocab: "搜索任何話題，獲取適合你級別的單字、例句和CLT使用技巧。儲存你想記住的單字。",
    howToResources: "與你選擇技能匹配的免費（和部分付費）工具，可直接從這裡打開。",
    howToMilestones: "你實現目標的路線圖。完成每個里程碑時點擊它。",
    howToEditProfile: "隨時更新你的目標、級別、日程或技能。",
    howToHelp: "根據你今天的心情、時間和精力獲取個性化計劃。",
      vocabBuilderTitle: "📚 詞彙建構器",
    vocabBuilderDesc: "輸入一個主題，查看日語詞典中的相關單字（English 或 日本語 均可）",
    vocabSearchPlaceholder: "例如：食物、旅行、情感...",
    findWordsBtn: "查找單字",
    libraryLabel: "📚 詞庫",
    yourVocabSaved: "你的詞彙",
    savedSuffix: "已儲存",
    wordCardsLabel: "🃏 單字卡",
    searchCreateCards: "搜尋並建立卡片",
    flashcardsLabel: "🎴 閃卡",
    reviewSavedWords: "複習已儲存的單字",
    searchingDictionary: "正在搜尋日語詞典...",
    speakWord: "發音單字",
    speakExample: "發音例句",
    weblioDict: "📖 Weblio詞典",
    googleImages: "🖼 Google圖片",
    detailCard: "🃏 詳情卡",
    retryBtn: "重試",
    resShunDesc: "適合初學者的YouTube頻道，非常適合練習聽力。",
    resMarugotoDesc: "國際交流基金會的初中級課程，採用交際式學習法。",
    resOnomappuDesc: "輕鬆有趣的YouTube頻道，學習日常會話、俚語和文化。",
    resTeppeiDesc: "中級水平播客，可以聽到自然語速的日語。",
    resYuyuDesc: "中級水平YouTube播客，學習自然的日語表達。",
    resSambonDesc: "中高級頻道，專注語法、詞彙和JLPT備考。",
    resLevelN5N4: "初級 (N5–N4)",
    resLevelN4N3: "初中級 (N4–N3)",
    resLevelN3N2: "中級 (N3–N2)",
    resLevelN2N1: "中高級 (N2–N1)",
},

  "Korean": {
    gakuSelfStudy: "GAKU 자기 학습",
    studyPlan: "학습 계획",
    help: "🆘 도움말",
    editProfile: "✏️ 프로필 편집",
    weeklyProgress: "주간 진도",
    tabSchedule: "📅 일정",
    tabPractice: "🎯 연습",
    tabVocabulary: "📚 어휘",
    tabResources: "🔗 자료",
    tabMilestones: "🏆 목표",
    yourWeeklySchedule: "📅 나의 주간 학습 일정",
    restDay: "휴식일 🌸",
    monday: "월요일", tuesday: "화요일", wednesday: "수요일",
    thursday: "목요일", friday: "금요일", saturday: "토요일", sunday: "일요일",
    vocabReview: "어휘 복습 — Anki 또는 저장된 단어 (10분)",
    speakAloud: "소리 내어: 오늘의 내용을 일본어로 요약하기 (5분)",
    taskConversation: "롤플레이 또는 섀도잉 — CLT 핵심",
    taskListening: "NHK World 또는 JapanesePod101",
    taskReading: "Tadoku 단계별 독서 또는 NHK Web Easy",
    taskGrammar: "Imabi + 예문 3개 쓰기",
    taskKanji: "Nihonten AI — 문맥 속 새 한자 5개",
    taskJlpt: "Japanese Test 4 You — 연습 섹션 하나",
    taskPronunciation: "Anki 오디오 카드 — 단어 20개 섀도잉",
    recommendedForLevel: "⭐ 내 레벨에 추천",
    curatedFor: "레벨을 위해 선별됨",
    yourResources: "🔗 나의 자료",
    curatedForLevel: "레벨을 위해 선별됨",
    skills: "스킬:",
    openResource: "열기",
    noResources: "자료가 없습니다. 프로필을 편집하고 학습 스킬을 선택하세요.",
    free: "무료", paid: "유료",
    vocab: "어휘", grammar: "문법", reading: "독해", speaking: "말하기", listening: "듣기",
    yourGoalRoadmap: "🏆 나의 목표 로드맵",
    levelToGoal: "레벨",
    goal: "목표",
    youveGotThis: "할 수 있어요!",
    motivationText: "모든 대화, 모든 문장, 모든 단어가 당신을 더 가깝게 만들어요. CLT는 실제 의사소통에 관한 것 — 이미 하고 있어요. 頑張ってください！",
    bookLesson: "GAKU와 무료 체험 레슨 예약 →",
    weeksRemaining: "주 남음",
    percentComplete: "% 완료",
    refresh: "🔄 새로고침",
    aiBuilding: "✨ AI가 일정을 만들고 있어요...",
    personalizing: "목표와 진도에 맞게 계획을 맞춤 설정 중...",
    helpTitle: "🆘 도움말",
    whatWouldYouLike: "무엇을 원하세요?",
    customizedLesson: "📋 오늘의 맞춤 레슨",
    howToUse: "❓ 이 앱 사용 방법",
    back: "← 뒤로",
    howAreYouFeeling: "오늘 기분이 어떠세요?",
    mood: "기분", moodPlaceholder: "선택...",
    moodMotivated: "😤 의욕적이고 활기차다",
    moodOkay: "😐 괜찮다, 평범한 하루",
    moodTired: "😴 피곤하고 에너지가 낮다",
    moodStressed: "😰 스트레스받거나 불안하다",
    moodHappy: "😊 행복하고 편안하다",
    availableTime: "가용 시간",
    energyLevel: "에너지 레벨",
    energyHigh: "🔥 높음 — 도전 준비됨",
    energyMedium: "⚡ 보통 — 일반 학습",
    energyLow: "🌙 낮음 — 가벼운 복습만",
    wantsDifferent: "오늘은 다른 걸 하고 싶어요",
    differentPlaceholder: "오늘 하고 싶은 걸 말해주세요...",
    getTodaysPlan: "오늘의 계획 받기 ✨",
    generating: "생성 중...",
    tryAgain: "다시 시도",
    select: "선택...",
    tenMin: "10분", twentyMin: "20분", thirtyMin: "30분",
    oneHour: "1시간", oneHalfHour: "1.5시간+",
    formTitle: "나의 학습 프로필",
    formEditTitle: "학습 프로필 편집",
    formSubtitle: "개인화된 CLT 학습 계획을 만들기 위해 자신에 대해 알려주세요",
    formEditSubtitle: "아래 세부 정보를 업데이트하세요 — 기존 답변은 변경할 때까지 유지됩니다.",
    backToMyPlan: "← 내 계획으로 돌아가기",
    yourName: "이름 *",
    namePlaceholder: "예: 다나카 유키",
    email: "이메일 *",
    emailPlaceholder: "your@email.com",
    country: "국가 *",
    countryPlaceholder: "예: 한국, 미국...",
    yourNativeLanguage: "모국어",
    finalGoal: "최종 목표 *",
    selectGoal: "목표 선택",
    goalN5: "JLPT N5 합격", goalN4: "JLPT N4 합격", goalN3: "JLPT N3 합격",
    goalN2: "JLPT N2 합격", goalN1: "JLPT N1 합격",
    goalJob: "일본에서 취업", goalTravel: "일본 여행",
    goalStudyAbroad: "일본 유학", goalConversation: "일상 회화",
    goalOther: "기타",
    whatDoYouWantToStudy: "무엇을 공부하고 싶으세요?",
    customGoalPlaceholder: "공부하거나 달성하고 싶은 것을 알려주세요...",
    whenAchieve: "언제 달성하고 싶으세요? *",
    selectTimeline: "기간 선택",
    lessThan6: "6개월 미만", within1: "1년 이내",
    twoThreeYears: "2~3년", over3: "3년 이상",
    currentJlpt: "현재 JLPT 레벨 *",
    autoFilled: "테스트에서 자동 입력됨",
    changeLevel: "레벨을 변경하려면 아래에서 선택하세요.",
    selectLevel: "레벨 선택",
    beginner: "초보자",
    studyTimePerDay: "하루 학습 시간 *",
    selectHours: "시간 선택",
    lessThan1h: "1시간 미만", oneTwo: "1~2시간",
    twoThree: "2~3시간", threePlus: "3시간+",
    daysPerWeek: "일주일에 며칠 공부하고 싶으세요? *",
    selectDays: "일수 선택",
    oneTwoDays: "1~2일", threeFourDays: "3~4일",
    fiveSixDays: "5~6일", everyDay: "매일",
    whatStudySkills: "무엇을 공부하고 싶으세요? * (해당 항목 모두 선택)",
    writingNote: "✍️ 작문 연습은 모든 사용자의 작문 탭에서 이용 가능합니다",
    saveChanges: "변경사항 저장 →",
    buildPlan: "내 학습 계획 만들기 →",
    fillRequired: "모든 필수 항목(*)을 입력하고 최소 하나의 스킬을 선택하세요.",
    skillPronunciation: "🔊 발음", skillListening: "👂 듣기",
    skillConversation: "💬 회화", skillJlpt: "🎯 JLPT 준비",
    skillReading: "📖 독해", skillKanji: "🈳 한자", skillGrammar: "📝 문법",
    howToTitle: "이 앱 사용 방법",
    howToSchedule: "주간 학습 계획, 일별 과제로 나뉩니다. 과제를 눌러 완료 표시하고 주간 진도를 추적하세요.",
    howToPractice: "프로필에서 선택한 스킬을 기반으로 AI가 생성한 연습문제. '답 보기'를 눌러 확인하세요.",
    howToVocab: "어떤 주제든 검색하여 레벨에 맞는 단어와 예문을 확인하세요. 기억하고 싶은 단어를 저장하세요.",
    howToResources: "선택한 스킬과 일치하는 무료(및 일부 유료) 도구 — 여기서 바로 열어보세요.",
    howToMilestones: "목표를 향한 로드맵. 각 마일스톤을 완료할 때 눌러주세요.",
    howToEditProfile: "목표, 레벨, 일정 또는 스킬을 언제든지 업데이트하세요.",
    howToHelp: "오늘의 기분, 시간, 에너지를 기반으로 개인화된 계획을 받으세요.",
      vocabBuilderTitle: "📚 어휘 빌더",
    vocabBuilderDesc: "주제를 입력하면 일본어 사전에서 관련 단어를 확인할 수 있습니다 (English 또는 日本語 가능)",
    vocabSearchPlaceholder: "예: 음식, 여행, 감정...",
    findWordsBtn: "단어 찾기",
    libraryLabel: "📚 라이브러리",
    yourVocabSaved: "내 어휘",
    savedSuffix: "저장됨",
    wordCardsLabel: "🃏 단어 카드",
    searchCreateCards: "카드 검색 및 생성",
    flashcardsLabel: "🎴 플래시카드",
    reviewSavedWords: "저장된 단어 복습",
    searchingDictionary: "일본어 사전 검색 중...",
    speakWord: "단어 발음 듣기",
    speakExample: "예문 발음 듣기",
    weblioDict: "📖 Weblio 사전",
    googleImages: "🖼 구글 이미지",
    detailCard: "🃏 상세 카드",
    retryBtn: "다시 시도",
    resShunDesc: "초보자를 위한 유튜브 채널. 듣기 연습에 좋습니다.",
    resMarugotoDesc: "일본국제교류기금의 초중급 과정. 의사소통 중심 학습법.",
    resOnomappuDesc: "일상 회화, 속어, 문화를 재미있게 배우는 유튜브 채널.",
    resTeppeiDesc: "중급 수준 팟캐스트. 자연스러운 속도의 일본어를 들을 수 있습니다.",
    resYuyuDesc: "중급 수준 유튜브 팟캐스트. 자연스러운 일본어 표현을 배웁니다.",
    resSambonDesc: "문법, 어휘, JLPT 대비를 위한 중상급 채널.",
    resLevelN5N4: "초급 (N5–N4)",
    resLevelN4N3: "초중급 (N4–N3)",
    resLevelN3N2: "중급 (N3–N2)",
    resLevelN2N1: "중상급 (N2–N1)",
},

  "Thai": {
    gakuSelfStudy: "GAKU การเรียนรู้ด้วยตนเอง",
    studyPlan: "แผนการเรียน",
    help: "🆘 ช่วยเหลือ",
    editProfile: "✏️ แก้ไขโปรไฟล์",
    weeklyProgress: "ความคืบหน้ารายสัปดาห์",
    tabSchedule: "📅 ตารางเรียน",
    tabPractice: "🎯 แบบฝึกหัด",
    tabVocabulary: "📚 คำศัพท์",
    tabResources: "🔗 แหล่งเรียนรู้",
    tabMilestones: "🏆 เป้าหมาย",
    yourWeeklySchedule: "📅 ตารางเรียนรายสัปดาห์ของคุณ",
    restDay: "วันพัก 🌸",
    monday: "จันทร์", tuesday: "อังคาร", wednesday: "พุธ",
    thursday: "พฤหัสบดี", friday: "ศุกร์", saturday: "เสาร์", sunday: "อาทิตย์",
    vocabReview: "ทบทวนคำศัพท์ — Anki หรือคำที่บันทึกไว้ (10 นาที)",
    speakAloud: "พูดออกเสียง: สรุปเนื้อหาวันนี้เป็นภาษาญี่ปุ่น (5 นาที)",
    taskConversation: "แสดงบทบาทหรือ shadowing — แกน CLT",
    taskListening: "NHK World หรือ JapanesePod101",
    taskReading: "Tadoku graded reader หรือ NHK Web Easy",
    taskGrammar: "Imabi + เขียน 3 ประโยคตัวอย่าง",
    taskKanji: "Nihonten AI — คันจิใหม่ 5 ตัวในบริบท",
    taskJlpt: "Japanese Test 4 You — หนึ่งส่วนการฝึก",
    taskPronunciation: "Anki audio cards — shadow 20 คำ",
    recommendedForLevel: "⭐ แนะนำสำหรับระดับของคุณ",
    curatedFor: "คัดสรรสำหรับระดับ",
    yourResources: "🔗 แหล่งเรียนรู้ของคุณ",
    curatedForLevel: "คัดสรรสำหรับระดับ",
    skills: "ทักษะ:",
    openResource: "เปิด",
    noResources: "ไม่มีแหล่งเรียนรู้ กรุณาแก้ไขโปรไฟล์และเลือกทักษะการเรียน",
    free: "ฟรี", paid: "เสียเงิน",
    vocab: "คำศัพท์", grammar: "ไวยากรณ์", reading: "การอ่าน", speaking: "การพูด", listening: "การฟัง",
    yourGoalRoadmap: "🏆 แผนที่เส้นทางเป้าหมายของคุณ",
    levelToGoal: "ระดับ",
    goal: "เป้าหมาย",
    youveGotThis: "คุณทำได้!",
    motivationText: "ทุกบทสนทนา ทุกประโยค ทุกคำ พาคุณเข้าใกล้เป้าหมาย CLT คือการสื่อสารจริง — และคุณกำลังทำมันอยู่แล้ว 頑張ってください！",
    bookLesson: "จองบทเรียนทดลองฟรีกับ GAKU →",
    weeksRemaining: "สัปดาห์คงเหลือ",
    percentComplete: "% สำเร็จ",
    refresh: "🔄 รีเฟรช",
    aiBuilding: "✨ AI กำลังสร้างตารางเรียนของคุณ...",
    personalizing: "กำลังปรับแผนตามเป้าหมายและความคืบหน้าของคุณ...",
    helpTitle: "🆘 ช่วยเหลือ",
    whatWouldYouLike: "คุณต้องการอะไร?",
    customizedLesson: "📋 บทเรียนที่ปรับแต่งสำหรับวันนี้",
    howToUse: "❓ วิธีใช้แอปนี้",
    back: "← กลับ",
    howAreYouFeeling: "วันนี้คุณรู้สึกอย่างไร?",
    mood: "อารมณ์", moodPlaceholder: "เลือก...",
    moodMotivated: "😤 มีแรงบันดาลใจและพลังงาน",
    moodOkay: "😐 โอเค วันธรรมดา",
    moodTired: "😴 เหนื่อยและพลังงานต่ำ",
    moodStressed: "😰 เครียดหรือวิตกกังวล",
    moodHappy: "😊 มีความสุขและผ่อนคลาย",
    availableTime: "เวลาที่มี",
    energyLevel: "ระดับพลังงาน",
    energyHigh: "🔥 สูง — พร้อมรับความท้าทาย",
    energyMedium: "⚡ ปานกลาง — เรียนปกติ",
    energyLow: "🌙 ต่ำ — ทบทวนเบา ๆ เท่านั้น",
    wantsDifferent: "ฉันอยากทำสิ่งที่แตกต่างออกไปวันนี้",
    differentPlaceholder: "บอกเราว่าคุณอยากทำอะไรวันนี้...",
    getTodaysPlan: "รับแผนวันนี้ ✨",
    generating: "กำลังสร้าง...",
    tryAgain: "ลองอีกครั้ง",
    select: "เลือก...",
    tenMin: "10 นาที", twentyMin: "20 นาที", thirtyMin: "30 นาที",
    oneHour: "1 ชั่วโมง", oneHalfHour: "1.5 ชั่วโมง+",
    formTitle: "โปรไฟล์การเรียนรู้ของคุณ",
    formEditTitle: "แก้ไขโปรไฟล์การเรียนรู้",
    formSubtitle: "บอกเราเกี่ยวกับตัวคุณเพื่อสร้างแผนการเรียน CLT ส่วนตัว",
    formEditSubtitle: "อัปเดตรายละเอียดด้านล่าง — คำตอบที่มีอยู่จะถูกเก็บไว้จนกว่าคุณจะเปลี่ยน",
    backToMyPlan: "← กลับไปยังแผนของฉัน",
    yourName: "ชื่อของคุณ *",
    namePlaceholder: "เช่น ทานากะ ยูกิ",
    email: "อีเมล *",
    emailPlaceholder: "your@email.com",
    country: "ประเทศ *",
    countryPlaceholder: "เช่น ไทย, ญี่ปุ่น...",
    yourNativeLanguage: "ภาษาแม่ของคุณ",
    finalGoal: "เป้าหมายสุดท้าย *",
    selectGoal: "เลือกเป้าหมายของคุณ",
    goalN5: "สอบ JLPT N5 ผ่าน", goalN4: "สอบ JLPT N4 ผ่าน", goalN3: "สอบ JLPT N3 ผ่าน",
    goalN2: "สอบ JLPT N2 ผ่าน", goalN1: "สอบ JLPT N1 ผ่าน",
    goalJob: "หางานในญี่ปุ่น", goalTravel: "ท่องเที่ยวญี่ปุ่น",
    goalStudyAbroad: "เรียนต่อที่ญี่ปุ่น", goalConversation: "สนทนาประจำวัน",
    goalOther: "อื่น ๆ",
    whatDoYouWantToStudy: "คุณอยากเรียนอะไร?",
    customGoalPlaceholder: "บอกเราว่าคุณอยากเรียนหรือบรรลุอะไร...",
    whenAchieve: "คุณอยากบรรลุเป้าหมายเมื่อไร? *",
    selectTimeline: "เลือกระยะเวลา",
    lessThan6: "น้อยกว่า 6 เดือน", within1: "ภายใน 1 ปี",
    twoThreeYears: "2–3 ปี", over3: "มากกว่า 3 ปี",
    currentJlpt: "ระดับ JLPT ปัจจุบัน *",
    autoFilled: "กรอกอัตโนมัติจากการทดสอบของคุณ",
    changeLevel: "หากต้องการเปลี่ยนระดับ กรุณาเลือกด้านล่าง",
    selectLevel: "เลือกระดับ",
    beginner: "ผู้เริ่มต้น",
    studyTimePerDay: "เวลาเรียนต่อวัน *",
    selectHours: "เลือกชั่วโมง",
    lessThan1h: "น้อยกว่า 1 ชั่วโมง", oneTwo: "1–2 ชั่วโมง",
    twoThree: "2–3 ชั่วโมง", threePlus: "3+ ชั่วโมง",
    daysPerWeek: "คุณต้องการเรียนกี่วันต่อสัปดาห์? *",
    selectDays: "เลือกวัน",
    oneTwoDays: "1–2 วัน", threeFourDays: "3–4 วัน",
    fiveSixDays: "5–6 วัน", everyDay: "ทุกวัน",
    whatStudySkills: "คุณอยากเรียนอะไร? * (เลือกทั้งหมดที่ใช้ได้)",
    writingNote: "✍️ การฝึกเขียนมีในแท็บการเขียนสำหรับผู้ใช้ทุกคน",
    saveChanges: "บันทึกการเปลี่ยนแปลง →",
    buildPlan: "สร้างแผนการเรียนของฉัน →",
    fillRequired: "กรุณากรอกข้อมูลในช่องที่จำเป็นทั้งหมด (*) และเลือกอย่างน้อยหนึ่งทักษะ",
    skillPronunciation: "🔊 การออกเสียง", skillListening: "👂 การฟัง",
    skillConversation: "💬 การสนทนา", skillJlpt: "🎯 เตรียม JLPT",
    skillReading: "📖 การอ่าน", skillKanji: "🈳 คันจิ", skillGrammar: "📝 ไวยากรณ์",
    howToTitle: "วิธีใช้แอปนี้",
    howToSchedule: "แผนการเรียนรายสัปดาห์ แบ่งเป็นงานรายวัน แตะงานเพื่อทำเครื่องหมายว่าเสร็จแล้วและติดตามความคืบหน้า",
    howToPractice: "แบบฝึกหัดที่สร้างโดย AI ตามทักษะที่คุณเลือกในโปรไฟล์ แตะ 'ดูคำตอบ' เพื่อตรวจสอบ",
    howToVocab: "ค้นหาหัวข้อใดก็ได้เพื่อรับคำศัพท์ที่เหมาะกับระดับพร้อมประโยคตัวอย่าง บันทึกคำที่ต้องการจำ",
    howToResources: "เครื่องมือฟรี (และบางส่วนเสียเงิน) ที่ตรงกับทักษะที่คุณเลือก",
    howToMilestones: "แผนที่เส้นทางสู่เป้าหมายของคุณ แตะแต่ละหมุดเมื่อทำสำเร็จ",
    howToEditProfile: "อัปเดตเป้าหมาย ระดับ ตาราง หรือทักษะได้ตลอดเวลา",
    howToHelp: "รับแผนส่วนตัวสำหรับวันนี้ตามอารมณ์ เวลา และพลังงานของคุณ",
      vocabBuilderTitle: "📚 ตัวสร้างคำศัพท์",
    vocabBuilderDesc: "ป้อนหัวข้อเพื่อดูคำที่เกี่ยวข้องจากพจนานุกรมภาษาญี่ปุ่น (English หรือ 日本語 ได้)",
    vocabSearchPlaceholder: "เช่น อาหาร การเดินทาง อารมณ์...",
    findWordsBtn: "ค้นหาคำศัพท์",
    libraryLabel: "📚 คลังคำศัพท์",
    yourVocabSaved: "คำศัพท์ของคุณ",
    savedSuffix: "บันทึกแล้ว",
    wordCardsLabel: "🃏 การ์ดคำศัพท์",
    searchCreateCards: "ค้นหาและสร้างการ์ด",
    flashcardsLabel: "🎴 แฟลชการ์ด",
    reviewSavedWords: "ทบทวนคำที่บันทึกไว้",
    searchingDictionary: "กำลังค้นหาพจนานุกรมภาษาญี่ปุ่น...",
    speakWord: "ออกเสียงคำ",
    speakExample: "ออกเสียงตัวอย่าง",
    weblioDict: "📖 พจนานุกรม Weblio",
    googleImages: "🖼 รูปภาพ Google",
    detailCard: "🃏 การ์ดรายละเอียด",
    retryBtn: "ลองอีกครั้ง",
    resShunDesc: "ช่อง YouTube สำหรับผู้เริ่มต้น เหมาะสำหรับฝึกการฟัง",
    resMarugotoDesc: "หลักสูตรระดับต้น-กลางจาก Japan Foundation วิธีการเรียนรู้แบบสื่อสาร",
    resOnomappuDesc: "ช่อง YouTube สนุกๆ เกี่ยวกับบทสนทนาประจำวัน คำสแลง และวัฒนธรรม",
    resTeppeiDesc: "พอดแคสต์ระดับกลาง ฟังภาษาญี่ปุ่นด้วยความเร็วธรรมชาติ",
    resYuyuDesc: "พอดแคสต์ YouTube ระดับกลาง เรียนรู้สำนวนภาษาญี่ปุ่นที่เป็นธรรมชาติ",
    resSambonDesc: "ช่องระดับกลางขั้นสูงสำหรับไวยากรณ์ คำศัพท์ และเตรียมสอบ JLPT",
    resLevelN5N4: "ต้น (N5–N4)",
    resLevelN4N3: "ต้น-กลาง (N4–N3)",
    resLevelN3N2: "กลาง (N3–N2)",
    resLevelN2N1: "กลางขั้นสูง (N2–N1)",
},

  "Malay": {
    gakuSelfStudy: "GAKU BELAJAR SENDIRI",
    studyPlan: "Pelan belajar",
    help: "🆘 Bantuan",
    editProfile: "✏️ Edit profil",
    weeklyProgress: "Kemajuan mingguan",
    tabSchedule: "📅 Jadual",
    tabPractice: "🎯 Latihan",
    tabVocabulary: "📚 Kosa Kata",
    tabResources: "🔗 Sumber",
    tabMilestones: "🏆 Pencapaian",
    yourWeeklySchedule: "📅 JADUAL BELAJAR MINGGUAN ANDA",
    restDay: "Hari rehat 🌸",
    monday: "ISNIN", tuesday: "SELASA", wednesday: "RABU",
    thursday: "KHAMIS", friday: "JUMAAT", saturday: "SABTU", sunday: "AHAD",
    vocabReview: "Ulang kaji kosa kata — Anki atau perkataan yang disimpan (10 min)",
    speakAloud: "Bersuara: ringkaskan kandungan hari ini dalam bahasa Jepun (5 min)",
    taskConversation: "Main peranan atau shadowing — teras CLT",
    taskListening: "NHK World atau JapanesePod101",
    taskReading: "Pembaca bertahap Tadoku atau NHK Web Easy",
    taskGrammar: "Imabi + tulis 3 ayat contoh",
    taskKanji: "Nihonten AI — 5 kanji baru dalam konteks",
    taskJlpt: "Japanese Test 4 You — satu bahagian latihan",
    taskPronunciation: "Kad audio Anki — shadow 20 perkataan",
    recommendedForLevel: "⭐ Disyorkan untuk tahap anda",
    curatedFor: "Dipilih untuk tahap",
    yourResources: "🔗 SUMBER ANDA",
    curatedForLevel: "Dipilih untuk tahap",
    skills: "kemahiran:",
    openResource: "Buka",
    noResources: "Tiada sumber. Sila edit profil anda dan pilih kemahiran belajar.",
    free: "PERCUMA", paid: "BERBAYAR",
    vocab: "Kosa Kata", grammar: "Tatabahasa", reading: "Membaca", speaking: "Bertutur", listening: "Mendengar",
    yourGoalRoadmap: "🏆 PETA JALAN MATLAMAT ANDA",
    levelToGoal: "Tahap",
    goal: "Matlamat",
    youveGotThis: "Anda boleh buat!",
    motivationText: "Setiap perbualan, setiap ayat, setiap perkataan membawa anda lebih dekat. CLT adalah tentang komunikasi nyata — dan anda sudah melakukannya. 頑張ってください！",
    bookLesson: "Tempah Pelajaran Percubaan PERCUMA dengan GAKU →",
    weeksRemaining: "minggu berbaki",
    percentComplete: "% selesai",
    refresh: "🔄 Muat Semula",
    aiBuilding: "✨ AI sedang membina jadual anda...",
    personalizing: "Memperibadikan pelan anda berdasarkan matlamat dan kemajuan anda...",
    helpTitle: "🆘 BANTUAN",
    whatWouldYouLike: "Apa yang anda mahukan?",
    customizedLesson: "📋 Pelajaran tersuai untuk hari ini",
    howToUse: "❓ Cara menggunakan apl ini",
    back: "← Kembali",
    howAreYouFeeling: "Bagaimana perasaan anda hari ini?",
    mood: "MOOD", moodPlaceholder: "Pilih...",
    moodMotivated: "😤 Bermotivasi & bertenaga",
    moodOkay: "😐 Okey, hari biasa",
    moodTired: "😴 Penat & tenaga rendah",
    moodStressed: "😰 Tertekan atau cemas",
    moodHappy: "😊 Gembira & santai",
    availableTime: "MASA YANG ADA",
    energyLevel: "TAHAP TENAGA",
    energyHigh: "🔥 Tinggi — bersedia untuk cabaran",
    energyMedium: "⚡ Sederhana — belajar biasa",
    energyLow: "🌙 Rendah — ulang kaji ringan sahaja",
    wantsDifferent: "Saya ingin melakukan sesuatu yang berbeza hari ini",
    differentPlaceholder: "Beritahu kami apa yang ingin anda lakukan hari ini...",
    getTodaysPlan: "Dapatkan pelan hari ini ✨",
    generating: "Menjana...",
    tryAgain: "Cuba lagi",
    select: "Pilih...",
    tenMin: "10 minit", twentyMin: "20 minit", thirtyMin: "30 minit",
    oneHour: "1 jam", oneHalfHour: "1.5 jam+",
    formTitle: "Profil pembelajaran anda",
    formEditTitle: "Edit profil pembelajaran anda",
    formSubtitle: "Beritahu kami tentang diri anda untuk membina pelan belajar CLT peribadi",
    formEditSubtitle: "Kemaskini butiran di bawah — jawapan sedia ada anda disimpan sehingga anda mengubahnya.",
    backToMyPlan: "← Kembali ke pelan saya",
    yourName: "NAMA ANDA *",
    namePlaceholder: "cth. Tanaka Yuki",
    email: "E-MEL *",
    emailPlaceholder: "anda@emel.com",
    country: "NEGARA *",
    countryPlaceholder: "cth. Malaysia, Singapura...",
    yourNativeLanguage: "BAHASA IBU ANDA",
    finalGoal: "MATLAMAT AKHIR *",
    selectGoal: "Pilih matlamat anda",
    goalN5: "Lulus JLPT N5", goalN4: "Lulus JLPT N4", goalN3: "Lulus JLPT N3",
    goalN2: "Lulus JLPT N2", goalN1: "Lulus JLPT N1",
    goalJob: "Cari kerja di Jepun", goalTravel: "Melancong ke Jepun",
    goalStudyAbroad: "Belajar di Jepun", goalConversation: "Perbualan harian",
    goalOther: "Lain-lain",
    whatDoYouWantToStudy: "APA YANG INGIN ANDA PELAJARI?",
    customGoalPlaceholder: "Beritahu kami apa yang ingin anda pelajari atau capai...",
    whenAchieve: "BILA ANDA INGIN MENCAPAINYA? *",
    selectTimeline: "Pilih tempoh masa",
    lessThan6: "Kurang dari 6 bulan", within1: "Dalam 1 tahun",
    twoThreeYears: "2–3 tahun", over3: "Lebih 3 tahun",
    currentJlpt: "TAHAP JLPT SEMASA *",
    autoFilled: "Diisi secara automatik dari ujian anda",
    changeLevel: "Jika anda ingin menukar tahap, sila pilih di bawah.",
    selectLevel: "Pilih tahap",
    beginner: "Pemula",
    studyTimePerDay: "MASA BELAJAR SEHARI *",
    selectHours: "Pilih jam",
    lessThan1h: "Kurang dari 1 jam", oneTwo: "1–2 jam",
    twoThree: "2–3 jam", threePlus: "3+ jam",
    daysPerWeek: "BERAPA HARI SEMINGGU ANDA INGIN BELAJAR? *",
    selectDays: "Pilih hari",
    oneTwoDays: "1–2 hari", threeFourDays: "3–4 hari",
    fiveSixDays: "5–6 hari", everyDay: "Setiap hari",
    whatStudySkills: "APA YANG INGIN ANDA PELAJARI? * (pilih semua yang berkenaan)",
    writingNote: "✍️ Latihan penulisan tersedia dalam tab Penulisan untuk semua pengguna",
    saveChanges: "Simpan perubahan →",
    buildPlan: "Bina pelan belajar saya →",
    fillRequired: "Sila isi semua medan wajib (*) dan pilih sekurang-kurangnya satu kemahiran.",
    skillPronunciation: "🔊 Sebutan", skillListening: "👂 Mendengar",
    skillConversation: "💬 Perbualan", skillJlpt: "🎯 Persediaan JLPT",
    skillReading: "📖 Membaca", skillKanji: "🈳 Kanji", skillGrammar: "📝 Tatabahasa",
    howToTitle: "Cara menggunakan apl ini",
    howToSchedule: "Pelan belajar mingguan anda, dibahagikan kepada tugasan harian. Ketik tugasan untuk tandai selesai.",
    howToPractice: "Latihan yang dijana AI berdasarkan kemahiran yang anda pilih. Ketik 'Tunjuk jawapan' untuk semak.",
    howToVocab: "Cari mana-mana topik untuk mendapatkan perkataan yang sesuai dengan tahap anda. Simpan perkataan yang ingin diingat.",
    howToResources: "Alat percuma (dan beberapa berbayar) yang sepadan dengan kemahiran terpilih anda.",
    howToMilestones: "Peta jalan anda menuju matlamat. Ketik setiap pencapaian apabila selesai.",
    howToEditProfile: "Kemaskini matlamat, tahap, jadual atau kemahiran bila-bila masa.",
    howToHelp: "Dapatkan pelan peribadi untuk hari ini berdasarkan mood, masa dan tenaga anda.",
      vocabBuilderTitle: "📚 PEMBINA KOSA KATA",
    vocabBuilderDesc: "Masukkan topik untuk melihat perkataan berkaitan dari kamus Jepun (English atau 日本語 OK)",
    vocabSearchPlaceholder: "cth. makanan, perjalanan, emosi...",
    findWordsBtn: "Cari perkataan",
    libraryLabel: "📚 Perpustakaan",
    yourVocabSaved: "Kosa kata anda",
    savedSuffix: "disimpan",
    wordCardsLabel: "🃏 Kad perkataan",
    searchCreateCards: "Cari & cipta kad",
    flashcardsLabel: "🎴 Kad imbas",
    reviewSavedWords: "Semak perkataan tersimpan",
    searchingDictionary: "Mencari dalam kamus Jepun...",
    speakWord: "Sebut perkataan",
    speakExample: "Sebut contoh",
    weblioDict: "📖 Kamus Weblio",
    googleImages: "🖼 Imej Google",
    detailCard: "🃏 Kad terperinci",
    retryBtn: "Cuba lagi",
    resShunDesc: "Saluran YouTube mesra pemula. Sesuai untuk latihan mendengar.",
    resMarugotoDesc: "Kursus pemula-pertengahan oleh Japan Foundation. Kaedah pembelajaran komunikatif.",
    resOnomappuDesc: "Saluran YouTube menyeronokkan tentang perbualan harian, slang dan budaya.",
    resTeppeiDesc: "Podcast tahap pertengahan. Dengar bahasa Jepun pada kelajuan semula jadi.",
    resYuyuDesc: "Podcast YouTube tahap pertengahan. Pelajari ungkapan semula jadi.",
    resSambonDesc: "Saluran pertengahan atasan untuk tatabahasa, kosa kata dan persediaan JLPT.",
    resLevelN5N4: "Pemula (N5–N4)",
    resLevelN4N3: "Pemula-Pert. (N4–N3)",
    resLevelN3N2: "Pertengahan (N3–N2)",
    resLevelN2N1: "Pert. Atasan (N2–N1)",
},

  "Indonesian": {
    gakuSelfStudy: "GAKU BELAJAR MANDIRI",
    studyPlan: "Rencana belajar",
    help: "🆘 Bantuan",
    editProfile: "✏️ Edit profil",
    weeklyProgress: "Kemajuan mingguan",
    tabSchedule: "📅 Jadwal",
    tabPractice: "🎯 Latihan",
    tabVocabulary: "📚 Kosakata",
    tabResources: "🔗 Sumber",
    tabMilestones: "🏆 Pencapaian",
    yourWeeklySchedule: "📅 JADWAL BELAJAR MINGGUAN ANDA",
    restDay: "Hari istirahat 🌸",
    monday: "SENIN", tuesday: "SELASA", wednesday: "RABU",
    thursday: "KAMIS", friday: "JUMAT", saturday: "SABTU", sunday: "MINGGU",
    vocabReview: "Ulang kosakata — Anki atau kata yang disimpan (10 menit)",
    speakAloud: "Bersuara: rangkum konten hari ini dalam bahasa Jepang (5 menit)",
    taskConversation: "Bermain peran atau shadowing — inti CLT",
    taskListening: "NHK World atau JapanesePod101",
    taskReading: "Pembaca bertingkat Tadoku atau NHK Web Easy",
    taskGrammar: "Imabi + tulis 3 kalimat contoh",
    taskKanji: "Nihonten AI — 5 kanji baru dalam konteks",
    taskJlpt: "Japanese Test 4 You — satu bagian latihan",
    taskPronunciation: "Kartu audio Anki — shadow 20 kata",
    recommendedForLevel: "⭐ Direkomendasikan untuk level Anda",
    curatedFor: "Dipilih untuk level",
    yourResources: "🔗 SUMBER ANDA",
    curatedForLevel: "Dipilih untuk level",
    skills: "keterampilan:",
    openResource: "Buka",
    noResources: "Tidak ada sumber. Silakan edit profil Anda dan pilih keterampilan belajar.",
    free: "GRATIS", paid: "BERBAYAR",
    vocab: "Kosakata", grammar: "Tata Bahasa", reading: "Membaca", speaking: "Berbicara", listening: "Mendengarkan",
    yourGoalRoadmap: "🏆 PETA JALAN TUJUAN ANDA",
    levelToGoal: "Level",
    goal: "Tujuan",
    youveGotThis: "Kamu bisa!",
    motivationText: "Setiap percakapan, setiap kalimat, setiap kata membawamu lebih dekat. CLT adalah tentang komunikasi nyata — dan kamu sudah melakukannya. 頑張ってください！",
    bookLesson: "Pesan Pelajaran Percobaan GRATIS dengan GAKU →",
    weeksRemaining: "minggu tersisa",
    percentComplete: "% selesai",
    refresh: "🔄 Perbarui",
    aiBuilding: "✨ AI sedang membuat jadwal Anda...",
    personalizing: "Menyesuaikan rencana Anda berdasarkan tujuan dan kemajuan Anda...",
    helpTitle: "🆘 BANTUAN",
    whatWouldYouLike: "Apa yang Anda inginkan?",
    customizedLesson: "📋 Pelajaran yang disesuaikan untuk hari ini",
    howToUse: "❓ Cara menggunakan aplikasi ini",
    back: "← Kembali",
    howAreYouFeeling: "Bagaimana perasaan Anda hari ini?",
    mood: "SUASANA HATI", moodPlaceholder: "Pilih...",
    moodMotivated: "😤 Termotivasi & penuh energi",
    moodOkay: "😐 Baik, hari biasa",
    moodTired: "😴 Lelah & energi rendah",
    moodStressed: "😰 Stres atau cemas",
    moodHappy: "😊 Bahagia & santai",
    availableTime: "WAKTU TERSEDIA",
    energyLevel: "TINGKAT ENERGI",
    energyHigh: "🔥 Tinggi — siap tantangan",
    energyMedium: "⚡ Sedang — belajar normal",
    energyLow: "🌙 Rendah — hanya review ringan",
    wantsDifferent: "Saya ingin melakukan sesuatu yang berbeda hari ini",
    differentPlaceholder: "Ceritakan apa yang ingin Anda lakukan hari ini...",
    getTodaysPlan: "Dapatkan rencana hari ini ✨",
    generating: "Membuat...",
    tryAgain: "Coba lagi",
    select: "Pilih...",
    tenMin: "10 menit", twentyMin: "20 menit", thirtyMin: "30 menit",
    oneHour: "1 jam", oneHalfHour: "1,5 jam+",
    formTitle: "Profil pembelajaran Anda",
    formEditTitle: "Edit profil pembelajaran Anda",
    formSubtitle: "Ceritakan tentang diri Anda untuk membuat rencana belajar CLT yang dipersonalisasi",
    formEditSubtitle: "Perbarui detail di bawah — jawaban Anda yang ada disimpan sampai Anda mengubahnya.",
    backToMyPlan: "← Kembali ke rencana saya",
    yourName: "NAMA ANDA *",
    namePlaceholder: "mis. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "anda@email.com",
    country: "NEGARA *",
    countryPlaceholder: "mis. Indonesia, Malaysia...",
    yourNativeLanguage: "BAHASA IBU ANDA",
    finalGoal: "TUJUAN AKHIR *",
    selectGoal: "Pilih tujuan Anda",
    goalN5: "Lulus JLPT N5", goalN4: "Lulus JLPT N4", goalN3: "Lulus JLPT N3",
    goalN2: "Lulus JLPT N2", goalN1: "Lulus JLPT N1",
    goalJob: "Mendapat pekerjaan di Jepang", goalTravel: "Perjalanan ke Jepang",
    goalStudyAbroad: "Belajar di Jepang", goalConversation: "Percakapan sehari-hari",
    goalOther: "Lainnya",
    whatDoYouWantToStudy: "APA YANG INGIN ANDA PELAJARI?",
    customGoalPlaceholder: "Ceritakan apa yang ingin Anda pelajari atau capai...",
    whenAchieve: "KAPAN ANDA INGIN MENCAPAINYA? *",
    selectTimeline: "Pilih jangka waktu",
    lessThan6: "Kurang dari 6 bulan", within1: "Dalam 1 tahun",
    twoThreeYears: "2–3 tahun", over3: "Lebih dari 3 tahun",
    currentJlpt: "LEVEL JLPT SAAT INI *",
    autoFilled: "Terisi otomatis dari tes Anda",
    changeLevel: "Jika Anda ingin mengubah level, silakan pilih di bawah.",
    selectLevel: "Pilih level",
    beginner: "Pemula",
    studyTimePerDay: "WAKTU BELAJAR PER HARI *",
    selectHours: "Pilih jam",
    lessThan1h: "Kurang dari 1 jam", oneTwo: "1–2 jam",
    twoThree: "2–3 jam", threePlus: "3+ jam",
    daysPerWeek: "BERAPA HARI DALAM SEMINGGU ANDA INGIN BELAJAR? *",
    selectDays: "Pilih hari",
    oneTwoDays: "1–2 hari", threeFourDays: "3–4 hari",
    fiveSixDays: "5–6 hari", everyDay: "Setiap hari",
    whatStudySkills: "APA YANG INGIN ANDA PELAJARI? * (pilih semua yang berlaku)",
    writingNote: "✍️ Latihan menulis tersedia di tab Menulis untuk semua pengguna",
    saveChanges: "Simpan perubahan →",
    buildPlan: "Buat rencana belajar saya →",
    fillRequired: "Harap isi semua bidang yang diperlukan (*) dan pilih setidaknya satu keterampilan.",
    skillPronunciation: "🔊 Pengucapan", skillListening: "👂 Mendengarkan",
    skillConversation: "💬 Percakapan", skillJlpt: "🎯 Persiapan JLPT",
    skillReading: "📖 Membaca", skillKanji: "🈳 Kanji", skillGrammar: "📝 Tata Bahasa",
    howToTitle: "Cara menggunakan aplikasi ini",
    howToSchedule: "Rencana belajar mingguan Anda, dibagi menjadi tugas harian. Ketuk tugas untuk menandainya selesai.",
    howToPractice: "Latihan yang dihasilkan AI berdasarkan keterampilan yang Anda pilih. Ketuk 'Tampilkan jawaban' untuk memeriksa.",
    howToVocab: "Cari topik apa saja untuk mendapatkan kata-kata sesuai level Anda dengan kalimat contoh. Simpan kata yang ingin diingat.",
    howToResources: "Alat gratis (dan beberapa berbayar) yang sesuai dengan keterampilan pilihan Anda.",
    howToMilestones: "Peta jalan Anda menuju tujuan. Ketuk setiap pencapaian saat Anda menyelesaikannya.",
    howToEditProfile: "Perbarui tujuan, level, jadwal, atau keterampilan kapan saja.",
    howToHelp: "Dapatkan rencana yang dipersonalisasi untuk hari ini berdasarkan suasana hati, waktu, dan energi Anda.",
      vocabBuilderTitle: "📚 PEMBANGUN KOSAKATA",
    vocabBuilderDesc: "Masukkan topik untuk melihat kata terkait dari kamus Jepang (English atau 日本語 OK)",
    vocabSearchPlaceholder: "misalnya makanan, perjalanan, emosi...",
    findWordsBtn: "Cari kata",
    libraryLabel: "📚 Pustaka",
    yourVocabSaved: "Kosakata Anda",
    savedSuffix: "tersimpan",
    wordCardsLabel: "🃏 Kartu kata",
    searchCreateCards: "Cari & buat kartu",
    flashcardsLabel: "🎴 Kartu hafalan",
    reviewSavedWords: "Tinjau kata tersimpan",
    searchingDictionary: "Mencari dalam kamus Jepang...",
    speakWord: "Ucapkan kata",
    speakExample: "Ucapkan contoh",
    weblioDict: "📖 Kamus Weblio",
    googleImages: "🖼 Gambar Google",
    detailCard: "🃏 Kartu detail",
    retryBtn: "Coba lagi",
    resShunDesc: "Saluran YouTube ramah pemula. Bagus untuk latihan mendengarkan.",
    resMarugotoDesc: "Kursus pemula-menengah dari Japan Foundation. Metode pembelajaran komunikatif.",
    resOnomappuDesc: "Saluran YouTube seru tentang percakapan sehari-hari, slang, dan budaya.",
    resTeppeiDesc: "Podcast tingkat menengah. Dengarkan bahasa Jepang dengan kecepatan alami.",
    resYuyuDesc: "Podcast YouTube tingkat menengah. Pelajari ungkapan alami.",
    resSambonDesc: "Saluran menengah atas untuk tata bahasa, kosakata, dan persiapan JLPT.",
    resLevelN5N4: "Pemula (N5–N4)",
    resLevelN4N3: "Pemula-Men. (N4–N3)",
    resLevelN3N2: "Menengah (N3–N2)",
    resLevelN2N1: "Men. Atas (N2–N1)",
},

  "Vietnamese": {
    gakuSelfStudy: "GAKU TỰ HỌC",
    studyPlan: "Kế hoạch học tập",
    help: "🆘 Trợ giúp",
    editProfile: "✏️ Chỉnh sửa hồ sơ",
    weeklyProgress: "Tiến độ hàng tuần",
    tabSchedule: "📅 Lịch học",
    tabPractice: "🎯 Bài tập",
    tabVocabulary: "📚 Từ vựng",
    tabResources: "🔗 Tài liệu",
    tabMilestones: "🏆 Mục tiêu",
    yourWeeklySchedule: "📅 LỊCH HỌC HÀNG TUẦN CỦA BẠN",
    restDay: "Ngày nghỉ 🌸",
    monday: "THỨ HAI", tuesday: "THỨ BA", wednesday: "THỨ TƯ",
    thursday: "THỨ NĂM", friday: "THỨ SÁU", saturday: "THỨ BẢY", sunday: "CHỦ NHẬT",
    vocabReview: "Ôn từ vựng — Anki hoặc từ đã lưu (10 phút)",
    speakAloud: "Nói to: tóm tắt nội dung hôm nay bằng tiếng Nhật (5 phút)",
    taskConversation: "Nhập vai hoặc shadowing — cốt lõi CLT",
    taskListening: "NHK World hoặc JapanesePod101",
    taskReading: "Sách đọc theo cấp Tadoku hoặc NHK Web Easy",
    taskGrammar: "Imabi + viết 3 câu ví dụ",
    taskKanji: "Nihonten AI — 5 kanji mới trong ngữ cảnh",
    taskJlpt: "Japanese Test 4 You — một phần luyện tập",
    taskPronunciation: "Thẻ âm thanh Anki — shadow 20 từ",
    recommendedForLevel: "⭐ Đề xuất cho cấp độ của bạn",
    curatedFor: "Tuyển chọn cho cấp độ",
    yourResources: "🔗 TÀI LIỆU CỦA BẠN",
    curatedForLevel: "Tuyển chọn cho cấp độ",
    skills: "kỹ năng:",
    openResource: "Mở",
    noResources: "Không có tài liệu. Vui lòng chỉnh sửa hồ sơ và chọn kỹ năng học.",
    free: "MIỄN PHÍ", paid: "TRẢ PHÍ",
    vocab: "Từ vựng", grammar: "Ngữ pháp", reading: "Đọc hiểu", speaking: "Nói", listening: "Nghe",
    yourGoalRoadmap: "🏆 LỘ TRÌNH MỤC TIÊU CỦA BẠN",
    levelToGoal: "Cấp độ",
    goal: "Mục tiêu",
    youveGotThis: "Bạn làm được!",
    motivationText: "Mỗi cuộc trò chuyện, mỗi câu, mỗi từ đưa bạn đến gần hơn. CLT là về giao tiếp thực — và bạn đang làm điều đó rồi. 頑張ってください！",
    bookLesson: "Đặt Buổi Học Thử MIỄN PHÍ với GAKU →",
    weeksRemaining: "tuần còn lại",
    percentComplete: "% hoàn thành",
    refresh: "🔄 Làm mới",
    aiBuilding: "✨ AI đang xây dựng lịch học của bạn...",
    personalizing: "Cá nhân hóa kế hoạch theo mục tiêu và tiến độ của bạn...",
    helpTitle: "🆘 TRỢ GIÚP",
    whatWouldYouLike: "Bạn muốn gì?",
    customizedLesson: "📋 Bài học tùy chỉnh cho hôm nay",
    howToUse: "❓ Cách sử dụng ứng dụng này",
    back: "← Quay lại",
    howAreYouFeeling: "Hôm nay bạn cảm thấy thế nào?",
    mood: "TÂM TRẠNG", moodPlaceholder: "Chọn...",
    moodMotivated: "😤 Có động lực & năng lượng",
    moodOkay: "😐 Ổn, ngày bình thường",
    moodTired: "😴 Mệt & ít năng lượng",
    moodStressed: "😰 Căng thẳng hoặc lo lắng",
    moodHappy: "😊 Vui vẻ & thư giãn",
    availableTime: "THỜI GIAN CÓ SẴN",
    energyLevel: "MỨC NĂNG LƯỢNG",
    energyHigh: "🔥 Cao — sẵn sàng thử thách",
    energyMedium: "⚡ Trung bình — học bình thường",
    energyLow: "🌙 Thấp — chỉ ôn nhẹ",
    wantsDifferent: "Tôi muốn làm gì đó khác hôm nay",
    differentPlaceholder: "Cho chúng tôi biết bạn muốn làm gì hôm nay...",
    getTodaysPlan: "Nhận kế hoạch hôm nay ✨",
    generating: "Đang tạo...",
    tryAgain: "Thử lại",
    select: "Chọn...",
    tenMin: "10 phút", twentyMin: "20 phút", thirtyMin: "30 phút",
    oneHour: "1 giờ", oneHalfHour: "1,5 giờ+",
    formTitle: "Hồ sơ học tập của bạn",
    formEditTitle: "Chỉnh sửa hồ sơ học tập",
    formSubtitle: "Cho chúng tôi biết về bạn để tạo kế hoạch học CLT cá nhân hóa",
    formEditSubtitle: "Cập nhật chi tiết bên dưới — câu trả lời hiện có của bạn được giữ cho đến khi bạn thay đổi.",
    backToMyPlan: "← Trở về kế hoạch của tôi",
    yourName: "TÊN CỦA BẠN *",
    namePlaceholder: "vd. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "ban@email.com",
    country: "QUỐC GIA *",
    countryPlaceholder: "vd. Việt Nam, Nhật Bản...",
    yourNativeLanguage: "TIẾNG MẸ ĐẺ CỦA BẠN",
    finalGoal: "MỤC TIÊU CUỐI CÙNG *",
    selectGoal: "Chọn mục tiêu của bạn",
    goalN5: "Đạt JLPT N5", goalN4: "Đạt JLPT N4", goalN3: "Đạt JLPT N3",
    goalN2: "Đạt JLPT N2", goalN1: "Đạt JLPT N1",
    goalJob: "Tìm việc ở Nhật", goalTravel: "Du lịch Nhật Bản",
    goalStudyAbroad: "Du học Nhật Bản", goalConversation: "Giao tiếp hàng ngày",
    goalOther: "Khác",
    whatDoYouWantToStudy: "BẠN MUỐN HỌC GÌ?",
    customGoalPlaceholder: "Cho chúng tôi biết bạn muốn học hoặc đạt được gì...",
    whenAchieve: "KHI NÀO BẠN MUỐN ĐẠT ĐƯỢC? *",
    selectTimeline: "Chọn thời gian",
    lessThan6: "Dưới 6 tháng", within1: "Trong 1 năm",
    twoThreeYears: "2–3 năm", over3: "Trên 3 năm",
    currentJlpt: "CẤP ĐỘ JLPT HIỆN TẠI *",
    autoFilled: "Tự động điền từ bài kiểm tra của bạn",
    changeLevel: "Nếu bạn muốn thay đổi cấp độ, vui lòng chọn bên dưới.",
    selectLevel: "Chọn cấp độ",
    beginner: "Người mới bắt đầu",
    studyTimePerDay: "THỜI GIAN HỌC MỖI NGÀY *",
    selectHours: "Chọn giờ",
    lessThan1h: "Dưới 1 giờ", oneTwo: "1–2 giờ",
    twoThree: "2–3 giờ", threePlus: "3+ giờ",
    daysPerWeek: "BẠN MUỐN HỌC MẤY NGÀY MỖI TUẦN? *",
    selectDays: "Chọn ngày",
    oneTwoDays: "1–2 ngày", threeFourDays: "3–4 ngày",
    fiveSixDays: "5–6 ngày", everyDay: "Mỗi ngày",
    whatStudySkills: "BẠN MUỐN HỌC GÌ? * (chọn tất cả những gì phù hợp)",
    writingNote: "✍️ Luyện viết có sẵn trong tab Viết cho tất cả người dùng",
    saveChanges: "Lưu thay đổi →",
    buildPlan: "Tạo kế hoạch học của tôi →",
    fillRequired: "Vui lòng điền tất cả các trường bắt buộc (*) và chọn ít nhất một kỹ năng.",
    skillPronunciation: "🔊 Phát âm", skillListening: "👂 Nghe",
    skillConversation: "💬 Hội thoại", skillJlpt: "🎯 Luyện JLPT",
    skillReading: "📖 Đọc hiểu", skillKanji: "🈳 Kanji", skillGrammar: "📝 Ngữ pháp",
    howToTitle: "Cách sử dụng ứng dụng này",
    howToSchedule: "Kế hoạch học hàng tuần của bạn, chia thành các nhiệm vụ hàng ngày. Nhấn nhiệm vụ để đánh dấu hoàn thành.",
    howToPractice: "Bài tập do AI tạo dựa trên các kỹ năng bạn chọn. Nhấn 'Hiện đáp án' để kiểm tra.",
    howToVocab: "Tìm kiếm bất kỳ chủ đề nào để nhận từ vựng phù hợp với cấp độ cùng câu ví dụ. Lưu từ muốn ghi nhớ.",
    howToResources: "Công cụ miễn phí (và một số có phí) phù hợp với kỹ năng bạn chọn.",
    howToMilestones: "Lộ trình hướng tới mục tiêu của bạn. Nhấn từng cột mốc khi hoàn thành.",
    howToEditProfile: "Cập nhật mục tiêu, cấp độ, lịch học hoặc kỹ năng bất kỳ lúc nào.",
    howToHelp: "Nhận kế hoạch cá nhân hóa cho hôm nay dựa trên tâm trạng, thời gian và năng lượng của bạn.",
      vocabBuilderTitle: "📚 TRÌNH XÂY DỰNG TỪ VỰNG",
    vocabBuilderDesc: "Nhập một chủ đề để xem các từ liên quan từ từ điển tiếng Nhật (English hoặc 日本語 đều được)",
    vocabSearchPlaceholder: "vd. thức ăn, du lịch, cảm xúc...",
    findWordsBtn: "Tìm từ",
    libraryLabel: "📚 Thư viện",
    yourVocabSaved: "Từ vựng của bạn",
    savedSuffix: "đã lưu",
    wordCardsLabel: "🃏 Thẻ từ",
    searchCreateCards: "Tìm kiếm & tạo thẻ",
    flashcardsLabel: "🎴 Thẻ ghi nhớ",
    reviewSavedWords: "Ôn lại từ đã lưu",
    searchingDictionary: "Đang tìm trong từ điển tiếng Nhật...",
    speakWord: "Phát âm từ",
    speakExample: "Phát âm ví dụ",
    weblioDict: "📖 Từ điển Weblio",
    googleImages: "🖼 Hình ảnh Google",
    detailCard: "🃏 Thẻ chi tiết",
    retryBtn: "Thử lại",
    resShunDesc: "Kênh YouTube thân thiện cho người mới bắt đầu. Tuyệt vời để luyện nghe.",
    resMarugotoDesc: "Khóa học sơ-trung cấp của Japan Foundation. Phương pháp giao tiếp.",
    resOnomappuDesc: "Kênh YouTube thú vị về hội thoại hàng ngày, tiếng lóng và văn hóa.",
    resTeppeiDesc: "Podcast trình độ trung cấp. Nghe tiếng Nhật với tốc độ tự nhiên.",
    resYuyuDesc: "Podcast YouTube trình độ trung cấp. Học các cách diễn đạt tự nhiên.",
    resSambonDesc: "Kênh trung-cao cấp về ngữ pháp, từ vựng và luyện thi JLPT.",
    resLevelN5N4: "Sơ cấp (N5–N4)",
    resLevelN4N3: "Sơ-Trung (N4–N3)",
    resLevelN3N2: "Trung cấp (N3–N2)",
    resLevelN2N1: "Trung-Cao (N2–N1)",
},

  "Hindi": {
    gakuSelfStudy: "GAKU स्व-अध्ययन",
    studyPlan: "अध्ययन योजना",
    help: "🆘 सहायता",
    editProfile: "✏️ प्रोफ़ाइल संपादित करें",
    weeklyProgress: "साप्ताहिक प्रगति",
    tabSchedule: "📅 समय-सारणी",
    tabPractice: "🎯 अभ्यास",
    tabVocabulary: "📚 शब्दावली",
    tabResources: "🔗 संसाधन",
    tabMilestones: "🏆 लक्ष्य",
    yourWeeklySchedule: "📅 आपकी साप्ताहिक अध्ययन समय-सारणी",
    restDay: "आराम का दिन 🌸",
    monday: "सोमवार", tuesday: "मंगलवार", wednesday: "बुधवार",
    thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार", sunday: "रविवार",
    vocabReview: "शब्दावली दोहराना — Anki या सहेजे गए शब्द (10 मिनट)",
    speakAloud: "ज़ोर से बोलें: आज का सारांश जापानी में बोलें (5 मिनट)",
    taskConversation: "भूमिका-अभिनय या shadowing — CLT का आधार",
    taskListening: "NHK World या JapanesePod101",
    taskReading: "Tadoku ग्रेडेड रीडर या NHK Web Easy",
    taskGrammar: "Imabi + 3 उदाहरण वाक्य लिखें",
    taskKanji: "Nihonten AI — 5 नए कांजी संदर्भ में",
    taskJlpt: "Japanese Test 4 You — एक अभ्यास अनुभाग",
    taskPronunciation: "Anki ऑडियो कार्ड — 20 शब्दों की shadow करें",
    recommendedForLevel: "⭐ आपके स्तर के लिए अनुशंसित",
    curatedFor: "स्तर के लिए चुना गया",
    yourResources: "🔗 आपके संसाधन",
    curatedForLevel: "स्तर के लिए चुना गया",
    skills: "कौशल:",
    openResource: "खोलें",
    noResources: "कोई संसाधन नहीं। कृपया अपनी प्रोफ़ाइल संपादित करें और अध्ययन कौशल चुनें।",
    free: "मुफ़्त", paid: "भुगतान",
    vocab: "शब्दावली", grammar: "व्याकरण", reading: "पठन", speaking: "बोलना", listening: "सुनना",
    yourGoalRoadmap: "🏆 आपका लक्ष्य रोडमैप",
    levelToGoal: "स्तर",
    goal: "लक्ष्य",
    youveGotThis: "आप यह कर सकते हैं!",
    motivationText: "हर बातचीत, हर वाक्य, हर शब्द आपको करीब लाता है। CLT वास्तविक संचार के बारे में है — और आप पहले से ही कर रहे हैं। 頑張ってください！",
    bookLesson: "GAKU के साथ मुफ़्त ट्रायल लेसन बुक करें →",
    weeksRemaining: "सप्ताह शेष",
    percentComplete: "% पूर्ण",
    refresh: "🔄 रीफ्रेश",
    aiBuilding: "✨ AI आपका शेड्यूल बना रहा है...",
    personalizing: "आपके लक्ष्य और प्रगति के आधार पर आपकी योजना को व्यक्तिगत बनाया जा रहा है...",
    helpTitle: "🆘 सहायता",
    whatWouldYouLike: "आप क्या चाहते हैं?",
    customizedLesson: "📋 आज के लिए अनुकूलित पाठ",
    howToUse: "❓ इस ऐप का उपयोग कैसे करें",
    back: "← वापस",
    howAreYouFeeling: "आप आज कैसा महसूस कर रहे हैं?",
    mood: "मनोदशा", moodPlaceholder: "चुनें...",
    moodMotivated: "😤 प्रेरित और ऊर्जावान",
    moodOkay: "😐 ठीक है, सामान्य दिन",
    moodTired: "😴 थका हुआ और कम ऊर्जा",
    moodStressed: "😰 तनावग्रस्त या चिंतित",
    moodHappy: "😊 खुश और शांत",
    availableTime: "उपलब्ध समय",
    energyLevel: "ऊर्जा स्तर",
    energyHigh: "🔥 उच्च — चुनौती के लिए तैयार",
    energyMedium: "⚡ मध्यम — सामान्य अध्ययन",
    energyLow: "🌙 कम — केवल हल्की समीक्षा",
    wantsDifferent: "मैं आज कुछ अलग करना चाहता हूं",
    differentPlaceholder: "हमें बताएं कि आप आज क्या करना चाहते हैं...",
    getTodaysPlan: "आज की योजना प्राप्त करें ✨",
    generating: "तैयार हो रहा है...",
    tryAgain: "फिर कोशिश करें",
    select: "चुनें...",
    tenMin: "10 मिनट", twentyMin: "20 मिनट", thirtyMin: "30 मिनट",
    oneHour: "1 घंटा", oneHalfHour: "1.5 घंटे+",
    formTitle: "आपकी शिक्षा प्रोफ़ाइल",
    formEditTitle: "अपनी शिक्षा प्रोफ़ाइल संपादित करें",
    formSubtitle: "व्यक्तिगत CLT अध्ययन योजना बनाने के लिए अपने बारे में बताएं",
    formEditSubtitle: "नीचे विवरण अपडेट करें — आपके मौजूदा उत्तर तब तक बने रहते हैं जब तक आप उन्हें बदलते नहीं।",
    backToMyPlan: "← मेरी योजना पर वापस जाएं",
    yourName: "आपका नाम *",
    namePlaceholder: "उदा. Tanaka Yuki",
    email: "ईमेल *",
    emailPlaceholder: "aap@email.com",
    country: "देश *",
    countryPlaceholder: "उदा. भारत, जापान...",
    yourNativeLanguage: "आपकी मातृभाषा",
    finalGoal: "अंतिम लक्ष्य *",
    selectGoal: "अपना लक्ष्य चुनें",
    goalN5: "JLPT N5 पास करें", goalN4: "JLPT N4 पास करें", goalN3: "JLPT N3 पास करें",
    goalN2: "JLPT N2 पास करें", goalN1: "JLPT N1 पास करें",
    goalJob: "जापान में नौकरी पाएं", goalTravel: "जापान यात्रा करें",
    goalStudyAbroad: "जापान में पढ़ाई करें", goalConversation: "दैनिक बातचीत",
    goalOther: "अन्य",
    whatDoYouWantToStudy: "आप क्या पढ़ना चाहते हैं?",
    customGoalPlaceholder: "हमें बताएं कि आप क्या सीखना या हासिल करना चाहते हैं...",
    whenAchieve: "आप इसे कब हासिल करना चाहते हैं? *",
    selectTimeline: "समय-सीमा चुनें",
    lessThan6: "6 महीने से कम", within1: "1 साल के भीतर",
    twoThreeYears: "2–3 साल", over3: "3 साल से अधिक",
    currentJlpt: "वर्तमान JLPT स्तर *",
    autoFilled: "आपके परीक्षण से स्वतः भरा गया",
    changeLevel: "यदि आप अपना स्तर बदलना चाहते हैं, तो नीचे चुनें।",
    selectLevel: "स्तर चुनें",
    beginner: "शुरुआती",
    studyTimePerDay: "प्रतिदिन अध्ययन समय *",
    selectHours: "घंटे चुनें",
    lessThan1h: "1 घंटे से कम", oneTwo: "1–2 घंटे",
    twoThree: "2–3 घंटे", threePlus: "3+ घंटे",
    daysPerWeek: "आप सप्ताह में कितने दिन पढ़ना चाहते हैं? *",
    selectDays: "दिन चुनें",
    oneTwoDays: "1–2 दिन", threeFourDays: "3–4 दिन",
    fiveSixDays: "5–6 दिन", everyDay: "हर दिन",
    whatStudySkills: "आप क्या पढ़ना चाहते हैं? * (सभी लागू चुनें)",
    writingNote: "✍️ लेखन अभ्यास सभी उपयोगकर्ताओं के लिए Writing टैब में उपलब्ध है",
    saveChanges: "परिवर्तन सहेजें →",
    buildPlan: "मेरी अध्ययन योजना बनाएं →",
    fillRequired: "कृपया सभी आवश्यक फ़ील्ड (*) भरें और कम से कम एक कौशल चुनें।",
    skillPronunciation: "🔊 उच्चारण", skillListening: "👂 सुनना",
    skillConversation: "💬 बातचीत", skillJlpt: "🎯 JLPT तैयारी",
    skillReading: "📖 पठन", skillKanji: "🈳 Kanji", skillGrammar: "📝 व्याकरण",
    howToTitle: "इस ऐप का उपयोग कैसे करें",
    howToSchedule: "आपकी साप्ताहिक अध्ययन योजना, दैनिक कार्यों में विभाजित। साप्ताहिक प्रगति ट्रैक करने के लिए कार्य टैप करें।",
    howToPractice: "आपकी प्रोफ़ाइल में चुने गए कौशल के आधार पर AI-जनित अभ्यास। जांचने के लिए 'उत्तर दिखाएं' टैप करें।",
    howToVocab: "किसी भी विषय के लिए खोजें और उदाहरण वाक्यों के साथ स्तर-उपयुक्त शब्द पाएं।",
    howToResources: "आपके चुने हुए कौशल से मेल खाने वाले मुफ़्त (और कुछ सशुल्क) टूल।",
    howToMilestones: "आपके लक्ष्य की ओर रोडमैप। पूरा होने पर प्रत्येक मील का पत्थर टैप करें।",
    howToEditProfile: "कभी भी अपने लक्ष्य, स्तर, समय-सारणी या कौशल अपडेट करें।",
    howToHelp: "आज अपने मूड, समय और ऊर्जा के आधार पर व्यक्तिगत योजना प्राप्त करें।",
      vocabBuilderTitle: "📚 शब्दावली निर्माता",
    vocabBuilderDesc: "जापानी शब्दकोश से संबंधित शब्द देखने के लिए एक विषय दर्ज करें (English या 日本語 ठीक है)",
    vocabSearchPlaceholder: "जैसे भोजन, यात्रा, भावनाएं...",
    findWordsBtn: "शब्द खोजें",
    libraryLabel: "📚 लाइब्रेरी",
    yourVocabSaved: "आपकी शब्दावली",
    savedSuffix: "सहेजे गए",
    wordCardsLabel: "🃏 शब्द कार्ड",
    searchCreateCards: "कार्ड खोजें और बनाएं",
    flashcardsLabel: "🎴 फ्लैशकार्ड",
    reviewSavedWords: "सहेजे गए शब्दों की समीक्षा करें",
    searchingDictionary: "जापानी शब्दकोश खोज रहे हैं...",
    speakWord: "शब्द का उच्चारण करें",
    speakExample: "उदाहरण का उच्चारण करें",
    weblioDict: "📖 Weblio शब्दकोश",
    googleImages: "🖼 Google छवियां",
    detailCard: "🃏 विवरण कार्ड",
    retryBtn: "फिर से कोशिश करें",
    resShunDesc: "शुरुआती लोगों के लिए YouTube चैनल। सुनने के अभ्यास के लिए बेहतरीन।",
    resMarugotoDesc: "Japan Foundation का प्रारंभिक-मध्यवर्ती कोर्स। संवादात्मक शिक्षण विधि।",
    resOnomappuDesc: "रोज़मर्रा की बातचीत, स्लैंग और संस्कृति के बारे में मज़ेदार YouTube चैनल।",
    resTeppeiDesc: "मध्यवर्ती स्तर का पॉडकास्ट। स्वाभाविक गति की जापानी सुनें।",
    resYuyuDesc: "मध्यवर्ती स्तर का YouTube पॉडकास्ट। स्वाभाविक जापानी अभिव्यक्तियाँ सीखें।",
    resSambonDesc: "व्याकरण, शब्दावली और JLPT तैयारी के लिए उच्च-मध्यवर्ती चैनल।",
    resLevelN5N4: "प्रारंभिक (N5–N4)",
    resLevelN4N3: "प्रारं.-मध्य (N4–N3)",
    resLevelN3N2: "मध्यवर्ती (N3–N2)",
    resLevelN2N1: "उच्च-मध्य (N2–N1)",
},

  "Japanese": {
    gakuSelfStudy: "GAKU 自習",
    studyPlan: "学習プラン",
    help: "🆘 ヘルプ",
    editProfile: "✏️ プロフィール編集",
    weeklyProgress: "週間進捗",
    tabSchedule: "📅 スケジュール",
    tabPractice: "🎯 練習問題",
    tabVocabulary: "📚 単語帳",
    tabResources: "🔗 リソース",
    tabMilestones: "🏆 目標",
    yourWeeklySchedule: "📅 あなたの週間学習スケジュール",
    restDay: "休息日 🌸",
    monday: "月曜日", tuesday: "火曜日", wednesday: "水曜日",
    thursday: "木曜日", friday: "金曜日", saturday: "土曜日", sunday: "日曜日",
    vocabReview: "単語復習 — Ankiまたは保存した単語（10分）",
    speakAloud: "音読：今日の内容を日本語で要約する（5分）",
    taskConversation: "ロールプレイまたはシャドーイング — CLTの核",
    taskListening: "NHK WorldまたはJapanesePod101",
    taskReading: "Tadoku多読リーダーまたはNHK Web Easy",
    taskGrammar: "Imabi + 例文を3つ書く",
    taskKanji: "Nihonten AI — 文脈で新しい漢字を5つ",
    taskJlpt: "Japanese Test 4 You — 練習セクション1つ",
    taskPronunciation: "Ankiオーディオカード — 20単語シャドーイング",
    recommendedForLevel: "⭐ あなたのレベルにおすすめ",
    curatedFor: "レベル別に厳選",
    yourResources: "🔗 あなたのリソース",
    curatedForLevel: "レベル別に厳選",
    skills: "スキル：",
    openResource: "開く",
    noResources: "リソースがありません。プロフィールを編集し、学習スキルを選択してください。",
    free: "無料", paid: "有料",
    vocab: "単語", grammar: "文法", reading: "読解", speaking: "会話", listening: "聴解",
    yourGoalRoadmap: "🏆 あなたの目標ロードマップ",
    levelToGoal: "レベル",
    goal: "目標",
    youveGotThis: "あなたならできる！",
    motivationText: "すべての会話、すべての文、すべての単語があなたを目標に近づけます。CLTは実際のコミュニケーションについてのもの — あなたはもうそれをしています。頑張ってください！",
    bookLesson: "GAKUで無料体験レッスンを予約 →",
    weeksRemaining: "週間残り",
    percentComplete: "% 完了",
    refresh: "🔄 更新",
    aiBuilding: "✨ AIがスケジュールを作成中...",
    personalizing: "目標と進捗に基づいてプランをカスタマイズ中...",
    helpTitle: "🆘 ヘルプ",
    whatWouldYouLike: "何をしますか？",
    customizedLesson: "📋 今日のカスタムレッスン",
    howToUse: "❓ このアプリの使い方",
    back: "← 戻る",
    howAreYouFeeling: "今日の気分は？",
    mood: "気分", moodPlaceholder: "選択...",
    moodMotivated: "😤 やる気とエネルギーがある",
    moodOkay: "😐 普通、いつも通りの日",
    moodTired: "😴 疲れていてエネルギーが低い",
    moodStressed: "😰 ストレスや不安を感じている",
    moodHappy: "😊 幸せでリラックスしている",
    availableTime: "使える時間",
    energyLevel: "エネルギーレベル",
    energyHigh: "🔥 高い — チャレンジ準備OK",
    energyMedium: "⚡ 普通 — 通常の学習",
    energyLow: "🌙 低い — 軽い復習のみ",
    wantsDifferent: "今日は違うことをしたい",
    differentPlaceholder: "今日何をしたいか教えてください...",
    getTodaysPlan: "今日のプランを取得 ✨",
    generating: "生成中...",
    tryAgain: "もう一度試す",
    select: "選択...",
    tenMin: "10分", twentyMin: "20分", thirtyMin: "30分",
    oneHour: "1時間", oneHalfHour: "1.5時間以上",
    formTitle: "あなたの学習プロフィール",
    formEditTitle: "学習プロフィールを編集",
    formSubtitle: "あなたについて教えてください。パーソナライズされたCLT学習プランを作成します",
    formEditSubtitle: "下の詳細を更新してください — 変更するまで既存の回答は保持されます。",
    backToMyPlan: "← マイプランに戻る",
    yourName: "お名前 *",
    namePlaceholder: "例：田中ゆき",
    email: "メールアドレス *",
    emailPlaceholder: "you@email.com",
    country: "国 *",
    countryPlaceholder: "例：日本、アメリカ...",
    yourNativeLanguage: "母語",
    finalGoal: "最終目標 *",
    selectGoal: "目標を選択",
    goalN5: "JLPT N5に合格する", goalN4: "JLPT N4に合格する", goalN3: "JLPT N3に合格する",
    goalN2: "JLPT N2に合格する", goalN1: "JLPT N1に合格する",
    goalJob: "日本で仕事を見つける", goalTravel: "日本を旅行する",
    goalStudyAbroad: "日本に留学する", goalConversation: "日常会話",
    goalOther: "その他",
    whatDoYouWantToStudy: "何を勉強したいですか？",
    customGoalPlaceholder: "勉強したいことや達成したいことを教えてください...",
    whenAchieve: "いつまでに達成したいですか？ *",
    selectTimeline: "期間を選択",
    lessThan6: "6か月未満", within1: "1年以内",
    twoThreeYears: "2〜3年", over3: "3年以上",
    currentJlpt: "現在のJLPTレベル *",
    autoFilled: "テストから自動入力されました",
    changeLevel: "レベルを変更したい場合は下から選択してください。",
    selectLevel: "レベルを選択",
    beginner: "初心者",
    studyTimePerDay: "1日の学習時間 *",
    selectHours: "時間を選択",
    lessThan1h: "1時間未満", oneTwo: "1〜2時間",
    twoThree: "2〜3時間", threePlus: "3時間以上",
    daysPerWeek: "週、何日学習しますか？ *",
    selectDays: "日数を選択",
    oneTwoDays: "週1〜2日", threeFourDays: "週3〜4日",
    fiveSixDays: "週5〜6日", everyDay: "毎日",
    whatStudySkills: "何を勉強したいですか？ * (該当するものをすべて選択)",
    writingNote: "✍️ ライティング練習は全ユーザー向けにWritingタブで利用できます",
    saveChanges: "変更を保存 →",
    buildPlan: "学習プランを作成 →",
    fillRequired: "必須項目（*）をすべて入力し、少なくとも1つのスキルを選択してください。",
    skillPronunciation: "🔊 発音", skillListening: "👂 リスニング",
    skillConversation: "💬 会話", skillJlpt: "🎯 JLPT対策",
    skillReading: "📖 読解", skillKanji: "🈳 漢字", skillGrammar: "📝 文法",
    howToTitle: "このアプリの使い方",
    howToSchedule: "週間学習プランを日々のタスクに分割しています。タスクをタップして完了をマークし、週間進捗を追跡します。",
    howToPractice: "プロフィールで選んだスキルに基づいたAI生成の練習問題です。「答えを見る」をタップして確認できます。",
    howToVocab: "任意のトピックを検索すると、あなたのレベルに合った単語と例文が表示されます。覚えたい単語を保存できます。",
    howToResources: "選択したスキルに合った無料（一部有料）のツールを直接ここから開けます。",
    howToMilestones: "目標へのロードマップです。達成するたびに各マイルストーンをタップしてください。",
    howToEditProfile: "目標、レベル、スケジュール、スキルはいつでも更新できます。",
    howToHelp: "今日の気分、時間、エネルギーに基づいてパーソナライズされたプランを取得できます。",
      vocabBuilderTitle: "📚 単語ビルダー",
    vocabBuilderDesc: "トピックを入力すると、日本語辞書から関連単語を表示します（English or 日本語OK）",
    vocabSearchPlaceholder: "例：食べ物、旅行、感情...",
    findWordsBtn: "単語を検索",
    libraryLabel: "📚 ライブラリ",
    yourVocabSaved: "あなたの単語帳",
    savedSuffix: "件保存済み",
    wordCardsLabel: "🃏 単語カード",
    searchCreateCards: "検索してカード作成",
    flashcardsLabel: "🎴 フラッシュカード",
    reviewSavedWords: "保存した単語を復習",
    searchingDictionary: "日本語辞書を検索中...",
    speakWord: "単語を発音",
    speakExample: "例文を発音",
    weblioDict: "📖 Weblio辞書",
    googleImages: "🖼 Google画像",
    detailCard: "🃏 詳細カード",
    retryBtn: "再試行",
    resShunDesc: "初級向けYouTubeチャンネル。聞き取り練習に最適。",
    resMarugotoDesc: "国際交流基金の初中級コース。コミュニカティブな学習法。",
    resOnomappuDesc: "日常会話・スラング・文化を楽しく学べるYouTubeチャンネル。",
    resTeppeiDesc: "中級者向けポッドキャスト。ナチュラルスピードの日本語が聞ける。",
    resYuyuDesc: "中級者向けYouTubeポッドキャスト。自然な日本語表現が学べる。",
    resSambonDesc: "中上級向け文法・語彙・JLPT対策チャンネル。",
    resLevelN5N4: "初級 (N5〜N4)",
    resLevelN4N3: "初中級 (N4〜N3)",
    resLevelN3N2: "中級 (N3〜N2)",
    resLevelN2N1: "中上級 (N2〜N1)",
},

  "Turkish": {
    gakuSelfStudy: "GAKU KENDİ KENDİNE ÇALIŞMA",
    studyPlan: "Çalışma planı",
    help: "🆘 Yardım",
    editProfile: "✏️ Profili düzenle",
    weeklyProgress: "Haftalık ilerleme",
    tabSchedule: "📅 Program",
    tabPractice: "🎯 Alıştırma",
    tabVocabulary: "📚 Kelime Bilgisi",
    tabResources: "🔗 Kaynaklar",
    tabMilestones: "🏆 Hedefler",
    yourWeeklySchedule: "📅 HAFTALIK ÇALIŞMA PROGRAMINIZ",
    restDay: "Dinlenme günü 🌸",
    monday: "PAZARTESİ", tuesday: "SALI", wednesday: "ÇARŞAMBA",
    thursday: "PERŞEMBE", friday: "CUMA", saturday: "CUMARTESİ", sunday: "PAZAR",
    vocabReview: "Kelime tekrarı — Anki veya kaydedilen kelimeler (10 dk)",
    speakAloud: "Sesli konuş: bugünün içeriğini Japonca özetle (5 dk)",
    taskConversation: "Rol yapma veya shadowing — CLT'nin özü",
    taskListening: "NHK World veya JapanesePod101",
    taskReading: "Tadoku kademeli okuyucu veya NHK Web Easy",
    taskGrammar: "Imabi + 3 örnek cümle yaz",
    taskKanji: "Nihonten AI — bağlam içinde 5 yeni kanji",
    taskJlpt: "Japanese Test 4 You — bir alıştırma bölümü",
    taskPronunciation: "Anki ses kartları — 20 kelime shadow et",
    recommendedForLevel: "⭐ Seviyeniz için önerilir",
    curatedFor: "Seviye için seçildi",
    yourResources: "🔗 KAYNAKLARINIZ",
    curatedForLevel: "Seviye için seçildi",
    skills: "beceriler:",
    openResource: "Aç",
    noResources: "Kaynak yok. Lütfen profilinizi düzenleyin ve çalışma becerilerini seçin.",
    free: "ÜCRETSİZ", paid: "ÜCRETLİ",
    vocab: "Kelime", grammar: "Dil Bilgisi", reading: "Okuma", speaking: "Konuşma", listening: "Dinleme",
    yourGoalRoadmap: "🏆 HEDEF YOL HARİTANIZ",
    levelToGoal: "Seviye",
    goal: "Hedef",
    youveGotThis: "Bunu başarabilirsin!",
    motivationText: "Her konuşma, her cümle, her kelime seni hedefe yaklaştırır. CLT gerçek iletişimle ilgilidir — ve sen bunu zaten yapıyorsun. 頑張ってください！",
    bookLesson: "GAKU ile ÜCRETSİZ deneme dersi ayırtın →",
    weeksRemaining: "hafta kaldı",
    percentComplete: "% tamamlandı",
    refresh: "🔄 Yenile",
    aiBuilding: "✨ AI programınızı oluşturuyor...",
    personalizing: "Plan, hedefinize ve ilerlemenize göre kişiselleştiriliyor...",
    helpTitle: "🆘 YARDIM",
    whatWouldYouLike: "Ne yapmak istersiniz?",
    customizedLesson: "📋 Bugün için özelleştirilmiş ders",
    howToUse: "❓ Bu uygulama nasıl kullanılır",
    back: "← Geri",
    howAreYouFeeling: "Bugün nasıl hissediyorsun?",
    mood: "RUH HALİ", moodPlaceholder: "Seç...",
    moodMotivated: "😤 Motive ve enerjik",
    moodOkay: "😐 İyi, normal bir gün",
    moodTired: "😴 Yorgun ve düşük enerjili",
    moodStressed: "😰 Stresli veya endişeli",
    moodHappy: "😊 Mutlu ve rahat",
    availableTime: "MEVCUT ZAMAN",
    energyLevel: "ENERJİ SEVİYESİ",
    energyHigh: "🔥 Yüksek — zorluklara hazır",
    energyMedium: "⚡ Orta — normal çalışma",
    energyLow: "🌙 Düşük — sadece hafif tekrar",
    wantsDifferent: "Bugün farklı bir şey yapmak istiyorum",
    differentPlaceholder: "Bugün ne yapmak istediğinizi söyleyin...",
    getTodaysPlan: "Bugünün planını al ✨",
    generating: "Oluşturuluyor...",
    tryAgain: "Tekrar dene",
    select: "Seç...",
    tenMin: "10 dakika", twentyMin: "20 dakika", thirtyMin: "30 dakika",
    oneHour: "1 saat", oneHalfHour: "1,5 saat+",
    formTitle: "Öğrenme profiliniz",
    formEditTitle: "Öğrenme profilinizi düzenleyin",
    formSubtitle: "Kişiselleştirilmiş CLT çalışma planınızı oluşturmak için bize kendinizden bahsedin",
    formEditSubtitle: "Aşağıdaki detayları güncelleyin — mevcut cevaplarınız siz değiştirene kadar saklanır.",
    backToMyPlan: "← Planıma geri dön",
    yourName: "ADINIZ *",
    namePlaceholder: "örn. Tanaka Yuki",
    email: "E-POSTA *",
    emailPlaceholder: "siz@email.com",
    country: "ÜLKE *",
    countryPlaceholder: "örn. Türkiye, Japonya...",
    yourNativeLanguage: "ANA DİLİNİZ",
    finalGoal: "NİHAİ HEDEF *",
    selectGoal: "Hedefinizi seçin",
    goalN5: "JLPT N5'i geç", goalN4: "JLPT N4'ü geç", goalN3: "JLPT N3'ü geç",
    goalN2: "JLPT N2'yi geç", goalN1: "JLPT N1'i geç",
    goalJob: "Japonya'da iş bul", goalTravel: "Japonya'ya seyahat et",
    goalStudyAbroad: "Japonya'da okuyun", goalConversation: "Günlük konuşma",
    goalOther: "Diğer",
    whatDoYouWantToStudy: "NE ÇALIŞMAK İSTİYORSUNUZ?",
    customGoalPlaceholder: "Ne öğrenmek veya başarmak istediğinizi söyleyin...",
    whenAchieve: "BUNU NE ZAMAN BAŞARMAK İSTİYORSUNUZ? *",
    selectTimeline: "Zaman dilimi seç",
    lessThan6: "6 aydan az", within1: "1 yıl içinde",
    twoThreeYears: "2–3 yıl", over3: "3 yıldan fazla",
    currentJlpt: "MEVCUT JLPT SEVİYESİ *",
    autoFilled: "Testinizden otomatik dolduruldu",
    changeLevel: "Seviyenizi değiştirmek isterseniz aşağıdan seçin.",
    selectLevel: "Seviye seç",
    beginner: "Başlangıç",
    studyTimePerDay: "GÜNLÜK ÇALIŞMA SÜRESİ *",
    selectHours: "Saat seç",
    lessThan1h: "1 saatten az", oneTwo: "1–2 saat",
    twoThree: "2–3 saat", threePlus: "3+ saat",
    daysPerWeek: "HAFTADA KAÇ GÜN ÇALIŞMAK İSTİYORSUNUZ? *",
    selectDays: "Gün seç",
    oneTwoDays: "1–2 gün", threeFourDays: "3–4 gün",
    fiveSixDays: "5–6 gün", everyDay: "Her gün",
    whatStudySkills: "NE ÇALIŞMAK İSTİYORSUNUZ? * (geçerli olanların hepsini seçin)",
    writingNote: "✍️ Yazma pratiği tüm kullanıcılar için Yazma sekmesinde mevcuttur",
    saveChanges: "Değişiklikleri kaydet →",
    buildPlan: "Çalışma planımı oluştur →",
    fillRequired: "Lütfen tüm zorunlu alanları (*) doldurun ve en az bir beceri seçin.",
    skillPronunciation: "🔊 Telaffuz", skillListening: "👂 Dinleme",
    skillConversation: "💬 Konuşma", skillJlpt: "🎯 JLPT Hazırlık",
    skillReading: "📖 Okuma", skillKanji: "🈳 Kanji", skillGrammar: "📝 Dil Bilgisi",
    howToTitle: "Bu uygulama nasıl kullanılır",
    howToSchedule: "Günlük görevlere bölünmüş haftalık çalışma planınız. Tamamlandı olarak işaretlemek için bir göreve dokunun.",
    howToPractice: "Profilinizde seçtiğiniz becerilere dayalı AI tarafından oluşturulan alıştırmalar. Kontrol etmek için 'Cevabı göster'e dokunun.",
    howToVocab: "Seviyenize uygun kelimeleri örnek cümlelerle almak için herhangi bir konu arayın. Hatırlamak istediğiniz kelimeleri kaydedin.",
    howToResources: "Seçtiğiniz becerilerle eşleşen ücretsiz (ve bazı ücretli) araçlar, doğrudan buradan açılır.",
    howToMilestones: "Hedefinize giden yol haritanız. Her kilometre taşını tamamladığınızda dokunun.",
    howToEditProfile: "Hedeflerinizi, seviyenizi, programınızı veya becerilerinizi istediğiniz zaman güncelleyin.",
    howToHelp: "Bugünkü ruh haliniz, zamanınız ve enerjinize göre kişiselleştirilmiş bir plan alın.",
      vocabBuilderTitle: "📚 KELİME OLUŞTURUCU",
    vocabBuilderDesc: "Japonca sözlükten ilgili kelimeleri görmek için bir konu girin (English veya 日本語 olabilir)",
    vocabSearchPlaceholder: "örn. yemek, seyahat, duygular...",
    findWordsBtn: "Kelime bul",
    libraryLabel: "📚 Kütüphane",
    yourVocabSaved: "Kelime hazineniz",
    savedSuffix: "kaydedildi",
    wordCardsLabel: "🃏 Kelime kartları",
    searchCreateCards: "Kart ara ve oluştur",
    flashcardsLabel: "🎴 Bilgi kartları",
    reviewSavedWords: "Kaydedilen kelimeleri gözden geçir",
    searchingDictionary: "Japonca sözlükte aranıyor...",
    speakWord: "Kelimeyi telaffuz et",
    speakExample: "Örneği telaffuz et",
    weblioDict: "📖 Weblio Sözlük",
    googleImages: "🖼 Google Görseller",
    detailCard: "🃏 Detay kartı",
    retryBtn: "Tekrar dene",
    resShunDesc: "Başlangıç seviyesi için YouTube kanalı. Dinleme pratiği için harika.",
    resMarugotoDesc: "Japan Foundation'ın başlangıç-orta seviye kursu. İletişimsel öğrenme yöntemi.",
    resOnomappuDesc: "Günlük konuşma, argo ve kültür hakkında eğlenceli YouTube kanalı.",
    resTeppeiDesc: "Orta seviye podcast. Doğal hızda Japonca dinleyin.",
    resYuyuDesc: "Orta seviye YouTube podcast'i. Doğal ifadeler öğrenin.",
    resSambonDesc: "Dilbilgisi, kelime bilgisi ve JLPT hazırlığı için üst-orta seviye kanal.",
    resLevelN5N4: "Başlangıç (N5–N4)",
    resLevelN4N3: "Başl.-Orta (N4–N3)",
    resLevelN3N2: "Orta (N3–N2)",
    resLevelN2N1: "Üst-Orta (N2–N1)",
},

  "Nepali": {
    gakuSelfStudy: "GAKU स्व-अध्ययन",
    studyPlan: "अध्ययन योजना",
    help: "🆘 मद्दत",
    editProfile: "✏️ प्रोफाइल सम्पादन गर्नुहोस्",
    weeklyProgress: "साप्ताहिक प्रगति",
    tabSchedule: "📅 तालिका",
    tabPractice: "🎯 अभ्यास",
    tabVocabulary: "📚 शब्दावली",
    tabResources: "🔗 स्रोतहरू",
    tabMilestones: "🏆 लक्ष्यहरू",
    yourWeeklySchedule: "📅 तपाईंको साप्ताहिक अध्ययन तालिका",
    restDay: "विश्राम दिन 🌸",
    monday: "सोमबार", tuesday: "मंगलबार", wednesday: "बुधबार",
    thursday: "बिहीबार", friday: "शुक्रबार", saturday: "शनिबार", sunday: "आइतबार",
    vocabReview: "शब्दावली पुनरावलोकन — Anki वा सेभ गरिएका शब्दहरू (१० मिनेट)",
    speakAloud: "ठूलो स्वरमा बोल्नुहोस्: आजको सामग्री जापानीमा संक्षेप गर्नुहोस् (५ मिनेट)",
    taskConversation: "रोल-प्ले वा shadowing — CLT को मूल",
    taskListening: "NHK World वा JapanesePod101",
    taskReading: "Tadoku ग्रेडेड रिडर वा NHK Web Easy",
    taskGrammar: "Imabi + ३ उदाहरण वाक्य लेख्नुहोस्",
    taskKanji: "Nihonten AI — सन्दर्भमा ५ नयाँ कान्जी",
    taskJlpt: "Japanese Test 4 You — एक अभ्यास खण्ड",
    taskPronunciation: "Anki अडियो कार्डहरू — २० शब्द shadow गर्नुहोस्",
    recommendedForLevel: "⭐ तपाईंको स्तरका लागि सिफारिस गरिएको",
    curatedFor: "स्तरका लागि छनोट गरिएको",
    yourResources: "🔗 तपाईंका स्रोतहरू",
    curatedForLevel: "स्तरका लागि छनोट गरिएको",
    skills: "सीपहरू:",
    openResource: "खोल्नुहोस्",
    noResources: "कुनै स्रोत छैन। कृपया आफ्नो प्रोफाइल सम्पादन गर्नुहोस् र अध्ययन सीपहरू चयन गर्नुहोस्।",
    free: "नि:शुल्क", paid: "भुक्तानी गरिएको",
    vocab: "शब्दावली", grammar: "व्याकरण", reading: "पठन", speaking: "बोलाइ", listening: "सुनाइ",
    yourGoalRoadmap: "🏆 तपाईंको लक्ष्य रोडम्याप",
    levelToGoal: "स्तर",
    goal: "लक्ष्य",
    youveGotThis: "तपाईंले यो गर्न सक्नुहुन्छ!",
    motivationText: "हरेक कुराकानी, हरेक वाक्य, हरेक शब्दले तपाईंलाई नजिक ल्याउँछ। CLT वास्तविक सञ्चारको बारेमा हो — र तपाईं पहिले नै यो गर्दै हुनुहुन्छ। 頑張ってください！",
    bookLesson: "GAKU सँग नि:शुल्क ट्रायल पाठ बुक गर्नुहोस् →",
    weeksRemaining: "हप्ता बाँकी",
    percentComplete: "% पूर्ण",
    refresh: "🔄 रिफ्रेस",
    aiBuilding: "✨ AI तपाईंको तालिका बनाउँदैछ...",
    personalizing: "तपाईंको लक्ष्य र प्रगतिको आधारमा योजना व्यक्तिगत गर्दैछ...",
    helpTitle: "🆘 मद्दत",
    whatWouldYouLike: "तपाईं के चाहनुहुन्छ?",
    customizedLesson: "📋 आजको लागि अनुकूलित पाठ",
    howToUse: "❓ यो एप कसरी प्रयोग गर्ने",
    back: "← पछाडि",
    howAreYouFeeling: "आज तपाईंलाई कस्तो महसुस भइरहेको छ?",
    mood: "मनोदशा", moodPlaceholder: "छनोट गर्नुहोस्...",
    moodMotivated: "😤 उत्प्रेरित र ऊर्जावान",
    moodOkay: "😐 ठीक छ, सामान्य दिन",
    moodTired: "😴 थकित र कम ऊर्जा",
    moodStressed: "😰 तनावग्रस्त वा चिन्तित",
    moodHappy: "😊 खुसी र आरामदायी",
    availableTime: "उपलब्ध समय",
    energyLevel: "ऊर्जा स्तर",
    energyHigh: "🔥 उच्च — चुनौतीको लागि तयार",
    energyMedium: "⚡ मध्यम — सामान्य अध्ययन",
    energyLow: "🌙 कम — हल्का पुनरावलोकन मात्र",
    wantsDifferent: "म आज केही फरक गर्न चाहन्छु",
    differentPlaceholder: "आज तपाईं के गर्न चाहनुहुन्छ भन्नुहोस्...",
    getTodaysPlan: "आजको योजना प्राप्त गर्नुहोस् ✨",
    generating: "उत्पन्न गर्दै...",
    tryAgain: "फेरि प्रयास गर्नुहोस्",
    select: "छनोट गर्नुहोस्...",
    tenMin: "१० मिनेट", twentyMin: "२० मिनेट", thirtyMin: "३० मिनेट",
    oneHour: "१ घण्टा", oneHalfHour: "१.५ घण्टा+",
    formTitle: "तपाईंको सिकाइ प्रोफाइल",
    formEditTitle: "आफ्नो सिकाइ प्रोफाइल सम्पादन गर्नुहोस्",
    formSubtitle: "व्यक्तिगत CLT अध्ययन योजना बनाउन हामीलाई आफ्नो बारेमा बताउनुहोस्",
    formEditSubtitle: "तलका विवरणहरू अपडेट गर्नुहोस् — तपाईंले परिवर्तन नगरेसम्म तपाईंका अवस्थित जवाफहरू राखिन्छन्।",
    backToMyPlan: "← मेरो योजनामा फर्कनुहोस्",
    yourName: "तपाईंको नाम *",
    namePlaceholder: "जस्तै Tanaka Yuki",
    email: "इमेल *",
    emailPlaceholder: "you@email.com",
    country: "देश *",
    countryPlaceholder: "जस्तै नेपाल, जापान...",
    yourNativeLanguage: "तपाईंको मातृभाषा",
    finalGoal: "अन्तिम लक्ष्य *",
    selectGoal: "आफ्नो लक्ष्य छनोट गर्नुहोस्",
    goalN5: "JLPT N5 पास गर्ने", goalN4: "JLPT N4 पास गर्ने", goalN3: "JLPT N3 पास गर्ने",
    goalN2: "JLPT N2 पास गर्ने", goalN1: "JLPT N1 पास गर्ने",
    goalJob: "जापानमा जागिर खोज्ने", goalTravel: "जापान भ्रमण गर्ने",
    goalStudyAbroad: "जापानमा अध्ययन गर्ने", goalConversation: "दैनिक कुराकानी",
    goalOther: "अन्य",
    whatDoYouWantToStudy: "तपाईं के अध्ययन गर्न चाहनुहुन्छ?",
    customGoalPlaceholder: "तपाईं के सिक्न वा हासिल गर्न चाहनुहुन्छ भन्नुहोस्...",
    whenAchieve: "तपाईं यो कहिले हासिल गर्न चाहनुहुन्छ? *",
    selectTimeline: "समयसीमा छनोट गर्नुहोस्",
    lessThan6: "६ महिना भन्दा कम", within1: "१ वर्ष भित्र",
    twoThreeYears: "२–३ वर्ष", over3: "३ वर्ष भन्दा बढी",
    currentJlpt: "हालको JLPT स्तर *",
    autoFilled: "तपाईंको परीक्षणबाट स्वतः भरिएको",
    changeLevel: "यदि तपाईं आफ्नो स्तर परिवर्तन गर्न चाहनुहुन्छ भने, कृपया तल छनोट गर्नुहोस्।",
    selectLevel: "स्तर छनोट गर्नुहोस्",
    beginner: "सुरुवाती",
    studyTimePerDay: "दैनिक अध्ययन समय *",
    selectHours: "घण्टा छनोट गर्नुहोस्",
    lessThan1h: "१ घण्टा भन्दा कम", oneTwo: "१–२ घण्टा",
    twoThree: "२–३ घण्टा", threePlus: "३+ घण्टा",
    daysPerWeek: "तपाईं हप्तामा कति दिन अध्ययन गर्न चाहनुहुन्छ? *",
    selectDays: "दिनहरू छनोट गर्नुहोस्",
    oneTwoDays: "१–२ दिन", threeFourDays: "३–४ दिन",
    fiveSixDays: "५–६ दिन", everyDay: "हरेक दिन",
    whatStudySkills: "तपाईं के अध्ययन गर्न चाहनुहुन्छ? * (लागू हुने सबै छनोट गर्नुहोस्)",
    writingNote: "✍️ लेखन अभ्यास सबै प्रयोगकर्ताहरूका लागि लेखन ट्याबमा उपलब्ध छ",
    saveChanges: "परिवर्तनहरू सेभ गर्नुहोस् →",
    buildPlan: "मेरो अध्ययन योजना बनाउनुहोस् →",
    fillRequired: "कृपया सबै आवश्यक फिल्डहरू (*) भर्नुहोस् र कम्तिमा एउटा सीप छनोट गर्नुहोस्।",
    skillPronunciation: "🔊 उच्चारण", skillListening: "👂 सुनाइ",
    skillConversation: "💬 कुराकानी", skillJlpt: "🎯 JLPT तयारी",
    skillReading: "📖 पठन", skillKanji: "🈳 कान्जी", skillGrammar: "📝 व्याकरण",
    howToTitle: "यो एप कसरी प्रयोग गर्ने",
    howToSchedule: "तपाईंको साप्ताहिक अध्ययन योजना, दैनिक कार्यहरूमा विभाजित। साप्ताहिक प्रगति ट्र्याक गर्न कार्यलाई ट्याप गर्नुहोस्।",
    howToPractice: "तपाईंको प्रोफाइलमा चयन गरिएका सीपहरूमा आधारित AI-उत्पन्न अभ्यास। जाँच गर्न 'जवाफ देखाउनुहोस्' ट्याप गर्नुहोस्।",
    howToVocab: "तपाईंको स्तरमा उपयुक्त शब्दहरू उदाहरण वाक्यहरूसहित प्राप्त गर्न कुनै पनि विषय खोज्नुहोस्। सम्झन चाहेका शब्दहरू सेभ गर्नुहोस्।",
    howToResources: "तपाईंले चयन गरेका सीपहरूसँग मेल खाने नि:शुल्क (र केही भुक्तानी गरिएका) उपकरणहरू, सिधै यहाँबाट खोल्नुहोस्।",
    howToMilestones: "तपाईंको लक्ष्यतर्फको रोडम्याप। पूरा गर्दा हरेक माइलस्टोन ट्याप गर्नुहोस्।",
    howToEditProfile: "आफ्नो लक्ष्य, स्तर, तालिका वा सीपहरू जुनसुकै बेला अपडेट गर्नुहोस्।",
    howToHelp: "आजको मनोदशा, समय र ऊर्जाको आधारमा व्यक्तिगत योजना प्राप्त गर्नुहोस्।",
      vocabBuilderTitle: "📚 शब्दावली निर्माता",
    vocabBuilderDesc: "जापानी शब्दकोशबाट सम्बन्धित शब्दहरू हेर्न एउटा विषय प्रविष्ट गर्नुहोस् (English वा 日本語 ठीक छ)",
    vocabSearchPlaceholder: "जस्तै खाना, यात्रा, भावनाहरू...",
    findWordsBtn: "शब्दहरू खोज्नुहोस्",
    libraryLabel: "📚 पुस्तकालय",
    yourVocabSaved: "तपाईंको शब्दावली",
    savedSuffix: "सेभ गरिएको",
    wordCardsLabel: "🃏 शब्द कार्डहरू",
    searchCreateCards: "कार्डहरू खोज्नुहोस् र बनाउनुहोस्",
    flashcardsLabel: "🎴 फ्ल्यासकार्डहरू",
    reviewSavedWords: "सेभ गरिएका शब्दहरू समीक्षा गर्नुहोस्",
    searchingDictionary: "जापानी शब्दकोश खोजिँदै...",
    speakWord: "शब्द उच्चारण गर्नुहोस्",
    speakExample: "उदाहरण उच्चारण गर्नुहोस्",
    weblioDict: "📖 Weblio शब्दकोश",
    googleImages: "🖼 Google छविहरू",
    detailCard: "🃏 विवरण कार्ड",
    retryBtn: "फेरि प्रयास गर्नुहोस्",
    resShunDesc: "सुरुवाती-अनुकूल YouTube च्यानल। सुनाइ अभ्यासको लागि उत्तम।",
    resMarugotoDesc: "Japan Foundation को सुरुवाती-मध्यवर्ती कोर्स। सञ्चारात्मक सिकाइ विधि।",
    resOnomappuDesc: "दैनिक कुराकानी, स्ल्याङ्ग र संस्कृतिको बारेमा रमाइलो YouTube च्यानल।",
    resTeppeiDesc: "मध्यवर्ती स्तरको पडकास्ट। स्वाभाविक गतिको जापानी सुन्नुहोस्।",
    resYuyuDesc: "मध्यवर्ती स्तरको YouTube पडकास्ट। स्वाभाविक जापानी अभिव्यक्तिहरू सिक्नुहोस्।",
    resSambonDesc: "व्याकरण, शब्दावली र JLPT तयारीको लागि माथिल्लो-मध्यवर्ती च्यानल।",
    resLevelN5N4: "सुरुवाती (N5–N4)",
    resLevelN4N3: "सुरु.-मध्य (N4–N3)",
    resLevelN3N2: "मध्यवर्ती (N3–N2)",
    resLevelN2N1: "माथि.-मध्य (N2–N1)",
},

  "Filipino": {
    gakuSelfStudy: "GAKU SELF-STUDY",
    studyPlan: "Study plan",
    help: "🆘 Tulong",
    editProfile: "✏️ I-edit ang profile",
    weeklyProgress: "Lingguhang progreso",
    tabSchedule: "📅 Iskedyul",
    tabPractice: "🎯 Pagsasanay",
    tabVocabulary: "📚 Bokabularyo",
    tabResources: "🔗 Mga Resources",
    tabMilestones: "🏆 Mga Layunin",
    yourWeeklySchedule: "📅 ANG IYONG LINGGUHANG ISKEDYUL NG PAG-AARAL",
    restDay: "Araw ng pahinga 🌸",
    monday: "LUNES", tuesday: "MARTES", wednesday: "MIYERKULES",
    thursday: "HUWEBES", friday: "BIYERNES", saturday: "SABADO", sunday: "LINGGO",
    vocabReview: "Pagrebyu ng bokabularyo — Anki o mga naka-save na salita (10 min)",
    speakAloud: "Magsalita nang malakas: ibuod ang nilalaman ngayon sa Japanese (5 min)",
    taskConversation: "Role-play o shadowing — puso ng CLT",
    taskListening: "NHK World o JapanesePod101",
    taskReading: "Tadoku graded reader o NHK Web Easy",
    taskGrammar: "Imabi + sumulat ng 3 halimbawang pangungusap",
    taskKanji: "Nihonten AI — 5 bagong kanji sa konteksto",
    taskJlpt: "Japanese Test 4 You — isang seksyon ng pagsasanay",
    taskPronunciation: "Anki audio cards — i-shadow ang 20 salita",
    recommendedForLevel: "⭐ Inirerekomenda para sa iyong antas",
    curatedFor: "Pinili para sa antas",
    yourResources: "🔗 ANG IYONG MGA RESOURCES",
    curatedForLevel: "Pinili para sa antas",
    skills: "mga kasanayan:",
    openResource: "Buksan",
    noResources: "Walang resources. Pakitingnan ang iyong profile at piliin ang mga kasanayan sa pag-aaral.",
    free: "LIBRE", paid: "BAYAD",
    vocab: "Bokabularyo", grammar: "Gramatika", reading: "Pagbasa", speaking: "Pagsasalita", listening: "Pakikinig",
    yourGoalRoadmap: "🏆 ANG IYONG ROADMAP NG LAYUNIN",
    levelToGoal: "Antas",
    goal: "Layunin",
    youveGotThis: "Kaya mo 'to!",
    motivationText: "Bawat usapan, bawat pangungusap, bawat salita ay nagdadala sa iyo nang mas malapit. Ang CLT ay tungkol sa tunay na komunikasyon — at ginagawa mo na ito. 頑張ってください！",
    bookLesson: "Mag-book ng LIBRENG trial lesson kasama ang GAKU →",
    weeksRemaining: "linggo na natitira",
    percentComplete: "% kumpleto",
    refresh: "🔄 I-refresh",
    aiBuilding: "✨ Gumagawa ang AI ng iyong iskedyul...",
    personalizing: "Ina-adjust ang iyong plano batay sa iyong layunin at pag-unlad...",
    helpTitle: "🆘 TULONG",
    whatWouldYouLike: "Ano ang gusto mong gawin?",
    customizedLesson: "📋 Customized na aralin para ngayon",
    howToUse: "❓ Paano gamitin ang app na ito",
    back: "← Bumalik",
    howAreYouFeeling: "Kumusta ang pakiramdam mo ngayon?",
    mood: "MOOD", moodPlaceholder: "Pumili...",
    moodMotivated: "😤 Motivated at masigla",
    moodOkay: "😐 Okay, normal na araw",
    moodTired: "😴 Pagod at mababa ang enerhiya",
    moodStressed: "😰 Stressed o nag-aalala",
    moodHappy: "😊 Masaya at relaxed",
    availableTime: "MAY ORAS",
    energyLevel: "ANTAS NG ENERHIYA",
    energyHigh: "🔥 Mataas — handa sa hamon",
    energyMedium: "⚡ Katamtaman — normal na pag-aaral",
    energyLow: "🌙 Mababa — magaan na pagrebyu lang",
    wantsDifferent: "Gusto kong gumawa ng iba ngayon",
    differentPlaceholder: "Sabihin sa amin ang gusto mong gawin ngayon...",
    getTodaysPlan: "Kunin ang plano ngayon ✨",
    generating: "Ginagawa...",
    tryAgain: "Subukan muli",
    select: "Pumili...",
    tenMin: "10 minuto", twentyMin: "20 minuto", thirtyMin: "30 minuto",
    oneHour: "1 oras", oneHalfHour: "1.5 oras+",
    formTitle: "Ang iyong learning profile",
    formEditTitle: "I-edit ang iyong learning profile",
    formSubtitle: "Sabihin sa amin ang tungkol sa iyo upang makagawa ng personalized na CLT study plan",
    formEditSubtitle: "I-update ang mga detalye sa ibaba — mananatili ang iyong mga umiiral na sagot hangga't hindi mo ito binabago.",
    backToMyPlan: "← Bumalik sa aking plano",
    yourName: "PANGALAN MO *",
    namePlaceholder: "hal. Tanaka Yuki",
    email: "EMAIL *",
    emailPlaceholder: "ikaw@email.com",
    country: "BANSA *",
    countryPlaceholder: "hal. Pilipinas, Japan...",
    yourNativeLanguage: "ANG IYONG SARILING WIKA",
    finalGoal: "PANGHULING LAYUNIN *",
    selectGoal: "Piliin ang iyong layunin",
    goalN5: "Pasahan ang JLPT N5", goalN4: "Pasahan ang JLPT N4", goalN3: "Pasahan ang JLPT N3",
    goalN2: "Pasahan ang JLPT N2", goalN1: "Pasahan ang JLPT N1",
    goalJob: "Maghanap ng trabaho sa Japan", goalTravel: "Magbiyahe sa Japan",
    goalStudyAbroad: "Mag-aral sa Japan", goalConversation: "Pang-araw-araw na pag-uusap",
    goalOther: "Iba pa",
    whatDoYouWantToStudy: "ANO ANG GUSTO MONG PAG-ARALAN?",
    customGoalPlaceholder: "Sabihin sa amin kung ano ang gusto mong pag-aralan o makamit...",
    whenAchieve: "KAILAN MO GUSTONG MAKAMIT ITO? *",
    selectTimeline: "Piliin ang timeline",
    lessThan6: "Mas mababa sa 6 na buwan", within1: "Sa loob ng 1 taon",
    twoThreeYears: "2–3 taon", over3: "Higit sa 3 taon",
    currentJlpt: "KASALUKUYANG ANTAS NG JLPT *",
    autoFilled: "Awtomatikong napunan mula sa iyong test",
    changeLevel: "Kung gusto mong baguhin ang iyong antas, pumili sa ibaba.",
    selectLevel: "Piliin ang antas",
    beginner: "Baguhan",
    studyTimePerDay: "ORAS NG PAG-AARAL KADA ARAW *",
    selectHours: "Piliin ang oras",
    lessThan1h: "Mas mababa sa 1 oras", oneTwo: "1–2 oras",
    twoThree: "2–3 oras", threePlus: "3+ oras",
    daysPerWeek: "ISANG LINGGO ILANG ARAW MO GUSTONG MAG-ARAL? *",
    selectDays: "Piliin ang mga araw",
    oneTwoDays: "1–2 araw", threeFourDays: "3–4 araw",
    fiveSixDays: "5–6 araw", everyDay: "Araw-araw",
    whatStudySkills: "ANO ANG GUSTO MONG PAG-ARALAN? * (piliin ang lahat ng naaangkop)",
    writingNote: "✍️ Available ang writing practice sa Writing tab para sa lahat ng user",
    saveChanges: "I-save ang mga pagbabago →",
    buildPlan: "Gawin ang aking study plan →",
    fillRequired: "Pakipunan ang lahat ng kinakailangang field (*) at pumili ng kahit isang kasanayan.",
    skillPronunciation: "🔊 Pagbigkas", skillListening: "👂 Pakikinig",
    skillConversation: "💬 Pakikipag-usap", skillJlpt: "🎯 Paghahanda sa JLPT",
    skillReading: "📖 Pagbasa", skillKanji: "🈳 Kanji", skillGrammar: "📝 Gramatika",
    howToTitle: "Paano gamitin ang app na ito",
    howToSchedule: "Ang iyong lingguhang study plan, nahahati sa araw-araw na gawain. I-tap ang gawain upang markahan itong tapos na.",
    howToPractice: "Mga pagsasanay na ginawa ng AI batay sa mga kasanayang pinili mo sa iyong profile. I-tap ang 'Ipakita ang sagot' upang suriin.",
    howToVocab: "Maghanap ng anumang paksa upang makakuha ng mga salitang angkop sa iyong antas na may mga halimbawang pangungusap. I-save ang mga salitang gusto mong tandaan.",
    howToResources: "Libreng (at ilang bayad) na mga tool na tumutugma sa iyong mga piniling kasanayan, direktang bukas dito.",
    howToMilestones: "Ang iyong roadmap patungo sa iyong layunin. I-tap ang bawat milestone kapag natapos mo na.",
    howToEditProfile: "I-update ang iyong mga layunin, antas, iskedyul, o kasanayan anumang oras.",
    howToHelp: "Kumuha ng personalized na plano para ngayon batay sa iyong mood, oras, at enerhiya.",
      vocabBuilderTitle: "📚 VOCABULARY BUILDER",
    vocabBuilderDesc: "Maglagay ng paksa upang makita ang mga kaugnay na salita mula sa diksyunaryong Japanese (English o 日本語 OK)",
    vocabSearchPlaceholder: "hal. pagkain, paglalakbay, damdamin...",
    findWordsBtn: "Maghanap ng mga salita",
    libraryLabel: "📚 Library",
    yourVocabSaved: "Ang iyong bokabularyo",
    savedSuffix: "naka-save",
    wordCardsLabel: "🃏 Word Cards",
    searchCreateCards: "Maghanap at gumawa ng mga card",
    flashcardsLabel: "🎴 Flashcards",
    reviewSavedWords: "Repasuhin ang mga naka-save na salita",
    searchingDictionary: "Hinahanap sa diksyunaryong Japanese...",
    speakWord: "Bigkasin ang salita",
    speakExample: "Bigkasin ang halimbawa",
    weblioDict: "📖 Weblio Dictionary",
    googleImages: "🖼 Google Images",
    detailCard: "🃏 Detalyadong card",
    retryBtn: "Subukan muli",
    resShunDesc: "Beginner-friendly YouTube channel. Mahusay para sa pagsasanay sa pakikinig.",
    resMarugotoDesc: "Beginner-intermediate course ng Japan Foundation. Communicative na paraan ng pag-aaral.",
    resOnomappuDesc: "Masayang YouTube channel tungkol sa pang-araw-araw na usapan, slang, at kultura.",
    resTeppeiDesc: "Intermediate-level na podcast. Pakinggan ang Japanese sa natural na bilis.",
    resYuyuDesc: "Intermediate-level na YouTube podcast. Matuto ng natural na mga ekspresyon.",
    resSambonDesc: "Upper-intermediate channel para sa gramatika, bokabularyo, at JLPT prep.",
    resLevelN5N4: "Beginner (N5–N4)",
    resLevelN4N3: "Beg.-Inter. (N4–N3)",
    resLevelN3N2: "Intermediate (N3–N2)",
    resLevelN2N1: "Upper-Inter. (N2–N1)",
},

};

// Get translation for current language, fall back to English
function getT(lang) {
  return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS["English"];
}

// For languages not in our static dict, we cache AI translations
const AI_TRANS_CACHE = {};

// Split translation keys into two batches to stay within token limits
function splitKeys(obj) {
  const keys = Object.keys(obj);
  const mid = Math.ceil(keys.length / 2);
  const a = {}, b = {};
  keys.slice(0, mid).forEach(k => { a[k] = obj[k]; });
  keys.slice(mid).forEach(k => { b[k] = obj[k]; });
  return [a, b];
}

async function fetchTranslationBatch(keyValueObj, lang) {
  const keyList = Object.keys(keyValueObj).map(k => `${k}: ${keyValueObj[k]}`).join("\n");
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:6000,
      messages:[{ role:"user", content:
        `Translate ONLY the VALUES (not keys) into ${lang}. Keep emojis, asterisks (*), arrows (→ ←), Japanese text (頑張ってください！), and punctuation exactly as-is. Return ONLY a valid JSON object with the same keys — no markdown, no explanation, no extra text.\n\n${keyList}`
      }]
    })
  });
  const d = await res.json();
  const text = d.content?.map(c=>c.text||"").join("") || "{}";
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

// Hook: shows English immediately while AI translation loads for unknown languages
function useUITranslations(lang) {
  const [aiT, setAiT] = useState(null);
  const [transLoading, setTransLoading] = useState(false);
  const staticT = UI_TRANSLATIONS[lang];

  useEffect(() => {
    if (staticT || !lang || lang === "English") { setAiT(null); setTransLoading(false); return; }
    if (AI_TRANS_CACHE[lang]) { setAiT(AI_TRANS_CACHE[lang]); return; }
    setTransLoading(true);
    const baseKeys = UI_TRANSLATIONS["English"];
    const [batchA, batchB] = splitKeys(baseKeys);
    Promise.all([
      fetchTranslationBatch(batchA, lang),
      fetchTranslationBatch(batchB, lang),
    ])
    .then(([resA, resB]) => {
      const merged = { ...resA, ...resB };
      if (Object.keys(merged).length > 10) {
        AI_TRANS_CACHE[lang] = merged;
        setAiT(merged);
      } else {
        setAiT(UI_TRANSLATIONS["English"]);
      }
    })
    .catch(() => setAiT(UI_TRANSLATIONS["English"]))
    .finally(() => setTransLoading(false));
  }, [lang, staticT]);

  // Always return something immediately — English while AI translation is loading
  const result = staticT || aiT || UI_TRANSLATIONS["English"];
  // Merge English as base so any missing keys fall back gracefully
  return { ...UI_TRANSLATIONS["English"], ...result, _loading: transLoading && !staticT && !aiT };
}

const WRITING_TOPICS = {
  culture: ["日本のお祭りについて書いてください。", "あなたの国の文化と日本の文化の違いを書いてください。", "日本の食文化について、好きなものを紹介してください。", "日本の伝統工芸について書いてください。"],
  work: ["あなたの仕事や勉強について紹介してください。", "将来の仕事の夢について書いてください。", "日本で働くことについてどう思いますか？", "仕事でのコミュニケーションの重要性について書いてください。"],
  education: ["あなたが日本語を勉強している理由を書いてください。", "効果的な外国語学習方法について書いてください。", "学校での一番の思い出を書いてください。", "オンライン学習と対面学習の違いについて書いてください。"],
};

// ─── VOCAB STORAGE (localStorage) ─────────────────────────────────────────────
function loadVocabData() {
  try { return JSON.parse(localStorage.getItem("gaku_vocab") || "null") || { folders:[], cards:[] }; } catch { return { folders:[], cards:[] }; }
}
// Trim card to essential fields only before saving (reduces localStorage size)
function trimCard(card) {
  return {
    id: card.id, word: card.word, reading: card.reading || "",
    jlpt: card.jlpt || "", partOfSpeech: card.partOfSpeech || "",
    meaning: card.meaning || "", example: card.example || "",
    folder: card.folder || "Your Vocabulary", savedAt: card.savedAt || new Date().toISOString(),
    addedAt: card.addedAt || Date.now(),
  };
}
function saveVocabData(data) {
  try {
    const lean = { folders: data.folders, cards: data.cards.map(trimCard) };
    localStorage.setItem("gaku_vocab", JSON.stringify(lean));
    // Sync folder names to chrome.storage.local for GAKU Reader extension
    try {
      const folderNames = ["Your Vocabulary", ...data.folders.map(f => f.name).filter(Boolean)];
      if (window.chrome?.storage?.local) {
        window.chrome.storage.local.set({ gaku_folders: folderNames });
      }
    } catch {}
  } catch(e) {
    // If quota exceeded, remove oldest 20 cards and retry
    try {
      const trimmed = { folders: data.folders, cards: data.cards.slice(-80).map(trimCard) };
      localStorage.setItem("gaku_vocab", JSON.stringify(trimmed));
    } catch {}
  }
}


// ─── SPEAK helper ──────────────────────────────────────────────────────────────
function speakJapanese(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP"; u.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang === "ja-JP" || v.lang === "ja_JP");
  if (jpVoice) u.voice = jpVoice;
  window.speechSynthesis.speak(u);
}

// ─── WORD DETAIL CARD ──────────────────────────────────────────────────────────
function WordDetailCard({ card: cardProp, onSave, onBack, form, prefLang }) {
  const T = useUITranslations(prefLang || form?.preferredLang || "English");
  const [card, setCard] = useState(cardProp);
  const [saveModal, setSaveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [saveMode, setSaveMode] = useState(""); // "addFolder"|"newFolder"|"yourVocab"
  const [toast, setToast] = useState("");
  const [imgError, setImgError] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [filling, setFilling] = useState(false);

  // Auto-fill empty meaning/example via AI when card opens
  useEffect(() => {
    const needsFill = !cardProp.meaning || !cardProp.example || !cardProp.example_translated;
    if (!needsFill) { setFilling(false); return; }
    const lang = prefLang || form?.preferredLang || "English";
    setFilling(true);
    (async () => {
      try {
        const hasExample = cardProp.example && cardProp.example.trim();
        const userPrompt = hasExample && !cardProp.example_translated
          ? `For the Japanese word "${cardProp.word}" (reading: "${cardProp.reading || cardProp.word}"), fill in the missing fields.\nThe example sentence already exists: "${cardProp.example}"\nReturn a JSON object with these fields:\n- meaning: ${cardProp.meaning ? `"${cardProp.meaning}"` : `translation in ${lang}`}\n- meaningNative: ${cardProp.meaningNative ? `"${cardProp.meaningNative}"` : "simple Japanese definition"}\n- example: "${cardProp.example}"\n- reading_example: romaji reading of the above example sentence\n- example_translated: translation of the above example sentence into ${lang} (REQUIRED - must not be empty)\n- tip: usage tip in ${lang}\nOnly output the JSON object, no markdown, no backticks.`
          : `Fill in the missing fields for this Japanese word: "${cardProp.word}" (reading: "${cardProp.reading || cardProp.word}").\nReturn a JSON object with these fields:\n- meaning: translation in ${lang}\n- meaningNative: simple Japanese definition (e.g.「食べ物を料理すること」)\n- example: natural Japanese example sentence\n- reading_example: romaji reading of the example sentence\n- example_translated: translation of example in ${lang} (REQUIRED - must not be empty)\n- tip: usage tip in ${lang}\nOnly output the JSON object.`;
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            max_tokens: 600,
            messages: [
              { role: "system", content: `You are a Japanese dictionary. Respond ONLY with a raw JSON object, no markdown, no backticks. The example_translated field is mandatory and must always contain a translation.` },
              { role: "user", content: userPrompt }
            ]
          })
        });
        const data = await res.json();
        const text = data?.content?.[0]?.text || "";
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setCard(prev => ({
          ...prev,
          meaning: prev.meaning || parsed.meaning || "",
          meaningNative: prev.meaningNative || parsed.meaningNative || "",
          example: prev.example || parsed.example || "",
          reading_example: prev.reading_example || parsed.reading_example || "",
          example_translated: parsed.example_translated || prev.example_translated || "",
          tip: prev.tip || parsed.tip || "",
        }));
        const vocabData = loadVocabData();
        const idx = vocabData.cards.findIndex(c => c.word === cardProp.word && c.folder === cardProp.folder);
        if (idx !== -1) {
          vocabData.cards[idx] = { ...vocabData.cards[idx], ...parsed };
          saveVocabData(vocabData);
        }
      } catch(e) { console.error("GAKU fill error:", e); }
      setFilling(false);
    })();
  }, [cardProp.word]);

  const searchImage = async () => {
    setImgLoading(true);
    setImgError(false);
    const nextIndex = imgIndex + 1;
    setImgIndex(nextIndex);
    try {
      const query = card.imageQuery || card.word;
      // Google画像をCORSフリーのimages.google.com検索URLで取得
      // Wikimediaから1枚ずつ取得（offsetで次の画像へ）
      const offset = nextIndex - 1;
      const searches = [
        `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`,
        `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(card.word)}&gsrlimit=1&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`
      ];
      let found = false;
      for (const url of searches) {
        const res = await fetch(url);
        const data = await res.json();
        const pages = Object.values(data?.query?.pages || {});
        const thumb = pages.find(p => p?.imageinfo?.[0]?.thumburl && !/svg/i.test(p.imageinfo[0].thumburl))?.imageinfo?.[0]?.thumburl;
        if (thumb) { setImgSrc(thumb); setImgError(false); found = true; break; }
      }
      if (!found) { setImgError(true); }
    } catch {
      setImgError(true);
    }
    setImgLoading(false);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2200); };

  const doSave = (folderName) => {
    const data = loadVocabData();
    const newCard = { ...card, id: Date.now(), savedAt: new Date().toISOString(), folder: folderName };
    if (folderName !== "Your Vocabulary" && !data.folders.find(f=>f.name===folderName)) {
      data.folders.push({ name: folderName, createdAt: new Date().toISOString() });
    }
    if (!data.cards.find(c=>c.word===card.word && c.folder===folderName)) {
      data.cards.push(newCard);
    }
    saveVocabData(data);
    if (onSave) onSave(data);
    setSaveModal(false); setSaveMode(""); setNewFolderName(""); setSelectedFolder("");
    showToast(`✓ "${card.word}" を "${folderName}" に保存しました`);
  };

  const imgQuery = encodeURIComponent(card.imageQuery || card.word);

  return (
    <div style={{ position:"relative" }}>
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#22c55e", color:"#fff", padding:"10px 20px", borderRadius:12, fontSize:13, fontWeight:700, zIndex:2000, whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}

      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14, display:"flex", alignItems:"center", gap:4 }}>
        ← Back to search
      </button>

      {/* ── WORD HEADER ── */}
      <div style={{ ...S.card, borderLeft:`4px solid ${C.teal}`, marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:"#f1f5f9", fontSize:32, fontWeight:900, margin:"0 0 4px", letterSpacing:2 }}>{card.word}</p>
            <p style={{ color:C.teal, fontSize:16, margin:"0 0 4px" }}>{card.reading}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {card.jlpt && <span style={{ background:"rgba(168,85,247,0.2)", color:C.purpleLight, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>{card.jlpt}</span>}
              {card.partOfSpeech && <span style={{ background:"rgba(6,182,212,0.15)", color:C.teal, fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99 }}>{card.partOfSpeech}</span>}
            </div>
          </div>
          <button onClick={()=>speakJapanese(card.word)} style={{ width:44, height:44, borderRadius:12, background:`rgba(6,182,212,0.15)`, border:`1px solid rgba(6,182,212,0.3)`, color:C.teal, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            🔊
          </button>
        </div>
      </div>

      {/* ── DEFINITION ── */}
      <div style={{ ...S.card, marginBottom:12 }}>
        <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, letterSpacing:1, margin:"0 0 8px" }}>📖 DEFINITION</p>
        {filling && !card.meaning
          ? <p style={{ color:"#475569", fontSize:13, fontStyle:"italic" }}>✨ AI generating...</p>
          : <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:0 }}>{card.meaning}</p>
        }
        {card.meaningNative && (
          <p style={{ color:"#64748b", fontSize:13, lineHeight:1.7, margin:"8px 0 0", borderTop:`1px solid ${C.border}`, paddingTop:8 }}>{card.meaningNative}</p>
        )}
      </div>

      {/* ── EXAMPLE SENTENCE ── */}
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <p style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:1, margin:0 }}>✏️ EXAMPLE SENTENCE</p>
          <button onClick={()=>speakJapanese(card.example)} style={{ background:`rgba(245,158,11,0.1)`, border:`1px solid rgba(245,158,11,0.3)`, borderRadius:8, color:C.amber, fontSize:14, padding:"3px 10px", cursor:"pointer" }}>🔊</button>
        </div>
        {filling
          ? <p style={{ color:"#475569", fontSize:13, fontStyle:"italic" }}>✨ AI generating...</p>
          : <>
              <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.9, margin:"0 0 4px" }}>{card.example}</p>
              {card.reading_example && <p style={{ color:"#67e8f9", fontSize:12, margin:"0 0 4px", fontStyle:"italic" }}>{card.reading_example}</p>}
              {card.example_translated
                ? <p style={{ color:"#64748b", fontSize:13, margin:0, fontStyle:"italic" }}>{card.example_translated}</p>
                : null
              }
            </>
        }
      </div>

      {/* ── IMAGE ASSOCIATION ── */}
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, margin:0 }}>🖼 IMAGE ASSOCIATION</p>
          <div style={{ display:"flex", gap:6 }}>
            {imgSrc && !imgError && (
              <button
                onClick={()=>{
                  const data = loadVocabData();
                  const idx = data.cards.findIndex(c=>c.word===card.word);
                  if(idx!==-1){ data.cards[idx].imageUrl=imgSrc; saveVocabData(data); }
                  setCard(prev=>({...prev, imageUrl:imgSrc}));
                  showToast("✓ 画像を保存しました");
                }}
                style={{ fontSize:11, color:"#22c55e", fontWeight:700, background:"rgba(34,197,94,0.1)", padding:"5px 10px", borderRadius:8, border:"1px solid rgba(34,197,94,0.3)", cursor:"pointer" }}
              >💾 保存</button>
            )}
            {imgSrc && !imgError && (
              <button
                onClick={searchImage}
                disabled={imgLoading}
                style={{ fontSize:11, color:C.amber, fontWeight:700, background:"rgba(245,158,11,0.1)", padding:"5px 10px", borderRadius:8, border:"1px solid rgba(245,158,11,0.3)", cursor:"pointer" }}
              >次の画像 →</button>
            )}
            <button
              onClick={searchImage}
              disabled={imgLoading}
              style={{ fontSize:11, color:C.teal, fontWeight:700, background:"rgba(6,182,212,0.1)", padding:"5px 12px", borderRadius:8, border:`1px solid rgba(6,182,212,0.2)`, cursor:"pointer" }}
            >{imgLoading ? "..." : imgSrc ? "🔍" : "🔍 SEARCH"}</button>
          </div>
        </div>
        {imgSrc && !imgError ? (
          <div>
            <img
              src={imgSrc}
              alt={card.word}
              onError={()=>setImgError(true)}
              style={{ width:"100%", borderRadius:10, objectFit:"cover", maxHeight:220, display:"block" }}
            />
            <p style={{ color:"#475569", fontSize:10, margin:"4px 0 0", textAlign:"center" }}>{imgIndex}枚目 · 「次の画像」で別の画像を表示 · 「💾 保存」で単語カードに保存</p>
          </div>
        ) : card.imageUrl ? (
          <div>
            <img src={card.imageUrl} alt={card.word} style={{ width:"100%", borderRadius:10, objectFit:"cover", maxHeight:220, display:"block" }} />
            <p style={{ color:"#22c55e", fontSize:10, margin:"4px 0 0", textAlign:"center" }}>✓ 保存済み</p>
          </div>
        ) : (
          <div
            onClick={searchImage}
            style={{ width:"100%", height:160, borderRadius:10, background:"rgba(6,182,212,0.06)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:`1px dashed rgba(6,182,212,0.3)`, cursor:"pointer" }}
          >
            <span style={{ color:C.teal, fontSize:32, marginBottom:8 }}>🔍</span>
            <span style={{ color:C.teal, fontSize:13, fontWeight:700 }}>「{card.word}」の画像を検索</span>
            <span style={{ color:"#475569", fontSize:11, marginTop:4 }}>タップして画像を検索</span>
          </div>
        )}
        {card.imageDesc && <p style={{ color:"#94a3b8", fontSize:12, margin:"8px 0 0", lineHeight:1.6 }}>{card.imageDesc}</p>}
      </div>


      {/* ── CLT TIP ── */}
      {card.tip && (
        <div style={{ ...S.card, marginBottom:12, borderLeft:`3px solid ${C.green}` }}>
          <p style={{ color:C.green, fontSize:11, fontWeight:700, letterSpacing:1, margin:"0 0 6px" }}>💬 CLT USAGE TIP</p>
          <p style={{ color:"#cbd5e1", fontSize:13, margin:0, lineHeight:1.7 }}>{card.tip}</p>
        </div>
      )}

      {/* ── SAVE BUTTON ── */}
      <button onClick={()=>setSaveModal(true)} style={{ ...S.btn, width:"100%", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", fontSize:15, marginTop:4, marginBottom:32 }}>
        💾 {T.saveWord || "Save Word"}
      </button>

      {/* ── SAVE MODAL ── */}
      {saveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000, padding:"0 0 0 0" }} onClick={()=>{setSaveModal(false);setSaveMode("");}}>
          <div style={{ background:"#0f172a", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:520, border:`1px solid ${C.border}` }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, background:"#334155", borderRadius:99, margin:"0 auto 20px" }} />

            {saveMode === "" && (
              <>
                <p style={{ color:"#f1f5f9", fontSize:16, fontWeight:800, margin:"0 0 18px" }}>{T.saveTitle || "Save"} "{card.word}"</p>
                {[
                  { id:"yourVocab", icon:"📚", label: T.saveToYourVocab || "Add to Your Vocabulary", sub: T.saveToYourVocabSub || "Your default vocabulary list" },
                  { id:"addFolder", icon:"📁", label: T.saveAddToFolder || "Add to Folder", sub: T.saveAddToFolderSub || "Choose an existing folder" },
                  { id:"newFolder", icon:"✨", label: T.saveCreateFolder || "Create New Folder", sub: T.saveCreateFolderSub || "Make a new folder for this word" },
                ].map(opt => (
                  <button key={opt.id} onClick={()=>{ if(opt.id==="yourVocab"){doSave("Your Vocabulary");}else{setSaveMode(opt.id);} }} style={{ display:"flex", alignItems:"center", gap:14, width:"100%", padding:"14px 16px", borderRadius:12, background:C.card, border:`1px solid ${C.border}`, color:"#f1f5f9", textAlign:"left", cursor:"pointer", marginBottom:10 }}>
                    <span style={{ fontSize:22 }}>{opt.icon}</span>
                    <div>
                      <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{opt.label}</p>
                      <p style={{ margin:0, fontSize:12, color:"#64748b" }}>{opt.sub}</p>
                    </div>
                  </button>
                ))}
                <button onClick={()=>{setSaveModal(false);setSaveMode("");}} style={{ width:"100%", padding:"12px", borderRadius:10, background:"none", border:`1px solid ${C.border}`, color:"#64748b", fontSize:13, cursor:"pointer", marginTop:4 }}>{T.saveCancel || "Cancel"}</button>
              </>
            )}

            {saveMode === "addFolder" && (() => {
              const data = loadVocabData();
              const folders = [{ key: "Your Vocabulary", label: T.yourVocabSaved || "Your Vocabulary" }, ...data.folders.map(f=>({ key: f.name, label: f.name }))];
              return (
                <>
                  <button onClick={()=>setSaveMode("")} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>{T.saveBack || "← Back"}</button>
                  <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:"0 0 14px" }}>{T.saveChooseFolder || "Choose a folder"}</p>
                  {folders.map(f => (
                    <button key={f.key} onClick={()=>setSelectedFolder(f.key)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"13px 16px", borderRadius:12, background:selectedFolder===f.key?"rgba(168,85,247,0.15)":C.card, border:`1.5px solid ${selectedFolder===f.key?C.purpleLight:C.border}`, color:"#f1f5f9", textAlign:"left", cursor:"pointer", marginBottom:8 }}>
                      <span style={{ fontSize:14, fontWeight:selectedFolder===f.key?700:400 }}>📁 {f.label}</span>
                      {selectedFolder===f.key && <span style={{ color:C.purpleLight, fontSize:16 }}>✓</span>}
                    </button>
                  ))}
                  {folders.length === 1 && <p style={{ color:"#475569", fontSize:12, textAlign:"center", margin:"8px 0" }}>{T.saveNoFolders || "No custom folders yet — create one first!"}</p>}
                  <button onClick={()=>{ if(selectedFolder) doSave(selectedFolder); }} disabled={!selectedFolder} style={{ ...S.btn, width:"100%", marginTop:8, background:selectedFolder?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:selectedFolder?"#fff":"#475569" }}>
                    {T.saveTo || "Save to"} "{folders.find(f=>f.key===selectedFolder)?.label || "..."}"
                  </button>
                </>
              );
            })()}

            {saveMode === "newFolder" && (
              <>
                <button onClick={()=>setSaveMode("")} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>{T.saveBack || "← Back"}</button>
                <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:"0 0 14px" }}>{T.saveCreateFolder || "Create New Folder"}</p>
                <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder={T.saveFolderPlaceholder || "Folder name (e.g. かおりさん 授業)"} style={{ ...S.input, marginBottom:12 }} />
                <button onClick={()=>{ if(newFolderName.trim()) doSave(newFolderName.trim()); }} disabled={!newFolderName.trim()} style={{ ...S.btn, width:"100%", background:newFolderName.trim()?`linear-gradient(135deg,${C.green},#16a34a)`:"#1e293b", color:newFolderName.trim()?"#fff":"#475569" }}>
                  {T.saveCreateAndSave || "Create & Save"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FLASHCARD VIEW ────────────────────────────────────────────────────────────
function FlashcardView({ onBack }) {
  const [allData, setAllData] = useState(() => loadVocabData());
  const cards = allData.cards || [];
  const allFolders = [{ name:"すべて" }, { name:"Your Vocabulary" }, ...allData.folders];
  const [selectedFolder, setSelectedFolder] = useState("すべて");
  const filteredCards = selectedFolder === "すべて" ? cards : cards.filter(c => c.folder === selectedFolder);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Reset idx when folder changes
  const handleFolderChange = (f) => { setSelectedFolder(f); setIdx(0); setFlipped(false); };

  if (!cards.length) return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
      <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
        <p style={{ color:"#64748b", fontSize:32, margin:"0 0 12px" }}>📭</p>
        <p style={{ color:"#94a3b8", fontSize:14 }}>No saved words yet. Search and save words first!</p>
      </div>
    </div>
  );

  const displayCards = filteredCards.length ? filteredCards : [];
  const card = displayCards[idx] || null;

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
      {/* Folder selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {allFolders.map(f => (
          <button key={f.name} onClick={()=>handleFolderChange(f.name)} style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${selectedFolder===f.name ? C.teal : C.border}`, background: selectedFolder===f.name ? `rgba(6,182,212,0.15)` : C.card, color: selectedFolder===f.name ? C.teal : "#64748b" }}>
            {f.name==="すべて" ? "📚 すべて" : f.name==="Your Vocabulary" ? "📚 Your Vocabulary" : "📁 "+f.name}
          </button>
        ))}
      </div>
      {!card ? (
        <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
          <p style={{ color:"#94a3b8", fontSize:14 }}>このフォルダに単語がありません</p>
        </div>
      ) : (
        <>
          <p style={{ color:"#64748b", fontSize:12, textAlign:"center", margin:"0 0 16px" }}>{idx+1} / {displayCards.length}</p>
          <div onClick={()=>setFlipped(f=>!f)} style={{ ...S.card, minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", textAlign:"center", borderLeft:`4px solid ${C.teal}`, marginBottom:16 }}>
            {!flipped ? (
              <>
                <p style={{ color:"#f1f5f9", fontSize:44, fontWeight:900, margin:"0 0 6px", letterSpacing:2 }}>{card.word}</p>
                {card.reading && <p style={{ color:C.teal, fontSize:20, margin:"0 0 4px", fontWeight:700 }}>{card.reading}</p>}
                {card.meaning && <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 14px" }}>{card.meaning}</p>}
                <p style={{ color:"#334155", fontSize:11 }}>タップして確認</p>
              </>
            ) : (
              <>
                <p style={{ color:"#f1f5f9", fontSize:28, fontWeight:900, margin:"0 0 4px", letterSpacing:1 }}>{card.word}</p>
                {card.reading && <p style={{ color:C.teal, fontSize:18, margin:"0 0 4px", fontWeight:700 }}>{card.reading}</p>}
                {card.meaning && <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px" }}>{card.meaning}</p>}
                {card.meaningNative && <p style={{ color:"#475569", fontSize:11, margin:"0 0 8px", fontStyle:"italic" }}>{card.meaningNative}</p>}
                {card.example && <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.7, maxWidth:280, margin:"0 0 2px" }}>{card.example}</p>}
                {card.reading_example && <p style={{ color:"#67e8f9", fontSize:11, fontStyle:"italic", maxWidth:280, margin:"0 0 2px" }}>{card.reading_example}</p>}
                {card.example_translated && <p style={{ color:"#64748b", fontSize:11, fontStyle:"italic", maxWidth:280, margin:"0 0 10px" }}>{card.example_translated}</p>}
                <button onClick={e=>{e.stopPropagation();speakJapanese(card.example);}} style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, color:C.amber, fontSize:12, padding:"4px 12px", cursor:"pointer" }}>🔊 例文を聞く</button>
              </>
            )}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>speakJapanese(card.word)} style={{ flex:1, ...S.btn, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal }}>🔊 Listen</button>
            <button onClick={()=>{ setFlipped(false); setIdx(i=>(i-1+displayCards.length)%displayCards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>←</button>
            <button onClick={()=>{ setFlipped(false); setIdx(i=>(i+1)%displayCards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── LIBRARY VIEW ──────────────────────────────────────────────────────────────
function LibraryView({ onBack, onSelectFolder, onCreateCard }) {
  const [data, setData] = useState(loadVocabData);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // folder name to delete

  const refresh = () => setData(loadVocabData());
  useEffect(() => {
    const handler = () => setData(loadVocabData());
    window.addEventListener("gaku_vocab_updated", handler);
    return () => window.removeEventListener("gaku_vocab_updated", handler);
  }, []);

  const allFolders = [{ name:"Your Vocabulary" }, ...data.folders];

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const updated = { ...data, folders: [...data.folders, { name: newFolderName.trim(), createdAt: new Date().toISOString() }] };
    saveVocabData(updated); setData(updated); setNewFolderName(""); setShowNewFolder(false);
  };

  const deleteFolder = (name) => {
    if (name === "Your Vocabulary") return;
    const updated = { ...data, folders: data.folders.filter(f=>f.name!==name), cards: data.cards.filter(c=>c.folder!==name) };
    saveVocabData(updated); setData(updated); setConfirmDelete(null);
  };

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back to Vocabulary</button>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:14, fontWeight:800, margin:0 }}>📚 Your Vocabulary Library</p>
        <button onClick={()=>setShowNewFolder(s=>!s)} style={{ padding:"7px 14px", borderRadius:10, background:`rgba(6,182,212,0.1)`, border:`1px solid rgba(6,182,212,0.3)`, color:C.teal, fontSize:12, fontWeight:700, cursor:"pointer" }}>
          + New Folder
        </button>
      </div>

      {showNewFolder && (
        <div style={{ ...S.card, marginBottom:14, borderLeft:`3px solid ${C.teal}` }}>
          <p style={{ color:C.teal, fontSize:12, fontWeight:700, margin:"0 0 8px" }}>NEW FOLDER</p>
          <div style={{ display:"flex", gap:8 }}>
            <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createFolder()} placeholder="e.g. かおりさん 授業" style={{ ...S.input, flex:1 }} />
            <button onClick={createFolder} disabled={!newFolderName.trim()} style={{ ...S.btn, padding:"12px 16px", background:newFolderName.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:newFolderName.trim()?"#fff":"#475569" }}>Create</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {allFolders.map(f => {
          const count = data.cards.filter(c=>c.folder===f.name).length;
          return (
            <div key={f.name} style={{ ...S.card, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }} onClick={()=>onSelectFolder(f.name)}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:26 }}>{f.name==="Your Vocabulary"?"📚":"📁"}</span>
                <div>
                  <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:"0 0 2px" }}>{f.name}</p>
                  <p style={{ color:"#64748b", fontSize:12, margin:0 }}>{count} {count===1?"word":"words"}</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {f.name !== "Your Vocabulary" && (
                  <button onClick={e=>{e.stopPropagation();setConfirmDelete(f.name);}} style={{ padding:"4px 10px", borderRadius:6, background:"rgba(239,68,68,0.1)", border:`1px solid rgba(239,68,68,0.2)`, color:"#ef4444", fontSize:11, cursor:"pointer", fontWeight:600 }}>🗑 削除</button>
                )}
                <span style={{ color:"#475569", fontSize:16 }}>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ ...S.card, maxWidth:320, width:"90%", textAlign:"center" }}>
            <p style={{ fontSize:28, margin:"0 0 10px" }}>🗑</p>
            <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, margin:"0 0 6px" }}>フォルダを削除しますか？</p>
            <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 6px" }}>「{confirmDelete}」</p>
            <p style={{ color:C.red, fontSize:12, margin:"0 0 18px" }}>このフォルダ内の単語もすべて削除されます。</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setConfirmDelete(null)} style={{ flex:1, ...S.btn, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:13 }}>キャンセル</button>
              <button onClick={()=>deleteFolder(confirmDelete)} style={{ flex:1, ...S.btn, background:"rgba(239,68,68,0.15)", border:`1px solid rgba(239,68,68,0.4)`, color:C.red, fontSize:13, fontWeight:700 }}>削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FOLDER DETAIL VIEW ────────────────────────────────────────────────────────
function FolderDetailView({ folderName, onBack, onViewCard }) {
  const [data, setData] = useState(loadVocabData);
  const cards = data.cards.filter(c=>c.folder===folderName);

  const removeCard = (id) => {
    const updated = { ...data, cards: data.cards.filter(c=>c.id!==id) };
    saveVocabData(updated); setData(updated);
  };

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Library</button>
      <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:"0 0 4px" }}>📁 {folderName}</p>
      <p style={{ color:"#64748b", fontSize:12, margin:"0 0 16px" }}>{cards.length} {cards.length===1?"word":"words"}</p>

      {cards.length === 0 && (
        <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
          <p style={{ color:"#64748b", fontSize:32, margin:"0 0 12px" }}>📭</p>
          <p style={{ color:"#94a3b8", fontSize:14 }}>This folder is empty. Search and save words!</p>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {cards.map(c => (
          <div key={c.id} style={{ ...S.card, borderLeft:`3px solid ${C.teal}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ cursor:"pointer", flex:1 }} onClick={()=>onViewCard(c)}>
                <p style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, margin:"0 0 2px" }}>{c.word}</p>
                <p style={{ color:C.teal, fontSize:13, margin:"0 0 2px" }}>{c.reading}</p>
                <p style={{ color:"#94a3b8", fontSize:12, margin:0 }}>{c.meaning}</p>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={()=>speakJapanese(c.word)} style={{ padding:"6px 10px", borderRadius:8, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:14, cursor:"pointer" }}>🔊</button>
                <button onClick={()=>removeCard(c.id)} style={{ padding:"6px 10px", borderRadius:8, background:"rgba(239,68,68,0.08)", border:`1px solid rgba(239,68,68,0.2)`, color:"#ef4444", fontSize:14, cursor:"pointer" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WORD SEARCH SCREEN ────────────────────────────────────────────────────────
function WordSearchScreen({ form, onBack, onSelectWord }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWord = async () => {
    if (!search.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`You are an expert Japanese dictionary and language teacher. The student's native/preferred language is ${form.preferredLang || "English"}, JLPT level: ${form.jlpt || "N5"}.

The student searched for: "${search}"

This could be a Japanese word, kanji, kana, or an English/other-language word to translate into Japanese.

Generate up to 5 relevant Japanese vocabulary entries. For each entry provide:
- word: the Japanese word (kanji or kana)
- reading: hiragana reading
- jlpt: JLPT level (N5, N4, N3, N2, N1, or "Native" for very advanced)
- partOfSpeech: part of speech in English (Noun, Verb, Adjective, Adverb, etc.)
- meaning: meaning in ${form.preferredLang || "English"} (clear, natural translation)
- meaningNative: Japanese definition/explanation in simple Japanese (REQUIRED - always provide, e.g.「目の周りの部分」)
- example: natural example sentence in Japanese using this word
- reading_example: romanized reading (romaji) of the example sentence
- example_translated: translation of example sentence in ${form.preferredLang || "English"} (REQUIRED - always provide)
- tip: one CLT tip for using this word in real conversation
- imageQuery: 2-3 English words to search Google Images for a visual that represents this word's meaning
- imageDesc: a one-sentence visual description to help memorize the word

Respond ONLY in valid JSON array format (no markdown, no backticks, no preamble):
[{"word":"","reading":"","jlpt":"","partOfSpeech":"","meaning":"","meaningNative":"","example":"","reading_example":"","example_translated":"","tip":"","imageQuery":"","imageDesc":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResults(Array.isArray(parsed) ? parsed : []);
    } catch(e) { setError("Search failed. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>

      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🔍 WORD SEARCH</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:12 }}>
          Search any Japanese word, kanji, or topic — N5 to N1 & native level
        </p>
        <div style={{ display:"flex", gap:8 }}>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&searchWord()}
            placeholder="e.g. 食べる, travel, 勉強, 感謝..."
            style={{ ...S.input, flex:1 }}
            autoFocus
          />
          <button onClick={searchWord} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#475569", whiteSpace:"nowrap", padding:"12px 18px" }}>
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      {error && <p style={{ color:C.red, fontSize:13, textAlign:"center", margin:"12px 0" }}>{error}</p>}

      {loading && (
        <div style={{ textAlign:"center", padding:"30px 0" }}>
          <p style={{ color:C.teal, fontSize:28, margin:"0 0 10px", animation:"spin 1.2s linear infinite" }}>🔍</p>
          <p style={{ color:"#64748b", fontSize:13 }}>Searching Japanese dictionary...</p>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <p style={{ color:"#64748b", fontSize:12, margin:"0 0 6px" }}>{results.length} result{results.length>1?"s":""} found</p>
          {results.map((w,i) => (
            <div key={i} style={{ ...S.card, cursor:"pointer", borderLeft:`3px solid ${C.teal}`, transition:"all 0.15s" }} onClick={()=>onSelectWord(w)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
                    <p style={{ color:"#f1f5f9", fontSize:22, fontWeight:900, margin:0 }}>{w.word}</p>
                    <p style={{ color:C.teal, fontSize:14, margin:0 }}>{w.reading}</p>
                  </div>
                  <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                    {w.jlpt && <span style={{ background:"rgba(168,85,247,0.2)", color:C.purpleLight, fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>{w.jlpt}</span>}
                    {w.partOfSpeech && <span style={{ background:"rgba(6,182,212,0.12)", color:C.teal, fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:99 }}>{w.partOfSpeech}</span>}
                  </div>
                  <p style={{ color:"#94a3b8", fontSize:13, margin:0, lineHeight:1.5 }}>{w.meaning}</p>
                </div>
                <button onClick={e=>{e.stopPropagation();speakJapanese(w.word);}} style={{ width:36, height:36, borderRadius:10, background:`rgba(6,182,212,0.1)`, border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:16, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  🔊
                </button>
              </div>
              <p style={{ color:"#475569", fontSize:11, margin:"8px 0 0", textAlign:"right" }}>Tap for full details →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN VOCAB BUILDER ────────────────────────────────────────────────────────
function VocabBuilder({ form }) {
  const T = useUITranslations(form?.preferredLang || "English");
  // vocabView: "main" | "library" | "folderDetail" | "wordSearch" | "wordDetail" | "flashcard"
  const [vocabView, setVocabView] = useState("main");
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("Your Vocabulary");
  const [vocabData, setVocabData] = useState(loadVocabData);

  // ── Quick Find Words (original feature, kept on main screen) ──
  const [search, setSearch] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [findError, setFindError] = useState("");

  const findWords = async (retryCount = 0) => {
    if (!search.trim()) return;
    setLoading(true);
    setFindError("");
    setWords([]);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500,
          messages:[
            { role:"system", content:`You are a multilingual Japanese dictionary expert. You MUST write the "meaning", "example_translated", and "tip" fields EXCLUSIVELY in ${form.preferredLang || "English"}. Never use English for these fields unless the student native language IS English.` },
            { role:"user", content:`Generate 8 authentic Japanese dictionary words related to the topic: "${search}"\n\nThe student native language is: ${form.preferredLang || "English"}\nALL translations must be in ${form.preferredLang || "English"} — NOT in English unless that is the native language.\n\nReturn a JSON array of exactly 8 objects with these keys:\n- word: Japanese word in kanji/kana\n- reading: hiragana reading\n- jlpt: JLPT level (N5/N4/N3/N2/N1) or ""\n- partOfSpeech: part of speech in English\n- meaning: translation in ${form.preferredLang || "English"}\n- meaningNative: simple Japanese definition (e.g. 「食べ物を料理すること」)\n- example: natural Japanese example sentence\n- example_translated: translation of example in ${form.preferredLang || "English"}\n- tip: usage tip in ${form.preferredLang || "English"}\n- imageQuery: 2-3 English words for image search\n- imageDesc: brief English image description\n\nOutput ONLY a raw JSON array. No markdown, no backticks, no explanation.` }
          ]
        })
      });
      if (res.status === 429 || res.status === 503) {
        if (retryCount < 2) {
          const delay = (retryCount + 1) * 3000;
          setFindError(`⏳ Rate limit reached. Retrying in ${delay/1000}s...`);
          setLoading(false);
          setTimeout(() => findWords(retryCount + 1), delay);
          return;
        }
      }
      const d = await res.json();
      if (d.error) {
        if (d.error.includes && (d.error.includes("rate") || d.error.includes("limit"))) {
          setFindError("⏳ Too many requests. Please wait 30 seconds and try again.");
        } else {
          setFindError("検索に失敗しました。もう一度お試しください。");
        }
        setWords([]); setLoading(false); return;
      }
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const clean = text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      try {
        const parsed = JSON.parse(clean);
        setWords(Array.isArray(parsed)?parsed:[]);
      } catch {
        const match = clean.match(/[\s\S]*/);
        if (match) { try { setWords(JSON.parse(match[0])); } catch { setWords([]); } }
        else { setWords([]); }
      }
    } catch(e) { console.error("findWords error:", e); setWords([]); setFindError("検索に失敗しました。もう一度お試しください。"); }
    setLoading(false);
  };

  const refreshVocab = (data) => setVocabData(data || loadVocabData());
  const totalSaved = vocabData.cards.length;

  // ── RENDER SUBVIEWS ──
  if (vocabView === "library") return <LibraryView onBack={()=>setVocabView("main")} onSelectFolder={name=>{setSelectedFolder(name);setVocabView("folderDetail");}} onCreateCard={()=>setVocabView("wordSearch")} />;
  if (vocabView === "folderDetail") return <FolderDetailView folderName={selectedFolder} onBack={()=>setVocabView("library")} onViewCard={w=>{setSelectedWord(w);setVocabView("wordDetail");}} />;
  if (vocabView === "wordSearch") return <WordSearchScreen form={form} onBack={()=>setVocabView("main")} onSelectWord={w=>{setSelectedWord(w);setVocabView("wordDetail");}} />;
  if (vocabView === "wordDetail") return <WordDetailCard card={selectedWord} form={form} onBack={()=>setVocabView(selectedFolder?"wordSearch":"wordSearch")} onSave={refreshVocab} prefLang={form.preferredLang} />;
  if (vocabView === "flashcard") return <FlashcardView onBack={()=>setVocabView("main")} />;

  // ── MAIN VIEW ──
  return (
    <div>
      {/* ── TOP ACTION BAR ── */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button onClick={()=>setVocabView("library")} style={{ flex:1, ...S.btn, background:C.card, border:`1.5px solid ${C.border}`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>{T.libraryLabel}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:"#64748b" }}>{T.yourVocabSaved} · {totalSaved} {T.savedSuffix}</p>
        </button>
        <button onClick={()=>setVocabView("wordSearch")} style={{ flex:1, ...S.btn, background:`linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.15))`, border:`1.5px solid rgba(168,85,247,0.3)`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>{T.wordCardsLabel}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:C.purpleLight }}>{T.searchCreateCards}</p>
        </button>
        <button onClick={()=>setVocabView("flashcard")} style={{ flex:1, ...S.btn, background:`linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,163,74,0.1))`, border:`1.5px solid rgba(34,197,94,0.3)`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>{T.flashcardsLabel}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:C.green }}>{T.reviewSavedWords}</p>
        </button>
      </div>

      {/* ── VOCABULARY BUILDER (quick find) ── */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T.vocabBuilderTitle}</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>{T.vocabBuilderDesc}</p>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findWords()} placeholder={T.vocabSearchPlaceholder} style={{ ...S.input, flex:1 }} />
          <button onClick={findWords} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#475569", whiteSpace:"nowrap", padding:"12px 18px" }}>
            {loading?"...":T.findWordsBtn}
          </button>
        </div>
        {findError && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
            <p style={{ color:C.red, fontSize:12, margin:0, flex:1 }}>{findError}</p>
            {!findError.includes("⏳ Rate") && (
              <button onClick={()=>findWords(0)} style={{ ...S.btn, padding:"6px 12px", fontSize:11, background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff" }}>{T.retryBtn}</button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <p style={{ color:C.teal, fontSize:24, margin:"0 0 8px" }}>🔍</p>
          <p style={{ color:"#64748b", fontSize:13 }}>{T.searchingDictionary}</p>
        </div>
      )}

      {!loading && words.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {words.map((w,i) => (
            <div key={i} style={{ ...S.card, borderLeft:`3px solid ${C.teal}` }}>
              {/* ── Word Header ── */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ flex:1, cursor:"pointer" }} onClick={()=>{setSelectedWord(w);setVocabView("wordDetail");}}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
                    <p style={{ color:"#f1f5f9", fontSize:22, fontWeight:900, margin:0 }}>{w.word}</p>
                    <p style={{ color:C.teal, fontSize:14, margin:0 }}>{w.reading}</p>
                    {w.jlpt && <span style={{ background:"rgba(168,85,247,0.2)", color:C.purpleLight, fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>{w.jlpt}</span>}
                    {w.partOfSpeech && <span style={{ background:"rgba(6,182,212,0.12)", color:C.teal, fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:99 }}>{w.partOfSpeech}</span>}
                  </div>
                  <p style={{ color:"#94a3b8", fontSize:13, margin:0 }}>{w.meaning}</p>
                </div>
                {/* 単語音声ボタン */}
                <button onClick={e=>{e.stopPropagation();speakJapanese(w.word);}} title={T.speakWord} style={{ width:40, height:40, borderRadius:10, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:18, cursor:"pointer", flexShrink:0, marginLeft:8, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
              </div>

              {/* ── Japanese Definition ── */}
              {w.meaningNative && (
                <p style={{ color:"#64748b", fontSize:12, lineHeight:1.7, margin:"0 0 8px", borderLeft:`2px solid ${C.border}`, paddingLeft:8 }}>{w.meaningNative}</p>
              )}

              {/* ── Example Sentence with audio ── */}
              <div style={{ background:"rgba(6,182,212,0.06)", borderRadius:8, padding:"8px 10px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ color:"#f1f5f9", fontSize:12, margin:"0 0 3px", lineHeight:1.8 }}>{w.example}</p>
                    <p style={{ color:"#64748b", fontSize:11, margin:0, fontStyle:"italic" }}>{w.example_translated}</p>
                  </div>
                  {/* 例文音声ボタン */}
                  <button onClick={e=>{e.stopPropagation();speakJapanese(w.example);}} title={T.speakExample} style={{ width:34, height:34, borderRadius:8, background:"rgba(245,158,11,0.1)", border:`1px solid rgba(245,158,11,0.25)`, color:C.amber, fontSize:15, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
                </div>
              </div>

              {/* ── Action Row: Weblio / Google Image / Detail ── */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <a
                  href={`https://www.weblio.jp/content/${encodeURIComponent(w.word)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e=>e.stopPropagation()}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"7px 10px", borderRadius:8, background:"rgba(232,93,4,0.1)", border:"1px solid rgba(232,93,4,0.25)", color:"#e85d04", fontSize:11, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}
                >
                  {T.weblioDict}
                </a>
                <a
                  href={`https://www.bing.com/images/search?q=${encodeURIComponent(w.word + " " + (w.imageQuery || ""))}&FORM=IRSBH0`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e=>e.stopPropagation()}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"7px 10px", borderRadius:8, background:"rgba(6,182,212,0.08)", border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:11, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}
                >
                  {T.googleImages}
                </a>
                <button
                  onClick={()=>{setSelectedWord(w);setVocabView("wordDetail");}}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"7px 10px", borderRadius:8, background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.25)", color:C.purpleLight, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}
                >
                  {T.detailCard}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE SET (built from selected skills only) ─────────────────────────────
// JLPT links by level and section
const JLPT_LINKS = {
  "N5": {
    vocab:    "https://japanesetest4you.com/jlpt-n5-vocabulary/",
    reading:  "https://japanesetest4you.com/jlpt-n5-reading/",
    listening:"https://japanesetest4you.com/jlpt-n5-listening/",
  },
  "N4": {
    vocab:    "https://japanesetest4you.com/jlpt-n4-vocabulary/",
    reading:  "https://japanesetest4you.com/jlpt-n4-reading/",
    listening:"https://japanesetest4you.com/jlpt-n4-listening/",
  },
  "N3": {
    vocab:    "https://japanesetest4you.com/jlpt-n3-vocabulary/",
    reading:  "https://japanesetest4you.com/jlpt-n3-reading/",
    listening:"https://japanesetest4you.com/jlpt-n3-listening/",
  },
  "N2": {
    vocab:    "https://japanesetest4you.com/jlpt-n2-vocabulary/",
    reading:  "https://japanesetest4you.com/jlpt-n2-reading/",
    listening:"https://japanesetest4you.com/jlpt-n2-listening/",
  },
  "N1": {
    vocab:    "https://japanesetest4you.com/jlpt-n1-vocabulary/",
    reading:  "https://japanesetest4you.com/jlpt-n1-reading/",
    listening:"https://japanesetest4you.com/jlpt-n1-listening/",
  },
};

function PracticeSet({ form }) {
  const [items, setItems] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState("all");

  const skills = form.skills || [];
  const skillLabels = skills.map(s => SKILL_LABELS[s] || s).join(", ");
  const jlptLinks = JLPT_LINKS[form.jlpt] || null;

  // Gather resources for selected skills
  const selectedResources = skills.flatMap(s => (RESOURCES[s] || []).map(r => ({ ...r, skill: s })));
  const levelResources = LEVEL_RESOURCES[form.jlpt] || [];
  // Deduplicate by URL
  const seen = new Set();
  const allResources = [...selectedResources, ...levelResources].filter(r => {
    if (seen.has(r.url)) return false; seen.add(r.url); return true;
  });

  const resourceContext = allResources.length > 0
    ? allResources.map(r => `- [${r.skill || "general"}] ${r.name}: ${r.desc || ""} → ${r.url}`).join("\n")
    : "No specific resources found.";

  const questionCount = skills.length >= 4 ? 20 : skills.length >= 2 ? 15 : 10;

  const generate = async () => {
    setLoading(true); setError(""); setItems([]); setRevealed({}); setActiveSkillFilter("all");
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4000,
          messages:[{ role:"user", content:`You are a Japanese teacher using CLT (Communicative Language Teaching). The student's JLPT level is ${form.jlpt}, goal: ${form.displayGoal||form.goal}.
The student selected ONLY these study skills: ${skillLabels || "general practice"}.

RESOURCES the student is using (you MUST cite the resource URL in the "source_url" field for every exercise):
${resourceContext}

Create EXACTLY ${questionCount} practice exercises. PRIORITY: favor Speaking and Writing OUTPUT activities. Reading should lead to output (e.g. read a passage then write a sentence using the same grammar, or say the answer aloud). Distribute across selected skills.

Activity types per skill:
- 🔊 Pronunciation (pronunciation): Shadowing prompt — give a sentence to read aloud; minimal pair drill — two words that sound similar, ask the difference; pitch accent awareness
- 👂 Listening (listening): Cloze — describe an audio scenario in [brackets] then give a sentence with ___ to fill in; comprehension from described scenario; dictation-style prompt
- 💬 Conversation (conversation): Role-play scenario — describe a situation, ask student to respond in Japanese; dialogue completion — give 2 lines, student writes line 3; social phrase production
- 🎯 JLPT Prep (jlpt): 4-choice grammar/vocabulary question — ALWAYS include all 4 options labeled ①②③④ in the prompt text itself
- 📖 Reading (reading): Give a short Japanese passage (2-5 sentences at ${form.jlpt} level), then ask student to answer a question OR write a sentence using a grammar point from the passage
- 🈳 Kanji (kanji): CRITICAL — you MUST include the actual kanji character(s) in the prompt. Examples: "「学」の読み方は？", "次の文で「電車」はどういう意味？", "「___」に漢字を入れてください（でんしゃ）". NEVER write "What is the meaning of the kanji:" without the actual kanji following immediately.
- 📝 Grammar (grammar): Fill-in-the-blank with a specific grammar point; error correction; sentence transformation using a given pattern; particle choice ①②③④

STRICT LEVEL CALIBRATION:
- Beginner: hiragana/katakana only, basic kanji (日本人etc.), です/ます
- N5: ~100 kanji, basic particles, plain/polite, て-form
- N4: ~300 kanji, past/potential/conditional
- N3: ~650 kanji, passive/causative, complex conjunctions
- N2: ~1000 kanji, keigo basics, abstract vocabulary
- N1: ~2000 kanji, advanced/nuanced grammar

For each exercise return these fields:
- skill: one of ${skills.join(", ")}
- type: specific label (e.g. "Shadowing prompt", "Role-play", "Kanji reading", "Grammar fill-in", "JLPT 4-choice", "Reading + output")
- prompt: COMPLETE self-contained question. Kanji exercises MUST have the kanji. Multiple-choice MUST have all options ①②③④. Reading MUST include the passage. NEVER leave the content implicit.
- answer: correct answer only
- tip: one practical CLT tip referencing a resource by name
- source_url: the URL of the resource this exercise is based on (pick the most relevant one from the list above)

Respond ONLY with a valid JSON array, no markdown, no backticks:
[{"skill":"","type":"","prompt":"","answer":"","tip":"","source_url":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch { setError("Could not generate a practice set right now. Please try again."); }
    setLoading(false);
  };

  const skillColors = {
    pronunciation:"#f59e0b", listening:"#06b6d4", conversation:"#22c55e",
    jlpt:"#a78bfa", reading:"#fb923c", kanji:"#e879f9", grammar:"#60a5fa"
  };

  const filteredItems = activeSkillFilter === "all" ? items : items.filter(it => it.skill === activeSkillFilter);
  const skillsInResult = [...new Set(items.map(it => it.skill))];

  return (
    <div>
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🎯 PRACTICE SET</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:8, lineHeight:1.7 }}>
          Generated from what you selected in <strong style={{ color:"#94a3b8" }}>"WHAT DO YOU WANT TO STUDY?"</strong>:{" "}
          {skills.length ? skills.map(s => SKILL_LABELS[s] || s).join(" · ") : "No skills selected — edit your profile to choose skills."}
        </p>
        {skills.length > 0 && (
          <p style={{ color:"#475569", fontSize:11, marginBottom:12 }}>
            📚 {questionCount} exercises · {allResources.length} resources referenced
          </p>
        )}
        <button onClick={generate} disabled={loading || skills.length===0} style={{ ...S.btn, width:"100%", background:skills.length?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:skills.length?"#fff":"#475569" }}>
          {loading ? `Building ${questionCount} exercises...`:"Generate Practice Set ✨"}
        </button>
        {error && <p style={{ color:C.red, fontSize:12, marginTop:10 }}>{error}</p>}
      </div>

      {/* JLPT quick links — shown if jlpt is a selected skill */}
      {skills.includes("jlpt") && jlptLinks && (
        <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid #a78bfa` }}>
          <p style={{ color:"#a78bfa", fontSize:11, fontWeight:700, letterSpacing:1, margin:"0 0 10px" }}>🎯 TODAY'S JLPT PRACTICE — {form.jlpt}</p>
          <p style={{ color:"#64748b", fontSize:11, margin:"0 0 8px" }}>本日はこのページから始めましょう：</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              { label:"📝 語彙（Vocabulary）", url: jlptLinks.vocab },
              { label:"📖 読解（Reading）",    url: jlptLinks.reading },
              { label:"👂 聴解（Listening）",  url: jlptLinks.listening },
            ].map(({ label, url }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                style={{ display:"block", padding:"8px 12px", borderRadius:8, background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.25)", color:"#c4b5fd", fontSize:12, fontWeight:600, textDecoration:"none" }}>
                {label} →
              </a>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Skill filter tabs */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            <button onClick={()=>setActiveSkillFilter("all")} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${activeSkillFilter==="all"?C.purpleLight:C.border}`, background:activeSkillFilter==="all"?"rgba(168,85,247,0.15)":C.card, color:activeSkillFilter==="all"?C.purpleLight:"#64748b" }}>
              すべて ({items.length})
            </button>
            {skillsInResult.map(s => (
              <button key={s} onClick={()=>setActiveSkillFilter(s)} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${activeSkillFilter===s?(skillColors[s]||C.purpleLight):C.border}`, background:activeSkillFilter===s?`rgba(0,0,0,0.15)`:C.card, color:activeSkillFilter===s?(skillColors[s]||C.purpleLight):"#64748b" }}>
                {SKILL_LABELS[s]||s} ({items.filter(it=>it.skill===s).length})
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {filteredItems.map((it,i) => {
              const color = skillColors[it.skill] || C.purpleLight;
              const globalIdx = items.indexOf(it);
              return (
                <div key={i} style={{ ...S.card, borderLeft:`3px solid ${color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ color, fontSize:11, fontWeight:700 }}>{SKILL_LABELS[it.skill] || it.skill}</span>
                    <span style={{ color:"#64748b", fontSize:11 }}>{it.type}</span>
                  </div>
                  <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:"0 0 10px", whiteSpace:"pre-wrap" }}>{it.prompt}</p>
                  {revealed[globalIdx] ? (
                    <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
                      <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>✅ ANSWER</p>
                      <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 6px" }}>{it.answer}</p>
                      {it.tip && <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 6px", fontStyle:"italic" }}>💬 {it.tip}</p>}
                      {it.source_url && (
                        <a href={it.source_url} target="_blank" rel="noopener noreferrer"
                          style={{ display:"inline-block", color:C.teal, fontSize:11, textDecoration:"none", background:"rgba(6,182,212,0.08)", border:"1px solid rgba(6,182,212,0.2)", padding:"3px 10px", borderRadius:6, fontWeight:600 }}>
                          🔗 {it.source_url.replace(/https?:\/\/(www\.)?/,"").split("/")[0]}
                        </a>
                      )}
                    </div>
                  ) : (
                    <button onClick={()=>setRevealed(r=>({...r,[globalIdx]:true}))} style={{ padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
                      Show answer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Schedule builder ────────────────────────────────────────────────────────────
// Skill note keys mapped to T keys
const SKILL_NOTE_KEY = {
  conversation: "taskConversation",
  listening:    "taskListening",
  reading:      "taskReading",
  grammar:      "taskGrammar",
  kanji:        "taskKanji",
  jlpt:         "taskJlpt",
  pronunciation:"taskPronunciation",
};

// Skill label T-keys
const SKILL_LABEL_KEY = {
  pronunciation:"skillPronunciation", listening:"skillListening",
  conversation:"skillConversation", jlpt:"skillJlpt",
  reading:"skillReading", kanji:"skillKanji", grammar:"skillGrammar",
};

function buildSchedule(form, T) {
  const t = T || UI_TRANSLATIONS["English"];
  const hoursMap = { "Less than 1 hour":45, "1–2 hours":90, "2–3 hours":150, "3+ hours":180 };
  const daysMap  = { "1–2 days":2, "3–4 days":4, "5–6 days":5, "Every day":7 };
  const mins = hoursMap[form.hoursPerDay] || 60;
  const days = daysMap[form.daysPerWeek] || 5;
  const skills = form.skills || [];

  const allBlocks = [
    { skill:"conversation", mins:Math.round(mins*0.3) },
    { skill:"listening",    mins:Math.round(mins*0.2) },
    { skill:"reading",      mins:Math.round(mins*0.15) },
    { skill:"grammar",      mins:Math.round(mins*0.15) },
    { skill:"kanji",        mins:Math.round(mins*0.1) },
    { skill:"jlpt",         mins:Math.round(mins*0.2) },
    { skill:"pronunciation",mins:Math.round(mins*0.1) },
  ].filter(b => skills.includes(b.skill));

  if (allBlocks.length === 0) {
    allBlocks.push({ skill:"conversation", mins:30 });
  }

  const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const schedule = {};
  const activeDays = WEEKDAYS.slice(0, days);
  activeDays.forEach((day, i) => {
    const focus = allBlocks[i % allBlocks.length];
    const skillLabel = t[SKILL_LABEL_KEY[focus.skill]] || SKILL_LABELS[focus.skill] || focus.skill;
    const note = t[SKILL_NOTE_KEY[focus.skill]] || "";
    schedule[day] = [
      { task:`${skillLabel}: ${note} (${focus.mins} min)`, done:false },
      { task: t.vocabReview || "Vocabulary review — Anki or saved words (10 min)", done:false },
      i % 2 === 0 ? { task: t.speakAloud || "Speak aloud: summarize today's content in Japanese (5 min)", done:false } : null,
    ].filter(Boolean);
  });
  WEEKDAYS.slice(days).forEach(day => {
    schedule[day] = [{ task: t.restDay || "Rest day 🌸", done:false, rest:true }];
  });
  return schedule;
}

// ─── AI Weekly Schedule Generator ────────────────────────────────────────────────
function getWeekInfo(form) {
  const timelineWeeksMap = {
    "Less than 6 months": 24,
    "6 months – 1 year": 48,
    "1–2 years": 96,
    "2+ years": 144,
  };
  const totalWeeks = timelineWeeksMap[form.timeline] || 24;
  const startDate = form.planStartDate ? new Date(form.planStartDate) : new Date();
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const elapsed = Math.floor((now - startDate) / msPerWeek);
  const currentWeek = Math.min(Math.max(elapsed + 1, 1), totalWeeks);
  return { currentWeek, totalWeeks };
}

const AI_SCHEDULE_CACHE = {};

async function buildAIWeeklySchedule(form, weekNum, totalWeeks) {
  const lang = form.preferredLang || "English";
  const cacheKey = `${form.email || form.name}_w${weekNum}_${form.jlpt}_${(form.skills||[]).join("")}_${lang}`;
  // Check localStorage first
  try {
    const stored = localStorage.getItem(`gaku_sched_${cacheKey}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  if (AI_SCHEDULE_CACHE[cacheKey]) return AI_SCHEDULE_CACHE[cacheKey];

  const hoursMap = { "Less than 1 hour": 45, "1–2 hours": 90, "2–3 hours": 150, "3+ hours": 180 };
  const daysMap  = { "1–2 days": 2, "3–4 days": 4, "5–6 days": 5, "Every day": 7 };
  const minsPerDay = hoursMap[form.hoursPerDay] || 60;
  const studyDays = daysMap[form.daysPerWeek] || 5;
  const weeksLeft = totalWeeks - weekNum;
  const progressPct = Math.round((weekNum / totalWeeks) * 100);

  const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const activeDays = WEEKDAYS.slice(0, studyDays);
  const restDays = WEEKDAYS.slice(studyDays);

  const langInstruction = lang !== "English" ? `\nIMPORTANT: Write ALL task descriptions and the weekTheme in ${lang}. Do NOT use English for any text content.\n` : "";

  const prompt = `You are an expert Japanese language teacher using CLT (Communicative Language Teaching) methodology.
${langInstruction}
Student profile:
- Name: ${form.name}
- Current JLPT level: ${form.jlpt}
- Final goal: ${form.displayGoal || form.goal}
- Timeline: ${form.timeline} (${totalWeeks} weeks total)
- Current week: Week ${weekNum} of ${totalWeeks} (${progressPct}% through the plan, ${weeksLeft} weeks remaining)
- Study time per day: ${minsPerDay} minutes
- Study days per week: ${studyDays} days (${activeDays.join(", ")})
- Skills to focus on: ${(form.skills||[]).join(", ")}

Working backwards from the goal:
- Week ${weekNum} of ${totalWeeks}: ${progressPct < 25 ? "Foundation building phase — establish core habits and basics" : progressPct < 50 ? "Development phase — expanding knowledge and skills" : progressPct < 75 ? "Consolidation phase — deepening understanding and fluency" : "Mastery phase — polishing, testing, and refining"}

Create a SPECIFIC weekly study schedule for Week ${weekNum}. For each study day, provide 2-3 concrete tasks that:
1. Are specifically calibrated for ${form.jlpt} level students at week ${weekNum}/${totalWeeks}
2. Include REAL, specific resources (e.g. specific NHK Easy News articles topic, specific grammar point like て-form conditionals, specific Anki deck, specific Nihongo con Teppei episode topic, etc.)
3. Progress logically from previous weeks (early weeks = fundamentals, later weeks = advanced application)
4. Total time per day must not exceed ${minsPerDay} minutes${lang !== "English" ? `\n5. All task text MUST be written in ${lang}` : ""}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "weekTheme": "One sentence describing this week's main focus",
  "schedule": {
    ${activeDays.map(d => `"${d}": [{"task": "specific task description (X min)", "done": false}]`).join(",\n    ")},
    ${restDays.map(d => `"${d}": [{"task": "Rest day 🌸", "done": false, "rest": true}]`).join(",\n    ")}
  }
}`;

  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const d = await res.json();
    const text = (d.content || []).map(c => c.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    AI_SCHEDULE_CACHE[cacheKey] = parsed;
    try { localStorage.setItem(`gaku_sched_${cacheKey}`, JSON.stringify(parsed)); } catch {}
    return parsed;
  } catch (e) {
    return null;
  }
}

// Milestone text keys (for AI translation lookup)
const MILESTONE_EN = {
  "Beginner": ["Learn hiragana + katakana (Week 1–2)", "Master 300 vocabulary words (Month 1)", "Hold a 2-minute self-introduction in Japanese (Month 2)", "Pass JLPT N5 practice test at 70% (Month 3)"],
  "N5": ["Complete N4 grammar on Imabi (Month 1–2)", "Reach 800 vocabulary words (Month 2)", "Hold a 5-minute conversation on daily topics (Month 3)", "Pass JLPT N4 practice test at 70% (Month 4–5)"],
  "N4": ["Complete N3 grammar (Month 1–3)", "Reach 1,500 vocabulary words (Month 2)", "Read NHK Web Easy daily without dictionary (Month 3)", "Pass JLPT N3 practice test at 70% (Month 4–6)"],
  "N3": ["Complete N2 grammar (Month 1–3)", "Reach 3,000 vocabulary words (Month 3)", "Read regular NHK News (Month 4)", "Pass JLPT N2 practice test at 70% (Month 5–8)"],
  "N2": ["Complete N1 grammar (Month 1–3)", "Reach 6,000 vocabulary words (Month 4)", "Read academic/business Japanese texts (Month 5)", "Pass JLPT N1 practice test at 60% (Month 6–10)"],
  "N1": ["Master business keigo patterns (Month 1–2)", "Write formal Japanese essays 800+ characters (Month 2)", "Participate in native-speed discussions (Month 3)", "Achieve professional fluency certification (Month 6+)"],
};

function buildMilestones(form) {
  const key = (form.jlpt||"").replace("Beginner (no JLPT)","Beginner").replace(" (no JLPT)","");
  return MILESTONE_EN[key] || MILESTONE_EN["Beginner"];
}

// Cache for AI-translated milestone text
const MILESTONE_TRANS_CACHE = {};

async function translateMilestonesAI(milestones, lang) {
  const cacheKey = `${lang}:${milestones.join("|")}`;
  if (MILESTONE_TRANS_CACHE[cacheKey]) return MILESTONE_TRANS_CACHE[cacheKey];
  try {
    const res = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:800,
        messages:[{ role:"user", content:
          `Translate these Japanese learning milestone descriptions into ${lang}. Keep month/week references exact. Return ONLY a JSON array of strings, no markdown.\n\n${JSON.stringify(milestones)}`
        }]
      })
    });
    const d = await res.json();
    const text = d.content?.map(c=>c.text||"").join("") || "[]";
    const clean = text.replace(/```json|```/g,"").trim();
    const parsed = JSON.parse(clean);
    MILESTONE_TRANS_CACHE[cacheKey] = parsed;
    return parsed;
  } catch { return milestones; }
}

// ─── HELP MODAL ────────────────────────────────────────────────────────────────
function HelpModal({ onClose, form }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [view, setView] = useState("menu"); // menu | lesson | howto
  const [mood, setMood] = useState(""); const [time, setTime] = useState(""); const [energy, setEnergy] = useState("");
  const [wantsDifferent, setWantsDifferent] = useState(false);
  const [differentText, setDifferentText] = useState("");
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false);

  const getHelp = async () => {
    setLoading(true);
    const lang = form?.preferredLang || "English";
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500,
          messages:[{ role:"user", content:`You are a warm Japanese language coach using CLT (Communicative Language Teaching).
Student: ${form.name}, Level: ${form.jlpt}, Goal: ${form.displayGoal||form.goal}, Skills: ${(form.skills||[]).join(", ")}
Today: Mood: ${mood}, Time: ${time} min, Energy: ${energy}
${wantsDifferent && differentText.trim() ? `IMPORTANT: Today the student specifically requested what they want to study/do, in their own words: "${differentText.trim()}". Treat this as the primary brief — build today's entire suggestion AROUND this specific request (use it to choose the topic, the resource, and the activity), while still applying CLT principles and keeping it appropriate for their JLPT level. Do not ignore or generalize away from what they asked for.` : `Focus on skills the student selected: ${(form.skills||[]).join(", ")}.`}
Give a specific, encouraging suggestion for TODAY ONLY using CLT principles.
One concrete activity with a specific resource (a real site, podcast, app, or material — e.g. NHK Easy News, Nihongo con Teppei, a specific grammar point, etc). Break down roughly how to spend the ${time||"available"} minutes (e.g. a short breakdown of minutes per step). Emojis okay.
Under 150 words.
CRITICAL: Write your ENTIRE response in ${lang}. Every word, including labels and resource descriptions, must be in ${lang} — do not use English unless ${lang} is English.` }]
        })
      });
      const d = await res.json();
      const fallback = lang === "Japanese"
        ? "今日は無理をしないでくださいね！単語を5つ復習して、日本語の動画を1本見てみましょう。🌸"
        : "Take it easy today! Review 5 words and watch one Japanese video. 🌸";
      setResult(d.content?.map(c=>c.text||"").join("") || fallback);
    } catch {
      const lang2 = form?.preferredLang || "English";
      setResult(lang2 === "Japanese"
        ? "10分でも十分です！保存した単語を復習して、声に出して一文練習してみましょう。頑張って！🎌"
        : "Even 10 minutes counts! Review your saved vocabulary and practice one sentence aloud. 頑張って！🎌");
    }
    setLoading(false);
  };

  const reset = () => { setView("menu"); setResult(""); setMood(""); setTime(""); setEnergy(""); setWantsDifferent(false); setDifferentText(""); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div style={{ ...S.card, width:"100%", maxWidth:420, position:"relative", maxHeight:"85vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer" }}>×</button>
        <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T.helpTitle}</p>

        {view==="menu" && (
          <>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 18px" }}>{T.whatWouldYouLike}</h3>
            <button onClick={()=>setView("lesson")} style={{ ...S.btn, width:"100%", textAlign:"left", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", marginBottom:10 }}>
              {T.customizedLesson}
              <div style={{ fontWeight:400, fontSize:11, marginTop:4, opacity:0.9 }}>今日のカスタマイズレッスン</div>
            </button>
            <button onClick={()=>setView("howto")} style={{ ...S.btn, width:"100%", textAlign:"left", background:C.card, color:"#f1f5f9", border:`1px solid ${C.border}` }}>
              {T.howToUse}
              <div style={{ fontWeight:400, fontSize:11, marginTop:4, color:"#64748b" }}>使い方</div>
            </button>
          </>
        )}

        {view==="lesson" && (
          <>
            <button onClick={reset} style={{ background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer", padding:0, marginBottom:10 }}>{T.back}</button>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 18px" }}>{T.howAreYouFeeling}</h3>
            {!result ? (
              <>
                <label style={S.label}>{T.mood}</label>
                <select value={mood} onChange={e=>setMood(e.target.value)} style={{ ...S.select, marginBottom:10 }}>
                  <option value="">{T.moodPlaceholder}</option>
                  <option value="motivated and energetic">{T.moodMotivated}</option>
                  <option value="okay, normal day">{T.moodOkay}</option>
                  <option value="tired and low energy">{T.moodTired}</option>
                  <option value="stressed or anxious">{T.moodStressed}</option>
                  <option value="happy and relaxed">{T.moodHappy}</option>
                </select>
                <label style={S.label}>{T.availableTime}</label>
                <select value={time} onChange={e=>setTime(e.target.value)} style={{ ...S.select, marginBottom:10 }}>
                  <option value="">{T.select}</option>
                  <option value="10">{T.tenMin}</option><option value="20">{T.twentyMin}</option>
                  <option value="30">{T.thirtyMin}</option><option value="60">{T.oneHour}</option><option value="90">{T.oneHalfHour}</option>
                </select>
                <label style={S.label}>{T.energyLevel}</label>
                <select value={energy} onChange={e=>setEnergy(e.target.value)} style={{ ...S.select, marginBottom:14 }}>
                  <option value="">{T.select}</option>
                  <option value="high - ready to challenge">{T.energyHigh}</option>
                  <option value="medium - normal study">{T.energyMedium}</option>
                  <option value="low - light review only">{T.energyLow}</option>
                </select>

                <div style={{ background:"rgba(168,85,247,0.06)", border:`1px solid rgba(168,85,247,0.2)`, borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom: wantsDifferent ? 8 : 0 }}>
                    <input type="checkbox" checked={wantsDifferent} onChange={e=>setWantsDifferent(e.target.checked)} />
                    <span style={{ color:"#f1f5f9", fontSize:13, fontWeight:600 }}>{T.wantsDifferent}</span>
                  </label>
                  {wantsDifferent && (
                    <textarea value={differentText} onChange={e=>setDifferentText(e.target.value)} placeholder={T.differentPlaceholder} rows={3} style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.7 }} />
                  )}
                </div>

                <button onClick={getHelp} disabled={!mood||!time||!energy||loading} style={{ ...S.btn, width:"100%", background:mood&&time&&energy?`linear-gradient(135deg,${C.amber},#d97706)`:"#1e293b", color:mood&&time&&energy?"#fff":"#475569" }}>
                  {loading ? T.generating : T.getTodaysPlan}
                </button>
              </>
            ) : (
              <>
                <div style={{ background:"rgba(245,158,11,0.08)", borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"14px 16px", marginBottom:14 }}>
                  <p style={{ color:"#f1f5f9", fontSize:13, lineHeight:1.8, margin:0 }}>{result}</p>
                </div>
                <button onClick={()=>setResult("")} style={{ ...S.btn, width:"100%", background:C.card, color:"#94a3b8", border:`1px solid ${C.border}` }}>{T.tryAgain}</button>
              </>
            )}
          </>
        )}

        {view==="howto" && (
          <>
            <button onClick={reset} style={{ background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer", padding:0, marginBottom:10 }}>{T.back}</button>
            <h3 style={{ color:"#f1f5f9", fontSize:17, fontWeight:800, margin:"0 0 14px" }}>{T.howToTitle}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                [T.tabSchedule,   T.howToSchedule],
                [T.tabPractice,   T.howToPractice],
                [T.tabVocabulary, T.howToVocab],
                [T.tabResources,  T.howToResources],
                [T.tabMilestones, T.howToMilestones],
                [T.editProfile,   T.howToEditProfile],
                [T.help,          T.howToHelp],
              ].map(([title, desc], i) => (
                <div key={i} style={{ ...S.card }}>
                  <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 4px" }}>{title}</p>
                  <p style={{ color:"#94a3b8", fontSize:12, margin:0, lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WRITING PROMPT ────────────────────────────────────────────────────────────
function WritingPrompt({ jlpt }) {
  const [topic, setTopic] = useState("culture");
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = WRITING_TOPICS[topic][promptIdx];
  const charCount = text.length;

  const getFeedback = async () => {
    if (text.length < 50) return;
    setLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400,
          messages:[{ role:"user", content:`You are a Japanese language teacher using CLT. Student level: ${jlpt}.
Prompt: "${prompt}"
Student's response: "${text}"
Give feedback:
1. 👍 What they did well
2. 💡 One concrete improvement
3. 🌟 One new expression to use next time
Warm, under 100 words, English.` }]
        })
      });
      const d = await res.json();
      setFeedback(d.content?.map(c=>c.text||"").join("") || "Great effort! Keep writing every day. 🌸");
    } catch { setFeedback("Great effort! Your writing practice builds real communicative ability. 頑張って！🌸"); }
    setLoading(false);
  };

  return (
    <div style={{ ...S.card, marginBottom:16 }}>
      <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:12 }}>✍️ WRITING PRACTICE (CLT)</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {Object.keys(WRITING_TOPICS).map(t => (
          <button key={t} onClick={()=>{setTopic(t);setPromptIdx(0);setText("");setFeedback("");}} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${topic===t?C.amber:C.border}`, background:topic===t?"rgba(245,158,11,0.12)":C.card, color:topic===t?C.amber:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {t==="culture"?"🌸 文化":t==="work"?"💼 仕事":"📚 教育"}
          </button>
        ))}
      </div>
      <div style={{ background:"rgba(245,158,11,0.06)", borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"12px 14px", marginBottom:12 }}>
        <p style={{ color:"#f1f5f9", fontSize:14, margin:"0 0 4px", fontWeight:600 }}>{prompt}</p>
        <p style={{ color:"#64748b", fontSize:11, margin:0 }}>300〜800文字 · Communicative writing practice</p>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="ここに書いてください..." rows={5} style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.8, marginBottom:8 }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <p style={{ color:charCount<300?"#64748b":charCount>800?C.red:C.green, fontSize:12, margin:0 }}>{charCount}/300〜800文字</p>
        <button onClick={()=>{setPromptIdx(p=>(p+1)%WRITING_TOPICS[topic].length);setText("");setFeedback("");}} style={{ padding:"5px 12px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
          Next prompt →
        </button>
      </div>
      {!feedback ? (
        <button onClick={getFeedback} disabled={text.length<50||loading} style={{ ...S.btn, width:"100%", background:text.length>=50?`linear-gradient(135deg,${C.amber},#d97706)`:"#1e293b", color:text.length>=50?"#fff":"#475569" }}>
          {loading?"Getting feedback...":"Get AI feedback ✨"}
        </button>
      ) : (
        <div style={{ background:"rgba(34,197,94,0.06)", borderLeft:`3px solid ${C.green}`, borderRadius:8, padding:"12px 14px" }}>
          <p style={{ color:"#f1f5f9", fontSize:13, lineHeight:1.8, margin:0 }}>{feedback}</p>
          <button onClick={()=>setFeedback("")} style={{ marginTop:10, padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#64748b", fontSize:11, cursor:"pointer" }}>Try again</button>
        </div>
      )}
    </div>
  );
}

// ─── LANGUAGES for translation ─────────────────────────────────────────────────
// All 17 languages are fully statically translated (instant switch, no AI delay)
const LANGUAGES = [
  "English","Spanish","French","German","Chinese (Simplified)","Chinese (Traditional)",
  "Italian","Korean","Thai","Malay","Indonesian","Vietnamese","Hindi",
  "Japanese","Turkish","Nepali","Filipino",
];

// ─── FORM ───────────────────────────────────────────────────────────────────────
function FormScreen({ onSubmit, onBack, onCancel, initialJlpt, initialForm }) {
  const [form, setForm] = useState(() => initialForm || {
    name:"", email:"", country:"", preferredLang:"English",
    goal:"", customGoal:"", timeline:"",
    jlpt: initialJlpt || "",
    hoursPerDay:"", daysPerWeek:"", skills:[]
  });
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleSkill = (s) => setForm(f=>({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x=>x!==s) : [...f.skills, s] }));
  const T = useUITranslations(form.preferredLang);
  const isOther = form.goal === "Other";
  const valid = form.name && form.email && form.country && form.goal && (isOther ? form.customGoal.trim() : true) && form.timeline && form.jlpt && form.hoursPerDay && form.daysPerWeek && form.skills.length > 0;

  return (
    <div style={{ ...S.page, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 16px 60px" }}>
      <div style={{ width:"100%", maxWidth:520 }}>
        {T._loading && (
          <div style={{ background:"rgba(168,85,247,0.1)", border:`1px solid rgba(168,85,247,0.3)`, borderRadius:10, padding:"10px 16px", marginBottom:16, textAlign:"center" }}>
            <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:0 }}>🌐 Translating into {form.preferredLang}...</p>
          </div>
        )}
        {initialForm && onCancel ? (
          <button onClick={onCancel} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>{T.backToMyPlan}</button>
        ) : (
          onBack && <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", marginBottom:16, padding:0 }}>{T.back}</button>
        )}
        <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:4 }}>GAKU SELF-STUDY APP</p>
        <h1 style={{ fontSize:24, fontWeight:900, margin:"0 0 4px" }}>{initialForm ? T.formEditTitle : T.formTitle}</h1>
        <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>{initialForm ? T.formEditSubtitle : T.formSubtitle}</p>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={S.label}>{T.yourName}</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder={T.namePlaceholder} style={S.input}/></div>
          <div><label style={S.label}>{T.email}</label><input value={form.email} onChange={e=>set("email",e.target.value)} placeholder={T.emailPlaceholder} type="email" style={S.input}/></div>
          <div><label style={S.label}>{T.country}</label><input value={form.country} onChange={e=>set("country",e.target.value)} placeholder={T.countryPlaceholder} style={S.input}/></div>

          {/* Native Language — changing this instantly switches all UI */}
          <div>
            <label style={S.label}>{T.yourNativeLanguage}</label>
            <select value={form.preferredLang} onChange={e=>set("preferredLang",e.target.value)} style={S.select}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Final Goal */}
          <div>
            <label style={S.label}>{T.finalGoal}</label>
            <select value={form.goal} onChange={e=>set("goal",e.target.value)} style={S.select}>
              <option value="">{T.selectGoal}</option>
              <option value="Pass JLPT N5">{T.goalN5}</option>
              <option value="Pass JLPT N4">{T.goalN4}</option>
              <option value="Pass JLPT N3">{T.goalN3}</option>
              <option value="Pass JLPT N2">{T.goalN2}</option>
              <option value="Pass JLPT N1">{T.goalN1}</option>
              <option value="Get a job in Japan">{T.goalJob}</option>
              <option value="Travel to Japan">{T.goalTravel}</option>
              <option value="Study abroad in Japan">{T.goalStudyAbroad}</option>
              <option value="Daily conversation">{T.goalConversation}</option>
              <option value="Other">{T.goalOther}</option>
            </select>
            {isOther && (
              <div style={{ marginTop:8 }}>
                <label style={{ ...S.label, marginBottom:4 }}>{T.whatDoYouWantToStudy}</label>
                <input value={form.customGoal} onChange={e=>set("customGoal",e.target.value)} placeholder={T.customGoalPlaceholder} style={S.input}/>
              </div>
            )}
          </div>

          <div>
            <label style={S.label}>{T.whenAchieve}</label>
            <select value={form.timeline} onChange={e=>set("timeline",e.target.value)} style={S.select}>
              <option value="">{T.selectTimeline}</option>
              <option value="Less than 6 months">{T.lessThan6}</option>
              <option value="Within 1 year">{T.within1}</option>
              <option value="2-3 years">{T.twoThreeYears}</option>
              <option value="Over 3 years">{T.over3}</option>
            </select>
          </div>

          {/* JLPT Level */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <label style={{ ...S.label, marginBottom:0 }}>{T.currentJlpt}</label>
              {initialJlpt && <span style={{ color:"#64748b", fontSize:10 }}>{T.autoFilled}</span>}
            </div>
            {initialJlpt && <p style={{ color:"#64748b", fontSize:11, marginBottom:6 }}>{T.changeLevel}</p>}
            <select value={form.jlpt} onChange={e=>set("jlpt",e.target.value)} style={S.select}>
              <option value="">{T.selectLevel}</option>
              <option value="Beginner">{T.beginner}</option>
              <option value="N5">N5</option><option value="N4">N4</option>
              <option value="N3">N3</option><option value="N2">N2</option><option value="N1">N1</option>
            </select>
          </div>

          <div>
            <label style={S.label}>{T.studyTimePerDay}</label>
            <select value={form.hoursPerDay} onChange={e=>set("hoursPerDay",e.target.value)} style={S.select}>
              <option value="">{T.selectHours}</option>
              <option value="Less than 1 hour">{T.lessThan1h}</option>
              <option value="1-2 hours">{T.oneTwo}</option>
              <option value="2-3 hours">{T.twoThree}</option>
              <option value="3+ hours">{T.threePlus}</option>
            </select>
          </div>
          <div>
            <label style={S.label}>{T.daysPerWeek}</label>
            <select value={form.daysPerWeek} onChange={e=>set("daysPerWeek",e.target.value)} style={S.select}>
              <option value="">{T.selectDays}</option>
              <option value="1-2 days">{T.oneTwoDays}</option>
              <option value="3-4 days">{T.threeFourDays}</option>
              <option value="5-6 days">{T.fiveSixDays}</option>
              <option value="Every day">{T.everyDay}</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label style={S.label}>{T.whatStudySkills}</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {Object.keys(SKILL_LABELS).map(k => (
                <button key={k} onClick={()=>toggleSkill(k)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${form.skills.includes(k)?C.purpleLight:C.border}`, background:form.skills.includes(k)?"rgba(168,85,247,0.15)":C.card, color:form.skills.includes(k)?C.purpleLight:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {T[SKILL_LABEL_KEY[k]] || SKILL_LABELS[k]}
                </button>
              ))}
            </div>
            <p style={{ color:"#475569", fontSize:11, marginTop:6 }}>{T.writingNote}</p>
          </div>
        </div>

        {err && <p style={{ color:C.red, fontSize:12, margin:"12px 0 0", textAlign:"center" }}>{err}</p>}
        <button onClick={()=>{ if(!valid){setErr(T.fillRequired);return;} onSubmit({ ...form, displayGoal: isOther ? form.customGoal : form.goal }); }} style={{ ...S.btn, width:"100%", marginTop:20, background:valid?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:valid?"#fff":"#475569" }}>
          {initialForm ? T.saveChanges : T.buildPlan}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ form, onEdit }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [schedule, setSchedule] = useState(() => buildSchedule(form, getT(form?.preferredLang || "English")));
  const [milestones, setMilestones] = useState(() => buildMilestones(form));
  const [msDone, setMsDone] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [tab, setTab] = useState("schedule");
  const [weekTheme, setWeekTheme] = useState("");
  const [aiScheduleLoading, setAiScheduleLoading] = useState(false);
  const { currentWeek, totalWeeks } = getWeekInfo(form);

  const loadAISchedule = useCallback(async (forceRegen = false) => {
    setAiScheduleLoading(true);
    if (forceRegen) {
      // Clear cache for this week
      const hoursMap = { "Less than 1 hour": 45, "1–2 hours": 90, "2–3 hours": 150, "3+ hours": 180 };
      const daysMap  = { "1–2 days": 2, "3–4 days": 4, "5–6 days": 5, "Every day": 7 };
      const cacheKey = `${form.email || form.name}_w${currentWeek}_${form.jlpt}_${(form.skills||[]).join("")}_${form.preferredLang || "English"}`;
      try { localStorage.removeItem(`gaku_sched_${cacheKey}`); } catch {}
      delete AI_SCHEDULE_CACHE[cacheKey];
    }
    const result = await buildAIWeeklySchedule(form, currentWeek, totalWeeks);
    if (result && result.schedule) {
      // Merge done state from current schedule
      const merged = {};
      const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
      WEEKDAYS.forEach(day => {
        merged[day] = (result.schedule[day] || [{ task: T.restDay || "Rest day 🌸", done: false, rest: true }]);
      });
      setSchedule(merged);
      setWeekTheme(result.weekTheme || "");
    }
    setAiScheduleLoading(false);
  }, [form, currentWeek, totalWeeks, T]);

  // ── GAKU Extension: listen for words sent from Chrome extension ───────────────────────
  useEffect(() => {
    // Sync current folders to chrome.storage.local for GAKU Reader extension
    try {
      const vocabInit = loadVocabData();
      const folderNames = ["Your Vocabulary", ...vocabInit.folders.map(f => f.name).filter(Boolean)];
      if (window.chrome?.storage?.local) {
        window.chrome.storage.local.set({ gaku_folders: folderNames });
      }
    } catch {}

    const handleExtMessage = (e) => {
      if (e.source !== window) return;
      if (!e.data || e.data.type !== "GAKU_ADD_WORD") return;
      const { word, reading, meaning, partOfSpeech, jlpt, example, example_translated, tip } = e.data.payload || {};
      if (!word) return;
      const data = loadVocabData();
      const folder = e.data.payload.folder || "GAKU Extension";
      const newCard = {
        word, reading: reading || "", jlpt: jlpt || "",
        partOfSpeech: partOfSpeech || "", meaning: meaning || "",
        meaningNative: "", example: example || "", example_translated: example_translated || "",
        tip: tip || "", imageQuery: word, imageDesc: "",
        folder, addedAt: Date.now()
      };
      if (!data.cards.find(c => c.word === word && c.folder === folder)) {
        if (folder !== "Your Vocabulary" && !data.folders.find(f=>f===folder||(f&&f.name===folder))) data.folders.push({ name: folder, createdAt: new Date().toISOString() });
        data.cards.push(newCard);
        saveVocabData(data);
      }
      setTab("vocabulary");
      window.dispatchEvent(new CustomEvent("gaku_vocab_updated"));
    };
    window.addEventListener("message", handleExtMessage);
    return () => window.removeEventListener("message", handleExtMessage);
  }, []);

  // Re-build schedule & translate milestones when T loads (for non-static languages)
  useEffect(() => {
    loadAISchedule(false);
  }, [form]);

  // Fallback: also rebuild static schedule while AI loads
  useEffect(() => {
    if (!aiScheduleLoading) return;
    setSchedule(buildSchedule(form, T));
  }, [T]);

  useEffect(() => {
    const lang = form?.preferredLang || "English";
    const base = buildMilestones(form);
    if (lang === "English") {
      setMilestones(base);
    } else {
      // Always translate milestone text via AI for any non-English language
      translateMilestonesAI(base, lang).then(setMilestones);
    }
  }, [form]);

  const toggleTask = useCallback((day, idx) => {
    setSchedule(prev => ({ ...prev, [day]: prev[day].map((t,i) => i===idx ? {...t,done:!t.done} : t) }));
  }, []);

  const totalTasks = Object.values(schedule).flat().filter(t=>!t.rest).length;
  const doneTasks = Object.values(schedule).flat().filter(t=>t.done&&!t.rest).length;
  const progress = totalTasks ? Math.round(doneTasks/totalTasks*100) : 0;
  const selectedResources = (form.skills||[]).flatMap(s => (RESOURCES[s]||[]).map(r=>({...r,skill:s})));

  const DAY_KEYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  const WEEKDAY_EN = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const isTranslating = T._loading;

  const TABS = [
    { id:"schedule",   label: T.tabSchedule },
    { id:"practice",   label: T.tabPractice },
    { id:"vocabulary", label: T.tabVocabulary },
    { id:"resources",  label: T.tabResources },
    { id:"milestones", label: T.tabMilestones },
  ];

  return (
    <div style={{ ...S.page, paddingBottom:60 }}>
      {showHelp && <HelpModal onClose={()=>setShowHelp(false)} form={form} />}

      <div style={{ background:"rgba(10,15,30,0.95)", borderBottom:`1px solid ${C.border}`, padding:"14px 20px", position:"sticky", top:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ color:C.purpleLight, fontSize:10, fontWeight:700, letterSpacing:2, margin:0 }}>{T.gakuSelfStudy}</p>
          <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:800, margin:0 }}>{form.name}'s {T.studyPlan}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowHelp(true)} style={{ ...S.btn, padding:"8px 14px", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", fontSize:12 }}>{T.help}</button>
          <button onClick={onEdit} style={{ ...S.btn, padding:"8px 14px", background:C.card, color:"#94a3b8", border:`1px solid ${C.border}`, fontSize:12 }}>{T.editProfile}</button>
        </div>
      </div>

      {isTranslating && (
        <div style={{ background:"rgba(168,85,247,0.15)", borderBottom:`1px solid rgba(168,85,247,0.3)`, padding:"8px 20px", textAlign:"center" }}>
          <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:0 }}>
            🌐 Translating UI into {form.preferredLang}...
          </p>
        </div>
      )}
      <div style={{ maxWidth:600, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ ...S.card, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:0 }}>{T.weeklyProgress}</p>
            <p style={{ color:C.purpleLight, fontSize:13, fontWeight:800, margin:0 }}>{doneTasks}/{totalTasks} · {progress}%</p>
          </div>
          <div style={{ background:C.border, borderRadius:99, height:8 }}>
            <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${C.purple},${C.purpleLight})`, borderRadius:99, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>🎯 {form.displayGoal||form.goal}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>📅 {form.timeline}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>📊 {form.jlpt}</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>🌐 {form.preferredLang}</p>
          </div>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${tab===t.id?C.purpleLight:C.border}`, background:tab===t.id?"rgba(168,85,247,0.15)":C.card, color:tab===t.id?C.purpleLight:"#64748b", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab==="schedule" && (
          <div>
            {/* Week progress banner */}
            <div style={{ ...S.card, marginBottom:12, background:"linear-gradient(135deg,rgba(139,92,246,0.12),rgba(6,182,212,0.08))", border:`1px solid rgba(139,92,246,0.25)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div>
                  <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, letterSpacing:1, margin:0 }}>📅 WEEK {currentWeek} / {totalWeeks}</p>
                  <p style={{ color:"#64748b", fontSize:11, margin:"2px 0 0" }}>{totalWeeks - currentWeek} {T.weeksRemaining} · {Math.round((currentWeek/totalWeeks)*100)}{T.percentComplete}</p>
                </div>
                <button
                  onClick={() => loadAISchedule(true)}
                  disabled={aiScheduleLoading}
                  style={{ ...S.btn, padding:"7px 12px", background:aiScheduleLoading?"rgba(139,92,246,0.1)":`linear-gradient(135deg,${C.purple},#9333ea)`, color:aiScheduleLoading?"#64748b":"#fff", border:`1px solid rgba(139,92,246,0.3)`, fontSize:11, cursor:aiScheduleLoading?"not-allowed":"pointer" }}>
                  {aiScheduleLoading ? "⏳ " + (T.generating || "Generating...") : T.refresh}
                </button>
              </div>
              {/* Progress bar */}
              <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.round((currentWeek/totalWeeks)*100)}%`, background:`linear-gradient(90deg,${C.purple},${C.teal})`, borderRadius:99, transition:"width 0.6s ease" }} />
              </div>
              {weekTheme && !aiScheduleLoading && (
                <p style={{ color:"#94a3b8", fontSize:12, margin:"10px 0 0", fontStyle:"italic", lineHeight:1.5 }}>🎯 {weekTheme}</p>
              )}
            </div>

            <div style={{ ...S.card }}>
              <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>
                {aiScheduleLoading ? T.aiBuilding : T.yourWeeklySchedule}
              </p>
              {aiScheduleLoading ? (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>🤖</div>
                  <p style={{ color:"#64748b", fontSize:13 }}>{T.personalizing}</p>
                </div>
              ) : (
                WEEKDAY_EN.map((day, di) => {
                  const tasks = schedule[day] || [];
                  const dayLabel = T[DAY_KEYS[di]] || day.toUpperCase();
                  return (
                    <div key={day} style={{ marginBottom:16 }}>
                      <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, letterSpacing:1, borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:8 }}>{dayLabel}</p>
                      {tasks.map((task, idx) => task.rest ? (
                        <p key={idx} style={{ color:"#334155", fontSize:13, fontStyle:"italic" }}>{T.restDay || "Rest day 🌸"}</p>
                      ) : (
                        <div key={idx} onClick={()=>toggleTask(day,idx)} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:10, background:task.done?"rgba(34,197,94,0.06)":C.card, border:`1px solid ${task.done?"rgba(34,197,94,0.2)":C.border}`, marginBottom:6, cursor:"pointer", alignItems:"flex-start" }}>
                          <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${task.done?C.green:C.border}`, background:task.done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                            {task.done && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                          </div>
                          <p style={{ color:task.done?"#64748b":"#cbd5e1", fontSize:13, margin:0, lineHeight:1.6, textDecoration:task.done?"line-through":"none" }}>{task.task}</p>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab==="practice" && <PracticeSet form={form} />}

        {tab==="vocabulary" && <VocabBuilder form={form} />}

        {tab==="resources" && (
          <div>
            {(LEVEL_RESOURCES[form.jlpt] || []).length > 0 && (
              <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid ${C.teal}` }}>
                <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T.recommendedForLevel}</p>
                <p style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>{T.curatedFor} {form.jlpt}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {(LEVEL_RESOURCES[form.jlpt] || []).map((r,i) => (
                    <div key={i} style={{ background:"rgba(6,182,212,0.04)", borderRadius:12, border:`1px solid rgba(6,182,212,0.15)`, padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{r.name}</p>
                        <span style={{ color:C.teal, fontSize:10, fontWeight:700, background:"rgba(6,182,212,0.1)", padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", marginLeft:8 }}>{T[r.levelKey]}</span>
                      </div>
                      <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{T[r.descKey]}</p>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 12px", marginBottom:10 }}>
                        {[[T.vocab,r.skills.vocab],[T.grammar,r.skills.grammar],[T.reading,r.skills.reading],[T.speaking,r.skills.speaking],[T.listening,r.skills.listening]].map(([label,val])=>(
                          <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <span style={{ color:"#64748b", fontSize:10, minWidth:60 }}>{label}</span>
                            <span style={{ fontSize:10, letterSpacing:1 }}>{"★".repeat(val)}{"☆".repeat(5-val)}</span>
                          </div>
                        ))}
                      </div>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"9px", background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                        → {T.openResource} {r.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ ...S.card }}>
              <p style={{ color:C.amber, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T.yourResources}</p>
              <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>{T.curatedForLevel} {form.jlpt}, {T.skills} {(form.skills||[]).map(s=>T[SKILL_LABEL_KEY[s]]||SKILL_LABELS[s]).join(", ")}</p>
              {selectedResources.length === 0 && <p style={{ color:"#64748b", fontSize:13 }}>{T.noResources}</p>}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {selectedResources.map((r,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, border:`1px solid ${C.border}`, padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{r.name}</p>
                      <span style={{ color:r.free?C.green:C.amber, fontSize:10, fontWeight:700, background:r.free?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)", padding:"2px 8px", borderRadius:99 }}>{r.free ? T.free : T.paid}</span>
                    </div>
                    <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>{T[SKILL_LABEL_KEY[r.skill]]||SKILL_LABELS[r.skill]}</p>
                    <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{r.desc}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"9px", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                      → {T.openResource} {r.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="milestones" && (
          <div style={{ ...S.card }}>
            <p style={{ color:C.red, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>{T.yourGoalRoadmap}</p>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:16 }}>{T.levelToGoal}: {form.jlpt} → {T.goal}: {form.displayGoal||form.goal}</p>
            {milestones.map((m,i) => (
              <div key={i} onClick={()=>setMsDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} style={{ display:"flex", gap:12, padding:"12px 14px", borderRadius:12, background:msDone.includes(i)?"rgba(34,197,94,0.06)":C.card, border:`1px solid ${msDone.includes(i)?"rgba(34,197,94,0.2)":C.border}`, marginBottom:8, cursor:"pointer", alignItems:"flex-start" }}>
                <div style={{ width:24, height:24, borderRadius:8, border:`2px solid ${msDone.includes(i)?C.green:C.border}`, background:msDone.includes(i)?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {msDone.includes(i)?<span style={{ color:"#fff", fontWeight:900, fontSize:12 }}>✓</span>:<span style={{ color:"#475569", fontWeight:700, fontSize:11 }}>{i+1}</span>}
                </div>
                <p style={{ color:msDone.includes(i)?"#64748b":"#cbd5e1", fontSize:13, margin:0, lineHeight:1.6, textDecoration:msDone.includes(i)?"line-through":"none" }}>{m}</p>
              </div>
            ))}
            <div style={{ marginTop:20, padding:"16px", background:"rgba(168,85,247,0.06)", borderRadius:12, textAlign:"center", border:`1px solid rgba(168,85,247,0.2)` }}>
              <p style={{ fontSize:20, margin:"0 0 8px" }}>🌸</p>
              <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 6px" }}>{T.youveGotThis}</p>
              <p style={{ color:"#64748b", fontSize:12, lineHeight:1.7, margin:0 }}>{T.motivationText}</p>
            </div>
            <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"13px", background:`linear-gradient(135deg,${C.amber},#d97706)`, color:"#fff", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", marginTop:16 }}>
              {T.bookLesson}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────────
export default function GakuApp({ onBack, initialJlpt }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem("gaku_form"); if(saved) setForm(JSON.parse(saved)); } catch {}
  }, []);
  const handleSubmit = (f) => {
    // Preserve planStartDate from existing form (only set it once, on first save)
    const startDate = (form && form.planStartDate) ? form.planStartDate : new Date().toISOString();
    const saved = { ...f, planStartDate: startDate };
    setForm(saved);
    setEditing(false);
    try { localStorage.setItem("gaku_form", JSON.stringify(saved)); } catch {}
  };
  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);
  if (!form || editing) return <FormScreen onSubmit={handleSubmit} onBack={onBack} onCancel={form ? handleCancelEdit : undefined} initialJlpt={initialJlpt} initialForm={form || undefined} />;
  return <Dashboard form={form} onEdit={handleEdit} />;
}
