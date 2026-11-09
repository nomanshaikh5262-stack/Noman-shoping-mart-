import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import {
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronDown,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Available brands in current view
  const availableBrands = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') {
      list = list.filter(
        p => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    const brandsSet = new Set(list.map(p => p.brand));
    return Array.from(brandsSet).sort();
  }, [products, activeCategory]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(
        p =>
          p.category.toLowerCase() === activeCategory.toLowerCase() ||
          p.subCategory.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price filter
    list = list.filter(p => p.price <= maxPrice);

    // Rating filter
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter(p => selectedBrands.includes(p.brand));
    }

    // Discount filter
    if (minDiscount > 0) {
      list = list.filter(p => p.discountPercentage >= minDiscount);
    }

    // In stock filter
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting
    if (selectedSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'discount') {
      list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    } else if (selectedSort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [
    products,
    activeCategory,
    searchQuery,
    maxPrice,
    minRating,
    selectedBrands,
    minDiscount,
    inStockOnly,
    selectedSort,
  ]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setMinRating(0);
    setMaxPrice(150000);
    setSelectedBrands([]);
    setMinDiscount(0);
    setInStockOnly(false);
    setSelectedSort('popularity');
    setSearchQuery('');
  };

  const hasActiveFilters =
    minRating > 0 ||
    maxPrice < 150000 ||
    selectedBrands.length > 0 ||
    minDiscount > 0 ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
      {/* Category Pills Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs mb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`text-xs px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.name)}
              className={`text-xs px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Filters (Left) + Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Mobile Filter & Sort Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 bg-gray-100 py-2 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value)}
            className="flex-1 text-xs font-bold text-gray-700 bg-gray-100 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="discount">Highest Discount</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <div
          className={`${
            isMobileFilterOpen
              ? 'fixed inset-0 z-50 bg-black/50 p-4 flex justify-end'
              : 'hidden lg:block'
          }`}
        >
          <div
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6 max-h-[85vh] overflow-y-auto ${
              isMobileFilterOpen ? 'w-full max-w-sm h-full relative' : 'w-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Filters
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                {isMobileFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-800 mb-2">
                <span>Max Price</span>
                <span className="text-blue-600 font-extrabold">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={150000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹500</span>
                <span>₹1,50,000</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Customer Ratings
              </h4>
              <div className="space-y-1.5">
                {[4, 3, 2].map(r => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-blue-600"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(minRating === r ? 0 : r)}
                      className="accent-blue-600"
                    />
                    <span className="flex items-center gap-1 font-semibold">
                      {r}★ & above
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Checkboxes */}
            {availableBrands.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Brands
                </h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {availableBrands.map(brand => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded accent-blue-600"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Discount Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Discount
              </h4>
              <div className="space-y-1.5">
                {[50, 40, 30, 20, 10].map(d => (
                  <label
                    key={d}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-blue-600"
                  >
                    <input
                      type="radio"
                      name="discount"
                      checked={minDiscount === d}
                      onChange={() => setMinDiscount(minDiscount === d ? 0 : d)}
                      className="accent-blue-600"
                    />
                    <span>{d}% or more</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>

            {isMobileFilterOpen && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  Apply Filters ({filteredProducts.length} items)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid Area (3 cols desktop) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Sort Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs text-gray-500">
              Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> items
              {activeCategory !== 'all' && (
                <span> in <strong className="text-blue-600 font-bold">{activeCategory}</strong></span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Sort By:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'popularity', label: 'Popularity' },
                  { id: 'price-asc', label: 'Price -- Low to High' },
                  { id: 'price-desc', label: 'Price -- High to Low' },
                  { id: 'rating', label: 'Rating' },
                  { id: 'discount', label: 'Discount' },
                  { id: 'newest', label: 'Newest' },
                ].map(sortOpt => (
                  <button
                    key={sortOpt.id}
                    type="button"
                    onClick={() => setSelectedSort(sortOpt.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedSort === sortOpt.id
                        ? 'bg-blue-50 text-blue-600 font-bold border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {sortOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-900">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                  {minRating}★ & above
                  <button onClick={() => setMinRating(0)} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="inline-flex items-center gap-1 text-xs bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                  {b}
                  <button onClick={() => handleBrandToggle(b)} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {minDiscount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-white text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                  {minDiscount}%+ Off
                  <button onClick={() => setMinDiscount(0)} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-blue-600 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                No products match your selected filters
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Try loosening your price range or clearing selected brands to discover more items.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
