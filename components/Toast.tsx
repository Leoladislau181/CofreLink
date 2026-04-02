'use client';

import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  color?: AppColor;
  onClose: () => void;
}

export function Toast({ message, type = 'info', color = 'blue', onClose }: ToastProps) {
  const colorClasses = getColorClasses(color);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'error': return <XCircle className="text-red-500" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
      default: return <Info className={colorClasses.text} size={20} />;
    }
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <div className="shrink-0">
          {getIcon()}
        </div>
        <p className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-tight">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}
