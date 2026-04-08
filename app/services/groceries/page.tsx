'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Box, Title, Text, Card, Button, Group, Stack, Badge, Anchor } from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'

export default function ServicePage() {
  const { getSubsidiary, walletBalance, formatPrice } = usePlatform()
  const sub = getSubsidiary('groceries')!
  const [selectedService, setSelectedService] = useState(sub?.services[0].id)
  const [step, setStep] = useState<'browse' | 'confirm'>('browse')

  const active = sub?.services.find(s => s.id === selectedService)!
  const serviceFee = 800
  const total = active?.startingPrice + serviceFee

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg,${sub?.color},${sub?.colorLight})` }}>
          <Box maw={900} mx="auto">
            <Anchor component="button" fz="xs" c="rgba(255,255,255,0.6)" mb="sm" display="block" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => window.history.back()}>← All services</Anchor>
            <Group gap="md" wrap="wrap" align="center" mb="md">
              <Box style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {sub?.icon}
              </Box>
              <Box>
                <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="white">{sub?.name}</Title>
                <Text fz="sm" c="rgba(255,255,255,0.7)">{sub?.tagline}</Text>
              </Box>
            </Group>
            <Button component="a" href={`https://wa.me/${sub?.whatsapp.replace(/\D/g,'')}`} target="_blank"
              size="sm" radius="xl" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
              💬 Order on WhatsApp
            </Button>
          </Box>
        </Box>

        <Box maw={900} mx="auto" p="md" py="xl">
          {step === 'browse' && (
            <Group align="flex-start" gap="lg" wrap="wrap">
              <Box style={{ flex: 2, minWidth: 280 }}>
                <Title order={2} ff="var(--font-montserrat)" fw={700} fz={17} c="var(--color-ink)" mb="md">Choose a service</Title>
                <Stack gap="sm">
                  {sub?.services.map(sv => (
                    <Card key={sv.id} radius="xl" withBorder p="md" onClick={() => setSelectedService(sv.id)}
                      style={{ borderColor: selectedService === sv.id ? sub?.color + '80' : 'var(--color-border)', background: selectedService === sv.id ? sub?.colorPale : 'white', cursor: 'pointer', outline: selectedService === sv.id ? `2px solid ${sub?.color}50` : 'none' }}>
                      <Group gap="sm" wrap="nowrap">
                        <Box style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                          {sv.icon}
                        </Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Group gap="xs" mb={2} wrap="wrap">
                            <Text fw={700} fz="sm" c="var(--color-ink)">{sv?.name}</Text>
                            {sv.popular && <Badge size="xs" radius="xl" style={{ background: sub?.color, color: 'white' }}>Popular</Badge>}
                          </Group>
                          <Text fz="xs" c="var(--color-muted)" lh={1.5}>{sv.description}</Text>
                          <Text fw={700} fz="sm" mt={4} style={{ color: sub?.color }}>
                            From {formatPrice(sv?.startingPrice)} <Text span fw={400} fz="xs" c="var(--color-muted)">/ {sv.unit}</Text>
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">Order summary</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">{active?.name}</Text><Text fz="sm" fw={500}>{formatPrice(active?.startingPrice)}</Text></Group>
                  <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">Service fee</Text><Text fz="sm" fw={500}>{formatPrice(serviceFee)}</Text></Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between"><Text ff="var(--font-montserrat)" fw={700}>Total</Text><Text ff="var(--font-montserrat)" fw={700} style={{ color: sub?.color }}>{formatPrice(total)}</Text></Group>
                </Stack>
                <Text fz={10} c="var(--color-muted)" mb="sm">💳 Wallet: <Text span fw={600} c="var(--color-ink)">{formatPrice(walletBalance)}</Text></Text>
                <Button fullWidth radius="xl" size="md" mb="xs"
                  style={{ background: sub?.color, color: 'white', fontWeight: 700 }} onClick={() => setStep('confirm')}>
                  Book now →
                </Button>
                <Button fullWidth radius="xl" size="sm" component="a" href={`https://wa.me/${sub?.whatsapp.replace(/\D/g,'')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Order via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {step === 'confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub?.colorPale, border: `2px solid ${sub?.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Booking confirmed!</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>Your {active?.name} has been booked. A WhatsApp confirmation is on its way.</Text>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md" style={{ background: sub?.color, color: 'white', fontWeight: 700 }}>My orders →</Button>
              </Group>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
