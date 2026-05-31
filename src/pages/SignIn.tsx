import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!auth) {
      console.warn("Firebase not configured. Using local mock customer account.");
      setSubmitted(true);
      localStorage.setItem('userEmail', form.email);
      localStorage.setItem('userName', form.name || 'Valued Customer');
      localStorage.setItem('userPhone', form.phone || '');
      setTimeout(() => {
        setSubmitted(false);
        navigate('/shop');
      }, 2000);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        localStorage.setItem('userEmail', userCredential.user.email || '');
        localStorage.setItem('userName', userCredential.user.displayName || 'Valued Customer');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(userCredential.user, { displayName: form.name });
        localStorage.setItem('userEmail', userCredential.user.email || '');
        localStorage.setItem('userName', form.name);
        localStorage.setItem('userPhone', form.phone);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        navigate('/shop');
      }, 2000);
    } catch (err: any) {
      console.error('Authentication failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
              onClick={() => {
                setMode('signin');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              className={`signin-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setError('');
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>{mode === 'signin' ? 'Welcome Back!' : 'Account Created!'}</h3>
              <p>
                {mode === 'signin'
                  ? 'You have been signed in successfully.'
                  : 'Your account has been created. Redirecting to collections...'}
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
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
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
