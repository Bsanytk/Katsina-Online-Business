import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'

export default function FAQ() {
  const t = useTranslation()
  const faqs = t('faq.items')

  const [expandedId, setExpandedId] = React.useState(null)

  return (
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-kob-dark mb-4">{t('faq.title')}</h1>
          <p className="text-gray-600 text-lg">{t('faq.subtitle')}</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              variant="default"
              className="overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-semibold text-kob-dark">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedId === idx ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {expandedId === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-kob-primary to-kob-gold text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">Our support team is here to help. Reach out anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              📧 Email Us
            </a>
            <a
              href={t('common.contact_whatsapp_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
