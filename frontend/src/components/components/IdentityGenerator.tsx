import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TerminalWindow } from './TerminalWindow';
import { Dice6, User, Briefcase, Heart, Zap } from 'lucide-react';

interface Identity {
  name: string;
  age: number;
  job: string;
  personality: string;
  quirk: string;
  backstory: string;
}

const names = [
  "Alex", "Jordan", "Casey", "Riley", "Sage", "Phoenix", "River", "Sky", 
  "Nova", "Zara", "Kai", "Raven", "Echo", "Blaze", "Storm", "Luna"
];

const jobs = [
  "Cybersecurity Analyst", "Underground Hacker", "Digital Forensics Expert", 
  "Network Architect", "Data Scientist", "AI Researcher", "Crypto Trader",
  "Game Developer", "Tech Journalist", "System Administrator", "UX Designer",
  "Software Engineer", "Quantum Computing Researcher", "Blockchain Developer"
];

const personalities = [
  "Paranoid but brilliant", "Charming yet mysterious", "Introverted genius",
  "Rebellious activist", "Calculated strategist", "Impulsive risk-taker",
  "Philosophical dreamer", "Competitive perfectionist", "Empathetic mediator",
  "Sarcastic realist", "Optimistic visionary", "Analytical skeptic"
];

const quirks = [
  "Only communicates in code snippets", "Obsessed with vintage keyboards",
  "Speaks exclusively in cyberpunk slang", "Collects broken electronics",
  "Never reveals their real location", "Types with perfect grammar always",
  "Uses only green terminal themes", "Quotes 80s sci-fi movies constantly",
  "Pretends to be an AI sometimes", "Never uses uppercase letters",
  "Communicates through ASCII art", "Claims to live in the year 2087"
];

const backstories = [
  "Former corporate spy turned whistleblower",
  "Teenage prodigy who hacked NASA at 14",
  "Ex-military now fighting digital warfare",
  "Underground resistance member",
  "Reformed black hat hacker",
  "Mysterious figure with unknown past",
  "Digital nomad living off the grid",
  "Academic turned digital anarchist"
];

export const IdentityGenerator = () => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  
  const generateIdentity = () => {
    setIsGenerating(true);
    setCurrentLine(0);
    setIdentity(null);
    
    // Simulate terminal typing effect
    const lines = [
      "Initializing identity matrix...",
      "Scanning available personas...",
      "Randomizing personality traits...",
      "Encrypting backstory data...",
      "Identity generation complete."
    ];
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      setCurrentLine(lineIndex);
      lineIndex++;
      
      if (lineIndex > lines.length) {
        clearInterval(interval);
        
        // Generate random identity
        const newIdentity: Identity = {
          name: names[Math.floor(Math.random() * names.length)],
          age: Math.floor(Math.random() * 35) + 18,
          job: jobs[Math.floor(Math.random() * jobs.length)],
          personality: personalities[Math.floor(Math.random() * personalities.length)],
          quirk: quirks[Math.floor(Math.random() * quirks.length)],
          backstory: backstories[Math.floor(Math.random() * backstories.length)]
        };
        
        setIdentity(newIdentity);
        setIsGenerating(false);
      }
    }, 800);
  };
  
  return (
    <TerminalWindow title="identity_generator.exe" className="w-full max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Dice6 className="w-5 h-5 text-neon-green" />
          <span className="text-neon text-sm font-mono">PERSONA RANDOMIZER v2.3.7</span>
        </div>
        
        {!identity && !isGenerating && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4 font-mono text-sm">
              &gt; Ready to generate your digital persona...
            </p>
            <Button 
              onClick={generateIdentity}
              className="btn-terminal"
            >
              <Dice6 className="w-4 h-4 mr-2" />
              GENERATE IDENTITY
            </Button>
          </div>
        )}
        
        {isGenerating && (
          <div className="space-y-2">
            {["Initializing identity matrix...", 
              "Scanning available personas...", 
              "Randomizing personality traits...", 
              "Encrypting backstory data...", 
              "Identity generation complete."].map((line, index) => (
              <div 
                key={index} 
                className={`terminal-line ${index <= currentLine ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className="text-terminal-amber">&gt;</span> {line}
                {index === currentLine && <span className="terminal-cursor"></span>}
              </div>
            ))}
          </div>
        )}
        
        {identity && (
          <div className="space-y-4">
            <div className="border border-neon-green-dark bg-terminal-darker p-4 glow-green">
              <h3 className="text-neon-flicker text-lg font-orbitron mb-4">YOUR NEW IDENTITY</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neon-green-bright" />
                  <span className="text-terminal-amber">NAME:</span>
                  <span className="text-neon-green font-mono">{identity.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-green-bright" />
                  <span className="text-terminal-amber">AGE:</span>
                  <span className="text-neon-green font-mono">{identity.age}</span>
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <Briefcase className="w-4 h-4 text-neon-green-bright" />
                  <span className="text-terminal-amber">JOB:</span>
                  <span className="text-neon-green font-mono">{identity.job}</span>
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <Heart className="w-4 h-4 text-neon-green-bright" />
                  <span className="text-terminal-amber">PERSONALITY:</span>
                  <span className="text-neon-green font-mono">{identity.personality}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-terminal-black border border-neon-green-dark">
                <div className="text-terminal-cyan text-xs font-mono mb-1">QUIRK:</div>
                <div className="text-neon-green-bright text-sm font-mono">{identity.quirk}</div>
              </div>
              
              <div className="mt-3 p-3 bg-terminal-black border border-neon-green-dark">
                <div className="text-terminal-cyan text-xs font-mono mb-1">BACKSTORY:</div>
                <div className="text-neon-green-bright text-sm font-mono">{identity.backstory}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateIdentity}
                className="btn-terminal flex-1"
              >
                <Dice6 className="w-4 h-4 mr-2" />
                NEW IDENTITY
              </Button>
              <Button 
                onClick={() => {/* TODO: Navigate to chat */}}
                className="btn-terminal flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                ENTER CHATROOM
              </Button>
            </div>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};