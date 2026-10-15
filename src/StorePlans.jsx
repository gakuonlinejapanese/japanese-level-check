import React, { useEffect, useState } from 'react';
import { isStoreBillingAvailable, initBilling, loadPackages, buyPackage, restorePurchases, debugOfferings } from './storeBilling';

// TEMPORARY: lets the diagnostic show where loading stalls instead of waiting forever.
const withTimeout = (promise, ms, label) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout after ' + (ms / 1000) + 's at ' + label)), ms))]);

// Subscription plans shown on the store-app "trial ended" screen.
// Renders nothing until RevenueCat is configured, so the screen safely falls back to invitation-code only.
export default function StorePlans({ T, userId, onPurchased }) {
  const [pkgs, setPkgs] = useState(null); // null = loading, [] = none
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [diag, setDiag] = useState(''); // TEMPORARY: why plans are empty (remove once store billing works)
  const [step, setStep] = useState('start'); // TEMPORARY: current loading step for the diagnostic

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!isStoreBillingAvailable() || !userId) { if (alive) { setDiag(!userId ? 'no user id' : 'no RevenueCat key in this build'); setPkgs([]); } return; }
        setStep('configure');
        await withTimeout(initBilling(userId), 20000, 'configure');
        setStep('offerings');
        const list = await withTimeout(loadPackages(), 20000, 'offerings');
        if (alive) { if (!list.length) { try { setDiag('no packages: ' + await debugOfferings()); } catch (e2) { setDiag('no packages'); } } setPkgs(list); }
      } catch (e) { if (alive) { setDiag('error: ' + String((e && (e.message || e.code)) || e).slice(0, 300)); setPkgs([]); } }
    })();
    return () => { alive = false; };
  }, [userId]);

  if (pkgs === null) return <p style={{ color: '#fbbf24', fontSize: 10, lineHeight: 1.5, margin: '0 0 14px', wordBreak: 'break-word' }}>Plans loading… (step: {step})</p>;
  if (!pkgs || pkgs.length === 0) return diag ? <p style={{ color: '#fbbf24', fontSize: 10, lineHeight: 1.5, margin: '0 0 14px', wordBreak: 'break-word' }}>Plans unavailable ({diag})</p> : null;

  const label = (type) => (
    type === 'MONTHLY' ? (T?.storeMonthly || 'Monthly')
    : type === 'THREE_MONTH' ? (T?.store3Months || '3 months')
    : type === 'SIX_MONTH' ? (T?.store6Months || '6 months') : ''
  );

  const buy = async (p) => {
    setBusy(p.id); setMsg('');
    try {
      const r = await buyPackage(p);
      if (r.active) onPurchased && onPurchased();
      else if (!r.cancelled) setMsg(T?.storePurchaseFailed || 'Purchase could not be completed. Please try again.');
    } catch (e) { setMsg(T?.storePurchaseFailed || 'Purchase could not be completed. Please try again.'); }
    setBusy('');
  };

  const restore = async () => {
    setBusy('restore'); setMsg('');
    try {
      const r = await restorePurchases();
      if (r.active) onPurchased && onPurchased();
      else setMsg(T?.storeNothingToRestore || 'No previous purchases were found.');
    } catch (e) { setMsg(T?.storePurchaseFailed || 'Purchase could not be completed. Please try again.'); }
    setBusy('');
  };

  return (
    <div style={{ margin: '0 0 18px' }}>
      <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 800, margin: '0 0 10px' }}>{T?.storePlansTitle || 'Choose a plan to keep learning'}</p>
      {pkgs.map((p) => (
        <button key={p.id} onClick={() => buy(p)} disabled={!!busy}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 14px', margin: '0 0 8px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: busy && busy !== p.id ? 0.6 : 1 }}>
          <span>{busy === p.id ? '\u2026' : label(p.type)}</span>
          <span>{p.priceString}</span>
        </button>
      ))}
      <button onClick={restore} disabled={!!busy}
        style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 12.5, textDecoration: 'underline', cursor: 'pointer', margin: '4px 0 6px' }}>
        {busy === 'restore' ? '\u2026' : (T?.storeRestore || 'Restore purchases')}
      </button>
      {msg && <p style={{ color: '#f87171', fontSize: 11.5, margin: '4px 0 6px' }}>{msg}</p>}
      <p style={{ color: '#94a3b8', fontSize: 10.5, lineHeight: 1.6, margin: '6px 0 0' }}>
        {T?.storeAutoRenewNote || 'Subscriptions renew automatically at the price shown unless cancelled at least 24 hours before the end of the current period. You can manage or cancel in your App Store or Google Play account settings.'}
      </p>
    </div>
  );
}
