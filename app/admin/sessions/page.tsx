import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SessionsTable } from '@/components/admin/SessionsTable'

export default async function SessionsPage() {
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

  const { data: raw } = await supabase
    .from('appointments')
    .select(`
      id,
      session_datetime,
      status,
      doctor_profile:doctor_profiles!appointments_doctor_user_id_fkey(
        profiles!inner(full_name)
      ),
      patient_profile:consumer_profiles!appointments_patient_user_id_fkey(
        profiles!inner(full_name)
      ),
      vr_scene:vr_scenes(title)
    `)
    .order('session_datetime', { ascending: false })
    .limit(100)

  const sessions = (raw ?? []).map((s: any) => {
    const dp = Array.isArray(s.doctor_profile) ? s.doctor_profile[0] : s.doctor_profile
    const doctorName = (Array.isArray(dp?.profiles) ? dp.profiles[0] : dp?.profiles)?.full_name ?? '—'
    const pp = Array.isArray(s.patient_profile) ? s.patient_profile[0] : s.patient_profile
    const patientName = (Array.isArray(pp?.profiles) ? pp.profiles[0] : pp?.profiles)?.full_name ?? '—'
    const sceneTitle = Array.isArray(s.vr_scene) ? s.vr_scene[0]?.title : s.vr_scene?.title

    return {
      id: s.id as string,
      session_datetime: s.session_datetime as string | null,
      status: s.status as string,
      doctor_name: doctorName,
      patient_name: patientName,
      scene_title: sceneTitle ?? null,
    }
  })

  // ── Summary counts ────────────────────────────────────────────────────────

  const total     = sessions.length
  const scheduled = sessions.filter(s => s.status === 'scheduled').length
  const completed = sessions.filter(s => s.status === 'completed').length
  const live      = sessions.filter(s => s.status === 'live').length

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/sessions" />

      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          Sessions
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 24px' }}>
          All VR therapy sessions across the platform
        </p>

        {/* Summary counts */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: total },
            { label: 'Scheduled', value: scheduled },
            { label: 'Completed', value: completed },
            { label: 'Live', value: live },
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

        <SessionsTable sessions={sessions} />
      </main>
    </div>
  )
}
