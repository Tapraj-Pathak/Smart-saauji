import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Basic recommendations based on low/out-of-stock and upcoming expiry
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({});
    const now = new Date();
    const soon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const recs = [];

    for (const p of products) {
      if (p.quantity === 0) {
        recs.push({
          id: String(p._id),
          type: 'stock-up',
          product: p.name,
          message: `Out of stock for ${p.name}. Consider restocking soon.`,
          urgency: 'high'
        });
      } else if (p.quantity <= (p.minStock ?? 10)) {
        recs.push({
          id: String(p._id),
          type: 'stock-up',
          product: p.name,
          message: `${p.name} is low on stock. Recommended to replenish.`,
          urgency: 'medium'
        });
      }

      if (p.expiryDate && new Date(p.expiryDate) >= now && new Date(p.expiryDate) <= soon) {
        recs.push({
          id: `${p._id}-expiry`,
          type: 'seasonal',
          product: p.name,
          message: `${p.name} expires soon. Run promotions to clear inventory.`,
          urgency: 'medium'
        });
      }
    }

    res.json(recs.slice(0, 20));
  } catch (err) { next(err); }
});

export default router;


