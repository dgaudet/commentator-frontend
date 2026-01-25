/**
 * SaveErrorAlert Component
 *
 * Displays save error messages in an accessible alert format.
 * Shows both error type and detailed information to help users
 * understand and resolve issues with save operations.
 *
 * Features:
 * - Displays both error type and detailed message
 * - Accessible keyboard interaction (Escape to dismiss)
 * - Screen reader support with ARIA alert role
 * - Proper error styling with theme colors
 * - Positioned near save actions (non-modal, non-destructive)
 *
 * Accessibility:
 * - ARIA role="alert" for screen reader announcements
 * - aria-live="polite" for dynamic content updates
 * - Keyboard dismissible with Escape key
 * - Semantic colors for WCAG AA contrast compliance
 * - Clear dismiss button with accessible label
 *
 * Usage:
 * ```tsx
 * {saveError && (
 *   <SaveErrorAlert error={saveError} onDismiss={clearSaveError} />
 * )}
 * ```
 */

import React, { useEffect, useCallback } from 'react'
import type { SaveError } from '../../utils/errorHandling'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface SaveErrorAlertProps {
  error: SaveError
  onDismiss: () => void
}

/**
 * SaveErrorAlert - Accessible error message display
 *
 * @param error - SaveError object with error type and details
 * @param onDismiss - Callback when user dismisses the alert
 * @returns Rendered alert component
 */
export const SaveErrorAlert: React.FC<SaveErrorAlertProps> = ({ error, onDismiss }: SaveErrorAlertProps) => {
  const themeColors = useThemeColors()

  // Memoize key handler to prevent unnecessary re-renders
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onDismiss()
    }
  }, [onDismiss])

  // Handle Escape key to dismiss (keyboard accessibility)
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Alert container styles
  const alertContainerStyle: React.CSSProperties = {
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
  }

  // Error content wrapper styles
  const contentStyle: React.CSSProperties = {
    flex: 1,
  }

  // Error title (error type) styles
  const titleStyle: React.CSSProperties = {
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  }

  // Error details (message) styles
  const detailsStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
  }

  // Dismiss button styles
  const dismissButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: themeColors.semantic.errorDark,
    cursor: 'pointer',
    padding: 0,
    fontSize: typography.fontSize.lg,
    flexShrink: 0,
  }

  return (
    <div role="alert" aria-live="polite" style={alertContainerStyle}>
      <div style={contentStyle}>
        <div style={titleStyle}>{error.error}</div>
        <div style={detailsStyle}>{error.details}</div>
      </div>
      <button onClick={onDismiss} aria-label="Close error message" style={dismissButtonStyle}>
        ✕
      </button>
    </div>
  )
}
