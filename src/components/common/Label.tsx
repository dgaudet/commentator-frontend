/**
 * Label Component
 * Reference: US-CSS-004 - Standardized Label Component
 *
 * Reusable label component with consistent styling using design tokens.
 * Can be used standalone or within form components.
 *
 * Usage:
 * <Label htmlFor="input-id">Label Text</Label>
 * <Label htmlFor="input-id" required>Required Field</Label>
 */
import React from 'react'
import { colors, spacing, typography } from '../../theme/tokens'

interface LabelProps {
  /** ID of the input element this label is associated with */
  htmlFor: string
  /** Whether to display required indicator (red asterisk) */
  required?: boolean
  /** Label text or content */
  children: React.ReactNode
}

export const Label: React.FC<LabelProps> = ({ htmlFor, required = false, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
      }}
    >
      {children}
      {required && <span style={{ color: colors.semantic.error, marginLeft: spacing.xs }}>*</span>}
    </label>
  )
}
