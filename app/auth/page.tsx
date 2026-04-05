'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Stack, Title, Text, Button } from '@mantine/core'

type Tier = 'bronze' | 'silver' | 'gold'
type Billing = 'annual' | 'quarterly'

function AuthGatewayInner() {
  const params = useSearchParams()
  const tier = params.get('tier') as Tier | null
  const billing = params.get('billing') as Billing | null

  const next = tier && billing
    ? encodeURIComponent(`/subscribe/payment?tier=${tier}&billing=${billing}`)
    : encodeURIComponent('/dashboard')

  return (
    <Box w="100%" maw={400}>
      <Stack align="center" gap="xs" mb={40}>
        <Title order={2} style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800 }} ta="center">
          Sign in or create an account
        </Title>
        <Text size="sm" c="dimmed" ta="center" maw={320}>
          You need a LagosApps account to continue. It only takes a minute.
        </Text>
      </Stack>

      <Stack gap="md">
        <Button
          component="a"
          href={`/auth/signup?next=${next}`}
          fullWidth radius="xl" size="lg" fw={700}
          style={{ background: 'linear-gradient(135deg, #2E9E5B, #3DA96E)', color: 'white' }}>
          Create a new account →
        </Button>
        <Button
          component="a"
          href={`/auth/login?next=${next}`}
          fullWidth radius="xl" size="lg" fw={500}
          variant="default">
          Sign in to existing account
        </Button>
      </Stack>

      <Text ta="center" size="xs" c="dimmed" mt="xl">
        By continuing you agree to our{' '}
        <Text span c="#1A6B3C" style={{ cursor: 'pointer' }}>Terms of Service</Text>
        {' '}and{' '}
        <Text span c="#1A6B3C" style={{ cursor: 'pointer' }}>Privacy Policy</Text>.
      </Text>
    </Box>
  )
}

export default function AuthGatewayPage() {
  return (
    <Suspense fallback={<Box w="100%" maw={400} />}>
      <AuthGatewayInner />
    </Suspense>
  )
}
