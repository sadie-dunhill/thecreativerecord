# Error Monitoring Setup

## Overview

Error monitoring for The Creative Record APIs is implemented via `/api/error-monitor.js`.

## How It Works

1. API endpoints catch errors
2. POST error details to `/api/error-monitor`
3. Error is logged to console
4. Alert email sent to sadie@goodostudios.com (if email configured)

## Usage in API Endpoints

```javascript
try {
  // ... endpoint logic
} catch (err) {
  // Report error
  await fetch('https://thecreativerecord.com/api/error-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: '/api/submit-brief',
      error: err.message,
      context: { brief_id: brief.id },
      timestamp: new Date().toISOString(),
    }),
  });
  
  return res.status(500).json({ error: 'Internal error' });
}
```

## Environment Variables

Same as other email features:
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`

## Status

✅ Endpoint created
⚠️ Requires Gmail OAuth to be configured for email alerts
🔄 Should be added to all API endpoints for full coverage
