import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartGst,
    cartTotal,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-page">
        <div className="page-hero cart-hero">
          <div className="container">
            <h1>Shopping Cart</h1>
            <p>Review items in your shopping cart before checkout</p>
          </div>
        </div>
        <div className="container empty-state-container">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your Cart is Empty</h3>
            <p>You haven't added any gorgeous jewelry pieces to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-hero cart-hero">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>Review items in your shopping cart before checkout</p>
        </div>
      </div>

      <div className="container cart-content-wrapper">
        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-column">
            <div className="cart-items-header">
              <h2>Your Items ({cartItems.length})</h2>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => {
                return (
                  <div key={item.product.id} className="cart-item-card">
                    <Link to={`/product/${item.product.id}`} className="cart-item-image">
                      {item.product.images && item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} />
                      ) : (
                        <div className="item-placeholder">✦</div>
                      )}
                    </Link>

                    <div className="cart-item-details">
                      <div className="cart-item-info">
                        <Link to={`/product/${item.product.id}`} className="cart-item-name">
                          {item.product.name}
                        </Link>
                      </div>

                      <div className="cart-item-pricing">
                        <div className="price-info">
                          <span className="current-price">₹{item.product.price.toLocaleString()}</span>
                          {item.product.originalPrice && (
                            <span className="original-price">
                              ₹{item.product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>

                        <div className="item-total-price">
                          <span>Total:</span>
                          <strong>₹{(item.product.price * item.quantity).toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.product.id!)}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-actions-bottom">
              <Link to="/shop" className="btn btn-outline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-column">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>GST (3%)</span>
                  <span>₹{cartGst.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{cartSubtotal > 10000 ? <strong className="free-shipping">FREE</strong> : '₹150'}</span>
                </div>
                {cartSubtotal <= 10000 && (
                  <div className="shipping-notice-alert">
                    Add <strong>₹{(10001 - cartSubtotal).toLocaleString()}</strong> more to get <strong>FREE SHIPPING</strong>!
                  </div>
                )}
                
                <div className="summary-row summary-total">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg btn-block checkout-btn">
                Proceed to Checkout
              </Link>

              <div className="trust-badges">
                <div className="badge-item">
                  <span>🛡️</span> 100% Safe & Secure Checkout
                </div>
                <div className="badge-item">
                  <span>✨</span> BIS Hallmarked Authentic Gold
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
