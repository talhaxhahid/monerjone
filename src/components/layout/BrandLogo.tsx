import React from 'react';
import Link from 'next/link';

export default function BrandLogo({
  href = '/',
  size = 'md',
  className = '',
}: {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  const logoContent = (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Exact Brand Emblem SVG from MonerJone */}
      <div
        className={`${iconSizes[size]} rounded-full overflow-hidden shrink-0 shadow-lg shadow-[#FF4D7E]/20 group-hover:scale-105 transition-transform duration-300 border border-[#FF4D7E]/30`}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="100" cy="112" rx="86" ry="80" fill="#3A2B54" />
          <g fill="#F5B942" opacity="0.85">
            <g transform="translate(28,55)">
              <path d="M0,-6 L1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5Z" />
            </g>
            <g transform="translate(172,75) scale(0.7)">
              <path d="M0,-6 L1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5Z" />
            </g>
            <g transform="translate(22,145) scale(0.6)">
              <path d="M0,-6 L1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5Z" />
            </g>
          </g>

          {/* GROOM (white panjabi) */}
          <g>
            <path
              d="M45,120 C43,145 40,168 38,185 L92,185 C90,168 88,145 87,124 C87,110 78,100 65,100 C53,100 45,108 45,120Z"
              fill="#F5F0E6"
            />
            <path d="M65,100 L65,185" stroke="#D8CDB4" strokeWidth="1.6" />
            <circle cx="65" cy="118" r="1.8" fill="#F5B942" />
            <circle cx="65" cy="132" r="1.8" fill="#F5B942" />
            <circle cx="65" cy="146" r="1.8" fill="#F5B942" />
            <path
              d="M46,122 C40,132 36,145 40,158 L52,155 C49,144 50,133 54,124Z"
              fill="#F5F0E6"
            />
            <path
              d="M84,122 C90,132 93,144 90,156 L78,153 C80,143 79,133 76,124Z"
              fill="#F5F0E6"
            />
            <ellipse cx="66" cy="160" rx="10" ry="7" fill="#C98457" />
            <rect x="59" y="90" width="12" height="14" fill="#C98457" />
            <circle cx="65" cy="76" r="19" fill="#D89A6A" />
            <path
              d="M48,78 C48,92 56,100 65,100 C74,100 82,92 82,78 C82,84 76,90 65,90 C54,90 48,84 48,78Z"
              fill="#2B2016"
            />
            <path
              d="M48,64 C48,52 55,44 65,44 C75,44 82,52 82,64 C82,66 80,67 78,66 C74,60 70,58 65,58 C60,58 56,60 52,66 C50,67 48,66 48,64Z"
              fill="#F5B942"
            />
            <path
              d="M65,44 L65,58 M55,48 L58,60 M75,48 L72,60"
              stroke="#B8912A"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* BRIDE (red saree) */}
          <g>
            {/* saree body */}
            <path
              d="M112,124 C110,146 108,168 106,185 L160,185 C158,168 156,146 154,122 C154,108 146,98 133,98 C121,98 112,110 112,124Z"
              fill="#B31217"
            />
            {/* saree pleats */}
            <path
              d="M118,130 C117,148 115,166 114,182"
              stroke="#9A0F16"
              strokeWidth="1.6"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M126,126 C125,146 124,166 123,183"
              stroke="#9A0F16"
              strokeWidth="1.6"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M141,126 C142,146 143,166 144,183"
              stroke="#C63A3F"
              strokeWidth="1.6"
              fill="none"
              opacity="0.6"
            />
            {/* pallu drape with gold border */}
            <path
              d="M120,100 C132,108 142,122 146,140 C148,155 146,170 142,183 L133,180 C137,166 137,151 133,138 C129,124 121,111 113,104Z"
              fill="#8C0D14"
            />
            <path
              d="M133,180 C137,166 137,151 133,138 C129,124 121,111 113,104"
              fill="none"
              stroke="#F5B942"
              strokeWidth="2"
            />
            {/* hem border */}
            <path d="M106,182 L160,182" stroke="#F5B942" strokeWidth="3" />
            {/* arms */}
            <path
              d="M113,124 C107,134 104,146 108,158 L120,155 C117,145 118,134 121,126Z"
              fill="#B31217"
            />
            <path
              d="M153,124 C159,134 161,146 157,157 L145,154 C147,144 146,134 143,126Z"
              fill="#B31217"
            />
            <ellipse cx="132" cy="160" rx="10" ry="7" fill="#D9A06E" />
            {/* necklace */}
            <path
              d="M124,98 Q133,106 142,98"
              stroke="#F5B942"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <rect x="127" y="88" width="12" height="12" fill="#D9A06E" />
            {/* dupatta hood (behind head) */}
            <path
              d="M109,100 C107,72 115,46 133,46 C151,46 159,72 157,100
                 C159,118 159,138 155,153 L146,151
                 C149,134 149,114 147,99 C145,76 140,62 133,60
                 C126,62 121,76 119,99 C117,114 117,134 120,151
                 L111,153 C107,138 107,118 109,100 Z"
              fill="#B31217"
            />
            <path
              d="M119,99 C121,76 126,62 133,60 C140,62 145,76 147,99"
              fill="none"
              stroke="#F5B942"
              strokeWidth="1.6"
            />
            {/* head */}
            <circle cx="133" cy="76" r="18" fill="#E0AC7A" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold tracking-tight font-serif flex items-center ${textSizes[size]}`}>
          <span className="text-[#F5F3FA]">Moner</span>
          <span className="text-[#FF4D7E] ml-1">Jone</span>
        </div>
        <span className="text-[9px] text-[#B9AFD1] tracking-widest uppercase -mt-0.5 font-medium font-sans">
          Muslim Matrimony
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
