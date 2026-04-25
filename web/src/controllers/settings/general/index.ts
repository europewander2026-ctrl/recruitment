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
    
    // Validate token
    jwt.verify(token, JWT_SECRET);

    let settings = await prisma.settings.findUnique({
        where: { id: 'global' }
    });

    if (!settings) {
        settings = await prisma.settings.create({
            data: { id: 'global' }
        });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = await getSessionToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    jwt.verify(token, JWT_SECRET);

    const data = await req.json();

    const updated = await prisma.settings.upsert({
      where: { id: 'global' },
      create: { ...data, id: 'global' },
      update: data,
    });

    return NextResponse.json({ success: true, data: updated, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
