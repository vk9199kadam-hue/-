import { Router } from 'express';
import { auth } from '../firebase-admin.js';

const router = Router();

// POST /api/auth/admin-login - Verify admin credentials and set custom claim
router.post('/admin-login', async (req, res) => {
  try {
    const { idToken, adminSecret } = req.body;

    if (!idToken || !adminSecret) {
      return res.status(400).json({ error: 'ID token and admin secret are required' });
    }

    // Verify the admin secret (configure this in your env)
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'porwal-admin-2024';
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin credentials' });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Set admin custom claim
    await auth.setCustomUserClaims(decodedToken.uid, { admin: true });

    res.json({
      message: 'Admin access granted',
      uid: decodedToken.uid,
      email: decodedToken.email
    });
  } catch (error) {
    console.error('Admin login error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// POST /api/auth/verify - Verify token and check admin status
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      admin: decodedToken.admin || false
    });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
