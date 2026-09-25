'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { ProfileCardData } from '@/types';
import { bn, cmToFeetInches } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function ProfileCard({
  profile,
  onFavoriteToggle,
}: {
  profile: ProfileCardData;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}) {
  const { user, addToast } = useAuth();
  const router = useRouter();
  const [isFav, setIsFav] = useState(profile.favorited || false);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoadingFav(true);
    try {
      const res = await fetch('/api/social/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: profile.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFav(data.favorited);
        if (onFavoriteToggle) {
          onFavoriteToggle(profile.id, data.favorited);
        }
        addToast(
          data.favorited ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে',
          'success'
        );
      } else {
        addToast(data.message || 'ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      addToast('একটি সমস্যা হয়েছে', 'error');
    } finally {
      setLoadingFav(false);
    }
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const photoUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0] : null;
  const heightText = profile.heightCm ? cmToFeetInches(profile.heightCm) : null;
  const isPlatinum = profile.premium === 'Platinum';
  const isGold = profile.premium === 'Gold';
  const isPremium = isPlatinum || isGold;

  return (
    <div
      className={`group relative rounded-3xl bg-[#1F1640] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between ${
        isPlatinum
          ? 'border border-indigo-400/35 hover:border-indigo-400/70 hover:shadow-indigo-950/40'
          : isGold
          ? 'border border-[#F5B942]/35 hover:border-[#F5B942]/70 hover:shadow-amber-950/40'
          : 'border border-white/10 hover:border-[#FF4D7E]/40 hover:bg-[#291D54]'
      }`}
    >
      {/* Top Image / Avatar container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#150E2B] flex items-center justify-center">
        <ImageWithFallback
          src={photoUrl}
          alt={profile.name}
          gender={profile.gender}
          name={profile.name}
          fallbackType="avatar"
          showFallbackLabel={true}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1640] via-transparent to-black/30 pointer-events-none" />

        {/* 1. TOP-LEFT: Premium Tier Badge */}
        {isPlatinum ? (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-indigo-100 via-white to-indigo-200 text-indigo-950 border border-white/80 shadow-lg shadow-indigo-950/40 flex items-center gap-1.5 shimmer-badge">
            <Crown className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
            <span>প্লাটিনাম মেম্বার</span>
          </div>
        ) : isGold ? (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-[#FFFBEB] via-[#F5B942] to-[#E5A934] text-[#291704] border border-[#FEF3C7]/80 shadow-lg shadow-amber-950/40 flex items-center gap-1.5 shimmer-badge">
            <Crown className="w-3.5 h-3.5 text-[#291704] shrink-0" />
            <span>গোল্ড মেম্বার</span>
          </div>
        ) : null}

        {/* 3. TOP-RIGHT: Online Status & Favorite Button */}
        {profile.active && (
          <div className="absolute top-3.5 right-12 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#150E2B]/85 border border-emerald-500/30 text-[10px] text-emerald-400 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>সক্রিয়</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFav}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isFav
              ? 'bg-[#FF4D7E] text-white shadow-lg shadow-[#FF4D7E]/40 scale-110'
              : 'bg-[#150E2B]/70 text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#150E2B] border border-white/10'
          }`}
          aria-label="Toggle Favorite"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Name & Age Header */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#F5F3FA] group-hover:text-[#FF4D7E] transition-colors flex items-center gap-1.5 truncate">
              <span className="truncate">{profile.name}</span>
              {profile.profileComplete && (
                <CheckCircle2 className="w-4 h-4 text-[#FF4D7E] shrink-0" />
              )}
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-[#F5B942] bg-[#F5B942]/10 px-2 py-0.5 rounded-lg border border-[#F5B942]/20 shrink-0">
              {profile.age} বছর
            </span>
          </div>

          {/* Location & Occupation */}
          <div className="mt-2 space-y-1 text-xs text-[#B9AFD1]">
            {profile.district && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF4D7E] shrink-0" />
                <span className="truncate">{profile.district}</span>
              </div>
            )}
            {profile.occupation && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#F5B942] shrink-0" />
                <span className="truncate">{profile.occupation}</span>
              </div>
            )}
            {profile.education && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#B9AFD1] shrink-0" />
                <span className="truncate">{bn(profile.education)}</span>
              </div>
            )}
          </div>

          {/* Intro snippet */}
          {profile.introduction && (
            <p className="mt-3 text-xs text-[#B9AFD1] line-clamp-2 leading-relaxed bg-[#150E2B]/50 p-2.5 rounded-xl border border-white/5">
              &ldquo;{profile.introduction}&rdquo;
            </p>
          )}

          {/* Key Attribute Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {heightText && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#331A5C] text-[#F5F3FA] border border-white/10">
                {heightText.split(' ')[0]}
              </span>
            )}
            {profile.maritalStatus && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#331A5C] text-[#F5F3FA] border border-white/10">
                {bn(profile.maritalStatus)}
              </span>
            )}
            {profile.prayerFrequency && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/20">
                {bn(profile.prayerFrequency)}
              </span>
            )}
            {profile.hijabNiqab && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FF4D7E]/10 text-[#FF4D7E] border border-[#FF4D7E]/20">
                {bn(profile.hijabNiqab)}
              </span>
            )}
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="pt-2 grid grid-cols-2 gap-2 border-t border-white/10">
          <Link
            href={`/profile/${profile.id}`}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center bg-[#150E2B] hover:border-[#FF4D7E]/60 text-[#F5F3FA] border border-white/10 transition-all duration-200"
          >
            বায়োডাটা দেখুন
          </Link>
          <Link
            href={`/inbox?to=${profile.id}`}
            onClick={handleMessageClick}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-md shadow-[#FF4D7E]/25 flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            মেসেজ দিন
          </Link>
        </div>
      </div>
    </div>
  );
}
