'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  Anchor, Select, TextInput, Textarea, Divider,
} from '@mantine/core'
import { IconMapPin, IconCheck, IconClock } from '@tabler/icons-react'
import { usePlatform } from '@/context/PlatformContext'
import BookingCalendar from '@/components/BookingCalendar'
import PaymentStep from '@/components/PaymentStep'
import { validatePhone, reqText, reqSelect } from '@/lib/validation'
import dayjs from 'dayjs'

// ── Lagos zones & fare matrix ─────────────────────────────────────────────────
const ZONES = [
  { id: 'A', name: 'Lagos Island',     areas: ['Victoria Island', 'Ikoyi', 'Banana Island', 'Oniru', 'CMS', 'Lagos Island'] },
  { id: 'B', name: 'Lekki',            areas: ['Lekki Phase 1', 'Lekki Phase 2', 'Chevron', 'Ikate', 'Oral Estate', 'Osapa', 'Agungi'] },
  { id: 'C', name: 'Ajah / Sangotedo', areas: ['Ajah', 'Sangotedo', 'Abijo', 'Shapati', 'Abraham Adesanya', 'Lakowe'] },
  { id: 'D', name: 'Surulere / Yaba',  areas: ['Surulere', 'Yaba', 'Gbagada', 'Fadeyi', 'Ojuelegba', 'Sabo', 'Iwaya'] },
  { id: 'E', name: 'Ikeja / GRA',      areas: ['Ikeja', 'GRA Ikeja', 'Ogba', 'Alausa', 'Berger', 'Ojodu', 'Agege', 'Maryland'] },
  { id: 'F', name: 'Mushin / Oshodi',  areas: ['Mushin', 'Oshodi', 'Isolo', 'Ilasamaja', 'Ejigbo', 'Mafoluku', 'Mile 2'] },
  { id: 'G', name: 'Ikorodu / Outer',  areas: ['Ikorodu', 'Agric', 'Owutu', 'Badagry', 'Epe', 'Apapa'] },
]

// Car Hire fare matrix (naira, per trip)
const CAR_FARE: Record<string, Record<string, number>> = {
  A: { A: 3500, B: 5000, C: 7500, D: 5500, E: 7000, F: 8000, G: 12000 },
  B: { A: 5000, B: 3500, C: 5000, D: 7000, E: 8500, F: 8500, G: 12000 },
  C: { A: 7500, B: 5000, C: 3500, D: 9000, E: 10000, F: 10000, G: 12000 },
  D: { A: 5500, B: 7000, C: 9000, D: 3500, E: 4500, F: 4500, G: 9000 },
  E: { A: 7000, B: 8500, C: 10000, D: 4500, E: 3500, F: 3500, G: 7000 },
  F: { A: 8000, B: 8500, C: 10000, D: 4500, E: 3500, F: 3500, G: 6000 },
  G: { A: 12000, B: 12000, C: 12000, D: 9000, E: 7000, F: 6000, G: 3500 },
}

// Dispatch fare matrix (naira, per trip)
const DISPATCH_FARE: Record<string, Record<string, number>> = {
  A: { A: 1200, B: 2000, C: 3500, D: 2500, E: 3000, F: 3500, G: 5000 },
  B: { A: 2000, B: 1200, C: 2000, D: 3000, E: 3500, F: 3500, G: 5000 },
  C: { A: 3500, B: 2000, C: 1200, D: 4000, E: 4500, F: 4500, G: 5000 },
  D: { A: 2500, B: 3000, C: 4000, D: 1200, E: 1800, F: 1800, G: 4000 },
  E: { A: 3000, B: 3500, C: 4500, D: 1800, E: 1200, F: 1200, G: 3000 },
  F: { A: 3500, B: 3500, C: 4500, D: 1800, E: 1200, F: 1200, G: 2500 },
  G: { A: 5000, B: 5000, C: 5000, D: 4000, E: 3000, F: 2500, G: 1200 },
}

const ALL_AREA_OPTIONS = ZONES.map(z => ({
  group: z.name,
  items: z.areas.map(a => ({ value: a, label: a })),
}))

function zoneOf(area: string) { return ZONES.find(z => z.areas.includes(area))?.id ?? null }
function zoneName(id: string) { return ZONES.find(z => z.id === id)?.name ?? id }

// ── Car types ─────────────────────────────────────────────────────────────────
const CAR_TYPES = [
  { value: 'sedan',    label: 'Saloon / Sedan', desc: 'Toyota Corolla or similar', icon: '🚗', surcharge: 0 },
  { value: 'suv',      label: 'SUV / Crossover', desc: 'Toyota Prado, Camry or similar', icon: '🚙', surcharge: 2000 },
  { value: 'minivan',  label: 'Minivan / Sienna', desc: 'Toyota Sienna, Hiace', icon: '🚐', surcharge: 4000 },
  { value: 'luxury',   label: 'Luxury / Executive', desc: 'Mercedes, BMW, Lexus', icon: '🏎️', surcharge: 8000 },
]

