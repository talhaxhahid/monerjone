import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
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
    };

    const formattedUsers = users.map((u) => ({
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
    }));

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

    const { userId, premium, role } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'ইউজার আইডি দিন' }, { status: 400 });
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
