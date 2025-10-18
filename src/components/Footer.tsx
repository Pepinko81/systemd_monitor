import type { Service } from '../types/service';

interface FooterProps {
  services: Service[];
}

export function Footer({ services }: FooterProps) {
  const total = services.length;
  const active = services.filter(s => s.status === 'active').length;
  const inactive = services.filter(s => s.status === 'inactive').length;
  const failed = services.filter(s => s.status === 'failed').length;

  return (
    <footer className="bg-gray-900/95 backdrop-blur-lg p-4 rounded-xl mt-5 shadow-xl border border-white/10">
      <div className="text-center font-medium text-gray-300">
        <span className="text-gray-400">Total services:</span> <span className="text-white font-bold">{total}</span>
        <span className="mx-3 text-gray-600">|</span>
        <span className="text-gray-400">Active:</span> <span className="text-green-400 font-bold">{active}</span>
        <span className="mx-3 text-gray-600">|</span>
        <span className="text-gray-400">Inactive:</span> <span className="text-yellow-400 font-bold">{inactive}</span>
        <span className="mx-3 text-gray-600">|</span>
        <span className="text-gray-400">Failed:</span> <span className="text-red-400 font-bold">{failed}</span>
      </div>
    </footer>
  );
}
