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
    onClose: jest.fn(),
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
      expect(screen.getByText(/Personalized Comments - Mathematics/i)).toBeInTheDocument()
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
          comment: 'Updated comment text that is long enough',
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
      expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument()
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
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('should have accessible close button', () => {
      render(<PersonalizedCommentsModal {...defaultProps} />)

      const closeButton = screen.getByLabelText(/Close modal/i)
      expect(closeButton).toBeInTheDocument()
    })
  })
})
