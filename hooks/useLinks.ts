import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  category: string;
  icon: string;
  createdAt: number;
  user_id: string;
}

export const CATEGORIES = ['Trabalho', 'Estudos', 'Compras', 'Vídeos', 'Redes Sociais', 'Outros'];

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    if (!user) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    const loadAndFetch = async () => {
      // 1. Try to load from cache first
      const cachedLinks = localStorage.getItem(`links_${user.id}`);
      if (cachedLinks) {
        try {
          setLinks(JSON.parse(cachedLinks));
          setIsLoaded(true);
        } catch (e) {
          console.error('Error parsing cached links:', e);
        }
      }

      // 2. Fetch from Supabase in background
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching links:', error);
      } else if (data) {
        setLinks(data);
        localStorage.setItem(`links_${user.id}`, JSON.stringify(data));
      }
      setIsLoaded(true);
    };

    loadAndFetch();
  }, [user]);

  const addLink = async (name: string, url: string, category: string, icon: string) => {
    if (!user) return;
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    // Optimistic update
    const tempId = Math.random().toString(36).substring(2, 15);
    const newLinkObj: LinkItem = {
      id: tempId,
      user_id: user.id,
      name,
      url: formattedUrl,
      category: category || 'Outros',
      icon: icon || 'Link2',
      createdAt: Date.now(),
    };

    const updatedLinks = [...links, newLinkObj];
    setLinks(updatedLinks);
    localStorage.setItem(`links_${user.id}`, JSON.stringify(updatedLinks));

    const { data, error } = await supabase
      .from('links')
      .insert([{
        user_id: user.id,
        name,
        url: formattedUrl,
        category: category || 'Outros',
        icon: icon || 'Link2',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding link to Supabase:', error);
      // We keep the local version for now
    } else if (data) {
      // Replace temp link with real data from server
      const finalLinks = updatedLinks.map(l => l.id === tempId ? data : l);
      setLinks(finalLinks);
      localStorage.setItem(`links_${user.id}`, JSON.stringify(finalLinks));
    }
  };

  const updateLink = async (id: string, name: string, url: string, category: string, icon: string) => {
    if (!user) return;
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    // Optimistic update
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, name, url: formattedUrl, category, icon } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem(`links_${user.id}`, JSON.stringify(updatedLinks));

    const { error } = await supabase
      .from('links')
      .update({ name, url: formattedUrl, category, icon })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating link in Supabase:', error);
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) return;
    
    // Optimistic update
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem(`links_${user.id}`, JSON.stringify(updatedLinks));

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting link from Supabase:', error);
    }
  };

  const exportLinks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "cofrelink_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importLinks = async (jsonString: string) => {
    if (!user) return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        const validLinks = parsed.map(l => ({
          user_id: user.id,
          name: l.name,
          url: l.url,
          category: l.category || 'Outros',
          icon: l.icon || 'Link2',
        }));
        
        const { data, error } = await supabase
          .from('links')
          .insert(validLinks)
          .select();

        if (error) {
          console.error('Error importing links:', error);
          return false;
        }
        setLinks([...links, ...data]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return { links, isLoaded, addLink, updateLink, deleteLink, exportLinks, importLinks };
}
