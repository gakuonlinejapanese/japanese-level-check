// Minimal service worker for PWA installability.
// Intentionally does NOT cache anything: this app relies on fresh
// Supabase auth/session state, Stripe checkout, and frequently-updated
// content, so caching responses could show students stale or broken data.
// This file only exists so browsers recognize the site as an installable PWA.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass every request straight through to the network, no caching.
self.addEventListener('fetch', () => {});
