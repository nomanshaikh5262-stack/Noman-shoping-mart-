import { Product, Coupon, PromoBanner, Address, Order } from '../types';

export const CATEGORIES = [
  { id: 'mobiles', name: 'Mobiles & Tablets', icon: 'Smartphone', badge: 'Hot' },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', badge: 'Upto 70% Off' },
  { id: 'fashion', name: 'Fashion & Clothing', icon: 'Shirt', badge: 'New' },
  { id: 'mens-fashion', name: "Men's Fashion", icon: 'User', badge: 'Trending' },
  { id: 'womens-fashion', name: "Women's Fashion", icon: 'Sparkles', badge: '50-80% Off' },
  { id: 'kids', name: "Kids' Products", icon: 'Baby', badge: 'Sale' },
  { id: 'home-furniture', name: 'Home & Furniture', icon: 'Armchair', badge: 'Top Rated' },
  { id: 'kitchen', name: 'Kitchen Appliances', icon: 'UtensilsCrossed', badge: 'Deals' },
  { id: 'beauty', name: 'Beauty Products', icon: 'Heart', badge: 'Min 40% Off' },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingBag', badge: 'Daily Best' },
  { id: 'shoes-accessories', name: 'Shoes & Accessories', icon: 'Footprints', badge: 'Super Saver' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MOBILES & TABLETS
  {
    id: 'prod-mob-1',
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    subCategory: 'Smartphones',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most versatile iPhone camera system ever.',
    price: 124900,
    originalPrice: 134900,
    discountPercentage: 7,
    rating: 4.8,
    reviewCount: 3840,
    stock: 14,
    isAssured: true,
    isTrending: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    sizes: ['128 GB', '256 GB', '512 GB', '1 TB'],
    specifications: {
      'Display': '6.1-inch Super Retina XDR OLED 120Hz ProMotion',
      'Processor': 'A17 Pro chip with 6-core GPU',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
      'Battery': 'Up to 23 hours video playback, MagSafe wireless',
      'OS': 'iOS 17'
    },
    highlights: [
      'Aerospace-grade titanium design with textured matte glass back',
      'Action button for fast access to your favourite feature',
      'Next-generation portraits with focus and depth control',
      'USB-C connector with USB 3 speeds for lightning-fast transfers'
    ],
    seller: 'SuperRetails India Pvt Ltd',
    warranty: '1 Year Brand Warranty for Device and 6 Months for In-Box Accessories',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'prod-mob-2',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    category: 'Mobiles & Tablets',
    subCategory: 'Smartphones',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    price: 119999,
    originalPrice: 134999,
    discountPercentage: 11,
    rating: 4.7,
    reviewCount: 2490,
    stock: 9,
    isAssured: true,
    isDealOfDay: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
    sizes: ['256 GB', '512 GB'],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, QHD+ Flat Screen 2600 nits',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Camera': '200MP Quad Tele System with 5x Optical Zoom',
      'Battery': '5000 mAh with 45W Super Fast Charging',
      'S-Pen': 'Built-in S-Pen with Air Actions'
    },
    highlights: [
      'Galaxy AI: Circle to Search, Live Call Translate, Note Assist',
      'Armor Aluminum frame with Corning Gorilla Armor glass',
      '200MP high-res camera captures epic details even at night'
    ],
    seller: 'Samsung Authorized Official Store',
    warranty: '1 Year Manufacturer Warranty on Handset and 6 Months on Accessories',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'prod-mob-3',
    name: 'Apple iPad Air 11-inch M2 Chip (Wi-Fi, 128 GB) - Starlight',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    subCategory: 'Tablets',
    description: 'The redesigned 11-inch iPad Air is supercharged by the astonishingly fast Apple M2 chip. Features a Liquid Retina display and all-day battery life.',
    price: 54990,
    originalPrice: 59900,
    discountPercentage: 8,
    rating: 4.9,
    reviewCount: 1205,
    stock: 22,
    isAssured: true,
    isFlashSale: true,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Starlight', 'Space Gray', 'Blue', 'Purple'],
    sizes: ['128 GB', '256 GB'],
    specifications: {
      'Display': '11-inch Liquid Retina with True Tone & P3 wide color',
      'Processor': 'Apple M2 Chip with 8-core CPU and 9-core GPU',
      'Camera': '12MP Wide back camera & Landscape 12MP Center Stage front camera',
      'Security': 'Touch ID built into the top button'
    },
    highlights: [
      'Supercharged by Apple M2 with 16-core Neural Engine',
      'Works with Apple Pencil Pro and Magic Keyboard',
      'Ultrafast Wi-Fi 6E connectivity'
    ],
    seller: 'SuperStore Tech Hub',
    warranty: '1 Year Limited Apple Warranty',
    createdAt: '2026-02-01T10:00:00.000Z'
  },

  // 2. ELECTRONICS
  {
    id: 'prod-elec-1',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'Electronics',
    subCategory: 'Audio & Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Specially developed 30mm driver unit with soft-fit leather.',
    price: 26990,
    originalPrice: 34990,
    discountPercentage: 23,
    rating: 4.6,
    reviewCount: 5120,
    stock: 35,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Black', 'Silver', 'Midnight Blue'],
    specifications: {
      'Battery Life': 'Up to 30 hours with ANC On, Quick 3-min charge for 3 hours',
      'Connectivity': 'Bluetooth 5.2 with Multi-point connection',
      'Microphones': '4 beamforming microphones with AI noise reduction',
      'Audio Formats': 'LDAC, AAC, SBC with Hi-Res Audio certification'
    },
    highlights: [
      'Auto NC Optimizer dynamically optimizes noise canceling',
      'Crystal-clear hands-free calling with Precise Voice Pickup',
      'Ultra-comfortable, lightweight design with soft fit leather'
    ],
    seller: 'AudioTech Electronics',
    warranty: '1 Year Sony India Domestic Warranty',
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'prod-elec-2',
    name: 'Apple MacBook Air M3 (13.6-inch, 16GB Unified Memory, 512GB SSD) - Space Grey',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Laptops',
    description: 'Lean. Mean. M3 machine. With up to 18 hours of battery life and a striking Liquid Retina display, MacBook Air powers through work and play.',
    price: 114900,
    originalPrice: 124900,
    discountPercentage: 8,
    rating: 4.9,
    reviewCount: 890,
    stock: 8,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Space Grey', 'Midnight', 'Silver', 'Starlight'],
    sizes: ['256GB SSD', '512GB SSD'],
    specifications: {
      'Processor': 'Apple M3 chip with 8-core CPU and 10-core GPU',
      'Memory': '16GB Unified RAM',
      'Storage': '512GB fast NVMe SSD',
      'Display': '13.6-inch Liquid Retina display with 500 nits brightness',
      'Weight': '1.24 kg fanless silent design'
    },
    highlights: [
      'Incredible performance in an impossibly thin and light aluminum body',
      '1080p FaceTime HD camera and three-mic array',
      'MagSafe 3 charging port and two Thunderbolt ports'
    ],
    seller: 'SuperStore Official',
    warranty: '1 Year Apple International Warranty',
    createdAt: '2026-02-05T10:00:00.000Z'
  },

  // 3. FASHION & CLOTHING
  {
    id: 'prod-fash-1',
    name: "Levi's Men's Trucker Denim Jacket - Classic Indigo Wash",
    brand: "Levi's",
    category: 'Fashion & Clothing',
    subCategory: 'Jackets & Outerwear',
    description: 'The original jean jacket since 1967. A symbol of self-expression for decades, this iconic classic denim jacket is designed to age naturally with wear.',
    price: 3499,
    originalPrice: 5999,
    discountPercentage: 42,
    rating: 4.5,
    reviewCount: 3410,
    stock: 45,
    isAssured: true,
    isTrending: true,
    isDealOfDay: true,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Classic Indigo', 'Faded Stone Wash', 'Jet Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Material': '100% Cotton Premium Denim',
      'Fit': 'Regular Fit hits at the hip',
      'Closure': 'Metal button placket with pointed collar',
      'Pockets': 'Dual button-flap chest pockets & side welt pockets'
    },
    highlights: [
      'Timeless vintage silhouette crafted with sustainable Water<Less tech',
      'Pre-shrunk authentic heavyweight denim',
      'Side waist adjusters for tailored comfort fit'
    ],
    seller: 'DenimHub Brands Ltd',
    warranty: '30 Days Easy Replacement',
    createdAt: '2026-01-12T10:00:00.000Z'
  },

  // 4. MEN'S FASHION
  {
    id: 'prod-men-1',
    name: 'Allen Solly Men Pure Cotton Regular Fit Solid Polo T-Shirt',
    brand: 'Allen Solly',
    category: "Men's Fashion",
    subCategory: 'T-Shirts & Polos',
    description: 'Elevate your everyday casual look with this breathable pique cotton polo t-shirt crafted with a ribbed collar and signature embroidered crest.',
    price: 899,
    originalPrice: 1699,
    discountPercentage: 47,
    rating: 4.3,
    reviewCount: 8920,
    stock: 120,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Navy Blue', 'Forest Green', 'Burgundy Red', 'Charcoal Grey', 'White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      'Fabric': '100% Combed Pique Cotton',
      'Neck': 'Polo Collar with two-button placket',
      'Pattern': 'Solid with iconic stag logo embroidery',
      'Wash Care': 'Machine wash cold inside out'
    },
    highlights: [
      'Bio-washed fabric for ultra-soft hand feel and color retention',
      'Side slit vents for breathability and relaxed posture',
      'Reinforced seams along collar and shoulders'
    ],
    seller: 'ApparelRetail India',
    warranty: '10 Days Return Policy',
    createdAt: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 'prod-men-2',
    name: 'Raymond Men Slim Fit Formal Single Breasted Blazer - Midnight Navy',
    brand: 'Raymond',
    category: "Men's Fashion",
    subCategory: 'Blazers & Suits',
    description: 'Tailored for perfection, this sophisticated formal blazer features notched lapels, two-button front, and structured shoulders for upscale occasions.',
    price: 4999,
    originalPrice: 9999,
    discountPercentage: 50,
    rating: 4.6,
    reviewCount: 780,
    stock: 18,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Midnight Navy', 'Charcoal Grey', 'Royal Black'],
    sizes: ['38', '40', '42', '44'],
    specifications: {
      'Fabric': 'Poly-Viscose Blend with Wool Texture',
      'Fit': 'Slim Fit',
      'Lapel': 'Notched Lapel with floral lapel pin slot',
      'Lining': 'Satin finish full interior lining with hidden pockets'
    },
    highlights: [
      'Wrinkle-resistant smart travel fabric',
      'Dual rear vents for effortless movement',
      'Crafted by master tailors with precision stitching'
    ],
    seller: 'Raymond Exclusive Outlet',
    warranty: '10 Days Easy Exchange',
    createdAt: '2026-01-22T10:00:00.000Z'
  },

  // 5. WOMEN'S FASHION
  {
    id: 'prod-wom-1',
    name: 'BIBA Women Embroidered Anarkali Kurta & Pant Set with Dupatta',
    brand: 'BIBA',
    category: "Women's Fashion",
    subCategory: 'Ethnic Wear',
    description: 'A regal emerald green Anarkali set adorned with intricate Zari embroidery, complemented by matching cigarette pants and a lightweight organza dupatta.',
    price: 3299,
    originalPrice: 6999,
    discountPercentage: 53,
    rating: 4.6,
    reviewCount: 2310,
    stock: 28,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Emerald Green', 'Royal Maroon', 'Dusty Rose Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: {
      'Fabric': 'Pure Silk Chanderi with Cotton Voile Lining',
      'Work': 'Hand Zardozi & Sequins work on yoke and hem',
      'Sleeve': 'Three-Quarter Sleeves with gota patti border',
      'Length': 'Calf Length with full flare'
    },
    highlights: [
      'Complete 3-piece designer festive collection',
      'Breathable comfortable lining prevents irritation',
      'Handcrafted lace finishes along dupatta borders'
    ],
    seller: 'BIBA Official Apparels',
    warranty: '7 Days Return and Exchange',
    createdAt: '2026-01-28T10:00:00.000Z'
  },
  {
    id: 'prod-wom-2',
    name: 'Lavie Women Structured Satchel Handbag with Detachable Sling',
    brand: 'Lavie',
    category: "Women's Fashion",
    subCategory: 'Handbags & Clutches',
    description: 'Stay chic and organized with this faux-leather structured satchel featuring gold-tone hardware, spacious compartments, and an adjustable shoulder strap.',
    price: 1599,
    originalPrice: 3999,
    discountPercentage: 60,
    rating: 4.4,
    reviewCount: 4520,
    stock: 50,
    isAssured: true,
    isFlashSale: true,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Tan Brown', 'Blush Pink', 'Jet Black'],
    specifications: {
      'Material': 'Premium Textured Polyurethane Leather',
      'Dimensions': '32cm x 13cm x 24cm',
      'Compartments': '2 main zipper pockets + 1 center divider zip + slip pockets',
      'Hardware': 'Anti-tarnish polished gold-plated metal zippers'
    },
    highlights: [
      'Water-resistant durable vegan leather exterior',
      'Includes detachable cross-body strap for dual styling',
      'Sturdy protective metal feet on bottom base'
    ],
    seller: 'Lavie Lifestyle Brands',
    warranty: '6 Months Brand Warranty',
    createdAt: '2026-02-02T10:00:00.000Z'
  },

  // 6. KIDS' PRODUCTS
  {
    id: 'prod-kid-1',
    name: 'LEGO Star Wars Millennium Falcon Starship Building Set (75257)',
    brand: 'LEGO',
    category: "Kids' Products",
    subCategory: 'Toys & Games',
    description: 'Inspire kids and Star Wars fans with this 1,351-piece model containing opening cockpits, rotating gun turrets, 2 spring-loaded shooters and 7 characters.',
    price: 13999,
    originalPrice: 16999,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 940,
    stock: 15,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Pieces': '1351 authentic building bricks',
      'Age': '9 Years and above',
      'Minifigures': 'Finn, Chewbacca, C-3PO, Lando Calrissian, Boolio, R2-D2 and D-O',
      'Dimensions': 'Over 14cm high, 44cm long, and 32cm wide'
    },
    highlights: [
      'Top panels open for easy access to the detailed interior',
      'Cockpit accommodates 2 minifigures',
      'Cargo area with 2 containers, navigation computer with rotating chair'
    ],
    seller: 'Lego Certified SuperMart Store',
    warranty: '10 Days Replacement for Missing Parts',
    createdAt: '2026-01-25T10:00:00.000Z'
  },

  // 7. HOME & FURNITURE
  {
    id: 'prod-home-1',
    name: 'Green Soul Monster Ultimate Ergonomic Gaming & Office Chair',
    brand: 'Green Soul',
    category: 'Home & Furniture',
    subCategory: 'Chairs & Study Tables',
    description: 'Designed for endless hours of work or gaming comfort with breathable soft fabric, memory foam neck and lumbar pillows, and 4D adjustable armrests.',
    price: 16490,
    originalPrice: 28990,
    discountPercentage: 43,
    rating: 4.7,
    reviewCount: 6180,
    stock: 25,
    isAssured: true,
    isDealOfDay: true,
    images: [
      'https://images.unsplash.com/photo-1580481077191-45566cf2c2f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Carbon Black', 'Royal Blue / Black', 'Steel Grey'],
    specifications: {
      'Frame': 'Heavy Duty 1.5mm Internal Steel Frame',
      'Upholstery': 'Spill-resistant Breathable Spandex Fabric',
      'Recline': '90 to 180 degree backrest tilt lock',
      'Gas Lift': 'Class 4 BIFMA Certified Hydraulic Piston',
      'Weight Capacity': 'Up to 135 kg'
    },
    highlights: [
      'Ergonomic contour supports cervical and lumbar spine health',
      'High-density molded foam cushion does not sag over time',
      'Heavy-duty alloy metal wheel base with smooth nylon casters'
    ],
    seller: 'Green Soul Furnitures India',
    warranty: '3 Years Manufacturer Onsite Warranty',
    createdAt: '2026-01-16T10:00:00.000Z'
  },

  // 8. KITCHEN APPLIANCES
  {
    id: 'prod-kitch-1',
    name: 'Philips Digital Air Fryer HD9252/90 (4.1L, Rapid Air Tech)',
    brand: 'Philips',
    category: 'Kitchen Appliances',
    subCategory: 'Air Fryers & Fryers',
    description: 'Fry with up to 90% less fat with patented Rapid Air Technology. Features touch screen with 7 preset cooking programs and keep warm function.',
    price: 7499,
    originalPrice: 11995,
    discountPercentage: 37,
    rating: 4.6,
    reviewCount: 14200,
    stock: 40,
    isAssured: true,
    isBestSeller: true,
    isFlashSale: true,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Glossy Black', 'Silk White'],
    specifications: {
      'Capacity': '4.1 Litre basket (serves 3-4 persons)',
      'Power': '1400 Watts rapid heating element',
      'Temperature Range': '80°C to 200°C',
      'Presets': 'Frozen snacks, fresh fries, meat, fish, chicken, cake and grilled veggies'
    },
    highlights: [
      'Patented starfish bottom ensures even hot air circulation without turning food',
      'Dishwasher safe non-stick QuickClean basket',
      'NutriU app with 500+ healthy recipes'
    ],
    seller: 'Philips Domestic Appliances Hub',
    warranty: '2 Years Philips International Warranty',
    createdAt: '2026-01-14T10:00:00.000Z'
  },

  // 9. BEAUTY PRODUCTS
  {
    id: 'prod-beau-1',
    name: "L'Oreal Paris Revitalift 1.5% Hyaluronic Acid Hydrating Face Serum (30ml)",
    brand: "L'Oreal",
    category: 'Beauty Products',
    subCategory: 'Skincare',
    description: 'Our highest concentration of Hyaluronic Acid intensely plumps skin from within, reduces fine lines by 60%, and imparts an instant dewy glass-skin glow.',
    price: 699,
    originalPrice: 999,
    discountPercentage: 30,
    rating: 4.5,
    reviewCount: 28400,
    stock: 95,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-216e257778b4?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['15ml', '30ml', '50ml'],
    specifications: {
      'Skin Type': 'All skin types, including sensitive skin',
      'Key Ingredient': '1.5% Pure Micro + Macro Hyaluronic Acid',
      'Formulation': 'Ultra-lightweight, non-sticky and fast absorbing',
      'Free From': 'Parabens, synthetic fragrances, and alcohol'
    },
    highlights: [
      'Dermatologically tested and validated by international panel of dermatologists',
      'Instantly hydrates by +42% in 1 hour',
      'Wearable under makeup for smooth primer effect'
    ],
    seller: 'CosmeticRetail SuperMart',
    warranty: 'Authenticity Guarantee & 100% Genuine Seal',
    createdAt: '2026-01-30T10:00:00.000Z'
  },

  // 10. GROCERY
  {
    id: 'prod-groc-1',
    name: 'Happilo 100% Natural Premium California Raw Whole Almonds (1 kg)',
    brand: 'Happilo',
    category: 'Grocery',
    subCategory: 'Dry Fruits & Nuts',
    description: 'Handpicked jumbo-sized California almonds packed with plant protein, magnesium, vitamin E, and dietary fiber. Vacuum packed for crisp crunchiness.',
    price: 849,
    originalPrice: 1399,
    discountPercentage: 39,
    rating: 4.7,
    reviewCount: 31200,
    stock: 80,
    isAssured: true,
    isBestSeller: true,
    isDealOfDay: true,
    images: [
      'https://images.unsplash.com/photo-1508061252966-f72fb9826cf6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543208543-6058097d6d37?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['500g', '1 kg'],
    specifications: {
      'Ingredient': '100% California Almond Kernels',
      'Nutritional Value': 'Zero Cholesterol, Zero Trans Fat, 21g Protein per 100g',
      'Packaging': 'Resealable Zip Lock Airtight Pouch',
      'Origin': 'Grown in California, USA, packaged in India'
    },
    highlights: [
      'Gluten-free, vegan and rich in dietary antioxidants',
      'Great for morning energy, smoothies, baking and snacking',
      'Nitrogen flushed for unmatched freshness'
    ],
    seller: 'SuperMart Daily Fresh Grocery',
    warranty: '100% Freshness Assured or Instant Refund',
    createdAt: '2026-02-03T10:00:00.000Z'
  },

  // 11. SHOES & ACCESSORIES
  {
    id: 'prod-shoe-1',
    name: 'Nike Air Max SC Men Sneaker Running & Lifestyle Shoes',
    brand: 'Nike',
    category: 'Shoes & Accessories',
    subCategory: 'Sneakers & Casual Shoes',
    description: 'With its easy-going lines, heritage track look, and visible Air cushioning, the Nike Air Max SC is the perfect finish to any everyday outfit.',
    price: 4495,
    originalPrice: 5995,
    discountPercentage: 25,
    rating: 4.7,
    reviewCount: 6840,
    stock: 30,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Red / White', 'Triple White', 'Black / White'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    specifications: {
      'Sole': 'Rubber Waffle Outsole with Max Air unit in heel',
      'Upper': 'Combination of genuine leather, textile and mesh',
      'Closure': 'Lace-Up with padded low-cut collar',
      'Cushioning': 'Foam midsole for lightweight all-day comfort'
    },
    highlights: [
      'Originally designed for performance running',
      'Flex grooves in sole allow your foot to move naturally',
      'Durable construction built to last through daily commute'
    ],
    seller: 'SuperAthletics Flagship Store',
    warranty: '30 Days Exchange and Replacement Policy',
    createdAt: '2026-01-19T10:00:00.000Z'
  },
  {
    id: 'prod-shoe-2',
    name: 'Fossil Grant Chronograph Navy Blue Dial Men Leather Watch (FS5151)',
    brand: 'Fossil',
    category: 'Shoes & Accessories',
    subCategory: 'Watches',
    description: 'Inspired by the vintage clock designs, this timepiece features Roman numerals, a royal dark blue sunray dial, and a supple rich brown genuine leather strap.',
    price: 7995,
    originalPrice: 14995,
    discountPercentage: 46,
    rating: 4.8,
    reviewCount: 3890,
    stock: 19,
    isAssured: true,
    isBestSeller: true,
    isDealOfDay: true,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    colors: ['Brown Leather / Blue Dial', 'Black Leather / Black Dial', 'Smoke Grey Steel'],
    specifications: {
      'Movement': 'Quartz Chronograph with 24-hr subdial & stopwatch',
      'Case Diameter': '44 mm Stainless Steel Case',
      'Water Resistance': '50 meters (5 ATM) splash and shower resistant',
      'Strap': '22 mm Interchangeable Genuine Luggage Leather'
    },
    highlights: [
      'Iconic Grant collection design with textured Roman numerals',
      'Hardened mineral crystal lens resists scratches',
      'Packed in signature collectible Fossil tin box'
    ],
    seller: 'Fossil India Flagship Store',
    warranty: '2 Years Fossil Worldwide Warranty',
    createdAt: '2026-01-27T10:00:00.000Z'
  }
];

