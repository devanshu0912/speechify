const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://speechify-weld.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/history',   require('./routes/history'));
app.use('/api/summarize', require('./routes/summarize'));

// ── Health check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:   'ok',
    message:  'Speechify backend is running ✅',
    mongodb:  mongoose.connection.readyState === 1 ? 'connected ✅' : 'disconnected ❌',
    groqAI:   process.env.GROQ_API_KEY ? 'configured ✅' : 'not configured ⚠️',
  });
});

// ── Connect MongoDB ───────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Health: http://localhost:${PORT}/api/health`);
      console.log(`${process.env.GROQ_API_KEY ? '✅' : '⚠️ '} Groq AI: ${process.env.GROQ_API_KEY ? 'Ready' : 'No key — add GROQ_API_KEY to .env'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n👉 Fix: Add MONGO_URI to your backend/.env file');
    console.log('👉 Get free DB at https://cloud.mongodb.com\n');
    process.exit(1);
  });
