import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  ChevronDown,
  Package,
  LogOut,
  LayoutDashboard,
  Store,
  X,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  onOpenPincodeModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPincodeModal, onOpenAuthModal }) => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    user,
    logoutUser,
    currentView,
    setCurrentView,
    isAdmin,
    toggleAdminMode,
    pincode,
    products,
    viewProductDetails,
    setActiveCategory
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search suggestions
  const suggestions = searchQuery.trim().length > 1
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('categories');
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] text-white shadow-md">
      {/* Top micro announcement bar */}
      <div className="bg-[#1e5bc2] text-[11px] py-1 px-4 text-center font-medium text-blue-100 flex items-center justify-center gap-3">
        <span>⚡ Super Deals: Extra 20% off with coupon <strong className="text-amber-300">SUPER100</strong></span>
        <span className="hidden sm:inline text-blue-300">•</span>
        <span className="hidden sm:inline">🚀 Free Express Delivery on orders above ₹499</span>
        <span className="hidden sm:inline text-blue-300">•</span>
        <span className="hidden md:inline font-semibold text-yellow-300">🌟 Noman's Official Super Mart</span>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setCurrentView('home');
            setActiveCategory('all');
          }}
          className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
        >
          <div className="bg-amber-400 text-blue-900 w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl shadow-md group-hover:rotate-6 transition-transform">
            S
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              SUPER<span className="text-amber-300">MART</span>
            </span>
            <span className="text-[10px] text-blue-200 font-semibold italic flex items-center gap-1">
              <span>Explore</span>
              <span className="text-amber-300 font-bold">Plus</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
            </span>
          </div>
        </div>

        {/* Pincode Selector (Desktop) */}
        <button
          type="button"
          onClick={onOpenPincodeModal}
          className="hidden lg:flex items-center gap-1.5 bg-blue-700/60 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-100 transition-colors border border-blue-400/30"
          title="Change Delivery Location"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <div className="text-left leading-tight">
            <div className="text-[10px] text-blue-200">Deliver to</div>
            <div className="font-bold text-white text-xs">{pincode} (Mumbai)</div>
          </div>
        </button>

        {/* Search Bar with live autocomplete */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for Products, Brands, Mobiles, Fashion and More..."
              className="w-full bg-white text-gray-900 pl-10 pr-9 py-2 rounded-lg text-xs sm:text-sm font-medium placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              <div className="p-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Suggested Products
              </div>
              <div className="divide-y divide-gray-50">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      viewProductDetails(p);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain rounded bg-white p-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.brand} • in {p.category}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">₹{p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setCurrentView('categories');
                  setIsSearchFocused(false);
                }}
                className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-100"
              >
                <span>View all search results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action icons & buttons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Admin Toggle Switcher */}
          <button
            type="button"
            onClick={toggleAdminMode}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isAdmin
                ? 'bg-amber-400 text-blue-950 hover:bg-amber-300 ring-2 ring-white/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Switch between Customer Store and Admin Panel"
          >
            {isAdmin ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span>Customer View</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Panel</span>
              </>
            )}
          </button>

          {/* User Account Menu */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 bg-white text-blue-700 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="bg-white text-blue-700 font-bold text-xs sm:text-sm px-4 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
            )}

            {/* Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in">
                {/* User Header */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-900">{user.name}</div>
                  <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                    <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{user.superCoins} SuperCoins</span>
                  </div>
                </div>

                <div className="py-1 text-xs font-medium">
                  <button
                    onClick={() => {
                      setCurrentView('orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2.5 text-gray-700"
                  >
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('wishlist');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2.5 text-gray-700"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2.5 text-gray-700"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Profile & Saved Addresses</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleAdminMode();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-2.5 text-amber-700 font-bold border-t border-gray-100"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button (Desktop) */}
          <button
            type="button"
            onClick={() => setCurrentView('wishlist')}
            className="hidden sm:flex items-center gap-1 text-white hover:text-amber-200 p-1.5 rounded-lg transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-amber-200 py-1.5 px-2 sm:px-3 rounded-lg hover:bg-white/10 transition-colors relative font-bold text-xs sm:text-sm"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-blue-950 text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
};
