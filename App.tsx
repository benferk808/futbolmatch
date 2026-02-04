
import React, { useState, useEffect } from 'react';
import type { Match } from './types';
import CreateMatchForm from './components/CreateMatchForm';
import MatchView from './components/MatchView';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';
import { getMatch } from './services/api';

const AppContent: React.FC = () => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Cargar partido desde URL al iniciar
  useEffect(() => {
    const loadMatchFromURL = async () => {
      // Buscar match ID en la URL (formato: #/match/xxxxx)
      const hash = window.location.hash;
      const matchId = hash.match(/#\/match\/([a-zA-Z0-9-]+)/)?.[1];

      if (matchId) {
        try {
          const match = await getMatch(matchId);
          setCurrentMatch(match);
        } catch (error) {
          console.error('Error loading match:', error);
          // Si no se encuentra el partido, mostrar formulario
          window.location.hash = '';
        }
      }
      setLoading(false);
    };

    loadMatchFromURL();

    // Escuchar cambios en el hash
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/' || hash === '#') {
        setCurrentMatch(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleMatchCreated = (match: Match) => {
    setCurrentMatch(match);
    // Actualizar URL con el ID del partido
    window.location.hash = `/match/${match.id}`;
  };

  const handleBackToHome = () => {
    setCurrentMatch(null);
    window.location.hash = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header onHomeClick={handleBackToHome} showHomeButton={!!currentMatch} />
      <main className="container mx-auto p-4 md:p-6">
        {currentMatch ? (
          <MatchView initialMatch={currentMatch} onMatchUpdate={setCurrentMatch} />
        ) : (
          <CreateMatchForm onMatchCreated={handleMatchCreated} />
        )}
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
