import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'

export default function Terms() {
  const t = useTranslation()

  const sections = [
    {
      heading: t('terms.acceptance.heading'),
      content: t('terms.acceptance.content'),
      isList: false
    },
    {
      heading: t('terms.responsibilities.heading'),
      intro: null,
      items: t('terms.responsibilities.items'),
      isList: true
    },
    {
      heading: t('terms.product_listings.heading'),
      intro: t('terms.product_listings.intro'),
      items: t('terms.product_listings.items'),
      isList: true
    },
    {
      heading: t('terms.prohibited.heading'),
      intro: t('terms.prohibited.intro'),
      items: t('terms.prohibited.items'),
      isList: true
    },
    {
      heading: t('terms.liability.heading'),
      content: t('terms.liability.content'),
      isList: false
    },
    {
      heading: t('terms.dispute_resolution.heading'),
      content: t('terms.dispute_resolution.content'),
      isList: false
    },
    {
      heading: t('terms.changes.heading'),
      content: t('terms.changes.content'),
      isList: false
    },
    {
      heading: t('terms.contact.heading'),
      content: t('terms.contact.content'),
      isList: false
    }
  ]

  return (
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-kob-dark mb-2">{t('terms.title')}</h1>
          <p className="text-gray-600">{t('terms.last_updated')}</p>
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
              {section.heading === t('terms.contact.heading') && (
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
          <h2 className="text-2xl font-bold mb-4">Need Clarification?</h2>
          <p className="mb-6">Our team is happy to answer any questions about our terms.</p>
          <a
            href={`mailto:${t('common.contact_email')}`}
            className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </main>
  )
}
