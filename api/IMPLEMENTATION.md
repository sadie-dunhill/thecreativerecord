# The Creative Record — API Implementation Guide

**Version:** 1.0  
**Stack:** Vercel (static site + Edge Functions) + Cloudflare R2 (file storage) + Stripe (payments) + Supabase (keys + purchase records)  
**Last Updated:** March 2026

---

## Architecture Overview

The site is already static HTML hosted on Vercel. The API lives in Vercel Edge Functions (serverless, zero cold-start, global). Files live in Cloudflare R2. Purchases and API keys are tracked in a Supabase Postgres database (free tier covers launch easily).

```
Agent / Browser
      │
      ▼
  Vercel Edge Functions  (/api/*)
      │                      │
      ▼                      ▼
  Supabase DB          Cloudflare R2
  (keys, purchases)    (skill markdown files)
      │
      ▼
  Stripe (checkout + webhooks)
```

**Why Edge Functions over regular serverless?**  
Zero cold start. Agents hitting the API don't wait 2-3 seconds on first request. Vercel Edge runs in 40+ regions -- a Seattle agent and a London agent both get fast responses.

---

## Repository Structure

Add these files to the existing repo at `thecreativerecord.com/`:

```
api/
├── skills/
│   ├── index.js          # GET /api/skills
│   └── [id].js           # GET /api/skills/{id}
├── bundle.js             # GET /api/bundle
├── download/
│   └── [id].js           # GET /api/download/{id}
├── purchase.js           # POST /api/purchase
├── key/
│   └── verify.js         # GET /api/key/verify
├── webhooks/
│   └── stripe.js         # POST /api/webhooks/stripe
├── health.js             # GET /api/health
└── _lib/
    ├── auth.js           # API key validation
    ├── skills-catalog.js # Static skill metadata
    └── db.js             # Supabase client
```

Update `vercel.json` to add the functions directory:

```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "@vercel/node@3"
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/([^/]+)/?", "dest": "/$1.html" },
    { "src": "/skills/([^/]+)/?", "dest": "/skills/$1.html" }
  ]
}
```

---

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...          # Service role key (not anon)

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=tcr-skills
R2_PUBLIC_URL=https://files.thecreativerecord.com  # or R2 public URL

# API
API_KEY_SALT=32-char-random-string   # For key generation
```

---

## Database Schema (Supabase)

Run this in Supabase SQL Editor:

```sql
-- API keys table
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_hash TEXT UNIQUE NOT NULL,    -- SHA256 of the actual key
  key_prefix TEXT NOT NULL,         -- First 12 chars for lookup (tcr_dl_xxxx)
  key_class TEXT NOT NULL,          -- 'browse' or 'download'
  scope TEXT[] DEFAULT '{}',        -- skill IDs this key can access
  customer_email TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  request_count INTEGER DEFAULT 0
);

-- Purchases table
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  skill_id TEXT NOT NULL,           -- 'video-script-framework' or 'complete-bundle'
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  api_key_id UUID REFERENCES api_keys(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ          -- when download key was sent
);

-- Rate limit tracking (optional -- can use Redis if scaling)
CREATE TABLE rate_limits (
  key_prefix TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER DEFAULT 0,
  PRIMARY KEY (key_prefix, window_start)
);

