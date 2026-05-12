import React from 'react';

export default function Navbar({ user, onLogout, darkMode, setDarkMode }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">🧠</div>
        <span className="nav-brand-name">Speech<span>ify</span></span>
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn" title={darkMode ? 'Light Mode' : 'Dark Mode'} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="nav-user">
          <div className="nav-avatar">{initials}</div>
          <span className="nav-username">{user.name}</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>Sign Out</button>
      </div>
    </nav>
  );
}
