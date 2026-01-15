/**
 * Analytics Service - Google Analytics Integration
 * Tracks user behavior, conversions, and marketplace metrics
 * 
 * Environment variables required:
 * - VITE_GA_MEASUREMENT_ID (Google Analytics Measurement ID)
 */

export class AnalyticsService {
  constructor() {
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    this.initialized = false
    this.init()
  }

  /**
   * Initialize Google Analytics
   */
  init() {
    if (!this.measurementId) {
      console.warn('Google Analytics measurement ID not configured')
      return
    }

    // Load GA script
    this.loadGAScript()
    this.initialized = true
  }

  /**
   * Load Google Analytics script from CDN
   */
  loadGAScript() {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', this.measurementId)
  }

  /**
   * Track page view
   * Called when user navigates to a new page
   */
  pageView(pagePath, pageTitle) {
    if (!this.initialized) return

    window.gtag?.('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }

  /**
   * Track custom event
   * Generic event tracking for any user action
   */
  trackEvent(eventName, eventData = {}) {
    if (!this.initialized) return

    window.gtag?.('event', eventName, eventData)
  }

  /**
   * Track product view
   * Called when user views a product
   */
  trackProductView(product) {
    this.trackEvent('view_item', {
      currency: 'NGN',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price: product.price,
        },
      ],
    })
  }

  /**
   * Track product search
   * Called when user searches for products
   */
  trackSearch(searchTerm, resultsCount) {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    })
  }

  /**
   * Track add to cart (or in this case, product interest)
   * Called when user marks product as favorite
   */
  trackAddToCart(product) {
    this.trackEvent('add_to_cart', {
      currency: 'NGN',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    })
  }

  /**
   * Track purchase completion
   * Called after successful payment
   */
  trackPurchase(orderId, products, totalAmount) {
    this.trackEvent('purchase', {
      transaction_id: orderId,
      value: totalAmount,
      currency: 'NGN',
      items: products.map((p) => ({
        item_id: p.id,
        item_name: p.title,
        item_category: p.category,
        price: p.price,
        quantity: p.quantity || 1,
      })),
    })
  }

  /**
   * Track seller signup
   */
  trackSellerSignup() {
    this.trackEvent('sign_up', {
      method: 'seller',
    })
  }

  /**
   * Track product listing creation
   */
  trackProductListing(product) {
    this.trackEvent('custom_product_created', {
      product_id: product.id,
      product_title: product.title,
      product_category: product.category,
      product_price: product.price,
    })
  }

  /**
   * Track contact form submission
   */
  trackContactForm(subject) {
    this.trackEvent('contact_form_submit', {
      subject,
    })
  }

  /**
   * Track user engagement (time on page, scroll depth)
   * Note: This is a simplified version
   */
  trackEngagement(engagementMetrics) {
    this.trackEvent('engagement', engagementMetrics)
  }

  /**
   * Track error events
   */
  trackError(errorName, errorDetails) {
    this.trackEvent('exception', {
      description: errorName,
      fatal: false,
      error_details: errorDetails,
    })
  }

  /**
   * Set user properties
   * Called after authentication
   */
  setUserProperties(userId, userRole) {
    window.gtag?.('config', this.measurementId, {
      user_id: userId,
      user_properties: {
        user_role: userRole,
      },
    })
  }

  /**
   * Track page performance metrics
   */
  trackPagePerformance() {
    if (!window.performance) return

    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart

      this.trackEvent('page_load_time', {
        value: pageLoadTime,
      })
    })
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

/**
 * Custom hook for React components to track events
 * Usage: const { trackEvent } = useAnalytics()
 */
export function useAnalytics() {
  return {
    trackEvent: (eventName, eventData) => analytics.trackEvent(eventName, eventData),
    trackProductView: (product) => analytics.trackProductView(product),
    trackSearch: (term, count) => analytics.trackSearch(term, count),
    trackPurchase: (orderId, products, amount) =>
      analytics.trackPurchase(orderId, products, amount),
  }
}
