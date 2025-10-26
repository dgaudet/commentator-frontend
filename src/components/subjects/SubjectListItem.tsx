/**
 * SubjectListItem Component
 * Displays a single subject in the list with formatted dates
 * Reference: US-REFACTOR-006
 *
 * Key Change: Subject has no year field, so year display removed
 * Performance: Memoized to prevent unnecessary re-renders
 */
import React from 'react'
import { Subject } from '../../types/Subject'
import { formatDate } from '../../utils/dateFormatter'

interface SubjectListItemProps {
  subjectItem: Subject
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onView?: (id: number) => void
  onViewOutcomeComments?: (id: number) => void
}

export const SubjectListItem: React.FC<SubjectListItemProps> = React.memo(({
  subjectItem,
  onEdit,
  onDelete,
  onView,
  onViewOutcomeComments,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
      data-testid={`subject-item-${subjectItem.id}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
            onClick={() => onView?.(subjectItem.id)}
            role={onView ? 'button' : undefined}
            tabIndex={onView ? 0 : undefined}
            onKeyDown={(e) => {
              if (onView && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onView(subjectItem.id)
              }
            }}
          >
            {subjectItem.name}
          </h3>
          <div className="text-sm text-gray-500">
            <p>Created: {formatDate(subjectItem.createdAt)}</p>
            <p>Updated: {formatDate(subjectItem.updatedAt)}</p>
          </div>
        </div>

        {(onEdit || onDelete || onViewOutcomeComments) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(subjectItem.id)}
                className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${subjectItem.name}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subjectItem.id)}
                className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Delete ${subjectItem.name}`}
              >
                Delete
              </button>
            )}
            {onViewOutcomeComments && (
              <button
                onClick={() => onViewOutcomeComments(subjectItem.id)}
                className="text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`View outcome comments for ${subjectItem.name}`}
              >
                Outcome Comments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
