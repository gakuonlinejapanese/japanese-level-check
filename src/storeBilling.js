// In-app subscriptions for the iOS/Android store apps, powered by RevenueCat.
// Web (Stripe) is untouched. Nothing here runs outside a Capacitor native app.
//
// RevenueCat setup (done in the RevenueCat dashboard, not in code):
//   - entitlement id: "premium"
//   - one offering (set as Current) with packages: Monthly, 3 Months, 6 Months
//   - the public SDK keys below (they are public by design, safe to commit)
import { Capacitor } from '@capacitor/core';

export const RC_ANDROID_KEY = process.env.REACT_APP_RC_ANDROID_KEY || '';
export const RC_IOS_KEY = process.env.REACT_APP_RC_IOS_KEY || '';
export const ENTITLEMENT_ID = 'premium';

let configuredFor = null; // userId the SDK is currently logged in as
let PurchasesRef = null;

function platformKey() {
  const p = Capacitor.getPlatform();
  if (p === 'ios') return RC_IOS_KEY;
  if (p === 'android') return RC_ANDROID_KEY;
  return '';
}

// True only inside a store app that has a RevenueCat key for its platform.
export function isStoreBillingAvailable() {
  return Capacitor.isNativePlatform() && !!platformKey();
}

// NOTE: returns { Purchases } (a plain object), never the plugin itself. A Capacitor plugin is a Proxy whose
// "then" looks like a method, so returning/awaiting it directly from an async function never settles.
async function getPurchases() {
  if (!PurchasesRef) {
    const mod = await import('@revenuecat/purchases-capacitor');
    PurchasesRef = mod.Purchases;
  }
  return { Purchases: PurchasesRef };
}

// Links store purchases to the Supabase user id (the webhook uses it to mark the account paid).
// TEMPORARY: onStep reports finer steps (and times out each one) so the diagnostic shows where it stalls.
const stepTimeout = (promise, ms, label) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout ' + (ms / 1000) + 's at ' + label)), ms))]);
export async function initBilling(userId, onStep) {
  const step = (t) => { try { onStep && onStep(t); } catch (e) {} };
  if (!isStoreBillingAvailable() || !userId) return false;
  step('import');
  const { Purchases } = await stepTimeout(getPurchases(), 8000, 'import');
  if (configuredFor === null) {
    step('configure');
    await stepTimeout(Purchases.configure({ apiKey: platformKey(), appUserID: userId }), 8000, 'configure');
  } else if (configuredFor !== userId) {
    step('logIn');
    await stepTimeout(Purchases.logIn({ appUserID: userId }), 8000, 'logIn');
  }
  configuredFor = userId;
  step('configured');
  return true;
}

// Returns [{ id, type, priceString, raw }] sorted monthly -> 3 months -> 6 months.
export async function loadPackages() {
  const { Purchases } = await getPurchases();
  const offerings = await Purchases.getOfferings();
  const pkgs = (offerings && offerings.current && offerings.current.availablePackages) || [];
  const order = { MONTHLY: 1, THREE_MONTH: 2, SIX_MONTH: 3 };
  return pkgs
    .map((p) => ({ id: p.identifier, type: p.packageType, priceString: p.product && p.product.priceString, raw: p }))
    .sort((a, b) => (order[a.type] || 9) - (order[b.type] || 9));
}

function isActive(customerInfo) {
  return !!(customerInfo && customerInfo.entitlements && customerInfo.entitlements.active && customerInfo.entitlements.active[ENTITLEMENT_ID]);
}

// Resolves { active, cancelled }. Never throws for a user-cancelled purchase.
export async function buyPackage(pkg) {
  const { Purchases } = await getPurchases();
  try {
    const res = await Purchases.purchasePackage({ aPackage: pkg.raw });
    return { active: isActive(res && res.customerInfo), cancelled: false };
  } catch (e) {
    if (e && e.userCancelled) return { active: false, cancelled: true };
    throw e;
  }
}

export async function restorePurchases() {
  const { Purchases } = await getPurchases();
  const res = await Purchases.restorePurchases();
  return { active: isActive(res && res.customerInfo) };
}

// TEMPORARY diagnostic: summarises what RevenueCat returned (offering ids and their product ids).
export async function debugOfferings() {
  const { Purchases } = await getPurchases();
  const o = await Purchases.getOfferings();
  const all = Object.keys((o && o.all) || {});
  const cur = o && o.current ? o.current.identifier : 'none';
  const detail = all.map((k) => k + '[' + ((o.all[k].availablePackages || []).map((p) => (p.product && p.product.identifier) || '?').join(',')) + ']').join(' ');
  return 'current=' + cur + ' offerings=' + (detail || 'none');
}
