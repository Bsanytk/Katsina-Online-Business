import React from 'react'

/**
 * Textarea component with label and error support
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {number} rows - Number of rows
 */
export default function Textarea({
  label,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-kob-dark mb-2">
          {label}
          {required && <span className="text-kob-error ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-kob-primary focus:border-transparent
          transition-all duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-kob-error focus:ring-kob-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-kob-error text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 3.314 8.9a1 1 0 00-1.414 1.414l7.071 7.071a1 1 0 001.414 0l8.03-8.03z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
