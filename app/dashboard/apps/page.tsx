'use client'
import Link from 'next/link'
import { Box, Stack, Title, Text, Card, Group, Badge, Button, SimpleGrid, Divider } from '@mantine/core'
import { usePlatform, SUBSIDIARIES } from '@/context/PlatformContext'

export default function ServicesPage() {
  const { formatPrice } = usePlatform()

  return (
    <Box p={{ base: 'md', lg: 'xl' }}>
      <Group justify="space-between" mb="xl" wrap="wrap" gap="sm">
        <Box>
          <Title order={2} ff="var(--font-montserrat)" fw={800}>Services</Title>
          <Text size="sm" c="dimmed">All {SUBSIDIARIES.length} LagosApps services on your account</Text>
        </Box>
        <Button component={Link} href="/dashboard/contact-admin" radius="xl" size="sm"
          style={{ background: 'var(--color-ink)', color: 'white' }}>
          Contact Admin
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="lg">
        {SUBSIDIARIES.map(sub => {
          const lowestPrice = Math.min(...sub.services.map(s => s.startingPrice))
          return (
            <Card key={sub.id} component={Link} href={`/services/${sub.slug}`}
              withBorder radius="xl" p={0}
              style={{ textDecoration: 'none', overflow: 'hidden', transition: 'all 0.2s', border: '1px solid var(--color-border)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <Box h={6} style={{ background: `linear-gradient(90deg, ${sub.color}, ${sub.colorLight})` }} />
              <Box p="md">
                <Group gap="sm" mb="sm">
                  <Box w={44} h={44} style={{ background: sub.colorPale, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {sub.icon}
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Text fw={700} ff="var(--font-montserrat)" style={{ color: sub.color }}>{sub.name}</Text>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>{sub.category}</Text>
                  </Box>
                </Group>
                <Text size="xs" c="dimmed" mb="sm" lh={1.6}>{sub.tagline}</Text>
                <Group gap={6} mb="sm" wrap="wrap">
                  {sub.services.map(sv => (
                    <Badge key={sv.id} size="sm" radius="xl"
                      style={sv.popular
                        ? { background: sub.color, color: 'white' }
                        : { background: 'var(--color-surface2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      {sv.popular ? `★ ${sv.name}` : sv.name}
                    </Badge>
                  ))}
                </Group>
                <Divider mb="sm" />
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">From {formatPrice(lowestPrice)}</Text>
                  <Text size="xs" fw={700} style={{ color: sub.color }}>Order now →</Text>
                </Group>
              </Box>
            </Card>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
