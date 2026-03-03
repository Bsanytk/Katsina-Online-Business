import React from 'react'
import { Card, Button } from './ui'

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 * Provides graceful error handling and recovery
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(componentError, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', componentError, errorInfo)

    // Update state with error details
    this.setState((prevState) => ({
      error: componentError,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // Send error to monitoring service (e.g., Sentry)
    this.reportErrorToService(componentError, errorInfo)
  }

  reportErrorToService(componentError, errorInfo) {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, Bugsnag
    const errorData = {
      message: componentError.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }
    if (import.meta.env.DEV) console.log('Would send to error tracking:', errorData)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Show error page
      const isDevelopment = import.meta.env.DEV

      return (
        <main className="min-h-screen bg-kob-light flex items-center justify-center p-4">
          <Card variant="elevated" className="w-full max-w-2xl">
            <div className="p-8 text-center">
              {/* Error Icon */}
              <div className="text-6xl mb-4">⚠️</div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-kob-dark mb-2">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We encountered an unexpected error. Our team has been notified and we're
                working on fixing this issue.
              </p>

              {/* Error Details (Development Only) */}
              {isDevelopment && this.state.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-left">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-red-700 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="space-y-2 text-xs text-red-600 font-mono">
                      <div>
                        <strong>Message:</strong>
                        <p className="break-words">{this.state.error.toString()}</p>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="overflow-auto bg-white p-2 rounded border border-red-300">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Error Count Warning */}
              {this.state.errorCount > 2 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                  <p className="text-yellow-800">
                    <strong>⚠️ Multiple errors detected:</strong> If this issue persists,
                    please clear your browser cache and try again.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="primary" onClick={this.handleReset} size="lg">
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleReload} size="lg">
                  Back to Home
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                Need help? <a href="/contact" className="text-kob-primary hover:underline font-semibold">
                  Contact support
                </a>
              </p>
            </div>
          </Card>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
