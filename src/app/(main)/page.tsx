'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ShieldCheck } from 'lucide-react';
import { BD_DISTRICTS } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();

  // Quick Search state
  const [lookingForGender, setLookingForGender] = useState('Female');
  const [minAge, setMinAge] = useState(18);
  const [district, setDistrict] = useState('All');
  const [maritalStatus, setMaritalStatus] = useState('All');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set('gender', lookingForGender);
    query.set('ageMin', minAge.toString());
    if (district !== 'All') query.set('district', district);
    if (maritalStatus !== 'All') query.set('maritalStatus', maritalStatus);
    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 md:pb-16">
      
      {/* ================= HERO SECTION WITH FULL BACKGROUND & EMBEDDED FORM ================= */}
      <section className="relative -mt-4 sm:-mt-8 pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden rounded-b-[2rem] sm:rounded-b-[3.5rem] border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Full Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/images/hero-og.jpg')" }}
        />
        
        {/* Layered Atmospheric Overlays for perfect contrast & depth */}
        <div className="absolute inset-0 bg-[#150E2B]/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#150E2B] via-[#150E2B]/75 to-[#150E2B]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,77,126,0.18)_0%,_rgba(21,14,43,0.8)_70%,_#150E2B_100%)] pointer-events-none" />

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Headline & Badges */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <div className="invisible inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1640]/90 border border-[#FF4D7E]/30 text-[#F5F3FA] text-[11px] sm:text-xs font-semibold shadow-lg backdrop-blur-md" aria-hidden="true">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>বাংলাদেশের নির্ভরযোগ্য ও শরীয়াহ সম্মত মুসলিম ম্যাট্রিমনিয়াল</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#F5F3FA] tracking-tight leading-[1.2] font-serif drop-shadow-md">
              মনের মতো জীবনসঙ্গী খুঁজুন,{' '}
              <span className="bg-gradient-to-r from-[#FF4D7E] via-[#F5B942] to-[#FF4D7E] bg-clip-text text-transparent">
                সহজে ও বিশ্বস্ততায়
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#B9AFD1] max-w-2xl mx-auto leading-relaxed drop-shadow px-2">
              হাজারো খাঁটি বাংলাদেশী মুসলিম পাত্র-পাত্রীর মধ্য থেকে বেছে নিন আপনার উপযুক্ত দ্বীনদার জীবনসঙ্গী। ১০০% ভেরিফাইড বায়োডাটা ও সম্পূর্ণ গোপনীয়তা।
            </p>
          </div>

          {/* Embedded Glassmorphic Quick Match Finder Card */}
          <div className="mt-6 sm:mt-10 max-w-4xl mx-auto rounded-3xl bg-[#1F1640]/95 border border-white/15 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl">
            
            {/* Form Title & Gender Quick Switch Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
              <span className="text-xs sm:text-sm font-bold text-[#F5F3FA] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#F5B942]" />
                বায়োডাটা অনুসন্ধান ফিল্টার
              </span>

              {/* Gender Segmented Switch */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#150E2B] border border-white/10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLookingForGender('Female')}
                  className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    lookingForGender === 'Female'
                      ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/30'
                      : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
                  }`}
                >
                  <span className="md:text-base">🧕</span> পাত্রী (কনে)
                </button>
                <button
                  type="button"
                  onClick={() => setLookingForGender('Male')}
                  className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    lookingForGender === 'Male'
                      ? 'bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/30'
                      : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
                  }`}
                >
                  <span className="md:text-base">👨</span> পাত্র (বর)
                </button>
              </div>
            </div>

            <form onSubmit={handleQuickSearch} autoComplete="off" className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                
                {/* Minimum Age (no upper cap — all ages 18+ are included) */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#B9AFD1] mb-1 md:mb-1.5">
                    ন্যূনতম বয়স
                  </label>
                  <select
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 md:py-3.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm md:text-base font-medium focus:outline-none focus:border-[#FF4D7E] transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 43 }, (_, i) => 18 + i).map((age) => (
                      <option key={age} value={age}>
                        {age}+ বছর
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#B9AFD1] mb-1 md:mb-1.5">
                    জেলা / বাসস্থান
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 md:py-3.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm md:text-base font-medium focus:outline-none focus:border-[#FF4D7E] transition-colors cursor-pointer"
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
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-[#B9AFD1] mb-1 md:mb-1.5">
                    বৈবাহিক অবস্থা
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 md:py-3.5 rounded-xl bg-[#150E2B] border border-white/15 text-[#F5F3FA] text-xs sm:text-sm md:text-base font-medium focus:outline-none focus:border-[#FF4D7E] transition-colors cursor-pointer"
                  >
                    <option value="All">যেকোনো বৈবাহিক অবস্থা</option>
                    <option value="Never Married">অবিবাহিত</option>
                    <option value="Divorced">ডিভোর্সড</option>
                    <option value="Widowed">বিধবা / বিপত্নীক</option>
                    {lookingForGender !== 'Female' && (
                      <option value="Married - Seeking Another Wife">বিবাহিত (২য় বিবাহে আগ্রহী)</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-[#B9AFD1] order-2 sm:order-1 text-center sm:text-left">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সরাসরি অভিভাবক ও পাত্র-পাত্রীর সাথে যোগাযোগের সুব্যবস্থা</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/35 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer order-1 sm:order-2"
                >
                  <Search className="w-4 h-4" />
                  <span>উপযুক্ত পাত্র-পাত্রী খুঁজুন</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
