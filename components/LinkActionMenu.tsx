import { Share, Edit2, Trash2, X } from 'lucide-react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { motion, AnimatePresence } from 'motion/react';
import { LinkItem } from '@/hooks/useLinks';

interface LinkActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
  color: AppColor;
  onShare: (link: LinkItem) => void;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
}

export function LinkActionMenu({ isOpen, onClose, link, color, onShare, onEdit, onDelete }: LinkActionMenuProps) {
  if (!link) return null;
  
  const colorClasses = getColorClasses(color);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
          <div className="fixed inset-0 flex items-end justify-center p-4 z-[90] pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 truncate">
                      {link.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {link.url}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors shrink-0 ml-4"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => { onShare(link); onClose(); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-full ${colorClasses.bg} text-white flex items-center justify-center shadow-md group-active:scale-90 transition-transform`}>
                      <Share size={20} />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Compartilhar</span>
                  </button>
                  
                  <button
                    onClick={() => { onEdit(link); onClose(); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md group-active:scale-90 transition-transform">
                      <Edit2 size={20} />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Editar</span>
                  </button>

                  <button
                    onClick={() => { onDelete(link); onClose(); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md group-active:scale-90 transition-transform">
                      <Trash2 size={20} />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Excluir</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
