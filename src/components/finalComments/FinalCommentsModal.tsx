/**
 * FinalCommentsModal Component
 * TDD Phase: GREEN - Implementing minimal modal to pass tests
 *
 * Modal for viewing, creating, editing, and deleting final comments for a class.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: number; name: string } - Supports Class type
 *
 * User Stories:
 * - US-FINAL-001: Access Final Comments Management (Modal opens from button)
 * - US-FINAL-002: View list of final comments (Coming in next phase)
 * - US-FINAL-003: Create new final comment (Coming in next phase)
 * - US-FINAL-004: Edit existing final comment (Post-MVP)
 * - US-FINAL-005: Delete final comment (Post-MVP)
 * - US-FINAL-006: Close modal (Close button implemented)
 */

import type { FinalComment, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../../types'
import { Button } from '../common/Button'

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
}: FinalCommentsModalProps<T>) => {
  if (!isOpen) return null

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
          {/* US-FINAL-002 and US-FINAL-003: Content will be added in next phase */}
          <p>Final Comments feature coming soon...</p>
        </div>
      </div>
    </div>
  )
}
