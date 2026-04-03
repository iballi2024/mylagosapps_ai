'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Card, Group, Button, Badge, Divider, List, ThemeIcon, SegmentedControl } from '@mantine/core'
import Header2 from '@/app/home/components/Header2'

type Tier = 'bronze' | 'silver' | 'gold'
type Billing = 'annual' | 'quarterly'

const PLANS: Record<Tier, { name: string; icon: string; color: string; colorPale: string; annual: number; quarterly: number; savings: number; features: string[] }> = {
  bronze: {
    name: 'Bronze', icon: '🥉', color: '#6B7C2A', colorPale: '#F2F5E4', annual: 100000, quarterly: 30000, savings: 20000,
    features: ['Free basic health check (registration required)', 'Free tickets to LagosApps Concerts and Events', 'Free Solar Audit'],
  },
  silver: {
    name: 'Silver', icon: '🥈', color: '#3D6B5E', colorPale: '#E6F2EE', annual: 250000, quarterly: 75000, savings: 50000,
    features: ['1 free Car rental or 1 free Van/Bus rental', 'Free Grocery Delivery once a month', 'Free basic health check', 'Free event tickets', 'Free Solar Audit'],
  },
  gold: {
    name: 'Gold', icon: '🥇', color: '#1A6B3C', colorPale: '#E8F5EE', annual: 500000, quarterly: 200000, savings: 300000,
    features: ['Free 2-day wellness stay OR home medical tests (up to 4 people)', 'Free Grocery Delivery twice a month', '1 free Car rental or Van/Bus rental', 'Free basic health check', 'Free event tickets', 'Free Solar Audit'],
  },
}

const TIERS: Tier[] = ['bronze', 'silver', 'gold']

function StepBar({ step }: { step: number }) {
  const steps = ['Plan', 'Account', 'Payment', 'Done']
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
              {i < steps.length - 1 && <Box style={{ flex: 1, height: 2, background: '#D8E6DA' }} />}
            </Group>
            <Text size="xs" fw={active ? 700 : 400} c={active ? '#1A6B3C' : 'dimmed'}>{label}</Text>
          </Box>
        )
      })}
    </Group>
  )
}

function PlanPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const initTier = (params.get('tier') as Tier) ?? 'silver'
  const initBilling = (params.get('billing') as Billing) ?? 'annual'
  const [tier, setTier] = useState<Tier>(initTier)
  const [billing, setBilling] = useState<Billing>(initBilling)

  const plan = PLANS[tier]
  const price = billing === 'annual' ? plan.annual : plan.quarterly
  const period = billing === 'annual' ? 'year' : 'quarter'

  return (
    <Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
      <Box w="100%" maw={520}>
        <StepBar step={1} />

        <Stack gap="xs" mb="xl" ta="center">
          <Title order={2} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800 }}>Choose your membership</Title>
          <Text size="sm" c="dimmed">All plans include a LagosApps wallet and access to all 6 service categories.</Text>
        </Stack>

        {/* Billing toggle */}
        <Card withBorder radius="xl" p="md" mb="lg">
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm" style={{ letterSpacing: 1 }}>Billing period</Text>
          <SegmentedControl fullWidth value={billing} onChange={v => setBilling(v as Billing)}
            data={[{ label: 'Annual (save up to 25%)', value: 'annual' }, { label: 'Quarterly', value: 'quarterly' }]}
            radius="xl"
            styles={{ root: { background: '#EDF3EE', border: '1px solid #D8E6DA' }, indicator: { background: 'white' } }}
          />
        </Card>

        {/* Tier selector */}
        <Stack gap="sm" mb="lg">
          {TIERS.map(t => {
            const p = PLANS[t]
            const px = billing === 'annual' ? p.annual : p.quarterly
            const selected = tier === t
            return (
              <Card key={t} withBorder radius="xl" p="lg"
                onClick={() => setTier(t)}
                style={{ cursor: 'pointer', borderColor: selected ? p.color : '#D8E6DA', borderWidth: selected ? 2 : 1, background: selected ? p.colorPale : 'white', transition: 'all 150ms' }}>
                <Group justify="space-between" mb={selected ? 'md' : 0}>
                  <Group gap="sm">
                    <Text size="xl">{p.icon}</Text>
                    <Box>
                      <Group gap="xs">
                        <Text fw={700} style={{ color: p.color }}>{p.name}</Text>
                        {t === 'silver' && <Badge size="xs" color="teal" radius="xl">Most Popular</Badge>}
                      </Group>
                      <Text size="sm" c="dimmed">₦{px.toLocaleString()} / {period}</Text>
                    </Box>
                  </Group>
                  <Box style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? p.color : '#D8E6DA'}`, background: selected ? p.color : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selected && <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                  </Box>
                </Group>
                {selected && (
                  <List size="sm" spacing="xs" c="dimmed"
                    icon={<ThemeIcon size={16} radius="xl" style={{ background: p.color }}><span style={{ fontSize: 10, color: 'white' }}>✓</span></ThemeIcon>}>
                    {p.features.map(f => <List.Item key={f}>{f}</List.Item>)}
                  </List>
                )}
              </Card>
            )
          })}
        </Stack>

        {/* Price summary */}
        <Card withBorder radius="xl" p="md" mb="lg" style={{ background: '#EDF3EE' }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{plan.name} — {billing === 'annual' ? 'Annual' : 'Quarterly'}</Text>
            <Text fw={700}>₦{price.toLocaleString()}</Text>
          </Group>
          {billing === 'annual' && (
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Annual saving vs quarterly</Text>
              <Text size="xs" c="#1A6B3C" fw={700}>–₦{plan.savings.toLocaleString()}</Text>
            </Group>
          )}
          <Divider my="sm" color="#D8E6DA" />
          <Group justify="space-between">
            <Text fw={700} style={{ fontFamily: 'var(--font-montserrat)' }}>Total today</Text>
            <Text fw={800} style={{ fontFamily: 'var(--font-montserrat)', color: '#1A6B3C', fontSize: 20 }}>₦{price.toLocaleString()}</Text>
          </Group>
        </Card>

        <Button fullWidth radius="xl" size="lg" fw={700}
          style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' }}
          onClick={() => router.push(`/auth?tier=${tier}&billing=${billing}`)}>
          Continue with {plan.name} →
        </Button>
        <Text ta="center" size="xs" c="dimmed" mt="sm">
          You can cancel or change your plan anytime from your dashboard.
        </Text>
      </Box>
    </Box>
  )
}

export default function PlanPage() {
  return (
    <>
      <Header2 />
      <Suspense fallback={<Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5' }} />}>
        <PlanPageInner />
      </Suspense>
    </>
  )
}
