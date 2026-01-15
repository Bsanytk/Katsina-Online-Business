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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-kob-dark mb-3">{t('contact.title')}</h1>
          <p className="text-gray-600 text-lg">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Email */}
              <Card variant="elevated">
                <div className="p-6">
                  <div className="text-3xl mb-3">📧</div>
                  <h3 className="font-bold text-lg text-kob-dark mb-2">{t('contact.email_label')}</h3>
                  <p className="text-gray-600 text-sm">{t('common.contact_email')}</p>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card variant="elevated">
                <div className="p-6">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-bold text-lg text-kob-dark mb-2">{t('contact.whatsapp_label')}</h3>
                  <a 
                    href={t('common.contact_whatsapp_link')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline font-medium text-sm"
                  >
                    {t('contact.chat_with_us')}
                  </a>
                </div>
              </Card>

              {/* Phone */}
              <Card variant="elevated">
                <div className="p-6">
                  <div className="text-3xl mb-3">☎️</div>
                  <h3 className="font-bold text-lg text-kob-dark mb-2">{t('contact.phone_label')}</h3>
                  <p className="text-gray-600 text-sm">{t('common.contact_phone')}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="p-8">
              {submitted && (
                <Alert type="success" title={t('contact.success')} className="mb-6">
                  {t('contact.success')}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label={t('contact.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.name')}
                    required
                    disabled={submitted}
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
                />

                <Textarea
                  label={t('contact.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder={t('contact.message')}
                  required
                  disabled={submitted}
                />

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full"
                  disabled={submitted}
                >
                  {t('contact.send')} ✓
                </Button>
              </form>
            </Card>

            {/* FAQ */}
            <Card variant="outlined" className="mt-8 p-6">
              <h3 className="font-bold text-lg text-kob-dark mb-4">❓ {t('help.faq')}</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>How long does shipping take?</strong> Delivery depends on the seller's location.</p>
                <p><strong>How do I contact a seller?</strong> Use the WhatsApp "Contact" button on any product.</p>
                <p><strong>How do I become a verified seller?</strong> Fill out the seller application form.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
