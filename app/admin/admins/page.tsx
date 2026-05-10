import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminsManager from '@/components/admin/AdminsManager'

const colors = {
  bg: 'var(--bg)', card: 'var(--card)', border: 'var(--border)',
  text: 'var(--text)', text2: 'var(--text2)', text3: 'var(--text3)',
}

export default async function AdminsPage() {
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

  const { data: admins } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at')
    .eq('role', 'admin')
    .order('created_at', { ascending: false })

  async function removeAdmin(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await sb.from('profiles')
      .update({ role: 'consumer' })
      .eq('id', userId)

    redirect('/admin/admins')
  }

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/admins" />

      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          Admins
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 32px' }}>
          Manage who has admin access to ReVerie.
        </p>

        <AdminsManager
          admins={admins ?? []}
          colors={colors}
          currentUserId={user.id}
          removeAdmin={removeAdmin}
        />
      </main>
    </div>
  )
}
