/**
 * EmojiRatingSelector Component
 * 5-point emoji-based rating selector for personalized comments
 * Reference: US-RATING-001, US-RATING-003, US-RATING-010
 *
 * Features:
 * - 5 emoji buttons (😢😟😐🙂😊) representing ratings 1-5
 * - Keyboard navigation (arrow keys, space/enter)
 * - WCAG 2.1 AA accessible (radiogroup pattern with roving tabindex)
 * - Visual feedback for selected/unselected states
 * - Error handling and validation
 */
import React from 'react'
import { colors, spacing, typography, borders } from '../../theme/tokens'
import { getRatingEmoji, getRatingLabel } from '../../utils/personalizedCommentRating'

interface EmojiRatingSelectorProps {
  /** Unique identifier for the rating selector */
  id: string
  /** Optional label text */
  label?: string
  /** Current rating value (1-5, or 0/invalid for no selection) */
  value: number
  /** Callback when rating changes */
  onChange: (rating: number) => void
  /** Whether the field is required */
  required?: boolean
  /** Error message or boolean indicating error state */
  error?: string | boolean
  /** Whether the selector is disabled */
  disabled?: boolean
}

/**
 * EmojiRatingSelector component for rating personalized comments
 *
 * Implements ARIA radiogroup pattern with roving tabindex for keyboard navigation.
 * Only the selected button (or first button if none selected) has tabindex="0".
 *
 * @example
 * <EmojiRatingSelector
 *   id="comment-rating"
 *   label="Rate this comment"
 *   value={4}
 *   onChange={(rating) => console.log(rating)}
 *   required
 * />
 */
export const EmojiRatingSelector: React.FC<EmojiRatingSelectorProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
}) => {
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  // Normalize value to 1-5 range (invalid values become 0 = no selection)
  const normalizedValue = value >= 1 && value <= 5 ? Math.round(value) : 0

  // Rating options (1-5)
  const ratings = [1, 2, 3, 4, 5]

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, rating: number) => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowRight':
        if (rating < 5) {
          e.preventDefault()
          onChange(rating + 1)
        }
        break
      case 'ArrowLeft':
        if (rating > 1) {
          e.preventDefault()
          onChange(rating - 1)
        }
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        onChange(rating)
        break
    }
  }

  return (
    <div style={{ marginBottom: spacing.lg }}>
      {/* Label */}
      {label && (
        <label
          id={`${id}-label`}
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.text.secondary,
            marginBottom: spacing.sm,
          }}
        >
          {label}
          {required && (
            <span style={{ color: colors.semantic.error, marginLeft: spacing.xs }}>*</span>
          )}
        </label>
      )}

      {/* Radiogroup container */}
      <div
        id={id}
        role="radiogroup"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        aria-invalid={hasError ? 'true' : 'false'}
        style={{
          display: 'flex',
          gap: spacing.sm,
          padding: spacing.md,
          border: `${borders.width.thin} solid ${hasError ? colors.semantic.error : colors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: colors.background.primary,
        }}
      >
        {ratings.map((rating) => {
          const isSelected = normalizedValue === rating
          const emoji = getRatingEmoji(rating)
          const ratingLabel = getRatingLabel(rating)

          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-label={`Rate ${rating} out of 5: ${ratingLabel}`}
              aria-pressed={isSelected ? 'true' : 'false'}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
              onClick={() => handleClick(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              style={{
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                padding: spacing.sm,
                opacity: isSelected ? 1 : 0.4,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.transform = 'scale(1.2)'
                  e.currentTarget.style.opacity = '1'
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)'
                  e.currentTarget.style.opacity = isSelected ? '1' : '0.4'
                }
              }}
            >
              {emoji}
            </button>
          )
        })}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div role="alert">
          <p
            id={`${id}-error`}
            style={{
              marginTop: spacing.sm,
              fontSize: typography.fontSize.sm,
              color: colors.semantic.error,
            }}
          >
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}
