'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Reserves space for MobileBottomNav, but only while it's actually
// rendered (logged-in users) -- guests get no bottom nav, so no gap either.
// The inbox page manages its own exact height (a fixed, full-bleed messenger
// layout), so it opts out of this padding entirely -- adding it there would
// just leave a dead gap below the chat card instead of the nav sitting flush
// against it.
export default function MainContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isFullBleedPage = pathname === '/inbox';
  const needsBottomNavGap = user && !isFullBleedPage;
  return <main className={`flex-1 ${needsBottomNavGap ? 'pb-16 md:pb-0' : ''}`}>{children}</main>;
}
