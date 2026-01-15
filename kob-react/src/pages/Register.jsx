import React, { useState } from 'react'
import { registerUser } from '../firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { Input, Button, Alert, Card } from '../components/ui'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('buyer') // buyer or seller
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await registerUser(email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
            <h1 className="text-3xl font-bold text-kob-dark mb-2">Join KOB</h1>
            <p className="text-gray-600">Create your account to start buying & selling</p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert type="error" title="Registration Failed" className="mb-6">
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-kob-dark">I want to join as:</label>
              <div className="space-y-2">
                {/* Buyer Option */}
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-kob-primary transition-colors" style={{ borderColor: role === 'buyer' ? '#C5A059' : undefined }}>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === 'buyer'}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-kob-dark">🛍️ Buyer</p>
                    <p className="text-sm text-gray-600">Browse and purchase products</p>
                  </div>
                </label>

                {/* Seller Option */}
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-kob-primary transition-colors" style={{ borderColor: role === 'seller' ? '#C5A059' : undefined }}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-kob-dark">📦 Seller</p>
                    <p className="text-sm text-gray-600">List and sell your products</p>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : '✓ Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-kob-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </Card>

        {/* Info Box */}
        <Card variant="outlined" className="mt-6 p-4">
          <p className="font-semibold text-kob-dark mb-2 text-sm">📝 What happens next?</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>✓ Your account is created instantly</li>
            <li>✓ {role === 'seller' ? 'Start listing your products right away' : 'Start browsing and buying products'}</li>
            <li>✓ {role === 'seller' ? 'Sellers get verified for increased credibility' : 'Contact support to become a seller'}</li>
          </ul>
        </Card>
      </div>
    </main>
  )
}
