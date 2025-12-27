/**
 * SubjectList Container Component
 * Displays dropdown selector for subjects with single selected subject view
 * Reference: US-REFACTOR-005, US-SUBJ-DELETE-002
 *
 * Key Changes:
 * - Subject has no year field, so dropdown shows name only
 * - API Change: useClasses → useSubjects, classStorageUtils → subjectStorageUtils
 * - Delete confirmation modal integrated (US-SUBJ-DELETE-002)
 *
 * Performance: Uses useCallback for event handlers
 * UI Consistency: Migrated to design tokens (additional enhancement)
 */
import React, { useCallback, useState, useEffect } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { useOutcomeComments } from '../../hooks/useOutcomeComments'
import { usePersonalizedComments } from '../../hooks/usePersonalizedComments'
import { useClasses } from '../../hooks/useClasses'
import { useFinalComments } from '../../hooks/useFinalComments'
import { finalCommentService } from '../../services/api/finalCommentService'
import { SubjectListItem } from './SubjectListItem'
import { SubjectEmptyState } from './SubjectEmptyState'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { Subject } from '../../types/Subject'
import { getSelectedSubjectId, saveSelectedSubjectId, clearSelectedSubjectId } from '../../utils/subjectStorageUtils'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useThemeFocusShadows } from '../../hooks/useThemeFocusShadows'
import type { Class, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest, CreateClassRequest, UpdateClassRequest, CreateFinalCommentRequest, UpdateFinalCommentRequest } from '../../types'

interface SubjectListProps {
  onSubjectClick?: (subjectId: number) => void
  onAddSubject?: () => void
  onEdit?: (subjectItem: Subject) => void
  onEditSuccess?: (subject: Subject) => void
  onEditCancel?: () => void
  onViewFinalComments?: (classData: Class) => void
}

/**
 * Container component for displaying list of subjects
 * Handles loading, error, and empty states
 * User Stories:
 * - US-REFACTOR-005 (Refactor Subject List Component)
 */
