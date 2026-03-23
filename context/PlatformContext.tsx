'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface Subsidiary {
  id: string
  name: string          // Brand name e.g. "LagosEats"
  slug: string          // URL slug
  tagline: string       // One-line value prop
  category: string      // Human-readable category
  icon: string
  color: string
  colorPale: string
  colorLight: string
  services: Service[]
  whatsapp: string      // WhatsApp number for orders
  available: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  startingPrice: number
  unit: string          // "per order", "per kg", "per ride" etc.
  icon: string
  popular?: boolean
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  subsidiary: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: 'lagos-eats',
    name: 'LagosEats',
    slug: 'food',
    tagline: 'Restaurant meals & home-cooked food delivered fast',
    category: 'Food Delivery',
    icon: '🍽️',
    color: '#C0392B',
    colorLight: '#E74C3C',
    colorPale: '#FDF2F0',
    whatsapp: '+2348001000001',
    available: true,
    services: [
      { id: 'restaurant', name: 'Restaurant Delivery', description: 'Order from 200+ restaurants across Lagos', startingPrice: 800, unit: 'delivery fee', icon: '🏪', popular: true },
      { id: 'homechef', name: 'Home Chef Meals', description: 'Fresh home-cooked meals from vetted chefs', startingPrice: 2500, unit: 'per meal', icon: '👩‍🍳' },
      { id: 'catering', name: 'Event Catering', description: 'Corporate and private event catering', startingPrice: 150000, unit: 'per event', icon: '🎉' },
    ],
  },
  {
    id: 'lagos-rides',
    name: 'LagosRides',
    slug: 'rides',
    tagline: 'Reliable rides across Lagos — cars, tricycles, dispatch',
    category: 'Transportation',
    icon: '🚗',
    color: '#1A5276',
    colorLight: '#2980B9',
    colorPale: '#EBF5FB',
    whatsapp: '+2348001000002',
    available: true,
    services: [
      { id: 'car', name: 'Car Hire', description: 'Comfortable saloons and SUVs with professional drivers', startingPrice: 3500, unit: 'per trip', icon: '🚙', popular: true },
      { id: 'dispatch', name: 'Dispatch Rider', description: 'Fast document and parcel delivery within Lagos', startingPrice: 1200, unit: 'per trip', icon: '🏍️' },
      { id: 'airport', name: 'Airport Transfer', description: 'Scheduled pickups and drop-offs at MMIA & LOS', startingPrice: 15000, unit: 'per trip', icon: '✈️' },
    ],
  },
  {
    id: 'lagos-market',
    name: 'LagosMarket',
    slug: 'groceries',
    tagline: 'Fresh produce, groceries and household essentials',
    category: 'Groceries & Market',
    icon: '🛒',
    color: '#1E8449',
    colorLight: '#27AE60',
    colorPale: '#EAFAF1',
    whatsapp: '+2348001000003',
    available: true,
    services: [
      { id: 'produce', name: 'Fresh Produce', description: 'Vegetables, fruits, and market staples sourced daily', startingPrice: 500, unit: 'per order', icon: '🥦', popular: true },
      { id: 'bulk', name: 'Bulk Grains & Beans', description: 'Rice, beans, yam flour — measured and delivered', startingPrice: 4500, unit: 'per 5kg bag', icon: '🌾' },
      { id: 'household', name: 'Household Essentials', description: 'Cleaning supplies, toiletries, paper goods', startingPrice: 1000, unit: 'per order', icon: '🧹' },
    ],
  },
  {
    id: 'lagos-home',
    name: 'LagosHome',
    slug: 'home',
    tagline: 'Trusted tradespeople and home service professionals',
    category: 'Home Services',
    icon: '🔧',
    color: '#6C3483',
    colorLight: '#8E44AD',
    colorPale: '#F5EEF8',
    whatsapp: '+2348001000004',
    available: true,
    services: [
      { id: 'cleaning', name: 'Home Cleaning', description: 'Thorough deep-clean by verified cleaning teams', startingPrice: 8000, unit: 'per session', icon: '🧽', popular: true },
      { id: 'plumbing', name: 'Plumbing & Electrical', description: 'Licensed plumbers and electricians on demand', startingPrice: 5000, unit: 'callout fee', icon: '⚡' },
      { id: 'ac', name: 'AC Service & Repair', description: 'Servicing, gas recharge, and fault diagnosis', startingPrice: 6500, unit: 'per unit', icon: '❄️' },
    ],
  },
  {
    id: 'lagos-send',
    name: 'LagosSend',
    slug: 'logistics',
    tagline: 'Same-day and scheduled parcel delivery across Nigeria',
    category: 'Logistics',
    icon: '📦',
    color: '#B7770D',
    colorLight: '#D4AC0D',
    colorPale: '#FEFBE8',
    whatsapp: '+2348001000005',
    available: true,
    services: [
      { id: 'intracity', name: 'Intra-City Delivery', description: 'Door-to-door same-day delivery within Lagos', startingPrice: 1500, unit: 'per parcel', icon: '🏙️', popular: true },
      { id: 'interstate', name: 'Interstate Delivery', description: 'Next-day delivery to Abuja, PHC, and 30+ cities', startingPrice: 4500, unit: 'per parcel', icon: '🛣️' },
      { id: 'bulk-logistics', name: 'Bulk Cargo', description: 'Palletised and oversized cargo nationwide', startingPrice: 35000, unit: 'per consignment', icon: '🚛' },
    ],
  },
  {
    id: 'lagos-health',
    name: 'LagosHealth',
    slug: 'healthcare',
    tagline: 'Pharmacy delivery, lab tests, and doctor consultations',
    category: 'Healthcare',
    icon: '🏥',
    color: '#117A65',
    colorLight: '#148F77',
    colorPale: '#E8F8F5',
    whatsapp: '+2348001000006',
    available: true,
    services: [
      { id: 'pharmacy', name: 'Pharmacy Delivery', description: 'Prescription and OTC medicines delivered in 2 hours', startingPrice: 500, unit: 'delivery fee', icon: '💊', popular: true },
      { id: 'lab', name: 'Home Lab Tests', description: 'Blood work, malaria, typhoid — sample collected at home', startingPrice: 7500, unit: 'per test panel', icon: '🧪' },
      { id: 'doctor', name: 'Doctor Consultation', description: 'Video call with a licensed Nigerian physician', startingPrice: 5000, unit: 'per consultation', icon: '👨‍⚕️' },
    ],
  },
]

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 'txn-1', type: 'debit', amount: 4200, description: 'LagosEats — Buka Spot order', subsidiary: 'LagosEats', date: 'Today, 12:43 PM', status: 'completed' },
  { id: 'txn-2', type: 'debit', amount: 3500, description: 'LagosRides — VI to Lekki', subsidiary: 'LagosRides', date: 'Today, 09:15 AM', status: 'completed' },
  { id: 'txn-3', type: 'credit', amount: 50000, description: 'Wallet top-up via bank transfer', subsidiary: 'Platform', date: 'Yesterday', status: 'completed' },
  { id: 'txn-4', type: 'debit', amount: 8500, description: 'LagosMarket — weekly groceries', subsidiary: 'LagosMarket', date: 'Yesterday', status: 'completed' },
  { id: 'txn-5', type: 'debit', amount: 1500, description: 'LagosSend — document to Surulere', subsidiary: 'LagosSend', date: 'Mon, 17 Mar', status: 'completed' },
  { id: 'txn-6', type: 'debit', amount: 8000, description: 'LagosHome — cleaning session', subsidiary: 'LagosHome', date: 'Sat, 15 Mar', status: 'completed' },
]

interface PlatformState {
  walletBalance: number
  loyaltyPoints: number
  subsidiaries: Subsidiary[]
  transactions: WalletTransaction[]
  formatPrice: (n: number) => string
  getSubsidiary: (slug: string) => Subsidiary | undefined
}

const PlatformContext = createContext<PlatformState | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [walletBalance] = useState(37800)
  const [loyaltyPoints] = useState(2450)

  const formatPrice = (n: number) => `₦${n.toLocaleString()}`
  const getSubsidiary = (slug: string) => SUBSIDIARIES.find(s => s.slug === slug)

  return (
    <PlatformContext.Provider value={{
      walletBalance, loyaltyPoints,
      subsidiaries: SUBSIDIARIES,
      transactions: MOCK_WALLET_TRANSACTIONS,
      formatPrice, getSubsidiary,
    }}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider')
  return ctx
}
