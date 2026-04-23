import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: hash, // Store hashed token for security
          expiresAt,
        },
      });

      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY || '',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "ImmiHire Auth", email: "europe.wander2026@gmail.com" },
            to: [{ email: user.email }],
            subject: "ImmiHire - Password Reset Request",
            htmlContent: `
              <html>
                <body style="font-family: sans-serif; padding: 20px;">
                  <h2>Password Reset</h2>
                  <p>You requested a password reset for your ImmiHire account.</p>
                  <p>Please click the link below to securely reset your password. This link expires in 15 minutes.</p>
                  <a href="${resetLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
                  <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
                </body>
              </html>
            `
          })
        });

        if (!response.ok) {
          console.error('Brevo API Error:', await response.text());
        } else {
          console.log(`Successfully sent recovery email to ${email}`);
        }
      } catch (brevoErr) {
        console.error('Brevo API Request Failed:', brevoErr);
        // We log the error but still return success below to prevent email enumeration
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true, message: 'If registered, a recovery node link was sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
