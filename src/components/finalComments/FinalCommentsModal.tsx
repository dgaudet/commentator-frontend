/**
 * FinalCommentsModal Component
 * TDD Phase: GREEN - Implementing create form to pass tests
 *
 * Modal for viewing, creating, editing, and deleting final comments for a class.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports Class type
 *
 * User Stories:
 * - US-FINAL-001: Access Final Comments Management ✅
 * - US-FINAL-002: View list of final comments ✅
 * - US-FINAL-003: Create new final comment (In Progress)
 * - US-FINAL-004: Edit existing final comment (Post-MVP)
 * - US-FINAL-005: Delete final comment (Post-MVP)
 * - US-FINAL-006: Close modal ✅
 */

import { useState } from 'react'
import type {
  FinalComment,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
} from '../../types'
import { Button } from '../common/Button'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { ConfirmDialog } from '../common/ConfirmDialog'

interface FinalCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  onClose: () => void
  entityData: T
  finalComments: FinalComment[]
  onCreateComment: (request: CreateFinalCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdateFinalCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

export const FinalCommentsModal = <T extends { id: number; name: string }>({
  isOpen,
  onClose,
  entityData,
  finalComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
}: FinalCommentsModalProps<T>) => {
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [grade, setGrade] = useState<number | ''>('')
  const [comment, setComment] = useState('')
  const [validationError, setValidationError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleteStudentName, setDeleteStudentName] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editGrade, setEditGrade] = useState<number | ''>('')
  const [editComment, setEditComment] = useState('')
  const [editValidationError, setEditValidationError] = useState('')

  if (!isOpen) return null

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Validation helper
  const validateForm = (): string | null => {
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()

    if (!trimmedFirstName) {
      return 'First name is required'
    }

    if (grade === '') {
      return 'Grade is required'
    }

    const gradeNum = Number(grade)
    if (gradeNum < 0 || gradeNum > 100) {
      return 'Grade must be between 0 and 100'
    }

    if (comment.length > 1000) {
      return 'Comment cannot exceed 1000 characters'
    }

    // LastName validation only if provided
    if (trimmedLastName.length > 0 && trimmedLastName.length < 1) {
      return 'Last name must be at least 1 character'
    }

    return null
  }

  // Handle create final comment
  const handleCreateComment = async () => {
    const error = validateForm()
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')
    setSubmitting(true)

    try {
      const request: CreateFinalCommentRequest = {
        classId: entityData.id,
        firstName: firstName.trim(),
        grade: Number(grade),
      }

      // Add optional fields only if provided
      if (lastName.trim()) {
        request.lastName = lastName.trim()
      }
      if (comment.trim()) {
        request.comment = comment.trim()
      }

      await onCreateComment(request)

      // Clear form on success (AC 7)
      setFirstName('')
      setLastName('')
      setGrade('')
      setComment('')
    } catch (err) {
      setValidationError('Failed to add final comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete start - show confirmation dialog
  const handleDeleteStart = (finalComment: FinalComment) => {
    setDeleteConfirmId(finalComment.id)
    const fullName = finalComment.lastName
      ? `${finalComment.firstName} ${finalComment.lastName}`
      : finalComment.firstName
    setDeleteStudentName(fullName)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        await onDeleteComment(deleteConfirmId)
        setDeleteConfirmId(null)
        setDeleteStudentName('')
      } catch (err) {
        setValidationError('Failed to delete final comment. Please try again.')
      }
    }
  }

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
    setDeleteStudentName('')
  }

  // Handle edit start - populate form with existing values
  const handleEditStart = (finalComment: FinalComment) => {
    setEditingId(finalComment.id)
    setEditFirstName(finalComment.firstName)
    setEditLastName(finalComment.lastName || '')
    setEditGrade(finalComment.grade)
    setEditComment(finalComment.comment || '')
    setEditValidationError('')
  }

  // Validation helper for edit form (same rules as create)
  const validateEditForm = (): string | null => {
    const trimmedFirstName = editFirstName.trim()
    const trimmedLastName = editLastName.trim()

    if (!trimmedFirstName) {
      return 'First name is required'
    }

    if (editGrade === '') {
      return 'Grade is required'
    }

    const gradeNum = Number(editGrade)
    if (gradeNum < 0 || gradeNum > 100) {
      return 'Grade must be between 0 and 100'
    }

    if (editComment.length > 1000) {
      return 'Comment cannot exceed 1000 characters'
    }

    // LastName validation only if provided
    if (trimmedLastName.length > 0 && trimmedLastName.length < 1) {
      return 'Last name must be at least 1 character'
    }

    return null
  }

  // Handle edit save
  const handleEditSave = async () => {
    if (editingId === null) return

    const error = validateEditForm()
    if (error) {
      setEditValidationError(error)
      return
    }

    setEditValidationError('')

    try {
      const request: UpdateFinalCommentRequest = {
        classId: entityData.id,
        firstName: editFirstName.trim(),
        grade: Number(editGrade),
      }

      // Add optional fields only if provided
      if (editLastName.trim()) {
        request.lastName = editLastName.trim()
      }
      if (editComment.trim()) {
        request.comment = editComment.trim()
      }

      await onUpdateComment(editingId, request)

      // Exit edit mode on success
      setEditingId(null)
      setEditFirstName('')
      setEditLastName('')
      setEditGrade('')
      setEditComment('')
    } catch (err) {
      setEditValidationError('Failed to update final comment. Please try again.')
    }
  }

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingId(null)
    setEditFirstName('')
    setEditLastName('')
    setEditGrade('')
    setEditComment('')
    setEditValidationError('')
  }

  // Sort final comments by firstName alphabetically (A-Z)
  const sortedComments = [...finalComments].sort((a, b) =>
    a.firstName.localeCompare(b.firstName),
  )

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">
            Final Comments - {entityData.name}
          </h2>
          <Button
            variant="secondary"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </Button>
        </div>

        <div className="modal-body">
          {/* Loading State (AC 5) */}
          {loading && (
            <div className="loading-container">
              <LoadingSpinner data-testid="loading-spinner" />
            </div>
          )}

          {/* Error State (AC 6) */}
          {error && (
            <ErrorMessage message={error} />
          )}

          {/* List Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Empty State (AC 3) */}
              {sortedComments.length === 0
                ? (
                    <div className="empty-state">
                      <p>No final comments yet for this class.</p>
                      <p className="empty-subtext">
                        Add your first student grade!
                      </p>
                    </div>
                  )
                : (
                  /* List Display (AC 1, 2, 7) */
                    <div className="final-comments-list">
                      <h3>Student Final Comments</h3>
                      <div className="comments">
                        {sortedComments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            {editingId === comment.id
                              ? (
                                /* Edit Form - US-FINAL-004 */
                                  <div className="edit-form">
                                    <div className="form-group">
                                      <label htmlFor={`edit-first-name-${comment.id}`}>
                                        First Name <span className="required">*</span>
                                      </label>
                                      <input
                                        id={`edit-first-name-${comment.id}`}
                                        type="text"
                                        value={editFirstName}
                                        onChange={(e) => setEditFirstName(e.target.value)}
                                        className="final-comment-input"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label htmlFor={`edit-last-name-${comment.id}`}>
                                        Last Name
                                      </label>
                                      <input
                                        id={`edit-last-name-${comment.id}`}
                                        type="text"
                                        value={editLastName}
                                        onChange={(e) => setEditLastName(e.target.value)}
                                        className="final-comment-input"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label htmlFor={`edit-grade-${comment.id}`}>
                                        Grade <span className="required">*</span>
                                      </label>
                                      <input
                                        id={`edit-grade-${comment.id}`}
                                        type="number"
                                        value={editGrade}
                                        onChange={(e) => setEditGrade(e.target.value === '' ? '' : Number(e.target.value))}
                                        min={0}
                                        max={100}
                                        className="grade-input"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label htmlFor={`edit-comment-${comment.id}`}>
                                        Comment
                                      </label>
                                      <textarea
                                        id={`edit-comment-${comment.id}`}
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="comment-textarea"
                                        rows={3}
                                        maxLength={1000}
                                      />
                                      <div className="character-counter">
                                        {editComment.length}/1000 characters
                                      </div>
                                    </div>

                                    {editValidationError && (
                                      <div className="validation-error" role="alert">
                                        {editValidationError}
                                      </div>
                                    )}

                                    <div className="edit-actions">
                                      <Button
                                        onClick={handleEditSave}
                                        variant="primary"
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
                                /* Display View */
                                  <>
                                    <div className="student-header">
                                      <h4 className="student-name">
                                        {comment.firstName}
                                        {comment.lastName ? ` ${comment.lastName}` : ''}
                                      </h4>
                                      <div className="grade-display">
                                        Grade: {comment.grade}
                                      </div>
                                    </div>

                                    {comment.comment && (
                                      <div className="comment-text">
                                        {comment.comment}
                                      </div>
                                    )}

                                    <div className="comment-meta">
                                      <span className="comment-date">
                                        Created: {formatDate(comment.createdAt)}
                                      </span>
                                      <Button
                                        variant="secondary"
                                        onClick={() => handleEditStart(comment)}
                                        aria-label={`Edit final comment for ${comment.firstName}${comment.lastName ? ` ${comment.lastName}` : ''}`}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="danger"
                                        onClick={() => handleDeleteStart(comment)}
                                        aria-label={`Delete final comment for ${comment.firstName}${comment.lastName ? ` ${comment.lastName}` : ''}`}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </>
                                )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

              {/* US-FINAL-003: Create Form (AC 1, 2) */}
              <div className="create-comment-section">
                <h3>Add New Final Comment</h3>
                <div className="form-group">
                  <label htmlFor="first-name-input">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    id="first-name-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter student first name"
                    className="final-comment-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last-name-input">
                    Last Name
                  </label>
                  <input
                    id="last-name-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter student last name (optional)"
                    className="final-comment-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="grade-input">
                    Grade <span className="required">*</span>
                  </label>
                  <input
                    id="grade-input"
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Enter grade (0-100)"
                    min={0}
                    max={100}
                    className="grade-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comment-textarea">
                    Comment
                  </label>
                  <textarea
                    id="comment-textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter optional feedback comment..."
                    className="comment-textarea"
                    rows={3}
                    maxLength={1000}
                    disabled={submitting}
                  />
                  <div className="character-counter">
                    {comment.length}/1000 characters
                  </div>
                </div>

                {validationError && (
                  <div className="validation-error" role="alert">
                    {validationError}
                  </div>
                )}

                <Button
                  onClick={handleCreateComment}
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Final Comment'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Final Comment"
        message={`Are you sure you want to delete the final comment for "${deleteStudentName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  )
}
