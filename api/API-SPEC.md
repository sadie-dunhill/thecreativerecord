# The Creative Record — Agent API Specification

**Version:** 1.0  
**Base URL:** `https://thecreativerecord.com/api`  
**Last Updated:** March 2026  
**Designed for:** OpenClaw agents, AI assistants, and developer integrations

---

## Overview

The Creative Record API lets OpenClaw agents (and any HTTP client) browse, preview, and download creative strategy skills. The design philosophy: simple enough to curl from a terminal, powerful enough to build a full agent workflow.

**What agents can do:**
- List all available skills and their metadata
- Get full detail on any skill (description, preview, table of contents)
- Download purchased skills as markdown files
- Check bundle pricing and contents
- Initiate a purchase (human approves payment, agent gets a download token)

---

## Authentication

All endpoints are authenticated via API key in the request header:

```
x-api-key: tcr_your_key_here
```

**Two classes of API keys:**

| Class | What It Unlocks | How to Get It |
|-------|----------------|---------------|
| `tcr_browse_*` | List endpoints, previews only | Free — email api@thecreativerecord.com |
| `tcr_dl_*` | Full download access for purchased skills | Issued post-purchase automatically |

**Browse keys** are free and rate-limited (100 requests/day). They let agents discover and preview skills without any payment.

**Download keys** are tied to specific purchases. Each purchase generates a unique key scoped to that skill (or bundle). Keys do not expire, but can be revoked on request.

**Unauthenticated requests** return `401 Unauthorized` on all endpoints except `/api/health`.

---

## Endpoints

### Health Check

```
GET /api/health
```

No auth required. Returns server status.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0",
  "timestamp": "2026-03-15T17:00:00Z"
}
```

---

### List All Skills

```
GET /api/skills
```

Returns all available skills with pricing and metadata. No purchase required -- browse keys work here.

**Headers:**
```
x-api-key: tcr_browse_xxxx
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `tag` | string | Filter by tag (e.g. `?tag=video`) |
| `free` | boolean | Show only free skills (`?free=true`) |
| `format` | string | Response format: `full` or `minimal` (default: `full`) |

**Response:**
```json
{
  "skills": [
    {
      "id": "video-script-framework",
      "name": "Video Script Writing System",
      "tagline": "The 30-second structure that converts",
      "description": "The exact 30-second video ad structure used by 8-figure DTC brands. Works across categories, formats, and platforms.",
      "price": 39,
      "currency": "USD",
      "free": false,
      "format": "markdown",
      "word_count": 5800,
      "version": "1.0",
      "tags": ["video", "scripts", "framework", "DTC"],
      "purchase_url": "https://thecreativerecord.com/skills/video-script-framework",
      "preview_url": "https://thecreativerecord.com/api/skills/video-script-framework"
    },
    {
      "id": "hook-bank-template",
      "name": "Hook Bank Template",
      "tagline": "100+ proven hooks for DTC video ads",
      "description": "A structured collection of scroll-stopping hooks organized by awareness stage and format, ready to deploy.",
      "price": 39,
      "currency": "USD",
      "free": false,
      "format": "markdown",
      "word_count": 6900,
      "version": "1.0",
      "tags": ["hooks", "video", "copy", "DTC"],
      "purchase_url": "https://thecreativerecord.com/skills/hook-bank-template",
      "preview_url": "https://thecreativerecord.com/api/skills/hook-bank-template"
    },
    {
      "id": "ugc-brief-template",
      "name": "UGC Brief Template",
      "tagline": "How to brief creators for content that converts",
      "description": "A complete creator briefing system that gets you scroll-stopping UGC without the back-and-forth.",
      "price": 39,
      "currency": "USD",
      "free": false,
      "format": "markdown",
      "word_count": 7300,
      "version": "1.0",
      "tags": ["UGC", "creators", "briefs", "DTC"],
      "purchase_url": "https://thecreativerecord.com/skills/ugc-brief-template",
      "preview_url": "https://thecreativerecord.com/api/skills/ugc-brief-template"
    },
    {
      "id": "creative-audit-checklist",
      "name": "Creative Audit Checklist",
      "tagline": "Diagnose your creative in 20 minutes",
      "description": "A structured framework to identify exactly why your ads are underperforming and what to fix first.",
      "price": 39,
      "currency": "USD",
      "free": false,
      "format": "markdown",
      "word_count": 6600,
      "version": "1.0",
      "tags": ["audit", "creative", "analysis", "DTC"],
      "purchase_url": "https://thecreativerecord.com/skills/creative-audit-checklist",
      "preview_url": "https://thecreativerecord.com/api/skills/creative-audit-checklist"
    },
    {
      "id": "competitor-analysis-framework",
      "name": "Competitor Analysis Framework",
      "tagline": "How to spy on competitors (ethically and effectively)",
      "description": "The exact process for studying competitor creative, extracting what's working, and applying it to your brand.",
      "price": 39,
      "currency": "USD",
      "free": false,
      "format": "markdown",
      "word_count": 6900,
      "version": "1.0",
      "tags": ["competitors", "research", "strategy", "DTC"],
      "purchase_url": "https://thecreativerecord.com/skills/competitor-analysis-framework",
      "preview_url": "https://thecreativerecord.com/api/skills/competitor-analysis-framework"
    }
  ],
  "total": 5,
  "free_count": 0,
  "paid_count": 5,
  "last_updated": "2026-03-15T00:00:00Z"
}
```

