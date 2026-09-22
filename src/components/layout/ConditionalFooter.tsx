'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

// The inbox is a full-screen messenger-style experience on mobile (like
// FB/Instagram Messenger) -- a marketing footer underneath it doesn't belong
// there. It still shows on desktop, where there's room for the 2-pane layout
// plus a footer beneath it.
export default function ConditionalFooter() {
  const pathname = usePathname();
  const isMobileFullScreenPage = pathname === '/inbox';

  if (isMobileFullScreenPage) {
    return (
      <div className="hidden md:block">
        <Footer />
      </div>
    );
  }

  return <Footer />;
}
