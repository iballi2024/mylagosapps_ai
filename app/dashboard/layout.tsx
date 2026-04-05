'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Box, Stack, Text, Group, ScrollArea, Burger, Drawer, NavLink, Loader } from '@mantine/core'

import Logo from '@/components/Logo'
import { useAuthContext } from '@/context/AuthContext'
import { MOCK_PLAN, TIER_META } from './plan'

const NAV = [
  { href: '/dashboard',          icon: '⊞', label: 'Overview' },
  { href: '/dashboard/apps',     icon: '🧩', label: 'Services' },
  { href: '/dashboard/billing',  icon: '🧾', label: 'Billing' },
  { href: '/dashboard/team',     icon: '👥', label: 'Team' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
]

const SERVICES = [
  { href: '/services/food',       icon: '🍽️', label: 'Food, Groceries and Household' },
  { href: '/services/rides',      icon: '🚗', label: 'Cars, Vans and Rides' },
  { href: '/services/healthcare', icon: '🏥', label: 'Health and Wellness' },
  { href: '/services/events',     icon: '🎉', label: 'Events and Studios' },
  { href: '/services/solar',      icon: '☀️', label: 'Solar, Renewables and More' },
]

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  return (
    <Stack h="100%" gap={0}>
      {/* Logo */}
      <Group h={64} px="md" style={{ borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <Box component={Link} href="/" style={{ textDecoration: 'none', flex: 1 }} onClick={onNav}>
          <Logo size="1.2rem" />
        </Box>
      </Group>

      {/* Plan status chip */}
      {MOCK_PLAN ? (
        <Box mx="xs" mt="xs" px="sm" py="xs"
          style={{ borderRadius: 12, background: 'linear-gradient(135deg, #2E9E5B, #1A6B3C)', flexShrink: 0, textDecoration: 'none', display: 'block' }}
          component={Link} href="/dashboard/billing" onClick={onNav}>
          <Text size="xs" c="rgba(255,255,255,0.6)" tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>Current Plan</Text>
          <Text ff="var(--font-montserrat)" fw={700} c="white" fz={15} mb={2}>
            {TIER_META[MOCK_PLAN.tier].icon} {TIER_META[MOCK_PLAN.tier].label}
          </Text>
          <Text fz={10} c="rgba(255,255,255,0.55)">
            {MOCK_PLAN.billing === 'annual' ? 'Annual' : 'Quarterly'} · Renews {MOCK_PLAN.renewsAt}
          </Text>
        </Box>
      ) : (
        <Box mx="xs" mt="xs" px="sm" py="xs"
          style={{ borderRadius: 12, background: '#EDF3EE', border: '1px dashed #D8E6DA', flexShrink: 0, textDecoration: 'none', display: 'block' }}
          component={Link} href="/subscribe/plan" onClick={onNav}>
          <Text size="xs" c="var(--color-muted)" tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>No active plan</Text>
          <Text ff="var(--font-montserrat)" fw={700} c="#1A6B3C" fz={13} mb={2}>Subscribe now →</Text>
          <Text fz={10} c="var(--color-muted)">Unlock all LagosApps services</Text>
        </Box>
      )}

      <ScrollArea flex={1} px="xs" py="xs">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" px="xs" mb={4} style={{ letterSpacing: 1.5 }}>Account</Text>
        {NAV.map(item => (
          <NavLink key={item.href} component={Link} href={item.href} onClick={onNav}
            label={item.label} leftSection={<Text fz={15}>{item.icon}</Text>}
            active={pathname === item.href}
            style={{ borderRadius: 12, marginBottom: 2 }}
            styles={{ root: { fontFamily: 'var(--font-poppins)', fontSize: 14 } }}
          />
        ))}

        <Text size="xs" tt="uppercase" fw={700} c="dimmed" px="xs" mt="sm" mb={4} style={{ letterSpacing: 1.5 }}>Services</Text>
        {SERVICES.map(item => (
          <NavLink key={item.href} component={Link} href={item.href} onClick={onNav}
            label={item.label} leftSection={<Text fz={13}>{item.icon}</Text>}
            active={pathname === item.href}
            style={{ borderRadius: 12, marginBottom: 2 }}
            styles={{ root: { fontFamily: 'var(--font-poppins)', fontSize: 12 } }}
          />
        ))}
      </ScrollArea>

      {/* User */}
      <Box style={{ borderTop: '1px solid var(--color-border)', flexShrink: 0 }} p="sm">
        <Group gap="sm">
          <Box w={34} h={34} style={{ borderRadius: '50%', background: 'var(--color-gold-pale)', border: '2px solid rgba(201,146,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>
            CO
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text size="xs" fw={600} c="var(--color-ink)" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chidi Okonkwo</Text>
            <Text component={Link} href="/auth/login" size="xs" c="dimmed" style={{ textDecoration: 'none' }}>Sign out</Text>
          </Box>
        </Group>
      </Box>
    </Stack>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthContext()
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('lagos_token')
  const NAV_BOTTOM = NAV.slice(0, 4)

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasToken) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [loading, isAuthenticated, hasToken, pathname, router])

  if (loading || (!isAuthenticated && !hasToken)) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <Loader size="lg" color="#1A6B3C" />
      </Box>
    )
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>
      {/* Desktop sidebar */}
      <Box w={260} style={{ flexShrink: 0, background: 'white', borderRight: '1px solid var(--color-border)', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}
        visibleFrom="lg">
        <SidebarContent />
      </Box>

      {/* Mobile drawer */}
      <Drawer opened={opened} onClose={() => setOpened(false)} size={240} padding={0}
        styles={{ body: { padding: 0, height: '100%' }, header: { display: 'none' } }}>
        <SidebarContent onNav={() => setOpened(false)} />
      </Drawer>

      {/* Content area */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        ml={{ base: 0, lg: 260 }}>

        {/* Mobile top bar */}
        <Box hiddenFrom="lg"
          style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid var(--color-border)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <Burger opened={opened} onClick={() => setOpened(v => !v)} size="sm" />
          <Box component={Link} href="/" style={{ textDecoration: 'none' }}>
            <Logo size="1.15rem" />
          </Box>
          {MOCK_PLAN ? (
            <Box component={Link} href="/dashboard/billing"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 10, background: 'linear-gradient(135deg, #2E9E5B, #1A6B3C)', color: 'white', textDecoration: 'none' }}>
              {TIER_META[MOCK_PLAN.tier].icon} {TIER_META[MOCK_PLAN.tier].label}
            </Box>
          ) : (
            <Box component={Link} href="/subscribe/plan"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 10, background: '#EDF3EE', border: '1px solid #D8E6DA', color: '#1A6B3C', textDecoration: 'none' }}>
              Subscribe
            </Box>
          )}
        </Box>

        <Box style={{ flex: 1, paddingBottom: 80 }} pb={{ lg: 0 }}>
          {children}
        </Box>

        {/* Mobile bottom tab bar */}
        <Box hiddenFrom="lg"
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'white', borderTop: '1px solid var(--color-border)', display: 'flex' }}>
          {NAV_BOTTOM.map(item => (
            <Box key={item.href} component={Link} href={item.href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '10px 4px', textDecoration: 'none',
                color: pathname === item.href ? 'var(--color-ink)' : 'var(--color-subtle)',
                borderTop: pathname === item.href ? '2px solid var(--color-ink)' : '2px solid transparent',
              }}>
              <Text fz={20} lh={1}>{item.icon}</Text>
              <Text size="xs" fw={pathname === item.href ? 600 : 400}>{item.label}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
