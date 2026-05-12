const express = require('express');
const axios   = require('axios');
const auth    = require('../middleware/auth');
const router  = express.Router();

// ── AI SUMMARIZE ──────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { text, length = 'medium' } = req.body;

    if (!text || text.trim().length < 50)
      return res.status(400).json({ error: 'Text must be at least 50 characters.' });

    if (!process.env.GROQ_API_KEY)
      return res.status(500).json({ error: 'AI service not configured. Add GROQ_API_KEY to .env' });

    const lengthGuide = {
      short:  '2-3 sentences',
      medium: '4-6 sentences',
      long:   '8-10 sentences',
    }[length] || '4-6 sentences';

    const prompt = `You are an AI assistant helping people with dyslexia understand complex text.

Your task:
1. Summarize the following text in ${lengthGuide}
2. Use simple, clear language — short words and short sentences
3. Then list 5-8 key terms from the text as a JSON array

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "summary": "Your summary here in simple language.",
  "keyWords": ["word1", "word2", "word3", "word4", "word5"]
}

TEXT TO SUMMARIZE:
${text.slice(0, 4000)}`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.4,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const raw = response.data.choices[0].message.content.trim();

    // Clean and parse JSON
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    res.json({
      summary:  parsed.summary  || 'Could not generate summary.',
      keyWords: parsed.keyWords || [],
      model:    'Llama 3.3 70B (Groq)',
    });

  } catch (err) {
    console.error('AI Summarize error:', err.message);

    if (err.response?.status === 401)
      return res.status(401).json({ error: 'Invalid Groq API key. Check your .env file.' });

    if (err.response?.status === 429)
      return res.status(429).json({ error: 'AI rate limit reached. Please wait a moment.' });

    if (err.message.includes('JSON'))
      return res.status(500).json({ error: 'AI returned unexpected format. Try again.' });

    res.status(500).json({ error: 'AI service unavailable. Please try again.' });
  }
});

module.exports = router;
