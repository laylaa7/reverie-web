'use client'

import { useState } from 'react'

type ConsumerProfile = { mmse_score: number | null; diagnosis: string | null }
type User = {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
  created_at: string
  consumer_profiles?: ConsumerProfile | ConsumerProfile[] | null
}

const roleColors: Record<string, { bg: string; color: string; border: string }> = {
  admin:    { bg: 'rgba(107,138,255,0.1)',  color: 'rgba(107,138,255,0.9)',  border: 'rgba(107,138,255,0.25)' },
  doctor:   { bg: 'rgba(80,200,120,0.1)',   color: 'rgba(80,200,120,0.9)',   border: 'rgba(80,200,120,0.25)' },
  consumer: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)',  border: 'rgba(255,255,255,0.1)' },
}

const colStyle = {
  fontFamily: 'DM Mono, monospace', fontSize: '7px',
  color: 'var(--text3)', textTransform: 'uppercase' as const, letterSpacing: '2px',
}

export function UsersTableClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'consumer', label: 'Consumers' },
    { key: 'doctor', label: 'Doctors' },
    { key: 'admin', label: 'Admins' },
  ]

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase()
      const matchSearch = (u.full_name?.toLowerCase().includes(q) ?? false) ||
                          (u.email?.toLowerCase().includes(q) ?? false)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.full_name ?? '').localeCompare(b.full_name ?? '')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  function getConsumerProfile(u: User): ConsumerProfile | null {
    if (!u.consumer_profiles) return null
    return Array.isArray(u.consumer_profiles) ? u.consumer_profiles[0] ?? null : u.consumer_profiles
  }

  const showMmse = roleFilter === 'consumer' || roleFilter === 'all'
  const cols = showMmse
    ? '2fr 2fr 1fr 80px 1fr'
    : '2fr 2fr 1fr 1fr'

  return (
    <div>
      {/* Search + sort */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1', maxWidth: '340px', padding: '10px 16px',
            background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '6px', color: 'var(--text)', fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'date' | 'name')}
          style={{
            padding: '10px 14px', background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '6px', color: 'var(--text2)', fontSize: '12px',
            fontFamily: 'DM Mono, monospace', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="date">Sort: Latest</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Role filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setRoleFilter(t.key)}
            style={{
              padding: '6px 16px', borderRadius: '100px', fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
              border: `0.5px solid ${roleFilter === t.key ? 'rgba(107,138,255,0.4)' : 'var(--border)'}`,
              background: roleFilter === t.key ? 'rgba(107,138,255,0.1)' : 'var(--card)',
              color: roleFilter === t.key ? 'rgba(107,138,255,0.9)' : 'var(--text2)',
            }}
          >
            {t.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', alignSelf: 'center' }}>
          {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '16px', paddingBottom: '8px', borderBottom: '0.5px solid var(--border)' }}>
        <span style={colStyle}>Name</span>
        <span style={colStyle}>Email</span>
        <span style={colStyle}>Role</span>
        {showMmse && <span style={colStyle}>MMSE</span>}
        <span style={colStyle}>Joined</span>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '48px 0' }}>No users found</p>
      ) : (
        filtered.map(u => {
          const role = u.role ?? 'consumer'
          const pill = roleColors[role] ?? roleColors['consumer']
          const cp = getConsumerProfile(u)

          return (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: cols, gap: '16px',
              borderBottom: '0.5px solid var(--border)', padding: '14px 0', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.full_name ?? '—'}
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email ?? '—'}
              </span>
              <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: pill.bg, color: pill.color, border: `0.5px solid ${pill.border}`, display: 'inline-block', width: 'fit-content' }}>
                {role}
              </span>
              {showMmse && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: cp?.mmse_score != null ? 'rgba(107,138,255,0.8)' : 'var(--text3)' }}>
                  {cp?.mmse_score != null ? cp.mmse_score : '—'}
                </span>
              )}
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text3)' }}>
                {new Date(u.created_at).toLocaleDateString('en-GB')}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
