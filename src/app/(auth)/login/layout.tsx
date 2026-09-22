import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'লগ ইন | MonerJone',
  description: 'আপনার মনেরজনে অ্যাকাউন্টে লগ ইন করে ম্যাচ ও মেসেজ দেখুন।',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
