import nodemailer from 'nodemailer'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { applicationId, email, name, specialization, calendlyLink } = await req.json()
  const { supabase, error: adminError } = await requireAdmin()
  if (adminError) return adminError

  if (!applicationId || !email || !name || !calendlyLink) {
    return NextResponse.json({ error: 'applicationId, email, name, and calendlyLink are required.' }, { status: 400 })
  }

  const { data: application, error: applicationError } = await supabase
    .from('doctor_applications')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', applicationId)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (applicationError) {
    return NextResponse.json({ error: applicationError.message }, { status: 500 })
  }

  if (!application) {
    return NextResponse.json({ error: 'Pending application not found.' }, { status: 404 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  await transporter.sendMail({
    from: `"ReVerie" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your ReVerie application has been approved',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:48px 32px;color:#080B14;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;">
          Welcome to ReVerie,<br/>Dr. ${name}.
        </h1>
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          Your application as a ${specialization} has been reviewed and approved.
          We're excited to have you on the platform.
        </p>
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          The next step is a short onboarding call with our team — usually 30 minutes.
          Please book a time that works for you:
        </p>
        <a href="${calendlyLink}" style="display:inline-block;background:#2B4FD4;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-family:Arial,sans-serif;margin:8px 0 32px;">
          Book your onboarding call →
        </a>
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
