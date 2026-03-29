import * as LucideIcons from 'lucide-react';

export const ICONS = [
  'Link2', 'Star', 'Heart', 'Briefcase', 'Book', 
  'ShoppingBag', 'Video', 'MessageCircle', 'Music', 
  'Image', 'Map', 'Camera', 'Coffee', 'Globe', 'Mail'
];

export function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Link2;
  return <Icon {...props} />;
}
