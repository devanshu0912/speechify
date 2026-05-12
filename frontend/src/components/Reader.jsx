import React, { useState, useRef, useEffect, useCallback } from 'react';

const SAMPLE = `Welcome to Speechify — your dyslexia-friendly reading companion powered by MongoDB and AI.

Reading can be a wonderful adventure when the right tools support you. Dyslexia affects how the brain processes written language, but with the right assistance — larger fonts, wider spacing, color overlays, and text-to-speech — reading becomes much easier and more enjoyable.

Try clicking any word below to see its definition instantly. You can paste your own text, upload a file, or adjust all the display settings on the right panel.

Click "Read Aloud" and watch words highlight as they are spoken. Use the speed slider to find your perfect reading pace. Your reading history is saved to MongoDB — it persists across sessions!`;

const OVERLAYS = [
  { label: 'White',    value: '#ffffff' },
  { label: 'Cream',   value: '#fffbeb' },
  { label: 'Mint',    value: '#f0fdf4' },
  { label: 'Lavender',value: '#f5f3ff' },
  { label: 'Sky',     value: '#f0f9ff' },
  { label: 'Peach',   value: '#fff7ed' },
];

const FONTS = [
  { label: 'Lexend',  value: "'Lexend', sans-serif" },
  { label: 'Serif',   value: "'DM Serif Display', serif" },
  { label: 'Mono',    value: "'Courier New', monospace" },
];

const HARD_WORDS = new Set(['dyslexia','processing','assistance','adventure','companion','comfortable','extraordinary','precipitation','algorithm','juxtaposition','photosynthesis','approximately','consequently','immediately','particularly','personalized','neurological']);

