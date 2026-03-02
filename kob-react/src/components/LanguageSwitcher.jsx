import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component (English only)
 * This app is configured for English only. The switcher provides a static indicator.
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 rounded text-sm font-medium bg-gray-200 text-gray-800"
        title="English"
        onClick={() => {
          if (i18n.language !== 'en') i18n.changeLanguage('en')
        }}
      >
        EN
      </button>
    </div>
  );
}
