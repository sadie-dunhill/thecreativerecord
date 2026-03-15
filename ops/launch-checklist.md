# Launch Checklist

**Project:** The Creative Record  
**Purpose:** Master checklist for go-live  
**Last Updated:** March 2026

---

## Pre-Launch Phase (T-2 Weeks)

### Domain & Infrastructure

- [ ] **Domain purchased and configured**
  - [ ] thecreativerecord.com registered
  - [ ] DNS pointing to Vercel
  - [ ] SSL certificate active (automatic)
  - [ ] www redirect configured
  - [ ] Test: `https://thecreativerecord.com` loads

- [ ] **Hosting setup complete**
  - [ ] Vercel project created
  - [ ] GitHub repo connected
  - [ ] Environment variables configured
  - [ ] Production deployment successful
  - [ ] Custom domain connected

### Product Assets

- [ ] **All skill files finalized and proofread**
  - [ ] Skill 1: [NAME] - final PDF
  - [ ] Skill 2: [NAME] - final PDF
  - [ ] Skill 3: [NAME] - final PDF
  - [ ] Skill 4: [NAME] - final PDF
  - [ ] Skill 5: [NAME] - final PDF
  - [ ] All files proofread (spelling/grammar)
  - [ ] All files properly formatted/design final
  - [ ] File sizes optimized (< 50MB each)
  - [ ] Files uploaded to storage (R2/S3)

### Website & Design

- [ ] **Landing pages tested on mobile**
  - [ ] Homepage loads correctly
  - [ ] Skills page renders properly
  - [ ] Pricing page displays correctly
  - [ ] About page looks good
  - [ ] Contact form works
  - [ ] Navigation hamburger menu functional
  - [ ] Text readable (font sizes appropriate)
  - [ ] Images load and display correctly
  - [ ] No horizontal scrolling issues

- [ ] **Landing pages tested on desktop**
  - [ ] All pages render at 1920x1080
  - [ ] All pages render at 1440x900
  - [ ] All pages render at 1366x768
  - [ ] Navigation works as expected
  - [ ] No layout breaks
  - [ ] CTAs prominently displayed

