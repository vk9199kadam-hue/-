import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this to backend/Firebase
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      <div className="page-hero contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-info-section">
          <h2>Get In Touch</h2>
          <p className="contact-intro">
            Have a question or want to know more about our collection? Reach out to us!
          </p>

          <div className="contact-cards">
            <div className="contact-info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>
                CTS No. 3570/3571,<br />
                Gandhi Chowk,<br />
                Ishwarpur - 415409
              </p>
            </div>

            <div className="contact-info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>
                <a href="tel:+919975956777">9975956777</a><br />
                <a href="tel:+917498005240">7498005240</a>
              </p>
            </div>

            <div className="contact-info-card">
              <div className="info-icon">🕐</div>
              <h3>Business Hours</h3>
              <p>
                Mon - Sat: 10:00 AM - 8:00 PM<br />
                Sunday: 11:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          <div className="contact-map">
            <div className="map-placeholder">
              <div className="map-content">
                <span className="map-icon">📍</span>
                <h3>Porwal Jewellers</h3>
                <p>Gandhi Chowk, Ishwarpur - 415409</p>
                <a
                  href="https://maps.google.com/?q=Gandhi+Chowk+Ishwarpur+415409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>Your message has been sent. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
