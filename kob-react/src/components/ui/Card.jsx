import React from 'react'

/**
 * Card component with optional padding and shadow variants
 * @param {string} variant - 'default', 'elevated', 'outlined'
 * @param {boolean} hover - Add hover effect
 * @param {string} className - Additional Tailwind classes
 */
export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}) {
  const baseStyles = 'rounded-lg border border-gray-200 bg-white transition-all duration-200'

  const variantStyles = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    outlined: 'border-2 border-gray-300 shadow-none',
  }

  const hoverStyles = hover ? 'hover:shadow-lg hover:border-kob-primary' : ''

  const finalClass = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`

  return (
    <div className={finalClass} {...props}>
      {children}
    </div>
  )
}
