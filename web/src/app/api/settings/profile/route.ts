import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-admin-secret-2026';

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value;
}

export async function PUT(req: Request) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const data = await req.json();

    const updatePayload: any = {};
    if (data.email) updatePayload.email = data.email;
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        updatePayload.passwordHash = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    if (data.password) {
        const cookieStore = await cookies();
        cookieStore.set({ name: 'admin_session', value: '', maxAge: 0 }); // Nullify session
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully.', reauthRequired: !!data.password });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
