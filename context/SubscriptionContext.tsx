'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type PlanTier = 'Bronze' | 'Silver' | 'Gold'
export type BillingCycle = 'monthly' | 'annual'

export interface Plan {
  tier: PlanTier
  price: number
  annualPrice: number
  icon: string
  tagline: string
  features: string[]
  color: string
  colorLight: string
  colorPale: string
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    tier: 'Bronze',
    price: 4999,
    annualPrice: 3999,
    icon: '🥉',
    tagline: 'Perfect for solo founders getting started',
    features: ['Up to 3 apps', '5GB storage', 'Basic analytics', 'Email support', '1 team member'],
    color: '#0B6B3A',     // primary-7
    colorLight: '#0FA958', // primary-6
    colorPale: '#E6F7EF',  // primary-0
  },
  {
    tier: 'Silver',
    price: 12999,
    annualPrice: 10399,
    icon: '🥈',
    tagline: 'For growing teams that need more power',
    features: ['Up to 15 apps', '25GB storage', 'Advanced analytics', 'Priority support', '5 team members', 'API access'],
    color: '#4A5F7D',     // dark-5
    colorLight: '#7E93B8', // dark-4
    colorPale: '#F5F7FA',  // dark-0
  },
  {
    tier: 'Gold',
    price: 29999,
    annualPrice: 23999,
    icon: '🥇',
    tagline: 'For businesses that demand the best',
    features: ['Unlimited apps', '200GB storage', 'Full analytics suite', '24/7 dedicated support', 'Unlimited members', 'Full API access', 'Custom integrations'],
    color: '#E6B800',     // secondary-6
    colorLight: '#F7C948', // secondary-5
    colorPale: '#FFF9E6',  // secondary-0
    popular: true,
  },
]

interface SubscriptionState {
  selectedPlan: Plan | null
  billingCycle: BillingCycle
  setSelectedPlan: (plan: Plan) => void
  setBillingCycle: (cycle: BillingCycle) => void
  getPrice: (plan: Plan) => number
  formatPrice: (amount: number) => string
}

const SubscriptionContext = createContext<SubscriptionState | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(PLANS[2])
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const getPrice = (plan: Plan) => billingCycle === 'annual' ? plan.annualPrice : plan.price
  const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`
  return (
    <SubscriptionContext.Provider value={{ selectedPlan, billingCycle, setSelectedPlan, setBillingCycle, getPrice, formatPrice }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
