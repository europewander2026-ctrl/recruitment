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

      // Instead of throwing errors if Brevo isn't setup, we will log for now.
      console.log(`[STUB] Sending Brevo Email to ${email}`);
      console.log(`[STUB] Recovery Link: http://localhost:3000/reset-password?token=${resetToken}`);
      // In production: await sendBrevoEmail(email, resetToken);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true, message: 'If registered, a recovery node link was sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
