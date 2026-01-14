/**
 * PersonalizedCommentsModal Component
 *
 * Modal for viewing, creating, editing, and deleting personalized comments for a subject.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Simpler than OutcomeCommentsModal - no upperRange/lowerRange fields
 *
 * Generic Type Parameter:
 * - T extends { id: string; name: string } - Supports Subject type
 *
 * User Stories:
 * - US-PERS-001: View all personalized comments for a subject
 * - US-PERS-002: Create new personalized comment
 * - US-PERS-003: Edit existing personalized comment
 * - US-PERS-004: Delete personalized comment with confirmation (US-DELETE-CONFIRM-002)
 * - US-PERS-005: Navigate back to subject list
 * - US-CP-001: Add Copy Button to Personalized Comments Page
 * - US-CP-002: Display Modal with Subject Selection
 *
 * US-DELETE-CONFIRM-002 Features:
 * - Uses standardized ConfirmationModal component
 * - Shows preview of comment text (truncated to 100 chars)
 * - Consistent UX with other delete operations
 *
 * UI Consistency: Migrated to design tokens (US-UI-003)
 * US-DARK-005: Updated to use dynamic theme colors
 */

import { useState, useEffect } from 'react'
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest, Subject } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { EmojiRatingSelector } from '../common/EmojiRatingSelector'
import { CommentTextField } from '../common/CommentTextField'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { getRatingEmoji, getRatingLabel, getNormalizedRating, sortPersonalizedCommentsByRating } from '../../utils/personalizedCommentRating'
import { MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH } from '../../constants/commentLimits'
import { CopyCommentsModal } from './CopyCommentsModal'
import { BulkUploadModal } from './BulkUploadModal'
import { bulkSaveComments } from './bulkSaveComments'

interface PersonalizedCommentsModalProps<T extends { id: string; name: string }> {
  isOpen: boolean
  entityData: T
  personalizedComments: PersonalizedComment[]
  onCreateComment: (request: CreatePersonalizedCommentRequest) => Promise<void>
  onUpdateComment: (id: string, request: UpdatePersonalizedCommentRequest) => Promise<void>
  onDeleteComment: (id: string) => Promise<void>
  loading: boolean
  error: string | null
  // US-CP-002: Copy Comments feature - optional props
  ownedSubjects?: Subject[]
}

