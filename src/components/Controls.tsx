import { RefreshCw, Search } from 'lucide-react';

interface ControlsProps {
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isRefreshing: boolean;
}

export function Controls({ onRefresh, searchTerm, onSearchChange, isRefreshing }: ControlsProps) {
  return (
    <div className="bg-gradient-to-r from-white to-orange-50 backdrop-blur-lg p-5 rounded-2xl mb-6 shadow-xl border border-orange-200/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Now
        </button>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-orange-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:shadow-lg focus:shadow-orange-300/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
