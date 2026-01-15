import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { Card, Button } from '../components/ui'

export default function Help() {
  const t = useTranslation()
  
  const helpCategories = [
    {
      icon: '🛍️',
      title: 'Buying Guide',
      description: 'Learn how to browse, search, and purchase products safely.',
      links: ['Browse Marketplace', 'Search Tips', 'Payment Methods', 'Shipping Info']
    },
    {
      icon: '📦',
      title: 'Selling Guide',
      description: 'Start selling on KOB with our step-by-step seller resources.',
      links: [
        { text: 'Register as Seller', href: t('seller.forms.seller_registration'), external: true },
        { text: 'List a Product', href: '#', external: false },
        { text: 'Verified Sellers Program', href: '#', external: false },
        { text: 'Seller Dashboard', href: '/dashboard', external: false }
      ]
    },
    {
      icon: '🔒',
      title: 'Account & Security',
      description: 'Secure your account and manage your personal information.',
      links: ['Password Security', 'Two-Factor Auth', 'Account Settings', 'Privacy Control']
    },
    {
      icon: '💳',
      title: 'Payments & Billing',
      description: 'Understand our payment systems and manage your transactions.',
      links: ['Payment Methods', 'Invoices', 'Refunds', 'Disputes']
    },
    {
      icon: '🚚',
      title: 'Shipping & Delivery',
      description: 'Get help with orders, tracking, and delivery issues.',
      links: [
        { text: 'Track Order', href: '#', external: false },
        { text: 'Shipping Rates', href: '#', external: false },
        { text: 'Express Delivery', href: t('seller.forms.express_delivery'), external: true },
        { text: 'Return Policy', href: '#', external: false }
      ]
    },
    {
      icon: '⚙️',
      title: 'Technical Support',
      description: 'Troubleshooting and technical issues.',
      links: ['App Issues', 'Browser Compatibility', 'Performance', 'Report a Bug']
    }
  ]

  return (
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-kob-dark mb-4">Help Center</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're here to help. Browse our guides or get in touch with our support team.
          </p>
        </div>

        {/* Search Bar (Placeholder) */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kob-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-kob-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Help Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {helpCategories.map((category, idx) => (
            <Card key={idx} variant="elevated" hover className="p-6">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-kob-dark mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.links.map((link, i) => {
                  const linkObj = typeof link === 'string' ? { text: link, href: '#', external: false } : link
                  return (
                    <li key={i}>
                      {linkObj.external ? (
                        <a
                          href={linkObj.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-kob-primary font-medium text-sm hover:underline"
                        >
                          {linkObj.text} →
                        </a>
                      ) : (
                        <a href={linkObj.href} className="text-kob-primary font-medium text-sm hover:underline">
                          {linkObj.text} →
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-kob-primary to-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">We offer multiple ways to get support. Choose the one that works best for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              📧 Email Support
            </a>
            <a
              href={t('common.contact_whatsapp_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              💬 WhatsApp Chat
            </a>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-white text-kob-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              📞 Contact Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
