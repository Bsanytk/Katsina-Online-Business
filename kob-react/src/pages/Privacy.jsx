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
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-kob-dark mb-2">{t('privacy.title')}</h1>
          <p className="text-gray-600 mb-4">{t('privacy.last_updated')}</p>
          <p className="text-gray-700 leading-relaxed italic">{t('privacy.intro')}</p>
        </div>

        {/* Content */}
        <Card variant="default" className="p-8 space-y-6">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-kob-dark mb-3">{section.heading}</h2>
              {section.intro && <p className="text-gray-700 leading-relaxed mb-3">{section.intro}</p>}
              {section.isList ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )}
              {section.heading === t('privacy.contact.heading') && (
                <div className="mt-4 p-4 bg-kob-light rounded-lg">
                  <p className="font-semibold text-kob-dark mb-2">📧 {t('common.contact_email')}</p>
                  <p className="font-semibold text-kob-dark">📞 {t('common.contact_phone')}</p>
                </div>
              )}
            </section>
          ))}
        </Card>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-kob-primary to-kob-gold text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Privacy Matters to Us</h2>
          <p className="mb-6">Have concerns about how we handle your data? Reach out anytime.</p>
          <a
            href={`mailto:${t('common.contact_email')}`}
            className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Privacy Team
          </a>
        </div>
      </div>
    </main>
  )
}
