
export type Language = 'en' | 'ar';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  en: Translation;
  ar: Translation;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}