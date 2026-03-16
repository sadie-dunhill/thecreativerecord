/**
 * Vercel Serverless Function: /api/submit-brief
 * 
 * Handles Script Desk brief submissions.
 * Stores in service queue and sends alert.
 */

const QUEUE_ENDPOINT = process.env.QUEUE_API_URL || null;

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
    company,
    product_name,
    product_description,
    target_customer,
    awareness_stage,
    main_problem,
    biggest_benefit,
    key_differentiator,
    proof_points,
    hook_angle,
    platforms,
    examples,
    desk_package, // starter, growth, scale
    beehiiv_id, // if already subscribed
  } = req.body || {};

  // Validation
  if (!email || !product_name || !product_description) {
    return res.status(400).json({ error: 'Email, product name, and description required' });
  }

  const brief = {
    id: `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'script_desk',
    status: 'received',
    email,
    company: company || product_name,
    product_name,
    product_description,
    target_customer: target_customer || 'Not specified',
    awareness_stage: awareness_stage || 'Not specified',
    main_problem: main_problem || '',
    biggest_benefit: biggest_benefit || '',
    key_differentiator: key_differentiator || '',
    proof_points: proof_points || '',
    hook_angle: hook_angle || '',
    platforms: platforms || '',
    examples: examples || '',
    desk_package: desk_package || 'unknown',
    received_at: new Date().toISOString(),
    notes: '',
    time_logged_minutes: 0,
  };

  try {
    // Store in queue (for now, send email notification)
    // In production, this would POST to a database
    
    // Send email notification to Sadie
    await sendAlertEmail(brief);

    // Also add to Beehiiv (for newsletter only, not tracking)
    if (!beehiiv_id) {
      await addToNewsletter(email, 'script-desk-customer');
    }

    return res.status(200).json({
      success: true,
      brief_id: brief.id,
      message: 'Brief received. You will receive confirmation within 4 hours.',
    });

  } catch (err) {
    console.error('Submit brief error:', err);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
};

async function sendAlertEmail(brief) {
  // Send via Gmail API
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

  // Get access token
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

  const subject = `🎯 NEW SCRIPT DESK BRIEF — ${brief.product_name}`;
  const body = `New brief submission:

Product: ${brief.product_name}
Company: ${brief.company}
Email: ${brief.email}
Package: ${brief.desk_package}
Received: ${brief.received_at}

AWARENESS STAGE: ${brief.awareness_stage}
TARGET: ${brief.target_customer}

PROBLEM: ${brief.main_problem}
BENEFIT: ${brief.biggest_benefit}
DIFFERENTIATOR: ${brief.key_differentiator}
PROOF: ${brief.proof_points}

HOOK ANGLE: ${brief.hook_angle}
PLATFORMS: ${brief.platforms}

DESCRIPTION:
${brief.product_description}

EXAMPLES:
${brief.examples || 'None provided'}

---
Action: Acknowledge within 4 hours
Turnaround: 72 hours from acknowledgment`;

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
  // Add to Beehiiv for newsletter purposes only
  const BEEHIIV_API_KEY = '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
  const BEEHIIV_PUB_ID = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';

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
      utm_source: 'script-desk',
      tags: [tag],
    }),
  });
}
