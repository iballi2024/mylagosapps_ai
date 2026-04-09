# LagosApps — Functional Requirements Document: Order Flows

**One Platform. Endless Possibilities.**

| Field | Detail |
|-------|--------|
| Document Type | Functional Requirements Document (FRD) |
| Audience | Frontend Engineers, Backend Engineers, QA Engineers |
| Version | 1.0 |
| Date | April 2026 |
| Scope | All ordering and booking flows across all LagosApps subsidiaries |
| Design Constraint | Every order must be completable within **2 minutes** of landing on the platform |

---

## 1. Ordering Principles

These rules apply to every flow in this document without exception:

1. **4 steps maximum** from intent to payment confirmed. No flow may exceed this.
2. **Pre-fill everything possible.** If the user is logged in, name, phone, and address fields are auto-populated.
3. **Never ask twice.** If a user saved a payment method or address, use it. Don't ask them to re-enter it.
4. **One primary action per screen.** One CTA drives the user forward. Secondary actions (edit, back) are always available but never dominant.
5. **Instant feedback.** Every tap or click shows a response within 200ms. Payment confirmation appears within 10 seconds of success.
6. **WhatsApp receipt.** Every completed order sends a confirmation + receipt to the user's WhatsApp and email automatically.

---

## 2. Pre-Order: Account and Authentication

A user must be logged in to complete any paid order. Guest browsing is allowed.

### 2.1 New User Registration (< 60 seconds)

| Step | Screen | Action |
|------|--------|--------|
| 1 | Phone Entry | User enters phone number with `+234` country code. Taps **Continue**. |
| 2 | OTP Verify | User enters the 6-digit SMS code. Auto-advances on 6th digit. |
| 3 | Profile | User enters name and password. Email is optional. Taps **Create Account**. |
| — | Dashboard | User lands on their dashboard. Account is ready to order. |

> If a user tries to order without logging in, the auth screen opens as a bottom sheet (mobile) or modal (desktop). After login they return directly to the checkout step they were on.

### 2.2 Returning User Login

| Step | Action |
|------|--------|
| 1 | Enter phone number + password. Tap **Sign In**. |
| — | Or tap **Send OTP** to log in without a password. |
| — | Redirect to the page or checkout step the user came from. |

---

## 3. Universal Checkout Flow

All subsidiaries share the same 4-step checkout shell. Subsidiary-specific configuration happens inside Step 2.

```
Step 1: Select        Step 2: Configure       Step 3: Pay         Step 4: Done
─────────────────     ───────────────────     ───────────────     ───────────────
Browse and pick  →    Dates / qty /       →   Choose method   →   Receipt sent
a product or          address / notes         and confirm         to WhatsApp
service                                       payment             and email
```

### Step 1 — Select

- User lands on a subsidiary page and taps a product, service, or booking option.
- Price is clearly visible before the user taps. No hidden fees.
- Tapping the item opens the configuration step in a full-screen overlay (mobile) or inline panel (desktop).

### Step 2 — Configure

- Fields are specific to the service (detailed per-subsidiary below).
- All fields that can be auto-filled from the user's profile are pre-filled.
- Inline validation: errors show on field blur, not on keystroke.
- A sticky **Order Summary** panel (desktop: sidebar; mobile: bottom bar) shows a live-updating total.
- User taps **Review Order** when done.

### Step 3 — Pay

- **Order summary** shown at top: item, quantity, discounts applied, total.
- **Payment method selector** shows in order:
  1. Saved card(s)
  2. New card / Bank transfer / USSD
- **Discount code** field (collapsed by default, expands on tap).
- Single large **Pay ₦[amount] Now** button.
- On tap: button enters loading state immediately. User cannot re-tap.

### Step 4 — Confirmation

- Full-screen success state.
- Shows: order reference number, item summary, estimated delivery or appointment date.
- Two actions: **View Order** (goes to order tracking) and **Share on WhatsApp**.
- Receipt auto-sent to WhatsApp and email within 30 seconds.
- Haptic feedback on mobile on success.

### Payment Failure Handling

| Failure Reason | Message Shown | Next Action |
|----------------|--------------|-------------|
| Card declined | "Your card was declined. Please check your card details." | Try Again / Use Different Card |
| Bank transfer timeout | "We haven't received your payment yet." | Retry / Contact Support |
| Network error | "Something went wrong. Your card was not charged." | Try Again |

