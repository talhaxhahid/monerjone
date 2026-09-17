import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'monerjone-secret-key-2026-production';
const COOKIE_NAME = 'monerjone_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, role: string = 'USER'): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        photos: {
          select: {
            id: true,
            position: true,
            createdAt: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!user) return null;

    // Check membership expiration
    if (user.premium !== 'Free' && user.premiumActivatedAt) {
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - new Date(user.premiumActivatedAt).getTime() >= THIRTY_DAYS) {
        await prisma.user.update({
          where: { id: user.id },
          data: { premium: 'Free', premiumActivatedAt: null },
        });
        user.premium = 'Free';
        user.premiumActivatedAt = null;
      }
    }

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
