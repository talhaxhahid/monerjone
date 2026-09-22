/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge, computeMatchScore } from '@/lib/utils';

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const count = await prisma.visit.count({
      where: { targetId: me.id },
    });

    if (me.premium !== 'Platinum') {
      return NextResponse.json({
        count,
        isPlatinum: false,
        profiles: [],
        message: 'কারা আপনার প্রোফাইল দেখেছেন তা বিস্তারিত দেখতে প্লাটিনাম মেম্বারশিপে আপগ্রেড করুন।',
      });
    }

    const visits = await prisma.visit.findMany({
      where: {
        targetId: me.id,
        visitor: { active: true },
      },
      include: {
        visitor: {
          include: {
            profile: true,
            photos: {
              select: { id: true, position: true },
              orderBy: { position: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Deduplicate by visitor ID
    const seen = new Set<string>();
    const uniqueVisitors = visits.filter((v) => {
      if (seen.has(v.visitorId)) return false;
      seen.add(v.visitorId);
      return true;
    });

    const profiles = uniqueVisitors.map((v) => {
      const u = v.visitor;
      if (!u) return null;
      const age = calculateAge(u.dob);
      const photoIds: string[] = (u.photos || []).map((p: { id: string }) => p.id);
      const isOnline = Date.now() - new Date(u.lastActive).getTime() < 10 * 60 * 1000;
      const matchScore = computeMatchScore(me.profile, { ...u, age, education: u.profile?.education, prayerFrequency: u.profile?.prayerFrequency });

      return {
        id: u.id,
        userId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: u.gender,
        age,
        district: u.district,
        religion: u.religion,
        maritalStatus: u.maritalStatus,
        occupation: u.profile?.occupation || null,
        education: u.profile?.education || null,
        heightCm: u.profile?.heightCm || null,
        introduction: u.profile?.introduction || null,
        prayerFrequency: u.profile?.prayerFrequency || null,
        hijabNiqab: u.profile?.hijabNiqab || null,
        premium: u.premium,
        profileComplete: u.profileComplete,
        lastActive: u.lastActive.toISOString(),
        active: isOnline,
        photoIds,
        photos: photoIds.map((id: string) => `/api/photos/${id}`),
        matchScore,
        visitedAt: v.createdAt.toISOString(),
      };
    }).filter(Boolean);

    return NextResponse.json({
      count,
      isPlatinum: true,
      profiles,
    });
  } catch (error: any) {
    console.error('Error in GET /api/social/visits:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
