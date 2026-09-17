'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Crown, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { bn } from '@/lib/utils';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('পেমেন্ট সেশন আইডি পাওয়া যায়নি।');
      setLoading(false);
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/payment/stripe/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
          setPlan(data.plan);
          await refreshUser();

          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4D7E', '#F5B942', '#38BDF8', '#FFFFFF'],
          });
        } else {
          setError(data.message || data.error || 'পেমেন্ট যাচাই করা সম্ভব হয়নি।');
        }
      } catch (err: any) {
        setError(err?.message || 'নেটওয়ার্ক সমস্যা। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#FF4D7E] animate-spin" />
        <h2 className="text-xl font-bold text-[#F5F3FA]">আপনার পেমেন্ট যাচাই করা হচ্ছে...</h2>
        <p className="text-xs text-[#B9AFD1]">অনুগ্রহ করে অপেক্ষা করুন, কিছুক্ষণের মধ্যেই অ্যাকাউন্ট আপগ্রেড হবে।</p>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-[#1F1640] border border-white/10 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F3FA]">পেমেন্ট সংক্রান্ত তথ্য</h2>
          <p className="text-sm text-[#B9AFD1] leading-relaxed">{error}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/pricing"
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white transition-all"
            >
              প্যাকেজ পেইজে ফিরে যান
            </Link>
            <Link
              href="/contact"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA] hover:bg-[#4B2380] transition-all"
            >
              সাপোর্টে যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full rounded-3xl bg-[#1F1640] border border-[#FF4D7E]/30 p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF4D7E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#F5B942]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] p-1 mx-auto shadow-xl shadow-[#FF4D7E]/25">
            <div className="w-full h-full rounded-full bg-[#150E2B] flex items-center justify-center text-[#F5B942]">
              <Crown className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              পেমেন্ট সফল ও ভেরিফাইড
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif">
              অভিনন্দন! আপনার {plan ? bn(plan) : 'প্রিমিয়াম'} মেম্বারশিপ সক্রিয় হয়েছে
            </h1>
            <p className="text-xs sm:text-sm text-[#B9AFD1] leading-relaxed">
              আপনার অ্যাকাউন্টে এখন আনলিমিটেড মেসেজিং ও মোবাইল নম্বর আনলক সুবিধা যুক্ত হয়েছে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#150E2B]/80 border border-white/10 space-y-2 text-left text-xs">
            <div className="flex justify-between items-center text-[#B9AFD1]">
              <span>মেম্বারশিপ প্ল্যান:</span>
              <span className="font-bold text-[#F5B942]">{plan ? bn(plan) : 'Gold'}</span>
            </div>
            <div className="flex justify-between items-center text-[#B9AFD1]">
              <span>মেয়াদকাল:</span>
              <span className="font-bold text-[#F5F3FA]">৩০ দিন</span>
            </div>
            <div className="flex justify-between items-center text-[#B9AFD1]">
              <span>পেমেন্ট মেথড:</span>
              <span className="font-bold text-sky-400">Stripe Card Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/dashboard"
              className="py-3 px-4 rounded-xl text-xs font-bold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 flex items-center justify-center gap-1.5 transition-all"
            >
              ড্যাশবোর্ডে যান
            </Link>
            <Link
              href="/search"
              className="py-3 px-4 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>পাত্র/পাত্রী খুঁজুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#B9AFD1]">লোড হচ্ছে...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
