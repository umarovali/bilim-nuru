import { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type Lang = 'kg' | 'uz' | 'en';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'kg', label: 'KG' },
  { code: 'uz', label: 'UZB' },
  { code: 'en', label: 'EN' },
];

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState<Lang>((localStorage.getItem('bn_lang') as Lang) || 'kg');

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('bn_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
