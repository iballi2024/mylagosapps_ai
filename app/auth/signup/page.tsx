'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box, Title, Text, TextInput, PasswordInput, Button, Divider,
  Checkbox, Anchor, Stack, Grid, Progress, Loader
} from '@mantine/core'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)

  const checkStrength = (pw: string) => {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    setStrength(s)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  }

  const strengthColors = ['', 'red', 'orange', 'yellow', 'green']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <Box w="100%" maw={440}>
      <Stack gap={4} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={30} c="var(--color-ink)">
          Create your account
        </Title>
        <Text fz="sm" c="var(--color-muted)">
          Already have one?{' '}
          <Anchor component={Link} href="/auth/login" fw={600} c="var(--color-gold)">Sign in</Anchor>
        </Text>
      </Stack>

      <Button
        variant="default" fullWidth size="md" radius="xl" mb="md"
        leftSection={<GoogleIcon />}
        styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-ink)', fontWeight: 500 } }}
      >
        Continue with Google
      </Button>

      <Divider label="or register with email" labelPosition="center" my="md" c="var(--color-subtle)" />

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Grid gutter="sm">
            <Grid.Col span={6}>
              <TextInput label="First Name" placeholder="Chidi" size="md" radius="xl"
                value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Last Name" placeholder="Okonkwo" size="md" radius="xl"
                value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />
            </Grid.Col>
          </Grid>

          <TextInput label="Work Email" type="email" placeholder="chidi@company.ng" size="md" radius="xl"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />

          <TextInput label="Company Name" placeholder="Okonkwo Ventures (optional)" size="md" radius="xl"
            value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
            styles={{ label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }} />

          <Box>
            <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={6}>Password</Text>
            <PasswordInput placeholder="Min. 8 characters" size="md" radius="xl"
              value={form.password}
              onChange={e => { setForm(p => ({ ...p, password: e.target.value })); checkStrength(e.target.value) }} />
            {form.password && (
              <Box mt={8}>
                <Progress value={strength * 25} color={strengthColors[strength]} size="sm" radius="xl" />
                <Text fz={10} c={strengthColors[strength]} mt={4}>{strengthLabels[strength]} password</Text>
              </Box>
            )}
          </Box>

          <Checkbox
            label={
              <Text fz="xs" c="var(--color-muted)">
                I agree to the{' '}
                <Anchor href="#" c="var(--color-gold)" fz="xs">Terms of Service</Anchor>
                {' '}and{' '}
                <Anchor href="#" c="var(--color-gold)" fz="xs">Privacy Policy</Anchor>
              </Text>
            }
            color="var(--color-gold)"
          />

          <Button type="submit" fullWidth size="md" radius="xl" loading={loading}
            loader={<Loader size="xs" color="white" />}
            style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700, marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </Button>
        </Stack>
      </form>
    </Box>
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