// ── Dispatch package types ────────────────────────────────────────────────────
const PACKAGE_TYPES = [
  { value: 'document',  label: 'Document / envelope', maxKg: 0.5, icon: '📄' },
  { value: 'small',     label: 'Small package (up to 3 kg)', maxKg: 3, icon: '📦' },
  { value: 'medium',    label: 'Medium package (3–10 kg)', maxKg: 10, icon: '🗃️' },
  { value: 'fragile',   label: 'Fragile item', maxKg: 10, icon: '🫙' },
  { value: 'food',      label: 'Food / perishable', maxKg: 5, icon: '🍱' },
  { value: 'other',     label: 'Other', maxKg: 10, icon: '📫' },
]

// ── Airport terminals ─────────────────────────────────────────────────────────
const AIRPORTS = [
  { value: 'mmia-dom',  label: 'Murtala Muhammed — Domestic Terminal', zone: 'E' },
  { value: 'mmia-int',  label: 'Murtala Muhammed — International Terminal', zone: 'E' },
  { value: 'los',       label: 'Lagos Executive Business Terminal (LOS)', zone: 'E' },
]

const FLIGHT_DIRECTIONS = [
  { value: 'pickup',  label: 'Airport pickup — driver meets me at arrivals' },
  { value: 'dropoff', label: 'Airport drop-off — take me to the airport' },
]

const AIRPORT_CAR_TYPES = [
  { value: 'sedan',   label: 'Saloon / Sedan', price: 15000, icon: '🚗' },
  { value: 'suv',     label: 'SUV / Crossover', price: 22000, icon: '🚙' },
  { value: 'luxury',  label: 'Luxury / Executive', price: 35000, icon: '🏎️' },
]

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, '0')
  const label = i < 12 ? `${i === 0 ? 12 : i}:00 AM` : `${i === 12 ? 12 : i - 12}:00 PM`
  return { value: `${h}:00`, label }
})

const INPUT_LABEL = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

type Step =
  | 'browse'
  // Car Hire
  | 'car-route' | 'car-type' | 'car-schedule' | 'car-review' | 'car-pay' | 'car-confirm'
  // Dispatch
  | 'dispatch-route' | 'dispatch-package' | 'dispatch-review' | 'dispatch-pay' | 'dispatch-confirm'
  // Airport Transfer
  | 'airport-details' | 'airport-car' | 'airport-schedule' | 'airport-review' | 'airport-pay' | 'airport-confirm'

function formatDate(d: Date | null) {
  if (!d) return ''
  return dayjs(d).format('ddd, D MMMM YYYY')
}

