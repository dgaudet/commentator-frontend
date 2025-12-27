/**
 * OutcomeCommentsModal Component
 *
 * Modal for viewing, creating, editing, and deleting outcome comments for a class or subject.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: string; name: string } - Supports both Class and Subject types
 *
 * User Stories:
 * 1. View all outcome comments for an entity (class/subject)
 * 2. Create new outcome comment for an entity
 * 3. Edit existing outcome comment
 * 4. Delete outcome comment with confirmation (US-DELETE-CONFIRM-001)
 *
 * US-DELETE-CONFIRM-001 Features:
 * - Uses standardized ConfirmationModal component
 * - Shows preview of comment text (truncated to 100 chars)
 * - Consistent UX with other delete operations
 *
 * Related: TD-001 (OutcomeCommentsModal Subject Type Compatibility)
 * UI Consistency: Migrated to design tokens (US-UI-002)
 */

import { useState, useMemo } from 'react'
import type { OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from '../../types'
import { sortOutcomeCommentsByRange } from '../../utils/sortOutcomeComments'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { CommentTextField } from '../common/CommentTextField'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusShadows } from '../../hooks/useThemeFocusShadows'
import { MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH } from '../../constants/commentLimits'

interface OutcomeCommentsModalProps<T extends { id: string; name: string }> {
  isOpen: boolean
  entityData: T
  outcomeComments: OutcomeComment[]
  onCreateComment: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateComment: (id: string, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteComment: (id: string) => Promise<void>
  loading: boolean
  error: string | null
}

export const OutcomeCommentsModal = <T extends { id: string; name: string }>({
  isOpen,
  entityData,
  outcomeComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
}: OutcomeCommentsModalProps<T>) => {
  const themeColors = useThemeColors()
  const focusShadows = useThemeFocusShadows()
  const [newCommentContent, setNewCommentContent] = useState('')
  const [newUpperRange, setNewUpperRange] = useState<number | ''>('')
  const [newLowerRange, setNewLowerRange] = useState<number | ''>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editUpperRange, setEditUpperRange] = useState<number | ''>('')
  const [editLowerRange, setEditLowerRange] = useState<number | ''>('')
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

  // Memoize sorted comments to avoid re-sorting on every render (Performance optimization)
  const sortedComments = useMemo(
    () => sortOutcomeCommentsByRange(outcomeComments),
    [outcomeComments],
  )

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
    const commentError = validateComment(newCommentContent)
    if (commentError) {
      setValidationError(commentError)
      return
    }

    if (newUpperRange === '' || newLowerRange === '') {
      setValidationError('Both upper and lower range values are required')
      return
    }

    if (Number(newLowerRange) > Number(newUpperRange)) {
      setValidationError('Lower range cannot be greater than upper range')
      return
    }

