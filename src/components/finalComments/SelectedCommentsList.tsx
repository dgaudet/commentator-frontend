/**
 * SelectedCommentsList Component
 * Ordered list of selected personalized comments with drag-and-drop reordering
 * Reference: US-RATING-007
 *
 * Features:
 * - Display selected comments in order with rating emojis
 * - Drag-and-drop reordering with visual indicators
 * - Keyboard navigation (Alt+Up/Down to reorder)
 * - Remove button for each item
 * - Order numbers (1, 2, 3...)
 * - Empty state when no selections
 * - WCAG 2.1 AA accessible with ARIA announcements
 */

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { spacing, typography, borders } from '../../theme/tokens'
import { useThemeColors } from '../../hooks/useThemeColors'
import { getRatingEmoji, getNormalizedRating } from '../../utils/personalizedCommentRating'
import type { PersonalizedComment } from '../../types'

interface SelectedCommentsListProps {
  /** Array of selected comments in display order */
  selectedComments: PersonalizedComment[]
  /** Callback when item order changes */
  onReorder: (fromIndex: number, toIndex: number) => void
  /** Callback when item is removed (by index to support duplicates) */
  onRemove: (index: number) => void
}

interface SortableItemProps {
  comment: PersonalizedComment
  index: number
  totalCount: number
  onRemove: (index: number) => void
  isDragging?: boolean
}

/**
 * Individual sortable item component
 * Handles drag-and-drop for a single comment
 */
const SortableItem: React.FC<SortableItemProps> = ({
  comment,
  index,
  totalCount,
  onRemove,
  isDragging = false,
}) => {
  const themeColors = useThemeColors()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: `item-${index}` })

  const emoji = getRatingEmoji(getNormalizedRating(comment))

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const itemContent = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: spacing.md,
        borderBottom:
          index < totalCount - 1
            ? `${borders.width.thin} solid ${themeColors.border.default}`
            : 'none',
        backgroundColor: isDragging ? themeColors.background.secondary : themeColors.background.primary,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Drag handle icon */}
      <span
        style={{
          marginRight: spacing.sm,
          color: themeColors.text.disabled,
          fontSize: typography.fontSize.lg,
          cursor: 'grab',
        }}
        aria-label="Drag handle"
      >
        ⋮⋮
      </span>

      {/* Order number */}
      <span
        style={{
          minWidth: '24px',
          fontWeight: typography.fontWeight.semibold,
          fontSize: typography.fontSize.sm,
          color: themeColors.text.secondary,
          marginRight: spacing.sm,
        }}
        aria-label={`Position ${index + 1} of ${totalCount}`}
      >
        {index + 1}
      </span>

      {/* Rating emoji */}
      <span
        style={{
          fontSize: '1.25rem',
          marginRight: spacing.sm,
        }}
      >
        {emoji}
      </span>

      {/* Comment text */}
      <span
        style={{
          flex: 1,
          fontSize: typography.fontSize.sm,
          color: themeColors.text.primary,
        }}
      >
        {comment.comment}
      </span>

      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(index)
        }}
        aria-label={`Remove: ${comment.comment}`}
        style={{
          padding: spacing.xs,
          border: `${borders.width.thin} solid ${themeColors.semantic.error}`,
          borderRadius: borders.radius.sm,
          backgroundColor: themeColors.background.primary,
          color: themeColors.semantic.error,
          cursor: 'pointer',
          fontSize: typography.fontSize.xs,
        }}
      >
        ✕
      </button>
    </div>
  )

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="listitem"
      aria-label={`${comment.comment}, position ${index + 1} of ${totalCount}. Press space to lift, arrow keys to move, space to drop`}
    >
      {itemContent}
    </div>
  )
}

/**
 * Ordered list component for selected personalized comments
 * Displays comments with drag-and-drop reordering
 */
export const SelectedCommentsList: React.FC<SelectedCommentsListProps> = ({
  selectedComments,
  onReorder,
  onRemove,
}) => {
  const themeColors = useThemeColors()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<string>('')

  // Configure sensors for drag interaction
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Empty state
  if (selectedComments.length === 0) {
    return (
      <div
        style={{
          padding: spacing.xl,
          textAlign: 'center' as const,
          backgroundColor: themeColors.neutral[50],
          border: `${borders.width.thin} dashed ${themeColors.border.default}`,
          borderRadius: borders.radius.md,
          color: themeColors.text.tertiary,
        }}
      >
        No comments selected
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    const index = parseInt((event.active.id as string).replace('item-', ''))
    const comment = selectedComments[index]
    setAnnouncement(`Picked up ${comment.comment} from position ${index + 1}`)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt((active.id as string).replace('item-', ''))
      const newIndex = parseInt((over.id as string).replace('item-', ''))

      // Call the onReorder callback
      onReorder(oldIndex, newIndex)

      const comment = selectedComments[oldIndex]
      setAnnouncement(
        `Moved ${comment.comment} from position ${oldIndex + 1} to position ${newIndex + 1}`,
      )
    } else {
      setAnnouncement('Drag cancelled')
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setAnnouncement('Drag cancelled')
  }

  // Generate unique IDs for sortable items (using index)
  const items = selectedComments.map((_, index) => `item-${index}`)

  // Get the actively dragged comment
  const activeIndex = activeId ? parseInt(activeId.replace('item-', '')) : -1
  const activeComment = activeIndex >= 0 ? selectedComments[activeIndex] : null

  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: themeColors.text.secondary,
        }}
      >
        Selected Comments (drag to reorder)
      </label>

      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcement}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div
            role="list"
            aria-label="Selected personalized comments"
            style={{
              border: `${borders.width.thin} solid ${themeColors.border.default}`,
              borderRadius: borders.radius.md,
              backgroundColor: themeColors.background.primary,
            }}
          >
            {selectedComments.map((comment, index) => (
              <SortableItem
                key={`item-${index}`}
                comment={comment}
                index={index}
                totalCount={selectedComments.length}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeComment
            ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: spacing.md,
                    backgroundColor: themeColors.background.primary,
                    border: `2px solid ${themeColors.primary.main}`,
                    borderRadius: borders.radius.md,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    cursor: 'grabbing',
                  }}
                >
                  <span
                    style={{
                      marginRight: spacing.sm,
                      color: themeColors.text.disabled,
                      fontSize: typography.fontSize.lg,
                    }}
                  >
                    ⋮⋮
                  </span>
                  <span
                    style={{
                      minWidth: '24px',
                      fontWeight: typography.fontWeight.semibold,
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.secondary,
                      marginRight: spacing.sm,
                    }}
                  >
                    {activeIndex + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      marginRight: spacing.sm,
                    }}
                  >
                    {getRatingEmoji(getNormalizedRating(activeComment))}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: typography.fontSize.sm,
                      color: themeColors.text.primary,
                    }}
                  >
                    {activeComment.comment}
                  </span>
                </div>
              )
            : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
