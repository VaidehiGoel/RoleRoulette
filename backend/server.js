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
    names: ['CyberPhantom', 'NeonGhost', 'DigitalNomad', 'CodeBreaker'],
    professions: ['Hacker', 'Digital Artist', 'Data Analyst', 'Cyber Security'],
    personalities: ['Mysterious', 'Rebellious', 'Tech-savvy', 'Enigmatic'],
    backgrounds: ['A shadow in the digital realm', 'Lost in the matrix of code']
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
  const name = getRandomElement(traitsData.names) + '_' + Math.floor(Math.random() * 9999);
  const age = Math.floor(Math.random() * 50) + 18;
  const profession = getRandomElement(traitsData.professions);
  const personality = getRandomElements(traitsData.personalities, Math.floor(Math.random() * 3) + 1);
  const background = getRandomElement(traitsData.backgrounds);
  
  return {
    name,
    age,
    profession,
    personality,
    background,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`
  };
}

// Store connected users
const connectedUsers = new Map();

// Routes
app.get('/api/generate-identity', (req, res) => {
  try {
    const identity = generateRandomIdentity();
    res.json(identity);
  } catch (error) {
    console.error('Error generating identity:', error);
    res.status(500).json({ error: 'Failed to generate identity' });
  }
});

app.get('/api/users/count', (req, res) => {
  res.json({ count: connectedUsers.size });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-chat', (identity) => {
    connectedUsers.set(socket.id, identity);
    socket.broadcast.emit('user-joined', {
      message: `${identity.name} entered the neural network`,
      userCount: connectedUsers.size
    });
    
    socket.emit('user-count', connectedUsers.size);
    socket.broadcast.emit('user-count', connectedUsers.size);
  });
  
  socket.on('send-message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = {
        id: Date.now(),
        user: user.name,
        text: messageData.text,
        timestamp: new Date().toLocaleTimeString(),
        socketId: socket.id
      };
      
      io.emit('new-message', message);
    }
  });
  
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      socket.broadcast.emit('user-left', {
        message: `${user.name} disconnected from the matrix`,
        userCount: connectedUsers.size
      });
      socket.broadcast.emit('user-count', connectedUsers.size);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 ROLEROULETTE server running on port ${PORT}`);
  console.log(`🎭 Neural network initialized...`);
});
