/**
 * The Creative Record — Hook Vault Popup System
 * 
 * Triggers: exit-intent (desktop), 30s timer, 50% scroll (mobile)
 * Frequency cap: once per session (sessionStorage)
 * Beehiiv: pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66
 */

(function () {
  'use strict';

  const BEEHIIV_PUB_ID = 'pub_7ae1d56e-7576-41fe-bd64-0cd4af00da66';
  const BEEHIIV_API_KEY = '5go8eJrMa0lUpgw5QZkcNFOkzfe4Md2hM8EbGKWcm6RZgkaPXUUiLie1ejMuQEHc';
  const POPUP_KEY = 'tcr_popup_shown';
  const DOWNLOAD_URL = '/hooks-preview.pdf';

  // ── Don't show if already dismissed this session ──────────────────────────
  if (sessionStorage.getItem(POPUP_KEY)) return;

  // ── Don't show on lead-magnet page itself ─────────────────────────────────
  if (window.location.pathname.includes('lead-magnet')) return;

  // ── Inject styles ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── Popup Overlay ── */
    #tcr-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 14, 13, 0.72);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 300ms ease;
      pointer-events: none;
    }
    #tcr-popup-overlay.tcr-visible {
      opacity: 1;
      pointer-events: all;
    }

    /* ── Modal Card ── */
    #tcr-popup-modal {
      background: #faf8f5;
      border-radius: 10px;
      max-width: 480px;
      width: 100%;
      padding: 40px 36px 36px;
      position: relative;
      transform: translateY(24px);
      transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 24px 64px rgba(15, 14, 13, 0.22), 0 4px 12px rgba(15, 14, 13, 0.08);
    }
    #tcr-popup-overlay.tcr-visible #tcr-popup-modal {
      transform: translateY(0);
    }

    /* ── Close Button ── */
    #tcr-popup-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a09890;
      transition: background 150ms ease, color 150ms ease;
      font-size: 18px;
      line-height: 1;
    }
    #tcr-popup-close:hover {
      background: #e8e4dd;
      color: #0f0e0d;
    }

    /* ── Eyebrow ── */
    .tcr-popup-eyebrow {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #c8552a;
      margin-bottom: 12px;
    }

    /* ── Headline ── */
    .tcr-popup-headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-size: 1.6rem;
      line-height: 1.15;
      color: #0f0e0d;
      margin-bottom: 10px;
      letter-spacing: -0.01em;
    }

    /* ── Subhead ── */
    .tcr-popup-subhead {
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      color: #6b6560;
      line-height: 1.55;
      margin-bottom: 24px;
    }

    /* ── Proof line ── */
    .tcr-popup-proof {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 22px;
      font-size: 0.8125rem;
      font-family: 'Inter', sans-serif;
      color: #6b6560;
    }
    .tcr-popup-proof svg {
      flex-shrink: 0;
      color: #c8552a;
    }

    /* ── Form ── */
    #tcr-popup-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    #tcr-popup-email {
      width: 100%;
      padding: 13px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      color: #0f0e0d;
      background: #ffffff;
      border: 1.5px solid #e8e4dd;
      border-radius: 7px;
      outline: none;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    #tcr-popup-email:focus {
      border-color: #c8552a;
      box-shadow: 0 0 0 3px rgba(200, 85, 42, 0.12);
    }
    #tcr-popup-email::placeholder { color: #a09890; }

    #tcr-popup-submit {
      width: 100%;
      padding: 13px 24px;
      background: #c8552a;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      border: none;
      border-radius: 7px;
      cursor: pointer;
      transition: background 180ms ease, transform 120ms ease;
    }
    #tcr-popup-submit:hover { background: #b34a22; }
    #tcr-popup-submit:active { transform: scale(0.98); }
    #tcr-popup-submit:disabled { opacity: 0.65; cursor: not-allowed; }

    /* ── Privacy note ── */
    .tcr-popup-privacy {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: #a09890;
      text-align: center;
      margin-top: 10px;
    }

    /* ── Success state ── */
    #tcr-popup-success {
      display: none;
      text-align: center;
      padding: 8px 0;
    }
    .tcr-success-icon {
      width: 52px;
      height: 52px;
      background: #f4e0d6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: #c8552a;
    }
    .tcr-success-headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 1.35rem;
      color: #0f0e0d;
      margin-bottom: 8px;
    }
    .tcr-success-body {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #6b6560;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .tcr-download-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #c8552a;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      font-size: 0.9rem;
      text-decoration: none;
      border-radius: 7px;
      transition: background 180ms ease;
    }
    .tcr-download-btn:hover { background: #b34a22; }

    /* ── Error state ── */
    .tcr-popup-error {
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      color: #c8552a;
      margin-top: 4px;
      display: none;
    }

    /* ── Mobile adjustments ── */
    @media (max-width: 480px) {
      #tcr-popup-modal {
        padding: 32px 24px 28px;
        border-radius: 10px 10px 0 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
        transform: translateY(100%);
      }
      #tcr-popup-overlay.tcr-visible #tcr-popup-modal {
        transform: translateY(0);
      }
      #tcr-popup-overlay {
        align-items: flex-end;
        padding: 0;
      }
      .tcr-popup-headline { font-size: 1.4rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'tcr-popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'tcr-popup-headline');
  overlay.innerHTML = `
    <div id="tcr-popup-modal">
      <button id="tcr-popup-close" aria-label="Close popup">✕</button>

      <div id="tcr-popup-content">
        <span class="tcr-popup-eyebrow">Free Download</span>
        <h2 class="tcr-popup-headline" id="tcr-popup-headline">Want 25 hook formulas that actually work?</h2>
        <p class="tcr-popup-subhead">Get the free Hook Vault — proven hooks from top DTC brands, with real examples and the strategy behind each one.</p>

        <div class="tcr-popup-proof">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1.5C4.186 1.5 1.5 4.186 1.5 7.5S4.186 13.5 7.5 13.5 13.5 10.814 13.5 7.5 10.814 1.5 7.5 1.5zm3.06 5.56l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 011.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 1.06z" fill="currentColor"/>
          </svg>
          25 formulas across 5 categories — instant download
        </div>

        <form id="tcr-popup-form" novalidate>
          <input
            type="email"
            id="tcr-popup-email"
            name="email"
            placeholder="Your email address"
            autocomplete="email"
            required
          />
          <p class="tcr-popup-error" id="tcr-popup-error">Please enter a valid email address.</p>
          <button type="submit" id="tcr-popup-submit">Get Free Access →</button>
        </form>
        <p class="tcr-popup-privacy">No spam. Unsubscribe anytime.</p>
      </div>

      <div id="tcr-popup-success">
        <div class="tcr-success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="tcr-success-headline">It's on its way.</p>
        <p class="tcr-success-body">Check your inbox for the Hook Vault — 25 formulas ready to use in your next ad.</p>
        <a href="${DOWNLOAD_URL}" class="tcr-download-btn" download>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13h12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Download Now
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Show / Hide ───────────────────────────────────────────────────────────
  function showPopup() {
    if (sessionStorage.getItem(POPUP_KEY)) return;
    overlay.classList.add('tcr-visible');
    document.getElementById('tcr-popup-email').focus();
    clearTriggers();
    sessionStorage.setItem(POPUP_KEY, '1');
  }

  function hidePopup() {
    overlay.classList.remove('tcr-visible');
  }

  // ── Close handlers ────────────────────────────────────────────────────────
  document.getElementById('tcr-popup-close').addEventListener('click', hidePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopup();
  });

  // ── Trigger logic ─────────────────────────────────────────────────────────
  let timerHandle = null;
  let scrollBound = false;
  let exitBound = false;

  function clearTriggers() {
    clearTimeout(timerHandle);
    if (scrollBound) window.removeEventListener('scroll', onScroll);
    if (exitBound) document.removeEventListener('mouseleave', onMouseLeave);
  }

  const isMobile = () => window.innerWidth <= 768;

  // Time-based (30s) — desktop + mobile
  timerHandle = setTimeout(showPopup, 30000);

  // Exit-intent — desktop only
  function onMouseLeave(e) {
    if (e.clientY <= 5) showPopup();
  }
  if (!isMobile()) {
    exitBound = true;
    document.addEventListener('mouseleave', onMouseLeave);
  }

  // Scroll-based — mobile only (50% page scroll)
  function onScroll() {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled >= 0.5) showPopup();
  }
  if (isMobile()) {
    scrollBound = true;
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Form submission ───────────────────────────────────────────────────────
  const form = document.getElementById('tcr-popup-form');
  const emailInput = document.getElementById('tcr-popup-email');
  const submitBtn = document.getElementById('tcr-popup-submit');
  const errorEl = document.getElementById('tcr-popup-error');
  const successEl = document.getElementById('tcr-popup-success');
  const contentEl = document.getElementById('tcr-popup-content');

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function subscribeToBeehiiv(email) {
    const res = await fetch(`/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        publication_id: BEEHIIV_PUB_ID,
        utm_source: 'popup',
        utm_medium: 'hook-vault',
        referring_site: window.location.href,
        custom_fields: [],
        tags: ['lead-magnet-hook-vault']
      })
    });
    if (!res.ok) throw new Error('Subscription failed');
    return res.json();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    errorEl.style.display = 'none';

    if (!isValidEmail(email)) {
      errorEl.style.display = 'block';
      emailInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await subscribeToBeehiiv(email);
    } catch (err) {
      // Fail silently — still show success + download to user
      console.warn('Beehiiv subscription error:', err);
    }

    // Show success state
    contentEl.style.display = 'none';
    successEl.style.display = 'block';
  });

})();