export default function Reader({ onSaveHistory }) {
  const [text, setText]               = useState(SAMPLE);
  const [isEditing, setIsEditing]     = useState(false);
  const [fontSize, setFontSize]       = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(0.04);
  const [lineHeight, setLineHeight]   = useState(1.9);
  const [boldText, setBoldText]       = useState(false);
  const [overlay, setOverlay]         = useState(OVERLAYS[1]);
  const [font, setFont]               = useState(FONTS[0]);
  const [speed, setSpeed]             = useState(1);
  const [speaking, setSpeaking]       = useState(false);
  const [wordIndex, setWordIndex]     = useState(-1);
  const [progress, setProgress]       = useState(0);
  const [voices, setVoices]           = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [focusMode, setFocusMode]     = useState(false);
  const [definition, setDefinition]   = useState(null);
  const [defPos, setDefPos]           = useState({ top: 0, left: 0 });
  const [readingTime, setReadingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = () => { const v = window.speechSynthesis.getVoices(); if (v.length) { setVoices(v); setSelectedVoice(v[0].name); } };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false); setWordIndex(-1); setProgress(0);
    clearInterval(timerRef.current);
  }, []);

  const handleSpeak = () => {
    if (speaking) { stopSpeech(); return; }
    const clean = text.replace(/\s+/g, ' ').trim();
    const wordList = clean.split(' ');
    const total = wordList.length;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = speed; utterance.pitch = 1;
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    let currentWord = 0;
    utterance.onboundary = e => { if (e.name === 'word') { setWordIndex(currentWord); setProgress(Math.round((currentWord / total) * 100)); currentWord++; } };
    utterance.onstart = () => { setSpeaking(true); timerRef.current = setInterval(() => setReadingTime(t => t + 1), 1000); };
    utterance.onend = () => {
      setSpeaking(false); setWordIndex(-1); setProgress(100);
      clearInterval(timerRef.current);
      const wpm = Math.round((total / (readingTime || 1)) * 60);
      if (onSaveHistory) onSaveHistory(text.slice(0, 80) + '…', total, wpm);
      setTimeout(() => setProgress(0), 1500);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = async (word, e) => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!clean) return;
    const rect = e.target.getBoundingClientRect();
    setDefPos({ top: rect.bottom + window.scrollY + 6, left: Math.min(rect.left + window.scrollX, window.innerWidth - 320) });
    setDefinition({ word: clean, loading: true });
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`);
      const data = await res.json();
      if (data[0]) {
        const m = data[0].meanings[0];
        setDefinition({ word: clean, pos: m.partOfSpeech, def: m.definitions[0].definition });
      } else setDefinition({ word: clean, pos: '', def: 'Definition not found.' });
    } catch { setDefinition({ word: clean, pos: '', def: 'Could not fetch definition.' }); }
  };

  const handleFileUpload = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setText(ev.target.result); setIsEditing(false); };
    reader.readAsText(file);
  };

  const allWords = text.split(' ');
  const textStyle = { fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}em`, lineHeight, fontWeight: boldText ? 600 : 400, fontFamily: font.value, background: overlay.value };

  return (
    <div className="reader-layout">
      {definition && (
        <div className="definition-popup" style={{ top: defPos.top, left: defPos.left }}>
          <button className="close-popup" onClick={() => setDefinition(null)}>×</button>
          <h4>{definition.word}</h4>
          {definition.loading ? <p>Loading…</p> : <><div className="pos">{definition.pos}</div><p>{definition.def}</p></>}
        </div>
      )}

      <div className="card">
        <div className="reader-toolbar">
          <button className={`tool-btn ${isEditing ? 'active' : ''}`} onClick={() => { setIsEditing(!isEditing); stopSpeech(); }}>{isEditing ? '👁️ View' : '✏️ Edit'}</button>
          <label className="tool-btn" style={{ cursor: 'pointer' }}>📁 Upload<input type="file" accept=".txt" style={{ display: 'none' }} onChange={handleFileUpload} /></label>
          <button className="tool-btn" onClick={() => { setText(''); stopSpeech(); }}>🗑️ Clear</button>
          <button className={`tool-btn ${focusMode ? 'active' : ''}`} onClick={() => setFocusMode(!focusMode)}>🎯 Focus</button>
          {speaking && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>🔊 Reading…</span>}
        </div>

        <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>

        {isEditing ? (
          <textarea className="reader-area" value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type your text here…" style={textStyle} rows={12} />
        ) : (
          <div className="reader-area" style={{ ...textStyle, opacity: focusMode && !speaking ? 0.5 : 1 }} onClick={() => setDefinition(null)}>
            {allWords.map((word, i) => {
              const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
              return (
                <React.Fragment key={i}>
                  <span className={`word ${i === wordIndex ? 'highlighted' : ''} ${HARD_WORDS.has(clean) ? 'hard-word' : ''}`}
                    onClick={e => { e.stopPropagation(); handleWordClick(word, e); }}
                    title={HARD_WORDS.has(clean) ? 'Click for definition' : ''}
                  >{word}</span>
                  {i < allWords.length - 1 ? ' ' : ''}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div className="reader-footer">
          <button className={`btn-speak ${speaking ? 'speaking' : ''}`} onClick={handleSpeak}>
            {speaking ? (<><div className="wave-bars">{[1,2,3,4,5].map(n => <div key={n} className="wave-bar" />)}</div> Stop</>) : '▶ Read Aloud'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>SPEED</span>
            <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: 80 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{speed}×</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-light)', marginLeft: 'auto' }}>{allWords.length} words</span>
        </div>
      </div>

      <div className="settings-stack">
        <div className="settings-card">
          <h4>🎤 Voice</h4>
          <select className="voice-select" value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}>
            {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        </div>

        <div className="settings-card">
          <h4>📐 Display</h4>
          {[
            { label: 'Font Size', min: 14, max: 32, step: 1, val: fontSize, set: setFontSize, disp: fontSize + 'px' },
            { label: 'Spacing',   min: 0,  max: 0.2, step: 0.01, val: letterSpacing, set: setLetterSpacing, disp: letterSpacing.toFixed(2) },
            { label: 'Line Height', min: 1.2, max: 3.5, step: 0.1, val: lineHeight, set: setLineHeight, disp: lineHeight.toFixed(1) },
          ].map(({ label, min, max, step, val, set, disp }) => (
            <div key={label} className="setting-row">
              <span className="setting-label">{label}</span>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))} />
              <span className="setting-value">{disp}</span>
            </div>
          ))}
          <div className="setting-row">
            <span className="setting-label">Bold Text</span>
            <label className="toggle-switch"><input type="checkbox" checked={boldText} onChange={e => setBoldText(e.target.checked)} /><span className="toggle-slider" /></label>
          </div>
        </div>

        <div className="settings-card">
          <h4>🔤 Font</h4>
          <div className="font-btns">
            {FONTS.map(f => <button key={f.label} className={`font-btn ${font.value === f.value ? 'sel' : ''}`} style={{ fontFamily: f.value }} onClick={() => setFont(f)}>{f.label}</button>)}
          </div>
        </div>

        <div className="settings-card">
          <h4>🎨 Background</h4>
          <div className="swatches">
            {OVERLAYS.map(o => <div key={o.value} className={`swatch ${overlay.value === o.value ? 'sel' : ''}`} style={{ background: o.value, border: '2px solid #e5e7eb' }} title={o.label} onClick={() => setOverlay(o)} />)}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>💡 Click underlined words for definition</p>
        </div>
      </div>
    </div>
  );
}
