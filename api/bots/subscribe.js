/**
 * bots/subscribe.js
 * The Creative Record — OpenClaw Bot Subscription Management
 *
 * POST /api/bots/subscribe — Register a new bot subscriber
 * DELETE /api/bots/subscribe — Unsubscribe a bot
 * GET /api/bots/subscribe — List all active subscribers (auth required)
 *
 * Request body for POST:
 * {
 *   "bot_name": "my-openclaw-bot",
 *   "webhook_url": "https://my-server.com/webhooks/tcr",
 *   "content_types": ["newsletter", "blog"],  // or ["both"]
 *   "secret": "optional-hmac-signing-secret"  // optional
 * }
 *
 * The webhook_url receives POST requests from distribute-to-bots.js with the
 * standard TCR content envelope whenever new content is published.
 *
 * In production, subscribers are stored in Vercel KV or a database.
 * This implementation uses a simple in-memory approach with a JSON file
 * for local/static deployments.
 */

// Subscriber storage (in production, replace with Vercel KV or database)
// For local/static deployments, this persists to subscribed-bots.json
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, 'subscribed-bots.json');
const ADMIN_SECRET = process.env.DISTRIBUTE_SECRET || '';

function loadRegistry() {
  try {
    const raw = readFileSync(REGISTRY_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data.subscribers || [];
  } catch {
    return [];
  }
}

function saveRegistry(subscribers) {
  const data = {
    _comment: 'OpenClaw Bot Subscriber Registry for The Creative Record',
    _version: '1.0',
    _updated: new Date().toISOString(),
    subscribers,
  };
  writeFileSync(REGISTRY_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  // GET: List subscribers (admin only)
  if (req.method === 'GET') {
    if (ADMIN_SECRET) {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (token !== ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    const subscribers = loadRegistry();
    return res.status(200).json({
      count: subscribers.length,
      active: subscribers.filter(s => s.active).length,
      subscribers: subscribers.map(s => ({
        bot_name: s.bot_name,
        webhook_url: s.webhook_url,
        content_types: s.content_types,
        active: s.active,
        subscribed_at: s.subscribed_at,
        // Never expose secret in list
      })),
    });
  }

  // POST: Subscribe
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }

    const { bot_name, webhook_url, content_types, secret } = body;

    // Validate required fields
    if (!bot_name || typeof bot_name !== 'string' || bot_name.length < 2) {
      return res.status(400).json({ error: 'bot_name is required (min 2 chars)' });
    }
    if (!webhook_url || !isValidUrl(webhook_url)) {
      return res.status(400).json({ error: 'webhook_url must be a valid HTTP/HTTPS URL' });
    }

    const validTypes = ['newsletter', 'blog', 'both'];
    const types = Array.isArray(content_types) ? content_types : ['both'];
    if (!types.every(t => validTypes.includes(t))) {
      return res.status(400).json({ error: `content_types must be one or more of: ${validTypes.join(', ')}` });
    }

    // Verify webhook responds (optional ping)
    try {
      const pingRes = await fetch(webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TCR-Event': 'subscription.verify',
          'User-Agent': 'TheCreativeRecord/1.0',
        },
        body: JSON.stringify({ event: 'subscription.verify', source: 'the-creative-record', bot_name }),
        signal: AbortSignal.timeout(5000),
      });
      // Accept any 2xx or 3xx response as valid
      if (pingRes.status >= 400 && pingRes.status !== 404) {
        console.warn(`[bots/subscribe] Webhook ping returned ${pingRes.status} for ${bot_name}`);
        // Don't block subscription on ping failure -- warn only
      }
    } catch (err) {
      console.warn(`[bots/subscribe] Webhook ping failed for ${bot_name}: ${err.message}`);
      // Proceed anyway -- the URL might not support GET
    }

    const subscribers = loadRegistry();
    const existing = subscribers.findIndex(s => s.bot_name === bot_name);

    const subscriber = {
      bot_name: bot_name.trim(),
      webhook_url: webhook_url.trim(),
      content_types: types,
      secret: secret || null,
      active: true,
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    if (existing >= 0) {
      // Update existing -- preserve id and subscribed_at
      subscriber.id = subscribers[existing].id;
      subscriber.subscribed_at = subscribers[existing].subscribed_at;
      subscribers[existing] = subscriber;
    } else {
      subscribers.push(subscriber);
    }

    try {
      saveRegistry(subscribers);
    } catch (err) {
      console.error('[bots/subscribe] Failed to save registry:', err.message);
      // In Vercel serverless, filesystem writes don't persist -- use KV in production
    }

    return res.status(existing >= 0 ? 200 : 201).json({
      success: true,
      action: existing >= 0 ? 'updated' : 'subscribed',
      bot_name: subscriber.bot_name,
      webhook_url: subscriber.webhook_url,
      content_types: subscriber.content_types,
      subscribed_at: subscriber.subscribed_at,
      message: `${subscriber.bot_name} will now receive ${types.join(' and ')} content from The Creative Record`,
    });
  }

  // DELETE: Unsubscribe
  if (req.method === 'DELETE') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }

    const { bot_name } = body;
    if (!bot_name) return res.status(400).json({ error: 'bot_name is required' });

    const subscribers = loadRegistry();
    const idx = subscribers.findIndex(s => s.bot_name === bot_name);
    if (idx === -1) return res.status(404).json({ error: `Bot not found: ${bot_name}` });

    subscribers[idx].active = false;
    subscribers[idx].unsubscribed_at = new Date().toISOString();

    try { saveRegistry(subscribers); } catch { /* Vercel serverless -- use KV in production */ }

    return res.status(200).json({
      success: true,
      action: 'unsubscribed',
      bot_name,
      message: `${bot_name} will no longer receive content from The Creative Record`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed', allowed: ['GET', 'POST', 'DELETE'] });
}
