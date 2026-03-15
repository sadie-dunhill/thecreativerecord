# User Flows — The Creative Record

**Last Updated:** March 2026  
**Status:** Design spec  
**Companion doc:** AUTHENTICATION-ARCHITECTURE.md (technical implementation)

This document maps every user journey in the auth + account system. Each flow includes: trigger, steps, success state, failure states, and UX notes.

---

## How to Read This Doc

Each flow uses this format:

```
[TRIGGER] → [STEP 1] → [STEP 2] → ... → [SUCCESS STATE]
                                   ↓
                           [FAILURE/EDGE STATE]
```

Annotations:
- 🎯 = Critical moment (conversion risk)
- ⚡ = Must be instant (no perceptible delay)
- 💌 = Email touchpoint
- 🔒 = Security check
- ✨ = Delight opportunity

---

## Flow 1: First Purchase (No Account)

**Trigger:** User on /skills page clicks "Get This Skill" or "Get the Bundle"

**This is the most important flow.** Conversion lives or dies here.

```
[/skills or skill detail page]
User clicks "Get This Skill — $39" or "Get the Bundle — $99"
     ↓ 🎯
[Stripe Checkout — hosted page]
  ├── Email field (large, prominent at top)
  ├── Card details
  ├── Order summary on right: skill name, price
  ├── "Powered by Stripe" trust badge
  └── (No account creation here — don't add friction)
     ↓ (payment success)
[Stripe Webhook fires → POST /api/webhooks/stripe]
  ├── ⚡ Server creates profile record (by email)
  ├── ⚡ Server creates purchase + purchase_items
  └── ⚡ Server triggers purchase-access email via Resend
     ↓
[/thank-you?session_id=cs_xxx]  💌
  Visual: Animated checkmark (200ms, subtle)
  H1: "You're in."
  Body: "Check your email — your access link is on the way."
  Secondary content (while they wait):
    - Brief "what to expect" teaser
    - "Questions? support@thecreativerecord.com"
  No: countdown timers, upsell noise, confetti
     ↓ (email arrives, typically <30s)
[Email: "Your skills are ready, [name]"]
  Single CTA: "Access Your Skills →"
  Magic link: expires 24 hours (longer than standard for post-purchase)
     ↓ 🎯
[/auth/callback?code=...]
  Session created
  Profile finalized (name from Stripe)
  Purchase items linked to new user_id
  ⚡ Redirect to /account?welcome=true
     ↓
[/account — Welcome State] ✨
  Header: "Welcome to The Creative Record."
  Subheading: "[name], your [skill name] is ready."
  [PROMINENT DOWNLOAD BUTTON]
  Below: optional "Set your display name" (1 field, dismissible)
```

**Success state:** User has downloaded their skill within 60 seconds of email click.

**Edge cases:**

*Payment succeeds, email never arrives*
- Thank you page shows "Didn't get it?" link after 2 minutes
- Triggers resend of purchase-access email
- If still nothing after 5 min: "Email us — support@thecreativerecord.com"

*User clicks link days later (link expired)*
- /auth/callback detects expired token
- Shows: "This link has expired. Enter your email and we'll send a new one."
- Sends fresh magic link
- After auth: links their email to existing purchase records

*Stripe checkout abandoned (left before paying)*
- No webhook fires
- No email sent
- No action needed
- Stripe handles cart recovery via their own mechanisms (optional)

---

## Flow 2: Return Visit (Active Session)

**Trigger:** User navigates to /account (from bookmark, nav, or email link)

```
[/account]
Middleware checks session cookie
     ↓ ⚡
Valid session: render dashboard immediately
  No redirect, no flash, no loading state
  User sees their skills, billing status, name in sidebar
```

**This should feel instant.** If there's a flash of unauthenticated content before redirecting, the middleware isn't set up correctly. Next.js middleware runs at the edge, before HTML is served -- use it.

---

## Flow 3: Return Visit (Expired Session)

**Trigger:** User navigates to /account but their session has expired (7-day inactivity)

