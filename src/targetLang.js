// ─── TARGET LANGUAGE (prototype, 2026-11-04) ──────────────────────────────────
// GAKU Master was built to teach Japanese. This module lets the same app teach
// English ("en") or Mongolian ("mn") as an experiment, without touching the
// Japanese experience: when the target is "ja" (the default) nothing changes.
//
// How it works:
//  • The target language is chosen with ?learn=en|mn|ja in the URL, or in the app
//    (Dashboard header / signup), and remembered in localStorage.
//  • Speech (listening + speaking) uses the language's speech codes.
//  • Every AI request sent to /api/claude gets an extra instruction telling the model
//    that the student is learning this language instead of Japanese, so all the existing
//    prompts (study guide, Create From Content, vocabulary, conversation, writing…)
//    keep working without being rewritten one by one.
//
// To remove the prototype later: delete this file, its import in index.js, and the
// `tl()`/`isJa()` calls in GakuApp.jsx / nativeTts.js / nativeSpeech.js.

const LS_KEY = "gaku_target_lang";

export const TARGET_LANGS = {
  ja: { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵", stt: "ja-JP", tts: "ja-JP", ttsPrefix: "ja", gtts: "ja", sentenceEnd: "。！？!?\\n" },
  en: { code: "en", name: "English", native: "English", flag: "🇬🇧", stt: "en-US", tts: "en-US", ttsPrefix: "en", gtts: "en", sentenceEnd: ".!?。！？\\n" },
  mn: { code: "mn", name: "Mongolian", native: "Монгол хэл", flag: "🇲🇳", stt: "mn-MN", tts: "mn-MN", ttsPrefix: "mn", gtts: "mn", sentenceEnd: ".!?。！？\\n" },
};

// Level names stay the same as the Japanese flow (Beginner … Mastery); only the
// "approximately" suffix changes from JLPT (~N5) to CEFR (~A1) for non-Japanese targets.
export const CEFR_BY_LEVEL = {
  "Beginner": null,
  "Elementary": "~A1",
  "Intermediate": "~A2",
  "Upper Intermediate": "~B1",
  "Advanced": "~B2",
  "Mastery": "~C1",
};

let _current = null;

function readInitial() {
  try {
    const q = new URLSearchParams(window.location.search).get("learn");
    if (q && TARGET_LANGS[q.toLowerCase()]) {
      const v = q.toLowerCase();
      try { localStorage.setItem(LS_KEY, v); } catch {}
      return v;
    }
  } catch {}
  try {
    const s = localStorage.getItem(LS_KEY);
    if (s && TARGET_LANGS[s]) return s;
  } catch {}
  return "ja";
}

export function getTargetLang() {
  if (!_current) _current = readInitial();
  return _current;
}
export function tl() { return TARGET_LANGS[getTargetLang()]; }
export function isJa() { return getTargetLang() === "ja"; }

// Switching reloads the page: every screen, cached study guide and speech setting then
// starts cleanly in the new language (data is stored separately per language, see tlSuffix).
export function setTargetLang(code) {
  if (!TARGET_LANGS[code]) return;
  try { localStorage.setItem(LS_KEY, code); } catch {}
  _current = code;
  try {
    const u = new URL(window.location.href);
    u.searchParams.delete("learn");
    window.location.href = u.toString();
  } catch { window.location.reload(); }
}

// Appended to localStorage keys for non-Japanese targets so vocabulary, study guides and
// history from one language never mix with another. "" for Japanese = existing data untouched.
export function tlSuffix() { return isJa() ? "" : `__${getTargetLang()}`; }

function scriptNote(code) {
  if (code === "mn") return "Mongolian in Cyrillic script (Khalkha, standard modern Mongolian)";
  return "natural, current English";
}

export function overrideInstruction() {
  const c = tl();
  return [
    `IMPORTANT OVERRIDE — TARGET LANGUAGE: in this app the student is learning ${c.name} (${c.native}), NOT Japanese.`,
    `Wherever the instructions mention Japanese, JLPT, hiragana, katakana, kanji, furigana, romaji, 慣用句 (idioms), anime/manga or Japan,`,
    `substitute ${c.name}, CEFR levels (A1–C2), ${c.name} idioms and ${c.name}-speaking culture instead.`,
    `All example sentences, vocabulary, dialogue lines, questions and practice items must be real, natural ${scriptNote(c.code)}. Do not output any Japanese text or Japanese characters.`,
    `Never add furigana, ruby text or Japanese romaji. For any "reading" / pronunciation field give ${c.code === "mn" ? "a simple Latin transliteration of the Cyrillic word" : "a simple phonetic respelling (not IPA symbols)"}.`,
    `Keep the requested output format (JSON keys, numbering, ①②③④ choices, field names) exactly as asked.`,
  ].join(" ");
}


// ─── UI text overrides ────────────────────────────────────────────────────────
// Many on-screen descriptions say "Japanese" (Create From Content, Writing, Pronunciation…).
// For a non-Japanese target this swaps those strings for target-language versions. English and
// Japanese UI have hand-written text; any other UI language falls back to the English text
// (prototype limitation — those can be translated later).
export function targetLangTextOverrides(uiLang) {
  if (isJa()) return null;
  const c = tl();
  const ja = uiLang === "Japanese";
  const N = ja ? (c.code === "en" ? "英語" : "モンゴル語") : c.name;
  if (ja) {
    return {
      remindEventTitle: `GAKU Master — 5分の${N}復習`,
      fqDesc: `好きな${N}(キャプション、歌詞の一行、ニュースの文など)を貼り付けると、数秒で3問のクイズができます。`,
      fqPlaceholder: `${N}のテキストをここに貼り付けてください…`,
      tutorialMilestonesDesc: `これはあなたの${N}の目標へのロードマップです。これから先の道のりを見てみましょう。`,
      tutorialContentDesc: `さっそく試しましょう:${N}のテキスト(記事、字幕、キャプションなど)を下に貼り付けると、GAKUがそこから練習問題を作ります。ウェブ版のGAKU Readerと同じ仕組みです。`,
      ttsProblem: `🔇 音が出ませんか?お使いのスマホに${N}の音声が入っていない可能性があります。設定 →「テキスト読み上げの出力」を検索 → ${N}の音声データ(Google テキスト読み上げ)をインストールして、もう一度お試しください。`,
      writeVocabQPrompt: `次の単語を使って、${N}で短い文章を書いてください: {words}`,
      writeQDesc: `ネットで見つけた作文の問題(エッセイのテーマ、試験形式の問題、メールを書く課題など)を貼り付けてください。${N}で答えを書くと、GAKUが問題に合っているかチェックします。`,
      writeAPlaceholder: `${N}で答えを入力してください…`,
      writeErrNotJa: `答えは${N}で書いてください。`,
      copyDesc: `${N}の文を貼り付けて、1語ずつ書き写します。指やマウスでなぞって書き、下に入力するとGAKUがスペル・大文字・句読点をチェックします。`,
      copyPlaceholder: `${N}の文をここに貼り付けてください(一度に約200文字まで練習します)…`,
      copyErrEmpty: `先に文を貼り付けてください。`,
      copySummaryScore: `{total}語中{ok}語が1回で正解`,
      copyWordOf: `{total}語中{current}語目`,
      copyTraceHint: `指やマウスでなぞって書いたあと、下に入力して確認しましょう。`,
      copyTypeLabel: `見ながら入力`,
      copyTypePlaceholder: `この単語を入力…`,
      copyCheckBtn: `チェック`,
      copyClear: `消す`,
      copySpellOk: `✅ 完璧!スペルが正しいです。`,
      copySpellOkTries: `✅ 正解!({n}回目で成功)`,
      copySpellBad: `惜しい!赤い文字を見直して、もう一度入力してみましょう。`,
      tutorialWritingDesc: `さっそく試しましょう:「書き写し」で${N}の文を貼り付け、1語ずつなぞって入力するとスペルをチェックします。または「質問」で作文の問題を貼り付け、${N}で答えを入力すると、GAKUが問題に合っているか(合っていなければ模範解答も)教えてくれます。`,
      speakAloud: `声に出す:今日の内容を${N}で要約する(5分)`,
      currentJlpt: `現在の${N}レベル(自己評価)*`,
      modeGuideLock: `🔒 ノルマが終わるまで、字幕帳とマイルストーンはロックされています。ロックされたタブをタップするとスケジュールに戻ります。8に達すると、すべて解放されます。`,
      howToPractice: `貼り付けた${N}のテキスト(記事、字幕、キャプション)から、AIが練習問題を作ります。語彙、文法、読解、リスニング、会話、発音をカバー。「答えを見る」をタップして確認しましょう。`,
      vocabBuilderDesc: `トピックを入力すると、関連する${N}の単語が表示されます(英語・日本語どちらでもOK)`,
      searchingDictionary: `${N}の辞書を検索中...`,
      contentDesc: `読んでいる、または見ている${N}のテキスト(記事、動画の字幕・概要欄、キャプション、メッセージなど)を貼り付けてください。GAKUがそこから{jlpt}レベルの練習問題を作ります。ウェブ版のGAKU Readerと同じ仕組みです。`,
      contentPlaceholder: `${N}のテキスト、字幕、キャプションをここに貼り付けてください`,
      contentErrEmpty: `先に${N}のテキスト(または動画の字幕・概要欄)を貼り付けてください。`,
      pronListenDesc: `YouTubeなどの動画を、マイクの近くで音を出して再生します。GAKUが聞こえた内容を1行ずつ書き出し、翻訳で理解を助けます。`,
      pronDesc: `${N}のテキスト(記事、動画の字幕、歌、自分のメモなど)を貼り付けてください。「コンテンツから作成」と同じです。GAKUが自然な文やフレーズを取り出すので、声に出して読む(または聞いて繰り返す)と、発音がどれだけ近かったかをチェックします。`,
      pronPasteLabel: `${N}のテキストをここに貼り付け`,
      pronAddNewPlaceholder: `${N}の単語や文を入力または貼り付け...`,
    };
  }
  return {
    remindEventTitle: `GAKU Master — 5-min ${N} review`,
    fqDesc: `Paste any ${N} you like (a caption, lyrics line, news sentence) and get a 3-question quiz in seconds.`,
    fqPlaceholder: `Paste ${N} text here…`,
    tutorialMilestonesDesc: `This is your roadmap to your ${N} goal. Take a look at what's coming next on your journey.`,
    tutorialContentDesc: `Try it now: paste some ${N} text below (an article, subtitles, a caption) and let GAKU build practice activities from it — just like GAKU Reader does on the web.`,
    ttsProblem: `🔇 No sound? Your phone may not have a ${N} voice. Open Settings → search “Text-to-speech output” → install the ${N} voice data (Google Text-to-speech), then try again.`,
    writeVocabQPrompt: `Write a short text in ${N} using these words: {words}`,
    writeQDesc: `Paste a writing question you found online (an essay prompt, an exam-style question, an email task…). Write your answer in ${N} and GAKU checks it against the question.`,
    writeAPlaceholder: `Type your answer in ${N}…`,
    writeErrNotJa: `Please write your answer in ${N}.`,
    copyDesc: `Paste a ${N} sentence and copy it one word at a time. Trace each word with your finger or mouse, then type it below — GAKU checks your spelling, capital letters and punctuation.`,
    copyPlaceholder: `Paste a ${N} sentence here (about 200 characters are practiced at a time)…`,
    copyErrEmpty: `Paste a sentence first.`,
    copySummaryScore: `{ok} of {total} words right on the first try`,
    copyWordOf: `Word {current} of {total}`,
    copyTraceHint: `Trace the word with your finger or mouse, then type it below to check.`,
    copyTypeLabel: `Type what you copied`,
    copyTypePlaceholder: `Type this word…`,
    copyCheckBtn: `Check`,
    copyClear: `Clear`,
    copySpellOk: `✅ Perfect! Spelling is correct.`,
    copySpellOkTries: `✅ Correct! (got it after {n} attempt(s))`,
    copySpellBad: `Not quite — check the red letters and try again.`,
    tutorialWritingDesc: `Try it now: pick “Copying down”, paste a ${N} sentence and trace and type each word — GAKU checks your spelling. Or pick “Questions”, paste a writing question, type your answer in ${N}, and GAKU tells you if it fits (with a model answer if not).`,
    speakAloud: `Speak aloud: summarize today's content in ${N} (5 min)`,
    currentJlpt: `CURRENT ${N.toUpperCase()} LEVEL (SELF-ESTIMATE) *`,
    modeGuideLock: `🔒 Until the quota is done, Subtitles and Milestones are locked. Tap a locked tab and you'll come back to your Schedule. When you reach 8, everything unlocks.`,
    howToPractice: `AI-generated exercises built from ${N} text you paste (articles, subtitles, captions) — covers vocabulary, grammar, reading, listening, conversation, and pronunciation. Tap 'Show answer' to check yourself.`,
    vocabBuilderDesc: `Enter a topic to see related ${N} words (English or any language OK)`,
    searchingDictionary: `Searching ${N} dictionary...`,
    contentDesc: `Paste ${N} text you're reading or watching — an article, video subtitles/description, a caption, a message — and GAKU will build {jlpt}-level activities from it, just like GAKU Reader does on the web.`,
    contentPlaceholder: `Paste ${N} text, subtitles, or a caption here`,
    contentErrEmpty: `Paste some ${N} text (or a video's subtitles/description) first.`,
    pronListenDesc: `Play a YouTube or any video with the sound on near your mic. GAKU listens, writes down what it hears line by line, and helps you understand it with translation.`,
    pronDesc: `Paste any ${N} text — an article, video subtitles, a song, your own notes — just like Create From Content. GAKU will pull out natural sentences and phrases for you to read aloud (or listen and repeat), then check how close your spoken attempt was.`,
    pronPasteLabel: `Paste ${N} text here`,
    pronAddNewPlaceholder: `Type or paste a ${N} word or sentence...`,
  };
}
export function applyTargetLangText(T, uiLang) {
  const o = targetLangTextOverrides(uiLang);
  return o ? { ...T, ...o } : T;
}

// Does this text look like it is written in the target language? (Used by Writing's answer check.)
export function looksLikeTarget(text) {
  const t = text || "";
  const code = getTargetLang();
  if (code === "en") return /[A-Za-z]/.test(t);
  if (code === "mn") return /[\u0400-\u04FF]/.test(t);
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(t);
}

// Which skills a student can pick: kanji / kana-only / JLPT prep make no sense outside Japanese.
export function allowedSkillKeys(all) {
  return isJa() ? all : all.filter(k => !["kanji", "jlpt", "onlyHiragana", "onlyKatakana"].includes(k));
}

// ─── AI request hook ──────────────────────────────────────────────────────────
// Wraps window.fetch once. For POSTs to /api/claude while the target is not Japanese, it
// prepends the override above as a system message. Japanese mode is never touched.
let _installed = false;
export function installTargetLangFetch() {
  if (_installed || typeof window === "undefined" || !window.fetch) return;
  _installed = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input, init) => {
    try {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      if (!isJa() && url.includes("/api/claude") && init && typeof init.body === "string") {
        const body = JSON.parse(init.body);
        const isUiTranslation = Array.isArray(body.messages) && body.messages.some(m => typeof m.content === "string" && m.content.includes("Translate ONLY the VALUES"));
        if (Array.isArray(body.messages) && !isUiTranslation) {
          const extra = overrideInstruction();
          const msgs = body.messages.slice();
          if (msgs[0] && msgs[0].role === "system") {
            msgs[0] = { ...msgs[0], content: `${msgs[0].content}\n\n${extra}` };
          } else {
            msgs.unshift({ role: "system", content: extra });
          }
          init = { ...init, body: JSON.stringify({ ...body, messages: msgs }) };
        }
      }
    } catch {}
    return orig(input, init);
  };
}
installTargetLangFetch();
