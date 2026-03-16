/**
 * Vercel Serverless Function: /api/auth/signup
 * 
 * Customer signup endpoint.
 * Creates user record and links to purchases via email.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  try {
    // Create user in Supabase Auth
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        data: { name },
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return res.status(400).json({ error: authData.msg || 'Signup failed' });
    }

    // Create user record in database
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        id: authData.user.id,
        email,
        name,
        created_at: new Date().toISOString(),
      }),
    });

    // Try to link existing purchases by email
    await linkPurchasesToUser(email, authData.user.id);

    return res.status(200).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
      },
      message: 'Account created. Please check your email to confirm.',
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
};

async function linkPurchasesToUser(email, userId) {
  // Find purchases with this email and link to user
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/purchases?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });
  } catch (err) {
    console.error('Link purchases error:', err);
  }
}
