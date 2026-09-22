'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Search, MessageCircle, User, Crown } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, unreadCount } = useAuth();

  // Only logged-in users have a use for this nav (guests have nothing behind
  // "messages"/"profile" anyway), so it's hidden entirely for guests.
  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#150E2B]/95 border-t border-white/10 backdrop-blur-xl px-2 py-2 safe-bottom shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 items-center">
        
        {/* Home -> dashboard once logged in, matching the original site's behavior */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 rounded-xl transition-all ${
            pathname === '/dashboard' ? 'text-[#FF4D7E]' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">হোম</span>
        </Link>

        {/* Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center py-1 rounded-xl transition-all ${
            pathname.startsWith('/search') ? 'text-[#FF4D7E]' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">খুঁজুন</span>
        </Link>

        {/* Pricing / Packages */}
        <Link
          href="/pricing"
          className={`flex flex-col items-center py-1 rounded-xl transition-all ${
            pathname.startsWith('/pricing') ? 'text-[#FF4D7E]' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <Crown className="w-5 h-5 text-[#F5B942]" />
          <span className="text-[10px] mt-1 font-medium">প্যাকেজ</span>
        </Link>

        {/* Messages */}
        <Link
          href="/inbox"
          className={`relative flex flex-col items-center py-1 rounded-xl transition-all ${
            pathname.startsWith('/inbox') ? 'text-[#FF4D7E]' : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-3.5 w-4 h-4 bg-[#FF4D7E] text-white font-bold text-[9px] flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
          <span className="text-[10px] mt-1 font-medium">মেসেজ</span>
        </Link>

        {/* Profile / Account */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 rounded-xl transition-all ${
            pathname.startsWith('/dashboard') || pathname.startsWith('/profile')
              ? 'text-[#FF4D7E]'
              : 'text-[#B9AFD1] hover:text-[#F5F3FA]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">প্রোফাইল</span>
        </Link>
      </div>
    </div>
  );
}
