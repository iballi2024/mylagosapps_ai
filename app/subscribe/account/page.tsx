'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Stack, Title, Text, TextInput, PasswordInput, Button, Anchor, Divider, SegmentedControl, SimpleGrid } from '@mantine/core'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type Tab = 'signup' | 'login'

export default function JoinPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('signup')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/subscribe/payment')
  }

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
        <Box w="100%" maw={440}>
          <Stack align="center" gap="xs" mb="xl">
            <Box w={56} h={56} style={{ borderRadius: 16, background: 'var(--color-gold-pale)', border: '1px solid rgba(201,146,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🇳🇬</Box>
            <Title order={2} ff="var(--font-montserrat)" fw={800} ta="center">Create your LagosApps account</Title>
            <Text size="sm" c="dimmed" ta="center">One account. One wallet. Every service in Lagos.</Text>
          </Stack>

          <SegmentedControl fullWidth value={tab} onChange={v => setTab(v as Tab)} mb="lg"
            data={[{ label: 'New account', value: 'signup' }, { label: 'Sign in', value: 'login' }]}
            radius="xl"
            styles={{ root: { background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }, indicator: { background: 'white' } }}
          />

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {tab === 'signup' && (
                <SimpleGrid cols={2} spacing="md">
                  <TextInput label="First Name" placeholder="Chidi" required radius="md"
                    value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                  <TextInput label="Last Name" placeholder="Okonkwo" required radius="md"
                    value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                </SimpleGrid>
              )}
              <TextInput label="Email address" type="email" placeholder="you@email.com" required radius="md"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              {tab === 'signup' && (
                <TextInput label="Phone number" type="tel" placeholder="+234 801 234 5678" required radius="md"
                  value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              )}
              <PasswordInput label="Password" placeholder="Min. 8 characters" required radius="md"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <Button type="submit" radius="xl" size="md" fullWidth
                style={{ background: 'var(--color-ink)', color: 'white' }}>
                {tab === 'signup' ? 'Create account & fund wallet →' : 'Sign in →'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  )
}
