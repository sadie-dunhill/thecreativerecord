# Deployment Guide

**Project:** The Creative Record  
**Domain:** thecreativerecord.com  
**Last Updated:** March 2026

---

## Overview

This guide covers deploying the Next.js site for The Creative Record to Vercel, connecting custom domain, and configuring all necessary environment variables for a working e-commerce + email system.

---

## Step 1: Vercel Setup

### 1.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (recommended for seamless integration)
3. Verify email address

### 1.2 Connect GitHub Repository

1. In Vercel dashboard, click "Add New Project"
2. Select "Import Git Repository"
3. Authorize Vercel to access your GitHub account
4. Select the repository: `thecreativerecord` (or your repo name)
5. Vercel auto-detects Next.js framework

### 1.3 Configure Build Settings

**Framework Preset:** Next.js (auto-detected)

**Build Command:** `next build`

**Output Directory:** `.next`

**Install Command:** `npm install` (or `yarn install` / `pnpm install`)

**Root Directory:** `./` (if repo root is project root)

### 1.4 Deploy Initial Build

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Vercel assigns temporary domain: `thecreativerecord-xxx.vercel.app`
4. Verify the site loads at the temporary URL

---

## Step 2: Domain Configuration

### 2.1 Purchase Domain (if not already done)

**Recommended registrars:**
- Vercel (easiest integration)
- Namecheap (good pricing)
- Cloudflare (free DNS + security features)

### 2.2 Add Domain to Vercel

1. In Vercel dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter: `thecreativerecord.com`
4. Vercel provides DNS records to add

### 2.3 Configure DNS Records

**Option A: Using Vercel Nameservers (Easiest)**
1. At your domain registrar, change nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. Vercel handles all DNS automatically

**Option B: Manual A + CNAME Records**
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 2.4 Configure Redirects

In Vercel dashboard → Project Settings → Domains:
- Redirect `www.thecreativerecord.com` → `thecreativerecord.com` (or vice versa)
- Enable "Redirect domain to primary domain"

### 2.5 Verify Domain

