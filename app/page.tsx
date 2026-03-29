'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { SidebarNav } from '@/components/SidebarNav';
import { HomeTab } from '@/components/HomeTab';
import { LinksTab } from '@/components/LinksTab';
import { MenuTab } from '@/components/MenuTab';
import { Logo } from '@/components/Logo';
import { useSettings, getColorClasses } from '@/hooks/useSettings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const settings = useSettings();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  if (!settings.isLoaded) return null;

  const colorClasses = getColorClasses(settings.color);

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
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 h-screen shadow-sm z-20">
        <div className="p-8 flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
          <Logo size={36} className={colorClasses.text} />
          <h1 className={`text-2xl font-bold ${colorClasses.text}`}>
            CofreLink
          </h1>
        </div>
        <nav className="flex-1 px-6 py-8">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} color={settings.color} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-center gap-2">
            <Logo size={24} className={colorClasses.text} />
            <h1 className={`text-xl font-bold ${colorClasses.text}`}>
              CofreLink
            </h1>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 pb-24 md:pb-12 pt-4 md:pt-10 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 md:px-8">
          {activeTab === 'home' && <HomeTab color={settings.color} />}
          {activeTab === 'links' && <LinksTab color={settings.color} />}
          {activeTab === 'menu' && <MenuTab settings={settings} />}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} color={settings.color} />
        </div>
      </div>
    </div>
  );
}
