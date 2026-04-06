'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, TextInput, Button, Group, Card, Divider, Tabs, Checkbox, CopyButton, ActionIcon, Tooltip, Select } from '@mantine/core'
import Navbar from '@/components/Navbar'

type Tier = 'bronze' | 'silver' | 'gold'
type Billing = 'annual' | 'quarterly'

const PLANS: Record<Tier, { name: string; icon: string; color: string }> = {
  bronze: { name: 'Bronze', icon: '🥉', color: '#6B7C2A' },
  silver: { name: 'Silver', icon: '🥈', color: '#3D6B5E' },
  gold:   { name: 'Gold',   icon: '🥇', color: '#1A6B3C' },
}
const PRICES: Record<Tier, Record<Billing, number>> = {
  bronze: { annual: 100000, quarterly: 30000 },
  silver: { annual: 250000, quarterly: 75000 },
  gold:   { annual: 500000, quarterly: 200000 },
}

const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT — Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
].map(s => ({ value: s, label: s }))

const COUNTRIES = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'ZA', label: 'South Africa' },
]


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

function PaymentPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const tier = (params.get('tier') as Tier) ?? 'silver'
  const billing = (params.get('billing') as Billing) ?? 'annual'
  const plan = PLANS[tier]
  const price = PRICES[tier][billing]

  const [cardForm, setCardForm] = useState({
    address1: '', address2: '', city: '', state: '', postalCode: '', country: 'NG',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [transferConfirmed, setTransferConfirmed] = useState(false)

  const cardErrors: Record<string, string> = {}
  if (touched.address1 && !cardForm.address1.trim()) cardErrors.address1 = 'Required'
  if (touched.city && !cardForm.city.trim()) cardErrors.city = 'Required'
  if (touched.state && !cardForm.state) cardErrors.state = 'Required'

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ address1: true, city: true, state: true })
    if (!cardForm.address1.trim() || !cardForm.city.trim() || !cardForm.state) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/subscribe/confirmed?tier=${tier}`)
    }, 1400)
  }

  return (
    <Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
      <Box w="100%" maw={480}>
        <StepBar step={3} />

        <Stack gap="xs" mb="xl" ta="center">
          <Title order={2} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800 }}>Complete payment</Title>
          <Text size="sm" c="dimmed">Secure payment · SSL encrypted</Text>
        </Stack>

        {/* Order summary */}
        <Card withBorder radius="xl" p="md" mb="lg" style={{ background: '#EDF3EE', borderColor: '#D8E6DA' }}>
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <Text>{plan.icon}</Text>
              <Text fw={600} style={{ color: plan.color }}>{plan.name} Membership</Text>
            </Group>
            <Text fw={700}>₦{price?.toLocaleString()}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">{billing === 'annual' ? 'Billed annually' : 'Billed quarterly'}</Text>
            <Text size="xs" c="dimmed">Next renewal: {billing === 'annual' ? '1 year' : '3 months'}</Text>
          </Group>
          <Divider my="sm" color="#D8E6DA" />
          <Group justify="space-between">
            <Text fw={700} style={{ fontFamily: 'var(--font-montserrat)' }}>Total</Text>
            <Text fw={800} style={{ color: '#1A6B3C', fontSize: 20, fontFamily: 'var(--font-montserrat)' }}>₦{price?.toLocaleString()}</Text>
          </Group>
        </Card>

        {/* Payment method tabs */}
        <Tabs defaultValue="card" radius="md">
          <Tabs.List mb="md" style={{ borderColor: '#D8E6DA' }}>
            <Tabs.Tab value="card" fw={600}>💳 Card</Tabs.Tab>
            <Tabs.Tab value="transfer" fw={600}>🏦 Bank Transfer</Tabs.Tab>
          </Tabs.List>

          {/* Card tab */}
          <Tabs.Panel value="card">
            <form onSubmit={handleCardSubmit} noValidate>
              <Stack gap="md">
                <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Billing Address</Text>
                <TextInput
                  label="Street address"
                  placeholder="12 Broad Street"
                  radius="md" required
                  value={cardForm.address1}
                  error={cardErrors.address1}
                  onChange={e => setCardForm(p => ({ ...p, address1: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, address1: true }))}
                />
                <TextInput
                  label={<Group gap={4}><Text size="sm">Apt / Floor / Suite</Text><Text size="xs" c="dimmed">(optional)</Text></Group>}
                  placeholder="Flat 3, 2nd Floor"
                  radius="md"
                  value={cardForm.address2}
                  onChange={e => setCardForm(p => ({ ...p, address2: e.target.value }))}
                />
                <Group grow>
                  <TextInput
                    label="City"
                    placeholder="Lagos"
                    radius="md" required
                    value={cardForm.city}
                    error={cardErrors.city}
                    onChange={e => setCardForm(p => ({ ...p, city: e.target.value }))}
                    onBlur={() => setTouched(p => ({ ...p, city: true }))}
                  />
                  <TextInput
                    label={<Group gap={4}><Text size="sm">Postal code</Text><Text size="xs" c="dimmed">(optional)</Text></Group>}
                    placeholder="100001"
                    radius="md"
                    inputMode="numeric"
                    maxLength={10}
                    value={cardForm.postalCode}
                    onChange={e => setCardForm(p => ({ ...p, postalCode: e.target.value.replace(/\D/g, '') }))}
                  />
                </Group>
                <Group grow>
                  <Select
                    label="State"
                    placeholder="Select state"
                    radius="md" required
                    data={NG_STATES}
                    searchable
                    value={cardForm.state}
                    error={cardErrors.state}
                    onChange={v => { setCardForm(p => ({ ...p, state: v ?? '' })); setTouched(p => ({ ...p, state: true })) }}
                  />
                  <Select
                    label="Country"
                    radius="md" required
                    data={COUNTRIES}
                    value={cardForm.country}
                    onChange={v => setCardForm(p => ({ ...p, country: v ?? 'NG' }))}
                  />
                </Group>

                <Button type="submit" fullWidth radius="xl" size="lg" fw={700} loading={loading}
                  style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' }}>
                  🔒 Pay ₦{price?.toLocaleString()}
                </Button>
                <Text ta="center" size="xs" c="dimmed">
                  Your card is charged immediately. Membership activates on payment.
                </Text>
              </Stack>
            </form>
          </Tabs.Panel>

          {/* Bank transfer tab */}
          <Tabs.Panel value="transfer">
            <Stack gap="md">
              <Card withBorder radius="xl" p="lg" style={{ background: '#EDF3EE' }}>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md" style={{ letterSpacing: 1 }}>Transfer to</Text>
                <Stack gap="sm">
                  {[
                    { label: 'Bank', value: 'GTBank (Guaranty Trust Bank)' },
                    { label: 'Account name', value: 'LagosApps Technologies Ltd' },
                    { label: 'Account number', value: '0123456789', copy: true },
                    { label: 'Amount', value: `₦${price?.toLocaleString()}` },
                    { label: 'Reference', value: `LAGOS-${tier.toUpperCase()}-${Date.now().toString().slice(-6)}`, copy: true },
                  ].map(row => (
                    <Group key={row.label} justify="space-between">
                      <Text size="sm" c="dimmed">{row.label}</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={600}>{row.value}</Text>
                        {row.copy && (
                          <CopyButton value={row.value}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
                                <ActionIcon size="sm" variant="subtle" onClick={copy} color={copied ? 'teal' : 'gray'}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{copied ? 'check' : 'content_copy'}</span>
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        )}
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>

              <Text size="xs" c="dimmed" ta="center">
                Include the reference code in your transfer narration. Your membership activates within 30 minutes of payment confirmation.
              </Text>

              <Checkbox
                label="I have completed the bank transfer"
                radius="sm"
                color="#1A6B3C"
                checked={transferConfirmed}
                onChange={e => setTransferConfirmed(e.currentTarget.checked)}
              />

              <Button fullWidth radius="xl" size="lg" fw={700} disabled={!transferConfirmed}
                style={transferConfirmed ? { background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' } : {}}
                onClick={() => router.push(`/subscribe/confirmed?tier=${tier}`)}>
                I&apos;ve paid — Activate my membership →
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  )
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Box pt={64} style={{ minHeight: '100vh', background: '#F5F8F5' }} />}>
        <PaymentPageInner />
      </Suspense>
    </>
  )
}
