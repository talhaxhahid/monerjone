import React from 'react';
import { ShieldCheck, Heart, Users, Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আমাদের লক্ষ্য ও আদর্শ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-serif">
          MonerJone সম্পর্কে
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          বাংলাদেশের সর্বাধিক নির্ভরযোগ্য ও শরীয়াহ সম্মত মুসলিম পাত্র-পাত্রী খোঁজার ডিজিটাল প্ল্যাটফর্ম।
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-amber-300 font-serif">আমাদের লক্ষ্য</h2>
        <p>
          MonerJone একটি আধুনিক, মার্জিত ও ইসলামিক মূল্যবোধে পরিচালিত প্ল্যাটফর্ম। আমাদের মূল উদ্দেশ্য হলো বাংলাদেশের ধর্মপ্রাণ মুসলিম তরুণ-তরুণী ও অভিভাবকদের জন্য একটি সম্পূর্ণ নিরাপদ, শালীন ও কার্যকর মাধ্যম তৈরি করা যার মাধ্যমে তারা সহজেই উপযুক্ত জীবনসঙ্গী খুঁজে নিতে পারেন।
        </p>
        
        <h2 className="text-xl font-bold text-amber-300 font-serif pt-4">আমাদের বিশেষত্ব</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-slate-100">ম্যানুয়াল যাচাইকরণ</h4>
            <p className="text-xs text-slate-400">প্রতিটি অ্যাকাউন্ট ও বায়োডাটা আমাদের টিম ম্যানুয়ালি রিভিউ করে অনুমোদন দেয়।</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <Heart className="w-5 h-5 text-rose-400" />
            <h4 className="font-bold text-slate-100">শরীয়াহ ও পারিবারিক শিষ্টাচার</h4>
            <p className="text-xs text-slate-400">অনৈতিক ডেটিং পরিহার করে সরাসরি অভিভাবক ও পাত্র-পাত্রীর দায়িত্বশীল যোগাযোগ নিশ্চিত করা হয়।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
