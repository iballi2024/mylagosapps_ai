'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BookingCalendar from '@/components/BookingCalendar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  Anchor, TextInput, Textarea, Select, Checkbox, Progress, SimpleGrid,
} from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'
import PaymentStep from '@/components/PaymentStep'
import dayjs from 'dayjs'
import { validatePhone, reqText, reqSelect } from '@/lib/validation'

// ── Zone data (same 7-zone Lagos grid as rides) ──────────────────────────────
const ZONES = [
  'A – Lagos Island / VI / Ikoyi',
  'B – Lekki / Ajah / Sangotedo',
  'C – Surulere / Yaba / Ebute-Metta',
  'D – Ikeja / Maryland / Ogba',
  'E – Gbagada / Shomolu / Bariga',
  'F – Mushin / Oshodi / Isolo',
  'G – Alimosho / Egbeda / Iyana-Ipaja',
]
const ZONE_OPTIONS = ZONES.map((z, i) => ({ value: String(i), label: z }))

// Pharmacy delivery fare (₦) per zone pair
const PHARMA_FARE: number[][] = [
  [500,  700, 900, 1000, 1000, 1100, 1500],
  [700,  500, 1000,1100, 1100, 1200, 1500],
  [900, 1000, 500,  700,  800,  800, 1200],
  [1000,1100, 700,  500,  600,  700, 1000],
  [1000,1100, 800,  600,  500,  600, 1000],
  [1100,1200, 800,  700,  600,  500,  800],
  [1500,1500,1200, 1000, 1000,  800,  500],
]

// ── Lab tests catalogue ───────────────────────────────────────────────────────
const LAB_TESTS = [
  { id: 'malaria',    name: 'Malaria RDT',             price: 3500,  turnaround: '2 hrs'  },
  { id: 'typhoid',   name: 'Typhoid (Widal Test)',     price: 3000,  turnaround: '24 hrs' },
  { id: 'fbc',       name: 'Full Blood Count (FBC)',   price: 5000,  turnaround: '24 hrs' },
  { id: 'hiv',       name: 'HIV Screening',            price: 4000,  turnaround: '2 hrs'  },
  { id: 'rbs',       name: 'Blood Sugar (RBS)',        price: 2500,  turnaround: '1 hr'   },
  { id: 'hepb',      name: 'Hepatitis B Surface Ag',  price: 4500,  turnaround: '24 hrs' },
  { id: 'kidney',    name: 'Kidney Function Test',     price: 8000,  turnaround: '48 hrs' },
  { id: 'liver',     name: 'Liver Function Test',      price: 8500,  turnaround: '48 hrs' },
  { id: 'covid',     name: 'COVID-19 PCR',             price: 15000, turnaround: '48 hrs' },
  { id: 'urinalysis',name: 'Urinalysis',               price: 2000,  turnaround: '2 hrs'  },
]
const HOME_VISIT_FEE = 2500

// ── Doctor specialties ────────────────────────────────────────────────────────
const SPECIALTIES = [
  { value: 'gp',           label: 'General Practitioner',     price: 5000  },
  { value: 'pediatrician', label: 'Pediatrician',             price: 7000  },
  { value: 'gynecologist', label: 'Gynecologist / Obs',       price: 8000  },
  { value: 'cardiologist', label: 'Cardiologist',             price: 12000 },
  { value: 'dermatologist',label: 'Dermatologist',            price: 7500  },
  { value: 'dentist',      label: 'Dentist (Virtual Advice)', price: 5000  },
]

const TIME_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00']

type Step =
  | 'browse'
  | 'ph-items'    | 'ph-address'   | 'ph-review'    | 'ph-pay'    | 'ph-confirm'
  | 'lab-tests'   | 'lab-schedule' | 'lab-review'   | 'lab-pay'   | 'lab-confirm'
  | 'doc-specialty'| 'doc-schedule'| 'doc-symptoms' | 'doc-review'| 'doc-pay' | 'doc-confirm'

