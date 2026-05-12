import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser]         = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Restore session from localStorage on refresh
    const stored = localStorage.getItem('speechify_user');
    const token  = localStorage.getItem('speechify_token');
    if (stored && token) setUser(JSON.parse(stored));

    const dm = localStorage.getItem('speechify_dark');
    if (dm === 'true') setDarkMode(true);

    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('speechify_dark', darkMode);
  }, [darkMode]);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('speechify_user',  JSON.stringify(userData));
    localStorage.setItem('speechify_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('speechify_user');
    localStorage.removeItem('speechify_token');
  };

  if (loading) return null;

  return (
    <div className={`app-root${darkMode ? ' dark' : ''}`}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
