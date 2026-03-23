'use client'
import { useEffect, useRef } from 'react'

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const COLORS = ['#C9920A', '#F5C842', '#A0521A', '#C87433', '#6B7A8D', '#1A1A2E']
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
    }))
    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - frame / 180)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.angle += p.spin
      }
      frame++
      if (frame < 200) requestAnimationFrame(animate)
    }
    animate()
  }, [])
  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
  )
}
