'use client'
import { useState } from 'react'
import { Box, Title, Text, TextInput, Card, Stack, Group, Button, Switch, Anchor, SimpleGrid } from '@mantine/core'

export default function SettingsPage() {
  const [profile, setProfile] = useState({ firstName: 'Chidi', lastName: 'Okonkwo', email: 'chidi@okonkwoventures.ng', company: 'Okonkwo Ventures', phone: '+234 801 234 5678' })
  const [notifications, setNotifications] = useState({ billing: true, team: true, apps: false, marketing: false })
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const inputStyles = { label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 } }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={720}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Settings</Title>
        <Text fz="sm" c="var(--color-muted)">Manage your account and preferences</Text>
      </Stack>

      {/* Profile */}
      <Section title="Profile" desc="Update your personal information">
        <Group gap="md" mb="lg" pb="lg" style={{ borderBottom: '1px solid var(--color-border)' }} wrap="wrap">
          <Box style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-gold-pale)', border: '2px solid rgba(201,146,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 20, color: 'var(--color-gold)', flexShrink: 0 }}>CO</Box>
          <Box>
            <Text fz="sm" fw={600} c="var(--color-ink)">Chidi Okonkwo</Text>
            <Anchor fz="xs" c="var(--color-gold)" fw={600}>Change photo</Anchor>
          </Box>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
          <TextInput label="First Name" size="md" radius="xl" styles={inputStyles} value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
          <TextInput label="Last Name" size="md" radius="xl" styles={inputStyles} value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
          <TextInput label="Email Address" type="email" size="md" radius="xl" styles={inputStyles} value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          <TextInput label="Phone Number" type="tel" size="md" radius="xl" styles={inputStyles} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
        </SimpleGrid>
        <TextInput label="Company Name" size="md" radius="xl" styles={inputStyles} value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" desc="Choose what you want to be notified about">
        <Stack gap={0}>
          {[
            { key: 'billing',   label: 'Billing alerts',  desc: 'Renewals, failed payments and receipts' },
            { key: 'team',      label: 'Team activity',   desc: 'New members, role changes and invites' },
            { key: 'apps',      label: 'App updates',     desc: 'Usage limits, errors and maintenance' },
            { key: 'marketing', label: 'News & offers',   desc: 'Product updates, tips and promos' },
          ].map((n, i, arr) => (
            <Group key={n.key} justify="space-between" py="sm" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <Box style={{ flex: 1, paddingRight: 16 }}>
                <Text fz="sm" fw={500} c="var(--color-ink)">{n.label}</Text>
                <Text fz={11} c="var(--color-muted)" mt={2}>{n.desc}</Text>
              </Box>
              <Switch checked={notifications[n.key as keyof typeof notifications]}
                onChange={e => setNotifications(p => ({ ...p, [n.key]: e.currentTarget.checked }))}
                color="var(--color-ink)" size="sm" />
            </Group>
          ))}
        </Stack>
      </Section>

      {/* Security */}
      <Section title="Security" desc="Manage your password and login settings">
        <Stack gap={0}>
          {[
            { label: 'Password', sub: 'Last changed 3 months ago', action: 'Change', style: { color: 'var(--color-gold)', fontWeight: 600, fontSize: 12 } },
            { label: 'Two-factor authentication', sub: 'Add an extra layer of security', action: 'Enable', style: { color: 'var(--color-muted)', fontWeight: 500, fontSize: 12 } },
            { label: 'Active sessions', sub: '2 devices currently signed in', action: 'Sign out all', style: { color: '#E03131', fontWeight: 600, fontSize: 12 } },
          ].map((s, i, arr) => (
            <Group key={s.label} justify="space-between" py="sm" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }} wrap="wrap">
              <Box>
                <Text fz="sm" fw={500} c="var(--color-ink)">{s.label}</Text>
                <Text fz={11} c="var(--color-muted)" mt={2}>{s.sub}</Text>
              </Box>
              <Anchor style={s.style}>{s.action}</Anchor>
            </Group>
          ))}
        </Stack>
      </Section>

      {/* Danger */}
      <Section title="Danger Zone" desc="Irreversible and destructive actions">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Box>
            <Text fz="sm" fw={500} c="var(--color-ink)">Delete account</Text>
            <Text fz={11} c="var(--color-muted)" mt={2}>Permanently delete your account and all data</Text>
          </Box>
          <Button size="xs" radius="xl" variant="outline"
            styles={{ root: { borderColor: '#FFC9C9', color: '#E03131', ':hover': { background: '#FFF5F5' } } }}>
            Delete account
          </Button>
        </Group>
      </Section>

      <Group gap="sm" mt="xl" wrap="wrap">
        <Button onClick={handleSave} radius="xl" size="md"
          style={{ background: saved ? '#2F9E44' : 'var(--color-ink)', color: 'white', fontWeight: 700 }}>
          {saved ? '✓ Saved!' : 'Save changes'}
        </Button>
        <Button radius="xl" size="md" variant="default"
          styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
          Discard
        </Button>
      </Group>
    </Box>
  )
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
      <Box pb="md" mb="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">{title}</Text>
        <Text fz="xs" c="var(--color-muted)" mt={2}>{desc}</Text>
      </Box>
      {children}
    </Card>
  )
}
