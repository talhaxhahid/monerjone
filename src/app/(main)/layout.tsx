import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MonerJone | মনেরজনে - বাংলাদেশী পাত্র পাত্রীর বিয়ের সাইট | বর ও কনে খুঁজুন',
  description:
    'মনেরজনে (MonerJone) — আপনার মনের মানুষ খুঁজে পাওয়ার বিশ্বস্ত বাংলাদেশী বিবাহ সাইট। সকল ধর্মের পাত্র পাত্রীর বায়োডাটা, বিয়ের প্রোফাইল, নিকাহ ও বিবাহের জন্য উপযুক্ত জীবনসঙ্গী খুঁজুন ভেরিফায়েড প্রোফাইলের মাধ্যমে।',
};

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
