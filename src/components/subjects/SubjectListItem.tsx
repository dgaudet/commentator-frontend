/**
 * SubjectListItem Component
 * Displays a single subject in the list with formatted dates
 * Reference: US-REFACTOR-006, US-SUBJ-DELETE-001, US-TAB-002
 *
 * Key Changes:
 * - Subject has no year field, so year display removed
 * - Delete button relocated beside subject name (US-SUBJ-DELETE-001)
 * - Action buttons replaced with tabbed interface (US-TAB-002)
 * Performance: Memoized to prevent unnecessary re-renders
 */
import React, { useMemo, useCallback } from 'react'
import { Subject } from '../../types/Subject'
import { formatDate } from '../../utils/dateFormatter'
import { Tabs, Tab } from '../common/Tabs'

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
  /**
   * Build tabs array dynamically based on provided callbacks
   * Only includes tabs for callbacks that are provided
   */
  const tabs = useMemo<Tab[]>(() => {
    const tabsList: Tab[] = []

    if (onEdit) {
      tabsList.push({ id: 'edit', label: 'Edit' })
    }
    if (onViewOutcomeComments) {
      tabsList.push({ id: 'outcome', label: 'Outcome Comments' })
    }
    if (onViewPersonalizedComments) {
      tabsList.push({ id: 'personalized', label: 'Personalized Comments' })
    }
    if (onViewClasses) {
      tabsList.push({ id: 'classes', label: 'Manage Classes' })
    }

    return tabsList
  }, [onEdit, onViewOutcomeComments, onViewPersonalizedComments, onViewClasses])

  /**
   * Handle tab selection and route to appropriate callback
   */
  const handleTabChange = useCallback((tabId: string) => {
    switch (tabId) {
      case 'edit':
        onEdit?.(subjectItem.id)
        break
      case 'outcome':
        onViewOutcomeComments?.(subjectItem.id)
        break
      case 'personalized':
        onViewPersonalizedComments?.(subjectItem.id)
        break
      case 'classes':
        onViewClasses?.(subjectItem.id)
        break
    }
  }, [subjectItem.id, onEdit, onViewOutcomeComments, onViewPersonalizedComments, onViewClasses])

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

        {/* Right side: Tabbed interface (US-TAB-002) */}
        {tabs.length > 0 && (
          <div className="ml-4">
            <Tabs tabs={tabs} onChange={handleTabChange} />
          </div>
        )}
      </div>
    </div>
  )
})
