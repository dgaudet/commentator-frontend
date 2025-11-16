/**
 * SelectedCommentsList Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-006
 *
 * Testing ordered list of selected personalized comments:
 * - Display selected comments in order with rating emojis
 * - Reorder items (move up/down with buttons)
 * - Remove individual items
 * - Empty state when no selections
 * - Accessibility (ARIA attributes, keyboard navigation)
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { SelectedCommentsList } from '../SelectedCommentsList'
import type { PersonalizedComment } from '../../../types'

describe('SelectedCommentsList', () => {
  const mockComments: PersonalizedComment[] = [
    {
      id: 1,
      subjectId: 1,
      comment: 'Excellent work this semester',
      rating: 5,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      subjectId: 1,
      comment: 'Good effort on assignments',
      rating: 4,
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z',
    },
    {
      id: 3,
      subjectId: 1,
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
  })

  describe('reordering', () => {
    it('should show move up button for all items except first', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      const upButtons = screen.getAllByLabelText(/Move up/i)
      expect(upButtons).toHaveLength(2) // Items 2 and 3 only
    })

    it('should show move down button for all items except last', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      const downButtons = screen.getAllByLabelText(/Move down/i)
      expect(downButtons).toHaveLength(2) // Items 1 and 2 only
    })

    it('should call onReorder with correct indices when move up clicked', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Click move up on second item (index 1)
      const upButtons = screen.getAllByLabelText(/Move up/i)
      fireEvent.click(upButtons[0])

      expect(mockOnReorder).toHaveBeenCalledWith(1, 0)
    })

    it('should call onReorder with correct indices when move down clicked', () => {
      render(
        <SelectedCommentsList
          selectedComments={mockComments}
          onReorder={mockOnReorder}
          onRemove={mockOnRemove}
        />,
      )

      // Click move down on first item (index 0)
      const downButtons = screen.getAllByLabelText(/Move down/i)
      fireEvent.click(downButtons[0])

      expect(mockOnReorder).toHaveBeenCalledWith(0, 1)
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

      const removeButtons = screen.getAllByLabelText(/Remove/i)
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

      const removeButtons = screen.getAllByLabelText(/Remove/i)
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
      const list = screen.getByRole('list')
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

      // All buttons should have accessible names
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })
  })
})