---

## 4. Per-Service Order Flows

### 4.1 Food and Groceries (Mainland Meals / LagosCart)

**Target: order placed in under 2 minutes.**

```
Browse → Add to Cart → Checkout (address + timeslot) → Pay
```

| Step | What Happens |
|------|-------------|
| 1. Browse | User opens LagosCart. Tabs: Fresh Meals / Staples / Baked Goods / Household / Office. Browses product cards with photo, name, and price. |
| 2. Add to Cart | User taps **Add** on a product card. Cart icon in nav bar updates with item count. User can keep browsing and adding. |
| 3. Checkout | User taps cart icon → sees order summary → confirms delivery address (auto-filled if saved) → selects delivery time slot. |
| 4. Pay | Selects payment method → taps **Pay Now** → confirmation screen. |

**Rules:**
- Minimum order amount: to be set by the finance team.
- Delivery address auto-filled from saved profile. User can change or add a new address.
- Delivery time slots shown as selectable chips (e.g., Today 2pm–4pm / Today 4pm–6pm / Tomorrow 9am–11am).
- Bronze members: 3% discount applied automatically. Silver: 7%. Gold: 15%.
- Free grocery delivery applied automatically for Silver (1×/month) and Gold (2×/month) members.

**Amazon / Alibaba Request (special flow):**

| Step | What Happens |
|------|-------------|
| 1 | User taps **Request from Amazon/Alibaba** |
| 2 | Fills: Product name or URL, description, quantity, preferred budget |
| 3 | Submits request (no payment at this step) |
| 4 | LagosApps team reviews, sends a quote to user's WhatsApp within 24 hours |
| 5 | User approves quote via WhatsApp link → pays → order is placed |

---

### 4.2 Transport and Logistics (Van Lagos)

**Booking flow for van, bus, and car rental.**

```
Select vehicle type → Set dates + location → Confirm vehicle → Pay deposit
```

| Step | What Happens |
|------|-------------|
| 1. Select type | User chooses: Cargo Van / Passenger Bus / Car Rental / EV. |
| 2. Set details | Enters pickup location, destination (for vans/buses) or rental start and end dates (for cars). |
| 3. Choose vehicle | System shows available vehicles with name, capacity, and price. User selects one. Car rental requires uploading driver's licence + ID photo. |
| 4. Pay | Deposit or full amount (as shown). Confirmation sent via WhatsApp with booking reference. |

**Rules:**
- Car rental: minimum 3-day booking.
- Vehicle availability is real-time. Unavailable vehicles are not shown.
- Silver members: 1 free car or van/bus rental per year. If benefit is unused, it is applied automatically at Step 4.
- Pricing shown upfront with no hidden charges (fuel, insurance policy displayed before payment).

---

### 4.3 Solar — Audit Booking (Mainland Solar)

**This flow qualifies the customer and collects the audit fee.**

```
Questionnaire (2 questions) → Audit booking form → Pay audit fee
```

| Step | What Happens |
|------|-------------|
| 1. Property use | User selects: Home / Office / Industrial / Other / Just Learning. Large tap-target cards, not dropdowns. |
| 2a. (Home path) | User selects dwelling type: Standalone / Duplex / 2–3 Bed Flat / 1 Bed / Single Room. System immediately shows recommended package card with price. User taps **Book Audit**. |
| 2b. (Business path) | Audit booking form appears: company name, address, contact, preferred date and time slot. |
| 3. Pay | User pays the N30,000–N40,000 audit fee (price confirmed by finance team) to lock the booking. |
| 4. Confirm | Booking confirmed. Date and time sent to WhatsApp. Audit fee credited toward installation cost. |

**Bronze members:** audit fee waived (benefit applied automatically).

---

### 4.4 Solar — Package Purchase (Mainland Solar)

**For customers ready to buy without an audit first.**

```
Select package → Review specs → Pay (full or installment)
```

| Step | What Happens |
|------|-------------|
| 1 | User browses solar packages: Generator (250W–2.5KW) / 3KW / 5KW / 8KW / 10KW+. Each card shows system size, included components, and price. |
| 2 | User taps a package → sees full spec breakdown → chooses **Pay in Full** or **Apply for Installment**. |
| 3a. Pay in Full | Proceeds to standard checkout (Step 3–4 of universal flow). Gold members: 10% discount applied. |
| 3b. Installment | SOHCAHTOA application form: name, address, employment details, property photos. Submitted to finance partner for review. Not a live approval — team follows up via WhatsApp within 2 business days. |

