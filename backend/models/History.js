const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  wpm: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Keep max 30 entries per user
HistorySchema.statics.saveForUser = async function(userId, text, wordCount, wpm) {
  await this.create({ userId, text, wordCount, wpm });
  const count = await this.countDocuments({ userId });
  if (count > 30) {
    const oldest = await this.find({ userId }).sort({ date: 1 }).limit(count - 30);
    await this.deleteMany({ _id: { $in: oldest.map(d => d._id) } });
  }
};

module.exports = mongoose.model('History', HistorySchema);
