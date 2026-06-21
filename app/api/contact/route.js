import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Send email notification
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: 'naiyarvaibhav@gmail.com',
        subject: `New message from ${name} — Portfolio`,
        replyTo: email,
        html: `
          <div style="font-family:monospace;max-width:560px;padding:32px;background:#0A0A0A;color:#EDEDED;border-radius:8px;">
            <p style="color:#D1FF4C;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px;">/New contact form submission</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:rgba(255,255,255,0.5);font-size:11px;padding:8px 0;text-transform:uppercase;letter-spacing:0.08em;width:80px;">Name</td>
                <td style="color:#EDEDED;font-size:14px;padding:8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="color:rgba(255,255,255,0.5);font-size:11px;padding:8px 0;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
                <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#D1FF4C;font-size:14px;">${email}</a></td>
              </tr>
              <tr>
                <td style="color:rgba(255,255,255,0.5);font-size:11px;padding:8px 0;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;">Message</td>
                <td style="color:#EDEDED;font-size:14px;padding:8px 0;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>
            <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:24px 0 0;letter-spacing:0.06em;">ID: ${id} · ${timestamp}</p>
          </div>
        `,
      });
    }

    console.log('Contact submission:', { id, name, email, timestamp });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
