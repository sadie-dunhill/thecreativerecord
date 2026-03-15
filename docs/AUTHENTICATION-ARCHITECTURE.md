# Authentication Architecture — The Creative Record

**Last Updated:** March 2026  
**Status:** Design spec — pre-implementation  
**Audience:** Matthew + any developer who picks this up

---

## 1. Executive Summary

**Recommended Stack:**

| Layer | Choice | Why |
|---|---|---|
| Auth Provider | **Supabase Auth** | Already have Supabase, free tier generous, magic links built-in, row-level security, no vendor lock-in |
| Database | **Supabase PostgreSQL** | Same project, instant integration, RLS for content gating, no extra bill |
| Frontend Framework | **Next.js** (migrate from static HTML) | Supabase Auth SSR support, API routes for webhooks, incremental static regen |
| Hosting | **Vercel** (keep) | Seamless with Next.js, edge functions for signed URLs |
| Email | **Resend** | Simple API, React Email templates, better deliverability than raw SMTP |
| Sessions | **Supabase SSR + HttpOnly cookies** | Server-side session management, no JWT in localStorage |
| Content Delivery | **Vercel Blob + signed URLs** | Skill files served via Vercel's CDN, expiring tokens |

**Why Supabase over Clerk:**
Clerk's components are beautiful but you'd pay $25+/month at low scale and more at 1,000+ users. Supabase Auth is free up to 50,000 MAU, already in your stack (or will be for DB), and supports every auth pattern you need. Clerk wins on out-of-the-box UI polish; you lose nothing material by building your own UI with Supabase behind it because The Creative Record already has a strong design system.

**Why Next.js migration is worth it:**
The current static site works for browsing and Stripe redirects. It breaks down the moment you need server-side auth checks, secure webhook handling, dynamic content gating, and signed URL generation. Next.js with App Router gives you all of this on Vercel with zero infrastructure changes. The migration is ~1 day of work; the architectural debt of NOT migrating compounds fast.

**The 10-star principle for this system:** A user buys something, creates an account in one step, and sees their content within 60 seconds. Every subsequent visit is one tap. Nothing is behind a support ticket.

---

## 2. Authentication Flows

### 2.1 Magic Link Flow (Primary)

```
User enters email
    ↓
POST /auth/magic-link (rate limited: 3/hour per email)
    ↓
Supabase sends email with 6-digit OTP or link token
    ↓
User clicks link or enters OTP
    ↓
Supabase verifies token (expires: 1 hour)
    ↓
Server sets HttpOnly session cookie
    ↓
Redirect to /account (existing users) or /welcome (new users)
```

**UX notes:**
- Show "Check your email" screen immediately -- no spinner
- Support both click-link AND enter-OTP on same page (for mobile where deep links are unreliable)
- "Didn't get it?" resend button appears after 60 seconds
- Link works in new tab/device (users often open email on phone, clicked on desktop)

### 2.2 Social Login (Google + Apple)

```
User clicks "Continue with Google"
    ↓
Supabase OAuth redirect → Google/Apple IdP
    ↓
IdP returns token to /auth/callback
    ↓
Supabase creates or links user record
    ↓
Server-side: check if user has purchases → link via email
    ↓
Set session cookie → redirect to /account or /welcome
```

**Account linking rule:** If Google auth email matches an existing magic-link account, link them automatically. No duplicate accounts.

### 2.3 Post-Purchase Account Creation Flow

This is the most important flow. User bought something via Stripe without an account. They land on `/thank-you`. Here's how we bridge it:

```
Stripe checkout completes
    ↓
Stripe webhook → POST /api/webhooks/stripe
    ↓
Server creates/finds user record by email
    ↓
Server provisions access (purchase_items row, download tokens)
    ↓
Server sends "Access your purchase" email with magic link
    ↓
User clicks link → lands on /welcome?session=X
    ↓
Session set, account created automatically
    ↓
User sees their purchased skills, prompted to set display name
```