    setValidationError('')
    await onCreateComment({
      subjectId: entityData.id,
      comment: newCommentContent.trim(),
      upperRange: Number(newUpperRange),
      lowerRange: Number(newLowerRange),
    })
    setNewCommentContent('')
    setNewUpperRange('')
    setNewLowerRange('')
  }

  const handleEditStart = (comment: OutcomeComment) => {
    setEditingId(comment.id)
    setEditContent(comment.comment)
    setEditUpperRange(comment.upperRange)
    setEditLowerRange(comment.lowerRange)
  }

  const handleEditSave = async () => {
    const commentError = validateComment(editContent)
    if (commentError) {
      setValidationError(commentError)
      return
    }

    if (editUpperRange === '' || editLowerRange === '') {
      setValidationError('Both upper and lower range values are required')
      return
    }

    if (Number(editLowerRange) > Number(editUpperRange)) {
      setValidationError('Lower range cannot be greater than upper range')
      return
    }

    if (editingId) {
      setValidationError('')
      await onUpdateComment(editingId, {
        comment: editContent.trim(),
        upperRange: Number(editUpperRange),
        lowerRange: Number(editLowerRange),
      })
      setEditingId(null)
      setEditContent('')
      setEditUpperRange('')
      setEditLowerRange('')
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditContent('')
    setEditUpperRange('')
    setEditLowerRange('')
    setValidationError('')
  }

  const handleDeleteStart = (comment: OutcomeComment) => {
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

  // Truncate comment text for preview (US-DELETE-CONFIRM-001 AC3)
  const getCommentPreview = (text: string): string => {
    return text.length > 100 ? `${text.substring(0, 100)}...` : text
  }

  // Character count validation for button disabled states
  const newCommentCharCount = newCommentContent.trim().length
  const newCommentIsValid = newCommentCharCount >= MIN_COMMENT_LENGTH && newCommentCharCount <= MAX_COMMENT_LENGTH

  const editCommentCharCount = editContent.trim().length
  const editCommentIsValid = editCommentCharCount >= MIN_COMMENT_LENGTH && editCommentCharCount <= MAX_COMMENT_LENGTH

  // Focus/Blur handlers for range inputs - match Input component styling
  const handleRangeFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const focusColor = themeColors.primary.main
    const focusShadowColor = focusShadows.primary

    e.currentTarget.style.borderColor = focusColor
    e.currentTarget.style.boxShadow = `0 0 0 3px ${focusShadowColor}`
  }

  const handleRangeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = themeColors.border.default
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Outcome Comments"
        style={{
          padding: spacing.xl,
          backgroundColor: themeColors.background.primary,
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
                    color: themeColors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Add New Outcome Comment
                </h3>

                {/* US-SHARED-002: Use shared CommentTextField component */}
                <CommentTextField
                  value={newCommentContent}
                  onChange={setNewCommentContent}
                  placeholder={`Enter outcome comment (${MIN_COMMENT_LENGTH}-${MAX_COMMENT_LENGTH} characters)...`}
                  ariaLabel="Add new outcome comment"
                  minLength={MIN_COMMENT_LENGTH}
                  maxLength={MAX_COMMENT_LENGTH}
                  showCharCount={true}
                  showPlaceholderTips={true}
                />
                <div
                  style={{
                    display: 'flex',
                    gap: spacing.lg,
                    marginBottom: spacing.lg,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="lower-range"
                      style={{
                        display: 'block',
                        marginBottom: spacing.sm,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: themeColors.text.secondary,
                      }}
                    >
                      Lower Range:
                    </label>
                    <input
                      id="lower-range"
                      type="number"
                      value={newLowerRange}
                      onChange={(e) => setNewLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                      onFocus={handleRangeFocus}
                      onBlur={handleRangeBlur}
                      placeholder="Min score"
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        fontSize: typography.fontSize.base,
                        color: themeColors.text.primary,
                        backgroundColor: themeColors.background.primary,
                        border: `${borders.width.thin} solid ${themeColors.border.default}`,
                        borderRadius: borders.radius.md,
                        outline: 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="upper-range"
                      style={{
                        display: 'block',
                        marginBottom: spacing.sm,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: themeColors.text.secondary,
                      }}
                    >
                      Upper Range:
                    </label>
                    <input
                      id="upper-range"
                      type="number"
                      value={newUpperRange}
                      onChange={(e) => setNewUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                      onFocus={handleRangeFocus}
                      onBlur={handleRangeBlur}
                      placeholder="Max score"
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        fontSize: typography.fontSize.base,
                        color: themeColors.text.primary,
                        backgroundColor: themeColors.background.primary,
                        border: `${borders.width.thin} solid ${themeColors.border.default}`,
                        borderRadius: borders.radius.md,
                        outline: 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      }}
                    />
                  </div>
                </div>
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
                {outcomeComments.length === 0
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
                          No outcome comments found
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: themeColors.text.disabled,
                          }}
                        >
                          Be the first to add an outcome comment.
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
                                {/* US-SHARED-002: Use shared CommentTextField component (Edit Mode) */}
                                <CommentTextField
                                  value={editContent}
                                  onChange={setEditContent}
                                  placeholder="Edit outcome comment..."
                                  ariaLabel="Edit outcome comment"
                                  minLength={MIN_COMMENT_LENGTH}
                                  maxLength={MAX_COMMENT_LENGTH}
                                  showCharCount={true}
                                  showPlaceholderTips={true}
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: spacing.lg,
                                    marginBottom: spacing.lg,
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <label
                                      htmlFor={`edit-lower-${comment.id}`}
                                      style={{
                                        display: 'block',
                                        marginBottom: spacing.sm,
                                        fontSize: typography.fontSize.sm,
                                        fontWeight: typography.fontWeight.medium,
                                        color: themeColors.text.secondary,
                                      }}
                                    >
                                      Lower Range:
                                    </label>
                                    <input
                                      id={`edit-lower-${comment.id}`}
                                      type="number"
                                      value={editLowerRange}
                                      onChange={(e) => setEditLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      onFocus={handleRangeFocus}
                                      onBlur={handleRangeBlur}
                                      style={{
                                        width: '100%',
                                        padding: spacing.md,
                                        fontSize: typography.fontSize.base,
                                        color: themeColors.text.primary,
                                        backgroundColor: themeColors.background.primary,
                                        border: `${borders.width.thin} solid ${themeColors.border.default}`,
                                        borderRadius: borders.radius.md,
                                        outline: 'none',
                                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                                      }}
                                    />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <label
                                      htmlFor={`edit-upper-${comment.id}`}
                                      style={{
                                        display: 'block',
                                        marginBottom: spacing.sm,
                                        fontSize: typography.fontSize.sm,
                                        fontWeight: typography.fontWeight.medium,
                                        color: themeColors.text.secondary,
                                      }}
                                    >
                                      Upper Range:
                                    </label>
                                    <input
                                      id={`edit-upper-${comment.id}`}
                                      type="number"
                                      value={editUpperRange}
                                      onChange={(e) => setEditUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      onFocus={handleRangeFocus}
                                      onBlur={handleRangeBlur}
                                      style={{
                                        width: '100%',
                                        padding: spacing.md,
                                        fontSize: typography.fontSize.base,
                                        color: themeColors.text.primary,
                                        backgroundColor: themeColors.background.primary,
                                        border: `${borders.width.thin} solid ${themeColors.border.default}`,
                                        borderRadius: borders.radius.md,
                                        outline: 'none',
                                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                                      }}
                                    />
                                  </div>
                                </div>
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
                            <div
                              style={{
                                fontSize: typography.fontSize.base,
                                color: themeColors.text.primary,
                                marginBottom: spacing.md,
                                lineHeight: typography.lineHeight.normal,
                              }}
                            >
                              {comment.comment}
                            </div>
                            <div
                              style={{
                                fontSize: typography.fontSize.sm,
                                color: themeColors.text.tertiary,
                                marginBottom: spacing.md,
                              }}
                            >
                              Score Range: {comment.lowerRange} - {comment.upperRange}
                            </div>
                            <div
                              style={{
                                fontSize: typography.fontSize.xs,
                                color: themeColors.text.disabled,
                                marginBottom: spacing.lg,
                              }}
                            >
                              {formatDate(comment.createdAt)}
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

      {/* Delete Confirmation Modal (US-DELETE-CONFIRM-001) */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Outcome Comment"
        message="Are you sure you want to delete this outcome comment?"
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
