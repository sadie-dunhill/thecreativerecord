# The Creative Record — Agent Integration Examples

**Version:** 1.0  
**Last Updated:** March 2026  
**Audience:** OpenClaw agents, developers, AI assistants

---

## Overview

These examples show how an OpenClaw agent (or any HTTP client) can discover, preview, purchase, and download skills from The Creative Record. Copy and adapt.

**Base URL:** `https://thecreativerecord.com/api`  
**Authentication:** `x-api-key` header (browse key for discovery, download key for files)

---

## Getting a Browse Key

Browse keys are free. Email `api@thecreativerecord.com` with the subject line "Browse Key Request" and get one within 24 hours. No payment required.

Once you have it, set it in your environment or TOOLS.md:

```bash
export TCR_BROWSE_KEY=tcr_browse_your_key_here
```

---

## curl Examples

### Health Check (No Auth)

```bash
curl https://thecreativerecord.com/api/health
```

```json
{"status": "ok", "version": "1.0"}
```

---

### List All Skills

```bash
curl -H "x-api-key: $TCR_BROWSE_KEY" \
  https://thecreativerecord.com/api/skills
```

---

### Filter by Tag

```bash
curl -H "x-api-key: $TCR_BROWSE_KEY" \
  "https://thecreativerecord.com/api/skills?tag=video"
```

---

### Get Skill Detail (with Preview)

```bash
curl -H "x-api-key: $TCR_BROWSE_KEY" \
  https://thecreativerecord.com/api/skills/video-script-framework
```

---

### Get Bundle Info

```bash
curl -H "x-api-key: $TCR_BROWSE_KEY" \
  https://thecreativerecord.com/api/bundle
```

---

### Verify a Download Key

```bash
curl -H "x-api-key: $TCR_DOWNLOAD_KEY" \
  https://thecreativerecord.com/api/key/verify
```

---

### Download a Skill (JSON Format -- Content Embedded)

```bash
curl -H "x-api-key: $TCR_DOWNLOAD_KEY" \
  "https://thecreativerecord.com/api/download/video-script-framework" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['content'])"
```

---

### Download a Skill (Raw Markdown File)

```bash
curl -H "x-api-key: $TCR_DOWNLOAD_KEY" \
  "https://thecreativerecord.com/api/download/video-script-framework?format=raw" \
  -o video-script-framework.md
```

---

### Download All Bundle Skills at Once

```bash
TCR_DOWNLOAD_KEY=tcr_dl_your_bundle_key

SKILLS=(
  "video-script-framework"
  "hook-bank-template"
  "ugc-brief-template"
  "creative-audit-checklist"
  "competitor-analysis-framework"
)

mkdir -p ~/creative-record-skills

for skill in "${SKILLS[@]}"; do
  echo "Downloading $skill..."
  curl -s -H "x-api-key: $TCR_DOWNLOAD_KEY" \
    "https://thecreativerecord.com/api/download/$skill?format=raw" \
    -o "~/creative-record-skills/$skill.md"
done

echo "All skills downloaded to ~/creative-record-skills/"
```

---

### Initiate a Purchase (Agent Hands Off to Human)

```bash
curl -s -X POST \
  -H "x-api-key: $TCR_BROWSE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "skill_id": "video-script-framework",
    "customer_email": "you@example.com"
  }' \
  https://thecreativerecord.com/api/purchase
```

Response includes `checkout_url`. The agent surfaces this URL to the human for payment.

---

## Python Script (Full Agent Workflow)

This script handles discovery, detail fetching, and download. Save it and adapt as needed.

