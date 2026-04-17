'use client'
import Link from 'next/link'
import { Box, Stack, Title, Text, Card, Group, Badge, Button, Divider, Anchor } from '@mantine/core'
import { SERVICE_CATEGORIES } from '@/context/PlatformContext'

export default function ServicesPage() {
  return (
    <Box p={{ base: 'md', lg: 'xl' }}>
      <Group justify="space-between" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Title order={2} ff="var(--font-montserrat)" fw={800}>Services</Title>
          <Text size="sm" c="dimmed">All {SERVICE_CATEGORIES.length} LagosApps service categories on your account</Text>
        </Box>
        <Button component={Link} href="/dashboard/contact-admin" radius="xl" size="sm"
          style={{ background: 'var(--color-ink)', color: 'white' }}>
          Contact Admin
        </Button>
      </Group>

      <Stack gap="xl">
        {SERVICE_CATEGORIES.map(cat => (
          <Card key={cat.id} withBorder radius="xl" p={0}
            style={{ border: '1px solid var(--color-border)', overflow: 'hidden' }}>

            {/* Category header bar */}
            <Box h={5} style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.colorLight})` }} />

            <Box p="md" pb="xs">
              <Group gap="sm">
                <Box w={44} h={44} style={{
                  background: cat.colorPale,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {cat.icon}
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text fw={700} ff="var(--font-montserrat)" style={{ color: cat.color }}>{cat.name}</Text>
                  <Text size="xs" c="dimmed" lh={1.5}>{cat.tagline}</Text>
                </Box>
              </Group>
            </Box>

            <Divider />

            {/* Sub-item rows */}
            <Stack gap={0}>
              {cat.items.map((item, idx) => (
                <Box key={item.id}>
                  <Group px="md" py="sm" gap="sm" wrap="nowrap" align="flex-start"
                    style={idx < cat.items.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : {}}>

                    <Box style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: cat.colorPale,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      {item.icon}
                    </Box>

                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text fz="sm" fw={600} c="var(--color-ink)">{item.name}</Text>
                      {item.description && (
                        <Text fz={11} c="dimmed" lh={1.5} mt={2}>{item.description}</Text>
                      )}
                    </Box>

                    <Box style={{ flexShrink: 0, marginTop: 2 }}>
                      {item.comingSoon ? (
                        <Badge size="sm" radius="xl"
                          style={{ background: 'var(--color-surface2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                          Coming Soon
                        </Badge>
                      ) : item.href ? (
                        <Anchor
                          component="a"
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          fz="xs"
                          fw={700}
                          style={{ color: cat.color, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          Visit ↗
                        </Anchor>
                      ) : (
                        <Badge size="sm" radius="xl" variant="light" color="gray">
                          Info
                        </Badge>
                      )}
                    </Box>
                  </Group>
                </Box>
              ))}
            </Stack>

            {/* Card footer */}
            <Box px="md" py="sm" style={{ background: 'var(--color-surface2)', borderTop: '1px solid var(--color-border)' }}>
              <Group justify="space-between" align="center">
                <Text fz={11} c="dimmed">
                  {cat.items.filter(i => i.href).length} bookable{' '}
                  · {cat.items.filter(i => !i.href && !i.comingSoon).length} informational
                  {cat.items.some(i => i.comingSoon) ? ` · ${cat.items.filter(i => i.comingSoon).length} coming soon` : ''}
                </Text>
                <Anchor component={Link} href="/dashboard/contact-admin" fz={11} fw={600} c="var(--color-gold)"
                  style={{ textDecoration: 'none' }}>
                  Enquire →
                </Anchor>
              </Group>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
