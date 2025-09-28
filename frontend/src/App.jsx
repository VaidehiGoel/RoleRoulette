// frontend/src/App.jsx - Clean version

import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage.jsx';
import Chatroom from './components/Chatroom.jsx';
import io from 'socket.io-client';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [socket, setSocket] = useState(null);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    console.log('🔌 Initializing socket connection...');
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Global socket listeners
    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []); // Only run once

  const switchToChat = (generatedIdentity) => {
    console.log('🎭 Switching to chat with identity:', generatedIdentity.name);
    setIdentity(generatedIdentity);
    setCurrentView('chat');
    
    if (socket && generatedIdentity) {
      socket.emit('join-chat', generatedIdentity);
    }
  };

  const switchToHome = () => {
    console.log('🏠 Switching to homepage');
    setCurrentView('home');
    setIdentity(null);
  };

  return (
    <div className="min-h-screen bg-black text-green-500">      
      {currentView === 'home' ? (
        <Homepage 
          onEnterChat={switchToChat}
          identity={identity}
          setIdentity={setIdentity}
        />
      ) : (
        <Chatroom 
          socket={socket}
          identity={identity}
          onBack={switchToHome}
          onNewIdentity={setIdentity}
          onIdentityExpired={switchToHome}
        />
      )}
    </div>
  );
};

export default App;