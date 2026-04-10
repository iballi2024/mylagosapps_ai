'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PaymentStep from '@/components/PaymentStep'
import { Box, Loader, Text, Button, Stack } from '@mantine/core'
import { usePlatform } from '@/context/PlatformContext'
import { type CreateOrderPayload } from '@/lib/billing'

interface PendingCheckout {
  amount: number
  summaryRows?: { label: string; value: string }[]
  orderPayload?: Partial<CreateOrderPayload>
  color?: string
  description?: string
  email?: string
}

const STORAGE_KEY = 'lagos_pending_checkout'

export default function CheckoutResumePage() {
  const router = useRouter()
  const { formatPrice } = usePlatform()
  const [checkout, setCheckout] = useState<PendingCheckout | null>(null)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) { setInvalid(true); return }
    try {
      const parsed: PendingCheckout = JSON.parse(raw)
      if (!parsed.amount) { setInvalid(true); return }
      setCheckout(parsed)
    } catch {
      setInvalid(true)
    }
  }, [])

  if (invalid) {
    return (
      <>
        <Navbar />
        <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
          <Box maw={480} mx="auto" p="xl" pt={60} style={{ textAlign: 'center' }}>
            <Text fz="3xl" mb="md">🛒</Text>
            <Text ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="sm">
              No pending checkout
            </Text>
            <Text fz="sm" c="var(--color-muted)" mb="xl">
              There is no saved order to resume. Please return to the service and try again.
            </Text>
            <Stack gap="sm">
              <Button radius="xl" size="md" onClick={() => router.push('/home')}
                style={{ background: 'var(--color-gold)', color: 'white', fontWeight: 700 }}>
                Back to home
              </Button>
              <Button radius="xl" size="md" variant="subtle" c="var(--color-muted)"
                onClick={() => router.push('/services')}>
                Browse services
              </Button>
            </Stack>
          </Box>
        </Box>
      </>
    )
  }

  if (!checkout) {
    return (
      <>
        <Navbar />
        <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack align="center" gap="sm">
            <Loader size="md" color="var(--color-gold)" />
            <Text fz="sm" c="var(--color-muted)">Restoring your checkout…</Text>
          </Stack>
        </Box>
      </>
    )
  }

  const color = checkout.color ?? 'var(--color-gold)'

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Box maw={900} mx="auto" p="md" py="xl">
          <PaymentStep
            amount={checkout.amount}
            formatPrice={formatPrice}
            color={color}
            email={checkout.email}
            description={checkout.description}
            summaryRows={checkout.summaryRows}
            orderPayload={checkout.orderPayload}
            onBack={() => {
              sessionStorage.removeItem(STORAGE_KEY)
              router.back()
            }}
            onPay={() => {
              sessionStorage.removeItem(STORAGE_KEY)
              router.push('/dashboard')
            }}
          />
        </Box>
      </Box>
    </>
  )
}
