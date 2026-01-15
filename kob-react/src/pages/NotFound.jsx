import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { Button } from '../components/ui'

export default function NotFound() {
  const t = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-kob-light to-kob-dark flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-kob-primary opacity-20 mb-4">404</h1>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Content */}
        <h2 className="text-4xl font-bold text-kob-dark mb-4">{t('errors.not_found_title')}</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          {t('errors.not_found_message')}
        </p>

        {/* Suggested Actions */}
        <div className="space-y-3 mb-12">
          <p className="text-sm text-gray-500 font-semibold">Try one of these:</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-kob-primary text-white font-semibold rounded-lg hover:bg-kob-dark transition-colors"
            >
              {t('errors.go_home')} →
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-kob-gold text-kob-dark font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {t('errors.go_marketplace')} →
            </button>
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="px-6 py-3 border-2 border-kob-primary text-kob-primary font-semibold rounded-lg hover:bg-kob-primary hover:text-white transition-colors"
            >
              {t('errors.contact_support')} →
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Need help?</strong>
          </p>
          <p className="text-sm text-gray-600 mb-3">
            Our support team is available Monday-Friday, 9AM-6PM WAT
          </p>
          <p className="text-sm font-semibold text-kob-primary mb-2">
            📧 {t('common.contact_email')}
          </p>
          <p className="text-sm font-semibold text-kob-primary">
            📞 {t('common.contact_phone')}
          </p>
        </div>
      </div>
    </main>
  )
}
