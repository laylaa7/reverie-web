import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function DoctorsPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('reverie-admin-session')
  if (!token) redirect('/admin/login')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: { user } } = await supabase.auth.getUser(token.value)
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/login?error=access')

  // ── Data ──────────────────────────────────────────────────────────────────

  const { data: doctors, error: doctorsError } = await supabase
    .from('doctor_profiles')
    .select(`
      user_id,
      verification_status,
      specialization,
      experience,
      fee,
      rating,
      languages,
      profiles (
        full_name,
        email,
        created_at
      )
    `)

  console.log('Doctors error:', doctorsError)
  console.log('Doctors count:', doctors?.length)

  // ── Toggle action ─────────────────────────────────────────────────────────

  async function toggleVerification(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string
    const current = formData.get('current') as string
    const next = current === 'verified' ? 'pending' : 'verified'

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await sb.from('doctor_profiles')
      .update({ verification_status: next })
      .eq('user_id', userId)

    redirect('/admin/doctors')
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const total    = doctors?.length ?? 0
  const verified = doctors?.filter(d => d.verification_status === 'verified').length ?? 0
  const pending  = doctors?.filter(d => d.verification_status === 'pending').length ?? 0

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    pending:  { bg: 'rgba(232,160,48,0.1)',  color: 'rgba(232,160,48,0.8)',  border: 'rgba(232,160,48,0.2)' },
    verified: { bg: 'rgba(80,200,120,0.1)',  color: 'rgba(80,200,120,0.8)',  border: 'rgba(80,200,120,0.2)' },
    rejected: { bg: 'rgba(255,100,100,0.1)', color: 'rgba(255,100,100,0.8)', border: 'rgba(255,100,100,0.2)' },
  }

  const colStyle = { fontFamily: 'DM Mono, monospace', fontSize: '7px', color: 'var(--text3)', textTransform: 'uppercase' as const, letterSpacing: '2px' }
  const cellStyle = { fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)', padding: '14px 0', alignSelf: 'center' as const }

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/doctors" />

      <main style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        {/* Header */}
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          Doctors
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 24px' }}>
          Manage verification status for all doctors on the platform
        </p>

        {/* Summary counts */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total', value: total },
            { label: 'Verified', value: verified },
            { label: 'Pending', value: pending },
          ].map(({ label, value }) => (
            <div key={label} style={{
              fontFamily: 'DM Mono, monospace', fontSize: '10px',
              padding: '4px 12px', borderRadius: '100px',
              background: 'var(--card)', border: '0.5px solid var(--border)',
              color: 'var(--text2)',
            }}>
              {label}: {value}
            </div>
          ))}
        </div>

        {(!doctors || doctors.length === 0) ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 0',
            color: 'var(--text3)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          }}>
            No doctors registered yet.
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 80px', paddingBottom: '8px', borderBottom: '0.5px solid var(--border)', gap: '16px' }}>
              {['Name', 'Specialization', 'Status', 'Experience', 'Fee', 'Joined', ''].map(h => (
                <span key={h} style={colStyle}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {(doctors as any[]).map(doctor => {
              const pill = statusColors[doctor.verification_status] ?? statusColors['pending']
              return (
                <div key={doctor.user_id} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 80px',
                  gap: '16px',
                  borderBottom: '0.5px solid var(--border)',
                  alignItems: 'center',
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
                  <div style={{ ...cellStyle }}>
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
                  <div style={{ padding: '14px 0' }}>
                    <form action={toggleVerification}>
                      <input type="hidden" name="userId" value={doctor.user_id} />
                      <input type="hidden" name="current" value={doctor.verification_status} />
                      <button type="submit" style={{
                        padding: '5px 14px',
                        borderRadius: '5px',
                        fontSize: '11px',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer',
                        border: '0.5px solid rgba(255,255,255,0.1)',
                        background: 'transparent',
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
          </>
        )}
      </main>
    </div>
  )
}
