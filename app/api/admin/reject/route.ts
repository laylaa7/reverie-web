import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { applicationId, email, name, reason } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('doctor_applications')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason ?? null,
    })
    .eq('id', applicationId)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  await transporter.sendMail({
    from: `"ReVerie" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'An update on your ReVerie application',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:48px 32px;color:#080B14;">
        <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">Dear Dr. ${name},</h1>
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          Thank you for your interest in joining ReVerie. After carefully reviewing your
          application, we are unable to move forward at this time.
        </p>
        ${reason ? `
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          <strong>Reason:</strong> ${reason}
        </p>
        ` : ''}
        <p style="color:#555;line-height:1.8;font-size:16px;margin:24px 0;">
          If you have questions or would like to discuss this further, please reach us at
          <a href="mailto:hello@reverie.health" style="color:#2B4FD4;">hello@reverie.health</a>
        </p>
        <p style="color:#bbb;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:24px;">
          — The ReVerie Team, Cairo
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
