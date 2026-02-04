
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const commonClasses = "px-3 py-1 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-indigo-600 text-white";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="flex items-center bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => setLanguage('es')}
        className={`${commonClasses} ${language === 'es' ? activeClasses : inactiveClasses}`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`${commonClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
