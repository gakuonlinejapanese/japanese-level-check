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
// Resolves when the sentence has been spoken. Rejects (with a short reason) if the phone can't speak Japanese.
export async function nativeSpeak(text, rate = 0.85) {
  const TTS = await plugin();
  try {
    const { supported } = await TTS.isLanguageSupported({ lang: "ja-JP" });
    if (supported === false) throw new Error("no-japanese-voice");
  } catch (e) {
    if (e && e.message === "no-japanese-voice") throw e;
    // isLanguageSupported itself failing is not fatal — still try to speak.
  }
  await TTS.speak({ text, lang: "ja-JP", rate, pitch: 1.0, volume: 1.0, queueStrategy: 0 });
}
export async function nativeStop() {
  try { const TTS = await plugin(); await TTS.stop(); } catch {}
}
