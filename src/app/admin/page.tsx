'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Copy,
  X,
  KeyRound
} from 'lucide-react';
import { bn, timeAgo } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, addToast } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('users');
  const [searchUser, setSearchUser] = useState<string>('');
  const [resetPasswordResult, setResetPasswordResult] = useState<{ name: string; password: string } | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [payRes, userRes] = await Promise.all([
        fetch('/api/admin/payment'),
        fetch(`/api/admin/users?q=${encodeURIComponent(searchUser)}`),
      ]);

      if (payRes.ok) {
        const pData = await payRes.json();
        setPayments(pData.payments || []);
      }

      if (userRes.ok) {
        const uData = await userRes.json();
        setUsersList(uData.users || []);
        setStats(uData.stats || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user, searchUser]);

  const handlePaymentAction = async (paymentId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        loadAdminData();
      } else {
        addToast(data.error || 'অ্যাকশন ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      addToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleUserPlanUpdate = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, premium: newPlan }),
      });
      if (res.ok) {
        addToast(`ইউজারের প্যাকেজ ${newPlan}-এ পরিবর্তন করা হয়েছে`, 'success');
        loadAdminData();
      }
    } catch {
      addToast('আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };


  const handleToggleActive = async (userId: string, name: string, makeActive: boolean) => {
    if (!makeActive) {
      const confirmed = window.confirm(
        `আপনি কি নিশ্চিত ${name}-এর অ্যাকাউন্ট নিষ্ক্রিয় করতে চান? ৬০ দিনের মধ্যে পুনরায় সক্রিয় করা না হলে অ্যাকাউন্টটি স্থায়ীভাবে মুছে যাবে এবং এই নম্বর দিয়ে আর নিবন্ধন করা যাবে না।`
      );
      if (!confirmed) return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, active: makeActive }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast(
          makeActive ? `${name}-এর অ্যাকাউন্ট পুনরায় সক্রিয় করা হয়েছে` : `${name}-এর অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে`,
          makeActive ? 'success' : 'info'
        );
        loadAdminData();
      } else {
        addToast(data.error || 'আপডেট ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      addToast('সার্ভার ত্রুটি', 'error');
    }
  };

  const handleResetPassword = async (userId: string, name: string) => {
    const confirmed = window.confirm(
      `${name}-এর জন্য নতুন পাসওয়ার্ড তৈরি করতে চান? পুরনো পাসওয়ার্ড আর কাজ করবে না।`
    );
    if (!confirmed) return;
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetPasswordResult({ name, password: data.tempPassword });
      } else {
        addToast(data.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      addToast('সার্ভার ত্রুটি', 'error');
    }
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D7E]/10 text-[#FF4D7E] text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MonerJone সুপার এডমিন কন্ট্রোল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif">
            এডমিন ড্যাশবোর্ড ও ব্যবস্থাপনা
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F1640] border border-white/10 hover:border-[#FF4D7E] text-xs font-semibold text-[#F5F3FA] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      {/* Analytics Counter Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-white/10 text-center">
            <span className="text-xs text-[#8B7FA8] block">মোট ইউজার</span>
            <span className="text-2xl font-bold text-[#F5F3FA] font-serif mt-1 block">
              {stats.totalUsers}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-white/10 text-center">
            <span className="text-xs text-[#8B7FA8] block">মোট পাত্র (বর)</span>
            <span className="text-2xl font-bold text-sky-400 font-serif mt-1 block">
              {stats.totalGrooms}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-white/10 text-center">
            <span className="text-xs text-[#8B7FA8] block">মোট পাত্রী (কনে)</span>
            <span className="text-2xl font-bold text-[#FF4D7E] font-serif mt-1 block">
              {stats.totalBrides}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-white/10 text-center">
            <span className="text-xs text-[#8B7FA8] block">গোল্ড মেম্বার</span>
            <span className="text-2xl font-bold text-[#F5B942] font-serif mt-1 block">
              {stats.totalGold}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-white/10 text-center">
            <span className="text-xs text-[#8B7FA8] block">প্লাটিনাম মেম্বার</span>
            <span className="text-2xl font-bold text-purple-400 font-serif mt-1 block">
              {stats.totalPlatinum}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-[#FF4D7E]/30 text-center">
            <span className="text-xs text-[#FF4D7E] font-semibold block">পেন্ডিং পেমেন্ট</span>
            <span className="text-2xl font-bold text-[#FF4D7E] font-serif mt-1 block">
              {stats.pendingPayments}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1F1640]/90 border border-rose-500/30 text-center">
            <span className="text-xs text-rose-400 font-semibold block">নিষ্ক্রিয় অ্যাকাউন্ট</span>
            <span className="text-2xl font-bold text-rose-400 font-serif mt-1 block">
              {stats.totalDeactivated}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/20'
              : 'bg-[#1F1640] text-[#B9AFD1] hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>বিকাশ পেমেন্ট রিকোয়েস্ট ({payments.filter((p) => p.status === 'PENDING').length} অপেক্ষমান)</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/20'
              : 'bg-[#1F1640] text-[#B9AFD1] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ইউজার ও বায়োডাটা তালিকা ({usersList.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: PAYMENTS ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {payments.length > 0 ? (
            <div className="overflow-x-auto rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-xl">
              <table className="w-full text-left text-xs text-[#B9AFD1]">
                <thead className="bg-[#150E2B] text-[11px] font-bold text-[#FF4D7E] uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">প্যাকেজ</th>
                    <th className="p-4">টাকা</th>
                    <th className="p-4">বিকাশ নম্বর</th>
                    <th className="p-4">TrxID</th>
                    <th className="p-4">অবস্থা</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#291D54]/40 transition-colors">
                      <td className="p-4 text-[#8B7FA8]">{timeAgo(pay.createdAt)}</td>
                      <td className="p-4">
                        <span className="font-bold text-[#F5F3FA] block">
                          {pay.user?.firstName} {pay.user?.lastName}
                        </span>
                        <span className="text-[11px] text-[#8B7FA8]">{pay.user?.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF4D7E]/10 text-[#FF4D7E] border border-[#FF4D7E]/30">
                          {bn(pay.plan)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#F5F3FA]">৳ {pay.amount}</td>
                      <td className="p-4 font-mono font-bold text-pink-300">{pay.bKashNumber}</td>
                      <td className="p-4 font-mono font-bold text-[#F5B942] select-all tracking-wider">
                        {pay.trxId}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            pay.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : pay.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : 'bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30 animate-pulse'
                          }`}
                        >
                          {bn(pay.status)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {pay.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePaymentAction(pay.id, 'APPROVE')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-colors cursor-pointer"
                              title="অনুমোদন করুন"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePaymentAction(pay.id, 'REJECT')}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 transition-colors cursor-pointer"
                              title="বাতিল করুন"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8B7FA8]">প্রক্রিয়াকৃত</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#8B7FA8] bg-[#1F1640]/40 rounded-3xl border border-white/10">
              কোনো পেমেন্ট রিকোয়েস্ট জমা নেই।
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: USERS ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8B7FA8] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম, ফোন নম্বর বা জেলা দিয়ে খুঁজুন..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:border-[#FF4D7E] outline-none placeholder:text-[#8B7FA8]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-xl">
            <table className="w-full text-left text-xs text-[#B9AFD1]">
              <thead className="bg-[#150E2B] text-[11px] font-bold text-[#FF4D7E] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">নাম ও ফোন</th>
                  <th className="p-4">লিঙ্গ ও বয়স</th>
                  <th className="p-4">জেলা</th>
                  <th className="p-4">প্যাকেজ</th>
                  <th className="p-4">বায়োডাটা অবস্থা</th>
                  <th className="p-4">অ্যাকাউন্ট স্ট্যাটাস</th>
                  <th className="p-4">ছবি</th>
                  <th className="p-4 text-right">প্যাকেজ পরিবর্তন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#291D54]/40 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#F5F3FA] block">{u.name}</span>
                      <span className="text-[11px] text-[#8B7FA8] font-mono">{u.phone}</span>
                    </td>
                    <td className="p-4">
                      <span>{bn(u.gender)}, {u.age} বছর</span>
                    </td>
                    <td className="p-4">{u.district || 'অনির্দিষ্ট'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF4D7E]/10 text-[#FF4D7E] border border-[#FF4D7E]/30">
                        {bn(u.premium)}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.profileComplete ? (
                        <span className="text-emerald-400">✓ সম্পূর্ণ</span>
                      ) : (
                        <span className="text-[#8B7FA8]">অসম্পূর্ণ</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.active ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          সক্রিয়
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-block">
                            নিষ্ক্রিয়
                          </span>
                          {u.daysUntilDeletion !== null && (
                            <div className="text-[10px] text-rose-300">
                              {u.daysUntilDeletion} দিনে স্থায়ী মুছে যাবে
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4">{u.photoCount} টি ছবি</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <select
                          value={u.premium}
                          onChange={(e) => handleUserPlanUpdate(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#150E2B] border border-white/10 text-[11px] text-[#FF4D7E] font-bold focus:border-[#FF4D7E] cursor-pointer outline-none"
                        >
                          <option value="Free">ফ্রি (Free)</option>
                          <option value="Gold">গোল্ড (Gold)</option>
                          <option value="Platinum">প্লাটিনাম (Platinum)</option>
                        </select>
                        {u.active ? (
                          <button
                            onClick={() => handleToggleActive(u.id, u.name, false)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-400 font-bold hover:bg-rose-500/20 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            নিষ্ক্রিয় করুন
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(u.id, u.name, true)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            পুনরায় সক্রিয় করুন
                          </button>
                        )}
                          <button
                            onClick={() => handleResetPassword(u.id, u.name)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-400 font-bold hover:bg-amber-500/20 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            পাসওয়ার্ড রিসেট
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {resetPasswordResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full rounded-3xl bg-[#1F1640] border border-amber-500/30 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F5F3FA]">
                  {resetPasswordResult.name}-এর নতুন পাসওয়ার্ড
                </h3>
              </div>
              <button
                onClick={() => setResetPasswordResult(null)}
                className="text-[#8B7FA8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#150E2B] border border-white/10">
              <code className="flex-1 text-[#F5B942] font-mono text-lg tracking-wider select-all">
                {resetPasswordResult.password}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordResult.password);
                  addToast('কপি করা হয়েছে', 'success');
                }}
                className="p-2 rounded-lg bg-[#1F1640] border border-white/10 text-[#B9AFD1] hover:text-white cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-rose-300 leading-relaxed">
              এই পাসওয়ার্ডটি এখনই কপি করে ব্যবহারকারীকে জানিয়ে দিন -- বন্ধ করার পর এটি আর কোথাও দেখা যাবে না। ব্যবহারকারীর পুরনো পাসওয়ার্ড আর কাজ করবে না।
            </p>

            <button
              onClick={() => setResetPasswordResult(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-sm font-bold transition-all cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
