'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  Anchor, Select, TextInput, Textarea, NumberInput, Divider,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { IconClock, IconCheck, IconCalendar } from '@tabler/icons-react'
import { usePlatform } from '@/context/PlatformContext'
import PaymentStep from '@/components/PaymentStep'
import dayjs from 'dayjs'
import { reqSelect } from '@/lib/validation'

// ── Shared constants ──────────────────────────────────────────────────────────
const INPUT_LABEL = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

// ── Venue Hire ─────────────────────────────────────────────────────────────────
const VENUE_EVENT_TYPES = [
  { value: 'wedding',    label: 'Wedding / engagement' },
  { value: 'corporate',  label: 'Corporate event / conference' },
  { value: 'birthday',   label: 'Birthday celebration' },
  { value: 'burial',     label: 'Burial / memorial reception' },
  { value: 'concert',    label: 'Concert / live performance' },
  { value: 'exhibition', label: 'Exhibition / product launch' },
  { value: 'private',    label: 'Private party / gathering' },
  { value: 'other',      label: 'Other' },
]

const VENUE_DURATION = [
  { value: 'half', label: 'Half day (up to 6 hours)',  price: 150000 },
  { value: 'full', label: 'Full day (up to 12 hours)', price: 250000 },
  { value: '2day', label: '2 days',                    price: 450000 },
  { value: 'week', label: 'Weekly (5 days)',            price: 1000000 },
]

const VENUE_GUEST_RANGES = [
  { value: '20-50',   label: '20 – 50 guests' },
  { value: '50-100',  label: '50 – 100 guests' },
  { value: '100-200', label: '100 – 200 guests' },
  { value: '200-500', label: '200 – 500 guests' },
  { value: '500+',    label: '500+ guests' },
]

const VENUE_SETUPS = [
  { value: 'theatre',  label: 'Theatre / auditorium style' },
  { value: 'banquet',  label: 'Banquet / dinner style' },
  { value: 'boardroom', label: 'Boardroom / conference' },
  { value: 'cocktail', label: 'Cocktail / standing reception' },
  { value: 'classroom', label: 'Classroom / training' },
  { value: 'custom',   label: 'Custom setup' },
]

// ── TV Studio ─────────────────────────────────────────────────────────────────
const TV_PROJECT_TYPES = [
  { value: 'interview',  label: 'Interview / talk show' },
  { value: 'commercial', label: 'TV commercial / advert' },
  { value: 'webinar',    label: 'Webinar / online broadcast' },
  { value: 'documentary', label: 'Documentary / short film' },
  { value: 'music-video', label: 'Music video' },
  { value: 'corporate',  label: 'Corporate video / training' },
  { value: 'photoshoot', label: 'Photoshoot' },
  { value: 'other',      label: 'Other' },
]

const TV_DURATION = [
  { value: 'half', label: 'Half day (up to 5 hours)',  price: 80000 },
  { value: 'full', label: 'Full day (up to 10 hours)', price: 150000 },
]

const TV_CREW_OPTIONS = [
  { value: 'none',      label: 'No — bringing own crew' },
  { value: 'camera',    label: 'Camera operator only' },
  { value: 'director',  label: 'Director + camera operator' },
  { value: 'full',      label: 'Full crew (director, camera, lighting, audio)' },
]

// ── Audio Studio ──────────────────────────────────────────────────────────────
const AUDIO_SESSION_TYPES = [
  { value: 'recording',  label: 'Music recording' },
  { value: 'mixing',     label: 'Mixing & mastering' },
  { value: 'podcast',    label: 'Podcast recording' },
  { value: 'voiceover',  label: 'Voice-over / narration' },
  { value: 'jingle',     label: 'Jingle / advert audio' },
  { value: 'rehearsal',  label: 'Band rehearsal' },
  { value: 'other',      label: 'Other' },
]

const AUDIO_ENGINEER = [
  { value: 'yes',  label: 'Yes — include in-house engineer' },
  { value: 'no',   label: 'No — self-engineered' },
]

