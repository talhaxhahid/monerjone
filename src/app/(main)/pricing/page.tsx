'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Crown, Check, X, ShieldCheck, CreditCard, Loader2, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const { user, addToast } = useAuth();
  const router = useRouter();
  const currentPlan = user?.premium || 'Free';

  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlanModal, setSelectedPlanModal] = useState<{
    key: 'gold' | 'platinum';
    label: string;
    price: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    async function checkPaymentConfig() {
      try {
        const res = await fetch('/api/payment/config');
        if (res.ok) {
          const data = await res.json();
          setStripeEnabled(data.stripeEnabled);
        } else {
          setStripeEnabled(false);
        }
      } catch {
        setStripeEnabled(false);
      }
    }
    checkPaymentConfig();
  }, []);

  const handleOpenUpgrade = (planKey: 'gold' | 'platinum', label: string, price: string, amount: number) => {
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    if (stripeEnabled) {
      // Both Stripe & bKash available: open selector modal
      setSelectedPlanModal({ key: planKey, label, price, amount });
    } else {
      // Direct to bKash payment page
      router.push(`/payment?plan=${planKey}`);
    }
  };

  const handleStripeCheckout = async (planKey: 'gold' | 'platinum') => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const res = await fetch('/api/payment/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.assign(data.url);
      } else {
        addToast(data.error || 'স্ট্রাইপ পেমেন্ট গেটওয়ে শুরু করা সম্ভব হয়নি।', 'error');
      }
    } catch {
      addToast('পেমেন্ট শুরু করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      key: 'free',
      label: 'ফ্রি প্যাকেজ',
      price: '৳ ০',
      amount: 0,
      period: 'আজীবন',
      desc: 'প্রাথমিক প্রোফাইল তৈরি ও ব্রাউজিং সুবিধা',
      features: [
        { text: 'বায়োডাটা তৈরি ও সম্পাদনা', included: true },
        { text: 'সকল পাত্র-পাত্রীর প্রোফাইল ব্রাউজিং', included: true },
        { text: 'পছন্দের তালিকা (শর্টলিস্ট) তৈরি', included: true },
        { text: 'সর্বোচ্চ ৫টি বার্তা আদান-প্রদান', included: true },
        { text: 'সরাসরি মোবাইল নম্বর আনলক', included: false },
        { text: 'কে প্রোফাইল দেখেছেন তা দেখা', included: false },
        { text: 'টপ প্রায়োরিটি লিস্টিং', included: false },
      ],
      featured: false,
    },
    {
      name: 'Gold',
      key: 'gold' as const,
      label: 'গোল্ড প্যাকেজ',
      price: '৳ ১,৩৫০',
      amount: 1350,
      period: '৩০ দিন',
      desc: 'দ্রুত জীবনসঙ্গী খোঁজার জন্য সবচেয়ে জনপ্রিয় প্যাকেজ',
      features: [
        { text: 'বায়োডাটা তৈরি ও সম্পাদনা', included: true },
        { text: 'সকল পাত্র-পাত্রীর প্রোফাইল ব্রাউজিং', included: true },
        { text: 'পছন্দের তালিকা (শর্টলিস্ট) তৈরি', included: true },
        { text: 'সীমাহীন বার্তা (মেসেজ) প্রেরণ', included: true },
        { text: '৩টি মোবাইল নম্বর সরাসরি আনলক', included: true },
        { text: 'সার্চে গোল্ড ব্যাজ ও প্রায়োরিটি লিস্টিং', included: true },
        { text: 'কে প্রোফাইল দেখেছেন তা দেখা', included: false },
      ],
      featured: true,
    },
    {
      name: 'Platinum',
      key: 'platinum' as const,
      label: 'প্লাটিনাম প্যাকেজ',
      price: '৳ ২,৪৯৯',
      amount: 2499,
      period: '৩০ দিন',
      desc: 'সর্বোচ্চ সুবিধা ও ভিআইপি সেবা সমৃদ্ধ প্যাকেজ',
      features: [
        { text: 'বায়োডাটা তৈরি ও সম্পাদনা', included: true },
        { text: 'সকল পাত্র-পাত্রীর প্রোফাইল ব্রাউজিং', included: true },
        { text: 'পছন্দের তালিকা (শর্টলিস্ট) তৈরি', included: true },
        { text: 'সীমাহীন বার্তা (মেসেজ) প্রেরণ', included: true },
        { text: '১০টি মোবাইল নম্বর সরাসরি আনলক', included: true },
        { text: 'কে কে প্রোফাইল দেখেছেন তাদের পূর্ণ তালিকা', included: true },
        { text: 'সার্চ রেজাল্ট ও ফিডে টপ প্রায়োরিটি', included: true },
      ],
      featured: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5B942]/10 border border-[#F5B942]/30 text-[#F5B942] text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>MonerJone প্রিমিয়াম সাবস্ক্রিপশন</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F3FA] font-serif">
          সঠিক প্যাকেজ বেছে নিন, শুরু করুন পথচলা
        </h1>
        <p className="text-sm sm:text-base text-[#B9AFD1] leading-relaxed">
          বিকাশ (bKash) ও আন্তর্জাতিক কার্ডের মাধ্যমে দ্রুত এবং নিরাপদভাবে আপনার পছন্দের প্যাকেজ সক্রিয় করুন।
        </p>
      </div>

      {/* Payment Badges Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>বিকাশ (bKash Send Money) সমর্থিত</span>
        </div>
        {stripeEnabled && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>ভিসা / মাস্টারকার্ড (Stripe) সমর্থিত</span>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.name;
          const isPurchasing = loadingPlan === p.key;

          return (
            <div
              key={p.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                p.featured
                  ? 'bg-gradient-to-b from-[#1F1640] via-[#1F1640] to-[#331A5C] border-2 border-[#FF4D7E] shadow-2xl shadow-[#FF4D7E]/20 md:-translate-y-2'
                  : 'bg-[#1F1640] border border-white/10 shadow-xl'
              }`}
            >
              {p.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF4D7E] text-white text-xs font-extrabold shadow-lg uppercase tracking-wider">
                  সবচেয়ে জনপ্রিয়
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#F5F3FA]">{p.label}</h3>
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        বর্তমান প্ল্যান
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#B9AFD1] mt-1">{p.desc}</p>
                </div>

                <div className="py-2 border-y border-white/10">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#F5B942] font-serif">
                    {p.price}
                  </span>
                  <span className="text-xs text-[#8B7FA8] ml-2">/ {p.period}</span>
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-[#8B7FA8]/50 shrink-0 mt-0.5" />
                      )}
                      <span className={feat.included ? 'text-[#F5F3FA]' : 'text-[#8B7FA8]'}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-2xl text-xs font-bold bg-[#331A5C] text-[#8B7FA8] border border-white/10 cursor-not-allowed text-center"
                  >
                    বর্তমান সক্রিয় প্যাকেজ
                  </button>
                ) : p.name === 'Free' ? (
                  <Link
                    href="/signup"
                    className="w-full py-3.5 rounded-2xl text-xs font-bold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 block text-center transition-all"
                  >
                    ফ্রি শুরু করুন
                  </Link>
                ) : (
                  <button
                    onClick={() => handleOpenUpgrade(p.key as 'gold' | 'platinum', p.label, p.price, p.amount)}
                    disabled={isPurchasing}
                    className="w-full py-3.5 rounded-2xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অপেক্ষা করুন...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-[#F5B942]" />
                        <span>{p.label}-এ আপগ্রেড করুন</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security Notice */}
      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#1F1640] border border-white/10 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#F5F3FA]">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>১০০% নিরাপদ ও নির্ভরযোগ্য পেমেন্ট সিস্টেম</span>
        </div>
        <p className="text-xs text-[#B9AFD1]">
          বিকাশ (bKash) ও Stripe কার্ড পেমেন্টের মাধ্যমে আপনার অ্যাকাউন্ট দ্রুত ও নিরাপদে প্রিমিয়াম প্যাকেজে আপগ্রেড করুন।
        </p>
      </div>

      {/* Payment Method Selection Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#1F1640] border border-white/15 p-6 sm:p-8 shadow-2xl shadow-[#FF4D7E]/20 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#B9AFD1] hover:text-[#F5F3FA] hover:bg-[#331A5C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-xs font-bold text-[#FF4D7E] uppercase tracking-wider block">পেমেন্ট মেথড বেছে নিন</span>
              <h3 className="text-xl font-extrabold text-[#F5F3FA] font-serif mt-1">
                {selectedPlanModal.label} ({selectedPlanModal.price})
              </h3>
              <p className="text-xs text-[#B9AFD1] mt-1">
                আপনি কোন মাধ্যমে পেমেন্ট সম্পন্ন করতে চান?
              </p>
            </div>

            {/* Methods list */}
            <div className="space-y-3">
              {/* Option 1: bKash */}
              <button
                onClick={() => {
                  const key = selectedPlanModal.key;
                  setSelectedPlanModal(null);
                  router.push(`/payment?plan=${key}`);
                }}
                className="w-full p-4 rounded-2xl bg-[#150E2B] hover:bg-[#291D54] border border-pink-500/30 hover:border-pink-500/70 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-sm">
                    ৳
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F3FA] group-hover:text-pink-300 transition-colors">
                      বিকাশ (bKash Send Money)
                    </h4>
                    <span className="text-[11px] text-[#8B7FA8]">
                      বিকাশ অ্যাপ/ইউএসএসডি দিয়ে ফি পাঠিয়ে TrxID সাবমিট
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option 2: Stripe */}
              {stripeEnabled && (
                <button
                  onClick={() => {
                    const key = selectedPlanModal.key;
                    setSelectedPlanModal(null);
                    handleStripeCheckout(key);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#150E2B] hover:bg-[#291D54] border border-indigo-500/30 hover:border-indigo-500/70 text-left transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#F5F3FA] group-hover:text-indigo-300 transition-colors">
                        আন্তর্জাতিক কার্ড / ভিসা / মাস্টারকার্ড
                      </h4>
                      <span className="text-[11px] text-[#8B7FA8]">
                        Stripe এর মাধ্যমে তাৎক্ষণিক অনলাইন পেমেন্ট
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-xs text-[#8B7FA8] hover:text-[#F5F3FA] transition-colors"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


