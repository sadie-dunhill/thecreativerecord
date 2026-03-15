# Button & Link Audit — The Creative Record
**Date:** March 15, 2026  
**Auditor:** Sadie (automated)  
**Site root:** `/home/matthewgattozzi/.openclaw/workspace/site/thecreativerecord.com/`

---

## Summary

| Category | Count |
|----------|-------|
| Critical issues (must fix before launch) | 28 |
| High priority issues | 12 |
| Medium priority issues | 8 |
| Forms needing backend wiring | 5 |
| Links working correctly | ~90 |

---

## Critical Issues (Must Fix Before Launch)

### A. Buy/Purchase Buttons Going Nowhere (href="#")

Every button that says "Buy" or "Purchase" currently goes `href="#"` — clicks scroll to top and do nothing. These are the most important fixes.

| Page | Line | Element | Current | Should Be | Priority |
|------|------|---------|---------|-----------|----------|
| `skills/index.html` | 500 | "Buy Now" — Video Script Writing System | `href="#"` | Stripe checkout URL for Video Script ($39) | 🔴 CRITICAL |
| `skills/index.html` | 528 | "Buy Now" — Hook Generation Masterclass | `href="#"` | Stripe checkout URL for Hook Bank ($39) | 🔴 CRITICAL |
| `skills/index.html` | 555 | "Buy Now" — Creative Briefing Framework | `href="#"` | Stripe checkout URL for UGC Brief Template ($39) | 🔴 CRITICAL |
| `skills/index.html` | 582 | "Buy Now" — Creative Audit Checklist | `href="#"` | Stripe checkout URL for Creative Audit ($39) | 🔴 CRITICAL |
| `skills/index.html` | 610 | "Buy Now" — Performance Analysis Toolkit | `href="#"` | Stripe checkout URL for Competitor Analysis ($39) | 🔴 CRITICAL |
| `skills/index.html` | 635 | "Buy Bundle — $99" (desktop) | `href="#"` | Stripe checkout URL for Bundle ($99) | 🔴 CRITICAL |
| `skills/index.html` | 641 | "Buy Bundle — $99" (mobile) | `href="#"` | Stripe checkout URL for Bundle ($99) | 🔴 CRITICAL |
| `skills/video-script-framework.html` | 1131 | "Buy Now — $39" (pricing section) | `href="#"` | Stripe checkout URL for Video Script ($39) | 🔴 CRITICAL |
| `skills/hook-bank-template.html` | 486 | "Buy Now — $39" (pricing section) | `href="#"` | Stripe checkout URL for Hook Bank ($39) | 🔴 CRITICAL |
| `skills/ugc-brief-template.html` | 462 | "Buy Now — $39" (pricing section) | `href="#"` | Stripe checkout URL for UGC Brief ($39) | 🔴 CRITICAL |
| `skills/creative-audit-checklist.html` | 404 | "Buy Now — $39" (pricing section) | `href="#"` | Stripe checkout URL for Creative Audit ($39) | 🔴 CRITICAL |
| `skills/competitor-analysis-framework.html` | 454 | "Buy Now — $39" (pricing section) | `href="#"` | Stripe checkout URL for Competitor Analysis ($39) | 🔴 CRITICAL |
| `index.html` | 1079 | "Buy Bundle — $99" | `href="#"` | Stripe checkout URL for Bundle ($99) | 🔴 CRITICAL |
| `subscribe/index.html` | 649 | "Join Annual — $290" | `href="#"` | Stripe checkout URL for Annual Membership ($290) | 🔴 CRITICAL |
| `subscribe/index.html` | 650 | "Join Monthly — $29" | `href="#"` | Stripe checkout URL for Monthly Membership ($29) | 🔴 CRITICAL |

### B. Skill Index "Preview" Buttons Going Nowhere

