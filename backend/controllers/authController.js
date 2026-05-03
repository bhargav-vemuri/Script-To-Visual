const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database unavailable.' });

  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database unavailable.' });

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res) {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database unavailable.' });
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const user = await User.findById(req.user.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found.' });

  return res.json({ user: { id: user._id, email: user.email, name: user.name } });
}

module.exports = { register, login, getMe };
