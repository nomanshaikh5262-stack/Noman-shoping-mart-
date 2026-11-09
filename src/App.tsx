import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/header/Header';
import { HomeView } from './components/home/HomeView';
import { CategoriesView } from './components/categories/CategoriesView';
import { ProductDetailsView } from './components/product/ProductDetailsView';
import { CartView } from './components/cart/CartView';
import { OrdersView } from './components/orders/OrdersView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { QuickViewModal } from './components/product/QuickViewModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { TrackOrderModal } from './components/orders/TrackOrderModal';
import { InvoiceModal } from './components/orders/InvoiceModal';
import { PincodeModal } from './components/common/PincodeModal';
import { AuthModal } from './components/common/AuthModal';
import { Toast } from './components/common/Toast';
import { Sparkles, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, setActiveCategory } = useStore();

  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Main Navigation Header */}
      <Header
        onOpenPincodeModal={() => setIsPincodeModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'categories' && <CategoriesView />}
        {currentView === 'product-detail' && <ProductDetailsView />}
        {currentView === 'cart' && (
          <CartView onProceedToCheckout={() => setIsCheckoutModalOpen(true)} />
        )}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'account' && (
          <AccountView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}
        {currentView === 'wishlist' && (
          <AccountView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-10 px-4 sm:px-8 border-t border-gray-800 pb-20 md:pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">ABOUT</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Contact Us</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">About Us</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Careers</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">SUPER MART Stories</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">HELP</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('account')} className="hover:text-white">Payments</button></li>
              <li><button onClick={() => setCurrentView('orders')} className="hover:text-white">Shipping & Delivery</button></li>
              <li><button onClick={() => setCurrentView('orders')} className="hover:text-white">Cancellation & Returns</button></li>
              <li><button onClick={() => setCurrentView('account')} className="hover:text-white">FAQ</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">CONSUMER POLICY</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-white cursor-pointer">Cancellation & Returns</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms Of Use</span></li>
              <li><span className="hover:text-white cursor-pointer">Security</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">SUPER MART HEADQUARTERS</h4>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              SUPER MART India Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Mumbai, Maharashtra, India - 400051<br />
              CIN: U51109MH2024PTC123456<br />
              Telephone: 044-45614700 / 044-67415800
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <span>SUPER<span className="text-amber-400">MART</span></span>
            <span className="text-gray-500 font-normal">© 2026 SUPER MART. All rights reserved.</span>
          </div>

          <div className="text-gray-400 flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Noman Shop • SuperMart Online Shopping</span>
          </div>
        </div>
      </footer>

      {/* 5-Tab Bottom Navigation Bar (Mobile) */}
      <BottomNavigation />

      {/* The Global Quick View Modal (Available across Home, Categories, Rails) */}
      <QuickViewModal />

      {/* Global Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

      {/* Tracking Modal */}
      <TrackOrderModal />

      {/* Invoice Modal */}
      <InvoiceModal />

      {/* Pincode Selector Modal */}
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
