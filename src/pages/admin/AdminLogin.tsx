import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { adminLogin } from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth) {
      console.warn("Firebase not configured. Using local developer bypass mode.");
      if (email === 'admin@porwaljewellers.com' && password === 'admin123' && adminSecret === 'porwal-admin-2024') {
        localStorage.setItem('adminToken', 'mock-developer-admin-token');
        navigate('/admin/dashboard');
        return;
      }
      setError('Firebase not configured. For developer bypass, use: admin@porwaljewellers.com / admin123 / porwal-admin-2024');
      return;
    }

    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Verify admin secret on backend
      await adminLogin(idToken, adminSecret);

      // Store token
      localStorage.setItem('adminToken', idToken);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <span className="admin-logo">✦</span>
          <h1>Admin Panel</h1>
          <p>M/S. RAMESHKUMAR PUKHARAJ PORWAL JEWELLERS</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@porwaljewellers.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-secret">Admin Secret Key</label>
            <input
              id="admin-secret"
              type="password"
              value={adminSecret}
              onChange={e => setAdminSecret(e.target.value)}
              placeholder="Enter admin secret key"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
