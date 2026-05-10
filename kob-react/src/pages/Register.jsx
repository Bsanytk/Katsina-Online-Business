import React, { useState } from "react";
import { registerUser } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { motion } from "framer-motion";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

// SVG Icons
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
const CheckIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [role, setRole] = useState("buyer");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [policyError, setPolicyError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Add this to BOTH Login.jsx and Register.jsx
  // After successful login/register:

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password); // or registerUser

      // ✅ Smart return — check sessionStorage
      const returnTo = sessionStorage.getItem("returnTo");
      if (returnTo) {
        sessionStorage.removeItem("returnTo");
        // Use window.location to fully reset history stack
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
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div
          className="bg-white rounded-3xl shadow-sm
          border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#4B3621] px-8 py-7 text-center">
            <img
              src={KOB_LOGO}
              alt="KOB"
              className="h-10 w-auto mx-auto mb-3"
            />
            <h1 className="text-xl font-bold text-white mb-1">
              Join KOB Marketplace
            </h1>
            <p className="text-xs text-white/60">
              Create your free account today
            </p>
          </div>

          <div className="p-7">
            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2
                p-3.5 bg-red-50 border border-red-100
                rounded-xl mb-5"
              >
                <span
                  className="text-red-500 flex-shrink-0
                  mt-0.5 text-sm"
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
                  uppercase tracking-widest text-gray-400 mb-1.5"
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

              {/* Password */}
              <div>
                <label
                  className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11 border-2
                      border-gray-200 rounded-xl text-sm
                      outline-none focus:border-[#4B3621]
                      transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2
                      -translate-y-1/2 text-gray-400
                      hover:text-gray-600"
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11 border-2
                      border-gray-200 rounded-xl text-sm
                      outline-none focus:border-[#4B3621]
                      transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2
                      -translate-y-1/2 text-gray-400
                      hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label
                  className="block text-xs font-semibold
                  uppercase tracking-widest text-gray-400 mb-2"
                >
                  Join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Buyer */}
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    disabled={loading}
                    className={`
                      relative flex flex-col items-center
                      gap-2 p-4 rounded-2xl border-2
                      transition-all
                      ${
                        role === "buyer"
                          ? "border-[#4B3621] bg-[#4B3621]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl
                      flex items-center justify-center
                      ${
                        role === "buyer"
                          ? "bg-[#4B3621] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-xs font-bold
                      ${role === "buyer" ? "text-[#4B3621]" : "text-gray-600"}`}
                    >
                      Buyer
                    </p>
                    <p className="text-[10px] text-gray-400">Browse & buy</p>
                    {role === "buyer" && (
                      <div
                        className="absolute top-2 right-2
                        w-4 h-4 bg-[#4B3621] rounded-full
                        flex items-center justify-center"
                      >
                        <CheckIcon />
                      </div>
                    )}
                  </button>

                  {/* Seller */}
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    disabled={loading}
                    className={`
                      relative flex flex-col items-center
                      gap-2 p-4 rounded-2xl border-2
                      transition-all
                      ${
                        role === "seller"
                          ? "border-[#D4AF37] bg-[#D4AF37]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl
                      flex items-center justify-center
                      ${
                        role === "seller"
                          ? "bg-[#D4AF37] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
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
                          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0
                          002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-xs font-bold
                      ${
                        role === "seller" ? "text-[#4B3621]" : "text-gray-600"
                      }`}
                    >
                      Seller
                    </p>
                    <p className="text-[10px] text-gray-400">List & sell</p>
                    {role === "seller" && (
                      <div
                        className="absolute top-2 right-2
                        w-4 h-4 bg-[#D4AF37] rounded-full
                        flex items-center justify-center"
                      >
                        <CheckIcon />
                      </div>
                    )}
                  </button>
                </div>

                {/* Role info */}
                <div
                  className={`mt-2 px-3 py-2 rounded-xl
                  text-[10px] font-medium
                  ${
                    role === "seller"
                      ? "bg-[#D4AF37]/10 text-[#4B3621]"
                      : "bg-[#4B3621]/5 text-[#4B3621]"
                  }`}
                >
                  {role === "seller"
                    ? "🏪 You will receive a unique KOB ID. Admin verification required to list products."
                    : "🛒 Browse and buy from verified sellers across Katsina State."}
                </div>
              </div>

              {/* ✅ Terms & Policy Checkbox */}
              <div
                className={`
                p-3.5 rounded-2xl border-2 transition-all
                ${
                  policyError
                    ? "border-red-300 bg-red-50"
                    : agreed
                    ? "border-[#4B3621]/30 bg-[#4B3621]/5"
                    : "border-gray-200 bg-gray-50"
                }
              `}
              >
                <label
                  className="flex items-start gap-3
                  cursor-pointer select-none"
                >
                  {/* Custom checkbox */}
                  <div
                    onClick={() => {
                      setAgreed(!agreed);
                      if (policyError) setPolicyError(false);
                    }}
                    className={`
                      flex-shrink-0 w-5 h-5 rounded-md
                      border-2 flex items-center justify-center
                      transition-all duration-150 mt-0.5
                      ${
                        agreed
                          ? "bg-[#4B3621] border-[#4B3621] text-white"
                          : policyError
                          ? "border-red-400 bg-white"
                          : "border-gray-300 bg-white"
                      }
                    `}
                  >
                    {agreed && <CheckIcon />}
                  </div>

                  <p
                    className="text-xs text-gray-600
                    leading-relaxed"
                  >
                    I have read and agree to KOB's{" "}
                    <Link
                      to="/terms"
                      target="_blank"
                      className="text-[#4B3621] font-semibold
                        hover:text-[#D4AF37] underline
                        transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                      className="text-[#4B3621] font-semibold
                        hover:text-[#D4AF37] underline
                        transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </label>

                {/* Policy error message */}
                {policyError && (
                  <p
                    className="text-[10px] text-red-600
                    font-semibold mt-2 pl-8"
                  >
                    ⚠ You must agree to the Terms and Policy to create an
                    account.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !agreed}
                className={`
                  w-full flex items-center justify-center
                  gap-2 py-3.5 rounded-2xl font-semibold
                  text-sm transition-all active:scale-[0.98]
                  ${
                    !agreed
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#4B3621] text-white hover:bg-[#362818] shadow-sm"
                  }
                `}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
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

            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#4B3621] font-bold
                  hover:text-[#D4AF37] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div
          className="mt-4 bg-white rounded-2xl border
          border-gray-100 p-4 shadow-sm"
        >
          <p className="text-xs font-semibold text-[#4B3621] mb-2">
            📝 What happens next?
          </p>
          <div className="space-y-1.5">
            {[
              "Account created instantly",
              role === "seller"
                ? "Receive unique KOB ID automatically"
                : "Start browsing verified products",
              role === "seller"
                ? "Request admin verification to list products"
                : "Message sellers directly via WhatsApp",
              "Check your email for verification link",
            ].map((item, i) => (
              <p
                key={i}
                className="text-[10px] text-gray-500
                flex items-center gap-1.5"
              >
                <svg
                  className="w-3 h-3 text-emerald-500
                  flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
