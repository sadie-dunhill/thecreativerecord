# File Delivery System

**Project:** The Creative Record  
**Purpose:** Determine how customers receive purchased files  
**Last Updated:** March 2026

---

## The Problem

After a customer completes a purchase, they need to receive:
- Their purchased skill(s) as downloadable files
- Clear instructions on how to use them
- Ability to access files if they lose the email

The delivery system must be:
- **Secure:** Only paying customers get access
- **Reliable:** Files always deliver successfully  
- **User-friendly:** One-click download, no confusion
- **Cost-effective:** Minimal ongoing fees
- **Scalable:** Works for 10 customers or 10,000

---

## Option A: Stripe Checkout → Expiring Download Link

**How it works:**
1. Customer completes Stripe checkout
2. Stripe webhook sends event to your server
3. Server generates signed JWT containing file URL + expiry timestamp
4. Email sent to customer with unique download link
5. Customer clicks link → server verifies JWT → serves file
6. Link expires after 72 hours

**Technical Implementation:**

```typescript
// /api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const event = await verifyStripeWebhook(request);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;
    const productId = session.metadata.product_id;
    
    // Generate expiring download token
    const token = jwt.sign(
      { 
        productId, 
        email: customerEmail,
        iat: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn: '72h' }
    );
    
    // Send email with download link
    await sendEmail({
      to: customerEmail,
      subject: 'Your Creative Record download is ready',
      html: `
        <h1>Thanks for your purchase!</h1>
        <p>Your download link (expires in 72 hours):</p>
        <a href="https://thecreativerecord.com/download?token=${token}">
          Download Your Files
        </a>
      `
    });
  }
  
  return NextResponse.json({ received: true });
}
```

```typescript
// /app/download/page.tsx
import { verify } from 'jsonwebtoken';

export default async function DownloadPage({ searchParams }) {
  const { token } = searchParams;
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET) as { productId: string };
    
    return (
      <div>
        <h1>Download Your Files</h1>
        <a href={`/api/files/${decoded.productId}`} download>
          Click to Download
        </a>
        <p>This link expires in 72 hours. Save your files now.</p>
      </div>
    );
  } catch {
    return <div>Link expired or invalid. Contact support.</div>;
  }
}
```

**File Storage Options:**

| Option | Cost | Best For |
|--------|------|----------|
| Vercel Blob | Free (250MB), then $0.15/GB | Small files, simple setup |
| Cloudflare R2 | Free (10GB/mo), then $0.015/GB | Larger files, generous free tier |
| AWS S3 | ~$0.023/GB | Enterprise needs |
| BunnyCDN | $0.01/GB, no minimum | High bandwidth, global CDN |

**Recommended:** Cloudflare R2 (free tier covers launch, cheap after)

---

**Pros:**
- ✅ No monthly fees (just storage costs)
- ✅ Full control over branding
- ✅ Links expire (security)
- ✅ Can customize expiry time per product
- ✅ Simple implementation (~100 lines of code)
- ✅ Can add re-download portal later

**Cons:**
- ❌ Customer must download within 72 hours
- ❌ You build it
- ❌ No "customer library" experience
- ❌ Need to handle email deliverability

---

## Option B: Email Delivery with Secure Link

**How it works:**
1. Same as Option A (Stripe webhook triggers)
2. Email contains download button/link
3. Link authenticates customer on click
4. File downloads directly or streams to browser

**Same implementation as Option A**, just emphasizing the email aspect.

**Key difference:** Email is the primary interface, not a web page.

