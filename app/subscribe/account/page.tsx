'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, TextInput, PasswordInput, Button, Divider, SegmentedControl, SimpleGrid, Group } from '@mantine/core'
import Navbar from '@/components/Navbar'

type Tab = 'signup' | 'login'
type Tier = 'bronze' | 'silver' | 'gold'
type Billing = 'annual' | 'quarterly'

const PLAN_LABELS: Record<Tier, { name: string; icon: string; color: string }> = {
  bronze: { name: 'Bronze', icon: '🥉', color: '#6B7C2A' },
  silver: { name: 'Silver', icon: '🥈', color: '#3D6B5E' },
  gold:   { name: 'Gold',   icon: '🥇', color: '#1A6B3C' },
}

const PRICES: Record<Tier, Record<Billing, number>> = {
  bronze: { annual: 100000, quarterly: 30000 },
  silver: { annual: 250000, quarterly: 75000 },
  gold:   { annual: 500000, quarterly: 200000 },
}

function StepBar({ step }: { step: number }) {
  const steps = ['Plan', 'Account', 'Payment', 'Done']
  return (
    <Group gap={0} mb="xl" w="100%">
      {steps.map((label, i) => {
        const num = i + 1
        const active = num === step
        const done = num < step
        return (
          <Box key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Group gap={0} style={{ width: '100%', alignItems: 'center' }}>
              {i > 0 && <Box style={{ flex: 1, height: 2, background: done ? '#1A6B3C' : '#D8E6DA' }} />}
              <Box style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#1A6B3C' : active ? '#1A6B3C' : '#D8E6DA', color: (done || active) ? 'white' : '#4F6B57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {done ? '✓' : num}
              </Box>
              {i < steps.length - 1 && <Box style={{ flex: 1, height: 2, background: '#D8E6DA' }} />}
            </Group>
            <Text size="xs" fw={active ? 700 : 400} c={active ? '#1A6B3C' : 'dimmed'}>{label}</Text>
          </Box>
        )
      })}
    </Group>
  )
}

function AccountPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const tier = (params.get('tier') as Tier) ?? 'silver'
  const billing = (params.get('billing') as Billing) ?? 'annual'
  const plan = PLAN_LABELS[tier]
  const price = PRICES[tier][billing]

  const [tab, setTab] = useState<Tab>('signup')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const errors: Record<string, string> = {}
  if (touched.firstName && !form.firstName.trim()) errors.firstName = 'Required'
  if (touched.lastName && !form.lastName.trim()) errors.lastName = 'Required'
  if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required'
  if (touched.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(form.phone)) errors.phone = 'Valid phone required'
  if (touched.password && form.password.length < 8) errors.password = 'Min. 8 characters'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true })
    const requiredFields = tab === 'signup'
      ? ['firstName', 'lastName', 'email', 'phone', 'password']
      : ['email', 'password']
    const hasErrors = requiredFields.some(f => {
      if (f === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      if (f === 'password') return form.password.length < 8
      return !form[f as keyof typeof form].trim()
    })
    if (hasErrors) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/subscribe/payment?tier=${tier}&billing=${billing}`)
    }, 600)
  }

  return (
    <Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
      <Box w="100%" maw={460}>
        <StepBar step={2} />

        {/* Plan pill */}
        <Group justify="center" mb="lg">
          <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8F5EE', border: '1px solid #C8E8D4', borderRadius: 999, padding: '6px 16px' }}>
            <Text>{plan.icon}</Text>
            <Text size="sm" fw={700} style={{ color: plan.color }}>{plan.name} Plan</Text>
            <Text size="sm" c="dimmed">·</Text>
            <Text size="sm" c="dimmed">₦{price.toLocaleString()} / {billing === 'annual' ? 'yr' : 'qtr'}</Text>
            <Text
              size="xs" c="#1A6B3C" fw={600}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => router.push(`/subscribe/plan?tier=${tier}&billing=${billing}`)}>
              Change
            </Text>
          </Box>
        </Group>

        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800 }} ta="center">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </Title>
          <Text size="sm" c="dimmed" ta="center">One account for all LagosApps services.</Text>
        </Stack>

        <SegmentedControl fullWidth value={tab} onChange={v => setTab(v as Tab)} mb="lg"
          data={[{ label: 'New account', value: 'signup' }, { label: 'Sign in', value: 'login' }]}
          radius="xl"
          styles={{ root: { background: '#EDF3EE', border: '1px solid #D8E6DA' }, indicator: { background: 'white' } }}
        />

        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="md">
            {tab === 'signup' && (
              <SimpleGrid cols={2} spacing="md">
                <TextInput label="First name" placeholder="Chidi" required radius="md"
                  value={form.firstName} error={errors.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, firstName: true }))} />
                <TextInput label="Last name" placeholder="Okonkwo" required radius="md"
                  value={form.lastName} error={errors.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, lastName: true }))} />
              </SimpleGrid>
            )}

            <TextInput label="Email address" type="email" placeholder="you@email.com" required radius="md"
              value={form.email} error={errors.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              onBlur={() => setTouched(p => ({ ...p, email: true }))} />

            {tab === 'signup' && (
              <TextInput label="Phone number" type="tel" placeholder="+234 801 234 5678" required radius="md"
                value={form.phone} error={errors.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                onBlur={() => setTouched(p => ({ ...p, phone: true }))} />
            )}

            <PasswordInput label="Password" placeholder={tab === 'signup' ? 'Min. 8 characters' : 'Your password'} required radius="md"
              value={form.password} error={errors.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onBlur={() => setTouched(p => ({ ...p, password: true }))} />

            {tab === 'signup' && form.password.length > 0 && (
              <Box>
                <Group gap={4} mb={4}>
                  {[1,2,3,4].map(i => (
                    <Box key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: form.password.length >= i * 2 + 2 ? (form.password.length >= 12 ? '#1A6B3C' : form.password.length >= 8 ? '#C9920A' : '#ba1a1a') : '#D8E6DA' }} />
                  ))}
                </Group>
                <Text size="xs" c="dimmed">
                  {form.password.length < 6 ? 'Too short' : form.password.length < 8 ? 'Weak' : form.password.length < 12 ? 'Fair' : 'Strong'}
                </Text>
              </Box>
            )}

            {tab === 'login' && (
              <Text size="xs" ta="right" c="#1A6B3C" style={{ cursor: 'pointer' }}
                onClick={() => router.push('/auth/forgot-password')}>
                Forgot password?
              </Text>
            )}

            <Button type="submit" radius="xl" size="md" fullWidth loading={loading}
              style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' }}>
              {tab === 'signup' ? 'Create account & continue →' : 'Sign in & continue →'}
            </Button>
          </Stack>
        </form>

        <Divider my="lg" label="or continue with" labelPosition="center" color="#D8E6DA" />
        <Button fullWidth variant="default" radius="xl" size="md"
          leftSection={<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}>
          Continue with Google
        </Button>

        <Text ta="center" size="xs" c="dimmed" mt="lg">
          By continuing you agree to our{' '}
          <Text span c="#1A6B3C" style={{ cursor: 'pointer' }}>Terms of Service</Text>
          {' '}and{' '}
          <Text span c="#1A6B3C" style={{ cursor: 'pointer' }}>Privacy Policy</Text>.
        </Text>
      </Box>
    </Box>
  )
}

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5' }} />}>
        <AccountPageInner />
      </Suspense>
    </>
  )
}
