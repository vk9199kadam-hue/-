import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts, categories, materials, occasions, type Product } from '../services/firebaseService';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(
    JSON.parse(localStorage.getItem('wishlist') || '[]')
  ));

  const activeCategory = searchParams.get('category') || 'all';
  const activeMaterial = searchParams.get('material') || 'all';
  const activeOccasion = searchParams.get('occasion') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (activeMaterial !== 'all') {
      result = result.filter(p => p.material === activeMaterial);
    }
    if (activeOccasion !== 'all') {
      result = result.filter(p =>
        p.tags?.some(t => t.toLowerCase() === activeOccasion)
      );
    }
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.tags?.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        result.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'newest':
      default:
        result.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredProducts(result);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [products, activeCategory, activeMaterial, activeOccasion, sortBy, minPrice, maxPrice, search]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [filteredProducts, visibleCount]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify([...newWishlist]));
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
  };

  const hasActiveFilters = activeCategory !== 'all' || activeMaterial !== 'all' ||
    activeOccasion !== 'all' || minPrice || maxPrice || sortBy !== 'newest';

  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="shop-page">
      <div className="page-hero shop-hero">
        <div className="container">
          <h1>Our Collection</h1>
          <p>Discover exquisite jewelry crafted with passion and precision</p>
        </div>
      </div>

      <div className="container shop-content">
        {/* Sidebar Filters */}
        <aside className="shop-filters">
          <div className="filter-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-search">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              <button
                className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => updateFilter('category', 'all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => updateFilter('category', cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Material</h4>
            <div className="filter-options">
              <button
                className={`filter-chip ${activeMaterial === 'all' ? 'active' : ''}`}
                onClick={() => updateFilter('material', 'all')}
              >
                All
              </button>
              {materials.map(mat => (
                <button
                  key={mat}
                  className={`filter-chip ${activeMaterial === mat ? 'active' : ''}`}
                  onClick={() => updateFilter('material', mat)}
                >
                  {mat.charAt(0).toUpperCase() + mat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Occasion</h4>
            <div className="filter-options">
              <button
                className={`filter-chip ${activeOccasion === 'all' ? 'active' : ''}`}
                onClick={() => updateFilter('occasion', 'all')}
              >
                All
              </button>
              {occasions.map(occ => (
                <button
                  key={occ}
                  className={`filter-chip ${activeOccasion === occ ? 'active' : ''}`}
                  onClick={() => updateFilter('occasion', occ)}
                >
                  {occ.charAt(0).toUpperCase() + occ.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => updateFilter('minPrice', e.target.value)}
                className="price-input"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => updateFilter('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="toolbar-left">
              <span className="results-count">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
              {hasActiveFilters && (
                <span className="active-filters-count">
                  ({[activeCategory !== 'all' && 'Category',
                    activeMaterial !== 'all' && 'Material',
                    activeOccasion !== 'all' && 'Occasion',
                    minPrice && 'Price',
                  ].filter(Boolean).length} filters active)
                </span>
              )}
            </div>
            <div className="toolbar-right">
              <div className="view-toggle">
                <button className="view-btn active" title="Grid View">▦</button>
              </div>
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => updateFilter('sort', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {displayedProducts.map(product => (
                  <div key={product.id} className="product-card-wrapper">
                    <button
                      className={`wishlist-btn ${wishlist.has(product.id!) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(product.id!)}
                      aria-label={wishlist.has(product.id!) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {wishlist.has(product.id!) ? '❤️' : '🤍'}
                    </button>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="load-more-section">
                  <button className="btn btn-outline btn-lg load-more-btn" onClick={loadMore}>
                    Load More Products ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="pagination-info">
                Showing {displayedProducts.length} of {filteredProducts.length} products
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later for new arrivals.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
