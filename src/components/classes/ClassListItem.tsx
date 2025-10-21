/**
 * ClassListItem Component
 * Displays a single class in the list with formatted dates
 * Reference: TASK-4.3, TASK-6.2, US-CLASS-001, DES-2
 * Performance: Memoized to prevent unnecessary re-renders
 */
import React from 'react'
import { Class } from '../../types/Class'
import { formatDate } from '../../utils/dateFormatter'

interface ClassListItemProps {
  classItem: Class
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onView?: (id: number) => void
}

export const ClassListItem: React.FC<ClassListItemProps> = React.memo(({
  classItem,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
      data-testid={`class-item-${classItem.id}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
            onClick={() => onView?.(classItem.id)}
            role={onView ? 'button' : undefined}
            tabIndex={onView ? 0 : undefined}
            onKeyDown={(e) => {
              if (onView && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onView(classItem.id)
              }
            }}
          >
            {classItem.name}
          </h3>
          <p className="text-gray-600 mb-2">Year: {classItem.year}</p>
          <div className="text-sm text-gray-500">
            <p>Created: {formatDate(classItem.createdAt)}</p>
            <p>Updated: {formatDate(classItem.updatedAt)}</p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(classItem.id)}
                className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${classItem.name}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(classItem.id)}
                className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Delete ${classItem.name}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
