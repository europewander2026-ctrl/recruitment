import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { candidateName, candidateEmail, verificationCode } = body;

        if (!candidateName || !candidateEmail || !verificationCode) {
            return NextResponse.json({ success: false, status: 'INVALID_PAYLOAD', message: 'Missing required fields' }, { status: 400 });
        }

        const document = await prisma.offerLetter.findUnique({
            where: { verificationCode: verificationCode.trim() }
        });

        if (!document) {
            return NextResponse.json({ success: true, status: 'NOT_FOUND' });
        }

        if (['Hungary', 'Croatia'].includes(document.placementCountry)) {
            return NextResponse.json({ success: true, status: 'SUSPICIOUS' });
        }

        if (
            document.candidateName.toLowerCase() !== candidateName.trim().toLowerCase() ||
            document.candidateEmail.toLowerCase() !== candidateEmail.trim().toLowerCase()
        ) {
            return NextResponse.json({ success: true, status: 'NOT_FOUND' });
        }

        return NextResponse.json({ success: true, status: 'VERIFIED', document });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
