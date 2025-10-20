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
        return 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-l-4 border-rose-500 animate-pulse';
      case 'inactive':
        return 'bg-amber-50 text-amber-700 border-l-4 border-amber-500';
    }
  };

  const getBadgeColor = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg';
      case 'failed':
        return 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg';
      case 'inactive':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg';
    }
  };

  const isActioning = (serviceName: string) => actioningServices.has(serviceName);

  if (services.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200/50 p-16 text-center">
        <p className="text-gray-600 text-lg font-medium">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-100 to-amber-100 hidden md:table-header-group">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 tracking-wider">Service Name</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 tracking-wider">Description</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 tracking-wider">Status</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 tracking-wider">State</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr
                key={`${service.name}-${index}`}
                className={`${getStatusColor(service.status)} transition-all duration-300 hover:bg-orange-100/50 md:hover:scale-[1.01] cursor-pointer border-b border-orange-200/30 flex flex-col md:table-row p-4 md:p-0 mb-4 md:mb-0 rounded-lg md:rounded-none`}
              >
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Service:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="font-mono font-bold text-gray-800 text-xs md:text-sm break-all">{service.name}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Description:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="text-gray-600 text-xs md:text-sm break-words">{service.description}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Status:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['State:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2">
                  <div className="text-xs text-gray-500 italic font-medium">{service.active_state} / {service.sub_state}</div>
                </td>
                <td className="px-4 md:px-6 py-2 md:py-4 flex md:table-cell before:content-['Actions:_'] before:font-bold before:text-gray-400 md:before:content-none before:mr-2 before:self-center">
                  <div className="flex gap-2 flex-wrap">
                    {service.status === 'active' ? (
                      <>
                        <button
                          onClick={() => onServiceAction(service.name, 'stop')}
                          disabled={isActioning(service.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Square className="w-3 h-3" />
                          {isActioning(service.name) ? 'Working...' : 'Stop'}
                        </button>
                        <button
                          onClick={() => onServiceAction(service.name, 'restart')}
                          disabled={isActioning(service.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Play className="w-3 h-3" />
                          {isActioning(service.name) ? 'Working...' : 'Start'}
                        </button>
                        {service.status !== 'failed' && (
                          <button
                            onClick={() => onServiceAction(service.name, 'restart')}
                            disabled={isActioning(service.name)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
