'use client'

import { useState } from 'react'

interface Admin {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

interface Props {
  admins: Admin[]
  colors: any
  currentUserId: string
  removeAdmin: (formData: FormData) => Promise<void>
}

export default function AdminsManager({ admins, colors, currentUserId, removeAdmin }: Props) {
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: `0.5px solid ${colors.border}`,
    borderRadius: '6px',
    color: colors.text,
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'DM Mono, monospace',
    fontSize: '8px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: colors.text3,
    marginBottom: '6px',
  }

  async function handleAddAdmin() {
    setAdding(true)
    setAddError('')
    setAddSuccess('')

    const res = await fetch('/api/admin/add-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: newAdmin.fullName.trim(),
        email: newAdmin.email.trim(),
        password: newAdmin.password,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      setAddError(json.error || 'Something went wrong.')
    } else {
      setAddSuccess(json.name)
      setNewAdmin({ fullName: '', email: '', password: '' })
      setTimeout(() => {
        setAddSuccess('')
        window.location.reload()
      }, 2000)
    }

    setAdding(false)
  }

  return (
    <div>
      {/* Add Admin Card */}
      <div style={{
        background: colors.card,
        border: `0.5px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '28px',
        marginBottom: '32px',
      }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: colors.text3, margin: '0 0 20px' }}>
          Create New Admin Account
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={newAdmin.fullName}
              onChange={e => setNewAdmin(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="e.g. Sarah Ahmed"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={newAdmin.email}
              onChange={e => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              placeholder="admin@reverie.health"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newAdmin.password}
              onChange={e => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Min 8 characters"
              style={{ ...inputStyle, padding: '10px 40px 10px 14px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: colors.text3, fontSize: '11px', fontFamily: 'DM Mono, monospace', padding: 0,
              }}
            >
              {showPassword ? 'hide' : 'show'}
            </button>
          </div>
        </div>

        {addError && (
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,100,100,0.8)',
            margin: '0 0 12px', padding: '8px 12px', background: 'rgba(255,100,100,0.06)',
            borderRadius: '5px', border: '0.5px solid rgba(255,100,100,0.15)',
          }}>
            {addError}
          </p>
        )}

        {addSuccess && (
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(80,200,120,0.9)',
            margin: '0 0 12px', padding: '8px 12px', background: 'rgba(80,200,120,0.06)',
            borderRadius: '5px', border: '0.5px solid rgba(80,200,120,0.2)',
          }}>
            ✓ {addSuccess} has been added as admin.
          </p>
        )}

        <button
          type="button"
          onClick={handleAddAdmin}
          disabled={adding || !newAdmin.fullName.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()}
          style={{
            padding: '11px 24px', background: '#2B4FD4', border: 'none',
            borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', cursor: adding ? 'not-allowed' : 'pointer',
            opacity: adding ? 0.7 : 1,
          }}
        >
          {adding ? 'Creating...' : 'Create Admin Account'}
        </button>
      </div>

      {/* Current admins */}
      <p style={{
        fontFamily: 'DM Mono, monospace', fontSize: '8px',
        letterSpacing: '2px', textTransform: 'uppercase',
        color: colors.text3, margin: '0 0 16px',
      }}>
        Current Admins ({admins.length})
      </p>

      {admins.map(admin => {
        const isYou = admin.id === currentUserId
        const initials = (admin.full_name ?? 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

        return (
          <div key={admin.id} style={{
            background: colors.card,
            border: `0.5px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            {/* Avatar */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(232,160,48,0.12)', border: '0.5px solid rgba(232,160,48,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(232,160,48,0.8)',
            }}>
              {initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: colors.text }}>
                  {admin.full_name ?? 'Unnamed'}
                </span>
                {isYou && (
                  <span style={{
                    fontSize: '9px', padding: '2px 8px', borderRadius: '100px',
                    background: 'rgba(107,138,255,0.1)', color: 'rgba(107,138,255,0.7)',
                    border: '0.5px solid rgba(107,138,255,0.2)',
                    fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px',
                  }}>
                    You
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: colors.text3, margin: '2px 0 0' }}>
                {admin.email}
              </p>
            </div>

            {/* Joined */}
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: colors.text3 }}>
              {new Date(admin.created_at).toLocaleDateString('en-GB')}
            </span>

            {/* Remove — disabled for yourself */}
            {!isYou && (
              <form action={removeAdmin}>
                <input type="hidden" name="userId" value={admin.id} />
                <button type="submit" style={{
                  padding: '6px 14px', borderRadius: '6px',
                  background: 'rgba(255,100,100,0.06)', border: '0.5px solid rgba(255,100,100,0.2)',
                  color: 'rgba(255,100,100,0.7)', fontSize: '11px',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                }}>
                  Remove
                </button>
              </form>
            )}
          </div>
        )
      })}
    </div>
  )
}
