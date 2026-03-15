# The Creative Record — Brand Guidelines

**Last Updated: March 15, 2026**  
*Redesigned: warm editorial + tech minimalism. Reference: Aesop warmth, Linear precision.*

---

## Design Philosophy

**Editorial sophistication meets purposeful restraint.** Every decision should ask: does this feel like it belongs on a top-tier editorial or SaaS site? If not, don't do it.

The brand lives at the intersection of craft and commerce. It should feel like the person behind it has taste *and* knows what an ROAS is.

---

## Color System

### Palette

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--ink` | `#0f0e0d` | Near-black | Primary text, primary backgrounds |
| `--ink-2` | `#3d3a36` | Warm charcoal | Secondary headings, body on white |
| `--ink-3` | `#6b6560` | Warm gray | Body copy, secondary text |
| `--ink-4` | `#a09890` | Muted warm | Captions, metadata, placeholders |
| `--terra` | `#c8552a` | Terracotta | Primary accent, CTAs, highlights |
| `--terra-2` | `#e8714a` | Light terracotta | Hover states, eyebrows on dark |
| `--terra-3` | `#f4e0d6` | Terra wash | Icon backgrounds, tinted surfaces |
| `--cream` | `#faf8f5` | Off-white | Site background |
| `--cream-2` | `#f3f0eb` | Warm cream | Card surfaces, section alternates |
| `--cream-3` | `#e8e4dd` | Warm border | Dividers, input borders, subtle lines |
| `--white` | `#ffffff` | White | Cards, inputs, bright surfaces |

### Usage Rules
- Dark sections (hero, footer, pricing): `--ink` background with white text
- Light sections (content, skills): `--cream` or `--cream-2` with `--ink` text
- Accent (`--terra`) appears 10% of visual weight maximum
- Never use terracotta as a large background area
- Body copy: always `--ink-3` on light, `rgba(255,255,255,0.55)` on dark
- Warm neutrals only -- no cool grays, no pure black, no blue-purple

---

## Typography

### Font Stack

```css
--font-serif: 'DM Serif Display', Georgia, 'Times New Roman', serif;
--font-sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Notes |
|---------|------|------|--------|-------------|-------|
| Display H1 | Serif | clamp(2.75rem, 5.5vw, 4.5rem) | 400 | 1.08 | Hero headlines |
| H1 | Serif | clamp(2.25rem, 4vw, 3.5rem) | 400 | 1.15 | Page headers |
| H2 | Serif | clamp(1.875rem, 3.5vw, 2.875rem) | 400 | 1.15 | Section headers |
| H3 | Serif | 1.75rem | 400 | 1.2 | Sub-sections |
| Card Title | Sans | 1.0625rem | 600 | 1.3 | Card headings |
| Body Large | Sans | 1.1875rem | 400 | 1.7 | Lead text, hero sub |
| Body | Sans | 1.0625rem | 400 | 1.75 | Article body |
| Body Small | Sans | 0.9375rem | 400 | 1.65 | Cards, UI |
| Caption | Sans | 0.875rem | 400 | 1.65 | Meta, helper text |
| Label | Sans | 0.75rem | 600 | 1.4 | Section labels (uppercase, 0.1em tracking) |
| Micro | Sans | 0.6875rem | 600 | 1.4 | Badges, tags (uppercase, 0.08em tracking) |

### Typography Rules
- H1/H2/H3: always `--font-serif`, weight 400 (not bold)
- Italic serif headings: use `<em>` for accent words in headlines
- Cards/UI: always `--font-sans`
- Section labels: all-caps, `--terra`, 0.1em letter-spacing, with a horizontal rule before
- Max line length: 70ch for article body, 55ch for lead text
- Headings on dark: `--white`; body on dark: `rgba(255,255,255,0.55)`

---

## Spacing System

**Base unit: 8px**

| Token | Value | Usage |
|-------|-------|-------|
| `--s1` | 8px | Tight gaps, icon spacing |
| `--s2` | 16px | Small gaps, inline spacing |
| `--s3` | 24px | Card padding (small), element groups |
| `--s4` | 32px | Card padding (standard), component gaps |
| `--s5` | 48px | Section sub-spacing |
| `--s6` | 64px | Section breaks, footer gap |
| `--s7` | 96px | Major section padding |
| `--s8` | 128px | Hero sections, generous page sections |

### Container
- Max-width: 1180px
- Padding: 32px desktop, 24px tablet, 16px mobile
- Narrow container (editorial): 720px
- Always use consistent padding -- never hard-code random values

---

## Buttons

### Primary
```css
background: #c8552a;
color: #ffffff;
border: 1px solid #c8552a;
padding: 13px 26px;
border-radius: 8px;
font-weight: 500;
font-size: 0.9375rem;
letter-spacing: 0.01em;
transition: all 220ms ease;
```
Hover: `background: #b84a24`, `box-shadow: 0 4px 20px rgba(200,85,42,0.22)`, `translateY(-1px)`

### Ghost (on light)
```css
background: transparent;
color: #0f0e0d;
border: 1px solid #e8e4dd;
```
Hover: `background: #f3f0eb`

