'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BD_DISTRICTS, isBDPhone } from '@/lib/utils';
import { User, Phone, Lock, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-3">
            <BrandLogo href="/" size="lg" />
          </div>
          <p className="text-sm text-[#B9AFD1] mt-1">
            সহজেই আপনার অ্যাকাউন্ট তৈরি করে মনের মতো জীবনসঙ্গী খুঁজুন
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl bg-[#1F1640] border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
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
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
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
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm focus:outline-none focus:border-[#FF4D7E] transition-colors"
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
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 hover:opacity-95 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
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
                className="font-semibold text-[#FF4D7E] hover:text-[#FF4D7E]/80 underline underline-offset-4 ml-1"
              >
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8B7FA8]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>শরীয়াহ সম্মত নিয়ম ও সম্পূর্ণ গোপনীয়তা নিশ্চিত</span>
        </div>
      </div>
    </div>
  );
}
