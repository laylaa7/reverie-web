import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/admin-auth'

const colors = {
  bg: 'var(--bg)', card: 'var(--card)', border: 'var(--border)',
  text: 'var(--text)', text2: 'var(--text2)', text3: 'var(--text3)',
}

async function sendNotification(formData: FormData) {
  'use server'

  const targetType    = formData.get('targetType') as string
  const specificEmail = formData.get('specificEmail') as string
  const title         = formData.get('title') as string
  const body          = formData.get('body') as string

  if (!title?.trim() || !body?.trim()) {
    redirect('/admin/notifications?error=missing')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let userIds: string[] = []

  if (targetType === 'all') {
    const { data } = await supabase.from('profiles').select('id')
    userIds = data?.map(u => u.id) ?? []

  } else if (targetType === 'specific') {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .ilike('email', specificEmail?.trim() ?? '')
      .single()
    if (data) userIds = [data.id]

  } else if (targetType === 'doctors') {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'doctor')
    userIds = data?.map(u => u.id) ?? []

  } else if (targetType === 'patients') {
    const { data } = await supabase
      .from('consumer_profiles')
      .select('user_id')
      .eq('consumer_type', 'patient')
    userIds = data?.map(u => u.user_id) ?? []

  } else if (targetType === 'entertainment') {
    const { data } = await supabase
      .from('consumer_profiles')
      .select('user_id')
      .eq('consumer_type', 'entertainment')
    userIds = data?.map(u => u.user_id) ?? []
  }

  if (userIds.length === 0) {
    redirect('/admin/notifications?error=nousers')
  }

  const inserts = userIds.map(userId => ({
    user_id: userId,
    title: title.trim(),
    body: body.trim(),
    is_read: false,
  }))

  const { error } = await supabase.from('notifications').insert(inserts)

  if (error) {
    console.error('Notification insert error:', error)
    redirect('/admin/notifications?error=insert')
  }

  redirect(`/admin/notifications?success=${userIds.length}`)
}

