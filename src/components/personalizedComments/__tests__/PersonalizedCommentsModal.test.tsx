/**
 * PersonalizedCommentsModal Component Tests
 * Tests modal rendering, CRUD operations, and validation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal', () => {
  const mockSubject = { id: 1, name: 'Mathematics', createdAt: '', updatedAt: '' }
  const mockComment: PersonalizedComment = {
    id: 1,
    subjectId: 1,
    comment: 'Shows great improvement in problem-solving skills',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  }

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: [],
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <PersonalizedCommentsModal {...defaultProps} isOpen={false} />,
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render modal when isOpen is true', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // US-MODAL-STYLE-001 AC1: Modal title removed, check for panel content instead
      expect(screen.getByText('Add New Personalized Comment')).toBeInTheDocument()
    })

    it('should show loading spinner when loading', () => {
      render(<PersonalizedCommentsModal {...defaultProps} loading={true} />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should show error message when error exists', () => {
      render(<PersonalizedCommentsModal {...defaultProps} error="Failed to load comments" />)
      expect(screen.getByText(/Failed to load comments/i)).toBeInTheDocument()
    })

    it('should show empty state when no comments', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByText(/No personalized comments yet/i)).toBeInTheDocument()
    })

    it('should render comments list', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )
      expect(screen.getByText(mockComment.comment)).toBeInTheDocument()
    })
  })

  describe('create comment', () => {
    it('should show character counter', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      expect(screen.getByText(/0 \/ 500 characters/i)).toBeInTheDocument()
    })

    it('should disable Add button when comment is too short', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should enable Add button when comment is valid', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)
      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      fireEvent.change(textarea, { target: { value: 'This is a valid comment that is long enough' } })
      expect(addButton).not.toBeDisabled()
    })

    it('should call onCreateComment with correct data', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal {...defaultProps} onCreateComment={onCreateComment} />,
      )

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      const addButton = screen.getByRole('button', { name: /Add Comment/i })

      fireEvent.change(textarea, { target: { value: 'This is a valid comment' } })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalledWith({
          subjectId: 1,
          comment: 'This is a valid comment',
          rating: 3, // Default rating
        })
      })
    })
  })

  describe('edit comment', () => {
    it('should enter edit mode when Edit button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should call onUpdateComment with correct data', async () => {
      const onUpdateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
          onUpdateComment={onUpdateComment}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      const textarea = screen.getByDisplayValue(mockComment.comment)
      fireEvent.change(textarea, { target: { value: 'Updated comment text that is long enough' } })

      const saveButton = screen.getByRole('button', { name: /Save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(onUpdateComment).toHaveBeenCalledWith(1, {
          subjectId: 1,
          comment: 'Updated comment text that is long enough',
          rating: 3, // Default rating (mockComment has undefined rating → normalized to 3)
        })
      })
    })

    it('should cancel edit mode when Cancel button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const editButton = screen.getByRole('button', { name: /Edit/i })
      fireEvent.click(editButton)

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument()
    })
  })

  describe('delete comment', () => {
    it('should show confirmation dialog when Delete button clicked', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      expect(screen.getByText(/Delete Personalized Comment/i)).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete this personalized comment/i)).toBeInTheDocument()
    })

    // US-DELETE-CONFIRM-002: Comment preview in confirmation modal
    it('should show comment preview in confirmation modal (AC3)', () => {
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[mockComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show preview of the comment being deleted
      expect(screen.getByText(/"Shows great improvement in problem-solving skills"/)).toBeInTheDocument()
    })

    it('should truncate comment preview to 100 characters with ellipsis (AC3)', () => {
      const longComment = {
        id: 2,
        subjectId: 1,
        comment: 'A'.repeat(150), // 150 character comment
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-03T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[longComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show truncated preview with ellipsis
      const truncatedText = 'A'.repeat(100) + '...'
      expect(screen.getByText(new RegExp(`"${truncatedText}"`))).toBeInTheDocument()
    })

    it('should not truncate comment preview if under 100 characters (AC3)', () => {
      const shortComment = {
        id: 3,
        subjectId: 1,
        comment: 'Short comment text',
        createdAt: '2024-01-04T10:00:00Z',
        updatedAt: '2024-01-04T10:00:00Z',
      }

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[shortComment]}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /Delete/i })
      fireEvent.click(deleteButton)

      // Should show full comment without ellipsis
      expect(screen.getByText(/"Short comment text"/)).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('should show validation error for empty comment', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      // Button should be disabled for empty comment
      expect(addButton).toBeDisabled()
    })

    it('should show validation error for comment too short', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(textarea, { target: { value: 'Short' } })

      const addButton = screen.getByRole('button', { name: /Add Comment/i })
      expect(addButton).toBeDisabled()
    })

    it('should have maxLength attribute set to 500', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Enter personalized comment/i) as HTMLTextAreaElement
      // Verify maxLength attribute is set (browser will enforce this)
      expect(textarea).toHaveAttribute('maxLength', '500')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    // US-MODAL-STYLE-001 AC2: Close button removed when embedded in tab panels
    it('should NOT have close button when embedded', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const closeButton = screen.queryByLabelText(/Close modal/i)
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('sorting - US-RATING-004', () => {
    it('should sort comments by rating descending (highest first)', () => {
      const comments: PersonalizedComment[] = [
        {
          id: 1,
          subjectId: 1,
          comment: 'Comment with rating 3',
          rating: 3,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          subjectId: 1,
          comment: 'Comment with rating 5',
          rating: 5,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: 3,
          subjectId: 1,
          comment: 'Comment with rating 1',
          rating: 1,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      const commentElements = screen.getAllByText(/Comment with rating/)
      // Should be sorted: rating 5, then 3, then 1
      expect(commentElements[0]).toHaveTextContent('Comment with rating 5')
      expect(commentElements[1]).toHaveTextContent('Comment with rating 3')
      expect(commentElements[2]).toHaveTextContent('Comment with rating 1')
    })

    it('should sort alphabetically when ratings are equal', () => {
      const comments: PersonalizedComment[] = [
        {
          id: 1,
          subjectId: 1,
          comment: 'Zebra comment',
          rating: 4,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          subjectId: 1,
          comment: 'Alpha comment',
          rating: 4,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: 3,
          subjectId: 1,
          comment: 'Beta comment',
          rating: 4,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      const commentElements = screen.getAllByText(/comment/)
      // Should be sorted alphabetically: Alpha, Beta, Zebra
      expect(commentElements[0]).toHaveTextContent('Alpha comment')
      expect(commentElements[1]).toHaveTextContent('Beta comment')
      expect(commentElements[2]).toHaveTextContent('Zebra comment')
    })

    it('should handle null/undefined ratings (default to 3)', () => {
      const comments: PersonalizedComment[] = [
        {
          id: 1,
          subjectId: 1,
          comment: 'Comment C-null',
          rating: null,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          subjectId: 1,
          comment: 'Comment A-five',
          rating: 5,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z',
        },
        {
          id: 3,
          subjectId: 1,
          comment: 'Comment B-one',
          rating: 1,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z',
        },
      ]

      const { container } = render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={comments}
        />,
      )

      // Get all comments in the document
      const allText = container.textContent

      // Find positions of each comment text in the full text
      // They should appear in order: rating 5, null (treated as 3), then 1
      const posA = allText?.indexOf('Comment A-five') ?? -1
      const posC = allText?.indexOf('Comment C-null') ?? -1
      const posB = allText?.indexOf('Comment B-one') ?? -1

      // Verify sort order: rating 5 appears before null, null appears before 1
      expect(posA).toBeGreaterThan(-1)
      expect(posC).toBeGreaterThan(-1)
      expect(posB).toBeGreaterThan(-1)
      expect(posA).toBeLessThan(posC) // Rating 5 before null (3)
      expect(posC).toBeLessThan(posB) // Null (3) before rating 1
    })
  })
})
