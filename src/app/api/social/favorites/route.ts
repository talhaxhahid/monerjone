/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge, computeMatchScore } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    // direction=received -> "who favorited me" (reverse lookup);
    // default -> "my favorites" (who I favorited).
    const { searchParams } = new URL(request.url);
    const direction = searchParams.get('direction');
    const isReceived = direction === 'received';

    const favs = isReceived
      ? await prisma.favorite.findMany({
          where: {
            targetId: me.id,
            user: { active: true },
          },
          include: {
            user: {
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
        })
      : await prisma.favorite.findMany({
          where: {
            userId: me.id,
            target: { active: true },
          },
          include: {
            target: {
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
        });

    // For the "received" list, whether I've favorited them BACK isn't
    // automatically true -- look it up so the heart icon reflects reality.
    let myGivenTargetIds = new Set<string>();
    if (isReceived) {
      const mine = await prisma.favorite.findMany({
        where: { userId: me.id },
        select: { targetId: true },
      });
      myGivenTargetIds = new Set(mine.map((m) => m.targetId));
    }

    const profiles = favs.map((f: any) => {
      const u = isReceived ? f.user : f.target;
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
        favorited: isReceived ? myGivenTargetIds.has(u.id) : true,
        matchScore,
        createdAt: u.createdAt.toISOString(),
      };
    }).filter(Boolean);

    return NextResponse.json({ profiles });
  } catch (error: any) {
    console.error('Error in GET /api/social/favorites:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const body = await request.json();
    const targetId = body.targetId || body.targetUserId;
    if (!targetId || targetId === me.id) {
      return NextResponse.json({ error: 'সঠিক টার্গেট আইডি দিন' }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_targetId: {
          userId: me.id,
          targetId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId,
          },
        },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: me.id,
          targetId,
        },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error: any) {
    console.error('Error in POST /api/social/favorites:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