**Key principle:** Account creation is invisible. The user clicked "buy," paid, and their account exists. The magic link email IS the account creation step. Zero additional friction.

### 2.4 Returning User Flow

```
User visits /account
    ↓
Middleware checks for valid session cookie
    ↓
Valid: render dashboard directly
Invalid: redirect to /login
    ↓
/login: enter email → magic link → back to /account
```

Total time for returning user: 0 clicks (session valid) or 2 clicks + email tap.

### 2.5 Session Expiry Recovery

```
User's session expires mid-session
    ↓
API call returns 401
    ↓
Client intercepts → shows non-blocking toast: 
  "Session expired — re-authenticating..."
    ↓
Background refresh attempt via Supabase refresh token
    ↓
Success: transparent recovery, user never leaves page
Failure: redirect to /login with return_url preserved
    ↓
After re-auth: redirect back to where they were
```

---

## 3. Database Schema

All tables in Supabase PostgreSQL. Row-Level Security (RLS) enforced at DB layer -- not just application layer.

### 3.1 Core Tables

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  -- Subscription state (denormalized for fast checks)
  subscription_status TEXT DEFAULT 'none', -- none | active | past_due | canceled
  subscription_tier   TEXT DEFAULT 'free', -- free | member
  stripe_customer_id  TEXT UNIQUE,
  -- Preferences
  email_marketing BOOLEAN DEFAULT true,
  email_transactional BOOLEAN DEFAULT true,
  timezone    TEXT DEFAULT 'America/Los_Angeles'
);

-- Skills catalog (the products)
CREATE TABLE public.skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL, -- video-script-framework
  title       TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT UNIQUE NOT NULL,
  file_path   TEXT NOT NULL, -- path in Vercel Blob storage
  file_name   TEXT NOT NULL, -- display name for download
  file_size_bytes INTEGER,
  preview_url TEXT,          -- public preview page
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases (link between user and what they've bought)
CREATE TABLE public.purchases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email             TEXT NOT NULL,               -- always store email in case user_id is null (pre-account)
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount_cents      INTEGER NOT NULL,
  currency          TEXT DEFAULT 'usd',
  purchase_type     TEXT NOT NULL,               -- individual | bundle | subscription
  status            TEXT DEFAULT 'completed',     -- completed | refunded | disputed
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  refunded_at       TIMESTAMPTZ
);

-- Purchase line items (what was in the cart)
CREATE TABLE public.purchase_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
  skill_id    UUID REFERENCES public.skills(id),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,
  -- Access control
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  access_expires_at TIMESTAMPTZ, -- NULL = permanent (one-time purchase)
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Download tokens (short-lived, single-use URLs)
CREATE TABLE public.download_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id    UUID REFERENCES public.skills(id),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Download history (analytics + "last accessed")
CREATE TABLE public.download_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id    UUID REFERENCES public.skills(id),
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address  TEXT,
  user_agent  TEXT
);

-- Subscription records (detailed Stripe subscription data)
CREATE TABLE public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id       TEXT NOT NULL,
  status                TEXT NOT NULL,   -- active | past_due | canceled | trialing
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT false,
  canceled_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Row-Level Security Policies

```sql
-- Profiles: users can only read/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Purchase items: users can see what they've bought
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchase items"
  ON public.purchase_items FOR SELECT
  USING (auth.uid() = user_id);

-- Download tokens: users can only access their own tokens
ALTER TABLE public.download_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own download tokens"
  ON public.download_tokens FOR SELECT
  USING (auth.uid() = user_id AND expires_at > NOW() AND used_at IS NULL);

-- Download history: users can view their own history
ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own download history"
  ON public.download_history FOR SELECT
  USING (auth.uid() = user_id);

-- Skills: public read (catalog browsing), no write from client
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are public" ON public.skills FOR SELECT USING (is_active = true);
```

### 3.3 Indexes

