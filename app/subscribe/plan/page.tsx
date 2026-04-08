'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Card, Group, Button, Badge, Divider, List, ThemeIcon, SegmentedControl, Loader, Alert } from '@mantine/core'
import Header2 from '@/app/home/components/Header2'
import { apiGetPlans, type SubscriptionPlan } from '@/lib/billing'

type Billing = 'annual' | 'monthly'

const TIER_META: Record<string, { icon: string; color: string; colorPale: string; popular?: boolean }> = {
  bronze: { icon: '🥉', color: '#6B7C2A', colorPale: '#F2F5E4' },
  silver: { icon: '🥈', color: '#3D6B5E', colorPale: '#E6F2EE' },
  gold:   { icon: '🥇', color: '#1A6B3C', colorPale: '#E8F5EE', popular: true },
}

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
              {i < steps.length - 1 && <Box style={{ flex: 1, height: 2, background: '#D8E6DA' }} />}
            </Group>
            <Text size="xs" fw={active ? 700 : 400} c={active ? '#1A6B3C' : 'dimmed'}>{label}</Text>
          </Box>
        )
      })}
    </Group>
  )
}

function PlanCardSkeleton() {
  return (
    <Card withBorder radius="xl" p="lg" style={{ background: 'white' }}>
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8EEE9' }} />
          <Box>
            <Box style={{ width: 80, height: 14, borderRadius: 6, background: '#E8EEE9', marginBottom: 6 }} />
            <Box style={{ width: 110, height: 12, borderRadius: 6, background: '#F2F5F2' }} />
          </Box>
        </Group>
        <Box style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8EEE9' }} />
      </Group>
    </Card>
  )
}

function PlanPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const initSlug = params.get('slug') ?? 'silver'
  const initBilling = (params.get('billing') as Billing) ?? 'annual'

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string>(initSlug)
  const [billing, setBilling] = useState<Billing>(initBilling)

  useEffect(() => {
    apiGetPlans()
      .then(data => {
        const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder)
        setPlans(sorted)
        if (!sorted.find(p => p.slug === initSlug) && sorted.length) {
          setSelectedSlug(sorted[0].slug)
        }
      })
      .catch(e => setFetchError(e?.message ?? 'Failed to load plans. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const selected = plans.find(p => p.slug === selectedSlug) ?? null
  const price = selected
    ? billing === 'annual' ? selected.priceYearly : selected.priceMonthly
    : 0
  const monthlyCost = selected ? Math.round(selected.priceYearly / 12) : 0

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
          <SegmentedControl
            fullWidth
            value={billing}
            onChange={v => setBilling(v as Billing)}
            data={[
              { label: 'Annual (pay once a year)', value: 'annual' },
              { label: 'Monthly', value: 'monthly' },
            ]}
            radius="xl"
            styles={{ root: { background: '#EDF3EE', border: '1px solid #D8E6DA' }, indicator: { background: 'white' } }}
          />
        </Card>

        {fetchError && (
          <Alert color="red" radius="md" mb="lg">{fetchError}</Alert>
        )}

        {/* Plan cards */}
        <Stack gap="sm" mb="lg">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <PlanCardSkeleton key={i} />)
            : plans.map(plan => {
                const meta = TIER_META[plan.slug] ?? { icon: '📋', color: '#1A6B3C', colorPale: '#E8F5EE' }
                const isSelected = plan.slug === selectedSlug
                const px = billing === 'annual' ? plan.priceYearly : plan.priceMonthly
                const period = billing === 'annual' ? 'year' : 'month'

                return (
                  <Card
                    key={plan.id}
                    withBorder
                    radius="xl"
                    p="lg"
                    onClick={() => setSelectedSlug(plan.slug)}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? meta.color : '#D8E6DA',
                      borderWidth: isSelected ? 2 : 1,
                      background: isSelected ? meta.colorPale : 'white',
                      transition: 'all 150ms',
                    }}
                  >
                    <Group justify="space-between" mb={isSelected ? 'xs' : 0}>
                      <Group gap="sm">
                        <Text size="xl">{meta.icon}</Text>
                        <Box>
                          <Group gap="xs">
                            <Text fw={700} style={{ color: meta.color }}>{plan.name}</Text>
                            {meta.popular && <Badge size="xs" color="teal" radius="xl">Best Value</Badge>}
                          </Group>
                          <Text size="sm" c="dimmed">₦{Math.round(px).toLocaleString()} / {period}</Text>
                        </Box>
                      </Group>
                      <Box style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? meta.color : '#D8E6DA'}`, background: isSelected ? meta.color : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                      </Box>
                    </Group>

                    {isSelected && (
                      <>
                        <Text size="xs" c="dimmed" mt="xs" mb="sm">{plan.description}</Text>
                        <List
                          size="sm"
                          spacing="xs"
                          c="dimmed"
                          icon={
                            <ThemeIcon size={16} radius="xl" style={{ background: meta.color }}>
                              <span style={{ fontSize: 10, color: 'white' }}>✓</span>
                            </ThemeIcon>
                          }
                        >
                          {plan.benefits.map(b => <List.Item key={b.id}>{b.name}</List.Item>)}
                        </List>
                      </>
                    )}
                  </Card>
                )
              })
          }
        </Stack>

        {/* Price summary */}
        {selected && (
          <Card withBorder radius="xl" p="md" mb="lg" style={{ background: '#EDF3EE' }}>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">{selected.name} — {billing === 'annual' ? 'Annual' : 'Monthly'}</Text>
              <Text fw={700}>₦{Math.round(price).toLocaleString()}</Text>
            </Group>
            {billing === 'annual' && (
              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">Equivalent monthly rate</Text>
                <Text size="xs" c="#1A6B3C" fw={700}>₦{monthlyCost.toLocaleString()}/mo</Text>
              </Group>
            )}
            <Divider my="sm" color="#D8E6DA" />
            <Group justify="space-between">
              <Text fw={700} style={{ fontFamily: 'var(--font-montserrat)' }}>Total today</Text>
              <Text fw={800} style={{ fontFamily: 'var(--font-montserrat)', color: '#1A6B3C', fontSize: 20 }}>
                ₦{Math.round(price).toLocaleString()}
              </Text>
            </Group>
          </Card>
        )}

        <Button
          fullWidth
          radius="xl"
          size="lg"
          fw={700}
          disabled={loading || !selected}
          style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' }}
          onClick={() => selected && router.push(`/subscribe/payment?slug=${selected.slug}&planId=${selected.id}&billing=${billing}`)}
        >
          {loading ? <Loader size="xs" color="white" /> : selected ? `Continue with ${selected.name} →` : 'Select a plan'}
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
