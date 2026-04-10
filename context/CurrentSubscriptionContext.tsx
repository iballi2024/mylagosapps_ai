'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiGetCurrentSubscription, CurrentSubscription } from '@/lib/billing'
import { useAuthContext } from '@/context/AuthContext'

interface CurrentSubscriptionContextValue {
  subscription: CurrentSubscription | null
  loading: boolean
  refetch: () => void
}

const CurrentSubscriptionContext = createContext<CurrentSubscriptionContextValue | null>(null)

export function CurrentSubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext()
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  function fetch() {
    setLoading(true)
    apiGetCurrentSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetch()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading])

  return (
    <CurrentSubscriptionContext.Provider value={{ subscription, loading, refetch: fetch }}>
      {children}
    </CurrentSubscriptionContext.Provider>
  )
}

export function useCurrentSubscription() {
  const ctx = useContext(CurrentSubscriptionContext)
  if (!ctx) throw new Error('useCurrentSubscription must be used inside CurrentSubscriptionProvider')
  return ctx
}
