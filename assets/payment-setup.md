# The Creative Record - Payment Setup Guide

Complete guide for setting up Stripe payments for skills, bundles, and subscriptions.

---

## Overview

**Payment Processor:** Stripe
**Currency:** USD
**Payment Methods:** Credit/Debit cards
**Setup Time:** ~30 minutes

---

## Step 1: Stripe Account Creation

### Create Your Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign in" if you have an account
3. Enter your email and create a password
4. Verify your email address
5. Complete business profile:
   - Business type: Individual or Company
   - Business name: The Creative Record
   - Website: thecreativerecord.com
   - Industry: Digital products / Education

### Verify Your Identity

1. Provide personal information (SSN last 4 for individuals)
2. Upload ID verification if requested
3. Add bank account for payouts
4. Complete tax information (W-9 for US)

**Note:** Verification may take 1-2 business days for new accounts.

---

## Step 2: Product Setup

### Individual Skills ($39 each)

Create 5 products, one for each skill:

#### Product 1: Video Script Writing
```
Name: Video Script Writing System
Description: Learn to write video scripts that hook viewers in the first 3 seconds and keep them watching until the CTA.
Price: $39.00 (One-time)
```

#### Product 2: Hook Formulas
```
Name: Hook Formulas Library
Description: 50 proven hook formulas for video ads, organized by awareness stage and format.
Price: $39.00 (One-time)
```

#### Product 3: Creator Briefing
```
Name: Creator Briefing Masterclass
Description: How to write briefs that get creators exactly what you need, with templates and examples.
Price: $39.00 (One-time)
```

#### Product 4: Creative Audit
```
Name: Creative Audit Framework
Description: A systematic approach to analyzing ad creative and identifying optimization opportunities.
Price: $39.00 (One-time)
```

#### Product 5: Competitor Analysis
```
Name: Competitor Analysis System
Description: Track, analyze, and learn from your competitors' creative strategies.
Price: $39.00 (One-time)
```

**To create each product:**
1. Stripe Dashboard → Products → Add product
2. Enter name and description
3. Set price: $39.00
4. Select "One-time" payment
5. Save product

---

### Complete Bundle ($99)

```
Name: The Creative Record - Complete Bundle
Description: Get all 5 skills at a discounted price. Video Script Writing, Hook Formulas, Creator Briefing, Creative Audit, and Competitor Analysis.
Price: $99.00 (One-time)
```

**Bundle savings message:** "Save $96 (49% off) when you buy the complete bundle"

**Setup:**
1. Create as a separate product
2. Price: $99.00
3. One-time payment
4. Add metadata: includes all 5 skill IDs

---

### Monthly Subscription ($29/month)

```
Name: The Creative Record - Monthly Membership
Description: Monthly access to all current and future skills, plus exclusive templates, updates, and community access.
Price: $29.00 / month
Billing: Recurring monthly
```

**Subscription benefits to highlight:**
- Access to all 5 skills
- New skills as they're released
- Monthly template drops
- Community access
- Priority support

**Setup:**
1. Create product
2. Price: $29.00
3. Select "Recurring" 
4. Billing period: Monthly
5. Consider: Free trial (optional, e.g., 7 days)

---

## Step 3: Stripe Checkout Configuration

### Enable Checkout

1. Stripe Dashboard → Settings → Checkout
2. Enable "Client-only integration" (for simple sites)
3. Or use "Stripe-hosted checkout" (recommended)
4. Customize checkout appearance:
   - Brand color: #e94560 (coral)
   - Upload logo
   - Add custom text

### Payment Link Setup (Simplest Option)

For each product, create a payment link:

1. Go to Product → Click product
2. Click "Create payment link"
3. Configure:
   - Collect customer email: YES (required for delivery)
   - Require shipping address: NO
   - Allow promotion codes: YES (optional)
4. Copy the payment link URL
5. Use this URL on your "Buy" buttons

**Payment Link URLs look like:**
```
https://buy.stripe.com/xxxxxXXXXxxxxx
```

