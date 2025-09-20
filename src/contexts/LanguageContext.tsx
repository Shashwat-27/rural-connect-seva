import React, { createContext, useContext, useState, useEffect } from 'react';
import languageData from '../data/languages.json';

type Language = 'hi' | 'en' | 'pa';
type Translations = typeof languageData.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Load from localStorage or default to Hindi
    const saved = localStorage.getItem('telemedicine-language');
    return (saved as Language) || 'hi';
  });

  const t = languageData[language] as Translations;
  const isRTL = false; // For future RTL language support

  useEffect(() => {
    localStorage.setItem('telemedicine-language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};