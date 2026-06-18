import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { supabase, error: adminError } = await requireAdmin()
    if (adminError) return adminError

    const { userId, full_name, email } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: full_name || null, email: email || null })
      .eq('id', userId)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, { email })
      if (authError) console.error('Auth email update error:', authError)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