export default function RidesPage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('rides')!

  const [step, setStep] = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState(sub.services[0].id)
  const [orderId] = useState(() => `RDE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  // ── Car Hire state ──────────────────────────────────────────────────────────
  const [carPickupArea, setCarPickupArea] = useState<string | null>(null)
  const [carPickupAddress, setCarPickupAddress] = useState('')
  const [carDropoffArea, setCarDropoffArea] = useState<string | null>(null)
  const [carDropoffAddress, setCarDropoffAddress] = useState('')
  const [carType, setCarType] = useState<string | null>(null)
  const [carDate, setCarDate] = useState<Date | null>(null)
  const [carTime, setCarTime] = useState<string | null>(null)
  const [carNote, setCarNote] = useState('')

  // ── Dispatch state ──────────────────────────────────────────────────────────
  const [dispPickupArea, setDispPickupArea] = useState<string | null>(null)
  const [dispPickupAddress, setDispPickupAddress] = useState('')
  const [dispDropoffArea, setDispDropoffArea] = useState<string | null>(null)
  const [dispDropoffAddress, setDispDropoffAddress] = useState('')
  const [dispPackage, setDispPackage] = useState<string | null>(null)
  const [dispRecipient, setDispRecipient] = useState('')
  const [dispRecipientPhone, setDispRecipientPhone] = useState('')
  const [dispNote, setDispNote] = useState('')

  // ── Airport Transfer state ──────────────────────────────────────────────────
  const [airportTerminal, setAirportTerminal] = useState<string | null>(null)
  const [airportDirection, setAirportDirection] = useState<string | null>(null)
  const [airportArea, setAirportArea] = useState<string | null>(null)
  const [airportAddress, setAirportAddress] = useState('')
  const [airportCarType, setAirportCarType] = useState<string | null>(null)
  const [airportDate, setAirportDate] = useState<Date | null>(null)
  const [airportTime, setAirportTime] = useState<string | null>(null)
  const [airportFlight, setAirportFlight] = useState('')
  const [airportNote, setAirportNote] = useState('')

  const active = sub.services.find(s => s.id === selectedService)!

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // ── Validation ────────────────────────────────────────────────────────────
  const carRouteErrors = {
    carPickupArea:    reqSelect(carPickupArea, 'a pickup area'),
    carPickupAddress: reqText(carPickupAddress, 'Pickup address'),
    carDropoffArea:   reqSelect(carDropoffArea, 'a drop-off area'),
    carDropoffAddress: reqText(carDropoffAddress, 'Drop-off address'),
  }
  const dispRouteErrors = {
    dispPickupArea:    reqSelect(dispPickupArea, 'a pickup area'),
    dispPickupAddress: reqText(dispPickupAddress, 'Pickup address'),
    dispDropoffArea:   reqSelect(dispDropoffArea, 'a delivery area'),
    dispDropoffAddress: reqText(dispDropoffAddress, 'Delivery address'),
  }
  const dispPackageErrors = {
    dispRecipient:      reqText(dispRecipient, 'Recipient name'),
    dispRecipientPhone: validatePhone(dispRecipientPhone),
  }
  const airportDetailsErrors = {
    airportTerminal:  reqSelect(airportTerminal, 'a terminal'),
    airportDirection: reqSelect(airportDirection, 'a transfer direction'),
    airportArea:      reqSelect(airportArea, 'an area'),
    airportAddress:   reqText(airportAddress, 'Address'),
  }

  function touchCarRoute()      { setTouched(p => ({ ...p, carPickupArea: true, carPickupAddress: true, carDropoffArea: true, carDropoffAddress: true })) }
  function touchDispRoute()     { setTouched(p => ({ ...p, dispPickupArea: true, dispPickupAddress: true, dispDropoffArea: true, dispDropoffAddress: true })) }
  function touchDispPackage()   { setTouched(p => ({ ...p, dispRecipient: true, dispRecipientPhone: true })) }
  function touchAirportDetails(){ setTouched(p => ({ ...p, airportTerminal: true, airportDirection: true, airportArea: true, airportAddress: true })) }

  // ── Computed fares ──────────────────────────────────────────────────────────
  const carPickupZone = carPickupArea ? zoneOf(carPickupArea) : null
  const carDropoffZone = carDropoffArea ? zoneOf(carDropoffArea) : null
  const carBaseFare = carPickupZone && carDropoffZone ? (CAR_FARE[carPickupZone]?.[carDropoffZone] ?? 5000) : null
  const carTypeMeta = CAR_TYPES.find(c => c.value === carType)
  const carTotal = carBaseFare !== null && carTypeMeta ? carBaseFare + carTypeMeta.surcharge : null

  const dispPickupZone = dispPickupArea ? zoneOf(dispPickupArea) : null
  const dispDropoffZone = dispDropoffArea ? zoneOf(dispDropoffArea) : null
  const dispFare = dispPickupZone && dispDropoffZone ? (DISPATCH_FARE[dispPickupZone]?.[dispDropoffZone] ?? 2500) : null

  const airportCarMeta = AIRPORT_CAR_TYPES.find(c => c.value === airportCarType)
  const airportFare = airportCarMeta?.price ?? null

  // ── Step maps ───────────────────────────────────────────────────────────────
  const FLOW_STEPS: Record<string, { id: Step; label: string }[]> = {
    'car':      [{ id: 'car-route', label: 'Route' }, { id: 'car-type', label: 'Vehicle' }, { id: 'car-schedule', label: 'Schedule' }, { id: 'car-review', label: 'Review' }, { id: 'car-pay', label: 'Pay' }],
    'dispatch': [{ id: 'dispatch-route', label: 'Route' }, { id: 'dispatch-package', label: 'Package' }, { id: 'dispatch-review', label: 'Review' }, { id: 'dispatch-pay', label: 'Pay' }],
    'airport':  [{ id: 'airport-details', label: 'Details' }, { id: 'airport-car', label: 'Vehicle' }, { id: 'airport-schedule', label: 'Schedule' }, { id: 'airport-review', label: 'Review' }, { id: 'airport-pay', label: 'Pay' }],
  }

  const CONFIRM_STEPS: Step[] = ['car-confirm', 'dispatch-confirm', 'airport-confirm', 'car-pay', 'dispatch-pay', 'airport-pay']
  const steps = FLOW_STEPS[selectedService] ?? []
  const currentIdx = steps.findIndex(s => s.id === step)
  const isConfirm = CONFIRM_STEPS.includes(step)

  function startFlow() {
    // van and bus use the same multi-step car hire flow
    const first: Record<string, Step> = {
      'car':      'car-route',
      'van':      'car-route',
      'bus':      'car-route',
      'dispatch': 'dispatch-route',
      'airport':  'airport-details',
    }
    // purchase / enquiry services have no booking flow — open WhatsApp instead
    if (selectedService === 'car-purchase' || selectedService === 'ev-purchase') {
      window.open(`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`, '_blank')
      return
    }
    setStep(first[selectedService] ?? 'browse')
  }

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

        {/* Hero */}
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg,${sub.color},${sub.colorLight})` }}>
          <Box maw={900} mx="auto">
            <Anchor component="button" fz="xs" c="rgba(255,255,255,0.6)" mb="sm" display="block"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => window.history.back()}>← All services</Anchor>
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
              💬 Book on WhatsApp
            </Button>
          </Box>
        </Box>

        {/* Progress bar */}
        {step !== 'browse' && !isConfirm && steps.length > 0 && (
          <Box style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }} px="md" py="sm">
            <Box maw={900} mx="auto">
              <Group gap={0} wrap="nowrap">
                {steps.map((s, i) => {
                  const done = i < currentIdx
                  const isActive = i === currentIdx
                  return (
                    <Group key={s.id} gap={0} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <Group gap={6} wrap="nowrap" style={{ opacity: done || isActive ? 1 : 0.4, minWidth: 0 }}>
                        <Box style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: done ? '#2F9E44' : isActive ? sub.color : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
                          {done ? '✓' : i + 1}
                        </Box>
                        <Text fz="xs" fw={isActive ? 700 : 500} c={isActive ? 'var(--color-ink)' : 'var(--color-muted)'}
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.label}
                        </Text>
                      </Group>
                      {i < steps.length - 1 && <Box style={{ flex: 1, height: 1, background: 'var(--color-border)', minWidth: 8, margin: '0 6px' }} />}
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
                      style={{ borderColor: selectedService === sv.id ? sub.color + '80' : 'var(--color-border)', background: selectedService === sv.id ? sub.colorPale : 'white', cursor: 'pointer', outline: selectedService === sv.id ? `2px solid ${sub.color}50` : 'none' }}>
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

              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="sm">{active.name}</Text>
                <Text fz="xs" c="var(--color-muted)" mb="md" lh={1.6}>{active.description}</Text>
                <Group justify="space-between" mb="xs">
                  <Text fz="sm" c="var(--color-muted)">From</Text>
                  <Text fw={700} fz="sm" style={{ color: sub.color }}>{formatPrice(active.startingPrice)}</Text>
                </Group>
                <Text fz={10} c="var(--color-muted)" mb="sm">Final fare depends on pickup and drop-off zones.</Text>
                <Button fullWidth radius="xl" size="md" mb="xs" mt="sm"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={startFlow}>
                  Book now →
                </Button>
                <Button fullWidth radius="xl" size="sm" component="a"
                  href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Book via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {/* ════════════════ CAR HIRE ════════════════ */}

          {step === 'car-route' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>{active.name} — Route</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Where are you travelling from and to?</Text>
              <Stack gap="md">
                <Select label="Pickup area" placeholder="Select area" data={ALL_AREA_OPTIONS}
                  value={carPickupArea}
                  onChange={v => { setCarPickupArea(v); setTouched(p => ({ ...p, carPickupArea: true })) }}
                  error={touched.carPickupArea ? carRouteErrors.carPickupArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label="Pickup address" placeholder="e.g. 14 Ozumba Mbadiwe, Victoria Island"
                  value={carPickupAddress} onChange={e => setCarPickupAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, carPickupAddress: true }))}
                  error={touched.carPickupAddress ? carRouteErrors.carPickupAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label="Drop-off area" placeholder="Select area" data={ALL_AREA_OPTIONS}
                  value={carDropoffArea}
                  onChange={v => { setCarDropoffArea(v); setTouched(p => ({ ...p, carDropoffArea: true })) }}
                  error={touched.carDropoffArea ? carRouteErrors.carDropoffArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label="Drop-off address" placeholder="e.g. 3 Admiralty Way, Lekki Phase 1"
                  value={carDropoffAddress} onChange={e => setCarDropoffAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, carDropoffAddress: true }))}
                  error={touched.carDropoffAddress ? carRouteErrors.carDropoffAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />

                {/* Live fare preview */}
                {carPickupZone && carDropoffZone && (
                  <Card radius="xl" p="md" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                    <Group justify="space-between" mb={4}>
                      <Group gap={6}>
                        <IconMapPin size={15} color={sub.color} />
                        <Text fz="sm" fw={600} c="var(--color-ink)">Base fare</Text>
                      </Group>
                      <Badge size="sm" radius="sm" style={{ background: sub.colorPale, color: sub.color }}>
                        {zoneName(carPickupZone)} → {zoneName(carDropoffZone)}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Saloon car fare</Text>
                      <Text fz="sm" fw={700} style={{ color: sub.color }}>{formatPrice(CAR_FARE[carPickupZone][carDropoffZone])}</Text>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)" mt={4}>SUV / Luxury surcharge applies at next step</Text>
                  </Card>
                )}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchCarRoute(); if (Object.values(carRouteErrors).some(Boolean)) return; setStep('car-type') }}>
                Choose vehicle →
              </Button>
            </Box>
          )}

          {step === 'car-type' && (
            <Box maw={540}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('car-route')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Select vehicle type</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Choose the type of car you need</Text>
              <Stack gap="sm">
                {CAR_TYPES.map(ct => (
                  <Card key={ct.value} radius="xl" withBorder p="md" onClick={() => setCarType(ct.value)}
                    style={{ borderColor: carType === ct.value ? sub.color + '80' : 'var(--color-border)', background: carType === ct.value ? sub.colorPale : 'white', cursor: 'pointer', outline: carType === ct.value ? `2px solid ${sub.color}50` : 'none' }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Text fz="2xl">{ct.icon}</Text>
                        <Box>
                          <Text fw={700} fz="sm" c="var(--color-ink)">{ct.label}</Text>
                          <Text fz="xs" c="var(--color-muted)">{ct.desc}</Text>
                        </Box>
                      </Group>
                      <Box style={{ textAlign: 'right', flexShrink: 0 }}>
                        {ct.surcharge > 0
                          ? <Text fz="sm" fw={700} style={{ color: sub.color }}>+{formatPrice(ct.surcharge)}</Text>
                          : <Badge size="xs" radius="sm" style={{ background: '#EBFBEE', color: '#2F9E44' }}>Base fare</Badge>}
                        {carBaseFare !== null && (
                          <Text fz="xs" c="var(--color-muted)" mt={2}>Total: {formatPrice(carBaseFare + ct.surcharge)}</Text>
                        )}
                      </Box>
                      {carType === ct.value && (
                        <Box style={{ width: 22, height: 22, borderRadius: '50%', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 8 }}>
                          <IconCheck size={13} color="white" />
                        </Box>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl" disabled={!carType}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('car-schedule')}>
                Choose date & time →
              </Button>
            </Box>
          )}

          {step === 'car-schedule' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('car-type')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Schedule your ride</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">When do you need the car?</Text>
              <Stack gap="lg">
                <Box>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="xs">Select date</Text>
                  <BookingCalendar serviceId="car" value={carDate} onChange={setCarDate} minDaysAhead={0} />
                </Box>
                <Select label="Pickup time" placeholder="Select time" data={TIME_OPTIONS}
                  value={carTime} onChange={setCarTime} size="md" radius="xl"
                  leftSection={<IconClock size={16} />} styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)"
                  placeholder="e.g. I have luggage, need child seat, driver to call on arrival…"
                  value={carNote} onChange={e => setCarNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl" disabled={!carDate || !carTime}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('car-review')}>
                Review booking →
              </Button>
            </Box>
          )}

          {step === 'car-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('car-schedule')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review booking</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Route</Text>
                  <Stack gap="xs">
                    <Group gap="sm" align="flex-start">
                      <Box style={{ width: 28, height: 28, borderRadius: '50%', background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text fz="xs">📍</Text></Box>
                      <Box>
                        <Text fz="xs" c="var(--color-muted)">Pickup</Text>
                        <Text fz="sm" fw={600}>{carPickupAddress}</Text>
                        <Text fz="xs" c="var(--color-muted)">{carPickupArea} · {carPickupZone ? zoneName(carPickupZone) : ''}</Text>
                      </Box>
                    </Group>
                    <Box style={{ width: 1, height: 16, background: 'var(--color-border)', marginLeft: 13 }} />
                    <Group gap="sm" align="flex-start">
                      <Box style={{ width: 28, height: 28, borderRadius: '50%', background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Text fz="xs">🏁</Text></Box>
                      <Box>
                        <Text fz="xs" c="var(--color-muted)">Drop-off</Text>
                        <Text fz="sm" fw={600}>{carDropoffAddress}</Text>
                        <Text fz="xs" c="var(--color-muted)">{carDropoffArea} · {carDropoffZone ? zoneName(carDropoffZone) : ''}</Text>
                      </Box>
                    </Group>
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Booking details</Text>
                  <Stack gap="xs">
                    {[
                      ['Vehicle', CAR_TYPES.find(c => c.value === carType)?.label ?? ''],
                      ['Date', formatDate(carDate)],
                      ['Time', TIME_OPTIONS.find(t => t.value === carTime)?.label ?? ''],
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Fare breakdown</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Base fare ({carPickupZone ? zoneName(carPickupZone) : ''} → {carDropoffZone ? zoneName(carDropoffZone) : ''})</Text>
                      <Text fz="sm">{carBaseFare ? formatPrice(carBaseFare) : '—'}</Text>
                    </Group>
                    {carTypeMeta && carTypeMeta.surcharge > 0 && (
                      <Group justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{carTypeMeta.label} surcharge</Text>
                        <Text fz="sm">{formatPrice(carTypeMeta.surcharge)}</Text>
                      </Group>
                    )}
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Total fare</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{carTotal ? formatPrice(carTotal) : '—'}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('car-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'car-pay' && (
            <PaymentStep
              amount={carTotal ?? 0}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service', value: 'Car Hire' },
                { label: 'Vehicle', value: CAR_TYPES.find(c => c.value === carType)?.label ?? '' },
                { label: 'Date', value: formatDate(carDate) },
                { label: 'Time', value: TIME_OPTIONS.find(t => t.value === carTime)?.label ?? '' },
                { label: 'Route', value: `${carPickupArea} → ${carDropoffArea}` },
              ]}
              orderPayload={{
                service_title: 'Car Hire',
                service_description: `${CAR_TYPES.find(c => c.value === carType)?.label ?? ''} — ${carPickupArea} → ${carDropoffArea}`,
                category: 'Rides and Logistics',
                total_amount: carTotal ?? 0,
                final_amount: carTotal ?? 0,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  vehicle_type: carType,
                  pickup_area: carPickupArea,
                  pickup_address: carPickupAddress,
                  dropoff_area: carDropoffArea,
                  dropoff_address: carDropoffAddress,
                  ride_date: carDate ? dayjs(carDate).format('YYYY-MM-DD') : null,
                  ride_time: carTime,
                  note: carNote || null,
                },
              }}
              onBack={() => setStep('car-review')}
              onPay={() => setStep('car-confirm')}
            />
          )}

          {step === 'car-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🚗</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Ride booked!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Your {CAR_TYPES.find(c => c.value === carType)?.label} has been booked for <strong>{formatDate(carDate)}</strong> at <strong>{TIME_OPTIONS.find(t => t.value === carTime)?.label}</strong>.
              </Text>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Your driver&apos;s details will be sent via WhatsApp before pickup.</Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Chat on WhatsApp</Button>
              </div>
            </Box>
          )}

          {/* ════════════════ DISPATCH RIDER ════════════════ */}

          {step === 'dispatch-route' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Dispatch Rider — Route</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Where should the rider collect from and deliver to?</Text>
              <Stack gap="md">
                <Select label="Pickup area" placeholder="Select area" data={ALL_AREA_OPTIONS}
                  value={dispPickupArea}
                  onChange={v => { setDispPickupArea(v); setTouched(p => ({ ...p, dispPickupArea: true })) }}
                  error={touched.dispPickupArea ? dispRouteErrors.dispPickupArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label="Pickup address" placeholder="e.g. 5 Marina Street, Lagos Island"
                  value={dispPickupAddress} onChange={e => setDispPickupAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, dispPickupAddress: true }))}
                  error={touched.dispPickupAddress ? dispRouteErrors.dispPickupAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label="Delivery area" placeholder="Select area" data={ALL_AREA_OPTIONS}
                  value={dispDropoffArea}
                  onChange={v => { setDispDropoffArea(v); setTouched(p => ({ ...p, dispDropoffArea: true })) }}
                  error={touched.dispDropoffArea ? dispRouteErrors.dispDropoffArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label="Delivery address" placeholder="e.g. 12 Allen Avenue, Ikeja"
                  value={dispDropoffAddress} onChange={e => setDispDropoffAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, dispDropoffAddress: true }))}
                  error={touched.dispDropoffAddress ? dispRouteErrors.dispDropoffAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />

                {dispPickupZone && dispDropoffZone && (
                  <Card radius="xl" p="md" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                    <Group justify="space-between" mb={4}>
                      <Group gap={6}>
                        <IconMapPin size={15} color={sub.color} />
                        <Text fz="sm" fw={600}>Delivery fare</Text>
                      </Group>
                      <Badge size="sm" radius="sm" style={{ background: sub.colorPale, color: sub.color }}>
                        {zoneName(dispPickupZone)} → {zoneName(dispDropoffZone)}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Rider fare</Text>
                      <Text fz="sm" fw={700} style={{ color: sub.color }}>{formatPrice(DISPATCH_FARE[dispPickupZone][dispDropoffZone])}</Text>
                    </Group>
                  </Card>
                )}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchDispRoute(); if (Object.values(dispRouteErrors).some(Boolean)) return; setStep('dispatch-package') }}>
                Package details →
              </Button>
            </Box>
          )}

          {step === 'dispatch-package' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('dispatch-route')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Package details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us what the rider will be delivering</Text>
              <Stack gap="md">
                <Box>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="xs">Package type</Text>
                  <Stack gap="xs">
                    {PACKAGE_TYPES.map(pt => (
                      <Card key={pt.value} radius="lg" withBorder p="sm" onClick={() => setDispPackage(pt.value)}
                        style={{ borderColor: dispPackage === pt.value ? sub.color + '80' : 'var(--color-border)', background: dispPackage === pt.value ? sub.colorPale : 'white', cursor: 'pointer' }}>
                        <Group justify="space-between">
                          <Group gap="sm">
                            <Text fz="xl">{pt.icon}</Text>
                            <Text fz="sm" fw={dispPackage === pt.value ? 700 : 500}>{pt.label}</Text>
                          </Group>
                          {dispPackage === pt.value && <IconCheck size={16} color={sub.color} />}
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Box>
                <TextInput label="Recipient name" placeholder="Who should receive the package?"
                  value={dispRecipient} onChange={e => setDispRecipient(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, dispRecipient: true }))}
                  error={touched.dispRecipient ? dispPackageErrors.dispRecipient : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <TextInput label="Recipient phone number" placeholder="e.g. 08012345678" type="tel"
                  value={dispRecipientPhone} onChange={e => setDispRecipientPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, dispRecipientPhone: true }))}
                  error={touched.dispRecipientPhone ? dispPackageErrors.dispRecipientPhone : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)" placeholder="e.g. Handle with care, call before delivery, gate code 1234…"
                  value={dispNote} onChange={e => setDispNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchDispPackage(); if (!dispPackage || Object.values(dispPackageErrors).some(Boolean)) return; setStep('dispatch-review') }}>
                Review order →
              </Button>
            </Box>
          )}

          {step === 'dispatch-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('dispatch-package')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review dispatch order</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Route</Text>
                  <Stack gap="xs">
                    <Group gap="sm">
                      <Text fz="sm" c="var(--color-muted)" w={60}>Collect</Text>
                      <Text fz="sm" fw={500}>{dispPickupAddress}, {dispPickupArea}</Text>
                    </Group>
                    <Group gap="sm">
                      <Text fz="sm" c="var(--color-muted)" w={60}>Deliver</Text>
                      <Text fz="sm" fw={500}>{dispDropoffAddress}, {dispDropoffArea}</Text>
                    </Group>
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Package & recipient</Text>
                  <Stack gap="xs">
                    {[
                      ['Package', PACKAGE_TYPES.find(p => p.value === dispPackage)?.label ?? ''],
                      ['Recipient', dispRecipient],
                      ['Phone', dispRecipientPhone],
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Rider fare</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{dispFare ? formatPrice(dispFare) : '—'}</Text>
                  </Group>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('dispatch-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'dispatch-pay' && (
            <PaymentStep
              amount={dispFare ?? 0}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service', value: 'Dispatch Rider' },
                { label: 'Package', value: PACKAGE_TYPES.find(p => p.value === dispPackage)?.label ?? '' },
                { label: 'From', value: dispPickupArea ?? '' },
                { label: 'To', value: dispDropoffArea ?? '' },
              ]}
              orderPayload={{
                service_title: 'Dispatch Rider',
                service_description: `${PACKAGE_TYPES.find(p => p.value === dispPackage)?.label ?? ''} — ${dispPickupArea} → ${dispDropoffArea}`,
                category: 'Rides and Logistics',
                total_amount: dispFare ?? 0,
                final_amount: dispFare ?? 0,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  package_type: dispPackage,
                  pickup_area: dispPickupArea,
                  pickup_address: dispPickupAddress,
                  dropoff_area: dispDropoffArea,
                  dropoff_address: dispDropoffAddress,
                  recipient_name: dispRecipient,
                  recipient_phone: dispRecipientPhone,
                  note: dispNote || null,
                },
              }}
              onBack={() => setStep('dispatch-review')}
              onPay={() => setStep('dispatch-confirm')}
            />
          )}

          {step === 'dispatch-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🏍️</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Rider dispatched!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                A rider will collect from <strong>{dispPickupAddress}</strong> and deliver to <strong>{dispRecipient}</strong> at <strong>{dispDropoffAddress}</strong>. Rider details will be sent via WhatsApp.
              </Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Track on WhatsApp</Button>
              </div>
            </Box>
          )}

          {/* ════════════════ AIRPORT TRANSFER ════════════════ */}

          {step === 'airport-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Airport Transfer</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Pickup or drop-off at the airport?</Text>
              <Stack gap="md">
                <Select label="Airport terminal" placeholder="Select terminal" data={AIRPORTS}
                  value={airportTerminal}
                  onChange={v => { setAirportTerminal(v); setTouched(p => ({ ...p, airportTerminal: true })) }}
                  error={touched.airportTerminal ? airportDetailsErrors.airportTerminal : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label="Transfer direction" placeholder="Select" data={FLIGHT_DIRECTIONS}
                  value={airportDirection}
                  onChange={v => { setAirportDirection(v); setTouched(p => ({ ...p, airportDirection: true })) }}
                  error={touched.airportDirection ? airportDetailsErrors.airportDirection : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label={airportDirection === 'pickup' ? 'Drop-off area (your destination)' : 'Pickup area (your location)'}
                  placeholder="Select your area" data={ALL_AREA_OPTIONS}
                  value={airportArea}
                  onChange={v => { setAirportArea(v); setTouched(p => ({ ...p, airportArea: true })) }}
                  error={touched.airportArea ? airportDetailsErrors.airportArea : undefined}
                  size="md" radius="xl" searchable styles={INPUT_LABEL} />
                <TextInput label={airportDirection === 'pickup' ? 'Drop-off address' : 'Pickup address'}
                  placeholder="e.g. 4 Bourdillon Road, Ikoyi"
                  value={airportAddress} onChange={e => setAirportAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, airportAddress: true }))}
                  error={touched.airportAddress ? airportDetailsErrors.airportAddress : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <TextInput label="Flight number (optional)" placeholder="e.g. QR 1425"
                  value={airportFlight} onChange={e => setAirportFlight(e.target.value)} size="md" radius="xl" styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchAirportDetails(); if (Object.values(airportDetailsErrors).some(Boolean)) return; setStep('airport-car') }}>
                Choose vehicle →
              </Button>
            </Box>
          )}

          {step === 'airport-car' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('airport-details')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Select vehicle</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Airport transfer fares are fixed regardless of area</Text>
              <Stack gap="sm">
                {AIRPORT_CAR_TYPES.map(ct => (
                  <Card key={ct.value} radius="xl" withBorder p="md" onClick={() => setAirportCarType(ct.value)}
                    style={{ borderColor: airportCarType === ct.value ? sub.color + '80' : 'var(--color-border)', background: airportCarType === ct.value ? sub.colorPale : 'white', cursor: 'pointer' }}>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Text fz="2xl">{ct.icon}</Text>
                        <Text fw={700} fz="sm" c="var(--color-ink)">{ct.label}</Text>
                      </Group>
                      <Group gap="sm">
                        <Text fw={700} style={{ color: sub.color }}>{formatPrice(ct.price)}</Text>
                        {airportCarType === ct.value && <IconCheck size={16} color={sub.color} />}
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl" disabled={!airportCarType}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('airport-schedule')}>
                Choose date & time →
              </Button>
            </Box>
          )}

          {step === 'airport-schedule' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('airport-car')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Date & time</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">When is your transfer?</Text>
              <Stack gap="lg">
                <Box>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="xs">Date</Text>
                  <BookingCalendar serviceId="airport" value={airportDate} onChange={setAirportDate} minDaysAhead={0} />
                </Box>
                <Select label="Time" placeholder="Select time" data={TIME_OPTIONS}
                  value={airportTime} onChange={setAirportTime} size="md" radius="xl"
                  leftSection={<IconClock size={16} />} styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)" placeholder="e.g. 2 large suitcases, need meet & greet, travelling with toddler…"
                  value={airportNote} onChange={e => setAirportNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl" disabled={!airportDate || !airportTime}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('airport-review')}>
                Review booking →
              </Button>
            </Box>
          )}

          {step === 'airport-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('airport-schedule')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review booking</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Transfer details</Text>
                  <Stack gap="xs">
                    {[
                      ['Terminal',   AIRPORTS.find(a => a.value === airportTerminal)?.label ?? ''],
                      ['Direction',  FLIGHT_DIRECTIONS.find(d => d.value === airportDirection)?.label ?? ''],
                      [airportDirection === 'pickup' ? 'Drop-off' : 'Pickup', `${airportAddress}, ${airportArea}`],
                      ['Vehicle',    AIRPORT_CAR_TYPES.find(c => c.value === airportCarType)?.label ?? ''],
                      ['Date',       formatDate(airportDate)],
                      ['Time',       TIME_OPTIONS.find(t => t.value === airportTime)?.label ?? ''],
                      ...(airportFlight ? [['Flight', airportFlight]] : []),
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 240 }}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Fixed fare</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{airportFare ? formatPrice(airportFare) : '—'}</Text>
                  </Group>
                  <Text fz="xs" c="var(--color-muted)" mt={4}>All-inclusive. No extra charges.</Text>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('airport-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'airport-pay' && (
            <PaymentStep
              amount={airportFare ?? 0}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service', value: 'Airport Transfer' },
                { label: 'Terminal', value: AIRPORTS.find(a => a.value === airportTerminal)?.label ?? '' },
                { label: 'Direction', value: FLIGHT_DIRECTIONS.find(d => d.value === airportDirection)?.label ?? '' },
                { label: 'Vehicle', value: AIRPORT_CAR_TYPES.find(c => c.value === airportCarType)?.label ?? '' },
                { label: 'Date', value: formatDate(airportDate) },
              ]}
              orderPayload={{
                service_title: 'Airport Transfer',
                service_description: `${AIRPORTS.find(a => a.value === airportTerminal)?.label ?? ''} — ${FLIGHT_DIRECTIONS.find(d => d.value === airportDirection)?.label ?? ''}`,
                category: 'Rides and Logistics',
                total_amount: airportFare ?? 0,
                final_amount: airportFare ?? 0,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  terminal: airportTerminal,
                  direction: airportDirection,
                  vehicle_type: airportCarType,
                  area: airportArea,
                  address: airportAddress,
                  flight_number: airportFlight || null,
                  transfer_date: airportDate ? dayjs(airportDate).format('YYYY-MM-DD') : null,
                  transfer_time: airportTime,
                  note: airportNote || null,
                },
              }}
              onBack={() => setStep('airport-review')}
              onPay={() => setStep('airport-confirm')}
            />
          )}

          {step === 'airport-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✈️</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Transfer booked!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                Your airport transfer on <strong>{formatDate(airportDate)}</strong> at <strong>{TIME_OPTIONS.find(t => t.value === airportTime)?.label}</strong> is confirmed. Your driver&apos;s details will be sent via WhatsApp 2 hours before the transfer.
              </Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Chat on WhatsApp</Button>
              </div>
            </Box>
          )}

        </Box>
      </Box>
    </>
  )
}
