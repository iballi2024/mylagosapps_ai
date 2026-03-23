'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Box, Title, Text, Card, Group, Badge, Stack, Button, TextInput, SimpleGrid } from '@mantine/core'
import { usePlatform, SUBSIDIARIES } from '@/context/PlatformContext'

const TOP_UP_AMOUNTS = [5000, 10000, 20000, 50000]

export default function WalletPage() {
  const { walletBalance, loyaltyPoints, transactions, formatPrice } = usePlatform()
  const [topUpAmount, setTopUpAmount] = useState<number | ''>('')
  const [topUpStep, setTopUpStep] = useState<'idle' | 'confirm' | 'done'>('idle')

  const debits  = transactions.filter(t => t.type === 'debit' ).reduce((s, t) => s + t.amount, 0)
  const credits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Box maw={680} mx="auto" p="md" py="xl">

          {/* Wallet card */}
          <Card radius="xl" p="xl" mb="md" style={{ background: 'linear-gradient(135deg,#1A1A2E,#2C2C4A)', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <Box style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, borderRadius: '50%', background: 'radial-gradient(circle,#C9920A,transparent)', opacity: 0.1 }} />
            <Text fz={10} tt="uppercase" style={{ letterSpacing: 2 }} c="rgba(255,255,255,0.5)" fw={600} mb={4}>LagosApps Wallet</Text>
            <Text ff="var(--font-montserrat)" fw={800} fz={{ base: 32, md: 40 }} c="white" mb={4}>{formatPrice(walletBalance)}</Text>
            <Text fz="sm" c="rgba(255,255,255,0.5)" mb="lg">Available balance</Text>
            <Group gap="xl" wrap="wrap">
              {[
                { label: 'Total Spent',     value: formatPrice(debits) },
                { label: 'Total Topped Up', value: formatPrice(credits) },
                { label: 'Loyalty Points',  value: `⭐ ${loyaltyPoints.toLocaleString()}` },
              ].map(s => (
                <Box key={s.label}>
                  <Text fz={10} tt="uppercase" style={{ letterSpacing: 1 }} c="rgba(255,255,255,0.4)" mb={2}>{s.label}</Text>
                  <Text ff="var(--font-montserrat)" fw={700} fz={14} c="white">{s.value}</Text>
                </Box>
              ))}
            </Group>
          </Card>

          {/* Top up */}
          <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p="lg" mb="md">
            <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)" mb="md">Top up wallet</Text>
            {topUpStep === 'done' ? (
              <Stack align="center" py="md" gap="sm">
                <Text fz={32}>✅</Text>
                <Text ff="var(--font-montserrat)" fw={700} c="var(--color-ink)">{formatPrice(Number(topUpAmount))} added</Text>
                <Text fz="xs" c="var(--color-muted)">Your wallet has been topped up successfully.</Text>
                <Button variant="subtle" c="var(--color-gold)" onClick={() => { setTopUpStep('idle'); setTopUpAmount('') }}>Top up again</Button>
              </Stack>
            ) : (
              <Stack gap="sm">
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
                  {TOP_UP_AMOUNTS.map(amt => (
                    <Button key={amt} radius="xl" size="sm" onClick={() => setTopUpAmount(amt)}
                      variant={topUpAmount === amt ? 'filled' : 'light'}
                      style={topUpAmount === amt ? { background: 'var(--color-ink)', color: 'white', fontWeight: 700 } : { background: 'var(--color-surface2)', color: 'var(--color-muted)', fontWeight: 600 }}>
                      {formatPrice(amt)}
                    </Button>
                  ))}
                </SimpleGrid>
                <Group gap="sm">
                  <TextInput
                    placeholder="Custom amount" type="number"
                    value={topUpAmount} onChange={e => setTopUpAmount(e.target.value ? Number(e.target.value) : '')}
                    leftSection={<Text fz="sm" fw={600} c="var(--color-muted)">₦</Text>}
                    style={{ flex: 1 }} radius="xl" size="md"
                    styles={{ input: { background: 'var(--color-bg)' } }}
                  />
                  <Button radius="xl" size="md" disabled={!topUpAmount}
                    style={{ background: 'var(--color-ink)', color: 'white', fontWeight: 700 }}
                    onClick={() => topUpAmount && setTopUpStep('confirm')}>
                    Continue
                  </Button>
                </Group>
                {topUpStep === 'confirm' && topUpAmount && (
                  <Box p="md" style={{ background: 'var(--color-gold-pale)', borderRadius: 14, border: '1px solid rgba(201,146,10,0.2)' }}>
                    <Text fz="sm" fw={600} c="var(--color-ink)" mb="sm">
                      Confirm top-up of <Text span c="var(--color-gold)" fw={700}>{formatPrice(Number(topUpAmount))}</Text> via bank transfer
                    </Text>
                    <Stack gap={4} mb="md">
                      {[['Bank', 'First Bank Nigeria'], ['Account', '3012345678'], ['Name', 'LagosApps Limited']].map(([k, v]) => (
                        <Text key={k} fz="xs" c="var(--color-muted)">
                          {k}: <Text span fw={600} c="var(--color-ink)">{v}</Text>
                        </Text>
                      ))}
                    </Stack>
                    <Button size="sm" radius="xl" style={{ background: 'var(--color-gold)', color: 'white', fontWeight: 700 }}
                      onClick={() => setTopUpStep('done')}>
                      I have made the transfer
                    </Button>
                  </Box>
                )}
              </Stack>
            )}
          </Card>

          {/* History */}
          <Card radius="xl" withBorder style={{ borderColor: 'var(--color-border)' }} p={0}>
            <Text ff="var(--font-montserrat)" fw={700} fz={15} c="var(--color-ink)" px="lg" py="md"
              style={{ borderBottom: '1px solid var(--color-border)' }}>Transaction History</Text>
            <Stack gap={0}>
              {transactions.map(txn => {
                const sub = SUBSIDIARIES.find(s => s.name === txn.subsidiary)
                return (
                  <Group key={txn.id} px="lg" py="sm" gap="sm" wrap="wrap"
                    style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Box style={{ width: 36, height: 36, borderRadius: 10, background: sub?.colorPale || '#F2F0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {sub?.icon || '💳'}
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text fz="sm" fw={500} c="var(--color-ink)" truncate>{txn.description}</Text>
                      <Text fz={10} c="var(--color-muted)">{txn.date}</Text>
                    </Box>
                    <Text ff="var(--font-montserrat)" fw={700} fz="sm" c={txn.type === 'credit' ? 'green' : 'var(--color-ink)'}>
                      {txn.type === 'credit' ? '+' : '−'}{formatPrice(txn.amount)}
                    </Text>
                    <Badge size="xs" radius="xl" visibleFrom="sm"
                      color={txn.status === 'completed' ? 'green' : 'yellow'} variant="light">
                      {txn.status}
                    </Badge>
                  </Group>
                )
              })}
            </Stack>
          </Card>
        </Box>
      </Box>
    </>
  )
}
