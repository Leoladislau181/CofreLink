import { useState, useRef, useEffect } from 'react';
import { Link2Off, MoreVertical, Share, Filter, Check } from 'lucide-react';
import { useLinks, LinkItem } from '@/hooks/useLinks';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Toast } from '@/components/Toast';
import { LinkActionMenu } from '@/components/LinkActionMenu';
import { Modal } from '@/components/Modal';

interface HomeTabProps {
  color: AppColor;
  name?: string;
  searchQuery: string;
  selectedCategory: string | null;
  onEdit: (link: LinkItem) => void;
}

export function HomeTab({ color, name, searchQuery, selectedCategory, onEdit }: HomeTabProps) {
  const { links, isLoaded, deleteLink } = useLinks();
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [activeActionLink, setActiveActionLink] = useState<LinkItem | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

  const colorClasses = getColorClasses(color);

  const handleShare = async (link: LinkItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: link.name,
          text: `Confira este link: ${link.name}`,
          url: link.url,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(link.url);
      setToast({ message: 'Link copiado para a área de transferência!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (deletingLink) {
      await deleteLink(deletingLink.id);
      setDeletingLink(null);
      setToast({ message: 'Link excluído com sucesso!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!isLoaded) return null;

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] px-6 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-sm">
          <Link2Off className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
          Bem-vindo!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px] mb-2">
          Nenhum link cadastrado ainda.
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[250px]">
          Toque no botão &quot;+&quot; abaixo para adicionar seus primeiros botões.
        </p>
      </div>
    );
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? link.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-300 w-full pb-24 min-h-[80vh] flex flex-col">
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Meus Links
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {links.length} {links.length === 1 ? 'link salvo' : 'links salvos'}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
              className={`group relative flex items-center justify-center w-full p-4 min-h-[64px] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:border-${color}-200 dark:hover:border-${color}-900/50 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(link.url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              <div className={`absolute left-4 ${colorClasses.text} transition-colors`}>
                <DynamicIcon name={link.icon || 'Link2'} size={20} />
              </div>
              <span className={`font-semibold ${colorClasses.text} text-lg text-center px-12 truncate w-full`}>
                {link.name}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveActionLink(link);
                }}
                className={`absolute right-4 p-2 text-zinc-400 hover:${colorClasses.text} transition-colors rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800`}
                title="Mais opções"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
            Nenhum link encontrado
          </div>
        )}
      </div>

      <LinkActionMenu
        isOpen={!!activeActionLink}
        onClose={() => setActiveActionLink(null)}
        link={activeActionLink}
        color={color}
        onShare={handleShare}
        onEdit={(link) => onEdit(link)}
        onDelete={(link) => setDeletingLink(link)}
      />

      <Modal
        isOpen={!!deletingLink}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDelete}
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
