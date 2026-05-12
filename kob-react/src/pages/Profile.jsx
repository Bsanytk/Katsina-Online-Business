/**
 * Profile.jsx — KOB Professional Profile Page
 * Global-standard marketplace seller/buyer profile
 * Amazon Seller Central / Etsy inspired UX
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import { useProfile } from "../contexts/ProfileContext";
import {
  getCompletionScore,
  changePassword,
  deleteAccount,
} from "../services/profile";
import EditProfileModal from "../components/profile/EditProfileModal";
import SuccessModal from "../components/profile/SuccessModal";

// ================================
// Helpers
// ================================
function formatDate(val) {
  if (!val) return "—";
  try {
    const d = val?.toDate?.() ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// ================================
// Info Row
// ================================
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div
      className="flex items-start gap-3 py-3.5
      border-b border-gray-50 last:border-0"
    >
      <div
        className="w-8 h-8 bg-[#4B3621]/5 rounded-xl
        flex items-center justify-center flex-shrink-0
        text-[#4B3621] mt-0.5"
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[9px] font-bold uppercase
          tracking-widest text-gray-400 mb-0.5"
        >
          {label}
        </p>
        <p
          className="text-sm text-[#2C1F0E] font-medium
          break-words"
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ================================
// Skeleton
// ================================
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div
        className="bg-white rounded-3xl p-6 border
        border-gray-100"
      >
        <div className="h-20 bg-gray-100 rounded-2xl mb-4" />
        <div
          className="w-20 h-20 bg-gray-200 rounded-3xl
          -mt-12 mb-3 border-4 border-white"
        />
        <div className="h-5 w-40 bg-gray-200 rounded-lg mb-2" />
        <div className="h-3 w-24 bg-gray-100 rounded-lg mb-4" />
        <div className="h-2 bg-gray-100 rounded-full" />
      </div>
      <div
        className="bg-white rounded-3xl p-6 border
        border-gray-100 space-y-4"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-16 bg-gray-100 rounded" />
              <div className="h-3.5 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================================
// Change Password Modal
// ================================
function ChangePasswordModal({ show, onClose, onSuccess }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [saving, setSave] = useState(false);
  const [error, setError] = useState(null);
  const [showPwd, setShow] = useState(false);

  if (!show) return null;

  async function submit() {
    setError(null);
    if (!cur || !next || !conf) {
      setError("All fields are required.");
      return;
    }
    if (next.length < 6) {
      setError("New password min 6 characters.");
      return;
    }
    if (next !== conf) {
      setError("Passwords do not match.");
      return;
    }
    setSave(true);
    try {
      await changePassword(cur, next);
      onSuccess();
      onClose();
      setCur("");
      setNext("");
      setConf("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSave(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end
      md:items-center justify-center p-4
      bg-black/60 backdrop-blur-sm"
    >
      <div
        className="bg-white w-full max-w-md
        rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#2C1F0E]">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center
              rounded-xl bg-gray-100 text-gray-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {error && (
          <div
            className="p-3 bg-red-50 border border-red-100
            rounded-xl mb-4"
          >
            <p className="text-xs text-red-700 font-medium">⚠ {error}</p>
          </div>
        )}
        <div className="space-y-4 mb-5">
          {[
            { label: "Current Password", val: cur, set: setCur },
            { label: "New Password", val: next, set: setNext },
            { label: "Confirm New", val: conf, set: setConf },
          ].map((f) => (
            <div key={f.label}>
              <label
                className="block text-[10px] font-bold
                uppercase tracking-widest text-gray-400 mb-1.5"
              >
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-3 pr-11 border-2
                    border-gray-200 rounded-xl text-sm
                    outline-none focus:border-[#4B3621]
                    transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPwd)}
                  className="absolute right-3 top-1/2
                    -translate-y-1/2 text-gray-400"
                >
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
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200
              text-gray-500 rounded-2xl text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 py-3 bg-[#4B3621] text-white
              rounded-2xl text-sm font-semibold
              hover:bg-[#362818] disabled:opacity-50
              flex items-center justify-center gap-2"
          >
            {saving ? (
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
            ) : null}
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

// ================================
// Delete Account Modal
// ================================
function DeleteModal({ show, onClose }) {
  const [pwd, setPwd] = useState("");
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!show) return null;

  async function submit() {
    if (!pwd) {
      setError("Password required.");
      return;
    }
    setLoad(true);
    try {
      await deleteAccount(pwd);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
      justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl
        max-w-sm w-full p-6 text-center"
      >
        <div
          className="w-16 h-16 bg-red-50 rounded-2xl
          flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
              2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
              00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#2C1F0E] mb-1">
          Delete Account
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          This action is permanent. All your account data will be removed from
          authentication.
        </p>
        {error && (
          <div
            className="p-3 bg-red-50 border border-red-100
            rounded-xl mb-4 text-left"
          >
            <p className="text-xs text-red-700 font-medium">⚠ {error}</p>
          </div>
        )}
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Enter password to confirm"
          className="w-full px-4 py-3 border-2 border-gray-200
            rounded-xl text-sm outline-none
            focus:border-red-400 transition-colors mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200
              text-gray-500 rounded-2xl text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!pwd || loading}
            className="flex-1 py-3 bg-red-500 text-white
              rounded-2xl text-sm font-semibold
              hover:bg-red-600 disabled:opacity-50
              flex items-center justify-center gap-2"
          >
            {loading && (
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
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ================================
// MAIN PROFILE PAGE
// ================================
export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, isSeller, isAdmin } = useProfile();

  const [showEdit, setEdit] = useState(false);
  const [showPass, setPass] = useState(false);
  const [showDelete, setDelete] = useState(false);
  const [showPwdSuccess, setPwdSuccess] = useState(false);
  const [loggingOut, setLogout] = useState(false);

  // Guard
  if (!user && !loading) {
    window.location.href = "/login";
    return null;
  }

  const score = profile ? getCompletionScore(profile) : 0;

  const roleLabel = {
    admin: { text: "👑 Admin", cls: "bg-[#4B3621] text-white" },
    seller: { text: "🏪 Seller", cls: "bg-[#D4AF37]/20 text-[#4B3621]" },
    buyer: { text: "🛒 Buyer", cls: "bg-blue-50 text-blue-700" },
  }[profile?.role || "buyer"] || {
    text: "Member",
    cls: "bg-gray-100 text-gray-600",
  };

  async function handleLogout() {
    setLogout(true);
    try {
      await logoutUser();
      window.location.href = "/";
    } catch {
      setLogout(false);
    }
  }

  // ================================
  // Action buttons config
  // ================================
  const ACTIONS = [
    {
      label: "Edit Profile",
      color: "text-[#4B3621]",
      onClick: () => setEdit(true),
      icon: (
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
            002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
            15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: "Change Password",
      color: "text-[#4B3621]",
      onClick: () => setPass(true),
      icon: (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
            00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4
            4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    ...(isSeller || isAdmin
      ? [
          {
            label: "My Shop",
            color: "text-[#4B3621]",
            onClick: () => navigate(`/shop/${user?.uid}`),
            icon: (
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
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0
            002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: loggingOut ? "Signing out..." : "Sign Out",
      color: "text-gray-500",
      onClick: handleLogout,
      icon: (
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
            01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0
            013 3v1"
          />
        </svg>
      ),
    },
    {
      label: "Delete Account",
      color: "text-red-500",
      danger: true,
      onClick: () => setDelete(true),
      icon: (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
            2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
            00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F9F9F7] pb-24 lg:pb-8">
      {/* Modals */}
      <EditProfileModal show={showEdit} onClose={() => setEdit(false)} />
      <ChangePasswordModal
        show={showPass}
        onClose={() => setPass(false)}
        onSuccess={() => setPwdSuccess(true)}
      />
      <SuccessModal
        show={showPwdSuccess}
        title="Password Changed!"
        subtitle="Your account is now secured with a new password."
        onClose={() => setPwdSuccess(false)}
      />
      <DeleteModal show={showDelete} onClose={() => setDelete(false)} />

      {/* ================================ */}
      {/* STICKY HEADER                    */}
      {/* ================================ */}
      <div
        className="sticky top-0 z-30 bg-[#F9F9F7]/95
        backdrop-blur-md border-b border-gray-100"
      >
        <div
          className="max-w-xl mx-auto px-4 py-4
          flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center
              rounded-xl border border-gray-200 bg-white
              text-gray-500 hover:text-[#4B3621]
              hover:border-[#4B3621] transition-all flex-shrink-0"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#2C1F0E]">My Profile</h1>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-1.5 px-4 py-2
              bg-[#4B3621] text-white rounded-xl text-xs
              font-semibold hover:bg-[#362818] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
                002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
                15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-4">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {/* ================================ */}
            {/* ================================ */}
            {/* HERO CARD — Avatar Overlap Fix   */}
            {/* ================================ */}
            <div
              className="bg-white rounded-3xl shadow-sm
  border border-gray-100 overflow-visible"
            >
              {/* ✅ Brown banner */}
              <div
                className="h-28 md:h-36
    bg-gradient-to-br from-[#2C1F0E]
    via-[#4B3621] to-[#6B4C31]
    rounded-t-3xl relative overflow-hidden"
              >
                {/* Decorative blobs */}
                <div
                  className="absolute -top-8 -right-8 w-40 h-40
      bg-[#D4AF37]/10 rounded-full blur-3xl
      pointer-events-none"
                />
                <div
                  className="absolute -bottom-4 -left-4 w-24 h-24
      bg-white/5 rounded-full blur-xl
      pointer-events-none"
                />
              </div>

              {/* ✅ AVATAR — lifted above banner */}
              {/* -mt-12 raises avatar over the brown strip */}
              {/* z-10 ensures it layers above the banner  */}
              <div className="px-5 md:px-7 pb-6">
                <div
                  className="flex items-end justify-between
      -mt-12 mb-4"
                >
                  {/* Avatar with layered border effect */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24
          rounded-2xl overflow-hidden
          border-4 border-white
          shadow-xl shadow-black/20
          bg-[#4B3621]"
                    >
                      {profile?.photoURL ? (
                        <img
                          src={profile.photoURL}
                          alt={profile?.displayName || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center
              justify-center text-white text-2xl font-black"
                        >
                          {(profile?.displayName || user?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ Verified + KOB Express badges — top right */}
                  <div
                    className="flex flex-wrap gap-2 justify-end
        pb-1 flex-1 ml-3"
                  >
                    {profile?.isVerified && (
                      <span
                        className="inline-flex items-center gap-1.5
            px-3 py-1.5
            bg-[#D4AF37]/15
            border border-[#D4AF37]/30
            rounded-xl
            text-xs font-bold text-[#4B3621]"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-[#D4AF37]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723
                3.066 3.066 0 013.976 0 3.066 3.066 0
                001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304
                1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0
                00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0
                00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0
                00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0
                00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0
                00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1
                1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
                00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                    {profile?.kobExpress && (
                      <span
                        className="px-3 py-1.5
            bg-emerald-50 text-emerald-700
            border border-emerald-100 rounded-xl
            text-xs font-bold"
                      >
                        🚚 KOB Express
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ Name — proper spacing below avatar */}
                <div className="mb-3">
                  <h2
                    className="text-xl md:text-2xl font-bold
        text-[#2C1F0E] leading-tight mb-0.5"
                  >
                    {profile?.displayName || "No Name Set"}
                  </h2>

                  {/* Business name */}
                  {profile?.businessName && (
                    <p
                      className="text-sm text-[#D4AF37] font-bold mb-2
          flex items-center gap-1"
                    >
                      🏪 {profile.businessName}
                    </p>
                  )}

                  {/* Role + KOB ID badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs
          font-bold uppercase tracking-wide
          ${roleLabel.cls}`}
                    >
                      {roleLabel.text}
                    </span>
                    {(profile?.kobNumber || user?.kobNumber) && (
                      <span
                        className="px-3 py-1 bg-gray-100
            text-gray-600 rounded-xl text-xs font-bold"
                      >
                        {profile?.kobNumber || user?.kobNumber}
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* ✅ Profile Completion */}
                <div className="mt-3">
                  <div
                    className="flex items-center
        justify-between mb-1.5"
                  >
                    <p
                      className="text-xs font-bold uppercase
          tracking-wide text-gray-400"
                    >
                      Profile Completion
                    </p>
                    <p
                      className={`text-xs font-bold
          ${
            score >= 80
              ? "text-emerald-600"
              : score >= 50
              ? "text-amber-600"
              : "text-red-400"
          }`}
                    >
                      {score}%
                    </p>
                  </div>
                  <div
                    className="h-2 bg-gray-100 rounded-full
        overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full transition-all
            duration-700
            ${
              score >= 80
                ? "bg-emerald-500"
                : score >= 50
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  {score < 100 && (
                    <button
                      onClick={() => setEdit(true)}
                      className="text-xs text-[#4B3621] font-semibold
            mt-1.5 hover:underline touch-manipulation"
                    >
                      Complete your profile →
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* ================================ */}
            {/* INFO CARD                        */}
            {/* ================================ */}
            <div
              className="bg-white rounded-3xl shadow-sm
              border border-gray-100 px-6 py-5"
            >
              <p
                className="text-[9px] font-bold uppercase
                tracking-widest text-gray-400 mb-3"
              >
                Account Info
              </p>

              <InfoRow
                label="Email"
                value={user?.email}
                icon={
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5
                      19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0
                      00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              <InfoRow
                label="Phone"
                value={profile?.phone || profile?.phoneNumber}
                icon={
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498
                      4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042
                      11.042 0 005.516 5.516l1.13-2.257a1 1 0
                      011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2
                      2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
              />
              <InfoRow
                label="WhatsApp"
                value={profile?.whatsappNumber}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
                    1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
                    0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
                    4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"
                    />
                  </svg>
                }
              />
              <InfoRow
                label="Location"
                value={profile?.location}
                icon={
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0
                      01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
              <InfoRow
                label="Member Since"
                value={formatDate(profile?.createdAt || user?.createdAt)}
                icon={
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0
                      002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2
                      2 0 002 2z"
                    />
                  </svg>
                }
              />
            </div>

            {/* ================================ */}
            {/* ACTIONS CARD                     */}
            {/* ================================ */}
            <div
              className="bg-white rounded-3xl shadow-sm
              border border-gray-100 overflow-hidden"
            >
              <p
                className="text-[9px] font-bold uppercase
                tracking-widest text-gray-400 px-6 pt-5 pb-2"
              >
                Settings
              </p>
              {ACTIONS.map((a, i) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={`w-full flex items-center
                    justify-between px-6 py-4 transition-all
                    ${i > 0 ? "border-t border-gray-50" : ""}
                    ${a.danger ? "hover:bg-red-50" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={a.color}>{a.icon}</span>
                    <span
                      className={`text-sm font-semibold
                      ${a.color}`}
                    >
                      {a.label}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
