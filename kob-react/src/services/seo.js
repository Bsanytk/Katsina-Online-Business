/**
 * SEO Utilities and Meta Tags Manager
 * Handles page titles, meta descriptions, Open Graph tags, and structured data
 */

/**
 * Update page meta tags for SEO
 * Call this in useEffect on each page
 */
export function updatePageMeta({
  title = 'Katsina Online Business - Local Marketplace',
  description = 'Discover authentic local products from verified sellers in Katsina',
  keywords = 'marketplace, katsina, online business, buy, sell',
  ogImage = 'https://katsina-online-business.com/og-image.jpg',
  ogType = 'website',
  canonicalUrl = window.location.href,
}) {
  // Update title
  document.title = title

  // Update or create meta tags
  updateMetaTag('name', 'description', description)
  updateMetaTag('name', 'keywords', keywords)
  updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0')

  // Open Graph (social media sharing)
  updateMetaTag('property', 'og:title', title)
  updateMetaTag('property', 'og:description', description)
  updateMetaTag('property', 'og:image', ogImage)
  updateMetaTag('property', 'og:type', ogType)
  updateMetaTag('property', 'og:url', canonicalUrl)

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image')
  updateMetaTag('name', 'twitter:title', title)
  updateMetaTag('name', 'twitter:description', description)
  updateMetaTag('name', 'twitter:image', ogImage)

  // Additional SEO
  updateMetaTag('name', 'theme-color', '#C5A059')
  updateMetaTag('name', 'mobile-web-app-capable', 'yes')

  // Canonical URL
  updateCanonicalLink(canonicalUrl)
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(attr, attrValue, content) {
  let tag = document.querySelector(`meta[${attr}="${attrValue}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, attrValue)
    document.head.appendChild(tag)
  }

  tag.content = content
}

/**
 * Update canonical link
 */
function updateCanonicalLink(url) {
  let link = document.querySelector('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }

  link.href = url
}

/**
 * Add structured data (JSON-LD) for rich snippets
 */
export function addStructuredData(type, data) {
  // Remove existing script if present
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Create new script
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.innerHTML = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Structured data templates
 */
export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Katsina Online Business',
    image: 'https://katsina-online-business.com/logo.png',
    description: 'Online marketplace for local businesses in Katsina',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Katsina',
      addressLocality: 'Katsina',
      addressRegion: 'Katsina',
      postalCode: '820001',
      addressCountry: 'NG',
    },
    url: 'https://katsina-online-business.com',
    sameAs: [
      'https://facebook.com/kob',
      'https://twitter.com/kob',
      'https://instagram.com/kob',
    ],
  },

  product: (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.imageURL || 'https://katsina-online-business.com/placeholder.jpg',
    brand: {
      '@type': 'Brand',
      name: product.sellerName || 'KOB Seller',
    },
    offers: {
      '@type': 'Offer',
      url: `https://katsina-online-business.com/product/${product.id}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  }),

  breadcrumb: (breadcrumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }),

  searchAction: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://katsina-online-business.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://katsina-online-business.com/marketplace?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
}

/**
 * SEO page configs for all routes
 */
export const PAGE_SEO_CONFIG = {
  '/': {
    title: 'Katsina Online Business - Authentic Local Marketplace',
    description:
      'Discover and buy authentic local products from verified sellers in Katsina. Support your community while enjoying quality goods.',
    keywords: 'marketplace, katsina, online shopping, local business, buy local',
  },

  '/marketplace': {
    title: 'Browse Products - Katsina Online Business Marketplace',
    description:
      'Browse thousands of authentic products from verified sellers across Katsina. Find electronics, fashion, food, and more.',
    keywords: 'marketplace, products, shopping, katsina, buy online',
  },

  '/dashboard': {
    title: 'My Dashboard - Katsina Online Business',
    description: 'Manage your profile, orders, and products on KOB marketplace.',
    keywords: 'dashboard, my account, orders, products',
  },

  '/contact': {
    title: 'Contact Us - Katsina Online Business',
    description:
      'Get in touch with our support team. We\'re here to help with any questions or issues.',
    keywords: 'contact, support, help, katsina online business',
  },

  '/faq': {
    title: 'Frequently Asked Questions - Katsina Online Business',
    description:
      'Find answers to common questions about buying, selling, and using KOB marketplace.',
    keywords: 'faq, help, questions, answers',
  },

  '/help': {
    title: 'Help Center - Katsina Online Business',
    description: 'Get help with buying, selling, payments, and more on KOB marketplace.',
    keywords: 'help, guide, tutorial, support',
  },

  '/login': {
    title: 'Login - Katsina Online Business',
    description: 'Sign in to your KOB account to access your dashboard and orders.',
    keywords: 'login, sign in, account',
  },

  '/register': {
    title: 'Create Account - Katsina Online Business',
    description:
      'Join KOB as a buyer or seller. Create your free account in minutes.',
    keywords: 'register, signup, account creation',
  },

  '/terms': {
    title: 'Terms of Service - Katsina Online Business',
    description: 'Read the terms and conditions for using KOB marketplace.',
    keywords: 'terms, conditions, legal',
  },

  '/privacy': {
    title: 'Privacy Policy - Katsina Online Business',
    description:
      'Learn how KOB protects your privacy and handles your personal information.',
    keywords: 'privacy, policy, data protection',
  },
}

/**
 * React Hook for SEO
 * Usage: usePageMeta(route)
 */
export function usePageMeta(pathname = window.location.pathname) {
  const config = PAGE_SEO_CONFIG[pathname] || PAGE_SEO_CONFIG['/']

  React.useEffect(() => {
    updatePageMeta(config)
    window.scrollTo(0, 0)
  }, [pathname, config])
}

/**
 * Generate sitemap
 * Call during build or serve from static file
 */
export function generateSitemap() {
  const baseUrl = 'https://katsina-online-business.com'
  const pages = Object.keys(PAGE_SEO_CONFIG)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>
`
  )
  .join('')}
</urlset>`

  return sitemap
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Allow: /marketplace
Allow: /login
Allow: /register
Disallow: /dashboard
Disallow: /admin

Sitemap: https://katsina-online-business.com/sitemap.xml

# Respect rate limits
User-agent: *
Crawl-delay: 1`
}

// Import React for useEffect
import React from 'react'
