import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, Zap, Shuffle } from 'lucide-react';

const Homepage = ({ onEnterChat, identity, setIdentity }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    // Generate matrix characters for background effect
    const chars = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    for (let i = 0; i < 100; i++) {
      chars.push({
        char: characters.charAt(Math.floor(Math.random() * characters.length)),
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4
      });
    }
    setMatrixChars(chars);
  }, []);

  const generateIdentity = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-identity');
      if (!response.ok) {
        throw new Error('Failed to generate identity');
      }
      const data = await response.json();
      setIdentity(data);
    } catch (error) {
      console.error('Error generating identity:', error);
      
      // Fallback mock identity
      const mockIdentity = {
  name: "Alex_Thompson" + Math.floor(Math.random() * 999),
  age: Math.floor(Math.random() * 50) + 18,
  profession: "Software Developer",
  hobby: "Playing guitar",
  quirk: "Always wears mismatched socks",
  secret: "Still sleeps with a nightlight",
  background: "Recently moved to the city for work and trying to make new friends.",
  avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`
};
      setIdentity(mockIdentity);
    }
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const enterChatroom = () => {
    if (!identity) {
      generateIdentity().then(() => {
        setTimeout(() => {
          onEnterChat(identity);
        }, 2000);
      });
    } else {
      onEnterChat(identity);
    }
  };

  return (
    <div 
  className="min-h-screen bg-black overflow-hidden relative"
  style={{
    backgroundImage: 'url("/hackerterminal.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
  
>
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-10">
        {matrixChars.map((char, i) => (
          <div
            key={i}
            className="absolute text-green-500 text-sm font-mono animate-pulse"
            style={{
              left: `${char.x}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${char.delay}s`,
              animationDuration: `${char.duration}s`
            }}
          >
            {char.char}
          </div>
        ))}
      </div>

      {/* Code background pattern */}
      <div className="absolute inset-0 opacity-5 p-8">
        <pre className="text-green-500 text-xs leading-relaxed font-mono whitespace-pre-wrap">
          {`function generateIdentity() {
  const traits = await loadTraits();
  const identity = {
    name: randomName(),
    personality: randomTraits(),
    background: generateStory(),
    mask: new DigitalPersona()
  };
  return identity;
}

class DigitalMask {
  constructor(identity) {
    this.identity = identity;
    this.isReal = false;
    this.memories = [];
  }
  
  reveal() {
    return this.identity || "UNKNOWN_USER";
  }
  
  blend() {
    this.consciousness = new Proxy(this, {
      get: (target, prop) => {
        return target[prop] || "CLASSIFIED";
      }
    });
  }
}

const neuralNetwork = {
  users: new Map(),
  connections: new Set(),
  
  addUser(mask) {
    this.users.set(mask.id, mask);
    this.broadcast('USER_JOINED', mask);
  },
  
  removeUser(id) {
    this.users.delete(id);
    this.broadcast('USER_LEFT', id);
  }
};

// Initialize the chaos
neuralNetwork.start();`}
        </pre>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-green-400 tracking-wider mb-4 text-center font-mono neon-glow bg-black bg-opacity-50 px-8 py-4 border-2 border-green-500">
  ROLE ROULETTE
</h1>
          <div className="flex items-center justify-center space-x-2 text-green-400 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg md:text-xl">Who are you, really?</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl text-center mb-12 text-green-300 text-lg md:text-xl leading-relaxed font-mono px-6 py-4 bg-black bg-opacity-70 border border-green-500">
          A social experiment where you don't play yourself. Get assigned a 
          random identity and drop into a neon-lit chatroom. No bios. No 
          profiles. Just masks, chaos, and pure roleplay.
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <button
            onClick={generateIdentity}
            disabled={isGenerating}
            className="group relative overflow-hidden bg-transparent border-2 border-green-500 text-green-500 px-8 py-4 text-xl font-mono tracking-wide hover:bg-green-500 hover:text-black transition-all duration-300 disabled:opacity-50 min-w-[280px]"
          >
            <div className="flex items-center justify-center">
              <Eye className="mr-3 h-6 w-6" />
              {isGenerating ? (
                <>
                  <Shuffle className="animate-spin mr-2 h-5 w-5" />
                  GENERATING...
                </>
              ) : (
                'GENERATE IDENTITY'
              )}
            </div>
          </button>

          <button
            onClick={enterChatroom}
            className="group relative overflow-hidden bg-green-500 text-black px-8 py-4 text-xl font-mono tracking-wide hover:bg-transparent hover:text-green-500 border-2 border-green-500 transition-all duration-300 min-w-[280px]"
          >
            <div className="flex items-center justify-center">
              <MessageCircle className="mr-3 h-6 w-6" />
              ENTER CHATROOM
            </div>
          </button>
        </div>

        {/* Identity preview */}
        {identity && (
  <div className="bg-black bg-opacity-90 border-2 border-green-500 p-6 max-w-lg w-full mx-4 text-green-400 font-mono shadow-lg">
    <h3 className="text-green-500 text-xl mb-4 text-center neon-glow">
      YOUR IDENTITY
    </h3>
    <div className="space-y-3 text-sm">
      <div>
        <span className="text-green-300 font-bold">NAME:</span> 
        <span className="ml-2">{identity.name}</span>
      </div>
      <div>
        <span className="text-green-300 font-bold">AGE:</span> 
        <span className="ml-2">{identity.age}</span>
      </div>
      <div>
        <span className="text-green-300 font-bold">PROFESSION:</span> 
        <span className="ml-2">{identity.profession}</span>
      </div>
      <div>
        <span className="text-green-300 font-bold">HOBBY:</span> 
        <span className="ml-2">{identity.hobby}</span>
      </div>
      <div>
        <span className="text-green-300 font-bold">QUIRK:</span> 
        <span className="ml-2 text-xs">{identity.quirk}</span>
      </div>
      <div className="pt-2 border-t border-green-600">
        <span className="text-green-300 font-bold">SECRET:</span>
        <div className="mt-1 text-xs leading-relaxed text-red-400 italic">
          {identity.secret}
        </div>
      </div>
      <div className="pt-2 border-t border-green-600">
        <span className="text-green-300 font-bold">BACKGROUND:</span>
        <div className="mt-2 text-xs leading-relaxed text-green-400">
          {identity.background}
        </div>
      </div>
    </div>
  </div>
)}


        {/* Footer tags */}
        <div className="mt-12 flex flex-wrap items-center justify-center space-x-4 text-yellow-500 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>EXPERIMENTAL</span>
          </div>
          <span className="hidden md:inline">•</span>
          <span>HACKATHON BUILD</span>
          <span className="hidden md:inline">•</span>
          <span>DIGITAL IDENTITY CHAOS</span>
        </div>
      </div>
    </div>
  );
};

export default Homepage;