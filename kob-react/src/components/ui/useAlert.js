/**
 * useAlert.js — KOB Alert Hook
 * Simple hook to trigger alerts from any component
 */

import { useContext } from 'react'
import { AlertContext } from './AlertProvider'

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) {
    throw new Error('useAlert must be used inside <AlertProvider>')
  }
  return ctx
}
