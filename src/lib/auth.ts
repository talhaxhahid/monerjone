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

const DEACTIVATION_GRACE_DAYS = 60;
const DEACTIVATION_GRACE_MS = DEACTIVATION_GRACE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Fetches the logged-in user WITHOUT gating on active/deactivated status.
 * Used only by the lock-status check itself, so a locked-out user's own
 * account state can still be read to show them why they're locked. Every
 * other part of the app must use getCurrentUser() below instead, which
 * returns null for deactivated accounts and therefore blocks them from
 * doing anything.
 *
 * Also performs the 60-day sweep: if this account has been deactivated
 * for 60+ days and was never reactivated, it is permanently deleted here
 * (their phone number is preserved in BannedPhone so they can never sign
 * up again), and null is returned as if the account no longer exists.
 */
export async function getRawCurrentUser() {
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

    if (!user.active && user.deactivatedAt) {
      const elapsed = Date.now() - new Date(user.deactivatedAt).getTime();
      if (elapsed >= DEACTIVATION_GRACE_MS) {
        await permanentlyDeleteUser(user.id, user.phone);
        return null;
      }
    }

    // Check membership expiration
    if (user.premium !== 'Free' && user.premiumActivatedAt) {
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - new Date(user.premiumActivatedAt).getTime() >= THIRTY_DAYS) {
        const expiredPlan = user.premium;
        await prisma.user.update({
          where: { id: user.id },
          data: { premium: 'Free', premiumActivatedAt: null },
        });
        user.premium = 'Free';
        user.premiumActivatedAt = null;
        // Non-persisted marker so /api/auth/me can tell the frontend a
        // downgrade JUST happened (vs. the account already being Free),
        // so it can show a "your membership has ended" notice once.
        (user as typeof user & { justExpiredPlan?: string }).justExpiredPlan = expiredPlan;
      }
    }

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Permanently deletes a deactivated account that was never reactivated
 * within the grace period. Records the phone number in BannedPhone FIRST
 * (in the same transaction) so it can never be used to sign up again,
 * even though the User row itself is gone.
 */
export async function permanentlyDeleteUser(userId: string, phone: string) {
  await prisma.$transaction([
    prisma.bannedPhone.upsert({
      where: { phone },
      create: { phone },
      update: {},
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}

/**
 * The gated version used by every protected route/page in the app. A
 * deactivated account gets null here -- exactly as if they were logged
 * out -- so every existing "if (!me) return 401" check across the app
 * automatically blocks them without needing to touch each route.
 */
export async function getCurrentUser() {
  const user = await getRawCurrentUser();
  if (!user) return null;
  if (!user.active) return null;
  return user;
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
