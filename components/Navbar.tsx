'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Group, Text, Anchor, Button, SimpleGrid, Burger, Avatar } from '@mantine/core'
import Logo from '@/components/Logo'
import { useNotifications } from '@/context/NotificationsContext'
import { useAuthContext } from '@/context/AuthContext'

const SERVICE_LINKS = [
  { label: 'Food & Groceries', href: '/services/food',       icon: '🍽️' },
  { label: 'Rides',            href: '/services/rides',       icon: '🚗' },
  { label: 'Healthcare',       href: '/services/healthcare',  icon: '🏥' },
  { label: 'Events',           href: 'https://mainlandevents.lagosapps.com/upcoming-events/', icon: '🎉', external: true },
  { label: 'Solar',            href: '/services/solar',       icon: '☀️' },
  { label: 'Office & School',  href: '/services/office',      icon: '🏢' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [opened, setOpened] = useState(false)

  const { unreadCount } = useNotifications()
  const { user, isAuthenticated } = useAuthContext()
  const isAuth      = pathname.startsWith('/auth')
  const isDashboard = pathname.startsWith('/dashboard')

  const userInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : ''

  return (
    <>
      <Box component="nav"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <Box px="md" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>

          {/* Logo */}
          <Box component={Link} href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo size="1.25rem" />
          </Box>

          {/* Centre service links — desktop */}
          {!isAuth && !isDashboard && (
            <Group gap={2} visibleFrom="lg">
              {SERVICE_LINKS.map(item => (
                <Box key={item.href}
                  component={item.external ? 'a' : Link}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 12, textDecoration: 'none',
                    fontSize: 12, fontWeight: 500,
                    color: pathname === item.href ? 'var(--color-ink)' : 'var(--color-muted)',
                    background: pathname === item.href ? 'var(--color-surface2)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (pathname !== item.href) { e.currentTarget.style.background = 'var(--color-surface2)'; e.currentTarget.style.color = 'var(--color-ink)' } }}
                  onMouseLeave={e => { if (pathname !== item.href) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-muted)' } }}
                >
                  <span>{item.icon}</span>{item.label}
                </Box>
              ))}
            </Group>
          )}

          {/* Right */}
          <Group gap="xs">
            {!isAuth && !isDashboard && (
              <>
                {/* Notifications bell */}
                <Box component={Link} href="/dashboard/notifications"
                  style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                  🔔
                  {unreadCount > 0 && (
                    <Box style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, background: '#E03131', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', padding: '0 3px' }}>
                      {unreadCount}
                    </Box>
                  )}
                </Box>
                {isAuthenticated && (
                  <Box component={Link} href="/dashboard" style={{ textDecoration: 'none' }}>
                    <Avatar
                      src={user?.avatar || undefined}
                      alt={userInitials}
                      size={34}
                      radius="xl"
                      color="green"
                    >
                      {userInitials}
                    </Avatar>
                  </Box>
                )}
                <Burger opened={opened} onClick={() => setOpened(v => !v)} hiddenFrom="lg" size="sm" />
              </>
            )}
            {isAuth && (
              <>
                <Anchor component={Link} href="/auth/login" size="sm" c="dimmed" visibleFrom="sm">Sign in</Anchor>
                <Button component={Link} href="/auth/signup" size="sm" radius="xl"
                  style={{ background: 'var(--color-ink)', color: 'white' }}>
                  Get started
                </Button>
              </>
            )}
            {isDashboard && (
              <>
                {/* Notifications bell */}
                <Box component={Link} href="/dashboard/notifications"
                  style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                  🔔
                  {unreadCount > 0 && (
                    <Box style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, background: '#E03131', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', padding: '0 3px' }}>
                      {unreadCount}
                    </Box>
                  )}
                </Box>
                <Avatar
                  src={user?.avatar || undefined}
                  alt={userInitials}
                  size={34}
                  radius="xl"
                  color="green"
                >
                  {userInitials}
                </Avatar>
              </>
            )}
          </Group>
        </Box>

        {/* Mobile drawer */}
        {opened && !isAuth && !isDashboard && (
          <Box hiddenFrom="lg" px="md" pb="md" style={{ borderTop: '1px solid var(--color-border)', background: 'white' }}>
            <SimpleGrid cols={3} spacing="xs" pt="sm">
              {SERVICE_LINKS.map(item => (
                <Box key={item.href}
                  component={item.external ? 'a' : Link}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpened(false)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '12px 8px', borderRadius: 12, textDecoration: 'none',
                    background: pathname === item.href ? 'var(--color-surface2)' : 'transparent',
                    fontSize: 12, fontWeight: 500, color: 'var(--color-muted)',
                  }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  {item.label}
                </Box>
              ))}
            </SimpleGrid>
            <Box pt="xs" style={{ borderTop: '1px solid var(--color-border)' }}>
              <Box component={Link} href="/about" onClick={() => setOpened(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px', textDecoration: 'none', color: 'var(--color-muted)', fontSize: 13, fontWeight: 500 }}>
                About LagosApps
                <Text fz="xs" c="var(--color-muted)">→</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {opened && (
        <Box onClick={() => setOpened(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(26,26,46,0.1)' }} />
      )}
    </>
  )
}
