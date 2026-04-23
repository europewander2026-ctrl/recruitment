import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (data.event === 'payment_success' && data.documentId) {
      await prisma.document.update({
        where: { id: data.documentId },
        data: {
          isPaid: true,
          paymentStatus: 'completed',
          paymentProvider: 'nomadpay',
          transactionId: data.transactionId
        }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    console.error('Nomadpay Webhook Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
