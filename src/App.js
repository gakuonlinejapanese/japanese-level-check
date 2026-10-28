import React from 'react';
import GakuApp from './GakuApp';
import { reportClientCrash } from './crashReport';

// Password-recovery links (Supabase "Send password recovery") land on the Site URL.
// Send them straight to GAKU Master on the app domain, keeping the token hash.
const IS_RECOVERY_LINK = /type=recovery/.test(window.location.hash || '');
if (IS_RECOVERY_LINK && !(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform())
    && /(^|\.)vercel\.app$/.test(window.location.hostname)) {
  window.location.replace('https://app.seitojapanese.online/app' + window.location.hash);
}

// Last line of defence: if anything in GAKU Master throws while rendering, the student sees a readable
// message (with the technical reason, so they can screenshot it) instead of a blank white page, and the
// error is logged on the server. Individual screens have their own, more specific boundaries too.
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { reportClientCrash('app-boundary', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    const msg = String((this.state.error && this.state.error.message) || this.state.error).slice(0, 200);
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 380, width: '100%', textAlign: 'center', color: '#e2e8f0', background: '#111827', border: '1px solid #1e293b', borderRadius: 16, padding: '28px 22px' }}>
          <p style={{ fontSize: 30, margin: '0 0 8px' }}>⚠️</p>
          <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>Something went wrong.</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.6 }}>Your study data is safe. Please reload the page. If this keeps happening, send a screenshot of this screen to your teacher.</p>
          <button onClick={() => window.location.reload()} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#9333ea)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 14 }}>Reload</button>
          <p style={{ fontSize: 10, color: '#64748b', margin: 0, wordBreak: 'break-word', fontFamily: 'monospace' }}>{msg}</p>
        </div>
      </div>
    );
  }
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
    <AppErrorBoundary>
      <div>
        <GakuApp
          initialName={urlName}
          initialEmail={urlEmail}
          initialJlpt={urlJlpt}
          previewPaywall={urlPreviewPaywall}
          previewPlans={urlPreviewPlans}
        />
      </div>
    </AppErrorBoundary>
  );
}
