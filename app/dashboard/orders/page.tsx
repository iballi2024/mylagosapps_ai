'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Title, Text, Card, Group, Stack, Badge, Button, Anchor } from '@mantine/core'
import { getOrders, DeliveryOrder, STATUS_STEPS, statusIndex } from '@/lib/orders'

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  placed:    { bg: '#E7F5FF', color: '#1971C2' },
  assigned:  { bg: '#FFF3BF', color: '#E67700' },
  pickup:    { bg: '#FFF0F6', color: '#C2255C' },
  on_way:    { bg: '#FFF3BF', color: '#E67700' },
  delivered: { bg: '#EBFBEE', color: '#2F9E44' },
}

function statusLabel(status: string) {
  return STATUS_STEPS.find(s => s.status === status)?.label ?? status
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={720}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">My Orders</Title>
        <Text fz="sm" c="var(--color-muted)">Track and manage your delivery orders</Text>
      </Stack>

      {orders.length === 0 ? (
        <Card radius="xl" withBorder p="xl" style={{ borderColor: 'var(--color-border)', textAlign: 'center' }}>
          <Text fz="3xl" mb="md">📦</Text>
          <Text fw={700} fz="md" c="var(--color-ink)" mb={4}>No orders yet</Text>
          <Text fz="sm" c="var(--color-muted)" mb="lg">Place your first food or delivery order to see it here</Text>
          <Button component={Link} href="/services/food" radius="xl" size="md"
            style={{ background: '#1A6B3C', color: 'white', fontWeight: 700 }}>
            Order food now →
          </Button>
        </Card>
      ) : (
        <Stack gap="sm">
          {orders.map(order => {
            const sc = STATUS_COLOR[order.status] ?? STATUS_COLOR.placed
            const idx = statusIndex(order.status as any)
            const total = STATUS_STEPS.length - 1
            const progress = Math.round((idx / total) * 100)

            return (
              <Card key={order.id} radius="xl" withBorder p="md"
                style={{ borderColor: 'var(--color-border)' }}
                component={Link} href={`/dashboard/orders/${order.id}`}
                style={{ borderColor: 'var(--color-border)', textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
                <Group justify="space-between" mb="xs" wrap="nowrap">
                  <Box style={{ minWidth: 0 }}>
                    <Group gap="xs" mb={2}>
                      <Text fw={700} fz="sm" c="var(--color-ink)" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.restaurant ?? order.serviceName}
                      </Text>
                      <Badge size="xs" radius="sm" style={{ background: sc.bg, color: sc.color, flexShrink: 0 }}>
                        {statusLabel(order.status)}
                      </Badge>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)">
                      📍 {order.deliveryAddress}, {order.deliveryArea}
                    </Text>
                  </Box>
                  <Box style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Text fw={700} fz="sm" c="var(--color-ink)">₦{order.total.toLocaleString()}</Text>
                    <Text fz="xs" c="var(--color-muted)">{formatDate(order.createdAt)}</Text>
                  </Box>
                </Group>

                {/* Progress bar */}
                <Box mt="xs">
                  <Box style={{ height: 4, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                    <Box style={{
                      height: '100%', width: `${progress}%`,
                      background: order.status === 'delivered' ? '#2F9E44' : '#1A6B3C',
                      borderRadius: 4, transition: 'width 0.3s',
                    }} />
                  </Box>
                  <Group justify="space-between" mt={4}>
                    <Text fz={10} c="var(--color-muted)">Order #{order.id}</Text>
                    <Anchor fz={10} fw={600} c="#1A6B3C" component={Link} href={`/dashboard/orders/${order.id}`}>
                      View details →
                    </Anchor>
                  </Group>
                </Box>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
