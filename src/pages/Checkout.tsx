import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, cartGst, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMode, setPaymentMode] = useState<'online' | 'store'>('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty-checkout-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <h3>No items to check out</h3>
            <p>Add some items to your shopping cart before proceeding to checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Browse Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const orderPayload = {
        customer: form,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          images: item.product.images,
          purity: item.product.purity || '',
          weight: item.product.weight || '',
        })),
        subtotal: cartSubtotal,
        gst: cartGst,
        total: cartTotal,
        paymentMode,
      };

      if (paymentMode === 'store') {
        // Direct order creation for store pickup
        const response = await axios.post(`${API_URL}/orders`, {
          ...orderPayload,
          paymentStatus: 'pending_store_pickup',
        });
        clearCart();
        navigate(`/track-order?id=${response.data.orderId}&success=true`);
        return;
      }

      // Online Payment integration (Razorpay)
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Razorpay SDK failed to load. Are you connected to the internet?');
        setLoading(false);
        return;
      }

      // 1. Create order on backend to get Razorpay Order ID
      const orderRes = await axios.post(`${API_URL}/orders`, {
        ...orderPayload,
        paymentStatus: 'initiated',
      });

      const { razorpayOrderId, orderId } = orderRes.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_keys_only',
        amount: cartTotal * 100, // in paisa
        currency: 'INR',
        name: 'Porwal Jewellers',
        description: 'Exquisite Jewellery Purchase',
        image: '/images/logo.jpg',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            setLoading(true);
            // 3. Verify signature on backend
            const verifyRes = await axios.post(`${API_URL}/orders/verify`, {
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.status === 'paid') {
              clearCart();
              navigate(`/track-order?id=${orderId}&success=true`);
            } else {
              setError('Payment verification failed. Please check your bank statement.');
            }
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            setError(err.response?.data?.message || 'Verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#800000', // Maroon brand color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Handle test/mock payment mode when backend responds with mock order ID
      if (razorpayOrderId === 'mock_razorpay_order_id') {
        // Backend generated mock order (when Razorpay is not configured)
        console.warn('Simulating offline mock payment successful...');
        setTimeout(async () => {
          try {
            await axios.post(`${API_URL}/orders/verify`, {
              orderId,
              razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
              razorpayOrderId: 'order_mock_123',
              razorpaySignature: 'mock_sig_456',
            });
            clearCart();
            navigate(`/track-order?id=${orderId}&success=true`);
          } catch (e: any) {
            setError(e.message);
          } finally {
            setLoading(false);
          }
        }, 1500);
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="page-hero checkout-hero">
        <div className="container">
          <h1>Checkout</h1>
          <p>Complete your delivery details and proceed to payment</p>
        </div>
      </div>

      <div className="container checkout-content-wrapper">
        <form onSubmit={handleCheckoutSubmit} className="checkout-grid">
          {/* Billing & Shipping Form */}
          <div className="checkout-form-column">
            <div className="checkout-form-card">
              <h2>Delivery Details</h2>
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="chk-name">Full Name *</label>
                  <input
                    id="chk-name"
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chk-phone">Phone Number *</label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chk-email">Email Address *</label>
                <input
                  id="chk-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="chk-address">Shipping Address *</label>
                <textarea
                  id="chk-address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  required
                  rows={3}
                  placeholder="Street address, Apartment, Suite, etc."
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="chk-city">City *</label>
                  <input
                    id="chk-city"
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    required
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chk-state">State *</label>
                  <input
                    id="chk-state"
                    type="text"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    required
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="chk-pincode">Pincode *</label>
                  <input
                    id="chk-pincode"
                    type="text"
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    required
                    placeholder="6-digit ZIP code"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="checkout-form-card payment-method-card">
              <h2>Select Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option ${paymentMode === 'online' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="online"
                    checked={paymentMode === 'online'}
                    onChange={() => setPaymentMode('online')}
                  />
                  <div className="option-info">
                    <strong>💳 Online Payment (UPI / Card / NetBanking)</strong>
                    <p>Pay securely online using Razorpay gateway. Standard dispatch.</p>
                  </div>
                </label>

                <label className={`payment-option ${paymentMode === 'store' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="store"
                    checked={paymentMode === 'store'}
                    onChange={() => setPaymentMode('store')}
                  />
                  <div className="option-info">
                    <strong>🏪 Pay & Pick Up at Store</strong>
                    <p>Visit our Gandhi Chowk showroom, verify your items, and make payment.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout summary column */}
          <div className="checkout-summary-column">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="checkout-items-preview">
                {cartItems.map(item => (
                  <div key={item.product.id} className="preview-item">
                    <span>
                      {item.product.name} <strong>× {item.quantity}</strong>
                    </span>
                    <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

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
                  <span>{cartSubtotal > 10000 ? 'FREE' : '₹150'}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block order-btn"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : paymentMode === 'online' ? '🔒 Pay & Place Order' : '📝 Reserve Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
