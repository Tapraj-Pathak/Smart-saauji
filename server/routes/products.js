import express from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create
router.post('/', requireAuth, requireRole(['owner']), async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

// List with basic search
router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q ? { $text: { $search: String(q) } } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { next(err); }
});

// Get by id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
});

// Update
router.put('/:id', requireAuth, requireRole(['owner']), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { next(err); }
});

// Delete
router.delete('/:id', requireAuth, requireRole(['owner']), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Adjust quantity
router.post('/:id/adjust', requireAuth, requireRole(['owner', 'staff']), async (req, res, next) => {
  try {
    const { delta } = req.body;
    if (typeof delta !== 'number') return res.status(400).json({ message: 'delta must be a number' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    product.quantity = Math.max(0, (product.quantity || 0) + delta);
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
});

export default router;