---

### Get Skill Detail

```
GET /api/skills/{id}
```

Returns full metadata, a 500-character content preview, and the table of contents. Browse keys work here.

**Path Parameters:**

| Param | Description |
|-------|-------------|
| `id` | Skill ID (e.g. `video-script-framework`) |

**Response:**
```json
{
  "id": "video-script-framework",
  "name": "Video Script Writing System",
  "tagline": "The 30-second structure that converts",
  "description": "The exact 30-second video ad structure used by 8-figure DTC brands...",
  "price": 39,
  "currency": "USD",
  "free": false,
  "format": "markdown",
  "word_count": 5800,
  "version": "1.0",
  "tags": ["video", "scripts", "framework", "DTC"],
  "content_preview": "# Video Script Framework\n## The 30-Second Structure That Converts\n\nThis is the exact 30-second video ad structure used by 8-figure DTC brands. It works across categories, formats, and platforms. Use it as your foundation, then adapt to your brand voice.\n\n**Why 30 seconds?**\n- Meta rewards completion rates\n- 30s is the sweet spot for retention...",
  "table_of_contents": [
    "The Framework Overview",
    "The 5-Beat Structure",
    "Beat 1: The Hook (0-3 seconds)",
    "Beat 2: The Problem (3-8 seconds)",
    "Beat 3: The Solution (8-15 seconds)",
    "Beat 4: The Proof (15-25 seconds)",
    "Beat 5: The CTA (25-30 seconds)",
    "Adapting for Different Formats",
    "Platform-Specific Variations",
    "30 Template Scripts",
    "Common Mistakes and Fixes"
  ],
  "purchase_url": "https://thecreativerecord.com/skills/video-script-framework",
  "download_available": false,
  "download_url": null
}
```

When a download key is used (post-purchase), `download_available` is `true` and `download_url` is populated with a signed URL (24-hour expiry).

---

### Get Bundle Info

```
GET /api/bundle
```

Returns bundle pricing and the list of included skills. Browse keys work here.

**Response:**
```json
{
  "id": "complete-bundle",
  "name": "The Complete Creative Record Bundle",
  "tagline": "All 5 frameworks. One price.",
  "description": "Every skill in The Creative Record, bundled at a discount. Buy once, use forever.",
  "price": 99,
  "original_price": 195,
  "savings": 96,
  "currency": "USD",
  "free": false,
  "includes": [
    "video-script-framework",
    "hook-bank-template",
    "ugc-brief-template",
    "creative-audit-checklist",
    "competitor-analysis-framework"
  ],
  "skill_count": 5,
  "purchase_url": "https://thecreativerecord.com/skills#bundle"
}
```

---

### Download a Skill

```
GET /api/download/{id}
```

Returns the full skill content as a markdown string. **Requires a download key** (issued after purchase).

**Headers:**
```
x-api-key: tcr_dl_xxxx
```

**Path Parameters:**

| Param | Description |
|-------|-------------|
| `id` | Skill ID (e.g. `video-script-framework`) |

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `format` | string | `json` (default) or `raw` (plain text markdown file) |

