import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

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
        jobId: data.jobId || null,
        status: 'RECEIVED',
        resumeUrl: data.resumeUrl || null,
        passportPhotoUrl: data.passportPhotoUrl || null,
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

    // Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails in background
    if (data.email && process.env.SMTP_USER) {
      transporter.sendMail({
        from: '"Eurovanta Talent" <info@eurovantatalent.com>',
        to: data.email,
        subject: 'Application Received - Eurovanta Talent',
        html: `<p>Dear ${data.fullName},</p><p>Thank you for applying to Eurovanta Talent. Your application for <strong>${roleStr}</strong> has been successfully received and is currently under review by our recruitment team.</p><p>We will contact you if your profile matches our requirements.</p><p>Best regards,<br>Eurovanta Talent Team</p>`
      }).catch(err => console.error('Failed to send candidate email:', err));

      transporter.sendMail({
        from: '"Eurovanta System" <noreply@eurovantatalent.com>',
        to: 'info@eurovantatalent.com',
        subject: `New Application Received: ${data.fullName}`,
        html: `<p><strong>New Application Received</strong></p><p>Candidate: ${data.fullName}</p><p>Role/Target: ${roleStr}</p><p>Email: ${data.email}</p><p>Location: ${data.residence}</p>`
      }).catch(err => console.error('Failed to send admin email:', err));
    }

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
