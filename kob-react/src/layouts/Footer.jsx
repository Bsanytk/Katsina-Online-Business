import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const t = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-kob-dark to-kob-neutral-900 text-white mt-16 border-t-4 border-kob-gold">
      {/* Main Footer Content */}
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">🏪</span>
              <h3 className="text-3xl font-extrabold text-kob-gold">{t('common.kob')}</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              {t('common.brand')} - {t('home.hero.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all duration-300 text-lg">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all duration-300 text-lg">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all duration-300 text-lg">
                📷
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-kob-gold">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/marketplace" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.marketplace')}</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.dashboard')}</Link></li>
              <li><a href={t('seller.forms.seller_registration')} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>Become a Seller</a></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.faq')}</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-kob-gold">{t('footer.support')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.help')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('footer.contact_us')}</Link></li>
              <li><a href={t('common.contact_whatsapp_link')} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>Live Chat</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-kob-gold">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.terms')}</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>{t('navigation.privacy')}</Link></li>
              <li><a href="#cookies" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2"><span>→</span>Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-base font-medium">&copy; {currentYear} {t('common.brand')}. All rights reserved.</p>
          <div className="flex gap-6 text-base font-semibold">
            <a href="#" className="text-gray-300 hover:text-kob-gold transition-colors duration-300">Twitter</a>
            <a href="#" className="text-gray-300 hover:text-kob-gold transition-colors duration-300">Facebook</a>
            <a href="#" className="text-gray-300 hover:text-kob-gold transition-colors duration-300">Instagram</a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            Made with ❤️ by the Katsina Online Business team | <Link to="/privacy" className="text-kob-gold hover:text-kob-light transition-colors">Privacy Policy</Link> | <Link to="/terms" className="text-kob-gold hover:text-kob-light transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