**Response (format=json):**
```json
{
  "id": "video-script-framework",
  "name": "Video Script Writing System",
  "version": "1.0",
  "format": "markdown",
  "word_count": 5800,
  "content": "# Video Script Framework\n## The 30-Second Structure That Converts\n\n...[full markdown content]...",
  "downloaded_at": "2026-03-15T17:22:00Z",
  "download_key_scope": "video-script-framework"
}
```

**Response (format=raw):**  
Returns the raw markdown file as `Content-Type: text/markdown` with `Content-Disposition: attachment; filename=video-script-framework.md`.

**Key Scope Enforcement:**  
Download keys are scoped. A key for `video-script-framework` cannot download `hook-bank-template`. Bundle keys can download all five skills.

---

### Initiate Purchase

```
POST /api/purchase
```

Creates a Stripe Checkout session and returns a payment URL. The agent sends the URL to the human. Human pays. Stripe webhook fires. Download key arrives in the email used at checkout.

**Headers:**
```
x-api-key: tcr_browse_xxxx
Content-Type: application/json
```

**Request Body:**
```json
{
  "skill_id": "video-script-framework",
  "customer_email": "agent-owner@example.com",
  "success_redirect": "https://thecreativerecord.com/thank-you",
  "cancel_redirect": "https://thecreativerecord.com/skills"
}
```

For bundle purchase, use `"skill_id": "complete-bundle"`.

**Response:**
```json
{
  "checkout_session_id": "cs_test_xxxx",
  "checkout_url": "https://checkout.stripe.com/pay/cs_test_xxxx",
  "skill_id": "video-script-framework",
  "price": 39,
  "currency": "USD",
  "expires_at": "2026-03-15T18:22:00Z",
  "message": "Send checkout_url to the human for payment approval. Download key will arrive at customer_email after successful payment."
}
```

**Agent workflow after this response:**
1. Agent surfaces `checkout_url` to the human
2. Human completes payment
3. Stripe fires webhook to `/api/webhooks/stripe`
4. Download key emailed to `customer_email`
5. Human pastes key into agent config or TOOLS.md

---

### Verify a Download Key

```
GET /api/key/verify
```

Lets an agent check whether a key is valid and what it can access. Useful before attempting downloads.

**Headers:**
```
x-api-key: tcr_dl_xxxx
```

**Response:**
```json
{
  "valid": true,
  "key_class": "download",
  "scope": ["video-script-framework"],
  "created_at": "2026-03-10T09:00:00Z",
  "revoked": false
}
```

Bundle keys return all five skill IDs in `scope`.

---

## Error Codes

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "SKILL_NOT_FOUND",
    "message": "No skill found with id: bad-id",
    "status": 404
  }
}
```

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `INVALID_REQUEST` | Missing or malformed request body |
| 400 | `INVALID_SKILL_ID` | Skill ID not recognized |
| 401 | `MISSING_API_KEY` | No `x-api-key` header |
| 401 | `INVALID_API_KEY` | Key not recognized or revoked |
| 403 | `BROWSE_KEY_INSUFFICIENT` | Endpoint requires download key |
| 403 | `KEY_SCOPE_MISMATCH` | Key valid, but not scoped for this skill |
| 404 | `SKILL_NOT_FOUND` | Skill ID not found |
| 429 | `RATE_LIMITED` | Too many requests -- try again after `Retry-After` |
| 500 | `SERVER_ERROR` | Unexpected server error |

---

## Rate Limits

| Key Class | Requests per Day | Burst (per minute) |
|-----------|-----------------|-------------------|
| Browse | 100 | 10 |
| Download | 500 | 20 |
| Unauthenticated | 0 | -- |

Rate limit headers are returned on every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 94
X-RateLimit-Reset: 1710540000
```

When rate limited, the `Retry-After` header (seconds) is included.

---

## Versioning

The API version is in the base URL path when breaking changes are introduced. Current version has no path prefix -- this is v1 behavior by default.

If a v2 is ever released, it will be at `/api/v2/skills`. The `/api/skills` path will remain on v1 until v1 is deprecated with 90 days notice.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-15 | v1.0 initial specification |
