/**
 * SelectedCommentsList Component Tests
 * Reference: US-RATING-007
 *
 * Testing ordered list with drag-and-drop reordering:
 * - Display selected comments in order with rating emojis
 * - Drag-and-drop handles visible
 * - Remove individual items
 * - Empty state when no selections
 * - Accessibility (ARIA attributes, keyboard navigation)
 */

import { render, screen, fireEvent } from '../../../test-utils'
import { SelectedCommentsList } from '../SelectedCommentsList'
import type { PersonalizedComment } from '../../../types'

describe('SelectedCommentsList', () => {
  const mockComments: PersonalizedComment[] = [
    {
      id: '65a1b2c3d4e5f6g7h8i9j0k1',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Excellent work this semester',
      rating: 5,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '65a1b2c3d4e5f6g7h8i9j0k2',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Good effort on assignments',
      rating: 4,
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z',
    },
    {
      id: '65a1b2c3d4e5f6g7h8i9j0k3',
      subjectId: '65a1b2c3d4e5f6g7h8i9j0k1',
      comment: 'Satisfactory progress',
      rating: 3,
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
    },
  ]

  const mockOnReorder = jest.fn()
  const mockOnRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render all selected comments in order', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.getByText('Good effort on assignments')).toBeInTheDocument()
      expect(screen.getByText('Satisfactory progress')).toBeInTheDocument()
    })

    it('should display rating emojis for each comment', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Rating emojis should be displayed
      expect(screen.getByText('😊')).toBeInTheDocument() // rating 5
      expect(screen.getByText('🙂')).toBeInTheDocument() // rating 4
      expect(screen.getByText('😐')).toBeInTheDocument() // rating 3
    })

    it('should display empty state when no comments selected', () => {
      render(
        <SelectedCommentsList
          selectedComments={[]}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      expect(screen.getByText(/No comments selected/i)).toBeInTheDocument()
    })

    it('should display order numbers for each comment', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Order indicators (1, 2, 3)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should display drag handles for each comment', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Drag handles (⋮⋮) should be present
      const dragHandles = screen.getAllByLabelText(/Drag handle/i)
      expect(dragHandles).toHaveLength(3)
    })

    it('should display label indicating drag-to-reorder functionality', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      expect(screen.getByText(/Selected Comments \(drag to reorder\)/i)).toBeInTheDocument()
    })
  })

  describe('removal', () => {
    it('should show remove button for each comment', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      const removeButtons = screen.getAllByLabelText(/Remove:/i)
      expect(removeButtons).toHaveLength(3)
    })

    it('should call onRemove with index when remove clicked', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      const removeButtons = screen.getAllByLabelText(/Remove:/i)
      fireEvent.click(removeButtons[1]) // Remove second item

      expect(mockOnRemove).toHaveBeenCalledWith(1) // index of second comment
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Should have list role
      const list = screen.getByRole('list', { name: /Selected personalized comments/i })
      expect(list).toBeInTheDocument()

      // Should have listitems
      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(3)
    })

    it('should have accessible button labels', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // All remove buttons should have accessible names
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('should have screen reader announcements for drag operations', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Should have ARIA live regions for announcements
      // Note: @dnd-kit adds its own live region, so we check for multiple
      const liveRegions = screen.getAllByRole('status')
      expect(liveRegions.length).toBeGreaterThanOrEqual(1)

      // At least one should have assertive aria-live
      const assertiveLiveRegions = liveRegions.filter(region =>
        region.getAttribute('aria-live') === 'assertive' &&
        region.getAttribute('aria-atomic') === 'true',
      )
      expect(assertiveLiveRegions.length).toBeGreaterThanOrEqual(1)
    })

    it('should provide keyboard navigation instructions in ARIA labels', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      const items = screen.getAllByRole('listitem')
      // First item should have keyboard instructions
      expect(items[0]).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Press space to lift'),
      )
    })
  })
})
