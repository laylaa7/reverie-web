import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function createSupabaseAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function requireAdmin(): Promise<{
  supabase: SupabaseClient
  user?: User
  error?: NextResponse
}> {
  const supabase = createSupabaseAdminClient()
  const token = cookies().get('reverie-admin-session')?.value

  if (!token) {
    return { supabase, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return { supabase, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { supabase, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { supabase, user }
}
