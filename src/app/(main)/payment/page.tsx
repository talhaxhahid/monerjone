'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Phone,
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Crown,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { bn } from '@/lib/utils';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = (searchParams.get('plan') || 'gold').toLowerCase();
  const { user, loading: authLoading, addToast } = useAuth();

  const isPlatinum = planParam === 'platinum';
  const planName = isPlatinum ? 'Platinum' : 'Gold';
  const planAmount = isPlatinum ? 2499 : 1350;

  const [bKashSender, setBKashSender] = useState('');
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  const BKASH_NUMBER = '01700000000'; // Official MonerJone bKash Number

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/payment?plan=${planParam}`);
    }
  }, [user, authLoading, router, planParam]);

  const copyBkashNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    addToast('বিকাশ নম্বর কপি করা হয়েছে!', 'success');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bKashSender || bKashSender.length < 11) {
      setError('সঠিক বিকাশ মোবাইল নম্বর প্রদান করুন');
      return;
    }
    if (!trxId || trxId.length < 6) {
      setError('সঠিক বিকাশ TrxID প্রদান করুন');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planName,
          bKashNumber: bKashSender,
          trxId: trxId.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedSuccess(true);
        addToast('পেমেন্ট সফলভাবে জমা দেওয়া হয়েছে!', 'success');
      } else {
        setError(data.error || 'পেমেন্ট জমা দিতে সমস্যা হয়েছে');
      }
    } catch {
      setError('সার্ভার ত্রুটি');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-200 text-xs font-semibold shadow-lg">
          <img src="/images/bkash-logo-white.png" alt="bKash" className="h-4 object-contain" />
          <span>বিকাশ (bKash) নিরাপদ পেমেন্ট</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
          {bn(planName)} মেম্বারশিপ অ্যাক্টিভেশন
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          বিকাশের মাধ্যমে ফি পরিশোধ করে ট্রানজেকশন আইডি (TrxID) সাবমিট করুন
        </p>
      </div>

      {submittedSuccess ? (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            আপনার পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            ধন্যবাদ! আপনার TrxID টি আমাদের এডমিন ভেরিফাই করছেন। অল্প সময়ের মধ্যেই আপনার অ্যাকাউন্টটি{' '}
            <strong className="text-amber-400">{bn(planName)}</strong> প্যাকেজে আপগ্রেড হয়ে যাবে।
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Instructions Card (Md 6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                পেমেন্ট বিবরণী:
              </span>
              <div className="flex items-baseline justify-between pt-1 pb-3 border-b border-slate-800">
                <span className="text-base font-bold text-slate-100">{bn(planName)} প্যাকেজ (৩০ দিন)</span>
                <span className="text-2xl font-extrabold text-amber-400 font-serif">৳ {planAmount}</span>
              </div>
            </div>

            {/* BKash Official Number Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-pink-500/30 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">আমাদের বিকাশ নম্বর (Send Money):</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-mono font-bold text-pink-400 tracking-wider">
                  {BKASH_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={copyBkashNumber}
                  className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30 flex items-center gap-1 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  কপি করুন
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block text-sm">পেমেন্ট করার নিয়মাবলী:</span>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>আপনার বিকাশ অ্যাপে ঢুকুন অথবা *247# ডায়াল করুন।</li>
                <li><strong>Send Money</strong> অপশনটি বেছে নিন।</li>
                <li>উপরের বিকাশ নম্বরে <strong>৳ {planAmount}</strong> টাকা পাঠান।</li>
                <li>লেনদেন সফল হলে ফিরতি মেসেজ থেকে <strong>TrxID</strong> কপি করুন।</li>
                <li>ডানপাশের ফর্মে আপনার বিকাশ নম্বর ও TrxID লিখে সাবমিট করুন।</li>
              </ol>
            </div>
          </div>

          {/* Right Column: Submission Form (Md 6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/25 shadow-2xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>পেমেন্ট তথ্য প্রদান করুন</span>
            </h3>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  যে নম্বর থেকে বিকাশ করেছেন (Sender Number)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={bKashSender}
                    onChange={(e) => setBKashSender(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  বিকাশ ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: BL83K921MN"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono tracking-widest focus:border-amber-400 uppercase"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>পেমেন্ট নিশ্চিত করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% নিরাপদ ও সুরক্ষিত ট্রানজেকশন</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">লোড হচ্ছে...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
