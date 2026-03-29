import { User, Sun, Moon, Link as LinkIcon, Save, Check, Copy, ExternalLink, Palette, Download, Upload, Camera, Share, PlusSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AppColor, getColorClasses } from '@/hooks/useSettings';
import { useLinks } from '@/hooks/useLinks';

export function MenuTab({ settings }: { settings: any }) {
  const [showSaved, setShowSaved] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const { exportLinks, importLinks } = useLinks();

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setTimeout(() => setIsStandalone(true), 0);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setTimeout(() => setIsIOS(/iphone|ipad|ipod/.test(userAgent)), 0);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const colorClasses = getColorClasses(settings.color);
  const colors: { id: AppColor, label: string, bgClass: string }[] = [
    { id: 'blue', label: 'Azul', bgClass: 'bg-blue-500' },
    { id: 'green', label: 'Verde', bgClass: 'bg-emerald-500' },
    { id: 'purple', label: 'Roxo', bgClass: 'bg-purple-500' },
    { id: 'red', label: 'Vermelho', bgClass: 'bg-rose-500' },
    { id: 'black', label: 'Preto', bgClass: 'bg-zinc-900 dark:bg-zinc-100' },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        settings.updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const success = importLinks(reader.result as string);
        if (success) {
          alert('Links importados com sucesso!');
        } else {
          alert('Erro ao importar links. Verifique o arquivo.');
        }
        if (importInputRef.current) importInputRef.current.value = '';
      };
      reader.readAsText(file);
    }
  };

  const copyReferralLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const shareReferralLink = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CofreLink',
          text: 'Conheça o CofreLink, seu gerenciador de links e atalhos!',
          url: url,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-300 max-w-md mx-auto pb-24">
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        Menu
      </h2>

      <div className="flex flex-col items-center mb-8">
        <div 
          className="relative w-24 h-24 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100 dark:border-zinc-700 cursor-pointer overflow-hidden group"
          onClick={() => fileInputRef.current?.click()}
        >
          {settings.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-6 h-6" />
          </div>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleAvatarChange} 
        />
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Meu Perfil</h3>
      </div>

      <div className="space-y-6">
        {/* Tema */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 px-1">
            Aparência
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => settings.updateTheme('light')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-medium transition-all ${
                settings.theme === 'light'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'bg-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Sun size={18} />
              Claro
            </button>
            <button
              onClick={() => settings.updateTheme('dark')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-medium transition-all ${
                settings.theme === 'dark'
                  ? 'bg-zinc-800 dark:bg-zinc-700 text-white shadow-sm border border-zinc-700 dark:border-zinc-600'
                  : 'bg-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Moon size={18} />
              Escuro
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4 px-1">
            <Palette className="text-zinc-400" size={18} />
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cor Principal
            </h4>
          </div>
          <div className="flex justify-between px-2">
            {colors.map(c => (
              <button
                key={c.id}
                onClick={() => settings.updateColor(c.id)}
                className={`w-10 h-10 rounded-full ${c.bgClass} flex items-center justify-center transition-transform ${settings.color === c.id ? 'scale-110 ring-2 ring-offset-2 dark:ring-offset-zinc-900 ring-zinc-400' : 'hover:scale-105'}`}
                aria-label={c.label}
              >
                {settings.color === c.id && <Check size={16} className={c.id === 'black' ? 'text-white dark:text-zinc-900' : 'text-white'} />}
              </button>
            ))}
          </div>
        </div>

        {/* Instalar Aplicativo */}
        {!isStandalone && (deferredPrompt || isIOS) && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Download className={colorClasses.text} size={20} />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Instalar Aplicativo
              </h4>
            </div>
            <div className="space-y-3 px-1">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Instale o CofreLink no seu celular para acessar seus atalhos mais rápido, direto da tela inicial.
              </p>
              {isIOS ? (
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Para instalar no iOS: toque em <b>Compartilhar</b> <Share size={16} className="inline mb-1 mx-1" /> na barra do Safari e depois em <b>Adicionar à Tela de Início</b> <PlusSquare size={16} className="inline mb-1 mx-1" />.
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className={`w-full flex items-center justify-center gap-2 font-medium py-3.5 px-4 rounded-2xl transition-colors shadow-sm active:scale-[0.98] ${colorClasses.bg} ${colorClasses.textInvert}`}
                >
                  <Download size={18} /> Instalar Agora
                </button>
              )}
            </div>
          </div>
        )}

        {/* Indique o Aplicativo */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-4 px-1">
            <LinkIcon className={colorClasses.text} size={20} />
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Indique o Aplicativo
            </h4>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 px-1">
              Gostou do CofreLink? Compartilhe com seus amigos e ajude a divulgar!
            </p>
            <div className="flex gap-2">
              <button 
                onClick={shareReferralLink}
                className={`flex-1 flex items-center justify-center gap-2 font-medium py-3.5 px-4 rounded-2xl transition-colors shadow-sm active:scale-[0.98] ${colorClasses.bg} ${colorClasses.textInvert}`}
              >
                <ExternalLink size={18} /> Compartilhar
              </button>
              <button 
                onClick={copyReferralLink}
                className="flex items-center justify-center w-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Copiar link"
              >
                {showCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 px-1">
            Backup de Dados
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportLinks}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Download size={18} />
              Exportar
            </button>
            <button
              onClick={() => importInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Upload size={18} />
              Importar
            </button>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={importInputRef} 
              onChange={handleImport} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
