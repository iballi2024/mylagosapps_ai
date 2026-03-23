'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Stack, Title, Text, Card, Group, Button, SimpleGrid } from '@mantine/core'
import Navbar from '@/components/Navbar'
import Confetti from '@/components/Confetti'

const FIRST_ACTIONS = [
  { label: 'Order food',    href: '/services/food',      icon: '🍽️' },
  { label: 'Book a ride',   href: '/services/rides',     icon: '🚗' },
  { label: 'Buy groceries', href: '/services/groceries', icon: '🛒' },
  { label: 'Send a parcel', href: '/services/logistics', icon: '📦' },
]

export default function WelcomePage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <>
      <Navbar />
      <Confetti />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
        <Box w="100%" maw={480}>
          <Stack align="center" gap="md">
            <Box w={80} h={80} style={{
              borderRadius: '50%', background: 'var(--color-gold-pale)',
              border: '2px solid rgba(201,146,10,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
              transition: 'all 0.5s', transform: visible ? 'scale(1)' : 'scale(0.5)', opacity: visible ? 1 : 0,
            }}>🎉</Box>

            <Title order={1} ff="var(--font-montserrat)" fw={800} ta="center"
              style={{ transition: 'all 0.5s 0.1s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
              Welcome to LagosApps
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={380} lh={1.7}
              style={{ transition: 'all 0.5s 0.15s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
              Your account is ready. Your wallet is funded. Order from any LagosApps service with a single tap.
            </Text>

            <Card withBorder radius="xl" p="lg" w="100%"
              style={{ transition: 'all 0.5s 0.2s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0, border: '1px solid rgba(201,146,10,0.2)' }}>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md" style={{ letterSpacing: 1 }}>Your account includes</Text>
              <Stack gap="sm">
                {[
                  { icon: '💳', text: '1 wallet — works on all 6 services' },
                  { icon: '⭐', text: 'Loyalty points on every transaction' },
                  { icon: '💬', text: 'Order via WhatsApp on any service' },
                ].map(item => (
                  <Group key={item.icon} gap="sm">
                    <Box w={32} h={32} style={{ borderRadius: 8, background: 'var(--color-gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {item.icon}
                    </Box>
                    <Text size="sm" c="dimmed">{item.text}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>

            <SimpleGrid cols={2} spacing="sm" w="100%"
              style={{ transition: 'all 0.5s 0.25s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
              {FIRST_ACTIONS.map(s => (
                <Button key={s.href} component={Link} href={s.href} variant="default" radius="xl" size="md"
                  leftSection={<Text>{s.icon}</Text>}>
                  {s.label}
                </Button>
              ))}
            </SimpleGrid>

            <Button component={Link} href="/dashboard" fullWidth radius="xl" size="lg"
              style={{ background: 'var(--color-ink)', color: 'white', transition: 'all 0.5s 0.3s', opacity: visible ? 1 : 0 }}>
              Go to my dashboard →
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  )
}
