/**
 * Vercel Serverless Function: /api/submit-script-review
 * 
 * Handles script review submissions.
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

  const {
    email,
    company,
    script_text,
    product_name,
    target_platform,
    current_performance,
    specific_concerns,
  } = req.body || {};

  if (!email || !script_text) {
    return res.status(400).json({ error: 'Email and script text required' });
  }

  const review = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'script_review',
    status: 'received',
    email,
    company: company || 'Not specified',
    product_name: product_name || 'Not specified',
    script_text,
    target_platform: target_platform || 'Not specified',
    current_performance: current_performance || '',
    specific_concerns: specific_concerns || '',
    received_at: new Date().toISOString(),
    notes: '',
    time_logged_minutes: 0,
  };

  try {
    // Send alert email
    await sendAlertEmail(review);

    // Also add to Beehiiv newsletter
    await addToNewsletter(email, 'script-review-customer');

    return res.status(200).json({
      success: true,
      review_id: review.id,
      message: 'Script received for review. You will receive scored feedback within 48 hours.',
    });

  } catch (err) {
    console.error('Submit review error:', err);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
};

async function sendAlertEmail(review) {
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

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

  const subject = `📊 NEW SCRIPT REVIEW — ${review.product_name}`;
  const body = `New script review submission:

Product: ${review.product_name}
Company: ${review.company}
Email: ${review.email}
Platform: ${review.target_platform}
Received: ${review.received_at}

CURRENT PERFORMANCE:
${review.current_performance || 'Not provided'}

SPECIFIC CONCERNS:
${review.specific_concerns || 'Not provided'}

---
SCRIPT TO REVIEW:
${review.script_text.substring(0, 500)}...
[Full script in system]

---
Action: Acknowledge within 4 hours
Turnaround: 48 hours`;

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

async function addToNewsletter(email, tag) {
  // Add to Beehiiv for newsletter purposes
  const BEEHIIV_API_KEY = '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
  const BEEHIIV_PUB_ID = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';

  try {
    await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: 'script-review',
        tags: [tag],
      }),
    });
  } catch (err) {
    console.error('Newsletter signup error:', err);
    // Don't fail the request if newsletter signup fails
  }
}
