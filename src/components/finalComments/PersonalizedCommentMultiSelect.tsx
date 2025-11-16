/**
 * PersonalizedCommentMultiSelect Component
 * Multi-select list for personalized comments with checkbox interaction
 * Reference: US-RATING-006
 *
 * Features:
 * - Display all comments sorted by rating (highest to lowest)
 * - Checkbox-style selection
 * - Rating emoji display
 * - Loading and error states
 * - Keyboard navigation
 * - WCAG 2.1 AA accessible
 */

import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { colors, spacing, typography, borders } from '../../theme/tokens'
import { getRatingEmoji, getNormalizedRating, sortPersonalizedCommentsByRating } from '../../utils/personalizedCommentRating'
import type { PersonalizedComment } from '../../types'

interface PersonalizedCommentMultiSelectProps {
  /** Array of personalized comments to display */
  comments: PersonalizedComment[]
  /** Array of IDs of currently selected comments */
  selectedIds: number[]
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: number[]) => void
  /** Loading state */
  loading?: boolean
  /** Error message */
  error?: string | null
}

/**
 * Multi-select list component for personalized comments
 * Allows users to select multiple comments with checkboxes
 */
export const PersonalizedCommentMultiSelect: React.FC<PersonalizedCommentMultiSelectProps> = ({
  comments,
  selectedIds,
  onSelectionChange,
  loading = false,
  error = null,
}) => {
  // Sort comments by rating (highest first)
  const sortedComments = sortPersonalizedCommentsByRating(comments)

  const handleToggle = (commentId: number) => {
    if (selectedIds.includes(commentId)) {
      // Remove from selection
      onSelectionChange(selectedIds.filter(id => id !== commentId))
    } else {
      // Add to selection
      onSelectionChange([...selectedIds, commentId])
    }
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (loading) {
    return (
      <div style={{ padding: spacing.lg, textAlign: 'center' as const }}>
        <LoadingSpinner data-testid="loading-spinner" />
      </div>
    )
  }

  if (sortedComments.length === 0) {
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
        No personalized comments available
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
        Available Comments (click to select)
      </label>

      <div
        role="list"
        style={{
          maxHeight: '200px',
          overflowY: 'auto' as const,
          border: `${borders.width.thin} solid ${colors.border.default}`,
          borderRadius: borders.radius.md,
          backgroundColor: colors.background.primary,
        }}
      >
        {sortedComments.map((comment) => {
          const isSelected = selectedIds.includes(comment.id)
          const emoji = getRatingEmoji(getNormalizedRating(comment))

          return (
            <div
              key={comment.id}
              role="listitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: spacing.md,
                borderBottom: `${borders.width.thin} solid ${colors.border.default}`,
                backgroundColor: isSelected ? colors.primary[50] : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = colors.neutral[100]
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <input
                type="checkbox"
                id={`comment-${comment.id}`}
                checked={isSelected}
                onChange={() => handleToggle(comment.id)}
                disabled={loading}
                aria-label={`Select: ${comment.comment}`}
                style={{
                  marginRight: spacing.md,
                  cursor: 'pointer',
                  width: '20px',
                  height: '20px',
                }}
              />

              <label
                htmlFor={`comment-${comment.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  fontSize: typography.fontSize.sm,
                  color: colors.text.primary,
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    marginRight: spacing.sm,
                  }}
                >
                  {emoji}
                </span>
                <span>{comment.comment}</span>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
