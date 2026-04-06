'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Box, Title, Text, TextInput, Button, Anchor, Stack, ThemeIcon, Alert } from '@mantine/core'
import { apiForgotPassword } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await apiForgotPassword(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Box w="100%" maw={420} style={{ textAlign: 'center' }}>
        <ThemeIcon size={64} radius="xl" mb="lg"
          style={{ background: 'var(--color-gold-pale)', border: '2px solid rgba(201,146,10,0.3)', fontSize: 28, margin: '0 auto 24px' }}>
          📬
        </ThemeIcon>
        <Title order={2} ff="var(--font-montserrat)" fw={800} fz={24} c="var(--color-ink)" mb="sm">
          Check your inbox
        </Title>
        <Text fz="sm" c="var(--color-muted)" mb="lg" lh={1.7}>
          We sent a password reset link to <Text span fw={600} c="var(--color-ink)">{email}</Text>. It expires in 15 minutes.
        </Text>
        <Text fz="xs" c="var(--color-subtle)" mb="lg">
          Didn&apos;t get it? Check your spam folder or{' '}
          <Anchor onClick={() => setSent(false)} c="var(--color-gold)" fw={500} fz="xs">try again</Anchor>
        </Text>
        <Anchor component={Link} href="/auth/login" fz="sm" c="var(--color-muted)">← Back to sign in</Anchor>
      </Box>
    )
  }

  return (
    <Box w="100%" maw={420}>
      <Anchor component={Link} href="/auth/login" fz="xs" c="var(--color-muted)" mb="xl" display="inline-block">
        ← Back to sign in
      </Anchor>

      <Box
        mb="xl"
        style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--color-gold-pale)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        🔑
      </Box>

      <Stack gap={4} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={30} c="var(--color-ink)">Reset password</Title>
        <Text fz="sm" c="var(--color-muted)" lh={1.6}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Text>
      </Stack>

      {error && (
        <Alert color="red" radius="md" mb="md" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email address" type="email" required placeholder="you@company.ng"
            value={email} onChange={e => setEmail(e.target.value)}
            size="md" radius="xl"
            styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }}
          />
          <Button type="submit" fullWidth size="md" radius="xl" loading={loading}
            style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
