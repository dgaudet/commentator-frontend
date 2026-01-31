/**
 * PersonalizedCommentsModal - Duplicate Detection Integration Tests
 * Tests for US-DCP-002: Prevent Duplicate Personalized Comments
 */

import { render, screen, fireEvent, waitFor } from '../../../test-utils'
import { PersonalizedCommentsModal } from '../PersonalizedCommentsModal'
import type { PersonalizedComment } from '../../../types'

describe('PersonalizedCommentsModal - Duplicate Detection (US-DCP-002)', () => {
  const mockSubject = {
    id: 'math-101',
    name: 'Mathematics',
  }

  const mockPersonalizedComments: PersonalizedComment[] = [
    {
      id: '1',
      subjectId: 'math-101',
      comment: 'Shows excellent participation in class',
      rating: 5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      subjectId: 'math-101',
      comment: 'Great improvement this semester',
      rating: 4,
      createdAt: '2024-01-15T10:01:00Z',
      updatedAt: '2024-01-15T10:01:00Z',
    },
  ]

  const defaultProps = {
    isOpen: true,
    entityData: mockSubject,
    personalizedComments: mockPersonalizedComments,
    onCreateComment: jest.fn(),
    onUpdateComment: jest.fn(),
    onDeleteComment: jest.fn(),
    loading: false,
    error: null,
    ownedSubjects: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Duplicate Detection - Main Flow', () => {
    it('should show duplicate modal when attempting to save exact duplicate comment', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      // Enter duplicate comment
      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows excellent participation in class' },
      })

      // Click Save
      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Duplicate modal should appear
      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })

    it('should display existing comment in duplicate modal', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows excellent participation in class' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        // Check for the duplicate modal by looking for its title first
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
        // Then verify the existing comment is displayed within the modal
        const existingCommentDisplay = screen.getByTestId('existing-comment-display')
        expect(existingCommentDisplay.textContent).toContain('Shows excellent participation in class')
      })
    })

    it('should prevent save when duplicate is detected', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Shows excellent participation in class' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      // Verify onCreateComment was NOT called
      expect(defaultProps.onCreateComment).not.toHaveBeenCalled()
    })

    it('should allow save when comment is unique', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Unique comment text' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // No duplicate modal should appear
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      // onCreateComment should be called
      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Modal - User Actions', () => {
    it('should close modal and preserve comment text when Cancel clicked', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      const commentText = 'Shows excellent participation in class'
      fireEvent.change(commentInput, { target: { value: commentText } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      // Click Cancel in duplicate modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Modal should close
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      // Comment text should still be in input
      expect(commentInput).toHaveValue(commentText)
    })

    it('should not clear form when returning from duplicate modal', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      const commentText = 'Shows excellent participation in class'
      fireEvent.change(commentInput, { target: { value: commentText } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      // Verify form field is preserved
      expect(commentInput).toHaveValue(commentText)
    })
  })

  describe('Duplicate Detection - Whitespace Handling', () => {
    it('should detect duplicate when new comment has trailing whitespace', async () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: '  Shows excellent participation in class  ' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })

    it('should not detect duplicate when internal whitespace differs', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      // Note: extra spaces between words
      fireEvent.change(commentInput, {
        target: { value: 'Shows  excellent  participation  in  class' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should NOT show duplicate (internal spaces differ)
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })

    it('should be case-sensitive - different case not flagged as duplicate', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      // Different case
      fireEvent.change(commentInput, {
        target: { value: 'shows excellent participation in class' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should NOT show duplicate (case differs)
      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Detection - Edge Cases', () => {
    it('should handle empty comment list gracefully', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={[]}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Any comment' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      // Should save without showing duplicate modal
      await waitFor(() => {
        expect(onCreateComment).toHaveBeenCalled()
      })
    })

    it('should detect only exact matches, not partial matches', async () => {
      const onCreateComment = jest.fn().mockResolvedValue(undefined)
      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          onCreateComment={onCreateComment}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      // Partial text - should NOT match
      fireEvent.change(commentInput, {
        target: { value: 'Shows excellent participation' },
      })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(
          screen.queryByText(/Duplicate Comment Detected/i),
        ).not.toBeInTheDocument()
      })

      expect(onCreateComment).toHaveBeenCalled()
    })
  })

  describe('Duplicate Detection - Multiline Comments', () => {
    it('should detect duplicate multiline comments', async () => {
      const multilineComment = 'Line 1\nLine 2\nLine 3'
      const mockComments: PersonalizedComment[] = [
        {
          id: '1',
          subjectId: 'math-101',
          comment: multilineComment,
          rating: 5,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      render(
        <PersonalizedCommentsModal
          {...defaultProps}
          personalizedComments={mockComments}
        />,
      )

      const commentInput = screen.getByPlaceholderText(/Enter personalized comment/i)
      fireEvent.change(commentInput, { target: { value: multilineComment } })

      const saveButton = screen.getByRole('button', { name: /Add Comment/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/Duplicate Comment Detected/i)).toBeInTheDocument()
      })
    })
  })
})
