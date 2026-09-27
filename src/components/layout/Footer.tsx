import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// TikTok's logo isn't part of lucide-react's icon set, so it's a small
// inline SVG kept consistent with the other icons (currentColor, 18x18).
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/61594852170393', Icon: FacebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/monerjone/', Icon: InstagramIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@monerjone', Icon: TikTokIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@MonerJone', Icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#150E2B] text-[#B9AFD1] pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo href="/" size="sm" />
            <p className="text-xs leading-relaxed text-[#B9AFD1]">
              বাংলাদেশীদের আন্তরিক জীবনসঙ্গী খুঁজে পেতে সাহায্য করা একটি বিশ্বস্ত বিবাহ ও ম্যাট্রিমনি প্ল্যাটফর্ম। পাত্র-পাত্রীর বায়োডাটা দেখুন এবং চ্যাটে বার্তা আদান-প্রদান করুন।
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-9 h-9 rounded-xl bg-[#1F1640] border border-white/10 flex items-center justify-center text-[#B9AFD1] hover:text-[#FF4D7E] hover:border-[#FF4D7E]/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
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
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B7FA8]">
          <p>© {new Date().getFullYear()} <span className="notranslate" translate="no">MonerJone</span>. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#FF4D7E] fill-[#FF4D7E]" /> for all Bangladeshis
          </p>
        </div>
      </div>
    </footer>
  );
}
