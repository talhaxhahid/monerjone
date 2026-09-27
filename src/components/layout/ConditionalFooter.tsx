'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Footer from './Footer';

// The footer is hidden entirely on the guest landing page (it's a single-
// screen splash with no scrolling), and hidden on mobile everywhere else —
// the inbox is a full-screen messenger-style experience on mobile (like
// FB/Instagram Messenger) where a marketing footer doesn't belong, and on
// other pages mobile users get a cleaner, shorter page. It still shows on
// desktop, where there's room for it beneath the main content.
export default function ConditionalFooter() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isGuestLandingPage = pathname === '/' && !user;
  if (isGuestLandingPage) {
    return null;
  }

  return (
    <div className="hidden md:block">
      <Footer />
    </div>
  );
}
