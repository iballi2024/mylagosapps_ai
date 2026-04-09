# LagosApps — Technical UI/UX Product Requirements Document

**One Platform. Endless Possibilities.**
**Interface Specifications, Component Definitions, Interaction Patterns, and Accessibility Standards**

| Field | Detail |
|-------|--------|
| Document Type | Technical UI/UX PRD |
| Audience | UI/UX Designers, Frontend Engineers, QA Engineers |
| Version | 1.0 Draft |
| Date | March 2026 |
| Scope | Web (Desktop + Mobile Web) and Mobile App interfaces only. Tech stack excluded. |

---

## 1. Design System and Global Standards

### 1.1 Color Palette

| Token Name | Hex Value | Usage | Notes |
|------------|-----------|-------|-------|
| `--color-primary-dark` | `#1B5E20` | Primary CTAs, H1 headings, logo | Must meet WCAG AA contrast on white |
| `--color-primary` | `#2E7D32` | Secondary CTAs, active nav | Primary brand green |
| `--color-primary-light` | `#4CAF50` | Hover states, success toasts | Do not use as text on white |
| `--color-accent` | `#A5D6A7` | Background tints, section dividers | Use at 20% opacity max on sections |
| `--color-surface` | `#F1F8E9` | Card backgrounds, input fills | |
| `--color-text-primary` | `#1A1A1A` | Body text, labels | Minimum 4.5:1 contrast ratio |
| `--color-text-secondary` | `#555555` | Captions, metadata, secondary labels | |
| `--color-error` | `#B71C1C` | Error states, destructive actions | |
| `--color-warning` | `#E65100` | Warning banners, medium priority items | |
| `--color-success` | `#1B5E20` | Success confirmations, completed states | |
| `--color-dark-bg` | `#1A1A2E` | Dark sections (testimonials, footer) | |
| `--color-white` | `#FFFFFF` | Default surface color | |

### 1.2 Typography

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-display` | 56px | 800 | 1.1 | Hero headlines only |
| `--text-h1` | 40px | 700 | 1.2 | Page and section titles |
| `--text-h2` | 32px | 700 | 1.3 | Sub-section titles |
| `--text-h3` | 24px | 600 | 1.4 | Component titles, card headers |
| `--text-body-lg` | 18px | 400 | 1.6 | Feature descriptions, lead paragraphs |
| `--text-body` | 16px | 400 | 1.6 | Standard body text |
| `--text-body-sm` | 14px | 400 | 1.5 | Captions, metadata, fine print |
| `--text-label` | 13px | 500 | 1.0 | Form labels, tags, badges |
| `--text-button` | 16px | 600 | 1.0 | All button labels |

**Primary font:** Inter (sans-serif). **Fallback:** `system-ui, -apple-system, sans-serif`. **Display font** for hero headlines only: Inter Display or equivalent variable font. **Monospace** for code and reference numbers: JetBrains Mono or system monospace.

### 1.3 Spacing System

All spacing values must use an **8px base grid**.

```
--space-1: 4px    --space-2: 8px    --space-3: 12px   --space-4: 16px
--space-5: 20px   --space-6: 24px   --space-8: 32px   --space-10: 40px
--space-12: 48px  --space-16: 64px  --space-20: 80px  --space-24: 96px
```

### 1.4 Border Radius

```
--radius-sm: 6px     /* inputs, tags */
--radius-md: 12px    /* cards, modals */
--radius-lg: 20px    /* CTAs, large containers */
--radius-pill: 100px /* pills, badges */
--radius-full: 50%   /* avatars, circular icons */
```

### 1.5 Elevation and Shadows

```
--shadow-sm:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)
--shadow-md:    0 4px 12px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.08)
--shadow-lg:    0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)
--shadow-card:  0 2px 8px rgba(0,0,0,0.06)
--shadow-modal: 0 20px 60px rgba(0,0,0,0.25)
```

### 1.6 Breakpoints

```
--bp-xs:  375px   /* Minimum supported (iPhone SE) */
--bp-sm:  390px   /* Standard mobile (iPhone 14) */
--bp-md:  768px   /* Tablet */
--bp-lg:  1024px  /* Desktop minimum */
--bp-xl:  1280px  /* Standard desktop */
--bp-2xl: 1440px  /* Wide desktop */
```

**Mobile-first approach:** all base styles target 375px. Media queries add layout complexity for larger screens. No functionality may be desktop-only. No content may be hidden on mobile unless it is a true desktop-exclusive affordance (e.g., hover tooltip).

---

## 2. Component Library Specifications

### 2.1 Button Component

#### 2.1.1 Variants and Specifications

| Variant | Background | Height | Min Width | Usage |
|---------|-----------|--------|-----------|-------|
| Primary | `#1B5E20` solid | 52px (desktop) / 48px (mobile) | 160px | Transaction CTAs: Book, Pay, Subscribe, Order |
| Secondary | Transparent + `#1B5E20` border | 52px / 48px | 160px | Secondary actions, comparisons |
| Ghost | Transparent, no border | 44px / 44px | 120px | Tertiary links, cancel actions |
| Destructive | `#B71C1C` solid | 52px / 48px | 160px | Delete, cancel subscription, reject |
| WhatsApp | `#25D366` solid | 52px / 48px | 160px | WhatsApp CTAs only |
| Disabled (all) | `#CCCCCC` solid | Same as parent | Same as parent | Non-interactive states |

