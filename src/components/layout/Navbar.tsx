'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  MessageCircle,
  Search,
  User as UserIcon,
  Crown,
  LogOut,
  Menu,
  X,
  Edit3,
  ShieldAlert,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { bn } from '@/lib/utils';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, unreadCount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#150E2B]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <BrandLogo href={user ? null : '/'} size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/'
                ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            হোম
          </Link>
          <Link
            href="/search"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/search')
                ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-[#F5B942]" />
            পাত্র/পাত্রী খুঁজুন
          </Link>
          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/pricing')
                ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-[#F5B942]" />
            প্যাকেজসমূহ
          </Link>

          {user && (
            <>
              <Link
                href="/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#F5B942]" />
                ড্যাশবোর্ড
              </Link>
              <Link
                href="/favorites"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/favorites'
                    ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-4 h-4 text-[#FF4D7E]" />
                শর্টলিস্ট
              </Link>
              <Link
                href="/inbox"
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/inbox')
                    ? 'text-[#FF4D7E] bg-[#FF4D7E]/10 border border-[#FF4D7E]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#F5B942]" />
                মেসেজ
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#FF4D7E] text-white rounded-full animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Premium Plan Badge */}
              {user.premium === 'Free' ? (
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/40 hover:bg-[#F5B942]/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
                  আপগ্রেড করুন
                </Link>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#F5B942] text-[#23180A] shadow-md shimmer-badge">
                  <Crown className="w-3.5 h-3.5" />
                  {bn(user.premium)}
                </span>
              )}

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full bg-[#1F1640] border border-white/15 hover:border-[#FF4D7E]/60 transition-all focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] text-white font-bold flex items-center justify-center text-sm shadow-inner">
                    {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-slate-200 pr-2">
                    {user.firstName}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    onClick={() => setDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                )}

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#1F1640]/95 border border-white/15 shadow-2xl backdrop-blur-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-slate-100">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#F5B942] font-mono mt-0.5">
                        {user.phone}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">মেম্বারশিপ:</span>
                        <span className="text-[11px] font-bold text-[#F5B942] bg-[#F5B942]/10 px-2 py-0.5 rounded-full border border-[#F5B942]/30">
                          {bn(user.premium)}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-[#FF4D7E] hover:bg-white/5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#F5B942]" />
                        আমার বায়োডাটা দেখুন
                      </Link>
                      <Link
                        href="/profile/edit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-[#FF4D7E] hover:bg-white/5 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-[#F5B942]" />
                        বায়োডাটা এডিট করুন
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-[#FF4D7E] hover:bg-white/5 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-[#FF4D7E]" />
                        পছন্দের তালিকা
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#F5B942] bg-[#F5B942]/10 hover:bg-[#F5B942]/20 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#F5B942]" />
                          এডমিন প্যানেল
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        লগআউট করুন
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-[#FF4D7E] transition-colors"
              >
                লগইন
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                ফ্রি নিবন্ধন
              </Link>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#B9AFD1] hover:text-[#FF4D7E] hover:bg-[#1F1640] border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#150E2B] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
          >
            হোম
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
          >
            পাত্র/পাত্রী খুঁজুন
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
          >
            প্যাকেজসমূহ
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
              >
                ড্যাশবোর্ড
              </Link>
              <Link
                href="/profile/edit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
              >
                বায়োডাটা সম্পাদনা
              </Link>
              <Link
                href="/inbox"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
              >
                মেসেজ ({unreadCount})
              </Link>
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-[#F5F3FA] hover:text-[#FF4D7E] hover:bg-[#1F1640]"
              >
                শর্টলিস্ট
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-medium text-rose-400 hover:bg-rose-500/10"
              >
                লগআউট
              </button>
            </>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold bg-[#1F1640] text-[#F5F3FA] border border-white/10 hover:border-[#FF4D7E]/50"
              >
                লগইন
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold bg-[#FF4D7E] hover:bg-[#E63465] text-white font-bold shadow-md shadow-[#FF4D7E]/30"
              >
                নিবন্ধন
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
