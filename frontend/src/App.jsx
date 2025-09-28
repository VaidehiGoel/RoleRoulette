import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage.jsx';
import Chatroom from './components/Chatroom.jsx';
import io from 'socket.io-client';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [socket, setSocket] = useState(null);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const switchToChat = (generatedIdentity) => {
    setIdentity(generatedIdentity);
    setCurrentView('chat');
    
    if (socket && generatedIdentity) {
      socket.emit('join-chat', generatedIdentity);
    }
  };

  const switchToHome = () => {
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
        />
      )}
    </div>
  );
};

export default App;
