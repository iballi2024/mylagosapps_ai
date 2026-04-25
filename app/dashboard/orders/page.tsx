'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Title, Text, Card, Group, Stack, Badge, Button, Anchor, Skeleton } from '@mantine/core'
import { apiGetOrders, ApiOrder, ApiOrderStatus } from '@/lib/orders'

const STATUS_COLOR: Record<ApiOrderStatus, { bg: string; color: string; label: string }> = {
  pending:    { bg: '#E7F5FF', color: '#1971C2', label: 'Pending' },
  confirmed:  { bg: '#FFF3BF', color: '#E67700', label: 'Confirmed' },
  processing: { bg: '#FFF0F6', color: '#C2255C', label: 'Processing' },
  completed:  { bg: '#EBFBEE', color: '#2F9E44', label: 'Completed' },
  cancelled:  { bg: '#FFF5F5', color: '#C92A2A', label: 'Cancelled' },
}

const STATUS_PROGRESS: Record<ApiOrderStatus, number> = {
  pending:    20,
  confirmed:  50,
  processing: 75,
  completed:  100,
  cancelled:  0,
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const diffMins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatAmount(amount: number, currency = 'NGN') {
  return currency === 'NGN' ? `₦${amount.toLocaleString()}` : `${currency} ${amount.toLocaleString()}`
}

function OrderSkeleton() {
  return (
    <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <Skeleton height={14} width="50%" mb={6} />
          <Skeleton height={11} width="70%" />
        </Box>
        <Box style={{ textAlign: 'right' }}>
          <Skeleton height={14} width={60} mb={6} />
          <Skeleton height={11} width={40} />
        </Box>
      </Group>
      <Skeleton height={4} radius="xl" mt="xs" />
    </Card>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    apiGetOrders(1)
      .then(res => { setOrders(res.orders); setPages(res.pages) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  function loadMore() {
    const next = page + 1
    setLoadingMore(true)
    apiGetOrders(next)
      .then(res => { setOrders(prev => [...prev, ...res.orders]); setPage(next); setPages(res.pages) })
      .catch(() => {/* silently ignore pagination errors */})
      .finally(() => setLoadingMore(false))
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={720}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">My Orders</Title>
        <Text fz="sm" c="var(--color-muted)">View and manage your delivery orders</Text>
      </Stack>

      {/* Initial load skeletons */}
      {loading && (
        <Stack gap="sm">
          {Array.from({ length: 4 }).map((_, i) => <OrderSkeleton key={i} />)}
        </Stack>
      )}

      {/* Error */}
      {!loading && error && (
        <Card radius="xl" withBorder p="xl" style={{ borderColor: 'var(--color-border)', textAlign: 'center' }}>
          <Text fz="2xl" mb="md">⚠️</Text>
          <Text fw={700} fz="md" c="var(--color-ink)" mb={4}>Could not load orders</Text>
          <Text fz="sm" c="var(--color-muted)">{error}</Text>
        </Card>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <Card radius="xl" withBorder p="xl" style={{ borderColor: 'var(--color-border)', textAlign: 'center' }}>
          <Text fz="3xl" mb="md">📦</Text>
          <Text fw={700} fz="md" c="var(--color-ink)" mb={4}>No orders yet</Text>
          <Text fz="sm" c="var(--color-muted)">Place your first order to see it here</Text>
        </Card>
      )}

      {/* List */}
      {orders.length > 0 && (
        <Stack gap="sm">
          {orders.map(order => {
            const sc = STATUS_COLOR[order.order_status] ?? STATUS_COLOR.pending
            const progress = STATUS_PROGRESS[order.order_status] ?? 0

            return (
              <Card key={order.id} radius="xl" withBorder p="md"
                component={Link} href={`/dashboard/orders/${order.order_reference}`}
                style={{ borderColor: 'var(--color-border)', textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
                <Group justify="space-between" mb="xs" wrap="nowrap">
                  <Box style={{ minWidth: 0 }}>
                    <Group gap="xs" mb={2} wrap="nowrap">
                      <Text fw={700} fz="sm" c="var(--color-ink)"
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.service_title}
                      </Text>
                      <Badge size="xs" radius="sm" style={{ background: sc.bg, color: sc.color, flexShrink: 0 }}>
                        {sc.label}
                      </Badge>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)">
                      {[order.delivery_address, order.delivery_area].filter(Boolean).join(', ')}
                    </Text>
                  </Box>
                  <Box style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Text fw={700} fz="sm" c="var(--color-ink)">{formatAmount(order.final_amount, order.currency)}</Text>
                    <Text fz="xs" c="var(--color-muted)">{formatDate(order.created_at)}</Text>
                  </Box>
                </Group>

                <Box mt="xs">
                  <Box style={{ height: 4, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                    <Box style={{
                      height: '100%', width: `${progress}%`,
                      background: order.order_status === 'completed' ? '#2F9E44'
                        : order.order_status === 'cancelled' ? '#C92A2A' : '#1A6B3C',
                      borderRadius: 4,
                    }} />
                  </Box>
                  <Group justify="space-between" mt={4}>
                    <Text fz={10} c="var(--color-muted)">{order.order_reference}</Text>
                    <Anchor fz={10} fw={600} c="#1A6B3C" component={Link}
                      href={`/dashboard/orders/${order.order_reference}`}>
                      View details →
                    </Anchor>
                  </Group>
                </Box>
              </Card>
            )
          })}

          {page < pages && (
            <Button radius="xl" variant="outline" fullWidth
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
              loading={loadingMore}
              onClick={loadMore}>
              Load more
            </Button>
          )}

          {loadingMore && (
            <Stack gap="sm">
              <OrderSkeleton />
              <OrderSkeleton />
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  )
}
