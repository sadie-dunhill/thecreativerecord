/**
 * Vercel Serverless Function: /api/user/purchases
 * 
 * Fetch authenticated user's purchases and service requests
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://thecreativerecord.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get auth token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    // Verify token and get user
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    });

    if (!userRes.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // Fetch purchases
    const purchasesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/purchases?user_id=eq.${userId}&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    const purchases = await purchasesRes.json();

    // Fetch service requests
    const requestsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/service_requests?user_id=eq.${userId}&order=received_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    const requests = await requestsRes.json();

    return res.status(200).json({
      purchases: purchases || [],
      service_requests: requests || [],
    });

  } catch (err) {
    console.error('Fetch purchases error:', err);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
};
