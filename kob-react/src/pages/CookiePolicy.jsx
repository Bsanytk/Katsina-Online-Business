import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'
import BackButton from '../components/BackButton'

export default function CookiePolicy() {
  const t = useTranslation()

  const sections = [
    {
      heading: t('cookies.what.heading'),
      content: t('cookies.what.content'),
      isList: false
    },
    {
      heading: t('cookies.types.heading'),
      intro: t('cookies.types.intro'),
      items: t('cookies.types.items'),
      isList: true
    },
    {
      heading: t('cookies.purpose.heading'),
      intro: t('cookies.purpose.intro'),
      items: t('cookies.purpose.items'),
      isList: true
    },
    {
      heading: t('cookies.third_party.heading'),
      content: t('cookies.third_party.content'),
      isList: false
    },
    {
      heading: t('cookies.control.heading'),
      intro: t('cookies.control.intro'),
      items: t('cookies.control.items'),
      isList: true,
      note: t('cookies.control.note')
    },
    {
      heading: t('cookies.updates.heading'),
      content: t('cookies.updates.content'),
      isList: false
    },
    {
      heading: t('cookies.contact.heading'),
      content: t('cookies.contact.content'),
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
            {t('cookies.title')}
          </h1>
          <p className="text-lg opacity-90">
            {t('cookies.last_updated')}
          </p>
        </div>
      </div>

      <div className="container max-w-4xl py-16 md:py-24">

        {/* Intro */}
        <Card
          variant="default"
          className="p-8 md:p-10 rounded-2xl mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
        >
          <p className="text-lg text-blue-900 leading-relaxed">
            {t('cookies.intro')}
          </p>
        </Card>

        {/* Policy Sections */}
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

                    {section.note && (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-yellow-900 font-medium text-sm">
                          {section.note}
                        </p>
                      </div>
                    )}

                    {section.heading === t('cookies.contact.heading') && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-kob-light to-white rounded-lg border-2 border-kob-primary">

                        <p className="font-semibold text-kob-dark mb-3 text-lg">
                          📧 {t('common.contact_email')}
                        </p>

                        <p className="font-semibold text-kob-dark text-lg">
                          📞 {t('common.contact_phone')}
                        </p>

                        <p className="mt-4 text-gray-600 text-sm">
                          This Cookie Policy is reviewed and maintained by the
                          <strong> KOB Legal & Compliance Team</strong> to ensure
                          transparency in how the platform uses cookies,
                          analytics technologies, and third-party integrations.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </section>
            )
          })}
        </Card>

        {/* Contact Banner */}
        <div className="mt-12 bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 text-center shadow-lg">

          <h2 className="text-4xl font-extrabold mb-4">
            Questions About Cookies?
          </h2>

          <p className="text-lg opacity-95 mb-8 font-light">
            Our KOB team can help clarify how cookies are used across the platform.
          </p>

          <a
            href={`mailto:${t('common.contact_email')}`}
            className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Contact KOB Support
          </a>

        </div>

        {/* Tips */}
        <Card
          variant="outlined"
          className="mt-12 p-6 rounded-lg bg-green-50 border-2 border-green-200"
        >
          <p className="text-green-900 text-base">
            <strong>💡 Tip:</strong> You can manage cookie permissions through your browser settings. Regularly review your privacy preferences to maintain full control of your browsing data.
          </p>
        </Card>

      </div>
    </main>
  )
}
