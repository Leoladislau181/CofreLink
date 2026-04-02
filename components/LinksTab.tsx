import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Check, X, ExternalLink, ChevronDown } from 'lucide-react';
import { useLinks, LinkItem, CATEGORIES } from '@/hooks/useLinks';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { ICONS, DynamicIcon } from '@/components/DynamicIcon';
import { Modal } from '@/components/Modal';
import { Toast } from '@/components/Toast';

function CustomIconSelect({ value, onChange, colorClasses, size = 'normal' }: { value: string, onChange: (val: string) => void, colorClasses: any, size?: 'normal' | 'small' }) {
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

  const paddingClass = size === 'small' ? 'py-2 px-3 pl-8' : 'py-3.5 px-4 pl-10';
  const roundedClass = size === 'small' ? 'rounded-xl' : 'rounded-2xl';
  const iconSize = size === 'small' ? 16 : 18;
  const iconLeft = size === 'small' ? 'left-2.5' : 'left-3.5';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${paddingClass} ${roundedClass} bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 text-left flex items-center justify-between`}
      >
        <div className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none`}>
          <DynamicIcon name={value} size={iconSize} />
        </div>
        <span className="block truncate">{value}</span>
        <ChevronDown className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={iconSize} />
      </button>

      {isOpen && (
        <div className={`absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-60 overflow-auto scrollbar-hide`}>
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

export function LinksTab({ color }: { color: AppColor }) {
  const { links, addLink, updateLink, deleteLink } = useLinks();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [icon, setIcon] = useState('Link2');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIcon, setEditIcon] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const colorClasses = getColorClasses(color);

  const handleSave = async () => {
    if (!name.trim() || !url.trim()) return;
    await addLink(name, url, category, icon);
    setName('');
    setUrl('');
    setCategory(CATEGORIES[0]);
    setIcon('Link2');
    setToast({ message: 'Link salvo com sucesso!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditName(link.name);
    setEditUrl(link.url);
    setEditCategory(link.category || CATEGORIES[0]);
    setEditIcon(link.icon || 'Link2');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim() || !editUrl.trim()) return;
    await updateLink(editingId, editName, editUrl, editCategory, editIcon);
    setEditingId(null);
    setToast({ message: 'Link atualizado com sucesso!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteLink(deletingId);
      setDeletingId(null);
      setToast({ message: 'Link excluído com sucesso!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-300 w-full pb-24">
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        Gerenciar Links
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form Section */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Novo Link</h3>
          <div className="space-y-2">
            <label htmlFor="linkName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nome do botão
            </label>
            <input
              type="text"
              id="linkName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meu Instagram"
              className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="linkUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              URL do link
            </label>
            <input
              type="url"
              id="linkUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={`w-full px-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
            disabled={!name.trim() || !url.trim()}
            className={`w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-4 px-4 rounded-2xl transition-colors shadow-sm active:scale-[0.98] mt-2 ${colorClasses.bg} ${colorClasses.textInvert}`}
          >
            <PlusCircle size={20} />
            Salvar Link
          </button>
        </div>

        {/* List Section */}
        <div className="w-full lg:w-2/3">
          {links.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 px-1">
                Meus Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {links.map((link) => (
                  <div key={link.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
                    {editingId === link.id ? (
                      <div className="space-y-3 animate-in fade-in">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nome do botão"
                          className={`w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} text-sm text-zinc-900 dark:text-zinc-100`}
                        />
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="URL do link"
                          className={`w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} text-sm text-zinc-900 dark:text-zinc-100`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 ${colorClasses.ring} text-sm text-zinc-900 dark:text-zinc-100`}
                          >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                          <CustomIconSelect 
                            value={editIcon} 
                            onChange={setEditIcon} 
                            colorClasses={colorClasses} 
                            size="small"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingId(null)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <X size={18} />
                          </button>
                          <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <DynamicIcon name={link.icon || 'Link2'} size={16} className={colorClasses.text} />
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{link.name}</h4>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                            {link.category || 'Outros'}
                          </p>
                          <button 
                            onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
                            className="text-sm text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          >
                            <ExternalLink size={12} className="shrink-0" />
                            <span className="truncate underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">{link.url}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleEdit(link)} className={`p-2 text-zinc-400 hover:${colorClasses.text} hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors`}>
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDeletingId(link.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500 dark:text-zinc-400 mt-10 lg:mt-0">
              Nenhum link cadastrado ainda.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Excluir Link"
        confirmLabel="Excluir"
        variant="danger"
        color={color}
      >
        Deseja realmente excluir este link? Esta ação não pode ser desfeita.
      </Modal>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          color={color} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
