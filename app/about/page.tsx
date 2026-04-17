'use client'
import Link from 'next/link'
import Header2 from '@/app/home/components/Header2'
import {
  Box, Title, Text, Card, Group, Stack, SimpleGrid,
  Button, Badge, Anchor,
} from '@mantine/core'

const SERVICES = [
  { icon: '🍽️', name: 'Food, Groceries & Household', desc: 'Restaurant delivery, home-chef meals, groceries, and event catering across Lagos.' },
  { icon: '🚗', name: 'Cars, Vans & Rides',           desc: 'Car hire, dispatch riders, and fixed-price airport transfers — available around the clock.' },
  { icon: '🏥', name: 'Health & Wellness',            desc: 'Pharmacy delivery, home lab tests, and video consultations with licensed physicians.' },
  { icon: '🎉', name: 'Events & Studios',             desc: 'Venue hire, TV studio rentals, audio recording, and tickets to live events.' },
  { icon: '☀️', name: 'Solar & Renewables',           desc: 'Solar audits, panel installation, inverters, and clean energy solutions for homes and businesses.' },
]

const VALUES = [
  { icon: '🤝', title: 'Reliability',   body: 'We show up when we say we will. Every service, every time.' },
  { icon: '🔒', title: 'Trust',          body: 'Vetted providers, transparent pricing, and no hidden charges.' },
  { icon: '⚡', title: 'Speed',          body: 'Built for Lagos — fast dispatch, real-time tracking, instant confirmations.' },
  { icon: '🌍', title: 'Community',      body: 'We invest in local talent, local businesses, and a stronger Lagos economy.' },
]

const TEAM = [
  { initials: 'AO', name: 'Adaeze Okonkwo',  role: 'CEO & Co-founder',        bio: 'Former product lead at Flutterwave. Built LagosApps to solve the fragmented services problem she experienced daily.' },
  { initials: 'TI', name: 'Taiwo Ige',        role: 'CTO & Co-founder',        bio: 'Full-stack engineer with a decade at Andela and Paystack. Obsessed with systems that scale across unreliable networks.' },
  { initials: 'FO', name: 'Folake Ogundimu',  role: 'Head of Operations',      bio: 'Logistics veteran who coordinated last-mile delivery for 3 of Nigeria\'s top e-commerce platforms.' },
  { initials: 'KA', name: 'Kunle Adeyemi',    role: 'Head of Partnerships',    bio: 'Built and managed vendor networks of 500+ restaurants and service providers across West Africa.' },
]

