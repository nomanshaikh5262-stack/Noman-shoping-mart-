import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, Address, Coupon, PromoBanner, OrderStatus } from '../types';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_COUPONS, INITIAL_ADDRESSES, INITIAL_ORDERS } from '../data/initialData';

export type ViewType = 'home' | 'categories' | 'wishlist' | 'cart' | 'account' | 'orders' | 'product-detail' | 'admin';

interface StoreContextType {
  products: Product[];
  banners: PromoBanner[];
  coupons: Coupon[];
  categories: typeof CATEGORIES;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProduct: Product | null;
  viewProductDetails: (product: Product) => void;
  
  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string, notify?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartMrp: number;
  cartDiscount: number;
  
  // Coupons
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    shippingAddress: Address;
    paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING';
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  cancelOrder: (orderId: string, reason: string) => Promise<boolean>;
  returnOrder: (orderId: string, reason: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  
  // Modals
  trackOrderModal: Order | null;
  setTrackOrderModal: (order: Order | null) => void;
  invoiceModal: Order | null;
  setInvoiceModal: (order: Order | null) => void;
  
  // User Profile & Auth
  user: UserProfile | null;
  loginUser: (identifier: string, name?: string) => void;
  logoutUser: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  
  // Admin Mode
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toggleAdminMode: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addBanner: (banner: Omit<PromoBanner, 'id'>) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
  addCoupon: (coupon: Coupon) => Promise<boolean>;
  
  // Toast & Utilities
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  recentlyViewed: Product[];
  pincode: string;
  setPincode: (pin: string) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<PromoBanner[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('supermart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('supermart_wishlist');
      return saved ? JSON.parse(saved) : ['prod-mob-1', 'prod-shoe-1'];
    } catch {
      return ['prod-mob-1', 'prod-shoe-1'];
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('supermart_user');
      return saved ? JSON.parse(saved) : {
        id: 'user-noman-1',
        name: 'Noman Shaikh',
        email: 'nomanshaikh5262@gmail.com',
        phone: '9876543210',
        gender: 'MALE',
        superCoins: 350,
        addresses: INITIAL_ADDRESSES,
        role: 'CUSTOMER'
      };
    } catch {
      return null;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(INITIAL_ADDRESSES[0] || null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [trackOrderModal, setTrackOrderModal] = useState<Order | null>(null);
  const [invoiceModal, setInvoiceModal] = useState<Order | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('400001');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('supermart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('supermart_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('supermart_user', JSON.stringify(user));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Load from API on mount
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [resProd, resBanners, resCoupons, resOrders] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/banners').catch(() => null),
        fetch('/api/coupons').catch(() => null),
        fetch('/api/orders').catch(() => null),
      ]);

      if (resProd && resProd.ok) {
        const data = await resProd.json();
        if (data.products?.length) setProducts(data.products);
      }
      if (resBanners && resBanners.ok) {
        const data = await resBanners.json();
        if (data.banners?.length) setBanners(data.banners);
      }
      if (resCoupons && resCoupons.ok) {
        const data = await resCoupons.json();
        if (data.coupons?.length) setCoupons(data.coupons);
      }
      if (resOrders && resOrders.ok) {
        const data = await resOrders.json();
        if (data.orders?.length) setOrders(data.orders);
      }
    } catch (err) {
      console.warn('API sync fallback to local memory state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3000);
  };

  // Quick View Modal
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Full product detail view
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string,
    notify = true
  ) => {
    setCart(prev => {
      const color = selectedColor || product.colors?.[0];
      const size = selectedSize || product.sizes?.[0];
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    if (notify) {
      showToast(`Added "${product.name.slice(0, 28)}..." to cart!`, 'success');
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartMrp = cart.reduce(
    (acc, item) => acc + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const cartDiscount = cartMrp - cartTotal;

  // Coupon application
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.toUpperCase().trim();
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, cartTotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
        showToast(`Coupon ${cleanCode} applied! Saved ₹${data.discount}`, 'success');
        return { success: true, message: `Saved ₹${data.discount} with ${cleanCode}!` };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch {
      // Local fallback
      const found = coupons.find(c => c.code === cleanCode && c.active);
      if (!found) {
        return { success: false, message: 'Invalid or inactive coupon' };
      }
      if (cartTotal < found.minOrderValue) {
        return {
          success: false,
          message: `Add ₹${found.minOrderValue - cartTotal} more to use ${cleanCode}`,
        };
      }
      const disc = Math.min(Math.round((cartTotal * found.discountPercent) / 100), found.maxDiscount);
      setAppliedCoupon(found);
      setCouponDiscount(disc);
      showToast(`Coupon ${cleanCode} applied! Saved ₹${disc}`, 'success');
      return { success: true, message: `Saved ₹${disc} with ${cleanCode}!` };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Address
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    if (newAddr.isDefault || !selectedAddress) {
      setSelectedAddress(newAddr);
    }
    showToast('Delivery address saved successfully', 'success');
  };

  const deleteAddress = (id: string) => {
    const filtered = addresses.filter(a => a.id !== id);
    setAddresses(filtered);
    if (selectedAddress?.id === id) {
      setSelectedAddress(filtered[0] || null);
    }
    showToast('Address removed', 'info');
  };

  // Order Placement
  const placeOrder = async (orderPayload: {
    shippingAddress: Address;
    paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING';
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (!cart.length) {
      return { success: false, error: 'Cart is empty' };
    }

    const items = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      price: item.product.price,
      originalPrice: item.product.originalPrice || item.product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    }));

    const payload = {
      items,
      customerName: user?.name || orderPayload.shippingAddress.name,
      customerEmail: user?.email || 'customer@supermart.com',
      customerPhone: user?.phone || orderPayload.shippingAddress.phone,
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod,
      couponCode: appliedCoupon?.code,
      couponDiscount,
      userId: user?.id || 'guest',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev]);
        clearCart();
        // Give 25 SuperCoins for placing order
        if (user) {
          setUser(prev => (prev ? { ...prev, superCoins: prev.superCoins + 25 } : null));
        }
        return { success: true, order: data.order };
      }
      return { success: false, error: data.error || 'Failed to place order' };
    } catch {
      // Local creation fallback
      const now = new Date();
      const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
      const deliveryFormatted = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const deliveryCharge = cartTotal > 499 ? 0 : 40;
      const finalAmount = Math.max(0, cartTotal + deliveryCharge - couponDiscount);

      const localOrder: Order = {
        id: `OD${Date.now().toString().slice(-9)}`,
        userId: user?.id || 'guest',
        customerName: user?.name || orderPayload.shippingAddress.name,
        customerEmail: user?.email || 'customer@supermart.com',
        customerPhone: user?.phone || orderPayload.shippingAddress.phone,
        items,
        totalAmount: finalAmount,
        totalMrp: cartMrp,
        discountAmount: cartMrp - cartTotal,
        couponDiscount,
        couponCode: appliedCoupon?.code,
        deliveryCharge,
        shippingAddress: orderPayload.shippingAddress,
        paymentMethod: orderPayload.paymentMethod,
        paymentStatus: orderPayload.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'Placed',
        placedAt: now.toISOString(),
        expectedDeliveryDate: deliveryFormatted,
        trackingNumber: `SM-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        courierPartner: 'SuperMart Express Logistics',
        trackingTimeline: [
          {
            status: 'Placed',
            title: 'Order Placed & Verified',
            description: `Payment confirmed via ${orderPayload.paymentMethod}`,
            timestamp: now.toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            completed: true,
            current: true,
          },
          {
            status: 'Packed',
            title: 'Packed & Quality Verified',
            description: 'Item will be securely packed in Mumbai Fulfillment Center',
            timestamp: 'Expected within 24 hours',
            completed: false,
            current: false,
          },
          {
            status: 'Shipped',
            title: 'In-Transit',
            description: 'Shipment dispatched with courier partner',
            timestamp: 'Expected soon',
            completed: false,
            current: false,
          },
          {
            status: 'Out for Delivery',
            title: 'Out for Delivery',
            description: 'Delivery associate will call prior to delivery',
            timestamp: `Expected ${deliveryFormatted}`,
            completed: false,
            current: false,
          },
          {
            status: 'Delivered',
            title: 'Delivered',
            description: 'Package delivered safely',
            timestamp: `By ${deliveryFormatted}`,
            completed: false,
            current: false,
          },
        ],
      };

      setOrders(prev => [localOrder, ...prev]);
      clearCart();
      return { success: true, order: localOrder };
    }
  };

  const cancelOrder = async (orderId: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        showToast('Order cancelled successfully. Refund initiated if prepaid.', 'info');
        return true;
      }
    } catch {
      // Local fallback
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: 'Cancelled' as OrderStatus,
                cancelReason: reason,
                cancelledAt: new Date().toISOString(),
                paymentStatus: o.paymentStatus === 'PAID' ? 'REFUNDED' : o.paymentStatus,
              }
            : o
        )
      );
      showToast('Order cancelled successfully', 'info');
      return true;
    }
    return false;
  };

  const returnOrder = async (orderId: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        showToast('Return pickup request scheduled!', 'success');
        return true;
      }
    } catch {
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, orderStatus: 'Returned' as OrderStatus, returnReason: reason, paymentStatus: 'REFUNDED' }
            : o
        )
      );
      showToast('Return request submitted!', 'success');
      return true;
    }
    return false;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        showToast(`Order status updated to "${status}"`, 'success');
        return true;
      }
    } catch {
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, orderStatus: status } : o)));
      showToast(`Status updated to ${status}`, 'success');
      return true;
    }
    return false;
  };

  // Admin Actions
  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
    if (!isAdmin) {
      setCurrentView('admin');
      showToast('Switched to SUPER MART Admin Dashboard', 'info');
    } else {
      setCurrentView('home');
      showToast('Returned to Customer Store', 'info');
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        showToast('Product published to catalog!', 'success');
        return true;
      }
    } catch {
      const newP: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        rating: 4.8,
        reviewCount: 1,
      };
      setProducts(prev => [newP, ...prev]);
      showToast('Product added!', 'success');
      return true;
    }
    return false;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => (p.id === id ? data.product : p)));
        showToast('Product details updated', 'success');
        return true;
      }
    } catch {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
      showToast('Product updated', 'success');
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product deleted from inventory', 'info');
        return true;
      }
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product removed', 'info');
      return true;
    }
    return false;
  };

  const addBanner = async (bannerData: Omit<PromoBanner, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(prev => [...prev, data.banner]);
        showToast('Promotional banner added', 'success');
        return true;
      }
    } catch {
      setBanners(prev => [...prev, { ...bannerData, id: `ban-${Date.now()}` }]);
      showToast('Banner saved', 'success');
      return true;
    }
    return false;
  };

  const deleteBanner = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner removed', 'info');
    return true;
  };

  const addCoupon = async (newCoupon: Coupon): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => [data.coupon, ...prev]);
        showToast(`Coupon code ${newCoupon.code} created!`, 'success');
        return true;
      }
    } catch {
      setCoupons(prev => [newCoupon, ...prev]);
      showToast(`Coupon ${newCoupon.code} added`, 'success');
      return true;
    }
    return false;
  };

  // Auth
  const loginUser = (identifier: string, name = 'Noman Shaikh') => {
    const isEmail = identifier.includes('@');
    const newUser: UserProfile = {
      id: 'user-noman-1',
      name,
      email: isEmail ? identifier : 'nomanshaikh5262@gmail.com',
      phone: isEmail ? '9876543210' : identifier,
      gender: 'MALE',
      superCoins: 350,
      addresses: INITIAL_ADDRESSES,
      role: 'CUSTOMER',
    };
    setUser(newUser);
    showToast(`Welcome back to SUPER MART, ${name}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('supermart_user');
    showToast('Logged out successfully', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        banners,
        coupons,
        categories: CATEGORIES,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        currentView,
        setCurrentView,
        selectedProduct,
        viewProductDetails,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartMrp,
        cartDiscount,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        cancelOrder,
        returnOrder,
        updateOrderStatus,
        trackOrderModal,
        setTrackOrderModal,
        invoiceModal,
        setInvoiceModal,
        user,
        loginUser,
        logoutUser,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        isAdmin,
        setIsAdmin,
        toggleAdminMode,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        deleteBanner,
        addCoupon,
        toast,
        showToast,
        recentlyViewed,
        pincode,
        setPincode,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
