/**
 * ClassList Container Component
 * Displays dropdown selector for classes with single selected class view
 * Reference: TASK-2.1, TASK-2.2, TASK-2.3, US-DROPDOWN-001, US-DROPDOWN-002, DES-1, DES-16
 * Performance: Uses useCallback for event handlers
 */
import React, { useCallback, useState, useEffect } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { ClassListItem } from './ClassListItem'
import { EmptyState } from './EmptyState'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'
import { Class } from '../../types/Class'
import { getSelectedClassId, saveSelectedClassId, clearSelectedClassId } from '../../utils/classStorageUtils'

interface ClassListProps {
  onClassClick?: (classId: number) => void
  onAddClass?: () => void
  onEdit?: (classItem: Class) => void
  onDelete?: (className: string, onConfirm: () => Promise<void>) => void
  onViewOutcomeComments?: (classItem: Class) => void
}

/**
 * Container component for displaying list of classes
 * Handles loading, error, and empty states
 * User Stories:
 * - US-CLASS-001 (View List of Classes)
 * - US-CLASS-003 (Edit Existing Class)
 * - US-CLASS-005 (Delete Class)
 */
export const ClassList: React.FC<ClassListProps> = ({
  onClassClick,
  onAddClass,
  onEdit,
  onDelete,
  onViewOutcomeComments,
}) => {
  const { classes, isLoading, error, clearError, deleteClass } = useClasses()

  // TASK-2.1: Add state for selected class ID
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

  // TASK-2.3: Load persisted selection on mount
  // TASK-3.1: Auto-select if only one class exists
  useEffect(() => {
    const storedId = getSelectedClassId()
    if (storedId !== null && classes.find(c => c.id === storedId)) {
      // Persisted selection takes precedence
      setSelectedClassId(storedId)
    } else if (classes.length === 1) {
      // Auto-select if only one class
      setSelectedClassId(classes[0].id)
    }
  }, [classes]) // Re-run when classes load/change

  // TASK-2.3: Save selection to localStorage when it changes
  useEffect(() => {
    if (selectedClassId !== null) {
      saveSelectedClassId(selectedClassId)
    } else {
      clearSelectedClassId()
    }
  }, [selectedClassId])

  // Memoize event handlers to prevent re-creating functions on every render
  const handleClearError = useCallback(() => {
    clearError()
  }, [clearError])

  // TASK-2.1: Handler for dropdown selection
  const handleSelectClass = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = parseInt(event.target.value, 10)
    setSelectedClassId(isNaN(classId) ? null : classId)
  }, [])

  const handleAddClass = useCallback(() => {
    onAddClass?.()
  }, [onAddClass])

  const handleClassClick = useCallback((classId: number) => {
    onClassClick?.(classId)
  }, [onClassClick])

  const handleEdit = useCallback((classId: number) => {
    const classItem = classes.find(c => c.id === classId)
    if (classItem && onEdit) {
      onEdit(classItem)
    }
  }, [classes, onEdit])

  const handleViewOutcomeComments = useCallback((classId: number) => {
    const classItem = classes.find(c => c.id === classId)
    if (classItem && onViewOutcomeComments) {
      onViewOutcomeComments(classItem)
    }
  }, [classes, onViewOutcomeComments])

  const handleDelete = useCallback((classId: number) => {
    if (onDelete) {
      const classItem = classes.find(c => c.id === classId)
      const className = classItem ? classItem.name : `Class ${classId}`

      // Pass className and a confirmation function that actually deletes
      onDelete(className, async () => {
        await deleteClass(classId)
      })
    }
  }, [classes, onDelete, deleteClass])

  // Loading state - initial load with no data
  if (isLoading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  // Error state - error with no data to show
  if (error && classes.length === 0) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onDismiss={handleClearError} />
      </div>
    )
  }

  // Empty state - no classes available
  if (classes.length === 0) {
    return <EmptyState onCreateFirst={handleAddClass} />
  }

  // Success state - render dropdown selector + selected class
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
        {onAddClass && (
          <Button onClick={handleAddClass} variant="primary">
            Add Class
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={handleClearError} />
        </div>
      )}

      {/* TASK-2.1: Dropdown selector */}
      <div className="mb-6">
        <label htmlFor="class-selector" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Class
        </label>
        <select
          id="class-selector"
          value={selectedClassId ?? ''}
          onChange={handleSelectClass}
          disabled={isLoading}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          aria-label="Select a class to view"
        >
          <option value="">
            {isLoading ? 'Loading classes...' : 'Select a class...'}
          </option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name} - {classItem.year}
            </option>
          ))}
        </select>
      </div>

      {/* TASK-2.2: Conditional single ClassListItem rendering */}
      {selectedClassId && (() => {
        const selectedClass = classes.find(c => c.id === selectedClassId)
        return selectedClass
          ? (
          <ClassListItem
            key={selectedClass.id}
            classItem={selectedClass}
            onView={handleClassClick}
            onEdit={onEdit ? handleEdit : undefined}
            onDelete={onDelete ? handleDelete : undefined}
            onViewOutcomeComments={onViewOutcomeComments ? handleViewOutcomeComments : undefined}
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
