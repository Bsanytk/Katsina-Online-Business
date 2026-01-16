import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { Button } from '../components/ui'

export default function NotFound() {
  const t = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-kob-light via-white to-kob-gold flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-kob-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-kob-gold rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-lg relative z-10">
        {/* 404 Icon */}
        <div className="mb-8 animate-bounce">
          <h1 className="text-9xl md:text-[120px] font-extrabold text-transparent bg-gradient-to-r from-kob-primary to-kob-gold bg-clip-text mb-4">404</h1>
          <div className="text-8xl mb-8 block">🔍</div>
        </div>

        {/* Content */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-kob-dark mb-5">{t('errors.not_found_title')}</h2>
        <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed font-medium">
          {t('errors.not_found_message')}
        </p>

        {/* Suggested Actions */}
        <div className="mb-12 animate-fade-in">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-6">Suggested Next Steps:</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-kob-primary to-kob-primary-dark text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {t('errors.go_home')} →
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-4 bg-gradient-to-r from-kob-gold to-kob-primary text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {t('errors.go_marketplace')} →
            </button>
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="px-8 py-4 border-2 border-kob-primary text-kob-primary font-bold rounded-lg hover:bg-kob-primary hover:text-white transition-all duration-300 transform hover:scale-105 bg-kob-light"
            >
              {t('errors.contact_support')} →
            </a>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-8 bg-white rounded-2xl shadow-lg border-2 border-kob-neutral-200">
          <p className="text-base text-gray-700 font-bold mb-5">
            💬 Need help?
          </p>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Our support team is available Monday-Friday, 9AM-6PM WAT
          </p>
          <div className="flex flex-col gap-3 text-center">
            <p className="text-base font-bold text-kob-primary">
              📧 {t('common.contact_email')}
            </p>
            <p className="text-base font-bold text-kob-primary">
              📞 {t('common.contact_phone')}
            </p>
          </div>
        </div>

        {/* Fun Message */}
        <p className="mt-8 text-gray-500 italic text-sm">
          Don't worry, even the best explorers get lost sometimes! 🗺️
        </p>
      </div>
    </main>
  )
}
