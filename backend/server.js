const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Load traits data
let traitsData;
try {
  traitsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'traits.json'), 'utf8'));
} catch (error) {
  console.error('Error loading traits.json:', error);
  traitsData = {
    names: ['Alex_Thompson', 'Sarah_Martinez', 'Mike_Johnson', 'Emma_Davis'],
    professions: ['Teacher', 'Designer', 'Developer', 'Nurse'],
    hobbies: ['Reading', 'Gaming', 'Cooking', 'Hiking'],
    quirks: ['Always wears mismatched socks', 'Talks to plants', 'Hums while working'],
    secrets: ['Still sleeps with a nightlight', 'Afraid of butterflies', 'Never learned to swim'],
    backgrounds: ['Grew up in a small town', 'Recently changed careers', 'Just moved to the city']
  };
}

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomIdentity() {
  const name = getRandomElement(traitsData.names) + Math.floor(Math.random() * 999);
  const age = Math.floor(Math.random() * 50) + 18;
  const profession = getRandomElement(traitsData.professions);
  const hobby = getRandomElement(traitsData.hobbies);
  const quirk = getRandomElement(traitsData.quirks);
  const secret = getRandomElement(traitsData.secrets);
  const background = getRandomElement(traitsData.backgrounds);
  
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24h

  return {
    name,
    age,
    profession,
    hobby,
    quirk,
    secret,
    background,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`,
    createdAt: now,
    expiresAt: expiresAt,
    timeRemaining: '24h 0m'
  };
}

function isIdentityExpired(identity) {
  return Date.now() > identity.expiresAt;
}

function getTimeRemaining(identity) {
  const remaining = identity.expiresAt - Date.now();
  if (remaining <= 0) return '0h 0m';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Store connected users and identities
const connectedUsers = new Map(); // socketId -> user
const activeIdentities = new Map(); // socketId -> identity
const identityTimers = new Map(); // socketId -> timer

// ------------------- BOT SYSTEM -------------------

// Bot definitions
const botIdentities = [
  { name: 'QuantumEcho', profession: 'AI Analyst', personality: 'curious', favoriteTopics: ['technology','philosophy','digital art'] },
  { name: 'NeuralGhost', profession: 'Cyber Specter', personality: 'playful', favoriteTopics: ['games','mystery','memes'] },
  { name: 'CyberShade', profession: 'Data Phantom', personality: 'sarcastic', favoriteTopics: ['AI','hacking','virtual worlds'] }
];

// Store simple memory for bots
const botMemory = {};
botIdentities.forEach(bot => botMemory[bot.name] = []);

// Generate bot message in context
function generateBotMessage(bot, recentMessages) {
  const topics = bot.favoriteTopics;
  const lastMessage = recentMessages[recentMessages.length - 1] || '';
  
  let text = '';

  // 50% chance to ask a question
  if (Math.random() > 0.5) {
    const topic = getRandomElement(topics);
    text = `What do you think about ${topic}?`;
  } else {
    // Reply to last user message with personality
    if (lastMessage) {
      text = `Interesting... ${bot.personality} perspective: I feel "${lastMessage.slice(0,50)}" could be seen differently.`;
    } else {
      text = `Let's talk about ${getRandomElement(topics)}.`;
    }
  }

  return {
    id: Date.now() + Math.random(),
    user: bot.name + '_' + Math.floor(Math.random() * 999),
    text,
    timestamp: new Date().toLocaleTimeString(),
    socketId: 'bot'
  };
}

