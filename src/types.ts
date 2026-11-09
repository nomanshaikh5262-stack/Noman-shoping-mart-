export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isAssured: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isDealOfDay?: boolean;
  isFlashSale?: boolean;
  images: string[];
  colors?: string[];
  sizes?: string[];
  specifications: Record<string, string>;
  highlights: string[];
  seller: string;
  warranty: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: 'HOME' | 'WORK';
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  totalMrp: number;
  discountAmount: number;
  couponDiscount: number;
  couponCode?: string;
  deliveryCharge: number;
  shippingAddress: Address;
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: OrderStatus;
  placedAt: string;
  expectedDeliveryDate: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  returnReason?: string;
  trackingNumber: string;
  courierPartner: string;
  trackingTimeline: TrackingStep[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  description: string;
  expiresAt: string;
  active: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  category: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  superCoins: number;
  addresses: Address[];
  role: 'CUSTOMER' | 'ADMIN';
}
