interface PaystackResponse {
  reference: string
  trans: string
  status: string
  message: string
  transaction: string
  trxref: string
}

interface PaystackHandler {
  openIframe: () => void
}

interface PaystackSetupOptions {
  key: string
  email: string
  amount: number
  ref: string
  currency?: string
  metadata?: Record<string, unknown>
  callback: (response: PaystackResponse) => void
  onClose: () => void
}

interface Window {
  PaystackPop: {
    setup: (options: PaystackSetupOptions) => PaystackHandler
  }
}
