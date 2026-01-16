import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'

export default function FAQ() {
  const t = useTranslation()
  const faqs = t('faq.items')

  const [expandedId, setExpandedId] = React.useState(null)

  return (
    <main className="min-h-screen bg-kob-light">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{t('faq.title')}</h1>
          <p className="text-xl md:text-2xl opacity-95 font-light">{t('faq.subtitle')}</p>
        </div>
      </div>

      <div className="container max-w-3xl py-16 md:py-24">
        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              variant="default"
              className="overflow-hidden rounded-lg border border-kob-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-kob-light transition-colors text-left group"
              >
                <span className="font-semibold text-lg text-kob-dark group-hover:text-kob-primary transition-colors">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-kob-primary transition-transform duration-300 flex-shrink-0 ${
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
                <div className="px-6 py-5 bg-gradient-to-br from-kob-light to-white border-t-2 border-kob-neutral-200 text-gray-700 text-base leading-relaxed animate-slide-up">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Still have questions?</h2>
          <p className="text-lg md:text-xl opacity-95 mb-8 font-light max-w-2xl mx-auto">
            Our friendly support team is here to help. Reach out anytime, and we'll be happy to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              📧 Email Us
            </a>
            <a
              href={t('common.contact_whatsapp_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
