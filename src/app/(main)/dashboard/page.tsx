'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Eye,
  MessageCircle,
  Crown,
  Sparkles,
  ArrowRight,
  Edit3,
  UserCheck,
  CheckCircle2,
  Lock,
  Search
} from 'lucide-react';
import { bn, cmToFeetInches } from '@/lib/utils';
import ProfileCard from '@/components/profiles/ProfileCard';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { ProfileCardData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, unreadCount } = useAuth();

  const [myProfile, setMyProfile] = useState<any>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [visitorList, setVisitorList] = useState<any[]>([]);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [recommended, setRecommended] = useState<ProfileCardData[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        // Load my profile details
        const profRes = await fetch('/api/profiles/me');
        if (profRes.ok) {
          const profData = await profRes.json();
          setMyProfile(profData.profile);
        }

        // Load visitor count & list
        const visitRes = await fetch('/api/social/visits');
        if (visitRes.ok) {
          const visitData = await visitRes.json();
          setVisitorCount(visitData.count || 0);
          if (visitData.isPlatinum) {
            setVisitorList(visitData.profiles || []);
          }
        }

        // Load favorites
        const favRes = await fetch('/api/social/favorites');
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavoritesCount(favData.profiles?.length || 0);
        }

        // Load recommended matches
        const recRes = await fetch('/api/profiles?sort=active');
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommended(recData.profiles.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completionPct = myProfile?.profileComplete ? 100 : 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Plan Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <span>👋 স্বাগতম</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
            আসসালামু আলাইকুম, {user.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            আপনার বায়োডাটা ও ম্যাচিং সংক্রান্ত সার্বিক তথ্য একনজরে দেখুন।
          </p>
        </div>

        {/* Plan status & upgrade CTA */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">বর্তমান প্যাকেজ</span>
            <span className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
              <Crown className="w-4 h-4" />
              {bn(user.premium)}
            </span>
          </div>

          {user.premium === 'Free' ? (
            <Link
              href="/pricing"
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              আপগ্রেড করুন
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-2xl font-semibold text-xs bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 transition-all"
            >
              প্যাকেজ বিবরণ
            </Link>
          )}
        </div>
      </div>

      {/* Stats & Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Shortlist Card */}
        <Link
          href="/favorites"
          className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/15 hover:border-amber-500/40 hover:-translate-y-1 transition-all group shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">পছন্দের বায়োডাটা</span>
            <span className="block text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif group-hover:text-rose-400 transition-colors">
              {favoritesCount} টি
            </span>
            <span className="text-[11px] text-slate-500">শর্টলিস্ট করা প্রোফাইল</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>
        </Link>

        {/* Profile Views / Visitors Card */}
        <div
          onClick={() => {
            if (user.premium !== 'Platinum') {
              setUpgradeModalOpen(true);
            }
          }}
          className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/15 hover:border-amber-500/40 hover:-translate-y-1 transition-all group shadow-lg flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">বায়োডাটা ভিউয়ার্স</span>
            <span className="block text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif group-hover:text-amber-400 transition-colors">
              {visitorCount} জন
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              {user.premium === 'Platinum' ? (
                'বিস্তারিত দেখার সুবিধা সক্রিয়'
              ) : (
                <span className="text-amber-400/80 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" /> প্লাটিনামে তালিকা দেখুন
                </span>
              )}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Messages Card */}
        <Link
          href="/inbox"
          className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/15 hover:border-amber-500/40 hover:-translate-y-1 transition-all group shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">নতুন বার্তা (ইনবক্স)</span>
            <span className="block text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif group-hover:text-sky-400 transition-colors">
              {unreadCount} টি
            </span>
            <span className="text-[11px] text-slate-500">অপঠিত মেসেজ</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Profile Completion Checklist Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>বায়োডাটা সম্পূর্ণতা: {completionPct}%</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              সম্পূর্ণ বায়োডাটা বেশি পাত্র-পাত্রী ও অভিভাবকদের দৃষ্টি আকর্ষণ করে।
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            বায়োডাটা সম্পাদনা করুন
          </Link>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Recommended Matches Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>আপনার জন্য প্রস্তাবিত পাত্র/পাত্রী</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার বয়স, জেলা ও পছন্দের ভিত্তিতে তৈরি বিশেষ তালিকা
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : recommended.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-xs text-slate-400">এই মুহূর্তে কোনো প্রস্তাবিত প্রোফাইল নেই</p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="প্লাটিনাম মেম্বারশিপে আপগ্রেড করুন"
        description="কে কে আপনার প্রোফাইল ভিউ করেছেন তাদের পূর্ণাঙ্গ তালিকা ও বিবরণ দেখতে প্লাটিনাম মেম্বারশিপে আপগ্রেড করুন।"
      />
    </div>
  );
}
