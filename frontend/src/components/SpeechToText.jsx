import React, { useState, useRef } from 'react';

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening]   = useState(false);
  const [error, setError]           = useState('');
  const [copied, setCopied]         = useState(false);
  const recognitionRef              = useRef(null);
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = () => {
    setError('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Not supported. Use Google Chrome.'); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = 'en-US';
    r.onstart  = () => setListening(true);
    r.onend    = () => setListening(false);
    r.onerror  = e => { setError('Mic error: ' + e.error); setListening(false); };
    r.onresult = (e) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++)
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      setTranscript(prev => prev + final);
    };
    recognitionRef.current = r;
    r.start();
  };

  const stop = () => { if (recognitionRef.current) recognitionRef.current.stop(); setListening(false); };
  const copy = () => { navigator.clipboard.writeText(transcript); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const hear = () => { if (!transcript) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(transcript); u.rate = 0.9; window.speechSynthesis.speak(u); };
  const wc = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div style={{ background: 'var(--primary-light)', border: '2px solid var(--primary)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 24 }}>🎤</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 4 }}>Speech-to-Text Assistance</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Speak your thoughts — bypass typing and spelling completely. <strong style={{ color: 'var(--primary-dark)' }}>Works best in Google Chrome.</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <h3>📝 Dictation</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="tool-btn" onClick={() => setTranscript('')}>🗑️ Clear</button>
              <button className="tool-btn" onClick={copy}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
              <button className="tool-btn" onClick={hear} disabled={!transcript}>🔊 Hear Back</button>
            </div>
          </div>
          <div style={{ minHeight: 300, padding: 24, fontSize: 18, lineHeight: 2, color: transcript ? 'var(--text)' : 'var(--text-light)', fontFamily: "'Lexend', sans-serif", letterSpacing: '0.04em' }}>
            {transcript || 'Your spoken words will appear here…\nClick "Start Listening" and speak clearly.'}
          </div>
          <div style={{ padding: '14px 22px', borderTop: '2px solid var(--border)', background: 'var(--bg-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
            {!listening ? (
              <button onClick={startListening} disabled={!isSupported} style={{ padding: '11px 28px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, cursor: isSupported ? 'pointer' : 'not-allowed', opacity: isSupported ? 1 : 0.5 }}>
                🎤 Start Listening
              </button>
            ) : (
              <button onClick={stop} style={{ padding: '11px 28px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                ⏹ Stop — Listening…
              </button>
            )}
            {transcript && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{wc} words</span>}
          </div>
          {error && <div style={{ padding: '12px 22px', background: '#fee2e2', color: '#dc2626', fontSize: 13, fontWeight: 500 }}>⚠️ {error}</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="settings-card">
            <h4>💡 How to Use</h4>
            {['Click "Start Listening"','Allow microphone access','Speak slowly and clearly','Pause between sentences','Click "Stop" when done','Copy or hear text back'].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text}</span>
              </div>
            ))}
          </div>
          <div className="settings-card">
            <h4>📊 Session</h4>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
              <div>📝 Words: <strong style={{ color: 'var(--primary)' }}>{wc}</strong></div>
              <div>📄 Characters: <strong style={{ color: 'var(--primary)' }}>{transcript.length}</strong></div>
              <div>🎤 Status: <strong style={{ color: listening ? '#22c55e' : 'var(--text-muted)' }}>{listening ? 'Listening…' : 'Idle'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
