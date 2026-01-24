/**
 * useSaveError Hook
 *
 * Custom hook for managing save error state with proper clearing strategies.
 * Encapsulates error state management to reduce component complexity and provide
 * a clean, intuitive API for handling save operation errors.
 *
 * Features:
 * - Store error with both error type and detailed message
 * - Clear error manually (dismiss button or success)
 * - Clear error when user starts editing (indicates they're addressing the issue)
 * - Update error on new save attempts
 *
 * Usage:
 * ```tsx
 * const { saveError, setError, clearError, clearErrorOnEdit } = useSaveError()
 *
 * // On save failure
 * const errorInfo = extractErrorMessage(err)
 * setError(errorInfo)
 *
 * // When user edits form field
 * const handleChange = (value) => {
 *   setValue(value)
 *   clearErrorOnEdit()
 * }
 *
 * // When save succeeds or user dismisses
 * clearError()
 * ```
 */

import { useState, useCallback } from 'react'
import type { SaveError } from '../utils/errorHandling'

/**
 * Return type for the useSaveError hook
 */
interface UseSaveErrorReturn {
  /** Current error state (null if no error) */
  saveError: SaveError | null
  /** Set a new error from API response */
  setError: (error: SaveError) => void
  /** Clear error (manual dismiss or success) */
  clearError: () => void
  /** Clear error when user starts editing (auto-clear on edit) */
  clearErrorOnEdit: () => void
}

/**
 * Custom hook for save error state management
 *
 * Provides a clean API for managing save operation errors with proper
 * clearing strategies for different user interactions.
 *
 * @returns {UseSaveErrorReturn} Error state and action methods
 */
export const useSaveError = (): UseSaveErrorReturn => {
  const [saveError, setSaveError] = useState<SaveError | null>(null)

  /**
   * Set a new error from API response
   * @param error - SaveError object with error type and details
   */
  const setError = useCallback((error: SaveError) => {
    setSaveError(error)
  }, [])

  /**
   * Clear the error
   *
   * Used when:
   * - User manually dismisses the error via button
   * - Save operation completes successfully
   * - User navigates away from the operation
   */
  const clearError = useCallback(() => {
    setSaveError(null)
  }, [])

  /**
   * Clear error when user starts editing a form field
   *
   * This is called from onChange handlers to provide immediate feedback that
   * the user is addressing the issue. The error state is cleared to give
   * visual feedback and reduce noise on the screen.
   *
   * Called from:
   * - textarea onChange handlers
   * - input field onChange handlers
   * - Any editable field that user might modify to fix the issue
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