async function deleteNotificationBroadcast(formData: FormData) {
  'use server'

  const ids = formData
    .getAll('notificationIds')
    .map(id => String(id))
    .filter(Boolean)

  if (ids.length === 0) {
    redirect('/admin/notifications?error=delete')
  }

  const { supabase, error: adminError } = await requireAdmin()
  if (adminError) redirect('/admin/login?error=access')

  const { error } = await supabase
    .from('notifications')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Notification delete error:', error)
    redirect('/admin/notifications?error=delete')
  }

  redirect(`/admin/notifications?deleted=${ids.length}`)
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: { success?: string; deleted?: string; error?: string }
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
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/login?error=access')

  // ── Notification history ──────────────────────────────────────────────────

  const { data: notifRows } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(500)

  // Group rows into broadcast events (same title+body within the same minute)
  const broadcastMap = new Map<string, { title: string; body: string; created_at: string; count: number; ids: string[] }>()
  for (const row of (notifRows ?? [])) {
    const bucket = Math.floor(new Date(row.created_at).getTime() / 60000)
    const key = `${row.title}::${row.body}::${bucket}`
    if (!broadcastMap.has(key)) {
      broadcastMap.set(key, { title: row.title, body: row.body, created_at: row.created_at, count: 0, ids: [] })
    }
    const broadcast = broadcastMap.get(key)!
    broadcast.count++
    broadcast.ids.push(row.id)
  }
  const broadcasts = Array.from(broadcastMap.values())

  const successCount = searchParams.success
  const deletedCount = searchParams.deleted
  const errorMsg =
    searchParams.error === 'missing'   ? 'Title and message are required.'
    : searchParams.error === 'nousers' ? 'No users found for this target.'
    : searchParams.error === 'insert'  ? 'Failed to save notifications. Try again.'
    : searchParams.error === 'delete'  ? 'Failed to delete notifications. Try again.'
    : null

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <AdminSidebar currentPath="/admin/notifications" />

      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '48px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          Notifications
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 32px' }}>
          Send in-app notifications to users or doctors
        </p>

        <div style={{ background: colors.card, border: `0.5px solid ${colors.border}`, borderRadius: '10px', padding: '28px', maxWidth: '600px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 24px' }}>
            Send Notification
          </h2>

          <form action={sendNotification}>

            {successCount && (
              <div style={{
                background: 'rgba(80,200,120,0.08)',
                border: '0.5px solid rgba(80,200,120,0.2)',
                borderRadius: '6px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(80,200,120,0.9)',
              }}>
                ✓ Notification sent to {successCount} users.
              </div>
            )}

            {deletedCount && (
              <div style={{
                background: 'rgba(80,200,120,0.08)',
                border: '0.5px solid rgba(80,200,120,0.2)',
                borderRadius: '6px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(80,200,120,0.9)',
              }}>
                ✓ Deleted {deletedCount} notification{deletedCount !== '1' ? 's' : ''}.
              </div>
            )}

            {errorMsg && (
              <div style={{
                background: 'rgba(255,100,100,0.08)',
                border: '0.5px solid rgba(255,100,100,0.2)',
                borderRadius: '6px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(255,100,100,0.8)',
              }}>
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'DM Mono, monospace',
                fontSize: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.text3,
                marginBottom: '8px',
              }}>
                Send To
              </label>
              <select
                name="targetType"
                defaultValue="all"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: colors.card,
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text,
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All users</option>
                <option value="patients">Patients only</option>
                <option value="entertainment">Entertainment users only</option>
                <option value="doctors">Doctors only</option>
                <option value="specific">Specific user</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'DM Mono, monospace',
                fontSize: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.text3,
                marginBottom: '8px',
              }}>
                Specific Email{' '}
                <span style={{ opacity: 0.5, marginLeft: '4px', textTransform: 'none', letterSpacing: 0 }}>
                  (only used if &quot;Specific user&quot; selected)
                </span>
              </label>
              <input
                type="email"
                name="specificEmail"
                placeholder="user@example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: colors.card,
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text,
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'DM Mono, monospace',
                fontSize: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.text3,
                marginBottom: '8px',
              }}>
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. New feature available"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: colors.card,
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text,
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'DM Mono, monospace',
                fontSize: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: colors.text3,
                marginBottom: '8px',
              }}>
                Message
              </label>
              <textarea
                name="body"
                rows={3}
                placeholder="Write your notification message..."
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: colors.card,
                  border: `0.5px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text,
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '11px 28px',
                background: '#2B4FD4',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
              }}
            >
              Send Notification →
            </button>

          </form>
        </div>

        {/* ── Sent History ──────────────────────────────────────────────── */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
            Sent History
          </h2>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', margin: '0 0 24px' }}>
            {broadcasts.length} broadcast{broadcasts.length !== 1 ? 's' : ''} sent
          </p>

          {broadcasts.length === 0 ? (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text3)', padding: '32px 0' }}>
              No notifications sent yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px' }}>
              {broadcasts.map((b, i) => (
                <div key={i} style={{
                  background: 'var(--card)', border: '0.5px solid var(--border)',
                  borderRadius: '8px', padding: '16px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: '16px',
                }}>
                  {/* Bell icon */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(107,138,255,0.08)', border: '0.5px solid rgba(107,138,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(107,138,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                        {b.title}
                      </span>
                      <span style={{
                        fontSize: '9px', padding: '2px 8px', borderRadius: '100px',
                        fontFamily: 'DM Mono, monospace', letterSpacing: '0.5px',
                        background: 'rgba(107,138,255,0.08)', color: 'rgba(107,138,255,0.8)',
                        border: '0.5px solid rgba(107,138,255,0.2)',
                      }}>
                        {b.count} recipient{b.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--text2)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.body}
                    </p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--text3)', margin: 0, letterSpacing: '0.5px' }}>
                      {new Date(b.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' · '}
                      {new Date(b.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <form action={deleteNotificationBroadcast}>
                    {b.ids.map(id => (
                      <input key={id} type="hidden" name="notificationIds" value={id} />
                    ))}
                    <button
                      type="submit"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '5px',
                        background: 'rgba(255,100,100,0.08)',
                        border: '0.5px solid rgba(255,100,100,0.25)',
                        color: 'rgba(255,100,100,0.8)',
                        fontSize: '11px',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
