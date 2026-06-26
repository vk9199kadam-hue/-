import { Link } from 'react-router-dom';
import { categories } from '../services/firebaseService';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop All', path: '/shop' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Store Locator', path: '/store-locator' },
  { label: 'Track Order', path: '/track-order' },
];

const policyLinks = [
  { label: 'Shipping Policy', path: '/shipping-policy' },
  { label: 'Return & Exchange', path: '/return-policy' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-conditions' },
  { label: 'FAQ', path: '/faq' },
];

const serviceLinks = [
  { label: 'Jewellery Guide', path: '/jewellery-guide' },
  { label: 'Gold Rate', path: '/gold-rate' },
  { label: 'Book Appointment', path: '/book-appointment' },
  { label: 'Gold Exchange', path: '/gold-exchange' },
  { label: 'Buyback Policy', path: '/buyback-policy' },
];

const socialLinks = [
  { icon: '📘', label: 'Facebook', url: '#' },
  { icon: '📷', label: 'Instagram', url: '#' },
  { icon: '▶️', label: 'YouTube', url: '#' },
  { icon: '💬', label: 'WhatsApp', url: '#' },
  { icon: '🐦', label: 'Twitter', url: '#' },
];

const paymentMethods = [
  { icon: '💳', name: 'Visa' },
  { icon: '💳', name: 'Mastercard' },
  { icon: '💳', name: 'RuPay' },
  { icon: '🏦', name: 'Net Banking' },
  { icon: '📱', name: 'UPI' },
  { icon: '💰', name: 'Cash' },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Stay in the Know</h3>
            <p className="newsletter-desc">
              Subscribe to receive updates on new collections, exclusive offers, and jewellery care tips.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-image-wrap">
                <img src="/images/logo.jpg" alt="M/S. RAMESHKUMAR PUKHARAJ M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS Logo" className="footer-logo-img" />
              </div>
              <span className="footer-logo-text">M/S. RAMESHKUMAR PUKHARAJ M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS</span>
            </div>
            <p className="footer-tagline">
              शा. रमेशकुमार पुखराज पोरवाल ज्युवेलर्स
            </p>
            <p className="footer-desc">
              Your trusted destination for exquisite gold, diamond, and silver jewelry.
              Serving Ishwarpur with quality and trust since generations.
            </p>
            <div className="footer-contact-block">
              <div className="footer-contact-item">
                <span className="fc-icon">📍</span>
                <span>CTS No. 3570/3571, Gandhi Chowk, Ishwarpur - 415409</span>
              </div>
              <div className="footer-contact-item">
                <span className="fc-icon">📞</span>
                <span>
                  <a href="tel:+919975956777">9975956777</a> | <a href="tel:+917498005240">7498005240</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <span className="fc-icon">🕐</span>
                <span>Mon-Sat: 10AM-8PM | Sun: 11AM-6PM</span>
              </div>
            </div>
            <div className="footer-social">
              <span className="social-label">Follow Us</span>
              <div className="social-icons">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.url} className="social-link" aria-label={s.label} title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-menu">
              {quickLinks.map((link, i) => (
                <li key={i}><Link to={link.path}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-menu">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id}`}>{cat.icon} {cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Policies */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-menu">
              {serviceLinks.map((link, i) => (
                <li key={i}><Link to={link.path}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Policies</h4>
            <ul className="footer-menu">
              {policyLinks.map((link, i) => (
                <li key={i}><Link to={link.path}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & App Download */}
        <div className="footer-extras">
          <div className="footer-payment">
            <span className="extra-label">We Accept</span>
            <div className="payment-icons">
              {paymentMethods.map((p, i) => (
                <span key={i} className="payment-icon" title={p.name}>
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="footer-apps">
            <span className="extra-label">Download App</span>
            <div className="app-buttons">
              <a href="#" className="app-btn">
                <span className="app-icon">🍎</span>
                <span className="app-text">
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
              </a>
              <a href="#" className="app-btn">
                <span className="app-icon">▶️</span>
                <span className="app-text">
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} M/S. RAMESHKUMAR PUKHARAJ M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-conditions">Terms</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