```
[/account]
Middleware: no valid session found
     ↓ ⚡
Attempt silent token refresh (Supabase SSR handles automatically)
     ↓
Refresh succeeds: user sees dashboard (transparent recovery) ✨
     ↓
Refresh fails: redirect to /login?return_url=/account
```

**At /login:**
```
[/login?return_url=/account]
  Clean, minimal: 
    H1: "Sign in"
    Single field: email address
    Button: "Continue"
    Divider: "or"
    [Continue with Google]
    [Continue with Apple]
  No password field. No "forgot password." No username.
     ↓
User enters email, clicks Continue
     ↓ 💌
[/login — checking email state]
  "Check your inbox"
  Email address shown: "We sent a link to user@example.com"
  If recognizable email provider, show deep link:
    "Open Gmail →" / "Open Outlook →" / "Open Apple Mail →"
  ⚡ OTP fallback: "Or enter the 6-digit code"
  Resend link: appears after 60 seconds
     ↓
[Email: "Your sign-in link"] or OTP entered
     ↓
[/auth/callback] → session created
  ⚡ Redirect to return_url (/account)
```

**The return_url is critical.** A user who was on /account/billing should land back on /account/billing, not the home dashboard. Preserve it through the entire auth flow.

---

## Flow 4: Social Login (Google)

**Trigger:** User clicks "Continue with Google" on /login

```
[/login]
User clicks "Continue with Google"
     ↓
Supabase initiates OAuth flow → redirect to accounts.google.com
     ↓ 🔒
Google authentication (Google's UI, not ours)
     ↓
Google redirects to /auth/callback with OAuth code
     ↓ 🔒
Server exchanges code for session
     ↓
Check: does this Google account email match an existing profile?
  ├── YES: Link accounts, start session, redirect to /account
  └── NO (new user): Create profile with Google display name + avatar
           ↓
      Check: does this email have pre-purchase records?
        ├── YES: Link purchase_items to new user_id → /account?welcome=true
        └── NO: → /account (empty state, "Browse Skills" CTA)
```

**Account linking:** If a user bought something via magic link and now tries to sign in with Google (same email), their accounts merge silently. No "already have an account" error. No duplicate accounts.

---

## Flow 5: Purchase with Existing Account

**Trigger:** Logged-in user on /skills page clicks "Buy"

```
[/skills — user is authenticated]
User clicks "Get This Skill — $39"
     ↓ ⚡
Pre-fill Stripe checkout with their email (via client_reference_id + prefill)
  [Stripe Checkout]
    Email: prefilled from their account (read-only or editable)
    Card: if Stripe has saved it, shown immediately
     ↓
Payment succeeds
     ↓
Webhook fires: user_id known from stripe_customer_id lookup
purchase + purchase_items created immediately
     ↓ 💌
Email: "Purchase confirmed" (brief, links to /account)
     ↓
[/thank-you?session_id=cs_xxx]
  Since user is logged in:
    "Your skill has been added to your account."
    [Go to My Skills →] (direct link, no magic link needed)
     ↓
[/account — My Skills]
  New skill appears at top with "New" badge ✨
  Download button active immediately
```

---

## Flow 6: Subscription Purchase

**Trigger:** User on /subscribe page clicks "Start Membership — $29/month"

```
[/subscribe]
User clicks "Start Membership"
     ↓
If not logged in: same as Flow 1 (Stripe captures email)
If logged in: Stripe prefills email
     ↓
[Stripe Checkout — subscription mode]
  Email, card, billing cycle shown
  Shows: "Your first charge today: $29"
  Shows: "Cancels anytime"
     ↓
Payment success → checkout.session.completed webhook
     ↓
Server:
  1. Update profiles.subscription_status = 'active'
  2. Update profiles.subscription_tier = 'member'
  3. Create subscriptions row
  4. All skills' purchase_items effectively gated by subscription check
     ↓ 💌
Email: "Your membership is active" (confirms access to all skills)
     ↓
[/account?welcome=member] ✨
  "You now have access to all skills."
  Shows all skills unlocked, ready to download
  Member badge in sidebar
```

---

## Flow 7: Subscription Management

**Trigger:** User clicks "Manage Subscription" in /account/billing

