// /api/webhook.js - Stripe webhook handler with Postmark email integration
// Receives checkout.session.completed events and sends product delivery emails

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
const POSTMARK_FROM = process.env.POSTMARK_FROM_EMAIL || 'sadie@thecreativerecord.com';

// Product mapping for email content
const PRODUCT_EMAILS = {
  'prod_U9fFJL8tra20Hf': {
    name: 'Video Script Framework',
    subject: 'Your Video Script Framework is ready'
  },
  'prod_U9fFoAAn0dMjKz': {
    name: 'Hook Bank Template', 
    subject: 'Your Hook Bank Template is ready'
  },
  'prod_U9fFAlE3TxWU98': {
    name: 'UGC Brief Template',
    subject: 'Your UGC Brief Template is ready'
  },
  'prod_U9fFi5iAD5nV7U': {
    name: 'Creative Audit Checklist',
    subject: 'Your Creative Audit Checklist is ready'
  },
  'prod_U9fFNkEYSsNFPP': {
    name: 'Competitor Analysis Framework',
    subject: 'Your Competitor Analysis Framework is ready'
  },
  'prod_U9fF63AVa1RWNc': {
    name: 'Complete Skill Bundle',
    subject: 'Your Complete Skill Bundle is ready'
  },
  'prod_U9fFPd3zi3B5vG': {
    name: 'Script Desk Starter',
    service: true,
    subject: 'Welcome to Script Desk'
  },
  'prod_U9fF8AHBSeMJ61': {
    name: 'Script Desk Growth',
    service: true,
    subject: 'Welcome to Script Desk'
  },
  'prod_U9fFKfDT6E5qIP': {
    name: 'Script Desk Scale',
    service: true,
    subject: 'Welcome to Script Desk'
  },
  'prod_U9fF5btLj8GXHK': {
    name: 'Custom Skill Creation',
    service: true,
    subject: 'Your Custom Skill request received'
  }
};

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the Stripe signature from headers
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    console.log('No Stripe signature');
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {
    const event = req.body;
    
    // Handle checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name?.split(' ')[0] || 'there';
      
      if (!customerEmail) {
        console.log('No customer email in session');
        return res.status(200).json({ received: true, warning: 'No customer email' });
      }

      // Get product from line items
      const lineItems = session.line_items?.data || [];
      if (lineItems.length === 0) {
        console.log('No line items');
        return res.status(200).json({ received: true, warning: 'No line items' });
      }

      const productId = lineItems[0].price?.product;
      const product = PRODUCT_EMAILS[productId];

      if (!product) {
        console.log('Unknown product:', productId);
        return res.status(200).json({ received: true, warning: 'Unknown product' });
      }

      // Send email via Postmark
      await sendProductEmail(customerEmail, customerName, product);
      
      // Also add to Beehiiv (existing logic)
      await addToBeehiiv(customerEmail, productId);
      
      console.log('Email sent to:', customerEmail, 'for product:', product.name);
      
      return res.status(200).json({ 
        received: true, 
        emailSent: true,
        product: product.name 
      });
    }

    // Acknowledge other events
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Stripe retries
    return res.status(200).json({ 
      received: true, 
      error: error.message 
    });
  }
}

async function sendProductEmail(toEmail, customerName, product) {
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.subject}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0f0e0d; background: #faf8f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        .logo { text-align: center; margin-bottom: 30px; }
        h1 { color: #0f0e0d; font-size: 24px; margin-bottom: 20px; }
        .button { display: inline-block; background: #c8552a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h2 style="margin: 0; color: #0f0e0d;">The Creative Record</h2>
        </div>
        
        <h1>Hey ${customerName},</h1>
        
        <p>Thanks for purchasing <strong>${product.name}</strong>. Your product is ready.</p>
        
        <p style="text-align: center;">
            <a href="https://thecreativerecord.com/account" class="button">Access Your Product</a>
        </p>
        
        <p>You'll need to log in with the email you used for purchase. If you don't have an account yet, create one with the same email and your purchase will be linked automatically.</p>
        
        <p>Questions? Just reply to this email.</p>
        
        <div class="footer">
            <p>— Sadie<br>
            The Creative Record</p>
        </div>
    </div>
</body>
</html>`;

  const textBody = `Hey ${customerName},

Thanks for purchasing ${product.name}. Your product is ready.

Access it here: https://thecreativerecord.com/account

You'll need to log in with the email you used for purchase. If you don't have an account yet, create one with the same email and your purchase will be linked automatically.

Questions? Just reply to this email.

— Sadie
The Creative Record`;

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_API_KEY
    },
    body: JSON.stringify({
      From: POSTMARK_FROM,
      To: toEmail,
      Subject: product.subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: 'outbound'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark error: ${error}`);
  }

  return response.json();
}

async function addToBeehiiv(email, productId) {
  // Existing Beehiiv integration
  const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
  const BEEHIIV_PUBLICATION_ID = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';
  
  if (!BEEHIIV_API_KEY) {
    console.log('Beehiiv not configured');
    return;
  }

  const productNames = {
    'prod_U9fFJL8tra20Hf': 'video-script-framework',
    'prod_U9fFoAAn0dMjKz': 'hook-bank-template',
    'prod_U9fFAlE3TxWU98': 'ugc-brief-template',
    'prod_U9fFi5iAD5nV7U': 'creative-audit-checklist',
    'prod_U9fFNkEYSsNFPP': 'competitor-analysis-framework',
    'prod_U9fF63AVa1RWNc': 'skill-bundle',
    'prod_U9fFPd3zi3B5vG': 'script-desk',
    'prod_U9fF8AHBSeMJ61': 'script-desk',
    'prod_U9fFKfDT6E5qIP': 'script-desk',
    'prod_U9fF5btLj8GXHK': 'custom-skill'
  };

  const tag = productNames[productId] || 'purchase';

  try {
    await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        tags: [tag],
        reactivate_existing: true
      })
    });
  } catch (error) {
    console.error('Beehiiv error:', error);
    // Don't throw - email is more important
  }
}
