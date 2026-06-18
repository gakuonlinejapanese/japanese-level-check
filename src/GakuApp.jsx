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
  select: { width:"100%", padding:"12px 14px", background:"#0f172a", border:`1.5px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
  btn: { padding:"13px 20px", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" },
  label: { display:"block", color:"#64748b", fontSize:11, fontWeight:700, marginBottom:5, letterSpacing:1 },
  input: { width:"100%", padding:"12px 14px", background:"#0f172a", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box" },
};

// ─── CLT RESOURCES ─────────────────────────────────────────────────────────────
const RESOURCES = {
  pronunciation: [
    { name:"Anki (Japanese Decks)", desc:"Build phonetic recognition with audio flashcards. CLT: hear and repeat.", url:"https://ankiweb.net/shared/decks?search=japanese", free:true },
  ],
  listening: [
    { name:"NHK World Lesson", desc:"Authentic NHK audio lessons. CLT input at natural pace.", url:"https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/", free:true },
    { name:"Erin ga Chosen", desc:"Drama-based listening. Real conversational Japanese in context.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Structured listening practice. Watch and shadow for CLT output.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
  ],
  conversation: [
    { name:"NHK Japan — Learn Japanese", desc:"CLT-based conversational Japanese. Real-life scenario practice.", url:"https://www3.nhk.or.jp/nhkworld/en/learnjapanese/", free:true },
    { name:"Erin ga Chosen", desc:"Interactive drama-based conversation. Respond to real situations.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true },
    { name:"Marugoto Online", desc:"Japan Foundation's task-based communicative course. A1–B1.", url:"https://a1.marugotoweb.jp/en/", free:true },
    { name:"JapanesePod101 (YouTube)", desc:"Conversational drills and cultural context. Shadow and repeat.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true },
  ],
  jlpt: [
    { name:"Japanese Test 4 You", desc:"Full JLPT mock tests N5–N1. Track weak areas with analytics.", url:"https://japanesetest4you.com/", free:true },
  ],
  reading: [
    { name:"Tadoku (Free Readers)", desc:"Graded reading from Level 0–4. CLT: read then discuss.", url:"https://tadoku.org/japanese/book-search/?level=&series=&kw=&order=register_desc", free:true },
    { name:"NHK Web Easy", desc:"Real Japanese news simplified. Perfect A2–B1 reading input.", url:"https://news.web.nhk/news/easy/", free:true },
    { name:"FluencyDrop Stories", desc:"Authentic short stories with audio. Build reading fluency.", url:"https://fluencydrop.com/stories/japanese", free:true },
  ],
  kanji: [
    { name:"Nihonten AI (Bilingual Kanji)", desc:"AI-powered personalized kanji with bilingual translation context.", url:"https://nihonten.ai/", free:false },
  ],
  grammar: [
    { name:"Imabi", desc:"The most comprehensive free Japanese grammar reference online.", url:"https://imabi.org/", free:true },
  ],
};

// Level-based recommended resources
const LEVEL_RESOURCES = {
  "Beginner": [
    { name:"Japanese with Shun", desc:"初級向けYouTubeチャンネル。聞き取り練習に最適。", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, level:"初級 (N5〜N4)", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", desc:"国際交流基金の初中級コース。コミュニカティブな学習法。", url:"https://marugotoweb.jp/ja/", free:true, level:"初中級 (N4〜N3)", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
  ],
  "N5": [
    { name:"Japanese with Shun", desc:"初級向けYouTubeチャンネル。聞き取り練習に最適。", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, level:"初級 (N5〜N4)", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", desc:"国際交流基金の初中級コース。コミュニカティブな学習法。", url:"https://marugotoweb.jp/ja/", free:true, level:"初中級 (N4〜N3)", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", desc:"日常会話・スラング・文化を楽しく学べるYouTubeチャンネル。", url:"https://www.youtube.com/@Onomappu", free:true, level:"初中級 (N4〜N3)", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
  ],
  "N4": [
    { name:"Marugoto Web", desc:"国際交流基金の初中級コース。コミュニカティブな学習法。", url:"https://marugotoweb.jp/ja/", free:true, level:"初中級 (N4〜N3)", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", desc:"日常会話・スラング・文化を楽しく学べるYouTubeチャンネル。", url:"https://www.youtube.com/@Onomappu", free:true, level:"初中級 (N4〜N3)", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
    { name:"Nihongo con Teppei", desc:"中級者向けポッドキャスト。ナチュラルスピードの日本語が聞ける。", url:"https://nihongoconteppei.com", free:true, level:"中級 (N3〜N2)", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
  ],
  "N3": [
    { name:"Nihongo con Teppei", desc:"中級者向けポッドキャスト。ナチュラルスピードの日本語が聞ける。", url:"https://nihongoconteppei.com", free:true, level:"中級 (N3〜N2)", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"YUYU Japanese Podcast", desc:"中級者向けYouTubeポッドキャスト。自然な日本語表現が学べる。", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, level:"中級 (N3〜N2)", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Sambon Juku", desc:"中上級向け文法・語彙・JLPT対策チャンネル。", url:"https://www.youtube.com/@SambonJuku", free:true, level:"中上級 (N2〜N1)", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
  ],
  "N2": [
    { name:"Sambon Juku", desc:"中上級向け文法・語彙・JLPT対策チャンネル。", url:"https://www.youtube.com/@SambonJuku", free:true, level:"中上級 (N2〜N1)", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
    { name:"YUYU Japanese Podcast", desc:"中級者向けYouTubeポッドキャスト。自然な日本語表現が学べる。", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, level:"中級 (N3〜N2)", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
  ],
  "N1": [
    { name:"Sambon Juku", desc:"中上級向け文法・語彙・JLPT対策チャンネル。", url:"https://www.youtube.com/@SambonJuku", free:true, level:"中上級 (N2〜N1)", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
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
    daysPerWeek: "DAYS PER WEEK *",
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
    daysPerWeek: "JOURS PAR SEMAINE *",
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
    daysPerWeek: "DÍAS POR SEMANA *",
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
    daysPerWeek: "DIAS POR SEMANA *",
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
    daysPerWeek: "TAGE PRO WOCHE *",
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
  return { ...result, _loading: transLoading && !staticT && !aiT };
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
function saveVocabData(data) {
  try { localStorage.setItem("gaku_vocab", JSON.stringify(data)); } catch {}
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
function WordDetailCard({ card, onSave, onBack, form, prefLang }) {
  const [saveModal, setSaveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [saveMode, setSaveMode] = useState(""); // "addFolder"|"newFolder"|"yourVocab"
  const [toast, setToast] = useState("");
  const [imgError, setImgError] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const searchImage = async () => {
    setImgLoading(true);
    setImgError(false);
    const nextIndex = imgIndex + 1;
    setImgIndex(nextIndex);
    try {
      const query = card.imageQuery || card.word;
      const offset = nextIndex - 1;
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      const thumbUrl = pages[0]?.imageinfo?.[0]?.thumburl;
      if (thumbUrl) {
        setImgSrc(thumbUrl);
        setImgError(false);
      } else {
        // Fallback: try with Japanese word directly
        const url2 = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(card.word)}&gsrlimit=1&gsroffset=${offset}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        const pages2 = Object.values(data2?.query?.pages || {});
        const thumb2 = pages2[0]?.imageinfo?.[0]?.thumburl;
        if (thumb2) { setImgSrc(thumb2); setImgError(false); }
        else { setImgError(true); }
      }
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
        <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:0 }}>{card.meaning}</p>
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
        <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.9, margin:"0 0 6px" }}>{card.example}</p>
        <p style={{ color:"#64748b", fontSize:13, margin:0, fontStyle:"italic" }}>{card.example_translated}</p>
      </div>

      {/* ── IMAGE ASSOCIATION ── */}
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <p style={{ color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, margin:0 }}>🖼 IMAGE ASSOCIATION</p>
          <button
            onClick={searchImage}
            disabled={imgLoading}
            style={{ fontSize:11, color:C.teal, fontWeight:700, background:"rgba(6,182,212,0.1)", padding:"5px 12px", borderRadius:8, border:`1px solid rgba(6,182,212,0.2)`, cursor:"pointer" }}
          >
            {imgLoading ? "..." : "🔍 SEARCH"}
          </button>
        </div>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={card.word}
            onError={()=>setImgError(true)}
            style={{ width:"100%", borderRadius:10, objectFit:"cover", height:200, display:"block" }}
          />
        ) : (
          <div
            onClick={searchImage}
            style={{ width:"100%", height:160, borderRadius:10, background:"rgba(6,182,212,0.06)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:`1px dashed rgba(6,182,212,0.3)`, cursor:"pointer" }}
          >
            <span style={{ color:C.teal, fontSize:32, marginBottom:8 }}>🔍</span>
            <span style={{ color:C.teal, fontSize:13, fontWeight:700 }}>「{card.word}」の画像を検索</span>
            <span style={{ color:"#475569", fontSize:11, marginTop:4 }}>SEARCHボタンを押してください</span>
          </div>
        )}
        {card.imageDesc && <p style={{ color:"#94a3b8", fontSize:12, margin:"8px 0 0", lineHeight:1.6 }}>{card.imageDesc}</p>}
      </div>

      {/* ── WEBLIO DICTIONARY LINK ── */}
      <a
        href={`https://www.weblio.jp/content/${encodeURIComponent(card.word)}`}
        target="_blank" rel="noopener noreferrer"
        style={{ textDecoration:"none", display:"block", marginBottom:12 }}
      >
        <div style={{ ...S.card, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderLeft:`3px solid #e85d04` }}>
          <div>
            <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, margin:"0 0 2px" }}>📖 Weblio辞書で「{card.word}」を調べる</p>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>日本語辞書・英和辞典・例文を確認</p>
          </div>
          <span style={{ color:"#e85d04", fontSize:18 }}>→</span>
        </div>
      </a>

      {/* ── CLT TIP ── */}
      {card.tip && (
        <div style={{ ...S.card, marginBottom:12, borderLeft:`3px solid ${C.green}` }}>
          <p style={{ color:C.green, fontSize:11, fontWeight:700, letterSpacing:1, margin:"0 0 6px" }}>💬 CLT USAGE TIP</p>
          <p style={{ color:"#cbd5e1", fontSize:13, margin:0, lineHeight:1.7 }}>{card.tip}</p>
        </div>
      )}

      {/* ── SAVE BUTTON ── */}
      <button onClick={()=>setSaveModal(true)} style={{ ...S.btn, width:"100%", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", fontSize:15, marginTop:4, marginBottom:32 }}>
        💾 Save Word
      </button>

      {/* ── SAVE MODAL ── */}
      {saveModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000, padding:"0 0 0 0" }} onClick={()=>{setSaveModal(false);setSaveMode("");}}>
          <div style={{ background:"#0f172a", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:520, border:`1px solid ${C.border}` }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, background:"#334155", borderRadius:99, margin:"0 auto 20px" }} />

            {saveMode === "" && (
              <>
                <p style={{ color:"#f1f5f9", fontSize:16, fontWeight:800, margin:"0 0 18px" }}>Save "{card.word}"</p>
                {[
                  { id:"yourVocab", icon:"📚", label:"Add to Your Vocabulary", sub:"Your default vocabulary list" },
                  { id:"addFolder", icon:"📁", label:"Add to Folder", sub:"Choose an existing folder" },
                  { id:"newFolder", icon:"✨", label:"Create New Folder", sub:"Make a new folder for this word" },
                ].map(opt => (
                  <button key={opt.id} onClick={()=>{ if(opt.id==="yourVocab"){doSave("Your Vocabulary");}else{setSaveMode(opt.id);} }} style={{ display:"flex", alignItems:"center", gap:14, width:"100%", padding:"14px 16px", borderRadius:12, background:C.card, border:`1px solid ${C.border}`, color:"#f1f5f9", textAlign:"left", cursor:"pointer", marginBottom:10 }}>
                    <span style={{ fontSize:22 }}>{opt.icon}</span>
                    <div>
                      <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{opt.label}</p>
                      <p style={{ margin:0, fontSize:12, color:"#64748b" }}>{opt.sub}</p>
                    </div>
                  </button>
                ))}
                <button onClick={()=>{setSaveModal(false);setSaveMode("");}} style={{ width:"100%", padding:"12px", borderRadius:10, background:"none", border:`1px solid ${C.border}`, color:"#64748b", fontSize:13, cursor:"pointer", marginTop:4 }}>Cancel</button>
              </>
            )}

            {saveMode === "addFolder" && (() => {
              const data = loadVocabData();
              const folders = [{ name:"Your Vocabulary" }, ...data.folders];
              return (
                <>
                  <button onClick={()=>setSaveMode("")} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
                  <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:"0 0 14px" }}>Choose a folder</p>
                  {folders.map(f => (
                    <button key={f.name} onClick={()=>setSelectedFolder(f.name)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"13px 16px", borderRadius:12, background:selectedFolder===f.name?"rgba(168,85,247,0.15)":C.card, border:`1.5px solid ${selectedFolder===f.name?C.purpleLight:C.border}`, color:"#f1f5f9", textAlign:"left", cursor:"pointer", marginBottom:8 }}>
                      <span style={{ fontSize:14, fontWeight:selectedFolder===f.name?700:400 }}>📁 {f.name}</span>
                      {selectedFolder===f.name && <span style={{ color:C.purpleLight, fontSize:16 }}>✓</span>}
                    </button>
                  ))}
                  {folders.length === 1 && <p style={{ color:"#475569", fontSize:12, textAlign:"center", margin:"8px 0" }}>No custom folders yet — create one first!</p>}
                  <button onClick={()=>{ if(selectedFolder) doSave(selectedFolder); }} disabled={!selectedFolder} style={{ ...S.btn, width:"100%", marginTop:8, background:selectedFolder?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:selectedFolder?"#fff":"#475569" }}>
                    Save to "{selectedFolder || "..."}"
                  </button>
                </>
              );
            })()}

            {saveMode === "newFolder" && (
              <>
                <button onClick={()=>setSaveMode("")} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
                <p style={{ color:"#f1f5f9", fontSize:15, fontWeight:800, margin:"0 0 14px" }}>Create New Folder</p>
                <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="Folder name (e.g. かおりさん 授業)" style={{ ...S.input, marginBottom:12 }} />
                <button onClick={()=>{ if(newFolderName.trim()) doSave(newFolderName.trim()); }} disabled={!newFolderName.trim()} style={{ ...S.btn, width:"100%", background:newFolderName.trim()?`linear-gradient(135deg,${C.green},#16a34a)`:"#1e293b", color:newFolderName.trim()?"#fff":"#475569" }}>
                  Create & Save
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
function FlashcardView({ cards, onBack }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
      <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
        <p style={{ color:"#64748b", fontSize:32, margin:"0 0 12px" }}>📭</p>
        <p style={{ color:"#94a3b8", fontSize:14 }}>No saved words yet. Search and save words first!</p>
      </div>
    </div>
  );
  const card = cards[idx];
  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
      <p style={{ color:"#64748b", fontSize:12, textAlign:"center", margin:"0 0 16px" }}>{idx+1} / {cards.length}</p>
      <div onClick={()=>setFlipped(f=>!f)} style={{ ...S.card, minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", textAlign:"center", borderLeft:`4px solid ${C.teal}`, marginBottom:16 }}>
        {!flipped ? (
          <>
            <p style={{ color:"#f1f5f9", fontSize:36, fontWeight:900, margin:"0 0 8px" }}>{card.word}</p>
            <p style={{ color:C.teal, fontSize:16, margin:"0 0 12px" }}>{card.reading}</p>
            <p style={{ color:"#475569", fontSize:12 }}>Tap to reveal</p>
          </>
        ) : (
          <>
            <p style={{ color:"#f1f5f9", fontSize:20, fontWeight:700, margin:"0 0 8px", lineHeight:1.5 }}>{card.meaning}</p>
            {card.meaningNative && <p style={{ color:"#64748b", fontSize:13, margin:"0 0 8px" }}>{card.meaningNative}</p>}
            <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.7, maxWidth:280, margin:"0 0 10px" }}>{card.example}</p>
            {card.example_translated && <p style={{ color:"#475569", fontSize:12, fontStyle:"italic", maxWidth:280, margin:"0 0 10px" }}>{card.example_translated}</p>}
            <button onClick={e=>{e.stopPropagation();speakJapanese(card.example);}} style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, color:C.amber, fontSize:13, padding:"5px 14px", cursor:"pointer" }}>🔊 例文を聞く</button>
          </>
        )}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>speakJapanese(card.word)} style={{ flex:1, ...S.btn, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal }}>🔊 Listen</button>
        <button onClick={()=>{ setFlipped(false); setIdx(i=>(i-1+cards.length)%cards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>←</button>
        <button onClick={()=>{ setFlipped(false); setIdx(i=>(i+1)%cards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>→</button>
      </div>
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
- example_translated: translation of example sentence in ${form.preferredLang || "English"}
- tip: one CLT tip for using this word in real conversation
- imageQuery: 2-3 English words to search Google Images for a visual that represents this word's meaning
- imageDesc: a one-sentence visual description to help memorize the word

Respond ONLY in valid JSON array format (no markdown, no backticks, no preamble):
[{"word":"","reading":"","jlpt":"","partOfSpeech":"","meaning":"","meaningNative":"","example":"","example_translated":"","tip":"","imageQuery":"","imageDesc":""}]` }]
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
  if (vocabView === "flashcard") return <FlashcardView cards={vocabData.cards} onBack={()=>setVocabView("main")} />;

  // ── MAIN VIEW ──
  return (
    <div>
      {/* ── TOP ACTION BAR ── */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button onClick={()=>setVocabView("library")} style={{ flex:1, ...S.btn, background:C.card, border:`1.5px solid ${C.border}`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>📚 Library</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:"#64748b" }}>Your Vocabulary · {totalSaved} saved</p>
        </button>
        <button onClick={()=>setVocabView("wordSearch")} style={{ flex:1, ...S.btn, background:`linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.15))`, border:`1.5px solid rgba(168,85,247,0.3)`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>🃏 Word Cards</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:C.purpleLight }}>Search & create cards</p>
        </button>
        <button onClick={()=>setVocabView("flashcard")} style={{ flex:1, ...S.btn, background:`linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,163,74,0.1))`, border:`1.5px solid rgba(34,197,94,0.3)`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>🎴 Flashcards</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:C.green }}>Review saved words</p>
        </button>
      </div>

      {/* ── VOCABULARY BUILDER (quick find) ── */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>📚 VOCABULARY BUILDER</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>トピックを入力すると、日本語辞書から関連単語を表示します（English or 日本語OK）</p>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findWords()} placeholder="e.g. food, travel, emotions..." style={{ ...S.input, flex:1 }} />
          <button onClick={findWords} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#475569", whiteSpace:"nowrap", padding:"12px 18px" }}>
            {loading?"...":"Find Words"}
          </button>
        </div>
        {findError && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
            <p style={{ color:C.red, fontSize:12, margin:0, flex:1 }}>{findError}</p>
            {!findError.includes("⏳ Rate") && (
              <button onClick={()=>findWords(0)} style={{ ...S.btn, padding:"6px 12px", fontSize:11, background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff" }}>Retry</button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <p style={{ color:C.teal, fontSize:24, margin:"0 0 8px" }}>🔍</p>
          <p style={{ color:"#64748b", fontSize:13 }}>日本語辞書を検索中...</p>
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
                <button onClick={e=>{e.stopPropagation();speakJapanese(w.word);}} title="単語を発音" style={{ width:40, height:40, borderRadius:10, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:18, cursor:"pointer", flexShrink:0, marginLeft:8, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
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
                  <button onClick={e=>{e.stopPropagation();speakJapanese(w.example);}} title="例文を発音" style={{ width:34, height:34, borderRadius:8, background:"rgba(245,158,11,0.1)", border:`1px solid rgba(245,158,11,0.25)`, color:C.amber, fontSize:15, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>🔊</button>
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
                  📖 Weblio辞書
                </a>
                <a
                  href={`https://www.bing.com/images/search?q=${encodeURIComponent(w.word + " " + (w.imageQuery || ""))}&FORM=IRSBH0`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e=>e.stopPropagation()}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"7px 10px", borderRadius:8, background:"rgba(6,182,212,0.08)", border:`1px solid rgba(6,182,212,0.2)`, color:C.teal, fontSize:11, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}
                >
                  🖼 Google画像
                </a>
                <button
                  onClick={()=>{setSelectedWord(w);setVocabView("wordDetail");}}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"7px 10px", borderRadius:8, background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.25)", color:C.purpleLight, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}
                >
                  🃏 詳細カード
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
function PracticeSet({ form }) {
  const [items, setItems] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const skills = form.skills || [];
  const skillLabels = skills.map(s => SKILL_LABELS[s] || s).join(", ");

  const generate = async () => {
    setLoading(true); setError(""); setItems([]); setRevealed({});
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`You are a Japanese teacher using CLT (Communicative Language Teaching). The student is level ${form.jlpt}, goal: ${form.displayGoal||form.goal}.
The student selected ONLY these study skills: ${skillLabels || "general practice"}.
Create a "Practice Set" of 6 short exercises focused ONLY on these selected skills (do NOT include writing/composition exercises unless "Writing" is one of the selected skills).
For each exercise, include:
- skill: which skill it targets (must be one of: ${skills.join(", ")})
- type: a short label, e.g. "Listening cloze", "Conversation role-play", "Kanji recall", "Grammar pattern", "Reading comprehension", "JLPT-style question", "Pronunciation drill"
- prompt: the exercise text in Japanese (with English hint in parentheses if helpful)
- answer: the model answer or correct response
- tip: a one-sentence CLT tip for using this in real communication

Respond ONLY in this JSON format (no markdown, no backticks):
[{"skill":"","type":"","prompt":"","answer":"","tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setItems(parsed);
    } catch { setError("Could not generate a practice set right now. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🎯 PRACTICE SET</p>
        <p style={{ color:"#64748b", fontSize:12, marginBottom:14, lineHeight:1.7 }}>
          Generated from what you selected in <strong style={{ color:"#94a3b8" }}>"WHAT DO YOU WANT TO STUDY?"</strong>:{" "}
          {skills.length ? skills.map(s => SKILL_LABELS[s] || s).join(" · ") : "No skills selected — edit your profile to choose skills."}
        </p>
        <button onClick={generate} disabled={loading || skills.length===0} style={{ ...S.btn, width:"100%", background:skills.length?`linear-gradient(135deg,${C.purple},#9333ea)`:"#1e293b", color:skills.length?"#fff":"#475569" }}>
          {loading ? "Building your practice set...":"Generate Practice Set ✨"}
        </button>
        {error && <p style={{ color:C.red, fontSize:12, marginTop:10 }}>{error}</p>}
      </div>

      {items.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {items.map((it,i) => (
            <div key={i} style={{ ...S.card, borderLeft:`3px solid ${C.purpleLight}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:C.purpleLight, fontSize:11, fontWeight:700 }}>{SKILL_LABELS[it.skill] || it.skill}</span>
                <span style={{ color:"#64748b", fontSize:11 }}>{it.type}</span>
              </div>
              <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:"0 0 10px" }}>{it.prompt}</p>
              {revealed[i] ? (
                <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
                  <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>✅ ANSWER</p>
                  <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 6px" }}>{it.answer}</p>
                  {it.tip && <p style={{ color:"#94a3b8", fontSize:12, margin:0, fontStyle:"italic" }}>💬 {it.tip}</p>}
                </div>
              ) : (
                <button onClick={()=>setRevealed(r=>({...r,[i]:true}))} style={{ padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
                  Show answer
                </button>
              )}
            </div>
          ))}
        </div>
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
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500,
          messages:[{ role:"user", content:`You are a warm Japanese language coach using CLT.
Student: ${form.name}, Level: ${form.jlpt}, Goal: ${form.displayGoal||form.goal}, Skills: ${(form.skills||[]).join(", ")}
Today: Mood: ${mood}, Time: ${time} min, Energy: ${energy}
${wantsDifferent && differentText.trim() ? `IMPORTANT: Today the student specifically wants to do something different from their usual routine. What they want to do today: "${differentText.trim()}". Build today's suggestion AROUND this request, while still keeping it CLT-based and appropriate for their level.` : `Focus on skills the student selected: ${(form.skills||[]).join(", ")}.`}
Give a specific, encouraging suggestion for TODAY ONLY using CLT principles.
One concrete activity with a specific resource. Emojis. Under 120 words. English.` }]
        })
      });
      const d = await res.json();
      setResult(d.content?.map(c=>c.text||"").join("") || "Take it easy today! Review 5 words and watch one Japanese video. 🌸");
    } catch { setResult("Even 10 minutes counts! Review your saved vocabulary and practice one sentence aloud. 頑張って！🎌"); }
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
const LANGUAGES = [
  "English","Spanish","French","Portuguese","German","Italian","Chinese (Simplified)",
  "Chinese (Traditional)","Korean","Arabic","Hindi","Thai","Vietnamese","Indonesian","Malay",
  "Turkish","Russian","Polish","Dutch","Swedish","Norwegian","Danish","Finnish",
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

  // Re-build schedule & translate milestones when T loads (for non-static languages)
  useEffect(() => {
    setSchedule(buildSchedule(form, T));
  }, [T, form]);

  useEffect(() => {
    const lang = form?.preferredLang || "English";
    if (lang === "English" || UI_TRANSLATIONS[lang]) {
      // For static languages, we don't translate milestone text via AI (keep English for simplicity,
      // or add static translations below if needed — milestones are rebuilt with T for non-static langs)
      if (!UI_TRANSLATIONS[lang]) {
        const base = buildMilestones(form);
        translateMilestonesAI(base, lang).then(setMilestones);
      } else {
        setMilestones(buildMilestones(form));
      }
    } else {
      const base = buildMilestones(form);
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
          <div style={{ ...S.card }}>
            <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>{T.yourWeeklySchedule}</p>
            {WEEKDAY_EN.map((day, di) => {
              const tasks = schedule[day] || [];
              const dayLabel = T[DAY_KEYS[di]] || day.toUpperCase();
              return (
                <div key={day} style={{ marginBottom:16 }}>
                  <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, letterSpacing:1, borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:8 }}>{dayLabel}</p>
                  {tasks.map((task, idx) => task.rest ? (
                    <p key={idx} style={{ color:"#334155", fontSize:13, fontStyle:"italic" }}>{T.restDay}</p>
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
            })}
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
                        <span style={{ color:C.teal, fontSize:10, fontWeight:700, background:"rgba(6,182,212,0.1)", padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", marginLeft:8 }}>{r.level}</span>
                      </div>
                      <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{r.desc}</p>
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
  const handleSubmit = (f) => { setForm(f); setEditing(false); try { localStorage.setItem("gaku_form", JSON.stringify(f)); } catch {} };
  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);
  if (!form || editing) return <FormScreen onSubmit={handleSubmit} onBack={onBack} onCancel={form ? handleCancelEdit : undefined} initialJlpt={initialJlpt} initialForm={form || undefined} />;
  return <Dashboard form={form} onEdit={handleEdit} />;
}
