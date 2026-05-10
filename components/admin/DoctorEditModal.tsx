'use client'

import { useState, useEffect } from 'react'

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(4px)', zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const modalStyle: React.CSSProperties = {
  background: '#0d1220', border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', padding: '32px', width: '560px',
  maxWidth: 'calc(100vw - 48px)', maxHeight: '80vh', overflowY: 'auto',
  position: 'relative',
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

interface Props {
  doctor: any
  colors: any
  onClose: () => void
}

export default function DoctorEditModal({ doctor, colors, onClose }: Props) {
  const [form, setForm] = useState({
    specialization: '',
    experience: null as number | null,
    fee: null as number | null,
    languages: '',
    verification_status: 'pending',
    gender: '',
    age: null as number | null,
    education: '',
    session_duration: null as number | null,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({
      specialization: doctor.specialization ?? '',
      experience: doctor.experience ?? null,
      fee: doctor.fee ?? null,
      languages: Array.isArray(doctor.languages)
        ? doctor.languages.join(', ')
        : doctor.languages ?? '',
      verification_status: doctor.verification_status ?? 'pending',
      gender: doctor.gender ?? '',
      age: doctor.age ?? null,
      education: doctor.education ?? '',
      session_duration: doctor.session_duration ?? null,
    })
  }, [doctor])

  function set(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/update-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: doctor.user_id,
        ...form,
        languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
        experience: form.experience ? Number(form.experience) : null,
        fee: form.fee ? Number(form.fee) : null,
        age: form.age ? Number(form.age) : null,
        session_duration: form.session_duration ? Number(form.session_duration) : null,
      }),
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

  const statusColors: Record<string, string> = {
    pending: 'rgba(232,160,48,0.8)',
    verified: 'rgba(80,200,120,0.8)',
    rejected: 'rgba(255,100,100,0.8)',
  }

  return (
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modalStyle}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>

        {/* Header */}
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
          Edit Doctor Profile
        </h2>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '0 0 28px', letterSpacing: '0.5px' }}>
          {doctor.profiles?.full_name ?? doctor.full_name ?? '—'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Specialization — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Specialization</label>
            <input style={inputStyle} value={form.specialization} onChange={e => set('specialization', e.target.value)} placeholder="e.g. Neurology" />
          </div>

          {/* Experience */}
          <div>
            <label style={labelStyle}>Experience (years)</label>
            <input style={inputStyle} type="number" value={form.experience ?? ''} onChange={e => set('experience', e.target.value)} placeholder="8" />
          </div>

          {/* Fee */}
          <div>
            <label style={labelStyle}>Fee (EGP/session)</label>
            <input style={inputStyle} type="number" value={form.fee ?? ''} onChange={e => set('fee', e.target.value)} placeholder="500" />
          </div>

          {/* Session Duration */}
          <div>
            <label style={labelStyle}>Session Duration (min)</label>
            <input style={inputStyle} type="number" value={form.session_duration ?? ''} onChange={e => set('session_duration', e.target.value)} placeholder="60" />
          </div>

          {/* Age */}
          <div>
            <label style={labelStyle}>Age</label>
            <input style={inputStyle} type="number" value={form.age ?? ''} onChange={e => set('age', e.target.value)} placeholder="40" />
          </div>

          {/* Gender */}
          <div>
            <label style={labelStyle}>Gender</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">—</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Education */}
          <div>
            <label style={labelStyle}>Education</label>
            <input style={inputStyle} value={form.education} onChange={e => set('education', e.target.value)} placeholder="MD, Cairo University" />
          </div>

          {/* Languages — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Languages</label>
            <input style={inputStyle} value={form.languages} onChange={e => set('languages', e.target.value)} placeholder="Arabic, English" />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: '6px 0 0' }}>
              Separate multiple languages with commas
            </p>
          </div>

          {/* Verification Status — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Verification Status</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer', color: statusColors[form.verification_status] ?? '#fff' }}
              value={form.verification_status}
              onChange={e => set('verification_status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,100,100,0.8)', margin: '16px 0 0' }}>
            {error}
          </p>
        )}

        {/* Buttons */}
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
