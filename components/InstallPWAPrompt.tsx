import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada (modo standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si está en iOS (Safari no soporta beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS mostrar el prompt de todas formas (instrucciones manuales)
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(true);
    }

    // Detectar cuando se instala
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome - usar el prompt nativo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS - mostrar instrucciones
      alert('Para instalar FutbolMatch:\n\n1. Tocá el botón Compartir (□↑)\n2. Seleccioná "Añadir a pantalla de inicio"\n3. Tocá "Agregar"');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Guardar en localStorage para no mostrar por un tiempo
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // No mostrar si ya está instalada
  if (isInstalled) return null;

  // No mostrar si fue descartado recientemente (24 horas)
  const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedAt && Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-pulse">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl p-4 flex items-center gap-3">
        <div className="bg-white rounded-lg p-2 flex-shrink-0">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">Instalá FutbolMatch</p>
          <p className="text-indigo-200 text-xs">Acceso rápido desde tu pantalla de inicio</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-indigo-200 hover:text-white p-1"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={handleInstallClick}
            className="bg-white text-indigo-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAPrompt;
