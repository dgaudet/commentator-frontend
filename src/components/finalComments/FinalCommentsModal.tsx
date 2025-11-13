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
 * - US-FINAL-001 (FCOI): Display Outcome Comment by Grade ✅
 * - US-FINAL-002 (FCOI): Read-Only Styling ✅
 * - US-FINAL-003 (FCOI): Loading and Error States ✅
 *
 * US-DELETE-CONFIRM-004 Features:
 * - Uses standardized ConfirmationModal component
 * - Shows student name (firstName + lastName) in preview
 * - Shows class name and year for context
 * - Enhanced confirmation UX with detailed preview
 *
 * FCOI-001 Features (Final Comment Outcome Integration):
 * - Auto-populates outcome comments based on grade input
 * - Read-only outcome comment display field
 * - Positioned below grade input, above comment textarea
 * - Debounced grade matching (300ms)
 * - Loading and error states for outcome comment fetching
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import type {
  FinalComment,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
  OutcomeComment,
  Class,
} from '../../types'
import { useOutcomeComments } from '../../hooks/useOutcomeComments'
import { usePersonalizedComments } from '../../hooks/usePersonalizedComments'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { TypeaheadSearch } from '../common/TypeaheadSearch'
import { colors, spacing, typography, borders } from '../../theme/tokens'

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

  // US-PC-TYPEAHEAD-003: Personalized comment search state (Add form)
  const [personalizedCommentSearch, setPersonalizedCommentSearch] = useState('')

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

  // US-PC-TYPEAHEAD-004: Personalized comment search state (Edit form)
  const [editPersonalizedCommentSearch, setEditPersonalizedCommentSearch] = useState('')

  // FCOI-001: Outcome comment integration state (create mode)
  const [matchedOutcomeComment, setMatchedOutcomeComment] = useState<string>('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // FCOI-001: Outcome comment integration state (edit mode)
  const [editMatchedOutcomeComment, setEditMatchedOutcomeComment] = useState<string>('')
  const editDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // FCOI-001: Use outcome comments hook
  const {
    outcomeComments,
    loading: outcomeCommentsLoading,
    error: outcomeCommentsError,
    loadOutcomeComments,
  } = useOutcomeComments()

  // US-PC-TYPEAHEAD-002: Use personalized comments hook
  // US-PC-TYPEAHEAD-003: Now used in Add form TypeaheadSearch component
  const {
    personalizedComments,
    loading: personalizedCommentsLoading,
    error: personalizedCommentsError,
    loadPersonalizedComments,
  } = usePersonalizedComments()

  /**
   * FCOI-001: Load outcome comments when component mounts
   * Fetches outcome comments for the selected class's subject
   * Only loads if entityData has a subjectId property (type guard)
   */
  useEffect(() => {
    if (entityData && 'subjectId' in entityData) {
      const classEntity = entityData as unknown as Class
      loadOutcomeComments(classEntity.subjectId)
    }
  }, [entityData, loadOutcomeComments])

  /**
   * US-PC-TYPEAHEAD-002: Load personalized comments when component mounts
   * Fetches personalized comments for the selected class's subject
   * Only loads if entityData has a subjectId property (type guard)
   */
  useEffect(() => {
    if (entityData && 'subjectId' in entityData) {
      const classEntity = entityData as unknown as Class
      loadPersonalizedComments(classEntity.subjectId)
    }
  }, [entityData, loadPersonalizedComments])

  /**
   * US-PC-TYPEAHEAD-003/004: Clear search states and editing mode when modal closes
   * Prevents search queries and editing state from persisting across modal open/close cycles
   * Improves UX by ensuring a clean state each time the modal opens
   */
  useEffect(() => {
    if (!isOpen) {
      setPersonalizedCommentSearch('')
      setEditPersonalizedCommentSearch('')
      // Also clear editing state to return to list view
      setEditingId(null)
    }
  }, [isOpen])

  /**
   * FCOI-001: Memoized outcome comment matcher
   * Finds the outcome comment that matches the current grade range
   * Returns the matching comment text or null if no match found
   *
   * @performance Memoized to avoid recalculation on every render
   */
  const matchedComment = useMemo(() => {
    if (grade === '' || outcomeComments.length === 0) {
      return null
    }

    const gradeNum = Number(grade)
    return outcomeComments.find(
      (comment: OutcomeComment) =>
        comment.lowerRange <= gradeNum && gradeNum <= comment.upperRange,
    )
  }, [grade, outcomeComments])

  /**
   * FCOI-001: Debounced grade matching effect
   * Updates the displayed outcome comment when grade changes
   * Uses 300ms debounce to avoid excessive updates during typing
   *
   * @performance Debounced with useRef to prevent memory leaks
   * @accessibility Announces changes to screen readers via state update
   */
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Clear outcome comment if grade is empty
    if (grade === '') {
      setMatchedOutcomeComment('')
      return
    }

    // Debounce grade input to avoid excessive updates (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      if (outcomeComments.length === 0) {
        setMatchedOutcomeComment('No outcome comment for this subject with this grade level.')
        return
      }

      if (matchedComment) {
        setMatchedOutcomeComment(matchedComment.comment)
      } else {
        setMatchedOutcomeComment('No outcome comment for this subject with this grade level.')
      }
    }, 300)

    // Cleanup: Clear timeout on unmount or when dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [grade, outcomeComments, matchedComment])

  /**
   * FCOI-001: Memoized outcome comment matcher for EDIT mode
   * Finds the outcome comment that matches the edit grade range
   * Returns the matching comment text or null if no match found
   *
   * @performance Memoized to avoid recalculation on every render
   */
  const editMatchedComment = useMemo(() => {
    if (editGrade === '' || outcomeComments.length === 0) {
      return null
    }

    const gradeNum = Number(editGrade)
    return outcomeComments.find(
      (comment: OutcomeComment) =>
        comment.lowerRange <= gradeNum && gradeNum <= comment.upperRange,
    )
  }, [editGrade, outcomeComments])

  /**
   * FCOI-001: Debounced grade matching effect for EDIT mode
   * Updates the displayed outcome comment when edit grade changes
   * Uses 300ms debounce to avoid excessive updates during typing
   *
   * @performance Debounced with useRef to prevent memory leaks
   * @accessibility Announces changes to screen readers via state update
   */
  useEffect(() => {
    // Clear any existing timer
    if (editDebounceTimerRef.current) {
      clearTimeout(editDebounceTimerRef.current)
    }

    // Clear outcome comment if edit grade is empty
    if (editGrade === '') {
      setEditMatchedOutcomeComment('')
      return
    }

    // Debounce edit grade input to avoid excessive updates (300ms delay)
    editDebounceTimerRef.current = setTimeout(() => {
      if (outcomeComments.length === 0) {
        setEditMatchedOutcomeComment('No outcome comment for this subject with this grade level.')
        return
      }

      if (editMatchedComment) {
        setEditMatchedOutcomeComment(editMatchedComment.comment)
      } else {
        setEditMatchedOutcomeComment('No outcome comment for this subject with this grade level.')
      }
    }, 300)

    // Cleanup: Clear timeout on unmount or when dependencies change
    return () => {
      if (editDebounceTimerRef.current) {
        clearTimeout(editDebounceTimerRef.current)
      }
    }
  }, [editGrade, outcomeComments, editMatchedComment])

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
      // US-PC-TYPEAHEAD-003: Clear personalized comment search
      setPersonalizedCommentSearch('')
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
      // US-PC-TYPEAHEAD-004: Clear personalized comment search (Edit form)
      setEditPersonalizedCommentSearch('')
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
    // US-PC-TYPEAHEAD-004: Clear personalized comment search (Edit form)
    setEditPersonalizedCommentSearch('')
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
              {/* US-CSS-006: Refactored to use standardized Input component and design tokens */}
              <div style={{ marginBottom: spacing['2xl'] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Add New Final Comment
                </h3>
                <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.lg }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      id="first-name-input"
                      label="First Name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter student first name"
                      disabled={submitting}
                      error={validationError && !firstName}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <Input
                      id="last-name-input"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter student last name (optional)"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <Input
                  id="grade-input"
                  label="Grade"
                  type="number"
                  required
                  value={grade}
                  onChange={(e) => {
                    const value = e.target.value
                    setGrade(value === '' ? '' : Number(value))
                  }}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  disabled={submitting}
                  error={validationError && grade === ''}
                />

                {/* FCOI-001: Outcome Comment Display (READ-ONLY) */}
                <div style={{ marginBottom: spacing.lg }}>
                  <label
                    htmlFor="outcome-comment-display"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.text.secondary,
                    }}
                  >
                    Outcome Comment by Grade
                  </label>

                  {outcomeCommentsLoading && (
                    <div style={{ padding: spacing.md }}>
                      <LoadingSpinner data-testid="loading-spinner" />
                    </div>
                  )}

                  {!outcomeCommentsLoading && (
                    <textarea
                      id="outcome-comment-display"
                      aria-label="Outcome Comment by Grade"
                      value={matchedOutcomeComment}
                      readOnly
                      rows={3}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        fontSize: typography.fontSize.base,
                        border: `${borders.width.thin} solid ${colors.border.default}`,
                        borderRadius: borders.radius.md,
                        backgroundColor: colors.background.secondary,
                        color:
                          matchedOutcomeComment === 'No outcome comment for this subject with this grade level.'
                            ? colors.text.disabled
                            : colors.text.secondary,
                        resize: 'none',
                        cursor: 'default',
                      }}
                    />
                  )}

                  {outcomeCommentsError && (
                    <div
                      style={{
                        marginTop: spacing.sm,
                        fontSize: typography.fontSize.sm,
                        color: colors.semantic.error,
                      }}
                    >
                      Failed to load outcome comment. {outcomeCommentsError}
                    </div>
                  )}
                </div>

                {/* US-PC-TYPEAHEAD-003: Personalized Comment Search */}
                <TypeaheadSearch
                  items={personalizedComments}
                  getItemLabel={(comment) => comment.comment}
                  getItemKey={(comment) => comment.id}
                  searchQuery={personalizedCommentSearch}
                  onSearchChange={setPersonalizedCommentSearch}
                  onSelect={(selectedComment) => {
                    setComment(selectedComment.comment)
                    setPersonalizedCommentSearch('')
                  }}
                  label="Personalized Comment (Optional)"
                  placeholder="Search personalized comments..."
                  emptyMessage="No personalized comments available for this subject"
                  loading={personalizedCommentsLoading}
                  error={personalizedCommentsError}
                  disabled={submitting}
                />

                <div style={{ marginBottom: spacing.lg }}>
                  <label
                    htmlFor="comment-input"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.text.secondary,
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
                      padding: spacing.md,
                      fontSize: typography.fontSize.base,
                      border: `${borders.width.thin} solid ${colors.border.default}`,
                      borderRadius: borders.radius.md,
                      resize: 'vertical',
                    }}
                  />
                  <div
                    className="character-counter"
                    style={{
                      marginTop: spacing.sm,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
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

              {/* US-FC-STYLE-001: Existing Comments Section with Header */}
              <div style={{ marginBottom: spacing['2xl'] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Existing Comments
                </h3>

                {/* Empty State (AC 3) - US-FC-STYLE-004 */}
                {sortedComments.length === 0
                  ? (
                      <div
                        style={{
                          textAlign: 'center' as const,
                          padding: spacing['2xl'],
                          backgroundColor: colors.neutral[50],
                          borderRadius: borders.radius.md,
                          border: `${borders.width.thin} dashed ${colors.border.default}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: typography.fontSize.base,
                            color: colors.text.tertiary,
                          }}
                        >
                          No final comments yet for this class.
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: colors.text.disabled,
                          }}
                        >
                          Add your first student grade!
                        </p>
                      </div>
                    )
                  : (
                    /* List Display (AC 1, 2, 7) - US-FC-STYLE-002 & US-FC-STYLE-003 */
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
                              border: `${borders.width.thin} solid ${colors.border.default}`,
                              borderRadius: borders.radius.md,
                              backgroundColor: colors.background.primary,
                            }}
                          >
                            {editingId === comment.id
                              ? (
                                /* Edit Form - US-FINAL-004 */
                                /* US-CSS-006: Refactored to use standardized Input component and design tokens */
                                  <div className="edit-form">
                                    <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.lg }}>
                                      <div style={{ flex: 1 }}>
                                        <Input
                                          id={`edit-first-name-${comment.id}`}
                                          label="First Name"
                                          required
                                          value={editFirstName}
                                          onChange={(e) => setEditFirstName(e.target.value)}
                                          placeholder="Enter student first name"
                                          error={editValidationError && !editFirstName}
                                        />
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <Input
                                          id={`edit-last-name-${comment.id}`}
                                          label="Last Name"
                                          value={editLastName}
                                          onChange={(e) => setEditLastName(e.target.value)}
                                          placeholder="Enter student last name (optional)"
                                        />
                                      </div>
                                    </div>

                                    <Input
                                      id={`edit-grade-${comment.id}`}
                                      label="Grade"
                                      type="number"
                                      required
                                      value={editGrade}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        setEditGrade(value === '' ? '' : Number(value))
                                      }}
                                      placeholder="0-100"
                                      min={0}
                                      max={100}
                                      error={editValidationError && editGrade === ''}
                                    />

                                    {/* FCOI-001: Outcome Comment Display (READ-ONLY) - EDIT MODE */}
                                    <div style={{ marginBottom: spacing.lg }}>
                                      <label
                                        htmlFor={`edit-outcome-comment-display-${comment.id}`}
                                        style={{
                                          display: 'block',
                                          marginBottom: spacing.sm,
                                          fontSize: typography.fontSize.sm,
                                          fontWeight: typography.fontWeight.medium,
                                          color: colors.text.secondary,
                                        }}
                                      >
                                        Outcome Comment by Grade (Edit)
                                      </label>

                                      {outcomeCommentsLoading && (
                                        <div style={{ padding: spacing.md }}>
                                          <LoadingSpinner data-testid="loading-spinner" />
                                        </div>
                                      )}

                                      {!outcomeCommentsLoading && (
                                        <textarea
                                          id={`edit-outcome-comment-display-${comment.id}`}
                                          aria-label="Outcome Comment by Grade (Edit)"
                                          value={editMatchedOutcomeComment}
                                          readOnly
                                          rows={3}
                                          style={{
                                            width: '100%',
                                            padding: spacing.md,
                                            fontSize: typography.fontSize.base,
                                            border: `${borders.width.thin} solid ${colors.border.default}`,
                                            borderRadius: borders.radius.md,
                                            backgroundColor: colors.background.secondary,
                                            color:
                                              editMatchedOutcomeComment === 'No outcome comment for this subject with this grade level.'
                                                ? colors.text.disabled
                                                : colors.text.secondary,
                                            resize: 'none',
                                            cursor: 'default',
                                          }}
                                        />
                                      )}

                                      {outcomeCommentsError && (
                                        <div
                                          style={{
                                            marginTop: spacing.sm,
                                            fontSize: typography.fontSize.sm,
                                            color: colors.semantic.error,
                                          }}
                                        >
                                          Failed to load outcome comment. {outcomeCommentsError}
                                        </div>
                                      )}
                                    </div>

                                    {/* US-PC-TYPEAHEAD-004: Personalized Comment Search (Edit Form) */}
                                    <TypeaheadSearch
                                      items={personalizedComments}
                                      getItemLabel={(personalizedComment) => personalizedComment.comment}
                                      getItemKey={(personalizedComment) => personalizedComment.id}
                                      searchQuery={editPersonalizedCommentSearch}
                                      onSearchChange={setEditPersonalizedCommentSearch}
                                      onSelect={(selectedComment) => {
                                        setEditComment(selectedComment.comment)
                                        setEditPersonalizedCommentSearch('')
                                      }}
                                      label="Personalized Comment (Optional)"
                                      placeholder="Search personalized comments..."
                                      emptyMessage="No personalized comments available for this subject"
                                      loading={personalizedCommentsLoading}
                                      error={personalizedCommentsError}
                                      disabled={submitting}
                                    />

                                    <div style={{ marginBottom: spacing.lg }}>
                                      <label
                                        htmlFor={`edit-comment-${comment.id}`}
                                        style={{
                                          display: 'block',
                                          marginBottom: spacing.sm,
                                          fontSize: typography.fontSize.sm,
                                          fontWeight: typography.fontWeight.medium,
                                          color: colors.text.secondary,
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
                                          padding: spacing.md,
                                          fontSize: typography.fontSize.base,
                                          border: `${borders.width.thin} solid ${colors.border.default}`,
                                          borderRadius: borders.radius.md,
                                          resize: 'vertical',
                                        }}
                                      />
                                      <div
                                        className="character-counter"
                                        style={{
                                          marginTop: spacing.sm,
                                          fontSize: typography.fontSize.sm,
                                          color: colors.text.tertiary,
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

                                    {/* Edit Action Buttons - Matches OutcomeComments pattern */}
                                    <div style={{ display: 'flex', gap: spacing.sm }}>
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
                                /* Display View - Matches OutcomeComments visual hierarchy */
                                  <div>
                                    {/* Student Name and Date - Primary heading with date on right */}
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: spacing.md,
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: typography.fontSize.base,
                                          fontWeight: typography.fontWeight.semibold,
                                          color: colors.text.primary,
                                          lineHeight: typography.lineHeight.normal,
                                        }}
                                      >
                                        {comment.firstName}
                                        {comment.lastName ? ` ${comment.lastName}` : ''}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: typography.fontSize.xs,
                                          color: colors.text.disabled,
                                        }}
                                      >
                                        Created: {formatDate(comment.createdAt)}
                                      </div>
                                    </div>

                                    {/* Grade - Secondary info */}
                                    <div
                                      style={{
                                        fontSize: typography.fontSize.sm,
                                        color: colors.text.tertiary,
                                        marginBottom: spacing.md,
                                      }}
                                    >
                                      Grade: {comment.grade}
                                    </div>

                                    {/* Optional Comment Text */}
                                    {comment.comment && (
                                      <div
                                        style={{
                                          fontSize: typography.fontSize.sm,
                                          color: colors.text.secondary,
                                          marginBottom: spacing.lg,
                                          lineHeight: typography.lineHeight.relaxed,
                                        }}
                                      >
                                        {comment.comment}
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: spacing.sm }}>
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
