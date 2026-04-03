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
    name: 'Food, Groceries and Household',
    slug: 'food',
    tagline: 'Restaurant meals & home-cooked food delivered fast',
    category: 'Food Delivery',
    icon: '🍽️',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
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
    name: 'Cars, Vans and Rides',
    slug: 'rides',
    tagline: 'Reliable rides across Lagos — cars, tricycles, dispatch',
    category: 'Transportation',
    icon: '🚗',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000002',
    available: true,
    services: [
      { id: 'car', name: 'Car Hire', description: 'Comfortable saloons and SUVs with professional drivers', startingPrice: 3500, unit: 'per trip', icon: '🚙', popular: true },
      { id: 'dispatch', name: 'Dispatch Rider', description: 'Fast document and parcel delivery within Lagos', startingPrice: 1200, unit: 'per trip', icon: '🏍️' },
      { id: 'airport', name: 'Airport Transfer', description: 'Scheduled pickups and drop-offs at MMIA & LOS', startingPrice: 15000, unit: 'per trip', icon: '✈️' },
    ],
  },
  {
    id: 'lagos-health',
    name: 'Health and Wellness',
    slug: 'healthcare',
    tagline: 'Pharmacy delivery, lab tests, and doctor consultations',
    category: 'Healthcare',
    icon: '🏥',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000006',
    available: true,
    services: [
      { id: 'pharmacy', name: 'Pharmacy Delivery', description: 'Prescription and OTC medicines delivered in 2 hours', startingPrice: 500, unit: 'delivery fee', icon: '💊', popular: true },
      { id: 'lab', name: 'Home Lab Tests', description: 'Blood work, malaria, typhoid — sample collected at home', startingPrice: 7500, unit: 'per test panel', icon: '🧪' },
      { id: 'doctor', name: 'Doctor Consultation', description: 'Video call with a licensed Nigerian physician', startingPrice: 5000, unit: 'per consultation', icon: '👨‍⚕️' },
    ],
  },
  {
    id: 'mainland-events',
    name: 'Events and Studios',
    slug: 'events',
    tagline: 'Book event spaces, TV & audio studios, and event tickets',
    category: 'Events & Studios',
    icon: '🎉',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000007',
    available: true,
    services: [
      { id: 'event-venue', name: 'Event Venue Hire', description: 'Halls, gardens, and rooftops for private and corporate events', startingPrice: 150000, unit: 'per day', icon: '🏛️', popular: true },
      { id: 'tv-studio', name: 'TV Studio Rental', description: 'Fully equipped broadcast studio with lighting and crew', startingPrice: 80000, unit: 'per half-day', icon: '📺' },
      { id: 'audio-studio', name: 'Audio Studio', description: 'Professional recording studio for music and podcasts', startingPrice: 25000, unit: 'per hour', icon: '🎙️' },
      { id: 'event-tickets', name: 'Event Tickets', description: 'Buy tickets to LagosApps concerts, shows, and community events', startingPrice: 5000, unit: 'per ticket', icon: '🎟️' },
    ],
  },
  {
    id: 'lagos-solar',
    name: 'Solar, Renewables and More',
    slug: 'solar',
    tagline: 'Solar audits, panel installation, inverters, and clean energy solutions',
    category: 'Energy & Renewables',
    icon: '☀️',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000008',
    available: true,
    services: [
      { id: 'audit', name: 'Free Solar Audit', description: 'On-site energy assessment — our expert visits your property and recommends the right system', startingPrice: 0, unit: 'free', icon: '🔍', popular: true },
      { id: 'installation', name: 'Solar Panel Installation', description: 'Full rooftop or ground-mount panel installation with 5-year warranty', startingPrice: 450000, unit: 'per system', icon: '🔆' },
      { id: 'inverter', name: 'Inverter & Battery Setup', description: 'Hybrid inverters and lithium battery storage for 24/7 power', startingPrice: 280000, unit: 'per unit', icon: '🔋' },
      { id: 'maintenance', name: 'Maintenance & Repair', description: 'Scheduled servicing, fault diagnosis, and panel cleaning', startingPrice: 15000, unit: 'per visit', icon: '🔧' },
    ],
  },
]

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 'txn-1', type: 'debit', amount: 4200, description: 'Food, Groceries and Household — Buka Spot order', subsidiary: 'Food, Groceries and Household', date: 'Today, 12:43 PM', status: 'completed' },
  { id: 'txn-2', type: 'debit', amount: 3500, description: 'Cars, Vans and Rides — VI to Lekki', subsidiary: 'Cars, Vans and Rides', date: 'Today, 09:15 AM', status: 'completed' },
  { id: 'txn-3', type: 'credit', amount: 50000, description: 'Wallet top-up via bank transfer', subsidiary: 'Platform', date: 'Yesterday', status: 'completed' },
  { id: 'txn-4', type: 'debit', amount: 8500, description: 'Food, Groceries and Household — weekly groceries', subsidiary: 'Food, Groceries and Household', date: 'Yesterday', status: 'completed' },
  { id: 'txn-5', type: 'debit', amount: 5000, description: 'Events and Studios — concert ticket', subsidiary: 'Events and Studios', date: 'Sat, 15 Mar', status: 'completed' },
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
