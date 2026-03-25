import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) return;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    if (iOS) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    } else {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShowPrompt(true), 3000);
      };
      
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 fade-in" data-testid="install-prompt">
      <div className="bg-[#2C2C2E] border border-white p-4 max-w-lg mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-white mb-1 font-bold">Install Threshold</p>
            {isIOS ? (
              <p className="text-[#8E8E93] text-xs leading-relaxed">
                Tap the share button below, then "Add to Home Screen" for the full experience.
              </p>
            ) : (
              <p className="text-[#8E8E93] text-xs leading-relaxed">
                Add to your home screen for private, instant access.
              </p>
            )}
          </div>
          <button 
            onClick={handleDismiss}
            className="text-[#8E8E93] hover:text-white bg-transparent border-0 cursor-pointer flex-shrink-0 p-1"
            data-testid="dismiss-install-prompt"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
        {!isIOS && (
          <button 
            onClick={handleInstall}
            className="btn-primary mt-3 py-3 text-xs"
            data-testid="install-button"
          >
            Add to Home Screen
          </button>
        )}
      </div>
    </div>
  );
}
