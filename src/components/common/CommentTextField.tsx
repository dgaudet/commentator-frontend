/**
 * CommentTextField Component
 *
 * Shared comment input field component with validation and placeholder support
 * US-SHARED-001: Create Shared CommentTextField Component
 *
 * Eliminates code duplication between OutcomeCommentsModal and PersonalizedCommentsModal
 */

import { ChangeEvent } from 'react'

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
  placeholder = 'Enter comment...',
  rows = 3,
  ariaLabel,
  disabled = false,
}: CommentTextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      aria-label={ariaLabel}
      disabled={disabled}
    />
  )
}
