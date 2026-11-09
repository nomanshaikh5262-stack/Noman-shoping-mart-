import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ProductRailProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  filterCategory?: string;
}

export const ProductRail: React.FC<ProductRailProps> = ({
  title,
  subtitle,
  badge,
  products,
  filterCategory,
}) => {
  const { setActiveCategory, setCurrentView } = useStore();

  if (!products || products.length === 0) return null;

  const handleViewAll = () => {
    if (filterCategory) {
      setActiveCategory(filterCategory);
    }
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-6 py-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs">
        {/* Rail Header */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-black text-gray-900 tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors p-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
