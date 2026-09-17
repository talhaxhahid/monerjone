'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, MapPin, Briefcase, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProfileCardData } from '@/types';
import { bn, cmToFeetInches } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

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
        if (onFavoriteToggle) onFavoriteToggle(profile.id, data.favorited);
        addToast(
          data.favorited ? 'পছন্দের তালিকায় যুক্ত করা হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে',
          'success'
        );
      }
    } catch {
      addToast('পছন্দ আপডেট করতে সমস্যা হয়েছে', 'error');
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

  const hasPhoto = profile.photos && profile.photos.length > 0;
  const heightText = profile.heightCm ? cmToFeetInches(profile.heightCm) : null;

  return (
    <div className="group relative rounded-3xl bg-[#1F1640] border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#FF4D7E]/40 hover:bg-[#291D54] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image / Avatar container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#150E2B] flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1F1640] to-[#150E2B] text-[#8B7FA8] p-4">
            <div className="w-20 h-20 rounded-full bg-[#331A5C] border border-[#FF4D7E]/20 flex items-center justify-center text-3xl font-bold text-[#F5B942] mb-2">
              {profile.firstName ? profile.firstName[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs text-[#B9AFD1] font-medium">ছবি যুক্ত করা হয়নি</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1640] via-transparent to-black/30 pointer-events-none" />

        {/* Match Score Badge */}
        {profile.matchScore && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#150E2B]/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{profile.matchScore}% ম্যাচ</span>
          </div>
        )}

        {/* Premium Badge */}
        {profile.premium !== 'Free' && (
          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5B942] text-[#150E2B] shadow-md flex items-center gap-1 shimmer-badge">
            <span>👑</span>
            <span>{bn(profile.premium)}</span>
          </div>
        )}

        {/* Online dot indicator */}
        {profile.active && (
          <div className="absolute top-3.5 right-12 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#150E2B]/80 border border-emerald-500/30 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>সক্রিয়</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFav}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
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
          {/* Name & Age */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F5F3FA] group-hover:text-[#FF4D7E] transition-colors flex items-center gap-1.5">
              <span>{profile.name}</span>
              {profile.profileComplete && (
                <CheckCircle2 className="w-4 h-4 text-[#FF4D7E] inline" />
              )}
            </h3>
            <span className="text-sm font-semibold text-[#F5B942] bg-[#F5B942]/10 px-2 py-0.5 rounded-lg border border-[#F5B942]/20">
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
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 hover:border-[#FF4D7E]/50 transition-all duration-200"
          >
            বায়োডাটা দেখুন
          </Link>
          <Link
            href={`/inbox?to=${profile.id}`}
            onClick={handleMessageClick}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center bg-[#FF4D7E] hover:bg-[#E63465] text-white font-bold shadow-md shadow-[#FF4D7E]/25 flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            মেসেজ দিন
          </Link>
        </div>
      </div>
    </div>
  );
}