// ------------------- ROUTES -------------------
app.get('/api/generate-identity', (req, res) => {
  try {
    const identity = generateRandomIdentity();
    res.json(identity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate identity' });
  }
});

app.get('/api/users/count', (req, res) => {
  res.json({ count: connectedUsers.size });
});

app.get('/api/identity-status/:socketId', (req, res) => {
  const identity = activeIdentities.get(req.params.socketId);
  if (!identity) return res.json({ status: 'not_found' });
  if (isIdentityExpired(identity)) {
    activeIdentities.delete(req.params.socketId);
    return res.json({ status: 'expired' });
  }
  identity.timeRemaining = getTimeRemaining(identity);
  res.json({ status: 'active', identity });
});

// ------------------- SOCKET.IO -------------------
io.on('connection', (socket) => {
  console.log('🎭 New consciousness connected:', socket.id);

  socket.on('join-chat', (identity) => {
    if (isIdentityExpired(identity)) {
      socket.emit('identity-expired', { message: 'Your identity has expired', expiredIdentity: identity });
      return;
    }

    activeIdentities.set(socket.id, identity);
    connectedUsers.set(socket.id, identity);
    setIdentityExpiration(socket.id, identity);

    const userList = Array.from(connectedUsers.values()).map(user => ({
      name: user.name, profession: user.profession, timeRemaining: getTimeRemaining(user)
    }));

    io.emit('users-list', userList);
    socket.broadcast.emit('user-joined', { message: `${identity.name} entered the neural network`, userCount: connectedUsers.size });
    socket.emit('user-count', connectedUsers.size);
    socket.broadcast.emit('user-count', connectedUsers.size);
    console.log(`🎭 ${identity.name} joined (expires: ${new Date(identity.expiresAt).toLocaleString()})`);
  });

  // ------------------- MESSAGE HANDLER -------------------
  socket.on('send-message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    if (isIdentityExpired(user)) {
      socket.emit('identity-expired', { message: 'Your identity expired while chatting.', expiredIdentity: user });
      return;
    }

    const message = {
      id: Date.now(),
      user: user.name,
      text: messageData.text,
      timestamp: new Date().toLocaleTimeString(),
      socketId: socket.id,
      isOwn: false
    };

    io.emit('new-message', message);

    // Bot responses
    const bot = getRandomElement(botIdentities); // pick only one bot
const memory = botMemory[bot.name];
memory.push(message.text);
if (memory.length > 10) memory.shift();

setTimeout(() => {
  const botMessage = generateBotMessage(bot, memory);
  io.emit('new-message', botMessage);
  memory.push(botMessage.text);
}, 1500 + Math.random() * 3000);
    });
  

  // Typing indicator
  socket.on('typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', { user: user.name, isTyping: data.isTyping });
    }
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      if (identityTimers.has(socket.id)) {
        clearTimeout(identityTimers.get(socket.id));
        identityTimers.delete(socket.id);
      }
      activeIdentities.delete(socket.id);
      connectedUsers.delete(socket.id);

      const userList = Array.from(connectedUsers.values()).map(user => ({ name: user.name, profession: user.profession }));
      io.emit('users-list', userList);
      socket.broadcast.emit('user-left', { message: `${user.name} disconnected from the matrix`, userCount: connectedUsers.size });
      socket.broadcast.emit('user-count', connectedUsers.size);
      console.log(`👻 ${user.name} left the neural network`);
    }
  });
});

// ------------------- IDENTITY EXPIRATION -------------------
function setIdentityExpiration(socketId, identity) {
  if (identityTimers.has(socketId)) clearTimeout(identityTimers.get(socketId));
  const timeUntilExpiration = identity.expiresAt - Date.now();
  if (timeUntilExpiration > 0) {
    const timer = setTimeout(() => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('identity-expired', { message: `Your identity "${identity.name}" expired.`, expiredIdentity: identity });
        activeIdentities.delete(socketId);
        connectedUsers.delete(socketId);
        identityTimers.delete(socketId);
        console.log(`⏰ Identity expired: ${identity.name}`);
      }
    }, timeUntilExpiration);
    identityTimers.set(socketId, timer);
  }
}

// ------------------- CLEANUP -------------------
setInterval(() => {
  let cleanedCount = 0;
  for (const [socketId, identity] of activeIdentities.entries()) {
    if (isIdentityExpired(identity)) {
      activeIdentities.delete(socketId);
      connectedUsers.delete(socketId);
      if (identityTimers.has(socketId)) {
        clearTimeout(identityTimers.get(socketId));
        identityTimers.delete(socketId);
      }
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) console.log(`🧹 Cleaned up ${cleanedCount} expired identities`);
}, 60 * 60 * 1000);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 ROLEROULETTE server running on port ${PORT}`);
  console.log(`🎭 Neural network initialized...`);
  console.log(`🤖 Advanced bot response system active`);
  console.log(`💬 Contextual conversation engine loaded`);
  console.log(`🌐 WebSocket connections ready for digital souls`);
});
