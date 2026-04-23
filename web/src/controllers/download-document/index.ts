import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Document ID is required.' }, { status: 400 });
    }

    // Verifying document status from Neon DB
    const document = await prisma.document.findUnique({
      where: { id },
      include: { application: true }
    });

    if (!document) {
      return NextResponse.json({ message: 'Document not found.' }, { status: 404 });
    }

    // Security Gate: Ensure isPaid === true
    if (!document.isPaid) {
      return NextResponse.json({ message: '403 Forbidden. Access denied. Payment required.' }, { status: 403 });
    }

    // Dynamic PDF Generation using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    
    // Header / Typography Logo
    page.drawText('Eurovanta Talent', {
      x: 50,
      y: height - 60,
      size: 28,
      font: fontBold,
      color: rgb(0.12, 0.25, 0.5),
    });
    
    page.drawText('OFFICIAL SELECTION & VERIFICATION LETTER', {
      x: 50,
      y: height - 100,
      size: 14,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Metadata
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: height - 140,
      size: 12,
      font: fontRegular,
    });
    
    page.drawText(`Unique Code: ${document.uniqueCode}`, {
      x: 50,
      y: height - 160,
      size: 12,
      font: fontRegular,
    });

    // Content Body
    const contentText = `
Dear ${document.application.name},

This letter serves as official verification that you have been successfully evaluated 
and selected for the role of ${document.application.role}.

This document has been securely verified and issued through the Eurovanta Talent platform.
Your payment and document processing are complete.

Status: VERIFIED & ACTIVE
Payment Provider: ${document.paymentProvider || 'N/A'}
Transaction ID: ${document.transactionId || 'N/A'}

We wish you the best in your new position.

Sincerely,
Eurovanta Talent Operations Team
    `.trim();

    page.drawText(contentText, {
      x: 50,
      y: height - 210,
      size: 12,
      font: fontRegular,
      lineHeight: 18,
      maxWidth: width - 100,
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Serve the buffer to the client
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${document.application.name.replace(/\s+/g, '_')}_Selection_Letter.pdf"`);

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Download Document Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
