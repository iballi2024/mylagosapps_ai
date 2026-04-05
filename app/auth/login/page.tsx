'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, TextInput, PasswordInput, Button, Anchor, Divider, Checkbox, Group, Alert } from '@mantine/core'
import { useAuthContext } from '@/context/AuthContext'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/dashboard'
  const { login } = useAuthContext()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form.identifier, form.password)
      router.push(next)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signupHref = params.get('next')
    ? `/auth/signup?next=${encodeURIComponent(params.get('next')!)}`
    : '/auth/signup'

  return (
    <Box w="100%" maw={420}>
      <Stack gap="xs" mb="xl">
        <Title order={2} ff="var(--font-montserrat)" fw={800}>Welcome back</Title>
        <Text size="sm" c="dimmed">
          Don&apos;t have an account?{' '}
          <Anchor component={Link} href={signupHref} fw={600} c="var(--color-gold)">Sign up free</Anchor>
        </Text>
      </Stack>

      <Stack gap="xs" mb="md">
        <Button variant="default" radius="xl" size="md" leftSection={<GoogleIcon />} fullWidth>
          Continue with Google
        </Button>
      </Stack>

      <Divider label="or sign in with email or phone" labelPosition="center" mb="md" />

      {error && (
        <Alert color="red" radius="md" mb="md" withCloseButton onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email or WhatsApp number"
            type="text"
            placeholder="you@example.ng or +234 801 234 5678"
            value={form.identifier}
            onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))}
            radius="md" required />
          <Box>
            <Group justify="space-between" mb={6}>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Password</Text>
              <Anchor component={Link} href="/auth/forgot-password" size="xs" fw={600} c="var(--color-gold)">Forgot password?</Anchor>
            </Group>
            <PasswordInput placeholder="Your password" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              radius="md" required />
          </Box>
          <Checkbox label="Keep me signed in for 30 days" size="sm" color="var(--color-ink)" />
          <Button type="submit" loading={loading} radius="xl" size="md" fullWidth
            style={{ background: 'var(--color-ink)', color: 'white' }}>
            Sign in →
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="xs" c="dimmed" mt="xl">
        By signing in you agree to our{' '}
        <Anchor size="xs" c="dimmed" fw={500}>Terms</Anchor> &{' '}
        <Anchor size="xs" c="dimmed" fw={500}>Privacy Policy</Anchor>
      </Text>
    </Box>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box w="100%" maw={420} />}>
      <LoginForm />
    </Suspense>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
