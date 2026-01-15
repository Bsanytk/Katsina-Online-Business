import { useI18n } from 'i18next-react';

/**
 * Custom hook for translation with type-safe keys
 * Usage: const t = useTranslation();
 * 
 * Examples:
 * t('common.brand') // "Katsina Online Business"
 * t('home.hero.title') // Translated title
 * t('payment.error', { message: 'Invalid amount' })
 */
export function useTranslation() {
  const i18n = useI18n();
  return i18n.t.bind(i18n);
}

/**
 * Custom hook to get current language
 * Usage: const { language, changeLanguage } = useLanguage();
 */
export function useLanguage() {
  const i18n = useI18n();

  return {
    language: i18n.language,
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    isRTL: i18n.language === 'ar',
    changeLanguage: (lng) => {
      i18n.changeLanguage(lng);
      localStorage.setItem('preferredLanguage', lng);
    },
    isSupportedLanguage: (lng) => {
      return ['en', 'ha', 'ar'].includes(lng);
    }
  };
}

/**
 * Get language display name
 * @param {string} code - Language code (en, ha, ar)
 * @returns {string} - Display name with flag
 */
export function getLanguageName(code) {
  const languages = {
    en: '🇬🇧 English',
    ha: '🇳🇬 Hausa',
    ar: '🇸🇦 العربية'
  };
  return languages[code] || 'Unknown';
}
