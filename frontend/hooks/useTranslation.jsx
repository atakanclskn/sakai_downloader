"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { tr } from '@/locales/tr';

const translations = { en, tr };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved && translations[saved]) {
      setLang(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  const changeLang = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('app-lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);
