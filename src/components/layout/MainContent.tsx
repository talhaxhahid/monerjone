'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Reserves space for MobileBottomNav, but only while it's actually
// rendered (logged-in users) -- guests get no bottom nav, so no gap either.
// The inbox page manages its own exact height (a fixed, full-bleed messenger
// layout), so it opts out of this padding entirely -- adding it there would
// just leave a dead gap below the chat card instead of the nav sitting flush
// against it. The guest landing page is a single-screen splash: it's pinned
// to exactly the viewport height (minus the navbar) with no scrolling.
export default function MainContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isFullBleedPage = pathname === '/inbox';
  const isGuestLandingPage = pathname === '/' && !user;
  const needsBottomNavGap = user && !isFullBleedPage;

  if (isGuestLandingPage) {
    return (
      <main className="h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] overflow-hidden">
        {children}
      </main>
    );
  }

  return <main className={`flex-1 ${needsBottomNavGap ? 'pb-16 md:pb-0' : ''}`}>{children}</main>;
}
