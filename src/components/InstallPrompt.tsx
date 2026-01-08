import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      if (!hasDeclined) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDecline = () => {
    localStorage.setItem('pwa-install-declined', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 p-4 shadow-2xl z-50 animate-fade-in border-primary">
      <div className="flex items-start gap-3">
        <div className="bg-black text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold shrink-0">
          V
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Установить приложение</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Добавьте МойДосуг на главный экран для быстрого доступа
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="flex-1">
              <Icon name="Download" size={14} className="mr-1" />
              Установить
            </Button>
            <Button onClick={handleDecline} variant="ghost" size="sm">
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InstallPrompt;
