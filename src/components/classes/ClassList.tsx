/**
 * ClassList Container Component
 * Displays list of classes with loading, error, and empty states
 * Reference: TASK-4.4, US-CLASS-001, DES-1, DES-16
 */
import React from 'react'
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
        <ErrorMessage message={error} onDismiss={clearError} />
      </div>
    )
  }

  // Empty state - no classes available
  if (classes.length === 0) {
    return <EmptyState onCreateFirst={onAddClass} />
  }

  // Success state - render list of classes
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
        {onAddClass && (
          <Button onClick={onAddClass} variant="primary">
            Add Class
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={clearError} />
        </div>
      )}

      <div className="space-y-3">
        {classes.map((classItem) => (
          <ClassListItem
            key={classItem.id}
            classItem={classItem}
            onView={onClassClick}
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
