import React from 'react'

/**
 * Button component with multiple variants
 * @param {string} variant - 'primary', 'secondary', 'danger', 'success', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional Tailwind classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantStyles = {
    primary: 'bg-kob-primary text-white hover:bg-opacity-90 focus:ring-kob-primary',
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
      disabled={disabled}
      className={finalClass}
      {...props}
    >
      {children}
    </button>
  )
}
