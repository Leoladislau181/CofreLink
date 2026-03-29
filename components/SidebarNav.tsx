import { Home, Link as LinkIcon, Menu } from 'lucide-react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  color: AppColor;
}

export function SidebarNav({ activeTab, setActiveTab, color }: SidebarNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];

  const colorClasses = getColorClasses(color);

  return (
    <div className="flex flex-col gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? `${colorClasses.bg} ${colorClasses.textInvert} shadow-md` 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-lg font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
