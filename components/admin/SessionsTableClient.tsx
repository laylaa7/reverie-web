'use client'

import { useState } from 'react'

type Session = {
  id: string
  session_datetime: string | null
  status: string
  doctor_name: string
  patient_name: string
  scene_title: string | null
}

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  scheduled: { bg: 'rgba(107,138,255,0.1)', color: 'rgba(107,138,255,0.8)', border: 'rgba(107,138,255,0.2)' },
  completed: { bg: 'rgba(80,200,120,0.1)',  color: 'rgba(80,200,120,0.8)',  border: 'rgba(80,200,120,0.2)' },
  cancelled: { bg: 'rgba(255,100,100,0.1)', color: 'rgba(255,100,100,0.8)', border: 'rgba(255,100,100,0.2)' },
  live:      { bg: 'rgba(232,160,48,0.1)',  color: 'rgba(232,160,48,0.8)',  border: 'rgba(232,160,48,0.2)' },
}

const colStyle = {
  fontFamily: 'DM Mono, monospace', fontSize: '7px',
  color: 'var(--text3)', textTransform: 'uppercase' as const, letterSpacing: '2px',
}

export function SessionsTableClient({ sessions }: { sessions: Session[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(false)

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'live', label: 'Live' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const filtered = sessions
    .filter(s => {
      const q = search.toLowerCase()
      const matchSearch = s.doctor_name.toLowerCase().includes(q) ||
                          s.patient_name.toLowerCase().includes(q) ||
                          (s.scene_title?.toLowerCase().includes(q) ?? false)
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const tA = a.session_datetime ? new Date(a.session_datetime).getTime() : 0
      const tB = b.session_datetime ? new Date(b.session_datetime).getTime() : 0
      return sortAsc ? tA - tB : tB - tA
    })

  return (
    <div>
      {/* Search + sort */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search doctor, patient, or scene..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1', maxWidth: '340px', padding: '10px 16px',
            background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '6px', color: 'var(--text)', fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <button
          onClick={() => setSortAsc(v => !v)}
          style={{
            padding: '10px 14px', background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '6px', color: 'var(--text2)', fontSize: '12px',
            fontFamily: 'DM Mono, monospace', cursor: 'pointer',
          }}
        >
          Date {sortAsc ? '↑' : '↓'}
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setStatusFilter(t.key)}
            style={{
              padding: '6px 16px', borderRadius: '100px', fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
              border: `0.5px solid ${statusFilter === t.key ? 'rgba(107,138,255,0.4)' : 'var(--border)'}`,
              background: statusFilter === t.key ? 'rgba(107,138,255,0.1)' : 'var(--card)',
              color: statusFilter === t.key ? 'rgba(107,138,255,0.9)' : 'var(--text2)',
            }}
          >
            {t.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', alignSelf: 'center' }}>
          {filtered.length} session{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1.5fr 1fr 1.5fr', gap: '16px', paddingBottom: '8px', borderBottom: '0.5px solid var(--border)' }}>
        {['Date', 'Doctor', 'Patient', 'Status', 'Scene'].map(h => (
          <span key={h} style={colStyle}>{h}</span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '48px 0' }}>No sessions found</p>
      ) : (
        filtered.map(session => {
          const dt = session.session_datetime ? new Date(session.session_datetime) : null
          const pill = statusColors[session.status] ?? statusColors['scheduled']

          return (
            <div key={session.id} style={{
              display: 'grid', gridTemplateColumns: '80px 1.5fr 1.5fr 1fr 1.5fr', gap: '16px',
              borderBottom: '0.5px solid var(--border)', padding: '14px 0', alignItems: 'center',
            }}>
              {/* Date block */}
              <div>
                {dt ? (
                  <>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '18px', fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
                      {dt.getDate().toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                      {dt.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
                      {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
                ) : (
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text3)' }}>—</span>
                )}
              </div>

              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.doctor_name}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.patient_name}
              </span>
              <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: pill.bg, color: pill.color, border: `0.5px solid ${pill.border}`, display: 'inline-block', width: 'fit-content' }}>
                {session.status}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.scene_title ?? '—'}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
