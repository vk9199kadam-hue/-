import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  purity?: string;
  weight?: string;
}

interface OrderDetails {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  paymentMode: 'online' | 'store';
  paymentStatus: string;
  orderStatus: 'placed' | 'processing' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const statusSteps = [
  { key: 'placed', label: 'Order Confirmed', desc: 'Your order has been placed successfully' },
  { key: 'processing', label: 'Processing', desc: 'Your jewelry is being handcrafted' },
  { key: 'quality_check', label: 'Quality Check', desc: 'Undergoing final purity inspection' },
  { key: 'shipped', label: 'Shipped', desc: 'Dispatched and on its way' },
  { key: 'delivered', label: 'Delivered', desc: 'Order delivered successfully' },
];

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const isNewSuccess = searchParams.get('success') === 'true';

  const [orderIdInput, setOrderIdInput] = useState(queryId);
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);

  // Auto-fetch if orderId query param changes (requires phone validation unless it was just placed)
  useEffect(() => {
    if (queryId) {
      setOrderIdInput(queryId);
      // If we just placed this order, we can fetch it using a mock/temp bypass or let user enter phone
      // Let's check if they provided phone in query parameters or if we can prefill from state
      const queryPhone = searchParams.get('phone') || localStorage.getItem('last_placed_phone') || '';
      if (queryPhone) {
        setPhoneInput(queryPhone);
        fetchTrackingData(queryId, queryPhone);
      }
    }
  }, [queryId]);

  const fetchTrackingData = async (oid: string, phone: string) => {
    setError('');
    setLoading(true);
    setOrderData(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await axios.get(`${API_URL}/orders/${oid}`, {
        params: { phone },
      });
      setOrderData(response.data);
      // Persist phone locally for seamless future tracking
      localStorage.setItem('last_placed_phone', phone);
    } catch (err: any) {
      console.error('Tracking fetch failed:', err);
      setError(err.response?.data?.error || 'Order not found. Please verify Order ID and Phone Number.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput || !phoneInput) {
      setError('Please fill in both fields.');
      return;
    }
    setSearchParams({ id: orderIdInput, phone: phoneInput });
    fetchTrackingData(orderIdInput, phoneInput);
  };

  // Determine class for each timeline step
  const getStepClass = (stepKey: string, currentStatus: string) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    
    const statusOrder = ['placed', 'processing', 'quality_check', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepDot = (stepKey: string, currentStatus: string) => {
    const stepClass = getStepClass(stepKey, currentStatus);
    if (stepClass === 'completed') return '✓';
    if (stepClass === 'active') return '●';
    return '○';
  };

  return (
    <div className="track-order-page">
      <div className="page-hero track-hero">
        <div className="container">
          <h1>Track Your Order</h1>
          <p>Enter your order details to check status</p>
        </div>
      </div>

      <div className="container track-content">
        {isNewSuccess && (
          <div className="success-banner-alert">
            <span className="alert-icon">🎉</span>
            <div className="alert-body">
              <h3>Order Placed Successfully!</h3>
              <p>
                Thank you for your purchase. Your order ID is <strong>{queryId}</strong>. 
                Please enter your phone number below to view tracking details.
              </p>
            </div>
          </div>
        )}

        <div className="track-form-card">
          <h2>Order Tracking</h2>
          <p className="track-desc">
            Enter your Order ID and registered phone number to track your order.
          </p>

          <form onSubmit={handleTrackSubmit} className="track-form">
            <div className="form-group">
              <label htmlFor="orderId">Order ID</label>
              <input
                type="text"
                id="orderId"
                value={orderIdInput}
                onChange={e => setOrderIdInput(e.target.value)}
                placeholder="e.g., ORD-20260531-ABCD"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Registered Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="Enter 10-digit number"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? 'Fetching Details...' : '🔍 Track Order'}
            </button>
          </form>

          {error && (
            <div className="error-message track-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {orderData && (
            <div className="track-result-details">
              <div className="track-header-meta">
                <div>
                  <h3>Order #{orderData.orderId}</h3>
                  <span className="order-date-label">
                    Placed on: {new Date(orderData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-payment-status">
                  Payment: <span className={`status-badge ${orderData.paymentStatus}`}>{orderData.paymentStatus}</span>
                </div>
              </div>

              {orderData.orderStatus === 'cancelled' ? (
                <div className="order-cancelled-notice">
                  🚫 This order has been cancelled. Please contact customer support.
                </div>
              ) : (
                <div className="track-timeline">
                  {statusSteps.map(step => (
                    <div key={step.key} className={`track-step ${getStepClass(step.key, orderData.orderStatus)}`}>
                      <span className="step-dot">{getStepDot(step.key, orderData.orderStatus)}</span>
                      <div className="step-info">
                        <strong>{step.label}</strong>
                        <span>{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Items Summary Preview */}
              <div className="order-items-summary">
                <h4>Items Ordered</h4>
                <div className="summary-list">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="summary-item-row">
                      <span>{item.name} <strong>× {item.quantity}</strong></span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="summary-totals-block">
                    <div className="st-row">
                      <span>Subtotal</span>
                      <span>₹{orderData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="st-row">
                      <span>GST (3%)</span>
                      <span>₹{orderData.gst.toLocaleString()}</span>
                    </div>
                    <div className="st-row total">
                      <span>Total Amount</span>
                      <span>₹{orderData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="track-help">
          <h3>Need Help?</h3>
          <p>If you're having trouble tracking your order, contact us directly.</p>
          <div className="track-help-actions">
            <a href="tel:+919975956777" className="btn btn-primary">📞 Call Us</a>
            <Link to="/contact" className="btn btn-outline">✉️ Send Message</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
