'use client'
import { useState } from 'react'
import { Box, Title, Text, Card, Group, Badge, Stack, Button, TextInput, Select, Anchor } from '@mantine/core'

const MEMBERS = [
  { name: 'Chidi Okonkwo',  email: 'chidi@okonkwoventures.ng',  role: 'Owner',  initials: 'CO', color: '#C9920A', joined: 'Mar 1, 2025' },
  { name: 'Adaeze Nwosu',   email: 'adaeze@okonkwoventures.ng', role: 'Admin',  initials: 'AN', color: '#A0521A', joined: 'Jun 12, 2025' },
  { name: 'Babatunde Eko',  email: 'babs@okonkwoventures.ng',   role: 'Member', initials: 'BE', color: '#4A5568', joined: 'Sep 3, 2025' },
  { name: 'Funke Adeleke',  email: 'funke@okonkwoventures.ng',  role: 'Member', initials: 'FA', color: '#059669', joined: 'Jan 8, 2026' },
  { name: 'Kolade Ibrahim', email: 'kolade@okonkwoventures.ng', role: 'Viewer', initials: 'KI', color: '#6B7A8D', joined: 'Feb 20, 2026' },
]
const INVITES = [
  { email: 'temi@okonkwoventures.ng', role: 'Member', sent: '2d ago' },
  { email: 'emma@okonkwoventures.ng', role: 'Viewer', sent: '5d ago' },
]
const roleColors: Record<string, string> = { Owner: 'yellow', Admin: 'orange', Member: 'blue', Viewer: 'gray' }

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string | null>('Member')

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={800}>
      <Group justify="space-between" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Team</Title>
          <Text fz="sm" c="var(--color-muted)">{MEMBERS.length} members · 2 pending invites</Text>
        </Box>
        <Button radius="xl" size="sm" style={{ background: 'var(--color-ink)', color: 'white' }}
          onClick={() => setShowInvite(true)}>
          + Invite member
        </Button>
      </Group>

      {showInvite && (
        <Card radius="xl" mb="md" p="lg" style={{ background: 'var(--color-gold-pale)', border: '1px solid rgba(201,146,10,0.2)' }}>
          <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="md">Invite a team member</Text>
          <Group wrap="wrap" gap="sm">
            <TextInput placeholder="colleague@company.ng" type="email" radius="xl" size="sm"
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
              styles={{ input: { background: 'white' } }} />
            <Select data={['Admin', 'Member', 'Viewer']} value={inviteRole} onChange={setInviteRole}
              radius="xl" size="sm" w={130} styles={{ input: { background: 'white' } }} />
            <Button radius="xl" size="sm" style={{ background: 'var(--color-ink)', color: 'white' }}>Send invite</Button>
            <Button radius="xl" size="sm" variant="default" onClick={() => setShowInvite(false)}
              styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>Cancel</Button>
          </Group>
        </Card>
      )}

      {/* Members */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0} mb="md">
        <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" px="lg" py="md"
          style={{ borderBottom: '1px solid var(--color-border)' }}>Active Members</Text>
        <Stack gap={0}>
          {MEMBERS.map(m => (
            <Group key={m.email} px="lg" py="sm" gap="sm" wrap="wrap"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Box style={{ width: 36, height: 36, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {m.initials}
              </Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" fw={500} c="var(--color-ink)" truncate>{m.name}</Text>
                <Text fz={10} c="var(--color-muted)" truncate>{m.email}</Text>
              </Box>
              <Text fz={10} c="var(--color-subtle)" visibleFrom="md">{m.joined}</Text>
              <Badge size="xs" radius="xl" color={roleColors[m.role]} variant="light">{m.role}</Badge>
              {m.role !== 'Owner' && <Anchor fz="xs" c="var(--color-subtle)">•••</Anchor>}
            </Group>
          ))}
        </Stack>
      </Card>

      {/* Pending */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
        <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" px="lg" py="md"
          style={{ borderBottom: '1px solid var(--color-border)' }}>Pending Invites</Text>
        <Stack gap={0}>
          {INVITES.map(inv => (
            <Group key={inv.email} px="lg" py="sm" gap="sm" wrap="wrap"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Box style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>✉️</Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" fw={500} c="var(--color-ink)" truncate>{inv.email}</Text>
                <Text fz={10} c="var(--color-muted)">Invited {inv.sent} as {inv.role}</Text>
              </Box>
              <Badge size="xs" radius="xl" color="yellow" variant="light">Pending</Badge>
              <Anchor fz="xs" c="var(--color-muted)">Resend</Anchor>
              <Anchor fz="xs" c="red">Revoke</Anchor>
            </Group>
          ))}
        </Stack>
      </Card>
    </Box>
  )
}