- [ ] **Cross-browser testing**
  - [ ] Chrome (latest)
  - [ ] Safari (latest)
  - [ ] Firefox (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

---

## Payment Setup (T-10 Days)

### Stripe Configuration

- [ ] **Stripe account created and verified**
  - [ ] Account created at stripe.com
  - [ ] Email verified
  - [ ] Business details submitted
  - [ ] Bank account connected
  - [ ] Identity verification complete

- [ ] **Products added to Stripe**
  - [ ] Individual Skill ($39) - Product + Price ID
  - [ ] Skill Bundle ($99) - Product + Price ID
  - [ ] Monthly Membership ($29/mo) - Product + Price ID
  - [ ] Annual Membership ($290/yr) - Product + Price ID
  - [ ] Micro-Feedback $49 - Product + Price ID
  - [ ] Micro-Feedback $99 - Product + Price ID

- [ ] **Stripe webhook configured**
  - [ ] Webhook endpoint: `https://thecreativerecord.com/api/webhooks/stripe`
  - [ ] Events selected:
    - [ ] `checkout.session.completed`
    - [ ] `invoice.payment_succeeded`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.deleted`
  - [ ] Webhook secret copied to env vars
  - [ ] Webhook signing verified

- [ ] **Payment flow tested (test mode)**
  - [ ] Test card payment succeeds (4242 4242 4242 4242)
  - [ ] Declined card handled (4000 0000 0000 0002)
  - [ ] 3D Secure works (4000 0025 0000 3155)
  - [ ] Success page displays correctly
  - [ ] Webhook fires and processes
  - [ ] Email confirmation sent
  - [ ] Download link delivered

- [ ] **Stripe Live Mode checklist**
  - [ ] Switch to Live mode
  - [ ] Create live products
  - [ ] Update env vars with live keys
  - [ ] Test one real purchase (then refund)
  - [ ] Configure Stripe email receipts
  - [ ] Set up Stripe Tax (if applicable)

---

## Email & Marketing (T-7 Days)

### Email Service Setup

- [ ] **Email sequences written and loaded**
  - [ ] Welcome sequence (5 emails) written
  - [ ] Post-purchase delivery email written
  - [ ] Follow-up sequence for buyers (3 emails) written
  - [ ] Abandoned cart email (if using) written
  - [ ] All emails proofread and formatted
  - [ ] Emails loaded into ConvertKit
  - [ ] Automation triggers configured

- [ ] **ConvertKit setup**
  - [ ] Account created
  - [ ] Opt-in forms created
  - [ ] Sequences/automations built
  - [ ] Integrations connected (Stripe)
  - [ ] Sender domain authenticated
  - [ ] Test emails sent and received

### Lead Magnets

- [ ] **Free content ready**
  - [ ] Lead magnet created (if using)
  - [ ] Landing page for lead magnet
  - [ ] Delivery automation configured
  - [ ] Test signup + delivery flow

---

## Download/Delivery System (T-5 Days)

- [ ] **Download system working**
  - [ ] Files stored in Cloudflare R2 (or chosen storage)
  - [ ] JWT token generation working
  - [ ] Download page created and styled
  - [ ] Expiring links generate correctly
  - [ ] Link expiry works (test with 1-minute expiry)
  - [ ] Email template for downloads created
  - [ ] Full purchase → email → download flow tested

- [ ] **Resend capability**
  - [ ] Support form for expired links created
  - [ ] Manual resend process documented
  - [ ] Support email monitored

---

## Analytics & Tracking (T-3 Days)

- [ ] **Analytics installed**
  - [ ] Google Analytics 4 property created
  - [ ] GA4 tracking ID added to site
  - [ ] Conversion events configured (purchase, signup)
  - [ ] E-commerce tracking enabled
  - [ ] Test events firing in GA4 Real-time
  - [ ] Plausible installed (optional)
  - [ ] Search Console property verified
  - [ ] Sitemap submitted to Search Console

- [ ] **Additional tracking**
  - [ ] Meta Pixel (if running Facebook/Instagram ads)
  - [ ] Twitter Pixel (if running Twitter ads)
  - [ ] UTM parameters documented for campaigns

---

## Beta Testing (T-2 Days)

### Recruit Beta Customers

- [ ] **Beta customers recruited (10 people)**
  - [ ] Beta tester #1 recruited
  - [ ] Beta tester #2 recruited
  - [ ] Beta tester #3 recruited
  - [ ] Beta tester #4 recruited
  - [ ] Beta tester #5 recruited
  - [ ] Beta tester #6 recruited
  - [ ] Beta tester #7 recruited
  - [ ] Beta tester #8 recruited
  - [ ] Beta tester #9 recruited
  - [ ] Beta tester #10 recruited

- [ ] **Beta instructions sent**
  - [ ] Clear instructions provided
  - [ ] Feedback form/link provided
  - [ ] Test scenarios outlined
  - [ ] Free/discounted access granted

### Beta Feedback Collection

- [ ] **Feedback areas**
  - [ ] Purchase flow clarity
  - [ ] Download experience
  - [ ] File quality and usefulness
  - [ ] Website usability
  - [ ] Any bugs or errors
  - [ ] Overall satisfaction (1-10)

---

## Social & Content (T-1 Day)

- [ ] **Social media accounts ready**
  - [ ] Twitter/X account created (@creativerecord)
  - [ ] Instagram account created
  - [ ] LinkedIn page created (optional)
  - [ ] Profile bios written
  - [ ] Profile images uploaded
  - [ ] Link in bio set to website

- [ ] **Launch content prepared**
  - [ ] Launch post written (Twitter/X)
  - [ ] Launch post written (Instagram)
  - [ ] Launch email written to list
  - [ ] Launch graphic/image created
  - [ ] Launch discount code configured (25% off)
  - [ ] Launch timeline scheduled

---

## Launch Day

### Morning Checklist

- [ ] **Final verification**
  - [ ] Production site loads correctly
  - [ ] Stripe in Live mode
  - [ ] All environment variables live
  - [ ] Test purchase with real card (then refund)
  - [ ] Email delivery working
  - [ ] Download links generating
  - [ ] Analytics receiving data

### Launch Execution

- [ ] **Soft launch (first)**
  - [ ] Launch to beta group only
  - [ ] Collect initial feedback
  - [ ] Fix any immediate issues
  - [ ] Wait 24-48 hours

- [ ] **Public launch**
  - [ ] Launch post published
  - [ ] Social posts live
  - [ ] Email sent to list
  - [ ] Discount code active
  - [ ] Monitoring dashboards open
  - [ ] Support channels active

---

## Post-Launch (Week 1)

### Monitoring

- [ ] **Daily checks**
  - [ ] Stripe dashboard for sales
  - [ ] Vercel analytics for traffic
  - [ ] Email deliverability rates
  - [ ] Support requests
  - [ ] Social mentions

### Immediate Fixes

- [ ] **Issue resolution**
  - [ ] Any bugs reported by customers fixed
  - [ ] Any confusion points clarified
  - [ ] FAQ updated based on questions

---

## Launch Discount Period (Week 1)

- [ ] **25% off launch discount active**
  - [ ] Discount code working in Stripe
  - [ ] Promoted on all channels
  - [ ] Expiration date set
  - [ ] Reminder emails scheduled

---

## Post-Launch Phase (Month 1)

### Week 2-4 Checklist

- [ ] **Customer feedback reviewed**
  - [ ] NPS or satisfaction survey sent
  - [ ] Testimonials collected
  - [ ] Case studies identified

- [ ] **Performance analysis**
  - [ ] Conversion rate calculated
  - [ ] Traffic sources analyzed
  - [ ] Best-selling product identified
  - [ ] Drop-off points identified

- [ ] **Content & marketing**
  - [ ] First regular newsletter sent
  - [ ] Social content calendar running
  - [ ] Blog posts published (if applicable)

- [ ] **System improvements**
  - [ ] Any technical debt addressed
  - [ ] Automation improved
  - [ ] Documentation updated

---

## Documentation & Handoff

- [ ] **Runbooks created**
  - [ ] How to process refunds
  - [ ] How to resend downloads
  - [ ] How to update pricing
  - [ ] How to add new products
  - [ ] How to check analytics

- [ ] **Emergency contacts**
  - [ ] Stripe support bookmarked
  - [ ] Vercel support bookmarked
  - [ ] ConvertKit support bookmarked
  - [ ] Domain registrar login saved

---

## Final Sign-Off

**Before public launch, confirm:**

- [ ] All checkboxes above are checked
- [ ] Beta feedback incorporated
- [ ] At least 5 successful test purchases completed
- [ ] Support system ready
- [ ] You feel confident

**Launch date set:** ___/___/______

**Soft launch completed:** ___/___/______

**Public launch date:** ___/___/______

---

*Last updated: March 2026*
