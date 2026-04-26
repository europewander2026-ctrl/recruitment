import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const configs = await prisma.siteConfig.findMany();
        return NextResponse.json({ success: true, data: configs });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        
        // Body is expected to be a key-value object
        for (const [key, value] of Object.entries(body)) {
            if (typeof value === 'string') {
                await prisma.siteConfig.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                });
            }
        }
        
        return NextResponse.json({ success: true, message: 'Config updated' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update config' }, { status: 500 });
    }
}
