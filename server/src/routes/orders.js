import { Router } from 'express';
import { db } from '../firebase-admin.js';
import crypto from 'crypto';

const router = Router();
const ordersCollection = 'orders';

// Helper to check if Razorpay is configured
const isRazorpayConfigured = () => {
  return process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_ID !== 'your-razorpay-key' &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_SECRET !== 'your-razorpay-secret';
};

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, subtotal, gst, total, paymentMode, paymentStatus } = req.body;

    if (!customer || !items || items.length === 0 || !total) {
      return res.status(400).json({ error: 'Customer info, items list, and total amount are required' });
    }

    // Generate custom Order ID: ORD-[YEAR][MONTH][DAY]-[RANDOM]
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `ORD-${dateStr}-${randStr}`;

    const orderData = {
      orderId,
      customer,
      items,
      subtotal: Number(subtotal),
      gst: Number(gst),
      total: Number(total),
      paymentMode,
      paymentStatus: paymentStatus || 'initiated',
      orderStatus: 'placed', // placed -> processing -> quality_check -> shipped -> delivered -> cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in Firestore (mock or real)
    await db.collection(ordersCollection).doc(orderId).set(orderData);

    // If online payment, generate Razorpay Order ID
    if (paymentMode === 'online') {
      if (isRazorpayConfigured()) {
        try {
          const authHeader = 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
          const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: Math.round(total * 100), // paise
              currency: 'INR',
              receipt: orderId
            })
          });

          const rzpData = await rzpResponse.json();
          if (rzpData.id) {
            // Update order with Razorpay Order ID
            await db.collection(ordersCollection).doc(orderId).update({
              razorpayOrderId: rzpData.id
            });
            return res.json({ orderId, razorpayOrderId: rzpData.id });
          } else {
            console.error('Razorpay Order API error response:', rzpData);
            return res.status(500).json({ error: 'Failed to initialize Razorpay checkout order' });
          }
        } catch (rzpErr) {
          console.error('Razorpay API request failed:', rzpErr);
          return res.status(500).json({ error: 'Razorpay integration error' });
        }
      } else {
        // Fallback simulated payment for local development
        await db.collection(ordersCollection).doc(orderId).update({
          razorpayOrderId: 'mock_razorpay_order_id'
        });
        return res.json({ orderId, razorpayOrderId: 'mock_razorpay_order_id' });
      }
    }

    res.json({ orderId, message: 'Order placed successfully (Store pickup)' });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// POST /api/orders/verify - Verify Razorpay Payment Signature
router.post('/verify', async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required' });
    }

    const orderDoc = await db.collection(ordersCollection).doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (isRazorpayConfigured()) {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature !== razorpaySignature) {
        return res.status(400).json({ error: 'Payment signature verification failed' });
      }
    } else {
      console.warn('⚠️ Razorpay keys missing. Verification bypassed in mock mode.');
    }

    // Payment success: Update order status
    await db.collection(ordersCollection).doc(orderId).update({
      paymentStatus: 'paid',
      razorpayPaymentId,
      updatedAt: new Date().toISOString()
    });

    res.json({ status: 'paid', message: 'Payment verified and order placed successfully.' });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET /api/orders - Get all orders matching a phone number
router.get('/', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const snapshot = await db.collection(ordersCollection).get();
    const orders = [];
    const cleanedQueryPhone = String(phone).replace(/\s+/g, '').slice(-10);

    snapshot.forEach(doc => {
      const order = doc.data();
      if (order.customer && order.customer.phone) {
        const cleanedOrderPhone = String(order.customer.phone).replace(/\s+/g, '').slice(-10);
        if (cleanedQueryPhone === cleanedOrderPhone) {
          orders.push({ id: doc.id, ...order });
        }
      }
    });

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// GET /api/orders/:id - Track order by ID and Phone Number
router.get('/:id', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'Registered phone number is required to track order' });
    }

    const doc = await db.collection(ordersCollection).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = doc.data();

    // Verify phone match (removes any leading +91 or whitespace for comparison)
    const cleanedQueryPhone = String(phone).replace(/\s+/g, '').slice(-10);
    const cleanedOrderPhone = String(order.customer.phone).replace(/\s+/g, '').slice(-10);

    if (cleanedQueryPhone !== cleanedOrderPhone) {
      return res.status(403).json({ error: 'Phone number does not match billing records' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error tracking order:', error.message);
    res.status(500).json({ error: 'Failed to retrieve order tracking status' });
  }
});

export default router;
