import nodemailer from 'nodemailer'
import { type SupabaseClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function normalizeLanguages(languages: string | string[] | null): string[] {
  if (Array.isArray(languages)) {
    return languages.map(language => language.trim()).filter(Boolean)
  }

  if (!languages) return []

  return languages.split(',').map(language => language.trim()).filter(Boolean)
}

function generateDoctorCode(fullName: string): string {
  const cleanedName = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()

  const parts = cleanedName.split(/\s+/).filter(Boolean)
  const prefix = (parts[0] || parts.join('').slice(0, 8) || 'doctor').slice(0, 8)
  const digits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

  return `${prefix}${digits}`
}

async function generateUniqueDoctorCode(supabaseAdmin: SupabaseClient, fullName: string): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateDoctorCode(fullName)
    const { data, error } = await supabaseAdmin
      .from('doctor_codes')
      .select('id')
      .eq('code', code)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to check doctor code uniqueness: ${error.message}`)
    }

    if (!data) return code
  }

  throw new Error('Failed to generate a unique doctor code after 10 attempts')
}

async function cleanupCreatedDoctor(supabaseAdmin: SupabaseClient, userId: string): Promise<string> {
  const cleanupErrors: string[] = []

  const { error: codeCleanupError } = await supabaseAdmin
    .from('doctor_codes')
    .delete()
    .eq('doctor_user_id', userId)

  if (codeCleanupError) cleanupErrors.push(`doctor code cleanup failed: ${codeCleanupError.message}`)

  const { error: doctorProfileCleanupError } = await supabaseAdmin
    .from('doctor_profiles')
    .delete()
    .eq('user_id', userId)

  if (doctorProfileCleanupError) cleanupErrors.push(`doctor profile cleanup failed: ${doctorProfileCleanupError.message}`)

  const { error: profileCleanupError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileCleanupError) cleanupErrors.push(`profile cleanup failed: ${profileCleanupError.message}`)

  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (deleteUserError) cleanupErrors.push(`auth cleanup failed: ${deleteUserError.message}`)

  return cleanupErrors.length ? ` Cleanup also failed: ${cleanupErrors.join('; ')}` : ''
}

export async function POST(req: Request) {
  const { applicationId } = await req.json()
  const { supabase, error: adminError } = await requireAdmin()
  if (adminError) return adminError

  const password = generatePassword()

  if (!applicationId) {
    return NextResponse.json({ error: 'applicationId is required.' }, { status: 400 })
  }

  const { data: application, error: applicationLookupError } = await supabase
    .from('doctor_applications')
    .select('id, status, email, full_name, specialization, experience, languages')
    .eq('id', applicationId)
    .maybeSingle()

  if (applicationLookupError) {
    return NextResponse.json({ error: applicationLookupError.message }, { status: 500 })
  }

  if (!application) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  }

  const normalizedEmail = application.email?.toLowerCase().trim()
  const name = application.full_name?.trim()

  if (!normalizedEmail || !name) {
    return NextResponse.json({ error: 'Application is missing email or name.' }, { status: 400 })
  }

  if (application.status === 'account_created') {
    return NextResponse.json({ error: 'Doctor account has already been created for this application.' }, { status: 409 })
  }

  if (!['approved', 'call_scheduled'].includes(application.status)) {
    return NextResponse.json({
      error: 'Doctor account can only be created after the application is approved for onboarding.',
    }, { status: 409 })
  }

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingProfileError) {
    return NextResponse.json({ error: existingProfileError.message }, { status: 500 })
  }

  if (existingProfile) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 500 })
  }

  const userId = authData.user.id
  const normalizedLanguages = normalizeLanguages(application.languages)

  // 2. Insert profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    full_name: name,
    email: normalizedEmail,
    role: 'doctor',
  })

  if (profileError) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: `Doctor auth user was created, but profile setup failed: ${profileError.message}.${cleanupMessage}`,
      doctorUserId: userId,
    }, { status: 500 })
  }

  // 3. Insert doctor_profiles
  const { error: doctorProfileError } = await supabase.from('doctor_profiles').upsert({
    user_id: userId,
    specialization: application.specialization ?? null,
    experience: application.experience ?? null,
    languages: normalizedLanguages,
    verification_status: 'pending',
  }, {
    onConflict: 'user_id',
  })

  if (doctorProfileError) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: `Doctor auth user was created, but doctor profile setup failed: ${doctorProfileError.message}.${cleanupMessage}`,
      doctorUserId: userId,
    }, { status: 500 })
  }

  // 4. Generate and insert doctor code
  let doctorCode: string
  try {
    doctorCode = await generateUniqueDoctorCode(supabase, name)
  } catch (error) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: `${error instanceof Error ? error.message : 'Doctor auth user was created, but doctor code generation failed.'}.${cleanupMessage}`,
      doctorUserId: userId,
    }, { status: 500 })
  }

  const { error: doctorCodeError } = await supabase
    .from('doctor_codes')
    .insert({
      doctor_user_id: userId,
      code: doctorCode,
    })

  if (doctorCodeError) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: `Doctor auth user was created, but doctor code setup failed: ${doctorCodeError.message}.${cleanupMessage}`,
      doctorUserId: userId,
    }, { status: 500 })
  }

  // 5. Update application status
  const { error: applicationError } = await supabase
    .from('doctor_applications')
    .update({ status: 'account_created', reviewed_at: new Date().toISOString() })
    .eq('id', applicationId)

  if (applicationError) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: `Doctor auth user and code were created, but application status update failed: ${applicationError.message}.${cleanupMessage}`,
      doctorUserId: userId,
      doctorCode,
    }, { status: 500 })
  }

  // 6. Send credentials email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      from: `"ReVerie" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
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
            <p style="margin:0 0 6px;font-size:15px;font-family:monospace;"><strong>Email:</strong> ${normalizedEmail}</p>
            <p style="margin:0 0 6px;font-size:15px;font-family:monospace;"><strong>Password:</strong> ${password}</p>
            <p style="margin:0;font-size:15px;font-family:monospace;"><strong>Doctor Code:</strong> ${doctorCode}</p>
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
  } catch (error) {
    const cleanupMessage = await cleanupCreatedDoctor(supabase, userId)

    return NextResponse.json({
      error: error instanceof Error
        ? `Doctor auth user and code were created, but credentials email failed: ${error.message}.${cleanupMessage}`
        : `Doctor auth user and code were created, but credentials email failed.${cleanupMessage}`,
      doctorUserId: userId,
      doctorCode,
    }, { status: 500 })
  }

  return NextResponse.json({ success: true, doctorCode })
}