```
[/account/billing]
User sees:
  - Plan: Member ($29/month)
  - Status: Active
  - Next renewal: [date]
  - [Manage Subscription] button
     ↓
Click "Manage Subscription"
     ↓ ⚡
Server creates Stripe Customer Portal session:
  POST /api/billing/portal
  → stripe.billingPortal.sessions.create({ customer: stripe_customer_id, return_url: /account/billing })
     ↓
Redirect to Stripe Customer Portal (Stripe-hosted)
  User can:
    - Update payment method
    - Download invoices
    - Cancel subscription (Stripe handles this UI)
    - View billing history
     ↓
User clicks "Return to The Creative Record"
     ↓
[/account/billing] — updated with new status
  If canceled: shows "Membership ends [date]" + "Reactivate" CTA
```

**Why Stripe's portal:** It handles all the PCI compliance, dispute flows, and billing edge cases. Don't rebuild this. Spend the time on your own UI.

---

## Flow 8: Payment Failed (Subscription)

**Trigger:** Stripe retry logic exhausted -- invoice.payment_failed webhook with failed_payment_retry_exhausted

```
[Stripe webhook: invoice.payment_failed]
     ↓
Server updates profiles.subscription_status = 'past_due'
     ↓ 💌
Email: "Action needed: payment issue"
  CTA: "Update Payment Method →" (Stripe portal link, one-click)
  Copy: "Your skills are still accessible for 7 days while you update."
     ↓
[User logs in, sees warning banner in dashboard]
  "⚠ Your payment didn't go through. Update your payment method to keep access."
  [Update Now →]
     ↓
[After 7 days, subscription_status = 'canceled' if not resolved]
  Skills become inaccessible (subscription gating removed)
  Email: "Your membership has ended"
  Dashboard: shows "Reactivate" CTA instead of skills
```

---

## Flow 9: Download a Skill

**Trigger:** Logged-in user with access clicks "Download" on a skill card

```
[/account — My Skills]
User sees skill card:
  [Skill title]
  [Thumbnail]
  "Last downloaded: 3 days ago" (or never)
  [Download ▾]
     ↓
Click "Download"
     ↓ ⚡
Button state: "Preparing..." (spinner)
POST /api/download/generate { skill_id }
     ↓ 🔒
Server checks:
  1. Valid session
  2. User owns this skill OR has active subscription
  3. Generate signed URL (1-hour expiry)
  4. Log to download_history
     ↓ ⚡
Response: { download_url, filename, expires_in }
     ↓ ⚡
Client: fetch(download_url) → Blob → createObjectURL → trigger download
  No redirect. No new tab. File downloads in browser.
     ↓ ✨
Button state: "Downloading..." (if browser exposes progress)
  → "Downloaded ✓" (green, 2 seconds)
  → Returns to "Download"
"Last downloaded: just now" updates
```

**Why no redirect:** Redirecting to a signed URL exposes it in browser history. Fetching client-side and using blob URLs is cleaner and doesn't add the URL to the navigation history.

**What if download fails:**
```
fetch returns error (network, expired token, etc.)
     ↓
Button state: "Download failed — try again"
  Small retry link, no error modal
     ↓
Second attempt: regenerate token and retry
```

---

## Flow 10: Settings — Update Profile

**Trigger:** User navigates to /account/settings

```
[/account/settings — Profile tab]
Shows:
  - Avatar (circular, click-to-upload)
  - Display name (editable input)
  - Email (read-only, with "Change Email" link)
  - Save button (disabled until change made)
     ↓
User edits display name
Button becomes active ✨
     ↓
Click "Save"
     ↓ ⚡
PATCH /api/profile { display_name }
Optimistic update: name changes in sidebar immediately
     ↓
Success: "Changes saved" toast (2 seconds, bottom-right) ✨
Error: "Couldn't save — try again" inline
```

**Avatar upload:**
```
User clicks avatar → file picker opens
User selects image
     ↓
Client-side: crop/resize preview (square, max 400x400)
     ↓
User confirms
     ↓
POST /api/profile/avatar (multipart)
Server uploads to Supabase Storage (user-specific bucket)
Returns signed URL
     ↓ ⚡
Optimistic: avatar updates immediately in sidebar and everywhere
```

