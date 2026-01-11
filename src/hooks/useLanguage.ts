// src/hooks/useLanguage.ts

import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { LanguageContextType } from '@/types/shared';

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};