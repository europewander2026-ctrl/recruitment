import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        const testCode = 'EVT-TEST-2026';
        
        // Check if exists
        const existing = await prisma.offerLetter.findUnique({
            where: { verificationCode: testCode }
        });

        if (existing) {
            // Update to fresh state
            await prisma.offerLetter.update({
                where: { verificationCode: testCode },
                data: {
                    candidateName: 'John Doe',
                    candidateEmail: 'john@example.com',
                    placementCountry: 'Germany',
                    status: 'ISSUED'
                }
            });
        } else {
            await prisma.offerLetter.create({
                data: {
                    verificationCode: testCode,
                    candidateName: 'John Doe',
                    candidateEmail: 'john@example.com',
                    placementCountry: 'Germany',
                    status: 'ISSUED'
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Test letter generated successfully. Code: ' + testCode });
    } catch (error) {
        console.error('Mock generation error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
