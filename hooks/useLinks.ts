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

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setIsLoaded(true);
      return;
    }

    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching links:', error);
      } else {
        setLinks(data || []);
      }
      setIsLoaded(true);
    };

    fetchLinks();
  }, [user]);

  const addLink = async (name: string, url: string, category: string, icon: string) => {
    if (!user) return;
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    const newLink = {
      user_id: user.id,
      name,
      url: formattedUrl,
      category: category || 'Outros',
      icon: icon || 'Link2',
    };

    const { data, error } = await supabase
      .from('links')
      .insert([newLink])
      .select()
      .single();

    if (error) {
      console.error('Error adding link:', error);
    } else if (data) {
      setLinks([...links, data]);
    }
  };

  const updateLink = async (id: string, name: string, url: string, category: string, icon: string) => {
    if (!user) return;
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    const { error } = await supabase
      .from('links')
      .update({ name, url: formattedUrl, category, icon })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating link:', error);
    } else {
      setLinks(links.map(link => link.id === id ? { ...link, name, url: formattedUrl, category, icon } : link));
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting link:', error);
    } else {
      setLinks(links.filter(link => link.id !== id));
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
