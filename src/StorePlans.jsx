import React, { useEffect, useState } from 'react';
import { isStoreBillingAvailable, initBilling, loadPackages, buyPackage, restorePurchases } from './storeBilling';

// Subscription plans shown on the store-app "trial ended" screen.
// Renders nothing until RevenueCat is configured, so the screen safely falls back to invitation-code only.
export default function StorePlans({ T, userId, onPurchased }) {
  const [pkgs, setPkgs] = useState(null); // null = loading, [] = none
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!isStoreBillingAvailable() || !userId) { if (alive) setPkgs([]); return; }
        await initBilling(userId);
        const list = await loadPackages();
        if (alive) setPkgs(list);
      } catch (e) { if (alive) setPkgs([]); }
    })();
    return () => { alive = false; };
  }, [userId]);

  if (!pkgs || pkgs.length === 0) return null;

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
