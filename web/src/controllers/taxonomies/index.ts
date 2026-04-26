import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get('type');
        
        if (type === 'category') {
            const categories = await prisma.jobCategory.findMany({ orderBy: { name: 'asc' } });
            return NextResponse.json({ success: true, data: categories });
        } else if (type === 'country') {
            const countries = await prisma.jobCountry.findMany({ orderBy: { name: 'asc' } });
            return NextResponse.json({ success: true, data: countries });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching taxonomies:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch taxonomies' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, name, region, isActive } = body;

        if (!name || !type) {
            return NextResponse.json({ success: false, error: 'Type and name are required' }, { status: 400 });
        }

        if (type === 'category') {
            const newCategory = await prisma.jobCategory.create({
                data: {
                    name,
                    isActive: isActive !== undefined ? isActive : true
                }
            });
            return NextResponse.json({ success: true, data: newCategory });
        } else if (type === 'country') {
            const newCountry = await prisma.jobCountry.create({
                data: {
                    name,
                    region: region || null,
                    isActive: isActive !== undefined ? isActive : true
                }
            });
            return NextResponse.json({ success: true, data: newCountry });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error creating taxonomy:', error);
        return NextResponse.json({ success: false, error: 'Failed to create taxonomy' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get('type');
        const id = req.nextUrl.searchParams.get('id');

        if (!type || !id) {
            return NextResponse.json({ success: false, error: 'Type and ID are required' }, { status: 400 });
        }

        if (type === 'category') {
            await prisma.jobCategory.delete({ where: { id } });
            return NextResponse.json({ success: true });
        } else if (type === 'country') {
            await prisma.jobCountry.delete({ where: { id } });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error deleting taxonomy:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete taxonomy' }, { status: 500 });
    }
}
