'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  MessageCircle,
  Phone,
  ShieldCheck,
  Crown,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lock,
  Share2,
  Ban,
  CheckCircle2,
  Users,
  Edit3,
  User as UserIcon,
  Moon
} from 'lucide-react';
import { bn, cmToFeetInches } from '@/lib/utils';
import UpgradeModal from '@/components/ui/UpgradeModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, addToast } = useAuth();

  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [phoneUnlocked, setPhoneUnlocked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [unlockLoading, setUnlockLoading] = useState<boolean>(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalMsg, setUpgradeModalMsg] = useState<string>('');
  const [limitReached, setLimitReached] = useState<boolean>(false);

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/profiles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setIsFav(data.profile.favorited || false);
          setPhoneUnlocked(data.profile.unlocked || false);
          setPhoneNumber(data.profile.phone || null);
        } else {
          const data = await res.json().catch(() => null);
          if (res.status === 403 && data?.error === 'DAILY_LIMIT_REACHED') {
            setLimitReached(true);
            setUpgradeModalMsg(data.message);
            setUpgradeModalOpen(true);
          } else {
            addToast('প্রোফাইল খুঁজে পাওয়া যায়নি', 'error');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/social/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFav(data.favorited);
        addToast(
          data.favorited ? 'পছন্দের তালিকায় যুক্ত করা হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে',
          'success'
        );
      }
    } catch {
      addToast('পছন্দ আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleUnlockPhone = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.premium === 'Free') {
      setUpgradeModalMsg('মোবাইল নম্বর দেখতে গোল্ড বা প্লাটিনাম প্যাকেজে আপগ্রেড করুন।');
      setUpgradeModalOpen(true);
      return;
    }

    setUnlockLoading(true);
    try {
      const res = await fetch('/api/social/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhoneUnlocked(true);
        setPhoneNumber(data.phone);
        addToast('মোবাইল নম্বর সফলভাবে আনলক করা হয়েছে!', 'success');
      } else if (res.status === 403) {
        setUpgradeModalMsg(data.message || 'আপনার প্যাকেজের আনলক সীমা শেষ হয়েছে।');
        setUpgradeModalOpen(true);
      } else {
        addToast(data.error || 'আনলক করতে ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      addToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setUnlockLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে ব্লক করতে চান?')) {
      try {
        const res = await fetch('/api/social/blocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId: id }),
        });
        const data = await res.json();
        if (res.ok) {
          addToast(data.blocked ? 'ব্যবহারকারীকে ব্লক করা হয়েছে' : 'ব্লক প্রত্যাহার করা হয়েছে', 'info');
          router.push('/search');
        }
      } catch {
        addToast('ব্লক প্রক্রিয়ায় সমস্যা হয়েছে', 'error');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `MonerJone Biodata - ${profile?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('বায়োডাটার লিংক কপি করা হয়েছে!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#8B7FA8]">বায়োডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!profile) {
    if (limitReached) {
      return (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-center justify-center text-[#F5B942] mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F3FA]">আজকের ফ্রি সীমা শেষ হয়েছে</h2>
          <p className="text-xs text-[#8B7FA8]">{upgradeModalMsg}</p>
          <Link href="/pricing" className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F5B942] hover:bg-[#E5A934] text-[#291704] transition-all">
            সীমাহীন বায়োডাটা দেখতে আপগ্রেড করুন
          </Link>
          <UpgradeModal
            isOpen={upgradeModalOpen}
            onClose={() => setUpgradeModalOpen(false)}
            title="দৈনিক সীমা শেষ হয়েছে"
            description={upgradeModalMsg}
          />
        </div>
      );
    }
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F5F3FA]">বায়োডাটা পাওয়া যায়নি</h2>
        <p className="text-xs text-[#8B7FA8]">প্রোফাইলটি মুছে ফেলা হয়েছে বা লিংকটি সঠিক নয়।</p>
        <Link href="/search" className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white transition-all">
          অন্যান্য বায়োডাটা খুঁজুন
        </Link>
      </div>
    );
  }

  const isSelf = user?.id === profile.id;
  const heightStr = profile.heightCm ? cmToFeetInches(profile.heightCm) : 'দেওয়া হয়নি';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Profile Header */}
      <div className="rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/25 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Photo Gallery Column (Lg 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative aspect-[4/5] rounded-2xl bg-[#150E2B] overflow-hidden border border-[#FF4D7E]/20 shadow-lg">
              <ImageWithFallback
                src={profile.photos && profile.photos.length > 0 ? (profile.photos[activePhotoIdx] || profile.photos[0]) : null}
                alt={profile.name}
                gender={profile.gender}
                name={profile.name}
                fallbackType="avatar"
                showFallbackLabel={true}
                className="w-full h-full object-cover"
              />

              {/* 1. TOP-LEFT: Premium Tier Badge OR Match Score Badge */}
              {profile.premium === 'Platinum' ? (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-100 via-white to-indigo-200 text-indigo-950 border border-white/80 shadow-lg shadow-indigo-950/40 flex items-center gap-1.5 shimmer-badge">
                  <Crown className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span>প্লাটিনাম মেম্বার</span>
                </div>
              ) : profile.premium === 'Gold' ? (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#FFFBEB] via-[#F5B942] to-[#E5A934] text-[#291704] border border-[#FEF3C7]/80 shadow-lg shadow-amber-950/40 flex items-center gap-1.5 shimmer-badge">
                  <Crown className="w-4 h-4 text-[#291704] shrink-0" />
                  <span>গোল্ড মেম্বার</span>
                </div>
              ) : profile.matchScore ? (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold bg-[#150E2B]/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.matchScore}% ম্যাচ</span>
                </div>
              ) : null}

              {/* 2. BOTTOM-LEFT: Match Score Badge (When user is Premium) */}
              {profile.premium !== 'Free' && profile.matchScore && (
                <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold bg-[#150E2B]/90 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.matchScore}% ম্যাচ</span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {profile.photos.map((ph: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activePhotoIdx === idx ? 'border-[#FF4D7E] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={ph}
                      alt={`thumbnail-${idx}`}
                      fallbackType="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bio Header & Quick Attributes (Lg 8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif flex items-center gap-2">
                    <span>{profile.name}</span>
                    {profile.profileComplete && (
                      <CheckCircle2 className="w-6 h-6 text-sky-400" />
                    )}
                  </h1>
                </div>

                {/* Favorite, Share & Edit Buttons */}
                <div className="flex items-center gap-2">
                  {isSelf ? (
                    <Link
                      href="/profile/edit"
                      className="px-3.5 py-2.5 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>এডিট করুন</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={handleShare}
                        className="p-2.5 rounded-xl bg-[#150E2B] border border-white/10 hover:border-[#FF4D7E]/60 text-[#B9AFD1] hover:text-white transition-colors cursor-pointer"
                        title="লিংক কপি করুন"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isFav
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                            : 'bg-[#150E2B] border-white/10 text-[#B9AFD1] hover:text-[#FF4D7E]'
                        }`}
                        title="পছন্দের তালিকা"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA] border border-white/10">
                  বয়স: {profile.age} বছর
                </span>
                {profile.district && (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA] border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4D7E]" /> {profile.district}
                  </span>
                )}
                {profile.maritalStatus && (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA] border border-white/10">
                    {bn(profile.maritalStatus)}
                  </span>
                )}
                {profile.occupation && (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA] border border-white/10 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#FF4D7E]" /> {profile.occupation}
                  </span>
                )}
                {profile.prayerFrequency && (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FF4D7E]/10 text-[#FF4D7E] border border-[#FF4D7E]/30">
                    {bn(profile.prayerFrequency)}
                  </span>
                )}
              </div>

              {/* Introduction */}
              {profile.introduction && (
                <div className="mt-4 p-4 rounded-2xl bg-[#150E2B]/60 border border-white/5">
                  <span className="text-[11px] font-bold text-[#FF4D7E] uppercase tracking-wider block mb-1">
                    সংক্ষিপ্ত পরিচিতি:
                  </span>
                  <p className="text-xs sm:text-sm text-[#B9AFD1] leading-relaxed italic">
                    &ldquo;{profile.introduction}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Actions Card Footer */}
            {!isSelf && (
              <div className="p-4 rounded-2xl bg-[#150E2B] border border-[#FF4D7E]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {phoneUnlocked && phoneNumber && (
                  <div className="flex-1 flex items-center gap-2 text-emerald-400 bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-500/30">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-bold font-mono select-all">
                      {phoneNumber}
                    </span>
                  </div>
                )}

                {/* Send Message Button */}
                <Link
                  href={`/inbox?to=${profile.id}`}
                  className="flex-1 py-2.5 px-5 rounded-xl text-xs font-bold text-center bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-md shadow-[#FF4D7E]/25 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>মেসেজ দিন</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Biodata Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Basic & Physical Details */}
        <div className="p-6 rounded-3xl bg-[#1F1640]/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
            <UserIcon className="w-5 h-5 text-[#FF4D7E]" />
            মৌলিক ও শারীরিক তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#8B7FA8] block">উচ্চতা:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{heightStr}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">ওজন:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.weightKg ? `${profile.weightKg} কেজি` : 'দেওয়া হয়নি'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">ধর্ম:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.religion)}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">সন্তান বিবরণ:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.children) || 'প্রযোজ্য নয়'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#8B7FA8] block">ভাষাসমূহ:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.languages || 'বাংলা'}</span>
            </div>
          </div>
        </div>

        {/* 2. Education & Career */}
        <div className="p-6 rounded-3xl bg-[#1F1640]/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
            <GraduationCap className="w-5 h-5 text-[#FF4D7E]" />
            শিক্ষাগত ও পেশাগত তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#8B7FA8] block">শিক্ষাগত যোগ্যতা:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.education) || 'দেওয়া হয়নি'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">বিষয় / বিভাগ:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.subject || 'দেওয়া হয়নি'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">পেশা / কর্মক্ষেত্র:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.occupation || 'দেওয়া হয়নি'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">মাসিক আয়:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.income || 'ব্যক্তিগত'}</span>
            </div>
          </div>
        </div>

        {/* 3. Religious Practices & Deen */}
        <div className="p-6 rounded-3xl bg-[#1F1640]/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
            <Moon className="w-5 h-5 text-[#FF4D7E]" />
            ধর্মীয় ও লাইফস্টাইল বিবরণ
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#8B7FA8] block">নামাজ আদায়:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.prayerFrequency) || 'দেওয়া হয়নি'}</span>
            </div>
            {profile.gender === 'Female' && (
              <div>
                <span className="text-[#8B7FA8] block">হিজাব ও পর্দা:</span>
                <span className="font-semibold text-purple-300 mt-0.5 block">{bn(profile.hijabNiqab) || 'দেওয়া হয়নি'}</span>
              </div>
            )}
            <div>
              <span className="text-[#8B7FA8] block">ধূমপান:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.smoking) || 'না'}</span>
            </div>
            {profile.favoriteBooks && (
              <div className="col-span-2">
                <span className="text-[#8B7FA8] block">প্রিয় বই:</span>
                <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.favoriteBooks}</span>
              </div>
            )}
            {profile.favoriteFood && (
              <div className="col-span-2">
                <span className="text-[#8B7FA8] block">প্রিয় খাবার:</span>
                <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.favoriteFood}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Family Background */}
        <div className="p-6 rounded-3xl bg-[#1F1640]/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
            <Users className="w-5 h-5 text-[#FF4D7E]" />
            পারিবারিক তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#8B7FA8] block">পারিবারিক অর্থনৈতিক অবস্থা:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{bn(profile.familyStatus) || 'মধ্যবিত্ত'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">পিতার পেশা:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.fatherOccupation || 'দেওয়া হয়নি'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">মাতার পেশা:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.motherOccupation || 'গৃহিণী'}</span>
            </div>
            <div>
              <span className="text-[#8B7FA8] block">ভাই ও বোন:</span>
              <span className="font-semibold text-[#F5F3FA] mt-0.5 block">{profile.brothers || 0} ভাই, {profile.sisters || 0} বোন</span>
            </div>
          </div>
        </div>

        {/* 5. Partner Requirements & Preferences */}
        <div className="col-span-1 md:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-5 h-5 text-[#FF4D7E]" />
            যেমন জীবনসঙ্গী প্রত্যাশা করেন
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#150E2B] border border-white/10">
              <span className="text-[#8B7FA8] block">প্রত্যাশিত বয়স সীমা:</span>
              <span className="font-bold text-[#FF4D7E] mt-1 block">
                {profile.prefAgeMin || 18} - {profile.prefAgeMax || 45} বছর
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#150E2B] border border-white/10">
              <span className="text-[#8B7FA8] block">প্রত্যাশিত জেলা:</span>
              <span className="font-bold text-[#F5F3FA] mt-1 block">
                {profile.prefDistrict || 'যেকোনো জেলা'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#150E2B] border border-white/10">
              <span className="text-[#8B7FA8] block">প্রত্যাশিত শিক্ষাগত যোগ্যতা:</span>
              <span className="font-bold text-[#F5F3FA] mt-1 block">
                {bn(profile.prefEducation) || 'যেকোনো'}
              </span>
            </div>
          </div>

          {profile.lookingFor && (
            <div className="mt-4 p-4 rounded-2xl bg-[#150E2B] border border-white/5 text-xs sm:text-sm text-[#B9AFD1] leading-relaxed">
              <span className="font-bold text-[#FF4D7E] block mb-1">জীবনসঙ্গী সংক্রান্ত বিস্তারিত বিবরণ:</span>
              {profile.lookingFor}
            </div>
          )}
        </div>
      </div>

      {/* Unlock Phone Number — its own dedicated section to encourage upgrading */}
      {!isSelf && !phoneUnlocked && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#331A5C] to-[#1F1640] border border-[#F5B942]/30 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F5B942]/10 border border-[#F5B942]/30 flex items-center justify-center text-[#F5B942] shrink-0">
            <Lock className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-[#F5F3FA]">মোবাইল নম্বর দেখুন এবং সরাসরি যোগাযোগ করুন</h3>
            <p className="text-xs sm:text-sm text-[#B9AFD1] mt-1">
              গোল্ড বা প্লাটিনাম মেম্বারশিপে আপগ্রেড করে {profile.name}-এর মোবাইল নম্বর আনলক করুন এবং সরাসরি কথা বলুন।
            </p>
          </div>
          <button
            onClick={handleUnlockPhone}
            disabled={unlockLoading}
            className="w-full sm:w-auto shrink-0 py-3 px-6 rounded-xl text-sm font-bold bg-[#F5B942] hover:bg-[#E5A934] text-[#291704] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {unlockLoading ? (
              <div className="w-4 h-4 border-2 border-[#291704] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Crown className="w-4 h-4" />
                <span>নম্বর আনলক করুন</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Safety & Moderation Actions */}
      {!isSelf && (
        <div className="pt-4 flex items-center justify-between border-t border-white/10 text-xs text-[#8B7FA8]">
          <button
            onClick={handleBlockUser}
            className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Ban className="w-4 h-4" />
            <span>এই প্রোফাইল ব্লক করুন</span>
          </button>
          <span className="flex items-center gap-1 text-[#8B7FA8]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            যাচাইকৃত বায়োডাটা
          </span>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="মেম্বারশিপ আপগ্রেড করুন"
        description={upgradeModalMsg || 'সরাসরি মোবাইল নম্বর আনলক করতে গোল্ড বা প্লাটিনাম প্যাকেজে আপগ্রেড করুন।'}
      />
    </div>
  );
}
