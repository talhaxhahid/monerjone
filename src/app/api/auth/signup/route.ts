import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { formatBDPhone, isBDPhone, calculateAge } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      gender,
      dob,
      district,
      religion = 'Islam',
      maritalStatus,
      phone,
      password,
    } = body;

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'নামের প্রথম ও শেষ অংশ দিন' }, { status: 400 });
    }
    if (gender !== 'Male' && gender !== 'Female') {
      return NextResponse.json({ error: 'লিঙ্গ নির্বাচন করুন' }, { status: 400 });
    }
    if (!dob) {
      return NextResponse.json({ error: 'জন্ম তারিখ প্রদান করুন' }, { status: 400 });
    }
    if (calculateAge(dob) < 18) {
      return NextResponse.json(
        { error: 'নিবন্ধন করতে আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে' },
        { status: 400 }
      );
    }
    if (!phone || !isBDPhone(phone)) {
      return NextResponse.json(
        { error: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)' },
        { status: 400 }
      );
    }
    if (!password || String(password).length < 8) {
      return NextResponse.json(
        { error: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' },
        { status: 400 }
      );
    }

    const cleanPhone = formatBDPhone(phone);

    // Permanently-deleted (unpaid-fine, never-reactivated) accounts can
    // never sign up again with the same number, even though their old
    // User row no longer exists.
    const banned = await prisma.bannedPhone.findUnique({ where: { phone: cleanPhone } });
    if (banned) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বরটি দিয়ে নতুন অ্যাকাউন্ট তৈরি করা যাবে না।' },
        { status: 403 }
      );
    }

    // Check if phone already registered
    const existing = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const birthDate = new Date(dob);

    // Check if this is the first user, make them ADMIN
    const count = await prisma.user.count();
    const role = count === 0 ? 'ADMIN' : 'USER';

    // Create user and initial profile
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        gender,
        dob: birthDate,
        district: district || null,
        religion: religion || 'Islam',
        maritalStatus: maritalStatus || null,
        phone: cleanPhone,
        passwordHash,
        role,
        premium: 'Free',
        profileComplete: false,
        profile: {
          create: {
            languages: 'Bangla, English',
            familyStatus: 'Middle class',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = generateToken(user.id, user.role);
    const cookie = setAuthCookie(token);

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
      profileComplete: user.profileComplete,
      lastActive: user.lastActive.toISOString(),
      createdAt: user.createdAt.toISOString(),
    };

    const response = NextResponse.json({ user: userPublic, token }, { status: 201 });
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'নিবন্ধন ব্যর্থ হয়েছে' }, { status: 500 });
  }
}
