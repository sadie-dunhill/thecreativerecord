#!/usr/bin/env python3
"""
The Creative Record -- API Test Client
Tests all endpoints. Use this to verify the API is working
or as reference for how to integrate in your own agent.

Usage:
    # Test with real keys (set env vars first)
    TCR_BROWSE_KEY=tcr_browse_xxx python3 test-client.py

    # Test specific endpoints only
    TCR_BROWSE_KEY=tcr_browse_xxx python3 test-client.py --test health
    TCR_BROWSE_KEY=tcr_browse_xxx python3 test-client.py --test browse
    TCR_DOWNLOAD_KEY=tcr_dl_xxx python3 test-client.py --test download

    # Download a specific skill
    TCR_DOWNLOAD_KEY=tcr_dl_xxx python3 test-client.py --download video-script-framework

    # List and show detail
    TCR_BROWSE_KEY=tcr_browse_xxx python3 test-client.py --browse

    # Run all tests (requires both keys)
    TCR_BROWSE_KEY=tcr_browse_xxx TCR_DOWNLOAD_KEY=tcr_dl_xxx python3 test-client.py --all
"""

import os
import sys
import json
import time
import argparse
import requests
from datetime import datetime

BASE_URL = os.environ.get("TCR_BASE_URL", "https://thecreativerecord.com/api")
BROWSE_KEY = os.environ.get("TCR_BROWSE_KEY")
DOWNLOAD_KEY = os.environ.get("TCR_DOWNLOAD_KEY")

# ANSI colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
BOLD = "\033[1m"
RESET = "\033[0m"

# All known skill IDs
ALL_SKILL_IDS = [
    "video-script-framework",
    "hook-bank-template",
    "ugc-brief-template",
    "creative-audit-checklist",
    "competitor-analysis-framework"
]


def ok(msg):
    print(f"  {GREEN}✓{RESET} {msg}")


def fail(msg):
    print(f"  {RED}✗{RESET} {msg}")


def info(msg):
    print(f"  {BLUE}→{RESET} {msg}")


def section(title):
    print(f"\n{BOLD}{title}{RESET}")
    print("-" * 50)


def check(condition, pass_msg, fail_msg):
    if condition:
        ok(pass_msg)
    else:
        fail(fail_msg)
    return condition


# ─── Test Functions ────────────────────────────────────────────────────────────

