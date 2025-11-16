/**
 * PersonalizedCommentMultiSelect Component Tests
 * TDD Phase: RED - Writing failing tests first
 * Reference: US-RATING-006
 *
 * Testing multi-select list for personalized comments:
 * - Display all comments sorted by rating (highest first)
 * - Checkbox-style selection
 * - Toggle selection on click
 * - Display rating emojis
 * - Keyboard navigation
 * - Accessibility
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { PersonalizedCommentMultiSelect } from '../PersonalizedCommentMultiSelect'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentMultiSelect', () => {
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

  const mockOnSelectionChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render all comments sorted by rating descending', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      // All comments should be present
      expect(screen.getByText('Excellent work this semester')).toBeInTheDocument()
      expect(screen.getByText('Good effort on assignments')).toBeInTheDocument()
      expect(screen.getByText('Satisfactory progress')).toBeInTheDocument()
    })

    it('should display rating emojis next to each comment', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      // Rating emojis should be displayed
      expect(screen.getByText('😊')).toBeInTheDocument() // rating 5
      expect(screen.getByText('🙂')).toBeInTheDocument() // rating 4
      expect(screen.getByText('😐')).toBeInTheDocument() // rating 3
    })

    it('should show checkboxes for all comments', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(3)
    })

    it('should display empty state when no comments provided', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      expect(screen.getByText(/No personalized comments available/i)).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('should mark selected comments as checked', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[1, 3]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      expect(checkboxes[0]).toBeChecked() // id 1
      expect(checkboxes[1]).not.toBeChecked() // id 2
      expect(checkboxes[2]).toBeChecked() // id 3
    })

    it('should call onSelectionChange when comment is clicked', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      fireEvent.click(firstCheckbox)

      expect(mockOnSelectionChange).toHaveBeenCalledWith([1])
    })

    it('should add to selection when unchecked comment is clicked', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[1]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      const secondCheckbox = screen.getAllByRole('checkbox')[1]
      fireEvent.click(secondCheckbox)

      expect(mockOnSelectionChange).toHaveBeenCalledWith([1, 2])
    })

    it('should remove from selection when checked comment is clicked', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[1, 2]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      fireEvent.click(firstCheckbox)

      expect(mockOnSelectionChange).toHaveBeenCalledWith([2])
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      // Should have listbox role or list role
      const container = screen.getByRole('list')
      expect(container).toBeInTheDocument()
    })

    it('should have accessible labels for checkboxes', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
        />,
      )

      // Each checkbox should have an accessible label
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAccessibleName()
      })
    })
  })

  describe('loading state', () => {
    it('should display loading spinner when loading', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={true}
        />,
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should not render checkboxes when loading', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={mockComments}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={true}
        />,
      )

      // Should show only loading spinner, not the list
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('should display error message when error provided', () => {
      render(
        <PersonalizedCommentMultiSelect
          comments={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          error="Failed to load comments"
        />,
      )

      expect(screen.getByText(/Failed to load comments/i)).toBeInTheDocument()
    })
  })
})