export default function ServicePage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('healthcare')!

  const [step, setStep] = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState(sub.services[0].id)

  // ── Pharmacy state ─────────────────────────────────────────────────────────
  const [phType, setPhType] = useState<'prescription' | 'otc' | ''>('')
  const [phItems, setPhItems] = useState('')
  const [phZoneFrom, setPhZoneFrom] = useState<string | null>(null)
  const [phZoneTo,   setPhZoneTo]   = useState<string | null>(null)
  const [phAddress, setPhAddress] = useState('')

  // ── Lab state ──────────────────────────────────────────────────────────────
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [labDate, setLabDate] = useState<Date | null>(null)
  const [labTime, setLabTime] = useState<string | null>(null)
  const [labAddress, setLabAddress] = useState('')
  const [labPhone, setLabPhone] = useState('')

  // ── Doctor state ───────────────────────────────────────────────────────────
  const [docSpecialty, setDocSpecialty] = useState<string | null>(null)
  const [docMode, setDocMode] = useState<'video' | 'phone' | ''>('')
  const [docDate, setDocDate] = useState<Date | null>(null)
  const [docTime, setDocTime] = useState<string | null>(null)
  const [docSymptoms, setDocSymptoms] = useState('')
  const [docName, setDocName] = useState('')
  const [docPhone, setDocPhone] = useState('')

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isPharmacy = selectedService === 'pharmacy'
  const isLab      = selectedService === 'lab'
  const isDoctor   = selectedService === 'doctor'

  // Derived pricing
  const phFare = phZoneFrom !== null && phZoneTo !== null
    ? PHARMA_FARE[Number(phZoneFrom)][Number(phZoneTo)]
    : null

  const selectedTestObjs = LAB_TESTS.filter(t => selectedTests.includes(t.id))
  const labSubtotal = selectedTestObjs.reduce((s, t) => s + t.price, 0)
  const labTotal    = labSubtotal + HOME_VISIT_FEE

  const specialtyObj = SPECIALTIES.find(s => s.value === docSpecialty)
  const docFee = specialtyObj?.price ?? 0

  // ── Validation ────────────────────────────────────────────────────────────
  const phItemsErrors  = { phItems: reqText(phItems, 'Item list') }
  const phAddressErrors = {
    phZoneFrom: reqSelect(phZoneFrom, 'a pharmacy zone'),
    phZoneTo:   reqSelect(phZoneTo, 'your delivery zone'),
    phAddress:  reqText(phAddress, 'Street address'),
  }
  const labScheduleErrors = {
    labAddress: reqText(labAddress, 'Home address'),
    labPhone:   validatePhone(labPhone),
  }
  const docSymptomsErrors = {
    docName:     reqText(docName, 'Your name'),
    docPhone:    validatePhone(docPhone),
    docSymptoms: reqText(docSymptoms, 'Symptoms / reason for visit'),
  }

  function touchPhItems()    { setTouched(p => ({ ...p, phItems: true })) }
  function touchPhAddress()  { setTouched(p => ({ ...p, phZoneFrom: true, phZoneTo: true, phAddress: true })) }
  function touchLabSchedule(){ setTouched(p => ({ ...p, labAddress: true, labPhone: true })) }
  function touchDocSymptoms(){ setTouched(p => ({ ...p, docName: true, docPhone: true, docSymptoms: true })) }

  function startFlow() {
    if (isPharmacy) setStep('ph-items')
    else if (isLab)  setStep('lab-tests')
    else             setStep('doc-specialty')
  }

  function getProgress() {
    if (step === 'ph-items')      return 33
    if (step === 'ph-address')    return 66
    if (step === 'ph-review')     return 75
    if (step === 'ph-pay')        return 100
    if (step === 'lab-tests')     return 33
    if (step === 'lab-schedule')  return 66
    if (step === 'lab-review')    return 75
    if (step === 'lab-pay')       return 100
    if (step === 'doc-specialty') return 25
    if (step === 'doc-schedule')  return 50
    if (step === 'doc-symptoms')  return 75
    if (step === 'doc-review')    return 88
    if (step === 'doc-pay')       return 100
    return 0
  }

  const isFlowActive = step !== 'browse' && !step.endsWith('-confirm')

  const backBtn = (target: Step) => (
    <Anchor component="button" fz="xs" c="var(--color-muted)" mb="md" display="block"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      onClick={() => setStep(target)}>← Back</Anchor>
  )

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
            <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g,'')}`} target="_blank"
              size="sm" radius="xl" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
              💬 Order on WhatsApp
            </Button>
          </Box>
        </Box>

        <Box maw={900} mx="auto" p="md" py="xl">

          {/* Progress */}
          {isFlowActive && (
            <Box mb="lg">
              <Progress value={getProgress()} color={sub.color} radius="xl" size="sm" />
            </Box>
          )}

          {/* ── BROWSE ─────────────────────────────────────────────────────── */}
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
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="xs">
                  {isPharmacy ? '💊 Pharmacy Delivery' : isLab ? '🧪 Home Lab Test' : '👨‍⚕️ Doctor Consultation'}
                </Text>
                <Text fz="xs" c="var(--color-muted)" mb="md" lh={1.6}>
                  {isPharmacy
                    ? 'Order prescription or OTC drugs and have them delivered to your door within 2 hours.'
                    : isLab
                    ? 'Book a home visit for sample collection. Results sent via WhatsApp & email.'
                    : 'Speak with a licensed Nigerian doctor via video or phone call.'}
                </Text>
                <Button fullWidth radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={startFlow}>
                  {isPharmacy ? 'Order medicine →' : isLab ? 'Book test →' : 'Book consultation →'}
                </Button>
              </Card>
            </Group>
          )}

          {/* ── PHARMACY: Step 1 – Items ────────────────────────────────────── */}
          {step === 'ph-items' && (
            <Box maw={560} mx="auto">
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>What do you need?</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Tell us what medicines you need. We&apos;ll source from the nearest licensed pharmacy.</Text>
              <Stack gap="md">
                <Box>
                  <Text fw={600} fz="sm" c="var(--color-ink)" mb="xs">Order type</Text>
                  <Group gap="sm">
                    {(['prescription', 'otc'] as const).map(t => (
                      <Card key={t} radius="lg" withBorder p="sm" onClick={() => setPhType(t)}
                        style={{ cursor: 'pointer', flex: 1, borderColor: phType === t ? sub.color : 'var(--color-border)', background: phType === t ? sub.colorPale : 'white' }}>
                        <Text fw={700} fz="sm" c="var(--color-ink)">{t === 'prescription' ? '📋 Prescription' : '🧴 OTC'}</Text>
                        <Text fz="xs" c="var(--color-muted)">{t === 'prescription' ? 'Doctor-issued script' : 'Vitamins, pain relief, etc.'}</Text>
                      </Card>
                    ))}
                  </Group>
                </Box>

                <Textarea
                  label="List your items"
                  description={phType === 'prescription'
                    ? 'Copy each drug name and dosage from your prescription'
                    : 'e.g. Paracetamol 500mg × 20, Vitamin C 1000mg × 60'}
                  placeholder={'e.g. Amoxicillin 500mg × 21 capsules\nMetronidazole 200mg × 21 tablets'}
                  minRows={4} radius="lg"
                  value={phItems} onChange={e => setPhItems(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, phItems: true }))}
                  error={touched.phItems ? phItemsErrors.phItems : undefined}
                />

                {phType === 'prescription' && (
                  <Card radius="lg" p="sm" style={{ background: '#FFF8E1' }} withBorder>
                    <Text fz="xs" c="#7A5800">📎 Our pharmacist will call to verify your prescription before dispensing.</Text>
                  </Card>
                )}

                <Button radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => { touchPhItems(); if (!phType || Object.values(phItemsErrors).some(Boolean)) return; setStep('ph-address') }}>
                  Continue →
                </Button>
              </Stack>
            </Box>
          )}

          {/* PHARMACY: Step 2 – Address */}
          {step === 'ph-address' && (
            <Box maw={560} mx="auto">
              {backBtn('ph-items')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Delivery details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Where should we pick up and deliver to?</Text>
              <Stack gap="md">
                <Select label="Pharmacy zone (nearest pharmacy)" placeholder="Select zone"
                  data={ZONE_OPTIONS} value={phZoneFrom}
                  onChange={v => { setPhZoneFrom(v); setTouched(p => ({ ...p, phZoneFrom: true })) }}
                  error={touched.phZoneFrom ? phAddressErrors.phZoneFrom : undefined}
                  radius="lg" />
                <Select label="Your delivery zone" placeholder="Select your zone"
                  data={ZONE_OPTIONS} value={phZoneTo}
                  onChange={v => { setPhZoneTo(v); setTouched(p => ({ ...p, phZoneTo: true })) }}
                  error={touched.phZoneTo ? phAddressErrors.phZoneTo : undefined}
                  radius="lg" />
                <TextInput label="Street address" placeholder="House number, street, estate, landmark"
                  value={phAddress} onChange={e => setPhAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, phAddress: true }))}
                  error={touched.phAddress ? phAddressErrors.phAddress : undefined}
                  radius="lg" />

                {phFare !== null && (
                  <Card radius="lg" p="sm" style={{ background: sub.colorPale, borderColor: sub.color + '40' }} withBorder>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Estimated delivery fee</Text>
                      <Text fw={700} fz="sm" style={{ color: sub.color }}>{formatPrice(phFare)}</Text>
                    </Group>
                  </Card>
                )}

                <Button radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => { touchPhAddress(); if (Object.values(phAddressErrors).some(Boolean)) return; setStep('ph-review') }}>
                  Review order →
                </Button>
              </Stack>
            </Box>
          )}

          {/* PHARMACY: Step 3 – Review */}
          {step === 'ph-review' && phFare !== null && (
            <Box maw={560} mx="auto">
              {backBtn('ph-address')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="lg">Review order</Title>
              <Card radius="xl" withBorder p="lg" mb="md" style={{ borderColor: 'var(--color-border)' }}>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Order type</Text>
                    <Text fz="sm" fw={500}>{phType === 'prescription' ? 'Prescription' : 'OTC'}</Text>
                  </Group>
                  <Group justify="space-between" align="flex-start">
                    <Text fz="sm" c="var(--color-muted)" style={{ flexShrink: 0 }}>Items</Text>
                    <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 300, whiteSpace: 'pre-line' }}>{phItems}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Delivery address</Text>
                    <Text fz="sm" fw={500} ta="right">{phAddress}</Text>
                  </Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Delivery fee</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(phFare)}</Text>
                  </Group>
                  <Text fz="xs" c="var(--color-muted)">Drug cost billed separately after pharmacist confirms availability.</Text>
                </Stack>
              </Card>
              <Card radius="lg" p="sm" style={{ background: '#E8F4FF' }} withBorder mb="md">
                <Text fz="xs" c="#1565C0">⏱️ Estimated delivery: <strong>2 hours</strong> after pharmacist confirmation.</Text>
              </Card>
              <Button fullWidth radius="xl" size="md"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('ph-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {/* PHARMACY: Pay */}
          {step === 'ph-pay' && phFare !== null && (
            <PaymentStep
              amount={phFare}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service', value: 'Pharmacy Delivery' },
                { label: 'Delivery fee', value: formatPrice(phFare) },
              ]}
              onBack={() => setStep('ph-review')}
              onPay={() => setStep('ph-confirm')}
            />
          )}

          {/* PHARMACY: Confirm */}
          {step === 'ph-confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Order placed!</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>
                Your pharmacy order has been received. A pharmacist will call you within 15 minutes to confirm availability and pricing. Delivery within 2 hours.
              </Text>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}>My orders →</Button>
              </Group>
            </Box>
          )}

          {/* ── LAB TESTS: Step 1 – Select tests ───────────────────────────── */}
          {step === 'lab-tests' && (
            <Box maw={560} mx="auto">
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Select tests</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Choose one or more tests. A trained phlebotomist will visit your home for sample collection.</Text>
              <Stack gap="xs" mb="md">
                {LAB_TESTS.map(t => (
                  <Card key={t.id} radius="lg" withBorder p="sm"
                    onClick={() => setSelectedTests(prev =>
                      prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id]
                    )}
                    style={{ cursor: 'pointer', borderColor: selectedTests.includes(t.id) ? sub.color : 'var(--color-border)', background: selectedTests.includes(t.id) ? sub.colorPale : 'white' }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Checkbox readOnly checked={selectedTests.includes(t.id)} radius="sm" color={sub.color} />
                        <Box>
                          <Text fw={600} fz="sm" c="var(--color-ink)">{t.name}</Text>
                          <Text fz="xs" c="var(--color-muted)">Results in {t.turnaround}</Text>
                        </Box>
                      </Group>
                      <Text fw={700} fz="sm" style={{ color: sub.color, flexShrink: 0 }}>{formatPrice(t.price)}</Text>
                    </Group>
                  </Card>
                ))}
              </Stack>

              {selectedTests.length > 0 && (
                <Card radius="lg" p="sm" style={{ background: sub.colorPale, borderColor: sub.color + '40' }} withBorder mb="md">
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">{selectedTests.length} test{selectedTests.length > 1 ? 's' : ''} + home visit fee</Text>
                    <Text fw={700} style={{ color: sub.color }}>{formatPrice(labTotal)}</Text>
                  </Group>
                </Card>
              )}

              <Button radius="xl" size="md" disabled={selectedTests.length === 0}
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('lab-schedule')}>
                Schedule visit →
              </Button>
            </Box>
          )}

          {/* LAB TESTS: Step 2 – Schedule */}
          {step === 'lab-schedule' && (
            <Box maw={560} mx="auto">
              {backBtn('lab-tests')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Schedule home visit</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Pick a date and time. Our phlebotomist will arrive within 30 minutes of your slot.</Text>
              <Stack gap="md">
                <BookingCalendar serviceId="lab" value={labDate} onChange={setLabDate} minDaysAhead={1} />

                {labDate && (
                  <Box>
                    <Text fw={600} fz="sm" c="var(--color-ink)" mb="xs">Select time slot</Text>
                    <SimpleGrid cols={4} spacing="xs">
                      {TIME_SLOTS.map(t => (
                        <Button key={t} size="xs" radius="lg"
                          variant={labTime === t ? 'filled' : 'outline'}
                          style={labTime === t
                            ? { background: sub.color, color: 'white', fontWeight: 700 }
                            : { borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                          onClick={() => setLabTime(t)}>{t}</Button>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <TextInput label="Home address" placeholder="House number, street, estate, landmark"
                  value={labAddress} onChange={e => setLabAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, labAddress: true }))}
                  error={touched.labAddress ? labScheduleErrors.labAddress : undefined}
                  radius="lg" />
                <TextInput label="Phone number" placeholder="+234 800 000 0000"
                  description="We'll call to confirm and for any updates"
                  value={labPhone} onChange={e => setLabPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, labPhone: true }))}
                  error={touched.labPhone ? labScheduleErrors.labPhone : undefined}
                  radius="lg" />

                <Button radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => { touchLabSchedule(); if (!labDate || !labTime || Object.values(labScheduleErrors).some(Boolean)) return; setStep('lab-review') }}>
                  Review booking →
                </Button>
              </Stack>
            </Box>
          )}

          {/* LAB TESTS: Step 3 – Review */}
          {step === 'lab-review' && (
            <Box maw={560} mx="auto">
              {backBtn('lab-schedule')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="lg">Review booking</Title>
              <Card radius="xl" withBorder p="lg" mb="md" style={{ borderColor: 'var(--color-border)' }}>
                <Stack gap="sm">
                  <Text fw={700} fz="sm" c="var(--color-ink)" mb={2}>Tests selected</Text>
                  {selectedTestObjs.map(t => (
                    <Group key={t.id} justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">{t.name}</Text>
                      <Text fz="sm" fw={500}>{formatPrice(t.price)}</Text>
                    </Group>
                  ))}
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Home visit fee</Text>
                    <Text fz="sm" fw={500}>{formatPrice(HOME_VISIT_FEE)}</Text>
                  </Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Total</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(labTotal)}</Text>
                  </Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Visit date</Text>
                    <Text fz="sm" fw={500}>{labDate ? dayjs(labDate).format('ddd, D MMM YYYY') : '—'} at {labTime}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Address</Text>
                    <Text fz="sm" fw={500} ta="right">{labAddress}</Text>
                  </Group>
                </Stack>
              </Card>
              <Button fullWidth radius="xl" size="md"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('lab-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {/* LAB TESTS: Pay */}
          {step === 'lab-pay' && (
            <PaymentStep
              amount={labTotal}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                ...selectedTestObjs.map(t => ({ label: t.name, value: formatPrice(t.price) })),
                { label: 'Home visit fee', value: formatPrice(HOME_VISIT_FEE) },
              ]}
              onBack={() => setStep('lab-review')}
              onPay={() => setStep('lab-confirm')}
            />
          )}

          {/* LAB TESTS: Confirm */}
          {step === 'lab-confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Booking confirmed!</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>
                Your home lab visit is scheduled for{' '}
                <strong>{labDate ? dayjs(labDate).format('ddd, D MMM YYYY') : ''}</strong> at <strong>{labTime}</strong>.
                Results will be shared via WhatsApp and email.
              </Text>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}>My orders →</Button>
              </Group>
            </Box>
          )}

          {/* ── DOCTOR: Step 1 – Specialty & mode ──────────────────────────── */}
          {step === 'doc-specialty' && (
            <Box maw={560} mx="auto">
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Choose a doctor</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Select the specialty and preferred consultation mode.</Text>
              <Stack gap="md">
                <Box>
                  <Text fw={600} fz="sm" c="var(--color-ink)" mb="xs">Specialty</Text>
                  <Stack gap="xs">
                    {SPECIALTIES.map(sp => (
                      <Card key={sp.value} radius="lg" withBorder p="sm" onClick={() => setDocSpecialty(sp.value)}
                        style={{ cursor: 'pointer', borderColor: docSpecialty === sp.value ? sub.color : 'var(--color-border)', background: docSpecialty === sp.value ? sub.colorPale : 'white' }}>
                        <Group justify="space-between">
                          <Text fw={600} fz="sm" c="var(--color-ink)">{sp.label}</Text>
                          <Text fw={700} fz="sm" style={{ color: sub.color }}>{formatPrice(sp.price)}</Text>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Text fw={600} fz="sm" c="var(--color-ink)" mb="xs">Consultation mode</Text>
                  <Group gap="sm">
                    {(['video', 'phone'] as const).map(m => (
                      <Card key={m} radius="lg" withBorder p="sm" onClick={() => setDocMode(m)}
                        style={{ cursor: 'pointer', flex: 1, borderColor: docMode === m ? sub.color : 'var(--color-border)', background: docMode === m ? sub.colorPale : 'white' }}>
                        <Text fw={700} fz="sm" c="var(--color-ink)">{m === 'video' ? '📹 Video Call' : '📞 Phone Call'}</Text>
                        <Text fz="xs" c="var(--color-muted)">{m === 'video' ? 'Face-to-face via Zoom / Meet' : 'Voice call only'}</Text>
                      </Card>
                    ))}
                  </Group>
                </Box>

                <Button radius="xl" size="md" disabled={!docSpecialty || !docMode}
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => setStep('doc-schedule')}>
                  Pick a time →
                </Button>
              </Stack>
            </Box>
          )}

          {/* DOCTOR: Step 2 – Schedule */}
          {step === 'doc-schedule' && (
            <Box maw={560} mx="auto">
              {backBtn('doc-specialty')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Pick date & time</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Doctors are available Monday–Saturday, 9 am–5 pm.</Text>
              <Stack gap="md">
                <BookingCalendar serviceId="doctor" value={docDate} onChange={setDocDate} minDaysAhead={1} />

                {docDate && (
                  <Box>
                    <Text fw={600} fz="sm" c="var(--color-ink)" mb="xs">Select time slot</Text>
                    <SimpleGrid cols={4} spacing="xs">
                      {TIME_SLOTS.map(t => (
                        <Button key={t} size="xs" radius="lg"
                          variant={docTime === t ? 'filled' : 'outline'}
                          style={docTime === t
                            ? { background: sub.color, color: 'white', fontWeight: 700 }
                            : { borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                          onClick={() => setDocTime(t)}>{t}</Button>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Button radius="xl" size="md" disabled={!docDate || !docTime}
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => setStep('doc-symptoms')}>
                  Continue →
                </Button>
              </Stack>
            </Box>
          )}

          {/* DOCTOR: Step 3 – Symptoms */}
          {step === 'doc-symptoms' && (
            <Box maw={560} mx="auto">
              {backBtn('doc-schedule')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>About the consultation</Title>
              <Text fz="sm" c="var(--color-muted)" mb="lg">Brief the doctor ahead of the call so they can prepare.</Text>
              <Stack gap="md">
                <TextInput label="Your name" placeholder="Full name"
                  value={docName} onChange={e => setDocName(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, docName: true }))}
                  error={touched.docName ? docSymptomsErrors.docName : undefined}
                  radius="lg" />
                <TextInput label="Phone number" placeholder="+234 800 000 0000"
                  description="We'll send the meeting link or call instructions here"
                  value={docPhone} onChange={e => setDocPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, docPhone: true }))}
                  error={touched.docPhone ? docSymptomsErrors.docPhone : undefined}
                  radius="lg" />
                <Textarea label="Symptoms / reason for visit"
                  placeholder="Briefly describe what you're experiencing or what you'd like to discuss..."
                  minRows={4} radius="lg"
                  value={docSymptoms} onChange={e => setDocSymptoms(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, docSymptoms: true }))}
                  error={touched.docSymptoms ? docSymptomsErrors.docSymptoms : undefined} />
                <Button radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => { touchDocSymptoms(); if (Object.values(docSymptomsErrors).some(Boolean)) return; setStep('doc-review') }}>
                  Review booking →
                </Button>
              </Stack>
            </Box>
          )}

          {/* DOCTOR: Step 4 – Review */}
          {step === 'doc-review' && (
            <Box maw={560} mx="auto">
              {backBtn('doc-symptoms')}
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="lg">Review & pay</Title>
              <Card radius="xl" withBorder p="lg" mb="md" style={{ borderColor: 'var(--color-border)' }}>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Specialty</Text>
                    <Text fz="sm" fw={500}>{specialtyObj?.label}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Mode</Text>
                    <Text fz="sm" fw={500}>{docMode === 'video' ? '📹 Video Call' : '📞 Phone Call'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Date & time</Text>
                    <Text fz="sm" fw={500}>{docDate ? dayjs(docDate).format('ddd, D MMM YYYY') : '—'} at {docTime}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">Patient</Text>
                    <Text fz="sm" fw={500}>{docName}</Text>
                  </Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between">
                    <Text ff="var(--font-montserrat)" fw={700}>Consultation fee</Text>
                    <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(docFee)}</Text>
                  </Group>
                </Stack>
              </Card>
              <Card radius="lg" p="sm" style={{ background: '#E8F4FF' }} withBorder mb="md">
                <Text fz="xs" c="#1565C0">
                  📱 A confirmation and {docMode === 'video' ? 'meeting link' : 'call instructions'} will be sent to {docPhone} before your appointment.
                </Text>
              </Card>
              <Button fullWidth radius="xl" size="md"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('doc-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {/* DOCTOR: Pay */}
          {step === 'doc-pay' && (
            <PaymentStep
              amount={docFee}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service', value: 'Doctor Consultation' },
                { label: 'Specialty', value: SPECIALTIES.find(s => s.value === docSpecialty)?.label ?? '' },
                { label: 'Mode', value: docMode === 'video' ? 'Video call' : 'Phone call' },
              ]}
              onBack={() => setStep('doc-review')}
              onPay={() => setStep('doc-confirm')}
            />
          )}

          {/* DOCTOR: Confirm */}
          {step === 'doc-confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Consultation booked!</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>
                Your {docMode === 'video' ? 'video' : 'phone'} call with a{' '}
                <strong>{specialtyObj?.label}</strong> is confirmed for{' '}
                <strong>{docDate ? dayjs(docDate).format('ddd, D MMM YYYY') : ''}</strong> at <strong>{docTime}</strong>.
                Check WhatsApp for {docMode === 'video' ? 'the meeting link' : 'call instructions'}.
              </Text>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}>My orders →</Button>
              </Group>
            </Box>
          )}

        </Box>
      </Box>
    </>
  )
}
