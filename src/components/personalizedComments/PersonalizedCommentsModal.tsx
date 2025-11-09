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
 */

import { useState } from 'react'
import type { PersonalizedComment, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'

interface PersonalizedCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  onClose: () => void
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
  onClose,
  entityData,
  personalizedComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
}: PersonalizedCommentsModalProps<T>) => {
  const [newCommentContent, setNewCommentContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
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
    })
    setNewCommentContent('')
  }

  const handleEditStart = (comment: PersonalizedComment) => {
    setEditingId(comment.id)
    setEditContent(comment.comment)
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
        comment: editContent.trim(),
      })
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleEditCancel = () => {
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

  // Character count for new comment
  const newCommentCharCount = newCommentContent.trim().length
  const newCommentIsValid = newCommentCharCount >= 10 && newCommentCharCount <= 500

  // Character count for edit comment
  const editCommentCharCount = editContent.trim().length
  const editCommentIsValid = editCommentCharCount >= 10 && editCommentCharCount <= 500

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        style={{
          padding: '1.5rem',
          backgroundColor: '#FFFFFF',
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
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  Add New Personalized Comment
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Enter personalized comment (10-500 characters)..."
                    aria-label="Add new personalized comment"
                    rows={4}
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'right' }}>
                    <span style={{ color: newCommentIsValid ? '#10B981' : '#DC2626' }}>
                      {newCommentCharCount} / 500 characters
                    </span>
                    {newCommentCharCount > 0 && newCommentCharCount < 10 && (
                      <span style={{ color: '#6B7280' }}> (minimum 10)</span>
                    )}
                  </div>
                </div>
                {validationError && (
                  <div role="alert" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', border: '1px solid #DC2626', borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem' }}>
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
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  Existing Comments
                </h3>
                {personalizedComments.length === 0
                  ? (
                      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#6B7280' }}>No personalized comments yet</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#9CA3AF' }}>
                          Add your first personalized comment above.
                        </p>
                      </div>
                    )
                  : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {personalizedComments.map((comment) => (
                      <div key={comment.id} style={{ padding: '1.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={4}
                                  maxLength={500}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    marginBottom: '0.5rem',
                                  }}
                                />
                                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'right' }}>
                                  <span style={{ color: editCommentIsValid ? '#10B981' : '#DC2626' }}>
                                    {editCommentCharCount} / 500 characters
                                  </span>
                                  {editCommentCharCount > 0 && editCommentCharCount < 10 && (
                                    <span style={{ color: '#6B7280' }}> (minimum 10)</span>
                                  )}
                                </div>
                                {validationError && (
                                  <div role="alert" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', border: '1px solid #DC2626', borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem' }}>
                                    {validationError}
                                  </div>
                                )}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            <div style={{ fontSize: '1rem', color: '#111827', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                              {comment.comment}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1rem' }}>
                              Created: {formatDate(comment.createdAt)}
                              {comment.updatedAt !== comment.createdAt && (
                                <span>
                                  {' '} • Updated: {formatDate(comment.updatedAt)}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
