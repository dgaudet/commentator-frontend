/**
 * OutcomeCommentsModal Component
 * 
 * Modal for viewing, creating, editing, and deleting outcome comments for a class.
 * Implements CRUD operations with proper form validation and accessibility.
 * 
 * User Stories:
 * 1. View all outcome comments for a class
 * 2. Create new outcome comment for a class  
 * 3. Edit existing outcome comment
 * 4. Delete outcome comment with confirmation
 */

import React, { useState } from 'react'
import type { Class, OutcomeComment, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest } from '../../types'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmDialog } from '../common/ConfirmDialog'

interface OutcomeCommentsModalProps {
  isOpen: boolean
  onClose: () => void
  classData: Class
  outcomeComments: OutcomeComment[]
  onCreateComment: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateComment: (id: number, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteComment: (id: number) => Promise<void>
  loading: boolean
  error: string | null
}

export const OutcomeCommentsModal: React.FC<OutcomeCommentsModalProps> = ({
  isOpen,
  onClose,
  classData,
  outcomeComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  loading,
  error
}) => {
  const [newCommentContent, setNewCommentContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  const handleCreateComment = async () => {
    if (!newCommentContent.trim()) {
      setValidationError('Comment content is required')
      return
    }

    setValidationError('')
    await onCreateComment({
      classId: classData.id,
      content: newCommentContent.trim()
    })
    setNewCommentContent('')
  }

  const handleEditStart = (comment: OutcomeComment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleEditSave = async () => {
    if (editingId && editContent.trim()) {
      await onUpdateComment(editingId, {
        content: editContent.trim()
      })
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditContent('')
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
            Outcome Comments - {classData.name}
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
                  {validationError && (
                    <div className="validation-error" role="alert">
                      {validationError}
                    </div>
                  )}
                </div>
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
                {outcomeComments.length === 0 ? (
                  <div className="empty-state">
                    <p>No outcome comments found</p>
                    <p className="empty-subtext">
                      Be the first to add an outcome comment for this class.
                    </p>
                  </div>
                ) : (
                  <div className="comments">
                    {outcomeComments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        {editingId === comment.id ? (
                          /* Edit Mode */
                          <div className="edit-mode">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="comment-textarea"
                              rows={3}
                            />
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
                        ) : (
                          /* View Mode */
                          <div className="view-mode">
                            <div className="comment-content">
                              {comment.content}
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