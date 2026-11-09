import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryRow } from './CategoryRow';
import { BannerCarousel } from './BannerCarousel';
import { FlashSale } from './FlashSale';
import { ProductRail } from './ProductRail';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, recentlyViewed, setCurrentView, setActiveCategory } = useStore();

  const trendingProducts = products.filter((p) => p.isTrending);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const dealsOfDay = products.filter((p) => p.isDealOfDay);
  const recommended = products.slice(0, 5);

  return (
    <div className="pb-16 sm:pb-8 space-y-2 sm:space-y-4">
      {/* 1. Category Icons Row */}
      <CategoryRow />

      {/* 2. Promotional Banners Carousel */}
      <BannerCarousel />

      {/* 3. Flash Sale Section with Countdown */}
      <FlashSale />

      {/* 4. Deals of the Day Rail */}
      <ProductRail
        title="Today's Super Deals"
        subtitle="Handpicked blockbusters at unmatched prices"
        badge="DEAL OF THE DAY"
        products={dealsOfDay}
      />

      {/* Mid-page Promotional Callout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-blue-800/40">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-blue-950 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-blue-950" /> Noman Store Exclusive
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Get 20% Extra Off on Your Entire Cart with Code: NOMANMART
            </h3>
            <p className="text-xs sm:text-sm text-blue-200">
              Valid on Electronics, Mobiles, and Luxury Fashion. Free express delivery guaranteed!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setCurrentView('categories');
            }}
            className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
          >
            <span>Claim Discount Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Trending Products Rail */}
      <ProductRail
        title="Trending & Viral Hits"
        subtitle="Top searched and reviewed gadgets this week"
        badge="POPULAR"
        products={trendingProducts}
      />

      {/* 6. Best Sellers Rail */}
      <ProductRail
        title="Best Sellers Across India"
        subtitle="Customer favorites with 4.5+ star ratings"
        badge="BESTSELLER"
        products={bestSellers}
      />

      {/* 7. Recommended for You */}
      <ProductRail
        title="Recommended for You"
        subtitle="Curated according to top trending categories"
        badge="FOR YOU"
        products={recommended}
      />

      {/* 8. Recently Viewed Products (if any) */}
      {recentlyViewed.length > 0 && (
        <ProductRail
          title="Recently Viewed Products"
          subtitle="Pick up right where you left off"
          products={recentlyViewed}
        />
      )}

      {/* Trust & Guarantee Badges Footer */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Genuine</h4>
              <p className="text-[11px] text-gray-500">SuperAssured quality checks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Free Express Delivery</h4>
              <p className="text-[11px] text-gray-500">On all orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">7 Days Easy Return</h4>
              <p className="text-[11px] text-gray-500">Doorstep replacement service</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">24x7 Customer Care</h4>
              <p className="text-[11px] text-gray-500">Dedicated assistance helpline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
