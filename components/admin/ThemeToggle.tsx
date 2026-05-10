'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const t = document.cookie
      .split('; ')
      .find(r => r.startsWith('admin-theme='))
      ?.split('=')[1] ?? 'dark'
    setTheme(t)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.cookie = `admin-theme=${next};path=/;max-age=31536000`
    setTheme(next)
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      style={{
        background: 'transparent',
        border: '0.5px solid rgba(128,128,128,0.3)',
        borderRadius: '6px',
        padding: '6px 14px',
        color: 'inherit',
        fontSize: '11px',
        fontFamily: 'DM Mono, monospace',
        cursor: 'pointer',
        letterSpacing: '1px',
        opacity: 0.6,
      }}
    >
      {theme === 'dark' ? '☀ Light' : '☾ Dark'}
    </button>
  )
}
