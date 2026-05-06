import React, { useState } from 'react'
import { registerUser } from '../firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Store, Eye,
  EyeOff, CheckCircle, ArrowRight,
} from 'lucide-react'

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"

export default function Register() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')
  const [role, setRole]                 = useState('buyer')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [showPass, setShowPass]         = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await registerUser(email, password, role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]
      flex items-center justify-center p-4 py-10">

      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm
          border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-[#4B3621] px-8 py-7 text-center">
            <img src={KOB_LOGO} alt="KOB"
              className="h-10 w-auto mx-auto mb-3" />
            <h1 className="text-xl font-bold text-white mb-1">
              Join KOB Marketplace
            </h1>
            <p className="text-xs text-white/60">
              Create your account to start buying & selling
            </p>
          </div>

          <div className="p-7">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2
                p-3.5 bg-red-50 border border-red-100
                rounded-xl mb-5">
                <span className="text-red-500 flex-shrink-0
                  mt-0.5 text-sm">⚠</span>
                <p className="text-xs text-red-700 font-medium">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2
                    border-gray-200 rounded-xl text-sm
                    outline-none focus:border-[#4B3621]
                    transition-colors disabled:opacity-50
                    disabled:bg-gray-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11
                      border-2 border-gray-200 rounded-xl
                      text-sm outline-none
                      focus:border-[#4B3621] transition-colors
                      disabled:opacity-50 disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2
                      -translate-y-1/2 text-gray-400
                      hover:text-gray-600"
                  >
                    {showPass
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11
                      border-2 border-gray-200 rounded-xl
                      text-sm outline-none
                      focus:border-[#4B3621] transition-colors
                      disabled:opacity-50 disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2
                      -translate-y-1/2 text-gray-400
                      hover:text-gray-600"
                  >
                    {showConfirm
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-3">

                  {/* Buyer */}
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    disabled={loading}
                    className={`
                      flex flex-col items-center gap-2
                      p-4 rounded-2xl border-2 transition-all
                      ${role === 'buyer'
                        ? 'border-[#4B3621] bg-[#4B3621]/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center
                      justify-center
                      ${role === 'buyer'
                        ? 'bg-[#4B3621] text-white'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold
                        ${role === 'buyer'
                          ? 'text-[#4B3621]'
                          : 'text-gray-600'
                        }`}>
                        Buyer
                      </p>
                      <p className="text-[10px] text-gray-400
                        mt-0.5">
                        Browse & buy
                      </p>
                    </div>
                    {role === 'buyer' && (
                      <CheckCircle className="w-4 h-4
                        text-[#4B3621] absolute
                        top-2 right-2" />
                    )}
                  </button>

                  {/* Seller */}
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    disabled={loading}
                    className={`
                      relative flex flex-col items-center
                      gap-2 p-4 rounded-2xl border-2
                      transition-all
                      ${role === 'seller'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center
                      justify-center
                      ${role === 'seller'
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold
                        ${role === 'seller'
                          ? 'text-[#4B3621]'
                          : 'text-gray-600'
                        }`}>
                        Seller
                      </p>
                      <p className="text-[10px] text-gray-400
                        mt-0.5">
                        List & sell
                      </p>
                    </div>
                    {role === 'seller' && (
                      <CheckCircle className="w-4 h-4
                        text-[#D4AF37] absolute top-2 right-2" />
                    )}
                  </button>

                </div>

                {/* Role info */}
                <div className={`
                  mt-2 px-3 py-2 rounded-xl text-[10px]
                  font-medium
                  ${role === 'seller'
                    ? 'bg-[#D4AF37]/10 text-[#4B3621]'
                    : 'bg-[#4B3621]/5 text-[#4B3621]'
                  }
                `}>
                  {role === 'seller'
                    ? '🏪 You will receive a unique KOB ID after registration. Verification required to list products.'
                    : '🛒 Browse and purchase products from verified sellers across Katsina.'
                  }
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center
                  justify-center gap-2 py-3.5
                  bg-[#4B3621] text-white rounded-2xl
                  font-semibold text-sm
                  hover:bg-[#362818] transition-colors
                  shadow-sm active:scale-[0.98]
                  disabled:opacity-50
                  disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4"
                      fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12"
                        cy="12" r="10" stroke="currentColor"
                        strokeWidth="4" />
                      <path className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400
                uppercase tracking-wider font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login"
                className="text-[#4B3621] font-bold
                  hover:text-[#D4AF37] transition-colors">
                Sign in
              </Link>
            </p>

          </div>
        </div>

        {/* What happens next */}
        <div className="mt-4 bg-white rounded-2xl border
          border-gray-100 p-4">
          <p className="text-xs font-semibold text-[#4B3621]
            mb-2">
            📝 What happens next?
          </p>
          <div className="space-y-1.5">
            {[
              "Your account is created instantly",
              role === 'seller'
                ? "You receive a unique KOB ID automatically"
                : "Start browsing products right away",
              role === 'seller'
                ? "Request verification to start listing products"
                : "Contact admin to upgrade to seller account",
            ].map((item, i) => (
              <p key={i} className="text-[10px] text-gray-500
                flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-500
                  flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>

      </motion.div>
    </main>
  )
}
