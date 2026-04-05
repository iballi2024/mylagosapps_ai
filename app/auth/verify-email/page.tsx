'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Button, Anchor, Alert } from '@mantine/core'
import { apiResendActivation } from '@/lib/auth'

function VerifyEmailContent() {
  const params = useSearchParams()
  const email = params.get('email')

  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) return
    setError(null)
    setLoading(true)
    try {
      await apiResendActivation(email)
      setResent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not resend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
      <Box style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>
        ✉️
      </Box>

      <Title order={2} ff="var(--font-montserrat)" fw={800} mb="xs">
        Check your email
      </Title>

      <Text size="sm" c="dimmed" lh={1.7} mb={email ? 'xs' : 'xl'}>
        We sent an activation link to
      </Text>

      {email && (
        <Text size="sm" fw={700} c="var(--color-ink)" mb="xl">
          {email}
        </Text>
      )}

      <Text size="xs" c="dimmed" lh={1.7} mb="xl">
        Click the link in the email to activate your account. If you don&apos;t see it, check your spam folder.
      </Text>

      {error && (
        <Alert color="red" radius="md" mb="md" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {resent && (
        <Alert color="green" radius="md" mb="md">
          Activation link resent — check your inbox.
        </Alert>
      )}

      <Stack gap="sm">
        <Button
          fullWidth radius="xl" size="md"
          loading={loading}
          disabled={resent}
          style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white', fontWeight: 700 }}
          onClick={handleResend}>
          {resent ? 'Email sent ✓' : 'Resend activation link'}
        </Button>
        <Text size="xs" c="dimmed">
          Already activated?{' '}
          <Anchor component={Link} href="/auth/login" size="xs" fw={600} c="var(--color-gold)">
            Sign in
          </Anchor>
          {' '}·{' '}
          <Anchor component={Link} href="/auth/signup" size="xs" fw={600} c="var(--color-gold)">
            Wrong email?
          </Anchor>
        </Text>
      </Stack>
    </Box>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Box w="100%" maw={420} />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
