'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Title, Text, Card, Group, Badge, Stack, Button, Skeleton, Textarea } from '@mantine/core'
import { apiGetSubscriptionHistory, apiCancelPlan, SubscriptionHistoryItem } from '@/lib/billing'
import { useCurrentSubscription } from '@/context/CurrentSubscriptionContext'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BillingPage() {
  const { subscription, loading: planLoading, refetch } = useCurrentSubscription()
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  function handleCancelPlan() {
    setCancelling(true)
    apiCancelPlan(cancelReason.trim() || 'No longer needed')
      .then(() => { setCancelConfirm(false); setCancelReason(''); refetch() })
      .catch(() => {})
      .finally(() => setCancelling(false))
  }

  const [history, setHistory] = useState<SubscriptionHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyPage, setHistoryPage] = useState(1)
  const [historyPages, setHistoryPages] = useState(1)
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false)

  useEffect(() => {
    apiGetSubscriptionHistory(1)
      .then(res => { setHistory(res.history); setHistoryPages(res.pages) })
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  function loadMoreHistory() {
    const next = historyPage + 1
    setHistoryLoadingMore(true)
    apiGetSubscriptionHistory(next)
      .then(res => { setHistory(prev => [...prev, ...res.history]); setHistoryPage(next); setHistoryPages(res.pages) })
      .finally(() => setHistoryLoadingMore(false))
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={800}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Billing</Title>
        <Text fz="sm" c="var(--color-muted)">Manage your membership plan and payment details</Text>
      </Stack>

      {/* Current plan */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
        {planLoading ? (
          <Group justify="space-between" wrap="wrap">
            <Box>
              <Skeleton height={10} width={90} radius="sm" mb={10} />
              <Skeleton height={28} width={200} radius="md" mb={8} />
              <Skeleton height={12} width={240} radius="sm" />
            </Box>
            <Skeleton height={32} width={100} radius="xl" />
          </Group>
        ) : subscription ? (
          <Stack gap="md">
            <Group justify="space-between" wrap="wrap" gap="md">
              <Box>
                <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={6}>Current Plan</Text>
                <Group gap="sm" align="center" wrap="wrap">
                  <Text ff="var(--font-montserrat)" fw={800} fz={22} c="var(--color-ink)">{subscription.planName}</Text>
                  <Badge size="sm" radius="xl" variant="light"
                    color={subscription.status === 'active' ? 'green' : subscription.status === 'cancelled' ? 'red' : 'yellow'}
                    style={{ textTransform: 'capitalize' }}>
                    {subscription.status}
                  </Badge>
                </Group>
                <Text fz="sm" c="var(--color-muted)" mt={4}>
                  Expires {formatDate(subscription.expiryDate)}
                </Text>
              </Box>
              <Group gap="xs">
                <Button component={Link} href="/subscribe/plan" size="xs" radius="xl"
                  style={{ background: 'var(--color-ink)', color: 'white' }}>
                  Change Plan
                </Button>
                {subscription.status === 'active' && (
                  <Button size="xs" radius="xl" variant="subtle" color="red"
                    onClick={() => setCancelConfirm(v => !v)}>
                    Cancel plan
                  </Button>
                )}
              </Group>
            </Group>

            {cancelConfirm && (
              <Box p="md" style={{ background: '#fff5f5', borderRadius: 14, border: '1px solid #ffc9c9' }}>
                <Text fz="sm" fw={600} c="red.7" mb={4}>Cancel your plan?</Text>
                <Text fz="xs" c="var(--color-muted)" mb="md">
                  Your plan will remain active until {formatDate(subscription.expiryDate)}. You won&apos;t be charged again after cancellation.
                </Text>
                <Textarea
                  placeholder="Tell us why you're cancelling (optional)"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.currentTarget.value)}
                  radius="lg"
                  minRows={2}
                  autosize
                  mb="md"
                  styles={{ input: { fontSize: 13 } }}
                />
                <Group gap="xs">
                  <Button size="xs" radius="xl" color="red" loading={cancelling} onClick={handleCancelPlan}>
                    Yes, cancel plan
                  </Button>
                  <Button size="xs" radius="xl" variant="subtle" color="gray"
                    onClick={() => { setCancelConfirm(false); setCancelReason('') }}>
                    Keep plan
                  </Button>
                </Group>
              </Box>
            )}
          </Stack>
        ) : (
          <Group justify="space-between" wrap="wrap" gap="md">
            <Box>
              <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={6}>Current Plan</Text>
              <Text ff="var(--font-montserrat)" fw={700} fz={18} c="var(--color-ink)">No active plan</Text>
              <Text fz="sm" c="var(--color-muted)" mt={4}>Subscribe to unlock all LagosApps services.</Text>
            </Box>
            <Button component={Link} href="/subscribe/plan" size="xs" radius="xl"
              style={{ background: 'linear-gradient(135deg, #2E9E5B, #1A6B3C)', color: 'white' }}>
              View plans →
            </Button>
          </Group>
        )}
      </Card>

      {/* Subscription history */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
        <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Subscription History</Text>
        </Group>

        {historyLoading ? (
          <Stack gap={0} p="md">
            {[...Array(3)].map((_, i) => <Skeleton key={i} height={52} radius="xl" mb={8} />)}
          </Stack>
        ) : history.length === 0 ? (
          <Text fz="sm" c="var(--color-muted)" p="lg">No subscription history yet.</Text>
        ) : (
          <>
            <Stack gap={0}>
              {history.map(item => (
                <Group key={item.id} px="lg" py="sm" gap="sm" wrap="wrap"
                  style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <Box style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🧾</Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fz="sm" fw={500} c="var(--color-ink)">{item.planName}</Text>
                    <Text fz={10} c="var(--color-muted)">
                      {item.billingCycle} · {formatDate(item.startDate)} – {formatDate(item.expiryDate)}
                    </Text>
                  </Box>
                  <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)">
                    ₦{Number(item.amount).toLocaleString()}
                  </Text>
                  <Badge size="xs" radius="xl" variant="light"
                    color={item.paymentStatus === 'paid' ? 'green' : item.paymentStatus === 'failed' ? 'red' : 'yellow'}>
                    {item.paymentStatus}
                  </Badge>
                </Group>
              ))}
            </Stack>

            {historyPage < historyPages && (
              <Box p="md">
                <Button radius="xl" variant="outline" fullWidth
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
                  loading={historyLoadingMore}
                  onClick={loadMoreHistory}>
                  Load more
                </Button>
              </Box>
            )}
          </>
        )}
      </Card>
    </Box>
  )
}
