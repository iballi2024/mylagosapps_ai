'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Box, Title, Text, Card, Button, Group, Stack, Badge,
  Anchor, Select, TextInput, Textarea, Divider,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { IconCalendar } from '@tabler/icons-react'
import { usePlatform } from '@/context/PlatformContext'
import PaymentStep from '@/components/PaymentStep'
import { validatePhone, reqText } from '@/lib/validation'
import dayjs from 'dayjs'

// ── Shared ────────────────────────────────────────────────────────────────────
const INPUT_LABEL = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

const BUDGET_RANGES = [
  { value: 'under-50k',    label: 'Under ₦50,000' },
  { value: '50k-150k',     label: '₦50,000 – ₦150,000' },
  { value: '150k-500k',    label: '₦150,000 – ₦500,000' },
  { value: '500k-1m',      label: '₦500,000 – ₦1,000,000' },
  { value: 'above-1m',     label: 'Above ₦1,000,000' },
  { value: 'not-sure',     label: 'Not sure yet' },
]

const QTY_OPTIONS = [
  { value: '1',    label: '1 unit' },
  { value: '2-5',  label: '2 – 5 units' },
  { value: '6-20', label: '6 – 20 units' },
  { value: '20+',  label: '20+ units (bulk)' },
]

type Step =
  | 'browse'
  | 'order-details'   | 'order-delivery' | 'order-review' | 'order-pay' | 'order-confirm'
  | 'books-coming-soon'

type Platform = 'amazon' | 'alibaba'

const FLOW_STEPS = [
  { id: 'order-details' as Step,   label: 'Item' },
  { id: 'order-delivery' as Step,  label: 'Delivery' },
  { id: 'order-review' as Step,    label: 'Review' },
  { id: 'order-pay' as Step,       label: 'Pay' },
]

