import React, { createContext, useContext, useState, useEffect } from 'react';
import languageData from '../data/languages.json';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage or default to Hindi
    const saved = localStorage.getItem('telemedicine-language');
    return saved || 'hi';
  });

  const t = languageData[language];
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