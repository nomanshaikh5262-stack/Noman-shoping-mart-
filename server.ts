import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_COUPONS, INITIAL_ADDRESSES, INITIAL_ORDERS, CATEGORIES } from './src/data/initialData.ts';
import { Product, Coupon, PromoBanner, Address, Order, OrderStatus, TrackingStep } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

app.use(express.json());

interface Database {
  products: Product[];
  banners: PromoBanner[];
  coupons: Coupon[];
  addresses: Address[];
  orders: Order[];
}

function loadDB(): Database {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }

  // Seed default
  const defaultDB: Database = {
    products: INITIAL_PRODUCTS,
    banners: INITIAL_BANNERS,
    coupons: INITIAL_COUPONS,
    addresses: INITIAL_ADDRESSES,
    orders: INITIAL_ORDERS,
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(data: Database) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db file:', err);
  }
}

// REST API ROUTES

// 1. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  res.json({ success: true, categories: CATEGORIES });
});

// 2. Products
app.get('/api/products', (req: Request, res: Response) => {
  const db = loadDB();
  let list = [...db.products];

  const { category, search, minPrice, maxPrice, rating, sort, filter } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase() || p.subCategory.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    list = list.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    list = list.filter(p => p.price <= Number(maxPrice));
  }
  if (rating) {
    list = list.filter(p => p.rating >= Number(rating));
  }

  if (filter === 'trending') {
    list = list.filter(p => p.isTrending);
  } else if (filter === 'deals') {
    list = list.filter(p => p.isDealOfDay);
  } else if (filter === 'flash') {
    list = list.filter(p => p.isFlashSale);
  } else if (filter === 'bestseller') {
    list = list.filter(p => p.isBestSeller);
  }

  // Sorting
  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    list.sort((a, b) => b.discountPercentage - a.discountPercentage);
  } else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, count: list.length, products: list });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = loadDB();
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: req.body.rating || 4.5,
    reviewCount: req.body.reviewCount || 1,
    isAssured: req.body.isAssured !== false,
  };

  db.products.unshift(newProduct);
  saveDB(db);
  res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  db.products[idx] = { ...db.products[idx], ...req.body };
  saveDB(db);
  res.json({ success: true, product: db.products[idx] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  saveDB(db);
  res.json({ success: true, message: 'Product removed' });
});

// 3. Banners
app.get('/api/banners', (req: Request, res: Response) => {
  const db = loadDB();
  res.json({ success: true, banners: db.banners });
});

app.post('/api/banners', (req: Request, res: Response) => {
  const db = loadDB();
  const newBanner: PromoBanner = {
    ...req.body,
    id: `ban-${Date.now()}`
  };
  db.banners.push(newBanner);
  saveDB(db);
  res.json({ success: true, banner: newBanner });
});

app.delete('/api/banners/:id', (req: Request, res: Response) => {
  const db = loadDB();
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Banner deleted' });
});

// 4. Coupons
app.get('/api/coupons', (req: Request, res: Response) => {
  const db = loadDB();
  res.json({ success: true, coupons: db.coupons });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const db = loadDB();
  const newCoupon: Coupon = {
    ...req.body,
    code: (req.body.code || '').toUpperCase().trim(),
    active: true
  };
  db.coupons.push(newCoupon);
  saveDB(db);
  res.json({ success: true, coupon: newCoupon });
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  const db = loadDB();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.active);

  if (!coupon) {
    return res.status(400).json({ success: false, error: 'Invalid or expired coupon code' });
  }

  if (cartTotal < coupon.minOrderValue) {
    return res.status(400).json({ 
      success: false, 
      error: `Add items worth ₹${coupon.minOrderValue - cartTotal} more to apply coupon ${coupon.code}` 
    });
  }

  const calculatedDiscount = Math.min(Math.round((cartTotal * coupon.discountPercent) / 100), coupon.maxDiscount);
  res.json({ success: true, coupon, discount: calculatedDiscount });
});

