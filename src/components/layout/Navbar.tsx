'use client';

import React, { useState, useEffect } from 'react';
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
  LayoutDashboard,
  Home,
  Info,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { bn } from '@/lib/utils';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, unreadCount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileSidebarOpen]);

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#150E2B]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <BrandLogo href={user ? null : '/'} size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
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

          {/* Right Actions Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
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

                {/* User Avatar & Dropdown (Desktop) */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full bg-[#1F1640] border border-white/15 hover:border-[#FF4D7E]/60 transition-all focus:outline-none cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#8b5cf6] via-[#c026d3] to-[#7c3aed] shrink-0">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.firstName}
                          className="w-full h-full rounded-full object-cover border-2 border-[#1F1640]"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full border-2 border-[#1F1640] bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] text-white font-bold flex items-center justify-center text-sm">
                          {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                        </div>
                      )}
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
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
              /* Desktop Auth Buttons */
              <div className="hidden sm:flex items-center gap-2.5">
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

            {/* Mobile Header Direct Login CTA (Visible on Mobile when logged out) */}
            {!user && (
              <div className="flex sm:hidden items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1F1640] text-[#F5F3FA] border border-white/10 hover:border-[#FF4D7E]/40 transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FF4D7E] text-white shadow-md shadow-[#FF4D7E]/25 transition-all"
                >
                  নিবন্ধন
                </Link>
              </div>
            )}

            {/* Mobile Off-Canvas Hamburger Toggle Button (hidden on the public home page for logged-out visitors) */}
            {!(pathname === '/' && !user) && (
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2.5 rounded-xl bg-[#1F1640]/90 text-[#F5F3FA] hover:text-[#FF4D7E] border border-white/10 shadow-md active:scale-95 transition-all cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= PROFESSIONAL MOBILE SLIDING SIDEBAR DRAWER ================= */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Off-Canvas Sliding Drawer Panel (From Right) */}
          <div className="relative ml-auto w-[86vw] max-w-sm h-full bg-[#150E2B] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 z-50">
            
            {/* 1. TOP DRAWER HEADER */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#1F1640]/80 sticky top-0 z-20 backdrop-blur-md">
              <BrandLogo href="/" size="sm" />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-full bg-[#150E2B] text-[#B9AFD1] hover:text-white hover:bg-[#331A5C] border border-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. DRAWER BODY CONTENT */}
            <div className="p-5 space-y-6 flex-1">
              
              {/* User Profile Info OR Auth Action Card */}
              {user ? (
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#1F1640] to-[#331A5C] border border-[#FF4D7E]/30 shadow-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-[#8b5cf6] via-[#c026d3] to-[#7c3aed] shrink-0">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.firstName}
                          className="w-full h-full rounded-full object-cover border-2 border-[#1F1640]"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full border-2 border-[#1F1640] bg-gradient-to-tr from-[#FF4D7E] to-[#F5B942] text-white font-extrabold flex items-center justify-center text-lg">
                          {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#F5F3FA] truncate">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-xs text-[#8B7FA8] truncate font-mono">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#8B7FA8]">প্যাকেজ:</span>
                      <span className="text-[10px] font-bold text-[#F5B942] bg-[#F5B942]/10 px-2 py-0.5 rounded-full border border-[#F5B942]/20 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {bn(user.premium)}
                      </span>
                    </div>

                    {user.premium === 'Free' ? (
                      <Link
                        href="/pricing"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="text-[10px] font-bold text-[#FF4D7E] hover:underline flex items-center gap-0.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#F5B942]" />
                        আপগ্রেড করুন
                      </Link>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-medium">সক্রিয়</span>
                    )}
                  </div>
                </div>
              ) : (
                /* High-Conversion Auth Card for Guests */
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1F1640] to-[#150E2B] border border-[#FF4D7E]/30 shadow-xl space-y-3">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-semibold text-[#F5B942] uppercase tracking-wider">
                      <span className="notranslate" translate="no">MonerJone</span> ইসলামিক ম্যাট্রিমনি
                    </span>
                    <h4 className="text-sm font-bold text-[#F5F3FA]">
                      মনের মতো দ্বীনদার জীবনসঙ্গী খুঁজুন
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <Link
                      href="/signup"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-lg shadow-[#FF4D7E]/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <UserPlus className="w-4 h-4 text-[#F5B942]" />
                      <span>ফ্রি বায়োডাটা নিবন্ধন করুন</span>
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1F1640] hover:bg-[#331A5C] text-[#F5F3FA] border border-white/10 flex items-center justify-center gap-2 transition-all"
                    >
                      <LogIn className="w-4 h-4 text-[#F5B942]" />
                      <span>অ্যাকাউন্টে লগইন করুন</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Section 1: Main Routes */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8B7FA8] uppercase tracking-wider px-3 block mb-2">
                  প্রধান নেভিগেশন
                </span>

                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    pathname === '/'
                      ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                      : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-[#F5B942]" />
                    <span>হোম পেইজ</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                </Link>

                <Link
                  href="/search"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    pathname.startsWith('/search')
                      ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                      : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-[#F5B942]" />
                    <span>পাত্র-পাত্রী সার্চ</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    pathname.startsWith('/pricing')
                      ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                      : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-[#F5B942]" />
                    <span>মেম্বারশিপ প্যাকেজসমূহ</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F5B942]/20 text-[#F5B942] border border-[#F5B942]/30">
                    অফার
                  </span>
                </Link>
              </div>

              {/* Navigation Section 2: Account Features (if logged in) */}
              {user && (
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-[#8B7FA8] uppercase tracking-wider px-3 block mb-2">
                    আমার অ্যাকাউন্ট
                  </span>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/dashboard'
                        ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                        : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 text-[#F5B942]" />
                      <span>ড্যাশবোর্ড ও পরিসংখ্যান</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                  </Link>

                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#F5F3FA] hover:bg-[#1F1640] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-4 h-4 text-[#F5B942]" />
                      <span>আমার বায়োডাটা দেখুন</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname.startsWith('/profile/edit')
                        ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                        : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Edit3 className="w-4 h-4 text-[#F5B942]" />
                      <span>বায়োডাটা সম্পাদনা</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                  </Link>

                  <Link
                    href="/inbox"
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname.startsWith('/inbox')
                        ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                        : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-[#F5B942]" />
                      <span>মেসেজ ও ইনবক্স</span>
                    </div>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FF4D7E] text-white rounded-full">
                        {unreadCount}টি নতুন
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                    )}
                  </Link>

                  <Link
                    href="/favorites"
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname.startsWith('/favorites')
                        ? 'bg-[#FF4D7E]/15 text-[#FF4D7E] border border-[#FF4D7E]/30 font-bold'
                        : 'text-[#F5F3FA] hover:bg-[#1F1640]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-[#FF4D7E]" />
                      <span>পছন্দের শর্টলিস্ট</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B7FA8]" />
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#F5B942] bg-[#F5B942]/10 border border-[#F5B942]/30 hover:bg-[#F5B942]/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-[#F5B942]" />
                        <span>এডমিন কন্ট্রোল প্যানেল</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#F5B942]" />
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation Section 3: Company & Trust Links */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold text-[#8B7FA8] uppercase tracking-wider px-3 block mb-2">
                  সহায়তা ও তথ্য
                </span>

                <Link
                  href="/about"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#B9AFD1] hover:text-[#F5F3FA] hover:bg-[#1F1640] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-[#8B7FA8]" />
                    <span>আমাদের সম্পর্কে</span>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#B9AFD1] hover:text-[#F5F3FA] hover:bg-[#1F1640] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-[#8B7FA8]" />
                    <span>যোগাযোগ ও হেল্পলাইন</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* 3. DRAWER FOOTER */}
            <div className="p-5 border-t border-white/10 bg-[#1F1640]/50 space-y-3">
              {user ? (
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন</span>
                </button>
              ) : (
                <div className="text-center">
                  <span className="text-[11px] text-[#8B7FA8]">
                    হেল্পলাইন: <span className="text-[#F5B942] font-mono font-bold">০১৭১৩-০৮১২৭৪</span>
                  </span>
                </div>
              )}

              {!user && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8B7FA8]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>১০০% ইসলামিক ও বিশ্বস্ত পাত্র-পাত্রী সন্ধান</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
