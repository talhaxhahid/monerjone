'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BD_DISTRICTS, isBDPhone } from '@/lib/utils';
import { User, Phone, Lock, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    district: 'Dhaka',
    religion: 'Islam',
    maritalStatus: 'Never Married',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName) {
      setError('নামের প্রথম ও শেষ অংশ প্রদান করুন');
      return;
    }
    if (!formData.dob) {
      setError('জন্ম তারিখ প্রদান করুন');
      return;
    }
    if (!isBDPhone(formData.phone)) {
      setError('সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)');
      return;
    }
    if (formData.password.length < 8) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
      return;
    }

    setLoading(true);
    const res = await signup(formData);
    setLoading(false);

    if (res.ok) {
      router.push('/profile/edit');
    } else {
      setError(res.error || 'নিবন্ধন ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-6xl rounded-3xl bg-[#1F1640] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
        
        {/* ================= LEFT / SIDE IMAGE BANNER (DESKTOP ONLY) ================= */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-[#150E2B]">
          {/* Background Image with layered overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url('/images/hero-og.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150E2B] via-[#1F1640]/80 to-[#331A5C]/75 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,77,126,0.25)_0%,_transparent_70%)] pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <BrandLogo href="/" size="md" />
          </div>

          {/* Center Info & Benefits */}
          <div className="relative z-10 space-y-5 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D7E]/20 text-[#FF4D7E] text-xs font-semibold border border-[#FF4D7E]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>বিনামূল্যে বায়োডাটা রেজিস্ট্রেশন</span>
            </div>

            <h2 className="text-2xl font-bold text-[#F5F3FA] leading-snug font-serif">
              আজই তৈরি করুন আপনার শরীয়াহ সম্মত বিয়ের বায়োডাটা
            </h2>

            <p className="text-xs text-[#B9AFD1] leading-relaxed">
              MonerJone প্ল্যাটফর্মে অ্যাকাউন্ট খুলে সম্পূর্ণ বিশ্বস্ত পরিবেশে দ্বীনদার পাত্র বা পাত্রীর সন্ধান পান।
            </p>

            {/* Registration Benefits List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>সম্পূর্ণ বিনামূল্যে বায়োডাটা তৈরি ও সম্পাদনা</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>জেলা, পেশা ও শিক্ষাগত যোগ্যতা অনুযায়ী ফিল্টারিং</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>পছন্দের তালিকা তৈরি ও নিরাপদ বার্তা আদান-প্রদান</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>মোবাইল নম্বর ও তথ্যের সর্বোচ্চ সুরক্ষা ও গোপনীয়তা</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-[#8B7FA8] pt-4 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>শরীয়াহ সম্মত নিয়ম ও শতভাগ গোপনীয়তা সংরক্ষিত</span>
          </div>
        </div>

        {/* ================= RIGHT / FORM CONTAINER (ALL SCREENS) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Mobile Header Logo */}
          <div className="text-center mb-6 lg:hidden flex flex-col items-center">
            <div className="mb-2">
              <BrandLogo href="/" size="md" />
            </div>
            <p className="text-xs text-[#B9AFD1]">
              সহজেই আপনার অ্যাকাউন্ট তৈরি করুন
            </p>
          </div>

          {/* Desktop Heading */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-[#F5F3FA] font-serif flex items-center gap-2">
              <span>ফ্রি অ্যাকাউন্ট নিবন্ধন</span>
              <Heart className="w-5 h-5 text-[#FF4D7E] fill-[#FF4D7E]" />
            </h1>
            <p className="text-xs text-[#B9AFD1] mt-1">
              সঠিক তথ্য প্রদান করে কয়েক মিনিটে আপনার বায়োডাটা প্রোফাইল তৈরি করুন
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs font-medium text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-2">
                আমি খুঁজছি / বায়োডাটার ধরন:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'Male' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formData.gender === 'Male'
                      ? 'bg-[#FF4D7E]/15 border-[#FF4D7E] text-[#FF4D7E] shadow-md shadow-[#FF4D7E]/10'
                      : 'bg-[#150E2B] border-white/10 text-[#B9AFD1] hover:border-[#FF4D7E]/50'
                  }`}
                >
                  <span>👨</span> পাত্রের বায়োডাটা (পুরুষ)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'Female' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formData.gender === 'Female'
                      ? 'bg-[#FF4D7E]/15 border-[#FF4D7E] text-[#FF4D7E] shadow-md shadow-[#FF4D7E]/10'
                      : 'bg-[#150E2B] border-white/10 text-[#B9AFD1] hover:border-[#FF4D7E]/50'
                  }`}
                >
                  <span>🧕</span> পাত্রীর বায়োডাটা (নারী)
                </button>
              </div>
            </div>

            {/* Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  নামের প্রথম অংশ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                    <User className="w-4 h-4 text-[#F5B942]" />
                  </div>
                  <input
                    type="text"
                    placeholder="যেমন: তারিক"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  নামের শেষ অংশ
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রহমান"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Date of Birth & Marital Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  জন্ম তারিখ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                    <Calendar className="w-4 h-4 text-[#F5B942]" />
                  </div>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:outline-none focus:border-[#FF4D7E] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  বৈবাহিক অবস্থা
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:outline-none focus:border-[#FF4D7E] transition-colors"
                >
                  <option value="Never Married">অবিবাহিত</option>
                  <option value="Married - Seeking Another Wife">বিবাহিত - দ্বিতীয় বিবাহে আগ্রহী</option>
                  <option value="Divorced">ডিভোর্সড</option>
                  <option value="Widowed">বিধবা / বিপত্নীক</option>
                </select>
              </div>
            </div>

            {/* District & Religion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  নিজ জেলা
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                    <MapPin className="w-4 h-4 text-[#F5B942]" />
                  </div>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  >
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  ধর্ম
                </label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:outline-none focus:border-[#FF4D7E] transition-colors"
                >
                  <option value="Islam">ইসলাম (Islam)</option>
                  <option value="Hindu">হিন্দু (Hinduism)</option>
                  <option value="Other">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                মোবাইল নম্বর (লগইন আইডি)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                  <Phone className="w-4 h-4 text-[#F5B942]" />
                </div>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password & Strength Bar */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                  <Lock className="w-4 h-4 text-[#F5B942]" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  required
                />
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-[#150E2B] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 25
                          ? 'bg-rose-500 w-1/4'
                          : strength <= 50
                          ? 'bg-[#F5B942] w-2/4'
                          : strength <= 75
                          ? 'bg-sky-500 w-3/4'
                          : 'bg-emerald-500 w-full'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 hover:opacity-95 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F5B942]" />
                  <span>বিনামূল্যে বায়োডাটা তৈরি সম্পন্ন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-[#B9AFD1]">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <Link
                href="/login"
                className="font-bold text-[#FF4D7E] hover:text-[#FF4D7E]/80 underline underline-offset-4 ml-1"
              >
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
