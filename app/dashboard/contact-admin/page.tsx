'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Box, Title, Text, Card, Stack, Group, Button,
  TextInput, Textarea, Select, Alert,
} from '@mantine/core'
import { useAuthContext } from '@/context/AuthContext'

const CATEGORIES = [
  { value: 'billing',      label: '🧾  Billing & Payments' },
  { value: 'subscription', label: '📋  Subscription Issue' },
  { value: 'service',      label: '🛠️  Service Complaint' },
  { value: 'technical',    label: '💻  Technical Problem' },
  { value: 'account',      label: '👤  Account & Profile' },
  { value: 'other',        label: '💬  Other' },
]

const inputStyles = {
  label: {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    color: 'var(--color-muted)',
    fontWeight: 600,
  },
}

type FormState = {
  category: string | null
  subject: string
  message: string
  orderId: string
}

const EMPTY: FormState = { category: null, subject: '', message: '', orderId: '' }

export default function ContactAdminPage() {
  const { user, isAuthenticated } = useAuthContext()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [ticketRef, setTicketRef] = useState('')

  const set = (field: keyof FormState) => (
    (val: string | null) => setForm(p => ({ ...p, [field]: val ?? '' }))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated || !user) {
      setError('You must be logged in to submit a complaint.')
      return
    }
    if (!form.category) { setError('Please select a category.'); return }
    if (!form.subject.trim()) { setError('Please enter a subject.'); return }
    if (form.message.trim().length < 20) { setError('Message must be at least 20 characters.'); return }

    setLoading(true)
    try {
      // Payload includes the authenticated user's identity automatically
      // Replace the simulate block below with your real API call, e.g.:
      // await apiSubmitComplaint({
      //   userId:   user.id,
      //   name:     `${user.firstName} ${user.lastName}`,
      //   email:    user.email,
      //   phone:    user.phone,
      //   category: form.category,
      //   subject:  form.subject,
      //   orderId:  form.orderId || null,
      //   message:  form.message,
      // })
      await new Promise(res => setTimeout(res, 1200))
      const ref = `TKT-${Date.now().toString(36).toUpperCase().slice(-6)}`
      setTicketRef(ref)
      setSubmitted(true)
    } catch {
      setError('Failed to send your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : ''

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={680}>

      {/* Header */}
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">
          Contact Admin
        </Title>
        <Text fz="sm" c="var(--color-muted)">
          Have a complaint or question? We&apos;ll get back to you within 24 hours.
        </Text>
      </Stack>

      {submitted ? (
        <SuccessCard ticketRef={ticketRef} onReset={() => { setForm(EMPTY); setSubmitted(false) }} />
      ) : (
        <>
          {/* Sending-as banner */}
          {user && (
            <Card radius="xl" p="sm" mb="md"
              style={{ background: '#EDF3EE', border: '1px solid #D8E6DA' }}>
              <Group gap="sm" wrap="nowrap">
                <Box style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--color-gold-pale)',
                  border: '2px solid rgba(201,146,10,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                  fontSize: 13, color: 'var(--color-gold)', flexShrink: 0,
                }}>
                  {initials}
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fz="xs" fw={600} c="#1A6B3C">
                    Sending as {user.firstName} {user.lastName}
                  </Text>
                  <Text fz={11} c="#2E9E5B" truncate>{user.email}</Text>
                </Box>
                <Box style={{
                  background: 'rgba(46,158,91,0.15)', borderRadius: 20,
                  padding: '2px 10px',
                }}>
                  <Text fz={10} fw={700} c="#1A6B3C" tt="uppercase" style={{ letterSpacing: 1 }}>
                    Verified
                  </Text>
                </Box>
              </Group>
            </Card>
          )}

          {/* Main form */}
          <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
            <Box pb="md" mb="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Submit a complaint</Text>
              <Text fz="xs" c="var(--color-muted)" mt={2}>All fields marked * are required</Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Alert color="red" radius="md" withCloseButton onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                <Select
                  label="Category *"
                  placeholder="What is your complaint about?"
                  data={CATEGORIES}
                  value={form.category}
                  onChange={set('category')}
                  size="md"
                  radius="xl"
                  styles={inputStyles}
                  checkIconPosition="right"
                />

                <TextInput
                  label="Subject *"
                  placeholder="Brief summary of your issue"
                  value={form.subject}
                  onChange={e => set('subject')(e.target.value)}
                  size="md"
                  radius="xl"
                  styles={inputStyles}
                  maxLength={120}
                />

                <TextInput
                  label="Order / Reference ID (optional)"
                  placeholder="e.g. ORD-ABC123 — if your complaint relates to an order"
                  value={form.orderId}
                  onChange={e => set('orderId')(e.target.value)}
                  size="md"
                  radius="xl"
                  styles={inputStyles}
                />

                <Textarea
                  label="Message *"
                  placeholder="Describe your complaint in detail. Include dates, amounts, or any other relevant information..."
                  value={form.message}
                  onChange={e => set('message')(e.target.value)}
                  size="md"
                  radius="xl"
                  styles={inputStyles}
                  minRows={5}
                  autosize
                  maxLength={2000}
                />

                <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                  <Text fz={11} c="var(--color-muted)">
                    {form.message.length} / 2000 characters
                  </Text>
                  <Button
                    type="submit"
                    radius="xl"
                    size="md"
                    loading={loading}
                    disabled={!isAuthenticated}
                    style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700, minWidth: 160 }}
                  >
                    {loading ? 'Sending...' : 'Send complaint'}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>

          {/* Alternative contact channels */}
          <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
            <Box pb="md" mb="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Other ways to reach us</Text>
              <Text fz="xs" c="var(--color-muted)" mt={2}>Prefer a faster channel?</Text>
            </Box>

            <Stack gap={0}>
              <Group
                justify="space-between" py="sm" wrap="wrap"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <Group gap="sm">
                  <Box style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(37,211,102,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    💬
                  </Box>
                  <Box>
                    <Text fz="sm" fw={600} c="var(--color-ink)">WhatsApp</Text>
                    <Text fz={11} c="var(--color-muted)">Fastest response — typically under 1 hour</Text>
                  </Box>
                </Group>
                <Button
                  component="a"
                  href="https://wa.me/2348001000000"
                  target="_blank"
                  size="xs"
                  radius="xl"
                  styles={{ root: { background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' } }}
                >
                  Open WhatsApp
                </Button>
              </Group>

              <Group justify="space-between" py="sm" wrap="wrap">
                <Group gap="sm">
                  <Box style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--color-gold-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    📧
                  </Box>
                  <Box>
                    <Text fz="sm" fw={600} c="var(--color-ink)">Email</Text>
                    <Text fz={11} c="var(--color-muted)">support@lagosapps.com · 24-hour response</Text>
                  </Box>
                </Group>
                <Button
                  component="a"
                  href="mailto:support@lagosapps.com"
                  size="xs"
                  radius="xl"
                  variant="default"
                >
                  Send email
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* Response time notice */}
          <Card radius="xl" p="md"
            style={{ background: '#EDF3EE', border: '1px solid #D8E6DA' }}>
            <Group gap="sm" wrap="nowrap">
              <Text fz={22}>🕐</Text>
              <Box>
                <Text fz="sm" fw={600} c="#1A6B3C">Response time</Text>
                <Text fz="xs" c="#2E9E5B" mt={2}>
                  Complaints submitted via this form are reviewed within <strong>24 hours</strong> on
                  business days. For urgent issues, use WhatsApp above.
                </Text>
              </Box>
            </Group>
          </Card>
        </>
      )}
    </Box>
  )
}

