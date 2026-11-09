import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/confetti';
import { Product, OrderStatus, Coupon, PromoBanner } from '../../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Image,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Store,
  DollarSign,
  Users,
  Search,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    banners,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addCoupon,
    addBanner,
    deleteBanner,
    toggleAdminMode,
    showToast
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'banners'>('overview');

  // Product Add / Edit Modal state
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Mobiles & Tablets',
    subCategory: 'Smartphones',
    description: '',
    price: 1999,
    originalPrice: 2999,
    discountPercentage: 33,
    stock: 25,
    isAssured: true,
    isDealOfDay: false,
    isTrending: false,
    images: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    colors: 'Black, White, Blue',
    sizes: 'Standard',
    highlights: 'High performance; 1 Year Warranty; Fast Charging',
    seller: 'SuperStore Retail Ltd',
    warranty: '1 Year Manufacturer Warranty'
  });

  // Coupon Form state
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    discountPercent: 15,
    minOrderValue: 999,
    maxDiscount: 500,
    description: '',
    expiresAt: '2026-12-31',
    active: true
  });

  // Banner Form state
  const [showBannerModal, setShowBannerModal] = useState<boolean>(false);
  const [newBanner, setNewBanner] = useState<Omit<PromoBanner, 'id'>>({
    title: '',
    subtitle: '',
    badge: 'SUPER OFFER',
    ctaText: 'Shop Now',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop&q=80',
    bgColor: 'from-blue-700 to-indigo-900',
    textColor: 'text-white'
  });

  const [productSearch, setProductSearch] = useState<string>('');

  // Analytics Metrics
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= 10);

  const filteredAdminProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      brand: '',
      category: categories[0]?.name || 'Mobiles & Tablets',
      subCategory: 'General',
      description: '',
      price: 1999,
      originalPrice: 2999,
      discountPercentage: 33,
      stock: 30,
      isAssured: true,
      isDealOfDay: false,
      isTrending: false,
      images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      colors: 'Standard',
      sizes: 'Default',
      highlights: '100% Genuine; Fast Delivery',
      seller: 'SuperStore Retailers',
      warranty: '1 Year Warranty'
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      subCategory: p.subCategory,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercentage: p.discountPercentage,
      stock: p.stock,
      isAssured: p.isAssured,
      isDealOfDay: Boolean(p.isDealOfDay),
      isTrending: Boolean(p.isTrending),
      images: p.images.join(', '),
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      highlights: p.highlights ? p.highlights.join('; ') : '',
      seller: p.seller,
      warranty: p.warranty
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesList = productForm.images.split(',').map(s => s.trim()).filter(Boolean);
    const colorsList = productForm.colors.split(',').map(s => s.trim()).filter(Boolean);
    const sizesList = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const highlightsList = productForm.highlights.split(';').map(s => s.trim()).filter(Boolean);

    const calculatedDiscount = Math.round(
      ((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100
    );

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        subCategory: productForm.subCategory,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercentage: Math.max(0, calculatedDiscount),
        stock: Number(productForm.stock),
        isAssured: productForm.isAssured,
        isDealOfDay: productForm.isDealOfDay,
        isTrending: productForm.isTrending,
        images: imagesList,
        colors: colorsList.length ? colorsList : undefined,
        sizes: sizesList.length ? sizesList : undefined,
        highlights: highlightsList,
        seller: productForm.seller,
        warranty: productForm.warranty
      });
    } else {
      await addProduct({
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        subCategory: productForm.subCategory,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercentage: Math.max(0, calculatedDiscount),
        stock: Number(productForm.stock),
        isAssured: productForm.isAssured,
        isDealOfDay: productForm.isDealOfDay,
        isTrending: productForm.isTrending,
        images: imagesList.length ? imagesList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
        colors: colorsList.length ? colorsList : undefined,
        sizes: sizesList.length ? sizesList : undefined,
        specifications: { 'Condition': 'Brand New in Box', 'Quality': '100% Tested' },
        highlights: highlightsList,
        seller: productForm.seller,
        warranty: productForm.warranty
      });
    }
    setShowProductModal(false);
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    await addCoupon({
      ...newCoupon,
      code: newCoupon.code.toUpperCase().trim()
    });
    setShowCouponModal(false);
  };

  const handleCreateBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title.trim()) return;
    await addBanner(newBanner);
    setShowBannerModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 text-blue-950 rounded-xl shadow-md">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>SUPER MART Control Center</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                Admin Panel
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Manage inventory, process customer orders, create coupons & control banners
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAdminMode}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
        >
          <Store className="w-4 h-4 text-amber-300" />
          <span>Return to Store Front</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Reports', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: `Products (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: <Tag className="w-4 h-4" /> },
          { id: 'banners', label: `Banners (${banners.length})`, icon: <Image className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeAdminTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Overview & Metrics */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-bold uppercase">Total Revenue</span>
                <h3 className="text-xl font-black text-gray-900">{formatINR(totalRevenue)}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-bold uppercase">Total Orders</span>
                <h3 className="text-xl font-black text-gray-900">{orders.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-bold uppercase">Products in Catalog</span>
                <h3 className="text-xl font-black text-gray-900">{products.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-bold uppercase">Low Stock Alerts</span>
                <h3 className="text-xl font-black text-amber-600">{lowStockProducts.length}</h3>
              </div>
            </div>
          </div>

          {/* Low Stock Items Section */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Inventory Refill Required (Stock &lt; 10)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <p className="font-bold text-gray-900 truncate">{p.name}</p>
                      <span className="text-[10px] text-gray-400">{p.category}</span>
                    </div>
                    <span className="bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded shrink-0">
                      Only {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h3 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Recent Customer Orders
            </h3>
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-700">{o.id}</span>
                    <span className="text-gray-500 ml-2">{o.customerName}</span>
                    <span className="text-gray-400 ml-2">({o.items.length} items)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{formatINR(o.totalAmount)}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-[10px]">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products Management */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-200"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-black uppercase text-gray-400 bg-gray-50">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdminProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain rounded bg-gray-50 p-0.5 border" />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-gray-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{p.category}</td>
                    <td className="p-3 font-bold text-gray-900">{formatINR(p.price)}</td>
                    <td className="p-3">
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        p.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 font-semibold">{p.rating} ★</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2">
            Process Customer Orders & Delivery Dispatch
          </h3>

          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-blue-700">{o.id}</span>
                    <span className="text-gray-700 font-bold">• {o.customerName}</span>
                    <span className="text-gray-400">({o.customerPhone})</span>
                  </div>
                  <p className="text-gray-500 mt-0.5">
                    Items: {o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Address: {o.shippingAddress.address}, {o.shippingAddress.city} - {o.shippingAddress.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-black text-sm text-gray-900 block">{formatINR(o.totalAmount)}</span>
                    <span className="text-[10px] text-gray-400 uppercase">{o.paymentMethod} ({o.paymentStatus})</span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Coupons Management */}
      {activeAdminTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900">Active Promo Coupons</h3>
            <button
              type="button"
              onClick={() => setShowCouponModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="p-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-sm text-blue-700">{c.code}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {c.discountPercent}% OFF
                  </span>
                </div>
                <p className="text-gray-600">{c.description}</p>
                <div className="text-[10px] text-gray-400 pt-1 border-t border-blue-100 flex justify-between">
                  <span>Min Order: ₹{c.minOrderValue}</span>
                  <span>Max Disc: ₹{c.maxDiscount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Banners Management */}
      {activeAdminTab === 'banners' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900">Promotional Carousel Banners</h3>
            <button
              type="button"
              onClick={() => setShowBannerModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Banner</span>
            </button>
          </div>

          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4 text-xs">
                <img src={b.imageUrl} alt={b.title} className="w-24 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-amber-400 text-blue-950 font-bold px-1.5 py-0.2 rounded uppercase">
                    {b.badge}
                  </span>
                  <h4 className="font-black text-gray-900 text-sm mt-0.5">{b.title}</h4>
                  <p className="text-gray-500 truncate">{b.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBanner(b.id)}
                  className="text-gray-400 hover:text-rose-600 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-8 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-gray-900">
                {editingProductId ? 'Edit Product Details' : 'Add New Product to SUPER MART'}
              </h3>
              <button type="button" onClick={() => setShowProductModal(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Original MRP (₹) *</label>
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Available Colors (comma separated)</label>
                <input
                  type="text"
                  value={productForm.colors}
                  onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                  placeholder="Black, Blue, Silver"
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleCreateCouponSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-3 text-xs">
            <h3 className="text-sm font-black text-gray-900">Create New Coupon</h3>
            <input
              type="text"
              placeholder="Coupon Code (e.g. SUPER30)"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              className="w-full p-2.5 rounded-lg border uppercase font-mono"
              required
            />
            <input
              type="number"
              placeholder="Discount Percentage (e.g. 20)"
              value={newCoupon.discountPercent}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <input
              type="number"
              placeholder="Min Order Value (₹)"
              value={newCoupon.minOrderValue}
              onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <input
              type="number"
              placeholder="Max Discount Cap (₹)"
              value={newCoupon.maxDiscount}
              onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={newCoupon.description}
              onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="px-4 py-2 font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 font-bold bg-blue-600 text-white rounded-lg">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleCreateBannerSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-3 text-xs">
            <h3 className="text-sm font-black text-gray-900">Create Promotional Banner</h3>
            <input
              type="text"
              placeholder="Banner Title"
              value={newBanner.title}
              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={newBanner.subtitle}
              onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <input
              type="text"
              placeholder="Badge (e.g. FLASH DEAL)"
              value={newBanner.badge}
              onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
              className="w-full p-2.5 rounded-lg border"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newBanner.imageUrl}
              onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
              className="w-full p-2.5 rounded-lg border"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="px-4 py-2 font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 font-bold bg-blue-600 text-white rounded-lg">
                Create Banner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
