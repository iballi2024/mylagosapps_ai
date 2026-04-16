'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, TextInput, PasswordInput, Button, Anchor, Divider, Group, Alert } from '@mantine/core'
import { useAuthContext } from '@/context/AuthContext'
import GoogleButton from '@/components/GoogleButton'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { login, googleLogin } = useAuthContext()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getNext = () =>
    params.get('next') ??
    new URLSearchParams(window.location.search).get('next') ??
    '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form.identifier, form.password)
      router.push(getNext())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signupHref = getNext() !== '/dashboard'
    ? `/auth/signup?next=${encodeURIComponent(getNext())}`
    : '/auth/signup'

  const handleGoogleToken = async (idToken: string) => {
    setGoogleLoading(true)
    setError(null)
    try {
      await googleLogin(idToken)
      router.push(getNext())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

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
        {googleLoading ? (
          <Button variant="default" radius="xl" size="md" fullWidth loading>
            Signing in with Google...
          </Button>
        ) : (
          <GoogleButton onToken={handleGoogleToken} width={380} />
        )}
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
          {/* <Checkbox label="Keep me signed in for 30 days" size="sm" color="var(--color-ink)" /> */}
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

