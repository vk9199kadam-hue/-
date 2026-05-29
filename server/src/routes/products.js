import { Router } from 'express';
import { db } from '../firebase-admin.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();
const productsCollection = 'products';

// GET /api/products - Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, material, search, minPrice, maxPrice, sort } = req.query;
    let query = db.collection(productsCollection);

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    if (material && material !== 'all') {
      query = query.where('material', '==', material);
    }

    const snapshot = await query.get();
    let products = [];

    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Client-side filtering for non-indexed fields
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.json({ products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get a single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(productsCollection).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create a new product (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      name, description, price, originalPrice, category,
      material, weight, purity, images, stock, features,
      isFeatured, isNewArrival, tags
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const productData = {
      name,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      material: material || 'gold',
      weight: weight || null,
      purity: purity || '22K',
      images: images || [],
      stock: stock ?? 0,
      features: features || [],
      isFeatured: isFeatured ?? false,
      isNewArrival: isNewArrival ?? false,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection(productsCollection).add(productData);
    res.status(201).json({ id: docRef.id, ...productData });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update a product (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const docRef = db.collection(productsCollection).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    // Remove id if present
    delete updateData.id;

    await docRef.update(updateData);
    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete a product (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const docRef = db.collection(productsCollection).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await docRef.delete();
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
