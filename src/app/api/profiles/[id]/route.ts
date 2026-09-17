import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge, computeMatchScore } from '@/lib/utils';
import { PHONE_UNLOCK_LIMITS } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await getCurrentUser();

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        photos: {
          select: { id: true, position: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'বায়োডাটা পাওয়া যায়নি' }, { status: 404 });
    }

    let favorited = false;
    let unlocked = false;
    let phone: string | null = null;
    let iBlockedThem = false;
    let theyBlockedMe = false;

    if (me) {
      // Record visit if visitor is not viewing own profile
      if (me.id !== targetUser.id) {
        await prisma.visit.create({
          data: {
            visitorId: me.id,
            targetId: targetUser.id,
          },
        });
      }

      // Check favorite
      const fav = await prisma.favorite.findUnique({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId: targetUser.id,
          },
        },
      });
      favorited = !!fav;

      // Check phone unlock
      const unlock = await prisma.phoneUnlock.findUnique({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId: targetUser.id,
          },
        },
      });
      unlocked = !!unlock || me.id === targetUser.id;
      if (unlocked) {
        phone = targetUser.phone;
      }

      // Check blocks
      const block1 = await prisma.block.findUnique({
        where: {
          userId_targetId: {
            userId: me.id,
            targetId: targetUser.id,
          },
        },
      });
      iBlockedThem = !!block1;

      const block2 = await prisma.block.findUnique({
        where: {
          userId_targetId: {
            userId: targetUser.id,
            targetId: me.id,
          },
        },
      });
      theyBlockedMe = !!block2;
    }

    let hobbies: string[] = [];
    if (targetUser.profile?.hobbies) {
      try {
        hobbies = JSON.parse(targetUser.profile.hobbies);
      } catch {
        hobbies = [];
      }
    }

    const age = calculateAge(targetUser.dob);
    const photoIds = targetUser.photos.map((p) => p.id);
    const isOnline = Date.now() - new Date(targetUser.lastActive).getTime() < 10 * 60 * 1000;
    const matchScore = me ? computeMatchScore(me.profile, { ...targetUser, age, education: targetUser.profile?.education, prayerFrequency: targetUser.profile?.prayerFrequency }) : 88;

    const fullProfile = {
      id: targetUser.id,
      userId: targetUser.id,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      name: `${targetUser.firstName} ${targetUser.lastName}`,
      gender: targetUser.gender,
      dob: targetUser.dob.toISOString(),
      age,
      district: targetUser.district,
      religion: targetUser.religion,
      maritalStatus: targetUser.maritalStatus,
      phone,
      premium: targetUser.premium,
      profileComplete: targetUser.profileComplete,
      heightCm: targetUser.profile?.heightCm || null,
      weightKg: targetUser.profile?.weightKg || null,
      education: targetUser.profile?.education || null,
      subject: targetUser.profile?.subject || null,
      occupation: targetUser.profile?.occupation || null,
      income: targetUser.profile?.income || null,
      familyStatus: targetUser.profile?.familyStatus || 'Middle class',
      fatherOccupation: targetUser.profile?.fatherOccupation || null,
      motherOccupation: targetUser.profile?.motherOccupation || null,
      brothers: targetUser.profile?.brothers || 0,
      sisters: targetUser.profile?.sisters || 0,
      languages: targetUser.profile?.languages || 'Bangla, English',
      introduction: targetUser.profile?.introduction || null,
      longBio: targetUser.profile?.longBio || null,
      hobbies,
      favoriteBooks: targetUser.profile?.favoriteBooks || null,
      favoriteFood: targetUser.profile?.favoriteFood || null,
      smoking: targetUser.profile?.smoking || null,
      prayerFrequency: targetUser.profile?.prayerFrequency || null,
      hijabNiqab: targetUser.profile?.hijabNiqab || null,
      children: targetUser.profile?.children || null,
      allergies: targetUser.profile?.allergies || null,
      healthProblems: targetUser.profile?.healthProblems || null,
      lookingFor: targetUser.profile?.lookingFor || null,
      prefAgeMin: targetUser.profile?.prefAgeMin || 18,
      prefAgeMax: targetUser.profile?.prefAgeMax || 45,
      prefHeight: targetUser.profile?.prefHeight || null,
      prefEducation: targetUser.profile?.prefEducation || null,
      prefDistrict: targetUser.profile?.prefDistrict || null,
      workPreference: targetUser.profile?.workPreference || null,
      photoIds,
      photos: photoIds.map((pid) => `/api/photos/${pid}`),
      favorited,
      unlocked,
      iBlockedThem,
      theyBlockedMe,
      matchScore,
      active: isOnline,
      lastActive: targetUser.lastActive.toISOString(),
      createdAt: targetUser.createdAt.toISOString(),
    };

    return NextResponse.json({ profile: fullProfile });
  } catch (error: any) {
    console.error('Error in GET /api/profiles/[id]:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
