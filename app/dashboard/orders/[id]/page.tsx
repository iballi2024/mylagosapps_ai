'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Box, Title, Text, Card, Group, Stack, Badge, Button, Divider, Anchor, Skeleton } from '@mantine/core'
import { apiGetOrder, ApiOrder, API_STATUS_STEPS, apiStatusIndex } from '@/lib/orders'

const ORDER_STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'Pending',    bg: '#E7F5FF', color: '#1971C2' },
  confirmed:  { label: 'Confirmed',  bg: '#FFF3BF', color: '#E67700' },
  processing: { label: 'Processing', bg: '#FFF0F6', color: '#C2255C' },
  completed:  { label: 'Completed',  bg: '#EBFBEE', color: '#2F9E44' },
  cancelled:  { label: 'Cancelled',  bg: '#FFF5F5', color: '#C92A2A' },
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  paid:     { label: 'Paid ✓',   color: '#2F9E44' },
  pending:  { label: 'Pending',  color: '#E67700' },
  failed:   { label: 'Failed',   color: '#C2255C' },
  refunded: { label: 'Refunded', color: '#1971C2' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatAmount(amount: number, currency = 'NGN') {
  if (currency === 'NGN') return `₦${amount.toLocaleString()}`
  return `${currency} ${amount.toLocaleString()}`
}

function MetaTable({ meta }: { meta: Record<string, string | number | null> }) {
  const LABELS: Record<string, string> = {
    vehicle_type:    'Vehicle type',
    pickup_area:     'Pickup area',
    pickup_address:  'Pickup address',
    dropoff_area:    'Drop-off area',
    dropoff_address: 'Drop-off address',
    ride_date:       'Date',
    ride_time:       'Time',
    note:            'Note',
    restaurant:      'Restaurant',
    delivery_area:   'Delivery area',
    package_type:    'Package type',
    recipient:       'Recipient',
    recipient_phone: 'Recipient phone',
    flight_number:   'Flight number',
    airport:         'Airport',
    direction:       'Transfer direction',
  }

  const entries = Object.entries(meta).filter(([, v]) => v !== null && v !== '')
  if (entries.length === 0) return null

  return (
    <Stack gap="xs">
      {entries.map(([key, val]) => (
        <Group key={key} justify="space-between" align="flex-start" wrap="nowrap">
          <Text fz="sm" c="var(--color-muted)" style={{ flexShrink: 0 }}>{LABELS[key] ?? key.replace(/_/g, ' ')}</Text>
          <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{String(val)}</Text>
        </Group>
      ))}
    </Stack>
  )
}

function OrderDetailSkeleton() {
  return (
    <Box p={{ base: 'md', md: 'xl' }} maw={560}>
      <Skeleton height={14} width={100} mb="lg" />
      <Skeleton height={28} width="60%" mb={6} />
      <Skeleton height={12} width="40%" mb="xl" />
      <Skeleton height={160} radius="xl" mb="md" />
      <Skeleton height={120} radius="xl" mb="md" />
      <Skeleton height={140} radius="xl" mb="xl" />
      <Group grow><Skeleton height={40} radius="xl" /><Skeleton height={40} radius="xl" /></Group>
    </Box>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGetOrder(id)
      .then(setOrder)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load order'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <OrderDetailSkeleton />

  if (error || !order) {
    return (
      <Box p={{ base: 'md', md: 'xl' }} maw={560}>
        <Anchor component={Link} href="/dashboard/orders" fz="sm" c="var(--color-muted)" mb="lg" display="block">← All orders</Anchor>
        <Card radius="xl" withBorder p="xl" style={{ textAlign: 'center', borderColor: 'var(--color-border)' }}>
          <Text fz="3xl" mb="md">🔍</Text>
          <Text fw={700} fz="md" c="var(--color-ink)" mb={4}>Order not found</Text>
          <Text fz="sm" c="var(--color-muted)" mb="lg">{error ?? 'This order may not exist or has been removed.'}</Text>
          <Button component={Link} href="/dashboard/orders" radius="xl" variant="default">Back to orders</Button>
        </Card>
      </Box>
    )
  }

  const orderStatus = ORDER_STATUS_MAP[order.order_status] ?? ORDER_STATUS_MAP.pending
  const paymentStatus = PAYMENT_STATUS_MAP[order.payment_status] ?? PAYMENT_STATUS_MAP.pending

  const currentIdx = apiStatusIndex(order.order_status)
  const isCancelled = order.order_status === 'cancelled'

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={560}>
      <Anchor component={Link} href="/dashboard/orders" fz="sm" c="var(--color-muted)" mb="lg" display="block">← All orders</Anchor>

      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 20, md: 24 }} c="var(--color-ink)">
            {order.service_title}
          </Title>
          <Text fz="sm" c="var(--color-muted)">{order.order_reference} · {formatDate(order.created_at)}</Text>
          {order.service_description && (
            <Text fz="xs" c="var(--color-muted)" mt={2}>{order.service_description}</Text>
          )}
        </Box>
        <Badge size="lg" radius="xl" style={{ background: orderStatus.bg, color: orderStatus.color }}>
          {orderStatus.label}
        </Badge>
      </Group>

      {/* Status timeline */}
      <Card radius="xl" withBorder p="lg" mb="md" style={{ borderColor: 'var(--color-border)' }}>
        <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">Order status</Text>
        {isCancelled && (
          <Text fz="sm" c="#C92A2A" mb="md">This order was cancelled.</Text>
        )}
        <Stack gap={0}>
          {API_STATUS_STEPS.map((step, i) => {
            const done = !isCancelled && i <= currentIdx
            const active = !isCancelled && i === currentIdx
            const isLast = i === API_STATUS_STEPS.length - 1
            return (
              <Group key={step.status} gap={0} align="stretch" wrap="nowrap">
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                  <Box style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: done ? '#2F9E44' : 'var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                  }}>
                    {done
                      ? <Text fz="xs">{step.icon}</Text>
                      : <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mantine-color-gray-4)' }} />
                    }
                  </Box>
                  {!isLast && (
                    <Box style={{ width: 2, flex: 1, minHeight: 24, background: i < currentIdx ? '#2F9E44' : 'var(--color-border)' }} />
                  )}
                </Box>
                <Box pb={isLast ? 0 : 'md'} pl="sm" style={{ flex: 1, paddingTop: 4 }}>
                  <Text fz="sm" fw={done ? 700 : 500} c={done ? 'var(--color-ink)' : 'var(--color-muted)'}>{step.label}</Text>
                  {active && <Text fz="xs" c="var(--color-muted)" mt={2}>{step.desc}</Text>}
                </Box>
              </Group>
            )
          })}
        </Stack>
      </Card>

      {/* Order details / meta */}
      {Object.keys(order.meta ?? {}).length > 0 && (
        <Card radius="xl" withBorder p="md" mb="md" style={{ borderColor: 'var(--color-border)' }}>
          <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Order details</Text>
          <MetaTable meta={order.meta} />
        </Card>
      )}

      {/* Delivery info */}
      {order.delivery_address && (
        <Card radius="xl" withBorder p="md" mb="md" style={{ borderColor: 'var(--color-border)' }}>
          <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Delivery address</Text>
          <Group gap="sm" align="flex-start">
            <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Text fz="xs">🏠</Text>
            </Box>
            <Box>
              <Text fz="sm" fw={600} c="var(--color-ink)">{order.delivery_address}</Text>
              {(order.delivery_area || order.delivery_state) && (
                <Text fz="xs" c="var(--color-muted)">{[order.delivery_area, order.delivery_state].filter(Boolean).join(', ')}</Text>
              )}
            </Box>
          </Group>
        </Card>
      )}

      {/* Receipt */}
      <Card radius="xl" withBorder p="md" mb="xl" style={{ borderColor: 'var(--color-border)' }}>
        <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Receipt</Text>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fz="sm" c="var(--color-muted)">Category</Text>
            <Text fz="sm" fw={500}>{order.category}</Text>
          </Group>
          {order.discount_amount > 0 && (
            <Group justify="space-between">
              <Text fz="sm" c="var(--color-muted)">Discount</Text>
              <Text fz="sm" fw={500} c="#2F9E44">−{formatAmount(order.discount_amount, order.currency)}</Text>
            </Group>
          )}
          <Divider />
          <Group justify="space-between">
            <Text ff="var(--font-montserrat)" fw={700}>Total</Text>
            <Text ff="var(--font-montserrat)" fw={700} c="#1A6B3C">{formatAmount(order.final_amount, order.currency)}</Text>
          </Group>
          <Group justify="space-between">
            <Text fz="sm" c="var(--color-muted)">Payment</Text>
            <Text fz="sm" fw={500} c={paymentStatus.color}>{paymentStatus.label}</Text>
          </Group>
          {order.payment_method && (
            <Group justify="space-between">
              <Text fz="sm" c="var(--color-muted)">Method</Text>
              <Text fz="sm" fw={500} style={{ textTransform: 'capitalize' }}>{order.payment_method}</Text>
            </Group>
          )}
          {order.paid_at && (
            <Group justify="space-between">
              <Text fz="sm" c="var(--color-muted)">Paid at</Text>
              <Text fz="sm" fw={500}>{formatDate(order.paid_at)}</Text>
            </Group>
          )}
        </Stack>
      </Card>

      <Group grow>
        <Button component={Link} href="/services" radius="xl" size="md" variant="default">
          New order
        </Button>
        <Button component={Link} href="/dashboard/orders" radius="xl" size="md"
          style={{ background: '#1A6B3C', color: 'white', fontWeight: 700 }}>
          All orders
        </Button>
      </Group>
    </Box>
  )
}