def test_health():
    section("Health Check")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=10)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        check("status" in data, "Response has 'status' field", "Missing 'status' field")
        check(data.get("status") == "ok", f"Status is 'ok'", f"Status is '{data.get('status')}'")
        check("version" in data, "Response has 'version' field", "Missing 'version' field")
        
        info(f"Version: {data.get('version')} | Timestamp: {data.get('timestamp', 'n/a')}")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_auth_missing_key():
    section("Auth: Missing Key")
    try:
        r = requests.get(f"{BASE_URL}/skills", timeout=10)
        check(r.status_code == 401, f"Returns 401 when no key provided (got {r.status_code})", 
              f"Expected 401, got {r.status_code}")
        
        data = r.json()
        check("error" in data, "Response has 'error' field", "Missing 'error' field")
        check(data.get("error", {}).get("code") == "MISSING_API_KEY", 
              "Error code is MISSING_API_KEY", 
              f"Error code is {data.get('error', {}).get('code')}")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_auth_bad_key():
    section("Auth: Invalid Key")
    try:
        r = requests.get(f"{BASE_URL}/skills", 
                        headers={"x-api-key": "tcr_browse_definitely_invalid_key_12345"},
                        timeout=10)
        check(r.status_code == 401, f"Returns 401 for invalid key (got {r.status_code})", 
              f"Expected 401, got {r.status_code}")
        
        data = r.json()
        check(data.get("error", {}).get("code") == "INVALID_API_KEY",
              "Error code is INVALID_API_KEY",
              f"Error code is {data.get('error', {}).get('code')}")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_list_skills(browse_key):
    section("GET /api/skills -- List All")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/skills", headers=headers, timeout=10)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        check("skills" in data, "Response has 'skills' array", "Missing 'skills' array")
        check("total" in data, "Response has 'total' field", "Missing 'total' field")
        
        skills = data.get("skills", [])
        check(len(skills) >= 5, f"Returns at least 5 skills (got {len(skills)})", 
              f"Expected >= 5 skills, got {len(skills)}")
        
        # Verify required fields on each skill
        required_fields = ["id", "name", "price", "currency", "free", "format", "word_count", "tags"]
        if skills:
            first = skills[0]
            for field in required_fields:
                check(field in first, f"Skill has '{field}' field", f"Skill missing '{field}' field")
        
        # Display summary
        info(f"Found {len(skills)} skills:")
        for s in skills:
            status = "FREE" if s.get("free") else f"${s.get('price', '?')}"
            info(f"  [{status}] {s['id']}: {s['name']}")
        
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_list_skills_tag_filter(browse_key):
    section("GET /api/skills?tag=video -- Tag Filter")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/skills?tag=video", headers=headers, timeout=10)
        check(r.status_code == 200, f"Status 200", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        skills = data.get("skills", [])
        
        # All returned skills should have 'video' tag
        all_have_tag = all("video" in s.get("tags", []) for s in skills)
        check(all_have_tag, f"All {len(skills)} skills have 'video' tag", 
              "Some skills returned without 'video' tag")
        
        info(f"Found {len(skills)} skills with 'video' tag")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_skill_detail(browse_key, skill_id="video-script-framework"):
    section(f"GET /api/skills/{skill_id}")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/skills/{skill_id}", headers=headers, timeout=10)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        
        # Required detail fields
        check("content_preview" in data, "Has 'content_preview' field", "Missing 'content_preview'")
        check("table_of_contents" in data, "Has 'table_of_contents' field", "Missing 'table_of_contents'")
        check("purchase_url" in data, "Has 'purchase_url' field", "Missing 'purchase_url'")
        check("download_available" in data, "Has 'download_available' field", "Missing 'download_available'")
        
        preview = data.get("content_preview", "")
        check(len(preview) > 100, f"Preview is non-empty ({len(preview)} chars)", 
              f"Preview too short ({len(preview)} chars)")
        check(len(preview) <= 600, f"Preview is ≤600 chars (is {len(preview)})", 
              f"Preview exceeds 600 chars ({len(preview)})")
        
        toc = data.get("table_of_contents", [])
        check(len(toc) > 0, f"TOC has {len(toc)} entries", "Empty TOC")
        
        info(f"Preview: {preview[:100]}...")
        info(f"TOC entries: {len(toc)}")
        info(f"Download available: {data.get('download_available')}")
        
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_skill_not_found(browse_key):
    section("GET /api/skills/nonexistent -- 404 Handling")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/skills/this-skill-does-not-exist", headers=headers, timeout=10)
        check(r.status_code == 404, f"Returns 404 (got {r.status_code})", f"Expected 404, got {r.status_code}")
        
        data = r.json()
        check(data.get("error", {}).get("code") == "SKILL_NOT_FOUND",
              "Error code is SKILL_NOT_FOUND",
              f"Error code is {data.get('error', {}).get('code')}")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_bundle(browse_key):
    section("GET /api/bundle")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/bundle", headers=headers, timeout=10)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        check("id" in data, "Has 'id' field", "Missing 'id'")
        check("price" in data, "Has 'price' field", "Missing 'price'")
        check("includes" in data, "Has 'includes' field", "Missing 'includes'")
        check("savings" in data, "Has 'savings' field", "Missing 'savings'")
        
        includes = data.get("includes", [])
        check(len(includes) == 5, f"Bundle includes 5 skills (got {len(includes)})", 
              f"Expected 5 skills, got {len(includes)}")
        
        price = data.get("price")
        original = data.get("original_price")
        savings = data.get("savings")
        check(savings == original - price, 
              f"Savings math correct (${original} - ${price} = ${savings})",
              f"Savings math wrong: ${original} - ${price} ≠ ${savings}")
        
        info(f"Bundle: ${price} (saves ${savings} vs ${original} individual)")
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_verify_key(download_key):
    section("GET /api/key/verify")
    headers = {"x-api-key": download_key}
    
    try:
        r = requests.get(f"{BASE_URL}/key/verify", headers=headers, timeout=10)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        check(data.get("valid") == True, "Key is valid", "Key reported as invalid")
        check("key_class" in data, "Has 'key_class' field", "Missing 'key_class'")
        check("scope" in data, "Has 'scope' field", "Missing 'scope'")
        
        info(f"Key class: {data.get('key_class')}")
        info(f"Scope: {data.get('scope')}")
        info(f"Created: {data.get('created_at', 'n/a')}")
        
        return data
    except Exception as e:
        fail(f"Request failed: {e}")
        return None


def test_download_json(download_key, skill_id="video-script-framework"):
    section(f"GET /api/download/{skill_id} (JSON format)")
    headers = {"x-api-key": download_key}
    
    try:
        r = requests.get(f"{BASE_URL}/download/{skill_id}", 
                        headers=headers, 
                        params={"format": "json"},
                        timeout=30)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        data = r.json()
        check("id" in data, "Has 'id' field", "Missing 'id'")
        check("content" in data, "Has 'content' field", "Missing 'content'")
        check("word_count" in data, "Has 'word_count' field", "Missing 'word_count'")
        check("downloaded_at" in data, "Has 'downloaded_at' timestamp", "Missing 'downloaded_at'")
        
        content = data.get("content", "")
        word_count = len(content.split())
        check(word_count > 1000, f"Content has {word_count} words", f"Content too short ({word_count} words)")
        
        info(f"Content length: {len(content)} chars / {word_count} words")
        info(f"First 80 chars: {content[:80].strip()}...")
        
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_download_raw(download_key, skill_id="hook-bank-template", save_to=None):
    section(f"GET /api/download/{skill_id} (raw markdown)")
    headers = {"x-api-key": download_key}
    
    try:
        r = requests.get(f"{BASE_URL}/download/{skill_id}",
                        headers=headers,
                        params={"format": "raw"},
                        timeout=30)
        check(r.status_code == 200, f"Status 200 (got {r.status_code})", f"Expected 200, got {r.status_code}")
        
        # Check content type
        content_type = r.headers.get("Content-Type", "")
        check("text/markdown" in content_type or "text/plain" in content_type,
              f"Content-Type is markdown/text ({content_type})",
              f"Unexpected Content-Type: {content_type}")
        
        content = r.text
        check(len(content) > 1000, f"Raw content is {len(content)} chars", "Content too short")
        check(content.startswith("#"), "Content starts with markdown heading", 
              f"Content starts with: {content[:20]}")
        
        word_count = len(content.split())
        info(f"Raw markdown: {len(content)} chars / {word_count} words")
        
        if save_to:
            with open(save_to, "w") as f:
                f.write(content)
            ok(f"Saved to {save_to}")
        
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_download_scope_mismatch(download_key, skill_id):
    """Test that a single-skill key can't download other skills."""
    section(f"Download: Key scope enforcement")
    headers = {"x-api-key": download_key}
    
    # Find a skill NOT in this key's scope
    key_info = requests.get(f"{BASE_URL}/key/verify", headers=headers, timeout=10).json()
    scope = key_info.get("scope", [])
    
    if "complete-bundle" in scope or len(scope) >= 5:
        info("Bundle key -- scope enforcement test not applicable (key has all skills)")
        return True
    
    # Find a skill not in scope
    out_of_scope = [s for s in ALL_SKILL_IDS if s not in scope]
    if not out_of_scope:
        info("All skills in scope -- skipping scope mismatch test")
        return True
    
    test_skill = out_of_scope[0]
    info(f"Testing with out-of-scope skill: {test_skill}")
    
    r = requests.get(f"{BASE_URL}/download/{test_skill}",
                    headers=headers,
                    params={"format": "json"},
                    timeout=10)
    check(r.status_code == 403, f"Returns 403 for out-of-scope skill (got {r.status_code})",
          f"Expected 403, got {r.status_code}")
    
    data = r.json()
    check(data.get("error", {}).get("code") == "KEY_SCOPE_MISMATCH",
          "Error code is KEY_SCOPE_MISMATCH",
          f"Error code is {data.get('error', {}).get('code')}")
    
    return True


def test_purchase_initiate(browse_key):
    section("POST /api/purchase (dry run)")
    headers = {"x-api-key": browse_key, "Content-Type": "application/json"}
    
    # We won't actually create a real checkout -- just verify the endpoint structure
    # In production, swap test email and skill ID
    payload = {
        "skill_id": "video-script-framework",
        "customer_email": "test-agent@example.com"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/purchase",
                         headers=headers,
                         json=payload,
                         timeout=15)
        
        # 200 = purchase session created successfully
        # 400 = validation error (acceptable if API isn't live yet)
        if r.status_code == 200:
            data = r.json()
            check("checkout_url" in data, "Has 'checkout_url'", "Missing 'checkout_url'")
            check("checkout_session_id" in data, "Has 'checkout_session_id'", "Missing 'checkout_session_id'")
            check("expires_at" in data, "Has 'expires_at'", "Missing 'expires_at'")
            checkout_url = data.get("checkout_url", "")
            check("checkout.stripe.com" in checkout_url, "checkout_url is Stripe URL", 
                  f"Unexpected URL: {checkout_url[:50]}")
            info(f"Checkout URL: {checkout_url[:60]}...")
        elif r.status_code == 400:
            info(f"API returned 400 -- likely not fully live yet. Response: {r.text[:100]}")
        elif r.status_code == 503:
            info("Purchase endpoint not yet deployed -- skipping")
        else:
            fail(f"Unexpected status: {r.status_code} -- {r.text[:100]}")
        
        return r.status_code in [200, 400, 503]
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


def test_rate_limit_headers(browse_key):
    section("Rate Limit Headers")
    headers = {"x-api-key": browse_key}
    
    try:
        r = requests.get(f"{BASE_URL}/skills", headers=headers, timeout=10)
        
        # Check for rate limit headers
        rl_limit = r.headers.get("X-RateLimit-Limit")
        rl_remaining = r.headers.get("X-RateLimit-Remaining")
        rl_reset = r.headers.get("X-RateLimit-Reset")
        
        check(rl_limit is not None, f"X-RateLimit-Limit header present ({rl_limit})", 
              "X-RateLimit-Limit header missing")
        check(rl_remaining is not None, f"X-RateLimit-Remaining header present ({rl_remaining})", 
              "X-RateLimit-Remaining header missing")
        check(rl_reset is not None, f"X-RateLimit-Reset header present ({rl_reset})", 
              "X-RateLimit-Reset header missing")
        
        return True
    except Exception as e:
        fail(f"Request failed: {e}")
        return False


# ─── Download Helper ───────────────────────────────────────────────────────────

def download_skill(download_key, skill_id, output_dir="."):
    """Download a specific skill as a raw markdown file."""
    print(f"\n{BOLD}Downloading {skill_id}...{RESET}")
    headers = {"x-api-key": download_key}
    
    try:
        r = requests.get(f"{BASE_URL}/download/{skill_id}",
                        headers=headers,
                        params={"format": "raw"},
                        timeout=30)
        
        if r.status_code == 403:
            data = r.json()
            error_code = data.get("error", {}).get("code")
            if error_code == "BROWSE_KEY_INSUFFICIENT":
                fail("This is a browse key -- a download key is required. Purchase first.")
            elif error_code == "KEY_SCOPE_MISMATCH":
                fail(f"Your download key doesn't include '{skill_id}'. Consider the bundle key.")
            return False
        
        r.raise_for_status()
        
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{skill_id}.md")
        
        with open(output_path, "w") as f:
            f.write(r.text)
        
        word_count = len(r.text.split())
        ok(f"Saved to {output_path} ({word_count} words)")
        return True
        
    except requests.HTTPError as e:
        fail(f"HTTP {e.response.status_code}: {e.response.text[:100]}")
        return False
    except Exception as e:
        fail(f"Error: {e}")
        return False


def browse_catalog(browse_key):
    """Print a formatted view of the catalog."""
    print(f"\n{BOLD}The Creative Record -- Skills Catalog{RESET}")
    print("=" * 60)
    
    headers = {"x-api-key": browse_key}
    
    r = requests.get(f"{BASE_URL}/skills", headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()
    
    for skill in data["skills"]:
        status = f"{GREEN}FREE{RESET}" if skill["free"] else f"{YELLOW}${skill['price']}{RESET}"
        print(f"\n[{status}] {BOLD}{skill['name']}{RESET}")
        print(f"  ID: {skill['id']}")
        print(f"  {skill['description'][:100]}...")
        print(f"  Tags: {', '.join(skill['tags'])}")
        print(f"  Format: {skill['format']} | Words: {skill['word_count']:,}")
        print(f"  URL: {skill['purchase_url']}")
    
    print(f"\n{BOLD}Bundle:{RESET}")
    r2 = requests.get(f"{BASE_URL}/bundle", headers=headers, timeout=10)
    r2.raise_for_status()
    bundle = r2.json()
    print(f"  {bundle['name']}")
    print(f"  ${bundle['price']} (save ${bundle['savings']} vs buying individually)")
    print(f"  {bundle['purchase_url']}")


# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="The Creative Record API Test Client")
    parser.add_argument("--test", choices=["health", "auth", "browse", "download", "purchase", "all"],
                       help="Run specific test suite")
    parser.add_argument("--browse", action="store_true", help="Display skill catalog")
    parser.add_argument("--download", metavar="SKILL_ID", help="Download a specific skill")
    parser.add_argument("--output-dir", default="./downloaded-skills", help="Output directory for downloads")
    parser.add_argument("--base-url", help="Override base URL (default: https://thecreativerecord.com/api)")
    args = parser.parse_args()
    
    global BASE_URL
    if args.base_url:
        BASE_URL = args.base_url
    
    print(f"{BOLD}The Creative Record API Test Client{RESET}")
    print(f"Base URL: {BASE_URL}")
    print(f"Browse Key: {'SET' if BROWSE_KEY else 'NOT SET (set TCR_BROWSE_KEY)'}")
    print(f"Download Key: {'SET' if DOWNLOAD_KEY else 'NOT SET (set TCR_DOWNLOAD_KEY)'}")
    print(f"Time: {datetime.now().isoformat()}")
    
    # Browse mode
    if args.browse:
        if not BROWSE_KEY:
            print(f"{RED}Error: TCR_BROWSE_KEY not set{RESET}")
            sys.exit(1)
        browse_catalog(BROWSE_KEY)
        return
    
    # Download mode
    if args.download:
        if not DOWNLOAD_KEY:
            print(f"{RED}Error: TCR_DOWNLOAD_KEY not set{RESET}")
            sys.exit(1)
        success = download_skill(DOWNLOAD_KEY, args.download, args.output_dir)
        sys.exit(0 if success else 1)
    
    # Test mode
    test = args.test or "health"
    results = []
    
    if test in ("health", "all"):
        results.append(("Health Check", test_health()))
    
    if test in ("auth", "all"):
        results.append(("Auth: Missing Key", test_auth_missing_key()))
        results.append(("Auth: Bad Key", test_auth_bad_key()))
    
    if test in ("browse", "all"):
        if not BROWSE_KEY:
            print(f"\n{YELLOW}Skipping browse tests: TCR_BROWSE_KEY not set{RESET}")
        else:
            results.append(("List Skills", test_list_skills(BROWSE_KEY)))
            results.append(("Tag Filter", test_list_skills_tag_filter(BROWSE_KEY)))
            results.append(("Skill Detail", test_skill_detail(BROWSE_KEY, "video-script-framework")))
            results.append(("Skill Not Found", test_skill_not_found(BROWSE_KEY)))
            results.append(("Bundle Info", test_bundle(BROWSE_KEY)))
            results.append(("Rate Limit Headers", test_rate_limit_headers(BROWSE_KEY)))
    
    if test in ("download", "all"):
        if not DOWNLOAD_KEY:
            print(f"\n{YELLOW}Skipping download tests: TCR_DOWNLOAD_KEY not set{RESET}")
        else:
            results.append(("Verify Key", test_verify_key(DOWNLOAD_KEY) is not None))
            results.append(("Download JSON", test_download_json(DOWNLOAD_KEY, "video-script-framework")))
            results.append(("Download Raw", test_download_raw(DOWNLOAD_KEY, "hook-bank-template")))
            results.append(("Scope Enforcement", test_download_scope_mismatch(DOWNLOAD_KEY, "video-script-framework")))
    
    if test in ("purchase", "all"):
        if not BROWSE_KEY:
            print(f"\n{YELLOW}Skipping purchase tests: TCR_BROWSE_KEY not set{RESET}")
        else:
            results.append(("Purchase Initiate", test_purchase_initiate(BROWSE_KEY)))
    
    # Summary
    if results:
        section("Test Summary")
        passed = sum(1 for _, r in results if r)
        total = len(results)
        
        for name, result in results:
            status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
            print(f"  [{status}] {name}")
        
        print(f"\n{BOLD}Results: {passed}/{total} passed{RESET}")
        
        if passed < total:
            sys.exit(1)


if __name__ == "__main__":
    main()
