import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import qb from './qb.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    qb: { translation: qb },
  },
  lng: 'qb', // default
  fallbackLng: 'en',
});

export default i18n;