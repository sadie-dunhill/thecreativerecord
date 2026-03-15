# The Creative Record - Brand Guidelines

## Visual Identity System

---

## Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#1a1a2e` | Primary brand color, headings, backgrounds, footer |
| Coral | `#e94560` | Accent color, CTAs, highlights, hover states |

### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| White | `#ffffff` | Backgrounds, cards, text on dark |
| Light Gray | `#f5f5f5` | Section backgrounds, subtle separation |
| Dark Gray | `#333333` | Body text |
| Medium Gray | `#666666` | Secondary text, captions |

### Color Usage Rules
- Navy dominates: 60% of visual weight
- White/Light Gray: 30% for space and breathing room
- Coral accents: 10% for emphasis and CTAs
- Never use coral for large background areas

---

## Typography

### Font Stack
```css
--font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 (Hero) | 56px / 3.5rem | 800 (Extra Bold) | 1.1 | -0.02em |
| H2 | 40px / 2.5rem | 700 (Bold) | 1.2 | -0.01em |
| H3 | 28px / 1.75rem | 700 (Bold) | 1.3 | 0 |
| H4 | 22px / 1.375rem | 600 (Semibold) | 1.4 | 0 |
| Body Large | 20px / 1.25rem | 400 (Regular) | 1.6 | 0 |
| Body | 16px / 1rem | 400 (Regular) | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 |
| Caption | 12px / 0.75rem | 500 (Medium) | 1.4 | 0.02em |
| Button | 16px / 1rem | 600 (Semibold) | 1 | 0.01em |

### Typography Rules
- Headings: Navy (#1a1a2e) or White on dark backgrounds
- Body text: Dark Gray (#333333) on light backgrounds
- Links: Coral (#e94560), underline on hover
- Max line length: 65 characters for optimal readability

---

## Spacing System

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 8px | Tight spacing, icon gaps |
| space-2 | 16px | Component padding, small gaps |
| space-3 | 24px | Card padding, medium gaps |
| space-4 | 32px | Section internal spacing |
| space-5 | 48px | Large component spacing |
| space-6 | 64px | Section breaks |
| space-7 | 80px | Major section padding (vertical) |
| space-8 | 120px | Hero/footer spacing |

### Section Spacing
- Standard section padding: 80px top/bottom
- Hero section: 120px top/bottom
- Mobile section padding: 48px top/bottom
- Container max-width: 1200px
- Container padding: 24px (mobile), 48px (desktop)

---

## Buttons

### Primary Button
- Background: Coral (#e94560)
- Text: White (#ffffff)
- Padding: 16px 32px
- Border-radius: 8px
- Font-weight: 600
- Hover: Darken 10%, subtle scale(1.02)
- Active: Scale(0.98)

### Secondary Button
- Background: Transparent
- Border: 2px solid Navy (#1a1a2e)
- Text: Navy (#1a1a2e)
- Padding: 14px 30px (accounts for border)
- Border-radius: 8px
- Hover: Navy background, white text

### Ghost Button (on dark backgrounds)
- Background: Transparent
- Border: 2px solid White (#ffffff)
- Text: White (#ffffff)
- Hover: White background, navy text

### Button States
```css
/* Default */
transition: all 0.2s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);

/* Active */
transform: translateY(0);
box-shadow: none;

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

---

## Cards

### Standard Card
- Background: White (#ffffff)
- Border-radius: 12px
- Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
- Padding: 24px
- Hover: translateY(-4px), shadow increases

### Feature Card
- Background: White (#ffffff)
- Border-radius: 16px
- Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06)
- Padding: 32px
- Border: 1px solid #f0f0f0

### Pricing Card (Featured)
- Background: White (#ffffff)
- Border: 2px solid Coral (#e94560)
- Border-radius: 16px
- Box-shadow: 0 8px 32px rgba(233, 69, 96, 0.15)
- "Popular" badge: Coral background, white text

---

## Form Elements

### Input Fields
- Background: White (#ffffff)
- Border: 1px solid #e0e0e0
- Border-radius: 8px
- Padding: 14px 16px
- Font-size: 16px
- Focus: Border color Coral (#e94560), subtle glow

### Labels
- Font-size: 14px
- Font-weight: 500
- Color: Navy (#1a1a2e)
- Margin-bottom: 8px

### Checkboxes/Radio
- Size: 20px x 20px
- Border: 2px solid #cccccc
- Checked: Coral (#e94560) fill
- Border-radius: 4px (checkbox), 50% (radio)

---

## Icons

### Style
- Outline style, 2px stroke
- Rounded caps and joins
- Consistent 24x24px viewbox

### Icon Sizes
| Size | Usage |
|------|-------|
| 16px | Inline with text, compact UI |
| 20px | Buttons, form elements |
| 24px | Navigation, feature icons |
| 32px | Large feature highlights |
| 48px | Hero section icons |

### Icon Colors
- Default: Navy (#1a1a2e)
- On dark backgrounds: White (#ffffff)
- Accent: Coral (#e94560)
- Muted: Medium Gray (#666666)

---

## Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Small tags, badges |
| radius-md | 8px | Buttons, inputs |
| radius-lg | 12px | Cards, modals |
| radius-xl | 16px | Large cards, feature blocks |
| radius-full | 9999px | Pills, avatars, badges |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 3px rgba(0,0,0,0.08) | Subtle elevation |
| shadow-md | 0 4px 12px rgba(0,0,0,0.08) | Cards at rest |
| shadow-lg | 0 8px 24px rgba(0,0,0,0.12) | Hover states, modals |
| shadow-xl | 0 16px 48px rgba(0,0,0,0.15) | Dropdowns, popovers |
| shadow-coral | 0 4px 16px rgba(233,69,96,0.25) | Primary button hover |

---

## Animation & Transitions

### Timing
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Common Transitions
- Button hover: 200ms ease
- Card hover: 300ms ease
- Modal open: 300ms cubic-bezier(0.16, 1, 0.3, 1)
- Page transitions: 400ms ease

### Motion Principles
- Use transform and opacity for animations (GPU accelerated)
- Avoid animating layout properties (width, height, top, left)
- Respect prefers-reduced-motion

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### Mobile-First Approach
- Base styles target mobile
- Use min-width media queries to scale up
- Touch targets minimum 44px x 44px

---

## Usage Examples

### Hero Section
```
Background: Navy (#1a1a2e)
Heading: White, 56px, extra bold
Subheading: White/70%, 20px
CTA Button: Coral primary
Padding: 120px vertical
```

### Feature Grid
```
Background: Light Gray (#f5f5f5)
Cards: White, 24px padding, 12px radius
Gap: 24px between cards
Section padding: 80px vertical
```

### Pricing Section
```
Background: White
Featured card: Coral border, larger shadow
Standard cards: Subtle shadow
Toggle: Coral accent
Section padding: 80px vertical
```

---

*Last Updated: March 14, 2026*