#### 2.1.2 Button States

- **Default:** As specified above.
- **Hover (desktop only):** Background darkens by 8% (`filter: brightness(0.92)`). `cursor: pointer`.
- **Active/Pressed:** Background darkens 15%. `scale: 0.98`. Transition: 80ms ease.
- **Loading:** Text replaced with spinner (16px, white). Button width locked. User cannot re-click. Minimum loading duration: 400ms to prevent flicker.
- **Success:** Button turns `#1B5E20` with checkmark icon for 1500ms, then dismisses or navigates. Never leave the user on a blank loading state.
- **Focus (keyboard):** 3px `#1B5E20` outline with 2px offset. Never remove focus indicators.
- **Disabled:** Opacity 0.4. `cursor: not-allowed`. No pointer events.

#### 2.1.3 Touch Targets

All interactive elements (buttons, links, icons, form controls) must have a minimum touch target of **48×48px** on mobile. Use padding or invisible touch area expansion if the visual element is smaller. **Non-negotiable for mobile users.**

---

### 2.2 Form Components

#### 2.2.1 Input Field Specification

| Property | Value |
|----------|-------|
| Height | 52px (desktop), 48px (mobile) |
| Border (default) | `1.5px solid #CCCCCC`, border-radius: 8px |
| Border (focused) | `2px solid #1B5E20`, no box-shadow required |
| Border (error) | `2px solid #B71C1C` |
| Background | `#FFFFFF` (default), `#F1F8E9` (focused) |
| Font | 16px Inter, color: `#1A1A1A` |
| Placeholder | 16px Inter, color: `#AAAAAA` |
| Label | 13px Inter Medium, color: `#555555`, margin-bottom: 6px |
| Error message | 12px Inter, color: `#B71C1C`, margin-top: 4px with error icon |
| Helper text | 12px Inter, color: `#777777`, margin-top: 4px |

#### 2.2.2 Required Form Behaviors

- All required fields must show a visual indicator (asterisk or 'Required' label). Never rely on color alone.
- **Inline validation:** Error messages appear on blur, not on keystroke, to avoid premature error states.
- **Phone number fields:** auto-format as user types (e.g., `0801 234 5678`). Include country code selector defaulting to `+234`.
- **Amount/currency fields:** format with commas on blur (e.g., `30,000`). Show Naira symbol (₦) prefix.
- All forms must have a single primary submit button. Secondary actions (save draft, back) use ghost buttons.
- Form submission must trigger a **loading state** on the submit button immediately on click.
- All public-facing forms must implement **Google reCAPTCHA v3** (invisible) or v2 checkbox for high-risk forms.

---

### 2.3 Card Component

#### 2.3.1 Service Card (Homepage and Subsidiary Pages)

| Property | Value |
|----------|-------|
| Width | Responsive: 280px (min), grows to fill grid column |
| Padding | 24px all sides |
| Background | `#FFFFFF` |
| Border | None by default. `1px solid #E0E0E0` optional |
| Border radius | 16px |
| Shadow | `var(--shadow-card)` |
| Hover (desktop) | Translate Y: -4px, shadow upgrades to `var(--shadow-md)`. Transition: 200ms ease |
| Icon area | 48×48px icon, centered, margin-bottom: 16px |
| Title | `var(--text-h3)`, color: `--color-primary-dark` |
| Subtitle | `var(--text-label)`, color: `--color-primary`, uppercase, letter-spacing: 0.5px |
| Body | `var(--text-body)`, color: `--color-text-primary`, max 3 lines on card view |
| CTA link | `var(--text-body)` bold, color: `--color-primary`. Arrow icon 12px. Underline on hover. |

