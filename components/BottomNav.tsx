import { Home, Link as LinkIcon, Menu } from 'lucide-react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  color: AppColor;
}

export function BottomNav({ activeTab, setActiveTab, color }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];

  const colorClasses = getColorClasses(color);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? colorClasses.text : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
