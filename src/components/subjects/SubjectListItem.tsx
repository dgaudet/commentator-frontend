/**
 * SubjectListItem Component
 * Displays a single subject in the list with formatted dates
 * Reference: US-REFACTOR-006, US-SUBJ-DELETE-001
 *
 * Key Changes:
 * - Subject has no year field, so year display removed
 * - Delete button relocated beside subject name (US-SUBJ-DELETE-001)
 * - Using Enverus design tokens via CSS modules
 * Performance: Memoized to prevent unnecessary re-renders
 */
import React from 'react'
import { Subject } from '../../types/Subject'
import { formatDate } from '../../utils/dateFormatter'
import styles from './SubjectListItem.module.css'

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
  // Handler for delete button keyboard events
  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDelete?.(subjectItem.id)
    }
  }

  return (
    <div
      className={styles['subject-item']}
      data-testid={`subject-item-${subjectItem.id}`}
    >
      <div className={styles['subject-header']}>
        <div className={styles['subject-content']}>
          {/* Subject name + delete button container (US-SUBJ-DELETE-001) */}
          <div className={styles['name-delete-container']}>
            <h3
              className={styles['subject-name']}
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

            {/* Delete button beside subject name (US-SUBJ-DELETE-001 AC1, AC3) */}
            {onDelete && (
              <button
                onClick={() => onDelete(subjectItem.id)}
                onKeyDown={handleDeleteKeyDown}
                className={styles['button-danger']}
                aria-label={`Delete ${subjectItem.name}`}
                tabIndex={0}
                data-position="beside-name"
              >
                Delete
              </button>
            )}
          </div>

          <div className={styles['subject-dates']}>
            <p>Created: {formatDate(subjectItem.createdAt)}</p>
            <p>Updated: {formatDate(subjectItem.updatedAt)}</p>
          </div>
        </div>

        {/* Action buttons (edit, view comments, etc.) */}
        {(onEdit || onViewOutcomeComments || onViewPersonalizedComments || onViewClasses) && (
          <div className={styles['action-buttons']}>
            {onEdit && (
              <button
                onClick={() => onEdit(subjectItem.id)}
                className={`${styles['button-action']} ${styles.edit}`}
                aria-label={`Edit ${subjectItem.name}`}
              >
                Edit
              </button>
            )}
            {onViewOutcomeComments && (
              <button
                onClick={() => onViewOutcomeComments(subjectItem.id)}
                className={`${styles['button-action']} ${styles['view-outcome']}`}
                aria-label={`View outcome comments for ${subjectItem.name}`}
              >
                Outcome Comments
              </button>
            )}
            {onViewPersonalizedComments && (
              <button
                onClick={() => onViewPersonalizedComments(subjectItem.id)}
                className={`${styles['button-action']} ${styles['view-personalized']}`}
                aria-label={`View personalized comments for ${subjectItem.name}`}
              >
                Personalized Comments
              </button>
            )}
            {onViewClasses && (
              <button
                onClick={() => onViewClasses(subjectItem.id)}
                className={`${styles['button-action']} ${styles['view-classes']}`}
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
