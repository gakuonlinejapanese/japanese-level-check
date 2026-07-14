import Stripe from "stripe";
import { getAdminClient } from "./_supabaseAdmin.js";

// Stripe needs the RAW request body to verify the webhook signature, so we
// must disable Vercel's default JSON body parsing for this route.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    console.error("Stripe env vars missing (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET)");
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }
  const stripe = new Stripe(stripeSecret);

  let event;
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // We attach the logged-in student's Supabase user id as client_reference_id
      // when opening the Stripe Payment Link (see GakuApp.jsx), so we know
      // exactly which profile to unlock — no email-matching guesswork.
      const userId = session.client_reference_id;
      const amountTotal = session.amount_total; // in the smallest currency unit
      const currency = session.currency;
      const planLabel = amountTotal != null && currency ? `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}` : null;

      if (userId) {
        const supabase = getAdminClient();
        const { error } = await supabase
          .from("profiles")
          .update({ is_paid: true, paid_plan: planLabel, paid_at: new Date().toISOString() })
          .eq("id", userId);
        if (error) console.error("Failed to mark profile as paid:", error.message);
      } else {
        console.error("checkout.session.completed had no client_reference_id — cannot link payment to an account.");
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Stripe webhook handler error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
