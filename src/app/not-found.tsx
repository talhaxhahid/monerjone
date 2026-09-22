import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-[70vw] h-[70vw] max-w-2xl max-h-2xl text-[#FF4D7E]">
          <path
            fill="currentColor"
            d="M12 0 L14.5 8.2 22.4 5.5 17 12 22.4 18.5 14.5 15.8 12 24 9.5 15.8 1.6 18.5 7 12 1.6 5.5 9.5 8.2 Z"
          />
        </svg>
      </div>
      <div className="relative z-10 text-center space-y-5">
        <div className="text-6xl sm:text-7xl font-extrabold font-serif text-[#F5B942]">404</div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F5F3FA]">এই পেজটি খুঁজে পাওয়া যায়নি</h1>
        <p className="text-sm text-[#B9AFD1] max-w-md mx-auto leading-relaxed">
          আপনি যে পেজটি খুঁজছেন তা সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে, অথবা এটির অস্তিত্ব নেই।
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-sm font-bold transition-all"
          >
            হোমে ফিরে যান
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] text-sm font-semibold border border-white/10 transition-all"
          >
            প্রোফাইল দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
