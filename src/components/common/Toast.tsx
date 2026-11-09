import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, showToast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/90 text-rose-100',
    info: 'border-blue-500/30 bg-slate-900/95 text-slate-100'
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 p-1 rounded-lg ${borders[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={() => showToast('', 'info')}
          className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
