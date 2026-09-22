'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Redirects a deactivated/locked account to the locked-account page from
// wherever they are in the app. This is a UX convenience only -- the real
// enforcement (blocking every action) happens server-side, since
// getCurrentUser() already returns null for locked accounts, which makes
// every protected API route reject them regardless of what page they're on.
export default function LockedAccountGuard() {
  const { lockInfo, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && lockInfo && pathname !== '/account-locked') {
      router.replace('/account-locked');
    }
  }, [loading, lockInfo, pathname, router]);

  return null;
}