#### 2.3.2 Product Card (Store Views)

| Property | Value |
|----------|-------|
| Image | 16:9 ratio, lazy loaded, alt text required |
| Title | `var(--text-body)` bold, 2 lines max with ellipsis overflow |
| Price | `var(--text-h3)` bold, color: `--color-primary-dark`, Naira symbol prefix |
| Add to Cart | Primary button, full width, height: 44px |
| Sold Out state | Disabled overlay on image, greyed button with 'Out of Stock' text |
| Badge (optional) | Position: top-left overlay. Max 1 badge (New, Sale, Popular) |

#### 2.3.3 Event Card (Mainland Events)

| Property | Value |
|----------|-------|
| Layout | Horizontal card: date block on left, content on right |
| Date block | 64×64px solid background using `--color-primary`. White text: day (24px bold) above month (12px) |
| Title | `var(--text-h3)`, 2 lines max |
| Description | `var(--text-body-sm)`, 3 lines max with 'Read More' |
| CTA | Ghost button: 'View Event' or Primary: 'Book Ticket' |
| Past events | Greyscale filter on image/date block, label: 'Past Event' |

---

### 2.4 Navigation Components

#### 2.4.1 Desktop Navigation

- Sticky top navigation bar, height: **72px**, background: `#FFFFFF`, border-bottom: `1px solid #F0F0F0` on scroll.
- **Left:** LagosApps logo (48px height).
- **Center:** Navigation links. Max 5 items. Font: `var(--text-body)` medium. Active state: color `--color-primary` + bottom border `2px solid --color-primary`.
- **Right:** Wallet balance (if logged in) + My Account button (Primary) + Dark mode toggle.
- If logged in: replace My Account with avatar + dropdown: Dashboard, Orders, Wallet, Membership, Sign Out.
- On scroll past 100px: apply `box-shadow: var(--shadow-sm)` to nav bar.

#### 2.4.2 Mobile Navigation

- **Top bar:** Logo left, hamburger icon right (44×44px touch target), wallet balance icon center if logged in.
- Hamburger opens a **full-screen overlay menu** from the right (slide-in, 300ms). Includes all subsidiary links, account links, and a WhatsApp CTA.
- **Bottom fixed tab bar** (logged-in views only): Home | Services | Cart | Orders | Account. Height: 64px. Tab icon 24px + label 11px. Active tab: `--color-primary`.
- Page content must add `padding-bottom: 80px` when bottom bar is visible.

#### 2.4.3 Subsidiary Sub-Navigation

Each subsidiary page must include a **horizontal scrollable tab bar** beneath the main navigation showing the subsidiary's main sections.

- Example for Mainland Solar: `Overview | Solar Audit | Packages | Equipment Store | FAQ | Affiliate Program`
- Tabs: 40px height, underline active state, scroll behavior: snap to active tab on page load.

---

### 2.5 Modal and Sheet Components

#### 2.5.1 Modal (Desktop)

| Property | Value |
|----------|-------|
| Max width | 560px (small), 720px (medium), 960px (large) |
| Padding | 32px |
| Overlay | `rgba(0,0,0,0.6)`, full screen |
| Animation | Scale 0.95→1.0, opacity 0→1. Duration: 200ms ease-out |
| Close button | 24px X icon, top-right corner, 40×40px touch target |
| Focus trap | Keyboard focus must be trapped inside modal when open |
| ESC key | Must close modal and return focus to trigger element |
| Scroll behavior | Modal content scrolls independently. Background does not scroll. |

#### 2.5.2 Bottom Sheet (Mobile)

All modal interactions on mobile must use a bottom sheet pattern instead of a centered modal.

- Slides up from bottom (`transform: translateY`)
- Handle bar at top center (40×4px, grey, rounded)
- Max height: 90vh
- Backdrop: `rgba(0,0,0,0.5)`
- Dismissed by swiping down or tapping backdrop
- Use spring physics for animation (stiffness: 300, damping: 30)

