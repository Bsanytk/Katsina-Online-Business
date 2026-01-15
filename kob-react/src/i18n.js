import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ha from './locales/ha.json';
import ar from './locales/ar.json';

/**
 * i18n Configuration for Katsina Online Business (KOB)
 * Supports: English (en), Hausa (ha), Arabic (ar)
 */

const resources = {
  en: { translation: en },
  ha: { translation: ha },
  ar: { translation: ar }
};

i18n
  // Detect language from browser
  .use(LanguageDetector)
  // Initialize i18next
  .init({
    resources,
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
