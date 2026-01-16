import { useTranslation as useI18nextTranslation } from 'react-i18next';

/**
 * Custom hook for translation with type-safe keys
 * Wraps react-i18next's useTranslation hook
 * Usage: const t = useTranslation();
 * 
 * Examples:
 * t('common.brand') // "Katsina Online Business"
 * t('home.hero.title') // Translated title
 * t('payment.error', { message: 'Invalid amount' })
 */
export function useTranslation() {
  const { t } = useI18nextTranslation();
  return t;
}

/**
 * Custom hook to get current language and language utilities
 * Usage: const { language, changeLanguage } = useLanguage();
 */
export function useLanguage() {
  const { i18n } = useI18nextTranslation();

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
