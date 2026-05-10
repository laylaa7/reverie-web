import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ApplicationsTable from '@/components/admin/ApplicationsTable'

export default async function ApplicationsPage() {
  // Auth check
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
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/admin/login')

  // Fetch applications
  const { data: applications } = await supabase
    .from('doctor_applications')
    .select('*')
    .order('created_at', { ascending: false })

  // Count by status
  const pending = applications?.filter(a => a.status === 'pending').length ?? 0
  const approved = applications?.filter(a => a.status === 'approved').length ?? 0
  const rejected = applications?.filter(a => a.status === 'rejected').length ?? 0
  const callScheduled = applications?.filter(a => a.status === 'call_scheduled').length ?? 0

  const theme = cookieStore.get('admin-theme')?.value ?? 'dark'

  const colors = theme === 'light' ? {
    bg: '#F7F6F3', card: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    text: '#080B14', text2: 'rgba(0,0,0,0.5)',
    text3: 'rgba(0,0,0,0.3)',
  } : {
    bg: '#080B14', card: '#0d1220',
    border: 'rgba(255,255,255,0.06)',
    text: '#ffffff', text2: 'rgba(255,255,255,0.4)',
    text3: 'rgba(255,255,255,0.2)',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/applications" theme={theme} />

      <main className="admin-main" style={{ flex: 1, padding: '48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 4px' }}>
              Applications
            </h1>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '1px', color: colors.text3, margin: 0 }}>
              Doctor applications from the website
            </p>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: applications?.length ?? 0, color: colors.text2 },
            { label: 'Pending', value: pending, color: pending > 0 ? 'rgba(232,160,48,0.8)' : colors.text3 },
            { label: 'Approved', value: approved, color: 'rgba(80,200,120,0.8)' },
            { label: 'Call Scheduled', value: callScheduled, color: 'rgba(107,138,255,0.8)' },
            { label: 'Rejected', value: rejected, color: 'rgba(255,100,100,0.7)' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: colors.card, border: `0.5px solid ${colors.border}`,
              borderRadius: '8px', padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: colors.text3 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Applications table */}
        <ApplicationsTable
          applications={applications ?? []}
          colors={colors}
          calendlyUrl="https://calendly.com/graduationproj13/reverie-onboarding-call"
        />

      </main>
    </div>
  )
}
