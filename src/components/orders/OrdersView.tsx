import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  Truck,
  Receipt,
  RotateCcw,
  XCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    cancelOrder,
    returnOrder,
    setTrackOrderModal,
    setInvoiceModal,
    setCurrentView,
    viewProductDetails,
    products
  } = useStore();

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('ALL');
  
  // Cancel / Return Modal state
  const [activeCancelModalOrder, setActiveCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Found a better price elsewhere');
  const [activeReturnModalOrder, setActiveReturnModalOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Defective or damaged product');

  const filteredOrders = orders.filter((order) => {
    // Status tab filter
    if (selectedStatusTab !== 'ALL') {
      if (selectedStatusTab === 'IN_PROGRESS' && (order.orderStatus === 'Placed' || order.orderStatus === 'Packed' || order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery')) {
        // match
      } else if (selectedStatusTab === 'DELIVERED' && order.orderStatus === 'Delivered') {
        // match
      } else if (selectedStatusTab === 'CANCELLED' && (order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned')) {
        // match
      } else {
        return false;
      }
    }

    // Search query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesProduct = order.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchesId || matchesProduct;
    }

    return true;
  });

  const handleCancelSubmit = async () => {
    if (!activeCancelModalOrder) return;
    await cancelOrder(activeCancelModalOrder.id, cancelReason);
    setActiveCancelModalOrder(null);
  };

  const handleReturnSubmit = async () => {
    if (!activeReturnModalOrder) return;
    await returnOrder(activeReturnModalOrder.id, returnReason);
    setActiveReturnModalOrder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your purchases, track shipments, and request replacements
          </p>
        </div>

        {/* Search inside orders */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by order ID or item..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'IN_PROGRESS', label: 'On The Way' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'CANCELLED', label: 'Cancelled & Returned' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedStatusTab(tab.id)}
            className={`text-xs px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedStatusTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';
            const isReturned = order.orderStatus === 'Returned';
            const canCancel = !isDelivered && !isCancelled && !isReturned;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-blue-200 transition-all p-5 overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
                      <span className="font-mono font-black text-gray-900">{order.id}</span>
                    </div>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Placed On</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(order.placedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isCancelled || isReturned
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        isDelivered ? 'bg-emerald-600' : isCancelled || isReturned ? 'bg-rose-600' : 'bg-blue-600 animate-ping'
                      }`} />
                      <span>{order.orderStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 divide-y divide-gray-50">
                  {order.items.map((item, idx) => {
                    const fullProd = products.find((p) => p.id === item.productId);
                    return (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0 cursor-pointer"
                          onClick={() => fullProd && viewProductDetails(fullProd)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => fullProd && viewProductDetails(fullProd)}
                            className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                          >
                            {item.productName}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Qty: {item.quantity} • {item.selectedColor || ''} {item.selectedSize || ''}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              {formatINR(item.price * item.quantity)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatINR(item.originalPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delivery ETA */}
                        <div className="text-right shrink-0 hidden sm:block">
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">
                            {isDelivered ? 'Delivered On' : 'Expected Delivery'}
                          </span>
                          <span className="text-xs font-bold text-gray-900">{order.expectedDeliveryDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Total Paid:</span>
                    <span className="text-sm sm:text-base font-black text-gray-900">
                      {formatINR(order.totalAmount)}
                    </span>
                    <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setTrackOrderModal(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInvoiceModal(order)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-gray-600" />
                      <span>Invoice</span>
                    </button>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setActiveCancelModalOrder(order)}
                        className="text-rose-600 hover:bg-rose-50 font-bold px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {isDelivered && (
                      <button
                        type="button"
                        onClick={() => setActiveReturnModalOrder(order)}
                        className="text-amber-700 hover:bg-amber-50 font-bold px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return / Replace</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders matching this filter yet.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Cancel Order Modal */}
      {activeCancelModalOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-black text-gray-900">Cancel Order #{activeCancelModalOrder.id}?</h3>
            </div>
            <p className="text-xs text-gray-600">
              Please share the reason for cancellation. Any payment deducted will be refunded to your original payment method within 2-4 business days.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Reason for cancellation:</label>
              {[
                'Found a better price elsewhere',
                'Expected delivery time is too long',
                'Ordered by mistake / Change of mind',
                'Need to change delivery address or contact number',
              ].map((r) => (
                <label key={r} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                    className="accent-rose-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveCancelModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {activeReturnModalOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-base font-black text-gray-900">Return / Replacement Request</h3>
            </div>
            <p className="text-xs text-gray-600">
              Our courier executive will arrive at your address within 48 hours for doorstep quality verification and pickup.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Select Issue:</label>
              {[
                'Defective or damaged product',
                'Item does not match product description',
                'Size / fit issue (need different size)',
                'Missing parts or accessories in box',
              ].map((r) => (
                <label key={r} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="return_reason"
                    checked={returnReason === r}
                    onChange={() => setReturnReason(r)}
                    className="accent-amber-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveReturnModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnSubmit}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-blue-950 rounded-lg shadow-sm"
              >
                Schedule Free Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
