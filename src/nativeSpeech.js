// Speech recognition for the iOS/Android store apps.
// The WebView inside a Capacitor app has no Web Speech API, so this installs a small
// SpeechRecognition-compatible class (window.SpeechRecognition) that is backed by the
// native recognizer. GakuApp.jsx keeps using the standard API and does not need changes.
// In normal browsers nothing is installed and the browser's own API is used.
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition as NativeSR } from '@capacitor-community/speech-recognition';

class NativeSpeechRecognition {
  constructor() {
    this.lang = 'ja-JP';
    this.interimResults = true;
    this.continuous = false;
    this.onresult = null;
    this.onend = null;
    this.onerror = null;
    this.onstart = null;
    this._active = false;
    this._last = '';
    this._handles = [];
  }

  _emit(text, isFinal) {
    if (typeof this.onresult !== 'function') return;
    const alt = { transcript: text, confidence: 1 };
    const result = Object.assign([alt], { isFinal });
    try { this.onresult({ resultIndex: 0, results: [result] }); } catch (e) { /* ignore handler errors */ }
  }

  _finish(error) {
    if (!this._active) return;
    this._active = false;
    this._handles.forEach(h => { try { h.remove(); } catch (e) { /* ignore */ } });
    this._handles = [];
    if (error && typeof this.onerror === 'function') { try { this.onerror({ error }); } catch (e) { /* ignore */ } }
    if (this._last) { this._emit(this._last, true); }
    this._last = '';
    if (typeof this.onend === 'function') { try { this.onend(); } catch (e) { /* ignore */ } }
  }

  async start() {
    if (this._active) return;
    this._active = true;
    this._last = '';
    try {
      const avail = await NativeSR.available();
      if (!avail.available) { this._finish('service-not-allowed'); return; }
      let perm = await NativeSR.checkPermissions();
      if (perm.speechRecognition !== 'granted') perm = await NativeSR.requestPermissions();
      if (perm.speechRecognition !== 'granted') { this._finish('not-allowed'); return; }
      if (!this._active) return; // stop() was called while asking permission
      this._handles.push(await NativeSR.addListener('partialResults', (data) => {
        const text = (data && data.matches && data.matches[0]) || '';
        if (!text) return;
        this._last = text;
        if (this.interimResults) this._emit(text, false);
      }));
      this._handles.push(await NativeSR.addListener('listeningState', (data) => {
        if (data && data.status === 'stopped') this._finish();
      }));
      if (typeof this.onstart === 'function') { try { this.onstart(); } catch (e) { /* ignore */ } }
      await NativeSR.start({
        language: this.lang || 'ja-JP',
        maxResults: 1,
        partialResults: true,
        popup: false,
      });
    } catch (e) {
      this._finish('audio-capture');
    }
  }

  stop() {
    if (!this._active) return;
    NativeSR.stop().catch(() => {}).then(() => this._finish());
  }

  abort() { this.stop(); }
}

if (Capacitor.isNativePlatform()) {
  window.SpeechRecognition = NativeSpeechRecognition;
  window.webkitSpeechRecognition = NativeSpeechRecognition;
}