---

### 4.5 Solar — Equipment Store (Mainland Solar)

Identical to the grocery cart flow (Section 4.1) but for solar equipment.

```
Browse products → Add to cart → Checkout → Pay
```

Products from Taico, Veichi, Torchn, and Bluesun. Items include inverters, batteries, solar panels, and charge controllers.

---

### 4.6 Health — Paid Services (Mainland Clinics)

```
Select service → Book slot → Pay → Confirmation
```

| Service | Booking Detail |
|---------|---------------|
| Teleconsultation | Same-day available. User picks date and time slot. Pays full fee at booking. |
| Home medical test | 24-hour advance booking required. User enters home address (auto-filled). Pays full fee. |
| Live-in nurse | User fills: care type (post-op / elderly), duration, start date, address. Team quotes via WhatsApp within 24 hours. User approves and pays deposit. |
| Ambulance (non-emergency) | User enters pickup address, destination, and date/time. Pays booking fee. |
| Medical supplies store | Same cart flow as Section 4.1. |
| Wellness retreat | Minimum 2-night booking. User picks dates from calendar. Pays 40% deposit. Balance on arrival. |

**Free Health Check (Bronze+ members):**

| Step | What Happens |
|------|-------------|
| 1 | User taps **Register for Free Health Check** |
| 2 | Selects preferred Friday (1st or 3rd of the month) |
| 3 | Confirms name and phone number (auto-filled) |
| 4 | Registration confirmed via WhatsApp. No payment required. |

---

### 4.7 Events — Book a Ticket (Mainland Events)

```
Browse events → Select event → Choose tickets → Pay
```

| Step | What Happens |
|------|-------------|
| 1 | User browses event cards (filter tabs: All / Upcoming / Conferences / Concerts / Community). |
| 2 | Taps **Book Ticket** on event card. Event detail screen shows: description, date, venue, ticket types, and price. |
| 3 | User selects ticket quantity (and type if multiple tiers). |
| 4 | Proceeds to standard checkout. Ticket QR code sent to WhatsApp and email. |

**Free events:** User taps **Register Free** → enters name + phone (auto-filled) → confirms email → registration confirmed via WhatsApp. No payment step.

**Gold members:** 15% discount on ticketed events applied automatically.

---

### 4.8 Venue / Studio Hire (Studios Mainland)

```
Select space → Pick date and duration → Pay deposit
```

| Step | What Happens |
|------|-------------|
| 1 | User selects space type: Conference Room / Event Hall / TV Studio / Audio Studio. |
| 2 | Monthly calendar shows availability. User picks date and time slot. Duration selector (slider or +/– buttons) updates price in real-time. |
| 3 | Order summary shows: space, date, time, duration, total. Deposit (minimum 40%) shown clearly. Balance due on arrival. |
| 4 | User pays deposit. Booking confirmation sent to WhatsApp with booking reference and event coordinator contact. |

**Silver members:** priority booking — calendar shows available slots 48 hours before general public.
**Gold members:** 15% discount applied automatically.

---

### 4.9 EV Charging Installation (OasisCharge)

```
Select package → Enter address → Pay deposit → Team contacts user
```

| Step | What Happens |
|------|-------------|
| 1 | User browses charger packages (home / commercial). |
| 2 | Enters installation address. |
| 3 | Pays deposit. |
| 4 | OasisCharge team contacts user via WhatsApp within 1 business day to confirm site visit date. |

---

### 4.10 Freight (DFWTruck)

DFWTruck operates on a **quote-first** model. No direct payment on first contact.

```
Fill request form → Receive quote on WhatsApp → Approve → Pay
```

| Step | What Happens |
|------|-------------|
| 1 | User fills: cargo description, weight/volume estimate, pickup address, destination, preferred date. |
| 2 | Submits form. No payment required. |
| 3 | DFWTruck team sends a quote to user's WhatsApp within 4 business hours. |
| 4 | User taps the payment link in WhatsApp → pays deposit → booking confirmed. |

---

### 4.11 Donations and Sponsorships (Mainland Foundation / TEPLEARN)

```
Choose cause → Enter amount → Pay
```

