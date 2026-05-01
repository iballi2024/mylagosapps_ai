'use client'
import { useEffect } from 'react'

export default function ClientLoader() {
  useEffect(() => {
    const el = document.getElementById('page-loader')
    if (!el) return
    el.classList.add('is-hiding')
    const t = setTimeout(() => el.classList.add('is-hidden'), 420)
    return () => clearTimeout(t)
  }, [])
  return null
}
