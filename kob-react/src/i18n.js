import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ha from './locales/ha.json';
import ar from './locales/ar.json';

/**
 * i18n Configuration for Katsina Online Business (KOB)
 * Supports: Hausa (default), English, Arabic
 * Fixed: Added initReactI18next to prevent "Cannot read properties of null" error
 */

const resources = {
  en: { translation: en },
  ha: { translation: ha },
  ar: { translation: ar }
};

i18n
  // React integration - MUST come before LanguageDetector
  .use(initReactI18next)
  // Detect language from browser
  .use(LanguageDetector)
  // Initialize i18next
  .init({
    resources,
    lng: 'ha', // Default language: Hausa
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false // XSS protection is handled by React
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
