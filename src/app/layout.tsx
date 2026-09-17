import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'MonerJone | নির্ভরযোগ্য বাংলাদেশী মুসলিম ম্যাট্রিমনিয়াল',
  description: 'বাংলাদেশের বিশ্বস্ত ও শরীয়াহ সম্মত মুসলিম পাত্র-পাত্রী খোঁজার ওয়েবসাইট। ১০০% ভেরিফাইড প্রোফাইল ও সম্পূর্ণ গোপনীয়তা।',
  keywords: ['bangladeshi matrimony', 'muslim matrimony', 'monerjone', 'biye', 'biodata', 'পাত্র পাত্রী'],
  authors: [{ name: 'MonerJone' }],
  icons: {
    icon: '/icons/favicon.svg',
  },
  openGraph: {
    title: 'MonerJone - বাংলাদেশী মুসলিম ম্যাট্রিমনিয়াল',
    description: 'মনের মতো পাত্র-পাত্রী খুঁজুন সহজে ও বিশ্বস্ততার সাথে।',
    images: ['/images/hero-og.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#150E2B] text-[#F5F3FA] min-h-screen flex flex-col font-sans selection:bg-[#FF4D7E] selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