// 5. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const db = loadDB();
  res.json({ success: true, orders: db.orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = loadDB();
  const { items, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, couponCode, couponDiscount } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ success: false, error: 'Incomplete order payload' });
  }

  let totalAmount = 0;
  let totalMrp = 0;

  for (const item of items) {
    totalAmount += item.price * item.quantity;
    totalMrp += (item.originalPrice || item.price) * item.quantity;

    // Reduce stock
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  const deliveryCharge = totalAmount > 499 ? 0 : 40;
  const finalDiscount = couponDiscount || 0;
  const finalTotal = Math.max(0, totalAmount + deliveryCharge - finalDiscount);

  const orderId = `OD${Date.now().toString().slice(-9)}`;
  const now = new Date();
  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const timeline: TrackingStep[] = [
    {
      status: 'Placed',
      title: 'Order Placed & Verified',
      description: `Payment confirmed via ${paymentMethod}`,
      timestamp: now.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      completed: true,
      current: true
    },
    {
      status: 'Packed',
      title: 'Packed & Quality Verified',
      description: 'Items will be securely packed in SuperMart Fulfillment Hub',
      timestamp: 'Expected within 24 hours',
      completed: false,
      current: false
    },
    {
      status: 'Shipped',
      title: 'Shipped & In-Transit',
      description: 'Shipment dispatched with courier partner',
      timestamp: 'Expected soon',
      completed: false,
      current: false
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Delivery',
      description: 'Delivery associate will contact you on your registered phone',
      timestamp: `Expected ${formattedDelivery}`,
      completed: false,
      current: false
    },
    {
      status: 'Delivered',
      title: 'Delivered',
      description: 'Item safely delivered',
      timestamp: `By ${formattedDelivery}`,
      completed: false,
      current: false
    }
  ];

  const newOrder: Order = {
    id: orderId,
    userId: req.body.userId || 'user-demo-1',
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || 'customer@supermart.com',
    customerPhone: customerPhone || '9876543210',
    items,
    totalAmount: finalTotal,
    totalMrp,
    discountAmount: totalMrp - totalAmount,
    couponDiscount: finalDiscount,
    couponCode: couponCode || undefined,
    deliveryCharge,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    orderStatus: 'Placed',
    placedAt: now.toISOString(),
    expectedDeliveryDate: formattedDelivery,
    trackingNumber: `SM-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
    courierPartner: 'SuperMart Express Logistics',
    trackingTimeline: timeline
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// Update order status (Admin)
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: OrderStatus };
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  order.orderStatus = status;

  // Update timeline
  const statuses: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const targetIndex = statuses.indexOf(status);

  if (targetIndex !== -1) {
    order.trackingTimeline.forEach((step, idx) => {
      if (idx < targetIndex) {
        step.completed = true;
        step.current = false;
      } else if (idx === targetIndex) {
        step.completed = true;
        step.current = true;
        step.timestamp = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      } else {
        step.completed = false;
        step.current = false;
      }
    });
  } else if (status === 'Cancelled') {
    order.cancelledAt = new Date().toISOString();
  }

  saveDB(db);
  res.json({ success: true, order });
});

// Cancel order
app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  if (order.orderStatus === 'Delivered') {
    return res.status(400).json({ success: false, error: 'Delivered orders cannot be cancelled. You can request a return instead.' });
  }

  order.orderStatus = 'Cancelled';
  order.cancelledAt = new Date().toISOString();
  order.cancelReason = reason || 'Customer requested cancellation';
  if (order.paymentStatus === 'PAID') {
    order.paymentStatus = 'REFUNDED';
  }

  // Restore inventory
  for (const item of order.items) {
    const p = db.products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock += item.quantity;
    }
  }

  saveDB(db);
  res.json({ success: true, order });
});

// Return order
app.post('/api/orders/:id/return', (req: Request, res: Response) => {
  const { reason } = req.body;
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  order.orderStatus = 'Returned';
  order.returnReason = reason || 'Product issue reported';
  order.paymentStatus = 'REFUNDED';

  saveDB(db);
  res.json({ success: true, order });
});

// Admin Stats
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const db = loadDB();
  const totalRevenue = db.orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStock = db.products.filter(p => p.stock <= 10);

  const categorySales: Record<string, number> = {};
  for (const order of db.orders) {
    if (order.orderStatus === 'Cancelled') continue;
    for (const item of order.items) {
      const prod = db.products.find(p => p.id === item.productId);
      const cat = prod?.category || 'General';
      categorySales[cat] = (categorySales[cat] || 0) + item.price * item.quantity;
    }
  }

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      lowStockCount: lowStock.length,
      lowStockProducts: lowStock.slice(0, 5),
      recentOrders: db.orders.slice(0, 6),
      categorySales
    }
  });
});

// Simulated Auth OTP
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { identifier } = req.body;
  // Simulated OTP 1234
  res.json({ success: true, message: `OTP sent to ${identifier}`, demoOtp: '1234' });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { identifier, otp } = req.body;
  if (otp === '1234' || otp.length === 4) {
    res.json({
      success: true,
      user: {
        id: 'user-noman-1',
        name: 'Noman Shaikh',
        email: identifier.includes('@') ? identifier : 'nomanshaikh5262@gmail.com',
        phone: identifier.includes('@') ? '9876543210' : identifier,
        gender: 'MALE',
        superCoins: 250,
        role: 'CUSTOMER'
      }
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid verification code' });
  }
});

// INTEGRATE VITE IN DEV / SERVE STATIC IN PROD
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SUPER MART Server listening on port ${PORT}`);
  });
}

startServer();
