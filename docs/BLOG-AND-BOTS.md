# Blog System & OpenClaw Bot Distribution
**The Creative Record**
Last Updated: March 15, 2026

---

## Blog System

### Structure

```
blog/
  index.html                           — Blog listing page (featured post hero, category filter, post grid)
  post-template.html                   — Reusable template for new posts
  post.css                             — Shared stylesheet for all post pages
  facebook-ads-for-small-business-beginners-guide.html
  ad-templates-that-work-for-any-small-business.html
  how-much-should-small-business-spend-on-ads.html
  8-hook-formulas-every-small-business-should-test.html
```

### Adding a New Post

1. Copy `post-template.html` to `blog/[post-slug].html`
2. Replace all `{{PLACEHOLDER}}` values
3. Update `blog/index.html` — add new post card to the grid
4. Update footer "Recent Posts" on all existing post pages
5. Add to `sitemap.xml`
6. Push to GitHub (auto-deploys to Vercel)

### Design System

Same as main site: DM Serif Display + Inter, terracotta (`#c8552a`) accent, warm cream background.

Key classes:
- `.post-body` — article content with `h2` targeting for TOC
- `.callout` — highlighted key takeaway boxes
- `.template-box` — dark code-style template blocks
- `.step-list` + `.step-item` — numbered steps with terracotta circles
- `.sidebar` — sticky right column with TOC, newsletter signup, skill CTA

### Categories

- `Hooks` — data-cat="hooks"
- `Scripts` — data-cat="scripts"
- `Strategy` — data-cat="strategy"
- `SMB Tips` — data-cat="smb-tips"

Category filter on `blog/index.html` uses JS to show/hide post cards by `data-cat` attribute.

---

## OpenClaw Bot Distribution

### Overview

When The Creative Record publishes newsletter or blog content, `distribute-to-bots.js` POSTs a standard JSON envelope to every registered bot webhook.

This enables other OpenClaw agents to:
- Receive newsletter content automatically
- Build knowledge bases from TCR content
- Trigger workflows on new content publication

### API Endpoints

#### Distribute Content
```
POST /api/distribute-to-bots
Authorization: Bearer <DISTRIBUTE_SECRET>
Content-Type: application/json

{
  "type": "newsletter",          // "newsletter" | "blog"
  "title": "Week 3: The Hook Formula...",
  "content": "...(markdown)...",
  "excerpt": "Short description",
  "url": "https://thecreativerecord.com/...",
  "published_at": "2026-03-18T08:00:00-07:00",
  "categories": ["hooks", "smb-tips"]
}

// OR: fetch latest from Beehiiv automatically
{
  "fetch_latest": true
}
```

#### Subscribe a Bot
```
POST /api/bots/subscribe
Content-Type: application/json

{
  "bot_name": "my-openclaw-bot",
  "webhook_url": "https://my-server.com/webhooks/tcr",
  "content_types": ["both"],     // ["newsletter"] | ["blog"] | ["both"]
  "secret": "optional-hmac-key"  // for webhook signature verification
}
```

#### Unsubscribe a Bot
```
DELETE /api/bots/subscribe
Content-Type: application/json

{ "bot_name": "my-openclaw-bot" }
```

#### List Subscribers (Admin)
```
GET /api/bots/subscribe
Authorization: Bearer <DISTRIBUTE_SECRET>
```

### Payload Format (sent to each bot)

```json
{
  "source": "the-creative-record",
  "type": "newsletter",
  "title": "Week 3: The Problem-First Hook",
  "content": "...(full markdown content)...",
  "excerpt": "Short description...",
  "url": "https://thecreativerecord.com/...",
  "canonical_url": "https://thecreativerecord.com/...",
  "published_at": "2026-03-18T08:00:00-07:00",
  "categories": ["hooks"],
  "tags": [],
  "author": "Sadie Dunhill",
  "publication": "The Creative Record",
  "publication_url": "https://thecreativerecord.com",
  "beehiiv_post_id": "post_xxx",
  "_dispatched_at": "2026-03-18T15:02:11.000Z"
}
```

### Webhook Signature Verification

If a bot subscribes with a `secret`, each outbound request includes:
```
X-TCR-Signature: sha256=<HMAC-SHA256 of payload using secret>
```

Bots should verify this signature before processing content.

### Subscriber Registry

Stored in `api/subscribed-bots.json` for local/static deployments.
In production (Vercel), use Vercel KV and set `BOT_REGISTRY_URL` env var.

### Environment Variables (Vercel)

| Variable | Purpose |
|---|---|
| `DISTRIBUTE_SECRET` | Auth token for triggering distribution |
| `BEEHIIV_API_KEY` | Auto-fetch latest newsletter post |
| `BEEHIIV_PUB_ID` | Beehiiv publication ID |
| `BOT_REGISTRY_URL` | Optional: KV store for persistent subscriber registry |

### Manual Trigger (Sadie cron or manual)

```bash
curl -X POST https://thecreativerecord.com/api/distribute-to-bots \
  -H "Authorization: Bearer <DISTRIBUTE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"fetch_latest": true}'
```

---

## Newsletter System

**Platform:** Beehiiv
**Publication:** The Creative Record (pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66)
**Send Schedule:** Tuesdays 8am PT

### Topics
1. Weekly hook breakdown (analyze 1 winning ad hook)
2. Creative strategy tips (short, actionable)
3. New skill announcements
4. Script Desk case studies
5. SMB advertising trends

### Signup Locations
- Homepage newsletter strip (existing)
- Blog posts sidebar (all 4 posts)
- Blog index email CTA section
- Popup (existing `js/popup.js`)
- Lead magnet pages

All signup forms POST to `/api/subscribe` with `source` field for attribution tracking.
