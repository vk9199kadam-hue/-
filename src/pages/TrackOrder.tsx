import { useState } from 'react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | 'success' | 'error'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && phone) {
      setTrackingResult('success');
    }
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
        <div className="track-form-card">
          <h2>Order Tracking</h2>
          <p className="track-desc">
            Enter your Order ID and registered phone number to track your order.
          </p>

          {trackingResult === null ? (
            <form onSubmit={handleTrack} className="track-form">
              <div className="form-group">
                <label htmlFor="orderId">Order ID</label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-2026-001"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Registered Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                🔍 Track Order
              </button>
            </form>
          ) : (
            <div className="track-result">
              <div className="track-result-icon">📦</div>
              <h3>Order #{orderId}</h3>
              <div className="track-timeline">
                <div className="track-step completed">
                  <span className="step-dot">✓</span>
                  <div className="step-info">
                    <strong>Order Confirmed</strong>
                    <span>Your order has been placed successfully</span>
                  </div>
                </div>
                <div className="track-step completed">
                  <span className="step-dot">✓</span>
                  <div className="step-info">
                    <strong>Processing</strong>
                    <span>Your jewelry is being prepared</span>
                  </div>
                </div>
                <div className="track-step active">
                  <span className="step-dot">●</span>
                  <div className="step-info">
                    <strong>Quality Check</strong>
                    <span>Undergoing final quality inspection</span>
                  </div>
                </div>
                <div className="track-step">
                  <span className="step-dot">○</span>
                  <div className="step-info">
                    <strong>Shipped</strong>
                    <span>Dispatched and on its way</span>
                  </div>
                </div>
                <div className="track-step">
                  <span className="step-dot">○</span>
                  <div className="step-info">
                    <strong>Delivered</strong>
                    <span>Order delivered successfully</span>
                  </div>
                </div>
              </div>
              <div className="track-estimate">
                <span>Estimated Delivery: 3-5 business days</span>
              </div>
              <button
                className="btn btn-outline"
                onClick={() => setTrackingResult(null)}
              >
                Track Another Order
              </button>
            </div>
          )}
        </div>

        <div className="track-help">
          <h3>Need Help?</h3>
          <p>If you're having trouble tracking your order, contact us directly.</p>
          <div className="track-help-actions">
            <a href="tel:+919975956777" className="btn btn-primary">📞 Call Us</a>
            <a href="/contact" className="btn btn-outline">✉️ Send Message</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
