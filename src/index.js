import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './nativeSpeech';

// Store apps (Capacitor) bundle the web files locally, so relative "/api/..." calls must
// go to the live server. CapacitorHttp (enabled in capacitor.config.json) sends these
// natively, so no CORS setup is needed on the server.
const IS_NATIVE_APP = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
if (IS_NATIVE_APP) {
  // Primary custom domain first, then the vercel.app domain as a fallback. Some
  // networks (e.g. certain ISPs/DNS resolvers) cannot reach the custom domain, which
  // left students stuck on "New Device Detected" (2026-10-18). The origin that last
  // worked is remembered so later calls go straight to it.
  const API_ORIGINS = ['https://app.seitojapanese.online', 'https://japanese-level-check.vercel.app'];
  let activeOrigin = 0;
  try {
    const saved = parseInt(localStorage.getItem('gaku_api_origin_idx') || '0', 10);
    if (saved >= 0 && saved < API_ORIGINS.length) activeOrigin = saved;
  } catch {}
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      let lastErr;
      for (let i = 0; i < API_ORIGINS.length; i++) {
        const idx = (activeOrigin + i) % API_ORIGINS.length;
        try {
          const res = await origFetch(API_ORIGINS[idx] + input, init);
          if (idx !== activeOrigin) {
            activeOrigin = idx;
            try { localStorage.setItem('gaku_api_origin_idx', String(idx)); } catch {}
          }
          return res;
        } catch (e) {
          // Network-level failure only (the server was unreachable): try the next origin.
          lastErr = e;
        }
      }
      throw lastErr;
    }
    return origFetch(input, init);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register a minimal, no-cache service worker so Chrome/Android and other
// browsers recognize GAKU as an installable PWA ("Add to Home Screen").
// It performs no caching, so it never serves stale content.
if (!IS_NATIVE_APP && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Installability is a progressive enhancement; ignore failures.
    });
  });
}
// force rebuild 2026年 6月 5日 金曜日 07時17分26秒 JST
