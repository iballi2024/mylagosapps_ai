'use client'
import type { CSSProperties } from 'react'

interface LogoProps {
  /** Font size – any valid CSS value. Defaults to '1.25rem'. */
  size?: string | number
  /** Light variant renders the wordmark in white (for dark backgrounds). */
  light?: boolean
  style?: CSSProperties
  className?: string
}

export default function Logo({ size = '1.25rem', light = false, style, className }: LogoProps) {
  const base: CSSProperties = {
    fontFamily: 'var(--font-syne), sans-serif',
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '-0.5px',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 0,
    textDecoration: 'none',
    userSelect: 'none',
    ...style,
  }

  return (
    <span style={base} className={className}>
      <span style={{ color: light ? '#ffffff' : '#1A1A2E' }}>Lagos</span>
      <span style={{ color: '#2E9E5B' }}>Apps</span>
    </span>
  )
}
