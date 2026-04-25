import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');

    let whereClause = {};
    if (country && country !== 'all') {
      whereClause = { country };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const job = await prisma.job.create({
      data: {
        title: data.title,
        country: data.country,
        salary: data.salary,
        category: data.category,
        responsibilities: data.responsibilities,
        status: data.status ? 'active' : 'paused',
      },
    });

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const data = await req.json();
      
      if (!data.id) {
          return NextResponse.json({ error: 'Missing Job ID' }, { status: 400 });
      }
  
      const job = await prisma.job.update({
        where: { id: data.id },
        data: {
          title: data.title,
          country: data.country,
          salary: data.salary,
          category: data.category,
          responsibilities: data.responsibilities,
          status: data.status ? 'active' : 'paused',
        },
      });
  
      return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing Job ID' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
