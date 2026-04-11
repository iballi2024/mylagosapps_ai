import Link from 'next/link'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-manrope), sans-serif',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: 48 }}>
        <Logo size="1.4rem" />
      </Link>

      {/* Big 404 */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <p style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(96px, 20vw, 160px)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '2px #E8F5EE',
          userSelect: 'none',
          margin: 0,
        }}>
          404
        </p>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 'clamp(48px, 10vw, 72px)', lineHeight: 1 }}>🗺️</span>
        </div>
      </div>

      {/* Heading & body */}
      <h1 style={{
        fontFamily: 'var(--font-montserrat), sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(20px, 4vw, 28px)',
        color: 'var(--color-ink)',
        margin: '0 0 12px',
        textAlign: 'center',
      }}>
        This page doesn&apos;t exist
      </h1>
      <p style={{
        fontSize: 15,
        color: 'var(--color-muted)',
        margin: '0 0 40px',
        maxWidth: 380,
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        Looks like you&apos;ve wandered off the map. The page you&apos;re looking for may have moved or never existed.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 24px',
          borderRadius: 100,
          background: 'var(--color-ink)',
          color: 'white',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
        }}>
          ← Back to home
        </Link>
        <Link href="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 24px',
          borderRadius: 100,
          background: 'var(--color-surface2)',
          color: 'var(--color-ink)',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
          border: '1px solid var(--color-border)',
        }}>
          Go to dashboard
        </Link>
      </div>

      {/* Subtle divider + links */}
      <div style={{
        marginTop: 56,
        paddingTop: 24,
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { label: 'Food & Groceries', href: '/services/food' },
          { label: 'Cars & Rides', href: '/services/rides' },
          { label: 'Healthcare', href: '/services/healthcare' },
          { label: 'Events', href: '/services/events' },
        ].map(link => (
          <Link key={link.href} href={link.href} style={{
            fontSize: 13,
            color: 'var(--color-muted)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
            onMouseEnter={undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>

    </div>
  )
}