function SuccessCard({ ticketRef, onReset }: { ticketRef: string; onReset: () => void }) {
  return (
    <Card radius="xl" withBorder p="xl" style={{ textAlign: 'center', borderColor: 'var(--color-border)' }}>
      <Text fz={48} mb="sm">✅</Text>
      <Title order={2} ff="var(--font-montserrat)" fw={800} fz={22} c="var(--color-ink)" mb={6}>
        Complaint received
      </Title>
      <Text fz="sm" c="var(--color-muted)" mb="md">
        Your message has been sent to our admin team. We&apos;ll get back to you within 24 hours.
      </Text>
      <Box
        style={{
          display: 'inline-block', background: '#EDF3EE', border: '1px solid #D8E6DA',
          borderRadius: 12, padding: '8px 20px', marginBottom: 24,
        }}
      >
        <Text fz={11} tt="uppercase" fw={600} style={{ letterSpacing: 2 }} c="var(--color-muted)">Ticket reference</Text>
        <Text ff="var(--font-montserrat)" fw={800} fz={18} c="#1A6B3C">{ticketRef}</Text>
      </Box>
      <Group justify="center" gap="sm" wrap="wrap">
        <Button component={Link} href="/dashboard" radius="xl" size="md" variant="default">
          Back to dashboard
        </Button>
        <Button onClick={onReset} radius="xl" size="md"
          style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
          Submit another
        </Button>
      </Group>
    </Card>
  )
}