export default function OfficePage() {
  const { getSubsidiary, formatPrice } = usePlatform()
  const sub = getSubsidiary('office')!

  const [step, setStep]           = useState<Step>('browse')
  const [selectedService, setSelectedService] = useState(sub.services[0].id)
  const [platform, setPlatform]   = useState<Platform>('amazon')

  // Order details
  const [itemDescription, setItemDescription] = useState('')
  const [productUrl, setProductUrl]           = useState('')
  const [quantity, setQuantity]               = useState<string | null>(null)
  const [budget, setBudget]                   = useState<string | null>(null)
  const [orderNote, setOrderNote]             = useState('')

  // Delivery details
  const [recipientName, setRecipientName]   = useState('')
  const [phone, setPhone]                   = useState('')
  const [address, setAddress]               = useState('')
  const [deliveryDate, setDeliveryDate]     = useState<Date | null>(null)

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // ── Validation ──────────────────────────────────────────────────────────────
  const detailsErrors = {
    itemDescription: reqText(itemDescription, 'Item description'),
    quantity:        quantity ? '' : 'Please select a quantity',
    budget:          budget   ? '' : 'Please select a budget range',
  }
  const deliveryErrors = {
    recipientName: reqText(recipientName, 'Recipient name'),
    phone:         validatePhone(phone),
    address:       reqText(address, 'Delivery address'),
  }

  function touchDetails()  { setTouched(p => ({ ...p, itemDescription: true, quantity: true, budget: true })) }
  function touchDelivery() { setTouched(p => ({ ...p, recipientName: true, phone: true, address: true })) }

  const active = sub.services.find(s => s.id === selectedService)!
  const SERVICE_FEE = 5000

  const currentIdx = FLOW_STEPS.findIndex(s => s.id === step)

  function startFlow() {
    if (selectedService === 'books') { setStep('books-coming-soon'); return }
    setPlatform(selectedService === 'alibaba' ? 'alibaba' : 'amazon')
    setStep('order-details')
  }

  const formattedDelivery = deliveryDate ? dayjs(deliveryDate).format('D MMM YYYY') : ''
  const platformLabel     = platform === 'amazon' ? 'Amazon' : 'Alibaba'

  return (
    <>
      <Navbar />
      <Box pt={64} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

        {/* Hero */}
        <Box px="md" pt="lg" pb="lg" style={{ background: `linear-gradient(135deg,${sub.color},${sub.colorLight})` }}>
          <Box maw={900} mx="auto">
            <Anchor component="button" fz="xs" c="rgba(255,255,255,0.6)" mb="sm" display="block"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={() => window.history.back()}>← All services</Anchor>
            <Group gap="md" wrap="wrap" align="center" mb="md">
              <Box style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {sub.icon}
              </Box>
              <Box>
                <Title order={1} ff="var(--font-montserrat)" fw={800} fz={{ base: 22, md: 26 }} c="white">{sub.name}</Title>
                <Text fz="sm" c="rgba(255,255,255,0.7)">{sub.tagline}</Text>
              </Box>
            </Group>
            <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
              size="sm" radius="xl" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
              💬 Enquire on WhatsApp
            </Button>
          </Box>
        </Box>

        {/* Progress bar */}
        {step !== 'browse' && step !== 'order-confirm' && step !== 'books-coming-soon' && (
          <Box style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }} px="md" py="sm">
            <Box maw={900} mx="auto">
              <Group gap={0} wrap="nowrap">
                {FLOW_STEPS.map((s, i) => {
                  const done     = i < currentIdx
                  const isActive = i === currentIdx
                  return (
                    <Group key={s.id} gap={0} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <Group gap={6} wrap="nowrap" style={{ opacity: done || isActive ? 1 : 0.4, minWidth: 0 }}>
                        <Box style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: done ? '#2F9E44' : isActive ? sub.color : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
                          {done ? '✓' : i + 1}
                        </Box>
                        <Text fz="xs" fw={isActive ? 700 : 500} c={isActive ? 'var(--color-ink)' : 'var(--color-muted)'}
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.label}
                        </Text>
                      </Group>
                      {i < FLOW_STEPS.length - 1 && <Box style={{ flex: 1, height: 1, background: 'var(--color-border)', minWidth: 8, margin: '0 6px' }} />}
                    </Group>
                  )
                })}
              </Group>
            </Box>
          </Box>
        )}

        <Box maw={900} mx="auto" p="md" py="xl">

          {/* ── Browse ─────────────────────────────────────────────────────── */}
          {step === 'browse' && (
            <Group align="flex-start" gap="lg" wrap="wrap">
              <Box style={{ flex: 2, minWidth: 280 }}>
                <Title order={2} ff="var(--font-montserrat)" fw={700} fz={17} c="var(--color-ink)" mb="md">Choose a service</Title>
                <Stack gap="sm">
                  {sub.services.map(sv => (
                    <Card key={sv.id} radius="xl" withBorder p="md" onClick={() => setSelectedService(sv.id)}
                      style={{ borderColor: selectedService === sv.id ? sub.color + '80' : 'var(--color-border)', background: selectedService === sv.id ? sub.colorPale : 'white', cursor: 'pointer', outline: selectedService === sv.id ? `2px solid ${sub.color}50` : 'none' }}>
                      <Group gap="sm" wrap="nowrap">
                        <Box style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                          {sv.icon}
                        </Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Group gap="xs" mb={2} wrap="wrap">
                            <Text fw={700} fz="sm" c="var(--color-ink)">{sv.name}</Text>
                            {sv.popular && <Badge size="xs" radius="xl" style={{ background: sub.color, color: 'white' }}>Popular</Badge>}
                            {sv.unit === 'coming soon' && <Badge size="xs" radius="xl" variant="outline" color="gray">Coming soon</Badge>}
                          </Group>
                          <Text fz="xs" c="var(--color-muted)" lh={1.5}>{sv.description}</Text>
                          {sv.unit !== 'coming soon' && (
                            <Text fw={700} fz="sm" mt={4} style={{ color: sub.color }}>
                              {sv.startingPrice === 0 ? 'Free enquiry' : `From ${formatPrice(sv.startingPrice)}`}
                              {sv.startingPrice > 0 && <Text span fw={400} fz="xs" c="var(--color-muted)"> / {sv.unit}</Text>}
                            </Text>
                          )}
                        </Box>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Card radius="xl" withBorder p="lg" style={{ borderColor: 'var(--color-border)', flex: 1, minWidth: 240, position: 'sticky', top: 80 }}>
                <Text ff="var(--font-montserrat)" fw={700} fz={14} c="var(--color-ink)" mb="sm">{active.name}</Text>
                <Text fz="xs" c="var(--color-muted)" mb="md" lh={1.6}>{active.description}</Text>
                {active.unit === 'coming soon' ? (
                  <Card radius="lg" p="sm" style={{ background: 'var(--color-bg)', border: '1px dashed var(--color-border)' }}>
                    <Text fz="xs" c="var(--color-muted)" ta="center">This service is coming soon.<br />Register interest via WhatsApp.</Text>
                  </Card>
                ) : (
                  <>
                    <Group justify="space-between" mb="xs">
                      <Text fz="sm" c="var(--color-muted)">Service fee</Text>
                      <Text fw={700} fz="sm" style={{ color: sub.color }}>{formatPrice(SERVICE_FEE)}</Text>
                    </Group>
                    <Text fz={10} c="var(--color-muted)" mb="sm">One-time sourcing and coordination fee. Item cost billed separately once confirmed.</Text>
                    <Button fullWidth radius="xl" size="md" mb="xs" mt="sm"
                      style={{ background: sub.color, color: 'white', fontWeight: 700 }} onClick={startFlow}>
                      Place an order →
                    </Button>
                  </>
                )}
                <Button fullWidth radius="xl" size="sm" component="a"
                  href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  variant="outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                  💬 Enquire via WhatsApp
                </Button>
              </Card>
            </Group>
          )}

          {/* ── Order details ───────────────────────────────────────────────── */}
          {step === 'order-details' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('browse')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>{platformLabel} Order</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Tell us what you need and we&apos;ll source it for you</Text>
              <Stack gap="md">
                <Textarea
                  label="What do you need?"
                  placeholder={platform === 'amazon'
                    ? 'e.g. Sony WH-1000XM5 noise-cancelling headphones, black colour'
                    : 'e.g. 500pcs custom printed tote bags, 30×40cm, with logo (logo file will be sent separately)'}
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, itemDescription: true }))}
                  error={touched.itemDescription ? detailsErrors.itemDescription : undefined}
                  size="md" radius="md" minRows={3} autosize styles={INPUT_LABEL}
                />
                <TextInput
                  label={`${platformLabel} product link (optional)`}
                  placeholder={platform === 'amazon'
                    ? 'https://www.amazon.com/dp/...'
                    : 'https://www.alibaba.com/product-detail/...'}
                  value={productUrl}
                  onChange={e => setProductUrl(e.target.value)}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Select
                  label="Quantity"
                  placeholder="How many units?"
                  data={QTY_OPTIONS}
                  value={quantity}
                  onChange={v => { setQuantity(v); setTouched(p => ({ ...p, quantity: true })) }}
                  error={touched.quantity ? detailsErrors.quantity : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Select
                  label="Approximate budget (item cost only)"
                  placeholder="Select a range"
                  data={BUDGET_RANGES}
                  value={budget}
                  onChange={v => { setBudget(v); setTouched(p => ({ ...p, budget: true })) }}
                  error={touched.budget ? detailsErrors.budget : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Textarea
                  label="Additional notes (optional)"
                  placeholder="e.g. Colour preference, specific model variant, packaging requirements, urgency…"
                  value={orderNote}
                  onChange={e => setOrderNote(e.target.value)}
                  size="md" radius="md" minRows={2} autosize styles={INPUT_LABEL}
                />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchDetails(); if (Object.values(detailsErrors).some(Boolean)) return; setStep('order-delivery') }}>
                Continue →
              </Button>
            </Box>
          )}

          {/* ── Delivery details ────────────────────────────────────────────── */}
          {step === 'order-delivery' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('order-details')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb={4}>Delivery details</Title>
              <Text fz="sm" c="var(--color-muted)" mb="xl">Where should we deliver your order?</Text>
              <Stack gap="md">
                <TextInput
                  label="Recipient name"
                  placeholder="Full name of the person receiving the order"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, recipientName: true }))}
                  error={touched.recipientName ? deliveryErrors.recipientName : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <TextInput
                  label="Phone number"
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, phone: true }))}
                  error={touched.phone ? deliveryErrors.phone : undefined}
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
                <Textarea
                  label="Delivery address"
                  placeholder="House number, street, estate, area, LGA — be as specific as possible"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, address: true }))}
                  error={touched.address ? deliveryErrors.address : undefined}
                  size="md" radius="md" minRows={2} autosize styles={INPUT_LABEL}
                />
                <DateInput
                  label="Preferred delivery date (optional)"
                  placeholder="Select a date"
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  minDate={dayjs().add(7, 'day').toDate()}
                  leftSection={<IconCalendar size={16} />}
                  clearable
                  size="md" radius="xl" styles={INPUT_LABEL}
                />
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => { touchDelivery(); if (Object.values(deliveryErrors).some(Boolean)) return; setStep('order-review') }}>
                Review order →
              </Button>
            </Box>
          )}

          {/* ── Review ──────────────────────────────────────────────────────── */}
          {step === 'order-review' && (
            <Box maw={480}>
              <Anchor fz="sm" c="var(--color-muted)" mb="lg" display="block" style={{ cursor: 'pointer' }} onClick={() => setStep('order-delivery')}>← Back</Anchor>
              <Title order={2} ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Review your order</Title>
              <Stack gap="md">
                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Order details</Text>
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start">
                      <Text fz="sm" c="var(--color-muted)">Platform</Text>
                      <Text fz="sm" fw={500}>{platformLabel}</Text>
                    </Group>
                    <Group justify="space-between" align="flex-start">
                      <Text fz="sm" c="var(--color-muted)">Item</Text>
                      <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 260 }}>{itemDescription}</Text>
                    </Group>
                    {productUrl && (
                      <Group justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">Product link</Text>
                        <Text fz="xs" c="var(--color-muted)" ta="right" style={{ maxWidth: 240, wordBreak: 'break-all' }}>{productUrl}</Text>
                      </Group>
                    )}
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Quantity</Text>
                      <Text fz="sm" fw={500}>{QTY_OPTIONS.find(q => q.value === quantity)?.label}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Budget</Text>
                      <Text fz="sm" fw={500}>{BUDGET_RANGES.find(b => b.value === budget)?.label}</Text>
                    </Group>
                    {orderNote && (
                      <Group justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">Notes</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 260 }}>{orderNote}</Text>
                      </Group>
                    )}
                  </Stack>
                </Card>

                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Delivery</Text>
                  <Stack gap="xs">
                    {[
                      ['Recipient',  recipientName],
                      ['Phone',      phone],
                      ['Address',    address],
                      ...(formattedDelivery ? [['Preferred date', formattedDelivery]] : []),
                    ].map(([k, v]) => (
                      <Group key={k} justify="space-between" align="flex-start">
                        <Text fz="sm" c="var(--color-muted)">{k}</Text>
                        <Text fz="sm" fw={500} ta="right" style={{ maxWidth: 260 }}>{v}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>

                <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
                  <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Fees</Text>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Sourcing & coordination fee</Text>
                      <Text fz="sm" fw={500}>{formatPrice(SERVICE_FEE)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fz="sm" c="var(--color-muted)">Item cost</Text>
                      <Text fz="xs" c="var(--color-muted)">Quoted separately after confirmation</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text ff="var(--font-montserrat)" fw={700}>Due now</Text>
                      <Text ff="var(--font-montserrat)" fw={700} style={{ color: sub.color }}>{formatPrice(SERVICE_FEE)}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
              <Button fullWidth radius="xl" size="md" mt="xl"
                style={{ background: sub.color, color: 'white', fontWeight: 700 }}
                onClick={() => setStep('order-pay')}>
                Choose payment →
              </Button>
            </Box>
          )}

          {/* ── Payment ─────────────────────────────────────────────────────── */}
          {step === 'order-pay' && (
            <PaymentStep
              amount={SERVICE_FEE}
              formatPrice={formatPrice}
              color={sub.color}
              description={`${platformLabel} order — ${itemDescription.slice(0, 60)}${itemDescription.length > 60 ? '…' : ''}`}
              summaryRows={[
                { label: 'Service', value: `${platformLabel} Order` },
                { label: 'Item', value: itemDescription.slice(0, 60) + (itemDescription.length > 60 ? '…' : '') },
                { label: 'Recipient', value: recipientName },
                { label: 'Phone', value: phone },
              ]}
              onBack={() => setStep('order-review')}
              onPay={() => setStep('order-confirm')}
            />
          )}

          {/* ── Confirm ─────────────────────────────────────────────────────── */}
          {step === 'order-confirm' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
                {platform === 'amazon' ? '📫' : '🏭'}
              </Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Order request received!</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                We&apos;ve received your <strong>{platformLabel}</strong> order request for <strong>{itemDescription.slice(0, 80)}{itemDescription.length > 80 ? '…' : ''}</strong>.
                Our team will source the item, confirm the total cost, and contact <strong>{recipientName}</strong> on <strong>{phone}</strong> within 24 hours.
              </Text>
              <Group grow>
                <Button component={Link} href="/home" radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}>
                  Back to home
                </Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
                  💬 Chat on WhatsApp
                </Button>
              </Group>
            </Box>
          )}

          {/* ── Books coming soon ───────────────────────────────────────────── */}
          {step === 'books-coming-soon' && (
            <Box maw={480} mx="auto" py="xl" style={{ textAlign: 'center' }}>
              <Box style={{ width: 80, height: 80, borderRadius: '50%', background: sub.colorPale, border: `2px solid ${sub.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>📚</Box>
              <Title order={2} ff="var(--font-montserrat)" fw={800} fz={26} c="var(--color-ink)" mb="sm">Books — Coming Soon</Title>
              <Text fz="sm" c="var(--color-muted)" lh={1.7} mb="xl">
                We&apos;re building our books catalogue — academic texts, professional titles, and leisure reads, sourced internationally and delivered locally.
                Register your interest via WhatsApp and we&apos;ll notify you when it launches.
              </Text>
              <Group grow>
                <Button radius="xl" size="md" variant="default"
                  styles={{ root: { borderColor: 'var(--color-border)', color: 'var(--color-muted)' } }}
                  onClick={() => setStep('browse')}>
                  ← Back
                </Button>
                <Button component="a" href={`https://wa.me/${sub.whatsapp.replace(/\D/g, '')}`} target="_blank"
                  radius="xl" size="md" style={{ background: '#25D366', color: 'white', fontWeight: 700 }}>
                  💬 Register interest
                </Button>
              </Group>
            </Box>
          )}

        </Box>
      </Box>
    </>
  )
}
