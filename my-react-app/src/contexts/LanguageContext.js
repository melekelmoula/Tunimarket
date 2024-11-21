// my-react-app/src/contexts/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';
import translations from '../translations';

// Create the LanguageContext
const LanguageContext = createContext();

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language is English

  const switchLanguage = (lang) => {
    setLanguage(lang); // Switch between 'en' and 'fr'
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Function to get the translation
export const translate = (key, language) => {
  return translations[language][key] || key;  // Now accepts 'language' as an argument
};
