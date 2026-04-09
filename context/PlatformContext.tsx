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
    tagline: 'Fresh groceries, staples, and household supplies delivered to your door',
    category: 'Food & Groceries',
    icon: '🛒',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000001',
    available: true,
    services: [
      { id: 'rice-beans', name: 'Rice and Beans', description: 'Premium parboiled rice and assorted beans — sold by the bag or in smaller quantities', startingPrice: 15000, unit: 'per bag', icon: '🌾', popular: true },
      { id: 'plantain-flour', name: 'Plantain Flour', description: 'Sun-dried and milled plantain flour — pure, unblended, and ready to cook', startingPrice: 5500, unit: 'per bag', icon: '🍌' },
      { id: 'snails', name: 'Snails', description: 'Fresh and pre-cleaned giant African land snails sourced locally', startingPrice: 8000, unit: 'per pack', icon: '🐌' },
      { id: 'cakes', name: 'Cakes and Pastries', description: 'Custom celebration cakes, chin-chin, puff-puff, and baked goods made to order', startingPrice: 12000, unit: 'per order', icon: '🎂' },
      { id: 'household', name: 'Staples and Household Supplies', description: 'Everyday essentials — cooking oil, seasoning, cleaning products, and more', startingPrice: 2500, unit: 'per order', icon: '🏠' },
    ],
  },
  {
    id: 'lagos-rides',
    name: 'Cars, Vans and Rides',
    slug: 'rides',
    tagline: 'Car and van rental, car purchase, and electric vehicles across Lagos',
    category: 'Transportation',
    icon: '🚗',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000002',
    available: true,
    services: [
      { id: 'car', name: 'Car Rental', description: 'Saloons and SUVs with professional drivers — 3-day minimum booking', startingPrice: 15000, unit: 'per day', icon: '🚙', popular: true },
      { id: 'van', name: 'Van Rental — Cargo', description: 'Cargo vans for moving goods, equipment, and supplies around Lagos', startingPrice: 35000, unit: 'per day', icon: '🚐' },
      { id: 'bus', name: 'Bus Rental — Passenger', description: 'Mini-buses and coaches for group travel, staff shuttles, and events', startingPrice: 55000, unit: 'per day', icon: '🚌' },
      { id: 'car-purchase', name: 'Car Purchase', description: 'Browse and buy quality used and new cars — inspection, finance, and delivery included', startingPrice: 8500000, unit: 'starting from', icon: '🏷️' },
      { id: 'ev-purchase', name: 'EV Purchase', description: 'Electric motorcycles, sedans, and SUVs — enquire, test-drive, and buy', startingPrice: 0, unit: 'enquiry', icon: '⚡' },
    ],
  },
  {
    id: 'lagos-health',
    name: 'Health and Wellness',
    slug: 'healthcare',
    tagline: 'Free health checks, wellness retreats, nurses, doctors, and medical supplies',
    category: 'Healthcare',
    icon: '🏥',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000006',
    available: true,
    services: [
      { id: 'health-check', name: 'Free Health Checks', description: 'Walk-in health screening every 1st and 3rd Friday — BP, blood sugar, BMI, and more', startingPrice: 0, unit: 'free', icon: '🩺', popular: true },
      { id: 'wellness-retreat', name: 'Mainland Wellness Retreat', description: 'Short stays at our wellness centre — rest, recovery, and guided wellness programmes', startingPrice: 85000, unit: 'per night', icon: '🌿' },
      { id: 'live-in-nurse', name: 'Live-in Nurses', description: 'Vetted and qualified nurses available for home care — post-op, elderly, and chronic illness support', startingPrice: 150000, unit: 'per month', icon: '👩‍⚕️' },
      { id: 'doctor', name: 'Speak to a Doctor or Nurse', description: 'Video or phone consultation with a licensed Nigerian physician or nurse — same day', startingPrice: 5000, unit: 'per consultation', icon: '📞' },
      { id: 'lab', name: 'Home Medical Tests and Checks', description: 'Blood work, malaria, typhoid, HBA1c, and more — sample collected at your home', startingPrice: 7500, unit: 'per test panel', icon: '🧪' },
      { id: 'ambulance', name: 'Ambulance Service', description: 'Non-emergency patient transport — hospital transfers, discharge, and scheduled medical trips', startingPrice: 25000, unit: 'per call', icon: '🚑' },
      { id: 'medical-supplies', name: 'Medical and Health Supplies', description: 'OTC medicines, wound care, mobility aids, and prescribed items delivered to your door', startingPrice: 500, unit: 'delivery fee', icon: '💊' },
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
    tagline: 'Solar packages, audits, EV chargers, electric vehicles, and Mainland Solar',
    category: 'Energy & Renewables',
    icon: '☀️',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000008',
    available: true,
    services: [
      { id: 'solar-package', name: 'Solar Packages', description: 'Pre-configured solar bundles for homes and small businesses — panels, inverter, and battery included', startingPrice: 350000, unit: 'per package', icon: '📦', popular: true },
      { id: 'audit', name: 'Free Solar Audit', description: 'On-site energy assessment — our expert visits your property and recommends the right system', startingPrice: 0, unit: 'free', icon: '🔍' },
      { id: 'ev-charger', name: 'EV Chargers', description: 'Type 1 & Type 2 home and commercial EV charging station supply, installation, and commissioning', startingPrice: 180000, unit: 'per unit', icon: '⚡' },
      { id: 'ev', name: 'Electric Vehicles', description: 'Browse and enquire about electric motorcycles, sedans, and SUVs — including test-drive booking', startingPrice: 0, unit: 'enquiry', icon: '🔌' },
      { id: 'mainland-solar', name: 'Mainland Solar', description: 'Community and commercial solar projects under the Mainland Solar initiative — enquire for large-scale installations', startingPrice: 0, unit: 'enquiry', icon: '🌍' },
    ],
  },
  {
    id: 'office-school',
    name: 'Office and School',
    slug: 'office',
    tagline: 'Amazon and Alibaba orders, school books, and supplies delivered to Lagos',
    category: 'Office & School',
    icon: '📦',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000009',
    available: true,
    services: [
      { id: 'amazon', name: 'Amazon Orders and Requests', description: 'We source and ship Amazon products to Lagos — electronics, books, clothing, and more', startingPrice: 5000, unit: 'service fee', icon: '📫', popular: true },
      { id: 'alibaba', name: 'Alibaba Orders and Requests', description: 'Bulk and retail sourcing from Alibaba — we handle the order, shipping, and customs clearance', startingPrice: 5000, unit: 'service fee', icon: '🏭' },
      { id: 'books', name: 'Books', description: 'Academic and leisure books sourced internationally and delivered locally', startingPrice: 0, unit: 'coming soon', icon: '📚' },
    ],
  },
  {
    id: 'better-you',
    name: 'A Better You',
    slug: 'better-you',
    tagline: 'Health checks, community events, and social impact through TEP and Mainland Foundation',
    category: 'Community & Impact',
    icon: '🌱',
    color: '#1A6B3C',
    colorLight: '#2E9E5B',
    colorPale: '#E8F5EE',
    whatsapp: '+2348001000010',
    available: true,
    services: [
      { id: 'free-checks', name: 'Free Health Checks', description: 'Open community health screening every 1st and 3rd Friday — no appointment needed', startingPrice: 0, unit: 'free', icon: '🩺', popular: true },
      { id: 'attend-event', name: 'Attend an Event', description: 'Find and book tickets to upcoming LagosApps community events, concerts, and forums', startingPrice: 0, unit: 'varies', icon: '🎟️' },
      { id: 'recent-events', name: 'View Recent Events', description: 'Browse photos, recaps, and highlights from past LagosApps events and community programmes', startingPrice: 0, unit: 'free', icon: '📸' },
      { id: 'make-impact', name: 'Make an Impact', description: 'Support education, health, and youth interventions through TEPLEARN and Mainland Foundation', startingPrice: 0, unit: 'donation', icon: '🎓' },
      { id: 'sponsorship', name: 'Be the Difference', description: 'Individual and corporate sponsorships — fund a student, sponsor a health camp, or back a youth programme', startingPrice: 10000, unit: 'per sponsorship', icon: '🤝' },
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

  const formatPrice = (n: number) => `₦${n?.toLocaleString()}`
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
