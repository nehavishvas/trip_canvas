'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: number;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
}

interface CarouselProps {
  media: MediaItem[];
}

export default function Carousel({ media }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!media || media.length <= 1 || isHovered) return;

    // Do not auto-advance if the active media is a video (to avoid cutting it off)
    if (media[activeIndex]?.file_type === 'video') return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, media, isHovered]);

  if (!media || media.length === 0) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
        <ImageIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
        <p className="mt-2 text-sm">No media attached to this post</p>
      </div>
    );
  }

  const activeMedia = media[activeIndex];

  return (
    <div 
      className="w-full space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Display Screen */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
        
        {/* Carousel Slide Item */}
        <div className="flex h-full w-full items-center justify-center">
          {activeMedia.file_type === 'video' ? (
            <video
              key={activeMedia.file_url}
              src={activeMedia.file_url}
              controls
              className="h-full w-full object-contain"
              autoPlay={false}
              preload="metadata"
            />
          ) : (
            <img
              src={activeMedia.file_url}
              alt={activeMedia.file_name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Media Type Badge */}
        <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {activeMedia.file_type === 'video' ? (
            <>
              <Film className="h-3 w-3" />
              Video
            </>
          ) : (
            <>
              <ImageIcon className="h-3 w-3" />
              Image
            </>
          )}
        </span>

        {/* Slide Counter */}
        <span className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white">
          {activeIndex + 1} / {media.length}
        </span>

        {/* Navigation Arrows (only if multi-slide) */}
        {media.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-all hover:bg-white/40 focus:ring-2 focus:ring-white/50 active:scale-90"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition-all hover:bg-white/40 focus:ring-2 focus:ring-white/50 active:scale-90"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar (only if multi-slide) */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-200">
          {media.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 transition-all border-2 ${
                index === activeIndex
                  ? 'border-amber-500 scale-[1.02] shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {item.file_type === 'video' ? (
                <div className="relative flex h-full w-full items-center justify-center bg-zinc-950">
                  <Film className="h-5 w-5 text-zinc-400" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.file_url}
                  alt={item.file_name}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
