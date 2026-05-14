/**
 * AlertProvider.jsx — KOB Global Alert System
 *
 * Usage:
 * const { showAlert } = useAlert()
 * showAlert({ type: 'success', title: 'Done!', message: 'Saved.' })
 */

import React, {
  createContext, useState,
  useCallback, useRef,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import Alert from './Alert'

export const AlertContext = createContext(null)

let alertId = 0

export default function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  // ================================
  // Show alert — returns id for manual dismiss
  // ================================
  const showAlert = useCallback((options) => {
    const id = ++alertId
    const alert = {
      id,
      type:        options.type      || 'info',
      title:       options.title     || '',
      message:     options.message   || '',
      autoDismiss: options.autoDismiss !== false,
      duration:    options.duration  || 4500,
    }
    setAlerts((prev) => [...prev, alert])
    return id
  }, [])

  // ================================
  // Dismiss by id
  // ================================
  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // ================================
  // Convenience methods
  // ================================
  const success = useCallback(
    (title, message, opts) =>
      showAlert({ type: 'success', title, message, ...opts }),
    [showAlert]
  )
  const error = useCallback(
    (title, message, opts) =>
      showAlert({ type: 'error', title, message, ...opts }),
    [showAlert]
  )
  const warning = useCallback(
    (title, message, opts) =>
      showAlert({ type: 'warning', title, message, ...opts }),
    [showAlert]
  )
  const info = useCallback(
    (title, message, opts) =>
      showAlert({ type: 'info', title, message, ...opts }),
    [showAlert]
  )
  const blocked = useCallback(
    (title, message, opts) =>
      showAlert({ type: 'blocked', title, message, ...opts }),
    [showAlert]
  )

  return (
    <AlertContext.Provider value={{
      showAlert, dismissAlert,
      success, error, warning, info, blocked,
    }}>
      {children}

      {/* Alert Stack — top-right desktop, top-center mobile */}
      <div className="
        fixed top-4 left-1/2 -translate-x-1/2
        md:left-auto md:right-4 md:translate-x-0
        z-[200] flex flex-col gap-3
        w-[min(100vw-2rem,420px)]
        pointer-events-none
      ">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="pointer-events-auto"
            >
              <Alert
                {...alert}
                onDismiss={() => dismissAlert(alert.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  )
}
