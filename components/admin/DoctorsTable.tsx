'use client'

import { useState } from 'react'
import DoctorEditModal from './DoctorEditModal'

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  pending:  { bg: 'rgba(232,160,48,0.1)',  color: 'rgba(232,160,48,0.8)',  border: 'rgba(232,160,48,0.2)' },
  verified: { bg: 'rgba(80,200,120,0.1)',  color: 'rgba(80,200,120,0.8)',  border: 'rgba(80,200,120,0.2)' },
  rejected: { bg: 'rgba(255,100,100,0.1)', color: 'rgba(255,100,100,0.8)', border: 'rgba(255,100,100,0.2)' },
}

const colStyle = {
  fontFamily: 'DM Mono, monospace', fontSize: '7px',
  color: 'var(--text3)', textTransform: 'uppercase' as const, letterSpacing: '2px',
}

const cellStyle: React.CSSProperties = {
  fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
  color: 'var(--text)', padding: '14px 0', alignSelf: 'center',
}

interface Props {
  doctors: any[]
  colors: any
  toggleVerification: (formData: FormData) => Promise<void>
}

export default function DoctorsTable({ doctors, colors, toggleVerification }: Props) {
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  if (!doctors || doctors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text3)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
        No doctors registered yet.
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 160px', paddingBottom: '8px', borderBottom: '0.5px solid var(--border)', gap: '16px' }}>
        {['Name', 'Specialization', 'Status', 'Experience', 'Fee', 'Joined', ''].map(h => (
          <span key={h} style={colStyle}>{h}</span>
        ))}
      </div>

      {doctors.map(doctor => {
        const pill = statusColors[doctor.verification_status] ?? statusColors['pending']
        return (
          <div key={doctor.user_id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 160px',
            gap: '16px', borderBottom: '0.5px solid var(--border)', alignItems: 'center',
          }}>
            <div style={{ padding: '14px 0' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)', margin: 0 }}>
                {doctor.profiles?.full_name ?? '—'}
              </p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', margin: '2px 0 0' }}>
                {doctor.profiles?.email ?? '—'}
              </p>
            </div>

            <span style={cellStyle}>{doctor.specialization ?? '—'}</span>

            <div style={cellStyle}>
              <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: pill.bg, color: pill.color, border: `0.5px solid ${pill.border}` }}>
                {doctor.verification_status}
              </span>
            </div>

            <span style={cellStyle}>{doctor.experience ? `${doctor.experience} yrs` : '—'}</span>
            <span style={cellStyle}>{doctor.fee ? `${doctor.fee} EGP` : '—'}</span>

            <span style={{ ...cellStyle, fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
              {doctor.profiles?.created_at
                ? new Date(doctor.profiles.created_at).toLocaleDateString('en-GB')
                : '—'}
            </span>

            <div style={{ padding: '14px 0', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setEditingDoctor(doctor); setShowEditModal(true) }}
                style={{
                  padding: '5px 14px', borderRadius: '5px',
                  background: 'rgba(107,138,255,0.08)', border: '0.5px solid rgba(107,138,255,0.2)',
                  color: 'rgba(107,138,255,0.7)', fontSize: '11px',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <form action={toggleVerification}>
                <input type="hidden" name="userId" value={doctor.user_id} />
                <input type="hidden" name="current" value={doctor.verification_status} />
                <button type="submit" style={{
                  padding: '5px 14px', borderRadius: '5px', fontSize: '11px',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                  border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent',
                  color: doctor.verification_status === 'verified'
                    ? 'rgba(255,100,100,0.7)'
                    : 'rgba(80,200,120,0.7)',
                }}>
                  {doctor.verification_status === 'verified' ? 'Revoke' : 'Verify'}
                </button>
              </form>
            </div>
          </div>
        )
      })}

      {showEditModal && editingDoctor && (
        <DoctorEditModal
          doctor={editingDoctor}
          colors={colors}
          onClose={() => { setShowEditModal(false); setEditingDoctor(null) }}
        />
      )}
    </>
  )
}