export default function AboutPage() {
  return (
    <>
      <Header2 />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

        {/* Hero */}
        <Box px="md" py={72} style={{ background: 'linear-gradient(135deg, #1A6B3C, #2E9E5B)', textAlign: 'center' }}>
          <Box maw={700} mx="auto">
            <Badge size="lg" radius="xl" mb="md"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontWeight: 600 }}>
              About LagosApps
            </Badge>
            <Title order={1} ff="var(--font-montserrat)" fw={900} fz={{ base: 32, md: 48 }} c="white" lh={1.2} mb="md">
              One app for everything Lagos needs
            </Title>
            <Text fz={{ base: 'md', md: 'lg' }} c="rgba(255,255,255,0.8)" lh={1.7} mb="xl">
              LagosApps is a super-app connecting Lagos residents to essential services — food, rides, healthcare, events, and clean energy — through a single, seamless platform.
            </Text>
            <Group justify="center" gap="md" wrap="wrap">
              <Button component={Link} href="/auth/signup" size="md" radius="xl"
                style={{ background: 'white', color: '#1A6B3C', fontWeight: 700 }}>
                Get started →
              </Button>
              <Button component="a" href="https://wa.me/2348001000000" target="_blank"
                size="md" radius="xl"
                style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
                💬 Chat with us
              </Button>
            </Group>
          </Box>
        </Box>

        <Box maw={1000} mx="auto" px="md">

          {/* Our story */}
          <Box py={72}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48} style={{ alignItems: 'center' }}>
              <Box>
                <Text fz="xs" tt="uppercase" fw={700} c="#1A6B3C" style={{ letterSpacing: 2 }} mb="xs">Our story</Text>
                <Title order={2} ff="var(--font-montserrat)" fw={800} fz={{ base: 26, md: 34 }} c="var(--color-ink)" mb="md" lh={1.25}>
                  Built out of everyday Lagos frustration
                </Title>
                <Stack gap="md">
                  <Text fz="sm" c="var(--color-muted)" lh={1.8}>
                    Lagos is one of the most dynamic cities on earth — but getting things done here has always meant juggling a dozen different apps, phone numbers, and middlemen. A pharmacy delivery here, a ride app there, a WhatsApp group for your catering enquiry.
                  </Text>
                  <Text fz="sm" c="var(--color-muted)" lh={1.8}>
                    LagosApps was founded in 2023 to change that. Our goal is simple: give every Lagos resident access to the services they need in one place, with the quality and reliability of a premium experience at every price point.
                  </Text>
                  <Text fz="sm" c="var(--color-muted)" lh={1.8}>
                    Today we serve tens of thousands of users across the city, partnering with hundreds of local businesses, healthcare providers, logistics companies, and creative professionals.
                  </Text>
                </Stack>
              </Box>
              <SimpleGrid cols={2} spacing="sm">
                {[
                  { value: '200+', label: 'Restaurant partners' },
                  { value: '50k+', label: 'Active users' },
                  { value: '24/7', label: 'Service availability' },
                  { value: '5★',   label: 'Average rating' },
                ].map(stat => (
                  <Card key={stat.label} radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', textAlign: 'center' }}>
                    <Text ff="var(--font-montserrat)" fw={900} fz={32} c="#1A6B3C">{stat.value}</Text>
                    <Text fz="xs" c="var(--color-muted)" fw={500}>{stat.label}</Text>
                  </Card>
                ))}
              </SimpleGrid>
            </SimpleGrid>
          </Box>

          {/* Services */}
          <Box pb={72}>
            <Box style={{ textAlign: 'center' }} mb="xl">
              <Text fz="xs" tt="uppercase" fw={700} c="#1A6B3C" style={{ letterSpacing: 2 }} mb="xs">What we offer</Text>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={{ base: 24, md: 32 }} c="var(--color-ink)">Five verticals, one platform</Title>
            </Box>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {SERVICES.map(s => (
                <Card key={s.name} radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={36} mb="sm">{s.icon}</Text>
                  <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)" mb={6}>{s.name}</Text>
                  <Text fz="xs" c="var(--color-muted)" lh={1.7}>{s.desc}</Text>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Values */}
          <Box pb={72}>
            <Box style={{ textAlign: 'center' }} mb="xl">
              <Text fz="xs" tt="uppercase" fw={700} c="#1A6B3C" style={{ letterSpacing: 2 }} mb="xs">What drives us</Text>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={{ base: 24, md: 32 }} c="var(--color-ink)">Our values</Title>
            </Box>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {VALUES.map(v => (
                <Card key={v.title} radius="xl" p="lg"
                  style={{ background: '#E8F5EE', border: '1px solid #C3E6D0' }}>
                  <Group gap="md" align="flex-start">
                    <Text fz={32}>{v.icon}</Text>
                    <Box style={{ flex: 1 }}>
                      <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)" mb={4}>{v.title}</Text>
                      <Text fz="xs" c="var(--color-muted)" lh={1.7}>{v.body}</Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Team */}
          <Box pb={72}>
            <Box style={{ textAlign: 'center' }} mb="xl">
              <Text fz="xs" tt="uppercase" fw={700} c="#1A6B3C" style={{ letterSpacing: 2 }} mb="xs">The people</Text>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={{ base: 24, md: 32 }} c="var(--color-ink)">Meet the team</Title>
            </Box>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {TEAM.map(m => (
                <Card key={m.name} radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)' }}>
                  <Group gap="md" align="flex-start" wrap="nowrap">
                    <Box style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #2E9E5B, #1A6B3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {m.initials}
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)">{m.name}</Text>
                      <Text fz="xs" fw={600} c="#1A6B3C" mb={6}>{m.role}</Text>
                      <Text fz="xs" c="var(--color-muted)" lh={1.6}>{m.bio}</Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* CTA */}
          <Box pb={72}>
            <Card radius="xl" p={{ base: 'xl', md: 48 }}
              style={{ background: 'linear-gradient(135deg, #1A6B3C, #2E9E5B)', textAlign: 'center' }}>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={{ base: 24, md: 32 }} c="white" mb="sm">
                Ready to experience Lagos differently?
              </Title>
              <Text fz="sm" c="rgba(255,255,255,0.8)" mb="xl" lh={1.7}>
                Join thousands of Lagos residents who have made LagosApps their go-to for everyday needs.
              </Text>
              <Group justify="center" gap="md" wrap="wrap">
                <Button component={Link} href="/auth/signup" size="md" radius="xl"
                  style={{ background: 'white', color: '#1A6B3C', fontWeight: 700 }}>
                  Create free account →
                </Button>
                <Button component="a" href="https://wa.me/2348001000000" target="_blank"
                  size="md" radius="xl" variant="outline"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: 700 }}>
                  💬 Talk to us first
                </Button>
              </Group>
            </Card>
          </Box>

        </Box>
      </Box>
    </>
  )
}
