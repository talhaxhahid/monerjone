import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { PHONE_UNLOCK_LIMITS, THIRTY_DAYS_MS } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');

    const limit = PHONE_UNLOCK_LIMITS[me.premium] || 0;
    const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);

    const used = await prisma.phoneUnlock.count({
      where: {
        userId: me.id,
        createdAt: { gte: cutoff },
      },
    });

    let unlocked = false;
    let phone: string | null = null;

    if (targetId) {
      const isUnlocked = await prisma.phoneUnlock.findUnique({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId,
          },
        },
      });

      if (isUnlocked || targetId === me.id) {
        unlocked = true;
        const target = await prisma.user.findUnique({
          where: { id: targetId },
          select: { phone: true },
        });
        phone = target?.phone || null;
      }
    }

    return NextResponse.json({
      unlocked,
      phone,
      limit,
      used,
      remaining: Math.max(0, limit - used),
    });
  } catch (error: any) {
    console.error('Error in GET /api/social/unlock:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

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

    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
      select: { phone: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }

    const alreadyUnlocked = await prisma.phoneUnlock.findUnique({
      where: {
        userId_targetId: {
          userId: me.id,
          targetId,
        },
      },
    });

    if (alreadyUnlocked) {
      return NextResponse.json({
        ok: true,
        phone: targetUser.phone,
      });
    }

    const limit = PHONE_UNLOCK_LIMITS[me.premium] || 0;
    const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);
    const used = await prisma.phoneUnlock.count({
      where: {
        userId: me.id,
        createdAt: { gte: cutoff },
      },
    });

    if (used >= limit) {
      return NextResponse.json(
        {
          ok: false,
          reason: 'LIMIT_REACHED',
          message:
            me.premium === 'Free'
              ? 'মোবাইল নম্বর দেখতে গোল্ড বা প্লাটিনাম প্যাকেজে আপগ্রেড করুন।'
              : `আপনার প্যাকেজের ৩০ দিনের মোবাইল নম্বর আনলক লিমিট (${limit}টি) শেষ হয়েছে।`,
          limit,
          used,
        },
        { status: 403 }
      );
    }

    await prisma.phoneUnlock.create({
      data: {
        userId: me.id,
        targetId,
      },
    });

    return NextResponse.json({
      ok: true,
      phone: targetUser.phone,
      remaining: Math.max(0, limit - (used + 1)),
    });
  } catch (error: any) {
    console.error('Error in POST /api/social/unlock:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
