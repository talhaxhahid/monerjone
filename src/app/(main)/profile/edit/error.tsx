'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ProfileEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Profile Edit Wizard Error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#F5F3FA]">
          বায়োডাটা ফর্মে সমস্যা দেখা দিয়েছে
        </h2>
        <p className="text-xs text-[#B9AFD1]">
          {error?.message || 'অনুগ্রহ করে পৃষ্ঠাটি রিলোড দিন বা পুনরায় চেষ্টা করুন।'}
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF4D7E]/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] text-xs font-semibold flex items-center gap-2 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরুন</span>
        </Link>
      </div>
    </div>
  );
}
