'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Phone,
  CheckCircle2,
  Copy,
  ShieldCheck,
  AlertCircle,
  Clock,
  XCircle,
  CreditCard,
  Loader2,
  Receipt
} from 'lucide-react';
import { bn, timeAgo } from '@/lib/utils';

interface PaymentHistoryItem {
  id: string;
  plan: string;
  amount: number;
  bKashNumber: string;
  trxId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string | null;
  createdAt: string;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = (searchParams.get('plan') || 'gold').toLowerCase();
  const { user, loading: authLoading, addToast, refreshUser } = useAuth();

  const isPlatinum = planParam === 'platinum';
  const planName = isPlatinum ? 'Platinum' : 'Gold';
  const planAmount = isPlatinum ? 2499 : 1350;

  const [bKashSender, setBKashSender] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bkashNumber, setBkashNumber] = useState('01821124713');
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/payment?plan=${planParam}`);
    }
  }, [user, authLoading, router, planParam]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/payment/config');
        if (res.ok) {
          const data = await res.json();
          if (data.bkashNumber) setBkashNumber(data.bkashNumber);
          setStripeEnabled(!!data.stripeEnabled);
        }
      } catch (err) {
        console.error('Failed to load payment config', err);
      }
    }

    async function loadHistory() {
      try {
        const res = await fetch('/api/payment');
        if (res.ok) {
          const data = await res.json();
          setHistory(data.payments || []);
        }
      } catch (err) {
        console.error('Failed to load payment history', err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadConfig();
    if (user) {
      loadHistory();
    }
  }, [user]);

  const copyBkashNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    addToast('বিকাশ নম্বর কপি করা হয়েছে!', 'success');
  };

  const handleStripeCheckout = async () => {
    setLoadingStripe(true);
    try {
      const res = await fetch('/api/payment/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planParam }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.assign(data.url);
      } else {
        addToast(data.error || 'স্ট্রাইপ পেমেন্ট গেটওয়ে শুরু করা সম্ভব হয়নি।', 'error');
      }
    } catch {
      addToast('পেমেন্ট শুরু করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bKashSender || bKashSender.length < 11) {
      setError('সঠিক বিকাশ মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)');
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
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedSuccess(true);
        addToast(data.message || `আপনার ${planName} মেম্বারশিপ সফলভাবে চালু হয়েছে!`, 'success');
        // Refresh history
        if (data.payment) {
          setHistory((prev) => [data.payment, ...prev]);
        }
        // Pull the newly-activated premium status into the auth context
        // right away, then head to the dashboard so the upgrade is visible
        // immediately instead of leaving them on the payment form.
        await refreshUser();
        setTimeout(() => router.push('/dashboard'), 1200);
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
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold shadow-lg">
          <img src="/images/bkash-logo-white.png" alt="bKash" className="h-4 object-contain" />
          <span>বিকাশ (bKash) পেমেন্ট গেটওয়ে</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif">
          {bn(planName)} মেম্বারশিপ অ্যাক্টিভেশন
        </h1>
        <p className="text-xs sm:text-sm text-[#B9AFD1]">
          বিকাশের মাধ্যমে ফি পাঠিয়ে ট্রানজেকশন আইডি (TrxID) দিয়ে সাবমিট করুন
        </p>
      </div>

      {submittedSuccess ? (
        <div className="p-8 rounded-3xl bg-[#1F1640]/90 border border-emerald-500/30 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-[#F5F3FA]">
            {bn(planName)} মেম্বারশিপ চালু হয়েছে!
          </h2>
          <p className="text-xs sm:text-sm text-[#B9AFD1] max-w-md mx-auto leading-relaxed">
            ধন্যবাদ! আপনার অ্যাকাউন্ট এখনই{' '}
            <strong className="text-[#F5B942]">{bn(planName)}</strong> প্যাকেজে আপগ্রেড করা হয়েছে। ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-md shadow-[#FF4D7E]/20 transition-all cursor-pointer"
            >
              ড্যাশবোর্ডে যান
            </button>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setBKashSender('');
              }}
              className="px-5 py-3 rounded-xl text-xs font-semibold bg-[#150E2B] text-[#B9AFD1] hover:text-[#F5F3FA] border border-white/10 transition-all cursor-pointer"
            >
              অন্য পেমেন্ট জমা দিন
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto">

          {/* Single Unified Payment Card (no separate TrxID step) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1F1640]/90 border border-pink-500/25 shadow-2xl backdrop-blur-xl space-y-6">

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-baseline justify-between pb-4 border-b border-white/10">
              <span className="text-sm font-bold text-[#F5F3FA]">{bn(planName)} প্যাকেজ (৩০ দিন)</span>
              <span className="text-2xl font-extrabold text-[#F5B942] font-serif">৳ {planAmount}</span>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#F5F3FA] mb-2">
                  আপনি কোন বিকাশ নম্বর থেকে টাকা পাঠাচ্ছেন?
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="01XXXXXXXXX"
                    value={bKashSender}
                    onChange={(e) => setBKashSender(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:border-pink-500 outline-none"
                    required
                  />
                </div>
              </div>

              <ol className="space-y-3">
                <li className="flex items-start gap-3 text-xs text-[#B9AFD1]">
                  <span className="w-6 h-6 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center shrink-0">১</span>
                  <span className="pt-0.5"><strong className="text-[#F5F3FA]">"Send Money"</strong> অপশনে ক্লিক করুন।</span>
                </li>
                <li className="flex items-start gap-3 text-xs text-[#B9AFD1]">
                  <span className="w-6 h-6 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center shrink-0">২</span>
                  <span className="pt-0.5 flex items-center gap-2 flex-wrap">
                    <span>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ</span>
                    <span className="inline-flex items-center gap-1.5 font-mono font-bold text-pink-300 tracking-wider">
                      {bkashNumber}
                      <button
                        type="button"
                        onClick={copyBkashNumber}
                        className="p-1 rounded-md bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-[#B9AFD1]">
                  <span className="w-6 h-6 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center shrink-0">৩</span>
                  <span className="pt-0.5">টাকার পরিমাণঃ <strong className="text-[#F5B942]">৳{planAmount}</strong></span>
                </li>
                <li className="flex items-start gap-3 text-xs text-[#B9AFD1]">
                  <span className="w-6 h-6 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center shrink-0">৪</span>
                  <span className="pt-0.5">নিশ্চিত করতে নিচের বাটনে ক্লিক করুন।</span>
                </li>
              </ol>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>টাকা পাঠানো হয়েছে</span>
                )}
              </button>
            </form>

            {stripeEnabled && (
              <div className="pt-2 border-t border-white/10">
                <div className="p-3.5 mt-4 rounded-2xl bg-[#150E2B]/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#F5F3FA] block">কার্ড দিয়ে তাৎক্ষণিক পরিশোধ চান?</span>
                    <span className="text-[11px] text-[#8B7FA8]">ভিসা / মাস্টারকার্ডের মাধ্যমে অটো-অ্যাক্টিভেশন</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={loadingStripe}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {loadingStripe ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>স্ট্রাইপ কার্ডে পে করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 text-center text-xs text-[#8B7FA8] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% নিরাপদ ও সুরক্ষিত বিকাশ পেমেন্ট</span>
            </div>
          </div>
        </div>
      )}

      {/* User's Previous Payment Submissions History */}
      {!loadingHistory && history.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#F5B942]" />
            <h3 className="text-base font-bold text-[#F5F3FA]">আপনার পূর্ববর্তী পেমেন্ট রিকোয়েস্টসমূহ</h3>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-[#1F1640] border border-white/10 shadow-lg">
            <table className="w-full text-left text-xs text-[#B9AFD1]">
              <thead className="bg-[#150E2B] text-[11px] font-bold text-[#FF4D7E] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5">প্যাকেজ</th>
                  <th className="p-3.5">টাকা</th>
                  <th className="p-3.5">বিকাশ নম্বর</th>
                  <th className="p-3.5">TrxID</th>
                  <th className="p-3.5">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#291D54]/40 transition-colors">
                    <td className="p-3.5 text-[#8B7FA8]">{timeAgo(item.createdAt)}</td>
                    <td className="p-3.5 font-bold text-[#F5F3FA]">{bn(item.plan)}</td>
                    <td className="p-3.5 font-bold text-[#F5B942]">৳ {item.amount}</td>
                    <td className="p-3.5 font-mono text-pink-300">{item.bKashNumber}</td>
                    <td className="p-3.5 font-mono text-[#F5F3FA] select-all tracking-wider">{item.trxId}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : 'bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30'
                        }`}
                      >
                        {item.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {item.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        <span>{bn(item.status)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

