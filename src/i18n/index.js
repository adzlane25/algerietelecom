import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './ar.json';
import fr from './fr.json';
import en from './en.json';

const resources = { ar: { translation: ar }, fr: { translation: fr }, en: { translation: en } };

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources, fallbackLng: 'ar', lng: 'ar', interpolation: { escapeValue: false }
});

i18n.on('languageChanged', (lng) => { localStorage.setItem('i18nextLng', lng); });

export default i18n;