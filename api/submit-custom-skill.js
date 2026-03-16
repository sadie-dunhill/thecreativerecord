/**
 * Vercel Serverless Function: /api/submit-custom-skill
 * 
 * Handles custom skill creation submissions.
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
    skill_name,
    skill_description,
    document_urls,
    additional_notes,
  } = req.body || {};

  if (!email || !skill_name || !skill_description) {
    return res.status(400).json({ error: 'Email, skill name, and description required' });
  }

  const skill = {
    id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'custom_skill',
    status: 'received',
    email,
    skill_name,
    skill_description,
    document_urls: document_urls || [],
    additional_notes: additional_notes || '',
    received_at: new Date().toISOString(),
    notes: '',
    time_logged_minutes: 0,
  };

  try {
    // Send alert email
    await sendAlertEmail(skill);

    return res.status(200).json({
      success: true,
      skill_id: skill.id,
      message: 'Custom skill request received. You will receive your skill within 48 hours.',
    });

  } catch (err) {
    console.error('Submit skill error:', err);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
};

async function sendAlertEmail(skill) {
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

  const subject = `🔧 NEW CUSTOM SKILL — ${skill.skill_name}`;
  const body = `New custom skill request:

Skill Name: ${skill.skill_name}
Email: ${skill.email}
Received: ${skill.received_at}

DESCRIPTION:
${skill.skill_description}

DOCUMENT URLS:
${skill.document_urls.join('\n') || 'No URLs provided'}

ADDITIONAL NOTES:
${skill.additional_notes || 'None'}

---
Action: Review documents within 24 hours
Turnaround: 48 hours from document review`;

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
