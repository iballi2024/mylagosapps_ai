'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Stack, Text, Group, ScrollArea, Burger, Drawer, NavLink } from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'
import Logo from '@/components/Logo'

const NAV = [
  { href: '/dashboard',          icon: '⊞', label: 'Overview' },
  { href: '/wallet',             icon: '💳', label: 'Wallet' },
  { href: '/dashboard/apps',     icon: '🧩', label: 'Services' },
  { href: '/dashboard/billing',  icon: '🧾', label: 'Billing' },
  { href: '/dashboard/team',     icon: '👥', label: 'Team' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
]

const SERVICES = [
  { href: '/services/food',       icon: '🍽️', label: 'LagosEats' },
  { href: '/services/rides',      icon: '🚗', label: 'LagosRides' },
  { href: '/services/groceries',  icon: '🛒', label: 'LagosMarket' },
  { href: '/services/home',       icon: '🔧', label: 'LagosHome' },
  { href: '/services/logistics',  icon: '📦', label: 'LagosSend' },
  { href: '/services/healthcare', icon: '🏥', label: 'LagosHealth' },
]

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  const { walletBalance, formatPrice } = usePlatform()

  return (
    <Stack h="100%" gap={0}>
      {/* Logo */}
      <Group h={64} px="md" style={{ borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <Box component={Link} href="/" style={{ textDecoration: 'none', flex: 1 }} onClick={onNav}>
          <Logo size="1.2rem" />
        </Box>
      </Group>

      {/* Wallet chip */}
      <Box mx="xs" mt="xs" px="sm" py="xs"
        style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1A1A2E, #2C2C4A)', flexShrink: 0, textDecoration: 'none', display: 'block' }}
        component={Link} href="/wallet" onClick={onNav}>
        <Text size="xs" c="white" opacity={0.5} tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>Wallet</Text>
        <Text ff="var(--font-montserrat)" fw={700} c="white" fz={15}>{formatPrice(walletBalance)}</Text>
      </Box>

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
  const { walletBalance, formatPrice } = usePlatform()
  const pathname = usePathname()
  const NAV_BOTTOM = NAV.slice(0, 4)

  return (
    <Box style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex' }}>
      {/* Desktop sidebar */}
      <Box w={220} style={{ flexShrink: 0, background: 'white', borderRight: '1px solid var(--color-border)', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}
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
        ml={{ base: 0, lg: 220 }}>

        {/* Mobile top bar */}
        <Box hiddenFrom="lg"
          style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid var(--color-border)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <Burger opened={opened} onClick={() => setOpened(v => !v)} size="sm" />
          <Box component={Link} href="/" style={{ textDecoration: 'none' }}>
            <Logo size="1.15rem" />
          </Box>
          <Box component={Link} href="/wallet"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface2)', color: 'var(--color-ink)', textDecoration: 'none' }}>
            💳 {formatPrice(walletBalance)}
          </Box>
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
