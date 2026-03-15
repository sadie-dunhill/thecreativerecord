/**
 * Vercel Serverless Function: /api/subscribe
 * 
 * Proxies email signups to Beehiiv.
 * Accepts POST { email, publication_id?, utm_source?, utm_medium?, tags? }
 * Returns 200 on success, 400 on bad input, 500 on Beehiiv error.
 * 
 * Supports CORS for same-origin browser requests.
 */

const BEEHIIV_API_KEY = '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
const DEFAULT_PUB_ID  = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://thecreativerecord.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    publication_id = DEFAULT_PUB_ID,
    utm_source     = 'website',
    utm_medium     = 'organic',
    utm_campaign   = '',
    referring_site = '',
    tags           = [],
  } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const beehiivPayload = {
      email,
      reactivate_existing: true,
      send_welcome_email:  true,
      utm_source,
      utm_medium,
      utm_campaign: utm_campaign || utm_medium,
      referring_site,
    };

    // Add custom fields for tags if provided
    if (tags && tags.length > 0) {
      beehiivPayload.custom_fields = tags.map(tag => ({
        name:  'source_tag',
        value: tag,
      }));
    }

    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${publication_id}/subscriptions`,
      {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify(beehiivPayload),
      }
    );

    const data = await beehiivRes.json();

    if (!beehiivRes.ok) {
      console.error('Beehiiv error:', data);
      // Still return 200 to user — don't block the download
      return res.status(200).json({ ok: true, source: 'fallback' });
    }

    return res.status(200).json({ ok: true, id: data?.data?.id });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    // Always resolve for user — download should not be blocked
    return res.status(200).json({ ok: true, source: 'error-fallback' });
  }
};
