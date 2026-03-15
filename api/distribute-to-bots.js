/**
 * distribute-to-bots.js
 * The Creative Record — OpenClaw Bot Distribution API
 *
 * Vercel Serverless Function: POST /api/distribute-to-bots
 *
 * When The Creative Record publishes a newsletter or blog post, this endpoint
 * fires a POST request to every subscribed OpenClaw bot's webhook URL, sending
 * the content in a standard JSON envelope.
 *
 * Bot Subscription Model:
 *   Bots register via POST /api/bots/subscribe with:
 *     { bot_name, webhook_url, content_types: ["newsletter"|"blog"|"both"], secret? }
 *
 *   Subscribers stored in /api/subscribed-bots.json (static) or KV (production).
 *
 * Distribution Payload sent to each bot:
 *   {
 *     source: "the-creative-record",
 *     type: "newsletter" | "blog",
 *     title: string,
 *     content: string (markdown),
 *     excerpt: string,
 *     url: string,
 *     published_at: ISO8601 string,
 *     categories: string[],
 *     author: "Sadie Dunhill"
 *   }
 *
 * Authentication:
 *   Inbound requests require: Authorization: Bearer <DISTRIBUTE_SECRET>
 *   Outbound to bots: X-TCR-Signature: HMAC-SHA256 of payload using bot's secret
 *
 * Usage (manual trigger from admin):
 *   curl -X POST https://thecreativerecord.com/api/distribute-to-bots \
 *     -H "Authorization: Bearer <DISTRIBUTE_SECRET>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"type":"newsletter","title":"...","content":"...","url":"..."}'
 */

import crypto from 'crypto';

// -- Configuration --
const DISTRIBUTE_SECRET = process.env.DISTRIBUTE_SECRET || '';
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY || '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID || 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';
const BOT_REGISTRY_URL = process.env.BOT_REGISTRY_URL || null; // Optional: KV store URL
const MAX_CONCURRENT_DISPATCHES = 10;
const DISPATCH_TIMEOUT_MS = 8000;

// -- Subscriber registry (static fallback when KV not configured) --
// In production, use Vercel KV or a simple JSON file served via API
const STATIC_SUBSCRIBERS = [
  // Example structure -- add real bot subscriptions here:
  // {
  //   bot_name: "sadie-main",
  //   webhook_url: "https://your-openclaw-instance.com/webhooks/creative-record",
  //   content_types: ["both"],
  //   secret: "optional-hmac-secret",
  //   active: true,
  //   subscribed_at: "2026-03-15T00:00:00Z"
  // }
];

/**
 * Load subscribers from KV store or fall back to static list
 */
async function loadSubscribers() {
  if (BOT_REGISTRY_URL) {
    try {
      const res = await fetch(BOT_REGISTRY_URL, { headers: { Authorization: `Bearer ${DISTRIBUTE_SECRET}` } });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('[distribute-to-bots] Failed to load from KV, using static:', err.message);
    }
  }
  return STATIC_SUBSCRIBERS;
}

/**
 * Sign payload with bot-specific secret for webhook verification
 */