| Page | Line | Element | Current | Should Be | Priority |
|------|------|---------|---------|-----------|----------|
| `skills/index.html` | 499 | "Preview" — Video Script Writing System | `href="#"` | `/skills/video-script-framework.html` | 🔴 CRITICAL |
| `skills/index.html` | 527 | "Preview" — Hook Generation Masterclass | `href="#"` | `/skills/hook-bank-template.html` | 🔴 CRITICAL |
| `skills/index.html` | 554 | "Preview" — Creative Briefing Framework | `href="#"` | `/skills/ugc-brief-template.html` | 🔴 CRITICAL |
| `skills/index.html` | 581 | "Preview" — Creative Audit Checklist | `href="#"` | `/skills/creative-audit-checklist.html` | 🔴 CRITICAL |
| `skills/index.html` | 609 | "Preview" — Performance Analysis Toolkit | `href="#"` | `/skills/competitor-analysis-framework.html` | 🔴 CRITICAL |

**Note:** The "Buy Now" buttons on skills/index.html *could* also go to the skill detail page + `#pricing` instead of direct Stripe checkout. Either pattern works — pick one and be consistent. Recommendation: "Preview" → detail page, "Buy Now" → Stripe direct.

### C. Account Page: Placeholder Downloads and Notion Links

| Page | Line | Element | Current | Should Be | Priority |
|------|------|---------|---------|-----------|----------|
| `account.html` | 516 | Download button — (first skill) | `href="#"` | Actual download URL (S3 / Gumroad / etc.) | 🔴 CRITICAL |
| `account.html` | 520 | "Notion →" — (first skill) | `href="#"` | Notion share URL for that template | 🔴 CRITICAL |
| `account.html` | 537 | Download button — (second skill) | `href="#"` | Actual download URL | 🔴 CRITICAL |
| `account.html` | 541 | "Notion →" — (second skill) | `href="#"` | Notion share URL | 🔴 CRITICAL |
| `account.html` | 558 | Download button — (third skill) | `href="#"` | Actual download URL | 🔴 CRITICAL |
| `account.html` | 562 | "Notion →" — (third skill) | `href="#"` | Notion share URL | 🔴 CRITICAL |

---

## High Priority Issues

### D. Skill Detail Pages: Footer Privacy/Terms Links Are Broken

All four individual skill pages have `href="#"` for Privacy and Terms in their footer instead of the real URLs. These are legal pages.

| Page | Line | Element | Current | Should Be |
|------|------|---------|---------|-----------|
| `skills/video-script-framework.html` | 1210 | Footer: Privacy | `href="#"` | `/privacy.html` or `/privacy/` |
| `skills/video-script-framework.html` | 1211 | Footer: Terms | `href="#"` | `/terms.html` or `/terms/` |
| `skills/hook-bank-template.html` | 561 | Footer: Privacy | `href="#"` | `/privacy.html` or `/privacy/` |
| `skills/hook-bank-template.html` | 562 | Footer: Terms | `href="#"` | `/terms.html` or `/terms/` |
| `skills/ugc-brief-template.html` | 537 | Footer: Privacy | `href="#"` | `/privacy.html` or `/privacy/` |
| `skills/ugc-brief-template.html` | 538 | Footer: Terms | `href="#"` | `/terms.html` or `/terms/` |
| `skills/creative-audit-checklist.html` | 479 | Footer: Privacy | `href="#"` | `/privacy.html` or `/privacy/` |
| `skills/creative-audit-checklist.html` | 480 | Footer: Terms | `href="#"` | `/terms.html` or `/terms/` |
| `skills/competitor-analysis-framework.html` | 529 | Footer: Privacy | `href="#"` | `/privacy.html` or `/privacy/` |
| `skills/competitor-analysis-framework.html` | 530 | Footer: Terms | `href="#"` | `/terms.html` or `/terms/` |

### E. Homepage Skill Cards Link to /skills/ Instead of Detail Pages

