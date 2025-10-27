/**
 * FinalCommentsModal Component
 * TDD Phase: GREEN - Implementing list view to pass tests
 *
 * Modal for viewing, creating, editing, and deleting final comments for a class.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports Class type
 *
 * User Stories:
 * - US-FINAL-001: Access Final Comments Management ✅
 * - US-FINAL-002: View list of final comments (In Progress)
 * - US-FINAL-003: Create new final comment (Coming in next phase)
 * - US-FINAL-004: Edit existing final comment (Post-MVP)
 * - US-FINAL-005: Delete final comment (Post-MVP)
 * - US-FINAL-006: Close modal ✅
 */

import type { FinalComment, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../../types'
import { Button } from '../common/Button'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'

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
  loading,
  error,
}: FinalCommentsModalProps<T>) => {
  if (!isOpen) return null

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

              {/* US-FINAL-003: Create form will be added in next phase */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