---

## Flow 11: Change Email

**Trigger:** User clicks "Change Email" in settings

Because email IS the login credential, email changes require re-verification.

```
[/account/settings — Profile]
User clicks "Change Email"
     ↓
Modal appears:
  "New email address"
  [input field]
  [Send verification →]
     ↓
Two emails sent:
  1. To OLD email: "You requested an email change. If this was you, no action needed."
  2. To NEW email: "Confirm your new email address" (magic link, 1-hour expiry)
     ↓
User clicks link in new email
     ↓ 🔒
Server updates profiles.email + auth.users email
Old email no longer works for login
     ↓
Success page: "Email updated. Use [new email] to sign in."
```

---

## Flow 12: Account Deletion

**Trigger:** User clicks "Delete Account" in /account/settings → Danger Zone

```
[/account/settings — Danger Zone]
"Delete Account" link (text, not a button — no accidental clicks)
     ↓
Click → Confirmation modal:
  Title: "Delete your account?"
  Body: "This will permanently remove your account, purchase history,
         and access to your skills. This cannot be undone."
  [Cancel] [Yes, delete my account]
     ↓ 🎯
Click "Yes, delete my account"
     ↓
Secondary confirmation: enter email to confirm
  "Type [email] to confirm deletion"
  [Delete account forever]
     ↓ 💌
Email sent: "Confirm account deletion"
  "Click to permanently delete your Creative Record account.
   You have 30 days to change your mind."
  [Confirm Deletion]  [Cancel, keep my account]
     ↓ (if confirmed)
Account status: scheduled_for_deletion
  Access suspended immediately
  Data retained for 30 days (GDPR soft-delete window)
  ↓
[After 30 days: hard delete]
  profiles row deleted
  purchase_items deleted
  download_history deleted
  auth.users deleted
  Stripe customer: not deleted (legal requirement for financial records)
     ↓
Immediate confirmation email:
  "Your account has been deleted. 
   Your purchase records have been removed.
   If you change your mind within 30 days, email us."
```

---

## Flow 13: Data Export (Phase 3 / GDPR)

**Trigger:** User clicks "Export My Data" in settings

```
[/account/settings]
User clicks "Export My Data"
     ↓
"Your data export will be ready in a few minutes. 
 We'll email you a download link."
     ↓
Background job generates JSON file containing:
  - Profile data
  - Purchase history
  - Download history
  - Email preferences
     ↓ 💌
Email: "Your data export is ready"
  Link to download JSON file (expires 48 hours)
     ↓
User downloads ZIP containing data.json
```

---

## Flow 14: Support Contact

**Trigger:** User on /account/support fills out contact form

```
[/account/support]
User sees:
  - FAQ accordion (pre-answers top 10 questions)
  - "Still need help?" contact form below
  - "Order History" section (resend download buttons per purchase)
     ↓
User fills contact form:
  Subject: [dropdown: Can't access skills | Billing question | Technical issue | Other]
  Message: [textarea]
  [Send Message]
     ↓ ⚡
POST /api/support { subject, message }
Server pre-fills: user email, account age, purchase history, last download attempt
     ↓ 💌
Email sent to support@thecreativerecord.com with full context
Auto-reply to user: "Got your message. We respond within 48 hours."
     ↓ ✨
Form replaced with: "Message sent. Check your email for confirmation."
```

**"Resend my download" flow (in Order History):**
```
User sees purchase row: "Video Script Framework — March 5, 2026"
Clicks "Resend Download Link"
     ↓ 💌
New purchase-access email sent with fresh magic link
"Link sent — check your email"
```

---

## Flow 15: Mobile — Tap to Sign In

Magic links on mobile have a specific UX challenge: the link opens in a browser while the user's email app is separate. Handle both paths.

```
[Mobile: user receives magic link email in Gmail app]
     ↓
User taps "Sign In →" in email
     ↓
Option A: Gmail opens link in in-app browser
  Auth completes, session set in in-app browser
  Problem: user is in Gmail's browser, not their main browser
  Solution: show "Open in [Safari/Chrome]" prompt after auth ✨
     ↓
Option B: Gmail opens link in system browser
  Auth completes, session set in real browser
  User sees dashboard
```

