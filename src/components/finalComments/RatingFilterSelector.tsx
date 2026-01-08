/**
 * RatingFilterSelector Component
 *
 * Composite component combining EmojiRatingSelector with a clear button.
 * Used in Add and Edit final comments forms to filter personalized comments by rating.
 *
 * Reference: US-FILTER-001
 */

import React from 'react'
import { EmojiRatingSelector } from '../common/EmojiRatingSelector'
import { spacing, borders, typography } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'

interface RatingFilterSelectorProps {
  /** Unique identifier for the rating selector */
  id: string
  /** Current rating value (1-5, or 0/invalid for no selection) */
  value: number
  /** Callback when rating changes */
  onChange: (rating: number) => void
  /** Optional label text */
  label?: string
  /** Whether the selector is disabled */
  disabled?: boolean
}

/**
 * RatingFilterSelector component for filtering personalized comments by rating
 *
 * Combines EmojiRatingSelector with a clear filter button for a complete
 * rating filter control. The clear button appears when a rating is selected.
 *
 * @example
 * <RatingFilterSelector
 *   id="add-rating-filter"
 *   label="Filter by Rating"
 *   value={filterRating}
 *   onChange={setFilterRating}
 *   disabled={submitting}
 * />
 */
export const RatingFilterSelector: React.FC<RatingFilterSelectorProps> = ({
  id,
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const themeColors = useThemeColors()

  return (
    <div style={{ marginBottom: spacing.lg }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <EmojiRatingSelector
          id={id}
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {value > 0 && (
          <button
            onClick={() => onChange(0)}
            disabled={disabled}
            aria-label="Clear rating filter"
            style={{
              backgroundColor: 'transparent',
              border: `${borders.width.thin} solid ${themeColors.border.default}`,
              borderRadius: borders.radius.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              color: themeColors.text.primary,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.backgroundColor = themeColors.background.secondary
                e.currentTarget.style.borderColor = themeColors.border.focus
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = themeColors.border.default
            }}
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  )
}
