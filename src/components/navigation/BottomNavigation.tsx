import React from 'react';
import { useStore, ViewType } from '../../context/StoreContext';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentView, setCurrentView, cartCount, wishlist } = useStore();

  const tabs: Array<{ id: ViewType; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'categories', label: 'Categories', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" />, badge: wishlist.length },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-5 h-5" />, badge: cartCount },
    { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200/80 shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setCurrentView(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center relative transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
