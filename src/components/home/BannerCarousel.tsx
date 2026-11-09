import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const { banners, setActiveCategory, setCurrentView } = useStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[currentIndex] || banners[0];

  const handleCtaClick = (category: string) => {
    setActiveCategory(category);
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-2 sm:px-6 pt-3 sm:pt-4">
      <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[21/9] sm:aspect-[24/8] min-h-[170px] max-h-[340px]">
        {/* Background gradient & Image */}
        <div className={`absolute inset-0 bg-gradient-to-r ${current.bgColor} transition-colors duration-700`}>
          <img
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover mix-blend-overlay opacity-40 transition-opacity duration-700"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-blue-950 text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full w-fit shadow-md mb-2">
            <Sparkles className="w-3 h-3 fill-blue-950" />
            <span>{current.badge}</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-blue-100 font-medium mt-1 line-clamp-2 max-w-lg drop-shadow">
            {current.subtitle}
          </p>

          <div className="mt-3 sm:mt-5">
            <button
              type="button"
              onClick={() => handleCtaClick(current.category)}
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-amber-400 shadow-md' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
