import React, { useState } from "react";
import { useAuth } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { motion, AnimatePresence } from "framer-motion";

const KOB_LOGO =
  'https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1779990660/logo512_yci0g2.png';

// ================================
// SVG Icons
// ================================
const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268
      2.943 9.542 7-1.274 4.057-5.064 7-9.542
      7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478
      0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3
      3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88
      9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59
      3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943
      9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2
      0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0
      002 2z"
    />
  </svg>
);

// ================================
// Forgot Password Modal
// ================================
function ForgotPasswordModal({ onClose, resetPassword }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleReset(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50
          backdrop-blur-sm z-50 flex items-center
          justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl
            max-w-sm w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#4B3621] px-6 py-6 text-center">
            <div
              className="w-12 h-12 bg-white/15 rounded-2xl
              flex items-center justify-center mx-auto mb-3
              text-white"
            >
              <MailIcon />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-white/60">We'll send you a reset link</p>
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-4">
                <div
                  className="w-14 h-14 bg-emerald-50
                  rounded-full flex items-center
                  justify-center mx-auto mb-3"
                >
                  <svg
                    className="w-7 h-7 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p
                  className="text-sm font-semibold
                  text-gray-700 mb-1"
                >
                  Reset email sent!
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  Check your inbox at <strong>{email}</strong> and follow the
                  instructions.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#4B3621]
                    text-white rounded-xl text-sm
                    font-semibold hover:bg-[#362818]
                    transition-colors"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                {error && (
                  <div
                    className="p-3 bg-red-50 border
                    border-red-100 rounded-xl"
                  >
                    <p
                      className="text-xs text-red-700
                      font-medium"
                    >
                      ⚠ {error}
                    </p>
                  </div>
                )}

                <div>
                  <label
                    className="block text-xs font-semibold
                    uppercase tracking-widest text-gray-400
                    mb-1.5"
                  >
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
                      transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border-2
                      border-gray-200 text-gray-500
                      rounded-xl text-sm font-semibold
                      hover:border-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#4B3621]
                      text-white rounded-xl text-sm
                      font-semibold hover:bg-[#362818]
                      transition-colors disabled:opacity-50
                      flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ================================
// Login Page
// ================================
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { loginUser, resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Shiga da asusun mai amfani
      const userCredential = await loginUser(email, password);
      
      // 2. GYARA: Kira fcmToken a nan bayan an yi nasara, ta hanyar daukar UID daga userCredential
      if (userCredential && userCredential.user) {
        try {
          const { initFCM } = await import("../services/fcm");
          await initFCM(userCredential.user.uid);
        } catch (fcmErr) {
          console.error("[KOB FCM] Token initialization failed:", fcmErr);
          // Mun sanya try/catch a nan domin ko da sanarwa ta gaza, kada ta hana mutum shiga dashboard dinsa
        }
      }

      // 3. Smart return — duba sessionStorage ko akwai shafin da ya dawo da shi
      const returnTo = sessionStorage.getItem("returnTo");
      if (returnTo) {
        sessionStorage.removeItem("returnTo");
        window.location.href = returnTo;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#FAFAF8]
      flex items-center justify-center p-4 py-10"
    >
      {/* Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal
          onClose={() => setShowForgot(false)}
          resetPassword={resetPassword}
        />
      )}

      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      {/* Decorative blobs */}
      <div
        className="absolute inset-0 overflow-hidden
        pointer-events-none"
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96
          bg-[#4B3621]/5 rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96
          bg-[#D4AF37]/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        <div
          className="bg-white rounded-3xl shadow-sm
          border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#4B3621] px-8 py-8 text-center">
            <img
              src={KOB_LOGO}
              alt="KOB"
              className="h-12 w-auto mx-auto mb-3"
            />
            <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-xs text-white/60">Sign in to your KOB account</p>
          </div>

          <div className="p-7">
            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 p-3.5
                bg-red-50 border border-red-100
                rounded-xl mb-5"
              >
                <span
                  className="text-red-500 flex-shrink-0
                  text-sm mt-0.5"
                >
                  ⚠
                </span>
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400
                  mb-1.5"
                >
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
                <div
                  className="flex items-center
                  justify-between mb-1.5"
                >
                  <label
                    className="text-xs font-semibold
                    uppercase tracking-widest text-gray-400"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[10px] font-semibold
                      text-[#4B3621] hover:text-[#D4AF37]
                      transition-colors underline-offset-2
                      hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2
                      -translate-y-1/2 text-gray-400
                      hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center
                  justify-center gap-2 py-3.5 mt-2
                  bg-[#4B3621] text-white rounded-2xl
                  font-semibold text-sm
                  hover:bg-[#362818] transition-colors
                  shadow-sm active:scale-[0.98]
                  disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span
                className="text-[10px] text-gray-400
                uppercase tracking-wider font-medium"
              >
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#4B3621] font-bold
                  hover:text-[#D4AF37] transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-400 mt-5">
          Having trouble?{" "}
          <Link
            to="/contact"
            className="text-[#4B3621] font-semibold
              hover:underline"
          >
            Contact support
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
