'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string
              size?: string
              width?: number
              text?: string
              shape?: string
            }
          ) => void
        }
      }
    }
  }
}

interface Props {
  onToken: (idToken: string) => void
  width?: number
}

export default function GoogleButton({ onToken, width = 400 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

  useEffect(() => {
    if (!clientId) return

    const init = () => {
      if (!ref.current || !window.google) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => onToken(credential),
      })
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
        shape: 'pill',
      })
    }

    if (window.google) {
      init()
      return
    }

    if (!document.getElementById('google-gsi')) {
      const script = document.createElement('script')
      script.id = 'google-gsi'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = init
      document.head.appendChild(script)
    } else {
      // Script already added, wait for it
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); init() }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [clientId, onToken, width])

  if (!clientId) return null

  return <div ref={ref} />
}
