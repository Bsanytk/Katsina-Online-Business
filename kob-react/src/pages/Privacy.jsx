import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'

export default function Privacy() {
  const t = useTranslation()

  const sections = [
    {
      heading: t('privacy.collection.heading'),
      intro: t('privacy.collection.intro'),
      items: t('privacy.collection.items'),
      isList: true
    },
    {
      heading: t('privacy.usage.heading'),
      intro: t('privacy.usage.intro'),
      items: t('privacy.usage.items'),
      isList: true
    },
    {
      heading: t('privacy.protection.heading'),
      content: t('privacy.protection.content'),
      isList: false
    },
    {
      heading: t('privacy.sharing.heading'),
      content: t('privacy.sharing.content'),
      isList: false
    },
    {
      heading: t('privacy.retention.heading'),
      content: t('privacy.retention.content'),
      isList: false
    },
    {
      heading: t('privacy.rights.heading'),
      content: t('privacy.rights.content'),
      isList: false
    },
    {
      heading: t('privacy.cookies.heading'),
      content: t('privacy.cookies.content'),
      isList: false
    },
    {
      heading: t('privacy.contact.heading'),
      content: t('privacy.contact.content'),
      isList: false
    }
  ]

  return (
    <main className="min-h-screen bg-kob-light">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{t('privacy.title')}</h1>
          <p className="text-lg opacity-90 mb-4">{t('privacy.last_updated')}</p>
          <p className="text-lg opacity-95 font-light max-w-3xl mx-auto italic">{t('privacy.intro')}</p>
        </div>
      </div>

      <div className="container max-w-4xl py-16 md:py-24">
        {/* Content */}
        <Card variant="default" className="p-10 md:p-12 rounded-2xl space-y-10">
          {sections.map((section, idx) => (
            <section key={idx} className="scroll-mt-20">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-bold text-kob-primary opacity-20 flex-shrink-0 w-12 text-center">{idx + 1}</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-kob-dark mb-4">{section.heading}</h2>
                  {section.intro && <p className="text-gray-700 text-lg leading-relaxed mb-4">{section.intro}</p>}
                  {section.isList ? (
                    <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-kob-primary font-bold flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-lg leading-relaxed">{section.content}</p>
                  )}
                  {section.heading === t('privacy.contact.heading') && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-kob-light to-white rounded-lg border-2 border-kob-primary">
                      <p className="font-semibold text-kob-dark mb-3 text-lg">📧 {t('common.contact_email')}</p>
                      <p className="font-semibold text-kob-dark text-lg">📞 {t('common.contact_phone')}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </Card>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 text-center shadow-lg">
          <h2 className="text-4xl font-extrabold mb-4">Your Privacy Matters to Us</h2>
          <p className="text-lg opacity-95 mb-8 font-light">Have concerns about how we handle your data? Reach out anytime.</p>
          <a
            href={`mailto:${t('common.contact_email')}`}
            className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Contact Privacy Team
          </a>
        </div>

        {/* Data Rights Info */}
        <Card variant="outlined" className="mt-12 p-6 rounded-lg bg-green-50 border-2 border-green-200">
          <p className="text-green-900 text-base">
            <strong>🛡️ Your Rights:</strong> You have the right to access, modify, or delete your personal data at any time. Contact us for assistance.
          </p>
        </Card>
      </div>
    </main>
  )
}
