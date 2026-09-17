import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Lock, PhoneCall } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#150E2B] text-[#B9AFD1] pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F1640] border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 flex items-center justify-center text-[#FF4D7E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F3FA]">১০০% ভেরিফাইড প্রোফাইল</h4>
              <p className="text-xs text-[#B9AFD1] mt-0.5">ম্যানুয়াল যাচাইকরণ ও নিরাপদ প্ল্যাটফর্ম</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F1640] border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[#F5B942]/10 border border-[#F5B942]/20 flex items-center justify-center text-[#F5B942]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F3FA]">সম্পূর্ণ ব্যক্তিগত গোপনীয়তা</h4>
              <p className="text-xs text-[#B9AFD1] mt-0.5">আপনার অনুমতি ছাড়া ফোন নম্বর গোপন থাকে</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1F1640] border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 flex items-center justify-center text-[#FF4D7E]">
              <Heart className="w-6 h-6 text-[#FF4D7E]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F5F3FA]">শরীয়াহ সম্মত ম্যাট্রিমনিয়াল</h4>
              <p className="text-xs text-[#B9AFD1] mt-0.5">দ্বীনদার পাত্র-পাত্রী খোঁজার সেরা মাধ্যম</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo href="/" size="sm" />
            <p className="text-xs leading-relaxed text-[#B9AFD1]">
              বাংলাদেশের সবথেকে নির্ভরযোগ্য এবং শরীয়াহ সম্মত মুসলিম ম্যাট্রিমনিয়াল প্ল্যাটফর্ম। মনের মতো জীবনসঙ্গী খুঁজুন সহজে ও নিরাপদে।
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#F5B942] font-medium">সহজ পেমেন্ট মেথড:</span>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-[#E2136E]/15 border border-[#E2136E]/30 text-[#FF65A3] font-bold text-xs flex items-center gap-1.5">
                  <span className="text-sm">📱</span> বিকাশ (bKash) পেমেন্ট
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5B942]">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-2 text-xs text-[#B9AFD1]">
              <li>
                <Link href="/search" className="hover:text-[#FF4D7E] transition-colors">
                  পাত্র-পাত্রী খুঁজুন
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#FF4D7E] transition-colors">
                  প্যাকেজ ও মূল্য তালিকা
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#FF4D7E] transition-colors">
                  ফ্রি বায়োডাটা তৈরি করুন
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#FF4D7E] transition-colors">
                  লগইন
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5B942]">
              সহায়তা ও তথ্য
            </h3>
            <ul className="space-y-2 text-xs text-[#B9AFD1]">
              <li>
                <Link href="/about" className="hover:text-[#FF4D7E] transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF4D7E] transition-colors">
                  যোগাযোগ ও সাপোর্ট
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FF4D7E] transition-colors">
                  গোপনীয়তা নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF4D7E] transition-colors">
                  শর্তাবলী ও নীতিমালা
                </Link>
              </li>
            </ul>
          </div>

          {/* Islamic Ethics & Helpline */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5B942]">
              হেল্পলাইন ও সেবা
            </h3>
            <p className="text-xs text-[#B9AFD1]">
              যেকোনো জিজ্ঞাসায় আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করতে পারেন:
            </p>
            <div className="p-3.5 rounded-xl bg-[#1F1640] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#F5B942] font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-[#FF4D7E]" />
                <span>+880 1700-000000</span>
              </div>
              <p className="text-[11px] text-[#8B7FA8]">প্রতিদিন সকাল ১০টা - রাত ১০টা</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B7FA8]">
          <p>© {new Date().getFullYear()} MonerJone. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#FF4D7E] fill-[#FF4D7E]" /> for Muslim Matrimony in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
