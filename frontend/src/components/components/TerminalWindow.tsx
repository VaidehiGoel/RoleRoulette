import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const TerminalWindow = ({ title = "terminal", children, className }: TerminalWindowProps) => {
  return (
    <div className={cn("terminal-window relative", className)}>
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-button terminal-button-close"></div>
          <div className="terminal-button terminal-button-minimize"></div>
          <div className="terminal-button terminal-button-maximize"></div>
        </div>
        <div className="text-xs text-muted-foreground ml-4 font-mono">
          {title}
        </div>
      </div>
      <div className="p-4 relative">
        <div className="scan-lines absolute inset-0 pointer-events-none"></div>
        {children}
      </div>
    </div>
  );
};