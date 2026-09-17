'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Crown, Check, X, ShieldCheck, CreditCard, AlertTriangle, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const { user, addToast } = useAuth();
  const router = useRouter();
  const currentPlan = user?.premium || 'Free';

  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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

  const handleStripeCheckout = async (planKey: 'gold' | 'platinum') => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!stripeEnabled) {
      addToast('অনলাইন পেমেন্ট বর্তমানে নিষ্ক্রিয় রয়েছে।', 'error');
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
        addToast(data.error || 'পেমেন্ট গেটওয়ে শুরু করা সম্ভব হয়নি।', 'error');
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
          আপনার পছন্দ অনুযায়ী সেরা প্যাকেজ নির্বাচন করে সরাসরি যোগাযোগ ও আনলক সুবিধা উপভোগ করুন।
        </p>
      </div>

      {/* Stripe Gateway Status Banner */}
      {stripeEnabled === false && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-[#F5B942]" />
          <span>
            অনলাইন পেমেন্ট গেটওয়ে (Stripe) বর্তমানে পরিবেশ কনফিগারেশনে যুক্ত নেই। প্যাকেজ ক্রয় সাময়িকভাবে নিষ্ক্রিয় রয়েছে।
          </span>
        </div>
      )}

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
                ) : stripeEnabled === false ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-2xl text-xs font-semibold bg-[#150E2B] text-[#8B7FA8] border border-white/10 cursor-not-allowed text-center flex items-center justify-center gap-1.5"
                  >
                    <span>প্যাকেজ ক্রয় নিষ্ক্রিয়</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStripeCheckout(p.key as 'gold' | 'platinum')}
                    disabled={isPurchasing}
                    className="w-full py-3.5 rounded-2xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>স্ট্রাইপ সংযোগ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
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
          <span>Stripe Card Payment এর মাধ্যমে আন্তর্জাতিক মানের নিরাপদ পেমেন্ট</span>
        </div>
        <p className="text-xs text-[#B9AFD1]">
          স্ট্রাইপ পেমেন্ট সফল হওয়ার সাথে সাথে আপনার প্যাকেজ ও আনলক কোটা স্বয়ংক্রিয়ভাবে সক্রিয় হয়ে যাবে।
        </p>
      </div>
    </div>
  );
}

