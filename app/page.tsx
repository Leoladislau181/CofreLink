'use client';

import { useState, useEffect, useRef } from 'react';
import { HomeTab } from '@/components/HomeTab';
import { Logo } from '@/components/Logo';
import { useSettings, getColorClasses } from '@/hooks/useSettings';
import { useAuth } from '@/components/AuthProvider';
import { Login } from '@/components/Login';
import { MenuDrawer } from '@/components/MenuDrawer';
import { AddEditLinkModal } from '@/components/AddEditLinkModal';
import { Search, Menu, Plus, X, Filter, Check } from 'lucide-react';
import { LinkItem, CATEGORIES } from '@/hooks/useLinks';
import { Toast } from '@/components/Toast';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const settings = useSettings();
  const { user, loading } = useAuth();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;
  if (!user) return <Login />;

  if (!settings.isLoaded) return null;

  const colorClasses = getColorClasses(settings.color);

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsAddEditModalOpen(true);
  };

  const handleAddLink = () => {
    setEditingLink(null);
    setIsAddEditModalOpen(true);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!settings.hasSeenWelcome) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className={`w-24 h-24 rounded-full ${colorClasses.bg} flex items-center justify-center mb-8 shadow-lg shadow-${settings.color}-500/20 animate-bounce`}>
          <Logo size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">
          Bem-vindo ao CofreLink
        </h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-12 max-w-xs text-lg">
          Sua pequena constelação de atalhos.
        </p>
        <button
          onClick={settings.completeWelcome}
          className={`w-full max-w-xs py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-lg ${colorClasses.bg} ${colorClasses.textInvert}`}
        >
          Começar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div 
                key="search-bar"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar..."
                    className={`w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 ${colorClasses.ring} text-sm`}
                  />
                </div>
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-xl transition-colors ${selectedCategory ? `${colorClasses.bg} ${colorClasses.textInvert}` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                  >
                    <Filter size={20} />
                  </button>
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-[60] py-2"
                      >
                        <button
                          onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${!selectedCategory ? `font-bold ${colorClasses.text}` : 'text-zinc-700 dark:text-zinc-300'}`}
                        >
                          <span>Todos</span>
                          {!selectedCategory && <Check size={16} />}
                        </button>
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${selectedCategory === cat ? `font-bold ${colorClasses.text}` : 'text-zinc-700 dark:text-zinc-300'}`}
                          >
                            <span>{cat}</span>
                            {selectedCategory === cat && <Check size={16} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSelectedCategory(null); }}
                  className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  <X size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="header-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex-1 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${colorClasses.bg} ${colorClasses.textInvert}`}>
                    <Logo size={20} />
                  </div>
                  <h1 className={`text-lg font-bold truncate max-w-[150px] md:max-w-xs ${colorClasses.text}`}>
                    {settings.name || 'CofreLink'}
                  </h1>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <Search size={22} />
                  </button>
                  <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <Menu size={22} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-6">
        <HomeTab 
          color={settings.color} 
          name={settings.name} 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onEdit={handleEditLink}
        />
      </main>

      {/* FAB - Floating Action Button */}
      <button
        onClick={handleAddLink}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full ${colorClasses.bg} ${colorClasses.textInvert} shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:scale-105`}
        aria-label="Adicionar Link"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Overlays */}
      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        settings={settings} 
      />

      <AddEditLinkModal 
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        color={settings.color}
        editingLink={editingLink}
        onSuccess={showToast}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          color={settings.color} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
