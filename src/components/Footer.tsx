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
    <footer className="bg-gradient-to-r from-orange-100 to-amber-100 backdrop-blur-lg p-5 rounded-2xl mt-6 shadow-xl border border-orange-200/50">
      <div className="text-center font-semibold text-gray-700">
        <span className="text-gray-600">Total services:</span> <span className="text-orange-600 font-bold">{total}</span>
        <span className="mx-3 text-orange-300">|</span>
        <span className="text-gray-600">Active:</span> <span className="text-emerald-600 font-bold">{active}</span>
        <span className="mx-3 text-orange-300">|</span>
        <span className="text-gray-600">Inactive:</span> <span className="text-amber-600 font-bold">{inactive}</span>
        <span className="mx-3 text-orange-300">|</span>
        <span className="text-gray-600">Failed:</span> <span className="text-rose-600 font-bold">{failed}</span>
      </div>
    </footer>
  );
}
