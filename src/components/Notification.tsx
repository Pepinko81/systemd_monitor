import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md p-5 rounded-2xl shadow-2xl border-2 backdrop-blur-lg animate-slideIn ${
        type === 'success'
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400'
          : 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {type === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>
        <p className="flex-1 font-semibold text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
