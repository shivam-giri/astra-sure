import nodemailer from 'nodemailer';

export async function sendResetEmail(to, url) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('[DEV] Password reset link:', url);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE || 'false') === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: EMAIL_FROM || 'AstraSure <no-reply@astrasure.app>',
    to,
    subject: 'Reset your AstraSure password',
    html: `<p>Click the link to reset your password. This link will expire soon.</p>
           <p><a href="${url}">${url}</a></p>`
  });
}