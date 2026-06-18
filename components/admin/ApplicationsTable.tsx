'use client'

import { useState } from 'react'

interface Application {
  id: string
  full_name: string
  email: string
  specialization: string
  experience: number | null
  languages: string | null
  bio: string | null
  cv_url: string | null
  status: string
  created_at: string
  reviewed_at: string | null
  rejection_reason: string | null
}

interface Colors {
  bg: string; card: string; border: string
  text: string; text2: string; text3: string
}

interface Props {
  applications: Application[]
  colors: Colors
  calendlyUrl: string
}

export default function ApplicationsTable({ applications, colors, calendlyUrl }: Props) {
  const [filter, setFilter] = useState('all')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [calendlyLink, setCalendlyLink] = useState('https://calendly.com/graduationproj13/reverie-onboarding-call')
  const [rejectReason, setRejectReason] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [createSent, setCreateSent] = useState(false)
  const [createDoctorCode, setCreateDoctorCode] = useState('')
  const [createError, setCreateError] = useState('')
  const [hoveredBio, setHoveredBio] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'call_scheduled', label: 'Call Scheduled' },
    { key: 'account_created', label: 'Account Created' },
    { key: 'rejected', label: 'Rejected' },
  ]

  function statusColor(status: string) {
    switch (status) {
      case 'pending':       return { bg: 'rgba(232,160,48,0.1)',  color: 'rgba(232,160,48,0.9)',  border: 'rgba(232,160,48,0.25)' }
      case 'approved':      return { bg: 'rgba(80,200,120,0.1)',  color: 'rgba(80,200,120,0.9)',  border: 'rgba(80,200,120,0.25)' }
      case 'call_scheduled':return { bg: 'rgba(107,138,255,0.1)', color: 'rgba(107,138,255,0.9)', border: 'rgba(107,138,255,0.25)' }
      case 'rejected':      return { bg: 'rgba(255,100,100,0.1)', color: 'rgba(255,100,100,0.8)', border: 'rgba(255,100,100,0.2)' }
      default:              return { bg: 'rgba(255,255,255,0.05)', color: colors.text3, border: colors.border }
    }
  }

  async function handleApprove() {
    if (!selectedApp) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          email: selectedApp.email,
          name: selectedApp.full_name,
          specialization: selectedApp.specialization,
          calendlyLink,
        }),
      })
      if (res.ok) {
        setSent(true)
        setTimeout(() => {
          setShowApproveModal(false)
          setSent(false)
          setSelectedApp(null)
          window.location.reload()
        }, 2000)
      }
    } finally {
      setSending(false)
    }
  }

  async function handleReject() {
    if (!selectedApp) return
    setSending(true)
    try {
      await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          email: selectedApp.email,
          name: selectedApp.full_name,
          reason: rejectReason,
        }),
      })
      setShowRejectModal(false)
      setSelectedApp(null)
      setRejectReason('')
      window.location.reload()
    } finally {
      setSending(false)
    }
  }

  async function handleCreateAccount() {
    if (!selectedApp) return
    setSending(true)
    setCreateError('')
    setCreateDoctorCode('')
    setCreateSent(false)
    try {
      const res = await fetch('/api/admin/create-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          email: selectedApp.email,
          name: selectedApp.full_name,
          specialization: selectedApp.specialization,
          experience: selectedApp.experience,
          languages: selectedApp.languages,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setCreateDoctorCode(json.doctorCode ?? '')
        setCreateSent(true)
        setTimeout(() => {
          setShowCreateModal(false)
          setCreateSent(false)
          setCreateDoctorCode('')
          setSelectedApp(null)
          window.location.reload()
        }, 5000)
      } else {
        setCreateError(json.error || 'Failed to create doctor account.')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 16px', borderRadius: '100px', fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
              border: `0.5px solid ${filter === f.key ? 'rgba(107,138,255,0.4)' : colors.border}`,
              background: filter === f.key ? 'rgba(107,138,255,0.1)' : colors.card,
              color: filter === f.key ? 'rgba(107,138,255,0.9)' : colors.text2,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: colors.text3, fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
          No applications found.
        </div>
      )}

      {/* Application cards */}
      {filtered.map(app => {
        const sc = statusColor(app.status)
        const initials = app.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

        return (
          <div key={app.id} style={{
            background: colors.card, border: `0.5px solid ${colors.border}`,
            borderRadius: '10px', padding: '20px 24px', marginBottom: '12px',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
          }}>
            {/* Avatar */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(107,138,255,0.12)', border: '0.5px solid rgba(107,138,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: '13px', color: 'rgba(107,138,255,0.8)',
            }}>
              {initials}
            </div>

            {/* Main info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500, color: colors.text }}>
                  {app.full_name}
                </span>
                <span style={{
                  fontSize: '10px', padding: '3px 10px', borderRadius: '100px',
                  background: sc.bg, color: sc.color, border: `0.5px solid ${sc.border}`,
                  fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px',
                }}>
                  {app.status === 'call_scheduled' ? 'Call Scheduled' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: colors.text3, margin: '0 0 10px' }}>
                {app.email}
              </p>

              {/* Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {app.specialization && (
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(107,138,255,0.06)', border: '0.5px solid rgba(107,138,255,0.15)', color: colors.text2, fontFamily: 'DM Sans, sans-serif' }}>
                    {app.specialization}
                  </span>
                )}
                {app.experience != null && (
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(107,138,255,0.06)', border: '0.5px solid rgba(107,138,255,0.15)', color: colors.text2, fontFamily: 'DM Sans, sans-serif' }}>
                    {app.experience} yrs exp
                  </span>
                )}
                {app.languages && (
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(107,138,255,0.06)', border: '0.5px solid rgba(107,138,255,0.15)', color: colors.text2, fontFamily: 'DM Sans, sans-serif' }}>
                    {app.languages}
                  </span>
                )}
              </div>

              {/* Bio with tooltip */}
              {app.bio && (
                <div style={{ position: 'relative' }}>
                  <p
                    style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: colors.text3, margin: 0, cursor: 'default' }}
                    onMouseEnter={() => setHoveredBio(app.id)}
                    onMouseLeave={() => setHoveredBio(null)}
                  >
                    {app.bio.length > 80 ? app.bio.slice(0, 80) + '...' : app.bio}
                  </p>
                  {hoveredBio === app.id && app.bio.length > 80 && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: 0,
                      background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '14px', fontSize: '12px',
                      maxWidth: '340px', zIndex: 50, color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                      {app.bio}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: colors.text3, letterSpacing: '0.5px' }}>
                {new Date(app.created_at).toLocaleDateString('en-GB')}
              </span>

              {app.cv_url && (
                <button
                  onClick={() => window.open(app.cv_url!, '_blank')}
                  style={{
                    fontFamily: 'DM Mono, monospace', fontSize: '9px', padding: '5px 12px',
                    borderRadius: '4px', background: 'rgba(107,138,255,0.08)',
                    border: '0.5px solid rgba(107,138,255,0.2)', color: 'rgba(107,138,255,0.7)',
                    cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase',
                  }}
                >
                  View CV
                </button>
              )}

              {app.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { setSelectedApp(app); setCalendlyLink(calendlyUrl); setShowApproveModal(true) }}
                    style={{
                      padding: '7px 16px', borderRadius: '6px',
                      background: 'rgba(80,200,120,0.1)', border: '0.5px solid rgba(80,200,120,0.3)',
                      color: 'rgba(80,200,120,0.9)', fontSize: '12px', fontWeight: 500,
                      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { setSelectedApp(app); setShowRejectModal(true) }}
                    style={{
                      padding: '7px 16px', borderRadius: '6px',
                      background: 'rgba(255,100,100,0.08)', border: '0.5px solid rgba(255,100,100,0.25)',
                      color: 'rgba(255,100,100,0.8)', fontSize: '12px', fontWeight: 500,
                      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {(app.status === 'approved' || app.status === 'call_scheduled') && (
                <button
                  onClick={() => { setSelectedApp(app); setCreateDoctorCode(''); setCreateError(''); setShowCreateModal(true) }}
                  style={{
                    padding: '7px 16px', borderRadius: '6px',
                    background: 'rgba(107,138,255,0.1)', border: '0.5px solid rgba(107,138,255,0.3)',
                    color: 'rgba(107,138,255,0.9)', fontSize: '12px', fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                  }}
                >
                  Create Account
                </button>
              )}

              {app.reviewed_at && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: colors.text3 }}>
                  Reviewed {new Date(app.reviewed_at).toLocaleDateString('en-GB')}
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* ── Approve Modal ─────────────────────────────────────────────────── */}
      {showApproveModal && selectedApp && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowApproveModal(false) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{ background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              Approve Application
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
              {selectedApp.full_name}
            </p>

            {/* Doctor summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              {([['Email', selectedApp.email], ['Specialization', selectedApp.specialization], ['Experience', selectedApp.experience != null ? `${selectedApp.experience} years` : '—']] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{k}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{v}</span>
                </div>
              ))}
            </div>

            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
              Onboarding Call Link
            </label>
            <input
              value={calendlyLink}
              onChange={e => setCalendlyLink(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'DM Mono, monospace', outline: 'none', boxSizing: 'border-box', marginBottom: '6px' }}
            />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: '0 0 24px' }}>
              This link will be included in the approval email sent to the applicant.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowApproveModal(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '6px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={sending}
                style={{ flex: 2, padding: '11px', borderRadius: '6px', background: sent ? 'rgba(80,200,120,0.2)' : '#2B4FD4', border: sent ? '0.5px solid rgba(80,200,120,0.4)' : 'none', color: sent ? 'rgba(80,200,120,0.9)' : '#fff', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: sending ? 'not-allowed' : 'pointer' }}
              >
                {sent ? '✓ Email sent' : sending ? 'Sending...' : 'Send Approval Email →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      {showRejectModal && selectedApp && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowRejectModal(false) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{ background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              Reject Application
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
              {selectedApp.full_name}
            </p>

            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
              Reason (optional)
            </label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Let the applicant know why their application was not approved..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '24px' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason('') }}
                style={{ flex: 1, padding: '11px', borderRadius: '6px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={sending}
                style={{ flex: 2, padding: '11px', borderRadius: '6px', background: 'rgba(255,100,100,0.1)', border: '0.5px solid rgba(255,100,100,0.3)', color: 'rgba(255,100,100,0.9)', fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: sending ? 'not-allowed' : 'pointer' }}
              >
                {sending ? 'Sending...' : 'Send Rejection Email →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Account Modal ──────────────────────────────────────────── */}
      {showCreateModal && selectedApp && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setShowCreateModal(false); setCreateDoctorCode(''); setCreateError('') } }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{ background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              Create Doctor Account
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
              {selectedApp.full_name}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              {([
                ['Email', selectedApp.email],
                ['Specialization', selectedApp.specialization],
                ['Experience', selectedApp.experience != null ? `${selectedApp.experience} years` : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{k}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{v}</span>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '0 0 24px', lineHeight: 1.6 }}>
              This will create a Supabase auth account, set up their doctor profile as pending, and send login credentials plus their doctor code to their email.
            </p>

            {createDoctorCode && (
              <div style={{ background: 'rgba(80,200,120,0.08)', border: '0.5px solid rgba(80,200,120,0.25)', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px' }}>
                <span style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(80,200,120,0.7)', marginBottom: '6px' }}>
                  Doctor Code
                </span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
                  {createDoctorCode}
                </span>
              </div>
            )}

            {createError && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,100,100,0.85)', margin: '0 0 18px', lineHeight: 1.5 }}>
                {createError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowCreateModal(false); setCreateDoctorCode(''); setCreateError('') }}
                style={{ flex: 1, padding: '11px', borderRadius: '6px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={sending || createSent}
                style={{
                  flex: 2, padding: '11px', borderRadius: '6px',
                  background: createSent ? 'rgba(80,200,120,0.2)' : '#2B4FD4',
                  border: createSent ? '0.5px solid rgba(80,200,120,0.4)' : 'none',
                  color: createSent ? 'rgba(80,200,120,0.9)' : '#fff',
                  fontSize: '13px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                  cursor: sending || createSent ? 'not-allowed' : 'pointer',
                }}
              >
                {createSent ? '✓ Account created' : sending ? 'Creating...' : 'Create Account & Send Credentials →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
