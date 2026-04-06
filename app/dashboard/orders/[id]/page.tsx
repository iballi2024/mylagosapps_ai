'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Box, Title, Text, Card, Group, Stack, Badge, Button, Divider, Anchor } from '@mantine/core'
import { getOrder, updateOrderStatus, DeliveryOrder, STATUS_STEPS, statusIndex, OrderStatus } from '@/lib/orders'

// In production this would be driven by real-time backend events.
// Here we simulate automatic progression for demo purposes.
const PROGRESSION_DELAYS: Partial<Record<OrderStatus, number>> = {
  placed:   8000,   // → assigned after 8s
  assigned: 12000,  // → pickup after 12s
  pickup:   15000,  // → on_way after 15s
  on_way:   20000,  // → delivered after 20s
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed:   'assigned',
  assigned: 'pickup',
  pickup:   'on_way',
  on_way:   'delivered',
}

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  placed:    { bg: '#E7F5FF', color: '#1971C2' },
  assigned:  { bg: '#FFF3BF', color: '#E67700' },
  pickup:    { bg: '#FFF0F6', color: '#C2255C' },
  on_way:    { bg: '#FFF3BF', color: '#E67700' },
  delivered: { bg: '#EBFBEE', color: '#2F9E44' },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function getZoneLabel(zone: string) {
  const map: Record<string, string> = {
    A: 'Lagos Island', B: 'Lekki', C: 'Ajah / Sangotedo',
    D: 'Surulere / Yaba', E: 'Ikeja / GRA', F: 'Mushin / Oshodi', G: 'Ikorodu / Outer',
  }
  return map[zone] ?? zone
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<DeliveryOrder | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Load order
  useEffect(() => {
    const o = getOrder(id)
    if (!o) { setNotFound(true); return }
    setOrder(o)
  }, [id])

  // Auto-progress status (demo simulation)
  useEffect(() => {
    if (!order || order.status === 'delivered') return
    const delay = PROGRESSION_DELAYS[order.status]
    if (!delay) return
    const timer = setTimeout(() => {
      const next = NEXT_STATUS[order.status]
      if (!next) return
      updateOrderStatus(id, next)
      setOrder(prev => prev ? { ...prev, status: next } : prev)
    }, delay)
    return () => clearTimeout(timer)
  }, [order?.status, id])

  if (notFound) {
    return (
      <Box p={{ base: 'md', md: 'xl' }} maw={560}>
        <Anchor component={Link} href="/dashboard/orders" fz="sm" c="var(--color-muted)" mb="lg" display="block">← All orders</Anchor>
        <Card radius="xl" withBorder p="xl" style={{ textAlign: 'center', borderColor: 'var(--color-border)' }}>
          <Text fz="3xl" mb="md">🔍</Text>
          <Text fw={700} fz="md" c="var(--color-ink)" mb={4}>Order not found</Text>
          <Text fz="sm" c="var(--color-muted)" mb="lg">This order may not exist or has been removed.</Text>
          <Button component={Link} href="/dashboard/orders" radius="xl" variant="default">Back to orders</Button>
        </Card>
      </Box>
    )
  }

  if (!order) return null

  const currentIdx = statusIndex(order.status)
  const sc = STATUS_BADGE[order.status] ?? STATUS_BADGE.placed

  const etaLabel = (() => {
    if (order.status === 'delivered') return 'Delivered'
    const stepsRemaining = STATUS_STEPS.length - 1 - currentIdx
    const minsLeft = stepsRemaining * (order.estimatedMinutes / (STATUS_STEPS.length - 1))
    return `~${Math.max(5, Math.round(minsLeft))} min remaining`
  })()

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={560}>
      <Anchor component={Link} href="/dashboard/orders" fz="sm" c="var(--color-muted)" mb="lg" display="block">← All orders</Anchor>

      <Group justify="space-between" align="flex-start" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 20, md: 24 }} c="var(--color-ink)">
            {order.restaurant ?? order.serviceName}
          </Title>
          <Text fz="sm" c="var(--color-muted)">Order #{order.id} · {formatTime(order.createdAt)}</Text>
        </Box>
        <Badge size="lg" radius="xl" style={{ background: sc.bg, color: sc.color }}>
          {STATUS_STEPS.find(s => s.status === order.status)?.label}
        </Badge>
      </Group>

      {/* ── Live status timeline ── */}
      <Card radius="xl" withBorder p="lg" mb="md" style={{ borderColor: 'var(--color-border)' }}>
        <Group justify="space-between" mb="md">
          <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)">Live tracking</Text>
          <Text fz="xs" fw={600} c={order.status === 'delivered' ? '#2F9E44' : '#E67700'}>{etaLabel}</Text>
        </Group>

        <Stack gap={0}>
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentIdx
            const active = i === currentIdx
            const isLast = i === STATUS_STEPS.length - 1

            return (
              <Group key={step.status} gap={0} align="stretch" wrap="nowrap">
                {/* Left: icon + connector */}
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                  <Box style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: done ? (active && order.status !== 'delivered' ? '#1A6B3C' : '#2F9E44') : 'var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15,
                    boxShadow: active ? '0 0 0 4px #1A6B3C20' : 'none',
                    transition: 'background 0.4s',
                  }}>
                    {done ? (
                      <Text fz="xs" style={{ filter: 'grayscale(0)' }}>{step.icon}</Text>
                    ) : (
                      <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mantine-color-gray-4)' }} />
                    )}
                  </Box>
                  {!isLast && (
                    <Box style={{
                      width: 2, flex: 1, minHeight: 24,
                      background: i < currentIdx ? '#2F9E44' : 'var(--color-border)',
                      transition: 'background 0.4s',
                    }} />
                  )}
                </Box>

                {/* Right: text */}
                <Box pb={isLast ? 0 : 'md'} pl="sm" style={{ flex: 1, paddingTop: 4 }}>
                  <Text fz="sm" fw={done ? 700 : 500} c={done ? 'var(--color-ink)' : 'var(--color-muted)'}>
                    {step.label}
                  </Text>
                  {active && (
                    <Text fz="xs" c="var(--color-muted)" mt={2}>{step.desc}</Text>
                  )}
                  {active && order.status !== 'delivered' && (
                    <Group gap={4} mt={4}>
                      <Box style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A6B3C', animation: 'pulse 1.4s ease-in-out infinite' }} />
                      <Text fz={10} c="#1A6B3C" fw={600}>In progress</Text>
                    </Group>
                  )}
                </Box>
              </Group>
            )
          })}
        </Stack>
      </Card>

      {/* ── Delivery route ── */}
      <Card radius="xl" withBorder p="md" mb="md" style={{ borderColor: 'var(--color-border)' }}>
        <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Delivery route</Text>
        <Stack gap="xs">
          <Group gap="sm" align="flex-start">
            <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Text fz="xs">📍</Text>
            </Box>
            <Box>
              <Text fz="xs" c="var(--color-muted)">Pickup from</Text>
              <Text fz="sm" fw={600} c="var(--color-ink)">{order.restaurant ?? 'Central Kitchen'}</Text>
              <Text fz="xs" c="var(--color-muted)">{order.restaurantArea ?? 'Surulere'} · {getZoneLabel(order.pickupZone)}</Text>
            </Box>
          </Group>
          <Box style={{ width: 1, height: 16, background: 'var(--color-border)', marginLeft: 13 }} />
          <Group gap="sm" align="flex-start">
            <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Text fz="xs">🏠</Text>
            </Box>
            <Box>
              <Text fz="xs" c="var(--color-muted)">Deliver to</Text>
              <Text fz="sm" fw={600} c="var(--color-ink)">{order.deliveryAddress}</Text>
              <Text fz="xs" c="var(--color-muted)">{order.deliveryArea} · {getZoneLabel(order.deliveryZone)}</Text>
            </Box>
          </Group>
        </Stack>
      </Card>

      {/* ── Receipt ── */}
      <Card radius="xl" withBorder p="md" mb="xl" style={{ borderColor: 'var(--color-border)' }}>
        <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Receipt</Text>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fz="sm" c="var(--color-muted)">Service</Text>
            <Text fz="sm" fw={500}>{order.serviceName}</Text>
          </Group>
          <Group justify="space-between">
            <Text fz="sm" c="var(--color-muted)">Delivery fee</Text>
            <Text fz="sm" fw={500}>₦{order.deliveryFee.toLocaleString()}</Text>
          </Group>
          {order.note && (
            <Group justify="space-between" align="flex-start">
              <Text fz="sm" c="var(--color-muted)">Note</Text>
              <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 220 }}>{order.note}</Text>
            </Group>
          )}
          <Divider />
          <Group justify="space-between">
            <Text ff="var(--font-montserrat)" fw={700}>Total paid</Text>
            <Text ff="var(--font-montserrat)" fw={700} c="#1A6B3C">₦{order.total.toLocaleString()}</Text>
          </Group>
          <Group justify="space-between">
            <Text fz="sm" c="var(--color-muted)">Payment</Text>
            <Text fz="sm" fw={500} c="#2F9E44">Wallet ✓</Text>
          </Group>
        </Stack>
      </Card>

      <Group grow>
        <Button component={Link} href="/services/food" radius="xl" size="md" variant="default">
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
