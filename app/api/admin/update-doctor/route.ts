import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { supabase, error: adminError } = await requireAdmin()
    if (adminError) return adminError

    const {
      userId, specialization, experience, fee, languages,
      verification_status, gender, age, education, session_duration,
    } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('doctor_profiles')
      .update({
        specialization: specialization || null,
        experience: experience || null,
        fee: fee || null,
        languages: languages?.length ? languages : null,
        verification_status: verification_status || 'pending',
        gender: gender || null,
        age: age || null,
        education: education || null,
        session_duration: session_duration || null,
      })
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
