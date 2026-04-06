export type OrderStatus = 'placed' | 'assigned' | 'pickup' | 'on_way' | 'delivered'

export interface DeliveryOrder {
  id: string
  service: string          // service id e.g. 'restaurant'
  serviceName: string      // e.g. 'Restaurant Delivery'
  subsidiary: string       // e.g. 'Food, Groceries and Household'
  restaurant?: string
  restaurantArea?: string
  pickupZone: string
  deliveryAddress: string
  deliveryArea: string
  deliveryZone: string
  timeSlot: string
  note?: string
  deliveryFee: number
  subtotal: number
  total: number
  status: OrderStatus
  createdAt: string        // ISO string
  estimatedMinutes: number // e.g. 40
}

const KEY = 'lagos_orders'

function readAll(): DeliveryOrder[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveOrder(order: DeliveryOrder): void {
  const all = readAll()
  all.unshift(order) // newest first
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getOrders(): DeliveryOrder[] {
  return readAll()
}

export function getOrder(id: string): DeliveryOrder | null {
  return readAll().find(o => o.id === id) ?? null
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const all = readAll()
  const idx = all.findIndex(o => o.id === id)
  if (idx !== -1) {
    all[idx].status = status
    localStorage.setItem(KEY, JSON.stringify(all))
  }
}

export const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'placed',   label: 'Order placed',    desc: 'Your order has been received',             icon: '📋' },
  { status: 'assigned', label: 'Rider assigned',  desc: 'A rider has been assigned to your order',  icon: '🏍️' },
  { status: 'pickup',   label: 'Picked up',        desc: 'Your order has been collected',            icon: '📦' },
  { status: 'on_way',   label: 'On the way',       desc: 'Your order is heading to you',             icon: '🚀' },
  { status: 'delivered',label: 'Delivered',        desc: 'Your order has been delivered. Enjoy!',    icon: '✅' },
]

export function statusIndex(status: OrderStatus): number {
  return STATUS_STEPS.findIndex(s => s.status === status)
}
