import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR, triggerConfetti } from '../../utils/confetti';
import { Address, Order } from '../../types';
import {
  X,
  MapPin,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Plus,
  PackageCheck,
  Receipt,
  Truck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartTotal,
    cartMrp,
    cartDiscount,
    appliedCoupon,
    couponDiscount,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    placeOrder,
    setCurrentView,
    setTrackOrderModal,
    setInvoiceModal,
    showToast
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Address, 2: Summary, 3: Payment, 4: Success
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [upiId, setUpiId] = useState<string>('noman@okaxis');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address form toggle & state
  const [isAddingNewAddr, setIsAddingNewAddr] = useState<boolean>(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    name: 'Noman Shaikh',
    phone: '9876543210',
    pincode: '400001',
    locality: 'Fort, South Mumbai',
    address: 'B-Wing, 4th Floor, Heritage Court, Fort',
    city: 'Mumbai',
    state: 'Maharashtra',
    addressType: 'HOME',
    isDefault: true
  });

  // COD Captcha
  const [captchaCode, setCaptchaCode] = useState<string>('7492');
  const [captchaInput, setCaptchaInput] = useState<string>('');

  if (!isOpen) return null;

  const deliveryCharge = cartTotal > 499 ? 0 : 40;
  const finalPayable = Math.max(0, cartTotal + deliveryCharge - couponDiscount);

  const handleCreateNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.pincode || !newAddr.address) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    addAddress(newAddr);
    setIsAddingNewAddr(false);
  };

  const handleConfirmPayment = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      setStep(1);
      return;
    }

    if (paymentMethod === 'COD' && captchaInput !== captchaCode) {
      showToast('Please enter the correct captcha code', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway handshake
    setTimeout(async () => {
      const result = await placeOrder({
        shippingAddress: selectedAddress,
        paymentMethod
      });

      setIsProcessing(false);

      if (result.success && result.order) {
        setCreatedOrder(result.order);
        setStep(4);
        triggerConfetti();
      } else {
        showToast(result.error || 'Payment failed. Please retry.', 'error');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              {step === 4 ? 'Order Placed Successfully!' : 'SUPER MART Secure Checkout'}
            </h2>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        {step !== 4 && (
          <div className="bg-blue-50/50 px-6 py-3 border-b border-gray-100 flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-700' : 'text-gray-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</span>
              <span>Delivery Address</span>
            </button>
            <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <button
              onClick={() => selectedAddress && setStep(2)}
              className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-700' : 'text-gray-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</span>
              <span>Order Summary</span>
            </button>
            <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <button
              onClick={() => selectedAddress && setStep(3)}
              className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-700' : 'text-gray-400'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</span>
              <span>Payment</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: Address Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Select Delivery Address
                </h3>
                {!isAddingNewAddr && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddr(true)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                )}
              </div>

              {isAddingNewAddr ? (
                <form onSubmit={handleCreateNewAddress} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800">New Address Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="10-digit Mobile Number *"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Locality / Landmark *"
                      value={newAddr.locality}
                      onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                    <div className="sm:col-span-2">
                      <textarea
                        placeholder="Flat, House no., Building, Apartment, Street *"
                        value={newAddr.address}
                        onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                        rows={2}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="City / District *"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
                    >
                      Save & Use Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddr(false)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-900">{addr.name}</span>
                            <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-1.5 py-0.2 rounded uppercase">
                              {addr.addressType}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">{addr.phone}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {addr.address}, {addr.locality}, {addr.city}, {addr.state} -{' '}
                          <strong className="text-gray-900">{addr.pincode}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                  className="bg-[#fb641b] hover:bg-[#e65510] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Continue to Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Order Summary */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Review Your Order Items ({cart.length})
              </h3>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity} • {item.selectedColor || ''} {item.selectedSize || ''}</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Recap */}
              <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon '{appliedCoupon?.code}':</span>
                    <span>- {formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="text-emerald-600 font-bold">{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-900 pt-1 border-t border-gray-200">
                  <span>Total Payable:</span>
                  <span className="text-blue-700">{formatINR(finalPayable)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#fb641b] hover:bg-[#e65510] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Select Payment Mode
              </h3>

              <div className="space-y-3">
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-xs font-black text-gray-900">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                        <p className="text-[11px] text-gray-500">Instant verification with 0% extra fees</p>
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID (e.g. yourname@okhdfcbank)"
                        className="flex-1 text-xs p-2 rounded-lg border border-gray-300 bg-white"
                      />
                      <span className="text-xs font-bold text-emerald-600">Verified ✓</span>
                    </div>
                  )}
                </div>

                {/* Credit/Debit Card */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <div>
                        <span className="text-xs font-black text-gray-900">Credit / Debit Card</span>
                        <p className="text-[11px] text-gray-500">Visa, MasterCard, RuPay, Maestro</p>
                      </div>
                    </div>
                    {paymentMethod === 'CARD' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>

                  {paymentMethod === 'CARD' && (
                    <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number (4532 8900 1234 5678)"
                        defaultValue="4532 8900 1234 5678"
                        className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          defaultValue="08/28"
                          className="text-xs p-2 rounded-lg border border-gray-300 bg-white"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          defaultValue="888"
                          maxLength={3}
                          className="text-xs p-2 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'NET_BANKING' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      <div>
                        <span className="text-xs font-black text-gray-900">Net Banking</span>
                        <p className="text-[11px] text-gray-500">All Indian Banks (HDFC, SBI, ICICI, Axis)</p>
                      </div>
                    </div>
                    {paymentMethod === 'NET_BANKING' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-xs font-black text-gray-900">Cash on Delivery (COD)</span>
                        <p className="text-[11px] text-gray-500">Pay cash or UPI at your doorstep upon arrival</p>
                      </div>
                    </div>
                    {paymentMethod === 'COD' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>

                  {paymentMethod === 'COD' && (
                    <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">Enter code:</span>
                      <span className="bg-gray-200 font-mono font-black text-sm px-3 py-1 rounded tracking-widest text-gray-800 select-none">
                        {captchaCode}
                      </span>
                      <input
                        type="text"
                        maxLength={4}
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Captcha"
                        className="w-24 text-xs font-bold text-center p-1.5 rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">Amount Payable:</span>
                  <div className="text-xl font-black text-blue-700">{formatINR(finalPayable)}</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="bg-[#fb641b] hover:bg-[#e65510] text-white font-black text-xs sm:text-sm px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Confirming...' : `Pay ${formatINR(finalPayable)}`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && createdOrder && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  Payment Successful & Order Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Thank you for shopping at SUPER MART, {createdOrder.customerName}!
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-blue-700">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-gray-900">{formatINR(createdOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-bold text-emerald-600">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Delivery:</span>
                  <span className="font-bold text-blue-600">{createdOrder.expectedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tracking Code:</span>
                  <span className="font-mono font-semibold text-gray-700">{createdOrder.trackingNumber}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTrackOrderModal(createdOrder);
                  }}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Your Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setInvoiceModal(createdOrder);
                  }}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentView('home');
                  }}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-blue-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
