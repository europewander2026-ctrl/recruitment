import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required.' },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { uniqueCode: code },
      include: {
        application: {
          select: { name: true, role: true }
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please check and try again.' },
        { status: 404 }
      );
    }

    // Explicitly exclude pdfUrl for security
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        documentType: document.documentType,
        isPaid: document.isPaid,
        paymentStatus: document.paymentStatus,
        candidateName: document.application.name,
        candidateRole: document.application.role,
        createdAt: document.createdAt
      }
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
