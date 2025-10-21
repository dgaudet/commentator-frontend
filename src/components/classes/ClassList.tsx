/**
 * ClassList Container Component
 * Displays list of classes with loading, error, and empty states
 * Reference: TASK-4.4, TASK-6.2, US-CLASS-001, DES-1, DES-16
 * Performance: Uses useCallback for event handlers
 */
import React, { useCallback } from 'react'
import { useClasses } from '../../hooks/useClasses'
import { ClassListItem } from './ClassListItem'
import { EmptyState } from './EmptyState'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { Button } from '../common/Button'

interface ClassListProps {
  onClassClick?: (classId: number) => void
  onAddClass?: () => void
}

/**
 * Container component for displaying list of classes
 * Handles loading, error, and empty states
 * User Story: US-CLASS-001 (View List of Classes)
 */
export const ClassList: React.FC<ClassListProps> = ({ onClassClick, onAddClass }) => {
  const { classes, isLoading, error, clearError } = useClasses()

  // Memoize event handlers to prevent re-creating functions on every render
  const handleClearError = useCallback(() => {
    clearError()
  }, [clearError])

  const handleAddClass = useCallback(() => {
    onAddClass?.()
  }, [onAddClass])

  const handleClassClick = useCallback((classId: number) => {
    onClassClick?.(classId)
  }, [onClassClick])

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

  // Success state - render list of classes
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

      <div className="space-y-3">
        {classes.map((classItem) => (
          <ClassListItem
            key={classItem.id}
            classItem={classItem}
            onView={handleClassClick}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="small" message="Updating..." />
        </div>
      )}
    </div>
  )
}
