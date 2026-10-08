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

async function getPurchases() {
  if (!PurchasesRef) {
    const mod = await import('@revenuecat/purchases-capacitor');
    PurchasesRef = mod.Purchases;
  }
  return PurchasesRef;
}

// Links store purchases to the Supabase user id (the webhook uses it to mark the account paid).
export async function initBilling(userId) {
  if (!isStoreBillingAvailable() || !userId) return false;
  const Purchases = await getPurchases();
  if (configuredFor === null) {
    await Purchases.configure({ apiKey: platformKey(), appUserID: userId });
  } else if (configuredFor !== userId) {
    await Purchases.logIn({ appUserID: userId });
  }
  configuredFor = userId;
  return true;
}

// Returns [{ id, type, priceString, raw }] sorted monthly -> 3 months -> 6 months.
export async function loadPackages() {
  const Purchases = await getPurchases();
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
  const Purchases = await getPurchases();
  try {
    const res = await Purchases.purchasePackage({ aPackage: pkg.raw });
    return { active: isActive(res && res.customerInfo), cancelled: false };
  } catch (e) {
    if (e && e.userCancelled) return { active: false, cancelled: true };
    throw e;
  }
}

export async function restorePurchases() {
  const Purchases = await getPurchases();
  const res = await Purchases.restorePurchases();
  return { active: isActive(res && res.customerInfo) };
}
