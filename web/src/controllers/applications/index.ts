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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const roleStr = data.industry && data.country 
        ? `${data.industry} - ${data.country}` 
        : data.industry || 'Candidate';

    const newApp = await prisma.application.create({
      data: {
        name: data.fullName || 'Anonymous',
        role: roleStr,
        location: data.residence,
        exp: data.experience,
        edu: data.education,
        industry: data.industry,
        skills: {
          nationality: data.nationality,
          dob: data.dob,
          email: data.email,
          phone: data.phone,
          passport: data.passport,
          passportExpiry: data.passportExpiry,
          countryPreference: data.country
        },
        status: 'pending',
      }
    });

    // Trigger AI Scoring in background
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    fetch(`${protocol}://${host}/api/applications/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newApp.id })
    }).catch(err => console.error('Background AI scoring failed to start:', err));

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
