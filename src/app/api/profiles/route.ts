import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge, computeMatchScore } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    const { searchParams } = new URL(request.url);

    const genderParam = searchParams.get('gender');
    const districtParam = searchParams.get('district');
    const religionParam = searchParams.get('religion');
    const maritalStatusParam = searchParams.get('maritalStatus');
    const educationParam = searchParams.get('education');
    const prayerFrequencyParam = searchParams.get('prayerFrequency');
    const childrenParam = searchParams.get('children');
    const premiumParam = searchParams.get('premium');
    const ageMinParam = searchParams.get('ageMin');
    const ageMaxParam = searchParams.get('ageMax');
    const sortParam = searchParams.get('sort') || 'newest';

    const where: any = {};

    // Opposite-gender rule enforced if logged in
    if (me) {
      where.id = { not: me.id };
      where.gender = me.gender === 'Male' ? 'Female' : 'Male';

      // Exclude blocked users (both ways)
      const blocksGiven = await prisma.block.findMany({
        where: { userId: me.id },
        select: { targetId: true },
      });
      const blocksReceived = await prisma.block.findMany({
        where: { targetId: me.id },
        select: { userId: true },
      });

      const blockedIds = [
        ...blocksGiven.map((b) => b.targetId),
        ...blocksReceived.map((b) => b.userId),
      ];

      if (blockedIds.length > 0) {
        where.id = { notIn: blockedIds, not: me.id };
      }
    } else if (genderParam === 'Male' || genderParam === 'Female') {
      where.gender = genderParam;
    }

    if (districtParam && districtParam !== 'All') {
      where.district = districtParam;
    }
    if (religionParam && religionParam !== 'All') {
      where.religion = religionParam;
    }
    if (maritalStatusParam && maritalStatusParam !== 'All') {
      where.maritalStatus = maritalStatusParam;
    }
    if (premiumParam === 'premium') {
      where.premium = { not: 'Free' };
    }

    // Profile relation conditions
    const profileWhere: any = {};
    if (educationParam && educationParam !== 'All') {
      profileWhere.education = educationParam;
    }
    if (prayerFrequencyParam && prayerFrequencyParam !== 'All') {
      profileWhere.prayerFrequency = prayerFrequencyParam;
    }
    if (childrenParam && childrenParam !== 'All') {
      profileWhere.children = childrenParam;
    }

    if (Object.keys(profileWhere).length > 0) {
      where.profile = profileWhere;
    }

    // Determine sort
    let orderBy: any = { createdAt: 'desc' };
    if (sortParam === 'active') {
      orderBy = { lastActive: 'desc' };
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        photos: {
          select: { id: true, position: true },
          orderBy: { position: 'asc' },
        },
      },
      orderBy,
    });

    // Favorites set
    let myFavorites = new Set<string>();
    if (me) {
      const favs = await prisma.favorite.findMany({
        where: { userId: me.id },
        select: { targetId: true },
      });
      myFavorites = new Set(favs.map((f) => f.targetId));
    }

    let profiles = users.map((u) => {
      const age = calculateAge(u.dob);
      const photoIds = u.photos.map((p) => p.id);
      const isOnline = Date.now() - new Date(u.lastActive).getTime() < 10 * 60 * 1000;
      const matchScore = me ? computeMatchScore(me.profile, { ...u, age, education: u.profile?.education, prayerFrequency: u.profile?.prayerFrequency }) : 88;

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
        photos: photoIds.map((id) => `/api/photos/${id}`),
        favorited: myFavorites.has(u.id),
        matchScore,
        createdAt: u.createdAt.toISOString(),
      };
    });

    // Filter age
    if (ageMinParam) {
      const min = parseInt(ageMinParam, 10);
      profiles = profiles.filter((p) => p.age >= min);
    }
    if (ageMaxParam) {
      const max = parseInt(ageMaxParam, 10);
      profiles = profiles.filter((p) => p.age <= max);
    }

    // Sort by premium if selected
    if (sortParam === 'premium') {
      profiles.sort((a, b) => {
        const scoreA = a.premium === 'Platinum' ? 2 : a.premium === 'Gold' ? 1 : 0;
        const scoreB = b.premium === 'Platinum' ? 2 : b.premium === 'Gold' ? 1 : 0;
        return scoreB - scoreA;
      });
    }

    return NextResponse.json({ profiles });
  } catch (error: any) {
    console.error('Error in GET /api/profiles:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
