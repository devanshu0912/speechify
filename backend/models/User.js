const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Reading preferences saved per user
  preferences: {
    fontSize:      { type: Number, default: 18 },
    letterSpacing: { type: Number, default: 0.04 },
    lineHeight:    { type: Number, default: 1.9 },
    boldText:      { type: Boolean, default: false },
    overlayColor:  { type: String, default: '#fffbeb' },
    fontFamily:    { type: String, default: "'Lexend', sans-serif" },
    ttsSpeed:      { type: Number, default: 1 },
    darkMode:      { type: Boolean, default: false },
  },
  // Reading statistics
  stats: {
    wordsRead:      { type: Number, default: 0 },
    sessionsToday:  { type: Number, default: 0 },
    avgWpm:         { type: Number, default: 0 },
    streak:         { type: Number, default: 1 },
    lastActiveDate: { type: String, default: '' },
    gameHighScore:  { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
