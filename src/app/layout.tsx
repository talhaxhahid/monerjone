import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MainContent from '@/components/layout/MainContent';
import PixelRouteTracker from '@/components/layout/PixelRouteTracker';
import MembershipExpiryNotice from '@/components/layout/MembershipExpiryNotice';
import LockedAccountGuard from '@/components/layout/LockedAccountGuard';

export const metadata: Metadata = {
  metadataBase: new URL('https://monerjone.com'),
  title: 'MonerJone | নির্ভরযোগ্য বাংলাদেশী মুসলিম ম্যাট্রিমনিয়াল',
  description: 'বাংলাদেশের বিশ্বস্ত ও শরীয়াহ সম্মত মুসলিম পাত্র-পাত্রী খোঁজার ওয়েবসাইট। ১০০% ভেরিফাইড প্রোফাইল ও সম্পূর্ণ গোপনীয়তা।',
  keywords: ['bangladeshi matrimony', 'muslim matrimony', 'monerjone', 'biye', 'biodata', 'পাত্র পাত্রী'],
  authors: [{ name: 'MonerJone' }],
  icons: {
    icon: '/icons/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'MonerJone',
    title: 'MonerJone | মনেরজনে - বাংলাদেশী পাত্র পাত্রীর বিয়ের সাইট | বর ও কনে খুঁজুন',
    description: 'মনেরজনে (MonerJone) — সকল ধর্মের বাংলাদেশীদের জন্য বিশ্বস্ত বিবাহ সাইট। ভেরিফায়েড প্রোফাইলের মাধ্যমে আপনার মনের মানুষ খুঁজে নিন।',
    images: [{ url: '/images/hero-og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonerJone | মনেরজনে - বাংলাদেশী পাত্র পাত্রীর বিয়ের সাইট | বর ও কনে খুঁজুন',
    description: 'মনেরজনে (MonerJone) — সকল ধর্মের বাংলাদেশীদের জন্য বিশ্বস্ত বিবাহ সাইট। ভেরিফায়েড প্রোফাইলের মাধ্যমে আপনার মনের মানুষ খুঁজে নিন।',
    images: ['/images/hero-og.jpg'],
  },
  robots: 'index, follow',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MonerJone',
              url: 'https://monerjone.com/',
              description:
                'মনেরজনে - বাংলাদেশের বিশ্বস্ত বিবাহ সাইট, যেখানে সকল ধর্মের পাত্র পাত্রীরা ভেরিফায়েড প্রোফাইলের মাধ্যমে বিয়ের জন্য জীবনসঙ্গী খুঁজে পান।',
            }),
          }}
        />
      </head>
      <body className="bg-[#150E2B] text-[#F5F3FA] min-h-screen flex flex-col font-sans selection:bg-[#FF4D7E] selection:text-white">
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1040810235517893');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height={1}
            width={1}
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1040810235517893&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-18435571765" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18435571765');
          `}
        </Script>

        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('DAF4U6BC77UC8FLJPMMG');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        <AuthProvider>
          <PixelRouteTracker />
          <MembershipExpiryNotice />
          <LockedAccountGuard />
          <Navbar />
          <MainContent>{children}</MainContent>
          <ConditionalFooter />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
