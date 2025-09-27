import { useState, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { Button } from '@/components/ui/button';
import { Send, Users, Clock, Shield } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  persona: string;
}

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    user: 'N3ON_R4V3N',
    content: 'Anyone else feeling like the digital walls are closing in? My job as a network architect is making me paranoid about everything...',
    timestamp: new Date(Date.now() - 300000),
    persona: 'Paranoid Network Architect'
  },
  {
    id: '2', 
    user: 'CyberSage42',
    content: 'lol same, but i only speak in lowercase because my persona demands it. underground hacker life is weird',
    timestamp: new Date(Date.now() - 240000),
    persona: 'Lowercase Underground Hacker'
  },
  {
    id: '3',
    user: 'QuantumEcho',
    content: 'The year is 2087, and from my timeline I can tell you that paranoia is justified. Trust no system.',
    timestamp: new Date(Date.now() - 180000),
    persona: 'Time Traveler from 2087'
  },
  {
    id: '4',
    user: 'ASCIIArtist',
    content: `
     ╔═══════════════╗
     ║   GREETINGS   ║
     ║    FELLOW     ║
     ║   HACKERS     ║
     ╚═══════════════╝`,
    timestamp: new Date(Date.now() - 120000),
    persona: 'ASCII Art Communicator'
  }
];

export const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState('Anonymous_' + Math.floor(Math.random() * 9999));
  const [isTyping, setIsTyping] = useState(false);
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      content: newMessage,
      timestamp: new Date(),
      persona: 'Your Generated Persona'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate other users typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add random response
        const responses = [
          'Interesting perspective... *adjusts glasses in terminal green light*',
          'that message just triggered my paranoia subroutines',
          'BEEP BOOP. I AM DEFINITELY NOT AN AI. FELLOW HUMANS.',
          'From the year 2087: your message creates ripples in the timeline',
          'adding to my collection of digital conversations...'
        ];
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          user: ['N3ON_R4V3N', 'CyberSage42', 'QuantumEcho', 'ASCIIArtist'][Math.floor(Math.random() * 4)],
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          persona: 'Random AI Response'
        };
        
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 1000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <TerminalWindow title="secure_chat_v3.7.exe" className="w-full max-w-4xl h-[600px] flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neon-green-dark">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-neon text-sm font-mono">ENCRYPTED CHANNEL #001</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>4 ACTIVE</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>24H LIMIT</span>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
          {messages.map((message) => (
            <div key={message.id} className="group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-terminal-cyan text-xs font-mono">
                  [{formatTime(message.timestamp)}]
                </span>
                <span className="text-neon-green-bright text-sm font-mono">
                  {message.user}
                </span>
                <span className="text-terminal-amber text-xs">
                  ({message.persona})
                </span>
              </div>
              <div className="ml-4 text-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-terminal-cyan text-xs font-mono">
                [TYPING]
              </span>
              <span className="font-mono">Someone is typing</span>
              <span className="terminal-cursor"></span>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Enter message as your persona..."
            className="input-terminal flex-1"
          />
          <Button 
            onClick={sendMessage}
            className="btn-terminal px-3"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Warning */}
        <div className="mt-2 text-xs text-terminal-amber font-mono">
          ⚠ REMINDER: Stay in character. Your identity expires in 23:47:12
        </div>
      </div>
    </TerminalWindow>
  );
};