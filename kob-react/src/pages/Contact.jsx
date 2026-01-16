import React, { useState } from 'react'
import { Button, Card, Input, Textarea, Alert } from '../components/ui'
import { useTranslation } from '../hooks/useTranslation'

export default function Contact() {
  const t = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // In a real app, this would send to a backend
    // For now, we'll just simulate success
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <main className="min-h-screen bg-kob-light">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{t('contact.title')}</h1>
          <p className="text-xl md:text-2xl opacity-95 font-light">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Email */}
              <Card variant="elevated" className="p-7 rounded-xl card-hover">
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-kob-primary to-kob-gold rounded-lg">
                  <span className="text-3xl block">📧</span>
                </div>
                <h3 className="font-bold text-lg text-kob-dark mb-3">{t('contact.email_label')}</h3>
                <p className="text-gray-600 text-base break-all">{t('common.contact_email')}</p>
              </Card>

              {/* WhatsApp */}
              <Card variant="elevated" className="p-7 rounded-xl card-hover">
                <div className="mb-4 inline-block p-3 bg-green-500 rounded-lg">
                  <span className="text-3xl block">📱</span>
                </div>
                <h3 className="font-bold text-lg text-kob-dark mb-3">{t('contact.whatsapp_label')}</h3>
                <a 
                  href={t('common.contact_whatsapp_link')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-bold text-base transition-colors"
                >
                  {t('contact.chat_with_us')} →
                </a>
              </Card>

              {/* Phone */}
              <Card variant="elevated" className="p-7 rounded-xl card-hover">
                <div className="mb-4 inline-block p-3 bg-blue-500 rounded-lg">
                  <span className="text-3xl block">☎️</span>
                </div>
                <h3 className="font-bold text-lg text-kob-dark mb-3">{t('contact.phone_label')}</h3>
                <p className="text-gray-600 text-base">{t('common.contact_phone')}</p>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="p-10 rounded-xl">
              {submitted && (
                <Alert type="success" title={t('contact.success')} className="mb-8 animate-fade-in">
                  {t('contact.success')}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    label={t('contact.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.name')}
                    required
                    disabled={submitted}
                    className="rounded-lg focus:ring-2 focus:ring-offset-2"
                  />
                  <Input
                    type="email"
                    label={t('common.email')}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('common.contact_email')}
                    required
                    disabled={submitted}
                    className="rounded-lg focus:ring-2 focus:ring-offset-2"
                  />
                </div>

                <Input
                  type="text"
                  label={t('contact.subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('contact.subject')}
                  required
                  disabled={submitted}
                  className="rounded-lg focus:ring-2 focus:ring-offset-2"
                />

                <Textarea
                  label={t('contact.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder={t('contact.message')}
                  required
                  disabled={submitted}
                  className="rounded-lg focus:ring-2 focus:ring-offset-2"
                />

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg font-semibold"
                  disabled={submitted}
                >
                  {t('contact.send')} ✓
                </Button>
              </form>
            </Card>

            {/* FAQ Quick Links */}
            <Card variant="outlined" className="mt-8 p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <h3 className="font-bold text-xl text-blue-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">❓</span> {t('help.faq')}
              </h3>
              <div className="space-y-4 text-base text-blue-900">
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0">🚚</span>
                  <p><strong>How long does shipping take?</strong> Delivery depends on the seller's location.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0">💬</span>
                  <p><strong>How do I contact a seller?</strong> Use the WhatsApp "Chat" button on any product.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0">✅</span>
                  <p><strong>How do I become a verified seller?</strong> Fill out the seller application form.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
