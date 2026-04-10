'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  Anchor, Select, TextInput, Textarea,
} from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'
import PaymentStep from '@/components/PaymentStep'
import { validatePhone, reqText, reqSelect } from '@/lib/validation'

// ── Shared ────────────────────────────────────────────────────────────────────
const INPUT_LABEL = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

// ── Make an Impact — causes ───────────────────────────────────────────────────
const IMPACT_CAUSES = [
  { value: 'education',  label: 'Education — TEPLEARN school support programme' },
  { value: 'health',     label: 'Health — Community health camps and outreach' },
  { value: 'youth',      label: 'Youth — Youth skills and empowerment interventions' },
  { value: 'foundation', label: 'Mainland Foundation — General fund' },
]

// ── Be the Difference — sponsorship types ─────────────────────────────────────
const SPONSORSHIP_TYPES = [
  { value: 'student',     label: 'Fund a Student — sponsor a child\'s school term',       amount: 25000  },
  { value: 'health-camp', label: 'Sponsor a Health Camp — support a community health day', amount: 50000  },
  { value: 'youth-prog',  label: 'Youth Programme — back a skills training cohort',        amount: 75000  },
  { value: 'custom',      label: 'Custom amount — I\'ll specify my contribution',           amount: 10000  },
]

type Step =
  | 'browse'
  // Make an Impact
  | 'impact-cause' | 'impact-details' | 'impact-confirm'
  // Be the Difference
  | 'sponsor-type' | 'sponsor-details' | 'sponsor-review' | 'sponsor-pay' | 'sponsor-confirm'

const IMPACT_STEPS  = [{ id: 'impact-cause' as Step, label: 'Cause' }, { id: 'impact-details' as Step, label: 'Your details' }]
const SPONSOR_STEPS = [{ id: 'sponsor-type' as Step, label: 'Sponsorship' }, { id: 'sponsor-details' as Step, label: 'Your details' }, { id: 'sponsor-review' as Step, label: 'Review' }, { id: 'sponsor-pay' as Step, label: 'Pay' }]

// ── Redirect services — cards that send the user to an existing page ──────────
const REDIRECT_SERVICES = [
  {
    id: 'free-checks',
    icon: '🩺',
    name: 'Free Health Checks',
    description: 'Walk-in community health screening every 1st and 3rd Friday — blood pressure, blood sugar, BMI, and more. No appointment needed.',
    cta: 'Book a check-up →',
    href: '/services/healthcare',
    note: 'Handled via Health & Wellness',
  },
  {
    id: 'attend-event',
    icon: '🎟️',
    name: 'Attend an Event',
    description: 'Find and buy tickets to upcoming LagosApps concerts, networking nights, forums, and community events.',
    cta: 'Browse events →',
    href: '/services/events',
    note: 'Handled via Events & Studios',
  },
  {
    id: 'recent-events',
    icon: '📸',
    name: 'View Recent Events',
    description: 'See photos, recaps, and highlights from past LagosApps community events and programmes.',
    cta: 'View events →',
    href: '/services/events',
    note: 'Handled via Events & Studios',
  },
]

