import React, { useState } from 'react'
import { loginUser } from '../firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { Input, Button, Alert, Card } from '../components/ui'
import BackButton from '../components/BackButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await loginUser(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-kob-light via-white to-kob-primary-light flex items-center justify-center p-4 py-12">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-kob-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-kob-gold rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card variant="elevated" className="p-8 md:p-10 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-kob-primary to-kob-gold rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-kob-dark mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Sign in to your KOB account</p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert type="error" title="Login Failed" className="mb-6 animate-fade-in">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg focus:ring-2 focus:ring-offset-2"
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg focus:ring-2 focus:ring-offset-2"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-kob-primary focus:ring-2 focus:ring-kob-primary"
                  disabled={loading}
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link to="/contact" className="text-kob-primary hover:text-kob-primary-dark font-medium transition-colors">
                Need help?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full mt-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '✓ Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-kob-neutral-300 to-transparent"></div>
            <span className="text-xs text-gray-500 font-medium uppercase">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-kob-neutral-300 to-transparent"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-700 text-base font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-kob-primary hover:text-kob-primary-dark font-bold hover:underline transition-colors">
              Create one now
            </Link>
          </p>
        </Card>

        {/* Footer Help */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Having trouble? <Link to="/contact" className="text-kob-primary hover:text-kob-primary-dark font-bold hover:underline transition-colors">Contact support</Link></p>
        </div>
      </div>
    </main>
  )
}
