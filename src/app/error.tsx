'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in app:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#1F1640] border border-[#FF4D7E]/30 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#F5F3FA]">
            একটি অপ্রত্যাশিত সমস্যা হয়েছে
          </h2>
          <p className="text-xs text-[#B9AFD1] leading-relaxed">
            {error?.message || 'পৃষ্ঠাটি লোড করার সময় সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D7E]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
