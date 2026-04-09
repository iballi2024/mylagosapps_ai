# LagosApps — Non-Technical Product Requirements Document

**One Platform. Endless Possibilities.**

| Field | Detail |
|-------|--------|
| Document Type | Non-Technical PRD |
| Audience | Engineers, Product Managers, Business Stakeholders |
| Version | 1.0 |
| Date | March 2026 |
| Status | Draft — For Review |

---

## 1. Product Vision and Guiding Principles

> **The North Star:** Anyone who visits the LagosApps site should be able to buy a product, book a service, and pay for it within 2 minutes, without any need for additional interaction or follow-up by a team member.

LagosApps is a multi-subsidiary transaction platform designed for everyday life in Lagos, Nigeria. It operates on the same model as Uber or Careem in Dubai: a single trusted brand with a unified account, wallet, and loyalty system, serving customers across multiple service categories through distinct subsidiary brands, each operating like its own focused business.

The platform is not an information portal or a company brochure. It is a **commerce engine**. Every page, every button, every interaction must be oriented toward enabling a customer to transact, not just browse.

### 1.1 Guiding Principles for All Development

- **Transaction First:** Every page must have a clear path to purchase, booking, or payment. If a page does not lead to a transaction, it must be redesigned or removed.
- **Two-Minute Rule:** From landing on the site to completing a payment, the maximum acceptable time is two minutes. Flows that exceed this must be simplified.
- **Mobile Native:** Most Nigerian users access the internet via mobile. Every feature must work flawlessly on a smartphone before desktop optimization is considered.
- **WhatsApp Everywhere:** WhatsApp is the dominant communication tool in Nigeria. Customers must be able to place orders, receive invoices, and confirm delivery through WhatsApp Business on every applicable service.
- **One Wallet, Many Services:** A customer's account and wallet should work across all subsidiaries. If they top up their wallet to pay for groceries today, that same wallet should work for booking a solar audit tomorrow.
- **Trust Through Transparency:** Prices must be shown upfront. Payment confirmations must be instant. Receipts and invoices must be auto-generated.

---

## 2. Who We Are Serving

### 2.1 Primary Customer Profiles

| Customer Type | Who They Are and What They Need |
|---------------|--------------------------------|
| Lagos Mainland Resident | Middle-income family or professional who needs groceries delivered, wants to solve NEPA power issues with solar, and needs reliable transport. Primary mobile user. May not have a desktop at home. Needs affordable membership benefits. |
| Lagos Island Professional | Higher-income professional or business owner looking for premium services: solar installation, event venue hire, executive car rental, and health packages for their family. Uses both desktop and mobile. |
| SME Owner | Small business owner who needs van logistics, solar installation for their shop/warehouse, bulk grocery orders for a canteen, or event space for corporate functions. High-value customer for multiple subsidiaries. |
| Diaspora Customer | Nigerian living abroad who wants to purchase services for family members in Lagos. May use Amazon/Alibaba order request service. Will pay with international card. Needs confidence that services will be delivered without them present. |

### 2.2 What Success Looks Like for the Customer

- A mother in Surulere browses LagosApps on her phone, adds rice, beans, and snails to her cart, and pays with her saved Paystack card in under 2 minutes.
- A business owner in Ikeja submits a Solar Audit request, pays the N30,000 audit fee, and receives a booking confirmation with the audit date, all within 5 minutes.
- A church in Mushin books the Mainland Solar Hub conference room for a Saturday event, pays a deposit, and gets an invoice immediately on WhatsApp.
- A Lagos Mainland family subscribes to the Bronze membership tier and starts using their free health check benefit the same week.

---

## 3. Platform Architecture: The Hub-and-Spoke Model

LagosApps operates as a hub-and-spoke ecosystem. **LagosApps.com** is the hub — the central brand, account system, wallet, and discovery portal. Each subsidiary is a spoke: a distinct service with its own brand, products, pricing, and transaction flows, all accessible through the central hub.

