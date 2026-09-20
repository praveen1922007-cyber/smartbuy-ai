import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // For development, use ethereal or configure SMTP
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@smartbuy.ai',
    to: email,
    subject: 'SmartBuy AI — Password Reset',
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
  // eslint-disable-next-line no-console
  console.log('Password reset email sent', info.messageId);
}
