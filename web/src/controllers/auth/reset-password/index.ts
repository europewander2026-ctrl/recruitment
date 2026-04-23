import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Missing token or passcode' }, { status: 400 });
    }

    // Hash the token provided by the user to match what is stored
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: hash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Key expired or invalid' }, { status: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update User
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    });

    // Destroy Token
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });

    return NextResponse.json({ success: true, message: 'Key updated' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
