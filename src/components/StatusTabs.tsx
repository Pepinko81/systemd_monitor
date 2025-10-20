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
    const baseStyles = 'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2';

    if (tabId === 'all') {
      return `${baseStyles} ${
        isActive
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-xl shadow-orange-400/40'
          : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:shadow-lg'
      }`;
    }

    if (tabId === 'active') {
      return `${baseStyles} ${
        isActive
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 shadow-xl shadow-emerald-400/40'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-lg'
      }`;
    }

    if (tabId === 'inactive') {
      return `${baseStyles} ${
        isActive
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-400 shadow-xl shadow-amber-400/40'
          : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:shadow-lg'
      }`;
    }

    if (tabId === 'failed') {
      return `${baseStyles} ${
        isActive
          ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400 shadow-xl shadow-rose-400/40'
          : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:shadow-lg'
      }`;
    }

    return baseStyles;
  };

  return (
    <div className="bg-gradient-to-r from-white to-orange-50 backdrop-blur-lg p-5 rounded-2xl mb-6 shadow-xl border border-orange-200/50">
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
              <span className="ml-1 px-2.5 py-0.5 rounded-full bg-white/30 text-xs font-bold backdrop-blur-sm">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