This model mirrors how Careem in the Middle East works: one app, one account, multiple services.

### 3.1 The Hub: LagosApps.com

The hub provides:

- Universal customer account and profile management
- The **LagosApps Wallet**: a pre-loaded digital wallet spendable across all subsidiaries
- Membership tiers (Bronze, Silver, Gold) and associated benefits tracking
- Service discovery: customers find all subsidiaries and services from one place
- Unified order history, receipts, and invoice generation
- Affiliate and referral program tracking
- Customer support entry point

### 3.2 The Spokes: Subsidiary Businesses

| Subsidiary | Service Category | Primary Transaction Type |
|------------|-----------------|------------------------|
| Mainland Solar | Solar & Clean Energy | Solar audit booking, package purchase, equipment store, installment loan application |
| Van Lagos | Transport & Logistics | Cargo van rental, passenger bus rental, car rental (3-day min), ride booking, car/EV purchase |
| Mainland Meals / LagosCart | Food & Groceries | Hot meals, rice, beans, plantain flour, snails, cakes, household supplies, Amazon/Alibaba orders |
| Mainland Clinics | Health & Wellness | Doctor/nurse consultations, home health checks, ambulance booking, live-in nurse placement, wellness retreat booking, medical supplies |
| Mainland Events / Studios Mainland | Events & Studio Hire | Event space booking, conference room rental, Solar Hub hire, TV studio and audio recording studio rental |
| OasisCharge | EV Charging | EV charger installation, charging station locator |
| DFWTruck | Freight Logistics | Truck hire for heavy cargo and freight — quote request and booking form |
| Mainland Foundation / TEPLEARN | Social Impact | Donations, sponsorships, youth education enrollment, health intervention event attendance |

---

## 4. Core Platform Features (All Subsidiaries)

### 4.1 User Registration and Account Management

Allows any visitor to create a LagosApps account using their phone number or email address.

- Registration must be completable in under 60 seconds using just a phone number and OTP verification.
- Profile includes: name, phone number, email, delivery address(es), saved payment methods.
- Users can link their WhatsApp number for order notifications and invoice delivery.
- Single sign-on works across every subsidiary without re-registering.

### 4.2 LagosApps Wallet

A digital wallet pre-loaded with Naira spendable on any service across all subsidiaries.

- Funded via bank transfer, card payment, or USSD.
- Wallet balance visible on the dashboard and in the navigation bar when logged in.
- Any transaction across any subsidiary can be paid from the wallet.
- Wallet stores commission credits from the affiliate program.
- Top-up and spending generates instant transaction SMS/email receipts.
- Minimum top-up: **N1,000**. No maximum limit.

### 4.3 Membership Tiers

A subscription product that rewards loyal customers with benefits across all subsidiaries.

#### Bronze — N100,000/year (≈ N9,000/month)
- Free basic health check (registration required; 1st and 3rd Fridays)
- Free tickets to LagosApps Concerts and Events
- Free Solar Audit (valued at N30,000–N40,000)
- 3% discount on grocery orders
- Early access to event spaces

#### Silver — N250,000/year (≈ N22,000/month)
- All Bronze benefits
- 1 free car rental or 1 free van/bus rental per year
- Free grocery delivery once per month
- 7% grocery discount
- Event and studio priority booking

#### Gold — N500,000/year (≈ N45,000/month)
- All Silver benefits
- Free 2-day stay at Mainland Wellness Centre (once per year)
- At-home medical tests and checks (maximum 4 people per year)
- Free grocery delivery twice per month
- 15% event and studio discounts
- 10% solar installation discount

> **Note:** Pricing must be reconciled with the finance team. Annual rates must be shown consistently across all touchpoints including the WhatsApp channel.

### 4.4 Payment Gateway

