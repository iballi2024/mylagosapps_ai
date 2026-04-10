'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { apiGetNotifications, apiGetUnreadCount, apiMarkAllRead } from '@/lib/notifications'
import { useAuthContext } from '@/context/AuthContext'

export type NotifType = 'order' | 'system' | 'promo' | 'account'

export interface Notif {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  link?: string
}

interface NotificationsContextValue {
  items: Notif[]
  unreadCount: number
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

const PAGE_LIMIT = 20

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext()
  const [items, setItems] = useState<Notif[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchPage = useCallback(async (pageNum: number, replace: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const [result, count] = await Promise.all([
        apiGetNotifications({ page: pageNum, limit: PAGE_LIMIT }),
        pageNum === 1 ? apiGetUnreadCount() : Promise.resolve(null),
      ])
      setItems(prev => replace ? result.items : [...prev, ...result.items])
      setHasMore(result.hasMore)
      if (count !== null) setUnreadCount(count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  // Only fetch once auth has resolved and the user is confirmed authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPage(1, true)
    }
  }, [fetchPage, isAuthenticated, authLoading])

  function loadMore() {
    if (!loading && hasMore) {
      const next = page + 1
      setPage(next)
      fetchPage(next, false)
    }
  }

  function refresh() {
    setPage(1)
    fetchPage(1, true)
  }

  function markRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    apiMarkAllRead().catch(() => {/* optimistic — ignore errors */})
  }

  function dismiss(id: string) {
    const target = items.find(n => n.id === id)
    setItems(prev => prev.filter(n => n.id !== id))
    if (target && !target.read) setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <NotificationsContext.Provider value={{
      items, unreadCount, loading, error, hasMore,
      loadMore, refresh, markRead, markAllRead, dismiss,
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider')
  return ctx
}
