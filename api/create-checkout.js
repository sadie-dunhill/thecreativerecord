/**
 * Vercel Serverless Function: /api/create-checkout
 *
 * Creates a Stripe Checkout Session for a given price ID.
 * Accepts POST { priceId } or GET ?priceId=...
 * Returns { url } — redirect the user to this URL.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY — Stripe secret key
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://thecreativerecord.com';

// Map product keys to price IDs
const PRICE_MAP = {
  'video-script-framework':      'price_1TBLuhI5RI2Lzo6Rweb3wat8',
  'hook-bank-template':          'price_1TBLuiI5RI2Lzo6RMK95uLAd',
  'ugc-brief-template':          'price_1TBLujI5RI2Lzo6RqUd68NEh',
  'creative-audit-checklist':    'price_1TBLujI5RI2Lzo6R0XPbrzrn',
  'competitor-analysis-framework': 'price_1TBLukI5RI2Lzo6RLvSqRKse',
  'skill-bundle':                'price_1TBLutI5RI2Lzo6RZ36r8mrR',
  'script-desk-starter':         'price_1TBLuuI5RI2Lzo6RseEEt91d',
  'script-desk-growth':          'price_1TBLuvI5RI2Lzo6RXa2M1CUw',
  'script-desk-scale':           'price_1TBLuvI5RI2Lzo6RZYZ3u4ra',
  'custom-skill':                'price_1TBLuwI5RI2Lzo6RIi1PbnHk',
};

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://thecreativerecord.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Accept GET or POST
  const productKey = req.method === 'GET'
    ? req.query.product
    : (req.body || {}).product;

  const priceId = req.method === 'GET'
    ? (req.query.priceId || PRICE_MAP[req.query.product])
    : ((req.body || {}).priceId || PRICE_MAP[(req.body || {}).product]);

  if (!priceId) {
    return res.status(400).json({
      error: 'Missing priceId or product key',
      validKeys: Object.keys(PRICE_MAP),
    });
  }

  const resolvedProductKey = productKey || Object.entries(PRICE_MAP)
    .find(([, v]) => v === priceId)?.[0] || 'unknown';

  try {
    // Create Stripe Checkout Session via REST (no Stripe SDK needed)
    const params = new URLSearchParams({
      'mode': 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': `${BASE_URL}/thank-you?product=${resolvedProductKey}&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${BASE_URL}/skills/`,
      'allow_promotion_codes': 'true',
      'billing_address_collection': 'auto',
      'customer_email': '',
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(STRIPE_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error('Stripe error:', session.error);
      return res.status(500).json({ error: session.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error('create-checkout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
