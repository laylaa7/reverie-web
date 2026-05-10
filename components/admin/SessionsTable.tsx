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

export function SessionsTable({ sessions }: { sessions: Session[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(false)
  const [cancellingSession, setCancellingSession] = useState<Session | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

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
      const matchSearch =
        s.doctor_name.toLowerCase().includes(q) ||
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

  async function handleCancel() {
    if (!cancellingSession) return
    setCancelling(true)
    const res = await fetch('/api/admin/cancel-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: cancellingSession.id,
        reason: cancelReason || 'Cancelled by admin',
      }),
    })
    if (res.ok) {
      setShowCancelModal(false)
      setCancellingSession(null)
      setCancelReason('')
      window.location.reload()
    }
    setCancelling(false)
  }

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
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
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
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1.5fr 1fr 1.5fr 80px', gap: '16px', paddingBottom: '8px', borderBottom: '0.5px solid var(--border)' }}>
        {['Date', 'Doctor', 'Patient', 'Status', 'Scene', ''].map(h => (
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
              display: 'grid', gridTemplateColumns: '80px 1.5fr 1.5fr 1fr 1.5fr 80px',
              gap: '16px', borderBottom: '0.5px solid var(--border)', padding: '14px 0', alignItems: 'center',
            }}>
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

              <div>
                {session.status === 'scheduled' && (
                  <button
                    onClick={() => { setCancellingSession(session); setShowCancelModal(true) }}
                    style={{
                      padding: '5px 14px', borderRadius: '5px',
                      background: 'rgba(255,100,100,0.06)', border: '0.5px solid rgba(255,100,100,0.2)',
                      color: 'rgba(255,100,100,0.7)', fontSize: '11px',
                      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )
        })
      )}

      {/* Cancel Modal */}
      {showCancelModal && cancellingSession && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) { setShowCancelModal(false); setCancellingSession(null) } }}>
          <div style={modalStyle}>
            <button
              onClick={() => { setShowCancelModal(false); setCancellingSession(null) }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              Cancel Session
            </h2>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '0 0 24px', letterSpacing: '0.5px' }}>
              {cancellingSession.doctor_name} · {cancellingSession.patient_name}
              {cancellingSession.session_datetime && ` · ${new Date(cancellingSession.session_datetime).toLocaleDateString('en-GB')}`}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', marginBottom: '6px',
              }}>
                Reason (optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="e.g. Doctor unavailable"
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#fff', fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowCancelModal(false); setCancellingSession(null); setCancelReason('') }}
                style={{
                  padding: '10px 22px', borderRadius: '6px',
                  background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                }}
              >
                Keep Session
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  padding: '10px 22px', borderRadius: '6px',
                  background: 'rgba(255,100,100,0.15)', border: '0.5px solid rgba(255,100,100,0.3)',
                  color: 'rgba(255,100,100,0.9)', fontSize: '13px', fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  opacity: cancelling ? 0.7 : 1,
                }}
              >
                {cancelling ? 'Cancelling…' : 'Cancel Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