Each skill card on the homepage has a "View Details" button that goes to `/skills/` (the skills index) rather than the individual skill page. User clicks "View Details" on "Video Script Writing System" and lands on a generic skills list instead of the video script page.

| Page | Line | Element | Current | Should Be |
|------|------|---------|---------|-----------|
| `index.html` | 992 | "View Details" — Video Script Writing System | `/skills/` | `/skills/video-script-framework.html` |
| `index.html` | 1009 | "View Details" — Hook Generation Masterclass | `/skills/` | `/skills/hook-bank-template.html` |
| `index.html` | 1026 | "View Details" — Creative Briefing Framework | `/skills/` | `/skills/ugc-brief-template.html` |

### F. URL Inconsistency: .html vs. trailing slash

The site uses two different URL patterns for legal pages and the account page, causing broken links on a static server (or inconsistent experience on a server that doesn't auto-resolve):

- **Pattern A (correct — files exist):** `/privacy.html`, `/terms.html`, `/refund.html`, `/account.html`
- **Pattern B (broken — no directories):** `/privacy/`, `/terms/`, `/refund/`, `/account/`, `/support/`

Files at `/privacy.html`, `/terms.html`, `/refund.html`, `/support.html`, `/account.html` **exist**. Directories `/privacy/`, `/terms/`, `/refund/`, `/account/`, `/support/` do **NOT exist**.

**Pages using broken trailing-slash pattern:**

| Page | Broken Links |
|------|-------------|
| `account.html` | `/privacy/`, `/terms/`, `/refund/`, `/support/`, `/account/` (self-link) |
| `terms.html` | `/privacy/`, `/terms/`, `/refund/` (footer) |
| `privacy.html` | `/privacy/`, `/terms/`, `/refund/` (footer) |
| `refund.html` | `/privacy/`, `/terms/`, `/refund/`, `/account/`, `/support/` |
| `support.html` | `/privacy/`, `/terms/`, `/refund/`, `/account/` |

**Fix options:**
1. Convert all `.html` files to directories with `index.html` inside (e.g., `privacy/index.html`) — cleaner URLs, works everywhere
2. Update all trailing-slash links to `.html` extensions — simpler fix, less elegant
3. Add server-level redirects (Netlify `_redirects` or Vercel `vercel.json`) — works without touching HTML

**Recommendation:** Option 1 (directory structure) is the cleanest long-term. If you're in a hurry before launch, do Option 2 to unblock and convert later.

### G. Account Page: Receipt Links Are Placeholders

| Page | Line | Element | Current | Should Be |
|------|------|---------|---------|-----------|
| `account.html` | 625 | "Receipt" — billing row 1 | `href="#"` | Stripe receipt URL (auto-generated, needs backend) |
| `account.html` | 632 | "Receipt" — billing row 2 | `href="#"` | Stripe receipt URL |
| `account.html` | 639 | "Receipt" — billing row 3 | `href="#"` | Stripe receipt URL |

---

## Medium Priority Issues

### H. Forms With No Backend

These forms show fake success messages but don't actually send data anywhere:

| Page | Form | Current State | Should Wire To |
|------|------|--------------|----------------|
| `index.html` | Homepage newsletter signup | Shows success, logs to console only | Beehiiv API (`pub_7ae1d56e`) — TODO comment on line 1282 |
| `newsletter/index.html` | Newsletter signup (hero + footer) | Shows success, logs to console only | Beehiiv API (`pub_7ae1d56e`) — TODO comment on line 843 |
| `support.html` | Contact form | Shows success, does nothing | Formspree / Netlify Forms / email to `hi@thecreativerecord.com` |
| `affiliates/index.html` | Affiliate application form | Shows success, does nothing | Email to `hi@thecreativerecord.com` or Airtable — TODO comment on line 635 |
| `feedback/index.html` | Creative feedback submission | No `onsubmit` handler at all — form submits to `<form>` with no action, causes page reload | Stripe (paid service) + file upload handler |

**Note:** The `feedback/index.html` form is the most broken — it has no `action` attribute and no JavaScript handler. Clicking "Submit for Feedback — $79" just reloads the page. This is a revenue-impacting bug.

### I. Account Page: Cancel Button Uses alert() Instead of Stripe Portal

| Page | Line | Element | Current | Should Be |
|------|------|---------|---------|-----------|
| `account.html` | 602 | "Cancel" button (subscription) | `onclick="alert('Cancel flow would connect to Stripe billing portal here.')"` | Redirect to Stripe Customer Portal URL |

### J. Thank-You Page: Account Link Uses .html Extension (Inconsistent)

| Page | Line | Element | Current | Should Be |
|------|------|---------|---------|-----------|
| `thank-you.html` | 286 | "Go to Account" button | `/account.html` | `/account/` (once account is a directory) — or stay as `/account.html` consistently |

### K. Skill Detail Pages: Footer Missing Refunds Link

All four individual skill detail pages have Privacy and Terms in the footer but **not Refunds** — while the main site footer and skills/index.html footer include all three.

| Page | Missing |
|------|---------|
| `skills/video-script-framework.html` | Refunds link in footer |
| `skills/hook-bank-template.html` | Refunds link in footer |
| `skills/ugc-brief-template.html` | Refunds link in footer |
| `skills/creative-audit-checklist.html` | Refunds link in footer |
| `skills/competitor-analysis-framework.html` | Refunds link in footer |

### L. skills/index.html and skills/detail pages: Header Nav Missing "Newsletter" and "Affiliates"

The header nav on skills pages only has: Skills, Feedback, About. The footer includes Newsletter and Affiliates. No consistency issue per se, but worth noting the header nav is minimal.

---

## Working Correctly ✓

| Page | Element | Destination |
|------|---------|-------------|
| All pages | Logo link | `/` (homepage) |
| All pages | Nav: Skills | `/skills/` ✓ |
| All pages | Nav: Feedback | `/feedback/` ✓ |
| All pages | Nav: About | `/about/` ✓ |
| All pages | Nav: "Get Access" / "Join" | `/subscribe/` ✓ |
| All pages (footer) | "All Skills" | `/skills/` ✓ |
| All pages (footer) | "Membership" | `/subscribe/` ✓ |
| All pages (footer) | "Feedback" | `/feedback/` ✓ |
| All pages (footer) | "About" | `/about/` ✓ |
| All pages (footer) | "Newsletter" | `/newsletter/` ✓ |
| All pages (footer) | "Affiliates" | `/affiliates/` ✓ |
| All pages (footer) | "Contact" | `mailto:hi@thecreativerecord.com` ✓ |
| `index.html` | "Browse Skills" (hero) | `/skills/` ✓ |
| `index.html` | "Join Membership" (hero) | `/subscribe/` ✓ |
| `index.html` | "View All Five Skills →" | `/skills/` ✓ |
| `index.html` | "Start Membership" | `/subscribe/` ✓ |
| `index.html` | Footer: Privacy | `/privacy.html` ✓ (file exists) |
| `index.html` | Footer: Terms | `/terms.html` ✓ (file exists) |
| `index.html` | Footer: Refunds | `/refund.html` ✓ (file exists) |
| `about/index.html` | "Browse Skills" (header CTA) | `/skills/` ✓ |
| `about/index.html` | "Browse Skills" (body) | `/skills/` ✓ |
| `about/index.html` | "Join Membership" | `/subscribe/` ✓ |
| `subscribe/index.html` | Header "Join Now" | `#pricing` anchor ✓ (anchor exists) |
| `skills/video-script-framework.html` | Hero "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/video-script-framework.html` | Bottom "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/video-script-framework.html` | "Browse All Skills" | `/skills/` ✓ |
| `skills/hook-bank-template.html` | Hero "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/hook-bank-template.html` | Bottom "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/ugc-brief-template.html` | Hero "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/creative-audit-checklist.html` | Hero "Get Access — $39" | `#pricing` anchor ✓ |
| `skills/competitor-analysis-framework.html` | Hero "Get Access — $39" | `#pricing` anchor ✓ |
| `404.html` | "Back to Home" | `/` ✓ |
| `404.html` | "Browse Skills" | `/skills/` ✓ |
| `support.html` | Contact email | `mailto:sadie@goodostudios.com` ✓ |
| `support.html` | "30-day guarantee" | `/refund/` (⚠ trailing slash — see issue F) |
| `privacy.html` | Stripe Privacy Policy | `https://stripe.com/privacy` ✓ |
| `privacy.html` | ConvertKit Privacy Policy | `https://convertkit.com/privacy` ✓ |
| `terms.html` | Stripe Privacy Policy | `https://stripe.com/privacy` ✓ |
| `terms.html` | Refund Policy link | `/refund/` (⚠ trailing slash — see issue F) |
| `thank-you.html` | Twitter/X link | `https://twitter.com/sadie_goodo` ✓ |
| `thank-you.html` | Newsletter link | `/newsletter/` ✓ |
| `thank-you.html` | Skills link | `/skills/` ✓ |
| `affiliates/index.html` | "Apply Now — It's Free" | `#apply` anchor ✓ (section exists) |
| `newsletter/index.html` | "Subscribe to Read More" | `/subscribe/` ✓ |
| `feedback/index.html` | Footer all links | ✓ (correct) |
| `account.html` | "View Skills" (upsell) | `/skills/` ✓ |
| `account.html` | "Get Bundle" (upsell) | `/subscribe/` ✓ |
| `account.html` | "sadie@goodostudios.com" | `mailto:sadie@goodostudios.com` ✓ |

---

## Stripe Integration Needed

When Stripe products are created, these are all the spots that need payment URLs added:

### Individual Skill Purchases ($39 each)

| Product | Stripe Link Needed In |
|---------|----------------------|
| Video Script Writing System | `skills/index.html` line 500 (Buy Now), `skills/video-script-framework.html` line 1131 (Buy Now in pricing), `index.html` line 992 (View Details → could redirect to detail page instead) |
| Hook Generation Masterclass / Hook Bank Template | `skills/index.html` line 528, `skills/hook-bank-template.html` line 486 |
| Creative Briefing Framework / UGC Brief Template | `skills/index.html` line 555, `skills/ugc-brief-template.html` line 462 |
| Creative Audit Checklist | `skills/index.html` line 582, `skills/creative-audit-checklist.html` line 404 |
| Performance Analysis Toolkit / Competitor Analysis Framework | `skills/index.html` line 610, `skills/competitor-analysis-framework.html` line 454 |

### Bundle Purchase ($99)

| Where | Lines |
|-------|-------|
| `skills/index.html` | Lines 635, 641 (two instances — desktop + mobile) |
| `index.html` | Line 1079 |

### Membership Purchases

| Product | Where | Lines |
|---------|-------|-------|
| Annual Membership ($290/yr) | `subscribe/index.html` | Line 649 |
| Monthly Membership ($29/mo) | `subscribe/index.html` | Line 650 |

### Feedback Service (Paid)

| Product | Where |
|---------|-------|
| Hook Review ($49) / Script Triage ($79) / Brief Diagnosis ($99) | `feedback/index.html` form submit button — needs Stripe checkout **and** a file upload mechanism |

### Stripe Customer Portal

| Where | Purpose |
|-------|---------|
| `account.html` line 602 | "Cancel" button — needs Stripe Billing Portal URL |
| `account.html` lines 625, 632, 639 | Receipt links — auto-generated by Stripe, need backend to surface them |

---

## Files That Need Updates

### 🔴 Fix Before Launch (Stripe URLs + Navigation)

| File | Changes Needed |
|------|---------------|
| `skills/index.html` | 1) Replace all 5 "Preview" `href="#"` with skill detail page URLs. 2) Replace all 5 "Buy Now" `href="#"` with Stripe checkout URLs. 3) Replace 2x "Buy Bundle" `href="#"` with Stripe bundle URL. |
| `skills/video-script-framework.html` | Replace `href="#"` on "Buy Now — $39" (line 1131) with Stripe URL. Also fix footer Privacy/Terms `href="#"`. |
| `skills/hook-bank-template.html` | Replace `href="#"` on "Buy Now — $39" (line 486) with Stripe URL. Fix footer Privacy/Terms. |
| `skills/ugc-brief-template.html` | Replace `href="#"` on "Buy Now — $39" (line 462) with Stripe URL. Fix footer Privacy/Terms. |
| `skills/creative-audit-checklist.html` | Replace `href="#"` on "Buy Now — $39" (line 404) with Stripe URL. Fix footer Privacy/Terms. |
| `skills/competitor-analysis-framework.html` | Replace `href="#"` on "Buy Now — $39" (line 454) with Stripe URL. Fix footer Privacy/Terms. |
| `index.html` | 1) Replace "Buy Bundle" `href="#"` (line 1079) with Stripe bundle URL. 2) Update "View Details" buttons on skill cards to link to individual skill pages. |
| `subscribe/index.html` | Replace "Join Annual" and "Join Monthly" `href="#"` with Stripe checkout URLs. |
| `feedback/index.html` | Add `action`, `onsubmit`, or Stripe payment link to submission form. This is currently completely broken. |

