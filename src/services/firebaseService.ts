import { db, isFirebaseReady } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from './api';

const PRODUCTS_COLLECTION = 'products';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  material: string;
  weight?: string | null;
  purity?: string;
  images: string[];
  stock: number;
  features: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const categories = [
  {
    id: 'rings',
    name: 'Rings',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'earrings',
    name: 'Earrings',
    icon: '📿',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    icon: '📿',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    icon: '⛓️',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bangles',
    name: 'Bangles',
    icon: '⭕',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mangalsutra',
    name: 'Mangalsutra',
    icon: '🔴',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'nose-pins',
    name: 'Nose Pins',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'chains',
    name: 'Chains',
    icon: '🔗',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80'
  },
];

export const collections = [
  { id: 'summer-2026', name: 'Summer Collection 2026' },
  { id: 'wedding-edit', name: 'Wedding Edit' },
  { id: 'daily-elegance', name: 'Daily Elegance' },
  { id: 'festive-glory', name: 'Festive Glory' },
  { id: 'minimal-luxe', name: 'Minimal Luxe' },
  { id: 'heritage', name: 'Heritage Collection' },
  { id: 'solitaires', name: 'Solitaires' },
  { id: 'gift-edit', name: 'Gift Edit' },
];

export const occasions = ['wedding', 'festive', 'daily', 'gifting'];

export const materials = ['gold', 'diamond', 'silver', 'platinum', 'kundan', 'polki'];

