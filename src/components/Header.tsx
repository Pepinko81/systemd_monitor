import { Server } from 'lucide-react';

interface HeaderProps {
  lastUpdate: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <header className="bg-gray-900/95 backdrop-blur-lg p-4 md:p-6 rounded-xl mb-5 shadow-2xl border border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="bg-blue-600/20 p-2 md:p-3 rounded-lg border border-blue-500/30">
          <Server className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-center">
          SystemD Services Monitor
        </h1>
      </div>
      <div className="text-center text-xs md:text-sm text-gray-400 flex flex-col sm:flex-row sm:space-x-6 gap-1 sm:gap-0 justify-center">
        <span>Last updated: <span className="text-white font-medium">{lastUpdate}</span></span>
        <span>Auto-refresh: <span className="text-blue-400 font-medium">5s</span></span>
      </div>
    </header>
  );
}
