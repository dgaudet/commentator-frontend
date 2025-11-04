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
 */
import React, { useCallback, useState, useEffect } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { SubjectListItem } from './SubjectListItem'
import { SubjectEmptyState } from './SubjectEmptyState'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { Subject } from '../../types/Subject'
import { getSelectedSubjectId, saveSelectedSubjectId, clearSelectedSubjectId } from '../../utils/subjectStorageUtils'
import type { OutcomeComment, PersonalizedComment, Class, CreateOutcomeCommentRequest, UpdateOutcomeCommentRequest, CreatePersonalizedCommentRequest, UpdatePersonalizedCommentRequest, CreateClassRequest, UpdateClassRequest } from '../../types'

interface SubjectListProps {
  onSubjectClick?: (subjectId: number) => void
  onAddSubject?: () => void
  onEdit?: (subjectItem: Subject) => void
  onViewOutcomeComments?: (subjectItem: Subject) => void
  onViewPersonalizedComments?: (subjectItem: Subject) => void
  onViewClasses?: (subjectItem: Subject) => void
  // Edit panel props
  onEditSuccess?: (subject: Subject) => void
  onEditCancel?: () => void
  // Outcome Comments panel props
  outcomeComments?: OutcomeComment[]
  onCreateOutcomeComment?: (request: CreateOutcomeCommentRequest) => Promise<void>
  onUpdateOutcomeComment?: (id: number, request: UpdateOutcomeCommentRequest) => Promise<void>
  onDeleteOutcomeComment?: (id: number) => Promise<void>
  outcomeCommentsLoading?: boolean
  outcomeCommentsError?: string | null
  // Personalized Comments panel props
  personalizedComments?: PersonalizedComment[]
  onCreatePersonalizedComment?: (request: CreatePersonalizedCommentRequest) => Promise<void>
  onUpdatePersonalizedComment?: (id: number, request: UpdatePersonalizedCommentRequest) => Promise<void>
  onDeletePersonalizedComment?: (id: number) => Promise<void>
  personalizedCommentsLoading?: boolean
  personalizedCommentsError?: string | null
  // Classes panel props
  classes?: Class[]
  onCreateClass?: (request: CreateClassRequest) => Promise<void>
  onUpdateClass?: (id: number, request: UpdateClassRequest) => Promise<void>
  onDeleteClass?: (id: number) => Promise<void>
  classesLoading?: boolean
  classesError?: string | null
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
  onViewOutcomeComments,
  onViewPersonalizedComments,
  onViewClasses,
  // Edit panel props
  onEditSuccess,
  onEditCancel,
  // Outcome Comments panel props
  outcomeComments,
  onCreateOutcomeComment,
  onUpdateOutcomeComment,
  onDeleteOutcomeComment,
  outcomeCommentsLoading,
  outcomeCommentsError,
  // Personalized Comments panel props
  personalizedComments,
  onCreatePersonalizedComment,
  onUpdatePersonalizedComment,
  onDeletePersonalizedComment,
  personalizedCommentsLoading,
  personalizedCommentsError,
  // Classes panel props
  classes,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  classesLoading,
  classesError,
  onViewFinalComments,
}) => {
  const { subjects, isLoading, error, clearError, deleteSubject } = useSubjects()

  // State for selected subject ID
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)

  // State for delete confirmation modal (US-SUBJ-DELETE-002)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load persisted selection on mount
  // Auto-select if only one subject exists
  useEffect(() => {
    const storedId = getSelectedSubjectId()
    if (storedId !== null && subjects.find(s => s.id === storedId)) {
      // Persisted selection takes precedence
      setSelectedSubjectId(storedId)
    } else if (subjects.length === 1) {
      // Auto-select if only one subject
      setSelectedSubjectId(subjects[0].id)
    }
  }, [subjects]) // Re-run when subjects load/change

  // Save selection to localStorage when it changes
  useEffect(() => {
    if (selectedSubjectId !== null) {
      saveSelectedSubjectId(selectedSubjectId)
    } else {
      clearSelectedSubjectId()
    }
  }, [selectedSubjectId])

  // Memoize event handlers to prevent re-creating functions on every render
  const handleClearError = useCallback(() => {
    clearError()
  }, [clearError])

  // Handler for dropdown selection
  const handleSelectSubject = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(event.target.value, 10)
    setSelectedSubjectId(isNaN(subjectId) ? null : subjectId)
  }, [])

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

  const handleViewOutcomeComments = useCallback((subjectId: number) => {
    const subjectItem = subjects.find(s => s.id === subjectId)
    if (subjectItem && onViewOutcomeComments) {
      onViewOutcomeComments(subjectItem)
    }
  }, [subjects, onViewOutcomeComments])

  const handleViewPersonalizedComments = useCallback((subjectId: number) => {
    const subjectItem = subjects.find(s => s.id === subjectId)
    if (subjectItem && onViewPersonalizedComments) {
      onViewPersonalizedComments(subjectItem)
    }
  }, [subjects, onViewPersonalizedComments])

  const handleViewClasses = useCallback((subjectId: number) => {
    const subjectItem = subjects.find(s => s.id === subjectId)
    if (subjectItem && onViewClasses) {
      onViewClasses(subjectItem)
    }
  }, [subjects, onViewClasses])

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Subjects</h2>
        {onAddSubject && (
          <Button onClick={handleAddSubject} variant="primary">
            Add Subject
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={handleClearError} />
        </div>
      )}

      {/* Dropdown selector */}
      <div className="mb-6">
        <label htmlFor="subject-selector" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Subject
        </label>
        <select
          id="subject-selector"
          value={selectedSubjectId ?? ''}
          onChange={handleSelectSubject}
          disabled={isLoading}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          aria-label="Select a subject to view"
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
            onViewOutcomeComments={onViewOutcomeComments ? handleViewOutcomeComments : undefined}
            onViewPersonalizedComments={onViewPersonalizedComments ? handleViewPersonalizedComments : undefined}
            onViewClasses={onViewClasses ? handleViewClasses : undefined}
            // Edit panel props
            onEditSuccess={onEditSuccess}
            onEditCancel={onEditCancel}
            // Outcome Comments panel props
            outcomeComments={outcomeComments}
            onCreateOutcomeComment={onCreateOutcomeComment}
            onUpdateOutcomeComment={onUpdateOutcomeComment}
            onDeleteOutcomeComment={onDeleteOutcomeComment}
            outcomeCommentsLoading={outcomeCommentsLoading}
            outcomeCommentsError={outcomeCommentsError}
            // Personalized Comments panel props
            personalizedComments={personalizedComments}
            onCreatePersonalizedComment={onCreatePersonalizedComment}
            onUpdatePersonalizedComment={onUpdatePersonalizedComment}
            onDeletePersonalizedComment={onDeletePersonalizedComment}
            personalizedCommentsLoading={personalizedCommentsLoading}
            personalizedCommentsError={personalizedCommentsError}
            // Classes panel props
            classes={classes}
            onCreateClass={onCreateClass}
            onUpdateClass={onUpdateClass}
            onDeleteClass={onDeleteClass}
            classesLoading={classesLoading}
            classesError={classesError}
            onViewFinalComments={onViewFinalComments}
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
