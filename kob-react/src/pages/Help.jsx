import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { Card, Button } from '../components/ui'
import BackButton from '../components/BackButton'

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
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Help Center</h1>
          <p className="text-xl md:text-2xl opacity-95 font-light max-w-3xl mx-auto">
            We're here to help. Browse our guides or get in touch with our support team anytime.
          </p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 rounded-lg border-2 border-kob-neutral-300 focus:outline-none focus:ring-2 focus:ring-kob-primary focus:border-transparent text-base shadow-sm"
            />
            <button className="absolute right-4 top-4 text-gray-400 hover:text-kob-primary transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {helpCategories.map((category, idx) => (
            <Card key={idx} variant="elevated" className="p-8 rounded-xl card-hover animate-fade-in">
              <div className="text-6xl mb-5 inline-block">{category.icon}</div>
              <h3 className="text-2xl font-bold text-kob-dark mb-3">{category.title}</h3>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">{category.description}</p>
              <ul className="space-y-3 border-t border-kob-neutral-200 pt-5">
                {category.links.map((link, i) => {
                  const linkObj = typeof link === 'string' ? { text: link, href: '#', external: false } : link
                  return (
                    <li key={i}>
                      {linkObj.external ? (
                        <a
                          href={linkObj.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-kob-primary font-semibold text-base hover:text-kob-primary-dark transition-colors flex items-center gap-2"
                        >
                          <span>{linkObj.text}</span>
                          <span className="text-sm">→</span>
                        </a>
                      ) : (
                        <a href={linkObj.href} className="text-kob-primary font-semibold text-base hover:text-kob-primary-dark transition-colors flex items-center gap-2">
                          <span>{linkObj.text}</span>
                          <span className="text-sm">→</span>
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
        <div className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 md:p-16 text-center shadow-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">Still need help?</h2>
          <p className="text-lg md:text-xl opacity-95 mb-10 font-light max-w-2xl mx-auto">
            We offer multiple ways to get support. Choose the one that works best for you, and we'll be happy to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${t('common.contact_email')}`}
              className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              📧 Email Support
            </a>
            <a
              href={t('common.contact_whatsapp_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              💬 WhatsApp Chat
            </a>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              📞 Contact Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