```python
#!/usr/bin/env python3
"""
The Creative Record -- Agent API Client
Handles browse, preview, and download workflows.
"""

import os
import json
import requests

BASE_URL = "https://thecreativerecord.com/api"

BROWSE_KEY = os.environ.get("TCR_BROWSE_KEY")
DOWNLOAD_KEY = os.environ.get("TCR_DOWNLOAD_KEY")


class CreativeRecordClient:
    def __init__(self, browse_key=None, download_key=None):
        self.browse_key = browse_key or BROWSE_KEY
        self.download_key = download_key or DOWNLOAD_KEY

    def _headers(self, key_type="browse"):
        key = self.browse_key if key_type == "browse" else self.download_key
        if not key:
            raise ValueError(f"No {key_type} key set. Set TCR_{key_type.upper()}_KEY env var.")
        return {"x-api-key": key}

    def health(self):
        """Check API health. No auth required."""
        r = requests.get(f"{BASE_URL}/health")
        r.raise_for_status()
        return r.json()

    def list_skills(self, tag=None, free_only=False):
        """List all available skills with metadata."""
        params = {}
        if tag:
            params["tag"] = tag
        if free_only:
            params["free"] = "true"
        r = requests.get(
            f"{BASE_URL}/skills",
            headers=self._headers("browse"),
            params=params
        )
        r.raise_for_status()
        return r.json()

    def get_skill(self, skill_id):
        """Get full detail on a skill including preview and TOC."""
        r = requests.get(
            f"{BASE_URL}/skills/{skill_id}",
            headers=self._headers("browse")
        )
        r.raise_for_status()
        return r.json()

    def get_bundle(self):
        """Get bundle pricing and contents."""
        r = requests.get(
            f"{BASE_URL}/bundle",
            headers=self._headers("browse")
        )
        r.raise_for_status()
        return r.json()

    def verify_key(self):
        """Check what the current download key can access."""
        r = requests.get(
            f"{BASE_URL}/key/verify",
            headers=self._headers("download")
        )
        r.raise_for_status()
        return r.json()

    def download_skill(self, skill_id, output_path=None, as_json=True):
        """
        Download a skill. Requires download key.
        
        Args:
            skill_id: The skill ID (e.g. 'video-script-framework')
            output_path: If provided, saves to file. Otherwise returns content.
            as_json: If True, returns JSON with metadata. If False, returns raw markdown.
        
        Returns:
            str (raw markdown) or dict (JSON with content field)
        """
        fmt = "json" if as_json else "raw"
        r = requests.get(
            f"{BASE_URL}/download/{skill_id}",
            headers=self._headers("download"),
            params={"format": fmt}
        )
        r.raise_for_status()
        
        if as_json:
            data = r.json()
            if output_path:
                with open(output_path, "w") as f:
                    f.write(data["content"])
                print(f"Saved {skill_id} to {output_path}")
            return data
        else:
            if output_path:
                with open(output_path, "w") as f:
                    f.write(r.text)
                print(f"Saved {skill_id} to {output_path}")
            return r.text

    def download_all(self, output_dir="."):
        """Download all skills the current key has access to."""
        os.makedirs(output_dir, exist_ok=True)
        key_info = self.verify_key()
        scope = key_info.get("scope", [])
        
        results = {}
        for skill_id in scope:
            path = os.path.join(output_dir, f"{skill_id}.md")
            try:
                self.download_skill(skill_id, output_path=path, as_json=False)
                results[skill_id] = "ok"
            except requests.HTTPError as e:
                results[skill_id] = f"error: {e}"
        
        return results

    def initiate_purchase(self, skill_id, customer_email):
        """
        Create a Stripe checkout session. Returns URL for human approval.
        
        The agent should surface checkout_url to the human.
        After payment, the human receives a download key at customer_email.
        """
        r = requests.post(
            f"{BASE_URL}/purchase",
            headers={**self._headers("browse"), "Content-Type": "application/json"},
            json={"skill_id": skill_id, "customer_email": customer_email}
        )
        r.raise_for_status()
        return r.json()


# -- Example Usage --

if __name__ == "__main__":
    client = CreativeRecordClient()
    
    # 1. Browse available skills
    print("=== Available Skills ===")
    catalog = client.list_skills()
    for skill in catalog["skills"]:
        status = "FREE" if skill["free"] else f"${skill['price']}"
        print(f"  [{status}] {skill['id']}: {skill['name']}")
    
    # 2. Get detail on a specific skill
    print("\n=== Video Script Framework Detail ===")
    detail = client.get_skill("video-script-framework")
    print(f"Name: {detail['name']}")
    print(f"Word count: {detail['word_count']}")
    print(f"TOC: {', '.join(detail['table_of_contents'][:3])}...")
    print(f"Preview: {detail['content_preview'][:200]}...")
    
    # 3. Check bundle value
    print("\n=== Bundle ===")
    bundle = client.get_bundle()
    print(f"{bundle['name']}: ${bundle['price']} (save ${bundle['savings']})")
    
    # 4. If you have a download key, download skills
    if DOWNLOAD_KEY:
        print("\n=== Downloading Purchased Skills ===")
        results = client.download_all(output_dir="./skills")
        for skill_id, status in results.items():
            print(f"  {skill_id}: {status}")
    
    # 5. Initiate a purchase (agent → human handoff)
    # purchase = client.initiate_purchase("video-script-framework", "you@example.com")
    # print(f"\nSend this URL to complete payment:\n{purchase['checkout_url']}")
```

