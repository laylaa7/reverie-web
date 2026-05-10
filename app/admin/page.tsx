import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminCharts } from '@/components/admin/Charts'
import { ThemeToggle } from '@/components/admin/ThemeToggle'

export default async function AdminDashboard() {
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
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/admin/login?error=access')

  // ── Data ──────────────────────────────────────────────────────────────────

  const [
    { count: totalDoctors },
    { count: pendingDoctors },
    { count: totalPatients },
    { count: totalSessions },
    { count: activeSessions },
    { data: pendingApplications },
    { data: recentSessions },
    { data: sessionsByDay },
    { data: doctorsBySpec },
  ] = await Promise.all([
    supabase.from('doctor_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('doctor_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    supabase.from('consumer_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabase
      .from('doctor_profiles')
      .select('user_id, verification_status, specialization, profiles!inner(full_name, email, created_at)')
      .eq('verification_status', 'pending')
      .limit(5),
    supabase
      .from('appointments')
      .select(`
        id, session_datetime, status,
        doctor_profile:doctor_profiles!appointments_doctor_user_id_fkey(profiles!inner(full_name)),
        patient_profile:consumer_profiles!appointments_patient_user_id_fkey(profiles!inner(full_name))
      `)
      .order('session_datetime', { ascending: false })
      .limit(5),
    supabase
      .from('appointments')
      .select('session_datetime, status')
      .gte('session_datetime', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('session_datetime'),
    supabase.from('doctor_profiles').select('specialization'),
  ])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const stats = [
    { label: 'TOTAL DOCTORS',  value: totalDoctors ?? 0,  sub: 'On platform',      valueColor: 'var(--text)' },
    { label: 'PENDING',        value: pendingDoctors ?? 0, sub: 'Awaiting review',  valueColor: (pendingDoctors ?? 0) > 0 ? '#E8A030' : 'var(--text)' },
    { label: 'PATIENTS',       value: totalPatients ?? 0,  sub: 'Active users',     valueColor: 'var(--text)' },
    { label: 'SESSIONS',       value: totalSessions ?? 0,  sub: 'All time',         valueColor: 'var(--text)' },
    { label: 'SCHEDULED',      value: activeSessions ?? 0, sub: 'Upcoming',         valueColor: '#6B8AFF' },
  ]

  function statusPill(status: string) {
    const map: Record<string, { bg: string; color: string; border: string }> = {
      scheduled: { bg: 'rgba(107,138,255,0.1)', color: 'rgba(107,138,255,0.8)', border: 'rgba(107,138,255,0.2)' },
      completed: { bg: 'rgba(80,200,120,0.1)',  color: 'rgba(80,200,120,0.8)',  border: 'rgba(80,200,120,0.2)' },
      cancelled: { bg: 'rgba(255,100,100,0.1)', color: 'rgba(255,100,100,0.8)', border: 'rgba(255,100,100,0.2)' },
    }
    const s = map[status] ?? map['scheduled']
    return (
      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: s.bg, color: s.color, border: `0.5px solid ${s.border}` }}>
        {status}
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin" />

      <main style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
              Overview
            </h1>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: 0 }}>
              {today}
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginTop: '32px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px' }}>
                {s.label}
              </p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, color: s.valueColor, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--text3)', margin: '6px 0 0' }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <AdminCharts
          sessionsByDay={sessionsByDay ?? []}
          doctorsBySpec={doctorsBySpec ?? []}
        />

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>

          {/* Pending Applications */}
          <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                Pending Applications
              </span>
              <a href="/admin/applications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(107,138,255,0.6)', textDecoration: 'none' }}>
                View all →
              </a>
            </div>
            {!pendingApplications || pendingApplications.length === 0 ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text3)', textAlign: 'center', padding: '32px 0', margin: 0 }}>
                No pending applications
              </p>
            ) : (
              (pendingApplications as any[]).map((app, i) => {
                const p = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles
                const name = p?.full_name ?? '—'
                return (
                  <div key={app.user_id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0',
                    borderBottom: i < pendingApplications.length - 1 ? '0.5px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'rgba(107,138,255,0.12)', border: '0.5px solid rgba(107,138,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(107,138,255,0.8)',
                    }}>
                      {name[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {name}
                      </p>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.specialization ?? '—'}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(232,160,48,0.1)', color: 'rgba(232,160,48,0.8)', border: '0.5px solid rgba(232,160,48,0.2)', flexShrink: 0 }}>
                      Pending
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Recent Sessions */}
          <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                Recent Sessions
              </span>
              <a href="/admin/sessions" style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(107,138,255,0.6)', textDecoration: 'none' }}>
                View all →
              </a>
            </div>
            {!recentSessions || recentSessions.length === 0 ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text3)', textAlign: 'center', padding: '32px 0', margin: 0 }}>
                No sessions yet
              </p>
            ) : (
              (recentSessions as any[]).map((session, i) => {
                const dp = Array.isArray(session.doctor_profile) ? session.doctor_profile[0] : session.doctor_profile
                const doctorName = (Array.isArray(dp?.profiles) ? dp.profiles[0] : dp?.profiles)?.full_name ?? '—'
                const pp = Array.isArray(session.patient_profile) ? session.patient_profile[0] : session.patient_profile
                const patientName = (Array.isArray(pp?.profiles) ? pp.profiles[0] : pp?.profiles)?.full_name ?? '—'
                const dateStr = session.session_datetime ? new Date(session.session_datetime).toLocaleDateString('en-GB') : '—'
                return (
                  <div key={session.id} style={{ padding: '12px 0', borderBottom: i < recentSessions.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text)' }}>{doctorName}</span>
                      {statusPill(session.status)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--text2)' }}>{patientName}</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)' }}>{dateStr}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
