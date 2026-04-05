'use client'
import Link from 'next/link'
import { Box, Title, Text, Card, Group, Badge, Stack, Button, Anchor, Progress, SimpleGrid } from '@mantine/core'

const INVOICES = [
  { id: 'INV-0042', date: 'Mar 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
  { id: 'INV-0041', date: 'Feb 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
  { id: 'INV-0040', date: 'Jan 19, 2026', amount: 29999, status: 'paid', plan: 'Gold Plan' },
  { id: 'INV-0039', date: 'Dec 19, 2025', amount: 12999, status: 'paid', plan: 'Silver Plan' },
  { id: 'INV-0038', date: 'Nov 19, 2025', amount: 12999, status: 'paid', plan: 'Silver Plan' },
]

export default function BillingPage() {
  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={800}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Billing</Title>
        <Text fz="sm" c="var(--color-muted)">Manage your membership plan and payment details</Text>
      </Stack>

      {/* Current plan */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
        <Group justify="space-between" wrap="wrap" gap="md" mb="lg">
          <Box>
            <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={6}>Current Plan</Text>
            <Group gap="sm" align="center" wrap="wrap">
              <Text fz={24}>🥇</Text>
              <Text ff="var(--font-montserrat)" fw={800} fz={22} c="var(--color-ink)">Gold Plan</Text>
              <Badge size="sm" radius="xl" color="green" variant="light">Active</Badge>
            </Group>
            <Text fz="sm" c="var(--color-muted)" mt={4}>₦29,999 / month · Renews Apr 19, 2026</Text>
          </Box>
          <Group gap="xs">
            <Button size="xs" radius="xl" variant="default"
              styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
              Cancel Plan
            </Button>
            <Button component={Link} href="/#membership" size="xs" radius="xl"
              style={{ background: 'var(--color-ink)', color: 'white' }}>
              Change Plan
            </Button>
          </Group>
        </Group>

        <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {[
              { label: 'Apps', used: 8, total: 'Unlimited', pct: 5, color: '#C9920A' },
              { label: 'Storage', used: '42GB', total: '200GB', pct: 21, color: '#A0521A' },
              { label: 'Team members', used: 5, total: 'Unlimited', pct: 5, color: '#4A5568' },
            ].map(u => (
              <Box key={u.label}>
                <Group justify="space-between" mb={6}>
                  <Text fz="xs" c="var(--color-muted)" fw={500}>{u.label}</Text>
                  <Text fz="xs" c="var(--color-ink)" fw={600}>{u.used} / {u.total}</Text>
                </Group>
                <Progress value={u.pct} color={u.color} size="sm" radius="xl" />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Card>

      {/* Payment method */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
        <Group justify="space-between" mb="md">
          <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Payment Method</Text>
          <Anchor fz="xs" c="var(--color-gold)" fw={600}>+ Add new</Anchor>
        </Group>
        <Group p="sm" style={{ background: 'var(--color-bg)', borderRadius: 14, border: '1px solid var(--color-border)' }} wrap="wrap">
          <Box style={{ width: 48, height: 32, borderRadius: 8, background: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            VISA
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fz="sm" fw={500} c="var(--color-ink)">•••• •••• •••• 4242</Text>
            <Text fz={10} c="var(--color-muted)">Expires 09/28 · Default card</Text>
          </Box>
          <Badge size="xs" radius="xl" color="green" variant="light">Default</Badge>
          <Anchor fz="xs" c="var(--color-muted)">Edit</Anchor>
        </Group>
      </Card>

      {/* Invoice history */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
        <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Invoice History</Text>
          <Anchor fz="xs" c="var(--color-gold)" fw={600}>Download all</Anchor>
        </Group>
        <Stack gap={0}>
          {INVOICES.map(inv => (
            <Group key={inv.id} px="lg" py="sm" gap="sm" wrap="wrap"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Box style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🧾</Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" fw={500} c="var(--color-ink)">{inv.id}</Text>
                <Text fz={10} c="var(--color-muted)">{inv.plan} · {inv.date}</Text>
              </Box>
              <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)">₦{inv.amount?.toLocaleString()}</Text>
              <Badge size="xs" radius="xl" color="green" variant="light">{inv.status}</Badge>
              <Anchor fz="xs" c="var(--color-muted)" fw={500}>PDF</Anchor>
            </Group>
          ))}
        </Stack>
      </Card>
    </Box>
  )
}
