import React, { useState } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * SupportWidget Component
 * Floating support panel with quick access to help resources
 * 
 * Features:
 * - Toggleable floating widget with full i18n support
 * - Quick contact options (WhatsApp, Phone, Email)
 * - FAQ accordion
 * - Direct contact form
 * - Multi-language support (English, Hausa, Arabic)
 */
export default function SupportWidget() {
  const t = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('menu') // menu, faq, contact
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Contact info from translations
  const contactPhone = t('common.contact_phone') || '07089454544'
  const contactWhatsApp = t('common.contact_whatsapp_link') || 'https://wa.me/2347089454544'
  const contactEmail = t('common.contact_email') || 'bsanidatatech@gmail.com'

  // FAQs from translations or fallback to hardcoded
  const faqs = [
    {
      id: 1,
      question: t('faq.items.1.question') || 'How do I create a seller account?',
      answer: t('faq.items.1.answer') || 'Click on "Register" and select "Seller" as your account type. You\'ll need to verify your email address to start listing products.',
    },
    {
      id: 2,
      question: t('faq.items.2.question') || 'How do I contact a seller?',
      answer: t('faq.items.2.answer') || 'Each product has a WhatsApp button. Click it to send a message directly to the seller about the product you\'re interested in.',
    },
    {
      id: 3,
      question: t('faq.items.3.question') || 'Is it safe to buy on KOB?',
      answer: t('faq.items.3.answer') || 'Yes! Always communicate through WhatsApp, meet in safe public locations, and verify products before payment. Don\'t share sensitive information.',
    },
    {
      id: 4,
      question: t('faq.items.4.question') || 'What payment methods do you accept?',
      answer: t('faq.items.4.answer') || 'KOB doesn\'t handle payments. Arrange payment directly with sellers via bank transfer, cash, or your preferred method.',
    },
    {
      id: 5,
      question: t('faq.items.5.question') || 'How do I delete my listing?',
      answer: t('faq.items.5.answer') || 'Go to your Dashboard, find your product, and click the delete button. Your listing will be removed immediately.',
    },
    {
      id: 6,
      question: t('faq.items.6.question') || 'Can I edit my product details?',
      answer: t('faq.items.6.answer') || 'Yes! In your Dashboard, click the edit button on any product to update title, description, price, or image.',
    },
  ]

  function handleFormChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    // In production, this would send to a backend
    // For now, we'll just show a success message
    console.log('Support request:', formData)

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    setSubmitted(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setActiveTab('menu')
    }, 3000)
  }

  function toggleFaq(id) {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // Don't render on specific pages where widget might be intrusive
  const hiddenPages = ['/contact', '/help']
  const shouldHide = hiddenPages.some((page) => window.location.pathname === page)
  if (shouldHide && isOpen) {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl z-40 ${
          isOpen
            ? 'bg-kob-dark text-white'
            : 'bg-kob-primary text-white hover:scale-110'
        }`}
        title={isOpen ? t('supportWidget.title') : t('supportWidget.menu')}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-96 shadow-2xl rounded-lg z-40 animate-in slide-in-from-bottom-4 duration-300">
          <Card variant="elevated" className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white p-4 rounded-t-lg">
              <h3 className="font-bold text-lg">💬 {t('supportWidget.title')}</h3>
              <p className="text-xs opacity-90">{t('supportWidget.availableHours')}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Menu View */}
              {activeTab === 'menu' && (
                <div className="space-y-2">
                  {/* WhatsApp Quick Button */}
                  <a
                    href={contactWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-green-900">💬 {t('supportWidget.whatsapp')}</span>
                    <p className="text-xs text-green-700 mt-1">{t('common.contact_whatsapp') || 'Chat directly on WhatsApp'}</p>
                  </a>

                  {/* Phone Quick Button */}
                  <a
                    href={`tel:${contactPhone.replace(/\D/g, '')}`}
                    className="block p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-blue-900">📞 {t('supportWidget.phone')}</span>
                    <p className="text-xs text-blue-700 mt-1">{contactPhone}</p>
                  </a>

                  {/* Email Quick Button */}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="block p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-purple-900">📧 {t('supportWidget.email')}</span>
                    <p className="text-xs text-purple-700 mt-1">{contactEmail}</p>
                  </a>

                  <button
                    onClick={() => setActiveTab('faq')}
                    className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-orange-900">❓ {t('supportWidget.faqTitle')}</span>
                    <p className="text-xs text-orange-700 mt-1">{t('supportWidget.allFaq')}</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <span className="font-semibold text-indigo-900">📝 {t('supportWidget.contactTitle')}</span>
                    <p className="text-xs text-indigo-700 mt-1">{t('supportWidget.allHelp')}</p>
                  </button>
                </div>
              )}

              {/* FAQ View */}
              {activeTab === 'faq' && (
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="font-medium text-sm text-gray-800">{faq.question}</span>
                        <span className={`transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="p-3 bg-gray-50 border-t text-sm text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Form View */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {submitted && (
                    <Alert type="success" title="✓ Success!">
                      {t('supportWidget.success')}
                    </Alert>
                  )}

                  <Input
                    label={t('supportWidget.yourName')}
                    name="name"
                    type="text"
                    placeholder={t('common.enterName') || 'Your Name'}
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />

                  <Input
                    label={t('supportWidget.yourEmail')}
                    name="email"
                    type="email"
                    placeholder={t('common.enterEmail') || 'your@email.com'}
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />

                  <Input
                    label={t('supportWidget.subject')}
                    name="subject"
                    type="text"
                    placeholder={t('common.subject') || 'Subject'}
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                  />

                  <Textarea
                    label={t('supportWidget.message')}
                    name="message"
                    placeholder={t('common.yourMessage') || 'Your message...'}
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={3}
                    required
                  />

                  <Button type="submit" variant="primary" className="w-full">
                    📤 {t('supportWidget.submit')}
                  </Button>
                </form>
              )}
            </div>

            {/* Footer with Back Button */}
            {activeTab !== 'menu' && (
              <div className="border-t p-3">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="text-sm text-kob-primary font-medium hover:underline"
                >
                  ← {t('common.backToMenu') || 'Back to Menu'}
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
