import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Smartphone,
  Laptop,
  Shirt,
  User,
  Sparkles,
  Baby,
  Armchair,
  UtensilsCrossed,
  Heart,
  ShoppingBag,
  Footprints,
  LayoutGrid
} from 'lucide-react';

export const CategoryRow: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, setCurrentView } = useStore();

  const iconMap: Record<string, React.ReactNode> = {
    Smartphone: <Smartphone className="w-6 h-6" />,
    Laptop: <Laptop className="w-6 h-6" />,
    Shirt: <Shirt className="w-6 h-6" />,
    User: <User className="w-6 h-6" />,
    Sparkles: <Sparkles className="w-6 h-6" />,
    Baby: <Baby className="w-6 h-6" />,
    Armchair: <Armchair className="w-6 h-6" />,
    UtensilsCrossed: <UtensilsCrossed className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
    ShoppingBag: <ShoppingBag className="w-6 h-6" />,
    Footprints: <Footprints className="w-6 h-6" />,
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3">
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          {/* All Categories Pill */}
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className={`flex flex-col items-center min-w-[70px] sm:min-w-[80px] group transition-all shrink-0 ${
              activeCategory === 'all' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-blue-200 shadow-md scale-105'
                  : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-105'
              }`}
            >
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs mt-1.5 font-semibold text-center whitespace-nowrap">
              All Items
            </span>
          </button>

          {/* Categories */}
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center min-w-[76px] sm:min-w-[88px] group transition-all shrink-0 relative ${
                  isActive ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {/* Badge */}
                {cat.badge && (
                  <span className="absolute -top-1.5 right-1 z-10 bg-amber-400 text-blue-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs border border-white">
                    {cat.badge}
                  </span>
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-200 shadow-md scale-105'
                      : 'bg-gray-100/80 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-105'
                  }`}
                >
                  {iconMap[cat.icon] || <Sparkles className="w-6 h-6" />}
                </div>

                <span className="text-[11px] sm:text-xs mt-1.5 font-medium group-hover:font-semibold text-center whitespace-nowrap line-clamp-1 max-w-[84px]">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