```sql
CREATE INDEX idx_purchase_items_user_id ON public.purchase_items(user_id);
CREATE INDEX idx_purchase_items_email ON public.purchase_items(email);
CREATE INDEX idx_download_tokens_token ON public.download_tokens(token);
CREATE INDEX idx_download_tokens_user_skill ON public.download_tokens(user_id, skill_id);
CREATE INDEX idx_purchases_stripe_session ON public.purchases(stripe_session_id);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
```

---

## 4. Security Model

### 4.1 Session Architecture

**Choice: HttpOnly Secure Cookies (NOT localStorage JWT)**

Rationale: Storing tokens in localStorage exposes them to any XSS on the page. HttpOnly cookies are invisible to JavaScript -- only the browser sends them, and only over HTTPS.

```
Auth flow produces: Supabase session (access_token + refresh_token)
    ↓
Next.js middleware serializes to encrypted HttpOnly cookie
    ↓
Cookie attributes:
  HttpOnly: true           -- JS can't read it
  Secure: true             -- HTTPS only
  SameSite: Lax            -- Protects against CSRF for cross-site navigation
  Path: /                  -- Available site-wide
  Max-Age: 604800          -- 7 days (access token refreshes automatically)
    ↓
Supabase SSR package handles token refresh automatically
```

**Token lifecycle:**
- Access token: 1 hour expiry (Supabase default)
- Refresh token: 7 days, single-use rotation
- Session appears permanent to user but tokens rotate silently
- "Remember me" = no action needed (7-day sliding window handles it)
- Explicit logout: delete cookie + revoke refresh token server-side

### 4.2 Rate Limiting

Implemented via Vercel Edge Middleware + Upstash Redis (free tier sufficient for MVP):

