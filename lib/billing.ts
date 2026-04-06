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
