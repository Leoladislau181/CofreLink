import { useState, useEffect } from 'react';

export type AppColor = 'blue' | 'green' | 'purple' | 'red' | 'black';
export type AppTheme = 'light' | 'dark';

export function useSettings() {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(true);
  const [theme, setTheme] = useState<AppTheme>('light');
  const [color, setColor] = useState<AppColor>('blue');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedWelcome = localStorage.getItem('@cofrelink:welcome');
    if (!storedWelcome) setTimeout(() => setHasSeenWelcome(false), 0);

    const storedTheme = localStorage.getItem('@cofrelink:theme') as AppTheme;
    if (storedTheme) {
      setTimeout(() => setTheme(storedTheme), 0);
      if (storedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      if (document.documentElement.classList.contains('dark')) setTimeout(() => setTheme('dark'), 0);
    }

    const storedColor = localStorage.getItem('@cofrelink:color') as AppColor;
    if (storedColor) setTimeout(() => setColor(storedColor), 0);

    const storedAvatar = localStorage.getItem('@cofrelink:avatar');
    if (storedAvatar) setTimeout(() => setAvatar(storedAvatar), 0);

    const storedAffiliate = localStorage.getItem('@cofrelink:affiliate');
    if (storedAffiliate) setTimeout(() => setAffiliateLink(storedAffiliate), 0);

    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  const completeWelcome = () => {
    localStorage.setItem('@cofrelink:welcome', 'true');
    setHasSeenWelcome(true);
  };

  const updateTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('@cofrelink:theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const updateColor = (newColor: AppColor) => {
    setColor(newColor);
    localStorage.setItem('@cofrelink:color', newColor);
  };

  const updateAvatar = (newAvatar: string | null) => {
    setAvatar(newAvatar);
    if (newAvatar) localStorage.setItem('@cofrelink:avatar', newAvatar);
    else localStorage.removeItem('@cofrelink:avatar');
  };

  const updateAffiliateLink = (newLink: string) => {
    setAffiliateLink(newLink);
    localStorage.setItem('@cofrelink:affiliate', newLink);
  };

  return {
    hasSeenWelcome, completeWelcome,
    theme, updateTheme,
    color, updateColor,
    avatar, updateAvatar,
    affiliateLink, updateAffiliateLink,
    isLoaded
  };
}

export const getColorClasses = (color: AppColor) => {
  switch (color) {
    case 'green': return { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', textInvert: 'text-white' };
    case 'purple': return { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', border: 'border-purple-600', ring: 'focus:ring-purple-500', textInvert: 'text-white' };
    case 'red': return { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', border: 'border-rose-600', ring: 'focus:ring-rose-500', textInvert: 'text-white' };
    case 'black': return { bg: 'bg-zinc-900 dark:bg-zinc-100', hover: 'hover:bg-zinc-800 dark:hover:bg-zinc-200', text: 'text-zinc-900 dark:text-zinc-100', border: 'border-zinc-900 dark:border-zinc-100', ring: 'focus:ring-zinc-500', textInvert: 'text-white dark:text-zinc-900' };
    case 'blue':
    default: return { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', border: 'border-blue-600', ring: 'focus:ring-blue-500', textInvert: 'text-white' };
  }
}
