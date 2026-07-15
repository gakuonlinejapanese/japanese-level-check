import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase, getDeviceId, getDeviceLabel } from "./supabaseClient";

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
    { name:"Anki (Japanese Decks)", desc:"Build phonetic recognition with audio flashcards. CLT: hear and repeat.", descKey:"resAnkiPronDesc", url:"https://ankiweb.net/shared/decks?search=japanese", free:true, mode:"listening" },
    { name:"Japanese Ammo with Misa", desc:"Practical example sentences and pronunciation drills. CLT-focused.", descKey:"resMisaPronDesc", url:"https://www.youtube.com/@JapaneseAmmowithMisa", free:true, mode:"listening" },
    { name:"Onomappu", desc:"Japanese-only explanations. Comprehensible Input — CLT compatibility very high.", descKey:"resOnomappuPronDesc", url:"https://www.youtube.com/@Onomappu", free:true, mode:"listening" },
  ],
  listening: [
    { name:"NHK World Lesson", desc:"Authentic NHK audio lessons. CLT input at natural pace.", url:"https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/", free:true, mode:"listening" },
    { name:"Erin's Challenge", desc:"Drama-based listening with real-life scenarios and role-play. CLT compatibility extremely high.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true, mode:"listening" },
    { name:"JapanesePod101 (YouTube)", desc:"Structured listening practice. Watch and shadow for CLT output.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true, mode:"listening" },
    { name:"Nihongo con Teppei", desc:"Daily natural conversation podcast. Recommended by Japanese teachers worldwide.", url:"https://nihongoconteppei.com", free:true, mode:"listening" },
    { name:"YUYU Japanese Podcast", desc:"Natural speed, authentic materials. CLT-compatible listening at N3-N2.", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, mode:"listening" },
    { name:"Japanese with Shun", desc:"Super clear Japanese. Comprehensible Input — N5-N4 level.", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, mode:"listening" },
    { name:"Onomappu", desc:"Japanese-only podcast. Comprehensible Input, CLT compatibility very high. N4-N3.", url:"https://www.youtube.com/@Onomappu", free:true, mode:"listening" },
    { name:"Sambon Juku", desc:"Natural Japanese, real conversation expressions. N2-N1 level.", url:"https://www.youtube.com/@SambonJuku", free:true, mode:"listening" },
    { name:"Miku Real Japanese", desc:"Native-level conversation, real-life Japanese. High CLT compatibility.", url:"https://www.youtube.com/@mikunihongo", free:true, mode:"listening" },
    { name:"Akane Japanese Class", desc:"Natural conversation, Japanese culture, practical expressions. N4-N3.", url:"https://www.youtube.com/@Akane-JapaneseClass", free:true, mode:"listening" },
    { name:"Easy Japanese NHK", desc:"Real-world scenario setting, role-play. Very close to CLT research.", url:"https://www.nhk.or.jp/lesson/en/", free:true, mode:"listening" },
    { name:"Hilokal", desc:"Audio rooms and group conversation for real practice. CLT compatibility very high.", url:"https://hilokal.com", free:true, mode:"speaking" },
  ],
  conversation: [
    { name:"NHK Japan — Learn Japanese", desc:"CLT-based conversational Japanese. Real-life scenario practice.", url:"https://www3.nhk.or.jp/nhkworld/en/learnjapanese/", free:true, mode:"speaking" },
    { name:"Erin's Challenge", desc:"Interactive drama with real situations and role-play. CLT compatibility extremely high.", url:"https://www.erin.jpf.go.jp/en/lesson/09/advanced/", free:true, mode:"speaking" },
    { name:"MARUGOTO Plus", desc:"Japan Foundation's CEFR-based task-centered course. A1-B1. Represents CLT itself.", url:"https://a1.marugotoweb.jp/en/", free:true, mode:"speaking" },
    { name:"IRODORI Japanese Online Course", desc:"One of the most CLT-aligned materials in current Japanese education. Life scenarios, role-play, task-based.", url:"https://www.irodori.jpf.go.jp/", free:true, mode:"speaking" },
    { name:"HelloTalk", desc:"Real interaction with Japanese speakers. CLT level ★★★★★", url:"https://www.hellotalk.com/", free:true, mode:"speaking" },
    { name:"Tandem", desc:"Language exchange. Real communication practice. CLT level ★★★★★", url:"https://www.tandem.net/", free:true, mode:"speaking" },
    { name:"Hilokal", desc:"Audio rooms, group conversation, real practice. CLT compatibility very high.", url:"https://hilokal.com", free:true, mode:"speaking" },
    { name:"JapanesePod101 (YouTube)", desc:"Conversational drills and cultural context. Shadow and repeat.", url:"https://www.youtube.com/watch?v=B_55oW65H4M", free:true, mode:"listening" },
    { name:"Japanese Ammo with Misa", desc:"Practical example sentences, conversation-focused. CLT-aligned.", url:"https://www.youtube.com/@JapaneseAmmowithMisa", free:true, mode:"listening" },
    { name:"Miku Real Japanese", desc:"Native-to-native conversation, real daily Japanese. High CLT compatibility.", url:"https://www.youtube.com/@mikunihongo", free:true, mode:"speaking" },
    { name:"Let's Learn Japanese from Small Talk", desc:"Native-to-native conversation, authentic communication.", url:"https://www.youtube.com/@LetsLearnJapanese", free:true, mode:"listening" },
  ],
  jlpt: [
    { name:"Japanese Test 4 You — Vocabulary", desc:"JLPT vocabulary practice N5-N1. Test your word knowledge.", url:"https://japanesetest4you.com/jlpt-n5-vocabulary/", free:true, mode:"reading" },
    { name:"Japanese Test 4 You — Reading", desc:"JLPT reading comprehension N5-N1. Graded passages with questions.", url:"https://japanesetest4you.com/jlpt-n5-reading/", free:true, mode:"reading" },
    { name:"Japanese Test 4 You — Listening", desc:"JLPT listening practice N5-N1. Audio-based questions.", url:"https://japanesetest4you.com/jlpt-n5-listening/", free:true, mode:"listening" },
    { name:"Nihongo no Mori", desc:"Grammar-rich JLPT prep with natural conversation examples. N2-N1.", url:"https://www.youtube.com/@nihongonomori", free:true, mode:"listening" },
    { name:"Sambon Juku", desc:"JLPT N2-N1 grammar and vocabulary in natural context.", url:"https://www.youtube.com/@SambonJuku", free:true, mode:"listening" },
  ],
  reading: [
    { name:"Tadoku (Free Readers)", desc:"Graded reading from Level 0–4. CLT: read then discuss.", url:"https://tadoku.org/japanese/book-search/?level=&series=&kw=&order=register_desc", free:true, mode:"reading" },
    { name:"NHK Web Easy", desc:"Real Japanese news simplified. Perfect A2-B1 reading input. Authentic materials.", url:"https://news.web.nhk/news/easy/", free:true, mode:"reading" },
    { name:"FluencyDrop Stories", desc:"Authentic short stories with audio. Build reading fluency.", url:"https://fluencydrop.com/stories/japanese", free:true, mode:"reading" },
    { name:"IRODORI Japanese Online Course", desc:"Reading tasks based on daily life in Japan. CLT task-based.", url:"https://www.irodori.jpf.go.jp/", free:true, mode:"reading" },
    { name:"Japonin Teacher's Blog", desc:"Conversation-centered teaching materials with free audio. Reading + comprehension.", url:"https://japonin.com/", free:true, mode:"reading" },
    { name:"LingQ", desc:"Authentic materials — read and listen simultaneously. Build reading fluency.", url:"https://www.lingq.com/en/learn/ja/", free:false, mode:"reading" },
    { name:"NHK News Web (advanced)", desc:"Full-speed NHK news for N2-N1 readers. Authentic materials.", url:"https://www3.nhk.or.jp/news/", free:true, mode:"reading" },
  ],
  kanji: [
    { name:"Nihonten AI (Bilingual Kanji)", desc:"AI-powered personalized kanji with bilingual translation context.", url:"https://nihonten.ai/", free:false, mode:"writing" },
    { name:"IRODORI Japanese Online Course", desc:"Kanji introduced in real-life context. Task-based CLT approach.", url:"https://www.irodori.jpf.go.jp/", free:true, mode:"reading" },
    { name:"Nihongo no Mori", desc:"Systematic kanji instruction with vocabulary and usage examples. N2-N1.", url:"https://www.youtube.com/@nihongonomori", free:true, mode:"listening" },
  ],
  grammar: [
    { name:"Imabi", desc:"The most comprehensive free Japanese grammar reference online.", url:"https://imabi.org/", free:true, mode:"reading" },
    { name:"MARUGOTO Plus", desc:"Grammar taught through real communicative tasks. CEFR-based CLT.", url:"https://a1.marugotoweb.jp/en/", free:true, mode:"speaking" },
    { name:"IRODORI Japanese Online Course", desc:"Grammar in daily-life task contexts. Closest to CLT in current Japanese education.", url:"https://www.irodori.jpf.go.jp/", free:true, mode:"reading" },
    { name:"Sambon Juku", desc:"Grammar in natural Japanese conversation. N2-N1 level.", url:"https://www.youtube.com/@SambonJuku", free:true, mode:"listening" },
    { name:"Nihongo no Mori", desc:"Structured grammar lessons with example sentences and JLPT focus.", url:"https://www.youtube.com/@nihongonomori", free:true, mode:"listening" },
    { name:"Japonin Teacher's Blog", desc:"Conversation-centered grammar materials with audio.", url:"https://japonin.com/", free:true, mode:"reading" },
  ],
};

// Flattened lookup of every known external resource already curated in this app (Tadoku, Imabi,
// NHK Web Easy, Anki, etc. — from RESOURCES/LEVEL_RESOURCES below), so schedule tasks that mention
// one of these by name can link straight to it instead of leaving the student to search for it.
// Every resource carries a `mode` (reading/listening/speaking/writing) describing what a student
// actually DOES with it. Because the same name (e.g. "Anki", "IRODORI") can appear in more than one
// category with a different mode, we keep ALL candidates per name and pick the one matching the
// task's actual skill — this is what prevents e.g. a kanji-writing task from surfacing the
// listening-focused "Anki (Japanese Decks)" link.
const ALL_RESOURCE_LOOKUP = {};
function registerResourceLookup(list) {
  (list || []).forEach(r => {
    if (!r?.name) return;
    if (!ALL_RESOURCE_LOOKUP[r.name]) ALL_RESOURCE_LOOKUP[r.name] = [];
    if (!ALL_RESOURCE_LOOKUP[r.name].some(existing => existing.url === r.url && existing.mode === r.mode)) {
      ALL_RESOURCE_LOOKUP[r.name].push(r);
    }
  });
}
// taskMode (optional): "reading" | "listening" | "speaking" | "writing" — the skill the schedule
// task actually targets. When provided, only resources tagged with that same mode are eligible,
// so a task never gets a resource link for the wrong skill just because a keyword matched.
function findTaskResourceLink(taskText, taskMode) {
  const t = (taskText || "").toLowerCase();
  const names = Object.keys(ALL_RESOURCE_LOOKUP).sort((a, b) => b.length - a.length);
  const matchedName = names.find(n => t.includes(n.split(" (")[0].toLowerCase()));
  if (!matchedName) return null;
  const candidates = ALL_RESOURCE_LOOKUP[matchedName];
  if (taskMode) {
    const modeMatch = candidates.find(r => r.mode === taskMode);
    return modeMatch || null; // no cross-mode fallback: better no link than a misleading one
  }
  return candidates[0] || null; // legacy tasks with no mode tag: keep old best-effort behavior
}

// Maps schedule-task keywords to the in-app tab (and resources sub-tab, if any) that already
// covers that kind of practice, so a task like "単語復習" can link straight into GAKU's own
// Vocabulary/Subtitles/Create-From-Content/Conversation-Practice screens.
const TASK_APP_NAV = [
  { test: /会話|conversation|speak/i, tab: "resources", resourceSubTab: "conversation", labelKey: "navGoConversation" },
  { test: /字幕|subtitle/i, tab: "subtitles", labelKey: "navGoSubtitles" },
  { test: /音読|要約|shadowing|シャドーイング|read aloud|summarize/i, tab: "resources", resourceSubTab: "content", labelKey: "navGoContent" },
  { test: /単語|vocab|anki|flashcard/i, tab: "vocabulary", labelKey: "navGoVocabulary" },
];
function findTaskAppNav(taskText) {
  return TASK_APP_NAV.find(n => n.test.test(taskText || "")) || null;
}

// Level-based recommended resources
const LEVEL_RESOURCES = {
  "Beginner": [
    { name:"Japanese with Shun", descKey:"resShunDesc", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", mode:"speaking", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"MLC Hiragana & Katakana Drills", desc:"Side-by-side hiragana and katakana drills for absolute beginners.", url:"https://www.mlcjapanese.co.jp/hiragana_katakana.html", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:2, grammar:0, reading:5, speaking:0, listening:0 } },
    { name:"Moji Ninja (Kana Challenge)", desc:"Gamified hiragana/katakana recognition challenge.", url:"https://moji.ninja/challenge", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:2, grammar:0, reading:5, speaking:0, listening:0 } },
    { name:"Hirakata (Kana Practice)", desc:"Quick drills for mastering hiragana and katakana recognition.", url:"https://hirakata.io/", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:2, grammar:0, reading:5, speaking:0, listening:0 } },
    { name:"StudyHiragana.com", desc:"Structured hiragana practice with quizzes and stroke order.", url:"https://www.studyhiragana.com/", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:2, grammar:0, reading:5, speaking:0, listening:0 } },
    { name:"TMS Anime (with GAKU Reader)", desc:"Easy anime clips for comprehensible-input listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime (with GAKU Reader)", desc:"Beginner-friendly anime clips for listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Pokemon Kids TV (with GAKU Reader)", desc:"Simple, slow Japanese aimed at children — great early listening and vocabulary input.", url:"https://www.pokemon.jp/special/Pokemon-KidsTV/", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:3, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Doraemon the Movie (with GAKU Reader)", desc:"Beginner-accessible anime movie content for listening and vocabulary.", url:"https://www.youtube.com/DoraemonTheMovie", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:3, grammar:0, reading:0, speaking:0, listening:5 } },
  ],
  "N5": [
    { name:"Japanese with Shun", descKey:"resShunDesc", url:"https://www.youtube.com/channel/UCu6sZrHyl4hSS2PvlUo2XZA", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", mode:"speaking", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", descKey:"resOnomappuDesc", url:"https://www.youtube.com/@Onomappu", free:true, levelKey:"resLevelN4N3", mode:"listening", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
    { name:"Nihongoplay (Flashcard Decks)", desc:"Ready-made JLPT-graded vocabulary decks to review by reading.", url:"https://nihongoplay.com/decks", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:5, grammar:1, reading:3, speaking:0, listening:0 } },
    { name:"MLC N5-N4 Katakana Quiz", desc:"Katakana recognition quiz pitched at N5-N4 level.", url:"https://www.mlcjapanese.co.jp/n5n4_jlpt_katakana_quiz_01.html", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:2, grammar:2, reading:5, speaking:0, listening:0 } },
    { name:"Anime Reading (with GAKU Reader)", desc:"Read manga/anime scripts with the GAKU Reader extension for instant furigana and lookups.", url:"https://jyosiki.com/manga/danmachi/2_2.html", free:true, levelKey:"resLevelN5N4", mode:"reading", skills:{ vocab:4, grammar:2, reading:5, speaking:0, listening:1 } },
    { name:"TMS Anime (with GAKU Reader)", desc:"Anime clips for comprehensible-input listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime (with GAKU Reader)", desc:"Anime clips for listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Pokemon Kids TV (with GAKU Reader)", desc:"Simple, slow Japanese aimed at children — listening, vocabulary, and light reading with GAKU Reader.", url:"https://www.pokemon.jp/special/Pokemon-KidsTV/", free:true, levelKey:"resLevelN5N4", mode:"listening", skills:{ vocab:3, grammar:0, reading:2, speaking:0, listening:5 } },
  ],
  "N4": [
    { name:"Marugoto Web", descKey:"resMarugotoDesc", url:"https://marugotoweb.jp/ja/", free:true, levelKey:"resLevelN4N3", mode:"speaking", skills:{ vocab:4, grammar:4, reading:3, speaking:5, listening:5 } },
    { name:"Onomappu", descKey:"resOnomappuDesc", url:"https://www.youtube.com/@Onomappu", free:true, levelKey:"resLevelN4N3", mode:"listening", skills:{ vocab:5, grammar:3, reading:0, speaking:4, listening:5 } },
    { name:"Nihongo con Teppei", descKey:"resTeppeiDesc", url:"https://nihongoconteppei.com", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Nihongoplay (Flashcard Decks)", desc:"Ready-made JLPT-graded vocabulary decks to review by reading.", url:"https://nihongoplay.com/decks", free:true, levelKey:"resLevelN3N2", mode:"reading", skills:{ vocab:5, grammar:1, reading:3, speaking:0, listening:0 } },
    { name:"MLC N4 Grammar Quiz", desc:"N4-level grammar comprehension quiz.", url:"https://www.mlcjapanese.co.jp/n4_jlpt_grammar_quiz_01.html", free:true, levelKey:"resLevelN3N2", mode:"reading", skills:{ vocab:2, grammar:5, reading:4, speaking:0, listening:0 } },
    { name:"Anime Reading (with GAKU Reader)", desc:"Read manga/anime scripts with the GAKU Reader extension for instant furigana and lookups.", url:"https://jyosiki.com/manga/danmachi/2_2.html", free:true, levelKey:"resLevelN3N2", mode:"reading", skills:{ vocab:4, grammar:2, reading:5, speaking:0, listening:1 } },
    { name:"TMS Anime (with GAKU Reader)", desc:"Anime clips for comprehensible-input listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime (with GAKU Reader)", desc:"Anime clips for listening and vocabulary; use with GAKU Reader for on-screen lookups.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
  ],
  "N3": [
    { name:"Nihongo con Teppei", descKey:"resTeppeiDesc", url:"https://nihongoconteppei.com", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"YUYU Japanese Podcast", descKey:"resYuyuDesc", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
    { name:"Nihongoplay (Flashcard Decks)", desc:"Ready-made JLPT-graded vocabulary decks to review by reading.", url:"https://nihongoplay.com/decks", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:5, grammar:1, reading:3, speaking:0, listening:0 } },
    { name:"MLC N3 Grammar Quiz", desc:"N3-level grammar comprehension quiz.", url:"https://www.mlcjapanese.co.jp/n3_jlpt_grammar_quiz_01.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:2, grammar:5, reading:4, speaking:0, listening:0 } },
    { name:"Anime Reading (with GAKU Reader)", desc:"Read manga/anime scripts with the GAKU Reader extension for instant furigana and lookups.", url:"https://jyosiki.com/manga/danmachi/2_2.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:4, grammar:2, reading:5, speaking:0, listening:1 } },
    { name:"TMS Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
  ],
  "N2": [
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
    { name:"YUYU Japanese Podcast", descKey:"resYuyuDesc", url:"https://www.youtube.com/@yuyunihongopodcast", free:true, levelKey:"resLevelN3N2", mode:"listening", skills:{ vocab:5, grammar:2, reading:0, speaking:3, listening:5 } },
    { name:"MLC N2 Grammar Quiz", desc:"N2-level grammar comprehension quiz.", url:"https://www.mlcjapanese.co.jp/n2_jlpt_grammar_quiz_01.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:2, grammar:5, reading:4, speaking:0, listening:0 } },
    { name:"Anime Reading (with GAKU Reader)", desc:"Read manga/anime scripts with the GAKU Reader extension for instant furigana and lookups.", url:"https://jyosiki.com/manga/danmachi/2_2.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:4, grammar:2, reading:5, speaking:0, listening:1 } },
    { name:"TMS Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
  ],
  "N1": [
    { name:"Sambon Juku", descKey:"resSambonDesc", url:"https://www.youtube.com/@SambonJuku", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:5, grammar:5, reading:3, speaking:3, listening:4 } },
    { name:"MLC N1 Grammar Quiz", desc:"N1-level grammar comprehension quiz.", url:"https://www.mlcjapanese.co.jp/n1_jlpt_grammar_quiz_01.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:2, grammar:5, reading:4, speaking:0, listening:0 } },
    { name:"Anime Reading (with GAKU Reader)", desc:"Read manga/anime scripts with the GAKU Reader extension for instant furigana and lookups.", url:"https://jyosiki.com/manga/danmachi/2_2.html", free:true, levelKey:"resLevelN2N1", mode:"reading", skills:{ vocab:4, grammar:2, reading:5, speaking:0, listening:1 } },
    { name:"TMS Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@TMSanimeJP", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
    { name:"Toei Anime", desc:"Anime clips for listening and vocabulary practice.", url:"https://www.youtube.com/@toeianime_MC", free:true, levelKey:"resLevelN2N1", mode:"listening", skills:{ vocab:4, grammar:0, reading:0, speaking:0, listening:5 } },
  ],
};
// Aliases so the new self-estimation scale (Beginner–Mastery) resolves to the same curated
// resource sets as the old JLPT-based scale (N5–N1), without duplicating the data above.
LEVEL_RESOURCES["Elementary"] = LEVEL_RESOURCES["N5"];
LEVEL_RESOURCES["Intermediate"] = LEVEL_RESOURCES["N4"];
LEVEL_RESOURCES["Upper Intermediate"] = LEVEL_RESOURCES["N3"];
LEVEL_RESOURCES["Advanced"] = LEVEL_RESOURCES["N2"];
LEVEL_RESOURCES["Mastery"] = LEVEL_RESOURCES["N1"];

Object.values(RESOURCES).forEach(registerResourceLookup);
Object.values(LEVEL_RESOURCES).forEach(registerResourceLookup);

const SKILL_LABELS = {
  pronunciation:"🔊 Pronunciation", listening:"👂 Listening", conversation:"💬 Conversation",
  jlpt:"🎯 JLPT Prep", reading:"📖 Reading", kanji:"🈳 Kanji", grammar:"📝 Grammar",
  onlyHiragana:"あ Only Hiragana", onlyKatakana:"ア Only Katakana",
};
// Selecting one of these switches Create From Content generation into a kana-only mode —
// see KANA_ONLY_SKILLS usage in the content-generation prompts below.
const KANA_ONLY_SKILLS = ["onlyHiragana", "onlyKatakana"];

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
    tabPractice: "✨ From Content",
    tabVocabulary: "📚 Vocabulary",
    tabResources: "🔗 Resources",
    tabMilestones: "🏆 Milestones",
    tabSubtitles: "🎬 Subtitles",
    // In-app navigation shortcuts shown under schedule tasks (link straight to the matching tab)
    navGoConversation: "💬 Go to Conversation Practice",
    navGoSubtitles: "📺 Go to Subtitles",
    navGoContent: "✨ Go to Create From Content",
    navGoVocabulary: "📚 Go to Vocabulary",
    savedSetFound: "You have a saved study set from before.",
    resumeStudySet: "▶ Resume study set",
    resetStudySet: "Reset",
    flashcardNoWords: "No saved words yet. Search and save words first!",
    flashcardNoWordsInFolder: "No words in this folder",
    flashcardResumePrompt: "You stopped at {pos} / {total} last time. Continue?",
    flashcardResume: "▶ Resume",
    flashcardStartAgain: "🔄 Start Again",
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
    furiganaBtn: "ふりがな",
    romajiBtn: "Romaji",
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
    currentJlpt: "CURRENT JAPANESE ESTIMATION LEVEL *",
    autoFilled: "Auto-filled from your test",
    changeLevel: "If you want to change your level, please select below.",
    selectLevel: "Select level",
    beginner: "Beginner",
    levelElementary: "Elementary",
    levelIntermediate: "Intermediate",
    levelUpperIntermediate: "Upper Intermediate",
    levelAdvanced: "Advanced",
    levelMastery: "Mastery",
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
    skillOnlyHiragana: "あ Only Hiragana", skillOnlyKatakana: "ア Only Katakana",
    // How to use
    howToTitle: "How to use this app",
    howToSchedule: "Your weekly study plan, broken into daily tasks. Tap a task to mark it done and track your weekly progress.",
    howToPractice: "AI-generated exercises built from Japanese text you paste (articles, subtitles, captions) — covers vocabulary, kanji, grammar, reading, listening, conversation, and pronunciation. Tap 'Show answer' to check yourself.",
    howToVocab: "Search any topic to get level-appropriate words with example sentences, a visual association, and a CLT usage tip. Save words you want to remember.",
    howToResources: "Free (and some paid) tools matched to your selected skills — open them directly from here.",
    howToMilestones: "Your roadmap toward your goal. Tap each milestone as you complete it.",
    howToEditProfile: "Update your goals, level, schedule, or skills any time — your existing answers are kept so you only change what's needed.",
    howToHelp: "Get a personalized plan for today based on your mood, time and energy — or come back here anytime for this guide.",
      vocabBuilderTitle: "📚 VOCABULARY BUILDER",
    vocabBuilderDesc: "Enter a topic to see related words from the Japanese dictionary (English or 日本語 OK)",
    vocabSearchPlaceholder: "e.g. food, travel, emotions...",
    // Paywall — free plan / invite code / join GAKU section
    freePlanGakuStudent: "FREE Plan (Only GAKU students)",
    invitationCodeLabel: "INVITATION CODE",
    inviteCodePlaceholder: "Enter invite code...",
    confirmCode: "Confirm",
    invalidCode: "Invalid code. Please try again.",
    wantToJoinGaku: "Want to join GAKU?",
    yes: "Yes",
    no: "No",
    didYouUnderstand: "Did you understand this?",
    levelUpPrompt: "You're understanding almost everything here! Would you like to update your level to a higher level?",
    chooseNewLevel: "Choose your new level:",
    checkLater: "Check again later",
    currentLevelLabel: "Current level:",
    hideAnswerBtn: "Hide answer",
    showAnswerBtn: "Show answer",
    furiganaOn: "ON",
    furiganaOff: "OFF",
    // Paywall — main plan content
    studyPlanReadyTitle: "Your Study Plan is Ready!",
    studyPlanReadyDesc: "Unlock your personalized weekly schedule, practice sets, and vocabulary tools.",
    appOnlyLabel: "📱 APP ONLY",
    monthlyLabel: "MONTHLY",
    perMonth: "/ month",
    threeMonthsSave5: "3 MONTHS · Save 5%",
    sixMonthsSave10: "6 MONTHS · Save 10% ⭐",
    appLessonsLabel: "🎓 APP + LESSONS · 50% off lessons",
    threeMonthsSave5_30min: "3 MONTHS · Save 5% · 30min/mo",
    threeMonthsSave5_1hr: "3 MONTHS · Save 5% · 1hr/mo",
    sixMonthsSave5_30min: "6 MONTHS · Save 5% · 30min/mo ⭐",
    sixMonthsSave10_1hr: "6 MONTHS · Save 10% · 1hr/mo ⭐ Best Value",
    // Account / login / device approval
    loginTitle: "Log In",
    signupTitle: "Create Your Account",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    invitationCodeOptional: "GAKU invite code (optional)",
    loginButton: "Log In",
    signupButton: "Sign Up",
    needAccount: "Need an account? Sign up",
    haveAccount: "Already have an account? Log in",
    deviceApprovalTitle: "New Device Detected",
    deviceApprovalDesc: "We've sent an approval email to you and to GAKU. Once both approve, this device will be unlocked — please check your inbox.",
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
    listenAudio: "Listen",
    recordVoice: "Record",
    recordingInProgress: "Recording...",
    yourSpokenAnswer: "Your spoken answer:",
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
    contentTitle: "CREATE FROM CONTENT",
    contentDesc: "Paste Japanese text you're reading or watching — an article, video subtitles/description, a caption, a message — and GAKU will build {jlpt}-level activities from it, just like GAKU Reader does on the web.",
    contentPlaceholder: "Paste Japanese text, subtitles, or a caption here",
    contentAnalyzing: "Analyzing content...",
    contentAnalyzeAgain: "Analyze again",
    contentAnalyzeButton: "Analyze & Generate Activities",
    contentErrEmpty: "Paste some Japanese text (or a video's subtitles/description) first.",
    contentErrNoAct: "Couldn't generate activities from that content. Try pasting more text.",
    contentErrGeneric: "Could not analyze this content right now. Please try again.",
    convTitle: "Conversation Practice",
    convDesc: "Paste a video's subtitles or transcript (e.g. YouTube's own \"Show transcript\" panel). GAKU will find real conversational exchanges and let you predict — and speak — the next line before revealing the model answer.",
    convPasteLabel: "Paste subtitles / transcript here",
    convGenerating: "Building conversation practice...",
    convGenerateBtn: "Build Conversation Practice",
    convNoTurns: "Couldn't find a conversation in that content. Try pasting a transcript with more dialogue.",
    convYourTurn: "How would you respond?",
    convRevealBtn: "Show model answer",
    convModelAnswer: "Model answer",
    convAltResponses: "Other ways to say it",
    translateBtn: "Translate",
    subtitlesTitle: "Subtitles → Vocabulary",
    subtitlesDesc: "Paste subtitles or a transcript from a video you're already watching (e.g. YouTube's own \"Show transcript\" panel). Double-click a word or drag to select a phrase, then look it up and save it straight to your Vocabulary Builder.",
    subtitlesSourceLabel: "Video title / source (optional — used as the folder name)",
    subtitlesSourcePlaceholder: "e.g. NHK news 7/2",
    subtitlesPasteLabel: "Paste subtitles / transcript here",
    subtitlesPastePlaceholder: "Paste plain text or an .srt file's contents — timestamps and cue numbers are removed automatically.",
    subtitlesLoadBtn: "Load transcript",
    subtitlesCopyrightNote: "🔒 Text you paste here is saved only in this browser's local storage, so you can resume later — it's never sent to a server. Only the specific words/phrases you choose to save are added to your Vocabulary Builder.",
    subtitlesDefaultFolder: "Subtitles",
    subtitlesLoadNew: "↺ Load a different transcript",
    subtitlesSavedCount: "Saved this session:",
    subtitlesLookupSaveBtn: "🔍 Look up & save",
    subtitlesTooLong: "That selection is too long — please select a shorter word or phrase (under ~60 characters).",
    subtitlesSavedTo: "saved to",
    subtitlesLookupError: "Lookup failed. Please try again.",
    resAnkiPronDesc: "Build phonetic recognition with audio flashcards. CLT: hear and repeat.",
    resMisaPronDesc: "Practical example sentences and pronunciation drills. CLT-focused.",
    resOnomappuPronDesc: "Japanese-only explanations. Comprehensible Input — CLT compatibility very high.",
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
    tabPractice: "✨ À partir du contenu",
    tabVocabulary: "📚 Vocabulaire",
    tabResources: "🔗 Ressources",
    tabMilestones: "🏆 Objectifs",
    tabSubtitles: "🎬 Sous-titres",
    navGoConversation: "💬 Aller à la pratique de conversation",
    navGoSubtitles: "📺 Aller aux sous-titres",
    navGoContent: "✨ Aller à partir du contenu",
    navGoVocabulary: "📚 Aller au vocabulaire",
    savedSetFound: "Vous avez un ensemble d'étude enregistré précédemment.",
    resumeStudySet: "▶ Reprendre l'étude",
    resetStudySet: "Réinitialiser",
    flashcardNoWords: "Pas encore de mots enregistrés. Cherchez et enregistrez des mots d'abord !",
    flashcardNoWordsInFolder: "Aucun mot dans ce dossier",
    flashcardResumePrompt: "Vous vous étiez arrêté à {pos} / {total} la dernière fois. Continuer ?",
    flashcardResume: "▶ Reprendre",
    flashcardStartAgain: "🔄 Recommencer",
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
    currentJlpt: "NIVEAU D'ESTIMATION JAPONAIS ACTUEL *",
    autoFilled: "Rempli automatiquement depuis votre test",
    changeLevel: "Si vous souhaitez changer votre niveau, veuillez sélectionner ci-dessous.",
    selectLevel: "Sélectionner le niveau",
    beginner: "Débutant",
    levelElementary: "Élémentaire",
    levelIntermediate: "Intermédiaire",
    levelUpperIntermediate: "Intermédiaire supérieur",
    levelAdvanced: "Avancé",
    levelMastery: "Maîtrise",
    levelUpPrompt: "Vous comprenez presque tout ici ! Souhaitez-vous passer à un niveau supérieur ?",
    chooseNewLevel: "Choisissez votre nouveau niveau :",
    currentLevelLabel: "Niveau actuel :",
    yes: "Oui",
    no: "Non",
    didYouUnderstand: "Avez-vous compris ceci ?",
    hideAnswerBtn: "Masquer la réponse",
    showAnswerBtn: "Afficher la réponse",
    furiganaOn: "Activé",
    furiganaOff: "Désactivé",
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
    skillOnlyHiragana: "あ Hiragana uniquement", skillOnlyKatakana: "ア Katakana uniquement",
    howToTitle: "Comment utiliser cette application",
    howToSchedule: "Votre plan d'étude hebdomadaire, divisé en tâches quotidiennes. Appuyez sur une tâche pour la marquer comme faite.",
    howToPractice: "Exercices générés par l'IA à partir du texte japonais que vous collez (articles, sous-titres, légendes) — vocabulaire, kanji, grammaire, lecture, écoute, conversation et prononciation. Appuyez sur « Voir la réponse » pour vous corriger.",
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
    listenAudio: "Écouter",
    recordVoice: "Enregistrer",
    recordingInProgress: "Enregistrement...",
    yourSpokenAnswer: "Votre réponse orale :",
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
    contentTitle: "CRÉER À PARTIR DE CONTENU",
    contentDesc: "Collez un texte japonais que vous lisez ou regardez — un article, des sous-titres/une description de vidéo, une légende, un message — et GAKU créera des activités de niveau {jlpt} à partir de celui-ci, tout comme GAKU Reader le fait sur le web.",
    contentPlaceholder: "Collez ici un texte japonais, des sous-titres ou une légende",
    contentAnalyzing: "Analyse du contenu...",
    contentAnalyzeAgain: "Analyser à nouveau",
    contentAnalyzeButton: "Analyser et générer des activités",
    contentErrEmpty: "Collez d'abord du texte japonais (ou les sous-titres/la description d'une vidéo).",
    contentErrNoAct: "Impossible de générer des activités à partir de ce contenu. Essayez de coller plus de texte.",
    contentErrGeneric: "Impossible d'analyser ce contenu pour le moment. Veuillez réessayer.",
    convTitle: "Pratique de conversation",
    convDesc: "Collez les sous-titres ou la transcription d'une vidéo (par ex. le panneau « Afficher la transcription » de YouTube). GAKU trouvera de vrais échanges conversationnels et vous laissera prédire — et dire à voix haute — la réplique suivante avant de révéler la réponse modèle.",
    convPasteLabel: "Collez les sous-titres / la transcription ici",
    convGenerating: "Création de la pratique de conversation...",
    convGenerateBtn: "Créer la pratique de conversation",
    convNoTurns: "Impossible de trouver une conversation dans ce contenu. Essayez de coller une transcription avec plus de dialogue.",
    convYourTurn: "Comment répondriez-vous ?",
    convRevealBtn: "Afficher la réponse modèle",
    convModelAnswer: "Réponse modèle",
    convAltResponses: "Autres façons de le dire",
    translateBtn: "Traduire",
    subtitlesTitle: "Sous-titres → Vocabulaire",
    subtitlesDesc: "Collez des sous-titres ou une transcription d'une vidéo que vous regardez (par ex. le panneau \"Afficher la transcription\" de YouTube). Double-cliquez sur un mot ou faites glisser pour sélectionner une phrase, puis recherchez-la et enregistrez-la directement dans votre Générateur de vocabulaire.",
    subtitlesSourceLabel: "Titre / source de la vidéo (facultatif — utilisé comme nom de dossier)",
    subtitlesSourcePlaceholder: "ex. NHK news 7/2",
    subtitlesPasteLabel: "Collez les sous-titres / la transcription ici",
    subtitlesPastePlaceholder: "Collez du texte brut ou le contenu d'un fichier .srt — les horodatages et numéros de repère sont supprimés automatiquement.",
    subtitlesLoadBtn: "Charger la transcription",
    subtitlesCopyrightNote: "🔒 Le texte que vous collez ici est enregistré uniquement dans le stockage local de ce navigateur, afin que vous puissiez reprendre plus tard — il n'est jamais envoyé à un serveur. Seuls les mots/phrases que vous choisissez d'enregistrer sont ajoutés à votre Générateur de vocabulaire.",
    subtitlesDefaultFolder: "Sous-titres",
    subtitlesLoadNew: "↺ Charger une autre transcription",
    subtitlesSavedCount: "Enregistrés cette session :",
    subtitlesLookupSaveBtn: "🔍 Rechercher et enregistrer",
    subtitlesTooLong: "Cette sélection est trop longue — veuillez choisir un mot ou une phrase plus courte (moins de ~60 caractères).",
    subtitlesSavedTo: "enregistré dans",
    subtitlesLookupError: "Échec de la recherche. Veuillez réessayer.",
    resAnkiPronDesc: "Développez la reconnaissance phonétique avec des cartes audio. CLT : écouter et répéter.",
    resMisaPronDesc: "Phrases d'exemple pratiques et exercices de prononciation. Axé sur la CLT.",
    resOnomappuPronDesc: "Explications entièrement en japonais. Input compréhensible — compatibilité CLT très élevée.",
},

  "Spanish": {
    gakuSelfStudy: "GAKU AUTOAPRENDIZAJE",
    studyPlan: "Plan de estudio",
    help: "🆘 Ayuda",
    editProfile: "✏️ Editar perfil",
    weeklyProgress: "Progreso semanal",
    tabSchedule: "📅 Horario",
    tabPractice: "✨ Desde el contenido",
    tabVocabulary: "📚 Vocabulario",
    tabResources: "🔗 Recursos",
    tabMilestones: "🏆 Metas",
    tabSubtitles: "🎬 Subtítulos",
    navGoConversation: "💬 Ir a práctica de conversación",
    navGoSubtitles: "📺 Ir a subtítulos",
    navGoContent: "✨ Ir a partir del contenido",
    navGoVocabulary: "📚 Ir al vocabulario",
    savedSetFound: "Tienes un conjunto de estudio guardado de antes.",
    resumeStudySet: "▶ Reanudar estudio",
    resetStudySet: "Restablecer",
    flashcardNoWords: "Aún no hay palabras guardadas. ¡Busca y guarda palabras primero!",
    flashcardNoWordsInFolder: "No hay palabras en esta carpeta",
    flashcardResumePrompt: "La última vez te quedaste en {pos} / {total}. ¿Continuar?",
    flashcardResume: "▶ Reanudar",
    flashcardStartAgain: "🔄 Empezar de nuevo",
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
    currentJlpt: "NIVEL DE ESTIMACIÓN DE JAPONÉS ACTUAL *",
    autoFilled: "Completado automáticamente desde tu prueba",
    changeLevel: "Si deseas cambiar tu nivel, selecciona a continuación.",
    selectLevel: "Seleccionar nivel",
    beginner: "Principiante",
    levelElementary: "Elemental",
    levelIntermediate: "Intermedio",
    levelUpperIntermediate: "Intermedio alto",
    levelAdvanced: "Avanzado",
    levelMastery: "Dominio",
    levelUpPrompt: "¡Estás entendiendo casi todo aquí! ¿Te gustaría subir a un nivel superior?",
    chooseNewLevel: "Elige tu nuevo nivel:",
    currentLevelLabel: "Nivel actual:",
    yes: "Sí",
    no: "No",
    didYouUnderstand: "¿Entendiste esto?",
    hideAnswerBtn: "Ocultar respuesta",
    showAnswerBtn: "Mostrar respuesta",
    furiganaOn: "Activado",
    furiganaOff: "Desactivado",
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
    skillOnlyHiragana: "あ Solo Hiragana", skillOnlyKatakana: "ア Solo Katakana",
    howToTitle: "Cómo usar esta aplicación",
    howToSchedule: "Tu plan de estudio semanal, dividido en tareas diarias. Toca una tarea para marcarla como completada.",
    howToPractice: "Ejercicios generados por IA a partir del texto japonés que pegas (artículos, subtítulos, leyendas) — vocabulario, kanji, gramática, lectura, escucha, conversación y pronunciación. Toca 'Ver respuesta' para comprobar.",
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
    listenAudio: "Escuchar",
    recordVoice: "Grabar",
    recordingInProgress: "Grabando...",
    yourSpokenAnswer: "Tu respuesta hablada:",
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
    contentTitle: "CREAR DESDE CONTENIDO",
    contentDesc: "Pega un texto en japonés que estés leyendo o viendo — un artículo, subtítulos o descripción de un video, un pie de foto, un mensaje — y GAKU creará actividades de nivel {jlpt} a partir de él, igual que hace GAKU Reader en la web.",
    contentPlaceholder: "Pega aquí un texto en japonés, subtítulos o un pie de foto",
    contentAnalyzing: "Analizando contenido...",
    contentAnalyzeAgain: "Analizar de nuevo",
    contentAnalyzeButton: "Analizar y generar actividades",
    contentErrEmpty: "Pega primero algo de texto en japonés (o los subtítulos/la descripción de un video).",
    contentErrNoAct: "No se pudieron generar actividades a partir de ese contenido. Intenta pegar más texto.",
    contentErrGeneric: "No se pudo analizar este contenido en este momento. Inténtalo de nuevo.",
    convTitle: "Práctica de conversación",
    convDesc: "Pega los subtítulos o la transcripción de un video (por ejemplo, el panel «Mostrar transcripción» de YouTube). GAKU encontrará intercambios conversacionales reales y te dejará predecir —y decir en voz alta— la siguiente línea antes de revelar la respuesta modelo.",
    convPasteLabel: "Pega aquí los subtítulos / la transcripción",
    convGenerating: "Creando práctica de conversación...",
    convGenerateBtn: "Crear práctica de conversación",
    convNoTurns: "No se encontró una conversación en ese contenido. Intenta pegar una transcripción con más diálogo.",
    convYourTurn: "¿Cómo responderías?",
    convRevealBtn: "Mostrar respuesta modelo",
    convModelAnswer: "Respuesta modelo",
    convAltResponses: "Otras formas de decirlo",
    translateBtn: "Traducir",
    subtitlesTitle: "Subtítulos → Vocabulario",
    subtitlesDesc: "Pega subtítulos o una transcripción de un video que ya estás viendo (por ejemplo, el panel \"Mostrar transcripción\" de YouTube). Haz doble clic en una palabra o arrastra para seleccionar una frase, luego búscala y guárdala directamente en tu Generador de vocabulario.",
    subtitlesSourceLabel: "Título / fuente del video (opcional — se usa como nombre de la carpeta)",
    subtitlesSourcePlaceholder: "ej. NHK news 7/2",
    subtitlesPasteLabel: "Pega los subtítulos / la transcripción aquí",
    subtitlesPastePlaceholder: "Pega texto plano o el contenido de un archivo .srt — las marcas de tiempo y números de escena se eliminan automáticamente.",
    subtitlesLoadBtn: "Cargar transcripción",
    subtitlesCopyrightNote: "🔒 El texto que pegas aquí se guarda solo en el almacenamiento local de este navegador, para que puedas continuar más tarde — nunca se envía a un servidor. Solo las palabras/frases que elijas guardar se añaden a tu Generador de vocabulario.",
    subtitlesDefaultFolder: "Subtítulos",
    subtitlesLoadNew: "↺ Cargar otra transcripción",
    subtitlesSavedCount: "Guardados en esta sesión:",
    subtitlesLookupSaveBtn: "🔍 Buscar y guardar",
    subtitlesTooLong: "Esa selección es demasiado larga — elige una palabra o frase más corta (menos de ~60 caracteres).",
    subtitlesSavedTo: "guardado en",
    subtitlesLookupError: "Error en la búsqueda. Inténtalo de nuevo.",
    resAnkiPronDesc: "Desarrolla el reconocimiento fonético con tarjetas de audio. CLT: escuchar y repetir.",
    resMisaPronDesc: "Frases de ejemplo prácticas y ejercicios de pronunciación. Enfocado en CLT.",
    resOnomappuPronDesc: "Explicaciones solo en japonés. Input comprensible — compatibilidad CLT muy alta.",
},

  "Portuguese": {
    gakuSelfStudy: "GAKU AUTO-ESTUDO",
    studyPlan: "Plano de estudo",
    help: "🆘 Ajuda",
    editProfile: "✏️ Editar perfil",
    weeklyProgress: "Progresso semanal",
    tabSchedule: "📅 Agenda",
    tabPractice: "✨ A partir do conteúdo",
    tabVocabulary: "📚 Vocabulário",
    tabResources: "🔗 Recursos",
    tabMilestones: "🏆 Metas",
    tabSubtitles: "🎬 Legendas",
    navGoConversation: "💬 Ir para prática de conversação",
    navGoSubtitles: "📺 Ir para legendas",
    navGoContent: "✨ Ir a partir do conteúdo",
    navGoVocabulary: "📚 Ir para o vocabulário",
    savedSetFound: "Você tem um conjunto de estudo salvo de antes.",
    resumeStudySet: "▶ Retomar estudo",
    resetStudySet: "Redefinir",
    flashcardNoWords: "Ainda não há palavras salvas. Pesquise e salve palavras primeiro!",
    flashcardNoWordsInFolder: "Nenhuma palavra nesta pasta",
    flashcardResumePrompt: "Você parou em {pos} / {total} da última vez. Continuar?",
    flashcardResume: "▶ Retomar",
    flashcardStartAgain: "🔄 Começar de novo",
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
    currentJlpt: "NÍVEL DE ESTIMATIVA DE JAPONÊS ATUAL *",
    autoFilled: "Preenchido automaticamente do seu teste",
    changeLevel: "Se quiser mudar seu nível, selecione abaixo.",
    selectLevel: "Selecionar nível",
    beginner: "Iniciante",
    levelElementary: "Elementar",
    levelIntermediate: "Intermediário",
    levelUpperIntermediate: "Intermediário superior",
    levelAdvanced: "Avançado",
    levelMastery: "Domínio",
    levelUpPrompt: "Você está entendendo quase tudo aqui! Gostaria de subir para um nível superior?",
    chooseNewLevel: "Escolha seu novo nível:",
    currentLevelLabel: "Nível atual:",
    yes: "Sim",
    no: "Não",
    didYouUnderstand: "Você entendeu isso?",
    hideAnswerBtn: "Ocultar resposta",
    showAnswerBtn: "Mostrar resposta",
    furiganaOn: "Ativado",
    furiganaOff: "Desativado",
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
    skillOnlyHiragana: "あ Apenas Hiragana", skillOnlyKatakana: "ア Apenas Katakana",
    howToTitle: "Como usar este aplicativo",
    howToSchedule: "Seu plano de estudo semanal, dividido em tarefas diárias.",
    howToPractice: "Exercícios gerados por IA a partir do texto japonês que você cola (artigos, legendas, descrições) — vocabulário, kanji, gramática, leitura, escuta, conversação e pronúncia. Toque em 'Ver resposta' para conferir.",
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
    listenAudio: "Ouvir",
    recordVoice: "Gravar",
    recordingInProgress: "Gravando...",
    yourSpokenAnswer: "Sua resposta falada:",
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
    contentTitle: "CRIAR A PARTIR DE CONTEÚDO",
    contentDesc: "Cole um texto em japonês que você esteja lendo ou assistindo — um artigo, legendas/descrição de vídeo, uma legenda de foto, uma mensagem — e o GAKU criará atividades de nível {jlpt} a partir dele, assim como o GAKU Reader faz na web.",
    contentPlaceholder: "Cole aqui um texto em japonês, legendas ou uma legenda de foto",
    contentAnalyzing: "Analisando conteúdo...",
    contentAnalyzeAgain: "Analisar novamente",
    contentAnalyzeButton: "Analisar e gerar atividades",
    contentErrEmpty: "Cole primeiro algum texto em japonês (ou as legendas/descrição de um vídeo).",
    contentErrNoAct: "Não foi possível gerar atividades a partir desse conteúdo. Tente colar mais texto.",
    contentErrGeneric: "Não foi possível analisar este conteúdo agora. Tente novamente.",
    convTitle: "Prática de conversação",
    convDesc: "Cole as legendas ou a transcrição de um vídeo (por exemplo, o painel «Mostrar transcrição» do YouTube). O GAKU encontrará trocas conversacionais reais e permitirá que você preveja —e diga em voz alta— a próxima fala antes de revelar a resposta modelo.",
    convPasteLabel: "Cole as legendas / transcrição aqui",
    convGenerating: "Criando prática de conversação...",
    convGenerateBtn: "Criar Prática de Conversação",
    convNoTurns: "Não foi possível encontrar uma conversa nesse conteúdo. Tente colar uma transcrição com mais diálogo.",
    convYourTurn: "Como você responderia?",
    convRevealBtn: "Mostrar resposta modelo",
    convModelAnswer: "Resposta modelo",
    convAltResponses: "Outras formas de dizer isso",
    translateBtn: "Traduzir",
    subtitlesTitle: "Legendas → Vocabulário",
    subtitlesDesc: "Cole legendas ou uma transcrição de um vídeo que você já está assistindo (por exemplo, o painel \"Mostrar transcrição\" do YouTube). Clique duas vezes em uma palavra ou arraste para selecionar uma frase, depois pesquise e salve diretamente no seu Criador de Vocabulário.",
    subtitlesSourceLabel: "Título / fonte do vídeo (opcional — usado como nome da pasta)",
    subtitlesSourcePlaceholder: "ex. NHK news 7/2",
    subtitlesPasteLabel: "Cole as legendas / transcrição aqui",
    subtitlesPastePlaceholder: "Cole texto simples ou o conteúdo de um arquivo .srt — carimbos de data/hora e números de sequência são removidos automaticamente.",
    subtitlesLoadBtn: "Carregar transcrição",
    subtitlesCopyrightNote: "🔒 O texto que você cola aqui é salvo apenas no armazenamento local deste navegador, para que você possa continuar depois — nunca é enviado a um servidor. Somente as palavras/frases que você escolher salvar são adicionadas ao seu Criador de Vocabulário.",
    subtitlesDefaultFolder: "Legendas",
    subtitlesLoadNew: "↺ Carregar outra transcrição",
    subtitlesSavedCount: "Salvos nesta sessão:",
    subtitlesLookupSaveBtn: "🔍 Pesquisar e salvar",
    subtitlesTooLong: "Essa seleção é muito longa — escolha uma palavra ou frase mais curta (menos de ~60 caracteres).",
    subtitlesSavedTo: "salvo em",
    subtitlesLookupError: "Falha na pesquisa. Tente novamente.",
    resAnkiPronDesc: "Desenvolva o reconhecimento fonético com flashcards de áudio. CLT: ouvir e repetir.",
    resMisaPronDesc: "Frases de exemplo práticas e exercícios de pronúncia. Focado em CLT.",
    resOnomappuPronDesc: "Explicações somente em japonês. Input compreensível — compatibilidade CLT muito alta.",
},

  "German": {
    gakuSelfStudy: "GAKU SELBSTSTUDIUM",
    studyPlan: "Lernplan",
    help: "🆘 Hilfe",
    editProfile: "✏️ Profil bearbeiten",
    weeklyProgress: "Wöchentlicher Fortschritt",
    tabSchedule: "📅 Zeitplan",
    tabPractice: "✨ Aus Inhalt",
    tabVocabulary: "📚 Vokabular",
    tabResources: "🔗 Ressourcen",
    tabMilestones: "🏆 Meilensteine",
    tabSubtitles: "🎬 Untertitel",
    navGoConversation: "💬 Zur Gesprächsübung",
    navGoSubtitles: "📺 Zu den Untertiteln",
    navGoContent: "✨ Zur Übung mit Inhalten",
    navGoVocabulary: "📚 Zum Vokabular",
    savedSetFound: "Du hast ein gespeichertes Lernset von vorher.",
    resumeStudySet: "▶ Lernset fortsetzen",
    resetStudySet: "Zurücksetzen",
    flashcardNoWords: "Noch keine gespeicherten Wörter. Suche und speichere zuerst Wörter!",
    flashcardNoWordsInFolder: "Keine Wörter in diesem Ordner",
    flashcardResumePrompt: "Du hast beim letzten Mal bei {pos} / {total} aufgehört. Fortsetzen?",
    flashcardResume: "▶ Fortsetzen",
    flashcardStartAgain: "🔄 Neu beginnen",
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
    currentJlpt: "AKTUELLES JAPANISCH-EINSCHÄTZUNGSNIVEAU *",
    autoFilled: "Automatisch aus Ihrem Test ausgefüllt",
    changeLevel: "Wenn Sie Ihr Niveau ändern möchten, wählen Sie bitte unten aus.",
    selectLevel: "Niveau wählen",
    beginner: "Anfänger",
    levelElementary: "Elementar",
    levelIntermediate: "Mittelstufe",
    levelUpperIntermediate: "Obere Mittelstufe",
    levelAdvanced: "Fortgeschritten",
    levelMastery: "Meisterschaft",
    levelUpPrompt: "Du verstehst hier fast alles! Möchtest du auf ein höheres Niveau wechseln?",
    chooseNewLevel: "Wähle dein neues Niveau:",
    currentLevelLabel: "Aktuelles Niveau:",
    yes: "Ja",
    no: "Nein",
    didYouUnderstand: "Hast du das verstanden?",
    hideAnswerBtn: "Antwort ausblenden",
    showAnswerBtn: "Antwort anzeigen",
    furiganaOn: "Ein",
    furiganaOff: "Aus",
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
    skillOnlyHiragana: "あ Nur Hiragana", skillOnlyKatakana: "ア Nur Katakana",
    howToTitle: "Wie man diese App benutzt",
    howToSchedule: "Ihr wöchentlicher Lernplan, aufgeteilt in tägliche Aufgaben.",
    howToPractice: "KI-generierte Übungen aus dem japanischen Text, den Sie einfügen (Artikel, Untertitel, Bildunterschriften) — Wortschatz, Kanji, Grammatik, Lesen, Hören, Konversation und Aussprache. Tippen Sie auf 'Antwort anzeigen', um sich selbst zu überprüfen.",
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
    listenAudio: "Hören",
    recordVoice: "Aufnehmen",
    recordingInProgress: "Aufnahme läuft...",
    yourSpokenAnswer: "Ihre gesprochene Antwort:",
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
    contentTitle: "AUS INHALT ERSTELLEN",
    contentDesc: "Füge japanischen Text ein, den du liest oder ansiehst — einen Artikel, Video-Untertitel/-Beschreibung, eine Bildunterschrift, eine Nachricht — und GAKU erstellt daraus Übungen auf {jlpt}-Niveau, genau wie GAKU Reader im Web.",
    contentPlaceholder: "Füge hier japanischen Text, Untertitel oder eine Bildunterschrift ein",
    contentAnalyzing: "Inhalt wird analysiert...",
    contentAnalyzeAgain: "Erneut analysieren",
    contentAnalyzeButton: "Analysieren & Übungen erstellen",
    contentErrEmpty: "Füge zuerst japanischen Text ein (oder die Untertitel/Beschreibung eines Videos).",
    contentErrNoAct: "Aus diesem Inhalt konnten keine Übungen erstellt werden. Versuche, mehr Text einzufügen.",
    contentErrGeneric: "Dieser Inhalt konnte gerade nicht analysiert werden. Bitte versuche es erneut.",
    convTitle: "Gesprächspraxis",
    convDesc: "Füge die Untertitel oder das Transkript eines Videos ein (z. B. das „Transkript anzeigen“-Panel von YouTube). GAKU findet echte Gesprächswechsel und lässt dich die nächste Zeile vorhersagen — und laut sagen — bevor die Musterantwort angezeigt wird.",
    convPasteLabel: "Füge hier Untertitel / Transkript ein",
    convGenerating: "Gesprächspraxis wird erstellt...",
    convGenerateBtn: "Gesprächspraxis erstellen",
    convNoTurns: "In diesem Inhalt wurde kein Gespräch gefunden. Versuche ein Transkript mit mehr Dialog einzufügen.",
    convYourTurn: "Wie würdest du antworten?",
    convRevealBtn: "Musterantwort anzeigen",
    convModelAnswer: "Musterantwort",
    convAltResponses: "Andere Möglichkeiten, es zu sagen",
    translateBtn: "Übersetzen",
    subtitlesTitle: "Untertitel → Vokabular",
    subtitlesDesc: "Füge Untertitel oder ein Transkript eines Videos ein, das du bereits ansiehst (z. B. YouTubes eigenes \"Transkript anzeigen\"-Feld). Doppelklicke auf ein Wort oder ziehe, um eine Phrase auszuwählen, schlage sie dann nach und speichere sie direkt in deinem Vokabel-Builder.",
    subtitlesSourceLabel: "Videotitel / Quelle (optional — wird als Ordnername verwendet)",
    subtitlesSourcePlaceholder: "z. B. NHK news 7/2",
    subtitlesPasteLabel: "Untertitel / Transkript hier einfügen",
    subtitlesPastePlaceholder: "Füge reinen Text oder den Inhalt einer .srt-Datei ein — Zeitstempel und Nummerierungen werden automatisch entfernt.",
    subtitlesLoadBtn: "Transkript laden",
    subtitlesCopyrightNote: "🔒 Der hier eingefügte Text wird nur im lokalen Speicher dieses Browsers gespeichert, damit du später fortfahren kannst — er wird nie an einen Server gesendet. Nur die Wörter/Phrasen, die du zum Speichern auswählst, werden zu deinem Vokabel-Builder hinzugefügt.",
    subtitlesDefaultFolder: "Untertitel",
    subtitlesLoadNew: "↺ Ein anderes Transkript laden",
    subtitlesSavedCount: "In dieser Sitzung gespeichert:",
    subtitlesLookupSaveBtn: "🔍 Nachschlagen & speichern",
    subtitlesTooLong: "Diese Auswahl ist zu lang — bitte wähle ein kürzeres Wort oder eine kürzere Phrase (unter ~60 Zeichen).",
    subtitlesSavedTo: "gespeichert in",
    subtitlesLookupError: "Nachschlagen fehlgeschlagen. Bitte versuche es erneut.",
    resAnkiPronDesc: "Baue phonetische Erkennung mit Audio-Karteikarten auf. CLT: hören und wiederholen.",
    resMisaPronDesc: "Praktische Beispielsätze und Ausspracheübungen. CLT-fokussiert.",
    resOnomappuPronDesc: "Erklärungen nur auf Japanisch. Comprehensible Input — sehr hohe CLT-Kompatibilität.",
},

  "Italian": {
    gakuSelfStudy: "GAKU AUTO-APPRENDIMENTO",
    studyPlan: "Piano di studio",
    help: "🆘 Aiuto",
    editProfile: "✏️ Modifica profilo",
    weeklyProgress: "Progressi settimanali",
    tabSchedule: "📅 Programma",
    tabPractice: "✨ Dal contenuto",
    tabVocabulary: "📚 Vocabolario",
    tabResources: "🔗 Risorse",
    tabMilestones: "🏆 Obiettivi",
    tabSubtitles: "🎬 Sottotitoli",
    navGoConversation: "💬 Vai alla pratica di conversazione",
    navGoSubtitles: "📺 Vai ai sottotitoli",
    navGoContent: "✨ Vai alla pratica dai contenuti",
    navGoVocabulary: "📚 Vai al vocabolario",
    savedSetFound: "Hai un set di studio salvato da prima.",
    resumeStudySet: "▶ Riprendi studio",
    resetStudySet: "Reimposta",
    flashcardNoWords: "Nessuna parola salvata ancora. Cerca e salva prima delle parole!",
    flashcardNoWordsInFolder: "Nessuna parola in questa cartella",
    flashcardResumePrompt: "L'ultima volta ti sei fermato a {pos} / {total}. Continuare?",
    flashcardResume: "▶ Riprendi",
    flashcardStartAgain: "🔄 Ricomincia",
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
    currentJlpt: "LIVELLO DI STIMA DEL GIAPPONESE ATTUALE *",
    autoFilled: "Compilato automaticamente dal tuo test",
    changeLevel: "Se vuoi cambiare il tuo livello, seleziona qui sotto.",
    selectLevel: "Seleziona livello",
    beginner: "Principiante",
    levelElementary: "Elementare",
    levelIntermediate: "Intermedio",
    levelUpperIntermediate: "Intermedio superiore",
    levelAdvanced: "Avanzato",
    levelMastery: "Padronanza",
    levelUpPrompt: "Stai capendo quasi tutto qui! Vuoi passare a un livello superiore?",
    chooseNewLevel: "Scegli il tuo nuovo livello:",
    currentLevelLabel: "Livello attuale:",
    yes: "Sì",
    no: "No",
    didYouUnderstand: "Hai capito questo?",
    hideAnswerBtn: "Nascondi risposta",
    showAnswerBtn: "Mostra risposta",
    furiganaOn: "Attivo",
    furiganaOff: "Disattivo",
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
    skillOnlyHiragana: "あ Solo Hiragana", skillOnlyKatakana: "ア Solo Katakana",
    howToTitle: "Come usare questa app",
    howToSchedule: "Il tuo piano di studio settimanale, suddiviso in attività giornaliere. Tocca un'attività per contrassegnarla come completata.",
    howToPractice: "Esercizi generati dall'IA a partire dal testo giapponese che incolli (articoli, sottotitoli, didascalie) — vocabolario, kanji, grammatica, lettura, ascolto, conversazione e pronuncia. Tocca 'Mostra risposta' per verificare.",
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
    listenAudio: "Ascolta",
    recordVoice: "Registra",
    recordingInProgress: "Registrazione...",
    yourSpokenAnswer: "La tua risposta parlata:",
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
    contentTitle: "CREA DAL CONTENUTO",
    contentDesc: "Incolla un testo giapponese che stai leggendo o guardando — un articolo, sottotitoli/descrizione di un video, una didascalia, un messaggio — e GAKU creerà attività di livello {jlpt} a partire da esso, proprio come fa GAKU Reader sul web.",
    contentPlaceholder: "Incolla qui un testo giapponese, sottotitoli o una didascalia",
    contentAnalyzing: "Analisi del contenuto...",
    contentAnalyzeAgain: "Analizza di nuovo",
    contentAnalyzeButton: "Analizza e genera attività",
    contentErrEmpty: "Incolla prima del testo giapponese (o i sottotitoli/la descrizione di un video).",
    contentErrNoAct: "Impossibile generare attività da questo contenuto. Prova a incollare più testo.",
    contentErrGeneric: "Impossibile analizzare questo contenuto al momento. Riprova.",
    convTitle: "Pratica di conversazione",
    convDesc: "Incolla i sottotitoli o la trascrizione di un video (ad es. il pannello «Mostra trascrizione» di YouTube). GAKU troverà scambi conversazionali reali e ti farà prevedere — e dire ad alta voce — la battuta successiva prima di rivelare la risposta modello.",
    convPasteLabel: "Incolla qui i sottotitoli / la trascrizione",
    convGenerating: "Creazione della pratica di conversazione...",
    convGenerateBtn: "Crea Pratica di Conversazione",
    convNoTurns: "Impossibile trovare una conversazione in questo contenuto. Prova a incollare una trascrizione con più dialogo.",
    convYourTurn: "Come risponderesti?",
    convRevealBtn: "Mostra risposta modello",
    convModelAnswer: "Risposta modello",
    convAltResponses: "Altri modi per dirlo",
    translateBtn: "Traduci",
    subtitlesTitle: "Sottotitoli → Vocabolario",
    subtitlesDesc: "Incolla sottotitoli o una trascrizione di un video che stai già guardando (ad es. il pannello \"Mostra trascrizione\" di YouTube). Fai doppio clic su una parola o trascina per selezionare una frase, poi cercala e salvala direttamente nel tuo Costruttore di vocabolario.",
    subtitlesSourceLabel: "Titolo / fonte del video (facoltativo — usato come nome della cartella)",
    subtitlesSourcePlaceholder: "es. NHK news 7/2",
    subtitlesPasteLabel: "Incolla qui i sottotitoli / la trascrizione",
    subtitlesPastePlaceholder: "Incolla testo semplice o il contenuto di un file .srt — timestamp e numeri di sequenza vengono rimossi automaticamente.",
    subtitlesLoadBtn: "Carica trascrizione",
    subtitlesCopyrightNote: "🔒 Il testo che incolli qui viene salvato solo nella memoria locale di questo browser, così puoi riprendere più tardi — non viene mai inviato a un server. Solo le parole/frasi che scegli di salvare vengono aggiunte al tuo Costruttore di vocabolario.",
    subtitlesDefaultFolder: "Sottotitoli",
    subtitlesLoadNew: "↺ Carica un'altra trascrizione",
    subtitlesSavedCount: "Salvati in questa sessione:",
    subtitlesLookupSaveBtn: "🔍 Cerca e salva",
    subtitlesTooLong: "Questa selezione è troppo lunga — scegli una parola o frase più breve (meno di ~60 caratteri).",
    subtitlesSavedTo: "salvato in",
    subtitlesLookupError: "Ricerca non riuscita. Riprova.",
    resAnkiPronDesc: "Sviluppa il riconoscimento fonetico con flashcard audio. CLT: ascolta e ripeti.",
    resMisaPronDesc: "Frasi di esempio pratiche ed esercizi di pronuncia. Focalizzato sulla CLT.",
    resOnomappuPronDesc: "Spiegazioni solo in giapponese. Input comprensibile — compatibilità CLT molto alta.",
},

  "Chinese (Simplified)": {
    gakuSelfStudy: "GAKU 自学",
    studyPlan: "学习计划",
    help: "🆘 帮助",
    editProfile: "✏️ 编辑资料",
    weeklyProgress: "每周进度",
    tabSchedule: "📅 日程",
    tabPractice: "✨ 来自内容",
    tabVocabulary: "📚 词汇",
    tabResources: "🔗 资源",
    tabMilestones: "🏆 里程碑",
    tabSubtitles: "🎬 字幕",
    navGoConversation: "💬 前往对话练习",
    navGoSubtitles: "📺 前往字幕",
    navGoContent: "✨ 前往内容练习",
    navGoVocabulary: "📚 前往词汇",
    savedSetFound: "你有一个之前保存的学习内容。",
    resumeStudySet: "▶ 继续学习",
    resetStudySet: "重置",
    flashcardNoWords: "还没有保存的单词。请先搜索并保存单词！",
    flashcardNoWordsInFolder: "此文件夹中没有单词",
    flashcardResumePrompt: "上次进行到 {pos} / {total}。要继续吗？",
    flashcardResume: "▶ 继续",
    flashcardStartAgain: "🔄 重新开始",
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
    currentJlpt: "当前日语水平评估 *",
    autoFilled: "已从测试自动填写",
    changeLevel: "如果你想更改级别，请在下方选择。",
    selectLevel: "选择级别",
    beginner: "初学者",
    levelElementary: "初级",
    levelIntermediate: "中级",
    levelUpperIntermediate: "中高级",
    levelAdvanced: "高级",
    levelMastery: "精通",
    levelUpPrompt: "你几乎理解了这里的所有内容！你想提升到更高的等级吗？",
    chooseNewLevel: "选择你的新等级：",
    currentLevelLabel: "当前等级：",
    yes: "是",
    no: "否",
    didYouUnderstand: "你理解这个吗？",
    hideAnswerBtn: "隐藏答案",
    showAnswerBtn: "显示答案",
    furiganaOn: "开",
    furiganaOff: "关",
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
    skillOnlyHiragana: "あ 仅平假名", skillOnlyKatakana: "ア 仅片假名",
    howToTitle: "如何使用此应用",
    howToSchedule: "你的每周学习计划，分为每日任务。点击任务以标记完成并跟踪每周进度。",
    howToPractice: "根据你粘贴的日语文本（文章、字幕、说明）由AI生成的练习——涵盖词汇、汉字、语法、阅读、听力、会话和发音。点击「显示答案」自我检查。",
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
    listenAudio: "听",
    recordVoice: "录音",
    recordingInProgress: "录音中...",
    yourSpokenAnswer: "你的口头回答：",
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
    contentTitle: "从内容创建",
    contentDesc: "粘贴你正在阅读或观看的日语文本——文章、视频字幕/简介、配文或消息——GAKU 会据此生成 {jlpt} 级别的练习，就像 GAKU Reader 在网页上做的那样。",
    contentPlaceholder: "在此粘贴日语文本、字幕或配文",
    contentAnalyzing: "正在分析内容...",
    contentAnalyzeAgain: "重新分析",
    contentAnalyzeButton: "分析并生成练习",
    contentErrEmpty: "请先粘贴一些日语文本（或视频的字幕/简介）。",
    contentErrNoAct: "无法从该内容生成练习，请尝试粘贴更多文本。",
    contentErrGeneric: "目前无法分析此内容，请重试。",
    convTitle: "对话练习",
    convDesc: "粘贴视频的字幕或逐字稿（例如 YouTube 自带的“显示逐字稿”面板）。GAKU 会找出真实的对话交换，让你先预测并说出下一句话，然后再揭晓参考答案。",
    convPasteLabel: "在此粘贴字幕/逐字稿",
    convGenerating: "正在生成对话练习...",
    convGenerateBtn: "生成对话练习",
    convNoTurns: "未能在该内容中找到对话。请尝试粘贴包含更多对话的逐字稿。",
    convYourTurn: "你会怎么回答？",
    convRevealBtn: "显示参考答案",
    convModelAnswer: "参考答案",
    convAltResponses: "其他说法",
    translateBtn: "翻译",
    subtitlesTitle: "字幕 → 词汇",
    subtitlesDesc: "粘贴你正在观看的视频的字幕或文字记录（例如YouTube自带的“显示字幕稿”面板）。双击一个词或拖动选择一个短语，然后查询并直接保存到你的词汇构建器。",
    subtitlesSourceLabel: "视频标题/来源（可选——用作文件夹名称）",
    subtitlesSourcePlaceholder: "例如 NHK news 7/2",
    subtitlesPasteLabel: "在此粘贴字幕/文字记录",
    subtitlesPastePlaceholder: "粘贴纯文本或 .srt 文件内容——时间戳和序号会自动移除。",
    subtitlesLoadBtn: "加载文字记录",
    subtitlesCopyrightNote: "🔒 你粘贴的文本仅保存在此浏览器的本地存储中，以便稍后继续——绝不会发送到服务器。只有你选择保存的单词/短语会被添加到你的词汇构建器。",
    subtitlesDefaultFolder: "字幕",
    subtitlesLoadNew: "↺ 加载其他文字记录",
    subtitlesSavedCount: "本次已保存：",
    subtitlesLookupSaveBtn: "🔍 查询并保存",
    subtitlesTooLong: "所选内容太长——请选择更短的单词或短语（60个字符以内）。",
    subtitlesSavedTo: "已保存到",
    subtitlesLookupError: "查询失败，请重试。",
    resAnkiPronDesc: "通过音频卡片建立语音辨识能力。CLT：听并跟读。",
    resMisaPronDesc: "实用例句和发音练习。专注于CLT。",
    resOnomappuPronDesc: "全日语讲解。可理解输入——CLT兼容性非常高。",
},

  "Chinese (Traditional)": {
    gakuSelfStudy: "GAKU 自學",
    studyPlan: "學習計劃",
    help: "🆘 幫助",
    editProfile: "✏️ 編輯資料",
    weeklyProgress: "每週進度",
    tabSchedule: "📅 日程",
    tabPractice: "✨ 來自內容",
    tabVocabulary: "📚 詞彙",
    tabResources: "🔗 資源",
    tabMilestones: "🏆 里程碑",
    tabSubtitles: "🎬 字幕",
    navGoConversation: "💬 前往對話練習",
    navGoSubtitles: "📺 前往字幕",
    navGoContent: "✨ 前往內容練習",
    navGoVocabulary: "📚 前往詞彙",
    savedSetFound: "你有一個之前保存的學習內容。",
    resumeStudySet: "▶ 繼續學習",
    resetStudySet: "重置",
    flashcardNoWords: "尚未保存任何單詞。請先搜尋並儲存單詞！",
    flashcardNoWordsInFolder: "此資料夾中沒有單詞",
    flashcardResumePrompt: "上次進行到 {pos} / {total}。要繼續嗎？",
    flashcardResume: "▶ 繼續",
    flashcardStartAgain: "🔄 重新開始",
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
    currentJlpt: "當前日語水平評估 *",
    autoFilled: "已從測試自動填寫",
    changeLevel: "如果你想更改級別，請在下方選擇。",
    selectLevel: "選擇級別",
    beginner: "初學者",
    levelElementary: "初級",
    levelIntermediate: "中級",
    levelUpperIntermediate: "中高級",
    levelAdvanced: "高級",
    levelMastery: "精通",
    levelUpPrompt: "你幾乎理解了這裡的所有內容！你想提升到更高的等級嗎？",
    chooseNewLevel: "選擇你的新等級：",
    currentLevelLabel: "目前等級：",
    yes: "是",
    no: "否",
    didYouUnderstand: "你理解這個嗎？",
    hideAnswerBtn: "隱藏答案",
    showAnswerBtn: "顯示答案",
    furiganaOn: "開",
    furiganaOff: "關",
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
    skillOnlyHiragana: "あ 僅平假名", skillOnlyKatakana: "ア 僅片假名",
    howToTitle: "如何使用此應用",
    howToSchedule: "你的每週學習計劃，分為每日任務。點擊任務以標記完成並跟踪每週進度。",
    howToPractice: "根據你貼上的日語文本（文章、字幕、說明）由AI生成的練習——涵蓋詞彙、漢字、文法、閱讀、聽力、會話和發音。點擊「顯示答案」自我檢查。",
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
    listenAudio: "聽",
    recordVoice: "錄音",
    recordingInProgress: "錄音中...",
    yourSpokenAnswer: "你的口頭回答：",
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
    contentTitle: "從內容建立",
    contentDesc: "貼上你正在閱讀或觀看的日語文本——文章、影片字幕/簡介、配文或訊息——GAKU 會依此建立 {jlpt} 級別的練習，就像 GAKU Reader 在網頁上做的那樣。",
    contentPlaceholder: "在此貼上日語文本、字幕或配文",
    contentAnalyzing: "正在分析內容...",
    contentAnalyzeAgain: "重新分析",
    contentAnalyzeButton: "分析並產生練習",
    contentErrEmpty: "請先貼上一些日語文本（或影片的字幕/簡介）。",
    contentErrNoAct: "無法從該內容產生練習，請嘗試貼上更多文本。",
    contentErrGeneric: "目前無法分析此內容，請再試一次。",
    convTitle: "對話練習",
    convDesc: "貼上影片的字幕或逐字稿（例如 YouTube 自帶的「顯示逐字稿」面板）。GAKU 會找出真實的對話交換，讓你先預測並說出下一句話，然後再揭曉參考答案。",
    convPasteLabel: "在此貼上字幕/逐字稿",
    convGenerating: "正在產生對話練習...",
    convGenerateBtn: "產生對話練習",
    convNoTurns: "未能在該內容中找到對話。請嘗試貼上包含更多對話的逐字稿。",
    convYourTurn: "你會怎麼回答？",
    convRevealBtn: "顯示參考答案",
    convModelAnswer: "參考答案",
    convAltResponses: "其他說法",
    translateBtn: "翻譯",
    subtitlesTitle: "字幕 → 詞彙",
    subtitlesDesc: "貼上你正在觀看的影片的字幕或逐字稿（例如YouTube自帶的「顯示逐字稿」面板）。雙擊一個詞或拖曳選取一個片語，然後查詢並直接儲存到你的詞彙建構器。",
    subtitlesSourceLabel: "影片標題/來源（可選——用作資料夾名稱）",
    subtitlesSourcePlaceholder: "例如 NHK news 7/2",
    subtitlesPasteLabel: "在此貼上字幕/逐字稿",
    subtitlesPastePlaceholder: "貼上純文字或 .srt 檔案內容——時間戳記與序號會自動移除。",
    subtitlesLoadBtn: "載入逐字稿",
    subtitlesCopyrightNote: "🔒 你貼上的文字僅保存在此瀏覽器的本機儲存空間中，以便稍後繼續——絕不會傳送到伺服器。只有你選擇儲存的特定單詞/片語會被加入你的詞彙建構器。",
    subtitlesDefaultFolder: "字幕",
    subtitlesLoadNew: "↺ 載入其他逐字稿",
    subtitlesSavedCount: "本次已儲存：",
    subtitlesLookupSaveBtn: "🔍 查詢並儲存",
    subtitlesTooLong: "所選內容太長——請選擇較短的單詞或片語（60個字元以內）。",
    subtitlesSavedTo: "已儲存到",
    subtitlesLookupError: "查詢失敗，請再試一次。",
    resAnkiPronDesc: "透過音訊卡片建立語音辨識能力。CLT：聆聽並跟讀。",
    resMisaPronDesc: "實用例句和發音練習。專注於CLT。",
    resOnomappuPronDesc: "全日語講解。可理解輸入——CLT相容性非常高。",
},

  "Korean": {
    gakuSelfStudy: "GAKU 자기 학습",
    studyPlan: "학습 계획",
    help: "🆘 도움말",
    editProfile: "✏️ 프로필 편집",
    weeklyProgress: "주간 진도",
    tabSchedule: "📅 일정",
    tabPractice: "✨ 콘텐츠에서",
    tabVocabulary: "📚 어휘",
    tabResources: "🔗 자료",
    tabMilestones: "🏆 목표",
    tabSubtitles: "🎬 자막",
    navGoConversation: "💬 회화 연습으로 이동",
    navGoSubtitles: "📺 자막으로 이동",
    navGoContent: "✨ 콘텐츠 학습으로 이동",
    navGoVocabulary: "📚 단어장으로 이동",
    savedSetFound: "이전에 저장된 학습 세트가 있습니다.",
    resumeStudySet: "▶ 학습 재개",
    resetStudySet: "초기화",
    flashcardNoWords: "아직 저장된 단어가 없습니다. 먼저 단어를 검색하고 저장하세요!",
    flashcardNoWordsInFolder: "이 폴더에 단어가 없습니다",
    flashcardResumePrompt: "지난번에 {pos} / {total}에서 멈췄습니다. 계속하시겠습니까?",
    flashcardResume: "▶ 계속하기",
    flashcardStartAgain: "🔄 처음부터",
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
    currentJlpt: "현재 일본어 수준 평가 *",
    autoFilled: "테스트에서 자동 입력됨",
    changeLevel: "레벨을 변경하려면 아래에서 선택하세요.",
    selectLevel: "레벨 선택",
    beginner: "초보자",
    levelElementary: "초급",
    levelIntermediate: "중급",
    levelUpperIntermediate: "중상급",
    levelAdvanced: "고급",
    levelMastery: "마스터",
    levelUpPrompt: "여기 내용을 거의 다 이해하고 계시네요! 더 높은 레벨로 올리시겠어요?",
    chooseNewLevel: "새 레벨을 선택하세요:",
    currentLevelLabel: "현재 레벨:",
    yes: "예",
    no: "아니요",
    didYouUnderstand: "이해되셨나요?",
    hideAnswerBtn: "답 숨기기",
    showAnswerBtn: "답 보기",
    furiganaOn: "켜짐",
    furiganaOff: "꺼짐",
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
    skillOnlyHiragana: "あ 히라가나만", skillOnlyKatakana: "ア 가타카나만",
    howToTitle: "이 앱 사용 방법",
    howToSchedule: "주간 학습 계획, 일별 과제로 나뉩니다. 과제를 눌러 완료 표시하고 주간 진도를 추적하세요.",
    howToPractice: "붙여넣은 일본어 텍스트(기사, 자막, 캡션)를 기반으로 AI가 생성한 연습문제 — 어휘, 한자, 문법, 독해, 듣기, 회화, 발음을 다룹니다. '답 보기'를 눌러 확인하세요.",
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
    listenAudio: "듣기",
    recordVoice: "녹음",
    recordingInProgress: "녹음 중...",
    yourSpokenAnswer: "말한 답변:",
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
    contentTitle: "콘텐츠로 만들기",
    contentDesc: "읽거나 보고 있는 일본어 텍스트를 붙여넣으세요 — 기사, 영상 자막/설명, 칔션, 메시지 등 — GAKU가 웹에서 GAKU Reader가 하는 것처럼 이를 바탕으로 {jlpt} 수준의 활동을 만들어 드립니다.",
    contentPlaceholder: "여기에 일본어 텍스트, 자막 또는 칔션을 붙여넣으세요",
    contentAnalyzing: "콘텐츠 분석 중...",
    contentAnalyzeAgain: "다시 분석하기",
    contentAnalyzeButton: "분석 및 활동 생성",
    contentErrEmpty: "먼저 일본어 텍스트(또는 영상의 자막/설명)를 붙여넣어 주세요.",
    contentErrNoAct: "이 콘텐츠로는 활동을 생성할 수 없습니다. 더 많은 텍스트를 붙여넣어 보세요.",
    contentErrGeneric: "지금은 이 콘텐츠를 분석할 수 없습니다. 다시 시도해 주세요.",
    convTitle: "회화 연습",
    convDesc: "영상의 자막이나 대본을 붙여넣으세요(예: YouTube의 “대본 보기” 패널). GAKU가 실제 대화 교환을 찾아내어, 모범 답안을 보여주기 전에 다음 줄을 예측하고 직접 말해볼 수 있게 해줍니다.",
    convPasteLabel: "여기에 자막/대본을 붙여넣으세요",
    convGenerating: "회화 연습 만들는 중...",
    convGenerateBtn: "회화 연습 만들기",
    convNoTurns: "이 콘텐츠에서 대화를 찾을 수 없었습니다. 대화가 더 많은 대본을 붙여넣어 보세요.",
    convYourTurn: "어떻게 대답하시겠습니까?",
    convRevealBtn: "모범 답안 보기",
    convModelAnswer: "모범 답안",
    convAltResponses: "다른 말하는 방법",
    translateBtn: "번역",
    subtitlesTitle: "자막 → 단어",
    subtitlesDesc: "이미 보고 있는 영상의 자막이나 스크립트를 붙여넣으세요 (예: YouTube 자체의 \"스크립트 표시\" 패널). 단어를 더블클릭하거나 드래그하여 구문을 선택한 다음 검색하여 단어장에 바로 저장하세요.",
    subtitlesSourceLabel: "영상 제목/출처 (선택 사항 — 폴더 이름으로 사용됨)",
    subtitlesSourcePlaceholder: "예: NHK news 7/2",
    subtitlesPasteLabel: "여기에 자막/스크립트를 붙여넣으세요",
    subtitlesPastePlaceholder: "일반 텍스트나 .srt 파일 내용을 붙여넣으세요 — 타임스탬프와 큐 번호는 자동으로 제거됩니다.",
    subtitlesLoadBtn: "스크립트 불러오기",
    subtitlesCopyrightNote: "🔒 여기에 붙여넣은 텍스트는 나중에 이어서 학습할 수 있도록 이 브라우저의 로컬 저장소에만 저장되며 — 서버로 전송되지 않습니다. 저장하기로 선택한 특정 단어/구문만 단어장에 추가됩니다.",
    subtitlesDefaultFolder: "자막",
    subtitlesLoadNew: "↺ 다른 스크립트 불러오기",
    subtitlesSavedCount: "이번 세션에 저장됨:",
    subtitlesLookupSaveBtn: "🔍 검색 후 저장",
    subtitlesTooLong: "선택한 내용이 너무 깁니다 — 더 짧은 단어나 구문을 선택하세요 (약 60자 이내).",
    subtitlesSavedTo: "저장됨:",
    subtitlesLookupError: "검색에 실패했습니다. 다시 시도해 주세요.",
    resAnkiPronDesc: "오디오 플래시카드로 발음 인식력을 기르세요. CLT: 듣고 따라 말하기.",
    resMisaPronDesc: "실용적인 예문과 발음 연습. CLT 중심.",
    resOnomappuPronDesc: "일본어로만 설명. 이해 가능한 입력 — CLT 호환성 매우 높음.",
},

  "Thai": {
    gakuSelfStudy: "GAKU การเรียนรู้ด้วยตนเอง",
    studyPlan: "แผนการเรียน",
    help: "🆘 ช่วยเหลือ",
    editProfile: "✏️ แก้ไขโปรไฟล์",
    weeklyProgress: "ความคืบหน้ารายสัปดาห์",
    tabSchedule: "📅 ตารางเรียน",
    tabPractice: "✨ จากเนื้อหา",
    tabVocabulary: "📚 คำศัพท์",
    tabResources: "🔗 แหล่งเรียนรู้",
    tabMilestones: "🏆 เป้าหมาย",
    tabSubtitles: "🎬 คำบรรยาย",
    navGoConversation: "💬 ไปที่การฝึกสนทนา",
    navGoSubtitles: "📺 ไปที่คำบรรยาย",
    navGoContent: "✨ ไปที่การฝึกจากเนื้อหา",
    navGoVocabulary: "📚 ไปที่คำศัพท์",
    savedSetFound: "คุณมีชุดการเรียนที่บันทึกไว้ก่อนหน้านี้",
    resumeStudySet: "▶ ดำเนินการต่อ",
    resetStudySet: "รีเซ็ต",
    flashcardNoWords: "ยังไม่มีคำศัพท์ที่บันทึกไว้ ค้นหาและบันทึกคำศัพท์ก่อน!",
    flashcardNoWordsInFolder: "ไม่มีคำศัพท์ในโฟลเดอร์นี้",
    flashcardResumePrompt: "ครั้งที่แล้วคุณหยุดที่ {pos} / {total} ต้องการดำเนินการต่อหรือไม่?",
    flashcardResume: "▶ ดำเนินการต่อ",
    flashcardStartAgain: "🔄 เริ่มใหม่",
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
    currentJlpt: "ระดับประเมินภาษาญี่ปุ่นปัจจุบัน *",
    autoFilled: "กรอกอัตโนมัติจากการทดสอบของคุณ",
    changeLevel: "หากต้องการเปลี่ยนระดับ กรุณาเลือกด้านล่าง",
    selectLevel: "เลือกระดับ",
    beginner: "ผู้เริ่มต้น",
    levelElementary: "ระดับต้น",
    levelIntermediate: "ระดับกลาง",
    levelUpperIntermediate: "ระดับกลางค่อนข้างสูง",
    levelAdvanced: "ระดับสูง",
    levelMastery: "ระดับเชี่ยวชาญ",
    levelUpPrompt: "คุณเข้าใจเนื้อหาที่นี่เกือบทั้งหมดแล้ว! ต้องการอัปเดตเป็นระดับที่สูงขึ้นไหม?",
    chooseNewLevel: "เลือกระดับใหม่ของคุณ:",
    currentLevelLabel: "ระดับปัจจุบัน:",
    yes: "ใช่",
    no: "ไม่",
    didYouUnderstand: "คุณเข้าใจสิ่งนี้ไหม?",
    hideAnswerBtn: "ซ่อนคำตอบ",
    showAnswerBtn: "แสดงคำตอบ",
    furiganaOn: "เปิด",
    furiganaOff: "ปิด",
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
    skillOnlyHiragana: "あ เฉพาะฮิรางานะ", skillOnlyKatakana: "ア เฉพาะคาตากานะ",
    howToTitle: "วิธีใช้แอปนี้",
    howToSchedule: "แผนการเรียนรายสัปดาห์ แบ่งเป็นงานรายวัน แตะงานเพื่อทำเครื่องหมายว่าเสร็จแล้วและติดตามความคืบหน้า",
    howToPractice: "แบบฝึกหัดที่สร้างโดย AI จากข้อความภาษาญี่ปุ่นที่คุณวาง (บทความ คำบรรยาย แคปชั่น) — ครอบคลุมคำศัพท์ คันจิ ไวยากรณ์ การอ่าน การฟัง การสนทนา และการออกเสียง แตะ 'ดูคำตอบ' เพื่อตรวจสอบ",
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
    listenAudio: "ฟัง",
    recordVoice: "บันทึกเสียง",
    recordingInProgress: "กำลังบันทึก...",
    yourSpokenAnswer: "คำตอบที่พูดของคุณ:",
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
    contentTitle: "สร้างจากเนื้อหา",
    contentDesc: "วางข้อความภาษาญี่ปุ่นที่คุณกำลังอ่านหรือดูอยู่ — บทความ คำบรรยาย/คำอธิบายวิดีโอ แคปชัน หรือข้อความ — แล้ว GAKU จะสร้างกิจกรรมระดับ {jlpt} จากเนื้อหานั้น เหมือนที่ GAKU Reader ทำบนเว็บ",
    contentPlaceholder: "วางข้อความภาษาญี่ปุ่น คำบรรยาย หรือแคปชันที่นี่",
    contentAnalyzing: "กำลังวิเคราะห์เนื้อหา...",
    contentAnalyzeAgain: "วิเคราะห์อีกครั้ง",
    contentAnalyzeButton: "วิเคราะห์และสร้างกิจกรรม",
    contentErrEmpty: "กรุณาวางข้อความภาษาญี่ปุ่น (หรือคำบรรยาย/คำอธิบายวิดีโอ) ก่อน",
    contentErrNoAct: "ไม่สามารถสร้างกิจกรรมจากเนื้อหานี้ได้ ลองวางข้อความเพิ่มเติม",
    contentErrGeneric: "ไม่สามารถวิเคราะห์เนื้อหานี้ได้ในขณะนี้ กรุณาลองอีกครั้ง",
    convTitle: "ฝึกบทสนทนา",
    convDesc: "วางคำบรรยายหรือบทสนทนาของวิดีโอ (เช่น แผง “แสดงบทสนทนา” ของ YouTube) GAKU จะค้นหาบทสนทนาจริง และให้คุณคาดเดา — และพูดออกมา — ประโยคถัดไป ก่อนเฉลยคำตอบตัวอย่าง",
    convPasteLabel: "วางคำบรรยาย/บทสนทนาที่นี่",
    convGenerating: "กำลังสร้างการฝึกบทสนทนา...",
    convGenerateBtn: "สร้างการฝึกบทสนทนา",
    convNoTurns: "ไม่พบบทสนทนาในเนื้อหานี้ ลองวางบทสนทนาที่มีบทสนทนามากขึ้น",
    convYourTurn: "คุณจะตอบอย่างไร?",
    convRevealBtn: "แสดงคำตอบตัวอย่าง",
    convModelAnswer: "คำตอบตัวอย่าง",
    convAltResponses: "วิธีพูดอื่นๆ",
    translateBtn: "แปล",
    subtitlesTitle: "คำบรรยาย → คำศัพท์",
    subtitlesDesc: "วางคำบรรยายหรือบทถอดความจากวิดีโอที่คุณกำลังดูอยู่ (เช่น แผง \"Show transcript\" ของ YouTube เอง) ดับเบิลคลิกที่คำหรือลากเพื่อเลือกวลี จากนั้นค้นหาและบันทึกลงในตัวสร้างคำศัพท์ของคุณโดยตรง",
    subtitlesSourceLabel: "ชื่อ/แหล่งที่มาของวิดีโอ (ไม่บังคับ — ใช้เป็นชื่อโฟลเดอร์)",
    subtitlesSourcePlaceholder: "เช่น NHK news 7/2",
    subtitlesPasteLabel: "วางคำบรรยาย/บทถอดความที่นี่",
    subtitlesPastePlaceholder: "วางข้อความธรรมดาหรือเนื้อหาไฟล์ .srt — การประทับเวลาและหมายเลขคิวจะถูกลบออกโดยอัตโนมัติ",
    subtitlesLoadBtn: "โหลดบทถอดความ",
    subtitlesCopyrightNote: "🔒 ข้อความที่คุณวางที่นี่จะถูกบันทึกไว้ในที่จัดเก็บข้อมูลท้องถิ่นของเบราว์เซอร์นี้เท่านั้น เพื่อให้คุณกลับมาเรียนต่อได้ — จะไม่ถูกส่งไปยังเซิร์ฟเวอร์ใดๆ เฉพาะคำ/วลีที่คุณเลือกบันทึกเท่านั้นที่จะถูกเพิ่มลงในตัวสร้างคำศัพท์ของคุณ",
    subtitlesDefaultFolder: "คำบรรยาย",
    subtitlesLoadNew: "↺ โหลดบทถอดความอื่น",
    subtitlesSavedCount: "บันทึกแล้วในเซสชันนี้:",
    subtitlesLookupSaveBtn: "🔍 ค้นหาและบันทึก",
    subtitlesTooLong: "ส่วนที่เลือกยาวเกินไป — โปรดเลือกคำหรือวลีที่สั้นกว่านี้ (ไม่เกิน ~60 ตัวอักษร)",
    subtitlesSavedTo: "บันทึกลงใน",
    subtitlesLookupError: "การค้นหาล้มเหลว โปรดลองอีกครั้ง",
    resAnkiPronDesc: "สร้างการจดจำเสียงด้วยแฟลชการ์ดเสียง CLT: ฟังและพูดตาม",
    resMisaPronDesc: "ประโยคตัวอย่างที่ใช้งานได้จริงและแบบฝึกออกเสียง เน้น CLT",
    resOnomappuPronDesc: "อธิบายเป็นภาษาญี่ปุ่นล้วน Comprehensible Input — ความเข้ากันได้กับ CLT สูงมาก",
},

  "Malay": {
    gakuSelfStudy: "GAKU BELAJAR SENDIRI",
    studyPlan: "Pelan belajar",
    help: "🆘 Bantuan",
    editProfile: "✏️ Edit profil",
    weeklyProgress: "Kemajuan mingguan",
    tabSchedule: "📅 Jadual",
    tabPractice: "✨ Dari Kandungan",
    tabVocabulary: "📚 Kosa Kata",
    tabResources: "🔗 Sumber",
    tabMilestones: "🏆 Pencapaian",
    tabSubtitles: "🎬 Sari Kata",
    navGoConversation: "💬 Pergi ke Latihan Perbualan",
    navGoSubtitles: "📺 Pergi ke Sari Kata",
    navGoContent: "✨ Pergi ke Latihan daripada Kandungan",
    navGoVocabulary: "📚 Pergi ke Kosa Kata",
    savedSetFound: "Anda mempunyai set pembelajaran yang disimpan sebelum ini.",
    resumeStudySet: "▶ Sambung semula",
    resetStudySet: "Set semula",
    flashcardNoWords: "Belum ada perkataan disimpan. Cari dan simpan perkataan dahulu!",
    flashcardNoWordsInFolder: "Tiada perkataan dalam folder ini",
    flashcardResumePrompt: "Anda berhenti di {pos} / {total} kali terakhir. Teruskan?",
    flashcardResume: "▶ Sambung semula",
    flashcardStartAgain: "🔄 Mula semula",
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
    currentJlpt: "TAHAP ANGGARAN BAHASA JEPUN SEMASA *",
    autoFilled: "Diisi secara automatik dari ujian anda",
    changeLevel: "Jika anda ingin menukar tahap, sila pilih di bawah.",
    selectLevel: "Pilih tahap",
    beginner: "Pemula",
    levelElementary: "Asas",
    levelIntermediate: "Pertengahan",
    levelUpperIntermediate: "Pertengahan Atas",
    levelAdvanced: "Mahir",
    levelMastery: "Penguasaan",
    levelUpPrompt: "Anda faham hampir semua di sini! Adakah anda ingin menaik taraf ke tahap yang lebih tinggi?",
    chooseNewLevel: "Pilih tahap baharu anda:",
    currentLevelLabel: "Tahap semasa:",
    yes: "Ya",
    no: "Tidak",
    didYouUnderstand: "Adakah anda faham perkara ini?",
    hideAnswerBtn: "Sembunyikan jawapan",
    showAnswerBtn: "Tunjukkan jawapan",
    furiganaOn: "Hidup",
    furiganaOff: "Mati",
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
    skillOnlyHiragana: "あ Hiragana Sahaja", skillOnlyKatakana: "ア Katakana Sahaja",
    howToTitle: "Cara menggunakan apl ini",
    howToSchedule: "Pelan belajar mingguan anda, dibahagikan kepada tugasan harian. Ketik tugasan untuk tandai selesai.",
    howToPractice: "Latihan yang dijana AI daripada teks Jepun yang anda tampal (artikel, sari kata, kapsyen) — merangkumi kosa kata, kanji, tatabahasa, bacaan, pendengaran, perbualan dan sebutan. Ketik 'Tunjuk jawapan' untuk semak.",
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
    listenAudio: "Dengar",
    recordVoice: "Rakam",
    recordingInProgress: "Merakam...",
    yourSpokenAnswer: "Jawapan lisan anda:",
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
    contentTitle: "CIPTA DARIPADA KANDUNGAN",
    contentDesc: "Tampal teks Jepun yang anda sedang baca atau tonton — artikel, sari kata/penerangan video, kapsyen, mesej — dan GAKU akan membina aktiviti peringkat {jlpt} daripadanya, sama seperti GAKU Reader lakukan di web.",
    contentPlaceholder: "Tampal teks Jepun, sari kata atau kapsyen di sini",
    contentAnalyzing: "Menganalisis kandungan...",
    contentAnalyzeAgain: "Analisis semula",
    contentAnalyzeButton: "Analisis & Jana Aktiviti",
    contentErrEmpty: "Tampal dahulu beberapa teks Jepun (atau sari kata/penerangan video).",
    contentErrNoAct: "Tidak dapat menjana aktiviti daripada kandungan itu. Cuba tampal lebih banyak teks.",
    contentErrGeneric: "Tidak dapat menganalisis kandungan ini sekarang. Sila cuba lagi.",
    convTitle: "Latihan Perbualan",
    convDesc: "Tampal sari kata atau transkrip video (cth. panel “Tunjuk transkrip” milik YouTube). GAKU akan mencari pertukaran perbualan sebenar dan membenarkan anda meramal — serta menyebut — baris seterusnya sebelum mendedahkan jawapan model.",
    convPasteLabel: "Tampal sari kata / transkrip di sini",
    convGenerating: "Membina latihan perbualan...",
    convGenerateBtn: "Bina Latihan Perbualan",
    convNoTurns: "Tidak dapat menjumpai perbualan dalam kandungan itu. Cuba tampal transkrip dengan lebih banyak dialog.",
    convYourTurn: "Bagaimana anda akan menjawab?",
    convRevealBtn: "Tunjuk jawapan model",
    convModelAnswer: "Jawapan model",
    convAltResponses: "Cara lain untuk mengatakannya",
    translateBtn: "Terjemah",
    subtitlesTitle: "Sari Kata → Kosa Kata",
    subtitlesDesc: "Tampal sari kata atau transkrip daripada video yang sedang anda tonton (cth. panel \"Show transcript\" YouTube sendiri). Dwiklik satu perkataan atau seret untuk memilih frasa, kemudian cari dan simpan terus ke Pembina Kosa Kata anda.",
    subtitlesSourceLabel: "Tajuk / sumber video (pilihan — digunakan sebagai nama folder)",
    subtitlesSourcePlaceholder: "cth. NHK news 7/2",
    subtitlesPasteLabel: "Tampal sari kata / transkrip di sini",
    subtitlesPastePlaceholder: "Tampal teks biasa atau kandungan fail .srt — cap masa dan nombor isyarat akan dibuang secara automatik.",
    subtitlesLoadBtn: "Muatkan transkrip",
    subtitlesCopyrightNote: "🔒 Teks yang anda tampal di sini hanya disimpan dalam storan tempatan pelayar ini, supaya anda boleh menyambung semula kemudian — ia tidak pernah dihantar ke pelayan. Hanya perkataan/frasa tertentu yang anda pilih untuk disimpan akan ditambah ke Pembina Kosa Kata anda.",
    subtitlesDefaultFolder: "Sari Kata",
    subtitlesLoadNew: "↺ Muatkan transkrip lain",
    subtitlesSavedCount: "Disimpan dalam sesi ini:",
    subtitlesLookupSaveBtn: "🔍 Cari & simpan",
    subtitlesTooLong: "Pilihan itu terlalu panjang — sila pilih perkataan atau frasa yang lebih pendek (bawah ~60 aksara).",
    subtitlesSavedTo: "disimpan ke",
    subtitlesLookupError: "Carian gagal. Sila cuba lagi.",
    resAnkiPronDesc: "Bina pengecaman fonetik dengan kad imbas audio. CLT: dengar dan ulang.",
    resMisaPronDesc: "Ayat contoh praktikal dan latihan sebutan. Berfokuskan CLT.",
    resOnomappuPronDesc: "Penerangan dalam bahasa Jepun sahaja. Input Boleh Difahami — keserasian CLT sangat tinggi.",
},

  "Indonesian": {
    gakuSelfStudy: "GAKU BELAJAR MANDIRI",
    studyPlan: "Rencana belajar",
    help: "🆘 Bantuan",
    editProfile: "✏️ Edit profil",
    weeklyProgress: "Kemajuan mingguan",
    tabSchedule: "📅 Jadwal",
    tabPractice: "✨ Dari Konten",
    tabVocabulary: "📚 Kosakata",
    tabResources: "🔗 Sumber",
    tabMilestones: "🏆 Pencapaian",
    tabSubtitles: "🎬 Subtitle",
    navGoConversation: "💬 Menuju Latihan Percakapan",
    navGoSubtitles: "📺 Menuju Subtitle",
    navGoContent: "✨ Menuju Latihan dari Konten",
    navGoVocabulary: "📚 Menuju Kosakata",
    savedSetFound: "Anda memiliki set belajar yang tersimpan sebelumnya.",
    resumeStudySet: "▶ Lanjutkan belajar",
    resetStudySet: "Atur ulang",
    flashcardNoWords: "Belum ada kata yang disimpan. Cari dan simpan kata terlebih dahulu!",
    flashcardNoWordsInFolder: "Tidak ada kata di folder ini",
    flashcardResumePrompt: "Terakhir kali Anda berhenti di {pos} / {total}. Lanjutkan?",
    flashcardResume: "▶ Lanjutkan",
    flashcardStartAgain: "🔄 Mulai lagi",
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
    currentJlpt: "TINGKAT PERKIRAAN BAHASA JEPANG SAAT INI *",
    autoFilled: "Terisi otomatis dari tes Anda",
    changeLevel: "Jika Anda ingin mengubah level, silakan pilih di bawah.",
    selectLevel: "Pilih level",
    beginner: "Pemula",
    levelElementary: "Dasar",
    levelIntermediate: "Menengah",
    levelUpperIntermediate: "Menengah Atas",
    levelAdvanced: "Mahir",
    levelMastery: "Penguasaan",
    levelUpPrompt: "Kamu memahami hampir semuanya di sini! Apakah kamu ingin meningkatkan ke level yang lebih tinggi?",
    chooseNewLevel: "Pilih level barumu:",
    currentLevelLabel: "Level saat ini:",
    yes: "Ya",
    no: "Tidak",
    didYouUnderstand: "Apakah kamu memahami ini?",
    hideAnswerBtn: "Sembunyikan jawaban",
    showAnswerBtn: "Tampilkan jawaban",
    furiganaOn: "Aktif",
    furiganaOff: "Nonaktif",
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
    skillOnlyHiragana: "あ Hanya Hiragana", skillOnlyKatakana: "ア Hanya Katakana",
    howToTitle: "Cara menggunakan aplikasi ini",
    howToSchedule: "Rencana belajar mingguan Anda, dibagi menjadi tugas harian. Ketuk tugas untuk menandainya selesai.",
    howToPractice: "Latihan yang dihasilkan AI dari teks Jepang yang Anda tempel (artikel, subtitle, keterangan) — mencakup kosakata, kanji, tata bahasa, membaca, mendengarkan, percakapan, dan pengucapan. Ketuk 'Tampilkan jawaban' untuk memeriksa.",
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
    listenAudio: "Dengarkan",
    recordVoice: "Rekam",
    recordingInProgress: "Merekam...",
    yourSpokenAnswer: "Jawaban lisan Anda:",
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
    contentTitle: "BUAT DARI KONTEN",
    contentDesc: "Tempel teks bahasa Jepang yang sedang Anda baca atau tonton — artikel, subtitle/deskripsi video, keterangan, pesan — dan GAKU akan membuat aktivitas level {jlpt} darinya, seperti yang dilakukan GAKU Reader di web.",
    contentPlaceholder: "Tempel teks bahasa Jepang, subtitle, atau keterangan di sini",
    contentAnalyzing: "Menganalisis konten...",
    contentAnalyzeAgain: "Analisis lagi",
    contentAnalyzeButton: "Analisis & Buat Aktivitas",
    contentErrEmpty: "Tempel dulu teks bahasa Jepang (atau subtitle/deskripsi video).",
    contentErrNoAct: "Tidak dapat membuat aktivitas dari konten tersebut. Coba tempel lebih banyak teks.",
    contentErrGeneric: "Tidak dapat menganalisis konten ini sekarang. Silakan coba lagi.",
    convTitle: "Latihan Percakapan",
    convDesc: "Tempel subtitle atau transkrip video (mis. panel “Tampilkan transkrip” milik YouTube). GAKU akan menemukan pertukaran percakapan nyata dan membiarkan Anda memprediksi — serta mengucapkan — baris berikutnya sebelum mengungkap jawaban model.",
    convPasteLabel: "Tempel subtitle / transkrip di sini",
    convGenerating: "Membangun latihan percakapan...",
    convGenerateBtn: "Buat Latihan Percakapan",
    convNoTurns: "Tidak dapat menemukan percakapan dalam konten tersebut. Coba tempel transkrip dengan lebih banyak dialog.",
    convYourTurn: "Bagaimana Anda akan menjawab?",
    convRevealBtn: "Tampilkan jawaban model",
    convModelAnswer: "Jawaban model",
    convAltResponses: "Cara lain untuk mengatakannya",
    translateBtn: "Terjemahkan",
    subtitlesTitle: "Subtitle → Kosakata",
    subtitlesDesc: "Tempel subtitle atau transkrip dari video yang sedang Anda tonton (mis. panel \"Show transcript\" bawaan YouTube). Klik dua kali pada sebuah kata atau seret untuk memilih frasa, lalu cari dan simpan langsung ke Pembangun Kosakata Anda.",
    subtitlesSourceLabel: "Judul / sumber video (opsional — digunakan sebagai nama folder)",
    subtitlesSourcePlaceholder: "mis. NHK news 7/2",
    subtitlesPasteLabel: "Tempel subtitle / transkrip di sini",
    subtitlesPastePlaceholder: "Tempel teks biasa atau isi file .srt — stempel waktu dan nomor urut akan dihapus otomatis.",
    subtitlesLoadBtn: "Muat transkrip",
    subtitlesCopyrightNote: "🔒 Teks yang Anda tempel di sini hanya disimpan di penyimpanan lokal browser ini, agar Anda bisa melanjutkan nanti — tidak pernah dikirim ke server. Hanya kata/frasa tertentu yang Anda pilih untuk disimpan yang akan ditambahkan ke Pembangun Kosakata Anda.",
    subtitlesDefaultFolder: "Subtitle",
    subtitlesLoadNew: "↺ Muat transkrip lain",
    subtitlesSavedCount: "Disimpan dalam sesi ini:",
    subtitlesLookupSaveBtn: "🔍 Cari & simpan",
    subtitlesTooLong: "Pilihan itu terlalu panjang — silakan pilih kata atau frasa yang lebih pendek (di bawah ~60 karakter).",
    subtitlesSavedTo: "disimpan ke",
    subtitlesLookupError: "Pencarian gagal. Silakan coba lagi.",
    resAnkiPronDesc: "Bangun pengenalan fonetik dengan flashcard audio. CLT: dengarkan dan ulangi.",
    resMisaPronDesc: "Kalimat contoh praktis dan latihan pengucapan. Berfokus pada CLT.",
    resOnomappuPronDesc: "Penjelasan hanya dalam bahasa Jepang. Input yang Dapat Dipahami — kompatibilitas CLT sangat tinggi.",
},

  "Vietnamese": {
    gakuSelfStudy: "GAKU TỰ HỌC",
    studyPlan: "Kế hoạch học tập",
    help: "🆘 Trợ giúp",
    editProfile: "✏️ Chỉnh sửa hồ sơ",
    weeklyProgress: "Tiến độ hàng tuần",
    tabSchedule: "📅 Lịch học",
    tabPractice: "✨ Từ nội dung",
    tabVocabulary: "📚 Từ vựng",
    tabResources: "🔗 Tài liệu",
    tabMilestones: "🏆 Mục tiêu",
    tabSubtitles: "🎬 Phụ đề",
    navGoConversation: "💬 Đến phần Luyện hội thoại",
    navGoSubtitles: "📺 Đến phần Phụ đề",
    navGoContent: "✨ Đến phần Luyện từ nội dung",
    navGoVocabulary: "📚 Đến phần Từ vựng",
    savedSetFound: "Bạn có một bộ học đã lưu từ trước.",
    resumeStudySet: "▶ Tiếp tục học",
    resetStudySet: "Đặt lại",
    flashcardNoWords: "Chưa có từ nào được lưu. Hãy tìm kiếm và lưu từ trước!",
    flashcardNoWordsInFolder: "Không có từ nào trong thư mục này",
    flashcardResumePrompt: "Lần trước bạn dừng ở {pos} / {total}. Tiếp tục chứ?",
    flashcardResume: "▶ Tiếp tục",
    flashcardStartAgain: "🔄 Bắt đầu lại",
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
    currentJlpt: "CẤP ĐỘ ƯỚC TÍNH TIẾNG NHẬT HIỆN TẠI *",
    autoFilled: "Tự động điền từ bài kiểm tra của bạn",
    changeLevel: "Nếu bạn muốn thay đổi cấp độ, vui lòng chọn bên dưới.",
    selectLevel: "Chọn cấp độ",
    beginner: "Người mới bắt đầu",
    levelElementary: "Sơ cấp",
    levelIntermediate: "Trung cấp",
    levelUpperIntermediate: "Trung cấp cao",
    levelAdvanced: "Cao cấp",
    levelMastery: "Thành thạo",
    levelUpPrompt: "Bạn đã hiểu gần như mọi thứ ở đây! Bạn có muốn nâng cấp lên cấp độ cao hơn không?",
    chooseNewLevel: "Chọn cấp độ mới của bạn:",
    currentLevelLabel: "Cấp độ hiện tại:",
    yes: "Có",
    no: "Không",
    didYouUnderstand: "Bạn có hiểu điều này không?",
    hideAnswerBtn: "ᮨn đáp án",
    showAnswerBtn: "Hiện đáp án",
    furiganaOn: "Bật",
    furiganaOff: "Tắt",
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
    skillOnlyHiragana: "あ Chỉ Hiragana", skillOnlyKatakana: "ア Chỉ Katakana",
    howToTitle: "Cách sử dụng ứng dụng này",
    howToSchedule: "Kế hoạch học hàng tuần của bạn, chia thành các nhiệm vụ hàng ngày. Nhấn nhiệm vụ để đánh dấu hoàn thành.",
    howToPractice: "Bài tập do AI tạo từ văn bản tiếng Nhật bạn dán vào (bài viết, phụ đề, chú thích) — bao gồm từ vựng, kanji, ngữ pháp, đọc hiểu, nghe, hội thoại và phát âm. Nhấn 'Hiện đáp án' để kiểm tra.",
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
    listenAudio: "Nghe",
    recordVoice: "Ghi âm",
    recordingInProgress: "Đang ghi âm...",
    yourSpokenAnswer: "Câu trả lời nói của bạn:",
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
    contentTitle: "TẠO TỪ NỘI DUNG",
    contentDesc: "Dán văn bản tiếng Nhật bạn đang đọc hoặc xem — một bài báo, phụ đề/mô tả video, chú thích, tin nhắn — và GAKU sẽ tạo các hoạt động cấp độ {jlpt} từ đó, giống như GAKU Reader làm trên web.",
    contentPlaceholder: "Dán văn bản tiếng Nhật, phụ đề hoặc chú thích vào đây",
    contentAnalyzing: "Đang phân tích nội dung...",
    contentAnalyzeAgain: "Phân tích lại",
    contentAnalyzeButton: "Phân tích & Tạo hoạt động",
    contentErrEmpty: "Vui lòng dán văn bản tiếng Nhật (hoặc phụ đề/mô tả video) trước.",
    contentErrNoAct: "Không thể tạo hoạt động từ nội dung đó. Hãy thử dán thêm văn bản.",
    contentErrGeneric: "Hiện không thể phân tích nội dung này. Vui lòng thử lại.",
    convTitle: "Luyện Tập Hội Thoại",
    convDesc: "Dán phụ đề hoặc bản ghi của video (ví dụ: bảng “Hiển thị bản ghi” của YouTube). GAKU sẽ tìm các đoạn hội thoại thực và cho bạn dự đoán — và nói ra — câu tiếp theo trước khi hiển thị câu trả lời mẫu.",
    convPasteLabel: "Dán phụ đề / bản ghi vào đây",
    convGenerating: "Đang xây dựng bài luyện hội thoại...",
    convGenerateBtn: "Tạo Bài Luyện Hội Thoại",
    convNoTurns: "Không tìm thấy hội thoại trong nội dung đó. Hãy thử dán bản ghi có nhiều hội thoại hơn.",
    convYourTurn: "Bạn sẽ trả lời như thế nào?",
    convRevealBtn: "Hiển thị câu trả lời mẫu",
    convModelAnswer: "Câu trả lời mẫu",
    convAltResponses: "Các cách nói khác",
    translateBtn: "Dịch",
    subtitlesTitle: "Phụ đề → Từ vựng",
    subtitlesDesc: "Dán phụ đề hoặc bản ghi lời thoại từ video bạn đang xem (ví dụ: bảng \"Show transcript\" có sẵn của YouTube). Nhấp đúp vào một từ hoặc kéo để chọn cụm từ, sau đó tra cứu và lưu trực tiếp vào Trình xây dựng từ vựng của bạn.",
    subtitlesSourceLabel: "Tiêu đề / nguồn video (tùy chọn — dùng làm tên thư mục)",
    subtitlesSourcePlaceholder: "vd. NHK news 7/2",
    subtitlesPasteLabel: "Dán phụ đề / bản ghi lời thoại vào đây",
    subtitlesPastePlaceholder: "Dán văn bản thuần túy hoặc nội dung tệp .srt — dấu thời gian và số thứ tự sẽ tự động bị xóa.",
    subtitlesLoadBtn: "Tải bản ghi lời thoại",
    subtitlesCopyrightNote: "🔒 Văn bản bạn dán ở đây chỉ được lưu trong bộ nhớ cục bộ của trình duyệt này để bạn có thể tiếp tục sau — không bao giờ được gửi đến máy chủ. Chỉ những từ/cụm từ cụ thể bạn chọn lưu mới được thêm vào Trình xây dựng từ vựng của bạn.",
    subtitlesDefaultFolder: "Phụ đề",
    subtitlesLoadNew: "↺ Tải bản ghi lời thoại khác",
    subtitlesSavedCount: "Đã lưu trong phiên này:",
    subtitlesLookupSaveBtn: "🔍 Tra cứu & lưu",
    subtitlesTooLong: "Lựa chọn này quá dài — vui lòng chọn từ hoặc cụm từ ngắn hơn (dưới ~60 ký tự).",
    subtitlesSavedTo: "đã lưu vào",
    subtitlesLookupError: "Tra cứu thất bại. Vui lòng thử lại.",
    resAnkiPronDesc: "Xây dựng khả năng nhận diện ngữ âm bằng thẻ ghi nhớ có âm thanh. CLT: nghe và lặp lại.",
    resMisaPronDesc: "Câu ví dụ thực tế và bài luyện phát âm. Tập trung vào CLT.",
    resOnomappuPronDesc: "Giải thích hoàn toàn bằng tiếng Nhật. Đầu vào dễ hiểu — độ tương thích CLT rất cao.",
},

  "Hindi": {
    gakuSelfStudy: "GAKU स्व-अध्ययन",
    studyPlan: "अध्ययन योजना",
    help: "🆘 सहायता",
    editProfile: "✏️ प्रोफ़ाइल संपादित करें",
    weeklyProgress: "साप्ताहिक प्रगति",
    tabSchedule: "📅 समय-सारणी",
    tabPractice: "✨ सामग्री से",
    tabVocabulary: "📚 शब्दावली",
    tabResources: "🔗 संसाधन",
    tabMilestones: "🏆 लक्ष्य",
    tabSubtitles: "🎬 सबटाइटल",
    navGoConversation: "💬 वार्तालाप अभ्यास पर जाएं",
    navGoSubtitles: "📺 सबटाइटल पर जाएं",
    navGoContent: "✨ सामग्री अभ्यास पर जाएं",
    navGoVocabulary: "📚 शब्दावली पर जाएं",
    savedSetFound: "आपके पास पहले से सहेजा गया अध्ययन सेट है।",
    resumeStudySet: "▶ अध्ययन जारी रखें",
    resetStudySet: "रीसेट करें",
    flashcardNoWords: "अभी तक कोई सहेजा गया शब्द नहीं है। पहले शब्द खोजें और सहेजें!",
    flashcardNoWordsInFolder: "इस फ़ोल्डर में कोई शब्द नहीं है",
    flashcardResumePrompt: "पिछली बार आप {pos} / {total} पर रुके थे। जारी रखें?",
    flashcardResume: "▶ जारी रखें",
    flashcardStartAgain: "🔄 फिर से शुरू करें",
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
    currentJlpt: "वर्तमान जापानी अनुमानित स्तर *",
    autoFilled: "आपके परीक्षण से स्वतः भरा गया",
    changeLevel: "यदि आप अपना स्तर बदलना चाहते हैं, तो नीचे चुनें।",
    selectLevel: "स्तर चुनें",
    beginner: "शुरुआती",
    levelElementary: "प्रारंभिक",
    levelIntermediate: "मध्यम",
    levelUpperIntermediate: "उच्च मध्यम",
    levelAdvanced: "उन्नत",
    levelMastery: "निपुणता",
    levelUpPrompt: "आप यहाँ लगभग सब कुछ समझ रहे हैं! क्या आप अपने स्तर को उच्च स्तर पर अपडेट करना चाहेंगे?",
    chooseNewLevel: "अपना नया स्तर चुनें:",
    currentLevelLabel: "वर्तमान स्तर:",
    yes: "हाँ",
    no: "नहीं",
    didYouUnderstand: "क्या आपने इसे समझा?",
    hideAnswerBtn: "उत्तर छिपाएं",
    showAnswerBtn: "उत्तर दिखाएं",
    furiganaOn: "चालू",
    furiganaOff: "बंद",
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
    skillOnlyHiragana: "あ केवल हिरागाना", skillOnlyKatakana: "ア केवल काताकाना",
    howToTitle: "इस ऐप का उपयोग कैसे करें",
    howToSchedule: "आपकी साप्ताहिक अध्ययन योजना, दैनिक कार्यों में विभाजित। साप्ताहिक प्रगति ट्रैक करने के लिए कार्य टैप करें।",
    howToPractice: "आपके द्वारा पेस्ट किए गए जापानी टेक्स्ट (लेख, सबटाइटल, कैप्शन) से AI-जनित अभ्यास — शब्दावली, कांजी, व्याकरण, पठन, श्रवण, बातचीत और उच्चारण को कवर करता है। जांचने के लिए 'उत्तर दिखाएं' टैप करें।",
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
    listenAudio: "सुनें",
    recordVoice: "रिकॉर्ड करें",
    recordingInProgress: "रिकॉर्डिंग हो रही है...",
    yourSpokenAnswer: "आपका बोला गया उत्तर:",
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
    contentTitle: "सामग्री से बनाएं",
    contentDesc: "आप जो जापानी टेक्स्ट पढ़ रहे या देख रहे हैं उसे पेस्ट करें — एक लेख, वीडियो सबटाइटल/विवरण, कैप्शन, संदेश — और GAKU इससे {jlpt} स्तर की गतिविधियां बनाएगा, ठीक वैसे जैसे GAKU Reader वेब पर करता है।",
    contentPlaceholder: "यहाँ जापानी टेक्स्ट, सबटाइटल या कैप्शन पेस्ट करें",
    contentAnalyzing: "सामग्री का विश्लेषण हो रहा है...",
    contentAnalyzeAgain: "फिर से विश्लेषण करें",
    contentAnalyzeButton: "विश्लेषण करें और गतिविधियां बनाएं",
    contentErrEmpty: "पहले कुछ जापानी टेक्स्ट (या वीडियो के सबटाइटल/विवरण) पेस्ट करें।",
    contentErrNoAct: "उस सामग्री से गतिविधियां नहीं बनाई जा सकीं। अधिक टेक्स्ट पेस्ट करने का प्रयास करें।",
    contentErrGeneric: "अभी इस सामग्री का विश्लेषण नहीं हो सका। कृपया पुनः प्रयास करें।",
    convTitle: "वार्तालाप अभ्यास",
    convDesc: "वीडियो के सबटाइटल या ट्रांसक्रिप्ट पेस्ट करें (जैसे YouTube का अपना “ट्रांसक्रिप्ट दिखाएं” पैनल)। GAKU वास्तविक वार्तालाप आदान-प्रदान ढूंढेगा और मॉडल उत्तर दिखाने से पहले आपको अगली पंक्ति का अनुमान लगाने — और बोलकर कहने — देगा।",
    convPasteLabel: "यहाँ सबटाइटल / ट्रांसक्रिप्ट पेस्ट करें",
    convGenerating: "वार्तालाप अभ्यास बन रहा है...",
    convGenerateBtn: "वार्तालाप अभ्यास बनाएं",
    convNoTurns: "उस सामग्री में कोई वार्तालाप नहीं मिला। अधिक संवाद वाला ट्रांसक्रिप्ट पेस्ट करने का प्रयास करें।",
    convYourTurn: "आप कैसे जवाब देंगे?",
    convRevealBtn: "मॉडल उत्तर दिखाएं",
    convModelAnswer: "मॉडल उत्तर",
    convAltResponses: "इसे कहने के अन्य तरीके",
    translateBtn: "अनुवाद करें",
    subtitlesTitle: "सबटाइटल → शब्दावली",
    subtitlesDesc: "आप जो वीडियो पहले से देख रहे हैं उसके सबटाइटल या ट्रांसक्रिप्ट पेस्ट करें (जैसे YouTube का अपना \"Show transcript\" पैनल)। किसी शब्द पर डबल-क्लिक करें या वाक्यांश चुनने के लिए खींचें, फिर उसे खोजें और सीधे अपने वोकैबुलरी बिल्डर में सहेजें।",
    subtitlesSourceLabel: "वीडियो शीर्षक / स्रोत (वैकल्पिक — फ़ोल्डर नाम के रूप में उपयोग किया जाता है)",
    subtitlesSourcePlaceholder: "जैसे NHK news 7/2",
    subtitlesPasteLabel: "यहाँ सबटाइटल / ट्रांसक्रिप्ट पेस्ट करें",
    subtitlesPastePlaceholder: "सादा टेक्स्ट या .srt फ़ाइल की सामग्री पेस्ट करें — टाइमस्टैम्प और क्यू नंबर स्वचालित रूप से हटा दिए जाते हैं।",
    subtitlesLoadBtn: "ट्रांसक्रिप्ट लोड करें",
    subtitlesCopyrightNote: "🔒 आप यहाँ जो टेक्स्ट पेस्ट करते हैं वह केवल इस ब्राउज़र के लोकल स्टोरेज में सहेजा जाता है, ताकि आप बाद में जारी रख सकें — यह कभी भी सर्वर पर नहीं भेजा जाता। केवल वे विशिष्ट शब्द/वाक्यांश जिन्हें आप सहेजना चुनते हैं, आपके वोकैबुलरी बिल्डर में जोड़े जाते हैं।",
    subtitlesDefaultFolder: "सबटाइटल",
    subtitlesLoadNew: "↺ कोई अन्य ट्रांसक्रिप्ट लोड करें",
    subtitlesSavedCount: "इस सत्र में सहेजे गए:",
    subtitlesLookupSaveBtn: "🔍 खोजें और सहेजें",
    subtitlesTooLong: "यह चयन बहुत लंबा है — कृपया एक छोटा शब्द या वाक्यांश चुनें (~60 अक्षरों से कम)।",
    subtitlesSavedTo: "में सहेजा गया",
    subtitlesLookupError: "खोज विफल रही। कृपया पुनः प्रयास करें।",
    resAnkiPronDesc: "ऑडियो फ्लैशकार्ड से ध्वन्यात्मक पहचान विकसित करें। CLT: सुनें और दोहराएं।",
    resMisaPronDesc: "व्यावहारिक उदाहरण वाक्य और उच्चारण अभ्यास। CLT-केंद्रित।",
    resOnomappuPronDesc: "केवल जापानी में स्पष्टीकरण। समझने योग्य इनपुट — CLT अनुकूलता बहुत अधिक।",
},

  "Japanese": {
    gakuSelfStudy: "GAKU 自習",
    studyPlan: "学習プラン",
    help: "🆘 ヘルプ",
    editProfile: "✏️ プロフィール編集",
    weeklyProgress: "週間進捗",
    tabSchedule: "📅 スケジュール",
    tabPractice: "✨ コンテンツから",
    tabVocabulary: "📚 単語帳",
    tabResources: "🔗 リソース",
    tabMilestones: "🏆 目標",
    tabSubtitles: "🎬 字幕帳",
    navGoConversation: "💬 会話プラクティスへ",
    navGoSubtitles: "📺 字幕帳へ",
    navGoContent: "✨ コンテンツからへ",
    navGoVocabulary: "📚 単語帳へ",
    savedSetFound: "前回保存した学習セットがあります。",
    resumeStudySet: "▶ 続きから再開",
    resetStudySet: "リセット",
    flashcardNoWords: "保存された単語がまだありません。まず単語を検索して保存してください！",
    flashcardNoWordsInFolder: "このフォルダに単語がありません",
    flashcardResumePrompt: "前回 {pos} / {total} で中断しています。続けますか？",
    flashcardResume: "▶ 続きから再開",
    flashcardStartAgain: "🔄 最初から",
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
    currentJlpt: "現在の日本語レベル評価 *",
    autoFilled: "テストから自動入力されました",
    changeLevel: "レベルを変更したい場合は下から選択してください。",
    selectLevel: "レベルを選択",
    beginner: "初心者",
    levelElementary: "初級",
    levelIntermediate: "中級",
    levelUpperIntermediate: "中上級",
    levelAdvanced: "上級",
    levelMastery: "熟達",
    levelUpPrompt: "ここではほとんど理解できていますね！レベルを上げてみますか？",
    chooseNewLevel: "新しいレベルを選択してください：",
    currentLevelLabel: "現在のレベル：",
    yes: "はい",
    no: "いいえ",
    didYouUnderstand: "これは理解できましたか？",
    hideAnswerBtn: "答えを隠す",
    showAnswerBtn: "答えを表示",
    furiganaOn: "オン",
    furiganaOff: "オフ",
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
    skillOnlyHiragana: "あ ひらがなのみ", skillOnlyKatakana: "ア カタカナのみ",
    howToTitle: "このアプリの使い方",
    howToSchedule: "週間学習プランを日々のタスクに分割しています。タスクをタップして完了をマークし、週間進捗を追跡します。",
    howToPractice: "貼り付けた日本語テキスト（記事・字幕・キャプション）から生成されるAI練習問題です。語彙・漢字・文法・読解・リスニング・会話・発音をカバーします。「答えを見る」をタップして確認できます。",
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
    listenAudio: "聞く",
    recordVoice: "録音",
    recordingInProgress: "録音中...",
    yourSpokenAnswer: "あなたの発話：",
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
    contentTitle: "コンテンツから作成",
    contentDesc: "読んでいる、または見ている日本語のテキストを貼り付けてください — 記事、動画の字幕・概要欄、キャプション、メッセージなど — GAKUがそこから{jlpt}レベルの練習問題を作成します。ウェブ版のGAKU Readerと同じ仅組みです。",
    contentPlaceholder: "日本語のテキスト、字幕、キャプションをここに貼り付けてください",
    contentAnalyzing: "コンテンツを分析中...",
    contentAnalyzeAgain: "もう一度分析する",
    contentAnalyzeButton: "分析して練習問題を作成",
    contentErrEmpty: "先に日本語のテキスト（または動画の字幕・概要欄）を貼り付けてください。",
    contentErrNoAct: "この内容から練習問題を作成できませんでした。もっと長いテキストを貼り付けてみてください。",
    contentErrGeneric: "現在この内容を分析できませんでした。もう一度お試しください。",
    convTitle: "会話プラクティス",
    convDesc: "動画の字幕やトランスクリプトを貼り付けてください（例：YouTubeの「トランスクリプトを表示」パネル）。GAKUが実際の会話のやり取りを見つけ、模範回答を見る前に次のセリフを予想して——声に出して——もらえます。",
    convPasteLabel: "ここに字幕・トランスクリプトを貼り付けてください",
    convGenerating: "会話プラクティスを作成中...",
    convGenerateBtn: "会話プラクティスを作成",
    convNoTurns: "この内容から会話を見つけられませんでした。会話がもっと含まれるトランスクリプトを貼り付けてみてください。",
    convYourTurn: "あなたならどう答えますか？",
    convRevealBtn: "模範回答を見る",
    convModelAnswer: "模範回答",
    convAltResponses: "他の言い方",
    translateBtn: "翻訳",
    subtitlesTitle: "字幕→単語帳",
    subtitlesDesc: "すでに視聴している動画の字幕やトランスクリプトを貼り付けてください（例：YouTube自体の「トランスクリプトを表示」パネル）。単語をダブルクリックするか、ドラッグしてフレーズを選択し、調べてそのまま単語ビルダーに保存できます。",
    subtitlesSourceLabel: "動画タイトル／出典（任意 — フォルダ名として使用されます）",
    subtitlesSourcePlaceholder: "例：NHK news 7/2",
    subtitlesPasteLabel: "ここに字幕／トランスクリプトを貼り付けてください",
    subtitlesPastePlaceholder: "プレーンテキストまたは.srtファイルの内容を貼り付けてください — タイムスタンプと通し番号は自動的に削除されます。",
    subtitlesLoadBtn: "トランスクリプトを読み込む",
    subtitlesCopyrightNote: "🔒 ここに貼り付けたテキストは、後で再開できるようこのブラウザのローカルストレージにのみ保存され、サーバーに送信されることはありません。保存を選択した特定の単語／フレーズのみが単語ビルダーに追加されます。",
    subtitlesDefaultFolder: "字幕",
    subtitlesLoadNew: "↺ 別のトランスクリプトを読み込む",
    subtitlesSavedCount: "今回のセッションで保存済み：",
    subtitlesLookupSaveBtn: "🔍 調べて保存",
    subtitlesTooLong: "選択範囲が長すぎます — もっと短い単語やフレーズを選んでください（約60文字以内）。",
    subtitlesSavedTo: "保存先：",
    subtitlesLookupError: "検索に失敗しました。もう一度お試しください。",
    resAnkiPronDesc: "音声フラッシュカードで音の聞き分け力を鍛えます。CLT：聞いて繰り返す。",
    resMisaPronDesc: "実用的な例文と発音練習。CLT重視。",
    resOnomappuPronDesc: "日本語のみでの解説。理解可能なインプット — CLT適合性が非常に高い。",
},

  "Turkish": {
    gakuSelfStudy: "GAKU KENDİ KENDİNE ÇALIŞMA",
    studyPlan: "Çalışma planı",
    help: "🆘 Yardım",
    editProfile: "✏️ Profili düzenle",
    weeklyProgress: "Haftalık ilerleme",
    tabSchedule: "📅 Program",
    tabPractice: "✨ İçerikten",
    tabVocabulary: "📚 Kelime Bilgisi",
    tabResources: "🔗 Kaynaklar",
    tabMilestones: "🏆 Hedefler",
    tabSubtitles: "🎬 Altyazı",
    navGoConversation: "💬 Konuşma Pratiğine Git",
    navGoSubtitles: "📺 Altyazılara Git",
    navGoContent: "✨ İçerikten Pratiğe Git",
    navGoVocabulary: "📚 Kelime Dağarcığına Git",
    savedSetFound: "Daha önce kaydedilmiş bir çalışma setiniz var.",
    resumeStudySet: "▶ Çalışmaya devam et",
    resetStudySet: "Sıfırla",
    flashcardNoWords: "Henüz kaydedilmiş kelime yok. Önce kelime arayıp kaydedin!",
    flashcardNoWordsInFolder: "Bu klasörde kelime yok",
    flashcardResumePrompt: "Son seferinde {pos} / {total} noktasında durdunuz. Devam edilsin mi?",
    flashcardResume: "▶ Devam et",
    flashcardStartAgain: "🔄 Baştan başla",
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
    currentJlpt: "MEVCUT JAPONCA TAHMİNİ SEVİYE *",
    autoFilled: "Testinizden otomatik dolduruldu",
    changeLevel: "Seviyenizi değiştirmek isterseniz aşağıdan seçin.",
    selectLevel: "Seviye seç",
    beginner: "Başlangıç",
    levelElementary: "Temel",
    levelIntermediate: "Orta",
    levelUpperIntermediate: "Üst Orta",
    levelAdvanced: "İleri",
    levelMastery: "Ustalık",
    levelUpPrompt: "Burada neredeyse her şeyi anlıyorsunuz! Seviyenizi daha yükseğe güncellemek ister misiniz?",
    chooseNewLevel: "Yeni seviyenizi seçin:",
    currentLevelLabel: "Mevcut seviye:",
    yes: "Evet",
    no: "Hayır",
    didYouUnderstand: "Bunu anladınız mı?",
    hideAnswerBtn: "Cevabı gizle",
    showAnswerBtn: "Cevabı göster",
    furiganaOn: "Açık",
    furiganaOff: "Kapalı",
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
    skillOnlyHiragana: "あ Sadece Hiragana", skillOnlyKatakana: "ア Sadece Katakana",
    howToTitle: "Bu uygulama nasıl kullanılır",
    howToSchedule: "Günlük görevlere bölünmüş haftalık çalışma planınız. Tamamlandı olarak işaretlemek için bir göreve dokunun.",
    howToPractice: "Yapıştırdığınız Japonca metinden (makale, altyazı, açıklama) AI tarafından oluşturulan alıştırmalar — kelime, kanji, dilbilgisi, okuma, dinleme, konuşma ve telaffuzu kapsar. Kontrol etmek için 'Cevabı göster'e dokunun.",
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
    listenAudio: "Dinle",
    recordVoice: "Kaydet",
    recordingInProgress: "Kaydediliyor...",
    yourSpokenAnswer: "Sözlü cevabınız:",
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
    contentTitle: "İÇERİKTEN OLUŞTUR",
    contentDesc: "Okuduğunuz veya izlediğiniz Japonca metni yapıştırın — bir makale, video altyazısı/açıklaması, bir başlık, bir mesaj — ve GAKU, tıpkı web'de GAKU Reader'ın yaptığı gibi bundan {jlpt} seviyesinde etkinlikler oluşturacak.",
    contentPlaceholder: "Buraya Japonca metin, altyazı veya başlık yapıştırın",
    contentAnalyzing: "İçerik analiz ediliyor...",
    contentAnalyzeAgain: "Tekrar analiz et",
    contentAnalyzeButton: "Analiz Et ve Etkinlik Oluştur",
    contentErrEmpty: "Önce biraz Japonca metin (veya bir videonun altyazısı/açıklaması) yapıştırın.",
    contentErrNoAct: "Bu içerikten etkinlik oluşturulamadı. Daha fazla metin yapıştırmayı deneyin.",
    contentErrGeneric: "Bu içerik şu anda analiz edilemedi. Lütfen tekrar deneyin.",
    convTitle: "Konuşma Alıştırması",
    convDesc: "Bir videonun altyazılarını veya dökümünü yapıştırın (örn. YouTube'un kendi “Dökümü göster” panelinden). GAKU gerçek konuşma alışverişlerini bulacak ve model cevabı göstermeden önce bir sonraki repliği tahmin etmenizi — ve söylemenizi — sağlayacak.",
    convPasteLabel: "Buraya altyazı/döküm yapıştırın",
    convGenerating: "Konuşma alıştırması oluşturuluyor...",
    convGenerateBtn: "Konuşma Alıştırması Oluştur",
    convNoTurns: "Bu içerikte bir konuşma bulunamadı. Daha fazla diyalog içeren bir döküm yapıştırmayı deneyin.",
    convYourTurn: "Nasıl cevap verirdiniz?",
    convRevealBtn: "Model cevabı göster",
    convModelAnswer: "Model cevap",
    convAltResponses: "Söylemenin diğer yolları",
    translateBtn: "Çevir",
    subtitlesTitle: "Altyazı → Kelime Bilgisi",
    subtitlesDesc: "Zaten izlemekte olduğunuz bir videonun altyazılarını veya metnini yapıştırın (ör. YouTube'un kendi \"Transkripti göster\" panosu). Bir kelimeye çift tıklayın veya bir ifadeyi seçmek için sürükleyin, ardından arayın ve doğrudan Kelime Oluşturucunuza kaydedin.",
    subtitlesSourceLabel: "Video başlığı / kaynağı (isteğe bağlı — klasör adı olarak kullanılır)",
    subtitlesSourcePlaceholder: "ör. NHK news 7/2",
    subtitlesPasteLabel: "Altyazıyı / metni buraya yapıştırın",
    subtitlesPastePlaceholder: "Düz metin veya bir .srt dosyasının içeriğini yapıştırın — zaman damgaları ve sıra numaraları otomatik olarak kaldırılır.",
    subtitlesLoadBtn: "Metni yükle",
    subtitlesCopyrightNote: "🔒 Buraya yapıştırdığınız metin, daha sonra devam edebilmeniz için yalnızca bu tarayıcının yerel deposunda saklanır — asla bir sunucuya gönderilmez. Yalnızca kaydetmeyi seçtiğiniz belirli kelimeler/ifadeler Kelime Oluşturucunuza eklenir.",
    subtitlesDefaultFolder: "Altyazı",
    subtitlesLoadNew: "↺ Başka bir metin yükle",
    subtitlesSavedCount: "Bu oturumda kaydedilenler:",
    subtitlesLookupSaveBtn: "🔍 Ara ve kaydet",
    subtitlesTooLong: "Bu seçim çok uzun — lütfen daha kısa bir kelime veya ifade seçin (~60 karakterden az).",
    subtitlesSavedTo: "şuraya kaydedildi:",
    subtitlesLookupError: "Arama başarısız oldu. Lütfen tekrar deneyin.",
    resAnkiPronDesc: "Sesli kartlarla fonetik tanımayı geliştirin. CLT: dinle ve tekrar et.",
    resMisaPronDesc: "Pratik örnek cümleler ve telaffuz alıştırmaları. CLT odaklı.",
    resOnomappuPronDesc: "Yalnızca Japonca açıklamalar. Anlaşılabilir Girdi — CLT uyumluluğu çok yüksek.",
},

  "Nepali": {
    gakuSelfStudy: "GAKU स्व-अध्ययन",
    studyPlan: "अध्ययन योजना",
    help: "🆘 मद्दत",
    editProfile: "✏️ प्रोफाइल सम्पादन गर्नुहोस्",
    weeklyProgress: "साप्ताहिक प्रगति",
    tabSchedule: "📅 तालिका",
    tabPractice: "✨ सामग्रीबाट",
    tabVocabulary: "📚 शब्दावली",
    tabResources: "🔗 स्रोतहरू",
    tabMilestones: "🏆 लक्ष्यहरू",
    tabSubtitles: "🎬 सबटाइटल",
    navGoConversation: "💬 वार्तालाप अभ्यासमा जानुहोस्",
    navGoSubtitles: "📺 सबटाइटलमा जानुहोस्",
    navGoContent: "✨ सामग्री अभ्यासमा जानुहोस्",
    navGoVocabulary: "📚 शब्दावलीमा जानुहोस्",
    savedSetFound: "तपाईंसँग पहिलेको सुरक्षित अध्ययन सेट छ।",
    resumeStudySet: "▶ अध्ययन जारी राख्नुहोस्",
    resetStudySet: "रिसेट गर्नुहोस्",
    flashcardNoWords: "अहिलेसम्म कुनै सुरक्षित शब्दहरू छैनन्। पहिले शब्दहरू खोज्नुहोस् र सुरक्षित गर्नुहोस्!",
    flashcardNoWordsInFolder: "यो फोल्डरमा कुनै शब्द छैन",
    flashcardResumePrompt: "पछिल्लो पटक तपाईं {pos} / {total} मा रोकिनुभयो। जारी राख्ने?",
    flashcardResume: "▶ जारी राख्नुहोस्",
    flashcardStartAgain: "🔄 फेरि सुरु गर्नुहोस्",
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
    currentJlpt: "हालको जापानी अनुमानित स्तर *",
    autoFilled: "तपाईंको परीक्षणबाट स्वतः भरिएको",
    changeLevel: "यदि तपाईं आफ्नो स्तर परिवर्तन गर्न चाहनुहुन्छ भने, कृपया तल छनोट गर्नुहोस्।",
    selectLevel: "स्तर छनोट गर्नुहोस्",
    beginner: "सुरुवाती",
    levelElementary: "प्रारम्भिक",
    levelIntermediate: "मध्यम",
    levelUpperIntermediate: "माथिल्लो मध्यम",
    levelAdvanced: "उन्नत",
    levelMastery: "निपुणता",
    levelUpPrompt: "तपाईंले यहाँ लगभग सबै कुरा बुझ्नुभएको छ! के तपाईं आफ्नो स्तर उच्च स्तरमा अपडेट गर्न चाहनुहुन्छ?",
    chooseNewLevel: "आफ्नो नयाँ स्तर छान्नुहोस्:",
    currentLevelLabel: "हालको स्तर:",
    yes: "हो",
    no: "होइन",
    didYouUnderstand: "के तपाईंले यो बुझ्नुभयो?",
    hideAnswerBtn: "उत्तर लुकाउनुहोस्",
    showAnswerBtn: "उत्तर देखाउनुहोस्",
    furiganaOn: "अन",
    furiganaOff: "अफ",
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
    skillOnlyHiragana: "あ हिरागाना मात्र", skillOnlyKatakana: "ア काताकाना मात्र",
    howToTitle: "यो एप कसरी प्रयोग गर्ने",
    howToSchedule: "तपाईंको साप्ताहिक अध्ययन योजना, दैनिक कार्यहरूमा विभाजित। साप्ताहिक प्रगति ट्र्याक गर्न कार्यलाई ट्याप गर्नुहोस्।",
    howToPractice: "तपाईंले टाँस्नुभएको जापानी पाठ (लेख, उपशीर्षक, क्याप्शन) बाट AI-उत्पन्न अभ्यास — शब्दावली, कांजी, व्याकरण, पठन, सुनाइ, कुराकानी र उच्चारण समेट्छ। जाँच गर्न 'जवाफ देखाउनुहोस्' ट्याप गर्नुहोस्।",
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
    listenAudio: "सुन्नुहोस्",
    recordVoice: "रेकर्ड गर्नुहोस्",
    recordingInProgress: "रेकर्डिङ हुँदैछ...",
    yourSpokenAnswer: "तपाईंको बोलिएको जवाफ:",
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
    contentTitle: "सामग्रीबाट सिर्जना गर्नुहोस्",
    contentDesc: "तपाईंले पढिरहनु भएको वा हेरिरहनु भएको जापानी पाठ टाँस्नुहोस् — कुनै लेख, भिडियो सबटाइटल/विवरण, क्याप्सन, वा सन्देश — र GAKU ले त्यसबाट {jlpt} स्तरका गतिविधिहरू बनाउनेछ, ठीक जसरी वेबमा GAKU Reader ले गर्छ।",
    contentPlaceholder: "यहाँ जापानी पाठ, सबटाइटल, वा क्याप्सन टाँस्नुहोस्",
    contentAnalyzing: "सामग्री विश्लेषण गर्दै...",
    contentAnalyzeAgain: "फेरि विश्लेषण गर्नुहोस्",
    contentAnalyzeButton: "विश्लेषण गरी गतिविधिहरू बनाउनुहोस्",
    contentErrEmpty: "पहिले केही जापानी पाठ (वा भिडियोको सबटाइटल/विवरण) टाँस्नुहोस्।",
    contentErrNoAct: "त्यो सामग्रीबाट गतिविधिहरू बनाउन सकिएन। थप पाठ टाँस्ने प्रयास गर्नुहोस्।",
    contentErrGeneric: "अहिले यो सामग्री विश्लेषण गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
    convTitle: "कुराकानी अभ्यास",
    convDesc: "भिडियोको सबटाइटल वा ट्रान्सक्रिप्ट टाँस्नुहोस् (जसरी YouTube को आनेको “ट्रान्सक्रिप्ट देखाउनुहोस्” प्यानल)। GAKU ले वास्तविक कुराकानी आदानप्रदान भेट्टाएर मॉडल जवा॥ देखाउन uअगाडि तपाईंलाई अर्को लाइनको अनुमान गर्न — र बोल्न — दिनेछ।",
    convPasteLabel: "यहाँ सबटाइटल/ट्रान्सक्रिप्ट टाँस्नुहोस्",
    convGenerating: "कुराकानी अभ्यास बनाउदै...",
    convGenerateBtn: "कुराकानी अभ्यास बनाउनुहोस्",
    convNoTurns: "त्यो सामग्रीमा कुनै कुराकानी भेटिएन। थप कुराकानी भएको ट्रान्सक्रिप्ट टाँस्ने प्रयास गर्नुहोस्।",
    convYourTurn: "तपाईंले कसरी जवाफ दिनुहुन्छ?",
    convRevealBtn: "मॉडल जवाफ देखाउनुहोस्",
    convModelAnswer: "मॉडल जवाफ",
    convAltResponses: "भन्ने अन्य तरिकाहरू",
    translateBtn: "अनुवाद गर्नुहोस्",
    subtitlesTitle: "सबटाइटल → शब्दावली",
    subtitlesDesc: "तपाईंले पहिले नै हेरिरहनुभएको भिडियोको सबटाइटल वा ट्रान्सक्रिप्ट टाँस्नुहोस् (जस्तै YouTube को आफ्नै \"Show transcript\" प्यानल)। कुनै शब्दमा डबल-क्लिक गर्नुहोस् वा वाक्यांश छनोट गर्न तान्नुहोस्, त्यसपछि यसलाई खोज्नुहोस् र सिधै आफ्नो शब्दावली निर्माता मा सुरक्षित गर्नुहोस्।",
    subtitlesSourceLabel: "भिडियो शीर्षक / स्रोत (वैकल्पिक — फोल्डर नामको रूपमा प्रयोग हुन्छ)",
    subtitlesSourcePlaceholder: "जस्तै NHK news 7/2",
    subtitlesPasteLabel: "यहाँ सबटाइटल / ट्रान्सक्रिप्ट टाँस्नुहोस्",
    subtitlesPastePlaceholder: "सादा पाठ वा .srt फाइलको सामग्री टाँस्नुहोस् — समय-मुद्रा र क्यू नम्बरहरू स्वतः हटाइनेछन्।",
    subtitlesLoadBtn: "ट्रान्सक्रिप्ट लोड गर्नुहोस्",
    subtitlesCopyrightNote: "🔒 तपाईंले यहाँ टाँसेको पाठ पछि जारी राख्न सकिने गरी यो ब्राउजरको लोकल स्टोरेजमा मात्र सुरक्षित हुन्छ — यो कहिल्यै सर्भरमा पठाइँदैन। तपाईंले सुरक्षित गर्न रोजेका विशिष्ट शब्द/वाक्यांशहरू मात्र तपाईंको शब्दावली निर्माता मा थपिन्छन्।",
    subtitlesDefaultFolder: "सबटाइटल",
    subtitlesLoadNew: "↺ फरक ट्रान्सक्रिप्ट लोड गर्नुहोस्",
    subtitlesSavedCount: "यस सत्रमा सुरक्षित गरिएको:",
    subtitlesLookupSaveBtn: "🔍 खोज्नुहोस् र सुरक्षित गर्नुहोस्",
    subtitlesTooLong: "यो छनोट धेरै लामो छ — कृपया छोटो शब्द वा वाक्यांश छनोट गर्नुहोस् (~६० अक्षरभन्दा कम)।",
    subtitlesSavedTo: "मा सुरक्षित गरियो",
    subtitlesLookupError: "खोजी असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
    resAnkiPronDesc: "अडियो फ्ल्यासकार्डको साथ ध्वन्यात्मक पहिचान विकास गर्नुहोस्। CLT: सुन्नुहोस् र दोहोर्याउनुहोस्।",
    resMisaPronDesc: "व्यावहारिक उदाहरण वाक्यहरू र उच्चारण अभ्यास। CLT-केन्द्रित।",
    resOnomappuPronDesc: "केवल जापानी भाषामा व्याख्या। बुझ्न सकिने इनपुट — CLT अनुकूलता धेरै उच्च।",
},

  "Filipino": {
    gakuSelfStudy: "GAKU SELF-STUDY",
    studyPlan: "Study plan",
    help: "🆘 Tulong",
    editProfile: "✏️ I-edit ang profile",
    weeklyProgress: "Lingguhang progreso",
    tabSchedule: "📅 Iskedyul",
    tabPractice: "✨ Mula sa Nilalaman",
    tabVocabulary: "📚 Bokabularyo",
    tabResources: "🔗 Mga Resources",
    tabMilestones: "🏆 Mga Layunin",
    tabSubtitles: "🎬 Subtitle",
    navGoConversation: "💬 Pumunta sa Pagsasanay sa Pag-uusap",
    navGoSubtitles: "📺 Pumunta sa Subtitle",
    navGoContent: "✨ Pumunta sa Pagsasanay Mula sa Nilalaman",
    navGoVocabulary: "📚 Pumunta sa Bokabularyo",
    savedSetFound: "Mayroon kang naka-save na study set mula noon.",
    resumeStudySet: "▶ Ipagpatuloy ang pag-aaral",
    resetStudySet: "I-reset",
    flashcardNoWords: "Wala pang naka-save na salita. Maghanap at mag-save muna ng mga salita!",
    flashcardNoWordsInFolder: "Walang salita sa folder na ito",
    flashcardResumePrompt: "Huminto ka sa {pos} / {total} noong huling beses. Ituloy?",
    flashcardResume: "▶ Ipagpatuloy",
    flashcardStartAgain: "🔄 Magsimula ulit",
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
    currentJlpt: "KASALUKUYANG TANTIYADONG ANTAS NG NIHONGGO *",
    autoFilled: "Awtomatikong napunan mula sa iyong test",
    changeLevel: "Kung gusto mong baguhin ang iyong antas, pumili sa ibaba.",
    selectLevel: "Piliin ang antas",
    beginner: "Baguhan",
    levelElementary: "Elementarya",
    levelIntermediate: "Intermedya",
    levelUpperIntermediate: "Mataas na Intermedya",
    levelAdvanced: "Advanced",
    levelMastery: "Kadalubhasaan",
    levelUpPrompt: "Halos naiintindihan mo na lahat dito! Gusto mo bang i-update ang iyong level sa mas mataas na level?",
    chooseNewLevel: "Piliin ang iyong bagong level:",
    currentLevelLabel: "Kasalukuyang level:",
    yes: "Oo",
    no: "Hindi",
    didYouUnderstand: "Naiintindihan mo ba ito?",
    hideAnswerBtn: "Itago ang sagot",
    showAnswerBtn: "Ipakita ang sagot",
    furiganaOn: "Naka-on",
    furiganaOff: "Naka-off",
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
    skillOnlyHiragana: "あ Hiragana Lamang", skillOnlyKatakana: "ア Katakana Lamang",
    howToTitle: "Paano gamitin ang app na ito",
    howToSchedule: "Ang iyong lingguhang study plan, nahahati sa araw-araw na gawain. I-tap ang gawain upang markahan itong tapos na.",
    howToPractice: "Mga pagsasanay na ginawa ng AI mula sa Japanese text na iyong idinikit (artikulo, subtitle, caption) — sinasaklaw ang bokabularyo, kanji, gramatika, pagbasa, pakikinig, pag-uusap, at pagbigkas. I-tap ang 'Ipakita ang sagot' upang suriin.",
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
    listenAudio: "Makinig",
    recordVoice: "I-record",
    recordingInProgress: "Nire-record...",
    yourSpokenAnswer: "Ang iyong sinabing sagot:",
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
    contentTitle: "GAWIN MULA SA NILALAMAN",
    contentDesc: "I-paste ang tekstong Hapon na binabasa o pinapanood mo — isang artikulo, subtitle/paglalarawan ng video, caption, o mensahe — at gagawa si GAKU ng mga gawain sa antas {jlpt} mula rito, tulad ng ginagawa ng GAKU Reader sa web.",
    contentPlaceholder: "I-paste dito ang tekstong Hapon, subtitle, o caption",
    contentAnalyzing: "Sinusuri ang nilalaman...",
    contentAnalyzeAgain: "Suriin muli",
    contentAnalyzeButton: "Suriin at Gumawa ng mga Gawain",
    contentErrEmpty: "Mag-paste muna ng tekstong Hapon (o subtitle/paglalarawan ng video).",
    contentErrNoAct: "Hindi makagawa ng mga gawain mula sa nilalamang iyon. Subukang mag-paste ng mas maraming teksto.",
    contentErrGeneric: "Hindi masuri ang nilalamang ito sa ngayon. Pakisubukang muli.",
    convTitle: "Pagsasanay sa Pakikipag-usap",
    convDesc: "I-paste ang subtitle o transcript ng isang video (hal. ang “Ipakita ang transcript” panel ng YouTube). Hahanapin ng GAKU ang tunay na pag-uusap at hahayaan kang hulaan — at sabihin nang malakas — ang susunod na linya bago ipakita ang huwarang sagot.",
    convPasteLabel: "I-paste dito ang subtitle / transcript",
    convGenerating: "Ginagawa ang pagsasanay sa pakikipag-usap...",
    convGenerateBtn: "Gumawa ng Pagsasanay sa Pakikipag-usap",
    convNoTurns: "Walang natagpuang pag-uusap sa nilalamang iyon. Subukang mag-paste ng transcript na may mas maraming diyalogo.",
    convYourTurn: "Paano ka sasagot?",
    convRevealBtn: "Ipakita ang huwarang sagot",
    convModelAnswer: "Huwarang sagot",
    convAltResponses: "Ibang paraan ng pagsasabi",
    translateBtn: "Isalin",
    subtitlesTitle: "Subtitle → Bokabularyo",
    subtitlesDesc: "I-paste ang subtitle o transcript mula sa video na pinapanood mo na (hal. ang sariling \"Show transcript\" panel ng YouTube). I-double-click ang isang salita o i-drag para pumili ng parirala, pagkatapos ay hanapin ito at i-save nang direkta sa iyong Vocabulary Builder.",
    subtitlesSourceLabel: "Pamagat / pinagmulan ng video (opsyonal — ginagamit bilang pangalan ng folder)",
    subtitlesSourcePlaceholder: "hal. NHK news 7/2",
    subtitlesPasteLabel: "I-paste ang subtitle / transcript dito",
    subtitlesPastePlaceholder: "I-paste ang plain text o ang laman ng isang .srt file — awtomatikong aalisin ang mga timestamp at cue number.",
    subtitlesLoadBtn: "I-load ang transcript",
    subtitlesCopyrightNote: "🔒 Ang tekstong ini-paste mo dito ay naka-save lamang sa local storage ng browser na ito, para magpatuloy ka sa susunod — hindi ito ipinapadala sa anumang server. Ang mga partikular na salita/parirala lamang na pinili mong i-save ang idadagdag sa iyong Vocabulary Builder.",
    subtitlesDefaultFolder: "Subtitle",
    subtitlesLoadNew: "↺ Mag-load ng ibang transcript",
    subtitlesSavedCount: "Na-save sa session na ito:",
    subtitlesLookupSaveBtn: "🔍 Hanapin at i-save",
    subtitlesTooLong: "Masyadong mahaba ang napiling bahagi — mangyaring pumili ng mas maikling salita o parirala (mas mababa sa ~60 characters).",
    subtitlesSavedTo: "na-save sa",
    subtitlesLookupError: "Nabigo ang paghahanap. Pakisubukang muli.",
    resAnkiPronDesc: "Bumuo ng phonetic recognition gamit ang audio flashcards. CLT: makinig at ulitin.",
    resMisaPronDesc: "Praktikal na halimbawang pangungusap at ehersisyo sa pagbigkas. Nakatuon sa CLT.",
    resOnomappuPronDesc: "Paliwanag sa Hapon lamang. Comprehensible Input — napakataas ng CLT compatibility.",
},

};

// Get translation for current language, fall back to English
function getT(lang) {
  return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS["English"];
}

// For languages not in our static dict, we cache AI translations
const AI_TRANS_CACHE = {};
const AI_TRANS_PENDING = {}; // dedupe concurrent fetches for the same language

// Split translation keys into two batches to stay within token limits
function splitKeys(obj) {
  const keys = Object.keys(obj);
  const mid = Math.ceil(keys.length / 2);
  const a = {}, b = {};
  keys.slice(0, mid).forEach(k => { a[k] = obj[k]; });
  keys.slice(mid).forEach(k => { b[k] = obj[k]; });
  return [a, b];
}

async function fetchTranslationBatch(keyValueObj, lang, attempt = 0) {
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
  // Retry once on rate-limit errors instead of silently falling back to English
  if (d.error && attempt < 2) {
    await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
    return fetchTranslationBatch(keyValueObj, lang, attempt + 1);
  }
  const text = d.content?.map(c=>c.text||"").join("") || "{}";
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

// Fetches (and caches) the full translation set for a language exactly once,
// even if many components call useUITranslations(lang) at the same time.
function getOrFetchTranslations(lang) {
  if (AI_TRANS_CACHE[lang]) return Promise.resolve(AI_TRANS_CACHE[lang]);
  if (AI_TRANS_PENDING[lang]) return AI_TRANS_PENDING[lang];
  const baseKeys = UI_TRANSLATIONS["English"];
  const [batchA, batchB] = splitKeys(baseKeys);
  const p = Promise.all([
    fetchTranslationBatch(batchA, lang),
    fetchTranslationBatch(batchB, lang),
  ])
    .then(([resA, resB]) => {
      const merged = { ...resA, ...resB };
      if (Object.keys(merged).length > 10) {
        AI_TRANS_CACHE[lang] = merged;
        return merged;
      }
      return UI_TRANSLATIONS["English"];
    })
    .catch(() => UI_TRANSLATIONS["English"])
    .finally(() => { delete AI_TRANS_PENDING[lang]; });
  AI_TRANS_PENDING[lang] = p;
  return p;
}

// Hook: shows English immediately while AI translation loads for unknown languages
function useUITranslations(lang) {
  const [aiT, setAiT] = useState(null);
  const [transLoading, setTransLoading] = useState(false);
  const staticT = UI_TRANSLATIONS[lang];

  useEffect(() => {
    if (staticT || !lang || lang === "English") { setAiT(null); setTransLoading(false); return; }
    if (AI_TRANS_CACHE[lang]) { setAiT(AI_TRANS_CACHE[lang]); return; }
    let cancelled = false;
    setTransLoading(true);
    getOrFetchTranslations(lang).then(merged => {
      if (!cancelled) { setAiT(merged); setTransLoading(false); }
    });
    return () => { cancelled = true; };
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

// ─── PER-STUDENT STORAGE SCOPING ──────────────────────────────────────────────
// When a student is logged in (Supabase auth), their study data (profile form,
// vocabulary, interaction count) is kept separate per account so multiple
// students sharing the same browser/device don't see each other's data.
// Falls back to the unscoped legacy key when no one is logged in (e.g. the
// free quiz-only flow before signup).
let ACTIVE_USER_ID = null;
function scopedKey(base) {
  return ACTIVE_USER_ID ? `${base}_${ACTIVE_USER_ID}` : base;
}

// ─── CROSS-DOMAIN DATA BRIDGE (Supabase) ──────────────────────────────────────
// Student study data lives only in this browser's localStorage, scoped by
// user id (see scopedKey above). That's normally fine, but it means the data
// is invisible on a *different domain* (e.g. moving from the original
// vercel.app URL to a custom domain) even though it's the exact same account.
// To fix that, every login: (1) pull down any snapshot left by a login on
// another domain and fill in whatever's missing locally, then (2) push a
// fresh snapshot of this browser's data up, so the *next* domain/device can
// pick it up the same way. Uses a small Supabase table (migration_bridge),
// not localStorage-to-localStorage tricks, so it isn't affected by browsers'
// third-party storage partitioning/ITP restrictions on cross-site iframes.
function collectUserLocalStorage(userId) {
  const suffix = `_${userId}`;
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.endsWith(suffix)) out[k] = localStorage.getItem(k);
    }
  } catch {}
  // Also carry over this browser's already-approved device id (stored
  // unscoped, so it isn't picked up by the suffix loop above). Without this,
  // logging into the same account from a *different domain* generates a
  // brand-new device id and gets misread as an unrecognized 3rd device,
  // suspending the account even though it's the same physical browser.
  try {
    const deviceId = localStorage.getItem("gaku_device_id");
    if (deviceId) out.gaku_device_id = deviceId;
  } catch {}
  return out;
}
async function syncMigrationBridge(userId) {
  if (!supabase || !userId) return;
  try {
    const { data, error } = await supabase
      .from("migration_bridge")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.error("migration_bridge PULL failed:", error.message, error.details || "");
    } else {
      const remote = data?.data || {};
      const pulledKeys = [];
      Object.keys(remote).forEach((k) => {
        if (localStorage.getItem(k) === null) {
          try { localStorage.setItem(k, remote[k]); pulledKeys.push(k); } catch {}
        }
      });
      console.log("migration_bridge PULL OK — keys found:", Object.keys(remote).length, "keys filled in locally:", pulledKeys);
    }
  } catch (e) {
    console.error("migration_bridge PULL threw:", e.message);
  }
  try {
    const snapshot = collectUserLocalStorage(userId);
    if (Object.keys(snapshot).length > 0) {
      const { error } = await supabase
        .from("migration_bridge")
        .upsert({ user_id: userId, data: snapshot, updated_at: new Date().toISOString() });
      if (error) {
        console.error("migration_bridge PUSH failed:", error.message, error.details || "");
      } else {
        console.log("migration_bridge PUSH OK — keys sent:", Object.keys(snapshot).length);
      }
    } else {
      console.log("migration_bridge PUSH skipped — no local keys to send for this user.");
    }
  } catch (e) {
    console.error("migration_bridge PUSH threw:", e.message);
  }
}

// ─── VOCAB STORAGE (localStorage) ─────────────────────────────────────────────
function loadVocabData() {
  try { return JSON.parse(localStorage.getItem(scopedKey("gaku_vocab")) || "null") || { folders:[], cards:[] }; } catch { return { folders:[], cards:[] }; }
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
    localStorage.setItem(scopedKey("gaku_vocab"), JSON.stringify(lean));
    // Sync folder names to chrome.storage for GAKU Reader extension
    try {
      const folderNames = ["Your Vocabulary", ...data.folders.map(f => typeof f === "string" ? f : f.name).filter(Boolean)];
      if (window.chrome?.storage?.local) {
        window.chrome.storage.local.set({ gaku_folders: folderNames });
      }
      if (window.chrome?.storage?.sync) {
        window.chrome.storage.sync.set({ gaku_folders: folderNames });
      }
    } catch {}
  } catch(e) {
    // If quota exceeded, remove oldest 20 cards and retry
    try {
      const trimmed = { folders: data.folders, cards: data.cards.slice(-80).map(trimCard) };
      localStorage.setItem(scopedKey("gaku_vocab"), JSON.stringify(trimmed));
    } catch {}
  }
}

// ─── TEACHER-ASSIGNED VOCAB SYNC ───────────────────────────────────────────────
// Seito can push a word directly into a student's account (via the admin-only
// api/admin-assign-word endpoint — no student password needed). This pulls any
// pending words for the logged-in student from the `assigned_vocab` table,
// merges them into their local vocab, then removes the synced rows so they're
// not re-delivered next time.
async function syncAssignedVocab(userId) {
  if (!supabase || !userId) return;
  try {
    const { data: rows, error } = await supabase
      .from("assigned_vocab")
      .select("*")
      .eq("student_id", userId);
    if (error || !rows || !rows.length) return;

    const vocabData = loadVocabData();
    let changed = false;
    for (const row of rows) {
      const folder = row.folder || "Your Vocabulary";
      if (folder !== "Your Vocabulary" && !vocabData.folders.find(f => (typeof f === "string" ? f : f.name) === folder)) {
        vocabData.folders.push({ name: folder, createdAt: new Date().toISOString() });
      }
      if (!vocabData.cards.find(c => c.word === row.word && c.folder === folder)) {
        vocabData.cards.push({
          id: row.id, word: row.word, reading: row.reading || "",
          jlpt: row.jlpt || "", partOfSpeech: row.part_of_speech || "",
          meaning: row.meaning || "", example: row.example || "",
          folder, savedAt: new Date().toISOString(), addedAt: Date.now(),
        });
        changed = true;
      }
    }
    if (changed) {
      saveVocabData(vocabData);
      try { window.dispatchEvent(new Event("gaku_vocab_updated")); } catch {}
    }
    // Remove delivered rows so they aren't merged again on next login.
    await supabase.from("assigned_vocab").delete().eq("student_id", userId);
  } catch {}
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

// Strips parenthetical instructional labels (e.g. "（シャドーイング）", "(Shadowing)") from an
// exercise prompt before it's read aloud — those are UI labels, not content to pronounce.
function stripForSpeech(text) {
  return (text || "")
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[［\[][^］\]]*[］\]]/g, "")
    .trim();
}

// For "listening" fill-in-the-blank exercises, the prompt text shown to the student has the
// blank (＿＿＿/___) plus scene-setting/choices that shouldn't be read aloud. For real listening
// practice, the AUDIO needs to be the complete, correct sentence — so extract the quoted
// blanked sentence and substitute the real answer word back into the blank before speaking it.
function getListeningAudioText(item) {
  const raw = item.prompt || "";
  const quoted = raw.match(/「([^」]*(?:___|＿+|_+)[^」]*)」/);
  let sentence;
  if (quoted) {
    sentence = quoted[1];
  } else {
    // Fallback for prompts that didn't follow the 「」 quoting instruction: strip the
    // [Scene: ...] label, the ①②③④ choice list, and the trailing "何が入りますか？" question,
    // leaving just the blanked sentence so the answer can be substituted into it.
    sentence = raw
      .replace(/[［\[][^］\]]*[］\]]/g, "")
      .split(/①/)[0]
      .replace(/何が(入り|はい)ますか[？?]?/g, "")
      .trim();
  }
  let word = (item.answer || "").trim();
  for (const c of "①②③④⑤⑥⑦⑧⑨⑩") { if (word.startsWith(c)) { word = word.slice(c.length).trim(); break; } }
  word = word.replace(/^(correct answer|正解)[:：]?\s*/i, "").trim();
  if (!word) return sentence;
  return sentence.replace(/___+|＿+|_+/g, word);
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
    const needsFill = !cardProp.meaning || !cardProp.example || !cardProp.example_translated || !cardProp.reading_example;
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
function FlashcardView({ form, onBack }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [allData, setAllData] = useState(() => loadVocabData());
  const [selectedFolder, setSelectedFolder] = useState("すべて");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [fillingCard, setFillingCard] = useState(false);
  const [resumeChoice, setResumeChoice] = useState(null); // null = deciding, "resume" | "restart" = decided
  const [flipImages, setFlipImages] = useState({}); // word -> image url, fetched on demand for the back of the card

  const cards = allData.cards || [];
  const folderObjs = allData.folders || [];
  const allFolders = [{ name:"すべて" }, { name:"Your Vocabulary" }, ...folderObjs];
  const filteredCards = selectedFolder === "すべて" ? cards : cards.filter(c => c.folder === selectedFolder);
  const displayCards = filteredCards;
  const card = displayCards[idx] || null;

  const posKey = (folder) => `gaku_flashcard_pos_${folder}`;
  const getSavedPos = (folder) => { try { return parseInt(localStorage.getItem(posKey(folder)) || "0", 10) || 0; } catch { return 0; } };
  const savePos = (folder, i) => { try { localStorage.setItem(posKey(folder), String(i)); } catch {} };

  // Whenever the folder becomes active, check for a saved position and ask Resume vs Start Again
  // instead of silently resetting to the first card.
  useEffect(() => {
    const saved = getSavedPos(selectedFolder);
    if (saved > 0 && saved < filteredCards.length) {
      setResumeChoice(null);
    } else {
      setIdx(0);
      setResumeChoice("restart");
    }
    setFlipped(false); setShowHint(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolder]);

  // Persist position as the student moves through the deck
  useEffect(() => {
    if (resumeChoice) savePos(selectedFolder, idx);
  }, [idx, selectedFolder, resumeChoice]);

  // Fetch a supporting image for the back of the card (only when flipped, and only once per word).
  // Wikimedia Commons is mostly indexed in English, so searching by the English meaning first tends
  // to return far more relevant photos than searching by the raw Japanese word. Falls back to the
  // word itself, and skips flags/logos/maps which otherwise dominate results for short queries.
  useEffect(() => {
    if (!flipped || !card || card.imageUrl || flipImages[card.word]) return;
    let cancelled = false;
    (async () => {
      try {
        const cleanMeaning = (card.meaning || "")
          .replace(/\([^)]*\)/g, "")
          .replace(/^to\s+/i, "")
          .split(/[,;]/)[0]
          .trim();
        const queries = [cleanMeaning, card.imageQuery, card.word].filter(Boolean);
        const badTitle = /flag|logo|icon|map of|coat of arms|emblem|disambiguation/i;
        for (const q of queries) {
          const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
          const res = await fetch(url);
          const data = await res.json();
          const pages = Object.values(data?.query?.pages || {});
          const good = pages.find(p => {
            const t = p?.imageinfo?.[0]?.thumburl;
            return t && !/svg/i.test(t) && !badTitle.test(p.title || "");
          });
          if (good) {
            if (!cancelled) setFlipImages(prev => ({ ...prev, [card.word]: good.imageinfo[0].thumburl }));
            return;
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [flipped, card?.word]);

  const handleFolderChange = (f) => { setSelectedFolder(f); };

  // Auto-fill reading_example and example_translated for current card if missing
  useEffect(() => {
    if (!card) return;
    if (card.reading_example && card.example_translated) return;
    if (!card.example) return;
    setFillingCard(true);
    (async () => {
      try {
        const res = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ max_tokens:300, messages:[
            { role:"system", content:"You are a Japanese dictionary. Respond ONLY with raw JSON, no markdown, no backticks." },
            { role:"user", content:`For the Japanese example sentence: "${card.example}"
Return JSON with:
- reading_example: full romaji reading of this sentence
- example_translated: natural English translation of this sentence
Only output the JSON object.` }
          ]})
        });
        const d = await res.json();
        const t = d?.content?.[0]?.text || "";
        const parsed = JSON.parse(t.replace(/```json|```/g,"").trim());
        if (parsed.reading_example || parsed.example_translated) {
          setAllData(prev => {
            const updated = { ...prev, cards: prev.cards.map(c =>
              c.word === card.word && c.folder === card.folder
                ? { ...c, reading_example: c.reading_example || parsed.reading_example || "", example_translated: c.example_translated || parsed.example_translated || "" }
                : c
            )};
            try { localStorage.setItem("gaku_vocab", JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
      } catch {}
      setFillingCard(false);
    })();
  }, [card?.word, card?.folder]);

  if (!cards.length) return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>
      <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
        <p style={{ color:"#64748b", fontSize:32, margin:"0 0 12px" }}>📭</p>
        <p style={{ color:"#94a3b8", fontSize:14 }}>{T.flashcardNoWords || "No saved words yet. Search and save words first!"}</p>
      </div>
    </div>
  );

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
      {resumeChoice === null ? (
        <div style={{ ...S.card, textAlign:"center", padding:"32px 20px" }}>
          <p style={{ color:"#94a3b8", fontSize:13, marginBottom:18 }}>
            {(T.flashcardResumePrompt || "You stopped at {pos} / {total} last time. Continue?").replace("{pos}", getSavedPos(selectedFolder)+1).replace("{total}", filteredCards.length)}
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button onClick={()=>{ setIdx(getSavedPos(selectedFolder)); setResumeChoice("resume"); }} style={{ ...S.btn, background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff" }}>{T.flashcardResume || "▶ Resume"}</button>
            <button onClick={()=>{ setIdx(0); savePos(selectedFolder, 0); setResumeChoice("restart"); }} style={{ ...S.btn, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>{T.flashcardStartAgain || "🔄 Start Again"}</button>
          </div>
        </div>
      ) : !card ? (
        <div style={{ ...S.card, textAlign:"center", padding:"40px 20px" }}>
          <p style={{ color:"#94a3b8", fontSize:14 }}>{T.flashcardNoWordsInFolder || "No words in this folder"}</p>
        </div>
      ) : (
        <>
          <p style={{ color:"#64748b", fontSize:12, textAlign:"center", margin:"0 0 16px" }}>{idx+1} / {displayCards.length}</p>
          <div onClick={()=>setFlipped(f=>!f)} style={{ ...S.card, minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", textAlign:"center", borderLeft:`4px solid ${C.teal}`, marginBottom:16 }}>
            {!flipped ? (
              <>
                <p style={{ color:"#f1f5f9", fontSize:44, fontWeight:900, margin:"0 0 6px", letterSpacing:2 }}>{card.word}</p>
                {showHint && card.reading && <p style={{ color:C.teal, fontSize:20, margin:"0 0 2px", fontWeight:700 }}>{card.reading}</p>}
                {showHint && card.reading && <p style={{ color:"#67e8f9", fontSize:13, margin:"0 0 6px", fontStyle:"italic" }}>{card.reading.split("").map(c=>{const hMap={"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"wo","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"di","づ":"du","で":"de","ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","きゃ":"kya","きゅ":"kyu","きょ":"kyo","しゃ":"sha","しゅ":"shu","しょ":"sho","ちゃ":"cha","ちゅ":"chu","ちょ":"cho","にゃ":"nya","にゅ":"nyu","にょ":"nyo","ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo","みゃ":"mya","みゅ":"myu","みょ":"myo","りゃ":"rya","りゅ":"ryu","りょ":"ryo","ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo","じゃ":"ja","じゅ":"ju","じょ":"jo","びゃ":"bya","びゅ":"byu","びょ":"byo","ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo","っ":"(t)","ー":"-","、":""," ":"","　":""};return hMap[c]||c;}).join("")}</p>}
                <p style={{ color:"#ff0844", fontSize:11, fontWeight:700 }}>タップして確認</p>
              </>
            ) : (
              <>
                {(card.imageUrl || flipImages[card.word]) && (
                  <img src={card.imageUrl || flipImages[card.word]} alt={card.word} style={{ width:"100%", maxWidth:260, borderRadius:10, objectFit:"cover", maxHeight:150, display:"block", margin:"0 auto 12px" }} />
                )}
                <p style={{ color:"#f1f5f9", fontSize:28, fontWeight:900, margin:"0 0 4px", letterSpacing:1 }}>{card.word}</p>
                {card.reading && <p style={{ color:C.teal, fontSize:18, margin:"0 0 4px", fontWeight:700 }}>{card.reading}</p>}
                {card.meaning && <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px" }}>{card.meaning}</p>}
                {card.meaningNative && <p style={{ color:"#475569", fontSize:11, margin:"0 0 8px", fontStyle:"italic" }}>{card.meaningNative}</p>}
                {card.example && <p style={{ color:"#cbd5e1", fontSize:13, lineHeight:1.7, maxWidth:280, margin:"0 0 2px" }}>{card.example}</p>}
                {card.reading_example
                  ? <p style={{ color:"#67e8f9", fontSize:11, fontStyle:"italic", maxWidth:280, margin:"0 0 2px" }}>{card.reading_example}</p>
                  : fillingCard ? <p style={{ color:"#475569", fontSize:11, margin:"0 0 2px" }}>✨ ローマ字生成中...</p> : null}
                {card.example_translated
                  ? <p style={{ color:"#64748b", fontSize:11, fontStyle:"italic", maxWidth:280, margin:"0 0 10px" }}>{card.example_translated}</p>
                  : fillingCard ? <p style={{ color:"#475569", fontSize:11, margin:"0 0 10px" }}>✨ 翻訳生成中...</p> : null}
                <button onClick={e=>{e.stopPropagation();speakJapanese(card.example);}} style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, color:C.amber, fontSize:12, padding:"4px 12px", cursor:"pointer" }}>🔊 例文を聞く</button>
              </>
            )}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:8 }}>
            <button onClick={()=>speakJapanese(card.word)} style={{ flex:1, ...S.btn, background:"rgba(6,182,212,0.1)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal }}>🔊 Listen</button>
            <button onClick={e=>{e.stopPropagation();setShowHint(h=>!h);}} style={{ ...S.btn, padding:"13px 18px", background:showHint?"rgba(251,191,36,0.15)":C.card, border:`1px solid ${showHint?"rgba(251,191,36,0.5)":C.border}`, color:showHint?C.amber:"#94a3b8" }}>💡 Hint</button>
            <button onClick={()=>{ setFlipped(false); setShowHint(false); setIdx(i=>(i-1+displayCards.length)%displayCards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>←</button>
            <button onClick={()=>{ setFlipped(false); setShowHint(false); setIdx(i=>(i+1)%displayCards.length); }} style={{ ...S.btn, padding:"13px 18px", background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>→</button>
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
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#ffffff", fontSize:13, cursor:"pointer", padding:0, marginBottom:14 }}>← Back</button>

      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>🔍 WORD SEARCH</p>
        <p style={{ color:"#ffffff", fontSize:12, marginBottom:12 }}>
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
          <button onClick={searchWord} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#ffffff", whiteSpace:"nowrap", padding:"12px 18px" }}>
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
  if (vocabView === "flashcard") return <FlashcardView form={form} onBack={()=>setVocabView("main")} />;

  // ── MAIN VIEW ──
  return (
    <div>
      {/* ── TOP ACTION BAR ── */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button onClick={()=>setVocabView("library")} style={{ flex:1, ...S.btn, background:C.card, border:`1.5px solid ${C.border}`, color:"#f1f5f9", textAlign:"left", padding:"12px 14px" }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700 }}>{T.libraryLabel}</p>
          <p style={{ margin:"2px 0 0", fontSize:11, color:"#ffffff" }}>{T.yourVocabSaved} · {totalSaved} {T.savedSuffix}</p>
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
        <p style={{ color:"#ffffff", fontSize:12, marginBottom:14 }}>{T.vocabBuilderDesc}</p>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&findWords()} placeholder={T.vocabSearchPlaceholder} style={{ ...S.input, flex:1 }} />
          <button onClick={findWords} disabled={!search.trim()||loading} style={{ ...S.btn, background:search.trim()?`linear-gradient(135deg,${C.teal},#0891b2)`:"#1e293b", color:search.trim()?"#fff":"#ffffff", whiteSpace:"nowrap", padding:"12px 18px" }}>
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

// ─── SUBTITLE VOCAB BUILDER (student pastes subtitles THEY already
// have access to — we never fetch/scrape captions ourselves — then selects a
// word/phrase to look up and save. The full pasted transcript is never written to
// localStorage or any server; only the short word/phrase the student explicitly
// selects gets saved, exactly like a normal Vocabulary Builder card). ──────────
function parseSubtitleText(raw) {
  const rawLines = (raw || "").split(/\r?\n/);
  const timeRe = /\d{1,2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{3}/;
  const idxRe = /^\d+$/;
  const cues = [];
  let buffer = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (buffer.length) { cues.push(buffer.join(" ")); buffer = []; }
      continue;
    }
    if (idxRe.test(trimmed) || timeRe.test(trimmed)) continue;
    buffer.push(trimmed);
  }
  if (buffer.length) cues.push(buffer.join(" "));
  const deduped = [];
  for (const c of cues) { if (deduped[deduped.length - 1] !== c) deduped.push(c); }
  return deduped.filter(Boolean);
}

function SubtitleVocabBuilder({ form }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const lang = form?.preferredLang || "English";
  const [raw, setRaw] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [lines, setLines] = useState(null); // null = not loaded yet
  const [selection, setSelection] = useState(null); // { text, contextLine }
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [sessionSaved, setSessionSaved] = useState([]);
  const [toast, setToast] = useState("");
  const [savedSet, setSavedSet] = useState(null); // a previously-loaded transcript found in this browser, offered via Resume/Reset
  const containerRef = useRef(null);

  const SUBTITLES_STORAGE_KEY = "gaku_subtitles_study_set";

  // On first mount, check for a transcript left over from before navigating away — but don't
  // auto-load it; let the student choose Resume or Reset so nothing appears unexpectedly.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(scopedKey(SUBTITLES_STORAGE_KEY));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.lines) && parsed.lines.length) setSavedSet(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever a transcript is loaded, so it survives navigating to another tab and back.
  useEffect(() => {
    if (lines && lines.length) {
      try { localStorage.setItem(scopedKey(SUBTITLES_STORAGE_KEY), JSON.stringify({ raw, sourceTitle, lines })); } catch {}
    }
  }, [lines, raw, sourceTitle]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const handleLoad = () => {
    const parsed = parseSubtitleText(raw);
    setLines(parsed);
    setSelection(null);
  };

  const handleResume = () => {
    if (savedSet) {
      setRaw(savedSet.raw || "");
      setSourceTitle(savedSet.sourceTitle || "");
      setLines(savedSet.lines || null);
    }
    setSavedSet(null);
  };
  const handleResetSaved = () => {
    try { localStorage.removeItem(scopedKey(SUBTITLES_STORAGE_KEY)); } catch {}
    setSavedSet(null);
  };

  const handleReset = () => {
    setLines(null); setRaw(""); setSelection(null); setLookupError("");
    try { localStorage.removeItem(scopedKey(SUBTITLES_STORAGE_KEY)); } catch {}
  };

  const handleMouseUp = () => {
    const sel = window.getSelection ? window.getSelection() : null;
    const text = sel ? sel.toString().trim() : "";
    if (!text) return;
    if (text.length > 60) {
      setSelection(null);
      setLookupError(T.subtitlesTooLong || "That selection is too long — please select a shorter word or phrase (under ~60 characters).");
      return;
    }
    let contextLine = text;
    try {
      let node = sel.anchorNode;
      while (node && node.nodeType !== 1) node = node.parentNode;
      const p = node && node.closest ? node.closest("p[data-subtitle-line]") : null;
      if (p) contextLine = p.textContent;
    } catch {}
    setSelection({ text, contextLine });
    setLookupError("");
  };

  const lookupAndSave = async () => {
    if (!selection) return;
    setLookupLoading(true); setLookupError("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 700,
          messages: [
            { role: "system", content: `You are a multilingual Japanese dictionary expert. You MUST write the "meaning", "example_translated", and "tip" fields EXCLUSIVELY in ${lang}. Never use English for these fields unless the student's native language IS English. Respond ONLY with a raw JSON object, no markdown, no backticks.` },
            { role: "user", content: `A student watching a Japanese video selected this text from the subtitles: "${selection.text}"\nThe full subtitle line it came from (for context only): "${selection.contextLine}"\n\nDecide whether the selection is a single dictionary word or a multi-word phrase/expression, then return a JSON object with these exact keys:\n- word: the selection in its natural dictionary/citation form (kanji/kana). If it's an inflected verb/adjective, convert to dictionary form. If it's a phrase, keep it as a natural chunk.\n- reading: hiragana reading of "word"\n- jlpt: JLPT level (N5/N4/N3/N2/N1) or "" if unclear\n- partOfSpeech: part of speech in English, or "phrase" / "expression" for multi-word selections\n- meaning: translation in ${lang}\n- meaningNative: simple Japanese definition\n- example: "${selection.contextLine}"\n- example_translated: translation of that exact line into ${lang}\n- tip: a short usage note in ${lang}, mentioning it was picked up from a video's subtitles\n- imageQuery: 2-3 English words suitable for an image search\nOutput ONLY the JSON object.` }
          ]
        })
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || data?.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const folder = sourceTitle.trim() || (T.subtitlesDefaultFolder || "Subtitles");
      const card = {
        word: parsed.word || selection.text,
        reading: parsed.reading || "",
        jlpt: parsed.jlpt || "",
        partOfSpeech: parsed.partOfSpeech || "",
        meaning: parsed.meaning || "",
        meaningNative: parsed.meaningNative || "",
        example: parsed.example || selection.contextLine,
        example_translated: parsed.example_translated || "",
        tip: parsed.tip || "",
        imageQuery: parsed.imageQuery || parsed.word || selection.text,
        imageDesc: "",
        folder, addedAt: Date.now(), id: Date.now(), savedAt: new Date().toISOString(),
      };
      const vocabData = loadVocabData();
      if (folder !== "Your Vocabulary" && !vocabData.folders.find(f => (typeof f === "string" ? f : f.name) === folder)) {
        vocabData.folders.push({ name: folder, createdAt: new Date().toISOString() });
      }
      if (!vocabData.cards.find(c => c.word === card.word && c.folder === folder)) {
        vocabData.cards.push(card);
        saveVocabData(vocabData);
        window.dispatchEvent(new CustomEvent("gaku_vocab_updated"));
      }
      setSessionSaved(prev => [card, ...prev]);
      showToast(`✓ "${card.word}" ${T.subtitlesSavedTo || "saved to"} "${folder}"`);
      setSelection(null);
      try { window.getSelection()?.removeAllRanges(); } catch {}
    } catch (e) {
      console.error("subtitle lookup error:", e);
      setLookupError(T.subtitlesLookupError || "Lookup failed. Please try again.");
    }
    setLookupLoading(false);
  };

  // ── STEP 1: paste screen ──
  if (!lines) {
    return (
      <div>
        {savedSet && (
          <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid ${C.purpleLight}` }}>
            <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:"0 0 8px" }}>{T.savedSetFound || "You have a saved study set from before."}</p>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleResume} style={{ ...S.btn, flex:1, background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff" }}>
                {T.resumeStudySet || "▶ Resume study set"}
              </button>
              <button onClick={handleResetSaved} style={{ ...S.btn, flex:1, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
                {T.resetStudySet || "Reset"}
              </button>
            </div>
          </div>
        )}
        <div style={{ ...S.card, marginBottom:16 }}>
          <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:6 }}>🎬 {T.subtitlesTitle || "Subtitles → Vocabulary"}</p>
          <p style={{ color:"#39ff14", fontSize:12, lineHeight:1.7, marginBottom:14 }}>
            {T.subtitlesDesc || "Paste subtitles or a transcript from a video you're already watching (e.g. YouTube's own \"Show transcript\" panel). Double-click a word or drag to select a phrase, then look it up and save it straight to your Vocabulary Builder."}
          </p>
          <label style={{ ...S.label, color:"#ffffff" }}>{T.subtitlesSourceLabel || "Video title / source (optional — used as the folder name)"}</label>
          <input value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} placeholder={T.subtitlesSourcePlaceholder || "e.g. NHK news 7/2"} style={{ ...S.input, marginBottom:12 }} />
          <label style={{ ...S.label, color:"#ffffff" }}>{T.subtitlesPasteLabel || "Paste subtitles / transcript here"}</label>
          <textarea value={raw} onChange={e => setRaw(e.target.value)} rows={10}
            placeholder={T.subtitlesPastePlaceholder || "Paste plain text or an .srt file's contents — timestamps and cue numbers are removed automatically."}
            style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.7, marginBottom:14 }} />
          <button onClick={handleLoad} disabled={!raw.trim()} style={{ ...S.btn, width:"100%", background: raw.trim() ? `linear-gradient(135deg,${C.purple},#9333ea)` : "#1e293b", color: raw.trim() ? "#fff" : "#ffffff" }}>
            {T.subtitlesLoadBtn || "Load transcript"}
          </button>
        </div>
        <p style={{ color:"#475569", fontSize:11, lineHeight:1.6 }}>
          {T.subtitlesCopyrightNote || "🔒 Text you paste here is saved only in this browser's local storage, so you can resume later — it's never sent to a server. Only the specific words/phrases you choose to save are added to your Vocabulary Builder."}
        </p>
      </div>
    );
  }

  // ── STEP 2: interactive transcript ──
  return (
    <div style={{ position:"relative" }}>
      {toast && (
        <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)", background:C.green, color:"#fff", padding:"9px 18px", borderRadius:99, fontSize:12, fontWeight:700, zIndex:9999, boxShadow:"0 4px 16px rgba(34,197,94,0.4)" }}>
          {toast}
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, margin:0 }}>
          🎬 {sourceTitle.trim() || (T.subtitlesDefaultFolder || "Subtitles")}
        </p>
        <button onClick={handleReset} style={{ ...S.btn, padding:"6px 12px", fontSize:11, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
          {T.subtitlesLoadNew || "↺ Load a different transcript"}
        </button>
      </div>

      {sessionSaved.length > 0 && (
        <p style={{ color:"#64748b", fontSize:11, marginBottom:10 }}>
          {T.subtitlesSavedCount || "Saved this session:"} {sessionSaved.map(c => c.word).join("、")}
        </p>
      )}

      {lookupError && !selection && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:`1px solid rgba(239,68,68,0.3)`, borderRadius:10, padding:"9px 14px", marginBottom:12 }}>
          <p style={{ color:C.red, fontSize:12, margin:0 }}>{lookupError}</p>
        </div>
      )}

      <div ref={containerRef} onMouseUp={handleMouseUp} style={{ ...S.card, marginBottom: selection ? 90 : 20 }}>
        {lines.map((line, i) => (
          <p key={i} data-subtitle-line
            style={{ color:"#e2e8f0", fontSize:15, lineHeight:2.1, margin:"0 0 6px", cursor:"text", userSelect:"text" }}>
            {line}
          </p>
        ))}
      </div>

      {selection && (
        <div style={{ position:"fixed", left:"50%", bottom:16, transform:"translateX(-50%)", width:"92%", maxWidth:560, background:"linear-gradient(135deg,#1e1b4b,#0f172a)", border:`1.5px solid ${C.purpleLight}`, borderRadius:14, padding:"14px 16px", boxShadow:"0 8px 30px rgba(0,0,0,0.5)", zIndex:9998 }}>
          <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 4px" }}>「<b>{selection.text}</b>」</p>
          {lookupError && <p style={{ color:C.red, fontSize:11, margin:"0 0 8px" }}>{lookupError}</p>}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setSelection(null)} style={{ ...S.btn, flex:1, padding:"9px 12px", fontSize:12, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
              {T.cancel || "Cancel"}
            </button>
            <button onClick={lookupAndSave} disabled={lookupLoading} style={{ ...S.btn, flex:2, padding:"9px 12px", fontSize:12, background:lookupLoading?"rgba(139,92,246,0.15)":`linear-gradient(135deg,${C.purple},#9333ea)`, color:lookupLoading?"#64748b":"#fff" }}>
              {lookupLoading ? "⏳ …" : (T.subtitlesLookupSaveBtn || "🔍 Look up & save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared exercise rendering (used by PracticeSet and ContentAnalyzer) ─────────
const SKILL_COLORS = {
  pronunciation:"#f59e0b", listening:"#06b6d4", conversation:"#22c55e",
  jlpt:"#a78bfa", reading:"#fb923c", kanji:"#e879f9", grammar:"#60a5fa"
};

function ExerciseCard({ item, revealed, onReveal, T, lang }) {
  const color = SKILL_COLORS[item.skill] || C.purpleLight;
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recogSupported, setRecogSupported] = useState(true);
  const recognitionRef = useRef(null);

  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setRecogSupported(false); return; }
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(text);
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    setTranscript("");
    setRecording(true);
    recognition.start();
  };

  return (
    <div style={{ ...S.card, borderLeft:`3px solid ${color}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ color, fontSize:11, fontWeight:700 }}>{SKILL_LABELS[item.skill] || item.skill}</span>
        <span style={{ color:"#ffffff", fontSize:11 }}>{item.type}</span>
      </div>
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, margin:"0 0 6px" }}>
        <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:0, whiteSpace:"pre-wrap", flex:1 }}>{item.prompt}</p>
      </div>
      {(item.skill === "listening" || item.skill === "pronunciation") && (
        <button onClick={()=>speakJapanese(stripForSpeech(item.skill === "listening" ? getListeningAudioText(item) : item.prompt))}
          style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, padding:"6px 12px", borderRadius:8, background:"rgba(6,182,212,0.12)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal, fontSize:12, fontWeight:700, cursor:"pointer" }}>
          🔊 {T?.listenAudio || "Listen"}
        </button>
      )}
      {item.skill === "pronunciation" && (
        <div style={{ marginBottom:8 }}>
          <button onClick={toggleRecording}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:recording?"rgba(239,68,68,0.15)":"rgba(168,85,247,0.12)", border:`1px solid ${recording?"rgba(239,68,68,0.4)":"rgba(168,85,247,0.3)"}`, color:recording?"#f87171":C.purpleLight, fontSize:12, fontWeight:700, cursor:"pointer" }}>
            {recording ? `⏺ ${T?.recordingInProgress || "Recording..."}` : `🎤 ${T?.recordVoice || "Record"}`}
          </button>
          {!recogSupported && <p style={{ color:C.red, fontSize:11, marginTop:6 }}>Voice input isn't supported in this browser — try Chrome.</p>}
          {transcript && (
            <div style={{ background:"rgba(168,85,247,0.06)", borderRadius:8, padding:"8px 10px", marginTop:6 }}>
              <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 3px" }}>{T?.yourSpokenAnswer || "Your spoken answer:"}</p>
              <p style={{ color:"#f1f5f9", fontSize:13, margin:0 }}>{transcript}</p>
            </div>
          )}
        </div>
      )}
      {item.skill === "conversation" && (
        <div style={{ marginBottom:8 }}>
          <VoiceGrammarCheck promptContext={item.prompt} lang={lang} T={T} />
        </div>
      )}
      <JLineTools text={item.prompt} lang={lang} T={T} />
      <button onClick={onReveal} style={{ padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#ff1a1a", fontSize:11, cursor:"pointer", marginBottom: revealed?10:0 }}>
        {revealed ? (T?.hideAnswerBtn || "Hide answer") : (T?.showAnswerBtn || "Show answer")}
      </button>
      {revealed && (
        <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
          <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>✅ ANSWER</p>
          <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 6px" }}>{item.answer}</p>
          {item.tip && <p style={{ color:"#ffffff", fontSize:12, margin:"0 0 6px", fontStyle:"italic" }}>💬 {item.tip}</p>}
          {item.source_url && (
            <a href={item.source_url} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", color:C.teal, fontSize:11, textDecoration:"none", background:"rgba(6,182,212,0.08)", border:"1px solid rgba(6,182,212,0.2)", padding:"3px 10px", borderRadius:6, fontWeight:600 }}>
              🔗 {item.source_url.replace(/https?:\/\/(www\.)?/,"").split("/")[0]}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CONTENT ANALYZER (GAKU Extension-style: paste text, get 10–20 leveled activities) ──
function ContentAnalyzer({ form, onLevelUp }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [source, setSource] = useState("");
  const [items, setItems] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState("all");
  const [sourceFuriganaOn, setSourceFuriganaOn] = useState(false);
  const [sourceFurigana, setSourceFurigana] = useState("");
  const [sourceFuriganaLoading, setSourceFuriganaLoading] = useState(false);
  const [savedSet, setSavedSet] = useState(null); // a previously-generated study set found in this browser, offered via Resume/Reset
  const contentCheck = useComprehensionCheck("content");

  const CONTENT_STORAGE_KEY = "gaku_content_study_set";

  // On first mount, check for a study set left over from before navigating away — but don't
  // auto-load it; let the student choose Resume or Reset so nothing appears unexpectedly.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(scopedKey(CONTENT_STORAGE_KEY));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length) setSavedSet(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever a study set is generated, so it survives navigating to another tab and back.
  useEffect(() => {
    if (items.length) {
      try { localStorage.setItem(scopedKey(CONTENT_STORAGE_KEY), JSON.stringify({ source, items, revealed })); } catch {}
    }
  }, [items, source, revealed]);

  const handleResume = () => {
    if (savedSet) {
      setSource(savedSet.source || "");
      setItems(savedSet.items || []);
      setRevealed(savedSet.revealed || {});
    }
    setSavedSet(null);
  };
  const handleResetSaved = () => {
    try { localStorage.removeItem(scopedKey(CONTENT_STORAGE_KEY)); } catch {}
    setSavedSet(null);
  };

  // Only build activities for the skills the student picked in "WHAT DO YOU WANT TO STUDY?".
  // Falls back to all skills if the student hasn't selected any yet.
  const ALL_SKILLS = ["pronunciation","listening","conversation","jlpt","reading","kanji","grammar"];
  const allowedSkills = (form.skills && form.skills.length) ? form.skills.filter(s => ALL_SKILLS.includes(s)) : ALL_SKILLS;

  // "Only Hiragana" / "Only Katakana" are notation-mode toggles, not activity types themselves —
  // when picked, every generated activity below is rendered using ONLY that script (no kanji,
  // and no mixing in the other kana script for whole-word notation). If neither is picked,
  // generation behaves exactly as before.
  const kanaOnlyMode = form.skills?.includes("onlyHiragana") ? "hiragana"
    : form.skills?.includes("onlyKatakana") ? "katakana" : null;
  const kanaOnlyInstruction = kanaOnlyMode
    ? `\n\nIMPORTANT NOTATION RULE: The student selected "Only ${kanaOnlyMode === "hiragana" ? "Hiragana" : "Katakana"}" mode. Rewrite every piece of Japanese text you generate (prompts, sentences, answer choices) using ONLY ${kanaOnlyMode} — convert any kanji and any characters from the other kana script into ${kanaOnlyMode}. Do not add parenthetical kanji or furigana. Meaning must stay the same; only the notation changes.`
    : "";

  const SKILL_DESC = {
    pronunciation: "pronunciation: pick a real sentence (or short phrase) from the content and ask the student to shadow it aloud, e.g. 「(real sentence)」を声に出して読んでください. Do NOT append a parenthetical label like「（シャドーイング）」to the Japanese prompt text — the app already shows \"Shadowing\" as a separate label. This gets an automatic 🔊 button so the student can hear the model pronunciation before repeating it, and a 🎤 button to record and check their own voice.",
    listening: "listening: take a real sentence from the content and turn it into a listening-comprehension fill-in-the-blank. Quote the ENTIRE original sentence with exactly ONE word/phrase/particle removed and replaced IN-PLACE, inside the quoted sentence itself, by ＿＿＿ — e.g. if the original sentence is 「簡単な文法だけで話しているので」, the prompt must contain 「簡単な文法だけで＿＿＿しているので」, NOT the full unblanked sentence repeated with a separate 'の___に何が入りますか' tacked on afterward. Prefix with a short scene/context in English like [Scene: ...], then the blanked sentence, then 何が入りますか？ with the ①②③④ choices. This is meant to be played aloud (the app adds a 🔊 button automatically) — the student listens, not just reads, so keep it phrased as something natural to hear.",
    conversation: "conversation: turn a real dialogue moment from the content into a role-play — give the situation in English, quote the real Japanese line that prompts a response, and ask the student to respond in Japanese aloud (the app gives a 🎤 button to record their spoken response).",
    jlpt: "jlpt: JLPT-style vocabulary/grammar check using a real word or phrase from the content — meaning check (\"「◯◯」は何を意味しますか？\") or a 4-choice ①②③④ question grounded in the content.",
    reading: "reading: \"what does this sentence/passage mean?\" comprehension using real text from the content, or a fill-in-the-blank with ①②③④ choices using a real sentence.",
    kanji: "kanji: reading of real kanji from the content (\"「◯◯」は何と読みますか？\").",
    grammar: "grammar: grammar point explanation or fill-in-the-blank with ①②③④ choices, using a real sentence from the content.",
  };
  const skillInstructions = allowedSkills.map(s => `   - ${SKILL_DESC[s]}`).join("\n");

  const analyze = async () => {
    const trimmed = source.trim();
    if (!trimmed) { setError(T.contentErrEmpty || "Paste some Japanese text (or a video's subtitles/description) first."); return; }
    setLoading(true); setError(""); setItems([]); setRevealed({}); setActiveSkillFilter("all");
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4500, provider:"turbo",
          messages:[{ role:"user", content:`You are a Japanese teacher using CLT (Communicative Language Teaching). The student's JLPT level is ${form.jlpt}.${kanaOnlyInstruction}

The student just encountered this piece of Japanese content (could be a sentence, an article, video subtitles/dialogue, or a social media caption). Analyze it and build practice activities directly FROM it — reuse its actual words, kanji, and sentences rather than generic examples.

CONTENT TO ANALYZE:
"""
${trimmed.slice(0, 6000)}
"""

The student has ONLY selected these study skills in their profile: ${allowedSkills.join(", ")}. You MUST ONLY generate activities tagged with one of these exact skill values — NEVER produce an activity for any other skill, even if the content would suit it well.

Create between 10 and 20 practice activities (choose a count that fits the amount of content — don't pad with repetition if the content is short). RULES:
1. Every activity must be grounded in the actual content above — quote or adapt real words/sentences from it, don't invent unrelated material.
2. JAPANESE FIRST: every prompt must contain real Japanese text from (or directly derived from) the content.
3. Scale difficulty to ${form.jlpt}:
   - N5: ask about basic kanji readings, simple vocabulary meaning, and simple comprehension ("元気？と聞かれたら何と返しますか？" style)
   - N4: basic grammar points used in the text, simple comprehension questions
   - N3: sentence meaning, grammar function of specific phrases, paraphrase
   - N2: nuance, formal/casual register differences, more complex grammar
   - N1: literary/formal nuance, implied meaning, stylistic questions
4. Activity types for each selected skill:
${skillInstructions}
   Aim for a natural spread across the selected skills rather than clustering on just one — but only generate a skill if the content actually gives you real material for it (e.g. skip conversation if there's no dialogue in the content).
5. For fill-in-the-blank, ALWAYS include the full original Japanese sentence with ___ for the blank AND the ①②③④ choices in the same prompt. The blank must sit exactly where the blanked word/particle belongs — never place it next to a particle or word that's already written elsewhere in the sentence, since that makes every choice wrong or duplicated (e.g. don't blank "＿＿＿に" if "に" already follows the blank). Before finalizing, mentally insert each choice into the blank and confirm exactly one produces a natural sentence matching your "answer" field.

Return fields for each activity:
- skill: one of ${allowedSkills.join(", ")}
- type: short English label (e.g. "Kanji reading", "Meaning check", "Fill-in-the-blank", "Comprehension", "Shadowing", "Role-play", "Output task")
- prompt: self-contained, must feature real Japanese text from the content
- answer: correct answer (in Japanese when applicable)
- tip: one short CLT-style tip, written in ${form.preferredLang || "English"} (NOT in Japanese unless that is the student's native language)

Respond ONLY with a valid JSON array, no markdown, no backticks:
[{"skill":"","type":"","prompt":"","answer":"","tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      if (Array.isArray(parsed) && parsed.length) {
        setItems(parsed);
      } else {
        setError(T.contentErrNoAct || "Couldn't generate activities from that content. Try pasting more text.");
      }
    } catch { setError(T.contentErrGeneric || "Could not analyze this content right now. Please try again."); }
    setLoading(false);
  };

  const filteredItems = activeSkillFilter === "all" ? items : items.filter(it => it.skill === activeSkillFilter);
  const skillsInResult = [...new Set(items.map(it => it.skill))];

  const toggleSourceFurigana = async () => {
    if (sourceFuriganaOn) { setSourceFuriganaOn(false); return; }
    setSourceFuriganaOn(true);
    if (!sourceFurigana && source.trim()) {
      setSourceFuriganaLoading(true);
      setSourceFurigana(await getFuriganaText(source.trim()));
      setSourceFuriganaLoading(false);
    }
  };

  return (
    <div>
      {!items.length && savedSet && (
        <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid ${C.purpleLight}` }}>
          <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:"0 0 8px" }}>{T.savedSetFound || "You have a saved study set from before."}</p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleResume} style={{ ...S.btn, flex:1, background:`linear-gradient(135deg,${C.teal},#0891b2)`, color:"#fff" }}>
              {T.resumeStudySet || "▶ Resume study set"}
            </button>
            <button onClick={handleResetSaved} style={{ ...S.btn, flex:1, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
              {T.resetStudySet || "Reset"}
            </button>
          </div>
        </div>
      )}
      <div style={{ ...S.card, marginBottom:16 }}>
        <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>✨ {T.contentTitle || "CREATE FROM CONTENT"}</p>
        <p style={{ color:"#ffffff", fontSize:12, marginBottom:12, lineHeight:1.7 }}>
          {(T.contentDesc || "Paste Japanese text you're reading or watching — an article, video subtitles/description, a caption, a message — and GAKU will build {jlpt}-level activities from it, just like GAKU Reader does on the web.").replace("{jlpt}", form.jlpt)}
        </p>
        <textarea
          value={source}
          onChange={e=>{ setSource(e.target.value); setSourceFurigana(""); setSourceFuriganaOn(false); }}
          placeholder={`日本語のテキストをここに貼り付けてください... (${T.contentPlaceholder || "paste Japanese text, subtitles, or a caption here"})`}
          rows={6}
          style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:10, color:"#f1f5f9", fontSize:13, padding:"10px 12px", marginBottom:12, resize:"vertical", fontFamily:"inherit" }}
        />
        <button onClick={analyze} disabled={loading} style={{ ...S.btn, width:"100%", background:loading?"rgba(6,182,212,0.15)":`linear-gradient(135deg,${C.teal},#0891b2)`, color:loading?"#64748b":"#fff" }}>
          {loading ? `⏳ ${T.contentAnalyzing || "Analyzing content..."}` : (items.length ? `🔄 ${T.contentAnalyzeAgain || "Analyze again"}` : `${T.contentAnalyzeButton || "Analyze & Generate Activities"} ✨`)}
        </button>
        <button onClick={toggleSourceFurigana} disabled={!source.trim() || sourceFuriganaLoading}
          style={{ ...S.btn, width:"100%", marginTop:8, background:sourceFuriganaOn?"rgba(103,232,249,0.15)":C.card, border:`1px solid ${sourceFuriganaOn?"rgba(103,232,249,0.4)":C.border}`, color:(!source.trim())?"#475569":sourceFuriganaOn?"#67e8f9":"#94a3b8" }}>
          {sourceFuriganaLoading ? "⏳" : `ふりがな ${sourceFuriganaOn ? (T?.furiganaOff || "OFF") : (T?.furiganaOn || "ON")}`}
        </button>
        {sourceFuriganaOn && sourceFurigana && (
          <div style={{ background:"rgba(103,232,249,0.06)", borderRadius:10, padding:"10px 12px", marginTop:10 }}>
            <p style={{ color:"#67e8f9", fontSize:13, lineHeight:1.9, margin:0, whiteSpace:"pre-wrap" }}>{sourceFurigana}</p>
          </div>
        )}
        {error && <p style={{ color:C.red, fontSize:12, marginTop:10 }}>{error}</p>}
      </div>

      {items.length > 0 && (
        <>
          {contentCheck.eligible && <LevelUpOffer T={T} currentLevel={form.jlpt} onConfirm={onLevelUp} onDismiss={contentCheck.dismiss} />}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            <button onClick={()=>setActiveSkillFilter("all")} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${activeSkillFilter==="all"?C.purpleLight:C.border}`, background:activeSkillFilter==="all"?"rgba(168,85,247,0.15)":C.card, color:activeSkillFilter==="all"?C.purpleLight:"#64748b" }}>
              すべて ({items.length})
            </button>
            {skillsInResult.map(s => (
              <button key={s} onClick={()=>setActiveSkillFilter(s)} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${activeSkillFilter===s?(SKILL_COLORS[s]||C.purpleLight):C.border}`, background:activeSkillFilter===s?"rgba(0,0,0,0.15)":C.card, color:activeSkillFilter===s?(SKILL_COLORS[s]||C.purpleLight):"#64748b" }}>
                {SKILL_LABELS[s]||s} ({items.filter(it=>it.skill===s).length})
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {filteredItems.map((it,i) => {
              const globalIdx = items.indexOf(it);
              return (
                <div key={i}>
                  <ExerciseCard item={it} revealed={!!revealed[globalIdx]} onReveal={()=>setRevealed(r=>({...r,[globalIdx]:!r[globalIdx]}))} T={T} lang={form?.preferredLang || "English"} />
                  {revealed[globalIdx] && (
                    <ComprehensionCheck itemId={`item-${globalIdx}`} checkins={contentCheck.checkins} onRecord={contentCheck.record} T={T} />
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

// ─── Conversation Predictor (YouTube/video dialogue → "predict the next line") ──────

// Any run of kanji (incl. the kanji iteration mark 々) NOT immediately followed by "(" is missing its furigana.
const hasMissingFurigana = (s) => /[\u4E00-\u9FFF\u3005]+(?!\()/.test(s);

// Small/fast models occasionally fall into a repetition loop on exhaustive transform tasks
// like this one, producing the same phrase over and over. Detect that degenerate case so we
// never show it to the student.
function isDegenerateFurigana(original, out) {
  if (!out) return true;
  if (out.length > original.length * 5 + 60) return true; // furigana roughly doubles length; way more than that = runaway
  for (let len = 30; len >= 15; len -= 5) {
    for (let i = 0; i + len * 3 <= out.length; i += len) {
      const chunk = out.slice(i, i + len);
      const second = out.indexOf(chunk, i + len);
      if (second !== -1 && out.indexOf(chunk, second + len) !== -1) return true; // same chunk appears 3+ times
    }
  }
  return false;
}

async function callClaudeFast(prompt, maxTokens = 700) {
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, provider:"fast", frequency_penalty:0.4,
      messages:[{ role:"user", content: prompt }]
    })
  });
  const d = await res.json();
  return d.content?.map(c=>c.text||"").join("").trim() || "";
}

// Known misreadings the model has produced in the past, plus katakana spelling variants we
// never want to show a student. Applied deterministically after generation so a correction is
// guaranteed regardless of what the model outputs. Add more pairs here as they're reported.
const JAPANESE_READING_CORRECTIONS = [
  [/反省(\s*)\(はんしょう\)/g, "反省$1(はんせい)"],
  [/今朝(\s*)\(こんちょう\)/g, "今朝$1(けさ)"],
  [/案の定(\s*)\(あのさだめ\)/g, "案の定$1(あんのじょう)"],
  [/コンヴィニ/g, "コンビニ"],
];
function applyJapaneseReadingCorrections(text) {
  if (!text) return text;
  let out = text;
  for (const [pattern, replacement] of JAPANESE_READING_CORRECTIONS) out = out.replace(pattern, replacement);
  return out;
}

// Generates furigana and automatically re-rolls (up to 2 extra passes, always from the ORIGINAL
// text — never feeding a possibly-broken previous output back in, which is what let a repetition
// loop compound). Falls back to the plain text (no furigana) rather than ever showing garbage.
async function getFuriganaText(original) {
  const prompt = `Add furigana in parentheses immediately after every single kanji word in the following Japanese text.
This is critical: do not skip ANY kanji — including compound words, proper nouns, counters, and uncommon kanji. Every kanji character must be followed directly by its reading in parentheses, using this exact format: 漢字(かんじ)
Never add furigana in parentheses after a hiragana or katakana word — parentheses are ONLY for kanji readings.
Use standard, dictionary-correct readings — for example 反省 is read (はんせい), never (はんしょう); 今朝 is read (けさ), never (こんちょう); 案の定 is read (あんのじょう), never (あのさだめ).
Always spell the word for "convenience store" as コンビニ (katakana), never コンヴィニ.
Keep every hiragana character, katakana character, and all punctuation exactly as-is. Do not add extra spaces. Output the text ONCE — never repeat any part of it.

Example:
Input: 日本語を勉強しています。
Output: 日本語(にほんご)を勉強(べんきょう)しています。

Now process this text. Return ONLY the resulting text with furigana added — no explanation, no markdown, nothing else:

${original}`;

  let out = await callClaudeFast(prompt);
  let attempts = 0;
  while (attempts < 2 && (isDegenerateFurigana(original, out) || hasMissingFurigana(out))) {
    out = await callClaudeFast(prompt);
    attempts++;
  }
  if (isDegenerateFurigana(original, out)) return original; // graceful fallback — never show a broken/looping result
  return applyJapaneseReadingCorrections(out);
}

function JLineTools({ text, lang, T }) {
  const [furigana, setFurigana] = useState("");
  const [romaji, setRomaji] = useState("");
  const [translation, setTranslation] = useState("");
  const [visible, setVisible] = useState({ furigana:false, romaji:false, translate:false });
  const [loadingType, setLoadingType] = useState(null);

  // Odd clicks show, even clicks hide. Content already fetched is cached and reused (never
  // re-fetched/re-appended), so a sentence is only ever generated once.
  const toggleVariant = async (mode) => {
    if (visible[mode]) { setVisible(v=>({ ...v, [mode]:false })); return; }
    setVisible(v=>({ ...v, [mode]:true }));
    const already = mode==="furigana" ? furigana : mode==="romaji" ? romaji : translation;
    if (already) return;
    setLoadingType(mode);
    try {
      if (mode === "furigana") {
        setFurigana(await getFuriganaText(text));
      } else {
        const instruction = mode === "romaji"
          ? `Convert this Japanese text to romaji (Hepburn romanization). Return ONLY the romaji text, no explanation:\n\n${text}`
          : `Translate this Japanese text into ${lang || "English"}. Return ONLY the translation, no explanation:\n\n${text}`;
        const res = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500,
            messages:[{ role:"user", content: instruction }]
          })
        });
        const d = await res.json();
        const out = d.content?.map(c=>c.text||"").join("").trim() || "";
        if (mode === "romaji") setRomaji(applyJapaneseReadingCorrections(out));
        else setTranslation(out);
      }
    } catch {}
    setLoadingType(null);
  };

  return (
    <div style={{ marginTop:6, marginBottom:6 }}>
      <div style={{ display:"flex", gap:6, marginBottom:6 }}>
        <button onClick={()=>toggleVariant("furigana")} disabled={loadingType!==null} style={{ fontSize:11, color:"#67e8f9", fontWeight:700, background:visible.furigana?"rgba(103,232,249,0.22)":"rgba(103,232,249,0.1)", padding:"4px 10px", borderRadius:8, border:"1px solid rgba(103,232,249,0.3)", cursor:"pointer" }}>
          {loadingType==="furigana" ? "⏳" : (T?.furiganaBtn || "ふりがな")}
        </button>
        <button onClick={()=>toggleVariant("romaji")} disabled={loadingType!==null} style={{ fontSize:11, color:"#c4b5fd", fontWeight:700, background:visible.romaji?"rgba(196,181,253,0.22)":"rgba(196,181,253,0.1)", padding:"4px 10px", borderRadius:8, border:"1px solid rgba(196,181,253,0.3)", cursor:"pointer" }}>
          {loadingType==="romaji" ? "⏳" : (T?.romajiBtn || "Romaji")}
        </button>
        <button onClick={()=>toggleVariant("translate")} disabled={loadingType!==null} style={{ fontSize:11, color:"#fbbf24", fontWeight:700, background:visible.translate?"rgba(251,191,36,0.22)":"rgba(251,191,36,0.1)", padding:"4px 10px", borderRadius:8, border:"1px solid rgba(251,191,36,0.3)", cursor:"pointer" }}>
          {loadingType==="translate" ? "⏳" : (T?.translateBtn || "Translate")}
        </button>
      </div>
      {visible.furigana && furigana && <p style={{ color:"#67e8f9", fontSize:12, margin:"0 0 4px", fontStyle:"italic", whiteSpace:"pre-wrap" }}>{furigana}</p>}
      {visible.romaji && romaji && <p style={{ color:"#c4b5fd", fontSize:12, margin:"0 0 4px", fontStyle:"italic", whiteSpace:"pre-wrap" }}>{romaji}</p>}
      {visible.translate && translation && <p style={{ color:"#fbbf24", fontSize:12, margin:"0 0 4px", fontStyle:"italic", whiteSpace:"pre-wrap" }}>{translation}</p>}
    </div>
  );
}

// Shared "record your spoken response, get AI grammar feedback" block — used by both
// Conversation Practice (ConversationTurnCard) and the "conversation" skill in Create From
// Content (ExerciseCard), so the same feedback experience is available in both places.
function VoiceGrammarCheck({ promptContext, lang, T }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recogSupported, setRecogSupported] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef("");

  const checkGrammar = async (spokenText) => {
    setFeedbackLoading(true);
    try {
      const prompt = `You are a supportive Japanese teacher reviewing a student's SPOKEN Japanese response (captured via speech recognition, so minor mis-transcriptions of particles/sounds are possible — use your judgement).

Conversation prompt the student was responding to: "${promptContext}"
Student's spoken response: "${spokenText}"

Check the response for grammar or word-choice mistakes (particle usage, verb conjugation, word order, unnatural phrasing). Ignore trivial speech-recognition artifacts that wouldn't be a real mistake.

If the response is already natural and correct, respond with exactly: {"hasError": false}

If there is a genuine mistake, respond with this JSON shape:
{"hasError": true, "incorrect": "the student's response as said (in Japanese)", "corrected": "the naturally corrected full sentence (in Japanese)", "translation": "translation of the corrected sentence into ${lang || "English"}", "explanation": "short explanation, written in ${lang || "English"}, of the mistake and the fix", "example": "one short additional Japanese example sentence using the corrected grammar point", "exampleTranslation": "translation of that example into ${lang || "English"}"}

Respond ONLY with valid JSON, no markdown, no backticks, nothing else.`;
      const out = await callClaudeFast(prompt, 700);
      const parsed = JSON.parse(out.replace(/```json|```/g,"").trim());
      setFeedback(parsed);
    } catch { setFeedback(null); }
    setFeedbackLoading(false);
  };

  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setRecogSupported(false); return; }
    if (recording) { recognitionRef.current?.stop(); return; }
    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
      lastTranscriptRef.current = t;
    };
    recognition.onend = () => {
      setRecording(false);
      if (lastTranscriptRef.current.trim()) checkGrammar(lastTranscriptRef.current.trim());
    };
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    lastTranscriptRef.current = "";
    setTranscript(""); setFeedback(null); setRecording(true); recognition.start();
  };

  return (
    <div>
      <button onClick={toggleRecording}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:recording?"rgba(239,68,68,0.15)":"rgba(168,85,247,0.12)", border:`1px solid ${recording?"rgba(239,68,68,0.4)":"rgba(168,85,247,0.3)"}`, color:recording?"#f87171":C.purpleLight, fontSize:12, fontWeight:700, cursor:"pointer" }}>
        {recording ? `⏺ ${T?.recordingInProgress || "Recording..."}` : `🎤 ${T?.recordVoice || "Record"}`}
      </button>
      {!recogSupported && <p style={{ color:C.red, fontSize:11, marginTop:6 }}>Voice input isn't supported in this browser — try Chrome.</p>}
      {transcript && (
        <div style={{ background:"rgba(168,85,247,0.06)", borderRadius:8, padding:"8px 10px", marginTop:8 }}>
          <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 3px" }}>{T?.yourSpokenAnswer || "Your spoken answer:"}</p>
          <p style={{ color:"#f1f5f9", fontSize:13, margin:0 }}>{transcript}</p>
        </div>
      )}
      {feedbackLoading && (
        <p style={{ color:"#94a3b8", fontSize:11, marginTop:8 }}>⏳ {T?.convCheckingGrammar || "AIフィードバック / Checking your grammar..."}</p>
      )}
      {!feedbackLoading && feedback && (
        feedback.hasError ? (
          <div style={{ background:"rgba(239,68,68,0.06)", borderRadius:8, padding:"10px 12px", marginTop:8, border:"1px solid rgba(239,68,68,0.2)" }}>
            <p style={{ color:"#f87171", fontSize:13, margin:"0 0 4px" }}>⚠️ {feedback.incorrect}</p>
            <p style={{ color:C.green, fontSize:13, margin:"0 0 4px" }}>✅ {feedback.corrected}</p>
            {feedback.translation && <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 8px", fontStyle:"italic" }}>{feedback.translation}</p>}
            <p style={{ color:C.amber, fontSize:11, fontWeight:700, margin:"0 0 3px" }}>ていせい / Correction</p>
            {feedback.explanation && <p style={{ color:"#cbd5e1", fontSize:12, margin:"0 0 8px" }}>{feedback.explanation}</p>}
            {feedback.example && (
              <>
                <p style={{ color:C.amber, fontSize:11, fontWeight:700, margin:"0 0 3px" }}>れい / Example</p>
                <p style={{ color:"#f1f5f9", fontSize:12, margin:"0 0 4px" }}>{feedback.example}</p>
                {feedback.exampleTranslation && <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 4px" }}>{feedback.exampleTranslation}</p>}
                <JLineTools text={feedback.example} lang={lang} T={T} />
              </>
            )}
          </div>
        ) : (
          <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:8, padding:"8px 10px", marginTop:8 }}>
            <p style={{ color:C.green, fontSize:12, margin:0 }}>✅ {T?.convGrammarOk || "Great — no mistakes found!"}</p>
          </div>
        )
      )}
    </div>
  );
}

function ConversationTurnCard({ turn, T, lang }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ ...S.card, borderLeft:`3px solid ${C.purpleLight}` }}>
      {turn.situation && (
        <p style={{ color:"#94a3b8", fontSize:11, fontStyle:"italic", margin:"0 0 8px" }}>💭 {turn.situation}</p>
      )}
      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
        <span style={{ color:C.teal, fontSize:11, fontWeight:700, flexShrink:0 }}>A:</span>
        <p style={{ color:"#f1f5f9", fontSize:14, lineHeight:1.8, margin:0, flex:1 }}>{turn.speakerALine}</p>
      </div>
      <button onClick={()=>speakJapanese(stripForSpeech(turn.speakerALine))}
        style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, padding:"6px 12px", borderRadius:8, background:"rgba(6,182,212,0.12)", border:`1px solid rgba(6,182,212,0.3)`, color:C.teal, fontSize:12, fontWeight:700, cursor:"pointer" }}>
        🔊 {T?.listenAudio || "Listen"}
      </button>
      <JLineTools text={turn.speakerALine} lang={lang} T={T} />

      <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:"6px 0 8px" }}>
        {T?.convYourTurn || "How would you respond?"}
      </p>
      <VoiceGrammarCheck promptContext={turn.speakerALine} lang={lang} T={T} />

      <div style={{ marginTop:12 }}>
        <button onClick={()=>setRevealed(r=>!r)} style={{ padding:"6px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, color:"#ff1a1a", fontSize:11, cursor:"pointer", marginBottom: revealed?10:0 }}>
          {revealed ? (T?.convHideBtn || "Hide model answer") : (T?.convRevealBtn || "Show model answer")}
        </button>
        {revealed && (
          <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ color:C.green, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>✅ {T?.convModelAnswer || "Model answer"}</p>
            <p style={{ color:"#f1f5f9", fontSize:13, margin:"0 0 8px" }}>{turn.speakerBLine}</p>
            <JLineTools text={turn.speakerBLine} lang={lang} T={T} />
            {Array.isArray(turn.altResponses) && turn.altResponses.length > 0 && (
              <>
                <p style={{ color:"#94a3b8", fontSize:11, fontWeight:700, margin:"8px 0 4px" }}>{T?.convAltResponses || "Other ways to say it"}</p>
                {turn.altResponses.map((alt, i) => (
                  <p key={i} style={{ color:"#cbd5e1", fontSize:12, margin:"0 0 3px" }}>
                    <span style={{ color:C.amber, fontWeight:700 }}>{alt.style ? `[${alt.style}] ` : ""}</span>{alt.text}
                  </p>
                ))}
              </>
            )}
            {turn.tip && <p style={{ color:"#ffffff", fontSize:12, margin:"8px 0 0", fontStyle:"italic" }}>💬 {turn.tip}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationPredictor({ form, onLevelUp }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [raw, setRaw] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [turns, setTurns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedSet, setSavedSet] = useState(null); // a previously-generated conversation set found in this browser
  const conversationCheck = useComprehensionCheck("conversation");

  const CONV_STORAGE_KEY = "gaku_conv_practice_set";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(scopedKey(CONV_STORAGE_KEY));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.turns) && parsed.turns.length) setSavedSet(parsed);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (turns && turns.length) {
      try { localStorage.setItem(scopedKey(CONV_STORAGE_KEY), JSON.stringify({ raw, sourceTitle, turns })); } catch {}
    }
  }, [turns, raw, sourceTitle]);

  const handleResumeSaved = () => {
    if (savedSet) {
      setRaw(savedSet.raw || "");
      setSourceTitle(savedSet.sourceTitle || "");
      setTurns(savedSet.turns || null);
    }
    setSavedSet(null);
  };
  const handleResetSaved = () => {
    try { localStorage.removeItem(scopedKey(CONV_STORAGE_KEY)); } catch {}
    setSavedSet(null);
  };

  const generate = async () => {
    const parsedLines = parseSubtitleText(raw);
    const cleanText = parsedLines.join("\n");
    if (!cleanText.trim()) { setError(T.contentErrEmpty || "Paste some Japanese text (or a video's subtitles/description) first."); return; }
    setLoading(true); setError(""); setTurns(null);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4000, provider:"turbo",
          messages:[{ role:"user", content:`You are a Japanese teacher using CLT (Communicative Language Teaching). The student's JLPT level is ${form.jlpt}.

Below is a real transcript/subtitles from a video the student is watching. Find natural back-and-forth conversational exchanges in it (two speakers, or a speaker and an implied listener) and turn each one into a "predict the next line" speaking practice item.

TRANSCRIPT:
"""
${cleanText.slice(0, 6000)}
"""

RULES:
1. Only use REAL lines quoted or lightly adapted from the transcript above — never invent unrelated dialogue.
2. Find between 5 and 12 exchanges (fewer if the transcript is short — don't pad).
3. For each exchange:
   - situation: one short sentence in ${form.preferredLang || "English"} describing the context (who's talking, where, why)
   - speakerALine: the real line that prompts a response (in Japanese)
   - speakerBLine: the real/actual response that follows it in the transcript (in Japanese) — this is the "model answer"
   - altResponses: an array of 2-3 alternate natural ways to respond to speakerALine, each as {"style":"casual"|"polite"|"native-like","text":"..."}, showing register variation
   - tip: one short CLT-style tip in ${form.preferredLang || "English"} about the response (nuance, politeness level, or when to use it)
4. Scale vocabulary/grammar complexity awareness to ${form.jlpt} in the tip, but always keep speakerALine/speakerBLine as the REAL transcript text.

Respond ONLY with a valid JSON array, no markdown, no backticks:
[{"situation":"","speakerALine":"","speakerBLine":"","altResponses":[{"style":"","text":""}],"tip":""}]` }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("") || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      if (Array.isArray(parsed) && parsed.length) {
        setTurns(parsed);
      } else {
        setError(T.convNoTurns || "Couldn't find a conversation in that content. Try pasting a transcript with more dialogue.");
      }
    } catch { setError(T.contentErrGeneric || "Could not analyze this content right now. Please try again."); }
    setLoading(false);
  };

  const handleReset = () => { setTurns(null); setRaw(""); setError(""); try { localStorage.removeItem(scopedKey(CONV_STORAGE_KEY)); } catch {} };

  if (!turns) {
    return (
      <div>
        {savedSet && (
          <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid ${C.purpleLight}` }}>
            <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, margin:"0 0 8px" }}>{T.savedSetFound || "You have a saved study set from before."}</p>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleResumeSaved} style={{ ...S.btn, flex:1, background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff" }}>
                {T.resumeStudySet || "▶ Resume study set"}
              </button>
              <button onClick={handleResetSaved} style={{ ...S.btn, flex:1, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
                {T.resetStudySet || "Reset"}
              </button>
            </div>
          </div>
        )}
        <div style={{ ...S.card, marginBottom:16 }}>
          <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:6 }}>🎙️ {T.convTitle || "Conversation Practice"}</p>
          <p style={{ color:"#39ff14", fontSize:12, lineHeight:1.7, marginBottom:14 }}>
            {T.convDesc || "Paste a video's subtitles or transcript (e.g. YouTube's own \"Show transcript\" panel). GAKU will find real conversational exchanges and let you predict — and speak — the next line before revealing the model answer."}
          </p>
          <label style={{ ...S.label, color:"#ffffff" }}>{T.subtitlesSourceLabel || "Video title / source (optional)"}</label>
          <input value={sourceTitle} onChange={e=>setSourceTitle(e.target.value)} placeholder={T.subtitlesSourcePlaceholder || "e.g. NHK news 7/2"} style={{ ...S.input, marginBottom:12 }} />
          <label style={{ ...S.label, color:"#ffffff" }}>{T.convPasteLabel || "Paste subtitles / transcript here"}</label>
          <textarea value={raw} onChange={e=>setRaw(e.target.value)} rows={10}
            placeholder={T.subtitlesPastePlaceholder || "Paste plain text or an .srt file's contents — timestamps and cue numbers are removed automatically."}
            style={{ ...S.input, resize:"vertical", fontFamily:"inherit", lineHeight:1.7, marginBottom:14 }} />
          <button onClick={generate} disabled={loading || !raw.trim()} style={{ ...S.btn, width:"100%", background:(loading||!raw.trim())?"rgba(168,85,247,0.15)":`linear-gradient(135deg,${C.purple},#9333ea)`, color:(loading||!raw.trim())?"#64748b":"#fff" }}>
            {loading ? `⏳ ${T.convGenerating || "Building conversation practice..."}` : (T.convGenerateBtn || "Build Conversation Practice")} {!loading && "✨"}
          </button>
          {error && <p style={{ color:C.red, fontSize:12, marginTop:10 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <p style={{ color:C.purpleLight, fontSize:12, fontWeight:700, letterSpacing:1, margin:0 }}>
          🎙️ {sourceTitle.trim() || (T.convTitle || "Conversation Practice")}
        </p>
        <button onClick={handleReset} style={{ ...S.btn, padding:"6px 12px", fontSize:11, background:C.card, border:`1px solid ${C.border}`, color:"#94a3b8" }}>
          {T.subtitlesLoadNew || "↺ Load a different transcript"}
        </button>
      </div>
      {conversationCheck.eligible && <LevelUpOffer T={T} currentLevel={form.jlpt} onConfirm={onLevelUp} onDismiss={conversationCheck.dismiss} />}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {turns.map((turn, i) => (
          <div key={i}>
            <ConversationTurnCard turn={turn} T={T} lang={form?.preferredLang || "English"} />
            <ComprehensionCheck itemId={`turn-${i}`} checkins={conversationCheck.checkins} onRecord={conversationCheck.record} T={T} />
          </div>
        ))}
      </div>
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
  onlyHiragana:"skillOnlyHiragana", onlyKatakana:"skillOnlyKatakana",
};

// Maps the app's 7-category skill taxonomy (used for time-budgeting the schedule) down to the
// 4 modes a resource link can actually match: reading / listening / speaking / writing.
const SKILL_TO_MODE = {
  conversation:"speaking", listening:"listening", reading:"reading",
  grammar:"writing", kanji:"writing", jlpt:"reading", pronunciation:"speaking",
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
      { task:`${skillLabel}: ${note} (${focus.mins} min)`, done:false, skill:SKILL_TO_MODE[focus.skill] },
      { task: t.vocabReview || "Vocabulary review — Anki or saved words (10 min)", done:false, skill:"reading" },
      i % 2 === 0 ? { task: t.speakAloud || "Speak aloud: summarize today's content in Japanese (5 min)", done:false, skill:"speaking" } : null,
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

  // Curated resources actually available for this student's level + chosen skills, so the AI
  // references real names/URLs we can already link to, instead of inventing resources we can't match.
  const levelResList = LEVEL_RESOURCES[form.jlpt] || [];
  const skillResList = (form.skills || []).flatMap(s => RESOURCES[s] || []);
  const availableResources = [...levelResList, ...skillResList]
    .filter((r, i, arr) => arr.findIndex(x => x.name === r.name && x.mode === r.mode) === i)
    .map(r => `- ${r.name} [${r.mode}] — ${r.url}`)
    .join("\n");

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

Resources actually curated for this student (prefer these by exact name when a task uses one of them; each is tagged with the single skill it trains):
${availableResources || "(none curated for this level/skill combo — invent a plausible real resource instead)"}

Create a SPECIFIC weekly study schedule for Week ${weekNum}. For each study day, provide 2-3 concrete tasks that:
1. Are specifically calibrated for ${form.jlpt} level students at week ${weekNum}/${totalWeeks}
2. Include REAL, specific resources — prefer the curated list above by exact name; only invent a resource (e.g. specific NHK Easy News topic, specific grammar point like て-form conditionals) if nothing curated fits
3. Progress logically from previous weeks (early weeks = fundamentals, later weeks = advanced application)
4. Total time per day must not exceed ${minsPerDay} minutes${lang !== "English" ? `\n5. All task text MUST be written in ${lang}` : ""}
5. EACH task must be tagged with exactly ONE "skill" field describing what the student actually DOES for that task: "reading", "listening", "speaking", or "writing". A kanji/vocab task studied from text is "reading", not "listening" — only tag "listening" if the task involves audio/video. Never guess a skill just because a resource name mentions an unrelated word.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "weekTheme": "One sentence describing this week's main focus",
  "schedule": {
    ${activeDays.map(d => `"${d}": [{"task": "specific task description (X min)", "skill": "reading|listening|speaking|writing", "done": false}]`).join(",\n    ")},
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
        provider: "fast",
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
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:500, provider:"fast",
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
                [`🎙️ ${T.convTitle}`, T.convDesc],
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
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400, provider:"fast",
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
        <p style={{ color:"#39ff14", fontSize:11, margin:0 }}>300〜800文字 · Communicative writing practice</p>
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

// Native-script display names for the 🌐 language badge (shown regardless of UI language)
const NATIVE_LANG_NAMES = {
  "English":"English","Spanish":"Español","French":"Français","German":"Deutsch",
  "Chinese (Simplified)":"简体中文","Chinese (Traditional)":"繁體中文","Italian":"Italiano",
  "Korean":"한국어","Thai":"ไทย","Malay":"Bahasa Melayu","Indonesian":"Bahasa Indonesia",
  "Vietnamese":"Tiếng Việt","Hindi":"हिन्दी","Japanese":"日本語","Turkish":"Türkçe",
  "Nepali":"नेपाली","Filipino":"Filipino",
};

// Maps the raw English values stored in form.goal / form.timeline to their T-object key,
// so the stored value can always be re-translated into the student's chosen UI language.
const GOAL_KEY_MAP = {
  "Pass JLPT N5":"goalN5", "Pass JLPT N4":"goalN4", "Pass JLPT N3":"goalN3",
  "Pass JLPT N2":"goalN2", "Pass JLPT N1":"goalN1", "Get a job in Japan":"goalJob",
  "Travel to Japan":"goalTravel", "Study abroad in Japan":"goalStudyAbroad",
  "Daily conversation":"goalConversation", "Other":"goalOther",
};
const TIMELINE_KEY_MAP = {
  "Less than 6 months":"lessThan6", "Within 1 year":"within1",
  "2-3 years":"twoThreeYears", "Over 3 years":"over3",
};
function translateGoal(rawGoal, displayGoal, T) {
  // "Other" goals store free text in displayGoal — never look that up in the map.
  if (rawGoal === "Other") return displayGoal || rawGoal;
  return T[GOAL_KEY_MAP[rawGoal]] || displayGoal || rawGoal;
}
function translateTimeline(rawTimeline, T) {
  return T[TIMELINE_KEY_MAP[rawTimeline]] || rawTimeline;
}

// ─── FORM ───────────────────────────────────────────────────────────────────────
// Backward-compat: the level-check quiz historically produced N5–N1, but the survey now
// uses a self-estimation scale (Beginner–Mastery). Map old values so auto-fill still works.
const JLPT_TO_ESTIMATION_LEVEL = { "N5":"Elementary", "N4":"Intermediate", "N3":"Upper Intermediate", "N2":"Advanced", "N1":"Mastery", "Beginner (no JLPT)":"Beginner" };
function toEstimationLevel(v) { return JLPT_TO_ESTIMATION_LEVEL[v] || v; }

function FormScreen({ onSubmit, onBack, onCancel, initialJlpt, initialForm }) {
  const [form, setForm] = useState(() => initialForm || {
    name:"", email:"", country:"", preferredLang:"English",
    goal:"", customGoal:"", timeline:"",
    jlpt: toEstimationLevel(initialJlpt) || "",
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
              <option value="Elementary">{T.levelElementary}</option>
              <option value="Intermediate">{T.levelIntermediate}</option>
              <option value="Upper Intermediate">{T.levelUpperIntermediate}</option>
              <option value="Advanced">{T.levelAdvanced}</option>
              <option value="Mastery">{T.levelMastery}</option>
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

// ─── Comprehension Check ("Did you understand this?") ──────────────────────────
// Shared across Weekly Schedule, Create From Content, and Conversation Practice.
// Each answered item is stored locally per student per section. Once a section has
// at least CHECKIN_MIN_RESPONSES answers and 80%+ are "Yes", the student is offered
// the chance to move themselves up to the next estimation level.
const CHECKIN_MIN_RESPONSES = 5;
const ESTIMATION_LEVELS = ["Beginner","Elementary","Intermediate","Upper Intermediate","Advanced","Mastery"];

function loadCheckins(sectionId) {
  try { return JSON.parse(localStorage.getItem(scopedKey(`gaku_checkin_${sectionId}`)) || "{}"); } catch { return {}; }
}
function saveCheckins(sectionId, data) {
  try { localStorage.setItem(scopedKey(`gaku_checkin_${sectionId}`), JSON.stringify(data)); } catch {}
}
function loadDismissed(sectionId) {
  try { return localStorage.getItem(scopedKey(`gaku_leveldismissed_${sectionId}`)) === "1"; } catch { return false; }
}
function saveDismissed(sectionId, val) {
  try { localStorage.setItem(scopedKey(`gaku_leveldismissed_${sectionId}`), val ? "1" : "0"); } catch {}
}
function useComprehensionCheck(sectionId) {
  const [checkins, setCheckins] = useState(() => loadCheckins(sectionId));
  const [dismissed, setDismissed] = useState(() => loadDismissed(sectionId));
  const record = (itemId, understood) => {
    setCheckins(prev => {
      const next = { ...prev, [itemId]: understood };
      saveCheckins(sectionId, next);
      return next;
    });
  };
  const values = Object.values(checkins);
  const total = values.length;
  const yesCount = values.filter(Boolean).length;
  const pct = total > 0 ? Math.round((yesCount / total) * 100) : 0;
  const meetsThreshold = total >= CHECKIN_MIN_RESPONSES && pct >= 80;
  // Once the student dismisses the level-up offer ("No"), don't show it again for this
  // section unless the streak breaks (drops below 80%) and later climbs back over 80%.
  useEffect(() => {
    if (dismissed && !meetsThreshold) {
      setDismissed(false);
      saveDismissed(sectionId, false);
    }
  }, [meetsThreshold, dismissed, sectionId]);
  const dismiss = () => { setDismissed(true); saveDismissed(sectionId, true); };
  const eligible = meetsThreshold && !dismissed;
  return { checkins, record, total, pct, eligible, dismiss };
}

// Small inline Yes/No control attached to a single schedule task / activity / turn.
function ComprehensionCheck({ itemId, checkins, onRecord, T }) {
  const answered = checkins[itemId];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }} onClick={e=>e.stopPropagation()}>
      <span style={{ color:"#ffffff", fontSize:11, fontWeight:600 }}>{T.didYouUnderstand || "Did you understand this?"}</span>
      <button onClick={()=>onRecord(itemId, true)} style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8, border:`1px solid ${answered===true?"rgba(34,197,94,0.5)":C.border}`, background:answered===true?"rgba(34,197,94,0.15)":"transparent", color:answered===true?C.green:"#94a3b8", cursor:"pointer" }}>
        {T.yes || "Yes"}
      </button>
      <button onClick={()=>onRecord(itemId, false)} style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8, border:`1px solid ${answered===false?"rgba(239,68,68,0.5)":C.border}`, background:answered===false?"rgba(239,68,68,0.15)":"transparent", color:answered===false?C.red:"#94a3b8", cursor:"pointer" }}>
        {T.no || "No"}
      </button>
    </div>
  );
}

// Banner offering to move up a level once comprehension checks are consistently positive.
function LevelUpOffer({ T, currentLevel, onConfirm, onDismiss }) {
  const [showPicker, setShowPicker] = useState(false);
  const idx = ESTIMATION_LEVELS.indexOf(currentLevel);
  const next = (idx >= 0 && idx < ESTIMATION_LEVELS.length - 1) ? ESTIMATION_LEVELS[idx + 1] : null;
  // Only the levels above the student's current level are offered — never a downgrade.
  const remainingLevels = idx >= 0 ? ESTIMATION_LEVELS.slice(idx + 1) : ESTIMATION_LEVELS;
  const LEVEL_T_KEY = { "Beginner":"beginner", "Elementary":"levelElementary", "Intermediate":"levelIntermediate", "Upper Intermediate":"levelUpperIntermediate", "Advanced":"levelAdvanced", "Mastery":"levelMastery" };
  if (!next || remainingLevels.length === 0) return null; // already at the top level
  return (
    <div style={{ ...S.card, marginBottom:12, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)" }}>
      {!showPicker ? (
        <>
          <p style={{ color:"#ffffff", fontSize:13, margin:"0 0 10px" }}>
            🎉 {T.levelUpPrompt || "You're understanding almost everything here! Would you like to update your level to a higher level?"}
          </p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowPicker(true)} style={{ ...S.btn, padding:"7px 14px", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", fontSize:12 }}>{T.yes || "Yes"}</button>
            <button onClick={onDismiss} style={{ ...S.btn, padding:"7px 14px", background:C.card, color:"#94a3b8", border:`1px solid ${C.border}`, fontSize:12 }}>{T.no || "No"}</button>
          </div>
        </>
      ) : (
        <>
          <p style={{ color:"#ffffff", fontSize:12, marginBottom:8 }}>
            {T.currentLevelLabel || "Current level:"} <strong>{currentLevel}</strong>
          </p>
          <p style={{ color:"#94a3b8", fontSize:12, marginBottom:8 }}>{T.chooseNewLevel || "Choose your new level:"}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {remainingLevels.map(l => (
              <button key={l} onClick={()=>onConfirm(l)} style={{ padding:"6px 12px", borderRadius:20, border:`1.5px solid ${l===next?C.purpleLight:C.border}`, background:l===next?"rgba(168,85,247,0.15)":C.card, color:"#e2e8f0", fontSize:12, cursor:"pointer" }}>
                {T[LEVEL_T_KEY[l]] || l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ form, onEdit, onLevelUp, onDeleteAccount, deleteAccountBusy }) {
  const T = useUITranslations(form?.preferredLang || "English");
  const [schedule, setSchedule] = useState(() => buildSchedule(form, getT(form?.preferredLang || "English")));
  const [milestones, setMilestones] = useState(() => buildMilestones(form));
  const [msDone, setMsDone] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [tab, setTab] = useState("schedule");
  const [resourceSubTab, setResourceSubTab] = useState("links");
  const [weekTheme, setWeekTheme] = useState("");
  const [aiScheduleLoading, setAiScheduleLoading] = useState(false);
  const { currentWeek, totalWeeks } = getWeekInfo(form);
  const scheduleCheck = useComprehensionCheck("schedule");

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
    // Sync current folders to chrome.storage for GAKU Reader extension
    try {
      const vocabInit = loadVocabData();
      const folderNames = ["Your Vocabulary", ...vocabInit.folders.map(f => typeof f === "string" ? f : f.name).filter(Boolean)];
      if (window.chrome?.storage?.local) {
        window.chrome.storage.local.set({ gaku_folders: folderNames });
      }
      if (window.chrome?.storage?.sync) {
        window.chrome.storage.sync.set({ gaku_folders: folderNames });
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
    let cancelled = false;
    const lang = form?.preferredLang || "English";
    const base = buildMilestones(form);
    if (lang === "English") {
      setMilestones(base);
    } else {
      // Always translate milestone text via AI for any non-English language
      translateMilestonesAI(base, lang).then(translated => {
        if (!cancelled) setMilestones(translated); // guard: a stale request from a previously-selected language must not clobber the current one
      });
    }
    return () => { cancelled = true; };
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
    { id:"vocabulary", label: T.tabVocabulary },
    { id:"subtitles",  label: T.tabSubtitles || "🎬 字幕帳" },
    { id:"resources",  label: T.tabResources },
    { id:"milestones", label: T.tabMilestones },
  ];
  const RESOURCE_SUBTABS = [
    { id:"links",    label: "🔗 " + (T.tabResources || "Resources") },
    { id:"content",  label: T.tabPractice || "✨ From Content" },
    { id:"conversation", label: "🎙️ " + (T.convTitle || "Conversation") },
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
          {onDeleteAccount && (
            <button onClick={onDeleteAccount} disabled={deleteAccountBusy} style={{ ...S.btn, padding:"8px 14px", background:"rgba(248,113,113,0.08)", color:"#f87171", border:"1px solid rgba(248,113,113,0.3)", fontSize:12, opacity:deleteAccountBusy?0.6:1 }}>
              {deleteAccountBusy ? "…" : (T.deleteAccount || "Delete Account")}
            </button>
          )}
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
            <p style={{ color:"#39ff14", fontSize:11, margin:0 }}>🎯 {translateGoal(form.goal, form.displayGoal, T)}</p>
            <p style={{ color:"#39ff14", fontSize:11, margin:0 }}>📅 {translateTimeline(form.timeline, T)}</p>
            <p style={{ color:"#39ff14", fontSize:11, margin:0 }}>📊 {form.jlpt}</p>
            <p style={{ color:"#39ff14", fontSize:11, margin:0 }}>🌐 {NATIVE_LANG_NAMES[form.preferredLang] || form.preferredLang}</p>
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
            {scheduleCheck.eligible && <LevelUpOffer T={T} currentLevel={form.jlpt} onConfirm={onLevelUp} onDismiss={scheduleCheck.dismiss} />}
            {/* Week progress banner */}
            <div style={{ ...S.card, marginBottom:12, background:"linear-gradient(135deg,rgba(139,92,246,0.12),rgba(6,182,212,0.08))", border:`1px solid rgba(139,92,246,0.25)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div>
                  <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, letterSpacing:1, margin:0 }}>📅 WEEK {currentWeek} / {totalWeeks}</p>
                  <p style={{ color:"#ffffff", fontSize:11, margin:"2px 0 0" }}>{totalWeeks - currentWeek} {T.weeksRemaining} · {Math.round((currentWeek/totalWeeks)*100)}{T.percentComplete}</p>
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
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ color:task.done?"#64748b":"#cbd5e1", fontSize:13, margin:0, lineHeight:1.6, textDecoration:task.done?"line-through":"none" }}>{task.task}</p>
                            {(() => {
                              const res = findTaskResourceLink(task.task, task.skill);
                              const nav = findTaskAppNav(task.task);
                              if (!res && !nav) return null;
                              return (
                                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
                                  {res && (
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                                       style={{ fontSize:11, color:C.teal, textDecoration:"none", border:"1px solid rgba(6,182,212,0.3)", borderRadius:8, padding:"3px 8px", background:"rgba(6,182,212,0.06)" }}>
                                      🔗 {res.name}
                                    </a>
                                  )}
                                  {nav && (
                                    <button onClick={e=>{ e.stopPropagation(); setTab(nav.tab); if (nav.resourceSubTab) setResourceSubTab(nav.resourceSubTab); }}
                                       style={{ fontSize:11, color:C.purpleLight, border:"1px solid rgba(139,92,246,0.3)", borderRadius:8, padding:"3px 8px", background:"rgba(139,92,246,0.06)", cursor:"pointer" }}>
                                      ▶ {T[nav.labelKey]}
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                            {task.done && (
                              <ComprehensionCheck itemId={`${day}-${idx}`} checkins={scheduleCheck.checkins} onRecord={scheduleCheck.record} T={T} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab==="vocabulary" && <VocabBuilder form={form} />}

        {tab==="subtitles" && <SubtitleVocabBuilder form={form} />}

        {tab==="resources" && (
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
              {RESOURCE_SUBTABS.map(st => (
                <button key={st.id} onClick={()=>setResourceSubTab(st.id)} style={{ padding:"7px 12px", borderRadius:20, border:`1.5px solid ${resourceSubTab===st.id?C.teal:C.border}`, background:resourceSubTab===st.id?"rgba(6,182,212,0.12)":C.card, color:resourceSubTab===st.id?C.teal:"#64748b", fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {st.label}
                </button>
              ))}
            </div>

            {resourceSubTab==="content" && <ContentAnalyzer form={form} onLevelUp={onLevelUp} />}

            {resourceSubTab==="conversation" && <ConversationPredictor form={form} onLevelUp={onLevelUp} />}

            {resourceSubTab==="links" && (
            <div>
            {(LEVEL_RESOURCES[form.jlpt] || []).length > 0 && (
              <div style={{ ...S.card, marginBottom:16, borderLeft:`3px solid ${C.teal}` }}>
                <p style={{ color:C.teal, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{T.recommendedForLevel}</p>
                <p style={{ color:"#ffffff", fontSize:12, marginBottom:14 }}>{T.curatedFor} {form.jlpt}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {(LEVEL_RESOURCES[form.jlpt] || []).map((r,i) => (
                    <div key={i} style={{ background:"rgba(6,182,212,0.04)", borderRadius:12, border:`1px solid rgba(6,182,212,0.15)`, padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{r.name}</p>
                        <span style={{ color:C.teal, fontSize:10, fontWeight:700, background:"rgba(6,182,212,0.1)", padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", marginLeft:8 }}>{T[r.levelKey]}</span>
                      </div>
                      <p style={{ color:"#94a3b8", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{(r.descKey && T[r.descKey]) || r.desc}</p>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 12px", marginBottom:10 }}>
                        {[[T.vocab,r.skills.vocab],[T.grammar,r.skills.grammar],[T.reading,r.skills.reading],[T.speaking,r.skills.speaking],[T.listening,r.skills.listening]].map(([label,val])=>(
                          <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <span style={{ color:"#ffffff", fontSize:10, minWidth:60 }}>{label}</span>
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
              <p style={{ color:"#ffffff", fontSize:12, marginBottom:16 }}>{T.curatedForLevel} {form.jlpt}, {T.skills} {(form.skills||[]).map(s=>T[SKILL_LABEL_KEY[s]]||SKILL_LABELS[s]).join(", ")}</p>
              {selectedResources.length === 0 && <p style={{ color:"#64748b", fontSize:13 }}>{T.noResources}</p>}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {selectedResources.map((r,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, border:`1px solid ${C.border}`, padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <p style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, margin:0 }}>{r.name}</p>
                      <span style={{ color:r.free?C.green:C.amber, fontSize:10, fontWeight:700, background:r.free?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)", padding:"2px 8px", borderRadius:99 }}>{r.free ? T.free : T.paid}</span>
                    </div>
                    <p style={{ color:C.purpleLight, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>{T[SKILL_LABEL_KEY[r.skill]]||SKILL_LABELS[r.skill]}</p>
                    <p style={{ color:"#ffffff", fontSize:12, margin:"0 0 10px", lineHeight:1.6 }}>{(r.descKey && T[r.descKey]) || r.desc}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", padding:"9px", background:`linear-gradient(135deg,${C.purple},#9333ea)`, color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                      → {T.openResource} {r.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            </div>
            )}
          </div>
        )}

        {tab==="milestones" && (
          <div style={{ ...S.card }}>
            <p style={{ color:C.red, fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:16 }}>{T.yourGoalRoadmap}</p>
            <p style={{ color:"#ffffff", fontSize:13, marginBottom:16 }}>{T.levelToGoal}: {form.jlpt} → {T.goal}: {form.displayGoal||form.goal}</p>
            {milestones.map((m,i) => (
              <div key={i} onClick={()=>setMsDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])} style={{ display:"flex", gap:12, padding:"12px 14px", borderRadius:12, background:msDone.includes(i)?"rgba(34,197,94,0.06)":C.card, border:`1px solid ${msDone.includes(i)?"rgba(34,197,94,0.2)":C.border}`, marginBottom:8, cursor:"pointer", alignItems:"flex-start" }}>
                <div style={{ width:24, height:24, borderRadius:8, border:`2px solid ${msDone.includes(i)?C.green:C.border}`, background:msDone.includes(i)?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {msDone.includes(i)?<span style={{ color:"#fff", fontWeight:900, fontSize:12 }}>✓</span>:<span style={{ color:"#ffffff", fontWeight:700, fontSize:11 }}>{i+1}</span>}
                </div>
                <p style={{ color:msDone.includes(i)?"#ffffff":"#7fffd4", fontSize:13, margin:0, lineHeight:1.6, textDecoration:msDone.includes(i)?"line-through":"none" }}>{m}</p>
              </div>
            ))}
            <div style={{ marginTop:20, padding:"16px", background:"rgba(168,85,247,0.06)", borderRadius:12, textAlign:"center", border:`1px solid rgba(168,85,247,0.2)` }}>
              <p style={{ fontSize:20, margin:"0 0 8px" }}>🌸</p>
              <p style={{ color:"#ffffff", fontSize:13, fontWeight:700, margin:"0 0 6px" }}>{T.youveGotThis}</p>
              <p style={{ color:"#ffb3d9", fontSize:12, lineHeight:1.7, margin:0 }}>{T.motivationText}</p>
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

// ─── ACCOUNT: policy/terms agreement required before any payment step ────────
// NOTE: policyText is a placeholder — Seito will supply the finished policy
// document text later; swap PLACEHOLDER_POLICY_TEXT below once it's ready.
const PLACEHOLDER_POLICY_TEXT = `This is placeholder text for GAKU's Terms of Service and Refund Policy.

Seito: replace this text with the finished policy document whenever it's ready — no other code changes are needed, students will immediately see the updated text and continue agreeing to it before every payment.`;

function PolicyGate({ T, name, email, plan, onAgreed, onCancel }) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/policy-agreement", {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ name, email, plan }),
      });
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d.error || "Failed to record agreement."); }
      onAgreed();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:480, width:"100%", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(148,163,184,0.2)", borderRadius:16, padding:"24px 22px" }}>
        <h2 style={{ color:"#f1f5f9", fontSize:17, fontWeight:900, margin:"0 0 14px" }}>{T?.policyTitle || "Terms & Refund Policy"}</h2>
        <div style={{ maxHeight:280, overflowY:"auto", background:"rgba(2,6,23,0.5)", border:"1px solid rgba(148,163,184,0.15)", borderRadius:10, padding:14, marginBottom:16 }}>
          <p style={{ color:"#94a3b8", fontSize:12.5, lineHeight:1.7, whiteSpace:"pre-wrap", margin:0 }}>{PLACEHOLDER_POLICY_TEXT}</p>
        </div>
        <label style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:16, cursor:"pointer" }}>
          <input type="checkbox" checked={agreed} onChange={(e)=>setAgreed(e.target.checked)} style={{ marginTop:2 }} />
          <span style={{ color:"#e2e8f0", fontSize:12.5, fontWeight:600 }}>{T?.policyAgreeLabel || "I agree to all terms"}</span>
        </label>
        {error && <p style={{ color:"#f87171", fontSize:11.5, margin:"0 0 12px" }}>{error}</p>}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px 14px", background:"transparent", border:"1px solid rgba(148,163,184,0.3)", borderRadius:10, color:"#94a3b8", fontSize:12.5, fontWeight:700, cursor:"pointer" }}>{T?.cancel || "Cancel"}</button>
          <button onClick={handleContinue} disabled={!agreed || submitting} style={{ flex:2, padding:"11px 14px", background: agreed ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(148,163,184,0.15)", border:"none", borderRadius:10, color:"#fff", fontSize:12.5, fontWeight:800, cursor: agreed ? "pointer":"not-allowed", opacity: submitting?0.7:1 }}>
            {submitting ? "…" : (T?.continueLabel || "Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────────
// ─── ACCOUNT: login / signup with optional GAKU invite code ──────────────────
function AuthScreen({ onAuthed, T, prefillEmail, initialMode }) {
  const [mode, setMode] = useState(initialMode || "login"); // login | signup
  const [rawEmail, setRawEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!supabase) {
    return <p style={{ color:"#f87171", fontSize:13 }}>Account features are not configured yet.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    const email = rawEmail.trim().toLowerCase(); // normalize so profile lookups (e.g. teacher assigning vocab) always match
    try {
      if (mode === "signup") {
        if (inviteCode.trim()) {
          const vRes = await fetch("/api/invite", {
            method: "POST", headers: { "Content-Type":"application/json" },
            body: JSON.stringify({ action: "validate", code: inviteCode.trim(), email }),
          });
          const vData = await vRes.json();
          if (!vRes.ok) throw new Error(vData.error || "Invalid invite code.");
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const userId = data?.user?.id;
        if (userId && inviteCode.trim()) {
          await fetch("/api/invite", {
            method: "POST", headers: { "Content-Type":"application/json" },
            body: JSON.stringify({ action: "redeem", code: inviteCode.trim(), userId }),
          });
        }
        if (userId) {
          const pRes = await fetch("/api/create-profile", {
            method: "POST", headers: { "Content-Type":"application/json" },
            body: JSON.stringify({ userId, email, isGakuStudent: !!inviteCode.trim() }),
          });
          if (!pRes.ok) {
            const pData = await pRes.json().catch(() => ({}));
            throw new Error(pData.error || "Failed to save your profile.");
          }
        }
        onAuthed({ userId, email });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthed({ userId: data?.user?.id || null, email });
      }
    } catch (e2) {
      setErr(e2.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <form onSubmit={handleSubmit} style={{ width:"100%", maxWidth:380, background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:20, padding:28 }}>
        <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, margin:"0 0 18px", textAlign:"center" }}>
          {mode === "login" ? (T?.loginTitle || "Log In") : (T?.signupTitle || "Create Your Account")}
        </h2>
        <input type="email" required placeholder={T?.emailPlaceholder || "Email"} value={rawEmail} onChange={e=>setRawEmail(e.target.value)}
          style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", marginBottom:10, background:"#0f172a", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f1f5f9", fontSize:14 }} />
        <input type="password" required minLength={6} placeholder={T?.passwordPlaceholder || "Password"} value={password} onChange={e=>setPassword(e.target.value)}
          style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", marginBottom:10, background:"#0f172a", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f1f5f9", fontSize:14 }} />
        {mode === "signup" && (
          <input placeholder={T?.invitationCodeOptional || "GAKU invite code (optional)"} value={inviteCode} onChange={e=>setInviteCode(e.target.value)}
            style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", marginBottom:10, background:"#0f172a", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#f1f5f9", fontSize:14 }} />
        )}
        {err && <p style={{ color:"#f87171", fontSize:12, margin:"0 0 10px" }}>{err}</p>}
        <button type="submit" disabled={busy} style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", opacity:busy?0.6:1 }}>
          {busy ? "…" : (mode === "login" ? (T?.loginButton || "Log In") : (T?.signupButton || "Sign Up"))}
        </button>
        <button type="button" onClick={()=>{setMode(m=>m==="login"?"signup":"login"); setErr("");}} style={{ display:"block", width:"100%", marginTop:14, background:"none", border:"none", color:"#94a3b8", fontSize:12, cursor:"pointer" }}>
          {mode === "login" ? (T?.needAccount || "Need an account? Sign up") : (T?.haveAccount || "Already have an account? Log in")}
        </button>
      </form>
    </div>
  );
}

// ─── ACCOUNT: blocks the dashboard while a new device awaits dual approval ────
function DeviceApprovalGate({ T }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
      <div style={{ maxWidth:380 }}>
        <p style={{ fontSize:36, margin:"0 0 12px" }}>📩</p>
        <h2 style={{ color:"#f1f5f9", fontSize:18, fontWeight:900, margin:"0 0 10px" }}>{T?.deviceApprovalTitle || "New Device Detected"}</h2>
        <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6 }}>{T?.deviceApprovalDesc || "We've sent an approval email to you and to GAKU. Once both approve, this device will be unlocked — please check your inbox."}</p>
      </div>
    </div>
  );
}

// ─── ACCOUNT: blocks the dashboard during a device-sharing-suspicion suspension ──
function DeviceSuspendedGate({ T, suspendedUntil }) {
  const untilLabel = suspendedUntil ? new Date(suspendedUntil).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a0f1e 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
      <div style={{ maxWidth:380 }}>
        <p style={{ fontSize:36, margin:"0 0 12px" }}>⏸️</p>
        <h2 style={{ color:"#f1f5f9", fontSize:18, fontWeight:900, margin:"0 0 10px" }}>{T?.deviceSuspendedTitle || "Account Temporarily Suspended"}</h2>
        <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6 }}>
          {(T?.deviceSuspendedDesc || "A 3rd device logged into this account, beyond the 2 devices already approved. As a precaution against account sharing, access is suspended until {date}.").replace("{date}", untilLabel)}
        </p>
      </div>
    </div>
  );
}


export default function GakuApp({ onBack, initialJlpt, initialName, initialEmail, skipTrialPaywall, previewPaywall }) {
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(!supabase);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");
  const [deviceStatus, setDeviceStatus] = useState(null); // null | 'checking' | 'approved' | 'pending' | 'suspended'
  const [deviceSuspendedUntil, setDeviceSuspendedUntil] = useState(null);
  // True once we've confirmed (via the profiles table) that the logged-in
  // account redeemed a GAKU invite code. These students should never hit the
  // trial interaction paywall.
  const [isGakuStudent, setIsGakuStudent] = useState(false);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(!!previewPaywall);
  // Set when a logged-out student clicks a paid plan (app-only Stripe link,
  // or an app+lessons plan) — we send them to sign up first (a Stripe
  // payment needs an account id to attach to, and the policy-agreement
  // email needs a real account), then resume straight into the policy
  // step once they're authenticated.
  const [pendingPlan, setPendingPlan] = useState(null); // { type: 'stripe'|'lessons', url, planLabel }
  // Shown as a full-screen step between "student clicked a paid plan" and
  // "student reaches the actual payment step" — see PolicyGate above.
  const [policyGate, setPolicyGate] = useState(null); // { type: 'stripe'|'lessons', url, planLabel }
  // True once we've opened a Stripe tab (or the student just logged in) and
  // we're actively polling for confirmation, so we can auto-dismiss the
  // paywall and drop them straight back onto their dashboard.
  const [awaitingUnlock, setAwaitingUnlock] = useState(false);
  const [paywallCurrency, setPaywallCurrency] = useState("JPY");
  const [paywallRate, setPaywallRate] = useState(null);
  const [paywallRateLoading, setPaywallRateLoading] = useState(false);
  const [paywallRateError, setPaywallRateError] = useState("");
  const [paywallRateTime, setPaywallRateTime] = useState(null);

  const CURRENCY_OPTIONS = [
    { code:"JPY", label:"JPY - 日本円" }, { code:"EUR", label:"EUR - Euro" },
    { code:"GBP", label:"GBP - British Pound" }, { code:"KRW", label:"KRW - Korean Won" },
    { code:"CNY", label:"CNY - Chinese Yuan" }, { code:"INR", label:"INR - Indian Rupee" },
    { code:"VND", label:"VND - Vietnamese Dong" }, { code:"THB", label:"THB - Thai Baht" },
    { code:"IDR", label:"IDR - Indonesian Rupiah" }, { code:"MYR", label:"MYR - Malaysian Ringgit" },
    { code:"PHP", label:"PHP - Philippine Peso" }, { code:"TRY", label:"TRY - Turkish Lira" },
    { code:"NPR", label:"NPR - Nepali Rupee" }, { code:"BRL", label:"BRL - Brazilian Real" },
    { code:"MXN", label:"MXN - Mexican Peso" }, { code:"CAD", label:"CAD - Canadian Dollar" },
    { code:"AUD", label:"AUD - Australian Dollar" },
  ];

  const fetchPaywallRate = async () => {
    setPaywallRateLoading(true); setPaywallRateError("");
    try {
      let rate = null;
      try {
        const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${paywallCurrency}`);
        const data = await res.json();
        rate = data?.rates?.[paywallCurrency] || null;
      } catch {}
      if (!rate) {
        // Frankfurter doesn't cover every currency (e.g. VND, NPR) — fall back to a wider-coverage source
        const res2 = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const data2 = await res2.json();
        if (data2?.result === "success") rate = data2?.rates?.[paywallCurrency] || null;
      }
      if (rate) { setPaywallRate(rate); setPaywallRateTime(new Date()); }
      else setPaywallRateError("Couldn't get the exchange rate. Please try again.");
    } catch { setPaywallRateError("Couldn't get the exchange rate. Please try again."); }
    setPaywallRateLoading(false);
  };

  const formatConverted = (usd) => {
    if (!paywallRate) return null;
    const val = usd * paywallRate;
    return val.toLocaleString(undefined, { maximumFractionDigits: val >= 100 ? 0 : 2 });
  };

  // Attaches the logged-in student's Supabase user id to the Stripe Payment Link
  // (client_reference_id) so the Stripe webhook knows which account to unlock,
  // plus their email so Stripe's checkout form is pre-filled.
  const buildStripeUrl = (baseUrl, user) => {
    if (!user) return baseUrl;
    const url = new URL(baseUrl);
    url.searchParams.set("client_reference_id", user.userId);
    if (user.email) url.searchParams.set("prefilled_email", user.email);
    return url.toString();
  };

  const openStripeCheckout = (baseUrl, user) => {
    window.open(buildStripeUrl(baseUrl, user), "_blank", "noopener,noreferrer");
    setAwaitingUnlock(true);
  };

  // Called when a student clicks an app-only paid plan. Requires login first
  // (so we have a real account for client_reference_id and the policy
  // record), then shows the policy gate before Stripe.
  const handlePayClick = (baseUrl, planLabel) => {
    if (authUser) { setPolicyGate({ type: "stripe", url: baseUrl, planLabel }); return; }
    setPendingPlan({ type: "stripe", url: baseUrl, planLabel });
    setAuthInitialMode("signup");
    setShowAuthScreen(true);
  };

  // Called when a student clicks an app+lessons plan. Same login-first
  // pattern, then policy gate, then on to the lesson request/application
  // page (book-lesson.html) — payment for these plans happens afterward,
  // once Seito manually confirms the booking and emails a Stripe link.
  const handleLessonPlanClick = (url, planLabel) => {
    if (authUser) { setPolicyGate({ type: "lessons", url, planLabel }); return; }
    setPendingPlan({ type: "lessons", url, planLabel });
    setAuthInitialMode("signup");
    setShowAuthScreen(true);
  };

  // Asks the server whether this account is now unlocked (paid or a
  // confirmed GAKU student) and, if so, drops the paywall so the student
  // lands straight back on their dashboard — no refresh needed.
  const checkAccountStatus = async (userId) => {
    try {
      const res = await fetch("/api/account-status", {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data?.isGakuStudent) setIsGakuStudent(true);
      if ((data?.isGakuStudent || data?.isPaid) && !previewPaywall) {
        setShowPaywall(false);
        setAwaitingUnlock(false);
        return true;
      }
    } catch {}
    return false;
  };

  // While we're waiting to hear back from Stripe (or right after login),
  // re-check account status whenever the student returns to this tab, and
  // also on a short interval as a fallback — the webhook is usually near-
  // instant but we don't want to depend on the tab regaining focus alone.
  useEffect(() => {
    if (!awaitingUnlock || !authUser) return;
    checkAccountStatus(authUser.id);
    const onVisible = () => { if (document.visibilityState === "visible") checkAccountStatus(authUser.id); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const interval = setInterval(() => checkAccountStatus(authUser.id), 4000);
    const timeout = setTimeout(() => setAwaitingUnlock(false), 5 * 60 * 1000); // stop polling after 5 min
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingUnlock, authUser]);

  // If the user arrived here from the diagnostic test result page (with name/email/jlpt
  // in the URL), always land on the Edit Profile form first — even if a profile is
  // already saved locally — so the freshly diagnosed name/email/JLPT level get applied.
  const [forceForm, setForceForm] = useState(!!(initialName || initialEmail));
  // Counts taps/clicks inside the dashboard. After 21 interactions, show the
  // payment screen so students who haven't unlocked yet see the value of the app.
  const [interactionCount, setInteractionCount] = useState(() => {
    try { return parseInt(localStorage.getItem(scopedKey("gaku_interaction_count")) || "0", 10) || 0; } catch { return 0; }
  });
  // Remembers which emails have already used up their 10 free interactions, so if they
  // re-enter their profile with the same email, they're sent straight to the payment screen.
  const getPaywalledEmails = () => {
    try { return JSON.parse(localStorage.getItem("gaku_paywalled_emails") || "[]"); } catch { return []; }
  };
  const markEmailPaywalled = (email) => {
    if (!email) return;
    try {
      const list = getPaywalledEmails();
      if (!list.includes(email)) { list.push(email); localStorage.setItem("gaku_paywalled_emails", JSON.stringify(list)); }
    } catch {}
  };
  const handleDashboardInteraction = () => {
    // Verified GAKU students (logged in + redeemed an invite code, or arrived
    // here already invite-verified via self-study.jsx) get unlimited use.
    if (skipTrialPaywall || (authUser && isGakuStudent)) return;
    setInteractionCount(c => {
      const next = c + 1;
      try { localStorage.setItem(scopedKey("gaku_interaction_count"), String(next)); } catch {}
      if (next >= 21) {
        setShowPaywall(true);
        markEmailPaywalled(form?.email);
        try { localStorage.setItem(scopedKey("gaku_interaction_count"), "0"); } catch {}
        return 0;
      }
      return next;
    });
  };
  // NOTE: the initial (unscoped) form load used to happen here on mount, but that
  // raced with Supabase's async getSession() — this component could paint once
  // with ACTIVE_USER_ID still null (reading shared/legacy data) before the auth
  // effect below corrected it. Removed; the effect below (keyed on authUser) now
  // loads the correctly-scoped form once auth state is known, and we don't render
  // the dashboard/form/vocab UI at all until authChecked is true (see the early
  // return further down).
  // Track the logged-in Supabase account (separate from the localStorage profile above).
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data?.session?.user || null);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
      setShowAuthScreen(false);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);
  // Once logged in, verify this device against known devices for the account —
  // triggers the dual-approval email flow for unrecognized devices.
  useEffect(() => {
    // Keep the module-level storage scope in sync with whoever is logged in,
    // then reload this student's own profile/vocab/interaction data (falls
    // back to the unscoped legacy keys when logged out).
    ACTIVE_USER_ID = authUser?.id || null;
    (async () => {
      // Pull/push the cross-domain bridge FIRST so that if this is the first
      // time this browser/domain has seen this account, the fields read right
      // below (gaku_form, gaku_interaction_count, vocab, etc.) already reflect
      // data brought over from wherever the student logged in previously.
      if (authUser) { await syncMigrationBridge(authUser.id); }
      try {
        const saved = localStorage.getItem(scopedKey("gaku_form"));
        const parsedForm = saved ? JSON.parse(saved) : null;
        // Migrate any legacy JLPT-tier or pre-rename jlpt value (e.g. "N4", "Beginner (no JLPT)")
        // stored before the six-tier estimation scale existed, so LevelUpOffer's
        // ESTIMATION_LEVELS.indexOf(currentLevel) lookup doesn't silently fail forever.
        if (parsedForm && parsedForm.jlpt) parsedForm.jlpt = toEstimationLevel(parsedForm.jlpt);
        setForm(parsedForm);
      } catch { setForm(null); }
      try { setInteractionCount(parseInt(localStorage.getItem(scopedKey("gaku_interaction_count")) || "0", 10) || 0); } catch { setInteractionCount(0); }
      try { window.dispatchEvent(new Event("gaku_vocab_updated")); } catch {}
      if (!authUser) { setDeviceStatus(null); setIsGakuStudent(false); return; }
      syncAssignedVocab(authUser.id);
      setDeviceStatus("checking");
      // Self-heal: if the paywall was already showing (e.g. from an earlier trial
      // session, or right after login/payment), this dismisses it the moment we
      // confirm the account is a GAKU student or has paid — no refresh needed.
      checkAccountStatus(authUser.id);
      fetch("/api/device-check", {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ userId: authUser.id, email: authUser.email, deviceId: getDeviceId(), deviceLabel: getDeviceLabel() }),
      })
        .then(r => r.json())
        .then(d => { setDeviceStatus(d.status || "pending"); setDeviceSuspendedUntil(d.suspendedUntil || null); })
        .catch(() => setDeviceStatus("pending"));
    })();
  }, [authUser]);
  const handleSubmit = (f) => {
    // Preserve planStartDate from existing form (only set it once, on first save)
    const startDate = (form && form.planStartDate) ? form.planStartDate : new Date().toISOString();
    const saved = { ...f, planStartDate: startDate };
    setForm(saved);
    setEditing(false);
    setForceForm(false);
    try { localStorage.setItem(scopedKey("gaku_form"), JSON.stringify(saved)); } catch {}
    // If this email already used up their free interactions before, go straight
    // to the payment screen instead of letting them browse the dashboard again.
    if (!skipTrialPaywall && !(authUser && isGakuStudent) && getPaywalledEmails().includes(saved.email)) {
      setShowPaywall(true);
    }
  };
  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => { setEditing(false); setForceForm(false); };
  const [deleteAccountBusy, setDeleteAccountBusy] = useState(false);
  const handleDeleteAccount = async () => {
    if (!authUser || !supabase) return;
    const confirmMsg = isGakuStudent
      ? (T?.deleteAccountConfirmGaku || "Delete your account? As a GAKU student, your data will be kept — you can log back in anytime with your email, password, and invite code.")
      : (T?.deleteAccountConfirmPaid || "Delete your account? This will permanently erase all your data. If you come back later, you'll need to sign up and pay again.");
    if (!window.confirm(confirmMsg)) return;
    setDeleteAccountBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("No active session");
      const res = await fetch("/api/admin-withdrawal", {
        method: "POST", headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "self_delete" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete account.");
      await supabase.auth.signOut();
      window.location.reload();
    } catch (e) {
      alert(e.message || "Something went wrong.");
    } finally {
      setDeleteAccountBusy(false);
    }
  };
  const prefilledForm = (initialName || initialEmail) ? {
    name: initialName || '',
    email: initialEmail || '',
    country: '', preferredLang: 'English',
    goal: '', customGoal: '', timeline: '',
    jlpt: toEstimationLevel(initialJlpt) || '',
    hoursPerDay: '', daysPerWeek: '', skills: []
  } : undefined;
  // When forced by URL params and a profile already exists, merge the existing saved
  // answers with the freshly-diagnosed name/email/JLPT level (URL values take priority).
  const formForEdit = form
    ? { ...form, name: initialName || form.name, email: initialEmail || form.email, jlpt: toEstimationLevel(initialJlpt) || form.jlpt }
    : prefilledForm;
  const T = useUITranslations(form?.preferredLang || "English");
  // Block all rendering until we know for sure whether someone is logged in (and
  // who). This closes the race condition where the dashboard/vocab UI could mount
  // for a moment with ACTIVE_USER_ID still null (before Supabase's async
  // getSession() resolves), reading unscoped/shared data instead of the correct
  // per-student data.
  if (!authChecked) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:13 }}>
        {T.loading || "Loading..."}
      </div>
    );
  }
  // Set synchronously (not only via the effect below) so that any child
  // component reading scoped storage during THIS render pass — e.g. a vocab
  // list calling loadVocabData() in its own useState initializer — always sees
  // the correct account, with no one-frame window where it could still read
  // the previous user's (or nobody's) data.
  ACTIVE_USER_ID = authUser?.id || null;
  const handleAuthed = ({ userId, email } = {}) => {
    setShowAuthScreen(false);
    if (pendingPlan && userId) {
      const plan = pendingPlan;
      setPendingPlan(null);
      setPolicyGate(plan);
      return;
    }
    setPendingPlan(null);
    // Not a paid-plan signup (e.g. the free GAKU-student flow, or a plain
    // login) — re-check right away instead of waiting on the authUser-effect
    // below, so the paywall doesn't linger for even one extra render.
    if (userId) { setAwaitingUnlock(true); checkAccountStatus(userId); }
  };
  const handlePolicyAgreed = () => {
    const gate = policyGate;
    setPolicyGate(null);
    if (!gate) return;
    if (gate.type === "stripe") {
      openStripeCheckout(gate.url, { userId: authUser.id, email: authUser.email });
    } else if (gate.type === "lessons") {
      window.open(gate.url, "_blank", "noopener,noreferrer");
    }
  };
  if (showAuthScreen) return <AuthScreen onAuthed={handleAuthed} T={T} prefillEmail={form?.email} initialMode={authInitialMode} />;
  if (policyGate) return <PolicyGate T={T} name={form?.name || authUser?.email} email={authUser?.email || form?.email} plan={policyGate.planLabel} onAgreed={handlePolicyAgreed} onCancel={()=>setPolicyGate(null)} />;
  if (authUser && deviceStatus === "suspended") return <DeviceSuspendedGate T={T} suspendedUntil={deviceSuspendedUntil} />;
  if (authUser && deviceStatus === "pending") return <DeviceApprovalGate T={T} />;
  if (!form || editing || forceForm) return <FormScreen onSubmit={handleSubmit} onBack={onBack} onCancel={form ? handleCancelEdit : undefined} initialJlpt={initialJlpt} initialForm={formForEdit} />;
  return (
    <div style={{ position:"relative" }} onClickCapture={handleDashboardInteraction}>
      <Dashboard form={form} onEdit={handleEdit} onLevelUp={(lvl)=>handleSubmit({ ...form, jlpt: lvl })} onDeleteAccount={authUser ? handleDeleteAccount : undefined} deleteAccountBusy={deleteAccountBusy} />
      {/* TEMP DEBUG — remove after confirming the counter works */}
      <div style={{ position:"fixed", bottom:12, right:12, zIndex:99999, background:"rgba(0,0,0,0.75)", color:"#4ade80", fontSize:11, fontFamily:"monospace", padding:"4px 8px", borderRadius:6 }}>
        count: {interactionCount}/21 {skipTrialPaywall ? "(skip)" : ""} {authUser && isGakuStudent ? "(gaku)" : ""}
      </div>
      {showPaywall && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(10,15,30,0.85)", backdropFilter:"blur(12px)" }}>
          <div style={{ background:"linear-gradient(135deg,#1e1b4b,#0f172a)", border:"1.5px solid rgba(139,92,246,0.4)", borderRadius:20, padding:"36px 32px", maxWidth:420, width:"90%", textAlign:"center", boxShadow:"0 8px 40px rgba(139,92,246,0.25)" }}>
            <p style={{ fontSize:28, margin:"0 0 6px" }}>🎌</p>
            <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:900, margin:"0 0 8px" }}>{T.studyPlanReadyTitle}</h2>
            <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 20px", lineHeight:1.6 }}>{T.studyPlanReadyDesc}</p>

            <button onClick={()=>{ setAuthInitialMode("signup"); setShowAuthScreen(true); }} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))", border:"1.5px solid rgba(34,197,94,0.45)", borderRadius:10, color:"#4ade80", fontSize:12, fontWeight:800, cursor:"pointer", textAlign:"center", marginBottom:8 }}>
              🎓 {T.freePlanGakuStudent}
            </button>
            <button onClick={()=>{ setAuthInitialMode("login"); setShowAuthScreen(true); }} style={{ display:"block", width:"100%", background:"none", border:"none", color:"#64748b", fontSize:11, cursor:"pointer", marginBottom:18 }}>
              {T.haveAccount || "Already have an account? Log in"}
            </button>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 12px", marginBottom:18, textAlign:"left" }}>
              <p style={{ color:"#94a3b8", fontSize:10, fontWeight:800, letterSpacing:1, margin:"0 0 8px" }}>💱 {T.convertCurrencyLabel || "SEE PRICES IN YOUR CURRENCY"}</p>
              <div style={{ display:"flex", gap:6 }}>
                <select value={paywallCurrency} onChange={e=>{ setPaywallCurrency(e.target.value); setPaywallRate(null); }} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:8, color:"#f1f5f9", fontSize:12, padding:"6px 8px" }}>
                  {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code} style={{ color:"#000" }}>{c.label}</option>)}
                </select>
                <button onClick={fetchPaywallRate} disabled={paywallRateLoading} style={{ padding:"6px 14px", borderRadius:8, background:"linear-gradient(135deg,#06b6d4,#0891b2)", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {paywallRateLoading ? "⏳" : (T.convertBtn || "Convert")}
                </button>
              </div>
              {paywallRate && (
                <p style={{ color:"#67e8f9", fontSize:11, margin:"8px 0 0" }}>
                  1 USD = {paywallRate.toLocaleString(undefined,{maximumFractionDigits:4})} {paywallCurrency} · {paywallRateTime?.toLocaleTimeString()}
                </p>
              )}
              {paywallRateError && <p style={{ color:C.red, fontSize:11, margin:"8px 0 0" }}>{paywallRateError}</p>}
            </div>

            <p style={{ color:"#a855f7", fontSize:10, fontWeight:800, margin:"0 0 6px", textAlign:"left", letterSpacing:1 }}>{T.appOnlyLabel}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
              <button onClick={()=>handlePayClick("https://buy.stripe.com/6oU7sL7qWg7C7wV1OqbMQ00", "App Only - Monthly ($14.99)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1))", border:"1.5px solid rgba(139,92,246,0.5)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#a855f7", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.monthlyLabel}</span>
                💳 $14.99 {T.perMonth} {formatConverted(14.99) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(14.99)} {paywallCurrency})</span>}
              </button>
              <button onClick={()=>handlePayClick("https://buy.stripe.com/28E28r9z46x2dVj0KmbMQ02", "App Only - 3 Months ($42.70)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(6,182,212,0.2),rgba(6,182,212,0.1))", border:"1.5px solid rgba(6,182,212,0.5)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#06b6d4", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.threeMonthsSave5}</span>
                💳 $42.70 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($14.23/mo)</span> {formatConverted(42.70) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(42.70)} {paywallCurrency})</span>}
              </button>
              <button onClick={()=>handlePayClick("https://buy.stripe.com/28E5kD8v07B6bNbct4bMQ03", "App Only - 6 Months ($80.95)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(34,197,94,0.1))", border:"1.5px solid rgba(34,197,94,0.5)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#22c55e", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.sixMonthsSave10}</span>
                💳 $80.95 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($13.49/mo)</span> {formatConverted(80.95) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(80.95)} {paywallCurrency})</span>}
              </button>
            </div>
            <p style={{ color:"#f59e0b", fontSize:10, fontWeight:800, margin:"0 0 6px", textAlign:"left", letterSpacing:1 }}>{T.appLessonsLabel}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
              <button onClick={()=>handleLessonPlanClick("/book-lesson.html?plan=3mo_30min", "App + Lessons - 3 Months, 30min/mo ($68.95)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))", border:"1.5px solid rgba(245,158,11,0.4)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#f59e0b", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.threeMonthsSave5_30min}</span>
                💳 $68.95 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($22.98/mo)</span> {formatConverted(68.95) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(68.95)} {paywallCurrency})</span>}
              </button>
              <button onClick={()=>handleLessonPlanClick("/book-lesson.html?plan=3mo_1hr", "App + Lessons - 3 Months, 1hr/mo ($95.20)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))", border:"1.5px solid rgba(245,158,11,0.4)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#f59e0b", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.threeMonthsSave5_1hr}</span>
                💳 $95.20 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($31.73/mo)</span> {formatConverted(95.20) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(95.20)} {paywallCurrency})</span>}
              </button>
              <button onClick={()=>handleLessonPlanClick("/book-lesson.html?plan=6mo_30min", "App + Lessons - 6 Months, 30min/mo ($133.45)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.08))", border:"1.5px solid rgba(251,191,36,0.5)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#fbbf24", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.sixMonthsSave5_30min}</span>
                💳 $133.45 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($22.24/mo)</span> {formatConverted(133.45) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(133.45)} {paywallCurrency})</span>}
              </button>
              <button onClick={()=>handleLessonPlanClick("/book-lesson.html?plan=6mo_1hr", "App + Lessons - 6 Months, 1hr/mo ($185.95)")} style={{ display:"block", width:"100%", padding:"11px 14px", background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.08))", border:"1.5px solid rgba(251,191,36,0.5)", borderRadius:10, color:"#f1f5f9", fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:"#fbbf24", fontSize:10, fontWeight:800, display:"block", marginBottom:1 }}>{T.sixMonthsSave10_1hr}</span>
                💳 $185.95 <span style={{ color:"#64748b", fontSize:10, fontWeight:400 }}>($30.99/mo)</span> {formatConverted(185.95) && <span style={{ color:"#67e8f9", fontWeight:400 }}>(≈ {formatConverted(185.95)} {paywallCurrency})</span>}
              </button>
            </div>
            <div style={{ marginBottom:14, textAlign:"center" }}>
              <p style={{ color:"#64748b", fontSize:11, margin:"0 0 8px" }}>{T.wantToJoinGaku}</p>
              <a href="https://www.seitojapanese.online/" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", padding:"9px 28px", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", borderRadius:10, fontSize:13, fontWeight:800, textDecoration:"none" }}>{T.yes}</a>
            </div>
            <button onClick={()=>setShowPaywall(false)} style={{ background:"none", border:"none", color:"#475569", fontSize:11, cursor:"pointer" }}>{T.checkLater}</button>
          </div>
        </div>
      )}
    </div>
  );
}
