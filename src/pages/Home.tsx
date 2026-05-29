import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getNewArrivals, getAllProducts, categories, type Product } from '../services/firebaseService';

const testimonials = [
  {
    text: 'Very nice collection and reasonable rates. The staff was very polite and helpful in selecting the perfect ring.',
    author: 'Priya Sharma',
    location: 'Ishwarpur',
    rating: 5,
  },
  {
    text: 'Have been buying from Porwal Jewellers for years. Their purity guarantee and exchange policy is unmatched in the area.',
    author: 'Rajesh Patil',
    location: 'Peth',
    rating: 5,
  },
  {
    text: 'Best place for wedding jewellery in Ishwarpur. They helped design my entire bridal set and it turned out beautiful!',
    author: 'Neha Deshmukh',
    location: 'Islampur',
    rating: 5,
  },
];

const trustFeatures = [
  { icon: '💎', title: '100% BIS Hallmarked', desc: 'All gold jewellery comes with BIS hallmark certification for guaranteed purity.' },
  { icon: '🔬', title: 'Certified Diamonds', desc: 'Every diamond comes with IGI/GIA certification ensuring cut, color, clarity & carat.' },
  { icon: '⚖️', title: 'Transparent Pricing', desc: 'No hidden charges. We show you the exact gold rate, making charges, and total cost.' },
  { icon: '🔄', title: 'Zero Deduction Exchange', desc: 'Exchange your old gold jewellery with zero deduction on purity.' },
  { icon: '🎨', title: 'Custom Designs', desc: 'Get your dream jewellery custom-designed by our expert craftsmen.' },
  { icon: '🤝', title: 'Generations of Trust', desc: 'Serving the community with quality, integrity, and tradition since decades.' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, arrivals, all] = await Promise.all([
          getFeaturedProducts(),
          getNewArrivals(),
          getAllProducts(),
        ]);
        setAllProducts(all);
        setFeaturedProducts(featured.length > 0 ? featured : all.slice(0, 4));
        setNewArrivals(arrivals.length > 0 ? arrivals : all.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterMsg('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setNewsletterMsg(''), 3000);
    }
  };

  return (
    <>
      <HeroSection />
      <CategorySection />

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated Just For You</span>
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-desc">Handpicked pieces that exemplify elegance and craftsmanship</p>
            <div className="section-divider" />
          </div>
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💎</div>
              <p>No featured products yet. Check back soon!</p>
            </div>
          )}
          <div className="section-action">
            <Link to="/shop" className="btn btn-primary btn-lg">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* === COMPLETE STOCK COLLECTION SECTION === */}
      <section className="full-stock-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">All Varieties In Stock</span>
            <h2 className="section-title">Shop Our Collection</h2>
            <p className="section-desc">Browse all {allProducts.length} handcrafted jewellery pieces across every category</p>
            <div className="section-divider" />
          </div>

          {/* Category Filter Tabs */}
          <div className="stock-filter-tabs">
            <button
              className={`stock-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              ✦ All ({allProducts.length})
            </button>
            {categories.map(cat => {
              const count = allProducts.filter(p => p.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  className={`stock-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>No products in this category yet. Check back soon!</p>
            </div>
          )}

          <div className="section-action">
            <Link to="/shop" className="btn btn-outline btn-lg">
              Explore Full Shop →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust/Assurance Section - Tanishq Style */}
      <section className="assurance-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Why Porwal Jewellers</span>
            <h2 className="section-title">The Porwal Assurance</h2>
            <p className="section-desc">Experience the confidence that comes from generations of trust</p>
            <div className="section-divider" />
          </div>
          <div className="assurance-grid">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="assurance-card">
                <div className="assurance-icon">{feature.icon}</div>
                <h3 className="assurance-title">{feature.title}</h3>
                <p className="assurance-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Exchange / Buyback Section */}
      <section className="exchange-section">
        <div className="container">
          <div className="exchange-content">
            <div className="exchange-info">
              <span className="section-subtitle">Exchange Your Old Gold</span>
              <h2 className="exchange-title">Turn Your Old Gold Into New Treasure</h2>
              <p className="exchange-desc">
                Bring in your old gold jewellery from any jeweler, and we'll exchange it
                for new pieces at the best rates. With zero deduction on purity and
                transparent valuation, it's never been easier to refresh your collection.
              </p>
              <ul className="exchange-benefits">
                <li>✓ Zero deduction on gold purity</li>
                <li>✓ Best market rates guaranteed</li>
                <li>✓ Any brand accepted</li>
                <li>✓ Instant exchange at store</li>
              </ul>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Enquire About Exchange →
              </Link>
            </div>
            <div className="exchange-visual">
              <div className="exchange-card-gold">
                <span className="exchange-card-icon">✦</span>
                <div className="exchange-card-info">
                  <span className="exchange-card-label">Gold Rate Today</span>
                  <span className="exchange-card-rate">₹7,250/g</span>
                  <span className="exchange-card-sub">24K Pure Gold</span>
                </div>
              </div>
              <div className="exchange-card-features">
                <div className="exchange-mini-card">
                  <span>🔄</span>
                  <span>Zero Deduction</span>
                </div>
                <div className="exchange-mini-card">
                  <span>💰</span>
                  <span>Best Rates</span>
                </div>
                <div className="exchange-mini-card">
                  <span>✅</span>
                  <span>Instant Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Fresh From Our Workshop</span>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-desc">Discover our latest creations straight from the craftsperson's bench</p>
            <div className="section-divider" />
          </div>
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="product-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>No new arrivals yet. Check back soon!</p>
            </div>
          )}
          <div className="section-action">
            <Link to="/shop?sort=newest" className="btn btn-outline btn-lg">Discover New →</Link>
          </div>
        </div>
      </section>

      {/* Book Appointment / Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="services-grid">
            <div className="service-card service-card-highlight">
              <div className="service-icon">📅</div>
              <h3>Book an Appointment</h3>
              <p>Visit our store for a personalized shopping experience. Browse our collection in person with dedicated assistance.</p>
              <Link to="/contact" className="service-cta">Book Now →</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">📍</div>
              <h3>Find Our Store</h3>
              <p>Located at Gandhi Chowk, Ishwarpur. Easy to find and accessible for all your jewellery needs.</p>
              <Link to="/store-locator" className="service-cta">Get Directions →</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Have a design in mind? Our artisans can bring your vision to life with custom-made jewellery.</p>
              <Link to="/contact" className="service-cta">Enquire Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What Our Customers Say</span>
            <h2 className="section-title">Trusted by Our Community</h2>
            <div className="section-divider" />
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.author.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <span className="testimonial-name">{t.author}</span>
                    <span className="testimonial-location">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="about-brief-section">
        <div className="container">
          <div className="about-brief-content">
            <div className="about-brief-text">
              <span className="section-subtitle">Our Story</span>
              <h2>शा. रमेशकुमार पुखराज<br />पोरवाल ज्युवेलर्स</h2>
              <p>
                Located in the heart of Ishwarpur at Gandhi Chowk, we have been serving our
                community with the finest gold, diamond, and silver jewelry. Our commitment to
                quality, purity, and customer satisfaction has made us a trusted name in the region.
              </p>
              <p>
                Every piece in our collection is crafted with precision and care, reflecting the
                rich cultural heritage of Indian jewelry making. From traditional designs to
                contemporary styles, we offer something for every occasion.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <span className="stat-number-lg">50+</span>
                  <span className="stat-label-sm">Years of Trust</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number-lg">10K+</span>
                  <span className="stat-label-sm">Happy Customers</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number-lg">500+</span>
                  <span className="stat-label-sm">Unique Designs</span>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary btn-lg">Know More →</Link>
            </div>
            <div className="about-brief-image">
              <img
                src="/images/models/about-brief.jpg"
                alt="Porwal Jewellers Legacy"
                className="about-brief-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="home-newsletter-section">
        <div className="container">
          <div className="home-newsletter-content">
            <div className="newsletter-icon-wrap">
              <span className="newsletter-icon">✉️</span>
            </div>
            <h2 className="newsletter-main-title">Stay Connected</h2>
            <p className="newsletter-main-desc">
              Subscribe to receive updates on new collections, exclusive offers, and jewellery care tips.
            </p>
            <form className="home-newsletter-form" onSubmit={handleNewsletter}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="newsletter-main-input"
                  required
                />
                <button type="submit" className="newsletter-main-btn">Subscribe</button>
              </div>
              {newsletterMsg && <p className="newsletter-success">{newsletterMsg}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
