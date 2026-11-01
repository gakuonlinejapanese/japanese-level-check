// Native (Android) text-to-speech. The Android WebView's built-in speechSynthesis is unreliable (often
// silent, empty voice list), so inside the Android store app we call the phone's own TTS engine through
// the Capacitor plugin. Everywhere else the caller falls back to the browser's speechSynthesis.
let _mod = null;
export function isAndroidNative() {
  try {
    const c = typeof window !== "undefined" && window.Capacitor;
    return !!(c && typeof c.isNativePlatform === "function" && c.isNativePlatform() && c.getPlatform() === "android");
  } catch { return false; }
}
async function plugin() {
  if (!_mod) _mod = (await import("@capacitor-community/text-to-speech")).TextToSpeech;
  return _mod;
}
const isInterrupt = (e) => /interrupt|cancel|stop/i.test(String((e && (e.message || e)) || ""));

// Finds the index of an installed Japanese voice (plugin takes the index into getSupportedVoices()).
async function findJapaneseVoiceIndex(TTS) {
  try {
    const { voices } = await TTS.getSupportedVoices();
    if (!Array.isArray(voices)) return -1;
    const idx = voices.findIndex(v => /^ja([-_]|$)/i.test(v.lang || ""));
    return idx;
  } catch { return -1; }
}

// Browser speechSynthesis as a last resort inside the app. Resolves true if speech actually started.
function webSpeak(text, rate) {
  return new Promise((resolve) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth || typeof SpeechSynthesisUtterance === "undefined") { resolve(false); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP"; u.rate = rate;
      const v = (synth.getVoices() || []).find(x => /^ja([-_]|$)/i.test(x.lang || ""));
      if (v) u.voice = v;
      let started = false;
      u.onstart = () => { started = true; resolve(true); };
      u.onerror = () => resolve(started);
      setTimeout(() => { if (!started) resolve(false); }, 2500);
      try { synth.cancel(); } catch {}
      try { synth.resume(); } catch {}
      synth.speak(u);
    } catch { resolve(false); }
  });
}

// Resolves when the sentence has been spoken. Rejects (with a short reason) only if EVERY method failed.
// NOTE: we no longer trust isLanguageSupported() to block speech — on many phones (Samsung, Huawei, or
// when the default engine isn't Google's) it wrongly reports "not supported" even though speech works.
export async function nativeSpeak(text, rate = 0.85) {
  const TTS = await plugin();
  const base = { text, rate, pitch: 1.0, volume: 1.0, queueStrategy: 0 };
  let lastErr = null;

  // 1) Plain ja-JP request.
  try { await TTS.speak({ ...base, lang: "ja-JP" }); return; }
  catch (e) { if (isInterrupt(e)) return; lastErr = e; }

  // 2) Explicitly pick an installed Japanese voice (works when the engine's default language isn't Japanese).
  const idx = await findJapaneseVoiceIndex(TTS);
  if (idx >= 0) {
    try { await TTS.speak({ ...base, lang: "ja-JP", voice: idx }); return; }
    catch (e) { if (isInterrupt(e)) return; lastErr = e; }
  }

  // 3) Bare "ja" locale.
  try { await TTS.speak({ ...base, lang: "ja" }); return; }
  catch (e) { if (isInterrupt(e)) return; lastErr = e; }

  // 4) Browser speech engine inside the WebView.
  if (await webSpeak(text, rate)) return;

  // Nothing worked — tell the caller whether it looks like a missing Japanese voice.
  const noVoice = idx < 0;
  const err = new Error(noVoice ? "no-japanese-voice" : "native-error: " + String((lastErr && (lastErr.message || lastErr)) || ""));
  throw err;
}
export async function nativeStop() {
  try { const TTS = await plugin(); await TTS.stop(); } catch {}
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {}
}