// ── DEMO FALLBACK DATA (used when backend API is unreachable) ────────────────
const DEMO_PRODUCTS: Product[] = [
  { id: 'demo-rings-1', name: 'Classic Solitaire Diamond Ring', description: 'An elegant solitaire diamond ring crafted in 18K yellow gold, featuring a brilliant-cut certified diamond.', price: 74999, originalPrice: 84999, category: 'rings', material: 'diamond', weight: '3.5', purity: '18K', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop'], stock: 5, features: ['100% IGI Certified Diamond', '18K BIS Hallmarked Gold', 'Free Insured Shipping', 'Gift Box Included'], isFeatured: true, isNewArrival: true, tags: ['wedding', 'solitaire', 'gift', 'engagement'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-rings-2', name: 'Floral Diamond Cocktail Ring', description: 'A stunning floral motif cocktail ring set with multiple round-cut diamonds in a 22K gold band.', price: 48500, originalPrice: 55000, category: 'rings', material: 'diamond', weight: '4.2', purity: '22K', images: ['https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800&auto=format&fit=crop'], stock: 7, features: ['22K Hallmarked Gold', 'Multi-Stone Diamond Setting', 'Polished Finish'], isFeatured: false, isNewArrival: true, tags: ['cocktail', 'party', 'diamond'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-necklaces-1', name: 'Royal Peacock Gold Necklace', description: 'Intricately detailed peacock motif necklace set in 22K gold, embodying rich traditional Indian heritage.', price: 145000, originalPrice: 160000, category: 'necklaces', material: 'gold', weight: '24.2', purity: '22K', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop'], stock: 2, features: ['22K BIS Hallmarked', 'Handcrafted Peacock Detailing', 'Traditional Design', 'Authenticity Card'], isFeatured: true, isNewArrival: false, tags: ['heritage', 'bridal', 'festive'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-necklaces-2', name: 'Royal Kundan Choker Set', description: 'A gorgeous heritage choker set featuring Kundan settings, uncut diamonds, and hanging emerald green beads.', price: 210000, originalPrice: 230000, category: 'necklaces', material: 'kundan', weight: '38.5', purity: '22K', images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop'], stock: 0, features: ['Intricate Meenakari Backing', 'Hand-set Kundan Stones', 'Adjustable Silk Thread Dori', 'Heritage Certificate'], isFeatured: true, isNewArrival: false, tags: ['kundan', 'bridal', 'heritage'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-earrings-1', name: 'Dainty Flower Diamond Earrings', description: 'Charming floral design diamond studs in 14K white gold with VVS-clarity diamonds.', price: 38500, originalPrice: 42000, category: 'earrings', material: 'diamond', weight: '2.1', purity: '14K', images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop'], stock: 8, features: ['14K White Gold', 'VVS-VS Diamond Clarity', 'Daily Wear Friendly', 'Push-Back Setting'], isFeatured: false, isNewArrival: true, tags: ['daily', 'gift', 'floral'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-earrings-2', name: 'Dewdrop Pearl & Gold Earrings', description: 'Stunning dangling earrings featuring South Sea pearls suspended from intricate 22K gold leaf-style tops.', price: 52000, originalPrice: 58000, category: 'earrings', material: 'gold', weight: '9.8', purity: '22K', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop'], stock: 5, features: ['Natural South Sea Pearls', '22K Hallmarked Gold', 'Luxury Gift Box Included', 'Handcrafted'], isFeatured: false, isNewArrival: false, tags: ['wedding', 'pearl', 'heritage'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-bangles-1', name: 'Classic Gold Kada Bangles', description: 'Pair of classic plain gold kada bangles with exquisite fine lining and polished finish.', price: 98000, originalPrice: 105000, category: 'bangles', material: 'gold', weight: '18.5', purity: '22K', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop'], stock: 4, features: ['22K BIS Hallmarked', 'Set of 2 Bangles', 'High Polish Mirror Finish', 'Zero-deduction exchange'], isFeatured: true, isNewArrival: false, tags: ['traditional', 'daily', 'festive'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-mangalsutra-1', name: 'Traditional Gold Mangalsutra', description: 'Traditional black beaded necklace with a stunning 22K gold floral pendant.', price: 62000, originalPrice: 68000, category: 'mangalsutra', material: 'gold', weight: '12.4', purity: '22K', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop'], stock: 6, features: ['22K BIS Hallmarked', 'Traditional Black Beads', 'Handcrafted Pendant', 'Adjustable Length'], isFeatured: true, isNewArrival: true, tags: ['wedding', 'traditional', 'bridal'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-chains-1', name: 'Elegant Gold Curb Chain', description: 'A classic 22K gold curb chain, sleek and lightweight, perfect for daily wear or pairing with custom pendants.', price: 45000, originalPrice: 49000, category: 'chains', material: 'gold', weight: '8.2', purity: '22K', images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop'], stock: 12, features: ['22K Gold BIS Hallmarked', 'Flexible Curb Links', 'Durable Lobster Clasp', '18-inch Length'], isFeatured: false, isNewArrival: true, tags: ['daily', 'chain', 'gift'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-nosepins-1', name: 'Filigree Gold Nose Pin', description: 'A delicate 22K gold nose pin featuring traditional Indian filigree work and a tiny sparkling diamond accent.', price: 8500, originalPrice: 9800, category: 'nose-pins', material: 'gold', weight: '0.8', purity: '22K', images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&auto=format&fit=crop'], stock: 15, features: ['22K Hallmarked Gold', 'Screw-Back Post', 'Certified Diamond Accent', 'Traditional Filigree'], isFeatured: false, isNewArrival: true, tags: ['traditional', 'daily', 'nosepin'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-bracelets-1', name: 'Shimmering Diamond Tennis Bracelet', description: 'An elegant line bracelet set with round brilliant-cut diamonds in 18K white gold.', price: 125000, originalPrice: 140000, category: 'bracelets', material: 'diamond', weight: '6.5', purity: '18K', images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop'], stock: 3, features: ['18K White Gold', 'VVS Diamond Clarity', 'Secure Safety Clasp', 'IGI Certified Stones'], isFeatured: true, isNewArrival: true, tags: ['wedding', 'party', 'luxury'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
  { id: 'demo-bracelets-2', name: '22K Gold Charm Bracelet', description: 'A beautiful 22K gold charm bracelet featuring delicate gold balls and intricate textured links.', price: 42000, originalPrice: 47000, category: 'bracelets', material: 'gold', weight: '7.2', purity: '22K', images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop'], stock: 9, features: ['22K BIS Hallmarked', 'Charm Ball Design', 'Spring Ring Clasp', 'Perfect Gift Choice'], isFeatured: false, isNewArrival: true, tags: ['daily', 'charm', 'gift'], createdAt: '2026-05-29T23:30:00.000Z', updatedAt: '2026-05-29T23:30:00.000Z' },
];

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  if (!isFirebaseReady || !db) {
    try {
      const res = await getProducts();
      const list = res.products as Product[];
      if (list && list.length > 0) return list;
      return DEMO_PRODUCTS;
    } catch {
      // Backend not running — use embedded demo data
      return DEMO_PRODUCTS;
    }
  }
  const snapshot = await getDocs(collection(db!, PRODUCTS_COLLECTION));
  return snapshot.docs.map(docRef => ({ id: docRef.id, ...docRef.data() } as Product));
};

// Get products by category
export const getProductsByCategory = async (category: string) => {
  if (!isFirebaseReady || !db) {
    try {
      const res = await getProducts({ category });
      return res.products as Product[];
    } catch {
      return DEMO_PRODUCTS.filter(p => p.category === category);
    }
  }
  const q = query(
    collection(db!, PRODUCTS_COLLECTION),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docRef => ({ id: docRef.id, ...docRef.data() } as Product));
};

// Get featured products
export const getFeaturedProducts = async () => {
  if (!isFirebaseReady || !db) {
    try {
      const res = await getProducts();
      return (res.products as Product[]).filter(p => p.isFeatured).slice(0, 8);
    } catch {
      return DEMO_PRODUCTS.filter(p => p.isFeatured).slice(0, 8);
    }
  }
  const q = query(
    collection(db!, PRODUCTS_COLLECTION),
    where('isFeatured', '==', true),
    limit(8)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docRef => ({ id: docRef.id, ...docRef.data() } as Product));
};

// Get new arrivals
export const getNewArrivals = async () => {
  if (!isFirebaseReady || !db) {
    try {
      const res = await getProducts();
      return (res.products as Product[]).filter(p => p.isNewArrival).slice(0, 8);
    } catch {
      return DEMO_PRODUCTS.filter(p => p.isNewArrival).slice(0, 8);
    }
  }
  const q = query(
    collection(db!, PRODUCTS_COLLECTION),
    where('isNewArrival', '==', true),
    limit(8)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docRef => ({ id: docRef.id, ...docRef.data() } as Product));
};

// Get single product
export const getProductById = async (id: string) => {
  if (!isFirebaseReady || !db) {
    try {
      const res = await getProduct(id);
      return res as Product;
    } catch (e) {
      console.error('Error fetching product by ID, using demo fallback:', e);
      return DEMO_PRODUCTS.find(p => p.id === id) || null;
    }
  }
  const docRef = doc(db!, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

// Add product (admin)
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!isFirebaseReady || !db) {
    const res = await createProduct(product);
    return res.id as string;
  }
  const docRef = await addDoc(collection(db!, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Update product (admin)
export const updateProductById = async (id: string, data: Partial<Product>) => {
  if (!isFirebaseReady || !db) {
    await updateProduct(id, data);
    return;
  }
  const docRef = doc(db!, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

// Delete product (admin)
export const deleteProductById = async (id: string) => {
  if (!isFirebaseReady || !db) {
    await deleteProduct(id);
    return;
  }
  const docRef = doc(db!, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};
