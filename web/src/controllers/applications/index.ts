import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let whereClause = {};
    if (status && status !== 'All Applications') {
      whereClause = { status };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // Dynamic AI Score calculation based on presence of key attributes
    const enhancedApps = applications.map(app => {
        let dynamicScore = 40; // Base score
        
        // Experience bump
        if (app.exp) {
            const years = parseInt(app.exp);
            if (!isNaN(years) && years >= 5) dynamicScore += 25;
            else if (!isNaN(years) && years >= 2) dynamicScore += 15;
            else dynamicScore += 10;
        }

        // Education bump
        if (app.edu && app.edu.toLowerCase() !== 'high school' && app.edu.toLowerCase() !== 'none') {
            dynamicScore += 20;
        }

        // Visa bump
        if (app.visaStatus && app.visaStatus.toLowerCase() !== 'none') {
            dynamicScore += 15;
        }

        return {
            ...app,
            score: app.score > 0 ? app.score : Math.min(dynamicScore, 99) // fallback to dynamic score
        };
    });

    return NextResponse.json({ success: true, data: enhancedApps });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
