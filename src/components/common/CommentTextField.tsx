/**
 * CommentTextField Component
 *
 * Shared comment input field component with validation and placeholder support
 * US-SHARED-001: Create Shared CommentTextField Component
 *
 * Eliminates code duplication between OutcomeCommentsModal and PersonalizedCommentsModal
 */

import { ChangeEvent, useEffect, useState } from 'react'
import { PlaceholderTipsBox } from './PlaceholderTipsBox'
import { PlaceholderWarningsBox } from './PlaceholderWarningsBox'
import { validatePlaceholders } from '../../utils/placeholders'
import { colors, spacing, typography, borders } from '../../theme/tokens'

interface CommentTextFieldProps {
  /** Current comment text */
  value: string
  /** Change callback */
  onChange: (value: string) => void
  /** Optional validation warnings callback */
  onValidationChange?: (warnings: string[]) => void
  /** Placeholder text */
  placeholder?: string
  /** Minimum character count */
  minLength?: number
  /** Maximum character count */
  maxLength?: number
  /** Number of textarea rows */
  rows?: number
  /** Show character counter */
  showCharCount?: boolean
  /** Show placeholder tips box */
  showPlaceholderTips?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Disable input */
  disabled?: boolean
}

export const CommentTextField = ({
  value,
  onChange,
  onValidationChange,
  placeholder = 'Enter comment...',
  minLength = 10,
  maxLength = 500,
  rows = 3,
  showCharCount = true,
  showPlaceholderTips = true,
  ariaLabel,
  disabled = false,
}: CommentTextFieldProps) => {
  const [warnings, setWarnings] = useState<string[]>([])

  // Validate placeholders whenever value changes
  useEffect(() => {
    const newWarnings = validatePlaceholders(value)
    setWarnings(newWarnings)
    onValidationChange?.(newWarnings)
  }, [value, onValidationChange])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const charCount = value.length
  const isValid = charCount >= minLength
  const showMinHint = charCount > 0 && charCount < minLength

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {/* Placeholder Tips */}
      {showPlaceholderTips && <PlaceholderTipsBox />}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-label={ariaLabel}
        disabled={disabled}
        style={{
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          border: `${borders.width.thin} solid ${colors.border.default}`,
          borderRadius: borders.radius.md,
          resize: 'vertical' as const,
          fontFamily: 'inherit',
        }}
      />

      {/* Character Counter */}
      {showCharCount && (
        <div
          style={{
            marginTop: spacing.sm,
            fontSize: typography.fontSize.sm,
            textAlign: 'right' as const,
          }}
        >
          <span
            style={{
              color: isValid ? colors.semantic.success : colors.semantic.error,
            }}
          >
            {charCount} / {maxLength} characters
          </span>
          {showMinHint && (
            <span style={{ color: colors.text.tertiary }}>
              {' '}(minimum {minLength})
            </span>
          )}
        </div>
      )}

      {/* Placeholder Warnings */}
      <PlaceholderWarningsBox warnings={warnings} />
    </div>
  )
}
