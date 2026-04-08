'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

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

const INITIAL: Notif[] = [
  {
    id: '1',
    type: 'order',
    title: 'Your order is on the way',
    body: 'Your restaurant delivery from Chicken Republic (Order #ORD-1749) has been picked up and is heading to you.',
    time: '5 mins ago',
    read: false,
    link: '/dashboard/orders',
  },
  {
    id: '2',
    type: 'order',
    title: 'Home lab visit confirmed',
    body: "Your phlebotomist visit for Full Blood Count + Malaria RDT is scheduled for Mon, 8 Apr at 10:00. We'll call 30 mins before arrival.",
    time: '1 hr ago',
    read: false,
    link: '/dashboard/orders',
  },
  {
    id: '3',
    type: 'account',
    title: 'Doctor consultation booked',
    body: 'Your video call with a General Practitioner is confirmed for Tue, 9 Apr at 14:00. Check WhatsApp for the meeting link.',
    time: '2 hrs ago',
    read: false,
    link: '/dashboard/orders',
  },
  {
    id: '4',
    type: 'promo',
    title: '🎉 New restaurants on Lagos Eats',
    body: 'Craft 3 Kitchen, Nok by Alara, and 12 more restaurants just joined. Order now and get free delivery on your first order this week.',
    time: 'Yesterday',
    read: true,
    link: '/services/food',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order delivered',
    body: 'Your order #ORD-1748 has been delivered. Enjoy your meal! Rate your experience to help us improve.',
    time: 'Yesterday',
    read: true,
    link: '/dashboard/orders',
  },
  {
    id: '6',
    type: 'system',
    title: 'Scheduled maintenance',
    body: 'LagosApps will undergo routine maintenance on Saturday, 12 Apr between 2:00 am – 4:00 am. Services may be briefly unavailable.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '7',
    type: 'account',
    title: 'Password changed successfully',
    body: 'Your account password was updated. If you did not make this change, contact support immediately via WhatsApp.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '8',
    type: 'promo',
    title: 'Airport transfers now available',
    body: 'Book a reliable airport pickup or drop-off at MMIA and LOS. Fixed fares, no surge pricing — available 24/7.',
    time: '4 days ago',
    read: true,
    link: '/services/rides',
  },
  {
    id: '9',
    type: 'system',
    title: 'Welcome to LagosApps',
    body: 'Your account is set up and ready. Explore food delivery, rides, healthcare, events, and more — all in one place.',
    time: '1 week ago',
    read: true,
  },
]

interface NotificationsContextValue {
  items: Notif[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notif[]>(INITIAL)

  const unreadCount = items.filter(n => !n.read).length

  function markRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  function dismiss(id: string) {
    setItems(prev => prev.filter(n => n.id !== id))
  }

  return (
    <NotificationsContext.Provider value={{ items, unreadCount, markRead, markAllRead, dismiss }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider')
  return ctx
}
