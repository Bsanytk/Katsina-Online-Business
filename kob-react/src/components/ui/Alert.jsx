import React from 'react'

/**
 * Alert component for messages and notifications
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {boolean} dismissible - Show dismiss button
 * @param {function} onDismiss - Callback for dismiss button
 */
export default function Alert({
  children,
  type = 'info',
  dismissible = true,
  onDismiss,
  className = '',
  title,
}) {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const typeStyles = {
    success: {
      bg: 'bg-kob-success bg-opacity-10',
      border: 'border-kob-success',
      text: 'text-kob-success',
      icon: '✓',
    },
    error: {
      bg: 'bg-kob-error bg-opacity-10',
      border: 'border-kob-error',
      text: 'text-kob-error',
      icon: '✕',
    },
    warning: {
      bg: 'bg-kob-warning bg-opacity-10',
      border: 'border-kob-warning',
      text: 'text-kob-warning',
      icon: '!',
    },
    info: {
      bg: 'bg-kob-info bg-opacity-10',
      border: 'border-kob-info',
      text: 'text-kob-info',
      icon: 'ℹ',
    },
  }

  const styles = typeStyles[type]

  return (
    <div
      className={`
        rounded-lg border-l-4 p-4 flex items-start gap-3 transition-all duration-200
        ${styles.bg} ${styles.border}
        ${className}
      `}
    >
      <div className={`text-lg font-bold flex-shrink-0 ${styles.text}`}>
        {styles.icon}
      </div>
      <div className="flex-grow">
        {title && (
          <h4 className={`font-semibold ${styles.text} mb-1`}>
            {title}
          </h4>
        )}
        <div className={`text-sm ${styles.text}`}>
          {children}
        </div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss alert"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
