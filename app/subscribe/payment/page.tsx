'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Stack, Title, Text, Button, SimpleGrid, TextInput, Paper, Group, Divider, Anchor } from '@mantine/core'
import Navbar from '@/components/Navbar'

const AMOUNTS = [5000, 10000, 20000, 50000]

export default function FundWalletPage() {
  const router = useRouter()
  const [amount, setAmount] = useState<number>(10000)

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} px="md" py={48}>
        <Box w="100%" maw={440}>
          <Stack gap="xs" mb="xl" ta="center">
            <Title order={2} ff="var(--font-montserrat)" fw={800}>Fund your wallet</Title>
            <Text size="sm" c="dimmed">Add money now to start ordering immediately. You can top up at any time.</Text>
          </Stack>

          <Paper withBorder radius="xl" p="lg" mb="md">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm" style={{ letterSpacing: 1 }}>Choose an amount</Text>
            <SimpleGrid cols={2} spacing="sm" mb="md">
              {AMOUNTS.map(a => (
                <Button key={a} variant={amount === a ? 'filled' : 'default'} radius="xl" size="md"
                  onClick={() => setAmount(a)}
                  style={amount === a ? { background: 'var(--color-ink)', color: 'white' } : {}}>
                  ₦{a.toLocaleString()}
                </Button>
              ))}
            </SimpleGrid>
            <TextInput
              placeholder="Or enter custom amount"
              type="number"
              leftSection="₦"
              radius="md"
              value={amount || ''}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </Paper>

          <Paper withBorder radius="xl" p="md" mb="lg" style={{ background: 'var(--color-surface2)' }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Wallet top-up</Text>
                <Text size="sm" fw={500}>₦{amount.toLocaleString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Processing fee</Text>
                <Text size="sm" fw={500}>₦0</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={700} ff="var(--font-montserrat)">Total</Text>
                <Text fw={700} ff="var(--font-montserrat)" c="var(--color-gold)">₦{amount.toLocaleString()}</Text>
              </Group>
            </Stack>
          </Paper>

          <Button fullWidth radius="xl" size="lg" mb="xs"
            onClick={() => router.push('/subscribe/confirmed')}
            style={{ background: 'var(--color-ink)', color: 'white' }}>
            🔒 Pay ₦{amount.toLocaleString()} to fund wallet
          </Button>
          <Text ta="center" size="xs" c="dimmed">
            <Anchor size="xs" c="dimmed" onClick={() => router.push('/dashboard')}>Skip for now — I&apos;ll top up later</Anchor>
          </Text>
        </Box>
      </Box>
    </>
  )
}
