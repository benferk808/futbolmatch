
import React, { useState } from 'react';
import type { Match } from './types';
import CreateMatchForm from './components/CreateMatchForm';
import MatchView from './components/MatchView';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';


const AppContent: React.FC = () => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const { t } = useTranslation();

  const handleMatchCreated = (match: Match) => {
    setCurrentMatch(match);
  };

  const handleBackToHome = () => {
    setCurrentMatch(null);
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
