import { useTranslation } from 'i18next-react';

/**
 * LanguageSwitcher Component
 * Allows users to switch between supported languages
 * Languages: English, Hausa, Arabic
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: '🇬🇧 English', label: 'EN' },
    { code: 'ha', name: '🇳🇬 Hausa', label: 'HA' },
    { code: 'ar', name: '🇸🇦 العربية', label: 'AR' }
  ];

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            i18n.language === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
