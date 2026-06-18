import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId, restore } = await req.json()
  const { supabase, error: adminError } = await requireAdmin()
  if (adminError) return adminError

  const { error } = await supabase
    .from('profiles')
    .update({ is_active: restore ? true : false })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
