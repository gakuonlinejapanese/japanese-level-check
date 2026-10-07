import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Store apps (Capacitor) bundle the web files locally, so relative "/api/..." calls must
// go to the live server. CapacitorHttp (enabled in capacitor.config.json) sends these
// natively, so no CORS setup is needed on the server.
const IS_NATIVE_APP = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
if (IS_NATIVE_APP) {
  const API_ORIGIN = 'https://app.seitojapanese.online';
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) return origFetch(API_ORIGIN + input, init);
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
