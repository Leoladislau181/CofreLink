'use client';

import { X } from 'lucide-react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  color?: AppColor;
  confirmLabel?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'info' | 'success';
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  color = 'blue', 
  confirmLabel, 
  onConfirm,
  variant = 'info'
}: ModalProps) {
  if (!isOpen) return null;

  const colorClasses = getColorClasses(color);

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
      default: return `${colorClasses.bg} ${colorClasses.textInvert} ${colorClasses.hover}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            {children}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-[0.98]"
            >
              Cancelar
            </button>
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-sm ${getVariantClasses()}`}
              >
                {confirmLabel || 'Confirmar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
