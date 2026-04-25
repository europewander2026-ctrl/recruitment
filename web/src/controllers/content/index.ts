import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const page = await prisma.pageContent.findUnique({
        where: { slug },
      });
      return NextResponse.json({ success: true, data: page });
    }

    const pages = await prisma.pageContent.findMany();
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.slug || !data.title || !data.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedPage = await prisma.pageContent.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        content: data.content,
      },
      create: {
        slug: data.slug,
        title: data.title,
        content: data.content,
      },
    });

    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
