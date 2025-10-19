import { CheckCircle, AlertTriangle, XCircle, List } from 'lucide-react';

export type StatusFilter = 'all' | 'active' | 'inactive' | 'failed';

interface StatusTabsProps {
  activeTab: StatusFilter;
  onTabChange: (tab: StatusFilter) => void;
  counts: {
    all: number;
    active: number;
    inactive: number;
    failed: number;
  };
}

export function StatusTabs({ activeTab, onTabChange, counts }: StatusTabsProps) {
  const tabs: Array<{ id: StatusFilter; label: string; icon: typeof List; color: string }> = [
    { id: 'all', label: 'All', icon: List, color: 'blue' },
    { id: 'active', label: 'Active', icon: CheckCircle, color: 'green' },
    { id: 'inactive', label: 'Inactive', icon: AlertTriangle, color: 'yellow' },
    { id: 'failed', label: 'Failed', icon: XCircle, color: 'red' },
  ];

  const getTabStyles = (tabId: StatusFilter) => {
    const isActive = activeTab === tabId;
    const baseStyles = 'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2';

    if (tabId === 'all') {
      return `${baseStyles} ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
          : 'bg-blue-600/10 text-blue-400 border-blue-600/30 hover:bg-blue-600/20 hover:border-blue-600/50'
      }`;
    }

    if (tabId === 'active') {
      return `${baseStyles} ${
        isActive
          ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/30'
          : 'bg-green-600/10 text-green-400 border-green-600/30 hover:bg-green-600/20 hover:border-green-600/50'
      }`;
    }

    if (tabId === 'inactive') {
      return `${baseStyles} ${
        isActive
          ? 'bg-yellow-600 text-white border-yellow-600 shadow-lg shadow-yellow-500/30'
          : 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/20 hover:border-yellow-600/50'
      }`;
    }

    if (tabId === 'failed') {
      return `${baseStyles} ${
        isActive
          ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/30'
          : 'bg-red-600/10 text-red-400 border-red-600/30 hover:bg-red-600/20 hover:border-red-600/50'
      }`;
    }

    return baseStyles;
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg p-5 rounded-xl mb-5 shadow-xl border border-white/10">
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={getTabStyles(tab.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
