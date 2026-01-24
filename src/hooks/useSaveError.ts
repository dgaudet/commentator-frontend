/**
 * useSaveError Hook
 *
 * Custom hook for managing save error state and clearing logic.
 * Encapsulates error state management to reduce component complexity.
 *
 * Features:
 * - Store error with both error type and detailed message
 * - Clear error manually (dismiss button)
 * - Clear error on edit (textarea change)
 * - Clear error on successful retry
 * - Update error on new save attempt
 */

import { useState, useCallback } from 'react'
import type { SaveError } from '../utils/errorHandling'

export const useSaveError = () => {
  const [saveError, setSaveError] = useState<SaveError | null>(null)

  /**
   * Set a new error
   */
  const setError = useCallback((error: SaveError) => {
    setSaveError(error)
  }, [])

  /**
   * Clear the error (manual dismiss or on success)
   */
  const clearError = useCallback(() => {
    setSaveError(null)
  }, [])

  /**
   * Clear error when user starts editing
   * Called from onChange handlers on form fields
   */
  const clearErrorOnEdit = useCallback(() => {
    setSaveError(null)
  }, [])

  return {
    saveError,
    setError,
    clearError,
    clearErrorOnEdit,
  }
}
