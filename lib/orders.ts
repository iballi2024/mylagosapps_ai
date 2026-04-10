import { apiFetch } from './api'

export type OrderStatus = 'placed' | 'assigned' | 'pickup' | 'on_way' | 'delivered'

// ── API order shape ───────────────────────────────────────────────────────────

export interface ApiOrder {
  id: number
  order_reference: string
  user_id: number
  service_title: string
  service_description: string
  category: string
  total_amount: number
  discount_amount: number
  final_amount: number
  currency: string
  delivery_address: string | null
  delivery_area: string | null
  delivery_state: string | null
  delivery_country: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_reference: string | null
  transaction_id: string | null
  gateway: string | null
  paid_at: string | null
  payment_method: string | null
  channel: string | null
  order_status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  meta: Record<string, string | number | null>
  ip_address: string | null
  created_at: string
  updated_at: string
}

interface ApiOrderResponse {
  success: boolean
  message: string
  data: ApiOrder
  error: null | string
}

interface ApiOrdersResponse {
  success: boolean
  message: string
  data: {
    orders: ApiOrder[]
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
  error: null | string
}

export interface OrdersResult {
  orders: ApiOrder[]
  total: number
  page: number
  limit: number
  pages: number
}

export async function apiGetOrders(page = 1, limit = 5): Promise<OrdersResult> {
  const res = await apiFetch<ApiOrdersResponse>(`/orders?page=${page}&limit=${limit}`)
  return {
    orders: res.data.orders,
    ...res.data.pagination,
  }
}

export async function apiGetOrder(reference: string): Promise<ApiOrder> {
  const res = await apiFetch<ApiOrderResponse>(`/orders/${reference}`)
  return res.data
}

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

export type ApiOrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'

export const API_STATUS_STEPS: { status: ApiOrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'pending',    label: 'Order placed',   desc: 'Your order has been received and is awaiting confirmation', icon: '📋' },
  { status: 'confirmed',  label: 'Confirmed',      desc: 'Your order has been confirmed',                            icon: '✔️' },
  { status: 'processing', label: 'Processing',     desc: 'Your order is being prepared or on its way',               icon: '⚙️' },
  { status: 'completed',  label: 'Completed',      desc: 'Your order has been completed. Enjoy!',                    icon: '✅' },
]

export function apiStatusIndex(status: ApiOrderStatus): number {
  if (status === 'cancelled') return -1
  return API_STATUS_STEPS.findIndex(s => s.status === status)
}

// kept for localStorage-based orders (food service confirm screen etc.)
export const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'placed',    label: 'Order placed',   desc: 'Your order has been received',            icon: '📋' },
  { status: 'assigned',  label: 'Rider assigned', desc: 'A rider has been assigned to your order', icon: '🏍️' },
  { status: 'pickup',    label: 'Picked up',       desc: 'Your order has been collected',           icon: '📦' },
  { status: 'on_way',    label: 'On the way',      desc: 'Your order is heading to you',            icon: '🚀' },
  { status: 'delivered', label: 'Delivered',       desc: 'Your order has been delivered. Enjoy!',   icon: '✅' },
]

export function statusIndex(status: OrderStatus): number {
  return STATUS_STEPS.findIndex(s => s.status === status)
}
