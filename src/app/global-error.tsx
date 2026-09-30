'use client';

import React, { useEffect } from 'react';

// Last-resort error screen for crashes in the root layout itself (navbar,
// auth provider, etc. — things the segment-level error.tsx can't catch).
// Styled like the site (not a blank white page), and quietly retries once.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root-level runtime error:', error);
    try {
      const last = Number(sessionStorage.getItem('mj_auto_recover') || '0');
      if (Date.now() - last > 15000) {
        sessionStorage.setItem('mj_auto_recover', String(Date.now()));
        const t = setTimeout(() => reset(), 60);
        return () => clearTimeout(t);
      }
    } catch {
      /* sessionStorage unavailable — fall through to the manual UI */
    }
  }, [error, reset]);

  return (
    <html lang="bn">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#150E2B',
          color: '#F5F3FA',
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            background: '#1F1640',
            border: '1px solid rgba(255,77,126,0.3)',
            borderRadius: 24,
            padding: 32,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            পৃষ্ঠাটি লোড হয়নি
          </h2>
          <p style={{ fontSize: 13, color: '#B9AFD1', margin: '0 0 24px', lineHeight: 1.6 }}>
            একটু সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা হোমে ফিরে যান।
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                background: '#FF4D7E',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              আবার চেষ্টা করুন
            </button>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                background: '#331A5C',
                color: '#F5F3FA',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              হোমে ফিরুন
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