---

## 3. Page-Level UI Specifications

### 3.1 Homepage

#### 3.1.1 Layout Structure (top to bottom)

1. Navigation bar (sticky, 72px desktop / 64px mobile)
2. Hero section
3. Subsidiary logo strip
4. Ecosystem description section
5. Service category cards grid
6. Membership tiers section
7. Benefits section
8. Testimonials and social proof
9. CTA banner (WhatsApp + App download)
10. Contact form
11. Footer

#### 3.1.2 Hero Section Specification

| Property | Value |
|----------|-------|
| Desktop layout | Two-column: 50% text left, 50% visual right |
| Mobile layout | Single column: visual above (60vh), text below |
| Background | `linear-gradient(135deg, #F1F8E9 0%, #FFFFFF 60%)` |
| Headline | `var(--text-display)`, 56px, weight 800, line-height 1.1 |
| Sub-headline | `var(--text-body-lg)`, max 2 lines (desktop), 3 lines (mobile) |
| Primary CTA | 'Browse Services' or 'Get Started' — Primary button, full-width on mobile |
| Secondary CTA | 'Download the App' — Ghost button |
| WhatsApp CTA | Green WhatsApp button with icon: 'Order on WhatsApp' with number |
| Service selector tabs | Horizontally scrollable chip tabs below sub-headline: Food \| Transport \| Solar \| Health \| Events \| Shop |
| Floating callout cards | 3 cards on hero image. Each: white background, shadow-md, 160×60px, icon + text. Clickable to relevant service. |
| Min height (desktop) | 600px |
| Min height (mobile) | 100svh |

#### 3.1.3 Subsidiary Logo Strip

| Property | Value |
|----------|-------|
| Layout | Horizontal scroll on mobile, full-width flex row on desktop |
| Logo height | 40px (desktop), 32px (mobile) |
| Spacing | 40px between logos |
| Behavior | Auto-scroll animation (scroll left, loop), pauses on hover |
| Interaction | Each logo links to the subsidiary sub-page. Scales to 1.05 on hover (150ms). |
| Accessibility | Each logo requires descriptive alt text (e.g., 'Van Lagos - Transport and Logistics') |

#### 3.1.4 Service Category Cards Grid

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop | 4 | 24px |
| Tablet | 2 | 20px |
| Mobile | 1 | 16px |

Cards required: Solar, Transport/Cars, Food/Groceries, Health/Wellness, Events/Studios, Books *(Coming Soon)*, A Better You, OasisCharge *(Coming Soon)*

#### 3.1.5 Membership Tier Cards

| Property | Value |
|----------|-------|
| Layout | 3 cards side by side (desktop), vertical stack (mobile) |
| Middle card (Silver) | Visually elevated: larger shadow, 'Most Popular' badge, `scale(1.02)` |
| Toggle | Monthly / Yearly pill toggle. Yearly shows 'Save 15%' badge. |
| Price animation | Price number animates (count-up/down) when toggling cycle |
| Subscribe CTA | Primary button, full width. Opens auth modal if not logged in. |
| Feature list | Checkmark bullets using `--color-primary` SVG icon. Never image-based checkmarks. |

---

### 3.2 User Authentication Screens

#### 3.2.1 Registration Flow (completable in under 60 seconds — 3 screens)

1. **Screen 1:** Phone number entry + country code selector (default `+234`). Continue button. Link to sign in.
2. **Screen 2:** OTP verification. 6-digit code via SMS. Auto-advance on 6 digits. Resend countdown (60s). 6 individual input boxes (not one text field).
3. **Screen 3:** Profile completion. Name (required), email (optional), password (required, show/hide toggle). Pre-fill delivery address option. Land on dashboard.

#### 3.2.2 Login Flow

- Phone number + password. Show/hide toggle. Forgot password link.
- Option to log in via OTP (no password).
- Failed login: show error after 1 attempt. Lock account after 5 failed attempts with unlock instructions.

---

### 3.3 User Dashboard

#### 3.3.1 Dashboard Layout

| Property | Value |
|----------|-------|
| Desktop layout | Left sidebar navigation (240px) + main content area |
| Mobile layout | Bottom tab navigation + full-width main content |
| Sections | Overview, Orders, Wallet, Membership, Referrals, Profile |
| Overview cards | Wallet Balance, Active Orders, Membership Status, Referral Earnings — 4 cards (desktop), 2×2 grid (mobile) |

