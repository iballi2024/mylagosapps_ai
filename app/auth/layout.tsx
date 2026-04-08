'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Text, Stack, Group } from '@mantine/core'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useAuthContext } from '@/context/AuthContext'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthContext()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const next = new URLSearchParams(window.location.search).get('next') ?? '/dashboard'
      router.replace(next)
    }
  }, [loading, isAuthenticated, router])

  // Don't render auth UI while checking session
  if (loading) return null

  return (
    <Box style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Decorative panel — md+ only */}
      <Box w={{ base: 0, md: '44%' }} style={{ background: 'var(--color-ink)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}
        visibleFrom="md">
        <Box style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <Box style={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, borderRadius: '50%', background: 'radial-gradient(circle, #C9920A, transparent)', opacity: 0.1, transform: 'translate(30%, -30%)' }} />

        <Stack justify="space-between" h="100%" p={{ base: 'xl', lg: 48 }} style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <Logo size="1.5rem" light />
          </Link>

          <Box>
            <Text fz={32} mb="md">🚀</Text>
            <Text ff="var(--font-montserrat)" fw={700} fz={{ base: 24, lg: 28 }} c="white" lh={1.3} mb="md">
              Build, launch, and grow your business.
            </Text>
            <Text size="sm" c="white" opacity={0.5} lh={1.7} mb={32}>
              One account. One wallet. Every service in Lagos — food, rides, groceries, home, logistics, and healthcare.
            </Text>
            <Group gap="xs">
              {['CO','AA','BN','FK'].map((init, i) => (
                <Box key={i} w={36} h={36} ml={i > 0 ? -8 : 0}
                  style={{ borderRadius: '50%', border: '2px solid var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', background: ['#C9920A','#A0521A','#4A5568','#C9920A'][i] }}>
                  {init}
                </Box>
              ))}
              <Box ml="xs">
                <Text size="xs" c="white" fw={600}>2,400+ businesses</Text>
                <Text size="xs" c="white" opacity={0.4}>growing with LagosApps</Text>
              </Box>
            </Group>
          </Box>

          <Box p="md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }}>
            <Text size="sm" c="white" opacity={0.7} fs="italic" lh={1.7} mb="sm">
              &ldquo;LagosApps transformed how we manage our retail operations. The Gold plan pays for itself every week.&rdquo;
            </Text>
            <Group gap="sm">
              <Box w={32} h={32} style={{ borderRadius: '50%', background: '#C9920A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>AO</Box>
              <Box>
                <Text size="xs" c="white" fw={600}>Adaobi Okafor</Text>
                <Text size="xs" c="white" opacity={0.4}>CEO, Adaobi Collections — Gold Plan</Text>
              </Box>
            </Group>
          </Box>
        </Stack>
      </Box>

      {/* Form panel */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
        {/* Mobile-only top bar */}
        <Box hiddenFrom="md" px="lg" h={56}
          style={{ borderBottom: '1px solid var(--color-border)', background: 'white', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <Logo size="1.15rem" />
          </Link>
        </Box>
        <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
