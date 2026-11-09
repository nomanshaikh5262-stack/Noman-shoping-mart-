import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Zap, Clock, Flame, ArrowRight } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { products, setActiveCategory, setCurrentView } = useStore();

  // 4 hours countdown simulation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 3,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale || p.discountPercentage >= 35).slice(0, 4);

  if (!flashProducts.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Live Countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-xs rounded-xl shadow-inner">
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  FLASH SALE
                </h3>
                <span className="bg-amber-400 text-blue-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-rose-600 text-rose-600" /> Super Saver
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">Limited period blockbuster deals ending soon!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-gray-200 font-medium">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-white text-gray-900 px-2 py-0.5 rounded shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-gray-900 px-2 py-0.5 rounded shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-amber-400 text-gray-950 px-2 py-0.5 rounded shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid with Quick View */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {flashProducts.map((product) => (
            <div key={product.id} className="text-gray-900">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Bar */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setCurrentView('categories');
            }}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-xl backdrop-blur-xs transition-colors border border-white/20"
          >
            <span>Explore All Flash Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