#### 3.3.2 Wallet UI

- Large balance display: currency symbol (32px), balance number (64px bold).
- Two primary actions: **'Add Money'** (Primary) and **'View Transactions'** (Ghost).
- Transaction history list: date, description, amount (green credit / red debit), running balance.
- Add Money flow: enter amount (min N1,000) → select payment method (saved card, new card, bank transfer, USSD) → confirm → real-time balance update.

---

### 3.4 Transaction and Checkout Flow

#### 3.4.1 Universal Checkout Flow (all subsidiaries)

> This is the most critical UI flow on the entire platform.

1. **Service Selection** — clear pricing, no hidden fees.
2. **Configuration** — date, quantity, delivery address, etc. Incomplete fields prevent progress with inline validation.
3. **Order Summary** — full breakdown: service, quantity, price, discounts, delivery fee, total. Prominent edit button.
4. **Payment** — three methods: Wallet (shows balance), Saved Card, New Card/Bank Transfer. Default to Wallet if balance sufficient. Discount/referral code field.
5. **Confirmation** — 'Pay ₦[amount] Now' Primary button. After tap, button enters loading state.
6. **Receipt** — full-screen success state with order reference, summary, and options: 'View Order' and 'Share on WhatsApp'. Auto-send receipt to email and WhatsApp.

#### 3.4.2 Checkout UI Requirements

- Checkout flow must be a **full-screen overlay on mobile** (not navigate away from product page).
- **Progress indicator** (1 of 4, 2 of 4, etc.) visible at top of checkout overlay.
- Back button must always be visible. Never trap a user without an exit.
- Payment loading state shows 'Processing your payment...' with spinner. Do not timeout this screen.
- Payment failure: show specific error (e.g., 'Insufficient funds', 'Card declined'). Never generic errors. Offer retry or method switch.
- Successful payment triggers **haptic feedback** on mobile (vibrate API).

---

### 3.5 Mainland Solar Subsidiary Page

#### 3.5.1 Solar Audit Questionnaire UI

Multi-step form with branching logic:

- **Step indicator:** horizontal progress bar, updates dynamically based on selected path.
- Each question uses **large tap-target selection cards** (minimum 80px height on mobile) rather than radio buttons. Selected state: green border + green checkmark + light green background.
- **Branching:** 'Home' selection slides in a new step from right; business type selection fades in the audit booking form.
- **Recommendation display:** after home selection, show recommended system in a highlighted card with price range, system image, and two CTAs: 'Book Audit' (Primary) and 'Buy This Package' (Secondary).
- **Form animation:** each step transition uses horizontal slide (300ms ease-in-out). No page reloads. Client-side interactive form.

#### 3.5.2 Solar Hub Booking Calendar

| Property | Value |
|----------|-------|
| Calendar view | Monthly calendar with availability dots: Green = available, Red = booked, Yellow = partially available |
| Time slots | After date selection, show available time slots as pill chips |
| Duration selection | Slider or increment/decrement for hours. Price updates in real-time. |
| Booking summary | Sticky panel (desktop sidebar / mobile bottom sheet) showing date, time, duration, and total cost |
| Deposit | Minimum 40% deposit required. Balance due on arrival. Show this clearly. |

---

### 3.6 Mainland Events Page

#### 3.6.1 Event Card Design

- Date block on left: 64px wide, full card height. Day (large, bold) over month abbreviation.
- Event title: max 2 lines with ellipsis. Font: `var(--text-h3)`.
- Short description: max 3 lines with 'Read More' link.
- CTA: 'Book Ticket' (Primary) for ticketed, 'Register Free' (Secondary) for free, 'View Gallery' (Ghost) for past events.
- **Filter tabs above list:** All | Upcoming | Past | Conferences | Concerts | Community. Active filter underlines in `--color-primary`.

---

## 4. Accessibility Standards

### 4.1 WCAG 2.1 AA Compliance (Minimum)

- All text must meet **minimum 4.5:1 contrast ratio**. Large text (18px+ bold / 24px+ regular) requires 3:1.
- No information conveyed by color alone. Error states must use icon + text, not color change only.
- All interactive elements are keyboard navigable in a logical tab order.
- Focus indicators must always be visible (never `outline: none` without a replacement).
- All images, icons, and non-text content must have descriptive alt text. Decorative images use `alt=""`.
- All form inputs have associated labels (`label`, `aria-label`, or `aria-labelledby`).
- Error messages are programmatically associated with form fields using `aria-describedby`.
- All modals and overlays must announce their opening to screen readers (`aria-live` or `role="dialog"`).
- Touch targets minimum **48×48px** on all mobile interactive elements.

