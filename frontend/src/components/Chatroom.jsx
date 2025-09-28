import React, { useState, useEffect, useRef } from 'react';
import { Users, Send, Shuffle, ArrowLeft, User, MessageSquare } from 'lucide-react';

const Chatroom = ({ socket, identity, onBack, onNewIdentity }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        isOwn: message.socketId === socket.id
      }]);
    });

    socket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'SYSTEM',
        text: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
      setConnectedUsers(data.userCount);
    });

    socket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'SYSTEM',
        text: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
      setConnectedUsers(data.userCount);
    });

    socket.on('user-count', (count) => {
      setConnectedUsers(count);
    });

    // Cleanup
    return () => {
      socket.off('new-message');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('user-count');
    };
  }, [socket]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && socket && identity) {
      socket.emit('send-message', {
        text: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    }
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
      if (!response.ok) {
        throw new Error('Failed to generate identity');
      }
      const data = await response.json();
      onNewIdentity(data);
      
      // Rejoin chat with new identity
      socket.emit('join-chat', data);
      
    } catch (error) {
      console.error('Error generating identity:', error);
      
      // Fallback mock identity
      const mockIdentity = {
        name: "CyberPhantom_" + Math.floor(Math.random() * 9999),
        age: Math.floor(Math.random() * 50) + 18,
        profession: "Digital Nomad",
        personality: ["Mysterious", "Tech-savvy", "Rebellious"],
        background: "A shadow in the digital realm, navigating the endless streams of data.",
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`
      };
      onNewIdentity(mockIdentity);
      socket.emit('join-chat', mockIdentity);
    }
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
      {/* Header */}
      <div className="bg-black border-b-2 border-green-500 p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-green-500 hover:text-green-300 transition-colors flex items-center space-x-2 p-2 border border-green-500 hover:border-green-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">EXIT</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold neon-glow">
            NEURAL_CHATROOM
          </h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-1 border border-green-500">
            <Users className="h-4 w-4" />
            <span>{connectedUsers} ONLINE</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Identity sidebar */}
        <div className="w-80 bg-black border-r-2 border-green-500 p-4 flex-shrink-0 overflow-y-auto hidden lg:block">
          <div className="mb-6">
            <h3 className="text-green-500 text-lg mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              YOUR MASK
            </h3>
            {identity && (
              <div className="bg-black border-2 border-green-500 p-4 text-sm space-y-3">
                <div>
                  <span className="text-green-300 font-bold">ID:</span>
                  <div className="text-green-400 ml-2">{identity.name}</div>
                </div>
                <div>
                  <span className="text-green-300 font-bold">AGE:</span>
                  <div className="text-green-400 ml-2">{identity.age}</div>
                </div>
                <div>
                  <span className="text-green-300 font-bold">ROLE:</span>
                  <div className="text-green-400 ml-2">{identity.profession}</div>
                </div>
                <div>
                  <span className="text-green-300 font-bold">TRAITS:</span>
                  <div className="ml-2">
                    {identity.personality?.map((trait, i) => (
                      <div key={i} className="text-green-400 text-xs">• {trait}</div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-green-600">
                  <span className="text-green-300 font-bold text-xs">BACKGROUND:</span>
                  <div className="mt-2 text-xs leading-relaxed text-green-400">
                    {identity.background}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={generateNewIdentity}
            disabled={isGenerating}
            className="w-full bg-transparent border-2 border-green-500 text-green-500 py-3 px-4 hover:bg-green-500 hover:text-black transition-all duration-200 text-sm disabled:opacity-50 font-mono"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <Shuffle className="animate-spin mr-2 h-4 w-4" />
                RESHUFFLING...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Shuffle className="mr-2 h-4 w-4" />
                NEW IDENTITY
              </span>
            )}
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {messages.length === 0 && (
              <div className="text-center text-green-300 mt-20">
                <div className="mb-4 text-4xl">👁️</div>
                <div className="text-lg mb-2">The neural network awaits...</div>
                <div className="text-sm opacity-75">Start the conversation and let chaos unfold</div>
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
                  <div className={msg.isSystem ? 'text-center' : ''}>{msg.text}</div>
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
                className="bg-green-500 text-black px-6 py-3 hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-500 font-mono font-bold"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-green-600 font-mono">
              {newMessage.length}/500 characters • Press Enter to send
            </div>
          </div>
        </div>

        {/* Mobile identity panel */}
        <div className="lg:hidden fixed top-16 right-4 bg-black border-2 border-green-500 p-3 text-xs max-w-xs z-10">
          {identity && (
            <>
              <div className="text-green-500 font-bold mb-2 flex items-center">
                <User className="mr-1 h-3 w-3" />
                MASK
              </div>
              <div className="space-y-1">
                <div><span className="text-green-300">ID:</span> {identity.name}</div>
                <div><span className="text-green-300">ROLE:</span> {identity.profession}</div>
              </div>
              <button
                onClick={generateNewIdentity}
                disabled={isGenerating}
                className="w-full mt-2 bg-transparent border border-green-500 text-green-500 py-1 px-2 hover:bg-green-500 hover:text-black transition-all duration-200 text-xs"
              >
                {isGenerating ? 'RESHUFFLING...' : 'NEW'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatroom;


