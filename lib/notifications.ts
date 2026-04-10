import { apiFetch } from './api'
import type { Notif, NotifType } from '@/context/NotificationsContext'

const isDev = process.env.NODE_ENV === 'development'

export interface GetNotificationsParams {
  page?: number
  limit?: number
  category?: string
  unread?: boolean
}

export interface NotificationsResult {
  items: Notif[]
  page: number
  limit: number
  hasMore: boolean
}

/** Raw shape returned by the API */
interface ApiNotif {
  id: string | number
  category: string
  title: string
  message: string
  is_read: boolean
  action_url?: string
  meta?: Record<string, unknown>
  created_at: string
}

interface ApiNotificationsResponse {
  success: boolean
  message: string
  data: {
    page: number
    limit: number
    data: ApiNotif[]
  }
  error: null | string
}

interface ApiUnreadCountResponse {
  success: boolean
  data: { count: number }
  error: null | string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map API category string to the internal NotifType */
function toNotifType(category: string): NotifType {
  const map: Record<string, NotifType> = {
    orders: 'order',
    order: 'order',
    system: 'system',
    promo: 'promo',
    promos: 'promo',
    account: 'account',
  }
  return map[category.toLowerCase()] ?? 'system'
}

function buildQuery(params: GetNotificationsParams): string {
  const q = new URLSearchParams()
  if (params.page !== undefined) q.set('page', String(params.page))
  if (params.limit !== undefined) q.set('limit', String(params.limit))
  if (params.category) q.set('category', params.category)
  if (params.unread !== undefined) q.set('unread', String(params.unread))
  const str = q.toString()
  return str ? `?${str}` : ''
}

function normalise(raw: ApiNotif): Notif {
  return {
    id: String(raw.id),
    type: toNotifType(raw.category),
    title: raw.title,
    body: raw.message,
    time: formatRelativeTime(raw.created_at),
    read: raw.is_read,
    link: raw.action_url,
  }
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const wks = Math.floor(days / 7)
  return `${wks} week${wks === 1 ? '' : 's'} ago`
}

// ---------------------------------------------------------------------------
// Mock data (used when !isDev — mirrors the real API field names)
// ---------------------------------------------------------------------------

const MOCK_NOTIFICATIONS: ApiNotif[] = [
  { id: '1', category: 'orders', title: 'Your order is on the way', message: 'Your restaurant delivery from Chicken Republic (Order #ORD-1749) has been picked up and is heading to you.', is_read: false, action_url: '/dashboard/orders', created_at: new Date(Date.now() - 5 * 60_000).toISOString() },
  { id: '2', category: 'orders', title: 'Home lab visit confirmed', message: "Your phlebotomist visit for Full Blood Count + Malaria RDT is scheduled for Mon, 8 Apr at 10:00. We'll call 30 mins before arrival.", is_read: false, action_url: '/dashboard/orders', created_at: new Date(Date.now() - 60 * 60_000).toISOString() },
  { id: '3', category: 'account', title: 'Doctor consultation booked', message: 'Your video call with a General Practitioner is confirmed for Tue, 9 Apr at 14:00. Check WhatsApp for the meeting link.', is_read: false, action_url: '/dashboard/orders', created_at: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
  { id: '4', category: 'promo', title: '🎉 New restaurants on Lagos Eats', message: 'Craft 3 Kitchen, Nok by Alara, and 12 more restaurants just joined. Order now and get free delivery on your first order this week.', is_read: true, action_url: '/services/food', created_at: new Date(Date.now() - 24 * 60 * 60_000).toISOString() },
  { id: '5', category: 'orders', title: 'Order delivered', message: 'Your order #ORD-1748 has been delivered. Enjoy your meal! Rate your experience to help us improve.', is_read: true, action_url: '/dashboard/orders', created_at: new Date(Date.now() - 25 * 60 * 60_000).toISOString() },
  { id: '6', category: 'system', title: 'Scheduled maintenance', message: 'LagosApps will undergo routine maintenance on Saturday, 12 Apr between 2:00 am – 4:00 am. Services may be briefly unavailable.', is_read: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString() },
  { id: '7', category: 'account', title: 'Password changed successfully', message: 'Your account password was updated. If you did not make this change, contact support immediately via WhatsApp.', is_read: true, created_at: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString() },
  { id: '8', category: 'promo', title: 'Airport transfers now available', message: 'Book a reliable airport pickup or drop-off at MMIA and LOS. Fixed fares, no surge pricing — available 24/7.', is_read: true, action_url: '/services/rides', created_at: new Date(Date.now() - 4 * 24 * 60 * 60_000).toISOString() },
  { id: '9', category: 'system', title: 'Welcome to LagosApps', message: 'Your account is set up and ready. Explore food delivery, rides, healthcare, events, and more — all in one place.', is_read: true, created_at: new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString() },
]

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function apiGetNotifications(
  params: GetNotificationsParams = {}
): Promise<NotificationsResult> {
  const { page = 1, limit = 20 } = params

  if (!isDev) {
    let mock = MOCK_NOTIFICATIONS
    if (params.category) {
      mock = mock.filter(n => toNotifType(n.category) === toNotifType(params.category!))
    }
    if (params.unread) {
      mock = mock.filter(n => !n.is_read)
    }
    const start = (page - 1) * limit
    const slice = mock.slice(start, start + limit)
    return {
      items: slice.map(normalise),
      page,
      limit,
      hasMore: start + limit < mock.length,
    }
  }

  const res = await apiFetch<ApiNotificationsResponse>(
    `/notifications${buildQuery(params)}`
  )
  const d = res.data
  return {
    items: d.data.map(normalise),
    page: d.page,
    limit: d.limit,
    // API doesn't return a total — infer hasMore from whether a full page was returned
    hasMore: d.data.length === d.limit,
  }
}

export async function apiMarkAllRead(): Promise<void> {
  if (!isDev) return
  await apiFetch('/notifications/read-all', { method: 'PATCH' })
}

export async function apiGetUnreadCount(): Promise<number> {
  if (!isDev) {
    return MOCK_NOTIFICATIONS.filter(n => !n.is_read).length
  }
  const res = await apiFetch<ApiUnreadCountResponse>('/notifications/unread-count')
  return res.data.count
}
