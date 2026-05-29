import { Link } from 'react-router-dom';
import { categories } from '../services/firebaseService';

const CategorySection = () => {
  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Browse Our Collection</span>
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider" />
        </div>

        <div className="category-grid">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className={`category-card cat-${cat.id}`}
            >
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="category-image" />
                <div className="category-overlay">
                  <div className="category-info-wrap">
                    <span className="category-card-icon">{cat.icon}</span>
                    <h3 className="category-name">{cat.name}</h3>
                    <span className="category-explore">Explore Collection →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
