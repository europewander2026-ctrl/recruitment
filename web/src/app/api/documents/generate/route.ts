import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateUniqueCode(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    try {
        const { candidateName, candidateEmail, placementCountry } = await req.json();

        if (!candidateName || !placementCountry) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const verificationCode = generateUniqueCode();

        const offerLetter = await prisma.offerLetter.create({
            data: {
                verificationCode,
                candidateName,
                candidateEmail: candidateEmail || 'pending@example.com',
                placementCountry,
                status: 'ISSUED'
            }
        });

        return NextResponse.json({ success: true, code: verificationCode, document: offerLetter });
    } catch (error) {
        console.error('Error generating document:', error);
        return NextResponse.json({ success: false, error: 'Failed to generate document' }, { status: 500 });
    }
}
