/**
 * SubjectList Container Component
 * Displays dropdown selector for subjects with single selected subject view
 * Reference: US-REFACTOR-005
 *
 * Key Change: Subject has no year field, so dropdown shows name only
 * API Change: useClasses → useSubjects, classStorageUtils → subjectStorageUtils
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
import { Subject } from '../../types/Subject'
import { getSelectedSubjectId, saveSelectedSubjectId, clearSelectedSubjectId } from '../../utils/subjectStorageUtils'

interface SubjectListProps {
  onSubjectClick?: (subjectId: number) => void
  onAddSubject?: () => void
  onEdit?: (subjectItem: Subject) => void
  onDelete?: (subjectName: string, onConfirm: () => Promise<void>) => void
  onViewOutcomeComments?: (subjectItem: Subject) => void
  onViewPersonalizedComments?: (subjectItem: Subject) => void
  onViewClasses?: (subjectItem: Subject) => void
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
  onDelete,
  onViewOutcomeComments,
  onViewPersonalizedComments,
  onViewClasses,
}) => {
  const { subjects, isLoading, error, clearError, deleteSubject } = useSubjects()

  // Add state for selected subject ID
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)

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

  const handleDelete = useCallback((subjectId: number) => {
    if (onDelete) {
      const subjectItem = subjects.find(s => s.id === subjectId)
      const subjectName = subjectItem ? subjectItem.name : `Subject ${subjectId}`

      // Pass subjectName and a confirmation function that actually deletes
      onDelete(subjectName, async () => {
        await deleteSubject(subjectId)
      })
    }
  }, [subjects, onDelete, deleteSubject])

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
            onDelete={onDelete ? handleDelete : undefined}
            onViewOutcomeComments={onViewOutcomeComments ? handleViewOutcomeComments : undefined}
            onViewPersonalizedComments={onViewPersonalizedComments ? handleViewPersonalizedComments : undefined}
            onViewClasses={onViewClasses ? handleViewClasses : undefined}
          />
            )
          : null
      })()}

      {isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="small" message="Updating..." />
        </div>
      )}
    </div>
  )
}
