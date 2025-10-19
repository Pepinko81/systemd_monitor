import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { StatusTabs, type StatusFilter } from './components/StatusTabs';
import { ServicesTable } from './components/ServicesTable';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { useServices } from './hooks/useServices';
import { Loader2 } from 'lucide-react';

function App() {
  const {
    services,
    filteredServices,
    searchTerm,
    loading,
    isRefreshing,
    error,
    lastUpdate,
    notification,
    actioningServices,
    handleServiceAction,
    handleRefresh,
    handleSearchChange,
    closeNotification,
  } = useServices();

  const [activeTab, setActiveTab] = useState<StatusFilter>('all');

  const tabFilteredServices = useMemo(() => {
    if (activeTab === 'all') {
      return filteredServices;
    }
    return filteredServices.filter(service => service.status === activeTab);
  }, [filteredServices, activeTab]);

  const tabCounts = useMemo(() => {
    return {
      all: filteredServices.length,
      active: filteredServices.filter(s => s.status === 'active').length,
      inactive: filteredServices.filter(s => s.status === 'inactive').length,
      failed: filteredServices.filter(s => s.status === 'failed').length,
    };
  }, [filteredServices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container max-w-7xl mx-auto px-5 py-6 min-h-screen flex flex-col">
        <Header lastUpdate={lastUpdate} />

        <Controls
          onRefresh={handleRefresh}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isRefreshing={isRefreshing}
        />

        {!loading && !error && (
          <StatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={tabCounts}
          />
        )}

        {loading ? (
          <div className="flex-1 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 flex flex-col items-center justify-center gap-6 p-16">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-400 text-xl">Loading services...</p>
          </div>
        ) : error ? (
          <div className="flex-1 bg-red-500/10 backdrop-blur-lg rounded-xl shadow-xl border border-red-500/30 p-8 text-center">
            <p className="text-red-400 text-lg font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex-1">
            <ServicesTable
              services={tabFilteredServices}
              onServiceAction={handleServiceAction}
              actioningServices={actioningServices}
            />
          </div>
        )}

        <Footer services={services} />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
    </div>
  );
}

export default App;
