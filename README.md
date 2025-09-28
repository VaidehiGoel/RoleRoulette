# 🌀 RoleRoulette 

Who are you, really?
This is a social experiment where you don’t play yourself. The app assigns you a random identity (job, personality, quirks) and drops you into a neon hacker-style chatroom.
No profile pics. No bios. Just masks, chaos, and roleplay.

## ✨ Features

- 🎭 Identity Generator → Get a random persona (age, job, personality, quirk) you must roleplay.

- 💬 Realtime Chatroom → Talk to others, but only as your assigned self.

- 🖥 Terminal Aesthetic → Neon green on black, glitch vibes.

- ⏳ Time-Limited Identities → Personas expire after 24h (experimental).

- ⚡ Fast Prototype → Built with React + Express + Socket.io.

## 📂 Tech Stack

- Frontend: React (Vite) + TailwindCSS

- Backend: Node.js + Express

- Realtime: Socket.io

- Styling: CRT terminal + neon graffiti theme

## 🚀 Getting Started
### 1. Clone the repo
- git clone https://github.com/VaidehiGoel/RoleRoulette.git
- cd RoleRoulette

### 2. Setup backend
- cd backend
- npm install
- npm run dev


- Backend runs on 👉 http://localhost:5000

### 3. Setup frontend
- cd ../frontend
- npm install
- npm run dev


- Frontend runs on 👉 http://localhost:3000

## 🧩 File Structure
``` 
RoleRoulette/
├── README.md
├── backend/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── traits.json
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   ├── hackerterminal.png
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       │   └── react.svg
│       └── components/
│           ├── Chatroom.jsx
│           └── Homepage.jsx
```

## 🧪 Hypothesis

- Are we our identities, or just the roles we inhabit?
- By forcing random personas, this app tests whether conversation and connection still feel “real” when everyone knows they’re pretending.

## 🤝 Contributing

- This is an experimental project, so contributions = new chaos.

- Add more traits to traits.json

- Improve glitch effects

- Build the role-break detector

- Try new identity categories (e.g., “phobia,” “catchphrase”)

- Fork, PR, or drop your own wild identity experiments.

- Imrove the chatroom to include real users from around the world

- Add a database to store identities 