1. DNS propagation takes 5 minutes to 48 hours (usually < 1 hour)
2. Test: `dig thecreativerecord.com` or use [whatsmydns.net](https://whatsmydns.net)
3. Vercel dashboard shows "Valid Configuration" when ready

---

## Step 3: SSL Certificate (Automatic)

✅ **SSL is automatic with Vercel**

- Vercel provisions Let's Encrypt certificates automatically
- No manual configuration needed
- Auto-renews every 90 days
- Forces HTTPS on all deployments

**Verify SSL:**
- Visit `https://thecreativerecord.com`
- Check for lock icon in browser
- Run: `curl -I https://thecreativerecord.com` → should show HTTP/2 200

---

## Step 4: Environment Variables

### 4.1 Stripe Configuration

In Vercel dashboard → Project Settings → Environment Variables:

```
# Stripe (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product/Price IDs (from Stripe Dashboard)
STRIPE_PRICE_SKILL_SINGLE=price_...
STRIPE_PRICE_SKILL_BUNDLE=price_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_FEEDBACK_49=price_...
STRIPE_PRICE_FEEDBACK_99=price_...
```

**How to get these:**
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. For webhook secret: Create endpoint in Developers → Webhooks
   - Endpoint URL: `https://thecreativerecord.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.created`

### 4.2 Email Service (ConvertKit)

```
# ConvertKit API
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_FORM_ID=your_form_id
CONVERTKIT_SEQUENCE_ID=your_sequence_id

# Or if using Mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your_audience_id
```

### 4.3 File Delivery / Download Links

```
# For expiring download links (if building custom)
JWT_SECRET=random_32_char_string
DOWNLOAD_BASE_URL=https://thecreativerecord.com/download
DOWNLOAD_EXPIRY_HOURS=72

# Or if using Gumroad integration
GUMROAD_ACCESS_TOKEN=your_token
```

### 4.4 Analytics

```
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Plausible (privacy-friendly alternative)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thecreativerecord.com
```

### 4.5 Form Handling (if using Formspree)

```
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id
```

### 4.6 General Site Config

```
# Site URL (for sitemap, OG images, etc.)
NEXT_PUBLIC_SITE_URL=https://thecreativerecord.com

# Environment
NODE_ENV=production
```

---

## Step 5: Deploy with Environment Variables

1. Add all environment variables in Vercel dashboard
2. Go to Deployments tab
3. Click "Redeploy" on latest deployment (or push new commit)
4. Verify build succeeds
5. Check environment variables loaded: Add test endpoint `/api/health` that logs `process.env.NODE_ENV`

---

## Step 6: Testing Checklist Before Going Live

### 6.1 Site Functionality

- [ ] Homepage loads without errors
- [ ] All pages accessible: `/`, `/skills`, `/pricing`, `/about`, `/contact`
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Navigation works on desktop
- [ ] No console errors in browser DevTools
- [ ] 404 page works for non-existent routes
- [ ] Favicon displays correctly
- [ ] OG images show when sharing links

### 6.2 Payment Flow (CRITICAL - Test Mode First)

- [ ] Stripe account in Test Mode
- [ ] Test product created in Stripe
- [ ] Checkout page loads with test price
- [ ] Test card payment succeeds: `4242 4242 4242 4242`
- [ ] Declined card handled gracefully: `4000 0000 0000 0002`
- [ ] Success redirect works
- [ ] Webhook received and processed
- [ ] Email confirmation sent
- [ ] Download link delivered
- [ ] Failed payment shows error message

### 6.3 Email Integration

- [ ] Signup form submits successfully
- [ ] Welcome email arrives (check spam folder too)
- [ ] Email sequences trigger correctly
- [ ] Unsubscribe link works
- [ ] Email formatting looks good on mobile/desktop

### 6.4 File Delivery

- [ ] Download link generates after purchase
- [ ] Link expires after set time (test with short expiry)
- [ ] Files download correctly
- [ ] File size/type correct
- [ ] Zip files extract properly

### 6.5 Analytics

- [ ] Google Analytics receiving events (Real-time view)
- [ ] Page view events firing
- [ ] Conversion events (purchase) tracked
- [ ] Plausible dashboard showing visits (if using)

### 6.6 Performance & SEO

- [ ] PageSpeed Insights score > 90 on mobile
- [ ] PageSpeed Insights score > 90 on desktop
- [ ] Core Web Vitals passing
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Meta titles/descriptions present on all pages
- [ ] Structured data (JSON-LD) valid

### 6.7 Security

- [ ] HTTPS enforced (no HTTP access)
- [ ] Security headers present (check [securityheaders.com](https://securityheaders.com))
- [ ] No API keys exposed in client-side code (except public Stripe key)
- [ ] Webhook endpoints verify signatures
- [ ] Form submissions rate-limited

### 6.8 Mobile & Cross-Browser

Test on actual devices if possible:
- [ ] iPhone Safari (iOS)
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] Tablet (iPad)

---

## Step 7: Go Live Checklist

### Pre-Launch

- [ ] Switch Stripe to Live Mode
- [ ] Update environment variables with live keys
- [ ] Create live products in Stripe Dashboard
- [ ] Test one live purchase with real card (then refund)
- [ ] Set up Stripe email receipts (Settings → Emails)
- [ ] Configure Stripe tax settings if needed
- [ ] Connect Stripe to bank account for payouts

### Launch Day

- [ ] Deploy with live environment variables
- [ ] Verify production site loads correctly
- [ ] Run through complete purchase flow once more
- [ ] Check email delivery is working
- [ ] Monitor Stripe dashboard for first sales
- [ ] Have support email ready for customer issues

---

## Troubleshooting

### Build Failures
```
# Check build logs in Vercel dashboard
# Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies in package.json
```

### Domain Not Connecting
```
# Check DNS propagation
 dig thecreativerecord.com +short
# Should return Vercel IPs: 76.76.21.21
```

### Stripe Webhook Errors
```
# Check webhook delivery in Stripe Dashboard → Developers → Webhooks
# Common issues:
- Wrong endpoint URL
- Missing signature verification
- 500 error in webhook handler
```

### Environment Variables Not Loading
```
# Vercel requires redeploy after adding env vars
# Verify in Build Logs that variables are present
# Check: console.log(process.env.VAR_NAME) in API route
```

---

## Post-Launch Monitoring

### Week 1
- Check Vercel Analytics daily
- Monitor Stripe for failed payments
- Watch for 404s in Vercel logs
- Check Core Web Vitals in Search Console

### Month 1
- Review PageSpeed Insights
- Check uptime with Pingdom or UptimeRobot
- Analyze conversion funnel
- Review customer support inquiries

---

## Emergency Contacts & Resources

- **Vercel Status:** [status.vercel.com](https://status.vercel.com)
- **Stripe Status:** [status.stripe.com](https://status.stripe.com)
- **Vercel Support:** support@vercel.com
- **Stripe Support:** Dashboard → Support

---

*Last verified: March 2026*
