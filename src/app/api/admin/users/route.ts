import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, permanentlyDeleteUser } from '@/lib/auth';
import { calculateAge } from '@/lib/utils';

const DEACTIVATION_GRACE_DAYS = 60;
const DEACTIVATION_GRACE_MS = DEACTIVATION_GRACE_DAYS * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
    }

    // Sweep: permanently delete any deactivated accounts whose 60-day
    // grace period has passed and were never reactivated. Runs whenever
    // an admin opens the panel, in addition to the lazy per-account check
    // that happens if that specific user ever logs in again.
    const overdue = await prisma.user.findMany({
      where: {
        active: false,
        deactivatedAt: { lte: new Date(Date.now() - DEACTIVATION_GRACE_MS) },
      },
      select: { id: true, phone: true },
    });
    for (const u of overdue) {
      await permanentlyDeleteUser(u.id, u.phone);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
        { district: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        photos: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const userStats = {
      totalUsers: await prisma.user.count(),
      totalGrooms: await prisma.user.count({ where: { gender: 'Male' } }),
      totalBrides: await prisma.user.count({ where: { gender: 'Female' } }),
      totalGold: await prisma.user.count({ where: { premium: 'Gold' } }),
      totalPlatinum: await prisma.user.count({ where: { premium: 'Platinum' } }),
      pendingPayments: await prisma.paymentRequest.count({ where: { status: 'PENDING' } }),
      totalDeactivated: await prisma.user.count({ where: { active: false } }),
    };

    const formattedUsers = users.map((u) => {
      let daysUntilDeletion: number | null = null;
      if (!u.active && u.deactivatedAt) {
        const elapsedMs = Date.now() - new Date(u.deactivatedAt).getTime();
        daysUntilDeletion = Math.max(0, Math.ceil((DEACTIVATION_GRACE_MS - elapsedMs) / (24 * 60 * 60 * 1000)));
      }
      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        phone: u.phone,
        gender: u.gender,
        age: calculateAge(u.dob),
        district: u.district,
        premium: u.premium,
        role: u.role,
        profileComplete: u.profileComplete,
        photoCount: u.photos.length,
        createdAt: u.createdAt.toISOString(),
        lastActive: u.lastActive.toISOString(),
        active: u.active,
        deactivatedAt: u.deactivatedAt?.toISOString() || null,
        daysUntilDeletion,
      };
    });

    return NextResponse.json({ users: formattedUsers, stats: userStats });
  } catch (error: any) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
    }

    const { userId, premium, role, active } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'ইউজার আইডি দিন' }, { status: 400 });
    }

    // Admins can't accidentally lock themselves out.
    if (active === false && userId === me.id) {
      return NextResponse.json({ error: 'আপনি নিজের অ্যাকাউন্ট নিষ্ক্রিয় করতে পারবেন না' }, { status: 400 });
    }

    const updateData: any = {};
    if (premium) {
      updateData.premium = premium;
      if (premium !== 'Free') {
        updateData.premiumActivatedAt = new Date();
      } else {
        updateData.premiumActivatedAt = null;
      }
    }
    if (role) {
      updateData.role = role;
    }
    if (typeof active === 'boolean') {
      updateData.active = active;
      updateData.deactivatedAt = active ? null : new Date();
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/users:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
