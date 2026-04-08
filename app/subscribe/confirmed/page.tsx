'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Card, Group, Button, SimpleGrid, Badge } from '@mantine/core'
import Navbar from '@/components/Navbar'
import Confetti from '@/components/Confetti'

type Tier = 'bronze' | 'silver' | 'gold'

const PLANS: Record<Tier, { name: string; icon: string; color: string; colorPale: string; tagline: string; benefits: { icon: string; text: string }[] }> = {
  bronze: {
    name: 'Bronze', icon: '🥉', color: '#6B7C2A', colorPale: '#F2F5E4',
    tagline: 'Your membership is active. Start exploring your free services.',
    benefits: [
      { icon: '🩺', text: 'Free basic health check — book at any Mainland Clinic' },
      { icon: '🎟️', text: 'Free event tickets — check upcoming LagosApps events' },
      { icon: '☀️', text: 'Free solar audit — schedule with Mainland Solar' },
    ],
  },
  silver: {
    name: 'Silver', icon: '🥈', color: '#3D6B5E', colorPale: '#E6F2EE',
    tagline: "Your Silver membership is active. Here's what's waiting for you.",
    benefits: [
      { icon: '🚗', text: 'Free car or van rental — book through Van Lagos' },
      { icon: '🛒', text: 'Free grocery delivery once a month — via LagosCart' },
      { icon: '🩺', text: 'Free basic health check — at any Mainland Clinic' },
      { icon: '🎟️', text: 'Free event tickets — check upcoming events' },
      { icon: '☀️', text: 'Free solar audit — schedule with Mainland Solar' },
    ],
  },
  gold: {
    name: 'Gold', icon: '🥇', color: '#1A6B3C', colorPale: '#E8F5EE',
    tagline: "Your Gold membership is active. You've unlocked our best plan.",
    benefits: [
      { icon: '🏥', text: 'Free 2-day wellness stay OR home medical tests (up to 4 people)' },
      { icon: '🛒', text: 'Free grocery delivery twice a month — via LagosCart' },
      { icon: '🚗', text: 'Free car or van rental — book through Van Lagos' },
      { icon: '🩺', text: 'Free basic health check — at any Mainland Clinic' },
      { icon: '🎟️', text: 'Free event tickets — check upcoming events' },
      { icon: '☀️', text: 'Free solar audit — schedule with Mainland Solar' },
    ],
  },
}

const FIRST_ACTIONS = [
  { label: 'Order food',    href: '/services/food',       icon: '🍽️' },
  { label: 'Book a ride',   href: '/services/rides',      icon: '🚗' },
  { label: 'Buy groceries', href: '/services/groceries',  icon: '🛒' },
  { label: 'See a doctor',  href: '/services/healthcare', icon: '🩺' },
]

function StepBar({ step }: { step: number }) {
  const steps = ['Plan', 'Payment', 'Done']
  return (
    <Group gap={0} mb="xl" w="100%">
      {steps.map((label, i) => {
        const num = i + 1
        const active = num === step
        const done = num < step
        return (
          <Box key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Group gap={0} style={{ width: '100%', alignItems: 'center' }}>
              {i > 0 && <Box style={{ flex: 1, height: 2, background: done ? '#1A6B3C' : '#D8E6DA' }} />}
              <Box style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#1A6B3C' : active ? '#1A6B3C' : '#D8E6DA', color: (done || active) ? 'white' : '#4F6B57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {done ? '✓' : num}
              </Box>
              {i < steps.length - 1 && <Box style={{ flex: 1, height: 2, background: done ? '#1A6B3C' : '#D8E6DA' }} />}
            </Group>
            <Text size="xs" fw={active ? 700 : 400} c={active ? '#1A6B3C' : 'dimmed'}>{label}</Text>
          </Box>
        )
      })}
    </Group>
  )
}

function ConfirmedPageInner() {
  const params = useSearchParams()
  const tier = (params.get('slug') as Tier) ?? 'silver'
  const plan = PLANS[tier] ?? PLANS['silver']
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
      <Box w="100%" maw={500}>
        <StepBar step={3} />

        <Stack align="center" gap="md">
          {/* Hero icon */}
          <Box style={{
            width: 80, height: 80, borderRadius: '50%', background: plan.colorPale,
            border: `2px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            transition: 'all 0.5s', transform: visible ? 'scale(1)' : 'scale(0.5)', opacity: visible ? 1 : 0,
          }}>
            {plan.icon}
          </Box>

          {/* Badge */}
          <Badge size="lg" radius="xl" style={{ background: plan.colorPale, color: plan.color, border: `1px solid ${plan.color}30` }}>
            {plan.name} Member
          </Badge>

          <Title order={1} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, transition: 'all 0.5s 0.1s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}
            ta="center">
            Welcome to LagosApps!
          </Title>
          <Text size="sm" c="dimmed" ta="center" maw={380} lh={1.7}
            style={{ transition: 'all 0.5s 0.15s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
            {plan.tagline}
          </Text>

          {/* Benefits card */}
          <Card withBorder radius="xl" p="lg" w="100%"
            style={{ border: `1px solid ${plan.color}30`, background: plan.colorPale, transition: 'all 0.5s 0.2s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md" style={{ letterSpacing: 1 }}>Your {plan.name} benefits</Text>
            <Stack gap="sm">
              {plan.benefits.map(b => (
                <Group key={b.text} gap="sm" align="flex-start">
                  <Box style={{ width: 32, height: 32, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {b.icon}
                  </Box>
                  <Text size="sm" c="dimmed" style={{ flex: 1 }}>{b.text}</Text>
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Quick actions */}
          <SimpleGrid cols={2} spacing="sm" w="100%"
            style={{ transition: 'all 0.5s 0.25s', transform: visible ? 'translateY(0)' : 'translateY(16px)', opacity: visible ? 1 : 0 }}>
            {FIRST_ACTIONS.map(s => (
              <Button key={s.href} component={Link} href={s.href} variant="default" radius="xl" size="md"
                leftSection={<Text>{s.icon}</Text>}>
                {s.label}
              </Button>
            ))}
          </SimpleGrid>

          <Button component={Link} href="/dashboard" fullWidth radius="xl" size="lg" fw={700}
            style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white', transition: 'all 0.5s 0.3s', opacity: visible ? 1 : 0 }}>
            Go to my dashboard →
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default function ConfirmedPage() {
  return (
    <>
      <Navbar />
      <Confetti />
      <Suspense fallback={<Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5' }} />}>
        <ConfirmedPageInner />
      </Suspense>
    </>
  )
}
