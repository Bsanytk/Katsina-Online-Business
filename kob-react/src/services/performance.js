/**
 * Web Vitals Tracking Service
 * Tracks Core Web Vitals and performance metrics
 * Sends data to Google Analytics and optional monitoring service
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint) - How quickly main content loads
 * - FID (First Input Delay) - How responsive site is to user interaction
 * - CLS (Cumulative Layout Shift) - How stable layout is while loading
 */

export class WebVitalsTracker {
  constructor() {
    this.vitals = {}
    this.initialized = false
  }

  /**
   * Initialize Web Vitals tracking
   * Should be called once on app mount
   */
  init() {
    if (this.initialized) return

    // Track all available metrics
    this.trackLCP() // Largest Contentful Paint
    this.trackFID() // First Input Delay
    this.trackCLS() // Cumulative Layout Shift
    this.trackFCP() // First Contentful Paint
    this.trackTTFB() // Time to First Byte
    this.trackTTI() // Time to Interactive

    this.initialized = true
    console.log('Web Vitals tracking initialized')
  }

  /**
   * Largest Contentful Paint (LCP)
   * Time when the largest content element becomes visible
   * Target: < 2.5 seconds
   */
  trackLCP() {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          const lcp = lastEntry.renderTime || lastEntry.loadTime

          this.vitals.lcp = lcp
          this.reportMetric('LCP', lcp, {
            'good': lcp < 2500,
            'needsImprovement': lcp >= 2500 && lcp < 4000,
            'poor': lcp >= 4000,
          })
        })

        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      }
    } catch (err) {
      console.error('Error tracking LCP:', err)
    }
  }

  /**
   * First Input Delay (FID)
   * Time from user interaction to browser response
   * Target: < 100 milliseconds
   */
  trackFID() {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fid = entries[0].processingDuration

          this.vitals.fid = fid
          this.reportMetric('FID', fid, {
            'good': fid < 100,
            'needsImprovement': fid >= 100 && fid < 300,
            'poor': fid >= 300,
          })
        })

        observer.observe({ entryTypes: ['first-input'] })
      }
    } catch (err) {
      console.error('Error tracking FID:', err)
    }
  }

  /**
   * Cumulative Layout Shift (CLS)
   * Amount of unexpected layout shift during page load
   * Target: < 0.1
   */
  trackCLS() {
    try {
      if ('PerformanceObserver' in window) {
        let cls = 0

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          }

          this.vitals.cls = cls
          this.reportMetric('CLS', cls, {
            'good': cls < 0.1,
            'needsImprovement': cls >= 0.1 && cls < 0.25,
            'poor': cls >= 0.25,
          })
        })

        observer.observe({ entryTypes: ['layout-shift'] })
      }
    } catch (err) {
      console.error('Error tracking CLS:', err)
    }
  }

  /**
   * First Contentful Paint (FCP)
   * Time when first content appears
   * Target: < 1.8 seconds
   */
  trackFCP() {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcp = entries[entries.length - 1].startTime

          this.vitals.fcp = fcp
          this.reportMetric('FCP', fcp)
        })

        observer.observe({ entryTypes: ['paint'] })
      }
    } catch (err) {
      console.error('Error tracking FCP:', err)
    }
  }

  /**
   * Time to First Byte (TTFB)
   * Time from request start to first byte of response
   * Target: < 600 milliseconds
   */
  trackTTFB() {
    try {
      if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
          const timing = window.performance.timing
          const ttfb = timing.responseStart - timing.navigationStart

          this.vitals.ttfb = ttfb
          this.reportMetric('TTFB', ttfb)
        })
      }
    } catch (err) {
      console.error('Error tracking TTFB:', err)
    }
  }

  /**
   * Time to Interactive (TTI)
   * Time until page is fully interactive
   * Target: < 3.8 seconds
   */
  trackTTI() {
    try {
      if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
          const timing = window.performance.timing
          const tti = timing.loadEventEnd - timing.navigationStart

          this.vitals.tti = tti
          this.reportMetric('TTI', tti)
        })
      }
    } catch (err) {
      console.error('Error tracking TTI:', err)
    }
  }

  /**
   * Report metric to analytics
   */
  reportMetric(name, value, status = {}) {
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag?.('event', `core_web_vital_${name.toLowerCase()}`, {
        value: Math.round(value),
        metric_name: name,
        metric_value: value,
        ...status,
      })
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(
        `📊 ${name}: ${Math.round(value)}ms`,
        status.good ? '✅' : status.needsImprovement ? '⚠️' : '❌'
      )
    }
  }

  /**
   * Get all tracked vitals
   */
  getVitals() {
    return this.vitals
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      vitals: this.vitals,
      grade: this.calculateGrade(),
      recommendations: this.getRecommendations(),
    }

    return report
  }

  /**
   * Calculate overall performance grade
   */
  calculateGrade() {
    const scores = []

    if (this.vitals.lcp) {
      scores.push(this.vitals.lcp < 2500 ? 100 : this.vitals.lcp < 4000 ? 75 : 50)
    }
    if (this.vitals.fid) {
      scores.push(this.vitals.fid < 100 ? 100 : this.vitals.fid < 300 ? 75 : 50)
    }
    if (this.vitals.cls) {
      scores.push(this.vitals.cls < 0.1 ? 100 : this.vitals.cls < 0.25 ? 75 : 50)
    }

    if (scores.length === 0) return 'N/A'

    const average = scores.reduce((a, b) => a + b) / scores.length

    if (average >= 90) return 'A'
    if (average >= 80) return 'B'
    if (average >= 70) return 'C'
    if (average >= 60) return 'D'
    return 'F'
  }

  /**
   * Get performance recommendations
   */
  getRecommendations() {
    const recommendations = []

    if (this.vitals.lcp && this.vitals.lcp > 2500) {
      recommendations.push(
        'LCP: Optimize images, reduce JavaScript, implement lazy loading'
      )
    }

    if (this.vitals.fid && this.vitals.fid > 100) {
      recommendations.push('FID: Reduce JavaScript execution, use code splitting')
    }

    if (this.vitals.cls && this.vitals.cls > 0.1) {
      recommendations.push('CLS: Add size attributes to images, avoid layout shifts')
    }

    return recommendations.length > 0
      ? recommendations
      : ['✅ All metrics performing well!']
  }

  /**
   * Export metrics for sending to backend
   */
  exportMetrics() {
    return {
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      metrics: this.vitals,
      report: this.generateReport(),
    }
  }
}

// Create singleton instance
export const webVitalsTracker = new WebVitalsTracker()

/**
 * React Hook for Web Vitals
 * Usage: useWebVitals()
 */
export function useWebVitals() {
  React.useEffect(() => {
    webVitalsTracker.init()
  }, [])

  return {
    getVitals: () => webVitalsTracker.getVitals(),
    generateReport: () => webVitalsTracker.generateReport(),
    exportMetrics: () => webVitalsTracker.exportMetrics(),
  }
}

// Import React
import React from 'react'