### 4.2 Loading and Performance

- **LCP (Largest Contentful Paint):** under 2.5s on 4G mobile.
- **CLS (Cumulative Layout Shift):** under 0.1. Reserve space for images with `aspect-ratio` or explicit `width`/`height`.
- **FID (First Input Delay):** under 100ms.
- All images lazy loaded below the fold. Hero image must be preloaded.
- All images must have defined `width` and `height` attributes.
- **Loading skeleton screens** for dynamic content (product lists, order history, wallet balance). Never show blank spaces.

### 4.3 Error and Empty States

Every list view, data display, and interactive section must define all three states:

| State | Visual | CTA |
|-------|--------|-----|
| Empty | Illustration or icon (80px), friendly headline, 1-sentence explanation | Action button (e.g., 'Start Shopping', 'Book Your First Service') |
| Loading | Skeleton screens matching loaded content layout. Animated shimmer. No spinners for content areas. | None during load — content replaces skeleton seamlessly. |
| Error | Red/orange icon, specific error message (not 'Something went wrong'). Show error code for support reference. | 'Try Again' button + 'Contact Support' link |

---

## 5. Interaction Patterns and Motion Specifications

### 5.1 Animation Principles

- All animations must serve a purpose: communicate state change, guide attention, or provide feedback. **No decorative animations that delay the user.**
- **Respect `prefers-reduced-motion`:** all animations must have a no-motion fallback.
- **Durations:** micro-interactions (hover, tap) 80–150ms; state changes (modal, drawer) 200–300ms; page transitions 300–400ms.
- **Easing:** `ease-out` for elements entering; `ease-in` for elements leaving; `ease-in-out` for position changes.

### 5.2 Notification and Toast System

| Type | Color | Usage and Duration |
|------|-------|-------------------|
| Success | `#1B5E20` left border | Payment confirmed, order placed, profile saved. Auto-dismiss after 4s. |
| Error | `#B71C1C` left border | Payment failed, form error, server error. Stays until dismissed. |
| Warning | `#E65100` left border | Session expiring, low wallet balance (below N500). Stays until dismissed. |
| Info | `#0D47A1` left border | New feature, update available, delivery status change. Auto-dismiss after 6s. |

**Toast position:** bottom-center on mobile, top-right on desktop. Max 3 toasts visible at once. Stack vertically with 8px gap. Slide in from bottom/right, slide out same direction. User can tap to dismiss.

### 5.3 WhatsApp Floating Action Button

| Property | Value |
|----------|-------|
| Size | 56×56px circle |
| Position | Fixed: bottom-right, 20px from edge. On mobile: 20px above bottom tab bar if visible. |
| Icon | WhatsApp SVG icon, white, 28px |
| Color | `#25D366` (WhatsApp green) |
| Shadow | `var(--shadow-lg)` |
| On tap | Opens WhatsApp chat link with pre-filled message: 'Hi, I would like to place an order on LagosApps' |
| Expanded state | On first visit: tooltip label 'Order on WhatsApp' auto-dismisses after 4s |
| Visibility | All pages **except** during active checkout flow (to prevent distraction) |

---

## 6. Responsive Layout Specifications

### 6.1 Grid System

| Breakpoint | Columns | Gutter | Margin | Max Content Width |
|------------|---------|--------|--------|-------------------|
| Mobile (375–767px) | 4 | 16px | 16px | 100% |
| Tablet (768–1023px) | 8 | 20px | 32px | 100% |
| Desktop (1024–1279px) | 12 | 24px | 40px | 100% |
| Wide (1280px+) | 12 | 24px | auto | 1280px (centered) |

### 6.2 Critical Mobile-Specific UI Rules

