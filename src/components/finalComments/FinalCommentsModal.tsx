/**
 * FinalCommentsModal Component
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
 * - US-FINAL-003: Create new final comment ✅
 * - US-FINAL-004: Edit existing final comment ✅
 * - US-FINAL-005: Delete final comment ✅
 * - US-FINAL-006: Close modal ✅
 *
 * US-DELETE-CONFIRM-004 Features:
 * - Uses standardized ConfirmationModal component
 * - Shows student name (firstName + lastName) in preview
 * - Shows class name and year for context
 * - Enhanced confirmation UX with detailed preview
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
import { ConfirmationModal } from '../common/ConfirmationModal'

interface FinalCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  entityData: T
  finalComments: FinalComment[]
  onCreateComment: (request: CreateFinalCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdateFinalCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
  embedded?: boolean // US-CLASS-TABS-003: Support embedded mode (no modal chrome)
}

export const FinalCommentsModal = <T extends { id: number; name: string }>({
  isOpen,
  entityData,
  finalComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
  embedded = false, // US-CLASS-TABS-003: Default to false for backward compatibility
}: FinalCommentsModalProps<T>) => {
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [grade, setGrade] = useState<number | ''>('')
  const [comment, setComment] = useState('')
  const [validationError, setValidationError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Delete confirmation state (US-DELETE-CONFIRM-004)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    commentId: number | null
    studentName: string
    className: string
    classYear: number
  }>({
    isOpen: false,
    commentId: null,
    studentName: '',
    className: '',
    classYear: 0,
  })

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editGrade, setEditGrade] = useState<number | ''>('')
  const [editComment, setEditComment] = useState('')
  const [editValidationError, setEditValidationError] = useState('')

  // US-CLASS-TABS-003: Skip isOpen check when embedded (always render in TabPanel)
  if (!embedded && !isOpen) return null

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

  // Handle delete start - show confirmation dialog (US-DELETE-CONFIRM-004)
  const handleDeleteStart = (finalComment: FinalComment) => {
    const fullName = finalComment.lastName
      ? `${finalComment.firstName} ${finalComment.lastName}`
      : finalComment.firstName

    setDeleteConfirmation({
      isOpen: true,
      commentId: finalComment.id,
      studentName: fullName,
      className: entityData.name,
      classYear: 'year' in entityData ? (entityData as { year: number }).year : 0,
    })
  }

  // Handle delete confirmation (US-DELETE-CONFIRM-004)
  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.commentId !== null) {
      try {
        await onDeleteComment(deleteConfirmation.commentId)
        setDeleteConfirmation({
          isOpen: false,
          commentId: null,
          studentName: '',
          className: '',
          classYear: 0,
        })
      } catch (err) {
        setValidationError('Failed to delete final comment. Please try again.')
      }
    }
  }

  // Handle delete cancellation (US-DELETE-CONFIRM-004)
  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      commentId: null,
      studentName: '',
      className: '',
      classYear: 0,
    })
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

    // LastName validation: If provided and trimmed, any length > 0 is valid
    // No additional validation needed - the trim already ensures this

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

  // US-CLASS-TABS-003: Render content JSX for both embedded and modal modes
  const contentJSX = (
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

          {/* Content - Only show when not loading and no error */}
          {!loading && !error && (
            <>
              {/* US-FINAL-003: Create Form (AC 1, 2) - MOVED TO TOP per US-FINAL-STYLE-001 */}
              {/* Updated to match Edit Class modalStyles pattern */}
              <div className="create-comment-section">
                <h3>Add New Final Comment</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label
                      htmlFor="first-name-input"
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                      }}
                    >
                      First Name <span className="required" style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      id="first-name-input"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter student first name"
                      className="final-comment-input"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: validationError && !firstName ? '1px solid #DC2626' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label
                      htmlFor="last-name-input"
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                      }}
                    >
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
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="grade-input"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                    }}
                  >
                    Grade <span className="required" style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    id="grade-input"
                    type="number"
                    value={grade}
                    onChange={(e) => {
                      const value = e.target.value
                      setGrade(value === '' ? '' : Number(value))
                    }}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    className="final-comment-input"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: validationError && grade === '' ? '1px solid #DC2626' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="comment-input"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                    }}
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter optional comment (max 1000 characters)"
                    className="final-comment-textarea"
                    rows={4}
                    maxLength={1000}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      resize: 'vertical',
                    }}
                  />
                  <div
                    className="character-counter"
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6B7280',
                    }}
                  >
                    {comment.length}/1000 characters
                  </div>
                </div>

                {validationError && (
                  <ErrorMessage message={validationError} />
                )}

                <Button
                  onClick={handleCreateComment}
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Final Comment'}
                </Button>
              </div>

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
                      <div className="comments">
                        {sortedComments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            {editingId === comment.id
                              ? (
                                /* Edit Form - US-FINAL-004 */
                                  <div className="edit-form">
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                      <div className="form-group" style={{ flex: 1 }}>
                                        <label
                                          htmlFor={`edit-first-name-${comment.id}`}
                                          style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: '#374151',
                                          }}
                                        >
                                          First Name <span className="required" style={{ color: '#DC2626' }}>*</span>
                                        </label>
                                        <input
                                          id={`edit-first-name-${comment.id}`}
                                          type="text"
                                          value={editFirstName}
                                          onChange={(e) => setEditFirstName(e.target.value)}
                                          placeholder="Enter student first name"
                                          className="final-comment-input"
                                          style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            fontSize: '1rem',
                                            border: editValidationError && !editFirstName ? '1px solid #DC2626' : '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                          }}
                                        />
                                      </div>

                                      <div className="form-group" style={{ flex: 1 }}>
                                        <label
                                          htmlFor={`edit-last-name-${comment.id}`}
                                          style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: '#374151',
                                          }}
                                        >
                                          Last Name
                                        </label>
                                        <input
                                          id={`edit-last-name-${comment.id}`}
                                          type="text"
                                          value={editLastName}
                                          onChange={(e) => setEditLastName(e.target.value)}
                                          placeholder="Enter student last name (optional)"
                                          className="final-comment-input"
                                          style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            fontSize: '1rem',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                      <label
                                        htmlFor={`edit-grade-${comment.id}`}
                                        style={{
                                          display: 'block',
                                          marginBottom: '0.5rem',
                                          fontSize: '0.875rem',
                                          fontWeight: 500,
                                          color: '#374151',
                                        }}
                                      >
                                        Grade <span className="required" style={{ color: '#DC2626' }}>*</span>
                                      </label>
                                      <input
                                        id={`edit-grade-${comment.id}`}
                                        type="number"
                                        value={editGrade}
                                        onChange={(e) => setEditGrade(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="0-100"
                                        min={0}
                                        max={100}
                                        className="grade-input"
                                        style={{
                                          width: '100%',
                                          padding: '0.75rem',
                                          fontSize: '1rem',
                                          border: editValidationError && editGrade === '' ? '1px solid #DC2626' : '1px solid #E5E7EB',
                                          borderRadius: '8px',
                                        }}
                                      />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                      <label
                                        htmlFor={`edit-comment-${comment.id}`}
                                        style={{
                                          display: 'block',
                                          marginBottom: '0.5rem',
                                          fontSize: '0.875rem',
                                          fontWeight: 500,
                                          color: '#374151',
                                        }}
                                      >
                                        Comment
                                      </label>
                                      <textarea
                                        id={`edit-comment-${comment.id}`}
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        placeholder="Enter optional comment (max 1000 characters)"
                                        className="comment-textarea"
                                        rows={4}
                                        maxLength={1000}
                                        style={{
                                          width: '100%',
                                          padding: '0.75rem',
                                          fontSize: '1rem',
                                          border: '1px solid #E5E7EB',
                                          borderRadius: '8px',
                                          resize: 'vertical',
                                        }}
                                      />
                                      <div
                                        className="character-counter"
                                        style={{
                                          marginTop: '0.5rem',
                                          fontSize: '0.875rem',
                                          color: '#6B7280',
                                        }}
                                      >
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
            </>
          )}
        </div>
  )

  // US-CLASS-TABS-003: Conditional rendering based on embedded mode
  if (embedded) {
    // Embedded mode: Just render content without modal chrome
    return (
      <>
        {contentJSX}

        {/* Delete Confirmation Modal (US-DELETE-CONFIRM-004) */}
        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          title="Delete Final Comment"
          message="Are you sure you want to delete this final comment?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        >
          <div className="text-sm text-gray-700 mt-3">
            <p className="font-medium">
              <span className="font-semibold">Student:</span> {deleteConfirmation.studentName}
            </p>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Class:</span> {deleteConfirmation.className} ({deleteConfirmation.classYear})
            </p>
          </div>
        </ConfirmationModal>
      </>
    )
  }

  // Modal mode: Render with full modal chrome
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
        </div>

        {contentJSX}
      </div>

      {/* Delete Confirmation Modal (US-DELETE-CONFIRM-004) */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Final Comment"
        message="Are you sure you want to delete this final comment?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      >
        <div className="text-sm text-gray-700 mt-3">
          <p className="font-medium">
            <span className="font-semibold">Student:</span> {deleteConfirmation.studentName}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="font-semibold">Class:</span> {deleteConfirmation.className} ({deleteConfirmation.classYear})
          </p>
        </div>
      </ConfirmationModal>
    </div>
  )
}
