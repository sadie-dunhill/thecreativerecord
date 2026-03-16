# The Creative Record — Daily Workflow Checklist

## Morning (8:00 AM)

- [ ] **Check Beehiiv subscriber count**
  - If ≥ 50 subscribers and Issue 01 not sent: Prepare to send
  - If < 50: Continue building subscriber base

- [ ] **Review overnight form submissions**
  - Check for Custom Skill requests
  - Check for Script Desk briefs
  - Respond within 4 hours SLA

- [ ] **Post Tweet 1** (8:00 AM)
  - Content from pre-generated tweets-today.md
  - Use /home/matthewgattozzi/.openclaw/workspace/scripts/post-tweet.py

## Midday (12:00 PM)

- [ ] **Post Tweet 2** (12:00 PM)
  - Content from pre-generated tweets-today.md

## Afternoon (5:00 PM)

- [ ] **Post Tweet 3** (5:00 PM)
  - Content from pre-generated tweets-today.md

- [ ] **Review sales**
  - Check Stripe dashboard for new purchases
  - Verify webhook fired (check Beehiiv for new tagged subscribers)

## Weekly (Mondays)

- [ ] **Weekly content prep**
  - Review blog content calendar
  - Ensure 3 posts scheduled for the week
  - Generate newsletter issue if not already done

- [ ] **Twitter performance review**
  - Run /home/matthewgattozzi/.openclaw/workspace/scripts/tweet-performance.py
  - Append insights to newsletter-ideas.md

## Bi-Weekly

- [ ] **Blog post publishing**
  - Convert markdown to HTML
  - Add to blog/index.html
  - Update sitemap.xml
  - Deploy to Vercel

## Monthly

- [ ] **Revenue review**
  - Stripe dashboard: total revenue, refunds, disputes
  - Product performance: which skills selling best
  - Script Desk: active briefs, completed deliveries

## As Needed

- [ ] **Fulfill Custom Skill orders**
  - Review submitted documents
  - Create skill within 48 hours
  - Deliver via email
  - Log time for capacity planning

- [ ] **Fulfill Script Desk briefs**
  - Review brief within 4 hours
  - Acknowledge receipt
  - Deliver scripts within 72 hours

## Environment Variables to Monitor

Ensure these are set in Vercel:
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] GMAIL_CLIENT_ID
- [ ] GMAIL_CLIENT_SECRET
- [ ] GMAIL_REFRESH_TOKEN
- [ ] SUPABASE_URL (for auth)
- [ ] SUPABASE_SERVICE_ROLE_KEY (for auth)

## Key Metrics to Track

| Metric | Target |
|--------|--------|
| Newsletter subscribers | 50 (Issue 01), then 100, 500 |
| Blog posts published | 3 per week |
| Twitter posts | 3 per day |
| Custom Skills delivered | 48-hour turnaround |
| Script Desk delivered | 72-hour turnaround |
| Revenue | $500/month initial goal |

---

**Last Updated:** March 16, 2026