- **Font sizes:** Never below 14px on mobile. Minimum body text is 16px. Reducing font size to 'fit more' is prohibited.
- **Horizontal scrolling:** Prohibited everywhere except the subsidiary logo strip (which has visible scroll indicators) and data tables with explicit overflow context.
- **Input zoom prevention:** All form inputs must have `font-size: 16px` minimum. iOS zooms the page on inputs smaller than 16px.
- **Safe areas:** All fixed/sticky elements must respect iOS safe area insets (`env(safe-area-inset-bottom)`) to avoid overlap with home bar.
- **Tap highlight removal:** `-webkit-tap-highlight-color: transparent` on interactive elements. Replace with custom active state.
- **Image optimization:** All product and service images served in **WebP** format with JPEG fallback. Responsive images using `srcset`.

---

## 7. Critical Form Specifications

### 7.1 Solar Audit Form (Paid Booking)

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required, min 3 chars, no numbers |
| Phone Number | Tel with `+234` prefix | Required, 10–11 digits after country code |
| Email Address | Email | Optional, valid email format if provided |
| Property Address | Textarea | Required, min 20 chars |
| Property Type | Select / Segmented control | Required: Home / Office / Industrial / Other |
| Preferred Audit Date | Date picker | Required, minimum 2 business days from today |
| Preferred Time Slot | Time picker | Required, 8am–5pm Mon–Fri only |
| Additional Notes | Textarea | Optional, 500 char limit |
| Audit Fee Payment | Payment component | Required before form submission completes |

### 7.2 Membership Subscription Form

| Field | Type | Notes |
|-------|------|-------|
| Selected Tier | Pre-filled from selection | Read-only, shows tier name and price |
| Billing Cycle | Toggle: Monthly / Yearly | Updates displayed price dynamically |
| Full Name | Text | Auto-filled if logged in |
| Phone Number | Tel | Auto-filled if logged in |
| Email | Email | Required for billing receipts |
| Payment Method | Card/Bank selector | Saved methods shown first |
| T&C Agreement | Checkbox | Required. Must be explicitly checked — never pre-checked. |
| Payment | Payment component | Final step. Summary visible above. |

---

## 8. Anti-Spam and Form Security

### 8.1 Anti-Spam Measures

- **Google reCAPTCHA v3:** Implement on all public forms. Score threshold of 0.5. Forms scoring below threshold require explicit v2 checkbox challenge.
- **Honeypot fields:** Include a hidden form field in every form. Submissions with this field filled are rejected silently.
- **Rate limiting:** Maximum 3 form submissions per IP address per hour for free/registration forms.
- **Email verification:** All event registrations require email verification before confirmation. Send verification email with 24-hour expiry link.
- **Phone OTP:** All paid transactions must verify the customer's phone number via OTP before payment.
- **Bot behavior detection:** Track and flag interactions completed too fast for human input (form completion under 3 seconds).

### 8.2 Contact Form Validation

- **Email field:** validate domain MX records server-side. Reject clearly invalid domains.
- **Message field:** minimum 20 characters. Maximum 2,000 characters.
- **Subject field:** minimum 5 characters. Maximum 100 characters.
- **Submit button:** disabled for 3 seconds after successful submission to prevent double-clicks.
- **Duplicate detection:** same email + subject submitted within 60 minutes returns 'message already sent' without saving a duplicate.

---

## 9. QA and Design Review Checklist

### 9.1 Design Review Gates

- [ ] All colors used are from the design token system. No ad-hoc hex values.
- [ ] All typography uses the defined type scale. No unlisted font sizes.
- [ ] All spacing values are multiples of 8px.
- [ ] All interactive elements have hover, active, focus, and disabled states designed.
- [ ] Loading, empty, and error states are designed for every dynamic content area.
- [ ] All forms have inline validation designs for both error and success states.
- [ ] Mobile view reviewed at 375px and 390px viewport widths.
- [ ] No horizontal overflow at any breakpoint.

### 9.2 Frontend Implementation Gates

- [ ] Transaction flow tested end-to-end with a real test card on the payment gateway staging environment.
- [ ] All form submissions generate an email and/or WhatsApp receipt as specified.
- [ ] Page speed score (Lighthouse) minimum **80 on mobile** for each page.
- [ ] All images have alt text. Verified using automated accessibility scan.
- [ ] Keyboard navigation tested through all interactive flows without a mouse.
- [ ] WhatsApp floating button tested on both iOS Safari and Android Chrome.
- [ ] reCAPTCHA verified on all public-facing forms.
- [ ] Payment failure and network error states tested deliberately by simulating failures.

---

*End of Technical UI/UX PRD*
