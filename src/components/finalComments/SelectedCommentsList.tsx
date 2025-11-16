/**
 * SelectedCommentsList Component
 * Ordered list of selected personalized comments with reordering controls
 * Reference: US-RATING-006
 *
 * Features:
 * - Display selected comments in order with rating emojis
 * - Move up/down buttons for reordering
 * - Remove button for each item
 * - Order numbers (1, 2, 3...)
 * - Empty state when no selections
 * - WCAG 2.1 AA accessible
 */

import { colors, spacing, typography, borders } from '../../theme/tokens'
import { getRatingEmoji, getNormalizedRating } from '../../utils/personalizedCommentRating'
import type { PersonalizedComment } from '../../types'

interface SelectedCommentsListProps {
  /** Array of selected comments in display order */
  selectedComments: PersonalizedComment[]
  /** Callback when item order changes */
  onReorder: (fromIndex: number, toIndex: number) => void
  /** Callback when item is removed (by index to support duplicates) */
  onRemove: (index: number) => void
}

/**
 * Ordered list component for selected personalized comments
 * Displays comments with reordering and removal controls
 */
export const SelectedCommentsList: React.FC<SelectedCommentsListProps> = ({
  selectedComments,
  onReorder,
  onRemove,
}) => {
  // Empty state
  if (selectedComments.length === 0) {
    return (
      <div
        style={{
          padding: spacing.xl,
          textAlign: 'center' as const,
          backgroundColor: colors.neutral[50],
          border: `${borders.width.thin} dashed ${colors.border.default}`,
          borderRadius: borders.radius.md,
          color: colors.text.tertiary,
        }}
      >
        No comments selected
      </div>
    )
  }

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.secondary,
        }}
      >
        Selected Comments (in order)
      </label>

      <div
        role="list"
        style={{
          border: `${borders.width.thin} solid ${colors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: colors.background.primary,
        }}
      >
        {selectedComments.map((comment, index) => {
          const emoji = getRatingEmoji(getNormalizedRating(comment))
          const isFirst = index === 0
          const isLast = index === selectedComments.length - 1

          return (
            <div
              key={index}
              role="listitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: spacing.md,
                borderBottom:
                  index < selectedComments.length - 1
                    ? `${borders.width.thin} solid ${colors.border.default}`
                    : 'none',
              }}
            >
              {/* Order number */}
              <span
                style={{
                  minWidth: '24px',
                  fontWeight: typography.fontWeight.semibold,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  marginRight: spacing.sm,
                }}
              >
                {index + 1}
              </span>

              {/* Rating emoji */}
              <span
                style={{
                  fontSize: '1.25rem',
                  marginRight: spacing.sm,
                }}
              >
                {emoji}
              </span>

              {/* Comment text */}
              <span
                style={{
                  flex: 1,
                  fontSize: typography.fontSize.sm,
                  color: colors.text.primary,
                }}
              >
                {comment.comment}
              </span>

              {/* Reorder buttons */}
              <div style={{ display: 'flex', gap: spacing.xs, marginRight: spacing.sm }}>
                {!isFirst && (
                  <button
                    type="button"
                    onClick={() => onReorder(index, index - 1)}
                    aria-label={`Move up: ${comment.comment}`}
                    style={{
                      padding: spacing.xs,
                      border: `${borders.width.thin} solid ${colors.border.default}`,
                      borderRadius: borders.radius.sm,
                      backgroundColor: colors.background.primary,
                      color: colors.text.secondary,
                      cursor: 'pointer',
                      fontSize: typography.fontSize.xs,
                    }}
                  >
                    ↑
                  </button>
                )}
                {!isLast && (
                  <button
                    type="button"
                    onClick={() => onReorder(index, index + 1)}
                    aria-label={`Move down: ${comment.comment}`}
                    style={{
                      padding: spacing.xs,
                      border: `${borders.width.thin} solid ${colors.border.default}`,
                      borderRadius: borders.radius.sm,
                      backgroundColor: colors.background.primary,
                      color: colors.text.secondary,
                      cursor: 'pointer',
                      fontSize: typography.fontSize.xs,
                    }}
                  >
                    ↓
                  </button>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove: ${comment.comment}`}
                style={{
                  padding: spacing.xs,
                  border: `${borders.width.thin} solid ${colors.semantic.error}`,
                  borderRadius: borders.radius.sm,
                  backgroundColor: colors.background.primary,
                  color: colors.semantic.error,
                  cursor: 'pointer',
                  fontSize: typography.fontSize.xs,
                }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
