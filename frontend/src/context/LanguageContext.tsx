'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (labels: Record<string, string> | string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (labels: Record<string, string> | string) => {
    if (typeof labels === 'string') return labels;
    return labels[language] || labels['en'] || Object.values(labels)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
