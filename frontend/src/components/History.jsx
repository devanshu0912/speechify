import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Clear all reading history?')) return;
    try {
      await api.clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      Loading from MongoDB…
    </div>
  );

  if (error) return (
    <div style={{ padding: 20, background: '#fee2e2', borderRadius: 12, color: '#dc2626', fontSize: 14 }}>
      ⚠️ {error} — Make sure the backend is running.
    </div>
  );

  if (history.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No reading history yet</h3>
      <p style={{ color: 'var(--text-light)', fontSize: 14, marginTop: 8 }}>
        Start reading in the Reader tab — sessions are saved to MongoDB.
      </p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {history.length} sessions saved in MongoDB
          </span>
          <span className="badge badge-success">🗄️ Live DB</span>
        </div>
        <button onClick={clearAll} style={{
          padding: '8px 16px', background: 'none', border: '2px solid var(--border)',
          borderRadius: 8, color: 'var(--danger)', fontFamily: 'var(--font)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          🗑️ Clear All
        </button>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div key={item._id} className="history-item">
            <span style={{ fontSize: 20 }}>📄</span>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="history-item-text">{item.text}</div>
              <div className="history-item-meta" style={{ display: 'flex', gap: 12 }}>
                <span>{new Date(item.date).toLocaleString()}</span>
                {item.wordCount > 0 && <span>📖 {item.wordCount} words</span>}
                {item.wpm > 0 && <span>🚀 {item.wpm} WPM</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
