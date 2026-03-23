import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './globals.scss'

import { Montserrat, Poppins } from 'next/font/google'
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { PlatformProvider } from '@/context/PlatformContext'
import type { Metadata } from 'next'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['400','600','700','800'] })
const poppins    = Poppins   ({ subsets: ['latin'], variable: '--font-poppins',    weight: ['300','400','500','600'] })

export const metadata: Metadata = {
  title: 'LagosApps — One Account. Every Service.',
  description: 'Order food, rides, groceries, home services, logistics and healthcare across Lagos with one wallet.',
}

const theme = createTheme({
  primaryColor: 'brand',
  fontFamily: 'var(--font-poppins), sans-serif',
  headings: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: '800' },
  colors: {
    // Green brand scale (light → dark, 10 shades)
    brand: [
      '#E8F5EE', // 0 — pale mint
      '#C8E8D4', // 1
      '#9DD4B3', // 2
      '#6DBF90', // 3
      '#3DA96E', // 4
      '#2E9E5B', // 5 — medium green
      '#1A6B3C', // 6 — primary ★
      '#145730', // 7
      '#0E4225', // 8
      '#082C19', // 9 — deepest
    ],
    ink: [
      '#E8EEE9','#D0DDD1','#B8CCB9','#9FBB9F','#6B9970',
      '#3D6B57','#1A4030','#142F22','#0E2018','#07100C',
    ],
  },
  defaultRadius: 'md',
  components: {
    Button:    { defaultProps: { radius: 'xl' } },
    TextInput: { defaultProps: { radius: 'md' } },
    Card:      { defaultProps: { radius: 'xl', withBorder: true } },
    Badge:     { defaultProps: { radius: 'xl' } },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          <PlatformProvider>
            {children}
          </PlatformProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
