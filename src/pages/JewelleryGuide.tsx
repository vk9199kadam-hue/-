const guideSections = [
  {
    icon: '💍',
    title: 'Understanding Gold Purity',
    subtitle: 'Carats, Hallmarks & Quality',
    content: [
      'Gold purity is measured in carats (K), with 24K being pure gold.',
      '22K gold (91.6% pure) is the most common choice for jewelry in India, offering the perfect balance of purity and durability.',
      '18K gold (75% pure) is more durable and suitable for everyday wear, often used in diamond settings.',
      '14K gold (58.5% pure) offers excellent durability at a more affordable price point.',
      'Look for the BIS hallmark on every piece, which certifies the gold purity.',
    ],
  },
  {
    icon: '💎',
    title: 'Diamond Buying Guide',
    subtitle: 'The 4Cs Explained',
    content: [
      'Cut: Determines a diamond\'s brilliance. Excellent or Ideal cut grades offer maximum sparkle.',
      'Color: Ranks from D (colorless) to Z (light yellow). D-F are considered premium colorless grades.',
      'Clarity: Measures internal flaws. VS1-VS2 offer excellent value with inclusions invisible to the naked eye.',
      'Carat: Refers to weight, not size. 1 carat = 200mg. Choose based on your budget and preference.',
      'Always insist on IGI or GIA certification for assurance of quality.',
    ],
  },
  {
    icon: '🛡️',
    title: 'Jewelry Care & Maintenance',
    subtitle: 'Keep Your Treasure Shining',
    content: [
      'Store jewelry separately in soft pouches to prevent scratches.',
      'Remove jewelry before swimming, showering, or applying lotions/perfumes.',
      'Clean gold jewelry with warm water, mild soap, and a soft brush.',
      'Diamond jewelry should be professionally cleaned every 6 months.',
      'Get your jewelry inspected annually for loose stones or worn prongs.',
    ],
  },
  {
    icon: '⚖️',
    title: 'Gold Rate & Pricing',
    subtitle: 'Understanding What You Pay For',
    content: [
      'The price of gold jewelry includes: gold value + making charges + GST.',
      'Gold value is calculated based on the weight and purity of gold at the current market rate.',
      'Making charges cover the craftsmanship and typically range from 8-15% for standard designs.',
      'GST at 3% is applicable on the total value (gold + making charges).',
      'At M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS, we maintain transparent pricing with no hidden charges.',
    ],
  },
];

const JewelleryGuide = () => {
  return (
    <div className="guide-page">
      <div className="page-hero guide-hero">
        <div className="container">
          <h1>Jewellery Guide</h1>
          <p>Everything you need to know about fine jewelry</p>
        </div>
      </div>

      <div className="container guide-content">
        <div className="guide-intro">
          <h2>Your Complete Resource for Jewelry Knowledge</h2>
          <p>
            Whether you're a first-time buyer or a connoisseur, our comprehensive guide helps you
            make informed decisions about your jewelry purchases.
          </p>
        </div>

        {guideSections.map((section, index) => (
          <section key={index} className="guide-section">
            <div className="guide-section-header">
              <span className="guide-section-icon">{section.icon}</span>
              <div>
                <h2>{section.title}</h2>
                <p className="guide-section-subtitle">{section.subtitle}</p>
              </div>
            </div>
            <ul className="guide-section-list">
              {section.content.map((item, i) => (
                <li key={i} className="guide-list-item">
                  <span className="guide-bullet">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="guide-cta">
          <h3>Ready to Find Your Perfect Piece?</h3>
          <p>Visit our store or contact us for personalized assistance.</p>
          <div className="guide-cta-actions">
            <a href="/shop" className="btn btn-primary btn-lg">
              Browse Collection →
            </a>
            <a href="/contact" className="btn btn-outline btn-lg">
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryGuide;