---

## Step 4: Webhook Configuration

### Why Webhooks?

Webhooks notify your site when:
- Payment succeeds
- Subscription renews
- Payment fails
- Refund issued

### Create Webhook Endpoint

1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://thecreativerecord.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed` (payment succeeded)
   - `invoice.payment_succeeded` (subscription renewed)
   - `customer.subscription.deleted` (subscription cancelled)
   - `charge.refunded` (refund issued)

5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

### Webhook Secret Setup

Add to your environment variables:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
```

---

## Step 5: Test Mode vs Live Mode

### Test Mode

Use Stripe's test environment to verify everything works:

**Test card numbers:**
- Successful payment: `4242 4242 4242 4242`
- Declined payment: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

**Any future date, any 3-digit CVC, any ZIP**

**Testing checklist:**
- [ ] Payment link opens correctly
- [ ] Test card payment succeeds
- [ ] Webhook fires and is received
- [ ] Customer receives confirmation email
- [ ] Product delivery triggers (if automated)

### Switching to Live Mode

1. Complete all verifications in Stripe
2. Toggle "Test mode" off in Stripe dashboard
3. Update your code to use live keys:
   - Change `sk_test_` to `sk_live_`
   - Change `pk_test_` to `pk_live_`
4. Replace webhook secret with live webhook secret
5. Test one real payment with your own card
6. Verify webhook still works

---

## Step 6: Email Delivery Integration

### Post-Purchase Email Flow

When `checkout.session.completed` webhook fires:

```javascript
// Pseudo-code for webhook handler
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const customerEmail = session.customer_email;
  const productId = session.metadata.product_id;
  
  // Send email with download link
  await sendDeliveryEmail(customerEmail, productId);
  
  // Grant access (if membership)
  if (productId === 'membership') {
    await createUserAccount(customerEmail);
  }
}
```

### Email Service Options

**Option 1: Stripe's built-in receipts**
- Automatic, but limited customization
- Enable: Settings → Emails → Customer emails

**Option 2: SendGrid (recommended)**
- Better customization
- Transactional email templates
- Free tier: 100 emails/day

**Option 3: Beehiiv (already integrated)**
- Can trigger via API
- Good for newsletter continuity

---

## Step 7: Product Delivery Methods

### Digital Downloads

**Option A: Simple Links**
- Upload files to secure storage (S3, Dropbox)
- Generate signed/temporary URLs
- Include in post-purchase email

**Option B: Member Portal**
- Create user accounts on purchase
- Grant access to download area
- Track downloads per user

### Membership Content

For subscription access:
1. Create protected member area
2. Grant access on successful subscription
3. Revoke access on cancellation
4. Use JWT or session cookies for auth

---

## Pricing Summary

| Product | Price | Type |
|---------|-------|------|
| Individual Skills (5) | $39 each | One-time |
| Complete Bundle | $99 | One-time |
| Monthly Membership | $29/month | Recurring |

**Bundle math:**
- Individual total: $195
- Bundle price: $99
- Customer saves: $96 (49%)

---

## Security Checklist

- [ ] Never expose secret keys in frontend code
- [ ] Use environment variables for all keys
- [ ] Verify webhook signatures
- [ ] Use HTTPS for all webhook endpoints
- [ ] Implement idempotency for webhooks
- [ ] Log all payment events
- [ ] Have refund policy documented

---

## Refund Policy Template

```
Refund Policy for The Creative Record:

We offer a 30-day money-back guarantee on all purchases. 
If you're not satisfied with your purchase, contact us at 
[support email] within 30 days for a full refund.

Subscription refunds: Cancel anytime. Refund prorated 
for unused days if cancelled within 14 days.
```

---

## Support Resources

- Stripe Docs: [stripe.com/docs](https://stripe.com/docs)
- Payment Links: [stripe.com/payments/payment-links](https://stripe.com/payments/payment-links)
- Webhooks: [stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)
- Testing: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

*Last Updated: March 14, 2026*
