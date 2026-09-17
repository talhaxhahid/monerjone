import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const { targetId } = await request.json();
    if (!targetId || targetId === me.id) {
      return NextResponse.json({ error: 'ভুল অনুরোধ' }, { status: 400 });
    }

    const existing = await prisma.block.findUnique({
      where: {
        userId_targetId: {
          userId: me.id,
          targetId,
        },
      },
    });

    if (existing) {
      await prisma.block.delete({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId,
          },
        },
      });
      return NextResponse.json({ blocked: false });
    } else {
      await prisma.block.create({
        data: {
          userId: me.id,
          targetId,
        },
      });
      return NextResponse.json({ blocked: true });
    }
  } catch (error: any) {
    console.error('Error in POST /api/social/blocks:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
