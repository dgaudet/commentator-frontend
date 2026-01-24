/**
 * SaveErrorAlert Component
 *
 * Displays save error messages in an accessible alert format.
 * Shows both error type and detailed information.
 *
 * Accessibility Features:
 * - ARIA alert role for screen reader announcements
 * - Keyboard dismissible with Escape key
 * - Proper color contrast and error styling
 * - Clear dismiss button with accessible label
 */

import { useEffect } from 'react'
import type { SaveError } from '../../utils/errorHandling'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface SaveErrorAlertProps {
  error: SaveError
  onDismiss: () => void
}

export const SaveErrorAlert = ({ error, onDismiss }: SaveErrorAlertProps) => {
  const themeColors = useThemeColors()

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: themeColors.semantic.errorLight,
        borderLeft: `4px solid ${themeColors.border.error}`,
        borderRadius: borders.radius.sm,
        color: themeColors.semantic.errorDark,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: spacing.md,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm }}>
          {error.error}
        </div>
        <div style={{ fontSize: typography.fontSize.sm }}>
          {error.details}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Close error message"
        style={{
          background: 'none',
          border: 'none',
          color: themeColors.semantic.errorDark,
          cursor: 'pointer',
          padding: 0,
          fontSize: typography.fontSize.lg,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}
