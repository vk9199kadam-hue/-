import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories, collections } from '../services/firebaseService';

const menuCategories = [
  {
    title: 'By Category',
    links: categories.map(c => ({
      label: `${c.icon} ${c.name}`,
      path: `/shop?category=${c.id}`
    })),
  },
  {
    title: 'By Metal',
    links: [
      { label: '💛 Gold', path: '/shop?material=gold' },
      { label: '💎 Diamond', path: '/shop?material=diamond' },
      { label: '🤍 Silver', path: '/shop?material=silver' },
      { label: '✨ Platinum', path: '/shop?material=platinum' },
      { label: '🎨 Kundan', path: '/shop?material=kundan' },
    ],
  },
  {
    title: 'By Occasion',
    links: [
      { label: '💒 Wedding', path: '/shop?occasion=wedding' },
      { label: '🎉 Festive', path: '/shop?occasion=festive' },
      { label: '💼 Daily Wear', path: '/shop?occasion=daily' },
      { label: '🎁 Gifting', path: '/shop?occasion=gifting' },
    ],
  },
  {
    title: 'Collections',
    links: collections.slice(0, 6).map(c => ({
      label: c.name,
      path: `/shop?collection=${c.id}`
    })),
  },
];


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const megaRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // scrolling down
        } else {
          setIsVisible(true); // scrolling up
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMegaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${!isVisible ? 'navbar-hidden' : ''}`}>
      {/* Main Navbar */}
      <div className="navbar-main">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <div className="logo-image-wrap">
              <img src="/images/logo.jpg" alt="Porwal Jewellers Logo" className="logo-img" />
            </div>
            <div className="logo-text">
              <span className="logo-title">Porwal Jewellers</span>
              <span className="logo-subtitle">शा. रमेशकुमार पुखराज पोरवाल</span>
            </div>
          </Link>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {navLinks.map(link => {
              const isActive = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mega Menu Trigger */}
            <div
              className="nav-link mega-menu-trigger"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
              ref={megaRef}
            >
              <span className={`mega-trigger-text ${isMegaOpen ? 'active' : ''}`}>
                Categories <span className="mega-arrow">▾</span>
              </span>

              <div className={`mega-menu ${isMegaOpen ? 'show' : ''}`}>
                <div className="mega-menu-container">
                  {menuCategories.map((section, idx) => (
                    <div key={idx} className="mega-column">
                      <h4 className="mega-column-title">{section.title}</h4>
                      <ul className="mega-links">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              to={link.path}
                              className="mega-link"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMegaOpen(false);
                              }}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Spotlight Collection Card */}
                  <div className="mega-spotlight">
                    <div className="mega-spotlight-content">
                      <span className="mega-spotlight-badge">New</span>
                      <h4 className="mega-spotlight-title">Summer Collection 2026</h4>
                      <p className="mega-spotlight-desc">Discover our latest handcrafted pieces</p>
                      <Link
                        to="/shop"
                        className="mega-spotlight-cta"
                        onClick={() => { setIsMenuOpen(false); setIsMegaOpen(false); }}
                      >
                        Explore Now →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop / Mobile Sign In Link */}
            <Link
              to="/sign-in"
              className="nav-link nav-signin-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              👤 Sign In
            </Link>
          </div>

          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
