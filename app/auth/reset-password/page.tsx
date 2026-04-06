'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Box, Title, Text, PasswordInput, Button, Anchor, Stack, Alert, ThemeIcon } from '@mantine/core'
import { apiResetPassword } from '@/lib/auth'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
        <Alert color="red" radius="md" mb="lg">
          Invalid or missing reset token. Please request a new password reset link.
        </Alert>
        <Anchor component={Link} href="/auth/forgot-password" fz="sm" c="var(--color-gold)" fw={600}>
          Request new link →
        </Anchor>
      </Box>
    )
  }

  if (done) {
    return (
      <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
        <ThemeIcon size={64} radius="xl" mb="lg"
          style={{ background: 'var(--color-gold-pale)', border: '2px solid rgba(201,146,10,0.3)', fontSize: 28, margin: '0 auto 24px' }}>
          ✅
        </ThemeIcon>
        <Title order={2} ff="var(--font-montserrat)" fw={800} fz={24} c="var(--color-ink)" mb="sm">
          Password updated
        </Title>
        <Text fz="sm" c="var(--color-muted)" mb="lg" lh={1.7}>
          Your password has been reset successfully. You can now sign in with your new password.
        </Text>
        <Button radius="xl" size="md" fullWidth style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}
          onClick={() => router.replace('/auth/login')}>
          Sign in
        </Button>
      </Box>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await apiResetPassword(token, password)
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box w="100%" maw={420}>
      <Anchor component={Link} href="/auth/login" fz="xs" c="var(--color-muted)" mb="xl" display="inline-block">
        ← Back to sign in
      </Anchor>

      <Box mb="xl"
        style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-gold-pale)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        🔒
      </Box>

      <Stack gap={4} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={30} c="var(--color-ink)">New password</Title>
        <Text fz="sm" c="var(--color-muted)" lh={1.6}>
          Choose a strong password for your account.
        </Text>
      </Stack>

      {error && (
        <Alert color="red" radius="md" mb="md" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <PasswordInput
            label="New password" required placeholder="At least 8 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            size="md" radius="xl"
            styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }}
          />
          <PasswordInput
            label="Confirm password" required placeholder="Repeat your new password"
            value={confirm} onChange={e => setConfirm(e.target.value)}
            size="md" radius="xl"
            styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }}
          />
          <Button type="submit" fullWidth size="md" radius="xl" loading={loading}
            style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
            {loading ? 'Saving...' : 'Set new password'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Box w="100%" maw={420} />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
