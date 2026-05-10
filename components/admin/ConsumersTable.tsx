'use client'

import { useState } from 'react'
import UserEditModal from './UserEditModal'

interface Consumer {
  id: string
  full_name: string | null
  email: string | null
  role: string
  created_at: string
  is_active: boolean | null
  profile: {
    consumer_type: string | null
    cognitive_score: number | null
    onboarding_status: string | null
    gender: string | null
    birthdate: string | null
  } | null
}

interface Props {
  consumers: Consumer[]
  colors: any
  currentUserId: string
}

export default function ConsumersTable({ consumers, colors, currentUserId }: Props) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showRemoved, setShowRemoved] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  const filtered = consumers
    .filter(u => {
      // Active / removed toggle
      if (showRemoved) {
        if (u.is_active !== false) return false
      } else {
        if (u.is_active === false) return false
      }

      const matchSearch =
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())

      const matchFilter =
        filter === 'all' ? true
        : filter === 'patient'
          ? u.profile?.consumer_type === 'patient'
        : filter === 'entertainment'
          ? u.profile?.consumer_type === 'entertainment'
        : filter === 'doctor'
          ? u.role === 'doctor'
        : filter === 'admin'
          ? u.role === 'admin'
        : true

      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      if (sort === 'name')
        return (a.full_name ?? '').localeCompare(b.full_name ?? '')
      if (sort === 'oldest')
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  function mmseColor(score: number | null) {
    if (score === null) return colors.text3
    if (score >= 24) return 'rgba(80,200,120,0.9)'
    if (score >= 18) return 'rgba(232,160,48,0.9)'
    return 'rgba(255,100,100,0.9)'
  }

  function mmseLabel(score: number | null) {
    if (score === null) return null
    if (score >= 24) return 'Normal'
    if (score >= 18) return 'Mild'
    return 'Moderate'
  }

  async function handleRemove(userId: string, isAdmin: boolean) {
    const msg = isAdmin
      ? 'This will remove admin access. Are you sure?'
      : 'Remove this user? They will lose access but their data will be preserved.'
    if (!confirm(msg)) return
    const res = await fetch('/api/admin/remove-consumer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) window.location.reload()
  }

  async function handleRestore(userId: string) {
    await fetch('/api/admin/remove-consumer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, restore: true }),
    })
    window.location.reload()
  }

  // Counts for tabs (active consumers only)
  const activeCons = consumers.filter(u => u.is_active !== false)

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.text3 }}
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              background: colors.card,
              border: `0.5px solid ${colors.border}`,
              borderRadius: '6px',
              color: colors.text,
              fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            padding: '8px 14px',
            background: colors.card,
            border: `0.5px solid ${colors.border}`,
            borderRadius: '6px',
            color: colors.text2,
            fontSize: '12px',
            fontFamily: 'DM Mono, monospace',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>

        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: colors.text3, letterSpacing: '1px' }}>
          {filtered.length} users
        </span>

        {/* Show removed toggle */}
        <button
          onClick={() => setShowRemoved(!showRemoved)}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: showRemoved ? 'rgba(255,100,100,0.1)' : colors.card,
            border: `0.5px solid ${showRemoved ? 'rgba(255,100,100,0.3)' : colors.border}`,
            color: showRemoved ? 'rgba(255,100,100,0.8)' : colors.text3,
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          {showRemoved ? 'Hide removed' : 'Show removed'}
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'patient', label: 'Patients' },
          { key: 'entertainment', label: 'Entertainment' },
          { key: 'doctor', label: 'Doctors' },
          { key: 'admin', label: 'Admins' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 16px',
              borderRadius: '100px',
              border: `0.5px solid ${filter === f.key ? 'rgba(107,138,255,0.4)' : colors.border}`,
              background: filter === f.key ? 'rgba(107,138,255,0.1)' : colors.card,
              color: filter === f.key ? 'rgba(107,138,255,0.9)' : colors.text2,
              fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}
          >
            {f.label}
            <span style={{ marginLeft: '6px', fontFamily: 'DM Mono, monospace', fontSize: '10px', opacity: 0.6 }}>
              {f.key === 'all'
                ? activeCons.length
                : f.key === 'patient'
                ? activeCons.filter(u => u.profile?.consumer_type === 'patient').length
                : f.key === 'entertainment'
                ? activeCons.filter(u => u.profile?.consumer_type === 'entertainment').length
                : f.key === 'doctor'
                ? activeCons.filter(u => u.role === 'doctor').length
                : f.key === 'admin'
                ? activeCons.filter(u => u.role === 'admin').length
                : 0}
            </span>
          </button>
        ))}
      </div>

      {/* Admin filter note */}
      {filter === 'admin' && (
        <div style={{
          marginBottom: '16px', padding: '10px 14px', borderRadius: '6px',
          background: 'rgba(232,160,48,0.06)', border: '0.5px solid rgba(232,160,48,0.2)',
          fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(232,160,48,0.8)',
          letterSpacing: '0.5px',
        }}>
          Admin accounts are read-only here. To manage admin access, visit{' '}
          <a href="/admin/admins" style={{ color: 'rgba(232,160,48,0.9)', textDecoration: 'underline' }}>
            /admin/admins
          </a>.
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: colors.text3, fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
          {showRemoved ? 'No removed users.' : 'No users found.'}
        </div>
      )}

      {/* User rows */}
      {filtered.map(user => {
        const isPatient = user.profile?.consumer_type === 'patient'
        const isDoctor = user.role === 'doctor'
        const isAdmin = user.role === 'admin'
        const score = user.profile?.cognitive_score ?? null
        const initials = (user.full_name ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        const isRemoved = user.is_active === false

        const roleColor =
          isPatient ? 'rgba(107,138,255,0.8)'
          : isDoctor ? 'rgba(80,200,120,0.9)'
          : isAdmin  ? 'rgba(232,160,48,0.9)'
          : 'rgba(160,80,255,0.8)'

        const roleBg =
          isPatient ? 'rgba(107,138,255,0.08)'
          : isDoctor ? 'rgba(80,200,120,0.08)'
          : isAdmin  ? 'rgba(232,160,48,0.08)'
          : 'rgba(160,80,255,0.08)'

        const roleBorder =
          isPatient ? 'rgba(107,138,255,0.2)'
          : isDoctor ? 'rgba(80,200,120,0.2)'
          : isAdmin  ? 'rgba(232,160,48,0.2)'
          : 'rgba(160,80,255,0.2)'

        const roleLabel =
          isDoctor ? 'doctor'
          : isAdmin  ? 'admin'
          : user.profile?.consumer_type ?? 'unknown'

        return (
          <div key={user.id} style={{
            background: colors.card,
            border: `0.5px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            opacity: isRemoved ? 0.6 : 1,
          }}>
            {/* Avatar */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: roleBg,
              border: `0.5px solid ${roleBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: '12px',
              color: roleColor,
            }}>
              {initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: colors.text }}>
                  {user.full_name ?? 'Unnamed'}
                </span>
                <span style={{
                  fontSize: '9px', padding: '2px 8px', borderRadius: '100px',
                  fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px',
                  background: roleBg,
                  color: roleColor,
                  border: `0.5px solid ${roleBorder}`,
                }}>
                  {roleLabel}
                </span>
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: colors.text3, margin: 0 }}>
                {user.email}
              </p>
            </div>

            {/* MMSE — patients only */}
            {isPatient && (
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: mmseColor(score), margin: 0, lineHeight: 1 }}>
                  {score ?? '—'}
                </p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: colors.text3, margin: '4px 0 2px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  MMSE
                </p>
                {score !== null && (
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: mmseColor(score), margin: 0, letterSpacing: '0.5px' }}>
                    {mmseLabel(score)}
                  </p>
                )}
              </div>
            )}

            {/* Joined */}
            <div style={{ textAlign: 'right', minWidth: '80px' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: colors.text3, margin: 0, letterSpacing: '0.5px' }}>
                {new Date(user.created_at).toLocaleDateString('en-GB')}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {/* Edit — hidden for other admins */}
              {(user.role !== 'admin' || user.id === currentUserId) && !isRemoved && (
                <button
                  onClick={() => { setEditingUser(user); setShowUserModal(true) }}
                  style={{
                    padding: '5px 12px', borderRadius: '5px',
                    background: 'rgba(107,138,255,0.08)', border: '0.5px solid rgba(107,138,255,0.2)',
                    color: 'rgba(107,138,255,0.7)', fontSize: '11px',
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              )}

              {/* Remove / Restore */}
              {isRemoved ? (
                <button
                  onClick={() => handleRestore(user.id)}
                  style={{
                    padding: '5px 12px', borderRadius: '5px',
                    background: 'rgba(80,200,120,0.06)', border: '0.5px solid rgba(80,200,120,0.2)',
                    color: 'rgba(80,200,120,0.7)', fontSize: '11px',
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                  }}
                >
                  Restore
                </button>
              ) : (
                (user.role !== 'admin' || user.id === currentUserId) && user.id !== currentUserId && (
                  <button
                    onClick={() => handleRemove(user.id, isAdmin)}
                    style={{
                      padding: '5px 12px', borderRadius: '5px',
                      background: 'rgba(255,100,100,0.06)', border: '0.5px solid rgba(255,100,100,0.15)',
                      color: 'rgba(255,100,100,0.6)', fontSize: '11px',
                      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                )
              )}
            </div>
          </div>
        )
      })}

      {showUserModal && editingUser && (
        <UserEditModal
          user={editingUser}
          colors={colors}
          onClose={() => { setShowUserModal(false); setEditingUser(null) }}
        />
      )}
    </div>
  )
}
