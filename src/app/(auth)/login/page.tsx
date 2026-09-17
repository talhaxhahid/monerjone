'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Phone, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { isBDPhone } from '@/lib/utils';
import BrandLogo from '@/components/layout/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isBDPhone(phone)) {
      setError('সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01700000000)');
      return;
    }
    if (!password) {
      setError('পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setLoading(true);
    const res = await login(phone, password);
    setLoading(false);

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'লগইন ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-5xl rounded-3xl bg-[#1F1640] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
        
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

          {/* Center Quote & Visual Highlight */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D7E]/20 text-[#FF4D7E] text-xs font-semibold border border-[#FF4D7E]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>বিশ্বস্ত ম্যাট্রিমনিয়াল প্ল্যাটফর্ম</span>
            </div>

            <h2 className="text-2xl font-bold text-[#F5F3FA] leading-snug font-serif">
              মনের মতো সৎ ও দ্বীনদার জীবনসঙ্গী খুঁজে নিন সহজেই
            </h2>

            <p className="text-xs text-[#B9AFD1] leading-relaxed">
              হাজারো পাত্র-পাত্রীর মধ্য থেকে আপনার পছন্দের মানুষটিকে বেছে নিতে লগইন করুন এবং যোগাযোগ শুরু করুন।
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>১০০% ভেরিফাইড বায়োডাটা ও তথ্য</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সম্পূর্ণ নিরাপদ ও ইসলামিক শিষ্টাচার সম্মত</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#F5F3FA]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>সরাসরি পাত্র-পাত্রী ও অভিভাবকের সাথে যোগাযোগ</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Tag */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-[#8B7FA8] pt-4 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>আপনার ব্যক্তিগত তথ্য সর্বদা নিরাপদ ও সুরক্ষিত</span>
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
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Desktop Heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold text-[#F5F3FA] font-serif flex items-center gap-2">
              <span>লগইন করুন</span>
              <Heart className="w-5 h-5 text-[#FF4D7E] fill-[#FF4D7E]" />
            </h1>
            <p className="text-xs text-[#B9AFD1] mt-1">
              আপনার মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs font-medium text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                  <Phone className="w-4 h-4 text-[#F5B942]" />
                </div>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B7FA8]">
                  <Lock className="w-4 h-4 text-[#F5B942]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-sm placeholder:text-[#8B7FA8] focus:outline-none focus:border-[#FF4D7E] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8B7FA8] hover:text-[#F5F3FA]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-[#B9AFD1]">
              কোনো অ্যাকাউন্ট নেই?{' '}
              <Link
                href="/signup"
                className="font-bold text-[#FF4D7E] hover:text-[#FF4D7E]/80 underline underline-offset-4 ml-1"
              >
                ফ্রি বায়োডাটা নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