- **Recommended gateway:** Paystack (supports cards, bank transfer, USSD)
- All payments must generate an instant receipt by email and WhatsApp.
- Payment confirmation screen must appear within 10 seconds of a successful payment.
- Failed payments must show a clear error message with a retry option.
- Installment and split payment plans must be supported for high-value purchases (e.g., solar packages).

### 4.5 WhatsApp Business Integration

Extends the LagosApps transaction platform into WhatsApp — the primary daily communication tool for most Lagosians.

- A WhatsApp Business number must be active and linked to each applicable subsidiary.
- The WhatsApp bot guides customers through a menu of services, collects delivery details, and generates a payment link.
- On payment confirmation, the bot generates and sends a PDF invoice to the customer's WhatsApp.
- Order status updates (confirmed, in transit, delivered) are sent via WhatsApp.
- **Applicable services:** Mainland Meals/LagosCart, Van Lagos, Mainland Solar (audit booking), Mainland Clinics (appointment booking), Mainland Events (venue enquiries).

### 4.6 Search and Discovery

A global search bar that allows any visitor to find a product or service across all subsidiaries.

- Returns results from all subsidiaries: products, services, events, and packages.
- Filterable by category, price range, and location of service.
- Available from the homepage and accessible on every page via the navigation bar.

### 4.7 Order Management and Tracking

Allows customers to view and track all past and current orders across every subsidiary from one dashboard.

- Order history shows: date, service/product, subsidiary, amount paid, and current status.
- Active orders show real-time status: confirmed → in progress → in transit → delivered/completed.
- Every order has a unique reference number for customer support queries.
- Completed orders can be rated (1–5 stars) and reviewed.

### 4.8 Affiliate and Referral Program

Allows any registered LagosApps user to earn money by referring new customers.

- Every registered user gets a unique referral link shareable via WhatsApp, social media, or SMS.
- When someone uses a referral link to purchase a Mainland Solar package of **5KW or higher**, the referrer earns **N25,000 commission**.
- Commissions are credited to the referrer's wallet automatically on installation completion.
- Referrers can request wallet payout to their bank account (minimum N25,000).
- A referral dashboard shows total referrals, pending commissions, and paid commissions.

---

## 5. Subsidiary-Level Feature Specifications

### 5.1 Mainland Solar

#### Purpose
Mainland Solar solves Lagos's most persistent daily frustration: unreliable power supply. It provides solar installations, equipment sales, and financing solutions.

#### Hero Brand Messages
- Let the Sun Set You Free
- Make Money with Mainland Solar
- No Worries About Band A, B, or C When You're on the Mainland Solar Bandwagon
- As Long as the Sun Rises, Your Power Grid Will Not Crash

#### Solar Audit Questionnaire (Primary Landing Page)

The Solar Audit is the entry point into the customer journey and both a data collection tool and a sales qualifier.

**Step 1 — What is this solar system for?**
- Home
- Office
- Factory, Warehouse, or Industrial Building
- Other
- Just Here to Learn

For **Office / Industrial / Other**: customer fills a Solar Audit Request form (company name, address, contact, preferred date) and pays the **N30,000–N40,000 audit fee** to confirm the visit.

For **Home**: customer answers a second set of questions:

| Dwelling Type | Recommended System |
|---------------|-------------------|
| Standalone Building | 10KW inverter or higher |
| Duplex or Terrace | 8KW inverter or higher |
| 2–3 Bedroom Flat | 5KW inverter or higher |
| 1 Bedroom or Self-Contained | 3KW inverter or higher |
| Single Room | 250W to 2.5KW Mainland Solar Generator |
| Other | Customer describes their situation |

After the home questionnaire, the system displays the recommended package with pricing and two CTAs: **Book a Solar Audit** and **Buy This Package**. The audit fee paid by home customers counts toward their installation cost.

#### Transaction Forms Required (5 total)

