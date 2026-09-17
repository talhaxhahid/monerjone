'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Crown,
  ChevronDown,
  ArrowRight,
  Users
} from 'lucide-react';
import { BD_DISTRICTS } from '@/lib/utils';
import ProfileCard from '@/components/profiles/ProfileCard';
import { ProfileCardData } from '@/types';

export default function HomePage() {
  const router = useRouter();

  // Quick Search state
  const [lookingForGender, setLookingForGender] = useState('Female');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [district, setDistrict] = useState('All');
  const [maritalStatus, setMaritalStatus] = useState('All');

  // Featured profiles state
  const [featuredProfiles, setFeaturedProfiles] = useState<ProfileCardData[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/profiles?sort=premium');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProfiles(data.profiles.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfiles(false);
      }
    }
    loadFeatured();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set('gender', lookingForGender);
    query.set('ageMin', minAge.toString());
    query.set('ageMax', maxAge.toString());
    if (district !== 'All') query.set('district', district);
    if (maritalStatus !== 'All') query.set('maritalStatus', maritalStatus);
    router.push(`/search?${query.toString()}`);
  };

  const faqs = [
    {
      q: 'MonerJone কি সম্পূর্ণ শরীয়াহ সম্মত?',
      a: 'হ্যাঁ, আমাদের প্ল্যাটফর্মটি ইসলামিক শিষ্টাচার ও পারিবারিক মূল্যবোধের সাথে তৈরি। এখানে কোনো অযাচিত চ্যাটিং বা অনৈতিক কার্যকলাপ কঠোরভাবে নিষিদ্ধ এবং অভিভাবক বা পাত্র-পাত্রীর সরাসরি যোগাযোগের ব্যবস্থা রয়েছে।',
    },
    {
      q: 'আমার ব্যক্তিগত তথ্য ও ছবি কতটা সুরক্ষিত?',
      a: 'আপনার মোবাইল নম্বর এবং ব্যক্তিগত বিবরণ আপনার অনুমতি বা প্রিমিয়াম আনলক ছাড়া প্রদর্শিত হয় না। প্রতিটি বায়োডাটা আমাদের টিম ম্যানুয়ালি যাচাই করে।',
    },
    {
      q: 'কীভাবে প্রিমিয়াম প্যাকেজ সক্রিয় করব?',
      a: 'প্যাকেজ পেইজে গিয়ে আপনার পছন্দের গোল্ড বা প্লাটিনাম প্যাকেজ সিলেক্ট করে বিকাশের মাধ্যমে সহজেই পেমেন্ট করে ট্রানজেকশন আইডি (TrxID) সাবমিট করলেই আপনার একাউন্ট আপগ্রেড হয়ে যাবে।',
    },
    {
      q: 'ফ্রি একাউন্টে কী কী সুবিধা পাওয়া যায়?',
      a: 'ফ্রি একাউন্টে আপনি প্রোফাইল তৈরি করতে পারবেন, সব পাত্র-পাত্রীর বায়োডাটা সার্চ ও দেখতে পারবেন এবং পছন্দের তালিকাভুক্ত করতে পারবেন।',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* ================= HERO SECTION WITH FULL BACKGROUND & EMBEDDED FORM ================= */}
      <section className="relative -mt-4 sm:-mt-8 pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[4rem] border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        {/* Full Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/images/hero-og.jpg')" }}
        />
        
        {/* Layered Atmospheric Overlays for perfect contrast & depth */}
        <div className="absolute inset-0 bg-[#150E2B]/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#150E2B] via-[#150E2B]/70 to-[#150E2B]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,77,126,0.18)_0%,_rgba(21,14,43,0.8)_70%,_#150E2B_100%)] pointer-events-none" />

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Headline & Badges */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1640]/90 border border-[#FF4D7E]/30 text-[#F5F3FA] text-xs font-semibold shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>বাংলাদেশের নির্ভরযোগ্য ও শরীয়াহ সম্মত মুসলিম ম্যাট্রিমনিয়াল</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F3FA] tracking-tight leading-[1.18] font-serif drop-shadow-md">
              মনের মতো জীবনসঙ্গী খুঁজুন,{' '}
              <span className="bg-gradient-to-r from-[#FF4D7E] via-[#F5B942] to-[#FF4D7E] bg-clip-text text-transparent">
                সহজে ও বিশ্বস্ততায়
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#B9AFD1] max-w-2xl mx-auto leading-relaxed drop-shadow">
              হাজারো খাঁটি বাংলাদেশী মুসলিম পাত্র-পাত্রীর মধ্য থেকে খুঁজে নিন আপনার পছন্দের দ্বীনদার জীবনসঙ্গী। ১০০% ভেরিফাইড প্রোফাইল ও সম্পূর্ণ গোপনীয়তা।
            </p>
          </div>

          {/* Embedded Glassmorphic Quick Match Finder Card */}
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto rounded-3xl bg-[#1F1640]/92 border border-white/20 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl">
            
            {/* Form Title & Gender Quick Switch Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 border-b border-white/10 mb-5">
              <span className="text-sm font-bold text-[#F5F3FA] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#F5B942]" />
                বায়োডাটা অনুসন্ধান ফিল্টার
              </span>

              {/* Gender Segmented Switch */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#150E2B]/80 border border-white/10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLookingForGender('Female')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    lookingForGender === 'Female'
                      ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/30'
                      : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
                  }`}
                >
                  <span>🧕</span> পাত্রী (কনে)
                </button>
                <button
                  type="button"
                  onClick={() => setLookingForGender('Male')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    lookingForGender === 'Male'
                      ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/30'
                      : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
                  }`}
                >
                  <span>👨</span> পাত্র (বর)
                </button>
              </div>
            </div>

            <form onSubmit={handleQuickSearch} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Age Range Slider / Inputs */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#B9AFD1]">বয়স সীমা</label>
                    <span className="text-xs font-bold text-[#F5B942]">
                      {minAge} - {maxAge} বছর
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={minAge}
                      onChange={(e) => setMinAge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm text-center focus:outline-none focus:border-[#FF4D7E] transition-colors"
                      placeholder="শুরু"
                    />
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm text-center focus:outline-none focus:border-[#FF4D7E] transition-colors"
                      placeholder="শেষ"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                    জেলা / বাসস্থান
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#FF4D7E] transition-colors cursor-pointer"
                  >
                    <option value="All">সকল জেলা (সমগ্র বাংলাদেশ)</option>
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marital Status */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                    বৈবাহিক অবস্থা
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#FF4D7E] transition-colors cursor-pointer"
                  >
                    <option value="All">যেকোনো বৈবাহিক অবস্থা</option>
                    <option value="Never Married">অবিবাহিত</option>
                    <option value="Divorced">ডিভোর্সড</option>
                    <option value="Widowed">বিধবা / বিপত্নীক</option>
                    <option value="Married - Seeking Another Wife">বিবাহিত (২য় বিবাহে আগ্রহী)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#B9AFD1]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সরাসরি অভিভাবক ও পাত্র-পাত্রীর সাথে যোগাযোগের ব্যবস্থা</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/35 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>উপযুক্ত পাত্র-পাত্রী খুঁজুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Trust Counters Row */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1F1640]/80 border border-white/10 text-center backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5B942] font-serif">
                ১২,৫০০+
              </span>
              <span className="text-[11px] sm:text-xs text-[#B9AFD1] mt-0.5 block">নিবন্ধিত পাত্র-পাত্রী</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1F1640]/80 border border-white/10 text-center backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5B942] font-serif">
                ৩,২০০+
              </span>
              <span className="text-[11px] sm:text-xs text-[#B9AFD1] mt-0.5 block">সফল ম্যাচ ও বিবাহ</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1F1640]/80 border border-white/10 text-center backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5B942] font-serif">
                ১০০%
              </span>
              <span className="text-[11px] sm:text-xs text-[#B9AFD1] mt-0.5 block">শরীয়াহ সম্মত প্রাইভেসি</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1F1640]/80 border border-white/10 text-center backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#F5B942] font-serif">
                ৬৪টি
              </span>
              <span className="text-[11px] sm:text-xs text-[#B9AFD1] mt-0.5 block">জেলায় সক্রিয় সেবা</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROFILES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B942]/10 border border-[#F5B942]/20 text-[#F5B942] text-xs font-semibold mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>প্রিমিয়াম বায়োডাটা</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3FA] font-serif">
              সম্প্রতি যুক্ত হওয়া ভেরিফাইড প্রোফাইল
            </h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm font-semibold text-[#FF4D7E] hover:text-[#FF4D7E]/80 transition-colors"
          >
            <span>সব প্রোফাইল দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProfiles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-[#1F1640] border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : featuredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-[#1F1640] border border-white/10">
            <Users className="w-12 h-12 text-[#8B7FA8] mx-auto mb-3" />
            <p className="text-sm text-[#B9AFD1]">বর্তমানে কোনো প্রোফাইল নেই</p>
            <Link
              href="/signup"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white"
            >
              প্রথম বায়োডাটা তৈরি করুন
            </Link>
          </div>
        )}
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#FF4D7E] uppercase">
            সহজ ও নির্ভরযোগ্য প্রক্রিয়া
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3FA] font-serif mt-2">
            মাত্র ৩টি সহজ ধাপে মনের মানুষ খুঁজুন
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#1F1640] border border-white/10 relative overflow-hidden group hover:border-[#FF4D7E]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 flex items-center justify-center text-[#FF4D7E] font-bold text-lg mb-6">
              ০১
            </div>
            <h3 className="text-lg font-bold text-[#F5F3FA] mb-2">ফ্রি বায়োডাটা তৈরি করুন</h3>
            <p className="text-xs text-[#B9AFD1] leading-relaxed">
              আপনার শিক্ষাগত যোগ্যতা, পারিবারিক ব্যাকগ্রাউন্ড, দীনদারিতা ও পছন্দের বিবরণ দিয়ে সম্পূর্ণ ফ্রিতে বায়োডাটা সাজান।
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1F1640] border border-white/10 relative overflow-hidden group hover:border-[#FF4D7E]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F5B942]/10 border border-[#F5B942]/20 flex items-center justify-center text-[#F5B942] font-bold text-lg mb-6">
              ০২
            </div>
            <h3 className="text-lg font-bold text-[#F5F3FA] mb-2">পছন্দের পাত্র-পাত্রী খুঁজুন</h3>
            <p className="text-xs text-[#B9AFD1] leading-relaxed">
              জেলা, বয়স, বৈবাহিক অবস্থা ও ধর্মীয় গুণাবলীর সুনির্দিষ্ট ফিল্টারের সাহায্যে মনের মতো প্রোফাইলগুলো শর্টলিস্ট করুন।
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1F1640] border border-white/10 relative overflow-hidden group hover:border-[#FF4D7E]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 flex items-center justify-center text-[#FF4D7E] font-bold text-lg mb-6">
              ০৩
            </div>
            <h3 className="text-lg font-bold text-[#F5F3FA] mb-2">নিরাপদে যোগাযোগ করুন</h3>
            <p className="text-xs text-[#B9AFD1] leading-relaxed">
              মেসেজিং বা সরাসরি মোবাইল নম্বর আনলক করে অভিভাবকসহ আলোচনা এগিয়ে নিন এবং সুন্নাহ অনুযায়ী শুভ পরিণয় সম্পন্ন করুন।
            </p>
          </div>
        </div>
      </section>

      {/* ================= MEMBERSHIP CALLOUT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#331A5C] via-[#1F1640] to-[#331A5C] border border-white/15 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B942]/20 text-[#F5B942] text-xs font-bold">
              <Crown className="w-4 h-4" />
              <span>গোল্ড ও প্লাটিনাম মেম্বারশিপ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F3FA] font-serif">
              প্রিমিয়াম সুবিধার সাথে সরাসরি যোগাযোগের পথ খুলুন
            </h2>
            <p className="text-sm text-[#B9AFD1] leading-relaxed">
              সীমাহীন মেসেজ, সরাসরি মোবাইল নম্বর ভিউ এবং আপনার বায়োডাটা কে কে দেখেছেন তা দেখার জন্য আজই আপগ্রেড করুন।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 transition-all"
              >
                প্যাকেজসমূহ দেখুন
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-[#150E2B] text-[#F5F3FA] border border-white/10 hover:border-[#FF4D7E]/50 transition-all"
              >
                ফ্রি সাইন আপ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-[#FF4D7E] uppercase">
            সাধারণ জিজ্ঞাসা
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3FA] font-serif mt-2">
            সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#1F1640] border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-[#F5F3FA] hover:text-[#FF4D7E] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#F5B942] transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#B9AFD1] leading-relaxed border-t border-white/10 bg-[#150E2B]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
