/**
 * LoadingSpinner Component
 * Loading indicator with accessibility features
 *
 * US-TOKEN-002: Migrated to design tokens for theme support
 */
import React from 'react'
import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography } from '../../theme/tokens'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  'data-testid'?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  'data-testid': dataTestId = 'loading-spinner',
}) => {
  const themeColors = useThemeColors()

  const sizeMap = {
    small: '1rem', // 16px
    medium: '2rem', // 32px
    large: '3rem', // 48px
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.xl} 0`,
  }

  const spinnerStyle: React.CSSProperties = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: '4px solid',
    borderColor: themeColors.neutral[200],
    borderTopColor: themeColors.primary.main,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }

  const textStyle: React.CSSProperties = {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: themeColors.text.secondary,
  }

  return (
    <>
      {/* Keyframe animation for spinner */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div
        role="status"
        aria-live="polite"
        data-testid={dataTestId}
        style={containerStyle}
      >
        <div style={spinnerStyle} />
        <p style={textStyle}>{message}</p>
      </div>
    </>
  )
}
