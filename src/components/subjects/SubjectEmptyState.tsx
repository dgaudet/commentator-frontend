/**
 * SubjectEmptyState Component
 * Displayed when no subjects exist
 * Reference: US-REFACTOR-005, US-TOKEN-007
 *
 * Key Changes:
 * - "class" → "subject" in all text
 * - Migrated to design tokens for theme support
 */
import React from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography } from '../../theme/tokens'
import { Button } from '../common/Button'

interface SubjectEmptyStateProps {
  onCreateFirst?: () => void
}

export const SubjectEmptyState: React.FC<SubjectEmptyStateProps> = ({ onCreateFirst }) => {
  const themeColors = useThemeColors()

  const containerStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: `${spacing.xl} 0`,
  }

  const iconStyle: React.CSSProperties = {
    color: themeColors.text.disabled,
    marginBottom: spacing.lg,
  }

  const iconSvgStyle: React.CSSProperties = {
    margin: '0 auto',
    height: '3rem',
    width: '3rem',
    display: 'block',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: themeColors.text.primary,
    marginBottom: spacing.sm,
  }

  const descriptionStyle: React.CSSProperties = {
    color: themeColors.text.secondary,
    marginBottom: spacing.xl,
  }

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>
        <svg
          style={iconSvgStyle}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          role="img"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 style={titleStyle}>No subjects found</h3>
      <p style={descriptionStyle}>
        Get started by creating your first subject to manage student comments.
      </p>
      {onCreateFirst && (
        <Button onClick={onCreateFirst} variant="primary">
          Create First Subject
        </Button>
      )}
    </div>
  )
}
