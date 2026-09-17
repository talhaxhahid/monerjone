/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { containsContactInfo } from '@/lib/security';
import { calculateAge, computeCompletionScore } from '@/lib/utils';


export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    const photos = await prisma.photo.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
    });

    let hobbies: string[] = [];
    if (profile?.hobbies) {
      try {
        hobbies = JSON.parse(profile.hobbies);
      } catch {
        hobbies = [];
      }
    }

    const fullProfile = {
      id: user.id,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      gender: user.gender,
      dob: user.dob.toISOString(),
      age: calculateAge(user.dob),
      district: user.district,
      religion: user.religion,
      maritalStatus: user.maritalStatus,
      phone: user.phone,
      premium: user.premium,
      profileComplete: user.profileComplete,
      heightCm: profile?.heightCm || null,
      weightKg: profile?.weightKg || null,
      education: profile?.education || null,
      subject: profile?.subject || null,
      occupation: profile?.occupation || null,
      income: profile?.income || null,
      familyStatus: profile?.familyStatus || 'Middle class',
      fatherOccupation: profile?.fatherOccupation || null,
      motherOccupation: profile?.motherOccupation || null,
      brothers: profile?.brothers || 0,
      sisters: profile?.sisters || 0,
      languages: profile?.languages || 'Bangla, English',
      introduction: profile?.introduction || null,
      longBio: profile?.longBio || null,
      hobbies,
      favoriteBooks: profile?.favoriteBooks || null,
      favoriteFood: profile?.favoriteFood || null,
      smoking: profile?.smoking || null,
      prayerFrequency: profile?.prayerFrequency || null,
      hijabNiqab: profile?.hijabNiqab || null,
      children: profile?.children || null,
      allergies: profile?.allergies || null,
      healthProblems: profile?.healthProblems || null,
      lookingFor: profile?.lookingFor || null,
      prefAgeMin: profile?.prefAgeMin || 18,
      prefAgeMax: profile?.prefAgeMax || 45,
      prefHeight: profile?.prefHeight || null,
      prefEducation: profile?.prefEducation || null,
      prefDistrict: profile?.prefDistrict || null,
      workPreference: profile?.workPreference || null,
      photoIds: photos.map((p: { id: string }) => p.id),
      photos: photos.map((p: { id: string }) => `/api/photos/${p.id}`),
      rawPhotos: photos.map((p: { dataUrl: string }) => p.dataUrl),
    };

    return NextResponse.json({ profile: fullProfile });
  } catch (error: any) {
    console.error('Error in GET /api/profiles/me:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'লগইন করুন' }, { status: 401 });
    }

    const body = await request.json();

    const isFree = !user.premium || user.premium === 'Free';
    if (
      isFree &&
      (containsContactInfo(body.introduction) || containsContactInfo(body.longBio))
    ) {
      return NextResponse.json(
        {
          error: 'CONTACT_INFO_BLOCKED',
          message:
            'ফ্রি একাউন্টে বায়োডাটার পরিচিতি বা বিবরণে মোবাইল নম্বর, ফেসবুক, ইমেইল বা যোগাযোগের তথ্য দেওয়া সম্পূর্ণ নিষিদ্ধ। প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন।',
        },
        { status: 422 }
      );
    }

    // Update user top-level fields if provided
    const userUpdate: any = {};
    if (body.district) userUpdate.district = body.district;
    if (body.maritalStatus) userUpdate.maritalStatus = body.maritalStatus;
    if (body.religion) userUpdate.religion = body.religion;

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: userUpdate,
      });
    }

    // Safe integer parser
    const parseSafeInt = (val: unknown, fallback: number | null = null): number | null => {
      if (val === null || val === undefined || val === '') return fallback;
      const num = parseInt(String(val), 10);
      return isNaN(num) ? fallback : num;
    };

    // Profile fields
    const profileData = {
      heightCm: parseSafeInt(body.heightCm, null),
      weightKg: parseSafeInt(body.weightKg, null),
      education: body.education ? String(body.education) : null,
      subject: body.subject ? String(body.subject) : null,
      occupation: body.occupation ? String(body.occupation) : null,
      income: body.income ? String(body.income) : null,
      familyStatus: body.familyStatus ? String(body.familyStatus) : 'Middle class',
      fatherOccupation: body.fatherOccupation ? String(body.fatherOccupation) : null,
      motherOccupation: body.motherOccupation ? String(body.motherOccupation) : null,
      brothers: parseSafeInt(body.brothers, 0) ?? 0,
      sisters: parseSafeInt(body.sisters, 0) ?? 0,
      languages: body.languages ? String(body.languages) : 'Bangla, English',
      introduction: body.introduction ? String(body.introduction) : null,
      longBio: body.longBio ? String(body.longBio) : null,
      hobbies: Array.isArray(body.hobbies) ? JSON.stringify(body.hobbies) : '[]',
      favoriteBooks: body.favoriteBooks ? String(body.favoriteBooks) : null,
      favoriteFood: body.favoriteFood ? String(body.favoriteFood) : null,
      smoking: body.smoking ? String(body.smoking) : null,
      prayerFrequency: body.prayerFrequency ? String(body.prayerFrequency) : null,
      hijabNiqab: body.hijabNiqab ? String(body.hijabNiqab) : null,
      children: body.children ? String(body.children) : null,
      allergies: body.allergies ? String(body.allergies) : null,
      healthProblems: body.healthProblems ? String(body.healthProblems) : null,
      lookingFor: body.lookingFor ? String(body.lookingFor) : null,
      prefAgeMin: parseSafeInt(body.prefAgeMin, 18),
      prefAgeMax: parseSafeInt(body.prefAgeMax, 45),
      prefHeight: body.prefHeight ? String(body.prefHeight) : null,
      prefEducation: body.prefEducation ? String(body.prefEducation) : null,
      prefDistrict: body.prefDistrict ? String(body.prefDistrict) : null,
      workPreference: body.workPreference ? String(body.workPreference) : null,
    };

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...profileData,
      },
      update: profileData,
    });

    // Handle Photos if provided in array
    if (Array.isArray(body.photos)) {
      // Delete old photos
      await prisma.photo.deleteMany({
        where: { userId: user.id },
      });

      // Insert new compressed photos
      for (let i = 0; i < body.photos.length; i++) {
        const photoData = body.photos[i];
        if (typeof photoData === 'string' && photoData.length > 10) {
          await prisma.photo.create({
            data: {
              userId: user.id,
              dataUrl: photoData,
              position: i,
            },
          });
        }
      }
    }

    const photoCount = await prisma.photo.count({ where: { userId: user.id } });
    const completionScore = computeCompletionScore(user, updatedProfile, photoCount);
    const isComplete = completionScore >= 75;

    await prisma.user.update({
      where: { id: user.id },
      data: { profileComplete: isComplete },
    });

    return NextResponse.json({
      ok: true,
      completionScore,
      profileComplete: isComplete,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/profiles/me:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
