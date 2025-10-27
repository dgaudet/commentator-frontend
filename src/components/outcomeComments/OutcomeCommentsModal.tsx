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
 * 4. Delete outcome comment with confirmation
 *
 * Related: TD-001 (OutcomeCommentsModal Subject Type Compatibility)
 */

import { useState } from 'react'
import type { OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmDialog } from '../common/ConfirmDialog'

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
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

  const handleDeleteStart = (id: number) => {
    setDeleteConfirmId(id)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await onDeleteComment(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

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
            Outcome Comments - {entityData.name}
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
              <div className="create-comment-section">
                <h3>Add New Outcome Comment</h3>
                <div className="form-group">
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Enter outcome comment..."
                    aria-label="Add new outcome comment"
                    className="comment-textarea"
                    rows={3}
                  />
                </div>
                <div className="score-range-inputs">
                  <div className="form-group">
                    <label htmlFor="lower-range">Lower Range:</label>
                    <input
                      id="lower-range"
                      type="number"
                      value={newLowerRange}
                      onChange={(e) => setNewLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Min score"
                      className="range-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="upper-range">Upper Range:</label>
                    <input
                      id="upper-range"
                      type="number"
                      value={newUpperRange}
                      onChange={(e) => setNewUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Max score"
                      className="range-input"
                    />
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
                >
                  Add Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="comments-list">
                <h3>Existing Comments</h3>
                {outcomeComments.length === 0
                  ? (
                      <div className="empty-state">
                        <p>No outcome comments found</p>
                        <p className="empty-subtext">
                          Be the first to add an outcome comment.
                        </p>
                      </div>
                    )
                  : (
                  <div className="comments">
                    {outcomeComments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        {editingId === comment.id
                          ? (
                            /* Edit Mode */
                              <div className="edit-mode">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="comment-textarea"
                                  rows={3}
                                />
                                <div className="score-range-inputs">
                                  <div className="form-group">
                                    <label htmlFor={`edit-lower-${comment.id}`}>Lower Range:</label>
                                    <input
                                      id={`edit-lower-${comment.id}`}
                                      type="number"
                                      value={editLowerRange}
                                      onChange={(e) => setEditLowerRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      className="range-input"
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor={`edit-upper-${comment.id}`}>Upper Range:</label>
                                    <input
                                      id={`edit-upper-${comment.id}`}
                                      type="number"
                                      value={editUpperRange}
                                      onChange={(e) => setEditUpperRange(e.target.value === '' ? '' : Number(e.target.value))}
                                      className="range-input"
                                    />
                                  </div>
                                </div>
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
                            /* View Mode */
                              <div className="view-mode">
                            <div className="comment-content">
                              {comment.comment}
                            </div>
                            <div className="score-range">
                              Score Range: {comment.lowerRange} - {comment.upperRange}
                            </div>
                            <div className="comment-meta">
                              <span className="comment-date">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <div className="comment-actions">
                              <Button
                                onClick={() => handleEditStart(comment)}
                                variant="secondary"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteStart(comment.id)}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="Delete Outcome Comment"
        message="Are you sure you want to delete this outcome comment? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
