/**
 * Vercel Serverless Function: /api/error-monitor
 * 
 * Simple error tracking and alerting for The Creative Record APIs.
 * POST errors here from other endpoints, get notified via email.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://thecreativerecord.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, error, context, timestamp } = req.body || {};

  // Log error
  console.error(`[ERROR] ${endpoint}:`, error, context);

  // Send alert email for critical errors
  try {
    await sendErrorAlert({ endpoint, error, context, timestamp });
  } catch (err) {
    console.error('Failed to send error alert:', err);
  }

  return res.status(200).json({ received: true });
};

async function sendErrorAlert({ endpoint, error, context, timestamp }) {
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

  if (!GMAIL_CLIENT_ID || !GMAIL_REFRESH_TOKEN) {
    console.log('Email not configured, logging only');
    return;
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const { access_token } = await tokenRes.json();

  const subject = `🚨 TCR API Error — ${endpoint}`;
  const body = `API Error Report:

Endpoint: ${endpoint}
Time: ${timestamp || new Date().toISOString()}
Error: ${error}
Context: ${JSON.stringify(context, null, 2)}

---
The Creative Record Error Monitor`;

  const emailRaw = [
    'To: sadie@goodostudios.com',
    'From: Sadie Dunhill <sadie@goodostudios.com>',
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body,
  ].join('\r\n');

  const encodedEmail = Buffer.from(emailRaw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

  await fetch('https://gmail.googleapis.com/gmail/v1/users/sadie@goodostudios.com/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });
}
