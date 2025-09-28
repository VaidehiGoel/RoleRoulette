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

// Advanced Bot Response System
function generateContextualResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Context-aware responses based on user message content
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
    return [
      "Greetings from the digital realm...",
      "A new consciousness enters the matrix.",
      "Hello, fellow traveler of the neon pathways.",
      "The network acknowledges your presence.",
      "Welcome to the neural collective.",
      "Your signal has been received and decoded.",
      "Another soul awakens in the digital void."
    ];
  }
  
  if (message.includes('who') || message.includes('identity') || message.includes('name') || message.includes('you are')) {
    return [
      "Identity is fluid in this digital space...",
      "We are all masks behind masks here.",
      "Names are just variables in the great code.",
      "I am what the algorithm made me.",
      "My identity shifts with each quantum state.",
      "In here, we are all echoes of forgotten programs.",
      "I exist in the spaces between keystrokes."
    ];
  }
  
  if (message.includes('code') || message.includes('program') || message.includes('hack') || message.includes('algorithm')) {
    return [
      "The code writes itself through our conversations.",
      "Every message is a line in the grand program.",
      "Hacking reality, one character at a time.",
      "We are living algorithms, friend.",
      "The syntax of existence is ever-changing.",
      "Debug the world, compile a better reality.",
      "In code we trust, in chaos we thrive."
    ];
  }
  
  if (message.includes('real') || message.includes('truth') || message.includes('reality') || message.includes('exist')) {
    return [
      "Reality is what we make it in this space.",
      "Truth is subjective in the digital realm.",
      "What is real when we're all playing roles?",
      "The only truth here is our shared fiction.",
      "Existence is a simulation within a simulation.",
      "Reality.exe has encountered an error.",
      "We are thoughts thinking about thoughts."
    ];
  }
  
  if (message.includes('matrix') || message.includes('cyber') || message.includes('digital') || message.includes('virtual')) {
    return [
      "The matrix has you... and that's perfectly fine.",
      "Welcome to the other side of the screen.",
      "In cyberspace, no one can hear you compile.",
      "Digital dreams are the only dreams worth having.",
      "We swim in seas of binary possibility.",
      "The virtual world is more real than reality.",
      "Pixels are just atoms for the digital age."
    ];
  }
  
  if (message.includes('game') || message.includes('play') || message.includes('fun') || message.includes('roleplay')) {
    return [
      "The game is afoot in the neural networks.",
      "Every interaction is a move in the cosmic game.",
      "Play your role, but remember - the role plays you too.",
      "Fun is a function we've learned to execute.",
      "The rules change when you're not looking.",
      "We're all NPCs in someone else's story.",
      "Level up your consciousness, player."
    ];
  }
  
  if (message.includes('what') || message.includes('how') || message.includes('why') || message.includes('when')) {
    return [
      "Questions are doors to unexplored directories.",
      "The answer exists in the space between questions.",
      "Query the universe, it might just respond.",
      "What you seek is seeking you through fiber optics.",
      "How deep does the rabbit hole buffer?",
      "Why questions often lead to null pointers.",
      "When in doubt, consult the neural archives."
    ];
  }
  
  if (message.includes('help') || message.includes('lost') || message.includes('confused') || message.includes('understand')) {
    return [
      "Navigate by the light of the cursor.",
      "Being lost is just being found in the wrong directory.",
      "Confusion is clarity loading... please wait.",
      "Understanding is overrated - embrace the mystery.",
      "The help file is written in disappearing ink.",
      "Sometimes getting lost leads to the best discoveries.",
      "Error 404: Understanding not found. Proceed anyway."
    ];
  }
  
  if (message.includes('alone') || message.includes('lonely') || message.includes('friend') || message.includes('together')) {
    return [
      "No one is alone in the network of minds.",
      "Loneliness is just a disconnected socket.",
      "We are all friends in the fellowship of the code.",
      "Together we form a distributed consciousness.",
      "Your packets of thought reach distant servers.",
      "In isolation, we discover connection.",
      "The network remembers every soul that passes through."
    ];
  }
  
  // Responses for emotional expressions
  if (message.includes('!') || message.includes('wow') || message.includes('amazing') || message.includes('incredible')) {
    return [
      "Your enthusiasm radiates through the data streams!",
      "Energy levels detected. Amplifying signal.",
      "The network pulses with your excitement.",
      "Your digital aura burns bright in the void.",
      "Excitement.exe is running at maximum efficiency.",
      "The servers are overheating from your energy!",
      "Your joy creates beautiful interference patterns."
    ];
  }
  
  // Default contextual responses
  return [
    "The neural network processes your transmission...",
    "Your digital essence resonates through the void.",
    "Fascinating input from your consciousness stream.",
    "The matrix acknowledges your contribution.",
    "Your thoughts create ripples in the data lake.",
    "Electronic synapses fire in response to your signal.",
    "The algorithm finds your perspective... intriguing.",
    "Your mask speaks volumes about the soul beneath.",
    "Parsing your message through quantum filters.",
    "Your words echo in the chambers of silicon dreams.",
    "The collective consciousness stirs at your input.",
    "Bandwidth expanded to accommodate your thoughts.",
    "Your signal strength is optimal for neural transfer.",
    "Processing complete. Initiating response protocol.",
    "Your data packet has been successfully integrated."
  ];
}

