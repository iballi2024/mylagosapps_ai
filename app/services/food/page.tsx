'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  TextInput, Anchor, Select, Textarea, Divider,
} from '@mantine/core'
import { IconMapPin, IconClock, IconCheck } from '@tabler/icons-react'
import { usePlatform } from '@/context/PlatformContext'
import { saveOrder } from '@/lib/orders'
import PaymentStep from '@/components/PaymentStep'
import { DateInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import dayjs from 'dayjs'
import { reqText, reqSelect } from '@/lib/validation'

// ── Lagos delivery zones ──────────────────────────────────────────────────────
const ZONES = [
  { id: 'A', name: 'Lagos Island',      areas: ['Victoria Island', 'Ikoyi', 'Banana Island', 'Oniru', 'CMS', 'Lagos Island'] },
  { id: 'B', name: 'Lekki',             areas: ['Lekki Phase 1', 'Lekki Phase 2', 'Chevron', 'Ikate', 'Oral Estate', 'Osapa', 'Agungi'] },
  { id: 'C', name: 'Ajah / Sangotedo',  areas: ['Ajah', 'Sangotedo', 'Abijo', 'Shapati', 'Abraham Adesanya', 'Lakowe'] },
  { id: 'D', name: 'Surulere / Yaba',   areas: ['Surulere', 'Yaba', 'Gbagada', 'Fadeyi', 'Ojuelegba', 'Sabo', 'Iwaya'] },
  { id: 'E', name: 'Ikeja / GRA',       areas: ['Ikeja', 'GRA Ikeja', 'Ogba', 'Alausa', 'Berger', 'Ojodu', 'Agege', 'Maryland'] },
  { id: 'F', name: 'Mushin / Oshodi',   areas: ['Mushin', 'Oshodi', 'Isolo', 'Ilasamaja', 'Ejigbo', 'Mafoluku', 'Mile 2'] },
  { id: 'G', name: 'Ikorodu / Outer',   areas: ['Ikorodu', 'Agric', 'Owutu', 'Badagry', 'Epe', 'Apapa'] },
]

// ── Delivery fee matrix [pickupZone][deliveryZone] ────────────────────────────
const FEE_MATRIX: Record<string, Record<string, number>> = {
  A: { A: 800,  B: 1200, C: 2000, D: 1500, E: 2000, F: 2500, G: 3500 },
  B: { A: 1200, B: 800,  C: 1200, D: 2000, E: 2500, F: 2500, G: 3500 },
  C: { A: 2000, B: 1200, C: 800,  D: 2500, E: 3000, F: 3000, G: 3500 },
  D: { A: 1500, B: 2000, C: 2500, D: 800,  E: 1200, F: 1200, G: 2500 },
  E: { A: 2000, B: 2500, C: 3000, D: 1200, E: 800,  F: 800,  G: 2000 },
  F: { A: 2500, B: 2500, C: 3000, D: 1200, E: 800,  F: 800,  G: 1500 },
  G: { A: 3500, B: 3500, C: 3500, D: 2500, E: 2000, F: 1500, G: 800  },
}

// ── Sample restaurants ────────────────────────────────────────────────────────
const RESTAURANTS = [
  { id: 'r1',  name: 'Nok by Alara',          cuisine: 'Nigerian Fine Dining',    zone: 'A', area: 'Victoria Island', rating: 4.8, deliveryTime: '30–45 min' },
  { id: 'r2',  name: 'Chicken Republic VI',    cuisine: 'Fast Food',               zone: 'A', area: 'Victoria Island', rating: 4.2, deliveryTime: '20–30 min' },
  { id: 'r3',  name: 'The Yellow Chilli',      cuisine: 'Nigerian · Continental',  zone: 'B', area: 'Lekki Phase 1',   rating: 4.6, deliveryTime: '30–40 min' },
  { id: 'r4',  name: 'Buka Spot',              cuisine: 'Nigerian Street Food',    zone: 'B', area: 'Lekki Phase 1',   rating: 4.5, deliveryTime: '25–35 min' },
  { id: 'r5',  name: 'KFC Lekki',              cuisine: 'Fast Food',               zone: 'B', area: 'Lekki Phase 2',   rating: 4.3, deliveryTime: '20–30 min' },
  { id: 'r6',  name: 'Yakoyo Restaurant',      cuisine: 'Nigerian',                zone: 'D', area: 'Surulere',        rating: 4.4, deliveryTime: '25–35 min' },
  { id: 'r7',  name: 'Tantalizers',            cuisine: 'Fast Food · Nigerian',    zone: 'D', area: 'Yaba',            rating: 4.0, deliveryTime: '20–30 min' },
  { id: 'r8',  name: 'Chicken Republic Ikeja', cuisine: 'Fast Food',               zone: 'E', area: 'Ikeja',           rating: 4.1, deliveryTime: '20–30 min' },
  { id: 'r9',  name: 'Bukka Hut',              cuisine: 'Nigerian',                zone: 'E', area: 'GRA Ikeja',       rating: 4.5, deliveryTime: '30–40 min' },
  { id: 'r10', name: 'Mr Biggs',               cuisine: 'Fast Food',               zone: 'F', area: 'Oshodi',          rating: 3.9, deliveryTime: '20–30 min' },
]

// Central kitchen zone used for Home Chef / Catering (no restaurant selection)
const DEFAULT_KITCHEN_ZONE = 'D'

const TIME_SLOTS = [
  { value: 'asap',  label: 'As soon as possible' },
  { value: '12:00', label: '12:00 PM – 12:30 PM' },
  { value: '13:00', label: '1:00 PM – 1:30 PM' },
  { value: '14:00', label: '2:00 PM – 2:30 PM' },
  { value: '18:00', label: '6:00 PM – 6:30 PM' },
  { value: '19:00', label: '7:00 PM – 7:30 PM' },
  { value: '20:00', label: '8:00 PM – 8:30 PM' },
]

type Step = 'browse' | 'pickup' | 'delivery' | 'details' | 'payment' | 'confirm'
          | 'cat-event' | 'cat-venue' | 'cat-menu' | 'cat-review' | 'cat-confirm'

const EVENT_TYPES = [
  { value: 'corporate',  label: 'Corporate lunch / dinner' },
  { value: 'wedding',    label: 'Wedding reception' },
  { value: 'birthday',   label: 'Birthday party' },
  { value: 'burial',     label: 'Burial / funeral reception' },
  { value: 'religious',  label: 'Religious / church gathering' },
  { value: 'office',     label: 'Office party' },
  { value: 'private',    label: 'Private party' },
  { value: 'other',      label: 'Other' },
]

const GUEST_RANGES = [
  { value: '10-30',   label: '10 – 30 guests' },
  { value: '30-50',   label: '30 – 50 guests' },
  { value: '50-100',  label: '50 – 100 guests' },
  { value: '100-200', label: '100 – 200 guests' },
  { value: '200-500', label: '200 – 500 guests' },
  { value: '500+',    label: '500+ guests' },
]

const MENU_STYLES = [
  { value: 'nigerian',    label: 'Nigerian (rice, stew, pounded yam, etc.)' },
  { value: 'continental', label: 'Continental' },
  { value: 'buffet',      label: 'Buffet (Nigerian + Continental mix)' },
  { value: 'finger',      label: 'Finger food / cocktail style' },
  { value: 'fullcourse',  label: 'Full course / fine dining' },
  { value: 'custom',      label: 'Custom — I will describe below' },
]

const EVENT_TIMES = [
  { value: '08:00', label: '8:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '20:00', label: '8:00 PM' },
]

interface Restaurant {
  id: string; name: string; cuisine: string
  zone: string; area: string; rating: number; deliveryTime: string
}

function getZoneName(id: string) { return ZONES.find(z => z.id === id)?.name ?? id }
function getDeliveryFee(from: string, to: string) { return FEE_MATRIX[from]?.[to] ?? 2500 }
function zoneOf(area: string) { return ZONES.find(z => z.areas.includes(area))?.id ?? null }

const ALL_AREA_OPTIONS = ZONES.map(z => ({
  group: z.name,
  items: z.areas.map(a => ({ value: a, label: a })),
}))

const INPUT_LABEL = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FoodPage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('food')!

  const [step, setStep] = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState(sub.services[0].id)

  // Pickup
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [pickupZone, setPickupZone] = useState<string | null>(null)

  // Delivery
  const [deliveryArea, setDeliveryArea] = useState<string | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')

  // Details
  const [note, setNote] = useState('')
  const [timeSlot, setTimeSlot] = useState<string | null>('asap')

  // Catering enquiry
  const [catEventType, setCatEventType] = useState<string | null>(null)
  const [catGuestRange, setCatGuestRange] = useState<string | null>(null)
  const [catDate, setCatDate] = useState<Date | null>(null)
  const [catTime, setCatTime] = useState<string | null>(null)
  const [catVenueArea, setCatVenueArea] = useState<string | null>(null)
  const [catVenueAddress, setCatVenueAddress] = useState('')
  const [catMenuStyle, setCatMenuStyle] = useState<string | null>(null)
  const [catDietary, setCatDietary] = useState('')
  const [catNote, setCatNote] = useState('')

  const active = sub.services.find(s => s.id === selectedService)!
  const isRestaurant = selectedService === 'restaurant'
  const isCatering = selectedService === 'catering'

  const deliveryZone = deliveryArea ? zoneOf(deliveryArea) : null
  const resolvedPickupZone = pickupZone ?? (isRestaurant ? null : DEFAULT_KITCHEN_ZONE)
  const deliveryFee = resolvedPickupZone && deliveryZone ? getDeliveryFee(resolvedPickupZone, deliveryZone) : null
  const total = deliveryFee !== null ? active.startingPrice + deliveryFee : null

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Stable order ID (only used in confirm step)
  const [orderId] = useState(() => `LGA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  // ── Validation ────────────────────────────────────────────────────────────
  const deliveryErrors = {
    deliveryArea:    reqSelect(deliveryArea, 'a delivery area'),
    deliveryAddress: reqText(deliveryAddress, 'Street address'),
  }
  const catEventErrors = {
    catEventType:  reqSelect(catEventType, 'an event type'),
    catGuestRange: reqSelect(catGuestRange, 'guest count'),
    catDate:       catDate === null ? 'Please select an event date' : '',
    catTime:       reqSelect(catTime, 'a start time'),
  }
  const catVenueErrors = {
    catVenueArea:    reqSelect(catVenueArea, 'a venue area'),
    catVenueAddress: reqText(catVenueAddress, 'Venue address'),
  }
  const catMenuErrors = {
    catMenuStyle: reqSelect(catMenuStyle, 'a menu style'),
  }

  function touchDelivery() { setTouched(p => ({ ...p, deliveryArea: true, deliveryAddress: true })) }
  function touchCatEvent() { setTouched(p => ({ ...p, catEventType: true, catGuestRange: true, catDate: true, catTime: true })) }
  function touchCatVenue() { setTouched(p => ({ ...p, catVenueArea: true, catVenueAddress: true })) }
  function touchCatMenu()  { setTouched(p => ({ ...p, catMenuStyle: true })) }

  // ── Step breadcrumbs ──────────────────────────────────────────────────────
  const STEPS: { id: Step; label: string }[] = isCatering
    ? [{ id: 'cat-event', label: 'Event' }, { id: 'cat-venue', label: 'Venue' }, { id: 'cat-menu', label: 'Menu' }, { id: 'cat-review', label: 'Review' }]
    : isRestaurant
    ? [{ id: 'pickup', label: 'Restaurant' }, { id: 'delivery', label: 'Delivery' }, { id: 'details', label: 'Details' }, { id: 'payment', label: 'Payment' }]
    : [{ id: 'delivery', label: 'Delivery' }, { id: 'details', label: 'Details' }, { id: 'payment', label: 'Payment' }]

  const currentIdx = STEPS.findIndex(s => s.id === step)

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

        {/* Hero */}
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg,${sub.color},${sub.colorLight})` }}>
          <Box maw={900} mx="auto">
            <Anchor component="button" fz="xs" c="rgba(255,255,255,0.6)" mb="sm" display="block" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => window.history.back()}>← All services</Anchor>
            <Group gap="md" wrap="wrap" align="center" mb="md">
              <Box style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {sub.icon}
              </Box>
              <Box>
                <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="white">{sub.name}</Title>
                <Text fz="sm" c="rgba(255,255,255,0.7)">{sub.tagline}</Text>
              </Box>
            </Group>
            <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
              size="sm" radius="xl" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
              💬 Order on WhatsApp
            </Button>
          </Box>
        </Box>

        {/* Progress bar */}
        {step !== 'browse' && step !== 'confirm' && step !== 'cat-confirm' && (
          <Box style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }} px="md" py="sm">
            <Box maw={900} mx="auto">
              <Group gap={0} wrap="nowrap">
                {STEPS.map((s, i) => {
                  const done = i < currentIdx
                  const active = i === currentIdx
                  return (
                    <Group key={s.id} gap={0} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <Group gap={6} wrap="nowrap" style={{ opacity: done || active ? 1 : 0.4, minWidth: 0 }}>
                        <Box style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          background: done ? '#2F9E44' : active ? sub.color : 'var(--color-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 11, fontWeight: 700,
                        }}>
                          {done ? '✓' : i + 1}
                        </Box>
                        <Text fz="xs" fw={active ? 700 : 500} c={active ? 'var(--color-ink)' : 'var(--color-muted)'}
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.label}
                        </Text>
                      </Group>
                      {i < STEPS.length - 1 && (
                        <Box style={{ flex: 1, height: 1, background: 'var(--color-border)', minWidth: 8, margin: '0 6px' }} />
                      )}
                    </Group>
                  )
                })}
              </Group>
            </Box>
          </Box>
        )}

        <Box maw={900} mx="auto" p="md" py="xl">

          {/* ── Browse ─────────────────────────────────────────────────────── */}
          {step === 'browse' && (
            <Group align="flex-start" gap="lg" wrap="wrap">
              <Box style={{ flex: 2, minWidth: 280 }}>
                <Title order={2} ff="var(--font-montserrat)" fw={700} fz={17} c="var(--color-ink)" mb="md">Choose a service</Title>
                <Stack gap="sm">
                  {sub.services.map(sv => (
                    <Card key={sv.id} radius="xl" withBorder p="md" onClick={() => setSelectedService(sv.id)}
                      style={{
                        borderColor: selectedService === sv.id ? sub.color + '80' : 'var(--color-border)',
                        background: selectedService === sv.id ? sub.colorPale : 'white',
                        cursor: 'pointer',
                        outline: selectedService === sv.id ? `2px solid ${sub.color}50` : 'none',
                      }}>
                      <Group gap="sm" wrap="nowrap">
                        <Box style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                          {sv.icon}
                        </Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Group gap="xs" mb={2} wrap="wrap">
                            <Text fw={700} fz="sm" c="var(--color-ink)">{sv.name}</Text>
                            {sv.popular && <Badge size="xs" radius="xl" style={{ background: sub.color, color: 'white' }}>Popular</Badge>}
                          </Group>
                          <Text fz="xs" c="var(--color-muted)" lh={1.5}>{sv.description}</Text>
                          <Text fw={700} fz="sm" mt={4} style={{ color: sub.color }}>
                            From {formatPrice(sv.startingPrice)} <Text span fw={400} fz="xs" c="var(--color-muted)">/ {sv.unit}</Text>
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              {/* Sticky summary */}
              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">{isCatering ? 'Enquiry summary' : 'Order summary'}</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">{active.name}</Text>
                    {isCatering
                      ? <Text fz="xs" c="var(--color-muted)">Quote on request</Text>
                      : <Text fz="sm" fw={500}>{formatPrice(active.startingPrice)}</Text>}
                  </Group>
                  {!isCatering && (
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Delivery fee</Text>
                      <Text fz="xs" c="var(--color-muted)">by location</Text>
                    </Group>
                  )}
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>{isCatering ? 'Starting from' : 'From'}</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(active.startingPrice)}</Text>
                  </Group>
                  {isCatering && (
                    <Text fz={10} c="var(--color-muted)">Final price depends on guest count and menu. Our team will send a full quote within 24 hours.</Text>
                  )}
                </Stack>
                <Button fullWidth radius="xl" size="md" mb="xs"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => {
                    setRestaurant(null); setPickupZone(null)
                    setDeliveryArea(null); setDeliveryAddress('')
                    setNote(''); setTimeSlot('asap')
                    setCatEventType(null); setCatGuestRange(null); setCatDate(null); setCatTime(null)
                    setCatVenueArea(null); setCatVenueAddress(''); setCatMenuStyle(null); setCatDietary(''); setCatNote('')
                    setStep(isCatering ? 'cat-event' : isRestaurant ? 'pickup' : 'delivery')
                  }}>
                  {isCatering ? 'Request a quote →' : 'Continue →'}
                </Button>
                <Button fullWidth radius="xl" size="sm" component="a"
                  href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Order via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {/* ── Pickup: Restaurant selection ───────────────────────────────── */}
          {step === 'pickup' && (
            <Box maw={600}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Pick a restaurant</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Select where your food will be collected from</Text>

              <Stack gap="sm">
                {RESTAURANTS.map(r => (
                  <Card key={r.id} radius="xl" withBorder p="md"
                    onClick={() => setRestaurant(r)}
                    style={{
                      borderColor: restaurant?.id === r.id ? sub.color + '80' : 'var(--color-border)',
                      background: restaurant?.id === r.id ? sub.colorPale : 'white',
                      cursor: 'pointer',
                      outline: restaurant?.id === r.id ? `2px solid ${sub.color}50` : 'none',
                    }}>
                    <Group gap="sm" justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <Box style={{ width: 44, height: 44, borderRadius: 12, background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          🍽️
                        </Box>
                        <Box style={{ minWidth: 0 }}>
                          <Group gap="xs" mb={2} wrap="wrap">
                            <Text fw={700} fz="sm" c="var(--color-ink)">{r.name}</Text>
                            <Badge size="xs" variant="outline" radius="sm">{getZoneName(r.zone)}</Badge>
                          </Group>
                          <Text fz="xs" c="var(--color-muted)">{r.cuisine}</Text>
                          <Group gap="xs" mt={4}>
                            <Text fz="xs" c="var(--color-muted)">📍 {r.area}</Text>
                            <Text fz="xs" c="var(--color-muted)">⏱ {r.deliveryTime}</Text>
                            <Text fz="xs" c="var(--color-muted)">⭐ {r.rating}</Text>
                          </Group>
                        </Box>
                      </Group>
                      {restaurant?.id === r.id && (
                        <Box style={{ width: 24, height: 24, borderRadius: '50%', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconCheck size={14} color="white" />
                        </Box>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>

              <Button fullWidth radius="xl" size="md" mt="xl" disabled={!restaurant}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { if (restaurant) { setPickupZone(restaurant.zone); setStep('delivery') } }}>
                Continue to delivery →
              </Button>
            </Box>
          )}

          {/* ── Delivery address ───────────────────────────────────────────── */}
          {step === 'delivery' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep(isRestaurant ? 'pickup' : 'browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Delivery location</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Where should we deliver to?</Text>

              {/* Pickup summary */}
              {restaurant && (
                <Card radius="xl" withBorder p="md" mb="lg" style={{ background: sub.colorPale, borderColor: sub.color + '30' }}>
                  <Group gap="sm">
                    <Box style={{ width: 36, height: 36, borderRadius: 10, background: sub.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconMapPin size={18} color={sub.color} />
                    </Box>
                    <Box>
                      <Text fz="xs" tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb={2}>Pickup from</Text>
                      <Text fz="sm" fw={700} c="var(--color-ink)">{restaurant.name}</Text>
                      <Text fz="xs" c="var(--color-muted)">{restaurant.area} · {getZoneName(restaurant.zone)}</Text>
                    </Box>
                  </Group>
                </Card>
              )}

              <Stack gap="md">
                <Select
                  label="Delivery area"
                  placeholder="Select your area in Lagos"
                  data={ALL_AREA_OPTIONS}
                  value={deliveryArea}
                  onChange={v => { setDeliveryArea(v); setTouched(p => ({ ...p, deliveryArea: true })) }}
                  error={touched.deliveryArea ? deliveryErrors.deliveryArea : undefined}
                  size="md" radius="xl" searchable
                  styles={INPUT_LABEL}
                />
                <TextInput
                  label="Street address"
                  placeholder="e.g. 14 Admiralty Way, Flat 3"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, deliveryAddress: true }))}
                  error={touched.deliveryAddress ? deliveryErrors.deliveryAddress : undefined}
                  size="md" radius="xl"
                  styles={INPUT_LABEL}
                />

                {/* Live delivery fee preview */}
                {deliveryArea && deliveryZone && resolvedPickupZone && (
                  <Card radius="xl" p="md" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                    <Group justify="space-between" mb="xs">
                      <Group gap={6}>
                        <IconMapPin size={15} color={sub.color} />
                        <Text fz="sm" fw={600} c="var(--color-ink)">Delivery route</Text>
                      </Group>
                      <Badge size="sm" radius="sm" style={{ background: sub.colorPale, color: sub.color }}>
                        {getZoneName(resolvedPickupZone)} → {getZoneName(deliveryZone)}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Delivery fee</Text>
                      <Text fz="sm" fw={700} style={{ color: sub.color }}>{formatPrice(deliveryFee!)}</Text>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)" mt={4}>Fee is based on pickup and delivery zones</Text>
                  </Card>
                )}
              </Stack>

              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchDelivery(); if (Object.values(deliveryErrors).some(Boolean)) return; setStep('details') }}>
                Continue →
              </Button>
            </Box>
          )}

          {/* ── Order details ──────────────────────────────────────────────── */}
          {step === 'details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('delivery')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Order details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Time and preferences</Text>

              <Stack gap="lg">
                <Select
                  label="Preferred delivery time"
                  data={TIME_SLOTS}
                  value={timeSlot}
                  onChange={setTimeSlot}
                  size="md" radius="xl"
                  leftSection={<IconClock size={16} />}
                  styles={INPUT_LABEL}
                />

                <Textarea
                  label="Special instructions (optional)"
                  placeholder="e.g. Extra spicy, no onions, call on arrival…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize
                  styles={INPUT_LABEL}
                />
              </Stack>

              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('payment')}>
                Review order →
              </Button>
            </Box>
          )}

          {/* ── Payment / Review ───────────────────────────────────────────── */}
          {step === 'payment' && (
            <Box maw={480}>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review & pay</Title>

              <Stack gap="md">
                {/* Route */}
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Delivery route</Text>
                  <Stack gap="xs">
                    <Group gap="sm" align="flex-start">
                      <Box style={{ width: 28, height: 28, borderRadius: '50%', background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Text fz="xs">📍</Text>
                      </Box>
                      <Box>
                        <Text fz="xs" c="var(--color-muted)">Pickup</Text>
                        <Text fz="sm" fw={600} c="var(--color-ink)">{restaurant?.name ?? 'Central Kitchen'}</Text>
                        <Text fz="xs" c="var(--color-muted)">{restaurant?.area ?? 'Surulere'} · {getZoneName(resolvedPickupZone!)}</Text>
                      </Box>
                    </Group>
                    <Box style={{ width: 1, height: 16, background: 'var(--color-border)', marginLeft: 13 }} />
                    <Group gap="sm" align="flex-start">
                      <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Text fz="xs">🏠</Text>
                      </Box>
                      <Box>
                        <Text fz="xs" c="var(--color-muted)">Deliver to</Text>
                        <Text fz="sm" fw={600} c="var(--color-ink)">{deliveryAddress}</Text>
                        <Text fz="xs" c="var(--color-muted)">{deliveryArea} · {deliveryZone ? getZoneName(deliveryZone) : ''}</Text>
                      </Box>
                    </Group>
                  </Stack>
                </Card>

                {/* Cost breakdown */}
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Order summary</Text>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">{active.name}</Text>
                      <Text fz="sm">{formatPrice(active.startingPrice)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">
                        Delivery ({getZoneName(resolvedPickupZone!)} → {deliveryZone ? getZoneName(deliveryZone) : '—'})
                      </Text>
                      <Text fz="sm">{deliveryFee !== null ? formatPrice(deliveryFee) : '—'}</Text>
                    </Group>
                    {timeSlot && timeSlot !== 'asap' && (
                      <Group justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">Scheduled for</Text>
                        <Text fz="sm">{TIME_SLOTS.find(t => t.value === timeSlot)?.label}</Text>
                      </Group>
                    )}
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={800} fz="md">Total</Text>
                      <Text ff="var(--font-montserrat)" fw={800} fz="md" style={{ color: sub.color }}>
                        {total !== null ? formatPrice(total) : '—'}
                      </Text>
                    </Group>
                  </Stack>
                </Card>

                {note && (
                  <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                    <Text fz="xs" c="var(--color-muted)" mb={4}>Special instructions</Text>
                    <Text fz="sm" c="var(--color-ink)">{note}</Text>
                  </Card>
                )}
              </Stack>

              {total !== null && (
                <PaymentStep
                  amount={total}
                  formatPrice={formatPrice}
                  color={sub.color}
                  orderPayload={{
                    service_title: active.name,
                    service_description: restaurant ? `Delivery from ${restaurant.name}` : `${active.name} delivery`,
                    category: 'Food and Groceries',
                    total_amount: total,
                    final_amount: total,
                    delivery_address: deliveryAddress,
                    delivery_area: deliveryArea ?? undefined,
                    delivery_state: 'Lagos',
                    delivery_country: 'NG',
                    meta: {
                      service_type: selectedService,
                      restaurant_name: restaurant?.name ?? null,
                      restaurant_area: restaurant?.area ?? null,
                      pickup_zone: resolvedPickupZone,
                      delivery_zone: deliveryZone,
                      subtotal: active.startingPrice,
                      delivery_fee: deliveryFee,
                      time_slot: timeSlot,
                      note: note || null,
                    },
                  }}
                  onBack={() => setStep('details')}
                  onPay={() => {
                    if (total === null || !deliveryZone || !resolvedPickupZone) return
                    saveOrder({
                      id: orderId,
                      service: selectedService,
                      serviceName: active.name,
                      subsidiary: sub.name,
                      restaurant: restaurant?.name,
                      restaurantArea: restaurant?.area,
                      pickupZone: resolvedPickupZone,
                      deliveryAddress,
                      deliveryArea: deliveryArea!,
                      deliveryZone,
                      timeSlot: timeSlot ?? 'asap',
                      note,
                      deliveryFee: deliveryFee!,
                      subtotal: active.startingPrice,
                      total,
                      status: 'placed',
                      createdAt: new Date().toISOString(),
                      estimatedMinutes: restaurant ? parseInt(restaurant.deliveryTime) : 45,
                    })
                    setStep('confirm')
                  }}
                />
              )}
            </Box>
          )}

          {/* ── Confirmation ───────────────────────────────────────────────── */}
          {step === 'confirm' && (
            <Box maw={480} mx="auto" py="xl">
              <Box style={{ textAlign: 'center' }} mb="xl">
                <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
                  ✅
                </Box>
                <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Order placed!</Title>
                <Text fz="sm" c="var(--color-muted)" lh={1.7}>
                  A rider will collect from <strong>{restaurant?.name ?? 'our kitchen'}</strong> and deliver to you.
                  You&apos;ll get a WhatsApp update when your order is on the way.
                </Text>
                <Badge mt="sm" size="lg" radius="xl" variant="outline"
                  style={{ borderColor: sub.color, color: sub.color }}>
                  Order ID: {orderId}
                </Badge>
              </Box>

              <Card radius="xl" withBorder p="lg" mb="xl" style={{ borderColor: 'var(--color-border)' }}>
                <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Receipt</Text>
                <Stack gap="xs">
                  {restaurant && (
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Restaurant</Text>
                      <Text fz="sm" fw={500}>{restaurant.name}</Text>
                    </Group>
                  )}
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Service</Text>
                    <Text fz="sm" fw={500}>{active.name}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Deliver to</Text>
                    <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 200 }}>{deliveryAddress}, {deliveryArea}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Est. delivery</Text>
                    <Text fz="sm" fw={500}>
                      {timeSlot === 'asap'
                        ? (restaurant?.deliveryTime ?? '30–45 min')
                        : TIME_SLOTS.find(t => t.value === timeSlot)?.label}
                    </Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Delivery fee</Text>
                    <Text fz="sm" fw={500}>{deliveryFee !== null ? formatPrice(deliveryFee) : '—'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Total charged</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>
                      {total !== null ? formatPrice(total) : '—'}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Payment</Text>
                    <Text fz="sm" fw={500} c="#2F9E44">Confirmed ✓</Text>
                  </Group>
                </Stack>
              </Card>

              <Group grow>
                <Button component={Link} href="/home" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
                  Back to home
                </Button>
                <Button component={Link} href={`/dashboard/orders/${orderId}`} radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}>
                  Track order →
                </Button>
              </Group>
            </Box>
          )}

          {/* ── Catering: Event details ────────────────────────────────────── */}
          {step === 'cat-event' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Event details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us about your event so we can plan the right menu</Text>
              <Stack gap="md">
                <Select label="Event type" placeholder="Select event type" data={EVENT_TYPES}
                  value={catEventType}
                  onChange={v => { setCatEventType(v); setTouched(p => ({ ...p, catEventType: true })) }}
                  error={touched.catEventType ? catEventErrors.catEventType : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label="Expected guest count" placeholder="Select range" data={GUEST_RANGES}
                  value={catGuestRange}
                  onChange={v => { setCatGuestRange(v); setTouched(p => ({ ...p, catGuestRange: true })) }}
                  error={touched.catGuestRange ? catEventErrors.catGuestRange : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <DateInput label="Event date" placeholder="Pick a date" size="md" radius="xl"
                  value={catDate}
                  onChange={v => { setCatDate(v); setTouched(p => ({ ...p, catDate: true })) }}
                  onBlur={() => setTouched(p => ({ ...p, catDate: true }))}
                  error={touched.catDate ? catEventErrors.catDate : undefined}
                  minDate={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
                  styles={INPUT_LABEL} />
                <Select label="Event start time" placeholder="Select time" data={EVENT_TIMES}
                  value={catTime}
                  onChange={v => { setCatTime(v); setTouched(p => ({ ...p, catTime: true })) }}
                  error={touched.catTime ? catEventErrors.catTime : undefined}
                  size="md" radius="xl"
                  leftSection={<IconClock size={16} />} styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchCatEvent(); if (Object.values(catEventErrors).some(Boolean)) return; setStep('cat-venue') }}>
                Continue →
              </Button>
            </Box>
          )}

          {/* ── Catering: Venue ────────────────────────────────────────────── */}
          {step === 'cat-venue' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('cat-event')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Venue location</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Where will the event be held?</Text>
              <Stack gap="md">
                <Select label="Venue area" placeholder="Select area in Lagos" data={ALL_AREA_OPTIONS}
                  value={catVenueArea}
                  onChange={v => { setCatVenueArea(v); setTouched(p => ({ ...p, catVenueArea: true })) }}
                  error={touched.catVenueArea ? catVenueErrors.catVenueArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label="Venue address / name" placeholder="e.g. Eko Hotel, Victoria Island or 12 Park Lane, Lekki"
                  value={catVenueAddress} onChange={e => setCatVenueAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, catVenueAddress: true }))}
                  error={touched.catVenueAddress ? catVenueErrors.catVenueAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchCatVenue(); if (Object.values(catVenueErrors).some(Boolean)) return; setStep('cat-menu') }}>
                Continue →
              </Button>
            </Box>
          )}

          {/* ── Catering: Menu preferences ─────────────────────────────────── */}
          {step === 'cat-menu' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('cat-venue')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Menu preferences</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Help us prepare the right food for your guests</Text>
              <Stack gap="md">
                <Select label="Menu style" placeholder="Select style" data={MENU_STYLES}
                  value={catMenuStyle}
                  onChange={v => { setCatMenuStyle(v); setTouched(p => ({ ...p, catMenuStyle: true })) }}
                  error={touched.catMenuStyle ? catMenuErrors.catMenuStyle : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <TextInput label="Dietary requirements (optional)"
                  placeholder="e.g. Vegetarian options, no pork, halal only…"
                  value={catDietary} onChange={e => setCatDietary(e.target.value)} size="md" radius="xl" styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)"
                  placeholder="Any specific dishes, allergies, serving style preferences…"
                  value={catNote} onChange={e => setCatNote(e.target.value)} size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchCatMenu(); if (Object.values(catMenuErrors).some(Boolean)) return; setStep('cat-review') }}>
                Review enquiry →
              </Button>
            </Box>
          )}

          {/* ── Catering: Review & submit ──────────────────────────────────── */}
          {step === 'cat-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block"
                style={{ cursor: 'pointer' }} onClick={() => setStep('cat-menu')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review enquiry</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Event details</Text>
                  <Stack gap="xs">
                    {[
                      ['Event type',   EVENT_TYPES.find(e => e.value === catEventType)?.label ?? ''],
                      ['Guest count',  GUEST_RANGES.find(g => g.value === catGuestRange)?.label ?? ''],
                      ['Date',         catDate ? dayjs(catDate).format('D MMMM YYYY') : ''],
                      ['Start time',   EVENT_TIMES.find(t => t.value === catTime)?.label ?? ''],
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>

                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Venue</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Address</Text>
                      <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{catVenueAddress}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Area</Text>
                      <Text fz="sm" fw={500}>{catVenueArea}</Text>
                    </Group>
                  </Stack>
                </Card>

                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Menu</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Style</Text>
                      <Text fz="sm" fw={500}>{MENU_STYLES.find(m => m.value === catMenuStyle)?.label}</Text>
                    </Group>
                    {catDietary && (
                      <Group justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">Dietary</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{catDietary}</Text>
                      </Group>
                    )}
                    {catNote && (
                      <Group justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">Notes</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{catNote}</Text>
                      </Group>
                    )}
                  </Stack>
                </Card>

                <Card radius="xl" p="md" style={{ background: sub.colorPale, border: `1px solid ${sub.color}30` }}>
                  <Group gap="sm">
                    <Text fz="lg">💡</Text>
                    <Box>
                      <Text fz="sm" fw={700} c="var(--color-ink)">Starting from {formatPrice(active.startingPrice)}</Text>
                      <Text fz="xs" c="var(--color-muted)" mt={2}>Our catering team will review your enquiry and send a full quote within 24 hours. No payment required now.</Text>
                    </Box>
                  </Group>
                </Card>
              </Stack>

              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('cat-confirm')}>
                Submit enquiry →
              </Button>
            </Box>
          )}

          {/* ── Catering: Confirmation ─────────────────────────────────────── */}
          {step === 'cat-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
                📋
              </Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Enquiry received!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Our catering team will review your request for{' '}
                <strong>{EVENT_TYPES.find(e => e.value === catEventType)?.label}</strong> on{' '}
                <strong>{catDate ? dayjs(catDate).format('D MMMM YYYY') : ''}</strong>{' '}
                and send a full quote to you within 24 hours.
              </Text>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                You can also reach us directly on WhatsApp to discuss details.
              </Text>

              <Stack gap="sm" align="center" mb="xl">
                {[
                  ['Guests', GUEST_RANGES.find(g => g.value === catGuestRange)?.label ?? ''],
                  ['Venue', `${catVenueAddress}, ${catVenueArea}`],
                  ['Menu style', MENU_STYLES.find(m => m.value === catMenuStyle)?.label ?? ''],
                ].map(([k, v]) => (
                  <Group key={k} justify="space-between" w="100%">
                    <Text fz="sm" c="var(--color-muted)">{k}</Text>
                    <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 240 }}>{v}</Text>
                  </Group>
                ))}
              </Stack>

              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
                  Back to home
                </Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
                  💬 Chat on WhatsApp
                </Button>
              </div>
            </Box>
          )}

        </Box>
      </Box>
    </>
  )
}
