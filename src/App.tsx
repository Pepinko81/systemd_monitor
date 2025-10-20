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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
          <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-200/50 flex flex-col items-center justify-center gap-6 p-16">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-600 text-xl font-medium">Loading services...</p>
          </div>
        ) : error ? (
          <div className="flex-1 bg-red-50/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-200/50 p-8 text-center">
            <p className="text-red-600 text-lg font-semibold">{error}</p>
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