### 🟡 Fix URL Inconsistency (Trailing Slash vs .html)

**Pick a pattern and standardize.** Current state: half the site uses `.html`, half uses trailing slash (`/`). Both cannot work without directory restructuring or server redirects.

**Option A — Convert to directories (recommended):**
```
account.html      → account/index.html
privacy.html      → privacy/index.html
terms.html        → terms/index.html
refund.html       → refund/index.html
support.html      → support/index.html
thank-you.html    → thank-you/index.html
coming-soon.html  → coming-soon/index.html
404.html          → stays at root (404.html — server config)
```
Then update all `href="/account.html"` references across site.

**Option B — Update all trailing-slash links to .html:**

Files to edit (change `/privacy/` → `/privacy.html`, etc.):
- `account.html` (multiple lines)
- `terms.html` (footer)
- `privacy.html` (footer)
- `refund.html` (multiple lines)
- `support.html` (multiple lines)

### 🟡 Wire Up Forms

| File | What to Add |
|------|------------|
| `index.html` | Wire newsletter signup to Beehiiv API (`pub_7ae1d56e`) — see TODO on line 1282 |
| `newsletter/index.html` | Wire both signup forms to Beehiiv API — see TODO on line 843 |
| `support.html` | Wire contact form to Formspree / Netlify Forms / email backend |
| `affiliates/index.html` | Wire affiliate application to email or Airtable — see TODO on line 635 |
| `feedback/index.html` | Add complete form handler: Stripe payment first, then file upload + submission |

