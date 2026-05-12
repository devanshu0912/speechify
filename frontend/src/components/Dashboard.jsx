import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Reader from './Reader';
import Practice from './Practice';
import History from './History';
import SpeechToText from './SpeechToText';
import Summarizer from './Summarizer';
import WordGame from './WordGame';
import Footer from './Footer';
import { api } from '../services/api';

const TIPS = [
  { title: '🎨 Use Color Overlays', desc: 'Tinted backgrounds (cream, mint, lavender) reduce visual stress and make text easier to track. Based on Irlen Syndrome research.' },
  { title: '🔤 Wider Letter Spacing', desc: 'Increasing letter spacing helps separate characters that blend together — a common challenge in dyslexia.' },
  { title: '📏 Bigger Font Size', desc: 'Text at 20–24px reduces density on screen and makes individual letters much easier to distinguish.' },
  { title: '🔊 Bimodal Reading', desc: 'Using TTS while following along reinforces the connection between written words and sounds. Research shows 30% better retention.' },
  { title: '🎯 Focus Mode', desc: 'Enable Focus Mode in the reader toolbar — it highlights only the current words being spoken, reducing distraction.' },
  { title: '📖 Click for Definitions', desc: 'Click any red-underlined word to instantly see its definition. No need to open a dictionary.' },
  { title: '🎤 Dictate Instead of Type', desc: 'Use the Speech-to-Text tab to speak your thoughts instead of typing — ideal for writing assignments.' },
  { title: '✨ Summarize Long Texts', desc: 'Use the AI Summarizer tab to condense long articles into the most important sentences using Llama AI.' },
];

const TABS = [
  { id: 'reader',    label: 'Reader',       icon: '📖' },
  { id: 'dictate',   label: 'Dictate',      icon: '🎤' },
  { id: 'summarize', label: 'AI Summarize', icon: '✨' },
  { id: 'game',      label: 'Word Game',    icon: '🎮' },
  { id: 'practice',  label: 'Practice',     icon: '🔤' },
  { id: 'history',   label: 'History',      icon: '🕓' },
  { id: 'tips',      label: 'Tips',         icon: '💡' },
];

export default function Dashboard({ user, onLogout, darkMode, setDarkMode }) {
  const [tab, setTab]   = useState('reader');
  const [stats, setStats] = useState(user.stats || { wordsRead: 0, sessionsToday: 0, avgWpm: 0, streak: 1, gameHighScore: 0 });

  const saveHistory = async (text, wordCount, wpm) => {
    try {
      await api.saveHistory(text, wordCount, wpm);
      const updated = await api.updateStats({ wordsRead: wordCount, wpm });
      if (updated.stats) setStats(updated.stats);
    } catch { /* silently fail — don't break reading */ }
  };

  const updateGameScore = async (score) => {
    try {
      const updated = await api.updateStats({ gameScore: score });
      if (updated.stats) setStats(updated.stats);
    } catch {}
  };

  const firstName = user.name.split(' ')[0];

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-label">Tools</div>
          {TABS.map(t => (
            <button key={t.id} className={`sidebar-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="sb-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <div className="sidebar-label">Your Stats</div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-muted)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 2.2 }}>
              <div>📖 {(stats.wordsRead || 0).toLocaleString()} words</div>
              <div>⚡ {stats.sessionsToday || 0} sessions today</div>
              <div>🔥 {stats.streak || 1} day streak</div>
              <div>🎮 Best: {stats.gameHighScore || 0} pts</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-light)', textAlign: 'center' }}>
              Saved to MongoDB 🗄️
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          {tab === 'reader' && (
            <>
              <h1 className="page-title">Hello, {firstName}! 👋</h1>
              <p className="page-subtitle">Your personalized reading space — customized for you.</p>
              <div className="stats-grid">
                {[
                  { icon: '📖', val: (stats.wordsRead || 0).toLocaleString(), label: 'Words Read' },
                  { icon: '⚡', val: stats.sessionsToday || 0,                label: 'Sessions Today' },
                  { icon: '🚀', val: stats.avgWpm > 0 ? stats.avgWpm + ' WPM' : '—', label: 'Reading Speed' },
                  { icon: '🔥', val: (stats.streak || 1) + ' days',           label: 'Streak' },
                ].map(({ icon, val, label }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon">{icon}</div>
                    <div className="stat-value">{val}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>
              <Reader onSaveHistory={saveHistory} />
            </>
          )}

          {tab === 'dictate' && (
            <>
              <h1 className="page-title">Speech-to-Text 🎤</h1>
              <p className="page-subtitle">Speak your thoughts — bypass typing and spelling challenges completely.</p>
              <SpeechToText />
            </>
          )}

          {tab === 'summarize' && (
            <>
              <h1 className="page-title">AI Summarizer ✨</h1>
              <p className="page-subtitle">Real Llama 3.3 AI condenses long texts into clear, simple language.</p>
              <Summarizer />
            </>
          )}

          {tab === 'game' && (
            <>
              <h1 className="page-title">Word Spelling Game 🎮</h1>
              <p className="page-subtitle">Listen, spell, earn points. High score saved to your profile!</p>
              <WordGame onScore={updateGameScore} highScore={stats.gameHighScore || 0} />
            </>
          )}

          {tab === 'practice' && (
            <>
              <h1 className="page-title">Letter Practice 🔤</h1>
              <p className="page-subtitle">Practice commonly confused letters with audio and memory tips.</p>
              <Practice />
            </>
          )}

          {tab === 'history' && (
            <>
              <h1 className="page-title">Reading History 🕓</h1>
              <p className="page-subtitle">Your past reading sessions — stored permanently in MongoDB.</p>
              <History />
            </>
          )}

          {tab === 'tips' && (
            <>
              <h1 className="page-title">Tips & Help 💡</h1>
              <p className="page-subtitle">Research-backed strategies for easier reading with dyslexia.</p>
              <div className="tips-grid">
                {TIPS.map(tip => (
                  <div key={tip.title} className="tip-card">
                    <h3>{tip.title}</h3>
                    <p>{tip.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
