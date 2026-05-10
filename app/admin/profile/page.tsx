import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'

async function updateProfile(formData: FormData) {
  'use server'

  const cookieStore = cookies()
  const token = cookieStore.get('reverie-admin-session')
  if (!token) redirect('/admin/login')

  const full_name = formData.get('full_name') as string
  const email     = formData.get('email') as string
  const userId    = formData.get('userId') as string

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('profiles')
    .update({ full_name: full_name || null, email: email || null })
    .eq('id', userId)

  if (email) {
    await supabase.auth.admin.updateUserById(userId, { email })
  }

  redirect('/admin/profile?saved=1')
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { saved?: string }
}) {
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
    .select('full_name, email, role, created_at')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/admin/login?error=access')

  const initials = (profile.full_name ?? 'A')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  const saved = searchParams.saved === '1'

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/profile" />

      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          My Profile
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 36px' }}>
          Your admin account details
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', maxWidth: '820px', alignItems: 'start' }}>

          {/* Avatar card */}
          <div style={{
            background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '12px', padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
              background: 'rgba(232,160,48,0.1)', border: '0.5px solid rgba(232,160,48,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: '24px', fontWeight: 600,
              color: 'rgba(232,160,48,0.9)',
            }}>
              {initials}
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
              {profile.full_name ?? 'Unnamed Admin'}
            </p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', margin: '0 0 16px' }}>
              {profile.email ?? '—'}
            </p>
            <span style={{
              display: 'inline-block', fontSize: '9px', padding: '3px 10px', borderRadius: '100px',
              fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase',
              background: 'rgba(232,160,48,0.08)', color: 'rgba(232,160,48,0.9)',
              border: '0.5px solid rgba(232,160,48,0.2)',
            }}>
              admin
            </span>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid var(--border)' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                Member since
              </p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text2)', margin: 0 }}>
                {joined}
              </p>
            </div>
          </div>

          {/* Edit form */}
          <div style={{
            background: 'var(--card)', border: '0.5px solid var(--border)',
            borderRadius: '12px', padding: '32px',
          }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 24px' }}>
              Edit Details
            </h2>

            {saved && (
              <div style={{
                background: 'rgba(80,200,120,0.08)', border: '0.5px solid rgba(80,200,120,0.2)',
                borderRadius: '6px', padding: '12px 16px', marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(80,200,120,0.9)',
              }}>
                ✓ Profile updated successfully.
              </div>
            )}

            <form action={updateProfile}>
              <input type="hidden" name="userId" value={user.id} />

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
                  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={profile.full_name ?? ''}
                  placeholder="Your full name"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg)', border: '0.5px solid var(--border)',
                    borderRadius: '6px', color: 'var(--text)', fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
                  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={profile.email ?? ''}
                  placeholder="your@email.com"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg)', border: '0.5px solid var(--border)',
                    borderRadius: '6px', color: 'var(--text)', fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '8px',
                  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px',
                }}>
                  Role
                </label>
                <div style={{
                  padding: '10px 14px', background: 'var(--bg)',
                  border: '0.5px solid var(--border)', borderRadius: '6px',
                  fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text3)',
                  letterSpacing: '1px',
                }}>
                  admin <span style={{ opacity: 0.5 }}>· not editable</span>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '11px 28px', background: '#2B4FD4',
                  border: 'none', borderRadius: '6px', color: '#fff',
                  fontSize: '13px', fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  )
}
