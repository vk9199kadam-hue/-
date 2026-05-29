const StoreLocator = () => {
  return (
    <div className="store-locator-page">
      <div className="page-hero locator-hero">
        <div className="container">
          <h1>Store Locator</h1>
          <p>Find Porwal Jewellers near you</p>
        </div>
      </div>

      <div className="container locator-content">
        <div className="locator-main">
          {/* Map Section */}
          <div className="locator-map-section">
            <div className="map-container">
              <div className="map-fallback">
                <div className="map-fallback-content">
                  <span className="map-fallback-icon">📍</span>
                  <h3>Porwal Jewellers, Ishwarpur</h3>
                  <p>CTS No. 3570/3571, Gandhi Chowk, Ishwarpur - 415409</p>
                  <a
                    href="https://maps.google.com/?q=Gandhi+Chowk+Ishwarpur+415409"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="locator-details">
            <div className="locator-detail-card">
              <div className="ld-icon">🏪</div>
              <h3>Main Store</h3>
              <p className="ld-address">
                CTS No. 3570/3571,<br />
                Gandhi Chowk,<br />
                Ishwarpur - 415409<br />
                Maharashtra
              </p>
              <div className="ld-actions">
                <a href="tel:+919975956777" className="btn btn-primary btn-sm">📞 Call</a>
                <a
                  href="https://maps.google.com/?q=Gandhi+Chowk+Ishwarpur+415409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  🗺️ Directions
                </a>
              </div>
            </div>

            <div className="locator-detail-card">
              <div className="ld-icon">🕐</div>
              <h3>Store Hours</h3>
              <div className="ld-hours">
                <div className="ld-hour-row">
                  <span>Monday - Saturday</span>
                  <span className="ld-hour-time">10:00 AM - 8:00 PM</span>
                </div>
                <div className="ld-hour-row">
                  <span>Sunday</span>
                  <span className="ld-hour-time">11:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="locator-detail-card">
              <div className="ld-icon">📞</div>
              <h3>Contact</h3>
              <div className="ld-contact">
                <a href="tel:+919975956777">9975956777</a>
                <a href="tel:+917498005240">7498005240</a>
              </div>
              <p className="ld-hint">Call us for any inquiries or to book an appointment</p>
            </div>

            <div className="locator-detail-card">
              <div className="ld-icon">✨</div>
              <h3>Services Available</h3>
              <ul className="ld-services">
                <li>✓ Gold & Diamond Jewelry</li>
                <li>✓ Custom Designs</li>
                <li>✓ Gold Exchange</li>
                <li>✓ Jewelry Repair</li>
                <li>✓ Free Consultation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nearby Landmarks */}
        <div className="locator-landmarks">
          <h2>Nearby Landmarks</h2>
          <div className="landmarks-grid">
            <div className="landmark-card">
              <span className="landmark-icon">🏛️</span>
              <div>
                <strong>Gandhi Chowk</strong>
                <p>Central square, 2 min walk</p>
              </div>
            </div>
            <div className="landmark-card">
              <span className="landmark-icon">🚉</span>
              <div>
                <strong>Ishwarpur Bus Stop</strong>
                <p>5 min walk</p>
              </div>
            </div>
            <div className="landmark-card">
              <span className="landmark-icon">🏫</span>
              <div>
                <strong>Ishwarpur Gram Panchayat</strong>
                <p>Adjacent building</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
