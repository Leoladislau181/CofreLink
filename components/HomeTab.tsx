import { useState, useRef, useEffect } from 'react';
import { Link2Off, Search, Share, Filter, Check } from 'lucide-react';
import { useLinks } from '@/hooks/useLinks';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { DynamicIcon } from '@/components/DynamicIcon';

export function HomeTab({ color }: { color: AppColor }) {
  const { links, isLoaded } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const colorClasses = getColorClasses(color);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async (e: React.MouseEvent, link: any) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      alert('Link copiado para a área de transferência!');
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
          Nenhum link cadastrado ainda
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
          Vá para a aba Links para adicionar seus primeiros botões.
        </p>
      </div>
    );
  }

  const usedCategories = Array.from(new Set(links.map(l => l.category || 'Outros')));

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? link.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-300 w-full pb-24 min-h-[80vh] flex flex-col">
      <div className="relative mb-6" ref={filterRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar links..."
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 ${colorClasses.ring} transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-sm`}
            />
          </div>
          
          {usedCategories.length > 0 && (
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`shrink-0 w-[52px] h-[52px] flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors ${selectedCategory ? `${colorClasses.bg} ${colorClasses.textInvert} border-transparent` : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <Filter size={20} />
            </button>
          )}
        </div>

        {isFilterOpen && (
          <div className="absolute top-[60px] right-0 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${!selectedCategory ? `font-bold ${colorClasses.text}` : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <span>Todos</span>
              {!selectedCategory && <Check size={16} />}
            </button>
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${selectedCategory === cat ? `font-bold ${colorClasses.text}` : 'text-zinc-700 dark:text-zinc-300'}`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
              className={`group relative flex items-center justify-center w-full p-4 min-h-[64px] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:border-${color}-200 dark:hover:border-${color}-900/50 hover:shadow-md transition-all active:scale-[0.98]`}
            >
              <div className={`absolute left-4 ${colorClasses.text} transition-colors`}>
                <DynamicIcon name={link.icon || 'Link2'} size={20} />
              </div>
              <span className={`font-semibold ${colorClasses.text} text-lg text-center px-12 truncate w-full`}>
                {link.name}
              </span>
              <button
                onClick={(e) => handleShare(e, link)}
                className={`absolute right-4 p-2 ${colorClasses.bg} text-white dark:text-zinc-900 transition-colors rounded-full hover:opacity-80 shadow-sm`}
                title="Compartilhar link"
              >
                <Share size={18} />
              </button>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
            Nenhum link encontrado
          </div>
        )}
      </div>
    </div>
  );
}