### Ghost Inverse (on dark)
```css
background: transparent;
color: rgba(255,255,255,0.75);
border: 1px solid rgba(255,255,255,0.2);
```

### Sizes
- Default: 13px 26px padding
- Large (`btn-lg`): 16px 34px, font-size 1rem
- Small (`btn-sm`): 9px 18px, font-size 0.8125rem, radius 6px

---

## Cards

### Standard Card (light surface)
```css
background: #ffffff;
border: 1px solid #e8e4dd;
border-radius: 12px;
```
Hover: `translateY(-3px)`, `box-shadow: 0 12px 40px rgba(15,14,13,0.10)`

### Dark Card (on dark bg)
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 12px;
```
Hover: `border-color: rgba(255,255,255,0.16)`

### Featured Card
Add `border: 1.5px solid #c8552a` + `box-shadow: 0 0 0 3px #f4e0d6`

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| `shadow-sm` | `0 1px 3px rgba(15,14,13,0.06), 0 1px 2px rgba(15,14,13,0.04)` | Subtle lift |
| `shadow-md` | `0 4px 16px rgba(15,14,13,0.07), 0 2px 4px rgba(15,14,13,0.04)` | Card hover |
| `shadow-lg` | `0 12px 40px rgba(15,14,13,0.10), 0 4px 8px rgba(15,14,13,0.05)` | Strong elevation |
| `shadow-terra` | `0 4px 20px rgba(200,85,42,0.22)` | Primary button hover |

All shadows use warm-tinted rgba, never pure black.

---

## Icons

- Style: Feather icons / Lucide (outline, 1.5px stroke, round caps)
- Viewbox: 24x24
- Sizes: 16px (inline), 20px (UI), 24px (features), 32px (feature icons)
- On light: `stroke: var(--terra)` for accents, `stroke: var(--ink-3)` for neutral
- Wrap in a `border-radius: 12-16px` container with `background: var(--terra-3)` for icon blocks

---

## Border Radius

| Value | Usage |
|-------|-------|
| 4px | Small badges |
| 6px | Small buttons, pill tags |
| 8px | Standard buttons, inputs, small cards |
| 12px | Cards, form cards |
| 16px | Large feature cards, hero elements |
| 100px | Pills, avatar shapes, filter chips |

---

## Animations & Transitions

### Timing
```css
--t-fast: 150ms ease;     /* hover states, color changes */
--t-base: 220ms ease;     /* button transforms, card hovers */
--t-slow: 350ms ease;     /* modals, large reveals */
```

### Scroll Reveal
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
        }
    });
}, { threshold: 0.08 });
```
CSS: `opacity: 0; transform: translateY(16px);` → `opacity: 1; transform: translateY(0);` (0.5s ease)

### Motion Rules
- Use `transform` and `opacity` only (GPU accelerated)
- Respect `prefers-reduced-motion`
- Card hover: `translateY(-3px)` max. Never more than 4px.
- Button hover: `translateY(-1px)` max
- No spinning, bouncing, or attention-seeking animations

---

## Atmospheric Elements

### Radial Glows (dark sections)
```css
background: radial-gradient(circle, rgba(200,85,42,0.10) 0%, transparent 70%);
```
Use as `::after` pseudo-element, large (500-700px), positioned at corners.

### Grain Texture (hero)
```css
background-image: url("data:image/svg+xml,<svg...feTurbulence.../>"); 
opacity: 0.35;
```
Subtle noise overlay on dark hero sections. Adds depth without complexity.

### Section Labels
```css
font-size: 0.75rem;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
color: var(--terra);
display: flex;
align-items: center;
gap: 8px;
```
With a `::before` horizontal rule: `width: 24px; height: 1px; background: var(--terra);`

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Single column, reduced padding, nav hidden |
| Tablet | 768–1024px | 2-column grids, medium padding |
| Desktop | > 1024px | Full layout, 3-column grids |

### Mobile Rules
- Nav links hidden below 768px (hamburger not required for MVP)
- Grids collapse to 1 column
- Container padding: 24px → 16px
- Hero font-size: clamp handles scaling automatically
- Touch targets: minimum 44px height

---

## Section Structure Pattern

Every section follows this hierarchy:
1. `section-label` — tiny uppercase eyebrow in terracotta
2. `h2` — serif headline
3. `p` — short supporting text (max ~80 chars)
4. Content (grid, cards, etc.)

Keep section labels and supporting text short. The headline does the heavy lifting.

---

## What Not to Do

- No blue-purple gradients
- No navy (#1a1a2e) or cool blues anywhere
- No bright coral (#e94560) -- replaced by terracotta (#c8552a)
- No system font stack (always load DM Serif + Inter)
- No `border-radius > 16px` on cards
- No `box-shadow` with pure black
- No emoji in UI
- No sycophantic microcopy ("Amazing!", "You're all set! 🎉")
- No lorem ipsum -- every placeholder should reference real content

---

*This document is the source of truth for all design decisions. When in doubt: simpler, warmer, quieter.*
