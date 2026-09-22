import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ফ্রি অ্যাকাউন্ট তৈরি করুন | MonerJone',
  description: 'মাত্র কয়েক মিনিটে মনেরজনে-এ সাইন আপ করুন এবং আন্তরিক জীবনসঙ্গী খোঁজা শুরু করুন।',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
