/**
 * CommentTextField Component
 *
 * Shared comment input field component with validation and placeholder support
 * US-SHARED-001: Create Shared CommentTextField Component
 *
 * Eliminates code duplication between OutcomeCommentsModal and PersonalizedCommentsModal
 */

import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { PlaceholderTipsBox } from './PlaceholderTipsBox'
import { PlaceholderWarningsBox } from './PlaceholderWarningsBox'
import { validatePlaceholders } from '../../utils/placeholders'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH } from '../../constants/commentLimits'

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
  minLength = MIN_COMMENT_LENGTH,
  maxLength = MAX_COMMENT_LENGTH,
  rows = 3,
  showCharCount = true,
  showPlaceholderTips = true,
  ariaLabel,
  disabled = false,
}: CommentTextFieldProps) => {
  const themeColors = useThemeColors()
  const [warnings, setWarnings] = useState<string[]>([])

  // Use ref to store callback to avoid unnecessary re-renders
  // This prevents the effect from running when parent doesn't memoize the callback
  const onValidationChangeRef = useRef(onValidationChange)

  // Keep ref up-to-date with latest callback
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange
  }, [onValidationChange])

  // Validate placeholders whenever value changes
  useEffect(() => {
    const newWarnings = validatePlaceholders(value)
    setWarnings(newWarnings)
    // Use ref to call callback without including it in dependencies
    onValidationChangeRef.current?.(newWarnings)
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // Use trimmed length to match parent validation logic (e.g., OutcomeCommentsModal line 198)
  const charCount = value.trim().length
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
          border: `${borders.width.thin} solid ${themeColors.border.default}`,
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
              color: isValid ? themeColors.semantic.success : themeColors.semantic.error,
            }}
          >
            {charCount} / {maxLength} characters
          </span>
          {showMinHint && (
            <span style={{ color: themeColors.text.tertiary }}>
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
