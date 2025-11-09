/**
 * OutcomeCommentsModal Component
 *
 * Modal for viewing, creating, editing, and deleting outcome comments for a class or subject.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports both Class and Subject types
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
 */

import { useState } from 'react'
import type { OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'

interface OutcomeCommentsModalProps<T extends { id: number; name: string }> {
  isOpen: boolean
  onClose: () => void
  entityData: T
  outcomeComments: OutcomeComment[]
  onCreateComment: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

export const OutcomeCommentsModal = <T extends { id: number; name: string }>({
  isOpen,
  onClose,
  entityData,
  outcomeComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error,
}: OutcomeCommentsModalProps<T>) => {
  const [newCommentContent, setNewCommentContent] = useState('')
  const [newUpperRange, setNewUpperRange] = useState<number | ''>('')
  const [newLowerRange, setNewLowerRange] = useState<number | ''>('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editUpperRange, setEditUpperRange] = useState<number | ''>('')
  const [editLowerRange, setEditLowerRange] = useState<number | ''>('')
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

  const handleCreateComment = async () => {
    if (!newCommentContent.trim()) {
      setValidationError('Comment is required')
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
    if (!editContent.trim()) {
      setValidationError('Comment is required')
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
                  Add New Outcome Comment
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Enter outcome comment..."
                    aria-label="Add new outcome comment"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="lower-range" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Lower Range:
                    </label>
                    <input
                      id="lower-range"
                      type="number"
                      value={newLowerRange}
                      onChange={(e) => setNewLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Min score"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="upper-range" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Upper Range:
                    </label>
                    <input
                      id="upper-range"
                      type="number"
                      value={newUpperRange}
                      onChange={(e) => setNewUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Max score"
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
                {validationError && (
                  <div role="alert" style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', border: '1px solid #DC2626', borderRadius: '8px', color: '#DC2626', fontSize: '0.875rem' }}>
                    {validationError}
                  </div>
                )}
                <Button
                  onClick={handleCreateComment}
                  variant="primary"
                >
                  Add Comment
                </Button>
              </div>

              {/* Comments List */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                  Existing Comments
                </h3>
                {outcomeComments.length === 0
                  ? (
                      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#6B7280' }}>No outcome comments found</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#9CA3AF' }}>
                          Be the first to add an outcome comment.
                        </p>
                      </div>
                    )
                  : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {outcomeComments.map((comment) => (
                      <div key={comment.id} style={{ padding: '1.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={3}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    marginBottom: '1rem',
                                  }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                  <div style={{ flex: 1 }}>
                                    <label htmlFor={`edit-lower-${comment.id}`} style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                      Lower Range:
                                    </label>
                                    <input
                                      id={`edit-lower-${comment.id}`}
                                      type="number"
                                      value={editLowerRange}
                                      onChange={(e) => setEditLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '1rem',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <label htmlFor={`edit-upper-${comment.id}`} style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                      Upper Range:
                                    </label>
                                    <input
                                      id={`edit-upper-${comment.id}`}
                                      type="number"
                                      value={editUpperRange}
                                      onChange={(e) => setEditUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
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
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                            /* View Mode */
                              <div>
                            <div style={{ fontSize: '1rem', color: '#111827', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                              {comment.comment}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                              Score Range: {comment.lowerRange} - {comment.upperRange}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1rem' }}>
                              {formatDate(comment.createdAt)}
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
