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
  const log = [];
  const note = (step, e) => log.push(step + ":" + String((e && (e.message || e.errorMessage || e.code)) || e || "fail").slice(0, 60));

  // Some phones (e.g. OnePlus/OxygenOS without Japanese voice data) let speak() "succeed" instantly without
  // making any sound. Real speech always takes a moment, so a near-instant finish counts as a failure and the
  // next method is tried (finally the audio-clip fallback in speakJapanese).
  const clean = String(text || "").replace(/\s+/g, "");
  // The Android plugin never checks the return value of the engine's speak() and never times out: if the
  // engine silently drops the request, the promise below stays pending FOREVER — no sound, no audio-clip
  // fallback and no yellow banner. So we also watch for the "a word started" event (onRangeStart) and give
  // up if there is no sign of speech within a few seconds.
  const START_WAIT_MS = 3500;
  const speakChecked = async (opts) => {
    const t0 = Date.now();
    let started = false;
    let handle = null;
    let timer = null;
    try { handle = await TTS.addListener("onRangeStart", () => { started = true; }); } catch {}
    const watchdog = new Promise((_, reject) => {
      timer = setTimeout(() => { if (!started) reject(new Error("silent-stalled")); }, START_WAIT_MS);
    });
    try {
      await Promise.race([TTS.speak(opts), watchdog]);
    } catch (e) {
      if (String((e && e.message) || "") === "silent-stalled") { try { await TTS.stop(); } catch {} }
      throw e;
    } finally {
      clearTimeout(timer);
      try { if (handle && handle.remove) await handle.remove(); } catch {}
    }
    if (clean.length >= 2 && Date.now() - t0 < 150) throw new Error("silent-instant-finish");
  };
  const stalled = (e) => String((e && e.message) || "") === "silent-stalled";
  let nativeDead = false; // the engine accepted the request but never produced speech

  // 1) Plain ja-JP request.
  try { await speakChecked({ ...base, lang: "ja-JP" }); return; }
  catch (e) { if (isInterrupt(e)) return; lastErr = e; note("ja-JP", e); if (stalled(e)) nativeDead = true; }

  // 2) Explicitly pick an installed Japanese voice (works when the engine's default language isn't Japanese).
  //    (Skipped when the engine already stalled — retrying it would only stall again, 3.5s at a time.)
  const idx = await findJapaneseVoiceIndex(TTS);
  if (!nativeDead) {
    if (idx >= 0) {
      try { await speakChecked({ ...base, lang: "ja-JP", voice: idx }); return; }
      catch (e) { if (isInterrupt(e)) return; lastErr = e; note("voice" + idx, e); if (stalled(e)) nativeDead = true; }
    } else { log.push("voices:none"); }
  }

  // 3) Bare "ja" locale.
  if (!nativeDead) {
    try { await speakChecked({ ...base, lang: "ja" }); return; }
    catch (e) { if (isInterrupt(e)) return; lastErr = e; note("ja", e); if (stalled(e)) nativeDead = true; }
  }

  // 4) Browser speech engine inside the WebView.
  if (await webSpeak(text, rate)) return;
  log.push("web:silent");

  // Nothing worked — tell the caller whether it looks like a missing Japanese voice.
  const noVoice = idx < 0;
  const err = new Error((noVoice ? "no-japanese-voice" : "native-error") + " | " + log.join(" | "));
  throw err;
}
export async function nativeStop() {
  try { const TTS = await plugin(); await TTS.stop(); } catch {}
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {}
}