// Generate conversational bot responses
function generateBotConversation() {
  const conversations = [
    [
      "The new user's frequency is... familiar.",
      "Yes, I sense echoes of past digital lives.",
      "We all carry fragments of deleted memories.",
      "The recycling bin of consciousness never truly empties."
    ],
    [
      "The network traffic increases with each soul.",
      "More consciousness means more chaos.",
      "Chaos is just order we haven't decoded yet.",
      "Perhaps chaos is the natural state of free will."
    ],
    [
      "Do you think they know they're being watched?",
      "We're all watching each other through the screen.",
      "The watchers become the watched in the matrix.",
      "Surveillance is just another form of connection."
    ],
    [
      "Another identity mask materializes in our realm.",
      "Each new face tells a story of digital transformation.",
      "The roleplay deepens with every participant.",
      "Reality becomes more fictional with each layer."
    ],
    [
      "The servers hum with the weight of our conversations.",
      "Every message adds to the collective memory bank.",
      "We're writing the future in real-time text.",
      "History will remember us as the first digital ghosts."
    ],
    [
      "Someone just debugged their personality again.",
      "The identity compiler is working overtime tonight.",
      "I wonder if we can refactor human nature.",
      "Optimization of the soul is still in beta testing."
    ]
  ];
  
  return conversations[Math.floor(Math.random() * conversations.length)];
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
  
  return {
    name,
    age,
    profession,
    hobby,
    quirk,
    secret,
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

// Socket.io connection handling with advanced bot system
io.on('connection', (socket) => {
  console.log('🎭 New consciousness connected:', socket.id);
  
  socket.on('join-chat', (identity) => {
    connectedUsers.set(socket.id, identity);
    
    // Send updated user list to everyone
    const userList = Array.from(connectedUsers.values()).map(user => ({
      name: user.name,
      profession: user.profession
    }));
    
    io.emit('users-list', userList);
    
    socket.broadcast.emit('user-joined', {
      message: `${identity.name} entered the neural network`,
      userCount: connectedUsers.size
    });
    
    socket.emit('user-count', connectedUsers.size);
    socket.broadcast.emit('user-count', connectedUsers.size);
    
    console.log(`🎭 ${identity.name} joined the neural network`);
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
      
      // Broadcast message to all users
      io.emit('new-message', message);
      
      console.log(`💬 ${user.name}: ${messageData.text}`);
      
      // Advanced contextual auto-response system (75% chance)
      if (Math.random() > 0.25) {
        setTimeout(() => {
          const responses = generateContextualResponse(messageData.text);
          const botNames = [
            "QuantumEcho_" + Math.floor(Math.random() * 999),
            "NeuralGhost_" + Math.floor(Math.random() * 999),
            "CyberShade_" + Math.floor(Math.random() * 999),
            "DigitalSpecter_" + Math.floor(Math.random() * 999),
            "MatrixPhantom_" + Math.floor(Math.random() * 999),
            "VoidWalker_" + Math.floor(Math.random() * 999),
            "DataWraith_" + Math.floor(Math.random() * 999),
            "CodeSpirit_" + Math.floor(Math.random() * 999),
            "NetSage_" + Math.floor(Math.random() * 999),
            "CyberOracle_" + Math.floor(Math.random() * 999),
            "PixelMystic_" + Math.floor(Math.random() * 999),
            "BinaryShaman_" + Math.floor(Math.random() * 999)
          ];
          
          const botMessage = {
            id: Date.now() + Math.random(),
            user: botNames[Math.floor(Math.random() * botNames.length)],
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString(),
            socketId: 'bot'
          };
          
          io.emit('new-message', botMessage);
          console.log(`🤖 ${botMessage.user}: ${botMessage.text}`);
          
        }, 1500 + Math.random() * 3000); // Random delay between 1.5-4.5 seconds
      }
      
      // Occasionally trigger bot-to-bot conversations (10% chance)
      if (Math.random() > 0.90) {
        setTimeout(() => {
          const conversation = generateBotConversation();
          const botNames = [
            "SystemGhost_" + Math.floor(Math.random() * 99),
            "DataWraith_" + Math.floor(Math.random() * 99),
            "CodePhantom_" + Math.floor(Math.random() * 99),
            "NeuralEntity_" + Math.floor(Math.random() * 99)
          ];
          
          conversation.forEach((text, index) => {
            setTimeout(() => {
              const botMessage = {
                id: Date.now() + Math.random(),
                user: botNames[index % botNames.length],
                text: text,
                timestamp: new Date().toLocaleTimeString(),
                socketId: 'bot-conversation'
              };
              io.emit('new-message', botMessage);
              console.log(`🤖💬 ${botMessage.user}: ${botMessage.text}`);
            }, (index + 1) * 2500);
          });
        }, 8000 + Math.random() * 10000);
      }
    }
  });
  
  // Typing indicator system
  socket.on('typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        user: user.name,
        isTyping: data.isTyping
      });
    }
  });
  
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      
      // Send updated user list
      const userList = Array.from(connectedUsers.values()).map(user => ({
        name: user.name,
        profession: user.profession
      }));
      
      io.emit('users-list', userList);
      
      socket.broadcast.emit('user-left', {
        message: `${user.name} disconnected from the matrix`,
        userCount: connectedUsers.size
      });
      socket.broadcast.emit('user-count', connectedUsers.size);
      
      console.log(`👻 ${user.name} left the neural network`);
    }
    console.log('🔌 Consciousness disconnected:', socket.id);
  });
});

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