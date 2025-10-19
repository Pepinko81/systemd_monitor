import { RefreshCw, Search } from 'lucide-react';

interface ControlsProps {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isRefreshing: boolean;
}

export function Controls({ onRefresh, searchTerm, onSearchChange, isRefreshing }: ControlsProps) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-lg p-5 rounded-xl mb-5 shadow-xl border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Now
        </button>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/15 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
