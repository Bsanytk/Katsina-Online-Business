import React, { useState, useEffect } from 'react'
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
 * - Proper modal state management (ESC, backdrop click)
 * - English language only
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
      question: t('faq.items.0.question') || 'How do I create an account?',
      answer: t('faq.items.0.answer') || 'Click the "Register" button and fill in your details. You\'ll receive a verification email to confirm your account.',
    },
    {
      id: 2,
      question: t('faq.items.1.question') || 'How can I list a product?',
      answer: t('faq.items.1.answer') || 'Navigate to your Seller Dashboard and click "Add Product". Fill in the details, upload images, and set your price. Your product will be live immediately.',
    },
    {
      id: 3,
      question: t('faq.items.2.question') || 'Is there a fee to list products?',
      answer: t('faq.items.2.answer') || 'We offer free product listings for all sellers. Check our Verified Sellers Program for special benefits.',
    },
    {
      id: 4,
      question: t('faq.items.3.question') || 'How does payment work?',
      answer: t('faq.items.3.answer') || 'We support secure payments. All transactions are protected, and funds are handled securely.',
    },
    {
      id: 5,
      question: t('faq.items.4.question') || 'Can I edit my product listing?',
      answer: t('faq.items.4.answer') || 'Yes! You can edit or delete your listings anytime from your Dashboard. Changes take effect immediately.',
    },
    {
      id: 6,
      question: t('faq.items.5.question') || 'What if I have an issue with an order?',
      answer: t('faq.items.5.answer') || 'Contact our support team through the Help Center or WhatsApp. We\'re available 9AM-5PM WAT.',
    },
  ]

  // Handle ESC key to close modal
  useEffect(() => {
    function handleEscKey(e) {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  function handleClose() {
    setIsOpen(false)
    setActiveTab('menu')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSubmitted(false)
  }

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
    if (import.meta.env.DEV) console.log('Support request:', formData)

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    setSubmitted(true)

    // Hide success message after 3 seconds and close
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  function toggleFaq(id) {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // Don't render on specific pages where widget might be intrusive
  const hiddenPages = ['/contact', '/help']
  const shouldHide = hiddenPages.some((page) => window.location.pathname === page)
  if (shouldHide && isOpen) {
    handleClose()
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl z-40 ${
          isOpen
            ? 'bg-kob-dark text-white'
            : 'bg-kob-primary text-white hover:scale-110'
        }`}
        title={isOpen ? t('supportWidget.title') : t('supportWidget.menu')}
        aria-label="Support widget toggle"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Backdrop - Click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[32rem] shadow-2xl rounded-lg z-40 animate-in slide-in-from-bottom-4 duration-300">
          <Card variant="elevated" className="h-full flex flex-col rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white p-4 rounded-t-lg flex-shrink-0">
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
                        className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium text-sm text-gray-800">{faq.question}</span>
                        <span className={`transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="p-3 bg-gray-50 border-t text-sm text-gray-600 animate-slide-down">
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
                    <Alert type="success" title="✓ Success!" className="animate-fade-in">
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
              <div className="border-t p-3 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="text-sm text-kob-primary font-medium hover:underline transition-colors"
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
