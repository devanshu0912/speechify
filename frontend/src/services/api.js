

// const getToken = () => localStorage.getItem('speechify_token');

// const headers = () => ({
//   'Content-Type': 'application/json',
//   ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
// });



// const BASE_URL = "https://speechify-offm.onrender.com/api";

// async function request(path, options = {}) {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     headers: headers(),
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || 'Something went wrong');
//   }

//   return data;
// }

// // ── Auth ──────────────────────────────────────────────
// export const api = {
//   signup: (name, email, password) =>
//     request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

//   login: (email, password) =>
//     request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

//   getProfile: () =>
//     request('/auth/profile'),

//   updateStats: (data) =>
//     request('/auth/stats', { method: 'PUT', body: JSON.stringify(data) }),

//   updatePreferences: (prefs) =>
//     request('/auth/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),

//   // ── History ───────────────────────────────────────
//   getHistory: () =>
//     request('/history'),

//   saveHistory: (text, wordCount, wpm) =>
//     request('/history', { method: 'POST', body: JSON.stringify({ text, wordCount, wpm }) }),

//   clearHistory: () =>
//     request('/history', { method: 'DELETE' }),

//   // ── AI Summarize ──────────────────────────────────
//   summarize: (text, length) =>
//     request('/summarize', { method: 'POST', body: JSON.stringify({ text, length }) }),

//   // ── Health check ──────────────────────────────────
//   health: () => request('/health'),
// };

const getToken = () => localStorage.getItem('speechify_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});



const BASE_URL = "https://speechify-offm.onrender.com/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: headers(),
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────
export const api = {
  signup: (name, email, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getProfile: () =>
    request('/auth/profile'),

  updateStats: (data) =>
    request('/auth/stats', { method: 'PUT', body: JSON.stringify(data) }),

  updatePreferences: (prefs) =>
    request('/auth/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),

  // ── History ───────────────────────────────────────
  getHistory: () =>
    request('/history'),

  saveHistory: (text, wordCount, wpm) =>
    request('/history', { method: 'POST', body: JSON.stringify({ text, wordCount, wpm }) }),

  clearHistory: () =>
    request('/history', { method: 'DELETE' }),

  // ── AI Summarize ──────────────────────────────────
  summarize: (text, length) =>
    request('/summarize', { method: 'POST', body: JSON.stringify({ text, length }) }),

  // ── Health check ──────────────────────────────────
  health: () => request('/health'),
};