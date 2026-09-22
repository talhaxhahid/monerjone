'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, MessageCircle, LogOut } from 'lucide-react';

export default function AccountLockedPage() {
  const router = useRouter();
  const { lockInfo, user, logout } = useAuth();

  // If someone lands here without actually being locked (e.g. typed the
  // URL directly), send them somewhere sensible instead of showing a
  // confusing "locked" screen.
  React.useEffect(() => {
    if (!lockInfo && !user) {
      router.replace('/login');
    } else if (user) {
      router.replace('/dashboard');
    }
  }, [lockInfo, user, router]);

  if (!lockInfo) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const days = lockInfo.daysRemaining;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full rounded-3xl bg-[#1F1640] border border-rose-500/30 shadow-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F5F3FA]">
            আপনার অ্যাকাউন্টটি লক করা হয়েছে
          </h1>
          <p className="text-xs sm:text-sm text-[#B9AFD1] leading-relaxed">
            আমাদের কমিউনিটি গাইডলাইন লঙ্ঘনের কারণে আপনার অ্যাকাউন্টটি সাময়িকভাবে লক করা হয়েছে। এর সাধারণ কারণগুলোর মধ্যে রয়েছে — ভুয়া বা মিথ্যা তথ্য দিয়ে প্রোফাইল তৈরি করা, অনুপযুক্ত বা আপত্তিকর ছবি আপলোড করা, হয়রানিমূলক আচরণ, অথবা আমাদের শর্তাবলী ও প্রাইভেসি পলিসির অন্য কোনো লঙ্ঘন।
          </p>
        </div>

        <div className="rounded-2xl bg-[#150E2B] border border-white/10 p-4 sm:p-5 space-y-2">
          <p className="text-xs sm:text-sm text-[#F5F3FA]">
            আপনার অ্যাকাউন্টটি আনলক করতে <strong className="text-[#F5B942]">৳১০০০ টাকা জরিমানা</strong> প্রদান করতে হবে।
          </p>
          <p className="text-xs sm:text-sm text-rose-300">
            আগামী <strong>{days}</strong> দিনের মধ্যে অ্যাকাউন্টটি আনলক বা পুনরায় চালু করা না হলে, এটি আমাদের সিস্টেম থেকে স্থায়ীভাবে মুছে ফেলা হবে।
          </p>
          <p className="text-xs sm:text-sm text-[#8B7FA8]">
            স্থায়ীভাবে মুছে ফেলার পর, এই মোবাইল নম্বর দিয়ে ভবিষ্যতে আর কখনো মনেরজনে-তে নতুন অ্যাকাউন্ট তৈরি করা যাবে না।
          </p>
        </div>

        <p className="text-xs text-[#B9AFD1]">
          অ্যাকাউন্ট আনলক করতে বা এই সিদ্ধান্ত সম্পর্কে বিস্তারিত জানতে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="https://wa.me/+8801627721328"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            আপনার অ্যাকাউন্ট আনলক করুন
          </a>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#B9AFD1] hover:text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            লগ আউট
          </button>
        </div>
      </div>
    </div>
  );
}
