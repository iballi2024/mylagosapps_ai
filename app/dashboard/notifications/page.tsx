'use client'
import { useState } from 'react'
import { Box, Title, Text, Card, Group, Stack, Badge, Button, ActionIcon, Skeleton, Alert } from '@mantine/core'
import { useNotifications, NotifType } from '@/context/NotificationsContext'

const TYPE_META: Record<NotifType, { label: string; color: string; bg: string; icon: string }> = {
  order:   { label: 'Order',   color: '#1A6B3C', bg: '#E8F5EE', icon: '📦' },
  system:  { label: 'System',  color: '#1565C0', bg: '#E8F4FF', icon: '⚙️' },
  promo:   { label: 'Promo',   color: '#7B3F00', bg: '#FFF3E0', icon: '🎁' },
  account: { label: 'Account', color: '#6A1B9A', bg: '#F3E5F5', icon: '👤' },
}

const FILTERS: { value: NotifType | 'all'; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'order',   label: 'Orders' },
  { value: 'account', label: 'Account' },
  { value: 'promo',   label: 'Promos' },
  { value: 'system',  label: 'System' },
]

function NotifSkeleton() {
  return (
    <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <Skeleton height={40} width={40} radius={12} />
        <Box style={{ flex: 1 }}>
          <Skeleton height={14} width="55%" mb={8} />
          <Skeleton height={11} width="90%" mb={4} />
          <Skeleton height={11} width="70%" />
        </Box>
      </Group>
    </Card>
  )
}

export default function NotificationsPage() {
  const { items, unreadCount, loading, error, hasMore, loadMore, refresh, markRead, markAllRead, dismiss } = useNotifications()
  const [filter, setFilter] = useState<NotifType | 'all'>('all')

  const filtered = filter === 'all' ? items : items.filter(n => n.type === filter)

  return (
    <Box p={{ base: 'md', sm: 'xl' }} maw={720}>
      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap" gap="sm">
        <Box>
          <Group gap="sm" align="center" mb={2}>
            <Title order={2} ff="var(--font-montserrat)" fw={800} fz={22} c="var(--color-ink)">Notifications</Title>
            {unreadCount > 0 && (
              <Badge size="sm" radius="xl" style={{ background: '#E03131', color: 'white' }}>{unreadCount} new</Badge>
            )}
          </Group>
          <Text fz="sm" c="var(--color-muted)">Updates on your orders, account, and services</Text>
        </Box>
        <Group gap="xs">
          {unreadCount > 0 && (
            <Button size="xs" radius="xl" variant="outline"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
              onClick={markAllRead}>
              Mark all as read
            </Button>
          )}
          <Button size="xs" radius="xl" variant="subtle"
            style={{ color: 'var(--color-muted)' }}
            loading={loading && items.length > 0}
            onClick={refresh}>
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Filters */}
      <Group gap="xs" mb="lg" wrap="wrap">
        {FILTERS.map(f => (
          <Button key={f.value} size="xs" radius="xl"
            variant={filter === f.value ? 'filled' : 'outline'}
            style={filter === f.value
              ? { background: 'var(--color-ink)', color: 'white', fontWeight: 700 }
              : { borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
            onClick={() => setFilter(f.value)}>
            {f.label}
          </Button>
        ))}
      </Group>

      {/* Error */}
      {error && (
        <Alert mb="md" radius="xl" color="red" variant="light"
          title="Failed to load notifications"
          styles={{ title: { fontWeight: 700 } }}>
          {error}
          <Button size="xs" mt="xs" variant="light" color="red" radius="xl" onClick={refresh}>
            Try again
          </Button>
        </Alert>
      )}

      {/* Initial loading skeletons */}
      {loading && items.length === 0 && (
        <Stack gap="xs">
          {Array.from({ length: 5 }).map((_, i) => <NotifSkeleton key={i} />)}
        </Stack>
      )}

      {/* List */}
      {!loading && !error && filtered.length === 0 && (
        <Card radius="xl" withBorder p="xl" style={{ borderColor: 'var(--color-border)', textAlign: 'center' }}>
          <Text fz={32} mb="xs">🔔</Text>
          <Text fw={600} c="var(--color-ink)" mb={4}>No notifications</Text>
          <Text fz="sm" c="var(--color-muted)">You&apos;re all caught up.</Text>
        </Card>
      )}

      {filtered.length > 0 && (
        <Stack gap="xs">
          {filtered.map(n => {
            const meta = TYPE_META[n.type]
            return (
              <Card key={n.id} radius="xl" withBorder p="md"
                style={{
                  borderColor: !n.read ? meta.color + '40' : 'var(--color-border)',
                  background: !n.read ? meta.bg : 'white',
                  cursor: n.link ? 'pointer' : 'default',
                  transition: 'box-shadow 0.15s',
                }}
                onClick={() => { if (n.link) { markRead(n.id); window.location.href = n.link } }}>
                <Group align="flex-start" gap="sm" wrap="nowrap">
                  <Box style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: meta.bg, border: `1px solid ${meta.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {meta.icon}
                  </Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
                      <Group gap="xs" wrap="wrap" align="center">
                        <Text fw={n.read ? 500 : 700} fz="sm" c="var(--color-ink)">{n.title}</Text>
                        {!n.read && (
                          <Box style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                        )}
                      </Group>
                      <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
                        <Text fz="xs" c="var(--color-muted)" style={{ whiteSpace: 'nowrap' }}>{n.time}</Text>
                        <ActionIcon size="xs" variant="subtle" color="gray"
                          onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                          title="Dismiss"
                          style={{ opacity: 0.5 }}>
                          ×
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Text fz="xs" c="var(--color-muted)" lh={1.6} mt={2}>{n.body}</Text>
                    <Group gap="xs" mt="xs" wrap="wrap">
                      <Badge size="xs" radius="xl" variant="light"
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </Badge>
                      {n.link && (
                        <Text fz="xs" style={{ color: meta.color, fontWeight: 600 }}>View →</Text>
                      )}
                    </Group>
                  </Box>
                </Group>
              </Card>
            )
          })}

          {/* Load more */}
          {hasMore && (
            <Button
              mt="xs" radius="xl" variant="outline" fullWidth
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
              loading={loading}
              onClick={loadMore}>
              Load more
            </Button>
          )}

          {/* Load more skeletons */}
          {loading && items.length > 0 && (
            <Stack gap="xs" mt="xs">
              <NotifSkeleton />
              <NotifSkeleton />
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  )
}
