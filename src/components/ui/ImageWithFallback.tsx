'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Camera, UserRound } from 'lucide-react';

export interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  gender?: 'Male' | 'Female' | string | null;
  name?: string | null;
  fallbackType?: 'avatar' | 'image' | 'thumbnail';
  containerClassName?: string;
  showFallbackLabel?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  gender,
  name,
  fallbackType = 'avatar',
  className = '',
  containerClassName = '',
  showFallbackLabel = false,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const hasValidSrc = Boolean(src && typeof src === 'string' && src.trim() !== '' && !hasError);

  // Extract initial
  const initial = (name || alt || 'U').trim().charAt(0).toUpperCase();
  const isFemale = gender?.toLowerCase() === 'female' || gender === 'পাত্রী';


  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${containerClassName}`}>
      {/* 1. Loading Shimmer Skeleton */}
      {hasValidSrc && isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1F1640] skeleton-shimmer overflow-hidden">
          {/* Pulse skeleton placeholder icon */}
          <div className="flex flex-col items-center justify-center gap-2 text-[#8B7FA8]/60 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#331A5C] animate-pulse flex items-center justify-center border border-white/5 shadow-inner">
              <Camera className="w-5 h-5 text-[#8B7FA8]/70 animate-pulse" />
            </div>
            {showFallbackLabel && (
              <div className="w-16 h-2 rounded-full bg-[#331A5C] animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* 2. Main Image */}
      {hasValidSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src!}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      ) : (
        /* 3. Fallback View */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1F1640] via-[#1A1235] to-[#150E2B] text-[#8B7FA8] p-3 select-none">
          {fallbackType === 'thumbnail' ? (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#8B7FA8]/60" />
            </div>
          ) : fallbackType === 'image' ? (
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#331A5C] border border-[#FF4D7E]/20 flex items-center justify-center text-[#F5F3FA]">
                <ImageIcon className="w-6 h-6 text-[#FF4D7E]" />
              </div>
              <span className="text-xs text-[#B9AFD1] font-medium">ছবি পাওয়া যায়নি</span>
            </div>
          ) : (
            /* Avatar Fallback */
            <div className="flex flex-col items-center justify-center text-center w-full h-full">
              <div
                className={`relative rounded-full flex items-center justify-center shadow-lg border transition-transform ${
                  isFemale
                    ? 'bg-gradient-to-tr from-[#331A5C] to-[#FF4D7E]/40 border-[#FF4D7E]/40 text-[#FF4D7E]'
                    : 'bg-gradient-to-tr from-[#1F1640] to-[#F5B942]/30 border-[#F5B942]/40 text-[#F5B942]'
                } ${
                  showFallbackLabel ? 'w-20 h-20 mb-2.5 text-2xl font-bold' : 'w-full h-full text-lg font-bold'
                }`}
              >
                {/* SVG Silhouette Silhouette Base */}
                <div className="flex flex-col items-center justify-center">
                  <UserRound className={showFallbackLabel ? 'w-9 h-9' : 'w-1/2 h-1/2'} />
                  {showFallbackLabel && (
                    <span className="text-[11px] font-extrabold uppercase mt-0.5 tracking-wider">
                      {initial}
                    </span>
                  )}
                </div>
              </div>

              {showFallbackLabel && (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-[#B9AFD1] font-medium">ছবি যুক্ত করা হয়নি</span>
                  <span className="text-[10px] text-[#8B7FA8] mt-0.5">
                    {isFemale ? 'পাত্রী প্রোফাইল' : 'পাত্র প্রোফাইল'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
