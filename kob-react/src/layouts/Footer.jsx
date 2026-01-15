import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const t = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-kob-dark text-white mt-12">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{t('common.kob')}</h3>
            <p className="text-gray-400 text-sm">
              {t('common.brand')} - {t('home.hero.tagline')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/marketplace" className="hover:text-kob-gold transition-colors">{t('navigation.marketplace')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-kob-gold transition-colors">{t('navigation.dashboard')}</Link></li>
              <li><a href={t('seller.forms.seller_registration')} target="_blank" rel="noopener noreferrer" className="hover:text-kob-gold transition-colors">Become a Seller</a></li>
              <li><Link to="/faq" className="hover:text-kob-gold transition-colors">{t('navigation.faq')}</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-kob-gold transition-colors">{t('navigation.help')}</Link></li>
              <li><Link to="/contact" className="hover:text-kob-gold transition-colors">{t('footer.contact_us')}</Link></li>
              <li><a href="#support" className="hover:text-kob-gold transition-colors">Live Chat</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-kob-gold transition-colors">{t('navigation.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-kob-gold transition-colors">{t('navigation.privacy')}</Link></li>
              <li><a href="#cookies" className="hover:text-kob-gold transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {t('common.brand')}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-kob-gold transition-colors">Twitter</a>
            <a href="#" className="hover:text-kob-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-kob-gold transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
