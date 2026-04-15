'use client'
import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box, Stack, Group, Text, Title, Badge, Card, Divider,
  Button, Skeleton, ThemeIcon,
} from '@mantine/core'
import Navbar from '@/components/Navbar'
import { apiGetSubscriptionById, type SubscriptionDetail } from '@/lib/billing'

const TIER_META: Record<string, { icon: string; color: string; colorPale: string }> = {
  bronze: { icon: '🥉', color: '#6B7C2A', colorPale: '#F2F5E4' },
  silver: { icon: '🥈', color: '#3D6B5E', colorPale: '#E6F2EE' },
  gold:   { icon: '🥇', color: '#1A6B3C', colorPale: '#E8F5EE' },
}

const STATUS_COLOR: Record<string, string> = {
  active: 'teal',
  expired: 'gray',
  cancelled: 'red',
  pending: 'yellow',
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtAmount(amount: string | number) {
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Group justify="space-between" py={10} style={{ borderBottom: '1px solid #EDF3EE' }}>
      <Text size="sm" c="dimmed">{label}</Text>
      <Text size="sm" fw={600} ff={mono ? 'monospace' : undefined} style={{ wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>
        {value}
      </Text>
    </Group>
  )
}

function SubscriptionDetailInner() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [sub, setSub] = useState<SubscriptionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    apiGetSubscriptionById(id)
      .then(data => {
        if (!data) setError('Subscription not found.')
        else setSub(data)
      })
      .catch(e => setError(e?.message ?? 'Failed to load subscription.'))
      .finally(() => setLoading(false))
  }, [id])

  const slug = sub?.planSlug ?? (sub?.planName?.toLowerCase().split(' ')[0] ?? 'silver')
  const meta = TIER_META[slug] ?? TIER_META.silver

  const daysLeft = sub
    ? Math.max(0, Math.ceil((new Date(sub.expiryDate).getTime() - Date.now()) / 86_400_000))
    : 0

  return (
    <Box pt={72} pb={48} px="md" style={{ minHeight: '100vh', background: '#F5F8F5' }}>
      <Box maw={560} mx="auto">

        {/* Back */}
        <Button
          variant="subtle" color="gray" size="xs" mb="lg" pl={0}
          leftSection={<span style={{ fontSize: 14 }}>←</span>}
          onClick={() => router.back()}
        >
          Back
        </Button>

        {loading ? (
          <Stack gap="sm">
            <Skeleton height={32} width={200} radius="md" />
            <Skeleton height={16} width={120} radius="md" />
            <Skeleton height={240} radius="xl" mt="md" />
            <Skeleton height={180} radius="xl" />
          </Stack>
        ) : error ? (
          <Card withBorder radius="xl" p="xl" ta="center">
            <Text c="red" mb="md">{error}</Text>
            <Button component={Link} href="/dashboard" radius="xl" variant="light">
              Go to dashboard
            </Button>
          </Card>
        ) : sub && (
          <Stack gap="md">

            {/* Header card */}
            <Card withBorder radius="xl" p="lg" style={{ background: meta.colorPale, borderColor: `${meta.color}30` }}>
              <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                  <Box style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 24,
                    border: `1px solid ${meta.color}20`,
                  }}>
                    {meta.icon}
                  </Box>
                  <Box>
                    <Title order={3} ff="var(--font-montserrat)" fw={800} style={{ color: meta.color }}>
                      {sub.planName}
                    </Title>
                    <Text size="xs" c="dimmed" tt="capitalize">{sub.billingCycle} billing</Text>
                  </Box>
                </Group>
                <Badge
                  size="md" radius="xl"
                  color={STATUS_COLOR[sub.status] ?? 'gray'}
                  tt="capitalize"
                >
                  {sub.status}
                </Badge>
              </Group>

              {sub.status === 'active' && (
                <Box mt="md" style={{
                  background: 'white', borderRadius: 12, padding: '12px 16px',
                  border: `1px solid ${meta.color}20`,
                }}>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Days remaining</Text>
                    <Text size="sm" fw={700} style={{ color: meta.color }}>{daysLeft} days</Text>
                  </Group>
                  <Box mt={8} style={{ height: 6, borderRadius: 99, background: '#D8E6DA', overflow: 'hidden' }}>
                    <Box style={{
                      height: '100%', borderRadius: 99,
                      background: meta.color,
                      width: `${Math.min(100, (daysLeft / 30) * 100)}%`,
                      transition: 'width 0.6s',
                    }} />
                  </Box>
                </Box>
              )}
            </Card>

            {/* Details card */}
            <Card withBorder radius="xl" p="lg">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm" style={{ letterSpacing: 1 }}>
                Subscription details
              </Text>
              <DetailRow label="Subscription ID" value={`#${sub.id}`} />
              <DetailRow label="Reference" value={sub.reference} mono />
              <DetailRow label="Amount" value={fmtAmount(sub.amount)} />
              <DetailRow label="Payment status" value={
                <Badge size="sm" radius="xl" color={sub.paymentStatus === 'paid' ? 'teal' : 'red'} tt="capitalize">
                  {sub.paymentStatus}
                </Badge>
              } />
              <DetailRow label="Billing cycle" value={sub.billingCycle} />
              {sub.couponCode && <DetailRow label="Coupon applied" value={sub.couponCode} mono />}
              <DetailRow label="Start date" value={fmt(sub.startDate)} />
              <DetailRow label="Expiry date" value={fmt(sub.expiryDate)} />
              <DetailRow label="Created" value={fmt(sub.createdAt)} />
            </Card>

            {/* Quick actions */}
            <Card withBorder radius="xl" p="lg">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md" style={{ letterSpacing: 1 }}>
                Actions
              </Text>
              <Stack gap="sm">
                <Button
                  component={Link}
                  href="/subscribe/plan"
                  variant="light"
                  color="teal"
                  radius="xl"
                  fullWidth
                  leftSection={<ThemeIcon size={18} radius="xl" color="teal" variant="light"><span style={{ fontSize: 11 }}>↑</span></ThemeIcon>}
                >
                  Upgrade / change plan
                </Button>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="default"
                  radius="xl"
                  fullWidth
                >
                  Back to dashboard
                </Button>
              </Stack>
            </Card>

          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default function SubscriptionDetailPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Box pt={72} style={{ minHeight: '100vh', background: '#F5F8F5' }} />}>
        <SubscriptionDetailInner />
      </Suspense>
    </>
  )
}