### 🟡 Account Page (Post-Launch — Needs Backend)

| File | Changes Needed |
|------|---------------|
| `account.html` | 1) Replace 3x download `href="#"` with real download URLs (per-user, fetched from backend after auth). 2) Replace 3x Notion `href="#"` with Notion share URLs for each template. 3) Replace Cancel button `onclick="alert(...)"` with Stripe Customer Portal URL. 4) Replace 3x Receipt `href="#"` with Stripe-generated receipt URLs. |

---

## Quick-Fix Reference Table

For the fastest path to "launch-ready," here's just the href changes with exact values:

```
skills/index.html — Preview buttons (href="#" → detail pages):
  Line 499: href="/skills/video-script-framework.html"
  Line 527: href="/skills/hook-bank-template.html"
  Line 554: href="/skills/ugc-brief-template.html"
  Line 581: href="/skills/creative-audit-checklist.html"
  Line 609: href="/skills/competitor-analysis-framework.html"

skills/index.html — Buy Now buttons (href="#" → Stripe URLs, fill in when created):
  Line 500: href="https://buy.stripe.com/[VIDEO_SCRIPT_LINK]"
  Line 528: href="https://buy.stripe.com/[HOOK_BANK_LINK]"
  Line 555: href="https://buy.stripe.com/[UGC_BRIEF_LINK]"
  Line 582: href="https://buy.stripe.com/[CREATIVE_AUDIT_LINK]"
  Line 610: href="https://buy.stripe.com/[COMPETITOR_ANALYSIS_LINK]"
  Line 635: href="https://buy.stripe.com/[BUNDLE_LINK]"
  Line 641: href="https://buy.stripe.com/[BUNDLE_LINK]"

skills/video-script-framework.html:
  Line 1131: href="https://buy.stripe.com/[VIDEO_SCRIPT_LINK]"
  Line 1210: href="/privacy.html"
  Line 1211: href="/terms.html"

skills/hook-bank-template.html:
  Line 486:  href="https://buy.stripe.com/[HOOK_BANK_LINK]"
  Line 561:  href="/privacy.html"
  Line 562:  href="/terms.html"

skills/ugc-brief-template.html:
  Line 462:  href="https://buy.stripe.com/[UGC_BRIEF_LINK]"
  Line 537:  href="/privacy.html"
  Line 538:  href="/terms.html"

skills/creative-audit-checklist.html:
  Line 404:  href="https://buy.stripe.com/[CREATIVE_AUDIT_LINK]"
  Line 479:  href="/privacy.html"
  Line 480:  href="/terms.html"

skills/competitor-analysis-framework.html:
  Line 454:  href="https://buy.stripe.com/[COMPETITOR_ANALYSIS_LINK]"
  Line 529:  href="/privacy.html"
  Line 530:  href="/terms.html"

index.html:
  Line 992:  href="/skills/video-script-framework.html"   (View Details)
  Line 1009: href="/skills/hook-bank-template.html"        (View Details)
  Line 1026: href="/skills/ugc-brief-template.html"        (View Details)
  Line 1079: href="https://buy.stripe.com/[BUNDLE_LINK]"

subscribe/index.html:
  Line 649:  href="https://buy.stripe.com/[ANNUAL_MEMBERSHIP_LINK]"
  Line 650:  href="https://buy.stripe.com/[MONTHLY_MEMBERSHIP_LINK]"
```

---

## Additional Observations

1. **Email inconsistency:** Support contact email is `sadie@goodostudios.com` on some pages, `hi@thecreativerecord.com` on others. Decide on one canonical support email. `hi@thecreativerecord.com` is more on-brand for the product; `sadie@goodostudios.com` reveals the agency. Recommend standardizing to `hi@thecreativerecord.com` for all customer-facing pages.

2. **Twitter link:** `thank-you.html` links to `https://twitter.com/sadie_goodo`. Consider updating to `https://x.com/sadie_goodo` for current branding, though both redirect.

3. **Newsletter page footer:** Missing the Refunds link (affiliates, about, feedback all have it; newsletter/index.html footer only has Privacy + Terms).

4. **"Performance Analysis Toolkit" vs. "Competitor Analysis Framework":** The skill card on `skills/index.html` calls it "Performance Analysis Toolkit" but the actual file is `competitor-analysis-framework.html` and the page title is "Competitor Analysis Framework." Name mismatch worth resolving before launch.

5. **`account.html` sidebar nav:** Line 484 links the "Skills" sidebar item to `/skills/` with a style attribute directly — it works, but is implemented differently than all other nav items. Low priority.

---

*Generated by Sadie — March 15, 2026*
