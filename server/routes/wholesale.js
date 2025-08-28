import express from 'express';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Simulated wholesale contact endpoint
router.post('/request', requireAuth, async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;
    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Here you would integrate with SMS/Email/API to contact wholesaler.
    // For now, we simulate success and echo details.
    const payload = {
      product: { id: String(product._id), name: product.name },
      requestedQuantity: Math.max(0, quantity),
      note: note || null,
      status: 'sent'
    };
    return res.status(200).json(payload);
  } catch (err) { next(err); }
});

export default router;


