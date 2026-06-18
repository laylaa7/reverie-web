import { createSupabaseAdminClient } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getAuthenticatedUser(req: Request) {
  const supabase = createSupabaseAdminClient()
  const authorization = req.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null

  if (token) {
    return supabase.auth.getUser(token)
  }

  return createClient().auth.getUser()
}

export async function GET(req: Request) {
  const { data: { user }, error: userError } = await getAuthenticatedUser(req)

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !['patient', 'admin'].includes(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: doctors, error } = await supabase
    .from('doctor_profiles')
    .select(`
      user_id,
      specialization,
      experience,
      fee,
      rating,
      languages,
      bio,
      gender,
      education,
      session_duration,
      profiles!inner (
        full_name,
        email
      )
    `)
    .eq('verification_status', 'approved')
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ doctors: doctors ?? [] })
}
