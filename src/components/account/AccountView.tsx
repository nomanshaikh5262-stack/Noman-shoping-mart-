import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { ProductCard } from '../product/ProductCard';
import {
  User,
  MapPin,
  Heart,
  Package,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AccountViewProps {
  onOpenAuthModal: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onOpenAuthModal }) => {
  const {
    user,
    logoutUser,
    loginUser,
    addresses,
    deleteAddress,
    addAddress,
    wishlist,
    products,
    setCurrentView,
    toggleAdminMode,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'wishlist' | 'support' | 'rewards'>('profile');

  // Support chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello Noman! Welcome to SUPER MART Customer Care. How can I assist you with your order, return, or payment today?',
      time: '10:00 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Add address modal
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || 'Noman Shaikh',
    phone: user?.phone || '9876543210',
    pincode: '400001',
    locality: 'Fort',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    addressType: 'HOME' as 'HOME' | 'WORK',
    isDefault: false
  });

  // Profile Edit
  const [editName, setEditName] = useState<string>(user?.name || '');
  const [editPhone, setEditPhone] = useState<string>(user?.phone || '');

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');

    setTimeout(() => {
      let botResponse = "I've checked your account details. Your recent orders are in good standing with SuperMart Express delivery. Is there anything specific regarding tracking or refunds you'd like to check?";
      const lower = userText.toLowerCase();
      if (lower.includes('refund') || lower.includes('return')) {
        botResponse = 'For returns, simply go to "My Orders" tab and click "Return / Replace". Our courier will pick up within 48 hours and instant refund is credited!';
      } else if (lower.includes('delivery') || lower.includes('late') || lower.includes('track')) {
        botResponse = 'You can track real-time shipment updates directly from "My Orders" using the "Track Shipment" button.';
      } else if (lower.includes('coupon') || lower.includes('discount')) {
        botResponse = 'Use code SUPER100 for 15% off up to ₹500, or NOMANMART for 20% off on special items!';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      loginUser(user.email, editName);
      showToast('Profile information updated successfully!', 'success');
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddAddressModal(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-gray-100 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign In to SUPER MART</h2>
        <p className="text-xs text-gray-500">
          Access your orders, saved addresses, wishlist, and SuperCoins rewards.
        </p>
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Navigation Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Hello,</span>
              <h2 className="text-base font-black text-gray-900 truncate">{user.name}</h2>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* SuperCoins Banner */}
          <div
            onClick={() => setActiveTab('rewards')}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-blue-950 p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/30 backdrop-blur-xs rounded-xl">
                <Sparkles className="w-6 h-6 fill-blue-950" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">SuperCoins Balance</span>
                <span className="text-xl font-black">{user.superCoins} Coins</span>
              </div>
            </div>
            <span className="text-xs font-bold underline">Redeem</span>
          </div>

          {/* Menu items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'addresses' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Manage Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className="w-full text-left p-3.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span>My Orders & History</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'wishlist' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>My Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                activeTab === 'support' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Customer Support & Live Chat</span>
            </button>

            <button
              onClick={toggleAdminMode}
              className="w-full text-left p-3.5 flex items-center gap-3 text-amber-700 font-bold hover:bg-amber-50 transition-colors bg-amber-50/40"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-600" />
              <span>SUPER MART Admin Dashboard</span>
            </button>

            <button
              onClick={logoutUser}
              className="w-full text-left p-3.5 flex items-center gap-3 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Side Content Panel (8 cols) */}
        <div className="lg:col-span-8">
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
              <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
                Personal Information
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Verified email address</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Gender</label>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="gender" defaultChecked className="accent-blue-600" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="gender" className="accent-blue-600" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Account Deactivation Footnote */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Need to delete your account?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? All orders and SuperCoins will be cleared.')) {
                      logoutUser();
                      showToast('Account closed successfully', 'info');
                    }
                  }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-black text-gray-900">Saved Addresses</h3>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-gray-200 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">{addr.name}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-bold uppercase">
                          {addr.addressType}
                        </span>
                        <span className="text-xs font-semibold text-gray-600">{addr.phone}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Address Dialog */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <form onSubmit={handleAddAddressSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-3">
                    <h4 className="text-sm font-black text-gray-900">Add New Delivery Address</h4>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="10-digit Phone"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 400001)"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Locality"
                      value={newAddr.locality}
                      onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      required
                    />
                    <textarea
                      placeholder="Flat, Building, Street"
                      value={newAddr.address}
                      onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      rows={2}
                      required
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
              <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>My Saved Wishlist ({wishlistProducts.length})</span>
              </h3>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">Your wishlist is empty</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Explore products and tap the heart icon to save items for later!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Customer Support & Live Chat */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>24x7 Customer Support Assistant</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Instant help with returns, refunds, order tracking, and payments
                </p>
              </div>

              {/* Chat Container */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 h-80 overflow-y-auto space-y-3 flex flex-col">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white self-end rounded-br-none'
                        : 'bg-white text-gray-800 self-start rounded-bl-none shadow-xs border border-gray-100'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about your order, return, or refund..."
                  className="flex-1 text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* FAQ Quick Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Frequently Asked Questions:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'How do I cancel my order?',
                    'Where is my refund credited?',
                    'What is SuperMart 7-Day Replacement?',
                    'How to apply coupons?',
                  ].map((faq) => (
                    <button
                      key={faq}
                      type="button"
                      onClick={() => setChatInput(faq)}
                      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SuperCoins Rewards */}
          {activeTab === 'rewards' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>SuperCoins Rewards Pass</span>
                </h3>
                <span className="text-sm font-black text-amber-600">{user.superCoins} Coins Available</span>
              </div>

              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded-full uppercase">
                    Plus Member
                  </span>
                  <h4 className="text-lg font-black">Earn 2 SuperCoins on every ₹100 spent!</h4>
                  <p className="text-xs text-blue-200 max-w-sm">
                    Redeem your SuperCoins for instant bill discounts, flight vouchers, and streaming passes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-1 text-xs">
                  <span className="font-bold text-gray-900">₹100 Flat Voucher</span>
                  <p className="text-gray-500">Redeem with 100 SuperCoins on your next cart</p>
                  <button className="mt-2 text-xs font-bold text-blue-600 hover:underline block">
                    Redeem Voucher →
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-1 text-xs">
                  <span className="font-bold text-gray-900">Free 3-Month OTT Pass</span>
                  <p className="text-gray-500">Redeem with 250 SuperCoins</p>
                  <button className="mt-2 text-xs font-bold text-blue-600 hover:underline block">
                    Claim Pass →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