| Endpoint | Limit | Window | Action on Exceed |
|---|---|---|---|
| POST /auth/magic-link | 3 requests | per email/hour | 429, show countdown |
| POST /auth/magic-link (by IP) | 10 requests | per IP/hour | 429, soft captcha |
| POST /auth/verify-otp | 5 attempts | per session | token invalidated |
| GET /api/download/* | 20 requests | per user/hour | 429, contact support |
| POST /api/webhooks/stripe | None | -- | Verified by signature |

### 4.3 Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*.supabase.co;
  connect-src 'self' https://*.supabase.co https://api.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  object-src 'none';
  base-uri 'self';
```

### 4.4 Additional Security Headers

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 4.5 Magic Link Security

- Token is 64 random bytes (256-bit entropy), not sequential or guessable
- Single-use: token is deleted on first successful verification
- Expiry: 1 hour from issuance
- Rate limiting: 3 magic link sends per email per hour
- Bound to device fingerprint (optional, phase 2): prevents token use on different device
- PKCE flow for OAuth: prevents authorization code interception

### 4.6 MFA Strategy

**Phase 1 (MVP):** No mandatory MFA. Magic links ARE a form of possession-based auth (only email owner can click).

**Phase 2:** Offer TOTP via Google Authenticator / Authy for users who want it. Triggered by:
- User opt-in in Security settings
- After 3 failed login attempts
- Never force it on purchase flow (kills conversion)

**Backup codes:** 8 single-use 16-character alphanumeric codes. Generated on TOTP setup. Displayed once, downloadable.

**SMS MFA:** Not recommended. SMS is the weakest MFA factor (SIM-swapping). TOTP is better. Skip SMS entirely.

---

## 5. Content Protection

### 5.1 The Problem

Skill files (PDFs, Markdown) need to be accessible to purchasers but not freely downloadable by anyone with a link. We can't use DRM (overkill, breaks UX). We need a system that:

1. Only authenticated purchasers can get a download link
2. Links expire (can't be shared indefinitely)
3. File is not at a predictable/guessable URL
4. UX is instant -- no "you'll receive an email" delays

### 5.2 Signed URL Architecture

```
User in /account clicks "Download" on a skill they own
    ↓
Client makes authenticated request: POST /api/download/generate
  Body: { skill_id: "video-script-framework" }
    ↓
API checks:
  1. Valid session (cookie auth)
  2. User has purchase_item for this skill_id
  3. No active download token already exists for this user+skill (prevent token farming)
    ↓
If authorized:
  1. Generate download_token row (UUID + 1-hour expiry)
  2. Generate signed URL to Vercel Blob: 
     https://blob.vercel-storage.com/skills/video-script-framework.pdf
     ?token=SIGNED_JWT&expires=UNIX_TIMESTAMP
  3. Return { download_url: "...", expires_in: 3600, filename: "..." }
    ↓
Client immediately triggers browser download
  (no redirect -- use fetch + blob + createObjectURL for clean UX)
    ↓
After download completes:
  1. Mark download_token as used_at = NOW()
  2. Append download_history row
```

### 5.3 File Storage

Files live in Vercel Blob (or Supabase Storage) with:
- Private bucket (no public access)
- Randomized file paths (not predictable slugs):
  ```
  skills/a8f3c921-4b5e-video-script-framework.pdf
  ```
- Signed URLs generated server-side only
- Client never gets direct storage credentials

### 5.4 Subscriber Content (Monthly Plan)

Subscribers get access to all current and future skills. Access check:

```sql
-- User can download this skill if:
-- 1. They have a purchase_item for this specific skill, OR
-- 2. They have an active subscription
SELECT EXISTS (
  SELECT 1 FROM purchase_items 
  WHERE user_id = $user_id AND skill_id = $skill_id
  AND (access_expires_at IS NULL OR access_expires_at > NOW())
)
OR EXISTS (
  SELECT 1 FROM profiles
  WHERE id = $user_id AND subscription_status = 'active'
) AS has_access;
```

### 5.5 "View Online" Feature (Phase 2)

For subscribers: render skill content in-browser (not just download). Implementation:

- Serve skill content via server-rendered Next.js route
- Route protected by auth middleware
- Content fetched from private storage at render time
- No raw file URL exposed to client
- Respects subscription status in real-time

---

## 6. User Experience Flows

### 6.1 First-Time Purchase (No Account)

**Goal:** Buy in 2 clicks, have access in under 60 seconds.

```
[Skills Page]
    ↓
User clicks "Get This Skill — $39"
    ↓
[Stripe Checkout] (Stripe-hosted, email field prominent)
  Email: user@example.com
  Card: 4242 4242 4242 4242
  ↓ (Stripe handles PCI compliance entirely)
    ↓
[Thank You Page] /thank-you?session_id=cs_xxx
  Copy: "You're in. Check your email."
  Visual: Checkmark animation, then product preview
  Secondary: "While you wait, here's what to expect..."
    ↓
[Email arrives within 30 seconds]
  Subject: "Your Creative Record access is ready"
  CTA: "Access Your Skills" (magic link, 24-hour expiry for post-purchase links)
    ↓
[Click → /welcome?t=MAGIC_TOKEN]
  Session created, account provisioned automatically
  Redirect to /account?welcome=true
    ↓
[Account Dashboard — Welcome State]
  "Welcome to The Creative Record, [first name from Stripe]"
  Purchased skill shown immediately, prominent download button
  Optional: "Set your display name" (1 field, skip available)
```

**Total time from purchase to file: under 60 seconds.**

### 6.2 Returning User Login

```
User visits /account (or any protected page)
    ↓
Has valid session: → Dashboard immediately. Zero friction.
    ↓
No session: → /login (no redirect flash -- middleware handles gracefully)
    ↓
[Login Page]
  Single field: email address
  "Continue" button
  Below: "Continue with Google" | "Continue with Apple"
    ↓
Email submitted → "Check your inbox" screen
  - Shows email domain for quick tap (e.g., "Open Gmail →")
  - OR: "Enter the 6-digit code instead" (OTP fallback)
  - Resend available after 60 seconds
    ↓
Link clicked or OTP entered → dashboard
```

### 6.3 Account Dashboard IA (Information Architecture)

```
/account
├── [Default view] My Skills
│   ├── Skill card: title, thumbnail, download button, last accessed
│   ├── For each skill: "Download" | "View Online" (sub phase 2)
│   └── Empty state (for new accounts): "Your skills will appear here"
│
├── /account/billing
│   ├── Current plan badge (Free | Member)
│   ├── Subscription status + renewal date
│   ├── "Manage subscription" → Stripe Customer Portal
│   ├── Invoice history (pulled from Stripe API)
│   └── Purchase history
│
├── /account/settings
│   ├── Profile: display name, email (read-only), avatar upload
│   ├── Security: connected login methods, add/remove Google/Apple
│   ├── Notifications: email preferences (marketing on/off)
│   └── Danger zone: export data, delete account
│
└── /account/support
    ├── FAQ accordion (top 10 questions)
    ├── Contact form (subject + message, 48hr response promise)
    └── Order history with resend-download buttons
```

### 6.4 Download UX (Micro-interaction Detail)

```
User clicks "Download"
    ↓
Button state: "Preparing..." (spinner, 300ms max)
    ↓
Download starts in browser (no new tab, no redirect)
Button state: "Downloading..." (progress if browser exposes it)
    ↓
Download complete
Button state: "Downloaded ✓" (green check, 2 seconds)
    ↓
Button returns to "Download" state
"Last downloaded: just now" updates below button
```

No loading page. No "your download will start shortly." The file starts downloading the moment the signed URL is ready.

### 6.5 Account Deletion Flow

```
User clicks "Delete Account" in settings
    ↓
Step 1: Confirmation modal
  "Are you sure? This will permanently delete your account.
   Your purchase history and access to skills will be removed."
  [Cancel] [Yes, delete my account]
    ↓
Step 2: Email verification (anti-oops protection)
  "We sent a confirmation to user@example.com. Click the link 
   to permanently delete your account."
    ↓
User clicks deletion link → account scheduled for deletion
  - 30-day soft delete (data retained, access suspended)
  - Day 30: hard delete (GDPR right to erasure)
  - Confirmation email sent immediately
```

---

## 7. Email Templates

All emails sent via **Resend** with React Email templates. Brand: DM Serif Display headings, Inter body, terra (#c8552a) accent, cream (#faf8f5) background.

### 7.1 Email Inventory

| Template | Trigger | From Name | Subject Line Pattern |
|---|---|---|---|
| `purchase-access` | Stripe `checkout.session.completed` | The Creative Record | "Your skills are ready" |
| `welcome-account` | First account login | The Creative Record | "Welcome to The Creative Record" |
| `magic-link` | Auth magic link request | The Creative Record | "Your sign-in link" |
| `magic-link-otp` | OTP auth request | The Creative Record | "Your code: {code}" |
| `password-change` | Security event | The Creative Record | "Your sign-in method was updated" |
| `subscription-active` | Subscription started | The Creative Record | "Your Creative Record membership is active" |
| `subscription-renewal` | 3 days before renewal | The Creative Record | "Your membership renews in 3 days" |
| `subscription-past-due` | Payment failed | The Creative Record | "Action needed: payment issue" |
| `subscription-canceled` | Subscription ends | The Creative Record | "Your membership has ended" |
| `account-deletion-confirm` | Deletion requested | The Creative Record | "Confirm account deletion" |
| `account-deleted` | Deletion completed | The Creative Record | "Your account has been deleted" |
| `data-export` | Data export request | The Creative Record | "Your data export is ready" |

### 7.2 Key Email Details

**purchase-access** (most important email)
```
Subject: "Your skills are ready, [first_name]"
Preview: "Click to access your purchase"

Header: The Creative Record wordmark
---
[H1] You're in.

[Body] Your purchase of [skill name(s)] is confirmed.
Click below to access your skills immediately.

[CTA Button - terra] Access Your Skills →
          (magic link, 24-hour expiry)

---
[Small] If you didn't make this purchase, reply to this email.
[Small] Questions? support@thecreativerecord.com
```

**magic-link** (daily driver)
```
Subject: "Your sign-in link for The Creative Record"
Preview: "Expires in 1 hour"

[H1] Sign in to The Creative Record

[Body] Click the button below to sign in. 
This link expires in 1 hour and can only be used once.

[CTA Button] Sign In →

---
Or enter this code: [OTP in large monospace]

[Small] Didn't request this? Ignore this email — nothing will change.
```

**subscription-past-due**
```
Subject: "Action needed: payment didn't go through"

[H1] Your payment didn't go through

[Body] We couldn't process your membership payment. 
Your skills are still accessible for now, but your membership 
will pause if not resolved within 7 days.

[CTA] Update Payment Method →
      (links to Stripe Customer Portal)

[Small] Questions? Reply to this email.
```

### 7.3 Email Sending Setup

```
Provider: Resend (resend.com)
  Free tier: 3,000 emails/month (more than enough for MVP)
  Domain: Verify thecreativerecord.com domain
  From: hello@thecreativerecord.com (transactional)
  From: newsletter@thecreativerecord.com (beehiiv, separate)
  
SPF/DKIM/DMARC records:
  - Resend provides these on domain verification
  - Critical for deliverability -- do this before launch
```

---

## 8. Implementation Phases

### Phase 1: MVP Auth (Week 1-2)

**Goal:** Users can buy → receive magic link → access skills → reopen anytime

| Task | Effort |
|---|---|
| Migrate to Next.js (App Router) | 1 day |
| Supabase project setup + schema | 2 hours |
| Magic link auth flow | 1 day |
| Stripe webhook → user provisioning | 1 day |
| /account dashboard (My Skills) | 1 day |
| Signed URL download flow | 1 day |
| Resend email setup + purchase-access template | 4 hours |
| Vercel deployment + env vars | 2 hours |

**Total: ~6-7 days of focused work**

MVP ships with: magic link auth, post-purchase account creation, skill downloads, basic dashboard.

NOT in MVP: Google/Apple login, MFA, subscription management UI, billing page, data export.

### Phase 2: Account Completeness (Week 3-4)

| Task | Effort |
|---|---|
| Google OAuth | 4 hours |
| Apple OAuth | 1 day (Apple sign-in setup is annoying) |
| Billing page + Stripe Customer Portal | 1 day |
| Settings page (profile, notifications) | 1 day |
| Support page + contact form | 4 hours |
| All email templates | 1 day |
| Rate limiting via Upstash Redis | 4 hours |

### Phase 3: Delight Layer (Month 2)

| Task | Effort |
|---|---|
| TOTP MFA (optional for users) | 2 days |
| "View Online" for subscribers | 2 days |
| Download progress tracking | 1 day |
| Biometric login (WebAuthn / passkeys) | 3 days |
| Data export (GDPR) | 1 day |
| Account deletion flow | 1 day |
| Suspicious activity detection | 2 days |

### Phase 4: Scale Prep (Month 3+)

| Task | Notes |
|---|---|
| Upstash Redis rate limiting (production config) | Replace Edge Middleware basic rate limit |
| PostHog analytics for auth funnel | Login success rate, magic link CTR |
| Sentry for error tracking | Auth failures, webhook failures |
| Security audit | Before 1,000 users |

---

## 9. Code Examples

### 9.1 Supabase Auth Middleware (Next.js App Router)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /account/* routes
  if (request.nextUrl.pathname.startsWith('/account') && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('return_url', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/account/:path*', '/api/download/:path*'],
}
```

### 9.2 Magic Link Request Handler

```typescript
// app/api/auth/magic-link/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const { email } = await req.json()

  // Rate limit: 3 per email per hour
  const { success } = await rateLimit(`magic:${email}`, 3, 3600)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before requesting another link.' },
      { status: 429 }
    )
  }

  const supabase = createServerClient(/* ... */)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: true, // create account if doesn't exist
    },
  })

  if (error) {
    console.error('Magic link error:', error)
    // Don't expose error details to client (prevents email enumeration)
    return NextResponse.json({ success: true }) // Always return 200
  }

  return NextResponse.json({ success: true })
}
```

### 9.3 Stripe Webhook → User Provisioning

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const email = session.customer_details?.email!
    const stripeCustomerId = session.customer as string

    const supabase = createServerSupabaseClient()

    // Find or create user record
    let { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      // User doesn't exist yet -- create minimal profile
      // Full profile created on first auth
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          email,
          stripe_customer_id: stripeCustomerId,
          display_name: session.customer_details?.name ?? null,
        })
        .select('id')
        .single()
      profile = newProfile
    }

    // Record the purchase
    const { data: purchase } = await supabase
      .from('purchases')
      .insert({
        user_id: profile?.id,
        email,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_cents: session.amount_total!,
        purchase_type: 'individual', // determine from line items
      })
      .select('id')
      .single()

    // Provision access to each purchased skill
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    for (const item of lineItems.data) {
      const skillSlug = item.price?.lookup_key // set lookup_key on Stripe prices to skill slug
      if (skillSlug) {
        const { data: skill } = await supabase
          .from('skills')
          .select('id')
          .eq('slug', skillSlug)
          .single()

        if (skill) {
          await supabase.from('purchase_items').insert({
            purchase_id: purchase!.id,
            skill_id: skill.id,
            user_id: profile?.id,
            email,
          })
        }
      }
    }

    // Send purchase access email with magic link
    await sendPurchaseAccessEmail(email)
  }

  return new Response('OK')
}
```

