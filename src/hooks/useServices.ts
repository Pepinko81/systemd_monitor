import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import type { Service, ServiceAction } from '../types/service';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState('Never');
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [actioningServices, setActioningServices] = useState<Set<string>>(new Set());

  const scrollPositionRef = useRef(0);
  const refreshIntervalRef = useRef<number>();

  const loadServices = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setIsRefreshing(true);
    }

    scrollPositionRef.current = window.scrollY;

    try {
      const data = await api.getServices();
      setServices(data);
      setError(null);

      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastUpdate(timeString);

      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load services';
      setError(errorMessage);
      if (loading) {
        setLoading(false);
      }
    } finally {
      if (!isAutoRefresh) {
        setIsRefreshing(false);
      }

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }
  }, [loading]);

  useEffect(() => {
    loadServices();

    refreshIntervalRef.current = window.setInterval(() => {
      loadServices(true);
    }, 5000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadServices]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
      );
      setFilteredServices(filtered);
    }
  }, [services, searchTerm]);

  const handleServiceAction = useCallback(async (serviceName: string, action: ServiceAction) => {
    setActioningServices(prev => new Set(prev).add(serviceName));

    try {
      const result = await api.controlService(serviceName, action);

      if (result.success) {
        setNotification({
          message: result.message,
          type: 'success'
        });

        setTimeout(() => {
          loadServices();
        }, 1000);
      } else {
        setNotification({
          message: result.message,
          type: 'error'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setNotification({
        message: `Failed to ${action} ${serviceName}: ${errorMessage}`,
        type: 'error'
      });
    } finally {
      setActioningServices(prev => {
        const next = new Set(prev);
        next.delete(serviceName);
        return next;
      });
    }
  }, [loadServices]);

  const handleRefresh = useCallback(() => {
    loadServices();
  }, [loadServices]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
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
  };
}
