import React, { useState, useEffect, useCallback } from 'react';

const WORD_LEVELS = {
  easy:   [{ word: 'cat', hint: 'Small furry pet' },{ word: 'dog', hint: 'Loyal pet that barks' },{ word: 'book', hint: 'You read pages in this' },{ word: 'fish', hint: 'Lives in water' },{ word: 'bird', hint: 'Has wings and can fly' },{ word: 'tree', hint: 'Has roots and leaves' },{ word: 'moon', hint: 'Shines at night' },{ word: 'star', hint: 'Twinkles in the sky' }],
  medium: [{ word: 'bread', hint: 'Baked food from flour' },{ word: 'light', hint: 'Opposite of darkness' },{ word: 'dream', hint: 'What you see sleeping' },{ word: 'clock', hint: 'Tells you the time' },{ word: 'chair', hint: 'You sit on this' },{ word: 'grape', hint: 'Small round fruit' },{ word: 'train', hint: 'Travels on tracks' },{ word: 'storm', hint: 'Heavy rain and thunder' }],
  hard:   [{ word: 'bridge', hint: 'Crosses over a river' },{ word: 'castle', hint: 'Where kings lived' },{ word: 'forest', hint: 'Large area of trees' },{ word: 'island', hint: 'Land surrounded by water' },{ word: 'mirror', hint: 'Shows your reflection' },{ word: 'planet', hint: 'Earth is one of these' },{ word: 'rocket', hint: 'Travels to space' },{ word: 'jungle', hint: 'Dense tropical forest' }],
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const CORRECT_EMOJIS = ['🎉','🌟','✨','🏆','🎊','💫'];
const WRONG_EMOJIS   = ['💪','😅','🔄','📚'];

export default function WordGame({ onScore, highScore = 0 }) {
  const [level, setLevel]     = useState('easy');
  const [pool, setPool]       = useState([]);
  const [current, setCurrent] = useState(null);
  const [input, setInput]     = useState('');
  const [score, setScore]     = useState(0);
  const [lives, setLives]     = useState(3);
  const [streak, setStreak]   = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(0);

  const initGame = useCallback((lv) => {
    const shuffled = [...WORD_LEVELS[lv]].sort(() => Math.random() - 0.5);
    setPool(shuffled); setCurrent(shuffled[0]);
    setScore(0); setLives(3); setStreak(0);
    setInput(''); setFeedback(null); setGameOver(false);
    setShowHint(false); setAnswered(0);
  }, []);

  useEffect(() => { initGame(level); }, [level, initGame]);

  const speak = (word) => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(word); u.rate = 0.75; window.speechSynthesis.speak(u); };

  const handleSubmit = () => {
    if (!input.trim() || !current) return;
    const correct = input.trim().toLowerCase() === current.word.toLowerCase();
    setAnswered(a => a + 1);
    if (correct) {
      const pts = (showHint ? 5 : 10) + streak * 2;
      const newScore = score + pts;
      setScore(newScore);
      setStreak(s => s + 1);
      setFeedback({ type: 'correct', emoji: pick(CORRECT_EMOJIS), msg: `Correct! +${pts} pts` });
      if (onScore) onScore(newScore);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setFeedback({ type: 'wrong', emoji: pick(WRONG_EMOJIS), msg: `The word was: "${current.word}"` });
      if (newLives <= 0) { setGameOver(true); return; }
    }
    setTimeout(() => {
      const remaining = pool.filter(w => w.word !== current.word);
      if (remaining.length === 0) { setGameOver(true); return; }
      const next = pick(remaining);
      setPool(remaining); setCurrent(next);
      setInput(''); setFeedback(null); setShowHint(false);
      speak(next.word);
    }, 1200);
  };

  if (!current) return null;

  if (gameOver) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{score > 50 ? '🏆' : score > 20 ? '🌟' : '💪'}</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>Game Over!</h2>
      <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{score} pts</div>
      {score > highScore && <div style={{ fontSize: 16, color: '#22c55e', fontWeight: 700, marginBottom: 8 }}>🎉 New High Score saved to MongoDB!</div>}
      <div style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>Personal Best: {Math.max(score, highScore)} pts</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {['easy','medium','hard'].map(lv => (
          <button key={lv} onClick={() => { setLevel(lv); initGame(lv); }} style={{ padding: '12px 24px', background: level === lv ? 'var(--primary)' : 'var(--bg-card)', color: level === lv ? 'white' : 'var(--text)', border: '2px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {lv.charAt(0).toUpperCase() + lv.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['easy','medium','hard'].map(lv => (
          <button key={lv} onClick={() => setLevel(lv)} style={{ padding: '8px 20px', borderRadius: 8, border: '2px solid var(--border)', background: level === lv ? 'var(--primary)' : 'var(--bg-card)', color: level === lv ? 'white' : 'var(--text-muted)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            {lv.charAt(0).toUpperCase() + lv.slice(1)}
          </button>
        ))}
        <button onClick={() => initGame(level)} style={{ marginLeft: 'auto', padding: '8px 16px', border: '2px solid var(--border)', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-muted)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>🔄 Restart</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-muted)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
          🏆 Best: {highScore} pts
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[{ icon: '⭐', val: score, label: 'Score' },{ icon: '🔥', val: streak, label: 'Streak' },{ icon: '❤️', val: '❤️'.repeat(lives) + '🖤'.repeat(3-lives), label: 'Lives' },{ icon: '📊', val: `${WORD_LEVELS[level].length-pool.length+1}/${WORD_LEVELS[level].length}`, label: 'Progress' }].map(({ icon, val, label }) => (
          <div key={label} className="stat-card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-light)', marginBottom: 24 }}>Listen and spell the word</div>
          <button onClick={() => speak(current.word)} style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', border: 'none', fontSize: 40, cursor: 'pointer', boxShadow: '0 8px 24px rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>🔊</button>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 20 }}>Tap the speaker to hear the word again</div>
          {showHint && <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '12px 20px', marginBottom: 16, fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>💡 {current.hint}</div>}
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="Type the word here…" autoFocus
            style={{ width: '100%', padding: '16px 20px', border: '3px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: "'Lexend', sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: '0.1em', textAlign: 'center', color: 'var(--text)', background: 'var(--bg-card)', outline: 'none' }} />
          {feedback && (
            <div style={{ marginTop: 16, padding: '12px 20px', borderRadius: 10, background: feedback.type === 'correct' ? '#dcfce7' : '#fee2e2', color: feedback.type === 'correct' ? '#15803d' : '#dc2626', fontWeight: 700, fontSize: 15 }}>
              {feedback.emoji} {feedback.msg}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {!showHint && <button onClick={() => setShowHint(true)} style={{ flex: 1, padding: 12, border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--text)' }}>💡 Hint (-5 pts)</button>}
            <button onClick={handleSubmit} disabled={!input.trim()} style={{ flex: 2, padding: 12, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.5 }}>✓ Check Spelling</button>
          </div>
        </div>
      </div>
    </div>
  );
}
