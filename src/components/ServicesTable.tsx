import { Play, Square, RotateCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Service, ServiceAction } from '../types/service';

interface ServicesTableProps {
  services: Service[];
  onServiceAction: (serviceName: string, action: ServiceAction) => Promise<void>;
  actioningServices: Set<string>;
}

export function ServicesTable({ services, onServiceAction, actioningServices }: ServicesTableProps) {
  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-l-4 border-green-500';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-l-4 border-red-500 animate-pulse';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-500';
    }
  };

  const getBadgeColor = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      case 'inactive':
        return 'bg-yellow-500 text-white';
    }
  };

  const isActioning = (serviceName: string) => actioningServices.has(serviceName);

  if (services.length === 0) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 p-16 text-center">
        <p className="text-gray-400 text-lg">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 hidden md:table-header-group">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white tracking-wider">Service Name</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white tracking-wider">Description</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white tracking-wider">Status</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white tracking-wider">State</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr
                key={`${service.name}-${index}`}
                className={`${getStatusColor(service.status)} transition-all duration-300 hover:bg-blue-500/10 md:hover:scale-[1.01] cursor-pointer border-b border-white/5 flex flex-col md:table-row p-4 md:p-0 mb-4 md:mb-0 rounded-lg md:rounded-none`}
              >
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Service:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="font-mono font-semibold text-white text-xs md:text-sm break-all">{service.name}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Description:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="text-gray-300 text-xs md:text-sm break-words">{service.description}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Status:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['State:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="text-xs text-gray-400 italic">{service.active_state} / {service.sub_state}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Actions:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2 before:self-center">
                  <div className="flex gap-2 flex-wrap">
                    {service.status === 'active' ? (
                      <>
                        <button
                          onClick={() => onServiceAction(service.name, 'stop')}
                          disabled={isActioning(service.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Square className="w-3 h-3" />
                          {isActioning(service.name) ? 'Working...' : 'Stop'}
                        </button>
                        <button
                          onClick={() => onServiceAction(service.name, 'restart')}
                          disabled={isActioning(service.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <RotateCw className={`w-3 h-3 ${isActioning(service.name) ? 'animate-spin' : ''}`} />
                          {isActioning(service.name) ? 'Working...' : 'Restart'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onServiceAction(service.name, 'start')}
                          disabled={isActioning(service.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Play className="w-3 h-3" />
                          {isActioning(service.name) ? 'Working...' : 'Start'}
                        </button>
                        {service.status !== 'failed' && (
                          <button
                            onClick={() => onServiceAction(service.name, 'restart')}
                            disabled={isActioning(service.name)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            <RotateCw className={`w-3 h-3 ${isActioning(service.name) ? 'animate-spin' : ''}`} />
                            {isActioning(service.name) ? 'Working...' : 'Restart'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
