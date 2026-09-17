import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
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
    };

    return NextResponse.json({ user: userPublic, unreadCount });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
