'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: { page: () => void };
  }
}

// Next.js does client-side route transitions, so a pixel's own initial
// "PageView" (fired once on full page load) won't fire again when someone
// navigates between pages in the app -- unlike the old static site, where
// every page was a full reload. This re-fires PageView on every route change
// so ad platforms keep seeing accurate per-page traffic.
export default function PixelRouteTracker() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      // The pixels' own bootstrap scripts already fire the very first PageView.
      isFirstLoad.current = false;
      return;
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
    if (typeof window.gtag === 'function') window.gtag('config', 'AW-18435571765', { page_path: pathname });
    if (window.ttq && typeof window.ttq.page === 'function') window.ttq.page();
  }, [pathname]);

  return null;
}
