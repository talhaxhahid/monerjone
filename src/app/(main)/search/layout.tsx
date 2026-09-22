import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'প্রোফাইল দেখুন | MonerJone',
  description:
    'জেলা, শিক্ষা, বয়স, ধর্ম ও আরও বিভিন্ন মানদণ্ড অনুযায়ী ভেরিফায়েড বাংলাদেশী পাত্র পাত্রীর বায়োডাটা ও বিয়ের প্রোফাইল খুঁজুন।',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
