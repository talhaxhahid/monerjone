import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'মেম্বারশিপ প্ল্যান ও মূল্য | MonerJone',
  description: 'মনেরজনে-এর ফ্রি, রূপা ও গোল্ড মেম্বারশিপ প্ল্যান তুলনা করুন।',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
