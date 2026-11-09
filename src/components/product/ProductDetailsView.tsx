import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { ProductRail } from '../home/ProductRail';
import {
  Star,
  ShieldCheck,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock,
  ThumbsUp,
  Share2
} from 'lucide-react';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    pincode,
    showToast
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct?.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedProduct?.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [pinInput, setPinInput] = useState<string>(pincode || '400001');
  const [pinChecked, setPinChecked] = useState<boolean>(true);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const product = selectedProduct;
  const isFavorited = isInWishlist(product.id);
  const savings = (product.originalPrice || product.price) - product.price;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, false);
    setCurrentView('cart');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setCurrentView('home')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => setCurrentView('categories')} className="hover:text-blue-600">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] pb-2 sm:pb-0 w-full sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 p-1 border-2 transition-all shrink-0 ${
                    activeImageIdx === idx ? 'border-blue-600 shadow-md ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-square bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-100 overflow-hidden w-full">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300 hover:scale-110 cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              {product.discountPercentage >= 15 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                  {product.discountPercentage}% OFF
                </span>
              )}
              {product.isAssured && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> SuperAssured
                </span>
              )}
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full shadow-md transition-colors ${
                  isFavorited ? 'bg-rose-50 text-rose-500' : 'bg-white text-gray-400 hover:text-rose-500'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white shadow-md text-gray-400 hover:text-blue-600 transition-colors"
                title="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Brand & Title */}
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Category: {product.category} • {product.subCategory}</p>

            {/* Ratings & Reviews Breakdown */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                <span>{product.rating}</span>
                <Star className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {product.reviewCount.toLocaleString()} Ratings & Reviews
              </span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs font-bold text-emerald-700">100% Genuine Product</span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-gray-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              <span className="text-base font-bold text-emerald-600">
                {product.discountPercentage}% off
              </span>
            </div>
            {savings > 0 && (
              <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>You save {formatINR(savings)} on this deal!</span>
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Available Bank & Coupon Offers */}
          <div className="py-4 border-b border-gray-100 space-y-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Available Offers
            </h3>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">Bank Offer:</span>
                <span>5% Unlimited Cashback on SuperMart Axis Bank Credit Card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">Special Price:</span>
                <span>Get extra 15% off using coupon <strong className="text-blue-700">SUPER100</strong> at checkout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">Partner Offer:</span>
                <span>Sign up for SuperMart Pay Later and get ₹500 welcome voucher.</span>
              </li>
            </ul>
          </div>

          {/* Color & Size Selectors */}
          <div className="py-4 border-b border-gray-100 space-y-4">
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Color: <span className="text-blue-600 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Size / Storage / Variant: <span className="text-blue-600 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-gray-900 border-x border-gray-200 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} items remaining!`}
              </span>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Delivery Options
            </h3>
            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => {
                  if (pinInput.length === 6) {
                    setPinChecked(true);
                    showToast(`Delivery available to ${pinInput}!`, 'success');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Check
              </button>
            </div>
            {pinChecked && (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivery by Tomorrow, 10:00 AM • Free ₹40 saved</span>
                </p>
                <p className="text-gray-500">Cash on Delivery available • 7 Days Replacement Policy</p>
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="pt-6 grid grid-cols-2 gap-4 sticky bottom-16 sm:bottom-0 bg-white py-3 sm:py-0 border-t sm:border-t-0 border-gray-100">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="py-3.5 px-6 rounded-xl font-bold text-sm bg-[#ff9f00] hover:bg-[#f39700] text-gray-900 shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="py-3.5 px-6 rounded-xl font-bold text-sm bg-[#fb641b] hover:bg-[#e65510] text-white shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Table & Description */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Product Details & Specifications
        </h3>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications grid */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">General Specifications</h4>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs sm:text-sm">
                  <span className="font-semibold text-gray-500">{key}</span>
                  <span className="sm:col-span-2 text-gray-900 font-medium">{val}</span>
                </div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs sm:text-sm bg-gray-50/50">
                <span className="font-semibold text-gray-500">Seller</span>
                <span className="sm:col-span-2 text-blue-600 font-bold">{product.seller}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs sm:text-sm bg-gray-50/50">
                <span className="font-semibold text-gray-500">Warranty</span>
                <span className="sm:col-span-2 text-gray-900 font-medium">{product.warranty}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verified Reviews Section */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">Ratings & Verified Buyer Reviews</h3>
            <p className="text-xs text-gray-500">Real feedback from genuine SuperMart shoppers</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="text-lg font-black">{product.rating}</span>
            <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span className="text-xs font-semibold">({product.reviewCount} total)</span>
          </div>
        </div>

        {/* Sample verified review */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  5 <Star className="w-2.5 h-2.5 fill-white" />
                </span>
                <h5 className="text-xs font-bold text-gray-900">Terrific purchase! Exceeded expectations</h5>
              </div>
              <span className="text-[11px] text-gray-400">Verified Buyer • 2 days ago</span>
            </div>
            <p className="text-xs text-gray-600">
              Delivered within 24 hours in sealed packaging. Quality is 100% genuine and performance is lightning fast. Highly recommended!
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
              <span>Noman S., Mumbai</span>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsUp className="w-3 h-3" /> Helpful (142)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Rail */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <ProductRail
            title="Customers Also Viewed"
            subtitle={`More popular picks in ${product.category}`}
            products={relatedProducts}
            filterCategory={product.category}
          />
        </div>
      )}
    </div>
  );
};
