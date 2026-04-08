'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Box, Title, Text, Card, Button, Group, Stack, Badge, TextInput, Select, Anchor } from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'
import Header2 from '@/app/home/components/Header2'

const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
]

export default function SolarPage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('solar')!
  const [selectedService, setSelectedService] = useState(sub.services[0].id)
  const [step, setStep] = useState<'browse' | 'booking' | 'confirm'>('browse')
  const [form, setForm] = useState({ address: '', propertyType: '', phone: '', preferredDate: '' })

  const active = sub.services.find(s => s.id === selectedService)!
  const isAudit = active.id === 'audit'
  const canProceed = form.address.trim() && form.propertyType && form.phone.trim()

  return (
    <>
      <Header2 />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

        {/* Hero */}
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg, ${sub.color}, ${sub.colorLight})` }}>
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
              💬 Enquire on WhatsApp
            </Button>
          </Box>
        </Box>

        <Box maw={900} mx="auto" p="md" py="xl">

          {step === 'browse' && (
            <Group align="flex-start" gap="lg" wrap="wrap">

              {/* Services list */}
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
                            {sv.id === 'audit' && <Badge size="xs" radius="xl" style={{ background: '#E8F5EE', color: sub.color, border: `1px solid ${sub.color}40` }}>Free</Badge>}
                          </Group>
                          <Text fz="xs" c="var(--color-muted)" lh={1.5}>{sv.description}</Text>
                          <Text fw={700} fz="sm" mt={4} style={{ color: sub.color }}>
                            {sv.startingPrice === 0 ? 'Free' : <>From {formatPrice(sv.startingPrice)} <Text span fw={400} fz="xs" c="var(--color-muted)">/ {sv.unit}</Text></>}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              {/* Summary card */}
              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">Booking summary</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">{active.name}</Text>
                    <Text fz="sm" fw={600} style={{ color: sub.color }}>
                      {active.startingPrice === 0 ? 'Free' : formatPrice(active.startingPrice)}
                    </Text>
                  </Group>
                  {!isAudit && (
                    <>
                      <Box style={{ height: 1, background: 'var(--color-border)' }} />
                      <Group justify="space-between">
                        <Text ff="var(--font-montserrat)" fw={700}>Starting from</Text>
                        <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(active.startingPrice)}</Text>
                      </Group>
                    </>
                  )}
                </Stack>
                {isAudit && (
                  <Box mb="md" p="sm" style={{ background: '#E8F5EE', borderRadius: 10, border: '1px solid #C8E8D4' }}>
                    <Text fz="xs" c={sub.color} fw={600}>✅ No payment needed — our engineer visits your site and gives a full report.</Text>
                  </Box>
                )}
                <Button fullWidth radius="xl" size="md" mb="xs"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => setStep('booking')}>
                  {isAudit ? 'Book free audit →' : 'Request a quote →'}
                </Button>
                <Button fullWidth radius="xl" size="sm" variant="outline"
                  component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Chat on WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {step === 'booking' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>
                {isAudit ? 'Book your free solar audit' : 'Request a quote'}
              </Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">
                {isAudit
                  ? 'Tell us about your property and we\'ll schedule a free site visit.'
                  : 'Share your details and we\'ll send a tailored quote within 24 hours.'}
              </Text>
              <Stack gap="md">
                <TextInput label="Property Address" placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                  value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  size="md" radius="xl"
                  styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
                <Select label="Property Type" placeholder="Select type"
                  data={PROPERTY_TYPES} value={form.propertyType} onChange={v => setForm(p => ({ ...p, propertyType: v ?? '' }))}
                  size="md" radius="xl"
                  styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
                <TextInput label="Phone Number" placeholder="+234 801 234 5678" type="tel"
                  value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  size="md" radius="xl"
                  styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
                <TextInput label="Preferred Date (optional)" placeholder="e.g. 15 Apr 2026" type="text"
                  value={form.preferredDate} onChange={e => setForm(p => ({ ...p, preferredDate: e.target.value }))}
                  size="md" radius="xl"
                  styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />

                <Box p="md" style={{ background: 'var(--color-surface2)', borderRadius: 14, border: '1px solid var(--color-border)' }}>
                  <Group justify="space-between">
                    <Text fz="sm" c="var(--color-muted)">{active.name}</Text>
                    <Text fz="sm" fw={600} style={{ color: sub.color }}>{active.startingPrice === 0 ? 'Free' : `From ${formatPrice(active.startingPrice)}`}</Text>
                  </Group>
                </Box>

                <Button fullWidth radius="xl" size="md" disabled={!canProceed}
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                  onClick={() => setStep('confirm')}>
                  {isAudit ? 'Confirm booking →' : 'Submit request →'}
                </Button>
              </Stack>
            </Box>
          )}

          {step === 'confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
                {isAudit ? '✅' : '📋'}
              </Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">
                {isAudit ? 'Audit booked!' : 'Request submitted!'}
              </Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>
                {isAudit
                  ? 'Our solar engineer will contact you within 24 hours to confirm your visit. You\'ll receive a full energy report at no cost.'
                  : 'Our team will review your details and send a tailored quote within 24 hours.'}
              </Text>
              <Card radius="xl" withBorder p="lg" mb="xl" style={{ textAlign: 'left', borderColor: 'var(--color-border)' }}>
                <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb="md">Booking details</Text>
                <Stack gap="xs">
                  {[
                    ['Service', active.name],
                    ['Property', form.address],
                    ['Type', PROPERTY_TYPES.find(p => p.value === form.propertyType)?.label ?? '—'],
                    ['Phone', form.phone],
                    ...(form.preferredDate ? [['Preferred date', form.preferredDate]] : []),
                    ['Cost', active.startingPrice === 0 ? 'Free' : `From ${formatPrice(active.startingPrice)}`],
                  ].map(([k, v]) => (
                    <Group key={k} justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">{k}</Text>
                      <Text fz="sm" fw={500}>{v}</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
                  Back to home
                </Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }}>
                  My dashboard →
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
