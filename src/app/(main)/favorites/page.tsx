'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Search, UserCheck } from 'lucide-react';
import ProfileCard from '@/components/profiles/ProfileCard';
import { ProfileCardData } from '@/types';

type Tab = 'given' | 'received';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('given');
  const [givenProfiles, setGivenProfiles] = useState<ProfileCardData[]>([]);
  const [receivedProfiles, setReceivedProfiles] = useState<ProfileCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      Promise.all([
        fetch('/api/social/favorites').then((res) => (res.ok ? res.json() : { profiles: [] })),
        fetch('/api/social/favorites?direction=received').then((res) => (res.ok ? res.json() : { profiles: [] })),
      ])
        .then(([given, received]) => {
          if (isMounted) {
            setGivenProfiles(given.profiles || []);
            setReceivedProfiles(received.profiles || []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleFavoriteToggle = (id: string, isFav: boolean) => {
    if (!isFav) {
      setGivenProfiles((prev) => prev.filter((p) => p.id !== id));
    } else {
      // If someone in the "received" list gets favorited back, reflect it there too.
      setReceivedProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, favorited: true } : p)));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeProfiles = tab === 'given' ? givenProfiles : receivedProfiles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-[#FF4D7E] fill-[#FF4D7E]" />
            <span>পছন্দের তালিকা (শর্টলিস্ট)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B9AFD1] mt-1">
            আপনার পছন্দের পাত্র-পাত্রীর তালিকা। যেকোনো সময় মেসেজ দিন বা যোগাযোগ করুন।
          </p>
        </div>

        <Link
          href="/search"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1640] border border-[#FF4D7E]/30 text-xs font-semibold text-[#FF4D7E] hover:bg-[#291D54] transition-all"
        >
          <Search className="w-4 h-4" />
          <span>আরও বায়োডাটা খুঁজুন</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-[#1F1640]/60 border border-white/10 w-fit">
        <button
          onClick={() => setTab('given')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'given' ? 'bg-[#FF4D7E] text-white shadow-md' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          আপনার ফেভারিট
          <span className="text-[10px] opacity-80">({givenProfiles.length})</span>
        </button>
        <button
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'received' ? 'bg-[#FF4D7E] text-white shadow-md' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          যারা আপনাকে ফেভারিট করেছে
          <span className="text-[10px] opacity-80">({receivedProfiles.length})</span>
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-[#1F1640]/60 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : activeProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProfiles.map((p) => (
            <ProfileCard
              key={p.id}
              profile={p}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-[#1F1640]/50 border border-white/10 space-y-4 max-w-lg mx-auto">
          <Heart className="w-14 h-14 text-white/20 mx-auto" />
          <h3 className="text-lg font-bold text-[#F5F3FA]">
            {tab === 'given' ? 'পছন্দের তালিকা খালি' : 'এখনও কেউ আপনাকে ফেভারিট করেনি'}
          </h3>
          <p className="text-xs text-[#B9AFD1]">
            {tab === 'given'
              ? 'আপনি এখনও কোনো পাত্র বা পাত্রীর প্রোফাইল পছন্দের তালিকায় যুক্ত করেননি।'
              : 'আপনার প্রোফাইল আরও আকর্ষণীয় করতে বায়োডাটা সম্পূর্ণ করুন।'}
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-md transition-all"
          >
            পাত্র/পাত্রী খুঁজুন
          </Link>
        </div>
      )}
    </div>
  );
}
