import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="signin-page">
      <div className="page-hero signin-hero">
        <div className="container">
          <h1>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>
          <p>{mode === 'signin' ? 'Welcome back!' : 'Join the Porwal family'}</p>
        </div>
      </div>

      <div className="container signin-content">
        <div className="signin-card">
          <div className="signin-toggle">
            <button
              className={`signin-toggle-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => setMode('signin')}
            >
              Sign In
            </button>
            <button
              className={`signin-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Register
            </button>
          </div>

          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>{mode === 'signin' ? 'Welcome Back!' : 'Account Created!'}</h3>
              <p>
                {mode === 'signin'
                  ? 'You have been signed in successfully.'
                  : 'Your account has been created. You can now track orders and manage your wishlist.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signin-form">
              {mode === 'signup' && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
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
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="signin-divider">
            <span>or continue as guest</span>
          </div>

          <Link to="/shop" className="btn btn-outline btn-lg btn-block">
            Browse Collection →
          </Link>
        </div>

        <div className="signin-features">
          <h3>Why Create an Account?</h3>
          <ul className="signin-benefits">
            <li>
              <span className="sb-icon">📦</span>
              <div>
                <strong>Track Orders</strong>
                <p>Keep tabs on all your orders in one place</p>
              </div>
            </li>
            <li>
              <span className="sb-icon">❤️</span>
              <div>
                <strong>Wishlist</strong>
                <p>Save your favorite pieces for later</p>
              </div>
            </li>
            <li>
              <span className="sb-icon">⚡</span>
              <div>
                <strong>Express Checkout</strong>
                <p>Faster checkout with saved details</p>
              </div>
            </li>
            <li>
              <span className="sb-icon">🎉</span>
              <div>
                <strong>Exclusive Offers</strong>
                <p>Get notified about special deals first</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
