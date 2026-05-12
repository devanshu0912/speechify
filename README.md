# 🧠 Speechify v4 — Full Stack (React + Node + MongoDB + Groq AI)

Final Year Project — AI-Enabled Personalized Reading Assistant for Dyslexia

---

## 📁 Project Structure

```
speechify4/
├── backend/              ← Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js       ← User schema (preferences + stats)
│   │   └── History.js    ← Reading history schema
│   ├── routes/
│   │   ├── auth.js       ← Login, Signup, Profile, Stats
│   │   ├── history.js    ← Save/Get/Clear reading history
│   │   └── summarize.js  ← Groq AI summarization
│   ├── middleware/
│   │   └── auth.js       ← JWT verification
│   ├── server.js         ← Main Express server
│   ├── .env.example      ← Copy this to .env and fill in values
│   └── package.json
│
└── frontend/             ← React app
    ├── src/
    │   ├── services/
    │   │   └── api.js    ← All API calls in one place
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Reader.jsx
    │   │   ├── Summarizer.jsx   ← Uses Groq AI
    │   │   ├── SpeechToText.jsx
    │   │   ├── WordGame.jsx
    │   │   ├── Practice.jsx
    │   │   ├── History.jsx      ← Loads from MongoDB
    │   │   └── Footer.jsx
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## ⚡ SETUP GUIDE (Step by Step)

### STEP 1 — Get a Free MongoDB Database

1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"** and create an account
3. Create a **free cluster** (M0 tier)
4. Go to **Database Access** → Add a user (username + password)
5. Go to **Network Access** → Add IP → Allow from anywhere (0.0.0.0/0)
6. Go to your cluster → Click **"Connect"** → **"Connect your application"**
7. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/speechify
   ```

---

### STEP 2 — Get a Free Groq AI API Key

1. Go to **https://console.groq.com**
2. Sign up (free — no credit card needed)
3. Go to **API Keys** → Create new key
4. Copy it — looks like: `gsk_xxxxxxxxxxxxxxxxxxxx`

---

### STEP 3 — Set Up the Backend

```bash
cd speechify4/backend

# Copy the example env file
copy .env.example .env
```

Open `.env` in VS Code and fill in your values:
```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/speechify
JWT_SECRET=any_random_string_here_make_it_long
GROQ_API_KEY=gsk_your_key_here
PORT=5000
```

Then install and run:
```bash
npm install
node server.js
```

You should see:
```
✅ MongoDB connected
✅ Server running on http://localhost:5000
✅ Groq AI: Ready
```

Test it by opening: **http://localhost:5000/api/health**

---

### STEP 4 — Set Up the Frontend

Open a **second terminal**:
```bash
cd speechify4/frontend
npm install
npm start
```

The app opens at **http://localhost:3000** ✅

---

## 🔐 How Login Works Now

```
User fills form
    ↓
React calls POST /api/auth/login
    ↓
Express checks MongoDB for user
    ↓
bcrypt verifies password
    ↓
JWT token sent back (valid 7 days)
    ↓
Token stored in localStorage
    ↓
All future API calls use token
```

---

## 🤖 How AI Summarizer Works

```
User pastes text → clicks Summarize
    ↓
React calls POST /api/summarize (with JWT)
    ↓
Express backend calls Groq API
    ↓
Llama 3.3 70B reads and summarizes text
    ↓
Returns simple summary + key words
    ↓
React displays it with Listen button
```

---

## 🗄️ What Gets Saved to MongoDB

| Data | When |
|------|------|
| User account | On signup |
| Hashed password | On signup (bcrypt) |
| Reading history | After each TTS session |
| Words read count | After each TTS session |
| Average WPM | After each TTS session |
| Day streak | On each login |
| Game high score | When you beat your best |

---

## 👥 Team

| Name | Role |
|------|------|
| Devanshu Shukla | Frontend Lead |
| Asif Khan | AI/ML Engineer |
| Dhyan Chandra Singh | Backend Developer |
| Nikhil Kumar | UI/UX Designer |
| Manish Kumar | Database Engineer |

**Supervisor:** Mr. Neeraj Baishwar
**Faculty:** Ms. Pratibha Pandey & Ms. Hima Saxena

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| AI Summarizer | Groq API (Llama 3.3 70B) |
| TTS | Web Speech API |
| STT | Web Speech Recognition API |
| Definitions | Free Dictionary API |
| Fonts | Lexend (dyslexia-friendly) |

---

## ❓ Common Errors

| Error | Fix |
|-------|-----|
| `ECONNREFUSED 5000` | Start the backend first: `node server.js` |
| `MongoDB connection failed` | Check MONGO_URI in .env |
| `Invalid Groq API key` | Check GROQ_API_KEY in .env |
| `npm not found` | Install Node.js from nodejs.org |
| Blank screen on login | Open browser console (F12) for error |
