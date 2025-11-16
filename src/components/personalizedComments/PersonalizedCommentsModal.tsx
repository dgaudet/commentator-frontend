/**
 * PersonalizedCommentsModal Component
 *
 * Modal for viewing, creating, editing, and deleting personalized comments for a subject.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Simpler than OutcomeCommentsModal - no upperRange/lowerRange fields
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports Subject type
 *
 * User Stories:
 * - US-PERS-001: View all personalized comments for a subject
 * - US-PERS-002: Create new personalized comment
 * - US-PERS-003: Edit existing personalized comment
 * - US-PERS-004: Delete personalized comment with confirmation (US-DELETE-CONFIRM-002)
 * - US-PERS-005: Navigate back to subject list
 *
 * US-DELETE-CONFIRM-002 Features:
 * - Uses standardized ConfirmationModal component
 * - Shows preview of comment text (truncated to 100 chars)
 * - Consistent UX with other delete operations
 *
 * UI Consistency: Migrated to design tokens (US-UI-003)
 */

import { useState } from 'react'
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { EmojiRatingSelector } from '../common/EmojiRatingSelector'
import { colors, spacing, typography, borders } from '../../theme/tokens'
import { getRatingEmoji, getRatingLabel, getNormalizedRating, sortPersonalizedCommentsByRating } from '../../utils/personalizedCommentRating'

