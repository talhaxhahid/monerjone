'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, X, Check } from 'lucide-react';

export default function UpgradeModal({
  isOpen,
  onClose,
  title = 'প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন',
  description = 'সীমাহীন মেসেজ, মোবাইল নম্বর আনলক এবং সরাসরি যোগাযোগের জন্য আপনার পছন্দের প্যাকেজ বেছে নিন।',
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1F1640] border border-white/15 p-6 sm:p-8 shadow-2xl shadow-[#FF4D7E]/10 animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#B9AFD1] hover:text-[#F5F3FA] hover:bg-[#331A5C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] p-0.5 shadow-lg shadow-[#FF4D7E]/30">
            <div className="w-full h-full rounded-[14px] bg-[#150E2B] flex items-center justify-center text-[#F5B942]">
              <Crown className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5F3FA]">{title}</h3>
            <span className="text-xs text-[#F5B942] font-medium">MonerJone Premium</span>
          </div>
        </div>

        <p className="text-sm text-[#B9AFD1] leading-relaxed mb-6">
          {description}
        </p>

        {/* Perks list */}
        <div className="space-y-2.5 mb-8 bg-[#150E2B]/60 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সীমাহীন মেসেজ পাঠানোর সুবিধা</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সরাসরি মোবাইল নম্বর আনলক (৩ থেকে ১০টি)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>কারা আপনার প্রোফাইল দেখেছেন তাদের তালিকা দেখা</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সার্চ রেজাল্ট ও ফিডে টপ প্রায়োরিটি লিস্টিং</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="space-y-2.5">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/25 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#F5B942]" />
            প্যাকেজসমূহ দেখুন ও আপগ্রেড করুন
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-[#8B7FA8] hover:text-[#F5F3FA] hover:bg-[#331A5C] transition-colors"
          >
            এখন নয়
          </button>
        </div>
      </div>
    </div>
  );
}
