import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ success: false, message: 'Document ID is required.' }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ success: false, message: 'Document not found.' }, { status: 404 });
    }

    // Mocking Payoneer checkout session
    const mockSessionId = `payo_sess_${Date.now()}`;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Simulation:
    setTimeout(async () => {
      await fetch(`${origin}/api/webhooks/payoneer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment_success',
          documentId: document.id,
          transactionId: `payo_txn_${Math.floor(Math.random() * 1000000)}`
        })
      }).catch(console.error);
    }, 1000);

    const successUrl = `${origin}/verify/success?session_id=${mockSessionId}&document_id=${document.id}`;

    return NextResponse.json({ success: true, url: successUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
  }
}
