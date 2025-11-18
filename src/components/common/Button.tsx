/**
 * Button Component
 * Reusable button with variants and accessibility features
 * Reference: US-CSS-005 - Enhanced Button Component with Design Tokens
 * US-DARK-005: Updated to use dynamic theme colors
 */
import React from 'react'
import { spacing, typography, borders, shadows } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const themeColors = useThemeColors()

  // US-STYLE-001 AC2: Modern blue button styling from test.webp
  // US-CSS-005: Updated to use design tokens for maintainability
  // Accessibility: Using transparent borders that become visible in high-contrast mode
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borders.radius.md,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    border: `${borders.width.thick} solid transparent`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.md,
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: themeColors.primary.main,
      color: themeColors.text.inverse,
      borderColor: themeColors.primary.main,
    },
    secondary: {
      backgroundColor: themeColors.neutral[200],
      color: themeColors.neutral[800],
      borderColor: themeColors.neutral[200],
    },
    danger: {
      backgroundColor: themeColors.semantic.error,
      color: themeColors.text.inverse,
      borderColor: themeColors.semantic.error,
    },
  }

  const hoverColors: Record<string, string> = {
    primary: themeColors.primary.dark,
    secondary: themeColors.neutral[300],
    danger: themeColors.semantic.errorDark,
  }

  return (
    <button
      type={type}
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColors[variant]
        e.currentTarget.style.borderColor = hoverColors[variant]
        e.currentTarget.style.boxShadow = shadows.lg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor as string
        e.currentTarget.style.borderColor = variantStyles[variant].borderColor as string
        e.currentTarget.style.boxShadow = shadows.md
      }}
      {...props}
    >
      {children}
    </button>
  )
}
