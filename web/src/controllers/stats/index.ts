import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const totalCandidates = await prisma.application.count();
    const pendingReview = await prisma.application.count({
      where: { status: 'Pending Review' }
    });
    
    // Fallback: If pending review is 0 with exactly that string, check lowercase or just 'pending'
    let pendingCount = pendingReview;
    if (pendingCount === 0) {
        pendingCount = await prisma.application.count({
            where: {
                status: {
                    in: ['pending', 'Pending']
                }
            }
        });
    }

    const activeJobs = await prisma.job.count({
      where: { status: 'active' }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCandidates,
        pendingReview: pendingCount,
        activeJobs
      }
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
