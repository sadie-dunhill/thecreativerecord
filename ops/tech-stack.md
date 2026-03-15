# Tech Stack

**Project:** The Creative Record  
**Purpose:** Document all tools and services needed for launch  
**Last Updated:** March 2026

---

## Overview

The Creative Record uses a modern, low-maintenance stack optimized for digital product sales. All services offer free tiers to start, with clear upgrade paths as the business grows.

---

## Core Infrastructure

### Hosting: Vercel

**Service:** [vercel.com](https://vercel.com)  
**Cost:** Free tier to start, $20/mo Pro when needed  
**Purpose:** Static site hosting + serverless functions

**What you get on free tier:**
- Unlimited static sites
- 100GB bandwidth/month
- 1000 build minutes/month
- 100GB-hours serverless functions
- Automatic HTTPS/SSL
- Global CDN
- Instant rollbacks

**When to upgrade to Pro ($20/mo):**
- Need password-protected deployments
- Require 1TB+ bandwidth
- Want analytics included
- Need concurrent builds

**Setup time:** 10 minutes  
**Maintenance:** Near-zero (fully managed)

---

## Payments

### Primary: Stripe

**Service:** [stripe.com](https://stripe.com)  
**Cost:** 2.9% + 30¢ per transaction (no monthly fee)  
**Purpose:** Payment processing, subscriptions, invoicing

**Features used:**
- Checkout (hosted payment pages)
- Customer portal (subscription management)
- Webhooks (automate post-purchase actions)
- Subscriptions (monthly/annual billing)
- Tax calculation (automatic)
- Fraud protection (Stripe Radar)

**Why Stripe:**
- Industry standard, trusted by customers
- Excellent developer documentation
- Handles all PCI compliance
- Supports one-time + recurring payments
- Beautiful checkout experience

**Setup requirements:**
- Bank account for payouts
- Business verification (EIN or SSN)
- Takes 1-2 days for first payout

**Alternatives considered:**
- PayPal (higher fees, clunky UX)
- LemonSqueezy (good for digital products, higher fees)
- Gumroad (simple, but 10% fee)

---

## Email Marketing

### Option A: ConvertKit (Recommended)

**Service:** [convertkit.com](https://convertkit.com)  
**Cost:** Free up to 1,000 subscribers, then $29/mo  
**Purpose:** Email sequences, newsletters, automation

**Free tier includes:**
- Unlimited landing pages
- Unlimited forms
- Email broadcasts
- Basic automation

**Paid features you'll want:**
- Automated sequences (welcome series)
- Visual automation builder
- Integrations (Stripe, etc.)

**Why ConvertKit:**
- Built for creators
- Excellent deliverability
- Beautiful templates
- Subscriber-centric (not list-centric)

---

### Option B: Mailchimp

**Service:** [mailchimp.com](https://mailchimp.com)  
**Cost:** Free up to 500 subscribers, then $13/mo  
**Purpose:** Email marketing, automation, CRM

**Free tier includes:**
- 500 subscribers
- 1,000 emails/month
- Basic templates
- Landing pages

**Why Mailchimp:**
- More mature API
- Better for complex automations
- Built-in CRM features

**Why NOT Mailchimp:**
- More complex than needed
- Pricing jumps quickly
- "Marketer" focused vs "creator" focused

---

### Recommendation: Start with ConvertKit

Better fit for digital product creators. Easier to use. Free tier generous.

---

## File Delivery

### Option A: Simple Expiring Links (Recommended for MVP)

**Implementation:** Custom Next.js API routes  
**Cost:** Included in hosting  
**How it works:**
1. Customer completes Stripe checkout
2. Webhook triggers backend
3. Generate signed JWT with file URL + expiry
4. Email link to customer
5. Link expires after 72 hours

**Pros:**
- Free
- Full control over experience
- Can customize expiry time
- No third-party dependencies

**Cons:**
- You build it
- Need to store files (Vercel Blob, S3, or CDN)

**File storage options:**
- Vercel Blob (free tier: 250MB, then $0.15/GB)
- AWS S3 (~$0.023/GB/month)
- Cloudflare R2 (free tier: 10GB/month)
- BunnyCDN ($0.01/GB, no minimum)

---

### Option B: Gumroad Integration

**Service:** [gumroad.com](https://gumroad.com)  
**Cost:** 10% + Stripe fees per transaction  
**Purpose:** File hosting + delivery + checkout

**How it works:**
1. Upload files to Gumroad
2. Customer buys on your site
3. Redirect to Gumroad for download
4. Or use API to generate download links

**Pros:**
- Handles file storage
- Built-in download limits
- Customer library/portal
- No bandwidth worries

**Cons:**
- 10% fee adds up
- Less control over branding
- Customers may get confused by dual branding

---

### Option C: Customer Portal

**Implementation:** Full auth system + file access  
**Tools needed:**
- Clerk or Auth0 for authentication
- Database for user/file relationships
- Protected file serving

**Pros:**
- Customers can re-download anytime
- Build ongoing relationship
- Membership feel

**Cons:**
- Complex to build
- Overkill for MVP
- Adds friction (need to create account)

---

### Recommendation: Option A (Simple Links)

For MVP, build custom expiring links. It's simpler than it sounds, costs nothing extra, and gives you full control. Upgrade to portal later if membership model proves valuable.

---

## Analytics

### Google Analytics 4

**Service:** [analytics.google.com](https://analytics.google.com)  
**Cost:** Free  
**Purpose:** Traffic analysis, conversion tracking, audience insights

**What to track:**
- Page views
- Traffic sources
- User demographics
- Conversion events (purchase, signup)
- E-commerce revenue

**Setup:**
1. Create GA4 property
2. Add tracking ID to site
3. Configure conversion events
4. Link to Google Ads (if running ads)

---

### Plausible Analytics (Privacy-Friendly)

**Service:** [plausible.io](https://plausible.io)  
**Cost:** $9/mo (or self-host for free)  
**Purpose:** Simple, privacy-focused analytics

**Why add Plausible:**
- No cookie banner needed (GDPR-compliant)
- Lightweight script (< 1KB)
- Simple, clean dashboard
- No data sharing with Google
- Growing audience expects privacy

**Data you'll see:**
- Unique visitors
- Page views
- Top pages
- Referral sources
- Countries
- Devices

**Why use both GA4 + Plausible:**
- GA4 for detailed conversion tracking
- Plausible for quick checks + privacy compliance

---

## Form Handling

### Option A: Formspree (Recommended)

**Service:** [formspree.io](https://formspree.io)  
**Cost:** Free up to 50 submissions/month, then $10/mo  
**Purpose:** Contact forms, lead capture, file uploads

**Free tier:**
- 50 submissions/month
- 1 form
- Basic spam protection
- Email notifications

**Why Formspree:**
- Drop-in solution (just add action URL to form)
- No backend code needed
- Built-in spam filtering
- File upload support
- Works with any static site

**Setup:**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" placeholder="Your email">
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>
```

---

### Option B: Netlify Forms

**Service:** [netlify.com](https://netlify.com)  
**Cost:** Free up to 100 submissions/month  
**Purpose:** Form handling for Netlify-hosted sites

**Note:** Only works if hosting on Netlify. Since we're using Vercel, this isn't an option unless you switch hosts.

---

### Option C: Custom API Route

**Implementation:** Next.js API route + email service  
**Cost:** Free (uses Vercel serverless)  
**Purpose:** Full control over form handling

**Pros:**
- No third-party dependency
- Custom validation
- Store submissions in database
- Trigger automations

**Cons:**
- Need to build spam protection (reCAPTCHA/hCaptcha)
- More code to maintain

---

### Recommendation: Start with Formspree

Zero setup. Just works. Upgrade to custom solution later if you need complex workflows.

---

## Additional Tools (Optional)

### Image Optimization

**Tool:** Next.js Image component  
**Cost:** Free  
**Purpose:** Automatic image optimization, WebP conversion, responsive sizes

---

### Error Monitoring

**Tool:** Sentry  
**Service:** [sentry.io](https://sentry.io)  
**Cost:** Free tier (5k errors/month)  
**Purpose:** Track JavaScript errors, API failures, performance issues

**When to add:** After launch, once you have traffic

---

### Uptime Monitoring

**Tool:** UptimeRobot  
**Service:** [uptimerobot.com](https://uptimerobot.com)  
**Cost:** Free (50 monitors, 5-min intervals)  
**Purpose:** Alert if site goes down

---

### Search Console

**Tool:** Google Search Console  
**Service:** [search.google.com](https://search.google.com)  
**Cost:** Free  
**Purpose:** Monitor search performance, submit sitemap, fix indexing issues

**Essential for:**
- SEO visibility
- Core Web Vitals monitoring
- Mobile usability
- Structured data validation

---

## Stack Summary Table

| Service | Purpose | Cost | Priority |
|---------|---------|------|----------|
| Vercel | Hosting | Free | Required |
| Stripe | Payments | 2.9% + 30¢ | Required |
| ConvertKit | Email | Free | Required |
| Google Analytics | Analytics | Free | Required |
| Formspree | Forms | Free | Required |
| Plausible | Privacy Analytics | $9/mo | Recommended |
| Cloudflare R2 | File Storage | Free | Recommended |
| Sentry | Error Tracking | Free | Optional |
| UptimeRobot | Monitoring | Free | Optional |

---

## Monthly Cost Estimates

### Launch (Month 1)
| Service | Cost |
|---------|------|
| Vercel | $0 |
| Stripe | Per transaction |
| ConvertKit | $0 |
| Formspree | $0 |
| Google Analytics | $0 |
| **Total Fixed** | **$0/mo** |

### Growth Phase (~500 customers)
| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Stripe | Per transaction |
| ConvertKit | $29 |
| Formspree Pro | $10 |
| Plausible | $9 |
| Cloudflare R2 | $0-5 |
| **Total Fixed** | **~$68/mo** |

### Scale Phase (2,500+ customers)
| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Stripe | Per transaction |
| ConvertKit | $79 |
| Formspree Business | $40 |
| Plausible | $9 |
| Cloudflare R2 | $5-10 |
| Sentry | $26 |
| **Total Fixed** | **~$184/mo** |

---

## Decision Log

**Why Vercel over Netlify?**
- Better Next.js integration (same company)
- Superior performance for React apps
- More generous free tier

**Why Stripe over Gumroad for checkout?**
- Lower fees (2.9% vs 10%)
- More professional appearance
- Full control over UX
- Better subscription management

**Why ConvertKit over Mailchimp?**
- Built for creators, not marketers
- Simpler interface
- Better free tier for our use case
- Tags > Lists philosophy

**Why build file delivery vs. use Gumroad?**
- Gumroad's 10% fee is significant at scale
- Full control over customer experience
- Can implement unique features later
- Actually simple to build (JWT + signed URLs)

---

*Last updated: March 2026*
