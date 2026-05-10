import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

async function login(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password })

  if (authError || !authData.user) {
    redirect('/admin/login?error=invalid')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/admin/login?error=access')
  }

  // Set cookie
  const cookieStore = cookies()
  cookieStore.set('reverie-admin-session', authData.session!.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  redirect('/admin')
}

export default function AdminLogin({
  searchParams
}: {
  searchParams: { error?: string }
}) {
  const errorMsg =
    searchParams.error === 'invalid'
      ? 'Invalid email or password.'
      : searchParams.error === 'access'
      ? 'You do not have admin access.'
      : null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080B14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{ width: '360px', padding: '0 24px' }}>

        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '11px',
          textAlign: 'center',
          marginBottom: '40px',
          fontFamily: 'monospace',
          letterSpacing: '3px'
        }}>
          REVERIE ADMIN
        </p>

        <form action={login}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '12px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          {errorMsg && (
            <p style={{
              color: 'rgba(255,100,100,0.9)',
              fontSize: '13px',
              marginBottom: '12px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            style={{
              display: 'block',
              width: '100%',
              padding: '13px',
              background: '#2B4FD4',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            Sign in
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <a href="/"
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              textDecoration: 'none'
            }}
          >
            ← Back to site
          </a>
        </p>

      </div>
    </div>
  )
}
