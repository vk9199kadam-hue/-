import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const hasRealCredentials = process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id' &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE');

let app;
let auth;
let db;
let storage;

if (hasRealCredentials) {
  try {
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    app = initializeApp({
      credential: cert(firebaseConfig),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    });
    console.log('✨ Firebase Admin initialized successfully');
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
  }
}

if (!app) {
  console.warn('⚠️ Firebase Admin config placeholders detected. Using local mock services.');

  // Seed products to make it look stunning initially
  const getInitialSeedProducts = () => [
    {
      name: "Classic Solitaire Diamond Ring",
      description: "An elegant solitaire diamond ring crafted in 18K yellow gold, perfect for engagements and special occasions.",
      price: 74999,
      originalPrice: 84999,
      category: "rings",
      material: "diamond",
      weight: "3.5",
      purity: "18K",
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop"],
      stock: 5,
      features: ["100% Certified Diamond", "18K Gold Hallmarked", "Free Insured Shipping"],
      isFeatured: true,
      isNewArrival: true,
      tags: ["wedding", "solitaire", "gift"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Royal Peacock Gold Necklace",
      description: "Intricately detailed peacock motif necklace set in 22K gold, embodying traditional Indian heritage.",
      price: 145000,
      originalPrice: 160000,
      category: "necklaces",
      material: "gold",
      weight: "24.2",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop"],
      stock: 2,
      features: ["22K BIS Hallmarked", "Handcrafted Detailing", "Traditional Design"],
      isFeatured: true,
      isNewArrival: false,
      tags: ["heritage", "bridal", "festive"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Dainty Flower Diamond Earrings",
      description: "Charming floral design diamond studs in 14K white gold. Perfect for everyday luxury.",
      price: 38500,
      originalPrice: 42000,
      category: "earrings",
      material: "diamond",
      weight: "2.1",
      purity: "14K",
      images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop"],
      stock: 8,
      features: ["14K Gold", "VVS-VS Diamond Clarity", "Daily Wear"],
      isFeatured: false,
      isNewArrival: true,
      tags: ["daily", "gift", "floral"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Classic Gold Kada Bangles",
      description: "Pair of classic plain gold kada bangles with exquisite fine lining and polished finish.",
      price: 98000,
      originalPrice: 105000,
      category: "bangles",
      material: "gold",
      weight: "18.5",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop"],
      stock: 4,
      features: ["22K BIS Hallmarked", "Set of 2", "High Polish Finish"],
      isFeatured: true,
      isNewArrival: false,
      tags: ["traditional", "daily"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Traditional Gold Mangalsutra",
      description: "Traditional black beaded necklace with a stunning 22K gold floral pendant detailed with delicate filigree work.",
      price: 62000,
      originalPrice: 68000,
      category: "mangalsutra",
      material: "gold",
      weight: "12.4",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop"],
      stock: 6,
      features: ["22K BIS Hallmarked", "Traditional Black Beads", "Handcrafted Pendant"],
      isFeatured: true,
      isNewArrival: true,
      tags: ["wedding", "traditional", "bridal"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Elegant Gold Curb Chain",
      description: "A classic 22K gold curb chain, sleek and lightweight, perfect for daily wear or pairing with custom pendants.",
      price: 45000,
      originalPrice: 49000,
      category: "chains",
      material: "gold",
      weight: "8.2",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop"],
      stock: 12,
      features: ["22K Gold BIS Hallmarked", "Flexible Curb Links", "Durable Lobster Clasp"],
      isFeatured: false,
      isNewArrival: true,
      tags: ["daily", "chain", "gift"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Filigree Gold Nose Pin",
      description: "A delicate 22K gold nose pin featuring traditional Indian filigree work and a tiny sparkling diamond accent.",
      price: 8500,
      originalPrice: 9800,
      category: "nose-pins",
      material: "gold",
      weight: "0.8",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&auto=format&fit=crop"],
      stock: 15,
      features: ["22K Hallmarked Gold", "Screw Back Post", "Certified Diamond Accent"],
      isFeatured: false,
      isNewArrival: true,
      tags: ["traditional", "daily", "nosepin"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Shimmering Diamond Bracelet",
      description: "An elegant line bracelet set with round brilliant-cut diamonds in 18K white gold. Perfect for luxury evening wear.",
      price: 125000,
      originalPrice: 140000,
      category: "bracelets",
      material: "diamond",
      weight: "6.5",
      purity: "18K",
      images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop"],
      stock: 3,
      features: ["18K White Gold", "VVS Diamonds", "Secure Safety Clasp"],
      isFeatured: true,
      isNewArrival: true,
      tags: ["wedding", "party", "luxury"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Dewdrop Pearl & Gold Earrings",
      description: "Stunning dangling earrings featuring South Sea pearls suspended from intricate 22K gold leaf-style tops.",
      price: 52000,
      originalPrice: 58000,
      category: "earrings",
      material: "gold",
      weight: "9.8",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop"],
      stock: 5,
      features: ["Natural South Sea Pearls", "22K Hallmarked Gold", "Luxury Gift Box Included"],
      isFeatured: false,
      isNewArrival: false,
      tags: ["wedding", "pearl", "heritage"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: "Royal Kundan Choker Set",
      description: "A gorgeous heritage choker set featuring Kundan settings, uncut diamonds, and hanging emerald green beads.",
      price: 210000,
      originalPrice: 230000,
      category: "necklaces",
      material: "kundan",
      weight: "38.5",
      purity: "22K",
      images: ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop"],
      stock: 2,
      features: ["Intricate Meenakari Backing", "Hand-set Kundan Stones", "Adjustable Silk Thread Dori"],
      isFeatured: true,
      isNewArrival: false,
      tags: ["kundan", "bridal", "heritage"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  class MockDocSnapshot {
    constructor(id, data) {
      this.id = id;
      this._data = data;
      this.exists = !!data;
    }
    data() {
      return this._data;
    }
  }

  class MockQuerySnapshot {
    constructor(docs) {
      this.docs = docs;
      this.size = docs.length;
    }
    forEach(callback) {
      this.docs.forEach(callback);
    }
  }

  class MockDocRef {
    constructor(id, collectionRef) {
      this.id = id;
      this.collectionRef = collectionRef;
    }
    async get() {
      const data = this.collectionRef.dbInstance.getData(this.collectionRef.name, this.id);
      return new MockDocSnapshot(this.id, data);
    }
    async set(data) {
      this.collectionRef.dbInstance.setData(this.collectionRef.name, this.id, data);
      return { writeTime: new Date() };
    }
    async update(data) {
      this.collectionRef.dbInstance.updateData(this.collectionRef.name, this.id, data);
      return { writeTime: new Date() };
    }
    async delete() {
      this.collectionRef.dbInstance.deleteData(this.collectionRef.name, this.id);
      return { writeTime: new Date() };
    }
  }

  class MockQuery {
    constructor(collectionRef, filters = []) {
      this.collectionRef = collectionRef;
      this.filters = filters;
    }
    where(field, op, value) {
      return new MockQuery(this.collectionRef, [...this.filters, { field, op, value }]);
    }
    async get() {
      let items = this.collectionRef.dbInstance.getAllData(this.collectionRef.name);
      for (const filter of this.filters) {
        items = items.filter(item => {
          const val = item[filter.field];
          if (filter.op === '==') return val === filter.value;
          return true;
        });
      }
      const docs = items.map(item => new MockDocSnapshot(item.id, item));
      return new MockQuerySnapshot(docs);
    }
  }

  class MockCollectionRef extends MockQuery {
    constructor(name, dbInstance) {
      super(null, []);
      this.name = name;
      this.dbInstance = dbInstance;
      this.collectionRef = this;
    }
    doc(id) {
      return new MockDocRef(id, this);
    }
    async add(data) {
      const id = Math.random().toString(36).substring(2, 15);
      const newItem = { id, ...data };
      this.dbInstance.addData(this.name, newItem);
      return new MockDocRef(id, this);
    }
  }

  class MockFirestore {
    constructor() {
      this.filePath = path.join(__dirname, '..', 'data', 'products.json');
      this.data = { products: [] };
      this.init();
    }
    init() {
      try {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(this.filePath)) {
          this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        } else {
          this.data = { products: getInitialSeedProducts() };
          fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        }
      } catch (e) {
        console.error('Mock Firestore file load failed, using memory', e);
      }
    }
    save() {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
      } catch (e) {
        console.error('Mock Firestore write failed', e);
      }
    }
    getAllData(collectionName) {
      return this.data[collectionName] || [];
    }
    getData(collectionName, id) {
      const list = this.data[collectionName] || [];
      return list.find(item => item.id === id);
    }
    setData(collectionName, id, item) {
      if (!this.data[collectionName]) this.data[collectionName] = [];
      const list = this.data[collectionName];
      const idx = list.findIndex(x => x.id === id);
      const newItem = { id, ...item };
      if (idx !== -1) {
        list[idx] = newItem;
      } else {
        list.push(newItem);
      }
      this.save();
    }
    addData(collectionName, item) {
      if (!this.data[collectionName]) this.data[collectionName] = [];
      this.data[collectionName].push(item);
      this.save();
    }
    updateData(collectionName, id, update) {
      const list = this.data[collectionName] || [];
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...update };
        this.save();
      }
    }
    deleteData(collectionName, id) {
      const list = this.data[collectionName] || [];
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list.splice(idx, 1);
        this.save();
      }
    }
    collection(name) {
      return new MockCollectionRef(name, this);
    }
  }

  class MockAuth {
    async verifyIdToken(token) {
      if (token === 'mock-developer-admin-token') {
        return {
          uid: 'mock-dev-admin',
          email: 'admin@porwaljewellers.com',
          admin: true
        };
      }
      return {
        uid: 'mock-user-' + token.substring(0, 8),
        email: 'user@example.com',
        admin: token.includes('admin')
      };
    }
    async setCustomUserClaims(uid, claims) {
      console.log(`Mock setCustomUserClaims for ${uid}:`, claims);
      return Promise.resolve();
    }
  }

  db = new MockFirestore();
  auth = new MockAuth();
  storage = {};
}

export { auth, db, storage };
export default app;

