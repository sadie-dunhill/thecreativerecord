# Stripe Products — The Creative Record

Created: 2026-03-15

All products are live in the Stripe account (Goodostudios / Mercury).

---

## Individual Skills — $39 each

| Product | Product ID | Price ID | Payment Link |
|---------|-----------|----------|-------------|
| Video Script Framework | prod_U9fFJL8tra20Hf | price_1TBLuhI5RI2Lzo6Rweb3wat8 | https://buy.stripe.com/00w9AT6jR2lr3FMglw2cg00 |
| Hook Bank Template | prod_U9fFoAAn0dMjKz | price_1TBLuiI5RI2Lzo6RMK95uLAd | https://buy.stripe.com/bJe5kD37F0dj906glw2cg01 |
| UGC Brief Template | prod_U9fFAlE3TxWU98 | price_1TBLujI5RI2Lzo6RqUd68NEh | https://buy.stripe.com/eVq6oHbEbgch2BIc5g2cg02 |
| Creative Audit Checklist | prod_U9fFi5iAD5nV7U | price_1TBLujI5RI2Lzo6R0XPbrzrn | https://buy.stripe.com/14AeVd8rZ6BHfou8T42cg03 |
| Competitor Analysis Framework | prod_U9fFNkEYSsNFPP | price_1TBLukI5RI2Lzo6RLvSqRKse | https://buy.stripe.com/fZu14n4bJe496RYfhs2cg04 |

## Bundle — $99

| Product | Product ID | Price ID | Payment Link |
|---------|-----------|----------|-------------|
| Complete Skill Bundle | prod_U9fF63AVa1RWNc | price_1TBLutI5RI2Lzo6RZ36r8mrR | https://buy.stripe.com/14AaEXeQnd050tA4CO2cg05 |

## Script Desk — 3 tiers

| Product | Product ID | Price ID | Payment Link |
|---------|-----------|----------|-------------|
| Script Desk Starter ($199 / 10 scripts) | prod_U9fFPd3zi3B5vG | price_1TBLuuI5RI2Lzo6RseEEt91d | https://buy.stripe.com/dRm3cvdMj2lrb8e7P02cg06 |
| Script Desk Growth ($299 / 20 scripts) | prod_U9fF8AHBSeMJ61 | price_1TBLuvI5RI2Lzo6RXa2M1CUw | https://buy.stripe.com/6oUaEXbEb0dj906c5g2cg07 |
| Script Desk Scale ($599 / 50 scripts) | prod_U9fFKfDT6E5qIP | price_1TBLuvI5RI2Lzo6RZYZ3u4ra | https://buy.stripe.com/6oU9AT8rZgch3FM0my2cg08 |

## Custom Skill — $20

| Product | Product ID | Price ID | Payment Link |
|---------|-----------|----------|-------------|
| Custom Skill Creation | prod_U9fF5btLj8GXHK | price_1TBLuwI5RI2Lzo6RIi1PbnHk | https://buy.stripe.com/eVq00jbEbf8da4a8T42cg09 |

---

## Payment Link IDs

| Key | Payment Link ID |
|-----|----------------|
| video-script-framework | plink_1TBLv7I5RI2Lzo6RxCxFtMnS |
| hook-bank-template | plink_1TBLv7I5RI2Lzo6R97Se8JBA |
| ugc-brief-template | plink_1TBLv8I5RI2Lzo6RkWmwuMho |
| creative-audit-checklist | plink_1TBLv8I5RI2Lzo6RJ3iiJ8zv |
| competitor-analysis-framework | plink_1TBLv9I5RI2Lzo6RRTs01pQJ |
| skill-bundle | plink_1TBLv9I5RI2Lzo6RNkfCZGVD |
| script-desk-starter | plink_1TBLv9I5RI2Lzo6RlJ5cIx90 |
| script-desk-growth | plink_1TBLvAI5RI2Lzo6RY7BT4dGK |
| script-desk-scale | plink_1TBLvAI5RI2Lzo6R4TC88kRw |
| custom-skill | plink_1TBLvBI5RI2Lzo6RmcYUPuez |

---

## Notes

- All payment links redirect to `/thank-you?product={key}` on completion
- Promotion codes enabled on all payment links
- Webhook endpoint: `/api/webhook` (configure in Stripe Dashboard → Webhooks)
- Webhook secret: set as `STRIPE_WEBHOOK_SECRET` env var in Vercel
- After purchase: subscriber added to Beehiiv pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66 with product tag

---

## Remaining Setup: Vercel Environment Variables

The payment links work immediately with no config needed. For the `/api/create-checkout` and `/api/webhook` serverless functions, add these in Vercel Dashboard → Project Settings → Environment Variables:

```
STRIPE_SECRET_KEY=sk_live_[get from Stripe Dashboard → Developers → API Keys]
STRIPE_WEBHOOK_SECRET=whsec_[get from Stripe Dashboard → Webhooks after creating endpoint]
```

### Webhook Setup in Stripe Dashboard
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://thecreativerecord.com/api/webhook`
4. Events: `checkout.session.completed`
5. Copy the signing secret → paste as `STRIPE_WEBHOOK_SECRET` in Vercel
6. Redeploy Vercel after adding env vars