export const SubjectList: React.FC<SubjectListProps> = ({
  onSubjectClick,
  onAddSubject,
  onEdit,
  onEditSuccess,
  onEditCancel,
  onViewFinalComments,
}) => {
  const { subjects, isLoading, error, clearError, deleteSubject, fetchSubjects } = useSubjects()
  const themeColors = useThemeColors()
  const focusShadows = useThemeFocusShadows()

  // Hooks for managing tab panel data
  const {
    outcomeComments,
    loading: outcomeCommentsLoading,
    error: outcomeCommentsError,
    loadOutcomeComments,
    createComment: createOutcomeComment,
    updateComment: updateOutcomeComment,
    deleteComment: deleteOutcomeComment,
  } = useOutcomeComments()

  const {
    personalizedComments,
    loading: personalizedCommentsLoading,
    error: personalizedCommentsError,
    loadPersonalizedComments,
    createComment: createPersonalizedComment,
    updateComment: updatePersonalizedComment,
    deleteComment: deletePersonalizedComment,
  } = usePersonalizedComments()

  const {
    classes,
    loading: classesLoading,
    error: classesError,
    loadClasses,
    createClass,
    updateClass,
    deleteClass,
  } = useClasses()

  // US-CLASS-TABS-003: Hook for managing final comments (embedded in class tab)
  const {
    finalComments,
    loading: finalCommentsLoading,
    error: finalCommentsError,
    loadFinalComments,
    createComment: createFinalComment,
    updateComment: updateFinalComment,
    deleteComment: deleteFinalComment,
  } = useFinalComments()

  // State for selected subject ID
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)

  // State for delete confirmation modal (US-SUBJ-DELETE-002)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Track if we've already tried to fetch for a missing subject (US-SUBJECT-CREATE-002)
  const [triedFetchForMissingSubject, setTriedFetchForMissingSubject] = useState(false)

  // Track if we've initialized the selection state (US-SUBJECT-CREATE-002)
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

  // Load persisted selection on mount
  // Auto-select if only one subject exists
  // US-SUBJECT-CREATE-002: Fetch subjects if newly created subject not yet in list
  useEffect(() => {
    const storedId = getSelectedSubjectId()

    // If we have a persisted selection (using != to match both null and undefined)
    if (storedId != null) {
      const subjectExists = subjects.find(s => s.id === storedId)

      if (subjectExists) {
        // Persisted selection exists in list - select it
        setSelectedSubjectId(storedId)
        // Reset the fetch flag since we found the subject
        setTriedFetchForMissingSubject(false)
        setHasInitializedSelection(true)
      } else if (!isLoading && !triedFetchForMissingSubject && subjects.length > 0) {
        // Persisted selection doesn't exist in current list
        // Initial data load is complete and we have subjects but not the one we're looking for
        // Fetch again - might be a newly created subject not yet in the current list
        // NOTE: fetchSubjects is intentionally not in dependencies to avoid infinite loops
        // since fetchSubjects is recreated on every render. We rely on triedFetchForMissingSubject
        // to prevent multiple fetch calls.
        fetchSubjects()
        setTriedFetchForMissingSubject(true)
      }
    } else if (subjects.length === 1) {
      // Auto-select if only one subject
      setSelectedSubjectId(subjects[0].id)
      setHasInitializedSelection(true)
    } else if (!isLoading && subjects.length > 0) {
      // No persisted selection and more than one subject - mark as initialized
      setHasInitializedSelection(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, isLoading])

  // Save selection to localStorage when it changes
  // US-SUBJECT-CREATE-002: Don't clear localStorage until we've initialized selection
  useEffect(() => {
    if (selectedSubjectId !== null) {
      saveSelectedSubjectId(selectedSubjectId)
    } else if (hasInitializedSelection) {
      // Only clear if we've already initialized (prevents clearing on initial mount)
      clearSelectedSubjectId()
    }
  }, [selectedSubjectId, hasInitializedSelection])

  // Memoize event handlers to prevent re-creating functions on every render
  const handleClearError = useCallback(() => {
    clearError()
  }, [clearError])

  // Handler for dropdown selection
  const handleSelectSubject = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = event.target.value
    setSelectedSubjectId(subjectId === '' ? null : subjectId)
  }, [])

  // Focus handlers for select dropdown styling
  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    const focusColor = themeColors.primary.main
    const focusShadowColor = focusShadows.primary

    e.currentTarget.style.borderColor = focusColor
    e.currentTarget.style.boxShadow = `0 0 0 3px ${focusShadowColor}`
  }

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = themeColors.border.default
    e.currentTarget.style.boxShadow = 'none'
  }

  const handleAddSubject = useCallback(() => {
    onAddSubject?.()
  }, [onAddSubject])

  const handleSubjectClick = useCallback((subjectId: number) => {
    onSubjectClick?.(subjectId)
  }, [onSubjectClick])

  const handleEdit = useCallback((subjectId: number) => {
    const subjectItem = subjects.find(s => s.id === subjectId)
    if (subjectItem && onEdit) {
      onEdit(subjectItem)
    }
  }, [subjects, onEdit])

  // US-EDIT-SUBJ-002: Wrap onEditSuccess to trigger data reload
  const handleEditSuccess = useCallback(async (subject: Subject) => {
    // Call parent's onEditSuccess callback if provided
    onEditSuccess?.(subject)

    // Reload subjects to reflect changes in dropdown and heading
    await fetchSubjects()
  }, [onEditSuccess, fetchSubjects])

  // Tab panel data loading handlers
  const handleViewOutcomeComments = useCallback(async (subjectId: number) => {
    await loadOutcomeComments(subjectId)
  }, [loadOutcomeComments])

  const handleViewPersonalizedComments = useCallback(async (subjectId: number) => {
    await loadPersonalizedComments(subjectId)
  }, [loadPersonalizedComments])

  const handleViewClasses = useCallback(async (subjectId: number) => {
    await loadClasses(subjectId)
  }, [loadClasses])

  // CRUD handlers for outcome comments
  const handleCreateOutcomeComment = useCallback(async (request: CreateOutcomeCommentRequest) => {
    await createOutcomeComment(request)
  }, [createOutcomeComment])

  const handleUpdateOutcomeComment = useCallback(async (id: number, request: UpdateOutcomeCommentRequest) => {
    await updateOutcomeComment(id, request)
  }, [updateOutcomeComment])

  const handleDeleteOutcomeComment = useCallback(async (id: number) => {
    await deleteOutcomeComment(id)
  }, [deleteOutcomeComment])

  // CRUD handlers for personalized comments
  const handleCreatePersonalizedComment = useCallback(async (request: CreatePersonalizedCommentRequest) => {
    await createPersonalizedComment(request)
  }, [createPersonalizedComment])

  const handleUpdatePersonalizedComment = useCallback(async (id: number, request: UpdatePersonalizedCommentRequest) => {
    await updatePersonalizedComment(id, request)
  }, [updatePersonalizedComment])

  const handleDeletePersonalizedComment = useCallback(async (id: number) => {
    await deletePersonalizedComment(id)
  }, [deletePersonalizedComment])

  // CRUD handlers for classes
  const handleCreateClass = useCallback(async (request: CreateClassRequest) => {
    await createClass(request)
  }, [createClass])

  const handleUpdateClass = useCallback(async (id: number, request: UpdateClassRequest) => {
    await updateClass(id, request)
  }, [updateClass])

  const handleDeleteClass = useCallback(async (id: number) => {
    await deleteClass(id)
  }, [deleteClass])

  // Check final comments count for cascading delete warning (US-DELETE-CONFIRM-003)
  // Throws error if check fails - handled by ClassManagementModal
  const handleCheckFinalCommentsCount = useCallback(async (classId: number): Promise<number> => {
    const comments = await finalCommentService.getByClassId(classId)
    return comments.length
  }, [])

  // US-CLASS-TABS-003: Handler to load final comments when tab clicked
  const handleViewFinalCommentsTab = useCallback(async (classData: Class) => {
    await loadFinalComments(classData.id)
    // Also call the parent's onViewFinalComments if provided (for backward compatibility)
    onViewFinalComments?.(classData)
  }, [loadFinalComments, onViewFinalComments])

  // US-CLASS-TABS-003: CRUD handlers for final comments
  const handleCreateFinalComment = useCallback(async (request: CreateFinalCommentRequest) => {
    await createFinalComment(request)
  }, [createFinalComment])

  const handleUpdateFinalComment = useCallback(async (id: number, request: UpdateFinalCommentRequest) => {
    await updateFinalComment(id, request)
  }, [updateFinalComment])

  const handleDeleteFinalComment = useCallback(async (id: number) => {
    await deleteFinalComment(id)
  }, [deleteFinalComment])

  // Handle delete button click - show confirmation modal (US-SUBJ-DELETE-002 AC1)
  const handleDelete = useCallback((subjectId: number) => {
    const subjectItem = subjects.find(s => s.id === subjectId)
    if (subjectItem) {
      setSubjectToDelete(subjectItem)
      setDeleteModalOpen(true)
    }
  }, [subjects])

  // Handle delete confirmation (US-SUBJ-DELETE-002 AC4, AC5)
  const handleConfirmDelete = useCallback(async () => {
    if (!subjectToDelete) return

    try {
      setIsDeleting(true)
      await deleteSubject(subjectToDelete.id)

      // Clear selection if deleted subject was selected (US-SUBJ-DELETE-002 AC5)
      if (selectedSubjectId === subjectToDelete.id) {
        setSelectedSubjectId(null)
      }

      // Close modal and reset state
      setDeleteModalOpen(false)
      setSubjectToDelete(null)
    } catch (err) {
      // Error is handled by useSubjects hook
      // Keep modal open so user can retry (US-SUBJ-DELETE-002 AC6)
    } finally {
      setIsDeleting(false)
    }
  }, [subjectToDelete, deleteSubject, selectedSubjectId])

  // Handle delete cancellation (US-SUBJ-DELETE-002 AC3)
  const handleCancelDelete = useCallback(() => {
    setDeleteModalOpen(false)
    setSubjectToDelete(null)
    setIsDeleting(false)
  }, [])

  // Loading state - initial load with no data
  if (isLoading && subjects.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  // Error state - error with no data to show
  if (error && subjects.length === 0) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onDismiss={handleClearError} />
      </div>
    )
  }

  // Empty state - no subjects available
  if (subjects.length === 0) {
    return <SubjectEmptyState onCreateFirst={handleAddSubject} />
  }

  // Success state - render dropdown selector + selected subject
  return (
    <div style={{ padding: spacing['2xl'] }}>
      {/* US-STYLE-002 AC1: Header with button beside title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xl,
          marginBottom: spacing['2xl'],
        }}
      >
        <h2
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: themeColors.text.primary,
            margin: 0,
          }}
        >
          Your Subjects
        </h2>
        {onAddSubject && (
          <Button onClick={handleAddSubject} variant="primary">
            Add Subject
          </Button>
        )}
      </div>

      {error && (
        <div style={{ marginBottom: spacing.lg }}>
          <ErrorMessage message={error} onDismiss={handleClearError} />
        </div>
      )}

      {/* Dropdown selector (US-STYLE-001 AC5, US-STYLE-002 AC2) */}
      <div style={{ marginBottom: spacing['2xl'], maxWidth: '500px' }}>
        <label
          htmlFor="subject-selector"
          style={{
            display: 'block',
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.medium,
            color: themeColors.text.secondary,
            marginBottom: spacing.md,
          }}
        >
          Select a Subject
        </label>
        <select
          id="subject-selector"
          value={selectedSubjectId ?? ''}
          onChange={handleSelectSubject}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          disabled={isLoading}
          aria-label="Select a subject to view"
          style={{
            display: 'block',
            width: '100%',
            padding: spacing.md,
            fontSize: typography.fontSize.base,
            color: themeColors.text.primary,
            border: `${borders.width.thin} solid ${themeColors.border.default}`,
            borderRadius: borders.radius.md,
            backgroundColor: themeColors.background.primary,
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <option value="">
            {isLoading ? 'Loading subjects...' : 'Select a subject...'}
          </option>
          {subjects.map((subjectItem) => (
            <option key={subjectItem.id} value={subjectItem.id}>
              {subjectItem.name}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional single SubjectListItem rendering */}
      {selectedSubjectId && (() => {
        const selectedSubject = subjects.find(s => s.id === selectedSubjectId)
        return selectedSubject
          ? (
          <SubjectListItem
            key={selectedSubject.id}
            subjectItem={selectedSubject}
            onView={handleSubjectClick}
            onEdit={onEdit ? handleEdit : undefined}
            onDelete={handleDelete}
            onViewOutcomeComments={handleViewOutcomeComments}
            onViewPersonalizedComments={handleViewPersonalizedComments}
            onViewClasses={handleViewClasses}
            // Edit panel props
            onEditSuccess={handleEditSuccess}
            onEditCancel={onEditCancel}
            // Outcome Comments panel props
            outcomeComments={outcomeComments}
            onCreateOutcomeComment={handleCreateOutcomeComment}
            onUpdateOutcomeComment={handleUpdateOutcomeComment}
            onDeleteOutcomeComment={handleDeleteOutcomeComment}
            outcomeCommentsLoading={outcomeCommentsLoading}
            outcomeCommentsError={outcomeCommentsError}
            // Personalized Comments panel props
            personalizedComments={personalizedComments}
            onCreatePersonalizedComment={handleCreatePersonalizedComment}
            onUpdatePersonalizedComment={handleUpdatePersonalizedComment}
            onDeletePersonalizedComment={handleDeletePersonalizedComment}
            personalizedCommentsLoading={personalizedCommentsLoading}
            personalizedCommentsError={personalizedCommentsError}
            // Classes panel props
            classes={classes}
            onCreateClass={handleCreateClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            checkFinalCommentsCount={handleCheckFinalCommentsCount}
            classesLoading={classesLoading}
            classesError={classesError}
            onViewFinalComments={handleViewFinalCommentsTab}
            // US-CLASS-TABS-003: Final Comments tab props (embedded)
            finalComments={finalComments}
            onCreateFinalComment={handleCreateFinalComment}
            onUpdateFinalComment={handleUpdateFinalComment}
            onDeleteFinalComment={handleDeleteFinalComment}
            finalCommentsLoading={finalCommentsLoading}
            finalCommentsError={finalCommentsError}
          />
            )
          : null
      })()}

      {isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="small" message="Updating..." />
        </div>
      )}

      {/* Delete Confirmation Modal (US-SUBJ-DELETE-002) */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Subject"
        message={`Are you sure you want to delete '${subjectToDelete?.name}'? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  )
}
