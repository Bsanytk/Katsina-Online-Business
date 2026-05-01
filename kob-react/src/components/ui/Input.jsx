import React, { useState, useId } from "react";

/**
 * Professional Input Component - KOB Design System
 * @param {string} type - 'text' | 'email' | 'password' | 'number' | 'tel'
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {string} hint - Helper text below input
 * @param {string} icon - Emoji icon (left side)
 * @param {boolean} required - Required field marker
 * @param {boolean} disabled - Disabled state
 * @param {boolean} readOnly - Read only state
 * @param {number} maxLength - Max character count
 */
export default function Input({
  type = "text",
  label,
  error,
  hint,
  icon,
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  maxLength,
  value,
  onChange,
  ...props
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase 
            tracking-widest text-gray-500 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div
        className={`
        relative flex items-center
        border-2 rounded-xl overflow-hidden
        transition-all duration-200
        ${
          isFocused
            ? "border-[#4B3621] shadow-md shadow-[#4B3621]/10"
            : error
            ? "border-red-400 bg-red-50"
            : disabled || readOnly
            ? "border-gray-100 bg-gray-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }
      `}
      >
        {/* Left Icon */}
        {icon && (
          <span
            className="pl-4 text-base flex-shrink-0 
            select-none pointer-events-none"
          >
            {icon}
          </span>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={inputType}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 text-sm font-medium
            bg-transparent outline-none
            text-gray-800 placeholder:text-gray-400
            disabled:cursor-not-allowed disabled:text-gray-400
            read-only:cursor-default read-only:text-gray-500
            ${icon ? "pl-2" : ""}
            ${isPassword ? "pr-12" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              p-1.5 rounded-lg text-gray-400 
              hover:text-gray-600 hover:bg-gray-100
              transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye Off Icon
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
            ) : (
              // Eye Icon
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
        )}

        {/* Read Only Lock Icon */}
        {readOnly && !isPassword && (
          <span
            className="absolute right-3 top-1/2 
            -translate-y-1/2 text-gray-300 text-sm"
          >
            🔒
          </span>
        )}
      </div>

      {/* Bottom Row — Error + Character Count */}
      <div className="flex items-start justify-between mt-1.5 px-1">
        {/* Error or Hint */}
        <div className="flex-grow">
          {error ? (
            <p
              className="text-red-500 text-xs font-medium 
              flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 
                    0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 
                    1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          ) : hint ? (
            <p className="text-gray-400 text-xs">{hint}</p>
          ) : null}
        </div>

        {/* Character Counter */}
        {maxLength && (
          <p
            className={`text-xs flex-shrink-0 ml-2 font-medium
            ${
              charCount >= maxLength
                ? "text-red-500"
                : charCount >= maxLength * 0.8
                ? "text-amber-500"
                : "text-gray-400"
            }`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
