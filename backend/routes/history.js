const express = require('express');
const History = require('../models/History');
const auth    = require('../middleware/auth');
const router  = express.Router();

// ── GET history ───────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const entries = await History.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(30);
    res.json({ history: entries });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── SAVE history entry ────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { text, wordCount, wpm } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required.' });

    await History.saveForUser(req.userId, text, wordCount || 0, wpm || 0);
    res.status(201).json({ message: 'History saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── CLEAR all history ─────────────────────────────────
router.delete('/', auth, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.userId });
    res.json({ message: 'History cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