1. **Solar Audit Booking & Payment** — fills audit request form, pays N30K–N40K to confirm appointment.
2. **Solar Package Purchase** — selects system (Generator, 3KW, 5KW, 8KW, 10KW+), pays in full or applies for installment plan.
3. **Installment Loan Application** — SOHCAHTOA application form submitted to financial partner email and LagosApps operations email (not a live approval, a request for review).
4. **Solar Equipment Store** — browses and purchases individual inverters, batteries, panels, and charge controllers. Partner brands: **Taico, Veichi, Torchn, Bluesun**.
5. **Mainland Solar Hub Booking** — books the Solar Hub venue with calendar date selection, attendee count, and deposit payment.

#### Partner Logos and Product Updates
The Mainland Solar page must display logos for Taico, Veichi, Torchn, and Bluesun. Product listings must be updated **monthly** by the content team.

#### FAQ Section
12 questions covering customer education and purchase objections, displayed in an expandable accordion format.

---

### 5.2 Van Lagos (Transport and Logistics)

#### Services
- Cargo van rental for moving goods
- Passenger bus rental for group travel
- Car rental (3-day minimum)
- Car and electric vehicle purchase facilitation

#### Booking Flow
Customer selects vehicle type → enters pickup/destination or rental dates → selects from available vehicles → confirms price → pays deposit or full amount → receives confirmation via WhatsApp and email with a booking reference.

#### Key UX Requirements
- Vehicle availability calendar must show **real-time availability**.
- Pricing must be transparent with no hidden charges.
- For car rentals, customer must be able to **upload driver's licence and ID** during booking.

---

### 5.3 Mainland Meals and LagosCart (Food and Groceries)

#### Product Categories
- **Fresh Meals:** Hot food from the Mainland Meals kitchen
- **Staples:** Rice, beans, plantain flour, snails
- **Baked Goods:** Cakes and pastries
- **Household Supplies:** Cleaning products, toiletries, essentials
- **Office and School Supplies**
- **Amazon and Alibaba Order Requests:** Customer describes a product; LagosApps handles procurement and delivery (price includes product cost, import fees, and service charge)
- **Books:** Coming soon

#### How Ordering Works
Customer browses catalog → adds to cart → selects delivery address and time slot → pays. For WhatsApp ordering, the bot presents a category menu. For Amazon/Alibaba requests, customer fills a request form with product name, link or description, and quantity.

---

### 5.4 Mainland Clinics (Health and Wellness)

#### Services
- Free health checks every 1st and 3rd Friday (registration required)
- Mainland Wellness Retreat bookings (overnight stays)
- Live-in nurse placement (post-operative or elderly care)
- Teleconsultation: speak to a doctor or nurse by phone or video
- Home medical tests and checks
- Ambulance service (non-emergency medical transportation)
- Medical and health supplies store

#### Booking and Payment Flow
- Free health checks: registration form (name, phone, ID, preferred Friday slot).
- All paid services: full payment required at time of booking.
- Teleconsultations: same-day booking available.
- Home visits: 24-hour advance booking required.
- Wellness retreat: minimum 2-night booking with deposit.

---

### 5.5 Mainland Events and Studios Mainland

#### Services
- Event space hire: conferences, product launches, exhibitions, receptions at the Mainland Solar Hub and associated venues
- TV show production studio rental
- Audio recording studio rental
- Event listing platform for the LagosApps community

#### Event Listings
Events displayed in clean rectangular card format. Each card shows: event name, date, short description (max 3 lines), and a **Book Ticket** or **Learn More** button. Design reference: adeanet.org.

#### Spam Prevention
The platform is experiencing significant spam registrations. Required measures:
- **reCAPTCHA** on all public forms
- **Email verification** for registrations
- **Rate limiting** on form submissions

#### Studio Rental
Listed separately from event spaces. Must include: studio specifications, technical equipment included, pricing per hour/day/session, available time slots, and a booking form with deposit payment.

---

## 6. Channel Requirements by Subsidiary

