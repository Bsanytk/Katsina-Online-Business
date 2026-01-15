import React, { useState } from 'react'
import { loginUser } from '../firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { Input, Button, Alert, Card } from '../components/ui'

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
    <main className="min-h-screen bg-gradient-to-br from-kob-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <Card variant="elevated" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-kob-dark mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your KOB account</p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert type="error" title="Login Failed" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '✓ Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-kob-primary font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </Card>

        {/* Footer Help */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Having trouble? <Link to="/contact" className="text-kob-primary font-bold hover:underline">Contact support</Link></p>
        </div>
      </div>
    </main>
  )
}
