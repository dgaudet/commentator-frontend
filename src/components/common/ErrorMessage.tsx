/**
 * ErrorMessage Component
 * Error display with optional dismiss functionality
 *
 * US-TOKEN-001: Migrated to design tokens for theme support
 */
import React from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, borders } from '../../theme/tokens'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
  'data-testid'?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = '',
  'data-testid': dataTestId,
}) => {
  const themeColors = useThemeColors()

  const containerStyle: React.CSSProperties = {
    backgroundColor: themeColors.semantic.errorLight,
    border: `${borders.width.thin} solid ${themeColors.border.error}`,
    color: themeColors.semantic.errorDark,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borders.radius.md,
    position: 'relative',
  }

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const buttonStyle: React.CSSProperties = {
    marginLeft: spacing.lg,
    color: themeColors.semantic.error,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing.xs,
    borderRadius: borders.radius.sm,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s ease',
  }

  const buttonHoverStyle: React.CSSProperties = {
    color: themeColors.semantic.errorDark,
  }

  const iconStyle: React.CSSProperties = {
    height: '1.25rem',
    width: '1.25rem',
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={containerStyle}
      className={className}
      data-testid={dataTestId}
    >
      <div style={innerStyle}>
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={buttonStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = themeColors.semantic.error
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${themeColors.border.focus}`
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none'
            }}
            aria-label="Dismiss error"
          >
            <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
