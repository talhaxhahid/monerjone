import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRawCurrentUser } from '@/lib/auth';
import { calculateAge } from '@/lib/utils';

const DEACTIVATION_GRACE_DAYS = 60;

export async function GET() {
  try {
    // Uses the RAW (ungated) fetch deliberately -- a locked account must
    // still be able to learn that it's locked and how many days remain,
    // even though getCurrentUser() (used by every other route) treats it
    // as logged out for all real actions.
    const user = await getRawCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (!user.active) {
      const deactivatedAt = user.deactivatedAt ? new Date(user.deactivatedAt) : new Date();
      const elapsedDays = (Date.now() - deactivatedAt.getTime()) / (24 * 60 * 60 * 1000);
      const daysRemaining = Math.max(0, Math.ceil(DEACTIVATION_GRACE_DAYS - elapsedDays));
      return NextResponse.json({
        user: null,
        locked: true,
        daysRemaining,
        deactivatedAt: deactivatedAt.toISOString(),
      });
    }

    // Update lastActive
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    // Count unread messages
    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          OR: [{ userAId: user.id }, { userBId: user.id }],
        },
        fromUserId: { not: user.id },
        readAt: null,
      },
    });

    const firstPhoto = await prisma.photo.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
      select: { id: true },
    });

    const userPublic = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob.toISOString(),
      age: calculateAge(user.dob),
      district: user.district,
      religion: user.religion,
      maritalStatus: user.maritalStatus,
      phone: user.phone,
      role: user.role,
      premium: user.premium,
      premiumActivatedAt: user.premiumActivatedAt?.toISOString() || null,
      profileComplete: user.profileComplete,
      lastActive: new Date().toISOString(),
      createdAt: user.createdAt.toISOString(),
      photoUrl: firstPhoto ? `/api/photos/${firstPhoto.id}` : null,
    };

    const justExpiredPlan = (user as typeof user & { justExpiredPlan?: string }).justExpiredPlan || null;

    return NextResponse.json({ user: userPublic, unreadCount, justExpiredPlan });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
