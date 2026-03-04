import React from 'react'

/**
 * ButtonLoader Component
 * Button that shows loading state with spinner and disabled state
 * 
 * Props:
 * - loading (bool): Show spinner and disable button
 * - children (string|node): Button text or node
 * - variant (string): 'primary', 'secondary', 'danger', 'success', 'ghost', 'outline'
 * - size (string): 'sm', 'md', 'lg'
 * - disabled (bool): Disable button
 * - type (string): 'button', 'submit', 'reset'
 * - className (string): Additional Tailwind classes
 */
export default function ButtonLoader({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  loadingText = 'Processing...',
  ...props
}) {
  const baseStyles = 'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const variantStyles = {
    primary: 'bg-kob-primary text-white hover:bg-opacity-90 focus:ring-kob-primary disabled:hover:bg-opacity-50',
    secondary: 'bg-gray-200 text-kob-dark hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-kob-error text-white hover:bg-opacity-90 focus:ring-kob-error',
    success: 'bg-kob-success text-white hover:bg-opacity-90 focus:ring-kob-success',
    ghost: 'bg-transparent text-kob-primary hover:bg-gray-100 focus:ring-kob-primary border border-kob-primary',
    outline: 'border-2 border-kob-primary text-kob-primary hover:bg-kob-primary hover:text-white focus:ring-kob-primary',
  }

  const finalClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={finalClass}
      {...props}
    >
      {loading ? (
        <>
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
