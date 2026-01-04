/**
 * FinalCommentsModal Component
 *
 * Modal for viewing, creating, editing, and deleting final comments for a class.
 * Implements CRUD operations with proper form validation and accessibility.
 *
 * Generic Type Parameter:
 * - T extends { id: string; name: string } - Supports Class type
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
 *
 * US-FC-REFACTOR-002 & 003 Features (Populate Button Integration):
 * - Typeahead search for personalized comments (optional selection)
 * - "Populate with Above Comments" button to auto-fill final comment
 * - Combines outcome comment (based on grade) + personalized comment
 * - Intelligent concatenation: outcome first, personal second, space separator
 * - Overwrite confirmation when final comment textarea already has text
 * - Auto-focus on textarea after population for immediate editing
 * - Persistent selected personal comment display (US-FC-REFACTOR-002)
 * - Validation: Button disabled when no comments selected
 * - Edge cases: Whitespace trimming, 1000 char truncation, special char preservation
 * - Full keyboard accessibility and screen reader support
 */

import { useState, useEffect, useRef } from 'react'
import type {
  FinalComment,
  CreateFinalCommentRequest,
  UpdateFinalCommentRequest,
  Class,
  PersonalizedComment,
} from '../../types'
import { useOutcomeComments } from '../../hooks/useOutcomeComments'
import { usePersonalizedComments } from '../../hooks/usePersonalizedComments'
import { useFinalCommentForm } from '../../hooks/useFinalCommentForm'
import { usePronounsQuery } from '../../hooks/usePronounsQuery'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { TypeaheadSearch } from '../common/TypeaheadSearch'
import { PronounSelect } from '../common/PronounSelect'
import { PronounDisplay } from './PronounDisplay'
import { SelectedCommentsList } from './SelectedCommentsList'
import { CopyButton } from '../common/CopyButton'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusShadows } from '../../hooks/useThemeFocusShadows'
import { replacePlaceholders, type StudentData } from '../../utils/placeholders'
import { getRatingEmoji, getNormalizedRating, sortPersonalizedCommentsByRating } from '../../utils/personalizedCommentRating'

interface FinalCommentsModalProps<T extends { id: string; name: string }> {
  isOpen: boolean
  entityData: T
  finalComments: FinalComment[]
  onCreateComment: (request: CreateFinalCommentRequest) => Promise<void>
  onUpdateComment: (id: string, request: UpdateFinalCommentRequest) => Promise<void>
  onDeleteComment: (id: string) => Promise<void>
  loading: boolean
  error: string | null
  embedded?: boolean // US-CLASS-TABS-003: Support embedded mode (no modal chrome)
}

