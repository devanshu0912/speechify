import React, { useState } from 'react';

const LETTERS = [
  { letter: 'b', word: 'book',     confuse: 'd', tip: 'Think of a bed — b is the headboard on the left.' },
  { letter: 'd', word: 'dog',      confuse: 'b', tip: 'Think of a drum — the stick is on the right.' },
  { letter: 'p', word: 'pan',      confuse: 'q', tip: 'p hangs below the line like a person standing.' },
  { letter: 'q', word: 'queen',    confuse: 'p', tip: 'q has its tail going right.' },
  { letter: 'n', word: 'net',      confuse: 'u', tip: 'n has humps going up.' },
  { letter: 'u', word: 'umbrella', confuse: 'n', tip: 'u is open at the top, like a cup.' },
  { letter: 'w', word: 'window',   confuse: 'm', tip: 'w has two valleys going down.' },
  { letter: 'm', word: 'moon',     confuse: 'w', tip: 'm has two humps going up.' },
  { letter: 'f', word: 'fish',     confuse: 't', tip: 'f curves at the top like a fishing hook.' },
];

export default function Practice() {
  const [score, setScore]   = useState(0);
  const [flipped, setFlipped] = useState({});

  const speak = (word) => {
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
    setScore(s => s + 1);
  };

  return (
    <div>
      <div style={{
        background: 'var(--bg-card)', border: '2px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '16px 22px',
        display: 'flex', gap: 32, marginBottom: 24, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{score}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Words Heard</div>
        </div>
        <button onClick={() => setScore(0)} style={{
          marginLeft: 'auto', padding: '8px 16px', background: 'none',
          border: '2px solid var(--border)', borderRadius: 8,
          color: 'var(--text-muted)', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Reset</button>
      </div>

      <div className="practice-grid">
        {LETTERS.map(({ letter, word, confuse, tip }) => (
          <div key={letter} className="practice-card">
            <div className="practice-letter">{letter}</div>
            <div className="practice-word">as in "<strong>{word}</strong>"</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 10 }}>
              Often confused with: <strong style={{ color: 'var(--danger)' }}>{confuse}</strong>
            </div>
            {flipped[letter] && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px', marginBottom: 10, lineHeight: 1.6 }}>
                💡 {tip}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => speak(word)} style={{ padding: '8px 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13 }}>🔊 Hear</button>
              <button onClick={() => setFlipped(f => ({ ...f, [letter]: !f[letter] }))} style={{ padding: '8px 14px', background: 'var(--bg-muted)', color: 'var(--text)', border: '2px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13 }}>💡 Tip</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
