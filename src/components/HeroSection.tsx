import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    badge: 'Bridal Heritage',
    title: 'Timeless\nHeritage',
    subtitle: 'Celebrate your sacred vows with our masterfully crafted 22K gold bridal sets.',
    cta: 'Explore Bridal',
    link: '/shop?category=necklaces&occasion=wedding',
    bgImage: '/images/models/hero-slide1.jpg',
  },
  {
    badge: 'Antique & Temple',
    title: 'Royal\nGrandeur',
    subtitle: 'Exquisite antique gold designs that represent the rich heritage of Indian craftsmanship.',
    cta: 'View Collection',
    link: '/shop?material=gold',
    bgImage: '/images/models/hero-slide2.jpg',
  },
  {
    badge: 'Diamond Sparkle',
    title: 'Pure\nBrilliance',
    subtitle: 'Dainty, certified diamond jewelry designed to light up your everyday style.',
    cta: 'Shop Diamonds',
    link: '/shop?material=diamond',
    bgImage: '/images/models/hero-slide3.png',
  },
  {
    badge: 'Daily Elegance',
    title: 'Modern\nClassics',
    subtitle: 'Charming daily-wear gold chains and pendants that complement your modern lifestyle.',
    cta: 'Explore Daily Wear',
    link: '/shop?category=chains',
    bgImage: '/images/models/hero-slide4.png',
  },
  {
    badge: 'Festive Glory',
    title: 'Divine\nCrafts',
    subtitle: 'Celebrate the festive season with our signature Kundan & Polki collection, hand-curated for you.',
    cta: 'Discover Kundan',
    link: '/shop?material=kundan',
    bgImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&auto=format&fit=crop&q=80',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="hero-section">
      {/* Background Particles */}
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="hero-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div 
        className="hero-slide"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.75)), url(${slide.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-badge" key={`badge-${currentSlide}`}>
            {slide.badge}
          </div>
          <h1 className="hero-title" key={`title-${currentSlide}`}>
            {slide.title.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p className="hero-subtitle" key={`sub-${currentSlide}`}>
            {slide.subtitle}
          </p>
          <Link to={slide.link} className="hero-cta">
            {slide.cta}
            <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="hero-controls">
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