export const FinalCommentsModal = <T extends { id: string; name: string }>({
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
  const themeColors = useThemeColors()
  const focusShadows = useThemeFocusShadows()
  const { pronouns } = usePronounsQuery()

  // US-FC-REFACTOR-001: Shared hook state management
  const [submitting, setSubmitting] = useState(false)

  // Delete confirmation state (US-DELETE-CONFIRM-004)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    commentId: string | null
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
  const [editingId, setEditingId] = useState<string | null>(null)

  // US-FC-REFACTOR-003: Populate button confirmation state
  const [populateConfirmation, setPopulateConfirmation] = useState<{
    isOpen: boolean
    formType: 'add' | 'edit'
  }>({
    isOpen: false,
    formType: 'add',
  })

  // US-FC-REFACTOR-003: Refs for focus management after populate
  const addCommentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const editCommentTextareaRef = useRef<HTMLTextAreaElement>(null)

  // US-RATING-006: Track ordered selected comments for display
  const [orderedAddComments, setOrderedAddComments] = useState<PersonalizedComment[]>([])
  const [orderedEditComments, setOrderedEditComments] = useState<PersonalizedComment[]>([])

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

  // US-FC-REFACTOR-001: Add form hook (shared logic extraction)
  const addForm = useFinalCommentForm(outcomeComments)

  // US-FC-REFACTOR-001: Edit form hook (shared logic extraction)
  const editForm = useFinalCommentForm(outcomeComments)

  // TASK-1.3: Pronoun selection state for add form
  const [addPronounId, setAddPronounId] = useState('')

  // TASK-1.3: Pronoun selection state for edit form
  const [editPronounId, setEditPronounId] = useState('')

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
   * US-FC-REFACTOR-001: Clear form states and editing mode when modal closes
   * US-FC-REFACTOR-003: Also clear selected personal comments
   * TASK-1.3: Also clear pronoun selections
   * Prevents state from persisting across modal open/close cycles
   * Improves UX by ensuring a clean state each time the modal opens
   */
  useEffect(() => {
    if (!isOpen) {
      addForm.reset()
      editForm.reset()
      setEditingId(null)
      setAddPronounId('')
      setEditPronounId('')
      // US-RATING-006: Clear ordered comments state
      setOrderedAddComments([])
      setOrderedEditComments([])
    }
  }, [isOpen, addForm, editForm])

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

  // Focus/Blur handlers for comment textarea - match Input component styling
  const handleCommentFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const focusColor = themeColors.primary.main
    const focusShadowColor = focusShadows.primary

    e.currentTarget.style.borderColor = focusColor
    e.currentTarget.style.boxShadow = `0 0 0 3px ${focusShadowColor}`
  }

  const handleCommentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = themeColors.border.default
    e.currentTarget.style.boxShadow = 'none'
  }

  // US-FC-REFACTOR-001: Handle create final comment using hook
  const handleCreateComment = async () => {
    const error = addForm.validate()
    if (error) {
      addForm.setValidationError(error)
      return
    }

    addForm.clearValidationError()
    setSubmitting(true)

    try {
      const request: CreateFinalCommentRequest = {
        classId: entityData.id,
        firstName: addForm.firstName.trim(),
        grade: Number(addForm.grade),
      }

      // Add optional fields only if provided
      if (addForm.lastName.trim()) {
        request.lastName = addForm.lastName.trim()
      }
      if (addForm.comment.trim()) {
        request.comment = addForm.comment.trim()
      }
      // TASK-1.3: Add pronoun ID if selected
      if (addPronounId) {
        request.pronounId = addPronounId
      }

      await onCreateComment(request)

      // Clear form on success
      addForm.reset()
      setAddPronounId('')
      // US-RATING-006: Clear ordered comments state
      setOrderedAddComments([])
    } catch (err) {
      addForm.setValidationError('Failed to add final comment. Please try again.')
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
        addForm.setValidationError('Failed to delete final comment. Please try again.')
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

  /**
   * US-RATING-006: Handle reordering of selected comments
   * Swaps two items in the ordered list
   */
  const handleReorder = (formType: 'add' | 'edit', fromIndex: number, toIndex: number) => {
    const orderedComments = formType === 'add' ? orderedAddComments : orderedEditComments
    const setOrderedComments = formType === 'add' ? setOrderedAddComments : setOrderedEditComments

    const newOrder = [...orderedComments]
    const [movedItem] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedItem)
    setOrderedComments(newOrder)
  }

  /**
   * US-RATING-006: Handle removal of a selected comment
   * Removes from ordered list by index (supports duplicates)
   */
  const handleRemove = (formType: 'add' | 'edit', index: number) => {
    if (formType === 'add') {
      setOrderedAddComments(comments => comments.filter((_, i) => i !== index))
    } else {
      setOrderedEditComments(comments => comments.filter((_, i) => i !== index))
    }
  }

  /**
   * US-FC-REFACTOR-003: Handle "Populate with Above Comments" button click
   *
   * Initiates the populate action for the final comment textarea by combining:
   * - Outcome comment (if grade entered and matching range found)
   * - Personalized comment (if selected from typeahead)
   *
   * Behavior:
   * - If textarea is empty: Populates immediately
   * - If textarea has content: Shows overwrite confirmation dialog
   *
   * @param formType - Whether this is for 'add' or 'edit' form
   *
   * @example
   * // User enters grade 95, selects personal comment, clicks populate button
   * handlePopulateClick('add')
   * // Result: Combines "Excellent understanding" + "Great effort this semester"
   *
   * @see handlePopulateConfirm For the actual population logic
   * @see handlePopulateCancel For canceling the overwrite confirmation
   */
  const handlePopulateClick = (formType: 'add' | 'edit') => {
    const form = formType === 'add' ? addForm : editForm

    // Check if comment textarea already has text
    if (form.comment.trim().length > 0) {
      // Show confirmation dialog
      setPopulateConfirmation({
        isOpen: true,
        formType,
      })
    } else {
      // Populate immediately if empty
      handlePopulateConfirm(formType)
    }
  }

  /**
   * US-FC-REFACTOR-003 & 004: Handle populate confirmation and execute population
   * US-PLACEHOLDER-004: Apply dynamic placeholder replacement
   *
   * Core logic for populating the final comment textarea with intelligent text combination:
   *
   * Processing Steps:
   * 1. Trim whitespace from outcome and personal comments (US-FC-REFACTOR-004)
   * 2. Replace placeholders with student data (US-PLACEHOLDER-004)
   * 3. Skip empty strings after trimming
   * 4. Concatenate with single space separator: "[outcome] [personal]"
   * 5. Truncate to 1000 characters if exceeded (textarea maxlength constraint)
   * 6. Set textarea value
   * 7. Auto-focus textarea for immediate editing
   *
   * Edge Cases Handled:
   * - Whitespace-only comments (skipped after trim)
   * - Missing outcome comment (grade outside range or no grade)
   * - Missing personal comment (not selected)
   * - Combined text exceeding 1000 chars (truncated)
   * - Special characters and Unicode (preserved)
   * - Placeholders in comments (replaced with actual student data)
   *
   * @param formType - Optional form type override (defaults to populateConfirmation.formType)
   *                   Used when called directly from handlePopulateClick (no confirmation needed)
   *
   * @example
   * // Outcome: "Shows strong understanding" (26 chars)
   * // Personal: "Excellent participation this semester" (38 chars)
   * // Result: "Shows strong understanding Excellent participation this semester" (65 chars = 26 + 1 + 38)
   *
   * @example
   * // US-PLACEHOLDER-004: Placeholder replacement
   * // Outcome: "<first name> earned <grade> points"
   * // Student data: { firstName: "Alice", grade: 95 }
   * // Result: "Alice earned 95 points"
   *
   * @example
   * // Edge case: Very long comments
   * // Outcome: 600 chars, Personal: 500 chars = 1100 chars
   * // Result: Truncated to exactly 1000 chars
   *
   * @see handlePopulateClick For the button click handler that calls this
   */
  const handlePopulateConfirm = (formType?: 'add' | 'edit') => {
    const targetFormType = formType || populateConfirmation.formType
    const form = targetFormType === 'add' ? addForm : editForm
    const textareaRef = targetFormType === 'add' ? addCommentTextareaRef : editCommentTextareaRef
    // US-RATING-006 & US-RATING-008: Use ordered comments array instead of single comment
    const orderedComments = targetFormType === 'add' ? orderedAddComments : orderedEditComments
    // TASK-1.3 & TASK-1.4: Get the selected pronoun ID
    const pronounId = targetFormType === 'add' ? addPronounId : editPronounId
    // TASK-1.3 & TASK-1.4: Look up the pronoun object by ID
    const selectedPronoun = pronounId ? pronouns.find((p) => p.id === pronounId) : undefined

    // US-PLACEHOLDER-004: Prepare student data for placeholder replacement
    // TASK-1.3 & TASK-1.4: Include pronoun data for placeholder replacement
    const studentData: StudentData = {
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      grade: form.grade !== '' ? Number(form.grade) : undefined,
      pronoun: selectedPronoun?.pronoun,
      possessivePronoun: selectedPronoun?.possessivePronoun,
    }

    // Build the populated comment text
    const parts: string[] = []

    // US-FC-REFACTOR-004: Add outcome comment if available and trim whitespace
    // US-PLACEHOLDER-004: Replace placeholders before adding to parts
    if (form.matchedOutcomeComment) {
      const trimmedOutcome = form.matchedOutcomeComment.trim()
      if (trimmedOutcome) {
        const withPlaceholdersReplaced = replacePlaceholders(trimmedOutcome, studentData)
        parts.push(withPlaceholdersReplaced)
      }
    }

    // US-RATING-006 & US-RATING-008: Add personalized comments in order
    // US-PLACEHOLDER-004: Replace placeholders before adding to parts
    orderedComments.forEach((comment) => {
      const trimmedPersonal = comment.comment.trim()
      if (trimmedPersonal) {
        const withPlaceholdersReplaced = replacePlaceholders(trimmedPersonal, studentData)
        parts.push(withPlaceholdersReplaced)
      }
    })

    // Concatenate with single space separator (per user's choice: Option A)
    let populatedText = parts.join(' ')

    // US-FC-REFACTOR-004: Truncate to 1000 characters if exceeded
    if (populatedText.length > 1000) {
      populatedText = populatedText.substring(0, 1000)
    }

    // Set the comment text
    form.setComment(populatedText)

    // Close confirmation dialog (preserve formType for state consistency)
    setPopulateConfirmation({
      isOpen: false,
      formType: targetFormType,
    })

    // Focus the textarea immediately
    textareaRef.current?.focus()
  }

  /**
   * US-FC-REFACTOR-003: Handle populate cancellation
   *
   * Closes the overwrite confirmation dialog without modifying the final comment textarea.
   * Preserves formType in state for consistency (though modal is closed).
   *
   * User Journey:
   * 1. User clicks "Populate with Above Comments" when textarea has text
   * 2. Confirmation dialog appears: "This will replace your current comment"
   * 3. User clicks "Cancel"
   * 4. Dialog closes, original textarea content remains unchanged
   *
   * @see handlePopulateClick For the flow that triggers the confirmation dialog
   * @see handlePopulateConfirm For the alternative path when user clicks "Replace"
   */
  const handlePopulateCancel = () => {
    // Preserve formType for state consistency
    setPopulateConfirmation({
      isOpen: false,
      formType: populateConfirmation.formType,
    })
  }

  // US-FC-REFACTOR-001: Handle edit start - populate form with existing values
  const handleEditStart = (finalComment: FinalComment) => {
    setEditingId(finalComment.id)
    editForm.setFirstName(finalComment.firstName)
    editForm.setLastName(finalComment.lastName || '')
    editForm.setGrade(finalComment.grade)
    editForm.setComment(finalComment.comment || '')
    // TASK-1.3: Set selected pronoun ID if it exists
    setEditPronounId(finalComment.pronounId || '')
    editForm.clearValidationError()
  }

  // US-FC-REFACTOR-001: Handle edit save using hook
  const handleEditSave = async () => {
    if (editingId === null) return

    const error = editForm.validate()
    if (error) {
      editForm.setValidationError(error)
      return
    }

    editForm.clearValidationError()

    try {
      const request: UpdateFinalCommentRequest = {
        classId: entityData.id,
        firstName: editForm.firstName.trim(),
        grade: Number(editForm.grade),
      }

      // Add optional fields only if provided
      if (editForm.lastName.trim()) {
        request.lastName = editForm.lastName.trim()
      }
      if (editForm.comment.trim()) {
        request.comment = editForm.comment.trim()
      }
      // TASK-1.3: Add pronoun ID if selected
      if (editPronounId) {
        request.pronounId = editPronounId
      }

      await onUpdateComment(editingId, request)

      // Exit edit mode on success
      setEditingId(null)
      editForm.reset()
      setEditPronounId('')
      // US-RATING-006: Clear ordered comments state
      setOrderedEditComments([])
    } catch (err) {
      editForm.setValidationError('Failed to update final comment. Please try again.')
    }
  }

  // US-FC-REFACTOR-001: Handle edit cancel using hook
  const handleEditCancel = () => {
    setEditingId(null)
    editForm.reset()
    setEditPronounId('')
    // US-RATING-006: Clear ordered comments state
    setOrderedEditComments([])
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
                    color: themeColors.text.primary,
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
                      value={addForm.firstName}
                      onChange={(e) => addForm.setFirstName(e.target.value)}
                      placeholder="Enter student first name"
                      disabled={submitting}
                      error={addForm.validationError && !addForm.firstName}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <Input
                      id="last-name-input"
                      label="Last Name"
                      value={addForm.lastName}
                      onChange={(e) => addForm.setLastName(e.target.value)}
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
                  value={addForm.grade}
                  onChange={(e) => {
                    const value = e.target.value
                    addForm.setGrade(value === '' ? '' : Number(value))
                  }}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  disabled={submitting}
                  error={addForm.validationError && addForm.grade === ''}
                />

                {/* TASK-1.3: Pronoun selection dropdown */}
                <PronounSelect
                  value={addPronounId}
                  onChange={setAddPronounId}
                  id="add-pronoun-select"
                  label="Pronoun"
                  disabled={submitting}
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
                      color: themeColors.text.secondary,
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
                      value={addForm.matchedOutcomeComment || (addForm.grade !== '' ? 'No outcome comment for this subject with this grade level.' : '')}
                      readOnly
                      rows={3}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        fontSize: typography.fontSize.base,
                        border: `${borders.width.thin} solid ${themeColors.border.default}`,
                        borderRadius: borders.radius.md,
                        backgroundColor: themeColors.background.secondary,
                        color:
                          !addForm.matchedOutcomeComment
                            ? themeColors.text.disabled
                            : themeColors.text.secondary,
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
                        color: themeColors.semantic.error,
                      }}
                    >
                      Failed to load outcome comment. {outcomeCommentsError}
                    </div>
                  )}
                </div>

                {/* US-RATING-006: Typeahead to select multiple personalized comments */}
                <TypeaheadSearch
                  items={sortPersonalizedCommentsByRating(personalizedComments)}
                  getItemLabel={(comment) => comment.comment}
                  getItemKey={(comment) => comment.id}
                  getItemPrefix={(comment) => getRatingEmoji(getNormalizedRating(comment))}
                  searchQuery={addForm.personalizedCommentSearch}
                  onSearchChange={addForm.setPersonalizedCommentSearch}
                  onSelect={(selectedComment) => {
                    // Add to ordered list (allow duplicates)
                    setOrderedAddComments([...orderedAddComments, selectedComment])
                    // Clear search for next selection
                    addForm.setPersonalizedCommentSearch('')
                  }}
                  label="Personalized Comment (Optional)"
                  placeholder={orderedAddComments.length > 0 ? 'Search personalized comments to add...' : 'Search personalized comments...'}
                  emptyMessage="No personalized comments available for this subject"
                  loading={personalizedCommentsLoading}
                  error={personalizedCommentsError}
                  disabled={submitting}
                />

                {/* US-RATING-006: Show selected comments in order with reorder/remove controls */}
                {orderedAddComments.length > 0 && (
                  <div style={{ marginBottom: spacing.lg }}>
                    <SelectedCommentsList
                      selectedComments={orderedAddComments}
                      onReorder={(fromIndex, toIndex) => handleReorder('add', fromIndex, toIndex)}
                      onRemove={(index) => handleRemove('add', index)}
                    />
                  </div>
                )}

                {/* US-RATING-006 & US-RATING-008: Populate with Above Comments Button */}
                <div style={{ marginBottom: spacing.lg }}>
                  <Button
                    onClick={() => handlePopulateClick('add')}
                    variant="secondary"
                    disabled={
                      // US-RATING-006: Disable if both outcome comment and ordered comments are empty
                      (!addForm.matchedOutcomeComment || !addForm.matchedOutcomeComment.trim()) &&
                      orderedAddComments.length === 0
                    }
                  >
                    Populate with Above Comments
                  </Button>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: spacing.sm,
                    }}
                  >
                    <label
                      htmlFor="comment-input"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: themeColors.text.secondary,
                      }}
                    >
                      Comment
                    </label>
                    <CopyButton text={addForm.comment} disabled={submitting} />
                  </div>
                  <textarea
                    id="comment-input"
                    ref={addCommentTextareaRef}
                    value={addForm.comment}
                    onChange={(e) => addForm.setComment(e.target.value)}
                    onFocus={handleCommentFocus}
                    onBlur={handleCommentBlur}
                    placeholder="Enter optional comment (max 1000 characters)"
                    className="final-comment-textarea"
                    rows={4}
                    maxLength={1000}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      fontSize: typography.fontSize.base,
                      color: themeColors.text.primary,
                      backgroundColor: themeColors.background.primary,
                      border: `${borders.width.thin} solid ${themeColors.border.default}`,
                      borderRadius: borders.radius.md,
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  />
                  <div
                    className="character-counter"
                    style={{
                      marginTop: spacing.sm,
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.tertiary,
                    }}
                  >
                    {addForm.comment.length}/1000 characters
                  </div>
                </div>

                {addForm.validationError && (
                  <ErrorMessage message={addForm.validationError} />
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
                    color: themeColors.text.primary,
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
                          backgroundColor: themeColors.neutral[50],
                          borderRadius: borders.radius.md,
                          border: `${borders.width.thin} dashed ${themeColors.border.default}`,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: typography.fontSize.base,
                            color: themeColors.text.tertiary,
                          }}
                        >
                          No final comments yet for this class.
                        </p>
                        <p
                          style={{
                            margin: `${spacing.sm} 0 0`,
                            fontSize: typography.fontSize.sm,
                            color: themeColors.text.disabled,
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
                              border: `${borders.width.thin} solid ${themeColors.border.default}`,
                              borderRadius: borders.radius.md,
                              backgroundColor: themeColors.background.primary,
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
                                          value={editForm.firstName}
                                          onChange={(e) => editForm.setFirstName(e.target.value)}
                                          placeholder="Enter student first name"
                                          error={editForm.validationError && !editForm.firstName}
                                        />
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <Input
                                          id={`edit-last-name-${comment.id}`}
                                          label="Last Name"
                                          value={editForm.lastName}
                                          onChange={(e) => editForm.setLastName(e.target.value)}
                                          placeholder="Enter student last name (optional)"
                                        />
                                      </div>
                                    </div>

                                    <Input
                                      id={`edit-grade-${comment.id}`}
                                      label="Grade"
                                      type="number"
                                      required
                                      value={editForm.grade}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        editForm.setGrade(value === '' ? '' : Number(value))
                                      }}
                                      placeholder="0-100"
                                      min={0}
                                      max={100}
                                      error={editForm.validationError && editForm.grade === ''}
                                    />

                                    {/* TASK-1.3: Pronoun selection dropdown (Edit Form) */}
                                    <PronounSelect
                                      value={editPronounId}
                                      onChange={setEditPronounId}
                                      id={`edit-pronoun-select-${comment.id}`}
                                      label="Pronoun"
                                      disabled={submitting}
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
                                          color: themeColors.text.secondary,
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
                                          value={editForm.matchedOutcomeComment || (editForm.grade !== '' ? 'No outcome comment for this subject with this grade level.' : '')}
                                          readOnly
                                          rows={3}
                                          style={{
                                            width: '100%',
                                            padding: spacing.md,
                                            fontSize: typography.fontSize.base,
                                            border: `${borders.width.thin} solid ${themeColors.border.default}`,
                                            borderRadius: borders.radius.md,
                                            backgroundColor: themeColors.background.secondary,
                                            color:
                                              !editForm.matchedOutcomeComment
                                                ? themeColors.text.disabled
                                                : themeColors.text.secondary,
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
                                            color: themeColors.semantic.error,
                                          }}
                                        >
                                          Failed to load outcome comment. {outcomeCommentsError}
                                        </div>
                                      )}
                                    </div>

                                    {/* US-RATING-006: Typeahead to select multiple personalized comments (Edit Form) */}
                                    <TypeaheadSearch
                                      items={sortPersonalizedCommentsByRating(personalizedComments)}
                                      getItemLabel={(comment) => comment.comment}
                                      getItemKey={(comment) => comment.id}
                                      getItemPrefix={(comment) => getRatingEmoji(getNormalizedRating(comment))}
                                      searchQuery={editForm.personalizedCommentSearch}
                                      onSearchChange={editForm.setPersonalizedCommentSearch}
                                      onSelect={(selectedComment) => {
                                        // Add to ordered list (allow duplicates)
                                        setOrderedEditComments([...orderedEditComments, selectedComment])
                                        // Clear search for next selection
                                        editForm.setPersonalizedCommentSearch('')
                                      }}
                                      label="Personalized Comment (Optional)"
                                      placeholder={orderedEditComments.length > 0 ? 'Search personalized comments to add...' : 'Search personalized comments...'}
                                      emptyMessage="No personalized comments available for this subject"
                                      loading={personalizedCommentsLoading}
                                      error={personalizedCommentsError}
                                      disabled={submitting}
                                    />

                                    {/* US-RATING-006: Show selected comments in order with reorder/remove controls (Edit Form) */}
                                    {orderedEditComments.length > 0 && (
                                      <div style={{ marginBottom: spacing.lg }}>
                                        <SelectedCommentsList
                                          selectedComments={orderedEditComments}
                                          onReorder={(fromIndex, toIndex) => handleReorder('edit', fromIndex, toIndex)}
                                          onRemove={(index) => handleRemove('edit', index)}
                                        />
                                      </div>
                                    )}

                                    {/* US-RATING-006 & US-RATING-008: Populate with Above Comments Button (Edit Mode) */}
                                    <div style={{ marginBottom: spacing.lg }}>
                                      <Button
                                        onClick={() => handlePopulateClick('edit')}
                                        variant="secondary"
                                        disabled={
                                          // US-RATING-006: Disable if both outcome comment and ordered comments are empty
                                          (!editForm.matchedOutcomeComment || !editForm.matchedOutcomeComment.trim()) &&
                                          orderedEditComments.length === 0
                                        }
                                      >
                                        Populate with Above Comments
                                      </Button>
                                    </div>

                                    <div style={{ marginBottom: spacing.lg }}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          marginBottom: spacing.sm,
                                        }}
                                      >
                                        <label
                                          htmlFor={`edit-comment-${comment.id}`}
                                          style={{
                                            fontSize: typography.fontSize.sm,
                                            fontWeight: typography.fontWeight.medium,
                                            color: themeColors.text.secondary,
                                          }}
                                        >
                                          Comment
                                        </label>
                                        <CopyButton text={editForm.comment} />
                                      </div>
                                      <textarea
                                        id={`edit-comment-${comment.id}`}
                                        ref={editCommentTextareaRef}
                                        value={editForm.comment}
                                        onChange={(e) => editForm.setComment(e.target.value)}
                                        onFocus={handleCommentFocus}
                                        onBlur={handleCommentBlur}
                                        placeholder="Enter optional comment (max 1000 characters)"
                                        className="comment-textarea"
                                        rows={4}
                                        maxLength={1000}
                                        style={{
                                          width: '100%',
                                          padding: spacing.md,
                                          fontSize: typography.fontSize.base,
                                          color: themeColors.text.primary,
                                          backgroundColor: themeColors.background.primary,
                                          border: `${borders.width.thin} solid ${themeColors.border.default}`,
                                          borderRadius: borders.radius.md,
                                          outline: 'none',
                                          resize: 'vertical',
                                          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                                        }}
                                      />
                                      <div
                                        className="character-counter"
                                        style={{
                                          marginTop: spacing.sm,
                                          fontSize: typography.fontSize.sm,
                                          color: themeColors.text.tertiary,
                                        }}
                                      >
                                        {editForm.comment.length}/1000 characters
                                      </div>
                                    </div>

                                    {editForm.validationError && (
                                      <div className="validation-error" role="alert">
                                        {editForm.validationError}
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
                                        alignItems: 'flex-start',
                                        marginBottom: spacing.md,
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <div
                                          style={{
                                            fontSize: typography.fontSize.base,
                                            fontWeight: typography.fontWeight.semibold,
                                            color: themeColors.text.primary,
                                            lineHeight: typography.lineHeight.normal,
                                            marginBottom: spacing.xs,
                                          }}
                                        >
                                          {comment.firstName}
                                          {comment.lastName ? ` ${comment.lastName}` : ''}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: typography.fontSize.xs,
                                            color: themeColors.text.disabled,
                                          }}
                                        >
                                          Created: {formatDate(comment.createdAt)}
                                        </div>
                                      </div>
                                      {/* Copy Button - Positioned on the right below Created label */}
                                      {comment.comment && (
                                        <div style={{ marginLeft: spacing.md }}>
                                          <CopyButton text={comment.comment} />
                                        </div>
                                      )}
                                    </div>

                                    {/* Grade - Secondary info */}
                                    <div
                                      style={{
                                        fontSize: typography.fontSize.sm,
                                        color: themeColors.text.tertiary,
                                        marginBottom: spacing.md,
                                      }}
                                    >
                                      Grade: {comment.grade}
                                    </div>

                                    {/* Pronoun Info - Display selected pronoun (TASK-1.4) */}
                                    <PronounDisplay pronounId={comment.pronounId} pronouns={pronouns} />

                                    {/* Optional Comment Text */}
                                    {comment.comment && (
                                      <div
                                        style={{
                                          fontSize: typography.fontSize.sm,
                                          color: themeColors.text.secondary,
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

        {/* US-FC-REFACTOR-003: Populate Confirmation Modal */}
        <ConfirmationModal
          isOpen={populateConfirmation.isOpen}
          title="Replace Comment?"
          message="This will replace your current comment. Continue?"
          onConfirm={() => handlePopulateConfirm()}
          onCancel={handlePopulateCancel}
          confirmButtonText="Replace"
          cancelButtonText="Cancel"
        />
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

      {/* US-FC-REFACTOR-003: Populate Confirmation Modal */}
      <ConfirmationModal
        isOpen={populateConfirmation.isOpen}
        title="Replace Comment?"
        message="This will replace your current comment. Continue?"
        onConfirm={() => handlePopulateConfirm()}
        onCancel={handlePopulateCancel}
        confirmButtonText="Replace"
        cancelButtonText="Cancel"
      />
    </div>
  )
}
