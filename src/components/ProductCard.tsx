import { Link } from 'react-router-dom';
import type { Product } from '../services/firebaseService';

interface ProductCardProps {
  product: Product;
}

const categoryEmoji: Record<string, string> = {
  rings: '💍',
  earrings: '📿',
  necklaces: '📿',
  bracelets: '⛓️',
  bangles: '⭕',
  mangalsutra: '🔴',
  'nose-pins': '✨',
  chains: '🔗',
};

const materialLabel: Record<string, string> = {
  gold: '22K Gold',
  diamond: 'Diamond',
  silver: 'Silver',
  platinum: 'Platinum',
  kundan: 'Kundan',
  polki: 'Polki',
};

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const emoji = categoryEmoji[product.category] || '✦';
  const matLabel = materialLabel[product.material] || product.material;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-placeholder">
            <span>{emoji}</span>
          </div>
        )}
        {discount > 0 && (
          <span className="product-badge discount">{discount}% OFF</span>
        )}
        {product.isNewArrival && (
          <span className="product-badge new">✦ New</span>
        )}
        {product.isFeatured && !product.isNewArrival && (
          <span className="product-badge featured-badge">Featured</span>
        )}

        {/* Quick view hover overlay */}
        <div className="product-card-hover-overlay">
          <span className="product-card-quick-view">View Details →</span>
        </div>
      </div>

      <div className="product-card-info">
        <div className="product-card-top">
          <span className="product-cat-label">{emoji} {product.category.replace('-', ' ')}</span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="product-low-stock">Only {product.stock} left!</span>
          )}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-material">{matLabel} · {product.purity}</p>
        <div className="product-pricing">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="product-original-price">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {product.weight && (
          <span className="product-weight">⚖️ {product.weight} g</span>
        )}

        {/* Features preview */}
        {product.features && product.features.length > 0 && (
          <div className="product-features-preview">
            <span className="product-feature-tag">✓ {product.features[0]}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
