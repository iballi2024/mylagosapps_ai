'use client'
import type { CSSProperties } from 'react'
import { syne } from '@/public/fonts'

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
    fontFamily: syne.style.fontFamily,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    textDecoration: 'none',
    userSelect: 'none',
    ...style,
  }

  const wordmarkStyle: CSSProperties = {
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '-0.5px',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 0,
  }

  const taglineStyle: CSSProperties = {
    fontSize: `calc(${typeof size === 'number' ? size + 'px' : size} * 0.42)`,
    fontWeight: 500,
    letterSpacing: '0.04em',
    lineHeight: 1,
    color: light ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,46,0.45)',
    textTransform: 'uppercase',
  }

  return (
    <span style={base} className={className}>
      <span style={wordmarkStyle}>
        <span style={{ color: light ? '#ffffff' : '#1A1A2E' }}>Lagos</span>
        <span style={{ color: '#2E9E5B' }}>Apps</span>
      </span>
      <span style={taglineStyle}>Convenience and Value</span>
    </span>
  )
}
