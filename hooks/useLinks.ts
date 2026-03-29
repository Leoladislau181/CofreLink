import { useState, useEffect } from 'react';

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  category: string;
  icon: string;
  createdAt: number;
}

export const CATEGORIES = ['Trabalho', 'Estudos', 'Compras', 'Vídeos', 'Redes Sociais', 'Outros'];

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('@cofrelink:links');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLinks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse links from localStorage', e);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  const saveLinks = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    localStorage.setItem('@cofrelink:links', JSON.stringify(newLinks));
  };

  const addLink = (name: string, url: string, category: string, icon: string) => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      name,
      url: formattedUrl,
      category: category || 'Outros',
      icon: icon || 'Link2',
      createdAt: Date.now(),
    };
    saveLinks([...links, newLink]);
  };

  const updateLink = (id: string, name: string, url: string, category: string, icon: string) => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    saveLinks(links.map(link => link.id === id ? { ...link, name, url: formattedUrl, category, icon } : link));
  };

  const deleteLink = (id: string) => {
    saveLinks(links.filter(link => link.id !== id));
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

  const importLinks = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        const validLinks = parsed.filter(l => l.id && l.name && l.url);
        // Merge with existing or replace? Let's replace for simplicity, or merge. Let's merge and deduplicate by ID.
        const existingIds = new Set(links.map(l => l.id));
        const newLinks = validLinks.filter(l => !existingIds.has(l.id));
        saveLinks([...links, ...newLinks]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return { links, isLoaded, addLink, updateLink, deleteLink, exportLinks, importLinks };
}
