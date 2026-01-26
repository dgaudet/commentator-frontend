/**
 * SaveErrorAlert Component
 *
 * Displays save error messages in an accessible alert format.
 * Shows both error type and detailed information to help users
 * understand and resolve issues with save operations.
 *
 * Features:
 * - Displays both error type and detailed message
 * - Dismissible button with accessible label
 * - Screen reader support with ARIA alert role
 * - Proper error styling with theme colors
 * - Positioned near save actions (non-modal, non-destructive)
 * - Automatically clears when user starts editing form
 *
 * Accessibility:
 * - ARIA role="alert" for screen reader announcements
 * - aria-live="polite" for dynamic content updates
 * - Accessible dismiss button (× button with aria-label)
 * - Semantic colors for WCAG AA contrast compliance
 * - No global event listeners to avoid conflicts with other components
 *
 * Usage:
 * ```tsx
 * {saveError && (
 *   <SaveErrorAlert error={saveError} onDismiss={clearSaveError} />
 * )}
 * ```
 */

import React from 'react'
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
 * Dismissal can occur via:
 * - Clicking the × button
 * - User editing any form field (clearErrorOnEdit callback)
 *
 * @param error - SaveError object with error type and details
 * @param onDismiss - Callback when user dismisses the alert
 * @returns Rendered alert component
 */
export const SaveErrorAlert: React.FC<SaveErrorAlertProps> = ({ error, onDismiss }: SaveErrorAlertProps) => {
  const themeColors = useThemeColors()

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
