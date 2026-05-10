import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.json()
  const { event, invitee } = body.payload ?? {}

  if (!event || !invitee) {
    return new Response('OK', { status: 200 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: application } = await supabase
    .from('doctor_applications')
    .select('id')
    .eq('email', invitee.email)
    .single()

  if (application) {
    await supabase
      .from('doctor_applications')
      .update({ status: 'call_scheduled', reviewed_at: new Date().toISOString() })
      .eq('id', application.id)
  }

  return new Response('OK', { status: 200 })
}
