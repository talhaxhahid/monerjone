import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Photo ID required', { status: 400 });
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { dataUrl: true },
    });

    if (!photo || !photo.dataUrl) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    // Parse base64 data URL
    const match = photo.dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) {
      // If it's already an external URL or raw
      return NextResponse.redirect(photo.dataUrl);
    }

    const mimeType = match[1] || 'image/webp';
    const base64Data = match[2];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving photo:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
