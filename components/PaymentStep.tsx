'use client'
import { useState, useEffect } from 'react'
import {
  Box, Card, Text, Button, Stack, Group, Divider, Anchor,
  Collapse, TextInput, Checkbox, ActionIcon, Tooltip, CopyButton, Select,
} from '@mantine/core'
import { apiInitiateServicePayment, apiVerifyPayment, apiGetBillingAddress, type VirtualAccount } from '@/lib/billing'

const METHODS = [
  { value: 'card',          icon: '💳', label: 'Card',                 desc: 'Mastercard, Visa, Verve — powered by Paystack' },
  { value: 'bank-transfer', icon: '🏦', label: 'Bank Transfer / USSD', desc: 'Instant transfer from any Nigerian bank' },
]

const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT — Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
].map(s => ({ value: s, label: s }))

const COUNTRIES = [{ value: 'NG', label: 'Nigeria' }]

const INPUT_STYLES = {
  label: { fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 2, color: 'var(--color-muted)', fontWeight: 600 }
}

interface Props {
  amount: number
  formatPrice: (n: number) => string
  color: string
  email?: string
  description?: string
  summaryRows?: { label: string; value: string }[]
  onBack: () => void
  onPay: () => void
}

export default function PaymentStep({ amount, formatPrice, color, email, description, summaryRows, onBack, onPay }: Props) {
  const [method, setMethod]                     = useState('card')
  const [couponOpen, setCouponOpen]             = useState(false)
  const [coupon, setCoupon]                     = useState('')
  const [loading, setLoading]                   = useState(false)
  const [paymentError, setPaymentError]         = useState<string | null>(null)
  const [virtualAccount, setVirtualAccount]     = useState<VirtualAccount | null>(null)
  const [transferConfirmed, setTransferConfirmed] = useState(false)

  // Billing address
  const [billing, setBilling] = useState({ address: '', city: '', state: '', country: 'NG' })
  const [billingTouched, setBillingTouched] = useState<Record<string, boolean>>({})

  const billingErrors: Record<string, string> = {}
  if (billingTouched.address && !billing.address.trim()) billingErrors.address = 'Required'
  if (billingTouched.city    && !billing.city.trim())    billingErrors.city    = 'Required'
  if (billingTouched.state   && !billing.state)          billingErrors.state   = 'Required'

  // Load Paystack script + prefill billing address from API
  useEffect(() => {
    if (!document.getElementById('paystack-inline-js')) {
      const script = document.createElement('script')
      script.id = 'paystack-inline-js'
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      document.body.appendChild(script)
    }

    apiGetBillingAddress().then(saved => {
      if (saved) {
        setBilling({
          address: saved.address ?? '',
          city:    saved.city    ?? '',
          state:   saved.state   ?? '',
          country: saved.country ?? 'NG',
        })
      }
      // null → form stays empty, user fills it in
    })
  }, [])

  async function handlePay() {
    if (method === 'card') {
      // Validate billing address first
      setBillingTouched({ address: true, city: true, state: true })
      if (!billing.address.trim() || !billing.city.trim() || !billing.state) return
    }

    setPaymentError(null)
    setLoading(true)

    try {
      const userEmail = email ?? 'guest@lagosapps.com'
      const isTransfer = method === 'bank-transfer'

      const result = await apiInitiateServicePayment({
        amount,
        email: userEmail,
        description: description ?? summaryRows?.[0]?.value ?? 'LagosApps service',
        paymentMethod: isTransfer ? 'transfer' : 'card',
        billingAddress: billing.address,
        billingCity:    billing.city,
        billingState:   billing.state,
        billingCountry: billing.country,
      })

      if (isTransfer) {
        setVirtualAccount(result.virtualAccount ?? null)
        setLoading(false)
        return
      }

      if (!window.PaystackPop) {
        throw new Error('Payment provider not ready. Please wait a moment and try again.')
      }

      const handler = window.PaystackPop.setup({
        key:    result.publicKey,
        email:  result.email,
        amount: result.amountKobo,
        ref:    result.reference,
        currency: 'NGN',

        callback: function (response) {
          ;(async () => {
            try {
              await apiVerifyPayment({
                orderId: 0,
                transactionId: response.transaction,
                reference: response.reference,
                status: 'success',
              })
            } catch (err) {
              console.error('Payment verification error:', err)
            }
            onPay()
          })()
        },

        onClose: () => { setLoading(false) },
      })

      handler.openIframe()
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Payment could not be initiated. Please try again.')
      setLoading(false)
    }
  }

  async function handleTransferConfirm() {
    if (!virtualAccount) return
    setLoading(true)
    try {
      await apiVerifyPayment({
        orderId: 0,
        transactionId: '',
        reference: virtualAccount.reference,
        status: 'success',
      })
    } catch (err) {
      console.error('Transfer verification error:', err)
    }
    setLoading(false)
    onPay()
  }

  return (
    <Box maw={480}>
      <Anchor component="button" fz="sm" c="var(--color-muted)" mb="lg" display="block"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onClick={onBack}>← Back</Anchor>

      <Text ff="var(--font-montserrat)" fw={700} fz={20} c="var(--color-ink)" mb="xl">Payment</Text>

      {/* Order summary */}
      {summaryRows && summaryRows.length > 0 && (
        <Card radius="xl" withBorder p="md" mb="md" style={{ borderColor: 'var(--color-border)' }}>
          <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="sm">Order summary</Text>
          <Stack gap={6}>
            {summaryRows.map(r => (
              <Group key={r.label} justify="space-between">
                <Text fz="sm" c="var(--color-muted)">{r.label}</Text>
                <Text fz="sm" fw={500}>{r.value}</Text>
              </Group>
            ))}
            <Divider my={4} />
            <Group justify="space-between">
              <Text ff="var(--font-montserrat)" fw={800}>Total</Text>
              <Text ff="var(--font-montserrat)" fw={800} style={{ color }}>{formatPrice(amount)}</Text>
            </Group>
          </Stack>
        </Card>
      )}

      {/* Virtual account panel (bank transfer) */}
      {virtualAccount ? (
        <Stack gap="md">
          <Card radius="xl" withBorder p="lg" style={{ background: 'var(--color-surface2)', borderColor: 'var(--color-border)' }}>
            <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Transfer to</Text>
            <Stack gap="sm">
              {[
                { label: 'Bank',           value: virtualAccount.bankName },
                { label: 'Account name',   value: virtualAccount.accountName },
                { label: 'Account number', value: virtualAccount.accountNumber, copy: true },
                { label: 'Amount',         value: formatPrice(virtualAccount.amount) },
                { label: 'Reference',      value: virtualAccount.reference, copy: true },
              ].map(row => (
                <Group key={row.label} justify="space-between">
                  <Text fz="sm" c="var(--color-muted)">{row.label}</Text>
                  <Group gap="xs">
                    <Text fz="sm" fw={600}>{row.value}</Text>
                    {row.copy && (
                      <CopyButton value={row.value}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
                            <ActionIcon size="sm" variant="subtle" onClick={copy} color={copied ? 'teal' : 'gray'}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                {copied ? 'check' : 'content_copy'}
                              </span>
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    )}
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>

          <Text fz="xs" c="var(--color-muted)" ta="center">
            Include the reference in your transfer narration. Your booking is confirmed within 30 minutes of payment.
          </Text>

          <Checkbox
            label="I have completed the bank transfer"
            radius="sm"
            color={color}
            checked={transferConfirmed}
            onChange={e => setTransferConfirmed(e.currentTarget.checked)}
          />

          <Button fullWidth radius="xl" size="md" loading={loading}
            disabled={!transferConfirmed}
            style={transferConfirmed ? { background: color, color: 'white', fontWeight: 700 } : {}}
            onClick={handleTransferConfirm}>
            I&apos;ve paid — Confirm →
          </Button>
        </Stack>
      ) : (
        <Stack gap="md">

          {/* Payment method selection */}
          <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
            <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="sm">Payment method</Text>
            <Stack gap="sm">
              {METHODS.map(m => (
                <Box key={m.value} onClick={() => { setMethod(m.value); setPaymentError(null) }}
                  style={{
                    padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                    border: `2px solid ${method === m.value ? color : 'var(--color-border)'}`,
                    background: method === m.value ? color + '08' : 'transparent',
                  }}>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <Text fz="xl" style={{ lineHeight: 1 }}>{m.icon}</Text>
                      <Box>
                        <Text fz="sm" fw={600} c="var(--color-ink)">{m.label}</Text>
                        <Text fz="xs" c="var(--color-muted)">{m.desc}</Text>
                      </Box>
                    </Group>
                    <Box style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${method === m.value ? color : '#ccc'}`,
                      background: method === m.value ? color : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {method === m.value && <Box style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
                    </Box>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Card>

          {/* Billing address — card only */}
          {method === 'card' && (
            <Card radius="xl" withBorder p="md" style={{ borderColor: 'var(--color-border)' }}>
              <Text fz={10} tt="uppercase" fw={600} style={{ letterSpacing: 2, color: 'var(--color-muted)' }} mb="md">Billing address</Text>
              <Stack gap="sm">
                <TextInput
                  label="Street address"
                  placeholder="12 Broad Street"
                  radius="md"
                  value={billing.address}
                  error={billingErrors.address}
                  onChange={e => setBilling(p => ({ ...p, address: e.target.value }))}
                  onBlur={() => setBillingTouched(p => ({ ...p, address: true }))}
                  styles={INPUT_STYLES}
                />
                <TextInput
                  label="City"
                  placeholder="Lagos"
                  radius="md"
                  value={billing.city}
                  error={billingErrors.city}
                  onChange={e => setBilling(p => ({ ...p, city: e.target.value }))}
                  onBlur={() => setBillingTouched(p => ({ ...p, city: true }))}
                  styles={INPUT_STYLES}
                />
                <Group grow>
                  <Select
                    label="State"
                    placeholder="Select state"
                    radius="md"
                    data={NG_STATES}
                    searchable
                    value={billing.state}
                    error={billingErrors.state}
                    onChange={v => { setBilling(p => ({ ...p, state: v ?? '' })); setBillingTouched(p => ({ ...p, state: true })) }}
                    styles={INPUT_STYLES}
                  />
                  <Select
                    label="Country"
                    radius="md"
                    data={COUNTRIES}
                    value={billing.country}
                    onChange={v => setBilling(p => ({ ...p, country: v ?? 'NG' }))}
                    styles={INPUT_STYLES}
                  />
                </Group>
              </Stack>
            </Card>
          )}

          {/* Discount code */}
          <Anchor component="button" fz="xs" c="var(--color-muted)" display="block"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => setCouponOpen(o => !o)}>
            {couponOpen ? '▲' : '▼'} Have a discount code?
          </Anchor>
          <Collapse in={couponOpen}>
            <Group mb="xs" gap="sm">
              <TextInput flex={1} size="sm" radius="xl" placeholder="Enter discount code"
                value={coupon} onChange={e => setCoupon(e.target.value)} />
              <Button size="sm" radius="xl" variant="outline" style={{ borderColor: color, color }}>Apply</Button>
            </Group>
          </Collapse>

          {paymentError && (
            <Text fz="sm" c="red" ta="center">{paymentError}</Text>
          )}

          <Button fullWidth radius="xl" size="md" loading={loading}
            style={{ background: color, color: 'white', fontWeight: 700 }}
            onClick={handlePay}>
            {loading ? 'Processing…' : `🔒 Pay ${formatPrice(amount)}`}
          </Button>

          <Text fz="xs" c="var(--color-muted)" ta="center">
            {method === 'card'
              ? 'Your card is charged immediately via Paystack. SSL encrypted.'
              : 'You will be shown bank transfer details on the next screen.'}
          </Text>

        </Stack>
      )}
    </Box>
  )
}
