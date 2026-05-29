import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { getAllProducts, type Product } from '../../services/firebaseService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    if (!auth) {
      localStorage.removeItem('adminToken');
      navigate('/admin');
      return;
    }
    await signOut(auth);
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const categories = [...new Set(products.map(p => p.category))];
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 3).length;

  // Per-category stock
  const categoryStockMap = products.reduce((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) acc[cat] = { count: 0, stock: 0 };
    acc[cat].count += 1;
    acc[cat].stock += p.stock || 0;
    return acc;
  }, {} as Record<string, { count: number; stock: number }>);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader">✦</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <div className="admin-actions">
          <Link to="/admin/add-product" className="btn btn-primary">+ Add Product</Link>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <span className="stat-number">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-number">{totalStock}</span>
            <span className="stat-label">Total Stock</span>
          </div>
        </div>
        <div className="stat-card stat-card-alert" style={{borderColor: lowStock > 0 ? 'rgba(234,179,8,0.4)' : undefined}}>
          <div className="stat-icon">{outOfStock > 0 ? '🚫' : '✅'}</div>
          <div className="stat-info">
            <span className="stat-number">{outOfStock}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
        <div className="stat-card" style={{borderColor: lowStock > 0 ? 'rgba(234,179,8,0.4)' : undefined}}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <span className="stat-number">{lowStock}</span>
            <span className="stat-label">Low Stock (≤3)</span>
          </div>
        </div>
      </div>

      {/* Category Stock Bars */}
      {categories.length > 0 && (
        <div className="category-stock-section">
          <h2>Stock by Category</h2>
          <div className="cat-stock-list">
            {categories.map(cat => {
              const data = categoryStockMap[cat] || { count: 0, stock: 0 };
              const pct = totalStock > 0 ? Math.round((data.stock / totalStock) * 100) : 0;
              return (
                <div key={cat} className="cat-stock-row">
                  <div className="cat-stock-label">
                    <span className="cat-stock-name">{cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}</span>
                    <span className="cat-stock-meta">{data.count} products · {data.stock} units</span>
                  </div>
                  <div className="cat-stock-bar-wrap">
                    <div className="cat-stock-bar">
                      <div
                        className="cat-stock-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="cat-stock-pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <Link to="/admin/add-product" className="action-card">
            <span className="action-icon">➕</span>
            <h3>Add New Product</h3>
            <p>Upload new jewelry items to your inventory</p>
          </Link>
          <Link to="/admin/manage-products" className="action-card">
            <span className="action-icon">📝</span>
            <h3>Manage Products</h3>
            <p>Edit, update stock, or remove existing items</p>
          </Link>
          <Link to="/shop" className="action-card">
            <span className="action-icon">👁️</span>
            <h3>View Website</h3>
            <p>See how your store looks to customers</p>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="recent-products">
        <div className="section-header-sm">
          <h2>Recent Products</h2>
          <Link to="/admin/manage-products" className="view-all">View All →</Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map(product => (
                <tr key={product.id}>
                  <td className="product-cell">
                    <div className="product-cell-info">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="mini-thumb" />
                      ) : (
                        <div className="mini-thumb-placeholder">✦</div>
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-category">{product.category}</span></td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>
                    <span className={`stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.isFeatured ? (
                      <span className="badge badge-featured">Featured</span>
                    ) : product.isNewArrival ? (
                      <span className="badge badge-new">New</span>
                    ) : (
                      <span className="badge badge-default">Active</span>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-table">
                    No products yet. Start by adding your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