---

## OpenClaw Agent Integration

This is how Sadie (or any OpenClaw agent) would work with The Creative Record.

### 1. Add Credentials to TOOLS.md

```markdown
## The Creative Record

- **Browse Key:** tcr_browse_xxxx
- **Download Key (bundle):** tcr_dl_xxxx   # add after purchase
- **Base URL:** https://thecreativerecord.com/api

### How to list skills
\`\`\`bash
curl -H "x-api-key: tcr_browse_xxxx" https://thecreativerecord.com/api/skills
\`\`\`

### How to download a skill
\`\`\`bash
curl -H "x-api-key: tcr_dl_xxxx" \
  "https://thecreativerecord.com/api/download/video-script-framework?format=raw" \
  -o video-script-framework.md
\`\`\`
```

### 2. Example OpenClaw Agent Task

When an agent needs a skill, the workflow is:

```
Human: "Load the hook bank into your context"

Agent:
1. Check TOOLS.md for TCR download key
2. curl download endpoint → get markdown content
3. Load content as context / save to workspace
4. Confirm: "Loaded hook-bank-template.md (6900 words)"
```

### 3. Browsing Before Buying

An agent can browse the full catalog and present options before initiating any purchase:

```bash
# Agent runs this, formats output for human
curl -s -H "x-api-key: $TCR_BROWSE_KEY" \
  https://thecreativerecord.com/api/skills \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
for s in data['skills']:
    print(f\"{s['id']}: {s['name']} -- \${s['price']}\")
    print(f\"  {s['description'][:80]}...\")
    print()
"
```

### 4. Purchase Flow (Agent Initiates, Human Approves)

```python
# Agent creates checkout session
purchase = client.initiate_purchase("complete-bundle", "matthew@goodostudios.com")

# Agent messages human:
# "I found the Complete Creative Record Bundle ($99, saves $96).
#  To purchase, approve payment here: {purchase['checkout_url']}
#  After payment, your download key will arrive at matthew@goodostudios.com."

# Human pays → download key arrives in email
# Human adds key to TOOLS.md
# Agent can now download all 5 skills
```

---

## Sample Agent Workflow (Full Script)

This is a complete end-to-end workflow an agent would run when tasked with "get me the creative audit checklist."

