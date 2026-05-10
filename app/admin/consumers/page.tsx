import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ConsumersTable from '@/components/admin/ConsumersTable'

const colors = {
  bg: 'var(--bg)', card: 'var(--card)', border: 'var(--border)',
  text: 'var(--text)', text2: 'var(--text2)', text3: 'var(--text3)',
}

export default async function ConsumersPage() {
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

  const { data: consumers } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at, is_active')
    .eq('role', 'consumer')
    .order('created_at', { ascending: false })

  const { data: consumerProfiles } = await supabase
    .from('consumer_profiles')
    .select('user_id, consumer_type, cognitive_score, onboarding_status, gender, birthdate')

  const merged = consumers?.map(u => ({
    ...u,
    profile: consumerProfiles?.find(cp => cp.user_id === u.id) ?? null,
  })) ?? []

  // ── Summary ───────────────────────────────────────────────────────────────

  const total        = merged.length
  const patients     = merged.filter(u => u.profile?.consumer_type === 'patient').length
  const entertainment = merged.filter(u => u.profile?.consumer_type === 'entertainment').length

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/consumers" />

      <main style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          Consumers
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 24px' }}>
          All registered consumer accounts on the platform
        </p>

        {/* Summary counts */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: total },
            { label: 'Patients', value: patients },
            { label: 'Entertainment', value: entertainment },
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

        <ConsumersTable consumers={merged as any} colors={colors} />
      </main>
    </div>
  )
}
