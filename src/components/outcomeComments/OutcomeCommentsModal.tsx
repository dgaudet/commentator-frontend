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
import { modalStyles } from '../../styles/modalStyles'

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
  onClose: _onClose,
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
        aria-label="Outcome Comments"
        style={modalStyles.container}
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
              <div style={modalStyles.section}>
                <h3 style={modalStyles.heading}>
                  Add New Outcome Comment
                </h3>
                <div style={modalStyles.formGroup}>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Enter outcome comment..."
                    aria-label="Add new outcome comment"
                    rows={3}
                    style={modalStyles.textarea}
                  />
                </div>
                <div style={modalStyles.flexRow}>
                  <div style={modalStyles.flexItem}>
                    <label htmlFor="lower-range" style={modalStyles.label}>
                      Lower Range:
                    </label>
                    <input
                      id="lower-range"
                      type="number"
                      value={newLowerRange}
                      onChange={(e) => setNewLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Min score"
                      style={modalStyles.input}
                    />
                  </div>
                  <div style={modalStyles.flexItem}>
                    <label htmlFor="upper-range" style={modalStyles.label}>
                      Upper Range:
                    </label>
                    <input
                      id="upper-range"
                      type="number"
                      value={newUpperRange}
                      onChange={(e) => setNewUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Max score"
                      style={modalStyles.input}
                    />
                  </div>
                </div>
                {validationError && (
                  <div role="alert" style={modalStyles.validationError}>
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
              <div style={modalStyles.section}>
                <h3 style={modalStyles.heading}>
                  Existing Comments
                </h3>
                {outcomeComments.length === 0
                  ? (
                      <div style={modalStyles.emptyState}>
                        <p style={modalStyles.emptyStateText}>No outcome comments found</p>
                        <p style={modalStyles.emptyStateSubtext}>
                          Be the first to add an outcome comment.
                        </p>
                      </div>
                    )
                  : (
                  <div style={modalStyles.itemsList}>
                    {outcomeComments.map((comment) => (
                      <div key={comment.id} style={modalStyles.itemCard}>
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={3}
                                  style={{ ...modalStyles.textarea, marginBottom: '1rem' }}
                                />
                                <div style={modalStyles.flexRow}>
                                  <div style={modalStyles.flexItem}>
                                    <label htmlFor={`edit-lower-${comment.id}`} style={modalStyles.label}>
                                      Lower Range:
                                    </label>
                                    <input
                                      id={`edit-lower-${comment.id}`}
                                      type="number"
                                      value={editLowerRange}
                                      onChange={(e) => setEditLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      style={modalStyles.input}
                                    />
                                  </div>
                                  <div style={modalStyles.flexItem}>
                                    <label htmlFor={`edit-upper-${comment.id}`} style={modalStyles.label}>
                                      Upper Range:
                                    </label>
                                    <input
                                      id={`edit-upper-${comment.id}`}
                                      type="number"
                                      value={editUpperRange}
                                      onChange={(e) => setEditUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      style={modalStyles.input}
                                    />
                                  </div>
                                </div>
                                <div style={modalStyles.buttonGroup}>
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
                            <div style={modalStyles.itemContent}>
                              {comment.comment}
                            </div>
                            <div style={modalStyles.itemMetaMedium}>
                              Score Range: {comment.lowerRange} - {comment.upperRange}
                            </div>
                            <div style={modalStyles.itemMeta}>
                              {formatDate(comment.createdAt)}
                            </div>
                            <div style={modalStyles.buttonGroup}>
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