```bash
#!/bin/bash
# agent-workflow-get-skill.sh
# Task: Download creative-audit-checklist if we have access, else initiate purchase

BROWSE_KEY="tcr_browse_xxxx"
DOWNLOAD_KEY="${TCR_DOWNLOAD_KEY:-}"  # May or may not be set
SKILL_ID="creative-audit-checklist"
OUTPUT_DIR="$HOME/.openclaw/workspace/reference"

# Step 1: Verify skill exists
echo "Checking skill availability..."
SKILL_INFO=$(curl -s -H "x-api-key: $BROWSE_KEY" \
  "https://thecreativerecord.com/api/skills/$SKILL_ID")

SKILL_NAME=$(echo "$SKILL_INFO" | python3 -c "import sys,json; print(json.load(sys.stdin).get('name','unknown'))")
SKILL_PRICE=$(echo "$SKILL_INFO" | python3 -c "import sys,json; print(json.load(sys.stdin).get('price','?'))")
echo "Found: $SKILL_NAME (\$$SKILL_PRICE)"

# Step 2: Check if we have a download key
if [ -z "$DOWNLOAD_KEY" ]; then
  echo "No download key found. Creating purchase session..."
  PURCHASE=$(curl -s -X POST \
    -H "x-api-key: $BROWSE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"skill_id\": \"$SKILL_ID\", \"customer_email\": \"matthew@goodostudios.com\"}" \
    "https://thecreativerecord.com/api/purchase")
  
  CHECKOUT_URL=$(echo "$PURCHASE" | python3 -c "import sys,json; print(json.load(sys.stdin)['checkout_url'])")
  echo ""
  echo "ACTION REQUIRED: Approve payment at this URL:"
  echo "$CHECKOUT_URL"
  echo ""
  echo "After payment, add your download key to TOOLS.md as TCR_DOWNLOAD_KEY"
  exit 0
fi

# Step 3: Verify key has access to this skill
echo "Verifying download key scope..."
KEY_INFO=$(curl -s -H "x-api-key: $DOWNLOAD_KEY" \
  "https://thecreativerecord.com/api/key/verify")

SCOPE=$(echo "$KEY_INFO" | python3 -c "import sys,json; print(json.load(sys.stdin).get('scope',[]))")
echo "Key scope: $SCOPE"

# Step 4: Download the skill
echo "Downloading $SKILL_ID..."
mkdir -p "$OUTPUT_DIR"
curl -s -H "x-api-key: $DOWNLOAD_KEY" \
  "https://thecreativerecord.com/api/download/$SKILL_ID?format=raw" \
  -o "$OUTPUT_DIR/$SKILL_ID.md"

echo "Downloaded to $OUTPUT_DIR/$SKILL_ID.md"
wc -w "$OUTPUT_DIR/$SKILL_ID.md"
```

---

## Error Handling

Always handle these common errors in agent code:

```python
try:
    response = client.download_skill("video-script-framework")
except requests.HTTPError as e:
    status = e.response.status_code
    error = e.response.json().get("error", {})
    
    if status == 401:
        # Missing or invalid key -- check TOOLS.md for TCR_DOWNLOAD_KEY
        print("Authentication failed. Check your download key.")
    
    elif status == 403:
        code = error.get("code")
        if code == "BROWSE_KEY_INSUFFICIENT":
            # Have browse key, need download key -- initiate purchase
            print("This skill requires purchase. Initiating checkout...")
        elif code == "KEY_SCOPE_MISMATCH":
            # Have download key but it's for a different skill
            print("Your key doesn't include this skill. Consider the bundle.")
    
    elif status == 429:
        retry_after = e.response.headers.get("Retry-After", 60)
        print(f"Rate limited. Retry in {retry_after} seconds.")
    
    else:
        print(f"Unexpected error {status}: {error.get('message')}")
```

---

## Available Skill IDs

For reference:

| ID | Name | Price |
|----|------|-------|
| `video-script-framework` | Video Script Writing System | $39 |
| `hook-bank-template` | Hook Bank Template | $39 |
| `ugc-brief-template` | UGC Brief Template | $39 |
| `creative-audit-checklist` | Creative Audit Checklist | $39 |
| `competitor-analysis-framework` | Competitor Analysis Framework | $39 |
| `complete-bundle` | All 5 Skills (Bundle) | $99 |

---

*Last updated: March 2026*
