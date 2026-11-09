import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { Star, Heart, ShoppingBag, Eye, ShieldCheck, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    viewProductDetails,
    openQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top badges & Wishlist */}
      <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-3 overflow-hidden cursor-pointer"
        onClick={() => viewProductDetails(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.discountPercentage >= 30 && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isDealOfDay && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-white" /> DEAL
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label="Wishlist"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 scale-105'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-blue-600 text-gray-800 hover:text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/80 hover:border-blue-600 flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-grow cursor-pointer" onClick={() => viewProductDetails(product)}>
        {/* Brand & Assured */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase truncate">
            {product.brand}
          </span>
          {product.isAssured && (
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-blue-200/60" title="SUPER MART Assured Quality">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Assured</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1.5 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            <span>{product.rating}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
          <span className="text-[11px] text-gray-400">
            ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-baseline gap-2 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
          <span className="text-xs font-bold text-emerald-600">
            {product.discountPercentage}% off
          </span>
        </div>

        {/* Free Delivery Tag */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span className="text-emerald-700 font-medium">Free Delivery</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, undefined, undefined, true);
            }}
            className="sm:hidden text-blue-600 hover:text-blue-800 p-1 rounded-md"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Quick View Action Strip */}
      <div className="sm:hidden border-t border-gray-100 flex items-center divide-x divide-gray-100 bg-gray-50/70">
        <button
          type="button"
          onClick={() => openQuickView(product)}
          className="flex-1 py-1.5 text-[11px] font-semibold text-gray-600 flex items-center justify-center gap-1 hover:bg-gray-100"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" /> Quick View
        </button>
        <button
          type="button"
          onClick={() => addToCart(product, 1, undefined, undefined, true)}
          className="flex-1 py-1.5 text-[11px] font-bold text-amber-600 flex items-center justify-center gap-1 hover:bg-amber-50"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> + Cart
        </button>
      </div>
    </div>
  );
};