**OTP fallback (recommended for mobile):**
```
[/login on mobile]
User enters email
"Check your inbox" state shows:
  1. Deep link if Gmail/Outlook detected (primary CTA)
  2. "Enter the code from your email" (visible OTP input)
     ↓
[Email]
  Shows 6-digit OTP prominently (large font)
  User can type code directly on /login page
  No link-clicking required
     ↓
OTP entered → auth completes in same browser session
No app-switching confusion ✨
```

---

## Error States Reference

| Scenario | User-facing message | Recovery path |
|---|---|---|
| Magic link expired | "This link has expired. Enter your email for a new one." | Resend magic link |
| Magic link already used | "This link has already been used. Sign in below." | Normal login form |
| Rate limited (magic link) | "Too many attempts. Try again in 45 minutes." | Show countdown |
| Email not found (post-purchase) | Never shown (prevents email enumeration) | Always show "check your inbox" |
| Payment failed | "Your payment didn't go through. Please check your card." | Stripe portal |
| Download failed | "Couldn't prepare download. Try again." | Retry button |
| Session expired (mid-session) | Non-blocking toast + transparent refresh attempt | Silent recovery → /login fallback |
| Subscription access denied | "This skill requires a membership." | Upgrade CTA |
| No purchases | Empty state in My Skills: "Your skills will appear here." | Browse skills CTA |

---

## Page Routing Map

```
/login                          → Auth entry point (magic link + social)
/login?return_url=/account/...  → Preserve destination through auth
/auth/callback                  → OAuth + magic link callback (server-side)
/welcome                        → Post-magic-link landing (new users)

/account                        → Dashboard (My Skills, default)
/account/billing                → Billing, subscription, invoices
/account/settings               → Profile, security, notifications, danger zone
/account/support                → FAQ, contact form, order history

/api/auth/magic-link            → Send magic link (POST)
/api/auth/logout                → Destroy session (POST)
/api/download/generate          → Create signed download URL (POST, authenticated)
/api/profile                    → Read/update profile (GET/PATCH, authenticated)
/api/profile/avatar             → Upload avatar (POST, authenticated)
/api/billing/portal             → Create Stripe portal session (POST, authenticated)
/api/support                    → Submit support ticket (POST, authenticated)
/api/webhooks/stripe            → Stripe event handler (POST, signature verified)
```

---

## Animation & Transition Notes

The site already has a strong motion language (150ms fast, 220ms base). Auth flows should match:

| Moment | Animation |
|---|---|
| Magic link sent → "Check inbox" state | Slide up, 220ms ease |
| Button state: loading | Spinner fades in, 150ms |
| Button state: success (✓) | Checkmark draws in, 200ms |
| Dashboard section switch | Fade + slight translate, 220ms |
| Toast notification | Slide in from bottom-right, 220ms ease |
| Toast dismiss | Fade out, 150ms |
| Form error message | Shake (3 cycles, 300ms) + fade in red text |
| New skill badge (post-purchase) | Pulse 2x, then static |
| Download complete | Green fill on button, then fades back, 400ms total |

Nothing dramatic. Nothing that makes you wait. Transitions that confirm state changes without demanding attention.

---

## Open Questions (Decide Before Build)

1. **Guest downloads:** Should users be able to access content via email link indefinitely (no forced account creation)? Or is account creation required to re-access after initial purchase? Recommendation: require account after 48 hours -- drives registration without friction at purchase moment.

2. **Subscription: which skills are included?** All current skills? Future skills as they launch? Establish this before building the access check logic.

3. **Bundle purchasers:** Do they get permanent individual access to all 5 skills, or is the bundle treated as a single product? Recommendation: individual access per skill -- more flexible for future refunds, simpler access logic.

4. **Support SLA:** What's the real response time? "48 hours" is in the email template -- adjust if different.

5. **Referral / affiliate tracking:** Does it need to persist through auth? If affiliates link is `?ref=affiliate_slug`, that parameter needs to survive the Stripe checkout and be recorded with the purchase. Decide now; retrofitting is painful.
