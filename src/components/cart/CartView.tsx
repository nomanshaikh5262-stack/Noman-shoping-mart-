import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Tag,
  ArrowRight,
  CheckCircle2,
  X,
  Truck,
  Sparkles,
  Lock
} from 'lucide-react';

interface CartViewProps {
  onProceedToCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    cartMrp,
    cartDiscount,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    coupons,
    setCurrentView,
    pincode,
  } = useStore();

  const [couponInput, setCouponInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const deliveryCharge = cartTotal > 499 ? 0 : 40;
  const finalPayable = Math.max(0, cartTotal + deliveryCharge - couponDiscount);
  const totalSavings = cartDiscount + couponDiscount + (cartTotal > 499 ? 40 : 0);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(code);
    setIsApplying(false);

    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Explore our super deals, bestsellers, and latest collections to add items to your cart.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-6 bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>Shopping Cart</span>
          <span className="text-sm font-semibold text-gray-400">({cartCount} items)</span>
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Delivery PIN Code banner */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex items-center justify-between text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Deliver to: <strong className="font-bold text-gray-900">Noman - {pincode}</strong></span>
            </div>
            <span className="text-emerald-700 font-bold">Standard Delivery: Free</span>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {cart.map((item) => {
              const product = item.product;
              return (
                <div key={`${product.id}-${item.selectedColor}-${item.selectedSize}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                  {/* Photo */}
                  <div className="w-20 sm:w-28 aspect-square bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-0.5">
                          {product.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant tags */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {item.selectedColor && (
                        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                          Color: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {product.isAssured && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-blue-600" /> Assured
                        </span>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-gray-900">
                          {formatINR(product.price * item.quantity)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatINR(product.originalPrice * item.quantity)}
                          </span>
                        )}
                        <span className="text-xs font-bold text-emerald-600">
                          {product.discountPercentage}% off
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, item.quantity - 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-8 text-center border-x border-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, item.quantity + 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security footnote */}
          <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safe and Secure Payments. Easy 7-day returns. 100% Authentic products.</span>
          </div>
        </div>

        {/* Right: Coupon & Price Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                Coupons & Offers
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon '{appliedCoupon.code}' Applied!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    You saved {formatINR(couponDiscount)} with this code
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 text-xs font-bold uppercase px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplying || !couponInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600 font-medium mt-1.5">{couponError}</p>
                )}

                {/* Available Quick Coupons */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Available Promo Codes:
                  </span>
                  <div className="space-y-1.5">
                    {coupons.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => handleApplyCoupon(c.code)}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="text-xs font-black text-blue-700">{c.code}</span>
                          <p className="text-[10px] text-gray-500 leading-tight">{c.description}</p>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 hover:underline">
                          Tap to Apply
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Price Details
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total MRP ({cartCount} items)</span>
                <span>{formatINR(cartMrp)}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount on MRP</span>
                <span>- {formatINR(cartDiscount)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatINR(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>{formatINR(deliveryCharge)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline font-black text-base sm:text-lg text-gray-900">
              <span>Total Payable</span>
              <span className="text-xl sm:text-2xl text-blue-700">{formatINR(finalPayable)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2.5 rounded-xl text-center border border-emerald-100">
                You will save {formatINR(totalSavings)} on this order! 🎉
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full bg-[#fb641b] hover:bg-[#e65510] text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
