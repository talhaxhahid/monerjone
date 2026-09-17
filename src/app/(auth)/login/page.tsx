'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Phone, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-3">
            <BrandLogo href="/" size="lg" />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            আপনার অ্যাকাউন্টে প্রবেশ করে মনের মতো জীবনসঙ্গী খুঁজুন
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl bg-[#1F1640] border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs font-medium text-rose-200 animate-shake">
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
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 hover:opacity-95 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
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
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-[#B9AFD1]">
              কোনো অ্যাকাউন্ট নেই?{' '}
              <Link
                href="/signup"
                className="font-semibold text-[#FF4D7E] hover:text-[#FF4D7E]/80 underline underline-offset-4 ml-1"
              >
                ফ্রি বায়োডাটা নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8B7FA8]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>আপনার ব্যক্তিগত তথ্য ১০০% সুরক্ষিত ও গোপনীয়</span>
        </div>
      </div>
    </div>
  );
}
