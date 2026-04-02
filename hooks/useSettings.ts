import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export type AppColor = 'blue' | 'green' | 'purple' | 'red' | 'black';
export type AppTheme = 'light' | 'dark';

export function useSettings() {
  const { user } = useAuth();
  const [hasSeenWelcome, setHasSeenWelcome] = useState(true);
  const [theme, setTheme] = useState<AppTheme>('light');
  const [color, setColor] = useState<AppColor>('blue');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setTheme(data.theme || 'light');
        setColor(data.color || 'blue');
        setAvatar(data.avatar_url || null);
        setName(data.name || '');
        setAffiliateLink(data.affiliate_link || '');
        setHasSeenWelcome(true); // If they have a profile, they've seen welcome

        if (data.theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        // No profile found, show welcome
        setHasSeenWelcome(false);
      }
      setIsLoaded(true);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    }
  };

  const completeWelcome = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .insert([{ id: user.id, theme, color, name, avatar_url: avatar, affiliate_link: affiliateLink }]);

    if (error) {
      console.error('Error creating profile:', error);
    } else {
      setHasSeenWelcome(true);
    }
  };

  const updateTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    updateProfile({ theme: newTheme });
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const updateColor = (newColor: AppColor) => {
    setColor(newColor);
    updateProfile({ color: newColor });
  };

  const updateAvatar = (newAvatar: string | null) => {
    setAvatar(newAvatar);
    updateProfile({ avatar_url: newAvatar });
  };

  const updateName = (newName: string) => {
    setName(newName);
    updateProfile({ name: newName });
  };

  const updateAffiliateLink = (newLink: string) => {
    setAffiliateLink(newLink);
    updateProfile({ affiliate_link: newLink });
  };

  return {
    hasSeenWelcome, completeWelcome,
    theme, updateTheme,
    color, updateColor,
    avatar, updateAvatar,
    name, updateName,
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