// ── Upcoming events (mock) ────────────────────────────────────────────────────
const UPCOMING_EVENTS = [
  { id: 'ev1', title: 'LagosApps Networking Night',     date: '2025-05-10', time: '6:00 PM', venue: 'The Hub, Victoria Island', price: 5000,  category: 'Networking',    seats: 80,  icon: '🤝' },
  { id: 'ev2', title: 'Afrobeats Live Concert',          date: '2025-05-24', time: '7:00 PM', venue: 'Eko Hotel Grounds, VI',    price: 15000, category: 'Concert',       seats: 500, icon: '🎵' },
  { id: 'ev3', title: 'Lagos Tech Startup Summit',       date: '2025-06-07', time: '9:00 AM', venue: 'MUSON Centre, Onikan',     price: 8000,  category: 'Conference',    seats: 200, icon: '🚀' },
  { id: 'ev4', title: 'Women in Business Forum',         date: '2025-06-14', time: '10:00 AM', venue: 'Federal Palace Hotel, VI', price: 6000, category: 'Forum',         seats: 150, icon: '💼' },
  { id: 'ev5', title: 'Comedy Night: Lagos Laughs',      date: '2025-06-21', time: '8:00 PM', venue: 'Landmark Events Centre',   price: 7500,  category: 'Entertainment', seats: 300, icon: '😂' },
]

type Step =
  | 'browse'
  // Venue Hire
  | 'venue-event' | 'venue-details' | 'venue-review' | 'venue-pay' | 'venue-confirm'
  // TV Studio
  | 'tv-project' | 'tv-details' | 'tv-review' | 'tv-pay' | 'tv-confirm'
  // Audio Studio
  | 'audio-session' | 'audio-review' | 'audio-pay' | 'audio-confirm'
  // Event Tickets
  | 'tickets-browse' | 'tickets-review' | 'tickets-pay' | 'tickets-confirm'

