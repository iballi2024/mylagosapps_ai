// Centralised subscription plan state for the dashboard.
// Replace MOCK_PLAN with real session/API data when auth is wired up.
// Set to null to test the unsubscribed state.

export type Plan = {
  tier: 'bronze' | 'silver' | 'gold'
  billing: 'annual' | 'quarterly'
  renewsAt: string
} | null

export const MOCK_PLAN: Plan = { tier: 'gold', billing: 'annual', renewsAt: '2 Apr 2027' }

export const TIER_META = {
  bronze: { icon: '🥉', label: 'Bronze' },
  silver: { icon: '🥈', label: 'Silver' },
  gold:   { icon: '🥇', label: 'Gold' },
}
