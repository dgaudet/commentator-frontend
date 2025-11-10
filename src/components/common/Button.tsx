/**
 * Button Component
 * Reusable button with variants and accessibility features
 * Reference: US-CSS-005 - Enhanced Button Component with Design Tokens
 */
import React from 'react'
import { colors, spacing, typography, borders, shadows } from '../../theme/tokens'

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
      backgroundColor: colors.primary.main,
      color: colors.text.inverse,
      borderColor: colors.primary.main,
    },
    secondary: {
      backgroundColor: colors.neutral[200],
      color: colors.neutral[800],
      borderColor: colors.neutral[200],
    },
    danger: {
      backgroundColor: colors.semantic.error,
      color: colors.text.inverse,
      borderColor: colors.semantic.error,
    },
  }

  const hoverColors: Record<string, string> = {
    primary: colors.primary.dark,
    secondary: colors.neutral[300],
    danger: colors.semantic.errorDark,
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
