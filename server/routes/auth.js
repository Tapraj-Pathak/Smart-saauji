import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const issueToken = (user) => {
  return jwt.sign({ sub: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

router.post('/register', async (req, res, next) => {
  try {

    const { name, email, password, role, panNumber } = req.body;
    if (!email || !password || !panNumber) return res.status(400).json({ message: 'name, email, password and panNumber are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'email already in use' });
    const existingPan = await User.findOne({ panNumber });
    if (existingPan) return res.status(409).json({ message: 'PAN already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role, panNumber });
    const token = issueToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, panNumber: user.panNumber } });

  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });
    const token = issueToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

export default router;


