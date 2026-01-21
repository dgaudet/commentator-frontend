/**
 * useReplacePronounsButton Hook
 *
 * Story 2: Reusable Replace Pronouns Functionality
 * Custom hook that encapsulates replace pronouns state and logic
 * Reduces code duplication across BulkUploadModal, PersonalizedCommentsModal, and OutcomeCommentsModal
 *
 * Provides:
 * - Loading state management
 * - Message state management with type (success/error/info)
 * - Replace pronouns handler function
 * - Message styling utility
 * - Consistent message box styling across all modals
 */

import { useState } from 'react'
import { replacePronounsWithPlaceholders } from '../utils/pronouns'
import { spacing, typography, borders } from '../theme/tokens'
import { useThemeColors } from './useThemeColors'
import type { Pronoun } from '../types'

export interface ReplacePronounsMessage {
  type: 'success' | 'error' | 'info'
  text: string
}

/**
 * Custom hook for managing replace pronouns button state and logic
 *
 * Usage:
 * ```typescript
 * const {
 *   isLoading,
 *   message,
 *   handleReplacePronounsFunctionality,
 *   getMessageBoxStyle,
 *   setIsLoading,
 *   clearMessage,
 * } = useReplacePronounsButton()
 *
 * // Call handler when button clicked
 * await handleReplacePronounsFunctionality(textareaValue, pronouns)
 *
 * // Render message if present
 * {message && <div style={getMessageBoxStyle(message.type)}>{message.text}</div>}
 * ```
 */
export const useReplacePronounsButton = () => {
  const themeColors = useThemeColors()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<ReplacePronounsMessage | null>(null)

  /**
   * Handle replace pronouns functionality
   * Validates text, performs replacement, updates text via callback, shows message
   *
   * @param textToReplace - The text containing pronouns to replace
   * @param pronouns - Array of Pronoun objects
   * @returns The text with pronouns replaced
   */
  const handleReplacePronounsFunctionality = async (
    textToReplace: string,
    pronouns: Pronoun[],
  ): Promise<string> => {
    // Clear previous messages
    setMessage(null)

    // Check if text is empty
    if (!textToReplace.trim()) {
      setMessage({
        type: 'info',
        text: 'Please enter text first',
      })
      return textToReplace
    }

    // Set loading state
    setIsLoading(true)

    try {
      // Replace pronouns using the utility function
      const result = replacePronounsWithPlaceholders(textToReplace, pronouns)

      // Show success message with count
      const { pronoun: pronounCount, possessivePronoun: possessiveCount } =
        result.replacementCount
      const totalReplacements = pronounCount + possessiveCount

      if (totalReplacements === 0) {
        setMessage({
          type: 'info',
          text: 'No pronouns found in text',
        })
      } else {
        setMessage({
          type: 'success',
          text: `Replaced ${totalReplacements} pronouns (${pronounCount} subject, ${possessiveCount} possessive)`,
        })
      }

      return result.replacedText
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to replace pronouns. Please try again.',
      })
      return textToReplace
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Get message box styling based on message type
   * Provides consistent styling across all modals
   *
   * @param type - Message type: 'success', 'error', or 'info'
   * @returns Style object for message box
   */
  const getMessageBoxStyle = (type: string): React.CSSProperties => {
    const baseStyle = {
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: borders.radius.md,
      fontSize: typography.fontSize.sm,
      border: `${borders.width.thin} solid`,
    } as React.CSSProperties

    if (type === 'success') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22c55e',
        color: '#22c55e',
      }
    }

    if (type === 'error') {
      return {
        ...baseStyle,
        backgroundColor: themeColors.semantic.errorLight,
        borderColor: themeColors.semantic.error,
        color: themeColors.semantic.error,
      }
    }

    // info
    return {
      ...baseStyle,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      color: '#3b82f6',
    }
  }

  /**
   * Clear message state
   */
  const clearMessage = () => {
    setMessage(null)
  }

  return {
    isLoading,
    message,
    handleReplacePronounsFunctionality,
    getMessageBoxStyle,
    setIsLoading,
    clearMessage,
  }
}
