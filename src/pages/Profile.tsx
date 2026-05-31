import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummary {
  id: string;
  orderId: string;
  createdAt: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  items: OrderItem[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string; phone: string } | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const phone = localStorage.getItem('userPhone') || '';

    if (email && name) {
      setUser({ email, name, phone });
      if (phone) {
        fetchOrderHistory(phone);
      }
    }
  }, []);

  const fetchOrderHistory = async (phone: string) => {
    setLoading(true);
    setError('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await axios.get(`${API_URL}/orders`, {
        params: { phone },
      });
      setOrders(response.data);
    } catch (err: any) {
      console.error('Failed to fetch order history:', err);
      setError('Could not retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    navigate('/');
    window.location.reload(); // Reload navbar state
  };

  if (!user) {
    return (
      <div className="profile-page empty-profile-page">
        <div className="page-hero profile-hero">
          <div className="container">
            <h1>Customer Profile</h1>
            <p>Access your orders and manage account preferences</p>
          </div>
        </div>
        <div className="container empty-state-container">
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>Please Sign In</h3>
            <p>You must be signed in to access your profile and view your past orders.</p>
            <Link to="/sign-in" className="btn btn-primary btn-lg">
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-hero profile-hero">
        <div className="container">
          <h1>Welcome, {user.name}!</h1>
          <p>Manage your account settings and track your purchase history</p>
        </div>
      </div>

      <div className="container profile-content-wrapper">
        <div className="profile-grid">
          {/* Account Details */}
          <div className="profile-sidebar-column">
            <div className="profile-card info-card">
              <h2>Account Details</h2>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value"><strong>{user.name}</strong></span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <button className="btn btn-outline btn-block logout-btn" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="profile-main-column">
            <div className="profile-card orders-card">
              <h2>Order History</h2>

              {loading ? (
                <div className="orders-loading">Retrieving orders...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : orders.length > 0 ? (
                <div className="profile-orders-list">
                  {orders.map(order => (
                    <div key={order.orderId} className="profile-order-item">
                      <div className="order-item-header">
                        <div>
                          <strong>Order #{order.orderId}</strong>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="order-total-display">
                          ₹{order.total.toLocaleString()}
                        </div>
                      </div>

                      <div className="order-item-body">
                        <div className="order-products-preview">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="order-product-tag">
                              {item.name} (x{item.quantity})
                            </span>
                          ))}
                        </div>

                        <div className="order-footer-actions">
                          <div className="order-status-pills">
                            <span className={`status-pill payment ${order.paymentStatus}`}>
                              Payment: {order.paymentStatus}
                            </span>
                            <span className={`status-pill delivery ${order.orderStatus}`}>
                              Status: {order.orderStatus}
                            </span>
                          </div>

                          <Link
                            to={`/track-order?id=${order.orderId}&phone=${user.phone}`}
                            className="btn btn-primary btn-sm track-link-btn"
                          >
                            Track Live →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-orders-state">
                  <span className="empty-orders-icon">📦</span>
                  <h3>No Orders Found</h3>
                  <p>You haven't made any purchases yet.</p>
                  <Link to="/shop" className="btn btn-primary">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
