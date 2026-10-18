import GakuApp from './GakuApp';

// Password-recovery links (Supabase "Send password recovery") land on the Site URL.
// Send them straight to GAKU Master on the app domain, keeping the token hash.
const IS_RECOVERY_LINK = /type=recovery/.test(window.location.hash || '');
if (IS_RECOVERY_LINK && !(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform())
    && /(^|\.)vercel\.app$/.test(window.location.hostname)) {
  window.location.replace('https://app.seitojapanese.online/app' + window.location.hash);
}

// GAKU Master is the only app. Every URL (/, /app, ...) opens it directly.
// (The old "Japanese Level Check" quiz was retired and removed on 2026-10-18.)
export default function App() {
  const params = new URLSearchParams(window.location.search);
  const urlName  = params.get('name')  || '';
  const urlEmail = params.get('email') || '';
  const urlJlpt  = params.get('jlpt')  || '';
  const urlPreviewPaywall = params.get('preview') === 'paywall';
  const urlPreviewPlans = params.get('plans') === '1';

  return (
    <div>
      <GakuApp
        initialName={urlName}
        initialEmail={urlEmail}
        initialJlpt={urlJlpt}
        previewPaywall={urlPreviewPaywall}
        previewPlans={urlPreviewPlans}
      />
    </div>
  );
}