### 9.4 Secure Download Endpoint

```typescript
// app/api/download/generate/route.ts
import { createServerClient } from '@supabase/ssr'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const supabase = createServerClient(/* ... */)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new Response('Unauthorized', { status: 401 })

  const { skill_id } = await req.json()

  // Verify access
  const { data: access } = await supabase
    .from('purchase_items')
    .select('id, skills(file_path, file_name)')
    .eq('user_id', user.id)
    .eq('skill_id', skill_id)
    .or(`access_expires_at.is.null,access_expires_at.gt.${new Date().toISOString()}`)
    .single()

  // Also check subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const hasAccess = access || profile?.subscription_status === 'active'
  if (!hasAccess) return new Response('Forbidden', { status: 403 })

  const skill = access?.skills as any

  // Generate signed URL (Vercel Blob)
  const signedUrl = await fetch(
    `https://api.vercel.com/v1/blob/generate-url`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pathname: skill.file_path,
        expiresIn: 3600, // 1 hour
      }),
    }
  ).then(r => r.json())

  // Log download
  await supabase.from('download_history').insert({
    user_id: user.id,
    skill_id,
    ip_address: req.headers.get('x-forwarded-for'),
  })

  return Response.json({
    download_url: signedUrl.url,
    filename: skill.file_name,
    expires_in: 3600,
  })
}
```

### 9.5 Auth Callback Handler

```typescript
// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const returnUrl = searchParams.get('return_url') ?? '/account'

  if (code) {
    const supabase = createServerClient(/* ... */)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if this is a new user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', data.user.id)
        .single()

      // New user: ensure profile exists
      if (!profile) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata?.full_name ?? null,
        })

        // Check for pre-purchase records (bought without account)
        await linkPrePurchaseRecords(data.user.id, data.user.email!)

        return NextResponse.redirect(`${origin}/account?welcome=true`)
      }

      return NextResponse.redirect(`${origin}${returnUrl}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}

async function linkPrePurchaseRecords(userId: string, email: string) {
  // Link any purchase_items that have this email but no user_id
  await supabase
    .from('purchase_items')
    .update({ user_id: userId })
    .eq('email', email)
    .is('user_id', null)
}
```

---

## 10. Third-Party Services Setup

### What You Need Before Going Live

**Supabase (auth + database)**
- Create project at supabase.com
- Run schema migrations (SQL above)
- Enable Email auth provider (magic links on by default)
- Enable Google OAuth provider
- Enable Apple OAuth provider
- Configure email templates (or disable and use Resend instead)
- Set up RLS policies
- Note: Get SUPABASE_URL and SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY

**Resend (email delivery)**
- Create account at resend.com
- Add thecreativerecord.com domain
- Add DNS records for SPF, DKIM, DMARC
- Create API key
- Build email templates with React Email

**Vercel Blob (file storage)**
- Already on Vercel -- enable Blob storage
- Upload skill files with randomized paths
- Store file paths in `skills` table
- Get BLOB_READ_WRITE_TOKEN

**Stripe (already configured)**
- Add webhook endpoint: https://thecreativerecord.com/api/webhooks/stripe
- Subscribe to: checkout.session.completed, customer.subscription.*, invoice.payment_failed
- Get STRIPE_WEBHOOK_SECRET from Stripe dashboard
- Set `lookup_key` on each Stripe Price to match skill slug

**Upstash Redis (rate limiting, phase 2)**
- Create account at upstash.com (free tier: 10,000 commands/day)
- Create Redis database
- Get UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN

**Google OAuth**
- console.cloud.google.com → Create OAuth 2.0 credentials
- Authorized redirect URI: https://[supabase-project].supabase.co/auth/v1/callback
- Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Supabase dashboard

**Apple OAuth**
- Apple Developer account required ($99/year)
- Create Services ID
- Configure domain and redirect URIs
- Most annoying OAuth setup in existence -- save for Phase 2

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # Server only, never expose

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# App
NEXT_PUBLIC_SITE_URL=https://thecreativerecord.com

# Rate limiting (Phase 2)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Appendix: Security Checklist

### Pre-Launch
- [ ] HTTPS enforced on all routes (Vercel handles this)
- [ ] Security headers configured (Vercel headers in next.config.js)
- [ ] CSP header set
- [ ] Stripe webhook signature verified
- [ ] Stripe secret key is server-only (never in NEXT_PUBLIC_*)
- [ ] SUPABASE_SERVICE_ROLE_KEY is server-only
- [ ] RLS policies tested -- verify users can't access other users' data
- [ ] Magic link rate limiting active
- [ ] Download endpoint validates auth + ownership
- [ ] Signed URLs expire (not permanent)
- [ ] Email domain SPF/DKIM/DMARC verified

### Pre-1,000 Users
- [ ] Error monitoring (Sentry)
- [ ] Auth funnel analytics (PostHog)
- [ ] Suspicious login detection (Supabase provides baseline)
- [ ] Account deletion flow working end-to-end
- [ ] Data export working (GDPR)
- [ ] Dependency audit (npm audit)

### Ongoing
- [ ] Quarterly dependency updates
- [ ] Annual password/secrets rotation
- [ ] Review Supabase security advisories

---

## Appendix: GDPR / Privacy Notes

**Data collected:**
- Email address (required for purchase + auth)
- Display name (optional, user-provided)
- Avatar (optional, user-provided)
- Purchase history (required for access)
- Download history (analytics, retained 2 years)
- IP addresses in download logs (retained 90 days)

**Rights:**
- Right to access: Data export feature (Phase 3)
- Right to erasure: Account deletion flow
- Right to portability: JSON export of purchase history
- Opt-out of marketing: Email preferences toggle

**Data residency:** Supabase offers EU hosting (Frankfurt) for GDPR projects. Default is US. If you expect significant EU traffic, create project in EU region.

**Privacy policy must cover:**
- What data is collected
- How it's used (account management, purchase fulfillment, optional marketing)
- Third-party processors: Stripe, Supabase, Resend, Vercel
- Retention periods
- User rights and how to exercise them
- Contact: privacy@thecreativerecord.com
