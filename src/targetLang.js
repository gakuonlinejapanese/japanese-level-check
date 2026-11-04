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
        if (Array.isArray(body.messages)) {
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