-- Index for fast key lookup
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_purchases_email ON purchases(customer_email);
CREATE INDEX idx_purchases_session ON purchases(stripe_session_id);
```

---

## Skills Catalog (Static)

This file is the source of truth for skill metadata. Update it when new skills are added.

```javascript
// api/_lib/skills-catalog.js
export const SKILLS = {
  "video-script-framework": {
    id: "video-script-framework",
    name: "Video Script Writing System",
    tagline: "The 30-second structure that converts",
    description: "The exact 30-second video ad structure used by 8-figure DTC brands. Works across categories, formats, and platforms.",
    price: 39,
    currency: "USD",
    free: false,
    format: "markdown",
    word_count: 5800,
    version: "1.0",
    tags: ["video", "scripts", "framework", "DTC"],
    r2_key: "skills/video-script-framework.md",
    purchase_url: "https://thecreativerecord.com/skills/video-script-framework"
  },
  "hook-bank-template": {
    id: "hook-bank-template",
    name: "Hook Bank Template",
    tagline: "100+ proven hooks for DTC video ads",
    description: "A structured collection of scroll-stopping hooks organized by awareness stage and format.",
    price: 39,
    currency: "USD",
    free: false,
    format: "markdown",
    word_count: 6900,
    version: "1.0",
    tags: ["hooks", "video", "copy", "DTC"],
    r2_key: "skills/hook-bank-template.md",
    purchase_url: "https://thecreativerecord.com/skills/hook-bank-template"
  },
  "ugc-brief-template": {
    id: "ugc-brief-template",
    name: "UGC Brief Template",
    tagline: "How to brief creators for content that converts",
    description: "A complete creator briefing system that gets you scroll-stopping UGC without the back-and-forth.",
    price: 39,
    currency: "USD",
    free: false,
    format: "markdown",
    word_count: 7300,
    version: "1.0",
    tags: ["UGC", "creators", "briefs", "DTC"],
    r2_key: "skills/ugc-brief-template.md",
    purchase_url: "https://thecreativerecord.com/skills/ugc-brief-template"
  },
  "creative-audit-checklist": {
    id: "creative-audit-checklist",
    name: "Creative Audit Checklist",
    tagline: "Diagnose your creative in 20 minutes",
    description: "A structured framework to identify exactly why your ads are underperforming and what to fix first.",
    price: 39,
    currency: "USD",
    free: false,
    format: "markdown",
    word_count: 6600,
    version: "1.0",
    tags: ["audit", "creative", "analysis", "DTC"],
    r2_key: "skills/creative-audit-checklist.md",
    purchase_url: "https://thecreativerecord.com/skills/creative-audit-checklist"
  },
  "competitor-analysis-framework": {
    id: "competitor-analysis-framework",
    name: "Competitor Analysis Framework",
    tagline: "How to spy on competitors (ethically and effectively)",
    description: "The exact process for studying competitor creative, extracting what's working, and applying it to your brand.",
    price: 39,
    currency: "USD",
    free: false,
    format: "markdown",
    word_count: 6900,
    version: "1.0",
    tags: ["competitors", "research", "strategy", "DTC"],
    r2_key: "skills/competitor-analysis-framework.md",
    purchase_url: "https://thecreativerecord.com/skills/competitor-analysis-framework"
  }
};

export const BUNDLE = {
  id: "complete-bundle",
  name: "The Complete Creative Record Bundle",
  tagline: "All 5 frameworks. One price.",
  description: "Every skill in The Creative Record, bundled at a discount. Buy once, use forever.",
  price: 99,
  original_price: 195,
  savings: 96,
  currency: "USD",
  free: false,
  includes: Object.keys(SKILLS),
  skill_count: 5,
  purchase_url: "https://thecreativerecord.com/skills#bundle"
};

// Stripe Price IDs -- create these in Stripe dashboard and add here
export const STRIPE_PRICES = {
  "video-script-framework": "price_xxxx",
  "hook-bank-template": "price_xxxx",
  "ugc-brief-template": "price_xxxx",
  "creative-audit-checklist": "price_xxxx",
  "competitor-analysis-framework": "price_xxxx",
  "complete-bundle": "price_xxxx"
};
```

---

## Auth Middleware

```javascript
// api/_lib/auth.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function validateKey(request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return { valid: false, error: 'MISSING_API_KEY', status: 401 };
  }
  
  // Keys are prefixed: tcr_browse_ or tcr_dl_
  const prefix = apiKey.substring(0, 12);
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data: keyRecord, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_prefix', prefix)
    .eq('key_hash', keyHash)
    .is('revoked_at', null)
    .single();
  
  if (error || !keyRecord) {
    return { valid: false, error: 'INVALID_API_KEY', status: 401 };
  }
  
  // Update last_used and request_count (non-blocking)
  supabase.from('api_keys').update({
    last_used_at: new Date().toISOString(),
    request_count: keyRecord.request_count + 1
  }).eq('id', keyRecord.id).then(() => {});
  
  return {
    valid: true,
    keyClass: keyRecord.key_class,
    scope: keyRecord.scope,
    customerEmail: keyRecord.customer_email
  };
}