function formatEventDate(date: string | Date | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('events')!

  const [step, setStep] = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState(sub.services[0].id)
  const [orderId] = useState(() => `EVT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  // Venue Hire state
  const [venueEventType, setVenueEventType] = useState<string | null>(null)
  const [venueGuests, setVenueGuests] = useState<string | null>(null)
  const [venueDateRange, setVenueDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [venueDuration, setVenueDuration] = useState<string | null>(null)
  const [venueSetup, setVenueSetup] = useState<string | null>(null)
  const [venueNote, setVenueNote] = useState('')

  // TV Studio state
  const [tvProject, setTvProject] = useState<string | null>(null)
  const [tvDate, setTvDate] = useState<Date | null>(null)
  const [tvDuration, setTvDuration] = useState<string | null>(null)
  const [tvCrew, setTvCrew] = useState<string | null>(null)
  const [tvCast, setTvCast] = useState<string | null>(null)
  const [tvNote, setTvNote] = useState('')

  // Audio Studio state
  const [audioSession, setAudioSession] = useState<string | null>(null)
  const [audioDate, setAudioDate] = useState<Date | null>(null)
  const [audioHours, setAudioHours] = useState<number | string>(2)
  const [audioEngineer, setAudioEngineer] = useState<string | null>(null)
  const [audioNote, setAudioNote] = useState('')

  // Event Tickets state
  const [selectedEvent, setSelectedEvent] = useState<typeof UPCOMING_EVENTS[0] | null>(null)
  const [ticketQty, setTicketQty] = useState<number | string>(1)

  const active = sub.services.find(s => s.id === selectedService)!

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // ── Validation ──────────────────────────────────────────────────────────────
  const venueEventErrors = {
    venueEventType: reqSelect(venueEventType, 'an event type'),
    venueGuests:    reqSelect(venueGuests, 'expected guests'),
    venueDuration:  reqSelect(venueDuration, 'a duration'),
    venueDateRange: !venueDateRange[0] ? 'Please select a start date' : !venueDateRange[1] ? 'Please select an end date' : '',
  }
  const venueDetailsErrors = { venueSetup: reqSelect(venueSetup, 'a setup style') }
  const tvProjectErrors = {
    tvProject:  reqSelect(tvProject, 'a project type'),
    tvDate:     !tvDate ? 'Please select a preferred date' : '',
    tvDuration: reqSelect(tvDuration, 'a duration'),
  }
  const tvDetailsErrors = { tvCrew: reqSelect(tvCrew, 'a crew option') }
  const audioSessionErrors = {
    audioSession:  reqSelect(audioSession, 'a session type'),
    audioDate:     !audioDate ? 'Please select a preferred date' : '',
    audioEngineer: reqSelect(audioEngineer, 'an engineer option'),
  }

  function touchVenueEvent()  { setTouched(p => ({ ...p, venueEventType: true, venueGuests: true, venueDuration: true, venueDateRange: true })) }
  function touchVenueDetails(){ setTouched(p => ({ ...p, venueSetup: true })) }
  function touchTvProject()   { setTouched(p => ({ ...p, tvProject: true, tvDate: true, tvDuration: true })) }
  function touchTvDetails()   { setTouched(p => ({ ...p, tvCrew: true })) }
  function touchAudioSession(){ setTouched(p => ({ ...p, audioSession: true, audioDate: true, audioEngineer: true })) }

  const audioHoursNum = Number(audioHours) || 1
  const audioSubtotal = 25000 * audioHoursNum + (audioEngineer === 'yes' ? 15000 : 0)
  const ticketQtyNum = Number(ticketQty) || 1
  const ticketTotal = selectedEvent ? selectedEvent.price * ticketQtyNum : 0

  const venueDurationMeta = VENUE_DURATION.find(d => d.value === venueDuration)
  const venueTotal = venueDurationMeta?.price ?? 0
  const tvDurationMeta = TV_DURATION.find(d => d.value === tvDuration)
  const tvTotal = tvDurationMeta?.price ?? 0

  // Formatted date strings for display
  const venueDateStart = venueDateRange[0] ? dayjs(venueDateRange[0]).format('D MMM YYYY') : ''
  const venueDateEnd   = venueDateRange[1] ? dayjs(venueDateRange[1]).format('D MMM YYYY') : ''
  const venueDateLabel = venueDateStart && venueDateEnd ? `${venueDateStart} – ${venueDateEnd}` : venueDateStart
  const tvDateFormatted    = tvDate    ? dayjs(tvDate).format('D MMM YYYY') : ''
  const audioDateFormatted = audioDate ? dayjs(audioDate).format('D MMM YYYY') : ''

  // minDate helpers
  const minVenueDate = dayjs().add(7, 'day').toDate()
  const minTvDate    = dayjs().add(2, 'day').toDate()
  const minAudioDate = dayjs().add(1, 'day').toDate()

  const FLOW_STEPS: Record<string, { id: Step; label: string }[]> = {
    'event-venue':  [{ id: 'venue-event', label: 'Event' }, { id: 'venue-details', label: 'Details' }, { id: 'venue-review', label: 'Review' }, { id: 'venue-pay', label: 'Pay' }],
    'tv-studio':    [{ id: 'tv-project', label: 'Project' }, { id: 'tv-details', label: 'Details' }, { id: 'tv-review', label: 'Review' }, { id: 'tv-pay', label: 'Pay' }],
    'audio-studio': [{ id: 'audio-session', label: 'Session' }, { id: 'audio-review', label: 'Review' }, { id: 'audio-pay', label: 'Pay' }],
    'event-tickets':[{ id: 'tickets-browse', label: 'Select' }, { id: 'tickets-review', label: 'Review' }, { id: 'tickets-pay', label: 'Pay' }],
  }

  const CONFIRM_STEPS: Step[] = ['venue-confirm', 'tv-confirm', 'audio-confirm', 'tickets-confirm', 'venue-pay', 'tv-pay', 'audio-pay', 'tickets-pay']
  const steps = FLOW_STEPS[selectedService] ?? []
  const currentIdx = steps.findIndex(s => s.id === step)
  const isConfirm = CONFIRM_STEPS.includes(step)

  function startFlow() {
    const first: Record<string, Step> = {
      'event-venue': 'venue-event',
      'tv-studio': 'tv-project',
      'audio-studio': 'audio-session',
      'event-tickets': 'tickets-browse',
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
              💬 Enquire on WhatsApp
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
                  <Text fz="sm" c="var(--color-muted)">Starting from</Text>
                  <Text fw={700} fz="sm" style={{ color: sub.color }}>{formatPrice(active.startingPrice)}</Text>
                </Group>
                <Button fullWidth radius="xl" size="md" mb="xs" mt="sm"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={startFlow}>
                  {selectedService === 'event-tickets' ? 'Browse tickets →' : 'Book Now →'}
                </Button>
                <Button fullWidth radius="xl" size="sm" component="a"
                  href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Enquire via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {/* ════════════════ VENUE HIRE ════════════════ */}

          {step === 'venue-event' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Event Venue Hire</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us about your event</Text>
              <Stack gap="md">
                <Select label="Event type" placeholder="What kind of event?" data={VENUE_EVENT_TYPES}
                  value={venueEventType}
                  onChange={v => { setVenueEventType(v); setTouched(p => ({ ...p, venueEventType: true })) }}
                  error={touched.venueEventType ? venueEventErrors.venueEventType : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Select label="Expected guests" placeholder="How many guests?" data={VENUE_GUEST_RANGES}
                  value={venueGuests}
                  onChange={v => { setVenueGuests(v); setTouched(p => ({ ...p, venueGuests: true })) }}
                  error={touched.venueGuests ? venueEventErrors.venueGuests : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <DatePickerInput
                  type="range"
                  label="Event dates"
                  placeholder="Select start and end dates"
                  value={venueDateRange}
                  onChange={v => { setVenueDateRange(v); setTouched(p => ({ ...p, venueDateRange: true })) }}
                  error={touched.venueDateRange ? venueEventErrors.venueDateRange : undefined}
                  minDate={minVenueDate}
                  leftSection={<IconCalendar size={16} />}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Select label="Duration" placeholder="How long do you need the venue?" data={VENUE_DURATION}
                  value={venueDuration}
                  onChange={v => { setVenueDuration(v); setTouched(p => ({ ...p, venueDuration: true })) }}
                  error={touched.venueDuration ? venueEventErrors.venueDuration : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchVenueEvent(); if (Object.values(venueEventErrors).some(Boolean)) return; setStep('venue-details') }}>
                Continue →
              </Button>
            </Box>
          )}

          {step === 'venue-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('venue-event')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Setup & requirements</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Help us prepare the right space for you</Text>
              <Stack gap="md">
                <Select label="Preferred seating / setup style" placeholder="Select setup" data={VENUE_SETUPS}
                  value={venueSetup}
                  onChange={v => { setVenueSetup(v); setTouched(p => ({ ...p, venueSetup: true })) }}
                  error={touched.venueSetup ? venueDetailsErrors.venueSetup : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Textarea label="Additional requirements (optional)"
                  placeholder="e.g. AV equipment, projector, stage, catering arrangements, décor…"
                  value={venueNote} onChange={e => setVenueNote(e.target.value)}
                  size="md" radius="md" minRows={4} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchVenueDetails(); if (Object.values(venueDetailsErrors).some(Boolean)) return; setStep('venue-review') }}>
                Review booking →
              </Button>
            </Box>
          )}

          {step === 'venue-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('venue-details')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review enquiry</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Event details</Text>
                  <Stack gap="xs">
                    {[
                      ['Event type',   VENUE_EVENT_TYPES.find(e => e.value === venueEventType)?.label ?? ''],
                      ['Guests',       VENUE_GUEST_RANGES.find(g => g.value === venueGuests)?.label ?? ''],
                      ['Dates',        venueDateLabel],
                      ['Duration',     VENUE_DURATION.find(d => d.value === venueDuration)?.label ?? ''],
                      ['Setup style',  VENUE_SETUPS.find(s => s.value === venueSetup)?.label ?? ''],
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 240 }}>{v}</Text>
                      </Group>
                    ))}
                    {venueNote && (
                      <Group justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">Requirements</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 240 }}>{venueNote}</Text>
                      </Group>
                    )}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Pricing</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">{venueDurationMeta?.label ?? 'Duration'}</Text>
                      <Text fz="sm" fw={500}>{venueDurationMeta ? formatPrice(venueDurationMeta.price) : '—'}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Total</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(venueTotal)}</Text>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)">Extras (catering, AV, décor) quoted separately.</Text>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('venue-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'venue-pay' && (
            <PaymentStep
              amount={venueTotal}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service',     value: 'Event Venue Hire' },
                { label: 'Event type',  value: VENUE_EVENT_TYPES.find(e => e.value === venueEventType)?.label ?? '' },
                { label: 'Dates',       value: venueDateLabel },
                { label: 'Duration',    value: venueDurationMeta?.label ?? '' },
                { label: 'Venue total', value: formatPrice(venueTotal) },
              ]}
              orderPayload={{
                service_title: 'Event Venue Hire',
                service_description: `${VENUE_EVENT_TYPES.find(e => e.value === venueEventType)?.label ?? ''} — ${venueDurationMeta?.label ?? ''}`,
                category: 'Events and Studios',
                total_amount: venueTotal,
                final_amount: venueTotal,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  event_type: venueEventType,
                  expected_guests: venueGuests,
                  duration: venueDuration,
                  date_start: venueDateRange[0] ? dayjs(venueDateRange[0]).format('YYYY-MM-DD') : null,
                  date_end: venueDateRange[1] ? dayjs(venueDateRange[1]).format('YYYY-MM-DD') : null,
                  setup_style: venueSetup,
                  note: venueNote || null,
                },
              }}
              onBack={() => setStep('venue-review')}
              onPay={() => setStep('venue-confirm')}
            />
          )}

          {step === 'venue-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🏛️</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Venue booked!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Your <strong>{VENUE_EVENT_TYPES.find(e => e.value === venueEventType)?.label}</strong> venue is confirmed for <strong>{venueDateLabel}</strong> ({venueDurationMeta?.label}).
              </Text>
              <Text fz="sm" c="var(--color-muted)" mb="xl">
                Total paid: <strong>{formatPrice(venueTotal)}</strong>. Our events team will be in touch within 2 hours to coordinate setup and logistics.
              </Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Chat on WhatsApp</Button>
              </div>
            </Box>
          )}

          {/* ════════════════ TV STUDIO ════════════════ */}

          {step === 'tv-project' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>TV Studio Rental</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us about your project</Text>
              <Stack gap="md">
                <Select label="Project type" placeholder="What are you shooting?" data={TV_PROJECT_TYPES}
                  value={tvProject}
                  onChange={v => { setTvProject(v); setTouched(p => ({ ...p, tvProject: true })) }}
                  error={touched.tvProject ? tvProjectErrors.tvProject : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <DatePickerInput
                  label="Preferred date"
                  placeholder="Select a date"
                  value={tvDate}
                  onChange={v => { setTvDate(v); setTouched(p => ({ ...p, tvDate: true })) }}
                  error={touched.tvDate ? (!tvDate ? 'Please select a preferred date' : '') : undefined}
                  minDate={minTvDate}
                  leftSection={<IconCalendar size={16} />}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Select label="Studio duration" placeholder="How long do you need?" data={TV_DURATION}
                  value={tvDuration}
                  onChange={v => { setTvDuration(v); setTouched(p => ({ ...p, tvDuration: true })) }}
                  error={touched.tvDuration ? tvProjectErrors.tvDuration : undefined}
                  size="md" radius="xl"
                  leftSection={<IconClock size={16} />} styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchTvProject(); if (Object.values(tvProjectErrors).some(Boolean)) return; setStep('tv-details') }}>
                Continue →
              </Button>
            </Box>
          )}

          {step === 'tv-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('tv-project')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Crew & requirements</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Help us set up the studio for your shoot</Text>
              <Stack gap="md">
                <Select label="Do you need our crew?" placeholder="Select crew option" data={TV_CREW_OPTIONS}
                  value={tvCrew}
                  onChange={v => { setTvCrew(v); setTouched(p => ({ ...p, tvCrew: true })) }}
                  error={touched.tvCrew ? tvDetailsErrors.tvCrew : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <TextInput label="Number of cast / presenters" placeholder="e.g. 2 presenters, 1 guest"
                  value={tvCast ?? ''} onChange={e => setTvCast(e.target.value)} size="md" radius="xl" styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)"
                  placeholder="e.g. Teleprompter needed, green screen, specific backdrop, props…"
                  value={tvNote} onChange={e => setTvNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchTvDetails(); if (Object.values(tvDetailsErrors).some(Boolean)) return; setStep('tv-review') }}>
                Review booking →
              </Button>
            </Box>
          )}

          {step === 'tv-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('tv-details')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review booking request</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Studio booking</Text>
                  <Stack gap="xs">
                    {[
                      ['Project type', TV_PROJECT_TYPES.find(p => p.value === tvProject)?.label ?? ''],
                      ['Date',         tvDateFormatted],
                      ['Duration',     TV_DURATION.find(d => d.value === tvDuration)?.label ?? ''],
                      ['Crew',         TV_CREW_OPTIONS.find(c => c.value === tvCrew)?.label ?? ''],
                      ...(tvCast ? [['Cast / presenters', tvCast]] : []),
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 240 }}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Pricing</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Studio ({tvDurationMeta?.label ?? ''})</Text>
                      <Text fz="sm" fw={500}>{tvDurationMeta ? formatPrice(tvDurationMeta.price) : '—'}</Text>
                    </Group>
                    {tvCrew && tvCrew !== 'none' && (
                      <Group justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">Crew (quoted separately)</Text>
                        <Text fz="xs" c="var(--color-muted)">TBD</Text>
                      </Group>
                    )}
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Studio fee</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(tvTotal)}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('tv-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'tv-pay' && (
            <PaymentStep
              amount={tvTotal}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service',      value: 'TV Studio Rental' },
                { label: 'Project type', value: TV_PROJECT_TYPES.find(p => p.value === tvProject)?.label ?? '' },
                { label: 'Date',         value: tvDateFormatted },
                { label: 'Duration',     value: tvDurationMeta?.label ?? '' },
                { label: 'Studio fee',   value: formatPrice(tvTotal) },
              ]}
              orderPayload={{
                service_title: 'TV Studio Rental',
                service_description: `${TV_PROJECT_TYPES.find(p => p.value === tvProject)?.label ?? ''} — ${tvDurationMeta?.label ?? ''}`,
                category: 'Events and Studios',
                total_amount: tvTotal,
                final_amount: tvTotal,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  project_type: tvProject,
                  booking_date: tvDate ? dayjs(tvDate).format('YYYY-MM-DD') : null,
                  duration: tvDuration,
                  crew_option: tvCrew,
                  cast_size: tvCast,
                  note: tvNote || null,
                },
              }}
              onBack={() => setStep('tv-review')}
              onPay={() => setStep('tv-confirm')}
            />
          )}

          {step === 'tv-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>📺</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">TV Studio booked!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Your <strong>{tvDurationMeta?.label}</strong> TV studio session on <strong>{tvDateFormatted}</strong> is confirmed.
              </Text>
              <Text fz="sm" c="var(--color-muted)" mb="xl">
                Total paid: <strong>{formatPrice(tvTotal)}</strong>. Our studio team will contact you to coordinate your shoot.
              </Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Chat on WhatsApp</Button>
              </div>
            </Box>
          )}

          {/* ════════════════ AUDIO STUDIO ════════════════ */}

          {step === 'audio-session' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Audio Studio</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us about your session</Text>
              <Stack gap="md">
                <Select label="Session type" placeholder="What are you recording?" data={AUDIO_SESSION_TYPES}
                  value={audioSession}
                  onChange={v => { setAudioSession(v); setTouched(p => ({ ...p, audioSession: true })) }}
                  error={touched.audioSession ? audioSessionErrors.audioSession : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <DatePickerInput
                  label="Preferred date"
                  placeholder="Select a date"
                  value={audioDate}
                  onChange={v => { setAudioDate(v); setTouched(p => ({ ...p, audioDate: true })) }}
                  error={touched.audioDate ? (!audioDate ? 'Please select a preferred date' : '') : undefined}
                  minDate={minAudioDate}
                  leftSection={<IconCalendar size={16} />}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Box>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="xs">Hours needed</Text>
                  <Group gap="sm">
                    <Button radius="xl" size="sm" variant="default" onClick={() => setAudioHours(h => Math.max(1, Number(h) - 1))} style={{ width: 40, height: 40, padding: 0 }}>−</Button>
                    <Text ff="var(--font-montserrat)" fw={700} fz="lg" w={32} ta="center">{audioHoursNum}</Text>
                    <Button radius="xl" size="sm" variant="default" onClick={() => setAudioHours(h => Number(h) + 1)} style={{ width: 40, height: 40, padding: 0 }}>+</Button>
                    <Text fz="sm" c="var(--color-muted)">hrs · {formatPrice(25000 * audioHoursNum)}</Text>
                  </Group>
                </Box>
                <Select label="In-house engineer?" placeholder="Do you need our sound engineer?" data={AUDIO_ENGINEER}
                  value={audioEngineer}
                  onChange={v => { setAudioEngineer(v); setTouched(p => ({ ...p, audioEngineer: true })) }}
                  error={touched.audioEngineer ? audioSessionErrors.audioEngineer : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL} />
                <Textarea label="Additional notes (optional)"
                  placeholder="e.g. Number of vocalists, instruments you're bringing, references, mixing preferences…"
                  value={audioNote} onChange={e => setAudioNote(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL} />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchAudioSession(); if (Object.values(audioSessionErrors).some(Boolean)) return; setStep('audio-review') }}>
                Review booking →
              </Button>
            </Box>
          )}

          {step === 'audio-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('audio-session')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review booking</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Session details</Text>
                  <Stack gap="xs">
                    {[
                      ['Session type', AUDIO_SESSION_TYPES.find(s => s.value === audioSession)?.label ?? ''],
                      ['Date',         audioDateFormatted],
                      ['Duration',     `${audioHoursNum} hour${audioHoursNum > 1 ? 's' : ''}`],
                      ['Engineer',     AUDIO_ENGINEER.find(e => e.value === audioEngineer)?.label ?? ''],
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Cost breakdown</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Studio ({audioHoursNum} hrs × ₦25,000)</Text>
                      <Text fz="sm">{formatPrice(25000 * audioHoursNum)}</Text>
                    </Group>
                    {audioEngineer === 'yes' && (
                      <Group justify="space-between">
                        <Text fz="sm" c="var(--color-muted)">In-house engineer</Text>
                        <Text fz="sm">₦15,000</Text>
                      </Group>
                    )}
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Total</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(audioSubtotal)}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('audio-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'audio-pay' && (
            <PaymentStep
              amount={audioSubtotal}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Service',      value: 'Audio Studio' },
                { label: 'Session type', value: AUDIO_SESSION_TYPES.find(s => s.value === audioSession)?.label ?? '' },
                { label: 'Date',         value: audioDateFormatted },
                { label: 'Duration',     value: `${audioHoursNum} hr${audioHoursNum > 1 ? 's' : ''}` },
                { label: 'Engineer',     value: audioEngineer === 'yes' ? 'Included (+₦15,000)' : 'Self-engineered' },
                { label: 'Studio fee',   value: formatPrice(audioSubtotal) },
              ]}
              orderPayload={{
                service_title: 'Audio Studio',
                service_description: `${AUDIO_SESSION_TYPES.find(s => s.value === audioSession)?.label ?? ''} — ${audioHoursNum} hr${audioHoursNum > 1 ? 's' : ''}`,
                category: 'Events and Studios',
                total_amount: audioSubtotal,
                final_amount: audioSubtotal,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  session_type: audioSession,
                  booking_date: audioDate ? dayjs(audioDate).format('YYYY-MM-DD') : null,
                  duration_hours: audioHoursNum,
                  include_engineer: audioEngineer === 'yes',
                  note: audioNote || null,
                },
              }}
              onBack={() => setStep('audio-review')}
              onPay={() => setStep('audio-confirm')}
            />
          )}

          {step === 'audio-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🎙️</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Audio Studio booked!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Your <strong>{audioHoursNum}-hour {AUDIO_SESSION_TYPES.find(s => s.value === audioSession)?.label?.toLowerCase()} session</strong> on <strong>{audioDateFormatted}</strong> is confirmed.
              </Text>
              <Text fz="sm" c="var(--color-muted)" mb="xl">
                Total paid: <strong>{formatPrice(audioSubtotal)}</strong>. Our studio team will be in touch to finalise session details.
              </Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>Ref: {orderId}</Badge>
              <div className="confirm-actions">
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank" radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>💬 Chat on WhatsApp</Button>
              </div>
            </Box>
          )}

          {/* ════════════════ EVENT TICKETS ════════════════ */}

          {step === 'tickets-browse' && (
            <Box maw={680}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Upcoming Events</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Select an event to buy tickets</Text>
              <Stack gap="sm">
                {UPCOMING_EVENTS.map(ev => (
                  <Card key={ev.id} radius="xl" withBorder p="md" onClick={() => { setSelectedEvent(ev); setTicketQty(1) }}
                    style={{ borderColor: selectedEvent?.id === ev.id ? sub.color + '80' : 'var(--color-border)', background: selectedEvent?.id === ev.id ? sub.colorPale : 'white', cursor: 'pointer', outline: selectedEvent?.id === ev.id ? `2px solid ${sub.color}50` : 'none' }}>
                    <Group gap="sm" justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <Box style={{ width: 48, height: 48, borderRadius: 12, background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                          {ev.icon}
                        </Box>
                        <Box style={{ minWidth: 0 }}>
                          <Group gap="xs" mb={2} wrap="wrap">
                            <Text fw={700} fz="sm" c="var(--color-ink)">{ev.title}</Text>
                            <Badge size="xs" variant="outline" radius="sm">{ev.category}</Badge>
                          </Group>
                          <Text fz="xs" c="var(--color-muted)">📅 {formatEventDate(ev.date)} · {ev.time}</Text>
                          <Text fz="xs" c="var(--color-muted)">📍 {ev.venue}</Text>
                          <Group gap="xs" mt={4}>
                            <Text fz="xs" fw={700} style={{ color: sub.color }}>{formatPrice(ev.price)} / ticket</Text>
                            <Text fz="xs" c="var(--color-muted)">· {ev.seats} seats available</Text>
                          </Group>
                        </Box>
                      </Group>
                      {selectedEvent?.id === ev.id && (
                        <Box style={{ width: 24, height: 24, borderRadius: '50%', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconCheck size={14} color="white" />
                        </Box>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>

              {selectedEvent && (
                <Box mt="lg">
                  <Box style={{ borderTop: '1px solid var(--color-border)' }} pt="lg">
                    <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="sm">How many tickets?</Text>
                    <Group gap="sm" mb="lg">
                      <Button radius="xl" size="sm" variant="default" onClick={() => setTicketQty(q => Math.max(1, Number(q) - 1))} style={{ width: 40, height: 40, padding: 0 }}>−</Button>
                      <Text ff="var(--font-montserrat)" fw={700} fz="lg" w={32} ta="center">{ticketQtyNum}</Text>
                      <Button radius="xl" size="sm" variant="default" onClick={() => setTicketQty(q => Number(q) + 1)} style={{ width: 40, height: 40, padding: 0 }}>+</Button>
                      <Text fz="sm" c="var(--color-muted)">= {formatPrice(ticketTotal)}</Text>
                    </Group>
                  </Box>
                  <Button fullWidth radius="xl" size="md"
                    style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                    onClick={() => setStep('tickets-review')}>
                    Review order →
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {step === 'tickets-review' && selectedEvent && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('tickets-browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review order</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Group gap="md" mb="md">
                    <Text fz="2xl">{selectedEvent.icon}</Text>
                    <Box>
                      <Text fw={700} fz="sm" c="var(--color-ink)">{selectedEvent.title}</Text>
                      <Text fz="xs" c="var(--color-muted)">{formatEventDate(selectedEvent.date)} · {selectedEvent.time}</Text>
                      <Text fz="xs" c="var(--color-muted)">{selectedEvent.venue}</Text>
                    </Box>
                  </Group>
                  <Divider mb="md" />
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">{formatPrice(selectedEvent.price)} × {ticketQtyNum} ticket{ticketQtyNum > 1 ? 's' : ''}</Text>
                      <Text fz="sm" fw={500}>{formatPrice(ticketTotal)}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Total</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(ticketTotal)}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('tickets-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'tickets-pay' && selectedEvent && (
            <PaymentStep
              amount={ticketTotal}
              formatPrice={formatPrice}
              color={sub.color}
              summaryRows={[
                { label: 'Event', value: selectedEvent.title },
                { label: 'Date', value: selectedEvent.date },
                { label: 'Qty', value: String(ticketQtyNum) },
                { label: 'Price per ticket', value: formatPrice(selectedEvent.price) },
              ]}
              orderPayload={{
                service_title: 'Event Tickets',
                service_description: `${selectedEvent.title} — ${ticketQtyNum} ticket${ticketQtyNum > 1 ? 's' : ''}`,
                category: 'Events and Studios',
                total_amount: ticketTotal,
                final_amount: ticketTotal,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  event_id: selectedEvent.id,
                  event_title: selectedEvent.title,
                  event_date: selectedEvent.date,
                  event_time: selectedEvent.time,
                  event_venue: selectedEvent.venue,
                  quantity: ticketQtyNum,
                  price_per_ticket: selectedEvent.price,
                },
              }}
              onBack={() => setStep('tickets-review')}
              onPay={() => setStep('tickets-confirm')}
            />
          )}

          {step === 'tickets-confirm' && selectedEvent && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🎟️</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Tickets confirmed!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="sm">
                Your {ticketQtyNum} ticket{ticketQtyNum > 1 ? 's' : ''} for <strong>{selectedEvent.title}</strong> on <strong>{formatEventDate(selectedEvent.date)}</strong> have been booked.
              </Text>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Your e-tickets will be sent via WhatsApp shortly.</Text>
              <Badge size="lg" radius="xl" variant="outline" mb="xl" style={{ borderColor: sub.color, color: sub.color }}>
                Ref: {orderId}
              </Badge>
              <Group grow>
                <Button component={Link} href="/home" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md" style={{ background: sub.color, color: 'white', fontWeight: 700 }}>My tickets →</Button>
              </Group>
            </Box>
          )}

        </Box>
      </Box>
    </>
  )
}
