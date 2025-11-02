/**
 * SubjectListItem Component
 * Displays a single subject in the list with formatted dates
 * Reference: US-REFACTOR-006, US-SUBJ-DELETE-001
 *
 * Key Changes:
 * - Subject has no year field, so year display removed
 * - Delete button relocated beside subject name (US-SUBJ-DELETE-001)
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
  onViewPersonalizedComments?: (id: number) => void
  onViewClasses?: (id: number) => void
}

export const SubjectListItem: React.FC<SubjectListItemProps> = React.memo(({
  subjectItem,
  onEdit,
  onDelete,
  onView,
  onViewOutcomeComments,
  onViewPersonalizedComments,
  onViewClasses,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow bg-white"
      data-testid={`subject-item-${subjectItem.id}`}
    >
      <div className="flex justify-between items-start">
        {/* Left side: Subject name with inline delete button + dates */}
        <div className="flex-1">
          {/* Subject name + delete button on same line */}
          <div className="flex items-center gap-3 mb-2">
            <h3
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
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

            {/* Delete button beside subject name (US-SUBJ-DELETE-001) */}
            {onDelete && (
              <button
                onClick={() => onDelete(subjectItem.id)}
                className="text-red-600 hover:text-red-700 border border-red-600 hover:bg-red-50 font-medium px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                aria-label={`Delete ${subjectItem.name}`}
                data-position="beside-name"
              >
                Delete
              </button>
            )}
          </div>

          {/* Created/Updated dates */}
          <div className="text-sm text-gray-500">
            <p>Created: {formatDate(subjectItem.createdAt)}</p>
            <p>Updated: {formatDate(subjectItem.updatedAt)}</p>
          </div>
        </div>

        {/* Right side: Action buttons */}
        {(onEdit || onViewOutcomeComments || onViewPersonalizedComments || onViewClasses) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(subjectItem.id)}
                className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${subjectItem.name}`}
              >
                Edit
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
            {onViewPersonalizedComments && (
              <button
                onClick={() => onViewPersonalizedComments(subjectItem.id)}
                className="text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={`View personalized comments for ${subjectItem.name}`}
              >
                Personalized Comments
              </button>
            )}
            {onViewClasses && (
              <button
                onClick={() => onViewClasses(subjectItem.id)}
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Manage classes for ${subjectItem.name}`}
              >
                Manage Classes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
