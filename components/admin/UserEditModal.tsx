'use client'

import { useState, useEffect } from 'react'

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(4px)', zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const modalStyle: React.CSSProperties = {
  background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', padding: '32px', width: '460px',
  maxWidth: 'calc(100vw - 48px)', position: 'relative',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
  letterSpacing: '2px', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '6px', color: '#fff', fontSize: '13px',
  fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
}

const roleColors: Record<string, string> = {
  patient: 'rgba(107,138,255,0.8)',
  doctor: 'rgba(80,200,120,0.9)',
  admin: 'rgba(232,160,48,0.9)',
  entertainment: 'rgba(160,80,255,0.8)',
}

interface Props {
  user: any
  colors: any
  onClose: () => void
}

export default function UserEditModal({ user, colors, onClose }: Props) {
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({ full_name: user.full_name ?? '', email: user.email ?? '' })
  }, [user])

  async function handleSave() {
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, full_name: form.full_name, email: form.email }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error || 'Failed to save.')
      setSaving(false)
      return
    }

    setSaved(true)
    setTimeout(() => { onClose(); window.location.reload() }, 1200)
  }

  const roleLabel = user.profile?.consumer_type ?? user.role ?? 'unknown'
  const roleColor = roleColors[user.profile?.consumer_type ?? user.role] ?? 'rgba(255,255,255,0.5)'

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
          Edit User
        </h2>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '0 0 28px', letterSpacing: '0.5px' }}>
          {user.email}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Full name"
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '10px', padding: '4px 12px', borderRadius: '100px',
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px',
                background: `${roleColor.replace('0.8', '0.08').replace('0.9', '0.08')}`,
                color: roleColor,
                border: `0.5px solid ${roleColor.replace('0.8', '0.2').replace('0.9', '0.2')}`,
              }}>
                {roleLabel}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                Role cannot be changed here.
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,100,100,0.8)', margin: '16px 0 0' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px', borderRadius: '6px',
              background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)', fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 22px', borderRadius: '6px',
              background: saved ? 'rgba(80,200,120,0.15)' : '#2B4FD4',
              border: saved ? '0.5px solid rgba(80,200,120,0.4)' : 'none',
              color: saved ? 'rgba(80,200,120,0.9)' : '#fff',
              fontSize: '13px', fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
