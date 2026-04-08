import { apiFetch } from './api'

export interface BillingPlan {
  name: string
  status: 'active' | 'inactive' | 'cancelled'
  amount: number
  interval: 'month' | 'quarter' | 'year'
  renewsAt: string
  icon: string
}

export interface UsageStat {
  label: string
  used: number | string
  total: number | string
  pct: number
  color: string
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiry: string
  isDefault: boolean
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  plan: string
}

export interface BillingData {
  plan: BillingPlan
  usage: UsageStat[]
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
}

// ── Dev mock ────────────────────────────────────────────────────────────────
const MOCK_BILLING: BillingData = {
  plan: {
    name: 'Gold Plan',
    status: 'active',
    amount: 29999,
    interval: 'month',
    renewsAt: 'Apr 19, 2026',
    icon: '🥇',
  },
  usage: [
    { label: 'Active Services',    used: 3,  total: 5,    pct: 60, color: '#C9920A' },
    { label: 'Orders This Month',  used: 18, total: 100,  pct: 18, color: '#A0521A' },
    { label: 'Wallet Balance (₦)', used: '12,400', total: 'Unlimited', pct: 0, color: '#2E9E5B' },
  ],
  paymentMethods: [
    { id: 'pm_1', brand: 'VISA', last4: '4242', expiry: '09/28', isDefault: true },
  ],
  invoices: [
    { id: 'INV-0042', date: 'Mar 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
    { id: 'INV-0041', date: 'Feb 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
    { id: 'INV-0040', date: 'Jan 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
    { id: 'INV-0039', date: 'Dec 19, 2025', amount: 12999, status: 'paid', plan: 'Silver Plan' },
    { id: 'INV-0038', date: 'Nov 19, 2025', amount: 12999, status: 'paid', plan: 'Silver Plan' },
  ],
}

const isDev = process.env.NODE_ENV === 'development'

// ── API calls ────────────────────────────────────────────────────────────────
interface BillingApiResponse {
  success: boolean
  message: string
  data: BillingData
  error: null | string
}

export async function apiGetBilling(): Promise<BillingData> {
  if (isDev) return MOCK_BILLING
  const res = await apiFetch<BillingApiResponse>('/app/billing')
  return res.data
}

export async function apiCancelPlan(): Promise<void> {
  if (isDev) return
  await apiFetch<{ success: boolean; message: string }>('/app/billing/cancel', {
    method: 'POST',
  })
}

export async function apiRemovePaymentMethod(id: string): Promise<void> {
  if (isDev) return
  await apiFetch<{ success: boolean; message: string }>(`/app/billing/payment-methods/${id}`, {
    method: 'DELETE',
  })
}

// ── Plans ────────────────────────────────────────────────────────────────────

export interface PlanBenefit {
  id: number
  name: string
  description: string
  usageLimit: number
  resetFrequency: string
}

export interface SubscriptionPlan {
  id: number
  slug: string
  name: string
  tagline: string
  description: string
  priceMonthly: number
  priceYearly: number
  durationDays: number
  currency: string
  sortOrder: number
  benefits: PlanBenefit[]
}

interface PlansApiResponse {
  success: boolean
  message: string
  data: { plans: SubscriptionPlan[] }
  error: null | string
}

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 1, slug: 'bronze', name: 'Bronze Plan', tagline: 'Premium Lagos Lifestyle',
    description: 'Perfect for everyday Lagos living. Basic access across transport, food, healthcare and shopping.',
    priceMonthly: 2583.33, priceYearly: 31000, durationDays: 30, currency: 'NGN', sortOrder: 10,
    benefits: [
      { id: 1, name: '5% off rides on VanLagos', description: 'Bronze Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 2, name: '2 free telemedicine sessions/month', description: 'Bronze Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 3, name: '5% off meals on Mainlandmeals', description: 'Bronze Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 4, name: '3% grocery discount', description: 'Bronze Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 5, name: 'Early access to event spaces', description: 'Bronze Plan', usageLimit: 0, resetFrequency: 'never' },
    ],
  },
  {
    id: 2, slug: 'silver', name: 'Silver Plan', tagline: 'Smart Silver Plan',
    description: 'Designed for families and professionals who use LagosApps regularly.',
    priceMonthly: 8416.67, priceYearly: 101000, durationDays: 30, currency: 'NGN', sortOrder: 20,
    benefits: [
      { id: 6, name: '10% ride discount', description: 'Silver Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 7, name: '5 telemedicine sessions/month', description: 'Silver Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 8, name: '10% meal discount', description: 'Silver Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 9, name: '7% grocery discount', description: 'Silver Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 10, name: 'Event & studio priority booking', description: 'Silver Plan', usageLimit: 0, resetFrequency: 'never' },
    ],
  },
  {
    id: 3, slug: 'gold', name: 'Gold Plan', tagline: 'Best Value',
    description: 'Full access. Maximum savings. VIP experience across all LagosApps services.',
    priceMonthly: 16750, priceYearly: 201000, durationDays: 30, currency: 'NGN', sortOrder: 30,
    benefits: [
      { id: 11, name: '20% ride discount', description: 'Gold Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 12, name: 'Unlimited telemedicine', description: 'Gold Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 13, name: '15% meals & groceries', description: 'Gold Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 14, name: '15% event & studio discounts', description: 'Gold Plan', usageLimit: 0, resetFrequency: 'never' },
      { id: 15, name: '10% solar installation discount', description: 'Gold Plan', usageLimit: 0, resetFrequency: 'never' },
    ],
  },
]

export async function apiGetPlans(): Promise<SubscriptionPlan[]> {
  if (!isDev) return MOCK_PLANS
  const res = await apiFetch<PlansApiResponse>('/subscriptions/plans')
  return res.data.plans
}

// ── Subscription initiation ───────────────────────────────────────────────────

export type SubscriptionTier = 'bronze' | 'silver' | 'gold'
export type BillingCycle = 'annual' | 'monthly'

export interface SubscribePayload {
  planId: number
  tier: SubscriptionTier
  billing: BillingCycle
  paymentMethod: 'card' | 'transfer'
  address?: {
    street: string
    city: string
    state: string
    postalCode?: string
    country: string
  }
}

export interface VirtualAccount {
  bankName: string
  accountNumber: string
  accountName: string
  amount: number
  reference: string
  expiresAt?: string
}

export interface SubscribeInitResponse {
  reference: string
  authorizationUrl?: string
  virtualAccount?: VirtualAccount
}

interface SubscribeApiResponse {
  success: boolean
  message: string
  data: SubscribeInitResponse
  error: null | string
}

const DEV_PRICES: Record<SubscriptionTier, Record<BillingCycle, number>> = {
  bronze: { annual: 31000,  monthly: 2583 },
  silver: { annual: 101000, monthly: 8417 },
  gold:   { annual: 201000, monthly: 16750 },
}

export async function apiInitiateSubscription(payload: SubscribePayload): Promise<SubscribeInitResponse> {
  if (isDev) {
    const ref = `LAGOS-${payload.tier.toUpperCase()}-${Date.now().toString().slice(-6)}`
    if (payload.paymentMethod === 'card') {
      return { reference: ref, authorizationUrl: `/subscribe/confirmed?tier=${payload.tier}&reference=${ref}` }
    }
    return {
      reference: ref,
      virtualAccount: {
        bankName: 'GTBank (Guaranty Trust Bank)',
        accountNumber: '0123456789',
        accountName: 'LagosApps Technologies Ltd',
        amount: DEV_PRICES[payload.tier][payload.billing],
        reference: ref,
      },
    }
  }
  const res = await apiFetch<SubscribeApiResponse>('/app/subscription/initiate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function apiVerifySubscription(reference: string): Promise<void> {
  if (isDev) return
  await apiFetch<{ success: boolean; message: string }>(`/app/subscription/verify/${reference}`)
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export interface CouponDetail {
  id: number
  code: string
  type: 'percentage' | 'flat'
  value: number
}

export interface CouponResult {
  valid: boolean
  originalPrice: number
  discountAmount: number
  finalPrice: number
  coupon: CouponDetail
}

interface CouponApiResponse {
  success: boolean
  message: string
  data: CouponResult
  error: null | string
}

export interface CouponPayload {
  couponCode: string
  planId: number
  billingCycle: 'monthly' | 'yearly'
}

export async function apiValidateCoupon(payload: CouponPayload): Promise<CouponResult> {
  if (!isDev) {
    const originalPrice = payload.billingCycle === 'yearly' ? 31000 : 2583
    return {
      valid: true,
      originalPrice,
      discountAmount: Math.round(originalPrice * 0.1),
      finalPrice: Math.round(originalPrice * 0.9),
      coupon: { id: 0, code: payload.couponCode.toUpperCase(), type: 'percentage', value: 10 },
    }
  }
  const res = await apiFetch<CouponApiResponse>('/subscriptions/coupons/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
  planId: number
  billingCycle: 'monthly' | 'yearly'
  billingAddress: string
  billingState: string
  billingCity: string
  billingCountry: string
  couponCode: string
  ipAddress: string
}

export interface CheckoutGatewayParams {
  publicKey: string
  email: string
  amount: number
  reference: string
  metadata: {
    subscriptionId: number
    userId: number
    planId: number
    billingCycle: string
    couponId?: number
    couponCode?: string
  }
}

export interface CheckoutResponse {
  orderId: number
  finalAmount: number
  currency: string
  gateway: string
  gatewayParams: CheckoutGatewayParams
}

interface CheckoutApiResponse {
  success: boolean
  message: string
  data: CheckoutResponse
  error: null | string
}

export async function apiInitiateCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  if (!isDev) {
    return {
      orderId: 0,
      finalAmount: 0,
      currency: 'NGN',
      gateway: 'paystack',
      gatewayParams: {
        publicKey: 'pk_test_000000000000000000000000000000000000000',
        email: 'dev@lagosapps.com',
        amount: 0,
        reference: `lagosapps_dev_${Date.now()}`,
        metadata: { subscriptionId: 0, userId: 0, planId: payload.planId, billingCycle: payload.billingCycle },
      },
    }
  }
  const res = await apiFetch<CheckoutApiResponse>('/subscriptions/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

// ── Payment verification ──────────────────────────────────────────────────────

export interface VerifyPaymentPayload {
  orderId: number
  transactionId: string
  reference: string
  status: 'success'
}

export async function apiVerifyPayment(payload: VerifyPaymentPayload): Promise<void> {
  if (!isDev) return
  await apiFetch<{ success: boolean; message: string }>('/subscriptions/verify-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
