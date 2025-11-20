/**
 * Input Component
 * Form input with label, error handling, and accessibility features
 * Focus states implemented via event handlers for theme-aware styling
 * Reference: US-CSS-003 - Standardized Input Component using design tokens
 * US-DARK-005: Updated to use dynamic theme colors
 * US-TOKEN-008: Migrated from Input.css to inline styles with focus states
 */
import React, { useRef } from 'react'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusShadows } from '../../hooks/useThemeFocusShadows'

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
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...props
}) => {
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const themeColors = useThemeColors()
  const focusShadows = useThemeFocusShadows()
  const inputRef = useRef<HTMLInputElement>(null)

  // US-TOKEN-008: Focus state handlers for theme-aware focus ring styling
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const focusColor = hasError ? themeColors.semantic.error : themeColors.primary.main
    const focusShadowColor = hasError ? focusShadows.error : focusShadows.primary

    e.currentTarget.style.borderColor = focusColor
    e.currentTarget.style.boxShadow = `0 0 0 3px ${focusShadowColor}`

    onFocusProp?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const borderColor = hasError ? themeColors.semantic.error : themeColors.border.default

    e.currentTarget.style.borderColor = borderColor
    e.currentTarget.style.boxShadow = 'none'

    onBlurProp?.(e)
  }

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
        ref={inputRef}
        id={id}
        className={className}
        style={{
          display: 'block',
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          color: themeColors.text.primary,
          border: `${borders.width.thin} solid ${hasError ? themeColors.semantic.error : themeColors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: themeColors.background.primary,
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
