// Complete frontend/src/components/Chatroom.jsx - Fixed version

import React, { useState, useEffect, useRef } from 'react';
import { Users, Send, Shuffle, ArrowLeft, User, Clock } from 'lucide-react';

const Chatroom = ({ socket, identity, onBack, onNewIdentity, onIdentityExpired }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('24h 0m');
  const chatEndRef = useRef(null);

  // FIXED: Clean socket event handling
  useEffect(() => {
    if (!socket) return;

    console.log('🔌 Setting up socket listeners...');

    // Remove any existing listeners first
    socket.off('new-message');
    socket.off('user-joined');
    socket.off('user-left');
    socket.off('user-count');
    socket.off('identity-expired');

    // Set up fresh listeners
    const handleNewMessage = (message) => {
      console.log('📨 Received message:', message);
      
      setMessages(prev => {
        // Check if message already exists (prevent duplicates)
        const existsAlready = prev.some(msg => msg.id === message.id);
        if (existsAlready) {
          console.log('⚠️ Duplicate message detected, skipping');
          return prev;
        }
        
        // Determine if it's our own message
        const isOwn = message.socketId === socket.id;
        
        return [...prev, {
          ...message,
          isOwn
        }];
      });
    };

    const handleUserJoined = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: 'SYSTEM',
        text: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
      setConnectedUsers(data.userCount);
    };

    const handleUserLeft = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: 'SYSTEM',
        text: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
      setConnectedUsers(data.userCount);
    };

    const handleUserCount = (count) => {
      setConnectedUsers(count);
    };

    const handleIdentityExpired = () => {
      console.log('⏰ Identity expired');
      onIdentityExpired();
    };

    // Attach listeners
    socket.on('new-message', handleNewMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('user-count', handleUserCount);
    socket.on('identity-expired', handleIdentityExpired);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up socket listeners...');
      socket.off('new-message', handleNewMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('user-count', handleUserCount);
      socket.off('identity-expired', handleIdentityExpired);
    };
  }, [socket, onIdentityExpired]);

  // Timer updates
  useEffect(() => {
    if (!identity) return;

    const updateTimer = () => {
      if (!identity.expiresAt) return;
      
      const now = Date.now();
      const remaining = identity.expiresAt - now;
      
      if (remaining <= 0) {
        setTimeRemaining('EXPIRED');
        onIdentityExpired();
        return;
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    
    return () => clearInterval(interval);
  }, [identity, onIdentityExpired]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FIXED: Simple message sending
  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !identity) return;

    // Check if identity expired
    if (identity.expiresAt && Date.now() > identity.expiresAt) {
      onIdentityExpired();
      return;
    }

    console.log('📤 Sending message:', newMessage);

    // ONLY emit to server - don't add to local state
    socket.emit('send-message', {
      text: newMessage,
      timestamp: new Date().toISOString()
    });
    
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateNewIdentity = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-identity');
      const data = await response.json();
      onNewIdentity(data);
      
      if (socket) {
        socket.emit('join-chat', data);
      }
    } catch (error) {
      console.error('Error generating identity:', error);
    }
    
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const isExpiringSoon = identity && identity.expiresAt && (identity.expiresAt - Date.now()) < (60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
      {/* Header */}
      <div className="bg-black border-b-2 border-green-500 p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-green-500 hover:text-green-300 transition-colors flex items-center space-x-2 p-2 border border-green-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">EXIT</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold">NEURAL_CHATROOM</h1>
          
          <div className={`hidden md:flex items-center space-x-1 text-sm px-2 py-1 border ${
            isExpiringSoon ? 'text-red-400 border-red-500 animate-pulse' : 'text-yellow-400 border-yellow-500'
          }`}>
            <Clock className="h-3 w-3" />
            <span>{timeRemaining}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-1 border border-green-500">
            <Users className="h-4 w-4" />
            <span>{connectedUsers} ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Identity sidebar - simplified */}
        <div className="w-80 bg-black border-r-2 border-green-500 p-4 hidden lg:block">
          <h3 className="text-green-500 text-lg mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            YOUR IDENTITY
          </h3>
          
          {identity && (
            <div className="bg-black border-2 border-green-500 p-4 text-sm space-y-2">
              <div><span className="text-green-300 font-bold">NAME:</span> {identity.name}</div>
              <div><span className="text-green-300 font-bold">AGE:</span> {identity.age}</div>
              <div><span className="text-green-300 font-bold">JOB:</span> {identity.profession}</div>
              <div><span className="text-green-300 font-bold">HOBBY:</span> {identity.hobby}</div>
              <div><span className="text-red-300 font-bold">SECRET:</span> <span className="text-red-400 italic">{identity.secret}</span></div>
            </div>
          )}

          <button
            onClick={generateNewIdentity}
            disabled={isGenerating}
            className="w-full mt-4 bg-transparent border-2 border-green-500 text-green-500 py-2 px-4 hover:bg-green-500 hover:text-black transition-all duration-200"
          >
            {isGenerating ? 'GENERATING...' : 'NEW IDENTITY'}
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-green-300 mt-20">
                <div className="mb-4 text-4xl">👁️</div>
                <div className="text-lg mb-2">The neural network awaits...</div>
                <div className="text-sm opacity-75">Start the conversation</div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 border-2 ${
                  msg.isSystem 
                    ? 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500 text-center text-sm italic'
                    : msg.isOwn 
                      ? 'bg-green-500 text-black border-green-500' 
                      : 'bg-black text-green-400 border-green-500'
                } font-mono`}>
                  {!msg.isSystem && (
                    <div className="text-xs opacity-75 mb-2 flex justify-between items-center">
                      <span className="font-bold">{msg.user}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t-2 border-green-500 p-4 bg-black">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-black border-2 border-green-500 text-green-500 px-4 py-3 focus:outline-none focus:border-green-300 placeholder-green-700 font-mono"
                maxLength={500}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-500 text-black px-6 py-3 hover:bg-green-400 transition-colors disabled:opacity-50 border-2 border-green-500 font-mono font-bold"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;