const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const auth     = require('../middleware/auth');
const router   = express.Router();

// ── SIGNUP ────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ error: 'Email is already registered. Please login.' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences, stats: user.stats }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── LOGIN ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: 'Invalid email or password.' });

    // Update streak
    const today = new Date().toDateString();
    if (user.stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = user.stats.lastActiveDate === yesterday.toDateString();
      user.stats.streak = wasYesterday ? user.stats.streak + 1 : 1;
      user.stats.lastActiveDate = today;
      user.stats.sessionsToday  = 0;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences, stats: user.stats }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET PROFILE ───────────────────────────────────────
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── UPDATE PREFERENCES ────────────────────────────────
router.put('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preferences: req.body },
      { new: true }
    ).select('-password');
    res.json({ preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── UPDATE STATS ──────────────────────────────────────
router.put('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { wordsRead, wpm, gameScore } = req.body;

    if (wordsRead)  user.stats.wordsRead     += wordsRead;
    if (wpm)        user.stats.avgWpm         = wpm;
    if (gameScore && gameScore > user.stats.gameHighScore)
                    user.stats.gameHighScore   = gameScore;

    user.stats.sessionsToday += 1;
    user.stats.lastActiveDate = new Date().toDateString();
    await user.save();

    res.json({ stats: user.stats });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
