/**
 * DuplicateCommentModal Component
 * Reusable modal for notifying users about duplicate comments
 * Used by both OutcomeCommentsModal and PersonalizedCommentsModal
 *
 * Uses design tokens for theme support (light/dark mode)
 */

import { useThemeColors } from '../../hooks/useThemeColors'
import { spacing, typography, borders } from '../../theme/tokens'
import { Button } from './Button'

interface DuplicateCommentModalProps {
  isOpen: boolean
  existingComment: string
  commentType: 'outcome' | 'personalized'
  subjectName: string
  onCancel: () => void
}

export function DuplicateCommentModal({
  isOpen,
  existingComment,
  commentType,
  subjectName,
  onCancel,
}: DuplicateCommentModalProps): JSX.Element | null {
  const themeColors = useThemeColors()

  if (!isOpen) {
    return null
  }

  const commentTypeLabel = commentType === 'outcome' ? 'outcome' : 'personalized'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: themeColors.background.primary,
          borderRadius: borders.radius.md,
          padding: spacing.lg,
          maxWidth: '500px',
          width: '90%',
          boxShadow: `0 ${spacing.xs} ${spacing.md} rgba(0, 0, 0, 0.15)`,
        }}
      >
        <h2
          id="duplicate-modal-title"
          style={{
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.lg,
            fontWeight: 600,
            color: themeColors.text.primary,
          }}
        >
          Duplicate Comment Detected
        </h2>

        <p
          style={{
            margin: `0 0 ${spacing.sm} 0`,
            fontSize: typography.fontSize.base,
            color: themeColors.text.secondary,
          }}
        >
          This
          {' '}
          {commentTypeLabel}
          {' '}
          comment already exists for
          {' '}
          &quot;
          {subjectName}
          &quot;
          :
        </p>

        <div
          data-testid="existing-comment-display"
          style={{
            backgroundColor: themeColors.background.secondary,
            borderLeft: `${borders.width.thick} solid ${themeColors.primary.main}`,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderRadius: borders.radius.sm,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.base,
              color: themeColors.text.primary,
              lineHeight: '1.5',
            }}
          >
            {existingComment}
          </p>
        </div>

        <p
          style={{
            margin: `0 0 ${spacing.lg} 0`,
            fontSize: typography.fontSize.sm,
            color: themeColors.text.secondary,
            fontStyle: 'italic',
          }}
        >
          Please edit the existing comment or enter a different comment.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.sm,
          }}
        >
          <Button variant="primary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
