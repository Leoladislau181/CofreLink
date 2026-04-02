import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Edit2, Check, X, ChevronDown, Save } from 'lucide-react';
import { useLinks, LinkItem, CATEGORIES } from '@/hooks/useLinks';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { ICONS, DynamicIcon } from '@/components/DynamicIcon';
import { motion, AnimatePresence } from 'motion/react';

interface AddEditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: AppColor;
  editingLink?: LinkItem | null;
  onSuccess: (message: string) => void;
}

function CustomIconSelect({ value, onChange, colorClasses }: { value: string, onChange: (val: string) => void, colorClasses: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-3.5 px-4 pl-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 text-left flex items-center justify-between`}
      >
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none`}>
          <DynamicIcon name={value} size={18} />
        </div>
        <span className="block truncate">{value}</span>
        <ChevronDown className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>

      {isOpen && (
        <div className={`absolute z-[100] w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-60 overflow-auto scrollbar-hide`}>
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => {
                onChange(ic);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${value === ic ? 'bg-zinc-50 dark:bg-zinc-700 font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <DynamicIcon name={ic} size={18} className={value === ic ? colorClasses.text : 'text-zinc-400'} />
              <span className={value === ic ? 'text-zinc-900 dark:text-zinc-100' : ''}>{ic}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddEditLinkModal({ isOpen, onClose, color, editingLink, onSuccess }: AddEditLinkModalProps) {
  const { addLink, updateLink } = useLinks();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [icon, setIcon] = useState('Link2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorClasses = getColorClasses(color);

  useEffect(() => {
    if (editingLink) {
      setName(editingLink.name);
      setUrl(editingLink.url);
      setCategory(editingLink.category || CATEGORIES[0]);
      setIcon(editingLink.icon || 'Link2');
    } else {
      setName('');
      setUrl('');
      setCategory(CATEGORIES[0]);
      setIcon('Link2');
    }
  }, [editingLink, isOpen]);

  const handleSave = async () => {
    if (!name.trim() || !url.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingLink) {
        await updateLink(editingLink.id, name, url, category, icon);
        onSuccess('Link atualizado com sucesso!');
      } else {
        await addLink(name, url, category, icon);
        onSuccess('Link salvo com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[90] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {editingLink ? 'Editar Link' : 'Novo Link'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="modalLinkName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      Nome do botão
                    </label>
                    <input
                      type="text"
                      id="modalLinkName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Meu Instagram"
                      className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modalLinkUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      URL do link
                    </label>
                    <input
                      type="url"
                      id="modalLinkUrl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                        Categoria
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 appearance-none`}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                        Ícone
                      </label>
                      <CustomIconSelect 
                        value={icon} 
                        onChange={setIcon} 
                        colorClasses={colorClasses} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={!name.trim() || !url.trim() || isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] mt-2 ${colorClasses.bg} ${colorClasses.textInvert}`}
                  >
                    {editingLink ? <Save size={20} /> : <PlusCircle size={20} />}
                    {isSubmitting ? 'Salvando...' : (editingLink ? 'Atualizar Link' : 'Salvar Link')}
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
