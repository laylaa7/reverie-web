import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DoctorsTable from '@/components/admin/DoctorsTable'

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

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/doctors" />

      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
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

        <DoctorsTable doctors={doctors as any[]} colors={{}} toggleVerification={toggleVerification} />
      </main>
    </div>
  )
}