| Step | What Happens |
|------|-------------|
| 1 | User selects: Education / Health / Youth Intervention / Single Sponsorship. |
| 2 | Enters donation amount (suggested amounts shown as quick-select chips: ₦1,000 / ₦5,000 / ₦10,000 / Custom). |
| 3 | Proceeds to standard checkout. Receipt sent to email. Impact summary sent to WhatsApp. |

---

### 4.12 Membership Subscription

```
Select tier → Choose billing cycle → Pay → Benefits activated immediately
```

| Step | What Happens |
|------|-------------|
| 1 | User views membership tier cards (Bronze / Silver / Gold). Toggles Monthly / Yearly billing. Taps **Subscribe**. |
| 2 | Subscription form auto-fills name, phone from profile. User selects payment method. Checks T&C checkbox (never pre-checked). |
| 3 | Taps **Subscribe Now** → payment processed. |
| 4 | Confirmation screen: tier activated, benefits listed. Welcome message sent to WhatsApp. Renewal date shown. |

**Upgrade:** User can upgrade tier at any time from Dashboard → Membership. Prorated billing applied automatically.

---

## 5. WhatsApp Ordering Flow

WhatsApp ordering is a parallel channel available for: Mainland Meals/LagosCart, Van Lagos, Mainland Solar (audit booking), Mainland Clinics (appointment booking), and Mainland Events (venue enquiries).

```
Message LagosApps → Bot menu → Select service → Configure → Pay via link → Done
```

| Step | What Happens |
|------|-------------|
| 1 | User taps the WhatsApp FAB on the site, or messages the LagosApps WhatsApp number directly. |
| 2 | Bot sends: "Hi [Name]! What would you like to do today?" with numbered menu options. |
| 3 | User replies with a number or keyword. Bot navigates to the relevant service. |
| 4 | Bot asks for required details (e.g., "What items would you like to order?", "What date works for you?"). |
| 5 | Bot sends an order summary message: items, total, delivery address. User replies **CONFIRM** or **EDIT**. |
| 6 | Bot sends a **Paystack payment link**. User taps link, completes payment. |
| 7 | On payment success, bot sends: PDF invoice + order reference + estimated delivery/appointment time. |
| 8 | Order status updates (confirmed, in progress, delivered) sent automatically via WhatsApp. |

**WhatsApp bot menu options:**
```
1. Order Food / Groceries
2. Book a Vehicle
3. Book a Solar Audit
4. Book a Health Appointment
5. Enquire About an Event
6. Check My Order Status
7. Speak to the Team
```

---

## 6. Order Tracking

After any order is placed, the user can track it from:
- Dashboard → Orders (web/app)
- WhatsApp — automated status updates

| Status | Meaning |
|--------|---------|
| Confirmed | Order received and payment verified |
| In Progress | Being prepared / assembled / scheduled |
| In Transit | Out for delivery / on the way |
| Delivered / Completed | Service delivered or appointment completed |
| Cancelled | Cancelled by user or team (refund initiated) |

Each order shows: order reference, subsidiary, item(s), amount paid, current status, and a **Contact Support** link.

Completed orders prompt: **Rate this service** (1–5 stars).

---

## 7. Cancellations and Refunds

| Scenario | Outcome |
|----------|---------|
| User cancels before fulfilment begins | Full refund to original payment method within 24 hours |
| User cancels after fulfilment begins | Partial refund per subsidiary policy (communicated at booking) |
| Team cancels (e.g., unavailability) | Full refund to original payment method automatically + apology message on WhatsApp |
| Payment charged but order not created (technical failure) | Full refund to original payment method within 1 hour, error logged for ops team |

---

## 8. Edge Cases and System Behaviour

| Scenario | Required Behaviour |
|----------|-------------------|
| User adds to cart then leaves | Cart persists for 24 hours. On return, user sees "You left something behind" banner. |
| Item goes out of stock after being added to cart | Item marked as unavailable in cart. User shown alternative products. |
| Session expires mid-checkout | User prompted to log in again. Cart and checkout progress preserved. |
| Network drops during payment | "Processing your payment..." screen remains. Do not redirect. On reconnect, check payment status before showing result. |
| Duplicate order submitted (double tap) | Submit button disabled after first tap. Server deduplicates by user ID + item + timestamp window of 60 seconds. |
| Membership benefit already used this period | Benefit shows as "Used" in membership dashboard. Discount not applied. No error — full price shown transparently. |

---

*End of Order Flows FRD*