export function requireDownloadKey(keyInfo, skillId) {
  if (keyInfo.keyClass !== 'download') {
    return { allowed: false, error: 'BROWSE_KEY_INSUFFICIENT', status: 403 };
  }
  // Bundle keys have all skill IDs in scope
  if (!keyInfo.scope.includes(skillId) && !keyInfo.scope.includes('complete-bundle')) {
    return { allowed: false, error: 'KEY_SCOPE_MISMATCH', status: 403 };
  }
  return { allowed: true };
}

export function generateApiKey(keyClass) {
  const prefix = keyClass === 'download' ? 'tcr_dl_' : 'tcr_browse_';
  const random = crypto.randomBytes(24).toString('hex');
  return `${prefix}${random}`;
}
```

---

## Core Endpoint Implementations

### GET /api/skills

```javascript
// api/skills/index.js
import { SKILLS } from '../_lib/skills-catalog.js';
import { validateKey } from '../_lib/auth.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const auth = await validateKey(request);
  if (!auth.valid) {
    return Response.json({ error: { code: auth.error, status: auth.status } }, { status: auth.status });
  }
  
  const url = new URL(request.url);
  const tagFilter = url.searchParams.get('tag');
  const freeFilter = url.searchParams.get('free');
  
  let skills = Object.values(SKILLS).map(s => ({
    ...s,
    r2_key: undefined,  // Never expose internal storage keys
    preview_url: `https://thecreativerecord.com/api/skills/${s.id}`
  }));
  
  if (tagFilter) {
    skills = skills.filter(s => s.tags.includes(tagFilter.toLowerCase()));
  }
  if (freeFilter === 'true') {
    skills = skills.filter(s => s.free);
  }
  
  return Response.json({
    skills,
    total: skills.length,
    free_count: skills.filter(s => s.free).length,
    paid_count: skills.filter(s => !s.free).length,
    last_updated: "2026-03-15T00:00:00Z"
  });
}
```

### POST /api/webhooks/stripe

This is the critical function -- fires after every successful purchase and issues the download key.

```javascript
// api/webhooks/stripe.js
import Stripe from 'stripe';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { SKILLS, BUNDLE } from '../_lib/skills-catalog.js';
import { generateApiKey } from '../_lib/auth.js';

export const config = { runtime: 'nodejs' }; // Need Node for crypto + Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true });
  }
  
  const session = event.data.object;
  const skillId = session.metadata?.skill_id;
  const customerEmail = session.customer_details?.email;
  
  if (!skillId || !customerEmail) {
    console.error('Missing metadata in checkout session', session.id);
    return Response.json({ error: 'Missing metadata' }, { status: 400 });
  }
  
  // Determine scope (single skill vs bundle)
  const scope = skillId === 'complete-bundle'
    ? Object.keys(SKILLS)
    : [skillId];
  
  // Generate download key
  const downloadKey = generateApiKey('download');
  const keyHash = crypto.createHash('sha256').update(downloadKey).digest('hex');
  const keyPrefix = downloadKey.substring(0, 12);
  
  // Insert key into DB
  const { data: keyRecord } = await supabase.from('api_keys').insert({
    key_hash: keyHash,
    key_prefix: keyPrefix,
    key_class: 'download',
    scope,
    customer_email: customerEmail,
    stripe_session_id: session.id
  }).select().single();
  
  // Record purchase
  await supabase.from('purchases').insert({
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent,
    customer_email: customerEmail,
    skill_id: skillId,
    amount_cents: session.amount_total,
    currency: session.currency,
    api_key_id: keyRecord.id,
    fulfilled_at: new Date().toISOString()
  });
  
  // Send email with download key
  await sendDownloadKeyEmail(customerEmail, downloadKey, skillId, scope);
  
  return Response.json({ received: true });
}

