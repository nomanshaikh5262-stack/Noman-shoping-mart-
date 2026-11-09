import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceModal, setInvoiceModal } = useStore();

  if (!invoiceModal) return null;

  const order = invoiceModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9996] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Top Control Bar */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Tax Invoice Slip</span>
            <span className="text-xs text-gray-400">#{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setInvoiceModal(null)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto max-h-[82vh] text-gray-800 text-xs font-sans space-y-6 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-5">
            <div>
              <div className="text-xl font-black tracking-tight text-blue-700 flex items-center gap-1">
                SUPER<span className="text-amber-500">MART</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                SuperMart Retail India Pvt. Ltd.<br />
                Plot 14, BKC Cyber Hub, Mumbai, MH - 400051<br />
                GSTIN: 27AABCS1429P1Z8 • PAN: AABCS1429P
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase text-gray-900">Tax Invoice / Bill of Supply</span>
              <p className="text-[11px] text-gray-600 font-mono mt-0.5">Invoice No: INV-{order.id.slice(2)}</p>
              <p className="text-[11px] text-gray-500">Date: {new Date(order.placedAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-5">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Sold By:</span>
              <p className="font-bold text-gray-900">SuperMart Authorized Retail Fulfillment</p>
              <p className="text-gray-600">CIN: U51909MH2024PTC392810</p>
              <p className="text-gray-600">State: Maharashtra (Code: 27)</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Billing & Shipping To:</span>
              <p className="font-bold text-gray-900">{order.customerName}</p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.locality}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-gray-600">Phone: {order.customerPhone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 bg-gray-50">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Product Description</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Gross MRP</th>
                  <th className="py-2 px-2 text-right">Discount</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-2.5 px-2 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-medium">
                      <div className="font-bold text-gray-900">{it.productName}</div>
                      <div className="text-[10px] text-gray-500">{it.selectedColor || ''} {it.selectedSize || ''}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center">{it.quantity}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-gray-500">{formatINR(it.originalPrice * it.quantity)}</td>
                    <td className="py-2.5 px-2 text-right text-emerald-600 font-mono">
                      - {formatINR((it.originalPrice - it.price) * it.quantity)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-gray-900 font-mono">
                      {formatINR(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t-2 border-gray-800 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross MRP:</span>
                <span className="font-mono">{formatINR(order.totalMrp)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Product Savings:</span>
                <span className="font-mono">- {formatINR(order.discountAmount)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span className="font-mono">- {formatINR(order.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping & Delivery:</span>
                <span className="font-mono">{order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="font-mono text-blue-700 text-base">{formatINR(order.totalAmount)}</span>
              </div>
              <div className="text-[10px] text-gray-400 text-right">
                Payment Mode: <strong className="text-gray-700">{order.paymentMethod}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="border-t border-gray-200 pt-4 text-[10px] text-gray-400 space-y-1">
            <p>Declaration: This is a computer-generated tax invoice and requires no physical signature.</p>
            <p>SUPER MART Assured 100% Genuine Products Guarantee with 7-Day Return & Replacement Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
