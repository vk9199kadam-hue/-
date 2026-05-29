import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, type Product } from '../services/firebaseService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loader">✦</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-error">
        <div className="container">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Simulated price breakdown (in real app, this would come from backend)
  const goldRate = 7250;
  const makingChargePct = 12;
  const weightInGrams = product.weight ? parseFloat(product.weight) : 10;
  const goldPrice = Math.round(weightInGrams * goldRate * (product.purity === '22K' ? 0.916 : product.purity === '24K' ? 1 : 0.75));
  const makingCharges = Math.round(goldPrice * makingChargePct / 100);
  const gst = Math.round((goldPrice + makingCharges) * 0.03);
  const totalPrice = goldPrice + makingCharges + gst;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/shop">Shop</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/shop?category=${product.category}`} className="breadcrumb-category">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="main-image-wrapper">
              <div className="main-image">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="product-main-img"
                  />
                ) : (
                  <div className="image-placeholder-lg">
                    <span>✦</span>
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    className="gallery-nav gallery-prev"
                    onClick={() => setSelectedImage(prev =>
                      prev === 0 ? product.images!.length - 1 : prev - 1
                    )}
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-nav gallery-next"
                    onClick={() => setSelectedImage(prev =>
                      prev === product.images!.length - 1 ? 0 : prev + 1
                    )}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-info-header">
              <span className="product-category">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              {product.isNewArrival && (
                <span className="product-badge-lg new">New Arrival</span>
              )}
              {product.isFeatured && (
                <span className="product-badge-lg featured">Featured</span>
              )}
            </div>

            <h1 className="product-name-lg">{product.name}</h1>

            {/* Certification Badges */}
            <div className="certification-badges">
              <span className="cert-badge" title="BIS Hallmarked">
                <span className="cert-icon">✅</span> BIS Hallmarked
              </span>
              {product.material === 'diamond' && (
                <span className="cert-badge" title="IGI Certified">
                  <span className="cert-icon">💎</span> IGI Certified
                </span>
              )}
              <span className="cert-badge" title="100% Pure">
                <span className="cert-icon">✨</span> 100% Pure
              </span>
            </div>

            {/* Meta Info */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Material</span>
                <span className="meta-value">{product.material}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Purity</span>
                <span className="meta-value">{product.purity}</span>
              </div>
              {product.weight && (
                <div className="meta-item">
                  <span className="meta-label">Weight</span>
                  <span className="meta-value">{product.weight}g</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">SKU</span>
                <span className="meta-value">#{product.id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="product-price-section">
              <div className="price-display">
                <span className="current-price">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="discount-tag">{discount}% OFF</span>
                  </>
                )}
              </div>

              {/* Price Breakdown Toggle */}
              <button
                className="price-breakup-toggle"
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}
              >
                {showPriceBreakup ? '▼' : '▶'} View Price Breakdown
              </button>

              {showPriceBreakup && (
                <div className="price-breakup">
                  <div className="breakup-row">
                    <span>Gold Value ({weightInGrams}g × ₹{goldRate}/g)</span>
                    <span>₹{goldPrice.toLocaleString()}</span>
                  </div>
                  <div className="breakup-row">
                    <span>Making Charges ({makingChargePct}%)</span>
                    <span>₹{makingCharges.toLocaleString()}</span>
                  </div>
                  <div className="breakup-row">
                    <span>GST (3%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="breakup-row breakup-total">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock</span>
              ) : (
                <span className="out-of-stock">✗ Currently Out of Stock</span>
              )}
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <div className="shipping-item">
                <span>🚚</span>
                <span>Free Shipping on orders above ₹10,000</span>
              </div>
              <div className="shipping-item">
                <span>🔄</span>
                <span>7-Day Easy Return & Exchange</span>
              </div>
              <div className="shipping-item">
                <span>✅</span>
                <span>100% Authentic Products</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              <a href={`tel:+919975956777`} className="btn btn-primary btn-lg product-action-btn">
                📞 Enquire Now
              </a>
              <Link to={`/contact?product=${product.id}`} className="btn btn-outline btn-lg product-action-btn">
                Book Appointment
              </Link>
            </div>

            {/* Store & Service Info */}
            <div className="service-promises">
              <div className="service-promise">
                <span className="sp-icon">📍</span>
                <div>
                  <strong>Visit Our Store</strong>
                  <p>CTS 3570/3571, Gandhi Chowk, Ishwarpur</p>
                </div>
              </div>
              <div className="service-promise">
                <span className="sp-icon">🔄</span>
                <div>
                  <strong>Easy Exchange</strong>
                  <p>Exchange old gold with zero deduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