interface PersonalizedCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  entityData: T
  personalizedComments: PersonalizedComment[]
  onCreateComment: (request: CreatePersonalizedCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdatePersonalizedCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

export const PersonalizedCommentsModal = <T extends { id: number; name: string }>({
  isOpen,
  entityData,
  personalizedComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
}: PersonalizedCommentsModalProps<T>) => {
  const [newCommentContent, setNewCommentContent] = useState('')
  const [newCommentRating, setNewCommentRating] = useState(3) // Default rating: 3 (Neutral)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editRating, setEditRating] = useState(3)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    commentId: number | null
    commentText: string
  }>({
    isOpen: false,
    commentId: null,
    commentText: '',
  })
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const validateComment = (comment: string): string | null => {
    const trimmed = comment.trim()
    if (!trimmed) {
      return 'Comment is required'
    }
    if (trimmed.length < 10) {
      return 'Comment must be at least 10 characters'
    }
    if (trimmed.length > 500) {
      return 'Comment cannot exceed 500 characters'
    }
    return null
  }

  const handleCreateComment = async () => {
    const error = validateComment(newCommentContent)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')
    await onCreateComment({
      subjectId: entityData.id,
      comment: newCommentContent.trim(),
      rating: newCommentRating, // US-RATING-003: Include rating
    })
    setNewCommentContent('')
    setNewCommentRating(3) // Reset to default rating
  }

  const handleEditStart = (comment: PersonalizedComment) => {
    setEditingId(comment.id)
    setEditContent(comment.comment)
    setEditRating(getNormalizedRating(comment)) // US-RATING-003: Load existing rating (default to 3 if null/undefined)
    setValidationError('')
  }

  const handleEditSave = async () => {
    const error = validateComment(editContent)
    if (error) {
      setValidationError(error)
      return
    }

    if (editingId) {
      setValidationError('')
      await onUpdateComment(editingId, {
        subjectId: entityData.id,
        comment: editContent.trim(),
        rating: editRating, // US-RATING-003: Include rating
      })
      setEditingId(null)
      setEditContent('')
      setEditRating(3) // Reset to default
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditContent('')
    setEditRating(3) // Reset to default
    setValidationError('')
  }

  const handleDeleteStart = (comment: PersonalizedComment) => {
    setDeleteConfirmation({
      isOpen: true,
      commentId: comment.id,
      commentText: comment.comment,
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.commentId !== null) {
      await onDeleteComment(deleteConfirmation.commentId)
      setDeleteConfirmation({ isOpen: false, commentId: null, commentText: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, commentId: null, commentText: '' })
  }

  // Truncate comment text for preview (US-DELETE-CONFIRM-002 AC3)
  const getCommentPreview = (text: string): string => {
    return text.length > 100 ? `${text.substring(0, 100)}...` : text
  }

  // Character count for new comment
  const newCommentCharCount = newCommentContent.trim().length
  const newCommentIsValid = newCommentCharCount >= 10 && newCommentCharCount <= 500

  // Character count for edit comment
  const editCommentCharCount = editContent.trim().length
  const editCommentIsValid = editCommentCharCount >= 10 && editCommentCharCount <= 500

  // US-RATING-004: Sort comments by rating (descending) with alphabetical tie-breaking
  const sortedComments = sortPersonalizedCommentsByRating(personalizedComments)

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Personalized Comments"
        style={{
          padding: spacing.xl,
          backgroundColor: colors.background.primary,
        }}
      >
          {loading && (
            <div className="loading-container">
              <LoadingSpinner data-testid="loading-spinner" />
            </div>
          )}

          {error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && (
            <>
              {/* Create Comment Form */}
              <div style={{ marginBottom: spacing['2xl'] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Add New Personalized Comment
                </h3>
                {/* US-RATING-003: Rating Selector */}
                <EmojiRatingSelector
                  id="new-comment-rating"
                  label="Rating"
                  value={newCommentRating}
                  onChange={setNewCommentRating}
                  required
                />
                <div style={{ marginBottom: spacing.lg }}>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Enter personalized comment (10-500 characters)..."
                    aria-label="Add new personalized comment"
                    rows={4}
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      fontSize: typography.fontSize.base,
                      border: `${borders.width.thin} solid ${colors.border.default}`,
                      borderRadius: borders.radius.md,
                      resize: 'vertical' as const,
                    }}
                  />
                  <div
                    style={{
                      marginTop: spacing.sm,
                      fontSize: typography.fontSize.sm,
                      textAlign: 'right' as const,
                    }}
                  >
                    <span
                      style={{
                        color: newCommentIsValid ? colors.semantic.success : colors.semantic.error,
                      }}
                    >
                      {newCommentCharCount} / 500 characters
                    </span>
                    {newCommentCharCount > 0 && newCommentCharCount < 10 && (
                      <span style={{ color: colors.text.tertiary }}> (minimum 10)</span>
                    )}
                  </div>
                </div>
                {validationError && (
                  <div
                    role="alert"
                    style={{
                      padding: spacing.md,
                      marginBottom: spacing.lg,
                      backgroundColor: colors.semantic.errorLight,
                      border: `${borders.width.thin} solid ${colors.semantic.error}`,
                      borderRadius: borders.radius.md,
                      color: colors.semantic.error,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    {validationError}
                  </div>
                )}
                <Button
                  onClick={handleCreateComment}
                  variant="primary"
                  disabled={!newCommentIsValid}
                >
                  Add Comment
                </Button>
              </div>

              {/* Comments List */}
              <div style={{ marginBottom: spacing['2xl'] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Existing Comments
                </h3>
                {sortedComments.length === 0
                  ? (
                      <div
                        style={{
                          textAlign: 'center' as const,
                          padding: spacing['2xl'],
                          backgroundColor: colors.neutral[50],
                          borderRadius: borders.radius.md,
                          border: `${borders.width.thin} dashed ${colors.border.default}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: typography.fontSize.base,
                            color: colors.text.tertiary,
                          }}
                        >
                          No personalized comments yet
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: colors.text.disabled,
                          }}
                        >
                          Add your first personalized comment above.
                        </p>
                      </div>
                    )
                  : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: spacing.lg,
                    }}
                  >
                    {sortedComments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          padding: spacing.xl,
                          border: `${borders.width.thin} solid ${colors.border.default}`,
                          borderRadius: borders.radius.md,
                          backgroundColor: colors.background.primary,
                        }}
                      >
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div>
                                {/* US-RATING-003: Rating Selector */}
                                <EmojiRatingSelector
                                  id="edit-comment-rating"
                                  label="Rating"
                                  value={editRating}
                                  onChange={setEditRating}
                                  required
                                />
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={4}
                                  maxLength={500}
                                  style={{
                                    width: '100%',
                                    padding: spacing.md,
                                    fontSize: typography.fontSize.base,
                                    border: `${borders.width.thin} solid ${colors.border.default}`,
                                    borderRadius: borders.radius.md,
                                    resize: 'vertical' as const,
                                    marginBottom: spacing.sm,
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: spacing.sm,
                                    fontSize: typography.fontSize.sm,
                                    textAlign: 'right' as const,
                                    marginBottom: spacing.lg,
                                  }}
                                >
                                  <span
                                    style={{
                                      color: editCommentIsValid ? colors.semantic.success : colors.semantic.error,
                                    }}
                                  >
                                    {editCommentCharCount} / 500 characters
                                  </span>
                                  {editCommentCharCount > 0 && editCommentCharCount < 10 && (
                                    <span style={{ color: colors.text.tertiary }}> (minimum 10)</span>
                                  )}
                                </div>
                                {validationError && (
                                  <div
                                    role="alert"
                                    style={{
                                      padding: spacing.md,
                                      marginBottom: spacing.lg,
                                      backgroundColor: colors.semantic.errorLight,
                                      border: `${borders.width.thin} solid ${colors.semantic.error}`,
                                      borderRadius: borders.radius.md,
                                      color: colors.semantic.error,
                                      fontSize: typography.fontSize.sm,
                                    }}
                                  >
                                    {validationError}
                                  </div>
                                )}
                                <div style={{ display: 'flex', gap: spacing.sm }}>
                                  <Button
                                    onClick={handleEditSave}
                                    variant="primary"
                                    disabled={!editCommentIsValid}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={handleEditCancel}
                                    variant="secondary"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )
                          : (
                            /* View Mode */
                              <div>
                            {/* Rating Display (US-RATING-004) */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.md,
                                marginBottom: spacing.md,
                              }}
                            >
                              <span
                                aria-label={`Rating: ${getNormalizedRating(comment)} out of 5 - ${getRatingLabel(getNormalizedRating(comment))}`}
                                style={{
                                  fontSize: '1.5rem',
                                  lineHeight: 1,
                                }}
                              >
                                {getRatingEmoji(getNormalizedRating(comment))}
                              </span>
                              <div
                                style={{
                                  fontSize: typography.fontSize.base,
                                  color: colors.text.primary,
                                  lineHeight: typography.lineHeight.normal,
                                  flex: 1,
                                }}
                              >
                                {comment.comment}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: typography.fontSize.xs,
                                color: colors.text.disabled,
                                marginBottom: spacing.lg,
                              }}
                            >
                              Created: {formatDate(comment.createdAt)}
                              {comment.updatedAt !== comment.createdAt && (
                                <span>
                                  {' '} • Updated: {formatDate(comment.updatedAt)}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: spacing.sm }}>
                              <Button
                                onClick={() => handleEditStart(comment)}
                                variant="secondary"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteStart(comment)}
                                variant="danger"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                            )}
                      </div>
                    ))}
                  </div>
                    )}
              </div>
            </>
          )}
      </div>

      {/* Delete Confirmation Modal (US-DELETE-CONFIRM-002) */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Personalized Comment"
        message="Are you sure you want to delete this personalized comment?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      >
        <p className="text-sm text-gray-600 mt-2">
          "{getCommentPreview(deleteConfirmation.commentText)}"
        </p>
      </ConfirmationModal>
    </>
  )
}
