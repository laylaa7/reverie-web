import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { sessionId, reason } = await req.json()
  const { supabase, error: adminError } = await requireAdmin()
  if (adminError) return adminError

  const { error } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      cancellation_reason: reason || 'Cancelled by admin',
    })
    .eq('id', sessionId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
