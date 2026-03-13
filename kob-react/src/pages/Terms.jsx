import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'
import BackButton from '../components/BackButton'

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
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-lg opacity-90">
            {t('terms.last_updated')}
          </p>
        </div>
      </div>

      <div className="container max-w-4xl py-16 md:py-24">

        {/* Terms Content */}
        <Card variant="default" className="p-10 md:p-12 rounded-2xl space-y-10">
          {sections.map((section, idx) => {

            const itemsArray = Array.isArray(section.items)
              ? section.items
              : []

            return (
              <section key={idx} className="scroll-mt-20">
                <div className="flex items-start gap-4">
                  <div className="text-4xl font-bold text-kob-primary opacity-20 flex-shrink-0 w-12 text-center">
                    {idx + 1}
                  </div>

                  <div className="flex-1">

                    <h2 className="text-3xl font-bold text-kob-dark mb-4">
                      {section.heading}
                    </h2>

                    {section.intro && (
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {section.intro}
                      </p>
                    )}

                    {section.isList ? (
                      <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                        {itemsArray.map((item, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-kob-primary font-bold flex-shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {section.content}
                      </p>
                    )}

                    {section.heading === t('terms.contact.heading') && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-kob-light to-white rounded-lg border-2 border-kob-primary">

                        <p className="font-semibold text-kob-dark mb-3 text-lg">
                          📧 {t('common.contact_email')}
                        </p>

                        <p className="font-semibold text-kob-dark text-lg">
                          📞 {t('common.contact_phone')}
                        </p>

                        <p className="mt-4 text-gray-600 text-sm">
                          These Terms are reviewed and maintained by the
                          <strong> KOB Legal & Compliance Team</strong> to ensure
                          marketplace fairness, user protection, and regulatory
                          compliance.
                        </p>

                      </div>
                    )}

                  </div>
                </div>
              </section>
            )
          })}
        </Card>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 text-center shadow-lg">

          <h2 className="text-4xl font-extrabold mb-4">
            Need Clarification?
          </h2>

          <p className="text-lg opacity-95 mb-8 font-light">
            Our KOB support and legal team can clarify any part of these terms.
          </p>

          <a
            href={`mailto:${t('common.contact_email')}`}
            className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Contact KOB Team
          </a>

        </div>

        {/* Tip */}
        <Card variant="outlined" className="mt-12 p-6 rounded-lg bg-blue-50 border-2 border-blue-200">
          <p className="text-blue-900 text-base">
            <strong>💡 Tip:</strong> Scroll through each numbered section to review your rights and responsibilities on the KOB marketplace.
          </p>
        </Card>

      </div>
    </main>
  )
}
