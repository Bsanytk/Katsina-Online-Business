import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { changePassword } from "../../services/profile";
import SuccessModal from "./SuccessModal";

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase
        tracking-widest text-gray-400 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 border-2
            border-gray-200 rounded-xl text-sm outline-none
            focus:border-[#4B3621] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-gray-600"
        >
          {show ? (
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
                0-8.268-2.943-9.543-7a9.97 9.97 0
                011.563-3.029m5.858.908a3 3 0 114.243
                4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532
                7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0
                0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0
                01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
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
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0
                8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542
                7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordModal({ show, onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setSuccess] = useState(false);

  async function handleSave() {
    setError(null);
    if (!current || !next || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err.message || "Failed. Check your current password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SuccessModal
        show={showSuccess}
        title="Password Changed!"
        subtitle="Your password has been updated securely."
        onClose={() => {
          setSuccess(false);
          onClose();
        }}
      />

      <AnimatePresence>
        {show && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end
              md:items-center justify-center
              bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md
                rounded-t-3xl md:rounded-3xl shadow-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-base font-bold
                    text-[#2C1F0E]"
                  >
                    Change Password
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Keep your account secure
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center
                    justify-center rounded-xl bg-gray-100
                    text-gray-500 hover:bg-gray-200"
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
                  className="p-3.5 bg-red-50 border
                  border-red-100 rounded-xl mb-4"
                >
                  <p className="text-xs text-red-700 font-medium">⚠ {error}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <PasswordInput
                  label="Current Password"
                  value={current}
                  onChange={setCurrent}
                  placeholder="Your current password"
                />
                <PasswordInput
                  label="New Password"
                  value={next}
                  onChange={setNext}
                  placeholder="At least 6 characters"
                />
                <PasswordInput
                  label="Confirm New Password"
                  value={confirm}
                  onChange={setConfirm}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 border-2
                    border-gray-200 text-gray-500 rounded-2xl
                    text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3.5 bg-[#4B3621]
                    text-white rounded-2xl text-sm font-semibold
                    hover:bg-[#362818] transition-colors
                    disabled:opacity-50 flex items-center
                    justify-center gap-2"
                >
                  {saving ? (
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
