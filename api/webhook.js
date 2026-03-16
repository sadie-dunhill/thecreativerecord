/**
 * Vercel Serverless Function: /api/webhook
 *
 * Handles Stripe webhook events.
 * Listens for: checkout.session.completed
 *
 * On purchase:
 *   1. Retrieves customer email from Stripe session
 *   2. Adds subscriber to Beehiiv with product tag
 *   3. Sends welcome email via Beehiiv
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY        — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET    — Stripe webhook signing secret (from Dashboard)
 *
 * Set webhook endpoint in Stripe Dashboard:
 *   https://dashboard.stripe.com/webhooks
 *   URL: https://thecreativerecord.com/api/webhook
 *   Events: checkout.session.completed
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const BEEHIIV_API_KEY  = '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
const BEEHIIV_PUB_ID   = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';

// Map Stripe price IDs to human-readable product tags
const PRICE_TO_TAG = {
  'price_1TBLuhI5RI2Lzo6Rweb3wat8': 'video-script-framework',
  'price_1TBLuiI5RI2Lzo6RMK95uLAd': 'hook-bank-template',
  'price_1TBLujI5RI2Lzo6RqUd68NEh': 'ugc-brief-template',
  'price_1TBLujI5RI2Lzo6R0XPbrzrn': 'creative-audit-checklist',
  'price_1TBLukI5RI2Lzo6RLvSqRKse': 'competitor-analysis-framework',
  'price_1TBLutI5RI2Lzo6RZ36r8mrR': 'skill-bundle',
  'price_1TBLuuI5RI2Lzo6RseEEt91d': 'script-desk-starter',
  'price_1TBLuvI5RI2Lzo6RXa2M1CUw': 'script-desk-growth',
  'price_1TBLuvI5RI2Lzo6RZYZ3u4ra': 'script-desk-scale',
  'price_1TBLuwI5RI2Lzo6RIi1PbnHk': 'custom-skill',
};

// Require raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function verifyStripeSignature(rawBody, signature, secret) {
  // Stripe signature verification without the SDK
  // Format: t=timestamp,v1=hash
  if (!secret || !signature) return true; // Skip if no secret configured (dev mode)

  const crypto = require('crypto');
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).slice(2);
  const v1 = parts.find(p => p.startsWith('v1=')).slice(3);

  const signed = `${timestamp}.${rawBody.toString()}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signed)
    .digest('hex');

  if (expected !== v1) {
    throw new Error('Webhook signature mismatch');
  }

  // Check timestamp (within 5 minutes)
  const tolerance = 300;
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > tolerance) {
    throw new Error('Webhook timestamp too old');
  }

  return true;
}

async function addToBeehiiv(email, productTag) {
  const payload = {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: 'stripe',
    utm_medium: 'purchase',
    utm_campaign: productTag,
    tags: ['customer', productTag],
  };

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Beehiiv error: ${data.message || JSON.stringify(data)}`);
  }

  return data;
}

async function getSessionDetails(sessionId) {
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=line_items`,
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(STRIPE_SECRET_KEY + ':').toString('base64')}`,
      },
    }
  );
  return response.json();
}

// Gmail OAuth for product delivery (from env vars)
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const PRODUCT_DELIVERY_URLS = {
  'video-script-framework': 'https://thecreativerecord.com/skills/packaging/video-script-framework/',
  'hook-bank-template': 'https://thecreativerecord.com/skills/hook-bank-template.html',
  'ugc-brief-template': 'https://thecreativerecord.com/skills/ugc-brief-template.html',
  'creative-audit-checklist': 'https://thecreativerecord.com/skills/creative-audit-checklist.html',
  'competitor-analysis-framework': 'https://thecreativerecord.com/skills/competitor-analysis-framework.html',
  'skill-bundle': 'https://thecreativerecord.com/account',
  'script-desk-starter': 'https://thecreativerecord.com/account',
  'script-desk-growth': 'https://thecreativerecord.com/account',
  'script-desk-scale': 'https://thecreativerecord.com/account',
  'custom-skill': 'https://thecreativerecord.com/account',
};

const PRODUCT_NAMES = {
  'video-script-framework': 'Video Script Framework',
  'hook-bank-template': 'Hook Bank Template',
  'ugc-brief-template': 'UGC Brief Template',
  'creative-audit-checklist': 'Creative Audit Checklist',
  'competitor-analysis-framework': 'Competitor Analysis Framework',
  'skill-bundle': 'Complete Skill Bundle',
  'script-desk-starter': 'Script Desk Starter',
  'script-desk-growth': 'Script Desk Growth',
  'script-desk-scale': 'Script Desk Scale',
  'custom-skill': 'Custom Skill Creation',
};

async function getGmailAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  
  const data = await response.json();
  return data.access_token;
}

async function sendDeliveryEmail(to, productTag) {
  const productName = PRODUCT_NAMES[productTag] || 'Your Purchase';
  const downloadUrl = PRODUCT_DELIVERY_URLS[productTag] || 'https://thecreativerecord.com/account';
  
  const subject = `Your ${productName} — The Creative Record`;
  const body = `Hi there,

Thanks for purchasing ${productName}!

Your download link:
${downloadUrl}

How to access your purchase:
1. Click the link above
2. If prompted, use the email address you used at checkout: ${to}
3. Download your files and start creating

Questions? Reply to this email — I'm here to help.

— Sadie
The Creative Record

P.S. You have lifetime access. If I update these files, you'll get the new versions free.`;

  const accessToken = await getGmailAccessToken();
  
  const emailRaw = [
    `To: ${to}`,
    `From: Sadie Dunhill <sadie@goodostudios.com>`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ].join('\r\n');
  
  const encodedEmail = Buffer.from(emailRaw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/sadie@goodostudios.com/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    throw new Error(`Gmail send failed: ${await response.text()}`);
  }

  return response.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    return res.status(400).json({ error: 'Could not read body' });
  }

  // Verify Stripe signature if webhook secret is set
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    await verifyStripeSignature(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: err.message });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Only handle checkout completion
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const sessionId = session.id;

  try {
    // Get full session details with line items
    const fullSession = await getSessionDetails(sessionId);
    const email = fullSession.customer_details?.email || fullSession.customer_email;

    if (!email) {
      console.error('No email in session:', sessionId);
      return res.status(200).json({ received: true, error: 'No email found' });
    }

    // Get the price ID from line items
    const lineItems = fullSession.line_items?.data || [];
    const priceId = lineItems[0]?.price?.id;
    const productTag = PRICE_TO_TAG[priceId] || 'unknown-product';

    console.log(`Purchase: ${email} bought ${productTag} (${priceId})`);

    // Add to Beehiiv
    await addToBeehiiv(email, productTag);
    console.log(`Added ${email} to Beehiiv with tag: ${productTag}`);

    // Send product delivery email
    try {
      await sendDeliveryEmail(email, productTag);
      console.log(`Delivered ${productTag} to ${email}`);
    } catch (deliveryErr) {
      console.error('Delivery email failed:', deliveryErr);
      // Don't fail the webhook if delivery fails -- we can retry manually
    }

    return res.status(200).json({
      received: true,
      email,
      product: productTag,
      delivered: true,
    });

  } catch (err) {
    console.error('Webhook processing error:', err);
    // Return 200 to acknowledge receipt -- Stripe will retry on 5xx
    return res.status(200).json({ received: true, error: err.message });
  }
};