export const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'ban-1',
    title: 'BIG BILLION SUPER SALE',
    subtitle: 'Mobiles, Laptops & Smart Electronics at Unbeatable Prices',
    badge: 'LIMITED TIME DEAL',
    ctaText: 'Shop Electronics',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop&q=80',
    bgColor: 'from-blue-700 via-blue-800 to-indigo-900',
    textColor: 'text-white'
  },
  {
    id: 'ban-2',
    title: 'MEGA FASHION BONANZA',
    subtitle: '50% - 80% Off on Top Brands: Levis, Nike, BIBA & Raymond',
    badge: 'NEW SEASON DROP',
    ctaText: 'Explore Fashion',
    category: 'Fashion & Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
    bgColor: 'from-amber-500 via-orange-600 to-rose-700',
    textColor: 'text-white'
  },
  {
    id: 'ban-3',
    title: 'SMARTPHONE FESTIVAL 2026',
    subtitle: 'Extra ₹5,000 Exchange Bonus + No Cost EMI on iPhone & Galaxy',
    badge: 'SUPER DEAL',
    ctaText: 'Upgrade Phone',
    category: 'Mobiles & Tablets',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    bgColor: 'from-cyan-700 via-blue-900 to-slate-900',
    textColor: 'text-white'
  },
  {
    id: 'ban-4',
    title: 'HOME MAKEOVER DAYS',
    subtitle: 'Ergonomic Chairs, Kitchen Upgrades & Smart Gadgets',
    badge: 'MIN 40% OFF',
    ctaText: 'Shop Home',
    category: 'Home & Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
    bgColor: 'from-emerald-700 via-teal-800 to-slate-900',
    textColor: 'text-white'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'SUPER100',
    discountPercent: 15,
    minOrderValue: 999,
    maxDiscount: 500,
    description: 'Get 15% off up to ₹500 on orders above ₹999',
    expiresAt: '2026-12-31',
    active: true
  },
  {
    code: 'NOMANMART',
    discountPercent: 20,
    minOrderValue: 1499,
    maxDiscount: 1000,
    description: 'Exclusive 20% instant off on Noman Super Mart special collection',
    expiresAt: '2026-12-31',
    active: true
  },
  {
    code: 'WELCOME50',
    discountPercent: 10,
    minOrderValue: 499,
    maxDiscount: 200,
    description: 'Welcome offer! 10% off on your first order',
    expiresAt: '2026-12-31',
    active: true
  },
  {
    code: 'FLAT200',
    discountPercent: 25,
    minOrderValue: 2499,
    maxDiscount: 1500,
    description: 'Big Cart Bonanza: 25% off up to ₹1500 on orders over ₹2499',
    expiresAt: '2026-12-31',
    active: true
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Noman Shaikh',
    phone: '9876543210',
    pincode: '400001',
    locality: 'Fort, Marine Lines',
    address: 'Flat 402, Royal Residency, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    landmark: 'Near Central Bank Building',
    alternatePhone: '9820011223',
    addressType: 'HOME',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Noman Shaikh (Office)',
    phone: '9876543210',
    pincode: '400051',
    locality: 'Bandra Kurla Complex (BKC)',
    address: 'Tech Tower, 6th Floor, SuperMart Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    landmark: 'Opposite Diamond Bourse',
    addressType: 'WORK',
    isDefault: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'OD19842718901',
    userId: 'user-demo-1',
    customerName: 'Noman Shaikh',
    customerEmail: 'nomanshaikh5262@gmail.com',
    customerPhone: '9876543210',
    items: [
      {
        productId: 'prod-shoe-1',
        productName: 'Nike Air Max SC Men Sneaker Running & Lifestyle Shoes',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        price: 4495,
        originalPrice: 5995,
        quantity: 1,
        selectedColor: 'Red / White',
        selectedSize: 'UK 9'
      }
    ],
    totalAmount: 4495,
    totalMrp: 5995,
    discountAmount: 1500,
    couponDiscount: 0,
    deliveryCharge: 0,
    shippingAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'Shipped',
    placedAt: '2026-03-05T14:20:00.000Z',
    expectedDeliveryDate: '12 March 2026',
    trackingNumber: 'SM-EXP-8891240',
    courierPartner: 'SuperMart Express Express Air',
    trackingTimeline: [
      {
        status: 'Placed',
        title: 'Order Placed & Verified',
        description: 'Your payment via UPI was confirmed successfully',
        timestamp: '05 Mar 2026, 02:20 PM',
        completed: true,
        current: false
      },
      {
        status: 'Packed',
        title: 'Packed & Quality Checked',
        description: 'Item checked and bubble-wrapped at Mumbai Central Hub',
        timestamp: '06 Mar 2026, 09:15 AM',
        completed: true,
        current: false
      },
      {
        status: 'Shipped',
        title: 'In Transit',
        description: 'Shipment has departed Mumbai Fulfillment Center',
        timestamp: '07 Mar 2026, 08:30 PM',
        completed: true,
        current: true
      },
      {
        status: 'Out for Delivery',
        title: 'Out for Delivery',
        description: 'Courier agent will contact you before arriving',
        timestamp: 'Expected 11 Mar 2026',
        completed: false,
        current: false
      },
      {
        status: 'Delivered',
        title: 'Delivery',
        description: 'Package delivered to recipient',
        timestamp: 'Expected 12 Mar 2026',
        completed: false,
        current: false
      }
    ]
  }
];