| Subsidiary | Website | Mobile App | WhatsApp | USSD | Priority |
|------------|---------|------------|----------|------|----------|
| Mainland Solar | Yes | Yes | Yes | No | **High** |
| Van Lagos | Yes | Yes | Yes | No | **High** |
| Mainland Meals / LagosCart | Yes | Yes | Yes | Future | **High** |
| Mainland Clinics | Yes | Yes | Yes | No | **High** |
| Mainland Events / Studios | Yes | Yes | Enquiry only | No | Medium |
| OasisCharge | Yes | Yes | No | No | Medium |
| DFWTruck | Yes | No | Enquiry only | No | Lower |
| Mainland Foundation / TEPLEARN | Yes | No | No | No | Lower |

---

## 7. Content, Operations, and Team Responsibilities

### 7.1 Content Team
- Support each subsidiary venture lead with product descriptions, marketing copy, and imagery.
- Monthly update cycle for Mainland Solar partner product listings (Taico, Veichi, Torchn, Bluesun).
- Write event cards for Mainland Events (title, date, 3-line description).
- Keep all subsidiary FAQ sections current with correct pricing and information.
- Arrange photography and updated venue photos for Mainland Events *(fix conference room blinds before photography session)*.

### 7.2 Finance Team (Grace and Analysis Team)
- Finalize and confirm all pricing for membership tiers, solar packages, and audit fees.
- Ensure payment gateway configuration is correct for each subsidiary.
- Monitor affiliate commission tracking and approve wallet payouts.
- Set pricing margins for the Amazon/Alibaba order service.

### 7.3 Subsidiary Venture Leads
- Provide product information, specifications, and pricing to the content team.
- Confirm service availability and operational capacity before transactional flows go live.
- Confirm Mainland Solar Hub booking calendar availability and set blackout dates.
- Confirm partner commitments from Taico, Veichi, Torchn, and Bluesun for product updates.

### 7.4 Engineering Team
- All subscription and payment flows must be tested end-to-end on both mobile and desktop before launch.
- Anti-spam measures (reCAPTCHA, email verification, rate limiting) must be in place on all public forms before Mainland Events goes live.
- WhatsApp Business API setup requires a verified Facebook Business Manager account.
- All forms must auto-send confirmation emails to the customer and a copy to the relevant operations inbox.

---

## 8. Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Time to first transaction | Under 2 minutes | The north star metric for the entire platform vision |
| Checkout completion rate | Above 70% | High drop-off means friction in the payment flow |
| Membership conversion rate | 5% of first-time visitors | Subscriptions drive predictable recurring revenue |
| WhatsApp order volume | 20% of total orders within 3 months | Validates the WhatsApp channel strategy |
| Solar audit bookings per month | 50 within 6 months | Primary sales qualifier for Mainland Solar installations |
| Affiliate referrals | 100 registered affiliates in 90 days | Validates community-driven growth |
| Spam form submissions | Reduced to under 5% within 30 days | Validates anti-spam implementation success |
| Mobile transaction completion | Equal to or better than desktop | Nigeria is a mobile-first market |

---

## 9. A Note for All Stakeholders

### For Engineers
Every feature described in this document exists to enable one thing: a customer completing a transaction. If a feature does not have a clear path to a payment confirmation, question why it is being built. **Build for mobile first.** Test every payment flow on a real Nigerian phone with a real Nigerian bank card before considering any feature done.

### For Product Managers
Prioritize the transaction core above everything else. The most important sprint is the one where the first real customer successfully pays for a service on LagosApps and receives a receipt. Every backlog item should be evaluated against: *does this help us get to that first transaction faster, or does it come after?*

### For Business Stakeholders
The platform will only succeed if customers can use it without calling your team. That means every service must be fully self-serve: browsable, bookable, and payable without anyone picking up the phone. **The two-minute rule is not aspirational. It is the standard every feature will be measured against.**

---

*End of Non-Technical PRD*
