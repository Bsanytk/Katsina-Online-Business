import React from 'react'

/**
 * Card component updated for KOB Marketplace
 * Added 'flat' variant and improved KOB-specific styling
 */
export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}) {
  // Base styles improved with better border colors for mobile readability
  const baseStyles = 'rounded-xl bg-white transition-all duration-300 overflow-hidden'

  const variantStyles = {
    // Standard shadow
    default: 'border border-neutral-200 shadow-sm',
    // More depth for important items like Product details
    elevated: 'border border-neutral-100 shadow-xl',
    // Clean look for dashboard sections
    outlined: 'border-2 border-neutral-200 shadow-none',
    // Simple flat style for inner cards
    flat: 'border border-neutral-100 bg-neutral-50/50'
  }

  // Hover effect now includes a slight lift (translate-y) for a "Pro" feel
  const hoverStyles = hover 
    ? 'hover:shadow-card-hover hover:border-kob-primary/50 hover:-translate-y-1' 
    : ''

  const finalClass = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${hoverStyles} ${className}`

  return (
    <div className={finalClass} {...props}>
      {children}
    </div>
  )
}
