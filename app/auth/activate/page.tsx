'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Button, Loader, Anchor } from '@mantine/core'
import { apiActivate } from '@/lib/auth'

type Status = 'loading' | 'success' | 'error' | 'missing'

function ActivateContent() {
  const params = useSearchParams()
  const token = params.get('token')

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'missing')
  const [message, setMessage] = useState<string | null>(null)
  const called = useRef(false)

  useEffect(() => {
    if (!token || called.current) return
    called.current = true
    const activate = async () => {
      try {
        const res = await apiActivate(token)
        setStatus('success')
        setMessage(res.message)
      } catch (err: unknown) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Activation failed. The link may have expired.')
      }
    }
    activate()
  }, [token])

  return (
    <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <Loader size="lg" color="#1A6B3C" mb="xl" />
          <Title order={2} ff="var(--font-montserrat)" fw={800} mb="xs">
            Activating your account…
          </Title>
          <Text size="sm" c="dimmed">Please wait while we verify your link.</Text>
        </>
      )}

      {status === 'success' && (
        <>
          <Box style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>
            ✅
          </Box>
          <Title order={2} ff="var(--font-montserrat)" fw={800} mb="xs">
            Account activated!
          </Title>
          <Text size="sm" c="dimmed" lh={1.7} mb="xl">
            {message ?? 'Your account is now active. You can sign in and start using LagosApps.'}
          </Text>
          <Button
            component={Link}
            href="/auth/login"
            fullWidth radius="xl" size="md"
            style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white', fontWeight: 700 }}>
            Sign in to your account →
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <Box style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>
            ❌
          </Box>
          <Title order={2} ff="var(--font-montserrat)" fw={800} mb="xs">
            Activation failed
          </Title>
          <Text size="sm" c="dimmed" lh={1.7} mb="xl">
            {message}
          </Text>
          <Stack gap="sm">
            <Button
              component={Link}
              href="/auth/signup"
              fullWidth radius="xl" size="md"
              style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white', fontWeight: 700 }}>
              Register again
            </Button>
            <Text size="xs" c="dimmed">
              Already activated?{' '}
              <Anchor component={Link} href="/auth/login" size="xs" fw={600} c="var(--color-gold)">
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </>
      )}

      {status === 'missing' && (
        <>
          <Box style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF9EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>
            ⚠️
          </Box>
          <Title order={2} ff="var(--font-montserrat)" fw={800} mb="xs">
            Invalid link
          </Title>
          <Text size="sm" c="dimmed" lh={1.7} mb="xl">
            This activation link is missing a token. Please use the link from your email.
          </Text>
          <Button
            component={Link}
            href="/auth/signup"
            fullWidth radius="xl" size="md"
            variant="default">
            Back to sign up
          </Button>
        </>
      )}
    </Box>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
        <Loader size="lg" color="#1A6B3C" />
      </Box>
    }>
      <ActivateContent />
    </Suspense>
  )
}
