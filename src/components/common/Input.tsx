/**
 * Input Component
 * Form input with label, error handling, and accessibility features
 * Uses CSS :focus-visible for proper keyboard navigation and assistive technology support
 * Reference: US-CSS-003 - Standardized Input Component using design tokens
 * US-DARK-005: Updated to use dynamic theme colors
 */
import React from 'react'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id: string
  error?: string | boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  required,
  className = '',
  ...props
}) => {
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const themeColors = useThemeColors()

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: themeColors.text.secondary,
            marginBottom: spacing.sm,
          }}
        >
          {label}
          {required && (
            <span style={{ color: themeColors.semantic.error, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${hasError ? 'input-error' : ''} ${className}`.trim()}
        style={{
          display: 'block',
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          border: `${borders.width.thin} solid ${hasError ? themeColors.semantic.error : themeColors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: themeColors.background.primary,
          outline: 'none',
        }}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {errorMessage && (
        <p
          id={`${id}-error`}
          style={{
            marginTop: spacing.sm,
            fontSize: typography.fontSize.sm,
            color: themeColors.semantic.error,
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}
