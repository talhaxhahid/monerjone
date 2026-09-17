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
  Lock,
  Phone,
  Search,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { bn } from '@/lib/utils';
import ProfileCard from '@/components/profiles/ProfileCard';
import UpgradeModal from '@/components/ui/UpgradeModal';
import { ProfileCardData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, unreadCount } = useAuth();

  const [myProfile, setMyProfile] = useState<any>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [phoneUnlockStats, setPhoneUnlockStats] = useState<{ limit: number; used: number; remaining: number }>({
    limit: 0,
    used: 0,
    remaining: 0,
  });
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
        // 1. Load my profile details
        const profRes = await fetch('/api/profiles/me');
        if (profRes.ok) {
          const profData = await profRes.json();
          setMyProfile(profData.profile);
        }

        // 2. Load visitor count
        const visitRes = await fetch('/api/social/visits');
        if (visitRes.ok) {
          const visitData = await visitRes.json();
          setVisitorCount(visitData.count || 0);
        }

        // 3. Load favorites
        const favRes = await fetch('/api/social/favorites');
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavoritesCount(favData.profiles?.length || 0);
        }

        // 4. Load phone unlock quota
        const unlockRes = await fetch('/api/social/unlock');
        if (unlockRes.ok) {
          const unlockData = await unlockRes.json();
          setPhoneUnlockStats({
            limit: unlockData.limit || 0,
            used: unlockData.used || 0,
            remaining: unlockData.remaining || 0,
          });
        }

        // 5. Load recommended matches
        const recRes = await fetch('/api/profiles?sort=active');
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommended(recData.profiles.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
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
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate completion percentage
  let completionPct = 65;
  if (myProfile) {
    let filled = 0;
    const fieldsToCheck = [
      myProfile.education,
      myProfile.occupation,
      myProfile.district,
      myProfile.heightCm,
      myProfile.introduction,
      myProfile.prayerFrequency,
      myProfile.lookingFor,
      myProfile.photos?.length > 0,
    ];
    fieldsToCheck.forEach((f) => {
      if (f) filled++;
    });
    completionPct = Math.min(100, Math.round(50 + (filled / fieldsToCheck.length) * 50));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-12">
      
      {/* ================= 1. WELCOME & PLAN HERO CARD ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1F1640] via-[#1F1640]/95 to-[#331A5C] border border-[#FF4D7E]/25 p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left: Monogram & Greeting */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] p-0.5 shadow-lg shadow-[#FF4D7E]/25 shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#150E2B] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#F5B942]">
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4D7E]/10 text-[#FF4D7E] text-[10px] sm:text-xs font-semibold border border-[#FF4D7E]/20">
              <span>👋 আসসালামু আলাইকুম</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F5F3FA] font-serif">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs text-[#B9AFD1]">
              {user.district || 'বাংলাদেশ'} • {user.gender === 'Male' ? 'পাত্র' : 'পাত্রী'} প্রোফাইল
            </p>
          </div>
        </div>

        {/* Right: Plan Status & Quick Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end w-full md:w-auto gap-3 relative z-10 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="px-3.5 py-2 rounded-2xl bg-[#150E2B] border border-white/10 text-left sm:text-right">
            <span className="text-[10px] text-[#8B7FA8] uppercase tracking-wider block">মেম্বারশিপ</span>
            <span className="text-xs sm:text-sm font-bold text-[#F5B942] flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              {bn(user.premium)}
            </span>
          </div>

          {user.premium === 'Free' ? (
            <Link
              href="/pricing"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              আপগ্রেড করুন
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-2xl font-semibold text-xs bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 transition-all shrink-0"
            >
              প্যাকেজ বিবরণ
            </Link>
          )}
        </div>
      </div>

      {/* ================= 2. 4-METRIC STATS GRID (RESPONSIVE 2X2 ON MOBILE) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* 1. Shortlist Card */}
        <Link
          href="/favorites"
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1F1640]/90 border border-white/10 hover:border-[#FF4D7E]/40 hover:-translate-y-1 transition-all group shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B7FA8]">পছন্দের তালিকা</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 flex items-center justify-center text-[#FF4D7E] group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF4D7E]/20" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif group-hover:text-[#FF4D7E] transition-colors">
              {favoritesCount} টি
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8B7FA8] mt-0.5 block">শর্টলিস্ট করা বায়োডাটা</span>
          </div>
        </Link>

        {/* 2. Profile Views / Visitors Card */}
        <div
          onClick={() => {
            if (user.premium !== 'Platinum') {
              setUpgradeModalOpen(true);
            }
          }}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1F1640]/90 border border-white/10 hover:border-[#F5B942]/40 hover:-translate-y-1 transition-all group shadow-lg flex flex-col justify-between space-y-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B7FA8]">বায়োডাটা ভিউ</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F5B942]/10 border border-[#F5B942]/20 flex items-center justify-center text-[#F5B942] group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif group-hover:text-[#F5B942] transition-colors">
              {visitorCount} জন
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8B7FA8] mt-0.5 flex items-center gap-1">
              {user.premium === 'Platinum' ? (
                <span className="text-emerald-400">বিস্তারিত সক্রিয়</span>
              ) : (
                <span className="text-[#F5B942] flex items-center gap-0.5 font-medium">
                  <Lock className="w-3 h-3" /> প্লাটিনামে দেখুন
                </span>
              )}
            </span>
          </div>
        </div>

        {/* 3. Messages Card */}
        <Link
          href="/inbox"
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1F1640]/90 border border-white/10 hover:border-sky-400/40 hover:-translate-y-1 transition-all group shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B7FA8]">নতুন মেসেজ</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif group-hover:text-sky-400 transition-colors">
              {unreadCount} টি
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8B7FA8] mt-0.5 block">অপঠিত বার্তা</span>
          </div>
        </Link>

        {/* 4. Phone Unlock Quota Card */}
        <Link
          href={user.premium === 'Free' ? '/pricing' : '/search'}
          className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1F1640]/90 border border-white/10 hover:border-emerald-400/40 hover:-translate-y-1 transition-all group shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B7FA8]">নম্বর আনলক কোটা</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif group-hover:text-emerald-400 transition-colors">
              {user.premium === 'Free' ? '০ টি' : `${phoneUnlockStats.remaining} টি`}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8B7FA8] mt-0.5 block">
              {user.premium === 'Free' ? 'আপগ্রেড প্রয়োজন' : `অবশিষ্ট (${phoneUnlockStats.limit}টির মধ্যে)`}
            </span>
          </div>
        </Link>
      </div>

      {/* ================= 3. QUICK ACTION SHORTCUT HUB (MOBILE FRIENDLY) ================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#1F1640]/70 border border-white/10 shadow-lg space-y-3">
        <span className="text-xs font-bold text-[#8B7FA8] uppercase tracking-wider block">
          দ্রুত অ্যাকশন ও শর্টকাট
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <Link
            href="/search"
            className="p-3 sm:p-4 rounded-2xl bg-[#150E2B] border border-white/10 hover:border-[#FF4D7E]/50 flex items-center gap-2.5 transition-all text-xs font-semibold text-[#F5F3FA] hover:text-[#FF4D7E]"
          >
            <Search className="w-4 h-4 text-[#F5B942] shrink-0" />
            <span className="truncate">পাত্র-পাত্রী সার্চ</span>
          </Link>

          <Link
            href={`/profile/${user.id}`}
            className="p-3 sm:p-4 rounded-2xl bg-[#150E2B] border border-white/10 hover:border-[#FF4D7E]/50 flex items-center gap-2.5 transition-all text-xs font-semibold text-[#F5F3FA] hover:text-[#FF4D7E]"
          >
            <UserIcon className="w-4 h-4 text-[#FF4D7E] shrink-0" />
            <span className="truncate">আমার বায়োডাটা</span>
          </Link>

          <Link
            href="/profile/edit"
            className="p-3 sm:p-4 rounded-2xl bg-[#150E2B] border border-white/10 hover:border-[#FF4D7E]/50 flex items-center gap-2.5 transition-all text-xs font-semibold text-[#F5F3FA] hover:text-[#FF4D7E]"
          >
            <Edit3 className="w-4 h-4 text-[#F5B942] shrink-0" />
            <span className="truncate">বায়োডাটা এডিট</span>
          </Link>

          <Link
            href="/pricing"
            className="p-3 sm:p-4 rounded-2xl bg-[#150E2B] border border-white/10 hover:border-[#F5B942]/50 flex items-center gap-2.5 transition-all text-xs font-semibold text-[#F5F3FA] hover:text-[#F5B942]"
          >
            <Crown className="w-4 h-4 text-[#F5B942] shrink-0" />
            <span className="truncate">মেম্বারশিপ প্যাকেজ</span>
          </Link>
        </div>
      </div>

      {/* ================= 4. PROFILE COMPLETION PROGRESS BAR ================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#F5F3FA] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF4D7E]" />
              <span>বায়োডাটা সম্পূর্ণতা: {completionPct}%</span>
            </h3>
            <p className="text-xs text-[#B9AFD1] mt-0.5">
              সম্পূর্ণ ও তথ্যবহুল বায়োডাটা বেশি পাত্র-পাত্রী ও অভিভাবকদের দৃষ্টি আকর্ষণ করে।
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#F5B942]" />
            বায়োডাটা আপডেট করুন
          </Link>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#150E2B] h-2.5 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#FF4D7E] via-[#F5B942] to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* ================= 5. RECOMMENDED MATCHES SECTION ================= */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#F5F3FA] font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4D7E]" />
              <span>আপনার জন্য প্রস্তাবিত ম্যাচ</span>
            </h2>
            <p className="text-xs text-[#B9AFD1] mt-0.5">
              আপনার বয়স, অবস্থান ও ধর্মীয় পছন্দের ভিত্তিতে বাছাইকৃত প্রোফাইল
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#FF4D7E] hover:text-[#FF4D7E]/80 flex items-center gap-1 shrink-0"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-[#1F1640]/60 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : recommended.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#1F1640]/40 rounded-3xl border border-white/10 space-y-3">
            <p className="text-xs text-[#B9AFD1]">এই মুহূর্তে কোনো প্রস্তাবিত প্রোফাইল নেই</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF4D7E] text-white"
            >
              পাত্র-পাত্রী সার্চ করুন
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade Modal for Platinum Viewers */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="প্লাটিনাম মেম্বারশিপে আপগ্রেড করুন"
        description="কে কে আপনার প্রোফাইল ভিউ করেছেন তাদের পূর্ণাঙ্গ তালিকা ও বিবরণ দেখতে প্লাটিনাম মেম্বারশিপে আপগ্রেড করুন।"
      />
    </div>
  );
}
