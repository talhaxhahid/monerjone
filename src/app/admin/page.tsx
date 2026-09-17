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
  Crown,
  Search,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { bn, timeAgo } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, addToast } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');
  const [searchUser, setSearchUser] = useState<string>('');

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

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MonerJone সুপার এডমিন কন্ট্রোল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
            এডমিন ড্যাশবোর্ড ও ব্যবস্থাপনা
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      {/* Analytics Counter Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">মোট ইউজার</span>
            <span className="text-2xl font-bold text-slate-100 font-serif mt-1 block">
              {stats.totalUsers}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">মোট পাত্র (বর)</span>
            <span className="text-2xl font-bold text-sky-400 font-serif mt-1 block">
              {stats.totalGrooms}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">মোট পাত্রী (কনে)</span>
            <span className="text-2xl font-bold text-pink-400 font-serif mt-1 block">
              {stats.totalBrides}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">গোল্ড মেম্বার</span>
            <span className="text-2xl font-bold text-amber-400 font-serif mt-1 block">
              {stats.totalGold}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">প্লাটিনাম মেম্বার</span>
            <span className="text-2xl font-bold text-purple-400 font-serif mt-1 block">
              {stats.totalPlatinum}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-pink-500/30 text-center">
            <span className="text-xs text-pink-400 font-semibold block">পেন্ডিং পেমেন্ট</span>
            <span className="text-2xl font-bold text-pink-300 font-serif mt-1 block">
              {stats.pendingPayments}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>বিকাশ পেমেন্ট রিকোয়েস্ট ({payments.filter((p) => p.status === 'PENDING').length} অপেক্ষমান)</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
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
            <div className="overflow-x-auto rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/40">
                      <td className="p-4 text-slate-400">{timeAgo(pay.createdAt)}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-100 block">
                          {pay.user?.firstName} {pay.user?.lastName}
                        </span>
                        <span className="text-[11px] text-slate-400">{pay.user?.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {bn(pay.plan)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-100">৳ {pay.amount}</td>
                      <td className="p-4 font-mono font-bold text-pink-300">{pay.bKashNumber}</td>
                      <td className="p-4 font-mono font-bold text-amber-300 select-all tracking-wider">
                        {pay.trxId}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            pay.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : pay.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
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
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-colors"
                              title="অনুমোদন করুন"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePaymentAction(pay.id, 'REJECT')}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 transition-colors"
                              title="বাতিল করুন"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">প্রক্রিয়াকৃত</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
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
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম, ফোন নম্বর বা জেলা দিয়ে খুঁজুন..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:border-amber-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">নাম ও ফোন</th>
                  <th className="p-4">লিঙ্গ ও বয়স</th>
                  <th className="p-4">জেলা</th>
                  <th className="p-4">প্যাকেজ</th>
                  <th className="p-4">বায়োডাটা অবস্থা</th>
                  <th className="p-4">ছবি</th>
                  <th className="p-4 text-right">প্যাকেজ পরিবর্তন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <span className="font-bold text-slate-100 block">{u.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{u.phone}</span>
                    </td>
                    <td className="p-4">
                      <span>{bn(u.gender)}, {u.age} বছর</span>
                    </td>
                    <td className="p-4">{u.district || 'অনির্দিষ্ট'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {bn(u.premium)}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.profileComplete ? (
                        <span className="text-emerald-400">✓ সম্পূর্ণ</span>
                      ) : (
                        <span className="text-slate-500">অসম্পূর্ণ</span>
                      )}
                    </td>
                    <td className="p-4">{u.photoCount} টি ছবি</td>
                    <td className="p-4 text-right">
                      <select
                        value={u.premium}
                        onChange={(e) => handleUserPlanUpdate(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-amber-400 font-bold focus:border-amber-400 cursor-pointer"
                      >
                        <option value="Free">ফ্রি (Free)</option>
                        <option value="Gold">গোল্ড (Gold)</option>
                        <option value="Platinum">প্লাটিনাম (Platinum)</option>
                      </select>
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
