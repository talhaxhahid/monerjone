'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BD_DISTRICTS } from '@/lib/utils';
import ProfileCard from '@/components/profiles/ProfileCard';
import { ProfileCardData } from '@/types';
import {
  Filter,
  RotateCcw,
  SlidersHorizontal,
  X,
  Users
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Filters State
  const [gender, setGender] = useState<string>(
    searchParams.get('gender') || (user ? (user.gender === 'Male' ? 'Female' : 'Male') : 'Female')
  );
  const [district, setDistrict] = useState<string>(searchParams.get('district') || 'All');
  const [maritalStatus, setMaritalStatus] = useState<string>(searchParams.get('maritalStatus') || 'All');
  const [religion, setReligion] = useState<string>(searchParams.get('religion') || 'All');
  const [education, setEducation] = useState<string>(searchParams.get('education') || 'All');
  const [prayerFrequency, setPrayerFrequency] = useState<string>(searchParams.get('prayerFrequency') || 'All');
  const [children, setChildren] = useState<string>(searchParams.get('children') || 'All');
  const [premiumOnly, setPremiumOnly] = useState<boolean>(searchParams.get('premium') === 'premium');
  const [ageMin, setAgeMin] = useState<number>(Number(searchParams.get('ageMin')) || 18);
  const [ageMax, setAgeMax] = useState<number>(Number(searchParams.get('ageMax')) || 55);
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest');

  // Effective Gender
  const effectiveGender = user
    ? user.gender === 'Male'
      ? 'Female'
      : 'Male'
    : gender;

  // Results State
  const [profiles, setProfiles] = useState<ProfileCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfiles() {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (!user) {
          q.set('gender', effectiveGender);
        }
        if (district !== 'All') q.set('district', district);
        if (maritalStatus !== 'All') q.set('maritalStatus', maritalStatus);
        if (religion !== 'All') q.set('religion', religion);
        if (education !== 'All') q.set('education', education);
        if (prayerFrequency !== 'All') q.set('prayerFrequency', prayerFrequency);
        if (children !== 'All') q.set('children', children);
        if (premiumOnly) q.set('premium', 'premium');
        q.set('ageMin', ageMin.toString());
        q.set('ageMax', ageMax.toString());
        q.set('sort', sort);

        const res = await fetch(`/api/profiles?${q.toString()}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setProfiles(data.profiles || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, [user, effectiveGender, district, maritalStatus, religion, education, prayerFrequency, children, premiumOnly, ageMin, ageMax, sort]);

  const resetFilters = () => {
    setDistrict('All');
    setMaritalStatus('All');
    setReligion('All');
    setEducation('All');
    setPrayerFrequency('All');
    setChildren('All');
    setPremiumOnly(false);
    setAgeMin(18);
    setAgeMax(55);
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F3FA] font-serif flex items-center gap-2">
            <span>পাত্র/পাত্রী অনুসন্ধান</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FF4D7E]/10 text-[#FF4D7E] border border-[#FF4D7E]/20">
              {profiles.length} জন পাওয়া গেছে
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B9AFD1] mt-1">
            আপনার কাঙ্ক্ষিত পছন্দ অনুযায়ী ফিল্টার করে সঠিক জীবনসঙ্গী নির্বাচন করুন
          </p>
        </div>

        {/* Mobile Filter Trigger Button & Sort */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1640] border border-white/10 text-xs font-semibold text-[#F5F3FA]"
          >
            <Filter className="w-4 h-4 text-[#F5B942]" />
            <span>ফিল্টার ({profiles.length})</span>
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#1F1640] border border-white/10 text-xs sm:text-sm font-semibold text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E] cursor-pointer"
          >
            <option value="newest">সর্বশেষ যুক্ত (Newest)</option>
            <option value="active">সক্রিয় ব্যবহারকারী (Active)</option>
            <option value="premium">প্রিমিয়াম অগ্রাধিকার (Premium)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        
        {/* ================= FILTERS SIDEBAR (DESKTOP) ================= */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="sticky top-28 rounded-3xl bg-[#1F1640] border border-white/10 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-[#F5F3FA] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F5B942]" />
                ফিল্টারসমূহ
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-[#8B7FA8] hover:text-[#FF4D7E] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                রিসেট
              </button>
            </div>

            {/* Gender Toggle (Only for guests) */}
            {!user && (
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-2">লিঙ্গ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Female')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      gender === 'Female'
                        ? 'bg-[#FF4D7E]/15 border-[#FF4D7E] text-[#FF4D7E]'
                        : 'bg-[#150E2B] border-white/10 text-[#B9AFD1]'
                    }`}
                  >
                    পাত্রী (নারী)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Male')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      gender === 'Male'
                        ? 'bg-[#FF4D7E]/15 border-[#FF4D7E] text-[#FF4D7E]'
                        : 'bg-[#150E2B] border-white/10 text-[#B9AFD1]'
                    }`}
                  >
                    পাত্র (পুরুষ)
                  </button>
                </div>
              </div>
            )}

            {/* Age Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#B9AFD1] mb-2">
                <span>বয়স সীমা</span>
                <span className="text-[#F5B942] font-bold">{ageMin} - {ageMax} বছর</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="18"
                  max="60"
                  value={ageMin}
                  onChange={(e) => setAgeMin(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs text-center focus:border-[#FF4D7E]"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={ageMax}
                  onChange={(e) => setAgeMax(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs text-center focus:border-[#FF4D7E]"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E]"
              >
                <option value="All">সকল জেলা</option>
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">বৈবাহিক অবস্থা</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E]"
              >
                <option value="All">যেকোনো</option>
                <option value="Never Married">অবিবাহিত</option>
                <option value="Divorced">ডিভোর্সড</option>
                <option value="Widowed">বিধবা / বিপত্নীক</option>
                <option value="Married - Seeking Another Wife">বিবাহিত (২য় বিবাহ)</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">শিক্ষাগত যোগ্যতা</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E]"
              >
                <option value="All">যেকোনো</option>
                <option value="Honours">অনার্স / স্নাতক</option>
                <option value="Masters">মাস্টার্স</option>
                <option value="HSC">এইচএসসি</option>
                <option value="SSC">এসএসসি</option>
                <option value="PhD">পিএইচডি</option>
                <option value="Primary">প্রাথমিক</option>
              </select>
            </div>

            {/* Prayer Frequency */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">নামাজ আদায়</label>
              <select
                value={prayerFrequency}
                onChange={(e) => setPrayerFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E]"
              >
                <option value="All">যেকোনো</option>
                <option value="5 times a day">দৈনিক ৫ ওয়াক্ত</option>
                <option value="4 times a day">দৈনিক ৪ ওয়াক্ত</option>
                <option value="3 times a day">দৈনিক ৩ ওয়াক্ত</option>
                <option value="Usually">মাঝে মাঝে</option>
              </select>
            </div>

            {/* Premium Only Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={premiumOnly}
                  onChange={(e) => setPremiumOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF4D7E] bg-[#150E2B] border-white/10 focus:ring-0"
                />
                <span className="text-xs font-semibold text-[#F5B942] flex items-center gap-1">
                  <span>👑</span> শুধুমাত্র প্রিমিয়াম প্রোফাইল
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= RESULTS GRID ================= */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-[#1F1640] border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {profiles.map((p) => (
                <ProfileCard key={p.id} profile={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl bg-[#1F1640] border border-white/10 p-6 space-y-4">
              <Users className="w-16 h-16 text-[#8B7FA8] mx-auto" />
              <h3 className="text-lg font-bold text-[#F5F3FA]">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="text-xs text-[#B9AFD1] max-w-sm mx-auto">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো বায়োডাটা বর্তমানে নেই। ফিল্টার শিথিল করে আবার চেষ্টা করুন।
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE FILTER MODAL ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end lg:hidden">
          <div className="bg-[#1F1640] border-t border-white/10 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-[#F5F3FA] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F5B942]" />
                ফিল্টার পরিবর্তন
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-[#B9AFD1] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Gender */}
            {!user && (
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-2">লিঙ্গ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Female')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      gender === 'Female' ? 'bg-[#FF4D7E] text-white' : 'bg-[#150E2B] border-white/10 text-[#B9AFD1]'
                    }`}
                  >
                    পাত্রী (নারী)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Male')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      gender === 'Male' ? 'bg-[#FF4D7E] text-white' : 'bg-[#150E2B] border-white/10 text-[#B9AFD1]'
                    }`}
                  >
                    পাত্র (পুরুষ)
                  </button>
                </div>
              </div>
            )}

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">বয়স সীমা ({ageMin} - {ageMax})</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] text-center"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] text-center"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA]"
              >
                <option value="All">সকল জেলা</option>
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-white/10">
              <button
                onClick={resetFilters}
                className="py-3 rounded-xl text-xs font-semibold bg-[#331A5C] text-[#F5F3FA]"
              >
                রিসেট
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="py-3 rounded-xl text-xs font-bold bg-[#FF4D7E] text-white"
              >
                ফলাফল দেখুন ({profiles.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#B9AFD1]">লোড হচ্ছে...</div>}>
      <SearchContent />
    </Suspense>
  );
}
