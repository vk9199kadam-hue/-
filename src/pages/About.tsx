const About = () => {
  return (
    <div className="about-page">
      <div className="page-hero about-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>शा. रमेशकुमार पुखराज पोरवाल ज्युवेलर्स</p>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-intro-grid">
          <div className="about-text">
            <h2>Our Legacy</h2>
            <p>
              Welcome to <strong>शा. रमेशकुमार पुखराज पोरवाल ज्युवेलर्स</strong>, your trusted
              destination for exquisite jewelry in Ishwarpur. Located at CTS No. 3570/3571,
              Gandhi Chowk, we have been serving our community with pride and dedication.
            </p>
            <p>
              Our journey is built on a foundation of trust, quality, and craftsmanship. Every piece
              in our collection tells a story of meticulous artistry and a commitment to excellence
              that has been passed down through generations.
            </p>
          </div>
          <div className="about-visual">
            <img
              src="/images/models/about-legacy.jpg"
              alt="Porwal Jewellers Craftsmanship"
              className="about-legacy-img"
            />
          </div>
        </section>

        <section className="about-values">
          <h2 className="section-title">Our Values</h2>
          <div className="section-divider" />
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">⚖️</div>
              <h3>Trust & Transparency</h3>
              <p>
                We believe in complete transparency in every transaction. From pricing to purity,
                we provide full clarity to our customers.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Quality Craftsmanship</h3>
              <p>
                Every piece of jewelry is crafted with precision by skilled artisans who bring
                decades of expertise to their work.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💯</div>
              <h3>Certified Purity</h3>
              <p>
                All our gold jewelry is BIS hallmarked, and our diamonds come with international
                certification ensuring their authenticity.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Customer First</h3>
              <p>
                Your satisfaction is our priority. We go above and beyond to ensure you find
                the perfect piece for your special moments.
              </p>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <h2>Visit Our Store</h2>
          <div className="contact-card-lg">
            <div className="contact-detail">
              <h3>📍 Address</h3>
              <p>
                CTS No. 3570/3571,<br />
                Gandhi Chowk,<br />
                Ishwarpur - 415409
              </p>
            </div>
            <div className="contact-detail">
              <h3>📞 Phone</h3>
              <p>
                <a href="tel:+919975956777">9975956777</a><br />
                <a href="tel:+917498005240">7498005240</a>
              </p>
            </div>
            <div className="contact-detail">
              <h3>🕐 Business Hours</h3>
              <p>
                Monday - Saturday: 10:00 AM - 8:00 PM<br />
                Sunday: 11:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