async function sendDownloadKeyEmail(email, downloadKey, skillId, scope) {
  // Use your existing email provider (ConvertKit, Resend, etc.)
  // This example uses fetch to call a simple email service
  
  const skillName = skillId === 'complete-bundle'
    ? 'The Complete Creative Record Bundle'
    : SKILLS[skillId]?.name;
  
  const downloadInstructions = skillId === 'complete-bundle'
    ? scope.map(id => `  curl -H "x-api-key: ${downloadKey}" https://thecreativerecord.com/api/download/${id}?format=raw -o ${id}.md`).join('\n')
    : `  curl -H "x-api-key: ${downloadKey}" https://thecreativerecord.com/api/download/${skillId}?format=raw -o ${skillId}.md`;
  
  // Send via your email provider
  // Replace with actual email call
  console.log(`Sending download key to ${email} for ${skillName}`);
  console.log(`Key: ${downloadKey}`);
  console.log(`Download command:\n${downloadInstructions}`);
}
```

---

## Cloudflare R2 Setup

### Create R2 Bucket

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Create bucket
wrangler r2 bucket create tcr-skills

# Upload skill files
wrangler r2 object put tcr-skills/skills/video-script-framework.md --file=./skills/video-script-framework.md
wrangler r2 object put tcr-skills/skills/hook-bank-template.md --file=./skills/hook-bank-template.md
wrangler r2 object put tcr-skills/skills/ugc-brief-template.md --file=./skills/ugc-brief-template.md
wrangler r2 object put tcr-skills/skills/creative-audit-checklist.md --file=./skills/creative-audit-checklist.md
wrangler r2 object put tcr-skills/skills/competitor-analysis-framework.md --file=./skills/competitor-analysis-framework.md
```

### Fetch Files from R2 in Edge Functions

```javascript
// api/_lib/r2.js
export async function fetchFromR2(r2Key) {
  const url = `${process.env.R2_PUBLIC_URL}/${r2Key}`;
  
  // If using public R2 bucket:
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.text();
}

// Or with private bucket + presigned URLs:
export async function getPresignedUrl(r2Key, expiresIn = 3600) {
  // Requires AWS SDK compatible with R2
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });
  
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: r2Key
  });
  
  return getSignedUrl(client, command, { expiresIn });
}
```

---

## Stripe Setup

### Create Products and Prices

```bash
# Run once to create Stripe products
# Or do this in Stripe Dashboard

stripe products create --name="Video Script Writing System" --metadata[skill_id]=video-script-framework
stripe prices create --product=prod_xxx --unit-amount=3900 --currency=usd

stripe products create --name="Complete Creative Record Bundle" --metadata[skill_id]=complete-bundle
stripe prices create --product=prod_xxx --unit-amount=9900 --currency=usd
```

### Register Webhook

In Stripe Dashboard → Developers → Webhooks:
- Endpoint URL: `https://thecreativerecord.com/api/webhooks/stripe`
- Events: `checkout.session.completed`
- Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Issuing Browse Keys

For the free browse-tier API keys (given to users who email to request access):

```javascript
// One-time script: scripts/issue-browse-key.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function issueBrowseKey(email) {
  const key = `tcr_browse_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  const keyPrefix = key.substring(0, 12);
  
  await supabase.from('api_keys').insert({
    key_hash: keyHash,
    key_prefix: keyPrefix,
    key_class: 'browse',
    scope: [],
    customer_email: email
  });
  
  console.log(`Browse key for ${email}:\n${key}`);
}

issueBrowseKey(process.argv[2]);
```

Run with: `node scripts/issue-browse-key.js user@example.com`

---

## Testing

### Local Development with Vercel CLI

```bash
# Install
npm install -g vercel

# Run locally (Edge Functions work with --edge flag)
vercel dev

# Test health check
curl http://localhost:3000/api/health

# Test with browse key (get one from DB after running issue script)
curl -H "x-api-key: tcr_browse_xxxx" http://localhost:3000/api/skills
```

### Stripe Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test checkout completion
stripe trigger checkout.session.completed
```

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Set all environment variables in Vercel dashboard
- [ ] Create R2 bucket and upload skill files
- [ ] Create Stripe products and prices, update `STRIPE_PRICES` in catalog
- [ ] Register Stripe webhook
- [ ] Run `issue-browse-key.js` to generate first browse key for testing
- [ ] Test `/api/health` returns 200
- [ ] Test `/api/skills` with browse key returns skill list
- [ ] Do a test Stripe purchase in test mode, verify email sends and download key works
- [ ] Switch Stripe keys from test to live
- [ ] Done

---

## Adding a New Skill

1. Write the skill markdown file → `skills/new-skill-id.md`
2. Upload to R2: `wrangler r2 object put tcr-skills/skills/new-skill-id.md --file=./skills/new-skill-id.md`
3. Add entry to `SKILLS` in `api/_lib/skills-catalog.js`
4. Create Stripe product and price, add to `STRIPE_PRICES`
5. Add HTML sales page: `skills/new-skill-id.html`
6. Deploy

---

*Last updated: March 2026*
