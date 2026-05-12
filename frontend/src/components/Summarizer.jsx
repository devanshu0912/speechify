import React, { useState } from 'react';
import { api } from '../services/api';

const SAMPLE = `Dyslexia is a neurological learning disorder that impacts reading, writing, and spelling. It affects how the brain processes written language. However, it does not indicate low intelligence or lack of ability.

Dyslexia affects approximately 15 to 20 percent of the global population. It is one of the most common learning disabilities. Despite this prevalence, many individuals remain undiagnosed or unsupported throughout their academic and professional lives.

The challenges posed by dyslexia include phonological processing difficulties, slow reading pace, word recognition issues, and comprehension challenges. These difficulties can lead to frustration, low self-esteem, and anxiety in academic settings.

Modern technology offers promising solutions for dyslexic readers. AI-powered reading assistants can provide personalized support through text-to-speech, adaptive fonts, color overlays, and word-by-word highlighting. These tools help reduce cognitive load and improve comprehension.

With the right support and technology, individuals with dyslexia can achieve remarkable success in both academic and professional settings.`;

const wordCount = (t) => t.trim() ? t.trim().split(/\s+/).length : 0;

export default function Summarizer() {
  const [input, setInput]       = useState(SAMPLE);
  const [summary, setSummary]   = useState('');
  const [keyWords, setKeyWords] = useState([]);
  const [length, setLength]     = useState('medium');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [model, setModel]       = useState('');

  const handleSummarize = async () => {
    if (!input.trim() || input.trim().length < 50) {
      setError('Please enter at least 50 characters of text.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary('');
    setKeyWords([]);
    try {
      const data = await api.summarize(input, length);
      setSummary(data.summary);
      setKeyWords(data.keyWords || []);
      setModel(data.model || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const speakSummary = () => {
    if (!summary) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(summary);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const reduction = summary ? Math.round((1 - wordCount(summary) / wordCount(input)) * 100) : 0;

  return (
    <div>
      {/* AI Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        borderRadius: 'var(--radius)', padding: '18px 22px',
        marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center', color: 'white',
      }}>
        <span style={{ fontSize: 28 }}>🤖</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>
            Powered by Llama 3.3 70B (Groq AI)
          </div>
          <div style={{ fontSize: 13, opacity: 0.88 }}>
            Real AI summarization — not a simple algorithm. Condenses complex text into clear, dyslexia-friendly language.
          </div>
        </div>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginLeft: 'auto' }}>
          🟢 AI Live
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <h3>📋 Original Text</h3>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{wordCount(input)} words</span>
          </div>
          <textarea
            style={{
              width: '100%', minHeight: 300, padding: 20,
              border: 'none', outline: 'none', resize: 'vertical',
              fontFamily: "'Lexend', sans-serif", fontSize: 15,
              lineHeight: 1.8, color: 'var(--text)', background: 'var(--bg-card)',
            }}
            value={input}
            onChange={(e) => { setInput(e.target.value); setSummary(''); setKeyWords([]); setError(''); }}
            placeholder="Paste your article, chapter, or any text here…"
          />
          <div style={{
            padding: '14px 20px', borderTop: '2px solid var(--border)',
            background: 'var(--bg-muted)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Length:</span>
            {['short', 'medium', 'long'].map(l => (
              <button key={l} onClick={() => setLength(l)}
                style={{
                  padding: '6px 14px', borderRadius: 8,
                  border: '2px solid var(--border)',
                  background: length === l ? 'var(--primary)' : 'var(--bg-card)',
                  color: length === l ? 'white' : 'var(--text-muted)',
                  fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
            <button
              onClick={handleSummarize}
              disabled={loading || !input.trim()}
              style={{
                marginLeft: 'auto', padding: '10px 22px',
                background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !loading ? 1 : 0.6,
              }}
            >
              {loading ? '🤖 AI thinking…' : '✨ Summarize with AI'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <h3>✨ AI Summary</h3>
            {summary && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-success">↓ {reduction}% shorter</span>
                <button className="tool-btn" onClick={speakSummary}>🔊 Listen</button>
              </div>
            )}
          </div>

          <div style={{ minHeight: 300, padding: 20 }}>
            {!summary && !loading && !error && (
              <div style={{ color: 'var(--text-light)', textAlign: 'center', paddingTop: 80 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                <div style={{ fontSize: 15 }}>AI summary will appear here</div>
                <div style={{ fontSize: 13, marginTop: 6, color: 'var(--text-light)' }}>
                  Paste text on the left and click Summarize
                </div>
              </div>
            )}

            {loading && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 80 }}>
                <div style={{ fontSize: 48, marginBottom: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>🤖</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Llama AI is reading your text…</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>This takes 2–5 seconds</div>
              </div>
            )}

            {error && (
              <div style={{
                background: '#fee2e2', borderRadius: 10, padding: '16px 20px',
                color: '#dc2626', fontSize: 14, fontWeight: 500,
              }}>
                ⚠️ {error}
                <div style={{ marginTop: 8, fontSize: 12, color: '#991b1b' }}>
                  Make sure your backend is running and GROQ_API_KEY is set in backend/.env
                </div>
              </div>
            )}

            {summary && (
              <div>
                <div style={{
                  fontFamily: "'Lexend', sans-serif",
                  fontSize: 16, lineHeight: 2, color: 'var(--text)', letterSpacing: '0.03em',
                }}>
                  {summary}
                </div>
                {model && (
                  <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-light)' }}>
                    Generated by {model}
                  </div>
                )}
              </div>
            )}
          </div>

          {keyWords.length > 0 && (
            <div style={{ padding: '14px 20px', borderTop: '2px solid var(--border)', background: 'var(--bg-muted)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>
                🔑 Key Words
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {keyWords.map(w => (
                  <span key={w} style={{
                    padding: '4px 14px', background: 'var(--primary-light)',
                    color: 'var(--primary-dark)', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  }}>{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
