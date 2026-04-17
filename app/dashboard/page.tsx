'use client'
import Link from 'next/link'
import { Box, Title, Text, SimpleGrid, Card, Group, Badge, Stack, Button, Anchor } from '@mantine/core'
import { usePlatform, SERVICE_CATEGORIES } from '@/context/PlatformContext'
import { useAuthContext } from '@/context/AuthContext'
import { useCurrentSubscription } from '@/context/CurrentSubscriptionContext'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { loyaltyPoints, transactions, formatPrice } = usePlatform()
  const { user } = useAuthContext()
  const { subscription } = useCurrentSubscription()
  const displayName = user ? `${user.firstName} ${user.lastName}` : ''
  const thisMonth = transactions
    .filter(t => t.type === 'debit' && (t.date.startsWith('Today') || t.date.startsWith('Yesterday')))
    .reduce((s, t) => s + t.amount, 0)

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }}>

      {/* Header */}
      <Group justify="space-between" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Text fz="sm" c="var(--color-muted)" mb={2}>{getGreeting()} 👋</Text>
          <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">
            {displayName}
          </Title>
        </Box>
        <Button component={Link} href="/dashboard/contact-admin" radius="xl" size="sm"
          style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 600 }}>
          Contact Admin
        </Button>
      </Group>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        {/* Subscription Plan Status */}
        {subscription ? (
          <Card radius="xl" p="lg" style={{ background: 'linear-gradient(135deg, #2E9E5B, #1A6B3C)', border: 'none' }}>
            <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="rgba(255,255,255,0.6)" fw={600} mb={4}>Current Plan</Text>
            <Group gap="xs" align="center" mb={4}>
              <Text ff="var(--font-montserrat)" fw={800} fz={26} c="white">{subscription.planName}</Text>
              <Badge size="xs" radius="xl" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', textTransform: 'capitalize' }}>
                {subscription.status}
              </Badge>
            </Group>
            <Text fz={11} c="rgba(255,255,255,0.6)" mb="md" style={{ textTransform: 'capitalize' }}>
              Expires {new Date(subscription.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            <Group gap="xs">
              <Button component={Link} href="/dashboard/billing" size="xs" radius="xl"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)' }}>
                Manage plan
              </Button>
              <Button component={Link} href="/subscribe/plan" size="xs" radius="xl"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)' }}>
                Upgrade
              </Button>
            </Group>
          </Card>
        ) : (
          <Card radius="xl" p="lg" withBorder style={{ borderColor: '#D8E6DA', borderStyle: 'dashed' }}>
            <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={4}>Current Plan</Text>
            <Text ff="var(--font-montserrat)" fw={800} fz={20} c="var(--color-ink)" mb={4}>No active plan</Text>
            <Text fz={11} c="var(--color-muted)" mb="md">Subscribe to unlock all LagosApps services.</Text>
            <Button component={Link} href="/subscribe/plan" size="xs" radius="xl"
              style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white', fontWeight: 600 }}>
              View plans →
            </Button>
          </Card>
        )}

        <Card radius="xl" p="lg" withBorder style={{ borderColor: 'var(--color-border)' }}>
          <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={4}>This Month</Text>
          <Text ff="var(--font-montserrat)" fw={800} fz={24} c="var(--color-ink)">{formatPrice(thisMonth)}</Text>
          <Text fz={11} c="var(--color-muted)" mt={4}>Across all services</Text>
        </Card>

        <Card radius="xl" p="lg" withBorder style={{ borderColor: 'var(--color-border)' }}>
          <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={4}>Loyalty Points</Text>
          <Text ff="var(--font-montserrat)" fw={800} fz={24} c="var(--color-ink)">⭐ {loyaltyPoints?.toLocaleString()}</Text>
          <Text fz={11} c="var(--color-muted)" mt={4}>≈ {formatPrice(loyaltyPoints * 2)} in rewards</Text>
        </Card>
      </SimpleGrid>

      {/* Bottom grid */}
      <SimpleGrid cols={{ base: 1, xl: 3 }} spacing="md">

        {/* Transactions */}
        <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)', gridColumn: 'span 2' }} p={0}>
          <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Recent Transactions</Text>
            <Anchor component={Link} href="/dashboard/billing" fz="xs" c="var(--color-gold)" fw={600}>View all →</Anchor>
          </Group>
          <Stack gap={0}>
            {transactions.map(txn => {
              const cat = SERVICE_CATEGORIES.find(c => c.name === txn.subsidiary)
              return (
                <Group key={txn.id} px="lg" py="sm" gap="sm" wrap="nowrap"
                  style={{ borderBottom: '1px solid var(--color-border)', ':last-child': { borderBottom: 'none' } }}>
                  <Box style={{ width: 36, height: 36, borderRadius: 10, background: cat?.colorPale || '#F2F0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {cat?.icon || '💳'}
                  </Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fz="sm" fw={500} c="var(--color-ink)" truncate>{txn.description}</Text>
                    <Text fz={11} c="var(--color-muted)">{txn.date}</Text>
                  </Box>
                  <Text ff="var(--font-montserrat)" fw={700} fz="sm" c={txn.type === 'credit' ? 'green' : 'var(--color-ink)'} style={{ flexShrink: 0 }}>
                    {txn.type === 'credit' ? '+' : '−'}{formatPrice(txn.amount)}
                  </Text>
                  <Badge size="xs" radius="xl" visibleFrom="sm"
                    color={txn.status === 'completed' ? 'green' : 'yellow'} variant="light">
                    {txn.status}
                  </Badge>
                </Group>
              )
            })}
          </Stack>
        </Card>

        {/* Quick order */}
        <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
          <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" px="md" py="md"
            style={{ borderBottom: '1px solid var(--color-border)' }}>
            Quick Order
          </Text>
          <SimpleGrid cols={{ base: 2, xl: 1 }} spacing={2} p="xs">
            {SERVICE_CATEGORIES.map(cat => {
              const firstHref = cat.items.find(i => i.href)?.href
              const isExternal = !!firstHref
              return (
                <Box key={cat.id}
                  component="a"
                  href={firstHref ?? '/dashboard/apps'}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Box style={{ width: 34, height: 34, borderRadius: 10, background: cat.colorPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {cat.icon}
                  </Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fz="xs" fw={600} c="var(--color-ink)">{cat.name}</Text>
                    <Text fz={10} c="var(--color-muted)" truncate>
                      {cat.items.filter(i => i.href).length} bookable services
                    </Text>
                  </Box>
                  <Text fz="xs" fw={700} style={{ color: cat.color, flexShrink: 0 }} visibleFrom="xl">→</Text>
                </Box>
              )
            })}
          </SimpleGrid>
          <Box p="xs" pt={0}>
            <Button component="a" href="https://wa.me/2348001000000" target="_blank" fullWidth radius="xl" size="sm" variant="light"
              styles={{ root: { background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' } }}>
              💬 Order via WhatsApp
            </Button>
          </Box>
        </Card>
      </SimpleGrid>

    </Box>
  )
}
