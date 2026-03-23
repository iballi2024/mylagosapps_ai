'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Box, Title, Text, Card, Button, Group, Stack, Badge, NumberInput, TextInput, Anchor } from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'

export default function FoodPage() {
  const { getSubsidiary, walletBalance, formatPrice } = usePlatform()
  const sub = getSubsidiary('food')!
  const [selectedService, setSelectedService] = useState(sub.services[0].id)
  const [quantity, setQuantity] = useState<number | string>(1)
  const [address, setAddress] = useState('')
  const [step, setStep] = useState<'browse' | 'booking' | 'confirm'>('browse')

  const active = sub.services.find(s => s.id === selectedService)!
  const deliveryFee = 800
  const qty = Number(quantity) || 1
  const total = active.startingPrice * qty + deliveryFee

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        {/* Hero */}
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg,${sub.color},${sub.colorLight})` }}>
          <Box maw={900} mx="auto">
            <Anchor component={Link} href="/" fz="xs" c="rgba(255,255,255,0.6)" mb="sm" display="block">← All services</Anchor>
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
          {step === 'browse' && (
            <Group align="flex-start" gap="lg" wrap="wrap">
              {/* Services */}
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

              {/* Summary */}
              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">Order summary</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">{active.name}</Text><Text fz="sm" fw={500}>{formatPrice(active.startingPrice)}</Text></Group>
                  <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">Delivery fee</Text><Text fz="sm" fw={500}>{formatPrice(deliveryFee)}</Text></Group>
                  <Box style={{ height: 1, background: 'var(--color-border)' }} />
                  <Group justify="space-between"><Text ff="var(--font-montserrat)" fw={700}>Total</Text><Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(active.startingPrice + deliveryFee)}</Text></Group>
                </Stack>
                <Text fz={10} c="var(--color-muted)" mb="sm">💳 Wallet: <Text span fw={600} c="var(--color-ink)">{formatPrice(walletBalance)}</Text></Text>
                <Button fullWidth radius="xl" size="md" mb="xs"
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={() => setStep('booking')}>
                  Continue to booking →
                </Button>
                <Button fullWidth radius="xl" size="sm" component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g,'')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Order via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {step === 'booking' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="lg">Delivery details</Title>
              <Stack gap="md">
                <TextInput label="Delivery Address" placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                  value={address} onChange={e => setAddress(e.target.value)} size="md" radius="xl"
                  styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
                <Box>
                  <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb="xs">Quantity</Text>
                  <Group gap="sm">
                    <Button radius="xl" size="sm" variant="default" onClick={() => setQuantity(q => Math.max(1, Number(q) - 1))} style={{ width: 40, height: 40, padding: 0 }}>−</Button>
                    <Text ff="var(--font-montserrat)" fw={700} fz="lg" w={32} ta="center">{qty}</Text>
                    <Button radius="xl" size="sm" variant="default" onClick={() => setQuantity(q => Number(q) + 1)} style={{ width: 40, height: 40, padding: 0 }}>+</Button>
                  </Group>
                </Box>
                <Box p="md" style={{ background: 'var(--color-surface2)', borderRadius: 14, border: '1px solid var(--color-border)' }}>
                  <Stack gap="xs">
                    <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">{active.name} × {qty}</Text><Text fz="sm">{formatPrice(active.startingPrice * qty)}</Text></Group>
                    <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">Delivery</Text><Text fz="sm">{formatPrice(deliveryFee)}</Text></Group>
                    <Box style={{ height: 1, background: 'var(--color-border)' }} />
                    <Group justify="space-between"><Text ff="var(--font-montserrat)" fw={700}>Total</Text><Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(total)}</Text></Group>
                  </Stack>
                </Box>
                <Button fullWidth radius="xl" size="md" disabled={!address.trim()}
                  style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={() => setStep('confirm')}>
                  Pay {formatPrice(total)} from wallet →
                </Button>
              </Stack>
            </Box>
          )}

          {step === 'confirm' && (
            <Box maw={480} mx="auto" style={{ textAlign: 'center' }} py="xl">
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Order placed!</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl" lh={1.7}>Your {active.name} order has been confirmed. You&apos;ll receive a WhatsApp confirmation shortly.</Text>
              <Card radius="xl" withBorder p="lg" mb="xl" style={{ textAlign: 'left', borderColor: 'var(--color-border)' }}>
                <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb="md">Order details</Text>
                <Stack gap="xs">
                  {[['Service', active.name], ['Quantity', String(qty)], ['Payment', 'Wallet ✓']].map(([k, v]) => (
                    <Group key={k} justify="space-between"><Text fz="sm" c="var(--color-muted)">{k}</Text><Text fz="sm" fw={500}>{v}</Text></Group>
                  ))}
                  <Group justify="space-between"><Text fz="sm" c="var(--color-muted)">Total charged</Text><Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(total)}</Text></Group>
                </Stack>
              </Card>
              <Group grow>
                <Button component={Link} href="/" radius="xl" size="md" variant="default" styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Back to home</Button>
                <Button component={Link} href="/dashboard" radius="xl" size="md" style={{ background: sub.color, color: 'white', fontWeight: 700 }}>My orders →</Button>
              </Group>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
