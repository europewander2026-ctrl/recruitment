import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-admin-secret-2026';

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value;
}

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        const decoded = jwt.verify(await getSessionToken() || '', JWT_SECRET) as any;
        const userId = data.userId || decoded.userId;

        const notification = await prisma.notification.create({
            data: { message: data.message, userId }
        });
        return NextResponse.json({ success: true, data: notification });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();

    const token = await getSessionToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
