'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Title, Text, Card, Group, Badge, Stack, Button, Anchor, Progress, SimpleGrid, Skeleton, Alert } from '@mantine/core'
import { apiGetBilling, apiCancelPlan, apiRemovePaymentMethod, BillingData } from '@/lib/billing'

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    apiGetBilling()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load billing information'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelPlan = async () => {
    setCancelError(null)
    setCancelLoading(true)
    try {
      await apiCancelPlan()
      setData(prev => prev ? { ...prev, plan: { ...prev.plan, status: 'cancelled' } } : prev)
      setCancelConfirm(false)
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel plan.')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleRemovePaymentMethod = async (id: string) => {
    try {
      await apiRemovePaymentMethod(id)
      setData(prev => prev ? { ...prev, paymentMethods: prev.paymentMethods.filter(pm => pm.id !== id) } : prev)
    } catch {
      // silently ignore — could add toast here
    }
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pb={{ base: 80, lg: 'xl' }} maw={800}>
      <Stack gap={2} mb="xl">
        <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="var(--color-ink)">Billing</Title>
        <Text fz="sm" c="var(--color-muted)">Manage your membership plan and payment details</Text>
      </Stack>

      {error && <Alert color="red" radius="md" mb="md">{error}</Alert>}

      {/* Current plan */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
        {loading ? (
          <>
            <Group justify="space-between" mb="lg" wrap="wrap">
              <Box>
                <Skeleton height={10} width={90} radius="sm" mb={10} />
                <Skeleton height={28} width={200} radius="md" mb={8} />
                <Skeleton height={12} width={240} radius="sm" />
              </Box>
              <Group gap="xs">
                <Skeleton height={32} width={90} radius="xl" />
                <Skeleton height={32} width={100} radius="xl" />
              </Group>
            </Group>
            <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {[...Array(3)].map((_, i) => <Skeleton key={i} height={48} radius="md" />)}
              </SimpleGrid>
            </Box>
          </>
        ) : data ? (
          <>
            <Group justify="space-between" wrap="wrap" gap="md" mb="lg">
              <Box>
                <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="var(--color-muted)" fw={600} mb={6}>Current Plan</Text>
                <Group gap="sm" align="center" wrap="wrap">
                  <Text fz={24}>{data.plan.icon}</Text>
                  <Text ff="var(--font-montserrat)" fw={800} fz={22} c="var(--color-ink)">{data.plan.name}</Text>
                  <Badge size="sm" radius="xl"
                    color={data.plan.status === 'active' ? 'green' : data.plan.status === 'cancelled' ? 'red' : 'gray'}
                    variant="light">
                    {data.plan.status.charAt(0).toUpperCase() + data.plan.status.slice(1)}
                  </Badge>
                </Group>
                <Text fz="sm" c="var(--color-muted)" mt={4}>
                  ₦{data.plan.amount?.toLocaleString()} / {data.plan.interval} · Renews {data.plan.renewsAt}
                </Text>
              </Box>
              <Group gap="xs" align="flex-start">
                {data.plan.status === 'active' && (
                  cancelConfirm ? (
                    <Stack gap="xs" align="flex-end">
                      {cancelError && <Alert color="red" radius="md" fz="xs" p="xs">{cancelError}</Alert>}
                      <Text fz="xs" c="var(--color-muted)">Cancel your plan?</Text>
                      <Group gap="xs">
                        <Button size="xs" radius="xl" variant="default" onClick={() => { setCancelConfirm(false); setCancelError(null) }}>
                          Keep plan
                        </Button>
                        <Button size="xs" radius="xl" loading={cancelLoading} onClick={handleCancelPlan}
                          style={{ background: '#E03131', color: 'white' }}>
                          Yes, cancel
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <>
                      <Button size="xs" radius="xl" variant="default" onClick={() => setCancelConfirm(true)}
                        styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
                        Cancel Plan
                      </Button>
                      <Button component={Link} href="/#membership" size="xs" radius="xl"
                        style={{ background: 'var(--color-ink)', color: 'white' }}>
                        Change Plan
                      </Button>
                    </>
                  )
                )}
              </Group>
            </Group>

            <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {data.usage.map(u => (
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
          </>
        ) : null}
      </Card>

      {/* Payment method */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
        <Group justify="space-between" mb="md">
          <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Payment Method</Text>
          <Anchor fz="xs" c="var(--color-gold)" fw={600}>+ Add new</Anchor>
        </Group>
        {loading ? (
          <Skeleton height={60} radius="xl" />
        ) : data?.paymentMethods?.length ? (
          <Stack gap="sm">
            {data.paymentMethods.map(pm => (
              <Group key={pm.id} p="sm" style={{ background: 'var(--color-bg)', borderRadius: 14, border: '1px solid var(--color-border)' }} wrap="wrap">
                <Box style={{ width: 48, height: 32, borderRadius: 8, background: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {pm.brand}
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fz="sm" fw={500} c="var(--color-ink)">•••• •••• •••• {pm.last4}</Text>
                  <Text fz={10} c="var(--color-muted)">Expires {pm.expiry}{pm.isDefault ? ' · Default card' : ''}</Text>
                </Box>
                {pm.isDefault && <Badge size="xs" radius="xl" color="green" variant="light">Default</Badge>}
                <Anchor fz="xs" c="#E03131" onClick={() => handleRemovePaymentMethod(pm.id)}>Remove</Anchor>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text fz="sm" c="var(--color-muted)">No payment methods on file.</Text>
        )}
      </Card>

      {/* Invoice history */}
      <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
        <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)">Invoice History</Text>
          <Anchor fz="xs" c="var(--color-gold)" fw={600}>Download all</Anchor>
        </Group>
        {loading ? (
          <Stack gap={0} p="md">
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={52} radius="xl" mb={8} />)}
          </Stack>
        ) : data?.invoices?.length ? (
          <Stack gap={0}>
            {data.invoices.map(inv => (
              <Group key={inv.id} px="lg" py="sm" gap="sm" wrap="wrap"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Box style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🧾</Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fz="sm" fw={500} c="var(--color-ink)">{inv.id}</Text>
                  <Text fz={10} c="var(--color-muted)">{inv.plan} · {inv.date}</Text>
                </Box>
                <Text ff="var(--font-montserrat)" fw={700} fz="sm" c="var(--color-ink)">₦{inv.amount?.toLocaleString()}</Text>
                <Badge size="xs" radius="xl"
                  color={inv.status === 'paid' ? 'green' : inv.status === 'failed' ? 'red' : 'yellow'}
                  variant="light">
                  {inv.status}
                </Badge>
                <Anchor fz="xs" c="var(--color-muted)" fw={500}>PDF</Anchor>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text fz="sm" c="var(--color-muted)" p="lg">No invoices yet.</Text>
        )}
      </Card>
    </Box>
  )
}
