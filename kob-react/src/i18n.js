import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

/**
 * i18n Configuration for Katsina Online Business (KOB)
 * Supports: English only
 * Fixed: Added initReactI18next to prevent "Cannot read properties of null" error
 */

const resources = {
  en: { translation: en }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