function signPayload(payload, secret) {
  if (!secret) return null;
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

/**
 * Dispatch content to a single bot webhook
 * Returns { bot_name, success, status?, error? }
 */
async function dispatchToBit(subscriber, payload) {
  const { bot_name, webhook_url, secret } = subscriber;
  const signature = signPayload(payload, secret);

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'TheCreativeRecord/1.0 (OpenClaw Bot Distribution)',
    'X-TCR-Source': 'the-creative-record',
    'X-TCR-Event': 'content.published',
  };
  if (signature) headers['X-TCR-Signature'] = `sha256=${signature}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DISPATCH_TIMEOUT_MS);

  try {
    const res = await fetch(webhook_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const responseText = await res.text().catch(() => '');
    return {
      bot_name,
      success: res.ok,
      status: res.status,
      response: responseText.slice(0, 200),
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      bot_name,
      success: false,
      error: err.name === 'AbortError' ? 'timeout' : err.message,
    };
  }
}

/**
 * Build content payload in standard TCR format
 */
function buildPayload(body) {
  const now = new Date().toISOString();
  return {
    source: 'the-creative-record',
    type: body.type || 'newsletter',
    title: body.title || '',
    content: body.content || '',
    excerpt: body.excerpt || (body.content || '').slice(0, 300),
    url: body.url || '',
    canonical_url: body.url || '',
    published_at: body.published_at || now,
    categories: body.categories || [],
    tags: body.tags || [],
    author: 'Sadie Dunhill',
    publication: 'The Creative Record',
    publication_url: 'https://thecreativerecord.com',
    beehiiv_post_id: body.beehiiv_post_id || null,
    metadata: body.metadata || {},
    _dispatched_at: now,
  };
}

/**
 * Fetch latest published post from Beehiiv (for auto-trigger)
 */
async function fetchLatestBeehiivPost() {
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/posts?limit=1&status=confirmed&order_by=publish_date&direction=desc`,
      { headers: { Authorization: `Bearer ${BEEHIIV_API_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const post = data?.data?.[0];
    if (!post) return null;
    return {
      type: 'newsletter',
      title: post.subject || post.title,
      content: post.content?.free?.web || post.subtitle || '',
      excerpt: post.subtitle || '',
      url: post.web_url || `https://thecreativerecord.com/newsletter/`,
      published_at: new Date(post.publish_date * 1000).toISOString(),
      beehiiv_post_id: post.id,
      categories: ['newsletter'],
    };
  } catch (err) {
    console.error('[distribute-to-bots] Beehiiv fetch error:', err.message);
    return null;
  }
}

/**
 * Main handler
 * Vercel serverless function export
 */
export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', allowed: ['POST'] });
  }

  // Auth check -- require secret in Authorization header
  if (DISTRIBUTE_SECRET) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token !== DISTRIBUTE_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body' }); }
  }

  // If no content in body, try to fetch latest from Beehiiv
  let contentPayload;
  if (!body.title && body.fetch_latest) {
    contentPayload = await fetchLatestBeehiivPost();
    if (!contentPayload) {
      return res.status(404).json({ error: 'Could not fetch latest post from Beehiiv' });
    }
  } else if (body.title) {
    contentPayload = body;
  } else {
    return res.status(400).json({
      error: 'Missing content. Provide title/content/url or set fetch_latest:true',
    });
  }

  const payload = buildPayload(contentPayload);
  const subscribers = await loadSubscribers();

  // Filter subscribers by content type
  const targetSubscribers = subscribers.filter(s => {
    if (!s.active) return false;
    const types = s.content_types || ['both'];
    return types.includes('both') || types.includes(payload.type);
  });

  if (targetSubscribers.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No active subscribers for this content type',
      payload_type: payload.type,
      dispatched: 0,
      results: [],
    });
  }

  // Dispatch in batches to respect concurrency limit
  const results = [];
  for (let i = 0; i < targetSubscribers.length; i += MAX_CONCURRENT_DISPATCHES) {
    const batch = targetSubscribers.slice(i, i + MAX_CONCURRENT_DISPATCHES);
    const batchResults = await Promise.all(batch.map(s => dispatchToBit(s, payload)));
    results.push(...batchResults);
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`[distribute-to-bots] Dispatched "${payload.title}" to ${targetSubscribers.length} bots: ${succeeded} succeeded, ${failed} failed`);

  return res.status(200).json({
    success: true,
    title: payload.title,
    type: payload.type,
    dispatched: targetSubscribers.length,
    succeeded,
    failed,
    results,
    payload_preview: {
      source: payload.source,
      type: payload.type,
      title: payload.title,
      url: payload.url,
      published_at: payload.published_at,
    },
  });
}