export const PersonalizedCommentsModal = <T extends { id: string; name: string }>({
  isOpen,
  entityData,
  personalizedComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
  ownedSubjects = [],
}: PersonalizedCommentsModalProps<T>) => {
  const themeColors = useThemeColors()
  const [newCommentContent, setNewCommentContent] = useState('')
  const [newCommentRating, setNewCommentRating] = useState(3) // US-RATING-PERSIST: Default rating 3 (Neutral), persists across submissions
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editRating, setEditRating] = useState(3)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    commentId: string | null
    commentText: string
  }>({
    isOpen: false,
    commentId: null,
    commentText: '',
  })
  const [validationError, setValidationError] = useState('')
  // US-CP-001: Copy Comments button state
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  // Story 1: Bulk Upload Modal state
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)

  // US-RATING-PERSIST-003: Reset ratings when modal closes/reopens (session-scoped persistence)
  useEffect(() => {
    if (!isOpen) {
      setNewCommentRating(3)
      setEditRating(3)
    }
  }, [isOpen])

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
    if (trimmed.length < MIN_COMMENT_LENGTH) {
      return `Comment must be at least ${MIN_COMMENT_LENGTH} characters`
    }
    if (trimmed.length > MAX_COMMENT_LENGTH) {
      return `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`
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
    // US-RATING-PERSIST-001: Clear comment text but keep rating selected for next entry
    setNewCommentContent('')
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
      // US-RATING-PERSIST-002: After editing, show the edited rating in add form for next entry
      setNewCommentRating(editRating)
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleEditCancel = () => {
    // US-RATING-PERSIST-002: After canceling edit, keep the edited comment's rating in add form
    setNewCommentRating(editRating)
    setEditingId(null)
    setEditContent('')
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

  // US-RATING-PERSIST-001: Rating selector directly updates form state (handlers are simplified)
  // Rating persists naturally by not being reset after comment submission

  // Character count validation for button disabled states
  const newCommentCharCount = newCommentContent.trim().length
  const newCommentIsValid = newCommentCharCount >= MIN_COMMENT_LENGTH && newCommentCharCount <= MAX_COMMENT_LENGTH

  const editCommentCharCount = editContent.trim().length
  const editCommentIsValid = editCommentCharCount >= MIN_COMMENT_LENGTH && editCommentCharCount <= MAX_COMMENT_LENGTH

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
          backgroundColor: themeColors.background.primary,
        }}
      >
          {/* US-CP-001: Copy Comments to Another Subject button + Story 1: Bulk Upload button */}
          <div style={{ marginBottom: spacing.lg, display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
            <Button
              onClick={() => setIsBulkUploadModalOpen(true)}
              variant="secondary"
              disabled={!entityData}
              aria-label="Bulk Upload Comments"
            >
              Bulk Upload Comments
            </Button>
            <Button
              onClick={() => setIsCopyModalOpen(true)}
              variant="secondary"
              disabled={!entityData}
              aria-label="Copy comments to another subject"
            >
              Copy Comments to Another Subject
            </Button>
          </div>

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
                    color: themeColors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Add New Personalized Comment
                </h3>

                {/* US-SHARED-002 & US-PLACEHOLDER-PC-001/003/004: Use shared CommentTextField component */}
                <CommentTextField
                  value={newCommentContent}
                  onChange={setNewCommentContent}
                  placeholder={`Enter personalized comment (${MIN_COMMENT_LENGTH}-${MAX_COMMENT_LENGTH} characters)...`}
                  ariaLabel="Add new personalized comment"
                  rows={4}
                  minLength={MIN_COMMENT_LENGTH}
                  maxLength={MAX_COMMENT_LENGTH}
                  showCharCount={true}
                  showPlaceholderTips={true}
                />

                {/* US-RATING-003 & US-PLACEHOLDER-PC-004: Rating Selector after textarea */}
                <EmojiRatingSelector
                  id="new-comment-rating"
                  label="Rating"
                  value={newCommentRating}
                  onChange={setNewCommentRating}
                  required
                />
                {validationError && (
                  <div
                    role="alert"
                    style={{
                      padding: spacing.md,
                      marginBottom: spacing.lg,
                      backgroundColor: themeColors.semantic.errorLight,
                      border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
                      borderRadius: borders.radius.md,
                      color: themeColors.semantic.error,
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
                    color: themeColors.text.primary,
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
                          backgroundColor: themeColors.neutral[50],
                          borderRadius: borders.radius.md,
                          border: `${borders.width.thin} dashed ${themeColors.border.default}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: typography.fontSize.base,
                            color: themeColors.text.tertiary,
                          }}
                        >
                          No personalized comments yet
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: themeColors.text.disabled,
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
                          border: `${borders.width.thin} solid ${themeColors.border.default}`,
                          borderRadius: borders.radius.md,
                          backgroundColor: themeColors.background.primary,
                        }}
                      >
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div>
                                {/* US-SHARED-002 & US-PLACEHOLDER-PC-002/003/004: Use shared CommentTextField component */}
                                <CommentTextField
                                  value={editContent}
                                  onChange={setEditContent}
                                  placeholder="Edit personalized comment..."
                                  ariaLabel="Edit personalized comment"
                                  rows={4}
                                  minLength={MIN_COMMENT_LENGTH}
                                  maxLength={MAX_COMMENT_LENGTH}
                                  showCharCount={true}
                                  showPlaceholderTips={true}
                                />

                                {/* US-RATING-003 & US-PLACEHOLDER-PC-004: Rating Selector after textarea */}
                                <EmojiRatingSelector
                                  id="edit-comment-rating"
                                  label="Rating"
                                  value={editRating}
                                  onChange={setEditRating}
                                  required
                                />
                                {validationError && (
                                  <div
                                    role="alert"
                                    style={{
                                      padding: spacing.md,
                                      marginBottom: spacing.lg,
                                      backgroundColor: themeColors.semantic.errorLight,
                                      border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
                                      borderRadius: borders.radius.md,
                                      color: themeColors.semantic.error,
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
                                  color: themeColors.text.primary,
                                  lineHeight: typography.lineHeight.normal,
                                  marginBottom: spacing.md,
                                  flex: 1,
                                }}
                              >
                                {comment.comment}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: typography.fontSize.xs,
                                color: themeColors.text.disabled,
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

      {/* US-CP-001, US-CP-002: Copy Comments Modal */}
      {entityData && (
        <CopyCommentsModal
          isOpen={isCopyModalOpen}
          onClose={() => setIsCopyModalOpen(false)}
          sourceSubjectId={entityData.id}
          sourceSubjectName={entityData.name}
          ownedSubjects={ownedSubjects}
          sourceCommentCount={personalizedComments.length}
        />
      )}

      {/* Story 1: Bulk Upload Modal */}
      {entityData && (
        <BulkUploadModal
          isOpen={isBulkUploadModalOpen}
          onClose={() => setIsBulkUploadModalOpen(false)}
          subjectId={entityData.id}
          onImport={async (comments, onProgress) => {
            // Story 4: Sequential save using existing API
            // bulkSaveComments attempts each comment via onCreateComment, tracking successes/failures
            // Story 5: Pass progress callback for real-time progress updates
            return bulkSaveComments(entityData.id, comments, onCreateComment, onProgress)
          }}
        />
      )}
    </>
  )
}
