import React, { useId, useState } from "react";

/**
 * Professional Textarea Component - KOB Design System
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {string} hint - Helper text below textarea
 * @param {boolean} required - Required field marker
 * @param {boolean} disabled - Disabled state
 * @param {number} rows - Number of visible rows (default: 4)
 * @param {number} maxLength - Max character count
 * @param {boolean} resizable - Allow manual resize (default: false)
 */
export default function Textarea({
  label,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  resizable = false,
  className = "",
  value,
  onChange,
  ...props
}) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);

  const charCount = typeof value === "string" ? value.length : 0;
  const isNearLimit = maxLength && charCount >= maxLength * 0.8;
  const isAtLimit = maxLength && charCount >= maxLength;

  return (
    <div className="w-full">
      {/* Label Row */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase 
              tracking-widest text-gray-500"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Character Counter — top right */}
          {maxLength && (
            <span
              className={`text-xs font-medium transition-colors
              ${
                isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                  ? "text-amber-500"
                  : "text-gray-400"
              }`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea Wrapper */}
      <div
        className={`
        relative border-2 rounded-xl overflow-hidden
        transition-all duration-200
        ${
          isFocused
            ? "border-[#4B3621] shadow-md shadow-[#4B3621]/10"
            : error
            ? "border-red-400 bg-red-50"
            : disabled
            ? "border-gray-100 bg-gray-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }
      `}
      >
        <textarea
          id={id}
          rows={rows}
          disabled={disabled}
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
            leading-relaxed
            ${resizable ? "resize-y" : "resize-none"}
            ${className}
          `}
          {...props}
        />

        {/* Bottom bar — progress indicator when near limit */}
        {maxLength && (
          <div className="h-0.5 w-full bg-gray-100">
            <div
              className={`h-full transition-all duration-300
                ${
                  isAtLimit
                    ? "bg-red-500"
                    : isNearLimit
                    ? "bg-amber-500"
                    : "bg-[#4B3621]"
                }`}
              style={{
                width: `${Math.min((charCount / maxLength) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Row — Error or Hint */}
      <div className="mt-1.5 px-1">
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
    </div>
  );
}
