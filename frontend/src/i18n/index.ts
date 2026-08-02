import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import kg from './locales/kg.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import en from './locales/en.json';

const savedLang = localStorage.getItem('bn_lang');

i18n.use(initReactI18next).init({
  resources: {
    kg: { translation: kg },
    ru: { translation: ru },
    uz: { translation: uz },
    en: { translation: en },
  },
  lng: savedLang || 'kg', // Default language: Kyrgyz
  fallbackLng: 'kg',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
