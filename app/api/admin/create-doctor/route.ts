import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: Request) {
  const { applicationId, email, name, specialization, experience, languages } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const password = generatePassword()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 500 })
  }

  const userId = authData.user.id

  // 2. Insert profile
  await supabase.from('profiles').upsert({
    id: userId,
    full_name: name,
    email,
    role: 'doctor',
  })

  // 3. Insert doctor_profiles
  await supabase.from('doctor_profiles').upsert({
    user_id: userId,
    specialization: specialization ?? null,
    experience: experience ?? null,
    languages: languages ?? null,
    verification_status: 'verified',
  })

  // 4. Update application status
  await supabase
    .from('doctor_applications')
    .update({ status: 'account_created', reviewed_at: new Date().toISOString() })
    .eq('id', applicationId)

  // 5. Send credentials email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  await transporter.sendMail({
    from: `"ReVerie" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your ReVerie doctor account is ready',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:48px 32px;color:#080B14;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;">
          Welcome to ReVerie,<br/>Dr. ${name}.
        </h1>
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          Your doctor account has been created. You can now log in and start running VR therapy sessions.
        </p>
        <div style="background:#f5f5f5;border-radius:8px;padding:20px 24px;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:13px;color:#777;font-family:Arial,sans-serif;">Login credentials</p>
          <p style="margin:0 0 6px;font-size:15px;font-family:monospace;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0;font-size:15px;font-family:monospace;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color:#888;font-size:14px;line-height:1.6;">
          Please change your password after your first login.
        </p>
        <p style="color:#999;font-size:13px;line-height:1.6;border-top:1px solid #eee;padding-top:24px;margin-top:32px;">
          Questions? Reply to this email or reach us at
          <a href="mailto:hello@reverie.health" style="color:#2B4FD4;">hello@reverie.health</a>
        </p>
        <p style="color:#bbb;font-size:12px;margin-top:8px;">— The ReVerie Team, Cairo</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
