import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { X, Star, ShieldCheck, ShoppingCart, Zap, Heart, Check, ArrowRight, Truck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    viewProductDetails,
    toggleWishlist,
    isInWishlist,
    setCurrentView
  } = useStore();

  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Sync state when product opens
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImgIdx(0);
      setSelectedColor(quickViewProduct.colors?.[0] || '');
      setSelectedSize(quickViewProduct.sizes?.[0] || '');
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [quickViewProduct]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const savings = (product.originalPrice || product.price) - product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, true);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, false);
    closeQuickView();
    setCurrentView('cart');
  };

  const handleViewFullDetails = () => {
    closeQuickView();
    viewProductDetails(product);
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeQuickView}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors shadow-sm"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50 p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-100">
          {/* Main Photo Preview */}
          <div className="relative w-full aspect-square max-h-72 sm:max-h-80 flex items-center justify-center p-2">
            <img
              src={product.images[selectedImgIdx] || product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
              {product.discountPercentage >= 20 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                  {product.discountPercentage}% OFF
                </span>
              )}
              {product.isAssured && (
                <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Assured
                </span>
              )}
            </div>

            {/* Wishlist Toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                isFavorited ? 'bg-rose-50 text-rose-500' : 'bg-white text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto py-1 max-w-full">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-14 h-14 rounded-lg bg-white p-1 border-2 transition-all shrink-0 ${
                    selectedImgIdx === idx ? 'border-blue-600 shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {/* Delivery & Assurance footnote */}
          <div className="mt-4 pt-3 border-t border-gray-200/70 w-full flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Truck className="w-4 h-4" /> Free Delivery Available
            </span>
            <span>7 Days Replacement</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[60vh] md:max-h-[85vh] flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {product.brand}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1.5 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 my-2.5">
              <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-gray-500">
                {product.reviewCount.toLocaleString()} Ratings & Reviews
              </span>
              <span className="text-xs text-gray-300">|</span>
              {product.stock > 0 ? (
                <span className={`text-xs font-semibold ${product.stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {product.stock <= 5 ? `Hurry, only ${product.stock} left!` : 'In Stock'}
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600">Out of Stock</span>
              )}
            </div>

            {/* Price section */}
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 my-3">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl font-black text-gray-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                <span className="text-sm font-bold text-emerald-600">
                  {product.discountPercentage}% off
                </span>
              </div>
              {savings > 0 && (
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  You save {formatINR(savings)} on this purchase!
                </p>
              )}
            </div>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="my-3">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Color: <span className="text-blue-600 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs ring-1 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="my-3">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Size / Variant: <span className="text-blue-600 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs ring-1 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key highlights bullets */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="my-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Key Highlights</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  {product.highlights.slice(0, 3).map((hl, i) => (
                    <li key={i} className="line-clamp-1">{hl}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 my-3">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-gray-900 border-x border-gray-200 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ff9f00] hover:bg-[#f39700] text-gray-900'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#fb641b] hover:bg-[#e65510] text-white flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Zap className="w-4 h-4 fill-white" /> Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={handleViewFullDetails}
              className="w-full text-center py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Product Details & Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
