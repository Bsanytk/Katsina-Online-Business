import React, { useId, useState } from "react";

/**
 * Professional Select Component - KOB Design System
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {string} hint - Helper text below select
 * @param {string} icon - Emoji icon (left side)
 * @param {string} placeholder - Default empty option text
 * @param {boolean} required - Required field marker
 * @param {boolean} disabled - Disabled state
 * @param {Array} options - Array of { value, label } objects
 */
export default function Select({
  label,
  error,
  hint,
  icon,
  placeholder = "Select an option...",
  required = false,
  disabled = false,
  options = [],
  className = "",
  value,
  onChange,
  children,
  ...props
}) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);

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

      {/* Select Wrapper */}
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
            : disabled
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

        {/* Select Field */}
        <select
          id={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 text-sm font-medium
            bg-transparent outline-none appearance-none
            text-gray-800 cursor-pointer
            disabled:cursor-not-allowed disabled:text-gray-400
            ${icon ? "pl-2" : ""}
            ${className}
          `}
          {...props}
        >
          {/* Default placeholder option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Options array support */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}

          {/* Children support - for manual <option> tags */}
          {children}
        </select>

        {/* Custom Dropdown Arrow */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 
          pointer-events-none flex-shrink-0"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200
              ${isFocused ? "rotate-180 text-[#4B3621]" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
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