**Email Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .button { 
      background: #000; 
      color: #fff; 
      padding: 15px 30px; 
      text-decoration: none;
      display: inline-block;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h2>Your Creative Record purchase is ready</h2>
  
  <p>Hi {{customer_name}},</p>
  
  <p>Thanks for purchasing <strong>{{product_name}}</strong>!</p>
  
  <p>Click below to download your files:</p>
  
  <a href="{{download_url}}" class="button">Download Now</a>
  
  <p style="color: #666; font-size: 14px;">
    This link expires in 72 hours. Need help? Reply to this email.
  </p>
  
  <hr>
  
  <p style="font-size: 12px; color: #999;">
    The Creative Record | thecreativerecord.com
  </p>
</body>
</html>
```

**Pros:**
- ✅ Same as Option A
- ✅ Email is familiar interface for customers
- ✅ Receipt + download in one place

**Cons:**
- ❌ Same as Option A
- ❌ Email deliverability issues can block access

---

## Option C: Customer Portal (Login Required)

**How it works:**
1. Customer creates account during checkout (or checkout creates account)
2. Customer logs in to dashboard
3. Dashboard shows all purchased products
4. Click product → download files
5. Can re-download anytime

**Technical Implementation:**

```typescript
// Requires: Auth library (Clerk, Auth0, or NextAuth)

// /app/dashboard/page.tsx
import { auth } from '@clerk/nextjs';

export default async function Dashboard() {
  const { userId } = auth();
  
  // Fetch user's purchases from database
  const purchases = await db.purchases.findMany({
    where: { userId },
    include: { product: true }
  });
  
  return (
    <div>
      <h1>Your Library</h1>
      {purchases.map(purchase => (
        <div key={purchase.id}>
          <h3>{purchase.product.name}</h3>
          <a href={`/api/download/${purchase.product.id}`} download>
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
```

**Database Schema:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  product_id TEXT,
  stripe_session_id TEXT,
  purchased_at TIMESTAMP
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT,
  file_url TEXT,
  price INTEGER
);
```

**Pros:**
- ✅ Customer can re-download anytime
- ✅ Builds ongoing relationship
- ✅ Foundation for membership features
- ✅ Can add progress tracking later
- ✅ Feels more "premium"

**Cons:**
- ❌ Complex to build (auth + database + UI)
- ❌ Adds friction (must create account)
- ❌ Ongoing database costs (Supabase free tier: 500MB)
- ❌ More code to maintain
- ❌ Overkill for simple digital products

---

## Option D: Hybrid Approach (Recommended for MVP)

**How it works:**
1. Start with Option A (expiring links via email)
2. Add simple "resend download link" feature
3. Later, upgrade to portal if needed

**Resend Feature:**
```typescript
// /api/resend-download/route.ts
export async function POST(request: Request) {
  const { email } = await request.json();
  
  // Look up recent purchases by email
  const purchases = await stripe.checkout.sessions.list({
    customer_details: { email }
  });
  
  // Generate new tokens for each purchase
  for (const purchase of purchases.data) {
    const token = generateNewToken(purchase);
    await sendEmail({ to: email, token });
  }
  
  return NextResponse.json({ sent: true });
}
```

**Pros:**
- ✅ Start simple
- ✅ Can evolve over time
- ✅ No database needed initially
- ✅ Can validate demand before building portal

---

## Comparison Matrix

| Factor | Option A (Links) | Option B (Email) | Option C (Portal) | Option D (Hybrid) |
|--------|------------------|------------------|-------------------|-------------------|
| **Build Time** | 2-4 hours | 2-4 hours | 1-2 days | 4-6 hours |
| **Monthly Cost** | $0 | $0 | $0-25 | $0 |
| **Customer Friction** | Low | Low | Medium | Low |
| **Re-downloads** | Via support | Via support | Self-serve | Via email resend |
| **Scalability** | High | High | High | High |
| **Maintenance** | Low | Low | Medium | Low |
| **Brand Control** | Full | Full | Full | Full |

---

## Recommendation: Option A (Simple Expiring Links)

**For The Creative Record MVP:**

1. **Implement Option A** with Cloudflare R2 for file storage
2. **72-hour expiry** is reasonable (customers buy to use immediately)
3. **Add resend capability** via simple support form
4. **Build portal later** if monthly recurring membership grows

**Why not Option C (Portal)?**
- Most customers download immediately and never need again
- Portal adds friction to first purchase
- Can always add later without changing purchase flow
- Digital products = one-time use, not library building

**Why not Option B (Email-only)?**
- Same as A, but web page gives opportunity to upsell/support
- Web page can include getting-started guide

---

## Implementation Checklist

### Option A (Recommended) Setup:

- [ ] Create Cloudflare R2 bucket
- [ ] Upload skill files to R2
- [ ] Set up R2 public access (or presigned URLs)
- [ ] Install dependencies: `npm install jsonwebtoken`
- [ ] Create `/api/webhooks/stripe` endpoint
- [ ] Create `/app/download` page
- [ ] Create email template for download
- [ ] Test full flow with Stripe test mode
- [ ] Add support contact for expired links

### Files to Create:

```
app/
├── api/
│   ├── webhooks/
│   │   └── stripe/
│   │       └── route.ts      # Webhook handler
│   └── files/
│       └── [productId]/
│           └── route.ts       # Secure file serving
├── download/
│   └── page.tsx               # Download UI
└── support/
    └── resend/
        └── page.tsx           # Resend link form

lib/
├── email.ts                   # Email sending
├── jwt.ts                     # Token generation/verification
└── files.ts                   # File storage helpers
```

---

## Post-MVP Evolution Path

**Phase 1 (Launch):** Simple expiring links
**Phase 2 (50+ customers):** Add automated resend form
**Phase 3 (Membership launches):** Build customer portal with auth
**Phase 4 (Scale):** Consider dedicated digital delivery platform (SendOwl, Podia)

---

## Security Considerations

1. **JWT Secret:** Use 32+ character random string, store in env vars
2. **File URLs:** Don't expose direct R2/S3 URLs, always proxy through API
3. **Rate Limiting:** Limit download attempts per IP
4. **HTTPS Only:** Never serve downloads over HTTP
5. **File Validation:** Verify file exists before generating token
6. **Email Verification:** Consider verifying email before first download

---

*Last updated: March 2026*