export default function BetterYouPage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('better-you')!

  const [step, setStep]             = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState('free-checks')

  // Make an Impact state
  const [impactCause, setImpactCause]   = useState<string | null>(null)
  const [impactName, setImpactName]     = useState('')
  const [impactPhone, setImpactPhone]   = useState('')
  const [impactMessage, setImpactMessage] = useState('')

  // Be the Difference state
  const [sponsorType, setSponsorType]     = useState<string | null>(null)
  const [sponsorName, setSponsorName]     = useState('')
  const [sponsorPhone, setSponsorPhone]   = useState('')
  const [sponsorEmail, setSponsorEmail]   = useState('')
  const [sponsorNote, setSponsorNote]     = useState('')

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // ── Validation ──────────────────────────────────────────────────────────────
  const impactCauseErrors  = { impactCause: reqSelect(impactCause, 'a cause') }
  const impactDetailErrors = {
    impactName:  reqText(impactName, 'Your name'),
    impactPhone: validatePhone(impactPhone),
  }
  const sponsorTypeErrors  = { sponsorType: reqSelect(sponsorType, 'a sponsorship type') }
  const sponsorDetailErrors = {
    sponsorName:  reqText(sponsorName, 'Your name'),
    sponsorPhone: validatePhone(sponsorPhone),
    sponsorEmail: sponsorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sponsorEmail)
      ? 'Enter a valid email address' : '',
  }

  function touchImpactCause()   { setTouched(p => ({ ...p, impactCause: true })) }
  function touchImpactDetails() { setTouched(p => ({ ...p, impactName: true, impactPhone: true })) }
  function touchSponsorType()   { setTouched(p => ({ ...p, sponsorType: true })) }
  function touchSponsorDetails(){ setTouched(p => ({ ...p, sponsorName: true, sponsorPhone: true, sponsorEmail: true })) }

  const sponsorMeta    = SPONSORSHIP_TYPES.find(s => s.value === sponsorType)
  const sponsorAmount  = sponsorMeta?.amount ?? 10000
  const causeMeta      = IMPACT_CAUSES.find(c => c.value === impactCause)

  // Progress bar
  const allServices = [...REDIRECT_SERVICES, { id: 'make-impact' }, { id: 'sponsorship' }]
  const activeService = allServices.find(s => s.id === selectedService)

  const progressSteps = step.startsWith('impact') ? IMPACT_STEPS : SPONSOR_STEPS
  const currentIdx = progressSteps.findIndex(s => s.id === step)
  const showProgress = step !== 'browse' && !step.includes('confirm')

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
              💬 Chat on WhatsApp
            </Button>
          </Box>
        </Box>

        {/* Progress bar */}
        {showProgress && (
          <Box style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }} px="md" py="sm">
            <Box maw={900} mx="auto">
              <Group gap={0} wrap="nowrap">
                {progressSteps.map((s, i) => {
                  const done     = i < currentIdx
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
                      {i < progressSteps.length - 1 && <Box style={{ flex: 1, height: 1, background: 'var(--color-border)', minWidth: 8, margin: '0 6px' }} />}
                    </Group>
                  )
                })}
              </Group>
            </Box>
          </Box>
        )}

        <Box maw={900} mx="auto" p="md" py="xl">

          {/* ════════════════ BROWSE ════════════════ */}
          {step === 'browse' && (
            <Stack gap="xl">

              {/* Redirect services */}
              <Box>
                <Title order={2} ff="var(--font-montserrat)" fw={700} fz={17} c="var(--color-ink)" mb={4}>Community</Title>
                <Text fz="sm" c="var(--color-muted)" mb="md">Access health checks and events directly through their dedicated services.</Text>
                <Stack gap="sm">
                  {REDIRECT_SERVICES.map(sv => (
                    <Card key={sv.id} component={Link} href={sv.href} radius="xl" withBorder p="md"
                      style={{ borderColor: 'var(--color-border)', background: 'white', textDecoration: 'none', display: 'block' }}>
                      <Group gap="sm" wrap="nowrap" justify="space-between">
                        <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                          <Box style={{ width: 44, height: 44, borderRadius: 12, background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                            {sv.icon}
                          </Box>
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text fw={700} fz="sm" c="var(--color-ink)" mb={2}>{sv.name}</Text>
                            <Text fz="xs" c="var(--color-muted)" lh={1.5}>{sv.description}</Text>
                            <Text fz="xs" mt={4} style={{ color: sub.color, fontWeight: 600 }}>{sv.cta}</Text>
                          </Box>
                        </Group>
                        <Badge size="xs" radius="xl" variant="outline" color="gray" style={{ flexShrink: 0 }}>
                          {sv.note}
                        </Badge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              {/* Impact services */}
              <Box>
                <Title order={2} ff="var(--font-montserrat)" fw={700} fz={17} c="var(--color-ink)" mb={4}>Social Impact</Title>
                <Text fz="sm" c="var(--color-muted)" mb="md">Support education, health, and youth programmes through Mainland Foundation and TEPLEARN.</Text>
                <Group gap="md" wrap="wrap">

                  <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 260 }}>
                    <Group gap="sm" mb="md">
                      <Box style={{ width: 44, height: 44, borderRadius: 12, background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🎓</Box>
                      <Box>
                        <Text fw={700} fz="sm" c="var(--color-ink)">Make an Impact</Text>
                        <Text fz="xs" c="var(--color-muted)">Education, Health & Youth</Text>
                      </Box>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)" lh={1.6} mb="md">
                      Register your support for community interventions run by Mainland Foundation and TEPLEARN — education drives, health outreach, and youth skills programmes.
                    </Text>
                    <Badge size="xs" radius="xl" style={{ background: sub.colorPale, color: sub.color }} mb="md">Free — register your interest</Badge>
                    <Button fullWidth radius="xl" size="sm" style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                      onClick={() => setStep('impact-cause')}>
                      Get involved →
                    </Button>
                  </Card>

                  <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 260 }}>
                    <Group gap="sm" mb="md">
                      <Box style={{ width: 44, height: 44, borderRadius: 12, background: sub.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤝</Box>
                      <Box>
                        <Text fw={700} fz="sm" c="var(--color-ink)">Be the Difference</Text>
                        <Text fz="xs" c="var(--color-muted)">Single Sponsorships</Text>
                      </Box>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)" lh={1.6} mb="md">
                      Make a direct, named contribution — fund a student&apos;s school term, sponsor a health camp, or back a youth training cohort. Every sponsorship goes to a specific programme.
                    </Text>
                    <Text fw={700} fz="sm" style={{ color: sub.color }} mb="md">
                      From {formatPrice(10000)} <Text span fw={400} fz="xs" c="var(--color-muted)">/ sponsorship</Text>
                    </Text>
                    <Button fullWidth radius="xl" size="sm" style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                      onClick={() => setStep('sponsor-type')}>
                      Sponsor now →
                    </Button>
                  </Card>

                </Group>
              </Box>
            </Stack>
          )}

          {/* ════════════════ MAKE AN IMPACT ════════════════ */}

          {step === 'impact-cause' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Make an Impact</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Choose the cause you&apos;d like to support</Text>
              <Stack gap="md">
                {IMPACT_CAUSES.map(cause => (
                  <Card key={cause.value} radius="xl" withBorder p="md"
                    onClick={() => { setImpactCause(cause.value); setTouched(p => ({ ...p, impactCause: true })) }}
                    style={{ borderColor: impactCause === cause.value ? sub.color + '80' : 'var(--color-border)', background: impactCause === cause.value ? sub.colorPale : 'white', cursor: 'pointer', outline: impactCause === cause.value ? `2px solid ${sub.color}50` : 'none' }}>
                    <Group gap="sm" wrap="nowrap">
                      <Box style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${impactCause === cause.value ? sub.color : 'var(--color-border)'}`, background: impactCause === cause.value ? sub.color : 'white', flexShrink: 0 }} />
                      <Text fz="sm" fw={impactCause === cause.value ? 700 : 400} c="var(--color-ink)">{cause.label}</Text>
                    </Group>
                  </Card>
                ))}
                {touched.impactCause && impactCauseErrors.impactCause && (
                  <Text fz="xs" c="red">{impactCauseErrors.impactCause}</Text>
                )}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchImpactCause(); if (Object.values(impactCauseErrors).some(Boolean)) return; setStep('impact-details') }}>
                Continue →
              </Button>
            </Box>
          )}

          {step === 'impact-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('impact-cause')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Your details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">
                Tell us a little about yourself so our team can follow up on your support for <strong>{causeMeta?.label.split(' —')[0]}</strong>.
              </Text>
              <Stack gap="md">
                <TextInput
                  label="Your name"
                  placeholder="First and last name"
                  value={impactName}
                  onChange={e => setImpactName(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, impactName: true }))}
                  error={touched.impactName ? impactDetailErrors.impactName : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <TextInput
                  label="Phone number"
                  placeholder="e.g. 08012345678"
                  value={impactPhone}
                  onChange={e => setImpactPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, impactPhone: true }))}
                  error={touched.impactPhone ? impactDetailErrors.impactPhone : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Textarea
                  label="Message (optional)"
                  placeholder="Any specific aspect of this cause you'd like to support or a message for the team…"
                  value={impactMessage}
                  onChange={e => setImpactMessage(e.target.value)}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL}
                />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchImpactDetails(); if (Object.values(impactDetailErrors).some(Boolean)) return; setStep('impact-confirm') }}>
                Submit →
              </Button>
            </Box>
          )}

          {step === 'impact-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🎓</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Thank you, {impactName.split(' ')[0]}!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                Your support interest for <strong>{causeMeta?.label.split(' —')[0]}</strong> has been registered.
                Our team will be in touch on <strong>{impactPhone}</strong> to share how you can get more involved with Mainland Foundation and TEPLEARN.
              </Text>
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

          {/* ════════════════ BE THE DIFFERENCE ════════════════ */}

          {step === 'sponsor-type' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Be the Difference</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Choose your sponsorship</Text>
              <Stack gap="sm">
                {SPONSORSHIP_TYPES.map(sp => (
                  <Card key={sp.value} radius="xl" withBorder p="md"
                    onClick={() => { setSponsorType(sp.value); setTouched(p => ({ ...p, sponsorType: true })) }}
                    style={{ borderColor: sponsorType === sp.value ? sub.color + '80' : 'var(--color-border)', background: sponsorType === sp.value ? sub.colorPale : 'white', cursor: 'pointer', outline: sponsorType === sp.value ? `2px solid ${sub.color}50` : 'none' }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <Box style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sponsorType === sp.value ? sub.color : 'var(--color-border)'}`, background: sponsorType === sp.value ? sub.color : 'white', flexShrink: 0 }} />
                        <Text fz="sm" fw={sponsorType === sp.value ? 700 : 400} c="var(--color-ink)" lh={1.4}>{sp.label}</Text>
                      </Group>
                      <Text fw={700} fz="sm" style={{ color: sub.color, flexShrink: 0, marginLeft: 8 }}>{formatPrice(sp.amount)}</Text>
                    </Group>
                  </Card>
                ))}
                {touched.sponsorType && sponsorTypeErrors.sponsorType && (
                  <Text fz="xs" c="red">{sponsorTypeErrors.sponsorType}</Text>
                )}
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchSponsorType(); if (Object.values(sponsorTypeErrors).some(Boolean)) return; setStep('sponsor-details') }}>
                Continue →
              </Button>
            </Box>
          )}

          {step === 'sponsor-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('sponsor-type')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Your details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">We&apos;ll send a confirmation and impact update to you after your sponsorship.</Text>
              <Stack gap="md">
                <TextInput
                  label="Your name"
                  placeholder="First and last name"
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, sponsorName: true }))}
                  error={touched.sponsorName ? sponsorDetailErrors.sponsorName : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <TextInput
                  label="Phone number"
                  placeholder="e.g. 08012345678"
                  value={sponsorPhone}
                  onChange={e => setSponsorPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, sponsorPhone: true }))}
                  error={touched.sponsorPhone ? sponsorDetailErrors.sponsorPhone : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <TextInput
                  label="Email address (optional)"
                  placeholder="For your receipt and impact update"
                  value={sponsorEmail}
                  onChange={e => setSponsorEmail(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, sponsorEmail: true }))}
                  error={touched.sponsorEmail ? sponsorDetailErrors.sponsorEmail : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Textarea
                  label="Dedication or message (optional)"
                  placeholder="e.g. In memory of…, On behalf of…, or a message to the beneficiaries"
                  value={sponsorNote}
                  onChange={e => setSponsorNote(e.target.value)}
                  size="md" radius="md" minRows={2} autosize styles={INPUT_LABEL}
                />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchSponsorDetails(); if (Object.values(sponsorDetailErrors).some(Boolean)) return; setStep('sponsor-review') }}>
                Review →
              </Button>
            </Box>
          )}

          {step === 'sponsor-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('sponsor-details')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review your sponsorship</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Sponsorship</Text>
                  <Stack gap="xs">
                    {[
                      ['Type',   sponsorMeta?.label ?? ''],
                      ['Amount', formatPrice(sponsorAmount)],
                      ['Name',   sponsorName],
                      ['Phone',  sponsorPhone],
                      ...(sponsorEmail ? [['Email', sponsorEmail]] : []),
                      ...(sponsorNote  ? [['Dedication', sponsorNote]] : []),
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 260 }}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card radius="xl" p="md" style={{ background: sub.colorPale, border: `1px solid ${sub.color}30` }}>
                  <Group gap="sm">
                    <Text fz="lg">💡</Text>
                    <Text fz="xs" c="var(--color-muted)" lh={1.6}>
                      100% of your sponsorship goes directly to the programme. You&apos;ll receive an impact update within 30 days showing exactly how your contribution was used.
                    </Text>
                  </Group>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('sponsor-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {step === 'sponsor-pay' && (
            <PaymentStep
              amount={sponsorAmount}
              formatPrice={formatPrice}
              color={sub.color}
              description={`Sponsorship — ${sponsorMeta?.label ?? ''}`}
              summaryRows={[
                { label: 'Sponsorship', value: sponsorMeta?.label ?? '' },
                { label: 'Sponsor',     value: sponsorName },
                { label: 'Phone',       value: sponsorPhone },
                ...(sponsorNote ? [{ label: 'Dedication', value: sponsorNote }] : []),
              ]}
              orderPayload={{
                service_title: 'Sponsorship',
                service_description: sponsorMeta?.label ?? '',
                category: 'Better You',
                total_amount: sponsorAmount,
                final_amount: sponsorAmount,
                delivery_state: 'Lagos',
                delivery_country: 'NG',
                meta: {
                  sponsorship_type: sponsorType,
                  sponsor_name: sponsorName,
                  sponsor_phone: sponsorPhone,
                  sponsor_email: sponsorEmail || null,
                  dedication: sponsorNote || null,
                },
              }}
              onBack={() => setStep('sponsor-review')}
              onPay={() => setStep('sponsor-confirm')}
            />
          )}

          {step === 'sponsor-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🤝</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">You&apos;re making a difference!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                Thank you, <strong>{sponsorName.split(' ')[0]}</strong>. Your <strong>{formatPrice(sponsorAmount)}</strong> sponsorship for <strong>{sponsorMeta?.label.split(' —')[0]}</strong> has been received.
                {sponsorNote && <> It will be dedicated: <em>&ldquo;{sponsorNote}&rdquo;</em>.</>}
                {' '}You&apos;ll receive an impact update within 30 days.
              </Text>
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
