import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { formatBDPhone, calculateAge } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন' }, { status: 400 });
    }

    const cleanPhone = formatBDPhone(phone);

    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
      include: {
        profile: true,
        photos: {
          select: { id: true, position: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল হয়েছে' },
        { status: 401 }
      );
    }

    // Update lastActive
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
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
      premiumActivatedAt: user.premiumActivatedAt?.toISOString() || null,
      profileComplete: user.profileComplete,
      lastActive: new Date().toISOString(),
      createdAt: user.createdAt.toISOString(),
    };

    const response = NextResponse.json({ user: userPublic, token });
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'লগইন ব্যর্থ হয়েছে' }, { status: 500 });
  }
}
