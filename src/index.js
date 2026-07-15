import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// One-time data migration for students moving from the old Vercel domain to
// the new custom domain (localStorage is scoped per-domain, so without this
// their study data/vocab/progress would look "gone" on first visit to the
// new domain — it isn't, it's just sitting under the old origin).
// Safe by design: only ever fills in KEYS THAT DON'T ALREADY EXIST locally,
// only talks to the exact old origin, only runs once (marker flag), and
// gives up after 3s so a slow/broken bridge never blocks the app loading.
function migrateFromOldDomain() {
  return new Promise((resolve) => {
    const MARKER = 'gaku_migrated_v1';
    const NEW_HOST = 'app.seitojapanese.online';
    const OLD_ORIGIN = 'https://japanese-level-check.vercel.app';

    if (localStorage.getItem(MARKER)) return resolve();
    if (window.location.hostname !== NEW_HOST) {
      // Nothing to migrate when running on the old domain itself.
      localStorage.setItem(MARKER, '1');
      return resolve();
    }

    let done = false;
    let iframe = null;

    function cleanup() {
      window.removeEventListener('message', onMessage);
      if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }

    function finish() {
      if (done) return;
      done = true;
      localStorage.setItem(MARKER, '1');
      cleanup();
      resolve();
    }

    function onMessage(evt) {
      if (evt.origin !== OLD_ORIGIN) return;
      if (!evt.data || evt.data.type !== 'GAKU_MIGRATE_RESPONSE') return;
      const entries = evt.data.entries || {};
      Object.keys(entries).forEach((k) => {
        if (localStorage.getItem(k) === null) {
          try {
            localStorage.setItem(k, entries[k]);
          } catch (e) {
            // storage full or blocked; skip this key rather than fail migration
          }
        }
      });
      finish();
    }

    window.addEventListener('message', onMessage);
    setTimeout(finish, 3000); // never block app startup for more than 3s

    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = OLD_ORIGIN + '/migrate-bridge.html';
    iframe.onload = () => {
      try {
        iframe.contentWindow.postMessage({ type: 'GAKU_MIGRATE_REQUEST' }, OLD_ORIGIN);
      } catch (e) {
        finish();
      }
    };
    iframe.onerror = finish;
    document.body.appendChild(iframe);
  });
}

migrateFromOldDomain().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();

  // Register a minimal, no-cache service worker so Chrome/Android and other
  // browsers recognize GAKU as an installable PWA ("Add to Home Screen").
  // It performs no caching, so it never serves stale content.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Installability is a progressive enhancement; ignore failures.
      });
    });
  }
});
// force rebuild 2026年 6月 5日 金曜日 07時17分26秒 JST
