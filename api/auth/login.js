/**
 * Vercel Serverless Function: /api/auth/login
 * 
 * Customer login endpoint.
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

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return res.status(401).json({ error: authData.error_description || 'Invalid credentials' });
    }

    // Get user profile
    const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${authData.user.id}&select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    const users = await userRes.json();
    const user = users[0];

    return res.status(200).json({
      success: true,
      session: {
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
        expires_at: Date.now() + (authData.expires_in * 1000),
      },
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: user?.name || '',
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};
