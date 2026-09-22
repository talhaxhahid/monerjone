import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';

// Generates a fresh random password and overwrites the account's hash with
// it. This is the safe alternative to "viewing" a password: the OLD
// password is never known or recoverable (it's a one-way bcrypt hash), but
// an admin can issue the user a brand-new one to log in with, then tell
// them to change it. The generated password is returned ONCE in this
// response and is never stored or logged anywhere in plaintext.
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me || me.role !== 'ADMIN') {
      return NextResponse.json({ error: 'অননুমোদিত এক্সেস' }, { status: 403 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'ইউজার আইডি দিন' }, { status: 400 });
    }

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, phone: true, firstName: true } });
    if (!target) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি' }, { status: 404 });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return NextResponse.json({
      ok: true,
      tempPassword,
      message: `${target.firstName}-এর জন্য নতুন পাসওয়ার্ড তৈরি হয়েছে। এটি এখনই তাকে জানিয়ে দিন -- এই পাসওয়ার্ড আর কখনো দেখা যাবে না।`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/users/reset-password:', error);
    return NextResponse.json({ error: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
