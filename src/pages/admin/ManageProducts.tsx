import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProductById, updateProductById, type Product } from '../../services/firebaseService';

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const all = await getAllProducts();
      setProducts(all);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      await deleteProductById(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    setUpdatingStockId(id);
    try {
      await updateProductById(id, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    } finally {
      setUpdatingStockId(null);
    }
  };

  // Stock calculations
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 3);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const inStockItems = products.filter(p => p.stock > 3);

  // Category breakdown
  const categoryStock = products.reduce((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) acc[cat] = { count: 0, stock: 0 };
    acc[cat].count += 1;
    acc[cat].stock += p.stock || 0;
    return acc;
  }, {} as Record<string, { count: number; stock: number }>);

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchesSearch = !search ||
      (() => {
        const s = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          p.material.toLowerCase().includes(s) ||
          p.tags?.some(t => t.toLowerCase().includes(s))
        );
      })();
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader">✦</div>
      </div>
    );
  }

  return (
    <div className="admin-manage-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <Link to="/admin/add-product" className="btn btn-primary">+ Add New</Link>
      </div>

      {/* ── STOCK SUMMARY BAR ── */}
      <div className="stock-summary-bar">
        <div className="stock-summary-card stock-total">
          <span className="ss-icon">📦</span>
          <div className="ss-info">
            <span className="ss-number">{totalStock}</span>
            <span className="ss-label">Total Stock Units</span>
          </div>
        </div>
        <div className="stock-summary-card stock-value">
          <span className="ss-icon">💰</span>
          <div className="ss-info">
            <span className="ss-number">₹{totalValue.toLocaleString('en-IN')}</span>
            <span className="ss-label">Inventory Value</span>
          </div>
        </div>
        <div className="stock-summary-card stock-good">
          <span className="ss-icon">✅</span>
          <div className="ss-info">
            <span className="ss-number">{inStockItems.length}</span>
            <span className="ss-label">In Stock</span>
          </div>
        </div>
        <div className="stock-summary-card stock-low">
          <span className="ss-icon">⚠️</span>
          <div className="ss-info">
            <span className="ss-number">{lowStockItems.length}</span>
            <span className="ss-label">Low Stock (≤3)</span>
          </div>
        </div>
        <div className="stock-summary-card stock-out">
          <span className="ss-icon">🚫</span>
          <div className="ss-info">
            <span className="ss-number">{outOfStockItems.length}</span>
            <span className="ss-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* ── CATEGORY STOCK BREAKDOWN ── */}
      {uniqueCategories.length > 0 && (
        <div className="category-stock-breakdown">
          <h3 className="csb-title">Stock by Category</h3>
          <div className="csb-grid">
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                className={`csb-item ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
              >
                <span className="csb-cat-name">{cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}</span>
                <span className="csb-stats">
                  <span className="csb-products">{categoryStock[cat]?.count || 0} items</span>
                  <span className="csb-divider">·</span>
                  <span className="csb-stock">{categoryStock[cat]?.stock || 0} units</span>
                </span>
              </button>
            ))}
            {categoryFilter !== 'all' && (
              <button className="csb-item csb-clear" onClick={() => setCategoryFilter('all')}>
                ✕ Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products by name, category, or material..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input-lg"
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Material</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id}>
                <td className="product-cell">
                  <div className="product-cell-info">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="mini-thumb" />
                    ) : (
                      <div className="mini-thumb-placeholder">✦</div>
                    )}
                    <div>
                      <span className="product-name-cell">{product.name}</span>
                      <span className="product-id-cell">ID: {product.id?.slice(0, 8)}...</span>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-category">{product.category}</span></td>
                <td>{product.material}</td>
                <td>₹{product.price.toLocaleString()}</td>
                <td>
                  <div className="stock-adjuster">
                    <button
                      className="stock-btn stock-btn-minus"
                      onClick={() => handleUpdateStock(product.id!, (product.stock || 0) - 1)}
                      disabled={updatingStockId === product.id || (product.stock || 0) <= 0}
                      title="Decrease stock"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className={`stock-input-field ${product.stock === 0 ? 'out-of-stock' : product.stock <= 3 ? 'low-stock' : 'in-stock'}`}
                      value={product.stock || 0}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) handleUpdateStock(product.id!, val);
                      }}
                      disabled={updatingStockId === product.id}
                      min="0"
                    />
                    <button
                      className="stock-btn stock-btn-plus"
                      onClick={() => handleUpdateStock(product.id!, (product.stock || 0) + 1)}
                      disabled={updatingStockId === product.id}
                      title="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <div className="status-chips">
                    {product.isFeatured && <span className="badge badge-featured">Featured</span>}
                    {product.isNewArrival && <span className="badge badge-new">New</span>}
                    {!product.isFeatured && !product.isNewArrival && (
                      <span className="badge badge-default">Active</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-btns">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn-sm btn-view"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => handleDelete(product.id!)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-table">
                  {search ? 'No products match your search.' : 'No products yet. Add your first product!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing {filtered.length} of {products.length} products
          {categoryFilter !== 'all' && ` in "${categoryFilter.replace(/-/g, ' ')}"`}
          {' '}· Total stock shown: <strong>{filtered.reduce((s, p) => s + (p.stock || 0), 0)}</strong> units
        </span>
      </div>
    </div>
  );
};

export default ManageProducts;
