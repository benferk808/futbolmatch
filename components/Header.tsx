
import React from 'react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
    onHomeClick: () => void;
    showHomeButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, showHomeButton }) => {
  const { t } = useTranslation();

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <h1 className="text-xl font-bold text-white tracking-wider">{t('appName')}</h1>
        </div>
        <div className="flex items-center gap-4">
            {showHomeButton && (
                <button 
                    onClick={onHomeClick}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors text-sm"
                >
                    {t('newMatch')}
                </button>
            )}
            <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
