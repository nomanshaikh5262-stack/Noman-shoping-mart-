import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { X, Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';

export const TrackOrderModal: React.FC = () => {
  const { trackOrderModal, setTrackOrderModal } = useStore();

  if (!trackOrderModal) return null;

  const order = trackOrderModal;
  const isCancelled = order.orderStatus === 'Cancelled';
  const isReturned = order.orderStatus === 'Returned';

  return (
    <div className="fixed inset-0 z-[9996] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-black">Shipment Tracking</h2>
              <p className="text-[11px] text-blue-100 font-mono">AWB: {order.trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setTrackOrderModal(null)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {/* Top Status Card */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black">Courier Partner</span>
              <p className="text-xs sm:text-sm font-bold text-gray-900">{order.courierPartner}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase font-black">Expected Arrival</span>
              <p className="text-xs sm:text-sm font-black text-blue-700">{order.expectedDeliveryDate}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">Destination Address:</span>
              <p className="text-gray-600 mt-0.5">
                {order.shippingAddress.name} ({order.shippingAddress.phone})<br />
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Tracking Stepper Timeline */}
          {isCancelled ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <span className="font-bold block text-sm">Order Cancelled</span>
              <p className="mt-1">Reason: {order.cancelReason || 'Customer requested cancellation'}</p>
              <p className="mt-1 text-[11px] text-rose-600">Refund reference initiated to original account.</p>
            </div>
          ) : isReturned ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <span className="font-bold block text-sm">Return Pickup Scheduled</span>
              <p className="mt-1">Reason: {order.returnReason}</p>
              <p className="mt-1 text-[11px] text-amber-700">Pickup agent assigned. Doorstep inspection underway.</p>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4">
                Activity Timeline
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {order.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle icon */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                          : step.current
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="ml-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`text-xs font-bold ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Summary in shipment */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700 block mb-2">Package Contents:</span>
            <div className="space-y-2">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <img src={it.productImage} alt={it.productName} className="w-10 h-10 object-contain rounded bg-gray-50 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{it.productName}</p>
                    <p className="text-[11px] text-gray-400">Qty: {it.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatINR(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={() => setTrackOrderModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2 rounded-xl"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
