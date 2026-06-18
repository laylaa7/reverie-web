import { createSupabaseAdminClient } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const editableDoctorFields = [
  'specialization',
  'experience',
  'fee',
  'languages',
  'bio',
  'gender',
  'age',
  'education',
  'session_duration',
] as const

function normalizeLanguages(languages: unknown): string[] | null {
  if (Array.isArray(languages)) {
    return languages.map(language => String(language).trim()).filter(Boolean)
  }

  if (typeof languages === 'string') {
    return languages.split(',').map(language => language.trim()).filter(Boolean)
  }

  return null
}

async function getAuthenticatedUser(req: Request) {
  const supabase = createSupabaseAdminClient()
  const authorization = req.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null

  if (token) {
    return supabase.auth.getUser(token)
  }

  return createClient().auth.getUser()
}

export async function POST(req: Request) {
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

  if (profileError || profile?.role !== 'doctor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const updates: Record<string, unknown> = {}

  for (const field of editableDoctorFields) {
    if (!(field in body)) continue

    if (field === 'languages') {
      updates.languages = normalizeLanguages(body.languages)
      continue
    }

    updates[field] = body[field] === '' ? null : body[field]
  }

  updates.verification_status = 'approved'

  const { error } = await supabase
    .from('doctor_profiles')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
